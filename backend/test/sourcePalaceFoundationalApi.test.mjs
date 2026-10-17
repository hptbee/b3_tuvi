import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validAnalysisBody, validMajorResponse, validMinorResponse } from '../../frontend/src/components/structuredAnalysisContract.js';

// Real HTTP serialisation uses accepted frozen source-comparative fixtures;
// privacy, client validation and closed public gates are engineering regressions.
const bundle = JSON.parse(readFileSync(new URL('../../docs/knowledge/research/juan2-palace/foundational-single-star-packet/review-bundle.json', import.meta.url), 'utf8'));
const directory = mkdtempSync(join(tmpdir(), 'tuvi-foundational-api-'));
const previousSqlitePath = process.env.SQLITE_PATH;
process.env.SQLITE_PATH = join(directory, 'test.sqlite');
const privateName = 'PRIVATE-T037-DO-NOT-ECHO';
const logs = [], originalLog = console.log, originalError = console.error;
console.log = (...items) => logs.push(items.join(' '));
console.error = (...items) => logs.push(items.join(' '));
let server, sqlite, requests = 0;
try {
    const { createApp } = await import('../src/app.js');
    sqlite = await import('../src/db/sqlite.js');
    sqlite.initDatabase();
    const changes = () => sqlite.getDb().prepare('SELECT total_changes() AS changes').get().changes;
    const before = changes();
    server = await new Promise((resolve, reject) => {
        const instance = createApp().listen(0, '127.0.0.1', () => resolve(instance));
        instance.once('error', reject);
    });
    const base = `http://127.0.0.1:${server.address().port}/api/interpretations`;
    async function post(body, endpoint = 'analyze', headers = {}) {
        requests++;
        const response = await fetch(`${base}/${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
            body: typeof body === 'string' ? body : JSON.stringify(body)
        });
        assert.match(response.headers.get('cache-control'), /no-store/);
        const serialized = await response.text();
        assert.equal(serialized.includes(privateName), false);
        assert.equal(serialized.includes('internalProse'), false);
        for (const c of bundle.candidates) assert.equal(serialized.includes(c.proposedWording), false);
        return { status: response.status, body: JSON.parse(serialized) };
    }
    let tested = 0;
    for (const candidate of bundle.candidates) {
        for (const fixture of candidate.fixtures) {
            const result = await post({ ...fixture.input, name: privateName });
            assert.equal(result.status, 200, fixture.id);
            const body = result.body;
            assert.equal(validAnalysisBody(body), true, 'actual serialized response passes production client validator');
            assert.equal(validMajorResponse(body, null), true);
            assert.equal(validMinorResponse(body, null), true);
            const statement = body.statements.find(s => !s.thanOverlay && s.functionId === candidate.target);
            assert.equal(statement.claimApplicability.find(g => g.claimId === candidate.claimId).eligible, fixture.expected, fixture.id);
            assert(body.statements.every(s => s.prose === null && s.publicInterpretationReleased === false
                && s.claimApplicability.every(g => g.publicRelease === false)));
            assert(body.wholeChart.topics.every(t => t.prose === null));
            assert.equal(body.time.interpretation, null);
            for (const name of ['tieu_han', 'luu_nien', 'luu_tinh', 'tu_hoa_han']) {
                assert.equal(body.time.capabilities[name].status, 'blocked');
                assert.equal(body.time.capabilities[name].interpretation, null);
            }
            for (const name of ['dai_han_modern', 'tieu_han_modern']) {
                assert.equal(body.time.capabilities[name].publicFortune, false);
                assert.equal(body.time.capabilities[name].interpretation, null);
            }
            tested++;
        }
        const positive = candidate.fixtures.find(f => f.expected);
        const ask = await post({ ...positive.input, name: privateName, questionId: 'why_topic', topic: candidate.target }, 'ask');
        assert.equal(ask.status, 200); assert.equal(ask.body.prose, null);
        const injectedAnalysis = await post({ ...positive.input, analysis: { ok: true }, name: privateName }, 'ask');
        assert.equal(injectedAnalysis.status, 400);
        assert.deepEqual(injectedAnalysis.body, { ok: false, error: 'client_analysis_rejected', prose: null });
    }
    assert.equal(tested, 112);
    const valid = bundle.candidates[0].fixtures[0].input;
    for (const invalid of [{ ...valid, day: 32 }, { ...valid, gender: 0 }, { ...valid, hour: 24 },
        { ...valid, year: '1984.5' }, { ...valid, normalizedChart: { ok: true } }]) {
        assert.equal((await post({ ...invalid, name: privateName })).status, 400);
    }
    assert.equal((await post('{')).status, 400);
    assert.equal((await post({ ...valid, name: 'x'.repeat(270000) })).status, 413);
    assert.equal((await post(valid, 'analyze', { 'content-encoding': 'unsupported' })).status, 415);
    assert.equal(changes(), before, 'analysis and ask perform no database writes');
    assert.equal(logs.some(line => line.includes(privateName) || line.includes('1984') || line.includes('PRIVATE-T037')), false);
} finally {
    if (server) await new Promise(resolve => server.close(resolve));
    if (sqlite?.isDbReady()) sqlite.getDb().close();
    if (previousSqlitePath === undefined) delete process.env.SQLITE_PATH; else process.env.SQLITE_PATH = previousSqlitePath;
    rmSync(directory, { recursive: true, force: true });
    console.log = originalLog; console.error = originalError;
}
console.log(`Foundational HTTP: 112 actual fixture responses, production client validators, withheld prose/AI/fortune, no-store/privacy/no writes and malformed boundaries (${requests} requests)`);
