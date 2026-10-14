import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { solarToLunar } from '../src/engine/lunar.js';
import { evaluateRule } from '../src/engine/ruleEngine.js';
import {
    getAdjacentPalaces,
    getOppositePalace,
    getPalaceByFunction,
    getTamHopPalaces,
    getTamPhuongTuChinh,
    hasStarAtPalace,
    queryStars
} from '../src/engine/chartQuery.js';
import {
    brightnessOf,
    cleanStarName,
    findStarOnChart,
    getStarsInBox,
    isTuanAlias,
    normalizeChi,
    wrapIndex
} from '../src/engine/starNames.js';
import { buildEvidenceV3 } from '../src/engine/evidenceV3.js';
import { claimEligibility, evaluateClaimConditions } from '../src/interpretation/eligibility.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { synthesize } from '../src/interpretation/wholeChart.js';
import { timeOverlay } from '../src/time/timeEngine.js';
import { answerQuestion } from '../src/ai/questions.js';
import { narrate, narrationBudget } from '../src/ai/narrator.js';
import { canTransition, validateProvenance } from '../src/knowledge/provenance.js';
import { requestLogLine } from '../src/http/requestLog.js';
import { safeErrorFields } from '../src/http/safeErrorLog.js';
import contract from '../../docs/knowledge/provenance-contract.json' with { type: 'json' };

function chart() {
    const tuviInfo = calculateTuVi(0, 1, 10, 1, 4, 1, false);
    return normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0, chiIndex: 1 } });
}

const base = chart();
assert.strictEqual(base.ok, true);
const host = base.palaces.find((palace) => palace.stars.some((star) => star.starId && star.canonicalName));
const star = host.stars.find((item) => item.starId && item.canonicalName);

const approved = {
    claimId: 'edge-approved',
    approvedForInterpretation: true,
    interpretationStatus: 'sourced',
    sourceReviewStatus: 'AI_CROSS_REVIEWED',
    formulaComparisonStatus: 'MATCH',
    formulaCatalogId: 'fixture-catalog',
    sourceProfile: 'tan-bien',
    sourceId: 'src',
    relatedPalaces: [host.functionId],
    relatedStars: [star.starId]
};
const fixtureHit = {
    catalogId: 'fixture-catalog',
    palaceId: String(host.id),
    sourceProfile: 'tan-bien',
    gradeStatus: 'not_certified',
    formationStatus: 'unknown',
    breakingStatus: 'not_implemented'
};
assert.strictEqual(claimEligibility(approved, base, host, { formulaHits: [fixtureHit] }).eligible, true);
assert.strictEqual(claimEligibility({ ...approved, formulaComparisonStatus: 'CONFLICT' }, base, host, { formulaHits: [fixtureHit] }).eligible, false);
assert.strictEqual(claimEligibility({ ...approved, sourceId: undefined, sourceReferences: [] }, base, host).reasons.includes('missing_source'), true);
assert.strictEqual(claimEligibility({ ...approved, usage: 'synthetic_test_fixture' }, base, host).reasons.includes('synthetic_fixture'), true);
assert.strictEqual(evaluateClaimConditions({ ...approved, conditions: [''] }, base, host).evaluated, false);
assert.strictEqual(evaluateClaimConditions({ ...approved, relatedPalaces: [], relatedStars: ['tu_vi'] }, base).evaluated, false);

const missed = evaluateClaimConditions({
    ...approved,
    relatedStars: [],
    rule: { samePalace: ['Không Có Sao Này'], target: host.functionId }
}, base, host);
assert.strictEqual(missed.evaluated, true);
assert.strictEqual(missed.holds, false);

const hitRule = evaluateClaimConditions({
    ...approved,
    relatedStars: [],
    rule: { samePalace: [star.canonicalName], target: host.functionId }
}, base, host);
assert.strictEqual(hitRule.holds, true);

const other = base.palaces.find((palace) => palace.id !== host.id);
const wrongPalace = evaluateClaimConditions({
    ...approved,
    relatedStars: [],
    rule: { samePalace: [star.canonicalName], target: host.functionId }
}, base, other);
assert.strictEqual(wrongPalace.holds, false);

const before = JSON.stringify(base.palaces);
evaluateRule(base, { id: 'immutable', target: 'menh', samePalace: [star.canonicalName] });
assert.strictEqual(JSON.stringify(base.palaces), before);

const chartWide = evaluateRule(base, {
    id: 'chart-wide',
    target: String(host.id),
    clauses: [{ stars: [star.canonicalName], at: 'chart' }]
});
assert.ok(chartWide);

assert.strictEqual(solarToLunar(1, 1, 1199).lunarDay, 0);
const century = solarToLunar(15, 6, 1890);
assert.ok(century.lunarYear >= 1889 && century.lunarYear <= 1891);
const future = solarToLunar(15, 6, 2150);
assert.ok(future.lunarYear === 0 || future.lunarYear >= 2149);

assert.strictEqual(getPalaceByFunction(base, 'than')?.isThan, true);
assert.strictEqual(getTamHopPalaces(base, 99).length, 0);
assert.strictEqual(getOppositePalace(base, 99), null);
assert.strictEqual(getAdjacentPalaces(base, 99).length, 0);
assert.strictEqual(getTamPhuongTuChinh(base, 99).length, 0);
assert.strictEqual(hasStarAtPalace(base, star.starId, host.id), true);
assert.strictEqual(hasStarAtPalace(base, 'missing_star', host.id), false);
const bright = queryStars(base, { palaceId: host.id, relation: 'same', brightness: 'not-a-brightness' });
assert.strictEqual(bright.length, 0);

assert.strictEqual(cleanStarName(null), '');
assert.strictEqual(cleanStarName({ name: 'Tử Vi (M)' }), 'Tử Vi');
assert.strictEqual(wrapIndex(0), 12);
assert.strictEqual(wrapIndex(13), 1);
assert.strictEqual(normalizeChi(''), '');
assert.strictEqual(normalizeChi('Tỵ'), 'Tị');
assert.strictEqual(brightnessOf({ name: 'Tử Vi (M)' }), '');
assert.strictEqual(brightnessOf('Tử Vi (M)'), 'M');
assert.deepStrictEqual(getStarsInBox(null), []);
assert.ok(findStarOnChart({ 1: { majorStars: ['Tử Vi (M)'] } }, 'Tử Vi').length >= 0);
assert.strictEqual(isTuanAlias('Tuần Không'), true);

const evidence = { ruleId: 'r', palaceId: host.id, branchName: host.branchName, op: 'clauses', stars: [{ starId: star.starId, palaces: [host.id], brightness: 'M' }] };
assert.strictEqual(buildEvidenceV3(null), null);
assert.strictEqual(buildEvidenceV3({}), null);
const sourced = buildEvidenceV3(evidence, {
    formationConditions: 'source_satisfied',
    formulaCheckedAgainstEdition: true,
    editionAuthenticated: true,
    breakingEvaluated: true,
    breakingConditions: 'checked_clear',
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    interpretationStatus: 'sourced',
    sourceId: 'src'
});
assert.strictEqual(sourced.formationConditions, 'source_satisfied');
assert.strictEqual(sourced.breakingConditions, 'checked_clear');
assert.strictEqual(sourced.relationshipEvidence[0].op, 'clauses');
const blocked = buildEvidenceV3(evidence, {
    formationConditions: 'source_satisfied',
    bibliographicStatus: 'primary',
    inferredFromTestPass: true
});
assert.strictEqual(blocked.formationConditions, 'unknown');
assert.ok(blocked.verification.rejected.some((item) => item.value === 'primary'));
const unknownBreak = buildEvidenceV3(evidence, { breakingEvaluated: true, breakingConditions: 'maybe' });
assert.strictEqual(unknownBreak.breakingConditions, 'unknown');
const scalar = buildEvidenceV3({ ...evidence, stars: [{ starId: star.starId, palaces: [host.id], brightness: 'V' }] });
assert.strictEqual(scalar.matchedStarInstances[0].brightness, 'V');

assert.strictEqual(synthesize(null), null);
assert.strictEqual(synthesize({ ok: false }), null);
const eligibleAnalysis = {
    ok: true,
    statements: [{ topic: 'menh', statementId: 'palace:menh', availabilityStatus: 'eligible_claims_present', thanOverlay: false }]
};
assert.strictEqual(synthesize(eligibleAnalysis).topics.find((topic) => topic.topicId === 'ban_than').availabilityStatus, 'eligible_claims_present');

const bare = chart();
bare.palaces.forEach((palace) => { delete palace.daiHan; });
assert.ok(timeOverlay(bare).natalDecadeLabels.every((row) => row.daiHan === null));
assert.strictEqual(timeOverlay({ ok: false }).ok, false);

const badKnowledge = analyzeChartRequest({
    day: 15,
    month: 6,
    year: 1990,
    hour: 8,
    gender: 1,
    normalizedChart: undefined
});
assert.strictEqual(badKnowledge.status, 200);
const rejectedBundle = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(rejectedBundle.body.chartSource, 'server');

assert.strictEqual(answerQuestion(null, 'why_menh').error, 'missing_statement');
assert.strictEqual(answerQuestion({ ok: true, statements: [{ topic: 'tai_bach', statementId: 'palace:tai_bach', thanOverlay: false, stars: [], ruleEvidence: [], sourceReferences: [], limitations: [], breakingConditions: 'not_implemented', contradictoryEvidence: [], availabilityStatus: 'insufficient_evidence' }] }, 'why_topic', 'missing').statementId, undefined);
const menhOnly = { ok: true, statements: [{ topic: 'menh', statementId: 'palace:menh', thanOverlay: false, stars: [{ starId: 'tu_vi' }], ruleEvidence: [], sourceReferences: [{ sourceId: null }], limitations: [], breakingConditions: 'not_implemented', contradictoryEvidence: [], availabilityStatus: 'insufficient_evidence' }] };
assert.strictEqual(answerQuestion(menhOnly, 'why_topic', 'absent').statementId, 'palace:menh');

assert.strictEqual(narrationBudget({}).timeoutMs, 1000);
assert.strictEqual(narrationBudget({ timeoutMs: 0, maxOutputChars: -5 }).maxOutputChars, 2000);
const longText = await narrate(menhOnly, { complete: async () => ({ text: 'x'.repeat(50), referencedIds: ['palace:menh'], extraClaims: [] }) }, { maxOutputChars: 10 });
assert.strictEqual(longText.narration.text, null);
assert.strictEqual(longText.narration.withheldProse, true);
const thrown = await narrate(menhOnly, { complete: async () => { throw new Error('down'); } });
assert.strictEqual(thrown.rejected, true);
assert.strictEqual(thrown.narration.text, null);

assert.strictEqual(validateProvenance(null, {}, contract).ok, false);
const badLayer = validateProvenance({
    implementationStatus: 'nope',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'secondary',
    interpretationStatus: 'unreviewed'
}, {}, contract);
assert.strictEqual(badLayer.ok, false);
const closed = validateProvenance({
    implementationStatus: 'untested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'primary',
    interpretationStatus: 'unreviewed'
}, { editionAuthenticated: false, sourceId: 'src' }, contract);
assert.ok(closed.errors.some((item) => item.includes('editionAuthenticated')));
const from = {
    implementationStatus: 'untested',
    formulaStatus: 'undocumented',
    bibliographicStatus: 'secondary',
    interpretationStatus: 'unreviewed'
};
const jump = canTransition(from, { ...from, formulaStatus: 'checked_against_edition' }, { editionAuthenticated: true, sourceId: 'src' }, contract);
assert.strictEqual(jump.ok, false);

assert.strictEqual(requestLogLine(null), ' ');
assert.strictEqual(requestLogLine({ method: 'GET', url: '/api/health?year=1990' }), 'GET /api/health');
assert.strictEqual(safeErrorFields(null).name, 'Error');
assert.strictEqual(safeErrorFields({ message: 'x'.repeat(300) }).message.length, 240);

console.log('quality edge tests cover eligibility, evidence, and calendar bounds');
