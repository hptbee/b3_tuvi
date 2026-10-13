import assert from 'assert';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolveStar } from '../src/engine/starCatalog.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { evaluateInternalSlice } from '../src/interpretation/internalSlice.js';

const decision = JSON.parse(readFileSync(
    fileURLToPath(new URL('../../docs/knowledge/decisions/nguyet-lang-thien-mon.json', import.meta.url)),
    'utf8'
));
const rulesBefore = readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8');
const nguyet = resolveStar('Thái Âm').starId;

function chart(overrides = {}) {
    return {
        schoolId: 'vn-tam-hop-default',
        palaces: [{
            functionId: 'menh',
            branchName: 'Hợi',
            isTuan: false,
            isTriet: false,
            stars: [{ starId: nguyet }]
        }],
        ...overrides
    };
}

const structural = {
    ...decision,
    conditions: ['palace_menh_or_quan_loc', 'branch_hoi', 'star_nguyet_toa_thu', 'avoid_tuan', 'avoid_triet']
};
const matched = evaluateInternalSlice(chart(), structural);
assert.strictEqual(matched.availabilityStatus, 'conditional_match');
assert.strictEqual(matched.prose, null);
assert.strictEqual(matched.expertVerified, false);
assert.strictEqual(matched.claimId, decision.subjectId);
assert.strictEqual(matched.sourceId, decision.sourceId);
assert.strictEqual(matched.editionId, decision.editionId);
assert.strictEqual(matched.locator, decision.locator);

const blocked = evaluateInternalSlice(chart({
    palaces: [{ functionId: 'menh', branchName: 'Hợi', isTuan: true, isTriet: false, stars: [{ starId: nguyet }] }]
}), structural);
assert.strictEqual(blocked.availabilityStatus, 'insufficient_evidence');
assert.strictEqual(blocked.prose, null);

const stored = evaluateInternalSlice(chart(), decision);
assert.strictEqual(stored.availabilityStatus, 'not_implemented');
assert.strictEqual(stored.prose, null);
assert.ok(stored.conditionResults.some((item) => item.conditionId === 'avoid_sat' && item.status === 'not_implemented'));

const noEdition = evaluateInternalSlice(chart(), { ...structural, editionId: '' });
assert.strictEqual(noEdition.availabilityStatus, 'insufficient_evidence');
assert.notStrictEqual(noEdition.availabilityStatus, 'conditional_match');

const noConditions = evaluateInternalSlice(chart(), { ...structural, conditions: [] });
assert.strictEqual(noConditions.availabilityStatus, 'insufficient_evidence');
assert.notStrictEqual(noConditions.availabilityStatus, 'conditional_match');

const otherSchool = evaluateInternalSlice(chart({ schoolId: 'trung-chau' }), structural);
assert.strictEqual(otherSchool.availabilityStatus, 'insufficient_evidence');
assert.strictEqual(otherSchool.reason, 'school_mismatch');

const publicClaim = {
    claimId: decision.subjectId,
    sourceId: decision.sourceId,
    editionId: decision.editionId,
    formulaComparisonStatus: decision.formulaComparison,
    schoolId: decision.schoolId,
    conditions: decision.conditions
};
assert.strictEqual(claimEligibility(publicClaim, chart()).eligible, false);
assert.ok(claimEligibility(publicClaim, chart()).reasons.includes('not_approved_for_interpretation'));
assert.ok(claimEligibility(publicClaim, chart()).reasons.includes('interpretation_not_sourced'));

const knowledgeRoot = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const decisionFiles = readdirSync(`${knowledgeRoot}decisions`).filter((name) => name.endsWith('.json'));
assert.ok(decisionFiles.includes('menh-vo-chinh-dieu.json'));
for (const file of decisionFiles) {
    const storedDecision = JSON.parse(readFileSync(`${knowledgeRoot}decisions/${file}`, 'utf8'));
    const slice = evaluateInternalSlice(chart(), storedDecision);
    assert.strictEqual(slice.prose, null, file);
    assert.strictEqual(slice.expertVerified, false, file);
    const asClaim = {
        claimId: storedDecision.subjectId,
        sourceId: storedDecision.sourceId,
        editionId: storedDecision.editionId,
        formulaComparisonStatus: storedDecision.formulaComparison,
        schoolId: storedDecision.schoolId,
        conditions: storedDecision.conditions
    };
    const gate = claimEligibility(asClaim, chart());
    assert.strictEqual(gate.eligible, false, file);
    assert.ok(gate.reasons.includes('not_approved_for_interpretation'), file);
    assert.ok(gate.reasons.includes('interpretation_not_sourced'), file);
}

const matchedDecision = JSON.parse(readFileSync(`${knowledgeRoot}decisions/menh-vo-chinh-dieu.json`, 'utf8'));
assert.strictEqual(matchedDecision.decision, 'AI_ACCEPTED');
assert.strictEqual(matchedDecision.formulaComparison, 'MATCH');
const matchedSlice = evaluateInternalSlice(chart(), matchedDecision);
assert.strictEqual(matchedSlice.availabilityStatus, 'not_implemented');
assert.strictEqual(matchedSlice.prose, null);

const wouldOpen = {
    claimId: 'fixture-gate',
    approvedForInterpretation: true,
    interpretationStatus: 'sourced',
    formulaComparisonStatus: 'MATCH',
    sourceId: matchedDecision.sourceId,
    schoolId: 'vn-tam-hop-default',
    relatedPalaces: ['menh'],
    relatedStars: [nguyet],
    conditions: [`starId=${nguyet}`]
};
assert.ok(claimEligibility({ ...wouldOpen, approvedForInterpretation: false }, chart()).reasons.includes('not_approved_for_interpretation'));
assert.ok(claimEligibility({ ...wouldOpen, interpretationStatus: 'draft' }, chart()).reasons.includes('interpretation_not_sourced'));
assert.ok(claimEligibility({ ...wouldOpen, formulaComparisonStatus: 'PARTIAL' }, chart()).reasons.includes('formula_not_matched'));
assert.strictEqual(claimEligibility({ ...wouldOpen, formulaComparisonStatus: 'CONFLICT' }, chart()).eligible, false);

const pipelineSource = readFileSync(fileURLToPath(new URL('../src/interpretation/pipeline.js', import.meta.url)), 'utf8');
assert.strictEqual(pipelineSource.includes('evaluateInternalSlice'), false);
assert.strictEqual(pipelineSource.includes('internalSlice'), false);

assert.strictEqual(readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8'), rulesBefore);

console.log('internal slice cites the accepted passage and does not open public prose');
