import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';

const started = Date.now();
for (let index = 0; index < 20; index += 1) {
    calculateTuVi(index % 10, (index % 12) + 1, 10, 1, (index % 12) + 1, index % 2 === 0 ? 1 : -1, false);
}
const chartMs = Date.now() - started;
const analysisStarted = Date.now();
const analysis = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
const analysisMs = Date.now() - analysisStarted;
assert.strictEqual(analysis.status, 200);
assert.ok(chartMs < 5000, `chart loop ${chartMs}ms`);
assert.ok(analysisMs < 5000, `analysis ${analysisMs}ms`);
console.log(`perf smoke chartLoopMs=${chartMs} analysisMs=${analysisMs}`);
