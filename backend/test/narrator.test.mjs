import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { answerQuestion } from '../src/ai/questions.js';
import { narrate } from '../src/ai/narrator.js';

const analysis = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 }).body;
for (const questionId of ['why_menh', 'which_stars', 'breaking_checked', 'why_contradiction', 'where_is_source', 'why_no_conclusion']) {
    const answer = answerQuestion(analysis, questionId, 'menh');
    assert.strictEqual(answer.ok, true, questionId);
    assert.strictEqual(answer.prose, null);
}
assert.strictEqual(answerQuestion(analysis, 'unknown').ok, false);
assert.strictEqual(answerQuestion(analysis, 'breaking_checked').breakingConditions, 'not_implemented');

const fallback = await narrate(analysis, null);
assert.strictEqual(fallback.narration.modelCalled, false);
assert.strictEqual(fallback.narration.text, null);
assert.strictEqual(fallback.evaluation.evidenceFidelity, true);

const faithful = await narrate(analysis, {
    complete: async () => ({ text: 'structured', referencedIds: [analysis.statements[0].statementId], extraClaims: [], cost: 0, latencyMs: 1 })
});
assert.strictEqual(faithful.rejected, false);
assert.strictEqual(faithful.narration.source, 'provider');
assert.strictEqual(faithful.narration.text, null);
assert.strictEqual(faithful.narration.withheldProse, true);
assert.strictEqual(faithful.evaluation.modelCalled, true);

const invented = await narrate(analysis, {
    complete: async () => ({ text: 'new claim', referencedIds: ['invented-source'], extraClaims: ['invented-claim'] })
});
assert.strictEqual(invented.rejected, true);
assert.strictEqual(invented.narration.source, 'deterministic_fallback');
assert.ok(invented.evaluation.sourceHallucinations.includes('invented-source'));

const timedOut = await narrate(analysis, {
    complete: () => new Promise(() => {})
}, { timeoutMs: 20 });
assert.strictEqual(timedOut.narration.source, 'deterministic_fallback');

const source = readFileSync(fileURLToPath(new URL('../src/ai/narrator.js', import.meta.url)), 'utf8');
assert.ok(!source.includes('sk-'));
assert.ok(!source.includes('apiKey'));

console.log('narrator rejects invented claims and answers from the structured chart');
