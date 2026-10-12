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
assert.strictEqual(dto.patternDetected, true);
assert.strictEqual(dto.formationConditions, 'satisfied');
assert.strictEqual(dto.breakingConditions, 'unknown');
assert.strictEqual(dto.ruleId, 'tu_phu_dong_cung');
assert.strictEqual(dto.targetPalace.palaceId, hit.evidence.palaceId);
assert.deepStrictEqual(dto.matchedStars, ['tu_vi', 'thien_phu']);
assert.strictEqual(dto.matchedStarInstances.length, 2);
assert.ok(dto.brightnessEvidence.length >= 1);
assert.deepStrictEqual(dto.relationshipEvidence, []);
assert.deepStrictEqual(dto.satisfiedConditions, [{ op: 'same_palace', status: 'satisfied' }]);
assert.deepStrictEqual(dto.unresolvedConditions, []);
assert.deepStrictEqual(dto.sourceClaimReferences, []);
assert.strictEqual(dto.verification.formulaStatus, 'undocumented');
assert.strictEqual(dto.verification.bibliographicStatus, 'unverified');

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
assert.strictEqual(linked.breakingConditions, 'unknown');
assert.strictEqual(linked.sourceClaimReferences[0].claimId, 'claim-phu-tuong-trieu-vien');
assert.strictEqual(linked.verification.formulaStatus, 'undocumented');
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

console.log('evidence v3 describes a hit without inventing breaking conditions');
