import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
    validAnalysisBody, validMajorResponse, validMinorResponse,
    MAJOR_PROFILE, MAJOR_STEM_PROFILE, MAJOR_MUTAGEN_PROFILE, MINOR_PROFILE
} from '../../frontend/src/components/structuredAnalysisContract.js';

// Source-comparative expectations are frozen independently of the HTTP/client code.
// The selected physical B3 metadata and response acceptance remain engineering regressions.
const fixtures = JSON.parse(readFileSync(new URL(
    '../../docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json', import.meta.url
), 'utf8')).cases;
const stems = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const directory = mkdtempSync(join(tmpdir(), 'tuvi-client-contract-'));
const previousSqlitePath = process.env.SQLITE_PATH;
process.env.SQLITE_PATH = join(directory, 'test.sqlite');
const privateName = 'PRIVATE-T033-NEVER-ECHO';
const messages = [], originalLog = console.log, originalError = console.error;
console.log = (...items) => messages.push(items.join(' '));
console.error = (...items) => messages.push(items.join(' '));
let sqlite, server, requests = 0, selectedPeriods = 0, syntheticRejections = 0;
const accepted = (body, major = null, minor = null) => validAnalysisBody(body)
    && validMinorResponse(body, minor) && validMajorResponse(body, major);
try {
    const { createApp } = await import('../src/app.js');
    sqlite = await import('../src/db/sqlite.js');
    const repository = await import('../src/db/repositories.js');
    sqlite.initDatabase();
    const before = repository.countHoroscopes();
    server = await new Promise((resolve, reject) => {
        const instance = createApp().listen(0, '127.0.0.1', () => resolve(instance));
        instance.once('error', reject);
    });
    const endpoint = `http://127.0.0.1:${server.address().port}/api/interpretations/analyze`;
    async function post(input, major = null, minor = null, extra = {}) {
        requests++;
        const response = await fetch(endpoint, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...input, fullName: privateName, ...extra,
                ...(major ? { majorPeriod: major } : {}), ...(minor ? { minorPeriod: minor } : {}) })
        });
        assert.equal(response.status, 200);
        assert.match(response.headers.get('cache-control'), /no-store/);
        const body = await response.json();
        assert.equal(JSON.stringify(body).includes(privateName), false);
        assert.equal(accepted(body, major, minor), true, 'real HTTP response must pass production client validators');
        const cap = body.time.capabilities.dai_han_modern;
        assert.equal(cap.publicFortune, false);
        assert.equal(cap.interpretation, null);
        assert.equal(cap.interpretationStatus, 'blocked');
        return body;
    }

    // One real period per chart, then only the additional witnesses needed to cover
    // all ten stems (and thus every one of the forty approved table cells).
    const selected = fixtures.map(chart => ({ chart, period: chart.periods[0] }));
    for (let stem = 0; stem < 10; stem++) {
        if (!selected.some(({ period }) => period.selectedStemIndex === stem)) {
            const chart = fixtures.find(item => item.periods.some(period => period.selectedStemIndex === stem));
            selected.push({ chart, period: chart.periods.find(period => period.selectedStemIndex === stem) });
        }
    }
    if (!selected.some(({ period }) => new Set(period.expectedAssociations.map(row => row.palaceId)).size < 4)) {
        const chart = fixtures.find(item => item.periods.some(period => new Set(period.expectedAssociations.map(row => row.palaceId)).size < 4));
        selected.push({ chart, period: chart.periods.find(period => new Set(period.expectedAssociations.map(row => row.palaceId)).size < 4) });
    }
    const seenStems = new Set(), seenTargets = new Set(), seenCells = new Set(), suffixes = new Set();
    let shared = 0, baselineBody, baselineOption;
    for (const { chart, period } of selected) {
        const option = { profile: MAJOR_MUTAGEN_PROFILE, nominalAge: period.nominalAge };
        const body = await post(chart.input, option);
        baselineBody ??= body;
        baselineOption ??= option;
        const cap = body.time.capabilities.dai_han_modern;
        assert.equal(cap.heavenlyStem, stems[period.selectedStemIndex]);
        assert.deepEqual(cap.mutagens.map(row => [row.sourceStarId, row.sourceStarName, row.palaceId, row.functionId]),
            period.expectedAssociations.map(row => [row.b3StarId, row.sourceStarName, row.palaceId, row.functionId]));
        seenStems.add(period.selectedStemIndex);
        cap.mutagens.forEach((row, index) => {
            seenCells.add(`${period.selectedStemIndex}:${index}`);
            seenTargets.add(row.sourceStarId);
            const origin = body.statements.find(statement => !statement.thanOverlay && statement.palaceId === row.palaceId);
            const displayName = origin.stars.find(star => star.starId === row.sourceStarId).displayName;
            const suffix = displayName.match(/ \(([MVĐBH])\)$/)?.[1];
            if (suffix) suffixes.add(suffix);
        });
        if (new Set(cap.mutagens.map(row => row.palaceId)).size < 4) shared++;
        selectedPeriods++;
    }
    assert.equal(seenStems.size, 10);
    assert.equal(seenCells.size, 40);
    assert.equal(seenTargets.size, 15);
    assert.ok(shared > 0, 'shared physical palaces retain four separate rows');
    assert.ok(suffixes.size > 0, 'actual API brightness suffixes exercise R3501');

    const chart = fixtures[0], age = chart.periods[0].nominalAge;
    for (const profile of [MAJOR_PROFILE, MAJOR_STEM_PROFILE]) {
        const body = await post(chart.input, { profile, nominalAge: age });
        assert.equal(Object.hasOwn(body.time.capabilities.dai_han_modern, 'mutagens'), false);
    }
    const omitted = await post(chart.input);
    assert.equal(omitted.time.capabilities.dai_han_modern.status, 'not_applied');
    for (const nominalAge of [1, 125]) {
        const body = await post(chart.input, { profile: MAJOR_MUTAGEN_PROFILE, nominalAge });
        const cap = body.time.capabilities.dai_han_modern;
        assert.equal(cap.status, 'not_applied');
        assert.equal(cap.reason, nominalAge === 1 ? 'before_first_period' : 'after_last_period');
        assert.deepEqual(cap.mutagens, []);
        assert.equal(cap.heavenlyStem, null);
    }
    const minor = { profile: MINOR_PROFILE, nominalAge: age };
    const combined = await post(chart.input, baselineOption, minor, { viewYearBranch: 'Tí' });
    assert.deepEqual(combined.time.capabilities.dai_han_modern, baselineBody.time.capabilities.dai_han_modern);
    assert.equal(combined.time.capabilities.tieu_han_modern.palaceMapping, 'mapped');
    assert.equal(combined.time.capabilities.thien_duc.palaceMapping, 'mapped');

    // Explicitly synthetic response forgeries, not reachable natal negative charts.
    const mutations = [
        ['public fortune', (body, cap) => { cap.publicFortune = true; }],
        ['public interpretation', (body, cap) => { cap.interpretation = 'unapproved prose'; }],
        ['interpretation gate', (body, cap) => { cap.interpretationStatus = 'approved'; }],
        ['source pin', (body, cap) => { cap.sourcePin = 'forged'; }],
        ['stem', (body, cap) => { cap.heavenlyStem = 'unknown'; }],
        ['row name', (body, cap) => { cap.mutagens[0].sourceStarName = 'Unknown'; }],
        ['row ID', (body, cap) => { cap.mutagens[0].sourceStarId = 'unknown'; }],
        ['row keys', (body, cap) => { cap.mutagens[0].unexpected = true; }],
        ['row missing', (body, cap) => { cap.mutagens.pop(); }],
        ['row duplicate', (body, cap) => { cap.mutagens[1] = structuredClone(cap.mutagens[0]); }],
        ['row order', (body, cap) => { cap.mutagens.reverse(); }],
        ['wrong physical palace', (body, cap) => { cap.mutagens[0].palaceId = '13'; }],
        ['malformed statements', body => { body.statements = null; }],
        ['malformed star', body => { body.statements[0].stars = 'bad'; }],
        ['unknown display suffix', (body, cap) => {
            const row = cap.mutagens[0];
            const origin = body.statements.find(statement => !statement.thanOverlay && statement.palaceId === row.palaceId);
            origin.stars.find(star => star.starId === row.sourceStarId).displayName = `${row.sourceStarName} (X)`;
        }],
        ['duplicate physical star with suffix', (body, cap) => {
            const row = cap.mutagens[0];
            const destination = body.statements.find(statement => !statement.thanOverlay && statement.palaceId !== row.palaceId);
            destination.stars.push({ starId: row.sourceStarId, displayName: `${row.sourceStarName} (V)` });
        }]
    ];
    for (const [label, mutate] of mutations) {
        const body = structuredClone(baselineBody);
        mutate(body, body.time.capabilities.dai_han_modern);
        assert.equal(accepted(body, baselineOption), false, label);
        syntheticRejections++;
    }
    assert.equal(repository.countHoroscopes(), before);
    assert.equal(messages.some(message => message.includes(privateName) || message.includes('nominalAge')), false);
    originalLog(`production client HTTP contract: ${requests} requests, ${selectedPeriods} selected periods/24 charts, ${seenCells.size} cells/${seenTargets.size} targets, ${shared} shared-palace witnesses, actual suffixes ${[...suffixes].sort().join(',')}, ${syntheticRejections} synthetic rejections; no-store/privacy/no persistence`);
} finally {
    try {
        if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    } finally {
        try { if (sqlite?.isDbReady()) sqlite.getDb().close(); }
        finally {
            console.log = originalLog;
            console.error = originalError;
            if (previousSqlitePath === undefined) delete process.env.SQLITE_PATH;
            else process.env.SQLITE_PATH = previousSqlitePath;
            rmSync(directory, { recursive: true, force: true });
        }
    }
}
