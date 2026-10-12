import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { PALACE_FUNCTIONS } from '../src/interpretation/pipeline.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';

const bad = analyzeChartRequest({});
assert.strictEqual(bad.status, 400);

const result = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(result.status, 200);
assert.strictEqual(result.body.chartSource, 'server');
assert.deepStrictEqual(result.body.palaceFunctions, PALACE_FUNCTIONS);
assert.strictEqual(result.body.palaceCount, 12);
assert.strictEqual(result.body.statements.filter((item) => item.thanOverlay).length, 1);
assert.strictEqual(result.body.wholeChart.score, null);
assert.ok(result.body.wholeChart.topics.some((topic) => topic.topicId === 'suc_khoe' && topic.limitations.includes('not_a_medical_or_life_event_conclusion')));
assert.ok(result.body.statements.every((item) => item.prose === null));
assert.ok(result.body.wholeChart.topics.every((topic) => topic.prose === null));
assert.ok(!JSON.stringify(result.body).includes('1990'));
const again = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.deepStrictEqual(result.body, again.body);

const clientChart = analyzeChartRequest({
    normalizedChart: { ok: true, palaces: [] },
    day: 15,
    month: 6,
    year: 1990,
    hour: 8,
    gender: 1
});
assert.strictEqual(clientChart.status, 400);
assert.strictEqual(clientChart.body.code, 'client_chart_rejected');

assert.strictEqual(hourBranchIndex(23), 1);
assert.strictEqual(hourBranchIndex(0), 1);
assert.strictEqual(hourBranchIndex(8), 5);
const analyzeSource = readFileSync(fileURLToPath(new URL('../src/interpretation/analyze.js', import.meta.url)), 'utf8');
const generateSource = readFileSync(fileURLToPath(new URL('../src/routes/chartRoutes.js', import.meta.url)), 'utf8');
assert.ok(analyzeSource.includes('hourBranchIndex'));
assert.ok(generateSource.includes('hourBranchIndex'));
assert.ok(!analyzeSource.includes('Math.floor((hour + 1) / 2)'));
assert.ok(!generateSource.includes('Math.floor((hour + 1) / 2)'));

console.log('twelve-palace analysis returns no score and no stored birth year');
