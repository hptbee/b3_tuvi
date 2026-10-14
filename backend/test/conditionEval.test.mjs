import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { OPERATORS, evaluateCondition } from '../src/engine/conditionEval.js';
import { evaluateLayers } from '../src/engine/evaluationLayers.js';
import { contradictionResolution } from '../src/engine/contradiction.js';

function chart() {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = {
            chiName: ['', 'Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'][i],
            cungName: i === 3 ? 'MỆNH' : 'PHÚC ĐỨC',
            majorStars: [],
            goodStars: [],
            badStars: []
        };
    }
    boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (V)'];
    boxes[9].goodStars = ['Hóa Lộc'];
    boxes[12].goodStars = ['Văn Xương'];
    boxes[4].badStars = ['Địa Không'];
    boxes[2].badStars = ['Địa Kiếp'];
    boxes[3].isTuan = true;
    const normalized = normalizeChart({ tuviInfo: { boxes, menh: 3, than: null } });
    normalized.ok = true;
    return normalized;
}

const base = chart();

function status(expr, scope) {
    return evaluateCondition(expr, base, scope).status;
}

assert.deepStrictEqual(OPERATORS.map((item) => item.id).sort(), [
    'and', 'branch', 'brightness', 'flank_split', 'marker', 'nhi_hop', 'not', 'opposite', 'or',
    'same_palace', 'star_absent', 'star_present', 'tam_hop', 'tam_phuong_tu_chinh', 'tu_hoa'
].sort());

assert.strictEqual(status({ op: 'same_palace', target: 'menh', stars: ['Tử Vi', 'Thiên Phủ'] }), 'satisfied');
assert.strictEqual(status({ op: 'same_palace', target: 'menh', stars: ['Tử Vi', 'Thái Dương'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'star_present', target: 'menh', star: 'Tử Vi' }), 'satisfied');
assert.strictEqual(status({ op: 'star_absent', target: 'menh', star: 'Thái Dương' }), 'satisfied');
assert.strictEqual(status({ op: 'star_absent', target: 'menh', star: 'Tử Vi' }), 'not_satisfied');
assert.strictEqual(status({ op: 'branch', target: 'menh', branches: ['Dần', 'Thân'] }), 'satisfied');
assert.strictEqual(status({ op: 'branch', target: 'menh', branches: ['Tý'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'branch', target: 'menh', branches: ['Tỵ'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'brightness', target: 'menh', star: 'Tử Vi', marks: ['M'] }), 'satisfied');
assert.strictEqual(status({ op: 'brightness', target: 'menh', star: 'Tử Vi', marks: ['H'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'opposite', target: 'menh', stars: ['Hóa Lộc'] }), 'satisfied');
assert.strictEqual(status({ op: 'opposite', target: 'menh', stars: ['Tử Vi'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'tam_hop', target: 'menh', stars: ['Tử Vi'] }), 'satisfied');
assert.strictEqual(status({ op: 'tam_phuong_tu_chinh', target: 'menh', stars: ['Hóa Lộc'] }), 'satisfied');
assert.strictEqual(status({ op: 'nhi_hop', target: 'menh', star: 'Văn Xương' }), 'satisfied');
assert.strictEqual(status({ op: 'nhi_hop', target: 'menh', star: 'Hóa Lộc' }), 'not_satisfied');
assert.strictEqual(status({ op: 'flank_split', target: 'menh', stars: ['Địa Kiếp', 'Địa Không'] }), 'satisfied');
assert.strictEqual(status({ op: 'flank_split', target: 'menh', stars: ['Địa Không', 'Hóa Lộc'] }), 'not_satisfied');
assert.strictEqual(status({ op: 'marker', target: 'menh', marker: 'tuan', present: true }), 'satisfied');
assert.strictEqual(status({ op: 'marker', target: 'menh', marker: 'triet', present: true }), 'not_satisfied');

const both = { op: 'same_palace', target: 'menh', stars: ['Tử Vi', 'Thiên Phủ'] };
const missing = { op: 'star_present', target: 'menh', star: 'Thái Dương' };
assert.strictEqual(status({ op: 'and', items: [both, missing] }), 'not_satisfied');
assert.strictEqual(status({ op: 'or', items: [missing, both] }), 'satisfied');
assert.strictEqual(status({ op: 'not', item: both }), 'not_satisfied');
assert.strictEqual(status({ op: 'not', item: missing }), 'satisfied');
assert.strictEqual(status({ op: 'and', items: [] }), 'not_implemented');
assert.strictEqual(status({ op: 'or', items: [{ op: 'mystery' }] }), 'not_implemented');
assert.strictEqual(status({ op: 'not_a_rule' }), 'not_implemented');
assert.strictEqual(evaluateCondition(null, base).status, 'not_implemented');
assert.strictEqual(status({ op: 'same_palace', profile: 'other', target: 'menh', stars: ['Tử Vi'] }, { profile: 'tan-bien' }), 'not_implemented');

const unknownLeaf = evaluateCondition({ op: 'brightness', target: 'menh', star: 'Hóa Lộc', marks: ['M'] }, base);
assert.strictEqual(unknownLeaf.status, 'not_satisfied');
const noBrightness = {
    ...base,
    palaces: base.palaces.map((palace) => (
        palace.functionId === 'menh'
            ? { ...palace, stars: palace.stars.map((star) => ({ ...star, brightness: star.starId === 'tu_vi' ? null : star.brightness })) }
            : palace
    ))
};
assert.strictEqual(evaluateCondition({ op: 'brightness', target: 'menh', star: 'Tử Vi', marks: ['M'] }, noBrightness).status, 'unknown');
assert.strictEqual(evaluateCondition({
    op: 'and',
    items: [both, { op: 'brightness', target: 'menh', star: 'Tử Vi', marks: ['M'] }]
}, noBrightness).status, 'unknown');
assert.strictEqual(evaluateCondition({
    op: 'not',
    item: { op: 'brightness', target: 'menh', star: 'Tử Vi', marks: ['M'] }
}, noBrightness).status, 'unknown');
assert.strictEqual(evaluateCondition({ op: 'tu_hoa', target: 'menh', hoa: 'Hóa Kỵ', source: 'Thiên Tướng' }, base).status, 'not_satisfied');
const unresolvedBoxes = {};
for (let i = 1; i <= 12; i += 1) {
    unresolvedBoxes[i] = {
        chiName: ['', 'Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'][i],
        cungName: i === 3 ? 'MỆNH' : 'PHÚC ĐỨC',
        majorStars: [],
        goodStars: [],
        badStars: []
    };
}
unresolvedBoxes[3].goodStars = ['Hóa Khoa'];
const unresolved = normalizeChart({
    tuviInfo: { boxes: unresolvedBoxes, menh: 3, than: null },
    lunarInfo: { canIndex: 1, chiIndex: 1 }
});
assert.strictEqual(evaluateCondition({ op: 'tu_hoa', target: 'menh', hoa: 'Hóa Khoa', source: 'Tử Vi' }, unresolved).status, 'unknown');

const layers = evaluateLayers({
    runtimeMatch: 'matched',
    formation: { status: 'not_satisfied' },
    grade: { status: 'not_certified' },
    breaking: { status: 'checked_clear', evaluated: false }
});
assert.strictEqual(layers.runtimeMatch.status, 'matched');
assert.strictEqual(layers.formation.status, 'not_satisfied');
assert.strictEqual(layers.grade.status, 'not_certified');
assert.strictEqual(layers.breaking.status, 'not_implemented');
assert.strictEqual(layers.interpretationEligibility.eligible, false);

const open = contradictionResolution([
    { fromClaimId: 'a', toClaimId: 'b' },
    { fromClaimId: 'b', toClaimId: 'a' }
]);
assert.strictEqual(open.status, 'unresolved');
assert.strictEqual(open.winner, null);
assert.strictEqual(open.sides.length, 2);
assert.strictEqual(contradictionResolution([]).status, 'none');

const natal = normalizeChart({
    tuviInfo: calculateTuVi(1, 1, 15, 1, 7, 1, false),
    lunarInfo: { canIndex: 1, chiIndex: 1 }
});
const natalTrace = evaluateCondition({
    op: 'and',
    items: [
        { op: 'branch', target: 'menh', branches: ['Dần', 'Thân'] },
        { op: 'same_palace', target: 'menh', stars: ['Tử Vi', 'Thiên Phủ'] }
    ]
}, natal);
assert.strictEqual(natalTrace.status, 'satisfied');
assert.ok(natalTrace.children.length === 2);

console.log('condition evaluator contracts passed');
