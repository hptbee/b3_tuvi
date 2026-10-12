import assert from 'assert';
import { PALACE_FUNCTIONS } from '../src/interpretation/pipeline.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';

const bad = analyzeChartRequest({});
assert.strictEqual(bad.status, 400);

const result = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(result.status, 200);
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

console.log('twelve-palace analysis returns no score and no stored birth year');
