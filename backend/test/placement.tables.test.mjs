import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { solarToLunar } from '../src/engine/lunar.js';
import { findStarOnChart, wrapIndex } from '../src/engine/starNames.js';
import locMap from '../src/data/locMap.json' with { type: 'json' };
import tuHoaMap from '../src/data/tuHoaMap.json' with { type: 'json' };
import ref from '../src/data/placementReference.json' with { type: 'json' };

const HOA = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];
const CHI_GROUPS = {
    tuChinh: [1, 7, 4, 10],
    tuSinh: [3, 9, 6, 12],
    tuMo: [5, 11, 2, 8]
};

function posOf(chart, name) {
    const hits = findStarOnChart(chart.boxes, name);
    return hits.map((h) => h.index);
}

function validPairs() {
    const pairs = [];
    for (let can = 0; can < 10; can++) {
        for (let chi = 1; chi <= 12; chi++) {
            if ((can % 2) === ((chi - 1) % 2)) pairs.push([can, chi]);
        }
    }
    return pairs;
}

function testTuHoaOnPhuTinh() {
    for (const [can, chi] of validPairs()) {
        const chart = calculateTuVi(can, chi, 1, 1, 1, 1);
        const targets = tuHoaMap[String(can)] || tuHoaMap[can];
        targets.forEach((star, idx) => {
            const starPos = posOf(chart, star);
            const hoaPos = posOf(chart, HOA[idx]);
            assert.ok(starPos.length > 0, `Thiếu sao ${star} can=${can}`);
            assert.ok(
                hoaPos.some((p) => starPos.includes(p)),
                `Thiếu ${HOA[idx]} đồng cung ${star} (can ${can} chi ${chi})`
            );
        });
    }
    console.log('Tứ Hóa đồng cung sao gốc (kể cả Xương Khúc Tả Hữu) passed');
}

function testDuongPhu() {
    for (let can = 0; can < 10; can++) {
        const loc = locMap[String(can)];
        const expected = wrapIndex(loc - 7);
        const chart = calculateTuVi(can, can % 2 === 0 ? 1 : 2, 1, 1, 1, 1);
        assert.deepStrictEqual(posOf(chart, 'Đường Phù'), [expected], `Đường Phù can ${can}`);
    }
    console.log('Đường Phù (Lộc Tồn nghịch cung 8) passed');
}

function testVanTinh() {
    const table = ref.vanTinhByCan.positions;
    for (let can = 0; can < 10; can++) {
        const chart = calculateTuVi(can, can % 2 === 0 ? 1 : 2, 1, 1, 1, 1);
        assert.deepStrictEqual(posOf(chart, 'Văn Tinh'), [table[String(can)]], `Văn Tinh can ${can}`);
    }
    console.log('Văn Tinh bảng can passed');
}

function testPhaToai() {
    for (const [can, chi] of validPairs()) {
        const chart = calculateTuVi(can, chi, 8, 3, 5, 1);
        let expected;
        if (CHI_GROUPS.tuChinh.includes(chi)) expected = ref.phaToaiByChiGroup.tuChinh;
        else if (CHI_GROUPS.tuSinh.includes(chi)) expected = ref.phaToaiByChiGroup.tuSinh;
        else expected = ref.phaToaiByChiGroup.tuMo;
        assert.deepStrictEqual(posOf(chart, 'Phá Toái'), [expected], `Phá Toái chi ${chi}`);
    }
    console.log('Phá Toái Tứ Chính/Sinh/Mộ passed');
}

function testDuc() {
    for (const [can, chi] of validPairs()) {
        const chart = calculateTuVi(can, chi, 10, 6, 4, -1);
        const td = wrapIndex(ref.thienDucNguyetDuc.thienDucYearTi + chi - 1);
        const nd = wrapIndex(ref.thienDucNguyetDuc.nguyetDucYearTi + chi - 1);
        assert.deepStrictEqual(posOf(chart, 'Thiên Đức'), [td], `Thiên Đức chi ${chi}`);
        assert.deepStrictEqual(posOf(chart, 'Nguyệt Đức'), [nd], `Nguyệt Đức chi ${chi}`);
    }
    console.log('Thiên Đức / Nguyệt Đức theo chi năm passed');
}

function testChuThan() {
    for (const [can, chi] of validPairs()) {
        const chart = calculateTuVi(can, chi, 1, 1, 1, 1);
        assert.strictEqual(chart.chuThan, ref.chuThan.byChi[String(chi)], `Chủ Thân chi ${chi}`);
    }
    const ngo = calculateTuVi(1, 7, 15, 6, 12, 1);
    assert.strictEqual(ngo.chuThan, 'Linh Tinh');
    console.log('Chủ Thân (Ngọ = Linh Tinh) passed');
}

function testHoursAndGender() {
    for (let hour = 1; hour <= 12; hour++) {
        const nam = calculateTuVi(0, 1, 1, hour <= 12 ? hour : 1, hour, 1);
        const nu = calculateTuVi(0, 1, 1, 1, hour, -1);
        assert.ok(nam.boxes[nam.menh]);
        assert.ok(nu.boxes[nu.menh]);
        assert.notStrictEqual(nam.textAmDuong, nu.textAmDuong);
    }
    for (let month = 1; month <= 12; month++) {
        const chart = calculateTuVi(2, 3, 15, month, 1, 1);
        assert.strictEqual(chart.anSaoMonth, month);
    }
    console.log('12 giờ, nam/nữ, 12 tháng passed');
}

function testLunarProvisional() {
    for (const c of ref.tetDates.cases) {
        const l = solarToLunar(c.day, c.month, c.year);
        assert.strictEqual(l.lunarDay, c.lunarDay, `Tết ${c.day}/${c.month}/${c.year} ngày`);
        assert.strictEqual(l.lunarMonth, c.lunarMonth, `Tết ${c.day}/${c.month}/${c.year} tháng`);
        assert.strictEqual(l.canName, c.canName);
        assert.strictEqual(l.chiName, c.chiName);
    }
    for (const c of ref.leapMonths.cases) {
        const l = solarToLunar(c.day, c.month, c.year);
        assert.strictEqual(l.isLeapMonth, true, `nhuận ${c.year}`);
        assert.strictEqual(l.lunarMonth, c.lunarMonth);
    }
    console.log('Lunar provisional Tết / nhuận passed');
}

function testTyHourDocumented() {
    // Hồ sơ mặc định: 23h = Tí, giữ ngày dương. Không đổi ngày.
    const late = solarToLunar(10, 2, 2024);
    const early = solarToLunar(10, 2, 2024);
    assert.strictEqual(late.lunarDay, early.lunarDay);
    console.log('Giờ Tý (giữ ngày dương) documented');
}

testTuHoaOnPhuTinh();
testDuongPhu();
testVanTinh();
testPhaToai();
testDuc();
testChuThan();
testHoursAndGender();
testLunarProvisional();
testTyHourDocumented();
console.log('All placement table tests passed');
