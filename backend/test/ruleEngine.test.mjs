import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { evaluateRule } from '../src/engine/ruleEngine.js';
import { matchCombinations, matchLegacyCombinations } from '../src/engine/combinationMatch.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };
import rules from '../src/data/rulesV2.json' with { type: 'json' };

function contextOf(can, chi, day, month, hour, gender, leap = false) {
    const tv = calculateTuVi(can, chi, day, month, hour, gender, leap);
    return {
        boxes: tv.boxes,
        menhIndex: tv.menh,
        menhChi: tv.boxes[tv.menh].chiName
    };
}

function names(matches) {
    return matches.map((item) => item.name);
}

function testRuleCoverage() {
    const matchingOk = catalog.filter((item) => item.verification_status === 'matching_ok').map((item) => item.name);
    const covered = new Set(rules.map((rule) => rule.combination));
    matchingOk.forEach((name) => assert.ok(covered.has(name), name));
    const disabled = catalog.filter((item) => item.verification_status === 'disabled').map((item) => item.name);
    disabled.forEach((name) => assert.ok(!covered.has(name), name));
    rules.forEach((rule) => {
        const combo = catalog.find((item) => item.name === rule.combination);
        assert.ok(combo, rule.combination);
        if (rule.strict) assert.strictEqual(combo.verification_status, 'provisional');
    });
    console.log('v2 coverage passed');
}

function testParity() {
    const kept = ['Tử Phủ Đồng Cung', 'Sát Phá Tham', 'Tam Kỳ Gia Hội', 'Mệnh Vô Chính Diệu'];
    const samples = [contextOf(0, 1, 10, 1, 1, 1), contextOf(6, 1, 15, 4, 3, -1, true)];
    for (const ctx of samples) {
        const chart = normalizeChart({ tuviInfo: { boxes: ctx.boxes, menh: ctx.menhIndex, than: null } });
        const live = new Set(names(matchCombinations(ctx, catalog)));
        for (const name of kept) {
            const previous = rules.find((rule) => rule.combination === name);
            assert.strictEqual(live.has(name), Boolean(evaluateRule(chart, previous)), name);
        }
    }
    const legacy = matchLegacyCombinations(contextOf(0, 1, 10, 1, 1, 1), catalog);
    assert.ok(Array.isArray(legacy));
    console.log('kept v1 predicates still agree with the researched rules snapshot');
}

function testSamePalaceIsNotAZone() {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = { chiName: 'Dần', cungName: i === 3 ? 'MỆNH' : 'PHÚC ĐỨC', majorStars: [], goodStars: [], badStars: [] };
    }
    boxes[3].chiName = 'Dần';
    boxes[3].majorStars = ['Tử Vi (M)'];
    boxes[9].majorStars = ['Thiên Phủ (M)'];
    const ctx = { boxes, menhIndex: 3, menhChi: 'Dần' };
    assert.ok(!names(matchCombinations(ctx, catalog)).includes('Tử Phủ Đồng Cung'));
    boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    const hit = matchCombinations(ctx, catalog).find((item) => item.name === 'Tử Phủ Đồng Cung');
    assert.ok(hit);
    assert.strictEqual(hit.evidence.ruleId, 'tu_phu_dong_cung');
    assert.strictEqual(hit.evidence.op, 'same_palace');
    assert.deepStrictEqual(hit.evidence.stars.map((star) => star.palaces), [[3], [3]]);
    console.log('same palace is not a zone passed');
}

function testBrightnessAndExcluded() {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = { chiName: 'Ngọ', cungName: i === 7 ? 'MỆNH' : 'TÀI BẠCH', majorStars: [], goodStars: [], badStars: [] };
    }
    boxes[7].majorStars = ['Thái Dương (M)'];
    boxes[7].badStars = ['Hóa Kỵ'];
    const chart = normalizeChart({ tuviInfo: { boxes, menh: 7, than: null } });
    const bright = evaluateRule(chart, {
        id: 'bright_only',
        target: 'menh',
        samePalace: ['Thái Dương'],
        brightness: { 'Thái Dương': 'H' }
    });
    assert.strictEqual(bright, null);
    const mieu = evaluateRule(chart, {
        id: 'mieu',
        target: 'menh',
        samePalace: ['Thái Dương'],
        brightness: { 'Thái Dương': 'M' },
        excluded: [{ relation: 'same', stars: ['Hóa Kỵ'] }]
    });
    assert.strictEqual(mieu, null);
    boxes[7].badStars = [];
    const clear = normalizeChart({ tuviInfo: { boxes, menh: 7, than: null } });
    const ok = evaluateRule(clear, {
        id: 'mieu',
        target: 'menh',
        samePalace: ['Thái Dương'],
        brightness: { 'Thái Dương': 'M' }
    });
    assert.strictEqual(ok.evidence.op, 'same_palace');
    console.log('brightness and excluded passed');
}

function blankChart(menh) {
    const names = ['', 'Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = {
            chiName: names[i],
            cungName: i === menh ? 'MỆNH' : 'PHÚC ĐỨC',
            majorStars: [],
            goodStars: [],
            badStars: []
        };
    }
    return { boxes, menhIndex: menh, menhChi: names[menh] };
}

function hasName(ctx, name) {
    return names(matchCombinations(ctx, catalog)).includes(name);
}

function testStrictPositions() {
    const tuPhu = blankChart(3);
    tuPhu.boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Tướng (M)'];
    tuPhu.boxes[7].majorStars = ['Thiên Phủ (M)'];
    tuPhu.boxes[11].majorStars = ['Vũ Khúc (V)'];
    assert.ok(hasName(tuPhu, 'Tử Phủ Vũ Tướng'));
    tuPhu.boxes[11].majorStars = [];
    tuPhu.boxes[9].majorStars = ['Vũ Khúc (V)'];
    assert.ok(hasName(tuPhu, 'Tử Phủ Vũ Tướng'));
    tuPhu.boxes[9].majorStars = [];
    tuPhu.boxes[4].majorStars = ['Vũ Khúc (V)'];
    assert.ok(!hasName(tuPhu, 'Tử Phủ Vũ Tướng'));

    const khoa = blankChart(3);
    khoa.boxes[3].goodStars = ['Hóa Khoa'];
    khoa.boxes[7].goodStars = ['Hóa Quyền'];
    assert.ok(hasName(khoa, 'Giáp Đệ Đăng Khoa'));
    khoa.boxes[7].goodStars = [];
    khoa.boxes[9].goodStars = ['Hóa Quyền'];
    assert.ok(hasName(khoa, 'Giáp Đệ Đăng Khoa'));
    khoa.boxes[3].goodStars = [];
    khoa.boxes[9].goodStars = ['Hóa Khoa', 'Hóa Quyền'];
    assert.ok(!hasName(khoa, 'Giáp Đệ Đăng Khoa'));

    const chau = blankChart(8);
    chau.boxes[12].majorStars = ['Thái Âm (M)'];
    chau.boxes[4].majorStars = ['Thái Dương (V)'];
    assert.ok(!hasName(chau, 'Minh Châu Xuất Hải'));
    const legacyChau = matchCombinations(chau, catalog, { profile: 'b3-legacy' }).find((item) => item.name === 'Minh Châu Xuất Hải');
    assert.ok(legacyChau);
    assert.strictEqual(legacyChau.evidence.ruleId, 'minh_chau_b3_legacy');
    const nguyet = blankChart(1);
    nguyet.boxes[1].majorStars = ['Thái Âm (M)'];
    assert.ok(hasName(nguyet, 'Minh Châu Xuất Hải'));

    const giap = blankChart(5);
    giap.boxes[5].goodStars = ['Lộc Tồn'];
    giap.boxes[5].badStars = ['Hóa Kỵ'];
    giap.boxes[4].badStars = ['Kình Dương'];
    giap.boxes[6].badStars = ['Đà La'];
    assert.ok(hasName(giap, 'Kình Đà Hiệp Kỵ'));
    giap.boxes[5].goodStars = [];
    assert.ok(!hasName(giap, 'Kình Đà Hiệp Kỵ'));

    const tinh = blankChart(2);
    tinh.boxes[6].majorStars = ['Thái Dương (M)'];
    tinh.boxes[10].majorStars = ['Thái Âm (M)'];
    assert.ok(hasName(tinh, 'Nhật Nguyệt Tịnh Minh'));
    tinh.boxes[10].majorStars = [];
    tinh.boxes[12].majorStars = ['Thái Âm (M)'];
    assert.ok(!hasName(tinh, 'Nhật Nguyệt Tịnh Minh'));
    console.log('strict positional rules passed');
}

function testPalaceFunctionAndMarkers() {
    const hoa = blankChart(2);
    hoa.boxes[2].majorStars = ['Tham Lang (H)'];
    hoa.boxes[2].badStars = ['Hỏa Tinh'];
    assert.ok(hasName(hoa, 'Hỏa Tham'));
    hoa.boxes[2].badStars = [];
    hoa.boxes[6].badStars = ['Hỏa Tinh'];
    assert.ok(!hasName(hoa, 'Hỏa Tham'));

    const phu = blankChart(1);
    phu.boxes[5].cungName = 'PHU THÊ';
    phu.boxes[5].goodStars = ['Hoa Cái'];
    assert.ok(hasName(phu, 'Hoa Cái Cư Phu Thê'));
    phu.boxes[5].goodStars = [];
    phu.boxes[1].badStars = ['Hóa Kỵ'];
    assert.ok(!hasName(phu, 'Hoa Cái Cư Phu Thê'));

    const vcd = blankChart(4);
    vcd.boxes[4].isTuan = true;
    vcd.boxes[4].isTriet = true;
    vcd.boxes[4].badStars = ['Địa Không'];
    assert.ok(!hasName(vcd, 'Mệnh VCD Đắc Tam Không'));
    vcd.boxes[4].badStars = [];
    vcd.boxes[10].goodStars = ['Thiên Không'];
    const vcdHit = matchCombinations(vcd, catalog, { includeNonPublic: true }).find((item) => item.name === 'Mệnh VCD Đắc Tam Không');
    assert.ok(vcdHit);
    assert.strictEqual(vcdHit.publicInterpretationAllowed, false);

    const tat = blankChart(1);
    tat.boxes[8].cungName = 'TẬT ÁCH';
    tat.boxes[8].majorStars = ['Thái Dương (H)', 'Thái Âm (H)'];
    assert.ok(hasName(tat, 'Nhật Nguyệt Tật Ách'));
    tat.boxes[8].majorStars = ['Thái Dương (H)'];
    tat.boxes[8].badStars = ['Hóa Kỵ'];
    assert.ok(!hasName(tat, 'Nhật Nguyệt Tật Ách'));

    const ctx = contextOf(0, 1, 10, 1, 1, 1);
    assert.ok(!names(matchCombinations(ctx, catalog)).includes('Lưỡng Trùng Thiên Mã'));
    assert.ok(!names(matchCombinations(ctx, catalog)).includes('Cát Xứ Tàng Hung'));
    console.log('palace function and markers passed');
}

function testUnknownStarDoesNotMatch() {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = { chiName: 'Tí', cungName: i === 1 ? 'MỆNH' : 'NÔ BỘC', majorStars: [], goodStars: [], badStars: [] };
    }
    const chart = normalizeChart({ tuviInfo: { boxes, menh: 1, than: null } });
    assert.strictEqual(evaluateRule(chart, {
        id: 'missing',
        target: 'menh',
        samePalace: ['Sao Không Có']
    }), null);
    console.log('unknown star does not match passed');
}

function testBrightnessAppliesToInstanceInScope() {
    const ctx = blankChart(7);
    ctx.boxes[7].majorStars = ['Thái Dương (M)'];
    ctx.boxes[1].majorStars = ['Thái Dương (H)'];
    const chart = normalizeChart({ tuviInfo: { boxes: ctx.boxes, menh: 7, than: null } });
    const hit = evaluateRule(chart, {
        id: 'duong_m_at_menh',
        target: 'menh',
        clauses: [{ stars: ['Thái Dương'], at: 'target', brightness: ['M'] }]
    });
    assert.ok(hit, 'bản M tại Mệnh phải khớp dù bản H ở cung khác');
    assert.deepStrictEqual(hit.evidence.stars[0].palaces, [7]);
    const wrong = evaluateRule(chart, {
        id: 'duong_m_at_ty',
        target: 'menh',
        clauses: [{ stars: ['Thái Dương'], at: 'opposite', brightness: ['M'] }]
    });
    assert.strictEqual(wrong, null);
    console.log('brightness follows the instance in scope passed');
}

function testMalformedRulesDoNotMatch() {
    const ctx = blankChart(1);
    ctx.boxes[1].majorStars = ['Tử Vi (M)'];
    const chart = normalizeChart({ tuviInfo: { boxes: ctx.boxes, menh: 1, than: null } });
    const samples = [
        { id: 'empty-same', target: 'menh', samePalace: [] },
        { id: 'bad-giap', target: 'menh', giap: { mode: 'nope', stars: ['Tử Vi'] } },
        { id: 'bad-count', target: 'menh', countAtLeast: { stars: ['Địa Không'], markers: ['tuan'] } },
        { id: 'empty-clause', target: 'menh', clauses: [{ stars: [] }] },
        { id: 'bad-excluded', target: 'menh', samePalace: ['Tử Vi'], excluded: [{ relation: 'tam_hop', stars: ['Hóa Kỵ'] }] },
        { target: 'menh', samePalace: ['Tử Vi'] }
    ];
    samples.forEach((rule) => {
        assert.strictEqual(evaluateRule(chart, rule), null, rule.id || 'missing-id');
    });
    console.log('malformed rules do not match passed');
}

testRuleCoverage();
testParity();
testSamePalaceIsNotAZone();
testBrightnessAndExcluded();
testUnknownStarDoesNotMatch();
testBrightnessAppliesToInstanceInScope();
testMalformedRulesDoNotMatch();
testStrictPositions();
testPalaceFunctionAndMarkers();
console.log('All rule engine tests passed');
