import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };

const DANGEROUS_ALWAYS = [
    'Mệnh Lý Phùng Không',
    'Bán Không Chiết Xỉ',
    'Đế Ngộ Hung Đồ',
    'Cự Phùng Tứ Sát',
    'Lưỡng Trùng Thiên Mã',
    'Cát Xứ Tàng Hung'
];

function namesOf(matches) {
    return matches.map((m) => m.name);
}

function chartContext(can, chi, day, month, hour, gender) {
    const tv = calculateTuVi(can, chi, day, month, hour, gender);
    return {
        boxes: tv.boxes,
        menhIndex: tv.menh,
        menhChi: tv.boxes[tv.menh].chiName,
        tv
    };
}

function testInvalidInput() {
    assert.deepStrictEqual(matchCombinations({}, catalog), []);
    assert.deepStrictEqual(matchCombinations({ boxes: {}, menhIndex: 1 }, catalog), []);
    assert.deepStrictEqual(matchCombinations({ boxes: { 1: {} }, menhIndex: 0 }, catalog), []);
    assert.deepStrictEqual(matchCombinations({ boxes: { 1: {} }, menhIndex: 1 }, null), []);
    console.log('invalid input returns [] passed');
}

function testNeverTrueOnEmpty() {
    const ctx = chartContext(0, 1, 1, 1, 1, 1);
    const fake = [{
        name: 'Empty Trap',
        type: 'hung_bai_cach',
        description: 'x',
        verification_status: 'provisional',
        logic_conditions: { required_stars: [], positions: [] },
        interpretations: [{ context: 'a', content: 'b' }]
    }];
    assert.deepStrictEqual(matchCombinations(ctx, fake), []);
    console.log('empty conditions never match passed');
}

function testDisabledUnsupported() {
    const ctx = chartContext(0, 1, 1, 1, 1, 1);
    const matches = matchCombinations(ctx, catalog);
    const disabled = catalog.filter((c) => c.verification_status === 'disabled').map((c) => c.name);
    for (const name of disabled) {
        assert.ok(!namesOf(matches).includes(name), `${name} must stay disabled`);
    }
    console.log('disabled Nhị hợp/Ám hợp not returned passed');
}

function testPhiemThuyPositiveNegative() {
    let foundPos = null;
    let foundNeg = null;
    for (let can = 0; can < 10; can++) {
        for (let chi = 1; chi <= 12; chi++) {
            if ((can % 2) !== ((chi - 1) % 2)) continue;
            for (let month = 1; month <= 12; month++) {
                for (let hour = 1; hour <= 12; hour++) {
                    const ctx = chartContext(can, chi, 1, month, hour, 1);
                    const hit = namesOf(matchCombinations(ctx, catalog)).includes('Phiếm Thủy Đào Hoa');
                    const menhChi = ctx.menhChi;
                    const hasTham = (ctx.tv.boxes[ctx.menhIndex].majorStars || []).some((s) => s.includes('Tham Lang'));
                    if (hit) {
                        foundPos = ctx;
                        assert.ok(['Tí', 'Hợi'].includes(menhChi), 'positive must be Mệnh Tí/Hợi');
                        assert.ok(hasTham, 'positive must have Tham Lang at Mệnh');
                    } else if (foundNeg == null && menhChi !== 'Tí' && menhChi !== 'Hợi') {
                        foundNeg = ctx;
                    }
                    if (foundPos && foundNeg) break;
                }
                if (foundPos && foundNeg) break;
            }
            if (foundPos && foundNeg) break;
        }
        if (foundPos && foundNeg) break;
    }
    assert.ok(foundPos, 'need a positive Phiếm Thủy fixture');
    assert.ok(foundNeg, 'need a negative Phiếm Thủy fixture');
    console.log('Phiếm Thủy positive/negative passed');
}

function testVoChinhDieu() {
    let pos = 0;
    let neg = 0;
    for (let can = 0; can < 10; can++) {
        for (let m = 1; m <= 12; m++) {
            const ctx = chartContext(can, can % 2 === 0 ? 1 : 2, 1, m, 1, 1);
            const vcd = (ctx.tv.boxes[ctx.menhIndex].majorStars || []).length === 0;
            const hit = namesOf(matchCombinations(ctx, catalog)).includes('Mệnh Vô Chính Diệu');
            if (vcd) {
                assert.ok(hit, 'VCD chart must match');
                pos += 1;
            } else {
                assert.ok(!hit, 'chart with chính tinh at Mệnh must not match VCD');
                neg += 1;
            }
        }
    }
    assert.ok(pos > 0 && neg > 0);
    console.log('Mệnh Vô Chính Diệu pos/neg passed');
}

function testTuPhuDongCung() {
    let pos = 0;
    let neg = 0;
    for (let can = 0; can < 10; can++) {
        for (let chi = 1; chi <= 12; chi++) {
            if ((can % 2) !== ((chi - 1) % 2)) continue;
            for (let month = 1; month <= 12; month++) {
                const ctx = chartContext(can, chi, 15, month, 1, 1);
                const hit = namesOf(matchCombinations(ctx, catalog)).includes('Tử Phủ Đồng Cung');
                const menhStars = (ctx.tv.boxes[ctx.menhIndex].majorStars || []).join(' ');
                const atDanThan = ctx.menhChi === 'Dần' || ctx.menhChi === 'Thân';
                const both = menhStars.includes('Tử Vi') && menhStars.includes('Thiên Phủ');
                if (hit) {
                    assert.ok(atDanThan && both);
                    pos += 1;
                } else if (atDanThan && !both) {
                    neg += 1;
                }
            }
        }
    }
    assert.ok(pos > 0, 'Tử Phủ Đồng Cung should occur');
    assert.ok(neg > 0, 'need negative at Dần/Thân without both stars');
    console.log('Tử Phủ Đồng Cung pos/neg passed');
}

function testHamDiaNotEverywhere() {
    let tangHuy = 0;
    let total = 0;
    for (let can = 0; can < 10; can++) {
        for (let chi = 1; chi <= 12; chi++) {
            if ((can % 2) !== ((chi - 1) % 2)) continue;
            const ctx = chartContext(can, chi, 15, 6, 1, 1);
            total += 1;
            if (namesOf(matchCombinations(ctx, catalog)).includes('Nhật Nguyệt Tàng Huy')) tangHuy += 1;
        }
    }
    assert.ok(tangHuy < total, 'Tàng Huy must not match every chart');
    assert.ok(tangHuy > 0, 'Tàng Huy should still match some hãm charts');
    console.log(`Nhật Nguyệt Tàng Huy rate ${tangHuy}/${total} passed`);
}

function testDangerousNotUniversal() {
    const freq = Object.fromEntries(DANGEROUS_ALWAYS.map((n) => [n, 0]));
    let n = 0;
    for (let can = 0; can < 10; can++) {
        for (let chi = 1; chi <= 12; chi++) {
            if ((can % 2) !== ((chi - 1) % 2)) continue;
            for (const month of [1, 4, 7, 10]) {
                for (const hour of [1, 7]) {
                    for (const gender of [1, -1]) {
                        const ctx = chartContext(can, chi, 9, month, hour, gender);
                        const hit = new Set(namesOf(matchCombinations(ctx, catalog)));
                        n += 1;
                        DANGEROUS_ALWAYS.forEach((name) => {
                            if (hit.has(name)) freq[name] += 1;
                        });
                    }
                }
            }
        }
    }
    for (const [name, count] of Object.entries(freq)) {
        const rate = count / n;
        assert.ok(rate < 0.5, `${name} matched ${rate} of charts`);
    }
    console.log(`dangerous hung ways not universal (n=${n}) passed`);
}

function testCatalogIntegrity() {
    assert.strictEqual(catalog.length, 63);
    const names = new Set();
    for (const c of catalog) {
        assert.ok(['matching_ok', 'provisional', 'disabled'].includes(c.verification_status), c.name);
        assert.ok(!names.has(c.name), `duplicate ${c.name}`);
        names.add(c.name);
        const palaces = c.logic_conditions?.required_palaces || [];
        assert.ok(!palaces.includes('Tý') && !palaces.includes('Tỵ'), `chi alias ${c.name}`);
        if (c.verification_status !== 'disabled') {
            const hasLogic = (c.logic_conditions?.required_stars || []).length > 0
                || c.logic_conditions?.require_no_major_at_menh
                || (c.logic_conditions?.require_ham || []).length > 0;
            assert.ok(hasLogic, `no conditions ${c.name}`);
        }
        if (c.type === 'hung_bai_cach') {
            const blob = `${c.description} ${c.interpretations?.[0]?.content || ''}`;
            assert.ok(!/sớm mất|quyên sinh|mất mạng/.test(blob), `absolute claim ${c.name}`);
        }
    }
    console.log('catalog integrity passed');
}

function testEachComboHasPosNegOrDisabled() {
    const counts = Object.fromEntries(catalog.map((c) => [c.name, 0]));
    let n = 0;
    for (let can = 0; can < 10; can += 2) {
        for (let chi = 1; chi <= 12; chi += 2) {
            if ((can % 2) !== ((chi - 1) % 2)) continue;
            for (const month of [1, 6, 11]) {
                for (const hour of [1, 6, 12]) {
                    const ctx = chartContext(can, chi, 15, month, hour, 1);
                    const hit = namesOf(matchCombinations(ctx, catalog));
                    n += 1;
                    hit.forEach((name) => { counts[name] += 1; });
                }
            }
        }
    }
    for (const c of catalog) {
        if (c.verification_status === 'disabled') {
            assert.strictEqual(counts[c.name], 0, c.name);
            continue;
        }
        // matching_ok and many provisional should have both hit and miss in sample
        if (c.verification_status === 'matching_ok') {
            assert.ok(counts[c.name] < n, `${c.name} must have a miss`);
        }
    }
    console.log(`per-combo sample n=${n} passed`);
}

function testDisclaimerOnHung() {
    const ctx = chartContext(0, 1, 1, 1, 1, 1);
    const hung = matchCombinations(ctx, catalog).filter((m) => m.type === 'hung_bai_cach');
    for (const m of hung) {
        assert.ok(m.disclaimer && m.disclaimer.includes('không phải kết luận'), m.name);
    }
    console.log('hung disclaimer passed');
}

testInvalidInput();
testNeverTrueOnEmpty();
testDisabledUnsupported();
testPhiemThuyPositiveNegative();
testVoChinhDieu();
testTuPhuDongCung();
testHamDiaNotEverywhere();
testDangerousNotUniversal();
testCatalogIntegrity();
testEachComboHasPosNegOrDisabled();
testDisclaimerOnHung();
console.log('All combination tests passed');
