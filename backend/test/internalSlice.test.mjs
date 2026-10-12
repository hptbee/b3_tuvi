import assert from 'assert';
import { readFileSync } from 'fs';
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

assert.strictEqual(readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8'), rulesBefore);

console.log('internal slice cites the accepted passage and does not open public prose');
