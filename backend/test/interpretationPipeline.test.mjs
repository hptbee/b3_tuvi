import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { CORE_PALACES, PALACE_FUNCTIONS, interpretChart } from '../src/interpretation/pipeline.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';

function chartFrom(can, chi, day, month, hour, gender) {
    const tuviInfo = calculateTuVi(can, chi, day, month, hour, gender, false);
    return normalizeChart({ tuviInfo, lunarInfo: { canIndex: can, chiIndex: chi } });
}

const chart = chartFrom(0, 1, 10, 1, 4, 1);
assert.strictEqual(chart.ok, true);
const first = interpretChart(chart);
const second = interpretChart(chart);
assert.deepStrictEqual(first, second);
assert.strictEqual(first.statements.length, PALACE_FUNCTIONS.length + 1);
assert.deepStrictEqual(first.statements.filter((item) => !item.thanOverlay).map((item) => item.functionId), PALACE_FUNCTIONS);
for (const id of CORE_PALACES) {
    assert.ok(first.statements.some((item) => item.functionId === id && item.topic === id));
}
const than = first.statements.find((item) => item.thanOverlay);
assert.ok(than);
assert.ok(PALACE_FUNCTIONS.includes(than.functionId));
assert.notStrictEqual(than.topic, 'thirteenth_palace');
assert.ok(than.limitations.includes('than_is_overlay_not_a_thirteenth_palace'));
for (const statement of first.statements) {
    assert.strictEqual(statement.prose, null);
    assert.strictEqual(statement.usage, 'structured_analysis');
    assert.notStrictEqual(statement.formationConditions, 'satisfied');
    assert.ok(!statement.ruleEvidence.some((item) => item.formationConditions === 'satisfied'));
}
const matched = first.statements.filter((item) => item.runtimeMatchStatus === 'matched');
for (const statement of matched) {
    assert.strictEqual(statement.formationConditions, 'unknown');
    assert.strictEqual(statement.breakingConditions, 'not_implemented');
}

const eligibleClaim = {
    claimId: 'fixture-eligible-tai',
    approvedForInterpretation: true,
    interpretationStatus: 'sourced',
    formulaComparisonStatus: 'MATCH',
    sourceId: 'thai-thu-lang-tan-bien',
    relatedPalaces: ['tai_bach'],
    schoolId: 'vn-tam-hop-default'
};
chart.schoolId = 'vn-tam-hop-default';
const withClaim = interpretChart(chart, { claims: [eligibleClaim] });
const tai = withClaim.statements.find((item) => item.statementId === 'palace:tai_bach');
assert.strictEqual(tai.availabilityStatus, 'eligible_claims_present');
assert.strictEqual(tai.prose, null);
assert.ok(tai.claimIds.includes('fixture-eligible-tai'));

const left = { ...eligibleClaim, claimId: 'fixture-left', contradicts: ['fixture-right'] };
const right = { ...eligibleClaim, claimId: 'fixture-right', contradicts: ['fixture-left'] };
const conflicted = interpretChart(chart, { claims: [left, right] });
assert.strictEqual(conflicted.statements.find((item) => item.statementId === 'palace:tai_bach').availabilityStatus, 'contradiction');

const mismatch = interpretChart(chart, { claims: [{ ...eligibleClaim, claimId: 'fixture-other-school', schoolId: 'other-school' }] });
const mismatched = mismatch.statements.find((item) => item.statementId === 'palace:tai_bach');
assert.strictEqual(mismatched.availabilityStatus, 'insufficient_evidence');
assert.ok(mismatched.claimApplicability.find((item) => item.claimId === 'fixture-other-school').reasons.includes('school_mismatch'));

assert.strictEqual(interpretChart(null).error, 'malformed_chart');
assert.strictEqual(interpretChart({ ok: false }).error, 'malformed_chart');
const empty = chartFrom(0, 1, 10, 1, 4, 1);
empty.palaces.forEach((palace) => { palace.stars = []; });
const bare = interpretChart(empty);
assert.strictEqual(bare.ok, true);
assert.ok(bare.statements.every((item) => item.stars.length === 0));
assert.strictEqual(claimEligibility({ claimId: 'x' }).eligible, false);

const negative = interpretChart(chart, {
    evidenceContext: {
        formationConditions: 'source_not_satisfied',
        formulaCheckedAgainstEdition: true,
        editionAuthenticated: true
    }
});
const negativeMenh = negative.statements.find((item) => item.runtimeMatchStatus === 'matched');
assert.ok(negativeMenh);
assert.strictEqual(negativeMenh.formationConditions, 'source_not_satisfied');
assert.ok(!negativeMenh.limitations.includes('formation_unknown'));

console.log('interpretation pipeline stays structured when evidence is missing');
