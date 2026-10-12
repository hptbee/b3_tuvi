import assert from 'assert';
import { calculateTuVi, getStarStatus, resolveAnSaoMonth } from '../src/engine/tuviRules.mjs';
import { validateChartInput } from '../src/engine/chartInput.js';
import { solarToLunar } from '../src/engine/lunar.js';

const CHINH_TINH = [
    'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
    'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương',
    'Thất Sát', 'Phá Quân'
];

function testCalculateTuVi() {
    const res = calculateTuVi(0, 1, 15, 6, 12, 1);
    assert.ok(res, 'Result should be returned');
    assert.ok(res.boxes && typeof res.boxes === 'object', 'boxes object expected');
    assert.strictEqual(typeof res.menh, 'number');
    assert.strictEqual(res.anSaoMonth, 6);
    assert.strictEqual(res.isLeapMonth, false);

    const majors = Object.values(res.boxes).flatMap(box => box.majorStars);
    assert.ok(majors.length >= 14, '14 chính tinh should be placed');
    for (const star of majors) {
        assert.match(star, /\([MVĐBH]\)$/, `${star} should carry brightness`);
        const name = star.replace(/\s*\([MVĐBH]\)$/, '');
        assert.ok(CHINH_TINH.includes(name), `${name} should be a chính tinh`);
    }
    console.log('calculateTuVi smoke test passed');
}

function testMenhAtDanForMonth1HourTi() {
    const res = calculateTuVi(0, 1, 1, 1, 1, 1);
    assert.strictEqual(res.menh, 3, 'tháng 1 giờ Tí an Mệnh tại Dần');
    console.log('mệnh placement test passed');
}

function testLeapMonthRule() {
    assert.strictEqual(resolveAnSaoMonth(4, 14, true), 4);
    assert.strictEqual(resolveAnSaoMonth(4, 15, true), 5);
    assert.strictEqual(resolveAnSaoMonth(12, 15, true), 1);
    assert.strictEqual(resolveAnSaoMonth(4, 20, false), 4);

    const before = calculateTuVi(0, 1, 10, 4, 1, 1, true);
    const regular = calculateTuVi(0, 1, 10, 4, 1, 1, false);
    const after = calculateTuVi(0, 1, 15, 4, 1, 1, true);
    const nextMonth = calculateTuVi(0, 1, 15, 5, 1, 1, false);

    assert.strictEqual(before.anSaoMonth, 4);
    assert.strictEqual(before.menh, regular.menh);
    assert.strictEqual(after.anSaoMonth, 5);
    assert.strictEqual(after.menh, nextMonth.menh);

    const leapStart = solarToLunar(22, 3, 2023);
    assert.strictEqual(leapStart.isLeapMonth, true);
    assert.strictEqual(leapStart.isLeap, undefined);
    assert.strictEqual(leapStart.lunarMonth, 2);
    assert.strictEqual(leapStart.lunarDay, 1);
    const earlyChart = calculateTuVi(leapStart.canIndex, leapStart.chiIndex, leapStart.lunarDay, leapStart.lunarMonth, 1, 1, leapStart.isLeapMonth);
    assert.strictEqual(earlyChart.anSaoMonth, 2);

    const leapMid = solarToLunar(5, 4, 2023);
    assert.strictEqual(leapMid.isLeapMonth, true);
    assert.ok(leapMid.lunarDay >= 15);
    const lateChart = calculateTuVi(leapMid.canIndex, leapMid.chiIndex, leapMid.lunarDay, leapMid.lunarMonth, 1, 1, leapMid.isLeapMonth);
    assert.strictEqual(lateChart.anSaoMonth, 3);
    console.log('leap month test passed');
}

function testGetStarStatus() {
    assert.strictEqual(getStarStatus('Tử Vi', 3), 'Tử Vi (M)');
    assert.strictEqual(getStarStatus('Tử Vi', 4), 'Tử Vi (B)');
    assert.strictEqual(getStarStatus('Thái Dương', 7), 'Thái Dương (M)');
    assert.strictEqual(getStarStatus('Thái Dương', 1), 'Thái Dương (H)');
    assert.strictEqual(getStarStatus('Văn Xương', 1), 'Văn Xương (Đ)');
    assert.strictEqual(getStarStatus('Đào Hoa', 1), 'Đào Hoa');
    console.log('getStarStatus test passed');
}

function testValidateChartInput() {
    const ok = validateChartInput({ name: ' An ', day: 29, month: 2, year: 2000, hour: 0, gender: -1 });
    assert.strictEqual(ok.ok, true);
    assert.strictEqual(ok.value.name, 'An');
    assert.strictEqual(ok.value.gender, -1);

    const badDate = validateChartInput({ day: 31, month: 2, year: 2023, hour: 1, gender: 1 });
    assert.strictEqual(badDate.ok, false);

    const badHour = validateChartInput({ day: 1, month: 1, year: 1990, hour: 24, gender: 1 });
    assert.strictEqual(badHour.ok, false);

    const badYear = validateChartInput({ day: 1, month: 1, year: 1100, hour: 1, gender: 1 });
    assert.strictEqual(badYear.ok, false);

    const stringNums = validateChartInput({ day: '15', month: '6', year: '1990', hour: '8', gender: '1' });
    assert.strictEqual(stringNums.ok, true);
    assert.strictEqual(stringNums.value.day, 15);
    console.log('validateChartInput test passed');
}

function testBinhHoaKhoaOnVanXuong() {
    // Can Bính = 2, Hóa Khoa trên Văn Xương (tuHoaMap).
    const res = calculateTuVi(2, 3, 1, 1, 1, 1);
    const xuong = Object.values(res.boxes).find((b) =>
        (b.goodStars || []).some((s) => s.startsWith('Văn Xương'))
        || (b.majorStars || []).some((s) => s.startsWith('Văn Xương'))
    );
    assert.ok(xuong, 'Văn Xương must exist');
    assert.ok(
        [...xuong.goodStars, ...xuong.majorStars].some((s) => s.includes('Hóa Khoa')),
        'Bính: Hóa Khoa must follow Văn Xương'
    );
    console.log('Bính Hóa Khoa on Văn Xương passed');
}

function run() {
    testCalculateTuVi();
    testMenhAtDanForMonth1HourTi();
    testLeapMonthRule();
    testGetStarStatus();
    testValidateChartInput();
    testBinhHoaKhoaOnVanXuong();
    console.log('All engine tests passed');
}

run();
