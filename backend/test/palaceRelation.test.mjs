import assert from 'assert';
import { DIA_CHI } from '../src/engine/constants.js';
import { branchIndexRelations, relatedBranchIds } from '../src/engine/palaceRelation.js';

/** Bảng viết tay theo chu kỳ 12 chi. Không gọi engine để sinh expected. */
const TABLE = [
    { id: 1, tam: [5, 9], opp: 7, giap: [12, 2] },
    { id: 2, tam: [6, 10], opp: 8, giap: [1, 3] },
    { id: 3, tam: [7, 11], opp: 9, giap: [2, 4] },
    { id: 4, tam: [8, 12], opp: 10, giap: [3, 5] },
    { id: 5, tam: [9, 1], opp: 11, giap: [4, 6] },
    { id: 6, tam: [10, 2], opp: 12, giap: [5, 7] },
    { id: 7, tam: [11, 3], opp: 1, giap: [6, 8] },
    { id: 8, tam: [12, 4], opp: 2, giap: [7, 9] },
    { id: 9, tam: [1, 5], opp: 3, giap: [8, 10] },
    { id: 10, tam: [2, 6], opp: 4, giap: [9, 11] },
    { id: 11, tam: [3, 7], opp: 5, giap: [10, 12] },
    { id: 12, tam: [4, 8], opp: 6, giap: [11, 1] }
];

function testTable() {
    for (const row of TABLE) {
        const rel = branchIndexRelations(row.id);
        assert.deepStrictEqual(rel.tamHop, row.tam, DIA_CHI[row.id]);
        assert.strictEqual(rel.xungChieu, row.opp);
        assert.deepStrictEqual(rel.giap, row.giap);
        assert.deepStrictEqual(rel.neighbors, { backward: row.giap[0], forward: row.giap[1] });
        assert.deepStrictEqual(rel.tamPhuongTuChinh, [row.id, ...row.tam, row.opp]);
        assert.strictEqual(new Set(rel.tamPhuongTuChinh).size, 4);
        rel.tamPhuongTuChinh.forEach((id) => {
            assert.ok(id >= 1 && id <= 12);
            assert.strictEqual(DIA_CHI[id] !== '', true);
        });
    }
    const ti = branchIndexRelations(1);
    assert.deepStrictEqual(ti.tamHop.map((id) => DIA_CHI[id]), ['Thìn', 'Thân']);
    assert.strictEqual(DIA_CHI[ti.xungChieu], 'Ngọ');
    assert.deepStrictEqual(ti.giap.map((id) => DIA_CHI[id]), ['Hợi', 'Sửu']);
    console.log('12 chi relationship table passed');
}

function testSymmetry() {
    for (let id = 1; id <= 12; id += 1) {
        const rel = branchIndexRelations(id);
        assert.strictEqual(branchIndexRelations(rel.xungChieu).xungChieu, id);
        rel.tamHop.forEach((partner) => {
            assert.ok(branchIndexRelations(partner).tamHop.includes(id));
        });
        rel.giap.forEach((neighbor) => {
            assert.ok(branchIndexRelations(neighbor).giap.includes(id));
        });
        assert.strictEqual(relatedBranchIds(id, 'tam_hop').length, 2);
        assert.strictEqual(relatedBranchIds(id, 'xung_chieu').length, 1);
        assert.strictEqual(relatedBranchIds(id, 'adjacent').length, 2);
        assert.strictEqual(new Set(relatedBranchIds(id, 'tam_phuong_tu_chinh')).size, 4);
    }
    assert.strictEqual(branchIndexRelations(0), null);
    assert.strictEqual(relatedBranchIds(1, 'nhi_hop'), null);
    console.log('relationship symmetry passed');
}

testTable();
testSymmetry();
console.log('All palace relation tests passed');
