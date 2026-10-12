import assert from 'assert';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { evaluateRule } from '../src/engine/ruleEngine.js';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import { buildEvidenceV3 } from '../src/engine/evidenceV3.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };

function menhChart() {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = { chiName: 'Dần', cungName: i === 3 ? 'MỆNH' : 'PHÚC ĐỨC', majorStars: [], goodStars: [], badStars: [] };
    }
    boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    return normalizeChart({ tuviInfo: { boxes, menh: 3, than: null }, input: { schoolId: 'vn-tam-hop-default' } });
}

const chart = menhChart();
const hit = evaluateRule(chart, {
    id: 'tu_phu_dong_cung',
    target: 'menh',
    samePalace: ['Tử Vi', 'Thiên Phủ']
});
assert.ok(hit);
assert.deepStrictEqual(Object.keys(hit).sort(), ['evidence', 'rows', 'ruleId']);

const dto = buildEvidenceV3(hit.evidence);
assert.strictEqual(dto.version, 3);
assert.strictEqual(dto.runtimeMatchStatus, 'matched');
assert.strictEqual(dto.patternDetected, true);
assert.strictEqual(dto.formationConditions, 'unknown');
assert.strictEqual(dto.breakingConditions, 'not_implemented');
assert.strictEqual(dto.formulaReview, 'not_checked');
assert.strictEqual(dto.ruleId, 'tu_phu_dong_cung');
assert.strictEqual(dto.targetPalace.palaceId, hit.evidence.palaceId);
assert.deepStrictEqual(dto.matchedStars, ['tu_vi', 'thien_phu']);
assert.strictEqual(dto.matchedStarInstances.length, 2);
assert.ok(dto.brightnessEvidence.length >= 1);
assert.deepStrictEqual(dto.relationshipEvidence, []);
assert.deepStrictEqual(dto.satisfiedConditions, [{ op: 'same_palace', status: 'runtime_matched' }]);
assert.deepStrictEqual(dto.unresolvedConditions, []);
assert.deepStrictEqual(dto.sourceClaimReferences, []);
assert.strictEqual(dto.verification.formulaStatus, null);
assert.strictEqual(dto.verification.bibliographicStatus, null);
assert.strictEqual(dto.verification.interpretationStatus, null);
assert.strictEqual(dto.verification.availability, 'not_recorded');

const claimed = buildEvidenceV3(hit.evidence, {
    formationConditions: 'source_satisfied',
    breakingConditions: 'checked_clear',
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    interpretationStatus: 'sourced',
    editionAuthenticated: true,
    authenticationScope: 'digital_file_accepted_as_working_text',
    formulaCheckedAgainstEdition: true,
    sourceId: 'thai-thu-lang-tan-bien',
    sourceClaimReferences: [{ claimId: 'claim-phu-tuong-trieu-vien', sourceId: 'thai-thu-lang-tan-bien' }]
});
assert.strictEqual(claimed.runtimeMatchStatus, 'matched');
assert.strictEqual(claimed.formationConditions, 'unknown');
assert.strictEqual(claimed.breakingConditions, 'not_implemented');
assert.strictEqual(claimed.formulaReview, 'not_checked');
assert.strictEqual(claimed.verification.formulaStatus, null);
assert.strictEqual(claimed.verification.bibliographicStatus, null);
assert.ok(claimed.verification.rejected.some((item) => item.value === 'primary'));
assert.ok(claimed.verification.rejected.some((item) => item.value === 'checked_against_edition'));

const omittedScope = buildEvidenceV3(hit.evidence, {
    formationConditions: 'source_satisfied',
    formulaStatus: 'checked_against_edition',
    bibliographicStatus: 'primary',
    editionAuthenticated: true,
    formulaCheckedAgainstEdition: true
});
assert.strictEqual(omittedScope.formationConditions, 'unknown');
assert.strictEqual(omittedScope.formulaReview, 'not_checked');
assert.strictEqual(omittedScope.verification.formulaStatus, null);
assert.strictEqual(omittedScope.verification.bibliographicStatus, null);

const notImplemented = buildEvidenceV3(hit.evidence, { formationConditions: 'not_implemented' });
assert.strictEqual(notImplemented.formationConditions, 'unknown');
assert.strictEqual(notImplemented.breakingConditions, 'not_implemented');

const fakeStatus = buildEvidenceV3(hit.evidence, { bibliographicStatus: 'unverified' });
assert.strictEqual(fakeStatus.verification.bibliographicStatus, null);
assert.deepStrictEqual(fakeStatus.verification.rejected, [{ layer: 'bibliographicStatus', value: 'unverified' }]);

const recorded = buildEvidenceV3(hit.evidence, {
    formulaStatus: 'undocumented',
    bibliographicStatus: 'conflicting_secondary',
    interpretationStatus: 'unreviewed'
});
assert.strictEqual(recorded.verification.availability, 'recorded');
assert.strictEqual(recorded.verification.formulaStatus, 'undocumented');
assert.strictEqual(recorded.verification.bibliographicStatus, 'conflicting_secondary');
assert.strictEqual(recorded.formationConditions, 'unknown');

const linked = buildEvidenceV3({
    ruleId: 'linked_rule',
    palaceId: '3',
    branchName: 'Dần',
    op: 'clauses',
    schoolId: null,
    stars: [{ starId: 'tu_vi', palaces: [9] }]
}, {
    sourceClaimReferences: [{ claimId: 'claim-phu-tuong-trieu-vien', sourceId: 'thai-thu-lang-tan-bien' }]
});
assert.deepStrictEqual(linked.relationshipEvidence, [{ op: 'clauses', starIds: ['tu_vi'] }]);
assert.strictEqual(linked.breakingConditions, 'not_implemented');
assert.strictEqual(linked.sourceClaimReferences[0].claimId, 'claim-phu-tuong-trieu-vien');
assert.strictEqual(linked.verification.formulaStatus, null);
assert.strictEqual(linked.formationConditions, 'unknown');
assert.strictEqual(buildEvidenceV3(null), null);

const boxes = {};
for (let i = 1; i <= 12; i += 1) {
    boxes[i] = { chiName: 'Dần', cungName: i === 3 ? 'MỆNH' : 'PHÚC ĐỨC', majorStars: [], goodStars: [], badStars: [] };
}
boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
const matched = matchCombinations({ boxes, menhIndex: 3, menhChi: 'Dần' }, catalog).find((item) => item.name === 'Tử Phủ Đồng Cung');
assert.ok(matched);
assert.strictEqual(matched.evidence.ruleId, 'tu_phu_dong_cung');
assert.ok(!('version' in matched));
assert.ok(!('breakingConditions' in matched));

console.log('evidence v3 keeps a runtime match separate from source formation');
