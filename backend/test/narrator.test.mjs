import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { answerQuestion } from '../src/ai/questions.js';
import { narrate } from '../src/ai/narrator.js';
import interpretationRoutes from '../src/routes/interpretationRoutes.js';

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
assert.strictEqual(faithful.evaluation.qualityEvaluated, false);

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

const hostStatement = analysis.statements[0];
const otherStar = analysis.statements.find((item) => item.statementId !== hostStatement.statementId && item.stars?.[0]?.starId);
assert.ok(otherStar);
const misplaced = await narrate(analysis, {
    complete: async () => ({
        text: 'wrong palace',
        referencedIds: [hostStatement.statementId, otherStar.stars[0].starId],
        extraClaims: []
    })
});
assert.strictEqual(misplaced.rejected, true);
assert.strictEqual(misplaced.narration.text, null);
assert.strictEqual(misplaced.narration.source, 'deterministic_fallback');
assert.ok(misplaced.evaluation.ungroundedIds.includes(otherStar.stars[0].starId));
assert.strictEqual(misplaced.evaluation.qualityEvaluated, false);

const source = readFileSync(fileURLToPath(new URL('../src/ai/narrator.js', import.meta.url)), 'utf8');
assert.ok(!source.includes('sk-'));
assert.ok(!source.includes('apiKey'));

const app = express();
app.use(express.json());
app.use('/api/interpretations', interpretationRoutes);
const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
});
try {
    const port = server.address().port;
    const rejected = await fetch(`http://127.0.0.1:${port}/api/interpretations/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            analysis: {
                ok: true,
                statements: [{
                    topic: 'menh',
                    statementId: 'palace:menh',
                    availabilityStatus: 'eligible_claims_present',
                    ruleEvidence: [{ ruleId: 'not-a-real-rule' }],
                    stars: [],
                    sourceReferences: [],
                    contradictoryEvidence: [],
                    limitations: [],
                    breakingConditions: 'checked_clear'
                }]
            },
            day: 15,
            month: 6,
            year: 1990,
            hour: 8,
            gender: 1,
            questionId: 'why_menh'
        })
    });
    const rejectedBody = await rejected.json();
    assert.strictEqual(rejected.status, 400);
    assert.strictEqual(rejectedBody.error, 'client_analysis_rejected');
    assert.strictEqual(rejectedBody.prose, null);
    assert.ok(!JSON.stringify(rejectedBody).includes('not-a-real-rule'));

    const asked = await fetch(`http://127.0.0.1:${port}/api/interpretations/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: 15, month: 6, year: 1990, hour: 8, gender: 1, questionId: 'why_menh', topic: 'menh' })
    });
    const askedBody = await asked.json();
    assert.strictEqual(asked.status, 200);
    assert.strictEqual(askedBody.prose, null);
    assert.strictEqual(askedBody.statementId, 'palace:menh');
    assert.ok(!JSON.stringify(askedBody).includes('not-a-real-rule'));

    const clientChart = await fetch(`http://127.0.0.1:${port}/api/interpretations/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ normalizedChart: { ok: true, palaces: [] } })
    });
    const clientChartBody = await clientChart.json();
    assert.strictEqual(clientChart.status, 400);
    assert.strictEqual(clientChartBody.code, 'client_chart_rejected');
} finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
}

console.log('narrator rejects invented claims and answers from the structured chart');
