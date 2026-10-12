import assert from 'assert';
import fs from 'fs';
import os from 'os';
import path from 'path';

const dbPath = path.join(os.tmpdir(), `tuvi-http-${process.pid}.sqlite`);
process.env.SQLITE_PATH = dbPath;

const sqlite = await import('../src/db/sqlite.js');
const repo = await import('../src/db/repositories.js');
const { createApp } = await import('../src/app.js');
const { calculateTuVi } = await import('../src/engine/tuviRules.mjs');

sqlite.initDatabase();
repo.upsertStar({
    name: 'Tử Vi',
    basic_meaning: 'Sao chủ.',
    palace_meanings: { Mệnh: 'Tại Mệnh.' }
});
repo.upsertPalace({
    palace_name: 'MỆNH',
    short_name: 'Mệnh',
    core_meaning: 'Cung mệnh.'
});
const before = repo.countHoroscopes();

const app = createApp();
const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
});
const base = `http://127.0.0.1:${server.address().port}`;

async function post(pathname, body, extraHeaders = {}) {
    return fetch(`${base}${pathname}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...extraHeaders },
        body
    });
}

try {
    const logs = [];
    const original = console.log;
    console.log = (...args) => logs.push(args.map((item) => String(item)).join(' '));
    const birth = { day: 15, month: 6, year: 1990, hour: 8, gender: 1, unexpected: true };
    const generated = await post('/api/charts/generate', JSON.stringify(birth));
    const chart = await generated.json();
    assert.strictEqual(generated.status, 200);
    assert.ok(chart.tuviInfo?.boxes);
    assert.ok(chart.normalizedChart?.palaces?.length === 12);
    assert.strictEqual(repo.countHoroscopes(), before);

    const logged = logs.join('\n');
    assert.ok(!logged.includes('1990'));
    assert.ok(!logged.includes('hour'));
    console.log = original;

    const analyzed = await post('/api/interpretations/analyze', JSON.stringify(birth));
    const analysis = await analyzed.json();
    assert.strictEqual(analyzed.status, 200);
    assert.strictEqual(analysis.chartSource, 'server');
    assert.strictEqual(analysis.statements.filter((item) => !item.thanOverlay).length, 12);
    assert.ok(analysis.statements.every((item) => item.prose === null));
    assert.strictEqual(repo.countHoroscopes(), before);

    const asked = await post('/api/interpretations/ask', JSON.stringify({ ...birth, questionId: 'why_menh', topic: 'menh' }));
    const answer = await asked.json();
    assert.strictEqual(asked.status, 200);
    assert.strictEqual(answer.prose, null);
    assert.strictEqual(repo.countHoroscopes(), before);

    const forgedAsk = await post('/api/interpretations/ask', JSON.stringify({
        analysis: { ok: true, statements: [{ topic: 'menh', statementId: 'palace:menh', ruleEvidence: [{ ruleId: 'forged' }] }] },
        questionId: 'why_menh'
    }));
    const forgedAskBody = await forgedAsk.json();
    assert.strictEqual(forgedAsk.status, 400);
    assert.strictEqual(forgedAskBody.error, 'client_analysis_rejected');
    assert.ok(!JSON.stringify(forgedAskBody).includes('forged'));

    const forgedChart = await post('/api/interpretations/analyze', JSON.stringify({ normalizedChart: { ok: true, palaces: [] } }));
    assert.strictEqual((await forgedChart.json()).code, 'client_chart_rejected');

    const invalid = await post('/api/charts/generate', JSON.stringify({ day: 'nope', month: 6, year: 1990, hour: 8, gender: 1 }));
    assert.strictEqual(invalid.status, 400);
    const missing = await post('/api/interpretations/analyze', JSON.stringify({}));
    assert.strictEqual(missing.status, 400);

    const badJson = await post('/api/charts/generate', '{');
    const badJsonBody = await badJson.json();
    assert.strictEqual(badJson.status, 400);
    assert.strictEqual(badJsonBody.error, 'JSON không hợp lệ');

    const huge = await post('/api/charts/generate', JSON.stringify({ blob: 'x'.repeat(300 * 1024) }));
    assert.strictEqual(huge.status, 413);
    assert.strictEqual((await huge.json()).error, 'Dữ liệu gửi lên quá lớn');

    const polluted = await post('/api/health', JSON.stringify({ __proto__: { polluted: true } }));
    assert.notStrictEqual(polluted.status, 500);
    assert.strictEqual(Object.prototype.polluted, undefined);

    const chartCalc = calculateTuVi(0, 1, 10, 1, 4, 1);
    const matched = await post('/api/combinations/match', JSON.stringify({
        boxes: chartCalc.boxes,
        menhIndex: chartCalc.menh,
        menhChi: chartCalc.boxes[chartCalc.menh].chiName
    }));
    const matchBody = await matched.json();
    assert.strictEqual(matched.status, 200);
    assert.ok(matchBody.combinations.every((item) => item.verification_status !== 'disabled'));
    assert.ok(matchBody.combinations.every((item) => !String(item.summary).startsWith('Luận giải')));

    const star = await fetch(`${base}/api/meanings/star/${encodeURIComponent('Tử Vi')}?palace=Mệnh`);
    const starBody = await star.json();
    assert.strictEqual(star.status, 200);
    assert.strictEqual(starBody.text, 'Tại Mệnh.');
    const palace = await fetch(`${base}/api/meanings/palace/${encodeURIComponent('Mệnh')}`);
    const palaceBody = await palace.json();
    assert.strictEqual(palace.status, 200);
    assert.strictEqual(palaceBody[0].desc, 'Cung mệnh.');
    const missingStar = await fetch(`${base}/api/meanings/star/${encodeURIComponent('Không Có')}`);
    assert.match((await missingStar.json()).text, /Chưa có dữ liệu/);

    const health = await fetch(`${base}/api/health?year=1990`, { headers: { 'x-request-id': 'req-1' } });
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.headers.get('x-request-id'), 'req-1');

    console.log('http routes reject forged charts and do not store birth data');
} finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    sqlite.closeDatabase();
    for (const suffix of ['', '-wal', '-shm']) fs.rmSync(dbPath + suffix, { force: true });
}
