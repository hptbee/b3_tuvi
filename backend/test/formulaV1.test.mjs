import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import { nhiHop as relationNhiHop } from '../src/engine/palaceRelation.js';
import { normalizeChi } from '../src/engine/starNames.js';
import {
    branchIn,
    nhiHop,
    oppositePalace,
    tamHop,
    tamPhuongTuChinh
} from '../src/engine/formulaRelations.js';
import { FORMULAS, formulaInventory, resolveRuntime } from '../src/data/formulaV1.mjs';
import catalog from '../src/data/combinations.json' with { type: 'json' };
import rulesV2 from '../src/data/rulesV2.json' with { type: 'json' };

const CHI = ['', 'Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const covered = new Set();

function chart(menh = 1) {
    const boxes = {};
    for (let i = 1; i <= 12; i += 1) {
        boxes[i] = {
            chiName: CHI[i],
            cungName: i === menh ? 'MỆNH' : 'PHÚC ĐỨC',
            majorStars: [],
            goodStars: [],
            badStars: []
        };
    }
    return { boxes, menhIndex: menh, menhChi: CHI[menh] };
}

function label(ctx, index, cungName) {
    ctx.boxes[index].cungName = index === ctx.menhIndex ? `MỆNH/${cungName}` : cungName;
    if (cungName === 'MỆNH') ctx.boxes[index].cungName = 'MỆNH';
    return ctx;
}

function find(ctx, name, options) {
    return matchCombinations(ctx, catalog, options).find((item) => item.name === name) || null;
}

function natal(can, chi, day, month, hour) {
    const tv = calculateTuVi(can, chi, day, month, hour, 1, false);
    return {
        boxes: tv.boxes,
        menhIndex: tv.menh,
        menhChi: tv.boxes[tv.menh].chiName,
        before: JSON.stringify(tv.boxes)
    };
}

function must(ctx, name, options) {
    covered.add(name);
    const hit = find(ctx, name, options);
    assert.ok(hit, name);
    assert.strictEqual(hit.expertVerified, false);
    assert.strictEqual(hit.formulaVersion, 's9-v1');
    assert.ok(hit.catalogId);
    assert.ok(hit.sourceProfile);
    assert.ok(hit.sourceRef);
    assert.strictEqual(hit.formationStatus, 'matched');
    assert.ok(hit.identityStatus);
    assert.strictEqual(typeof hit.publicInterpretationAllowed, 'boolean');
    assert.ok(hit.evidence?.stars);
    return hit;
}

function miss(ctx, name, options) {
    covered.add(name);
    assert.strictEqual(find(ctx, name, options), null, name);
}

function testInventory() {
    const inventory = formulaInventory();
    assert.strictEqual(inventory.total, 63);
    assert.strictEqual(inventory.stateSum, 63);
    assert.strictEqual(catalog.length, 63);
    assert.strictEqual(FORMULAS.length, 63);
    const states = new Set(['ACTIVE', 'VARIANT', 'INTERNAL_ONLY', 'DISABLED']);
    FORMULAS.forEach((entry) => {
        assert.ok(states.has(entry.engineeringState), entry.combination);
        assert.strictEqual(entry.expertVerified, false);
        assert.ok(catalog.some((item) => item.name === entry.combination), entry.combination);
    });
    assert.strictEqual(inventory.missingRules.length, 5);
    assert.strictEqual(rulesV2.length, 58);
    inventory.missingRules.forEach((name) => {
        assert.ok(!rulesV2.some((rule) => rule.combination === name), name);
    });
    assert.strictEqual(inventory.unimplementedSupported, 0);
    console.log(`inventory ${JSON.stringify(inventory.byState)} public=${inventory.publicEligible} executable=${inventory.executable}`);
}

function testBranchHelpers() {
    assert.strictEqual(normalizeChi('Tý'), 'Tí');
    assert.strictEqual(normalizeChi('Tỵ'), 'Tị');
    assert.notStrictEqual(normalizeChi('Tý'), normalizeChi('Tỵ'));
    assert.ok(branchIn('Tý', ['Tí']));
    assert.ok(!branchIn('Tỵ', ['Tí']));
    assert.strictEqual(nhiHop(1), 2);
    assert.strictEqual(nhiHop(3), 12);
    assert.strictEqual(oppositePalace(1), 7);
    assert.deepStrictEqual(tamHop(3), [3, 7, 11]);
    assert.deepStrictEqual(tamPhuongTuChinh(3), [3, 7, 11, 9]);
    console.log('branch helpers passed');
}

function testMajorFormations() {
    const dong = chart(3);
    dong.boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    const dongHit = must(dong, 'Tử Phủ Đồng Cung');
    assert.strictEqual(dongHit.gradeStatus, 'not_certified');
    dong.boxes[3].majorStars = ['Tử Vi (M)'];
    miss(dong, 'Tử Phủ Đồng Cung');
    dong.boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    dong.menhIndex = 1;
    dong.menhChi = 'Tí';
    dong.boxes[1].cungName = 'MỆNH';
    dong.boxes[3].cungName = 'PHÚC ĐỨC';
    miss(dong, 'Tử Phủ Đồng Cung');
    miss(chart(3), 'Tử Phủ Đồng Cung', { profile: 'modern-108s' });

    const vu = chart(3);
    vu.boxes[3].majorStars = ['Tử Vi (M)'];
    vu.boxes[7].majorStars = ['Thiên Phủ (M)'];
    vu.boxes[11].majorStars = ['Vũ Khúc (V)'];
    vu.boxes[9].majorStars = ['Thiên Tướng (M)'];
    must(vu, 'Tử Phủ Vũ Tướng');
    vu.boxes[9].majorStars = [];
    miss(vu, 'Tử Phủ Vũ Tướng');
    vu.boxes[4].majorStars = ['Thiên Tướng (M)'];
    miss(vu, 'Tử Phủ Vũ Tướng');
    miss(chart(3), 'Tử Phủ Vũ Tướng', { profile: 'tan-bien' });

    const co = chart(3);
    co.boxes[3].majorStars = ['Thiên Cơ (M)'];
    co.boxes[7].majorStars = ['Thái Âm (M)'];
    co.boxes[11].majorStars = ['Thiên Đồng (V)', 'Thiên Lương (V)'];
    must(co, 'Cơ Nguyệt Đồng Lương');
    co.boxes[11].majorStars = ['Thiên Đồng (V)'];
    co.boxes[9].majorStars = ['Thiên Lương (V)'];
    miss(co, 'Cơ Nguyệt Đồng Lương');
    miss(co, 'Cơ Nguyệt Đồng Lương', { profile: 'tan-bien' });

    const sat = chart(3);
    sat.boxes[3].majorStars = ['Thất Sát (M)'];
    sat.boxes[7].majorStars = ['Phá Quân (M)'];
    sat.boxes[11].majorStars = ['Tham Lang (M)'];
    must(sat, 'Sát Phá Tham');
    sat.boxes[11].majorStars = [];
    sat.boxes[9].majorStars = ['Tham Lang (M)'];
    miss(sat, 'Sát Phá Tham');

    const cu = chart(1);
    cu.boxes[1].majorStars = ['Cự Môn (V)', 'Thái Dương (M)'];
    must(cu, 'Cự Nhật Đồng Cung');
    cu.boxes[1].majorStars = ['Cự Môn (V)'];
    miss(cu, 'Cự Nhật Đồng Cung');

    const duong = chart(4);
    duong.boxes[4].majorStars = ['Thái Dương (M)', 'Thiên Lương (M)'];
    duong.boxes[4].goodStars = ['Văn Xương', 'Hóa Lộc'];
    const duongHit = must(duong, 'Dương Lương Xương Lộc');
    assert.strictEqual(duongHit.gradeStatus, 'not_certified');
    duong.boxes[4].goodStars = ['Văn Xương', 'Hóa Lộc', 'Lộc Tồn'];
    must(duong, 'Dương Lương Xương Lộc');
    duong.boxes[4].goodStars = ['Văn Xương'];
    miss(duong, 'Dương Lương Xương Lộc');
    const duongWrong = chart(5);
    duongWrong.boxes[5].majorStars = ['Thái Dương (M)', 'Thiên Lương (M)'];
    duongWrong.boxes[5].goodStars = ['Văn Xương', 'Hóa Lộc'];
    miss(duongWrong, 'Dương Lương Xương Lộc');

    const nguyet = chart(12);
    nguyet.boxes[12].majorStars = ['Thái Âm (M)'];
    must(nguyet, 'Nguyệt Lãng Thiên Môn');
    nguyet.boxes[12].majorStars = [];
    miss(nguyet, 'Nguyệt Lãng Thiên Môn');

    const loi = chart(4);
    loi.boxes[4].majorStars = ['Thái Dương (M)'];
    must(loi, 'Nhật Chiếu Lôi Môn');
    const loiWrong = chart(5);
    loiWrong.boxes[5].majorStars = ['Thái Dương (M)'];
    miss(loiWrong, 'Nhật Chiếu Lôi Môn');

    const tham = chart(2);
    tham.boxes[2].majorStars = ['Tham Lang (M)', 'Vũ Khúc (V)'];
    must(tham, 'Tham Vũ Đồng Hành');
    miss(tham, 'Tham Vũ Đồng Hành', { profile: 'modern-108s' });
    tham.boxes[2].majorStars = ['Tham Lang (M)'];
    miss(tham, 'Tham Vũ Đồng Hành');
    const thamOpp = chart(5);
    thamOpp.boxes[5].majorStars = ['Vũ Khúc (V)'];
    thamOpp.boxes[11].majorStars = ['Tham Lang (M)'];
    must(thamOpp, 'Tham Vũ Đồng Hành', { profile: 'modern-108s' });
    miss(thamOpp, 'Tham Vũ Đồng Hành');

    const hoa = chart(2);
    hoa.boxes[2].majorStars = ['Tham Lang (M)'];
    hoa.boxes[2].badStars = ['Hỏa Tinh'];
    must(hoa, 'Hỏa Tham');
    hoa.boxes[2].badStars = [];
    hoa.boxes[8].badStars = ['Hỏa Tinh'];
    miss(hoa, 'Hỏa Tham');
    must(hoa, 'Hỏa Tham', { profile: 'opposite-weaker' });
    hoa.boxes[8].badStars = [];
    hoa.boxes[6].badStars = ['Hỏa Tinh'];
    miss(hoa, 'Hỏa Tham', { profile: 'opposite-weaker' });

    const linh = chart(2);
    linh.boxes[2].majorStars = ['Tham Lang (M)'];
    linh.boxes[2].badStars = ['Linh Tinh'];
    must(linh, 'Linh Tham');
    linh.boxes[2].majorStars = ['Tham Lang (M)', 'Thiên Đồng (V)'];
    miss(linh, 'Linh Tham');

    const thach = chart(1);
    thach.boxes[1].majorStars = ['Cự Môn (V)'];
    const thachBasic = must(thach, 'Thạch Trung Ẩn Ngọc');
    assert.strictEqual(thachBasic.gradeStatus, 'not_met');
    thach.boxes[1].goodStars = ['Hóa Lộc'];
    assert.strictEqual(must(thach, 'Thạch Trung Ẩn Ngọc').gradeStatus, 'met');
    thach.boxes[1].badStars = ['Hóa Kỵ'];
    assert.strictEqual(must(thach, 'Thạch Trung Ẩn Ngọc').gradeStatus, 'not_met');
    const thachNgo = chart(7);
    thachNgo.boxes[7].majorStars = ['Cự Môn (V)'];
    assert.strictEqual(must(thachNgo, 'Thạch Trung Ẩn Ngọc').gradeStatus, 'not_met');
    thach.boxes[1].majorStars = [];
    miss(thach, 'Thạch Trung Ẩn Ngọc');

    const ky = chart(3);
    ky.boxes[3].goodStars = ['Hóa Lộc'];
    ky.boxes[7].goodStars = ['Hóa Quyền'];
    ky.boxes[11].goodStars = ['Hóa Khoa'];
    must(ky, 'Tam Kỳ Gia Hội');
    ky.boxes[11].goodStars = [];
    miss(ky, 'Tam Kỳ Gia Hội');
    console.log('major formations passed');
}

function testLocAndSpecial() {
    const chau = chart(1);
    chau.boxes[1].majorStars = ['Thái Âm (M)'];
    must(chau, 'Minh Châu Xuất Hải');
    chau.boxes[1].majorStars = ['Thái Dương (M)'];
    miss(chau, 'Minh Châu Xuất Hải');
    const legacy = chart(8);
    legacy.boxes[8].majorStars = [];
    legacy.boxes[12].majorStars = ['Thái Âm (M)'];
    legacy.boxes[4].majorStars = ['Thái Dương (V)'];
    miss(legacy, 'Minh Châu Xuất Hải');
    must(legacy, 'Minh Châu Xuất Hải', { profile: 'b3-legacy' });
    miss(legacy, 'Minh Châu Xuất Hải', { profile: 'tan-bien' });
    const song = chart(3);
    label(song, 7, 'TÀI BẠCH');
    label(song, 11, 'QUAN LỘC');
    song.boxes[7].goodStars = ['Hóa Lộc'];
    song.boxes[11].goodStars = ['Lộc Tồn'];
    must(song, 'Song Lộc Triều Viên');
    song.boxes[3].goodStars = ['Hóa Lộc'];
    song.boxes[7].goodStars = [];
    miss(song, 'Song Lộc Triều Viên');
    song.boxes[3].goodStars = [];
    song.boxes[7].goodStars = ['Hóa Lộc', 'Lộc Tồn'];
    song.boxes[11].goodStars = [];
    miss(song, 'Song Lộc Triều Viên');

    const khoa = chart(1);
    khoa.boxes[1].goodStars = ['Hóa Khoa'];
    khoa.boxes[2].goodStars = ['Hóa Lộc'];
    must(khoa, 'Khoa Minh Lộc Ám');
    khoa.boxes[1].goodStars = ['Lộc Tồn'];
    khoa.boxes[2].goodStars = ['Hóa Khoa'];
    must(khoa, 'Khoa Minh Lộc Ám');
    khoa.boxes[2].goodStars = [];
    miss(khoa, 'Khoa Minh Lộc Ám');
    khoa.boxes[1].goodStars = ['Hóa Khoa'];
    khoa.boxes[7].goodStars = ['Hóa Lộc'];
    miss(khoa, 'Khoa Minh Lộc Ám');

    const locMa = chart(1);
    locMa.boxes[7].goodStars = ['Lộc Tồn'];
    locMa.boxes[1].goodStars = ['Thiên Mã'];
    must(locMa, 'Lộc Mã Giao Trì');
    locMa.boxes[7].goodStars = [];
    locMa.boxes[1].goodStars = ['Thiên Mã', 'Lộc Tồn'];
    miss(locMa, 'Lộc Mã Giao Trì');
    must(locMa, 'Lộc Mã Giao Trì', { profile: 'same-palace' });
    miss(locMa, 'Lộc Mã Giao Trì', { profile: 'tan-bien' });

    const linh = chart(5);
    linh.boxes[5].majorStars = ['Vũ Khúc (V)'];
    linh.boxes[11].majorStars = ['Tham Lang (M)'];
    linh.boxes[5].goodStars = ['Văn Xương'];
    linh.boxes[5].badStars = ['Linh Tinh', 'Đà La'];
    must(linh, 'Linh Xương Đà Vũ');
    linh.boxes[5].majorStars = ['Vũ Khúc (V)', 'Thiên Cơ (M)'];
    miss(linh, 'Linh Xương Đà Vũ');
    linh.boxes[5].majorStars = ['Vũ Khúc (V)'];
    linh.boxes[11].majorStars = [];
    miss(linh, 'Linh Xương Đà Vũ');

    const ly = chart(1);
    ly.boxes[1].badStars = ['Địa Không', 'Địa Kiếp'];
    must(ly, 'Mệnh Lý Phùng Không');
    ly.boxes[1].badStars = ['Địa Không'];
    miss(ly, 'Mệnh Lý Phùng Không');
    ly.boxes[6].badStars = ['Địa Kiếp'];
    miss(ly, 'Mệnh Lý Phùng Không');

    const hiep = chart(5);
    hiep.boxes[5].goodStars = ['Lộc Tồn'];
    hiep.boxes[5].badStars = ['Hóa Kỵ'];
    hiep.boxes[4].badStars = ['Kình Dương'];
    hiep.boxes[6].badStars = ['Đà La'];
    must(hiep, 'Kình Đà Hiệp Kỵ');
    hiep.boxes[5].badStars = [];
    hiep.boxes[11].badStars = ['Hóa Kỵ'];
    hiep.boxes[5].majorStars = [];
    must(hiep, 'Kình Đà Hiệp Kỵ');
    hiep.boxes[5].goodStars = [];
    miss(hiep, 'Kình Đà Hiệp Kỵ');

    const ma = chart(1);
    ma.boxes[1].goodStars = ['Thiên Mã'];
    ma.boxes[1].isTuan = true;
    must(ma, 'Mã Lạc Không Vong');
    ma.boxes[1].isTuan = false;
    ma.boxes[1].badStars = ['Địa Không'];
    miss(ma, 'Mã Lạc Không Vong');
    must(ma, 'Mã Lạc Không Vong', { profile: 'modern-108s' });
    ma.boxes[1].badStars = [];
    ma.boxes[6].badStars = ['Địa Không'];
    miss(ma, 'Mã Lạc Không Vong', { profile: 'modern-108s' });

    const cuHoa = chart(1);
    cuHoa.boxes[1].majorStars = ['Cự Môn (V)'];
    cuHoa.boxes[1].badStars = ['Hỏa Tinh', 'Kình Dương'];
    cuHoa.boxes[7].badStars = ['Đà La'];
    miss(cuHoa, 'Cự Hỏa Kình Dương');
    const cuHit = must(cuHoa, 'Cự Hỏa Kình Dương', { includeNonPublic: true });
    assert.strictEqual(cuHit.publicInterpretationAllowed, false);
    assert.ok(!/chết|tự tử|sinh tử/.test(cuHit.summary));
    cuHoa.boxes[7].badStars = [];
    miss(cuHoa, 'Cự Hỏa Kình Dương', { includeNonPublic: true });

    const phiem = chart(1);
    phiem.boxes[1].majorStars = ['Tham Lang (M)'];
    phiem.boxes[1].badStars = ['Kình Dương'];
    must(phiem, 'Phiếm Thủy Đào Hoa');
    phiem.boxes[1].badStars = [];
    miss(phiem, 'Phiếm Thủy Đào Hoa');
    const phiemWrong = chart(4);
    phiemWrong.boxes[4].majorStars = ['Tham Lang (M)'];
    phiemWrong.boxes[4].badStars = ['Đà La'];
    miss(phiemWrong, 'Phiếm Thủy Đào Hoa');

    const phong = chart(3);
    phong.boxes[3].majorStars = ['Tham Lang (M)'];
    phong.boxes[3].badStars = ['Đà La'];
    must(phong, 'Phong Lưu Thái Trượng');
    const than = chart(9);
    than.boxes[9].majorStars = ['Tham Lang (M)'];
    than.boxes[9].badStars = ['Đà La'];
    miss(than, 'Phong Lưu Thái Trượng');

    const tang = chart(1);
    tang.boxes[1].majorStars = ['Thái Dương (H)', 'Cự Môn (H)'];
    must(tang, 'Nhật Nguyệt Tàng Huy');
    tang.boxes[1].majorStars = ['Thái Dương (H)', 'Thái Âm (H)'];
    miss(tang, 'Nhật Nguyệt Tàng Huy');
    const tangMoon = chart(7);
    tangMoon.boxes[7].majorStars = ['Thái Âm (H)', 'Cự Môn (H)'];
    must(tangMoon, 'Nhật Nguyệt Tàng Huy');

    const vcd = chart(4);
    must(vcd, 'Mệnh Vô Chính Diệu');
    vcd.boxes[4].majorStars = ['Tử Vi (M)'];
    miss(vcd, 'Mệnh Vô Chính Diệu');

    const am = chart(1);
    am.boxes[1].majorStars = ['Tử Vi (M)'];
    am.boxes[1].goodStars = ['Lộc Tồn'];
    am.boxes[2].goodStars = ['Hóa Lộc'];
    must(am, 'Ám Lộc');
    am.boxes[1].goodStars = ['Hóa Lộc'];
    am.boxes[2].goodStars = ['Lộc Tồn'];
    must(am, 'Ám Lộc');
    am.boxes[1].majorStars = ['Tử Vi (H)'];
    miss(am, 'Ám Lộc');
    am.boxes[1].majorStars = ['Tử Vi (M)'];
    am.boxes[2].goodStars = [];
    miss(am, 'Ám Lộc');
    console.log('lộc and special formations passed');
}

function testCourtyardAndRest() {
    const trieu = chart(3);
    trieu.boxes[3].majorStars = ['Tử Vi (M)'];
    trieu.boxes[9].majorStars = ['Thiên Phủ (M)'];
    must(trieu, 'Tử Phủ Triều Viên');
    trieu.boxes[3].majorStars = ['Tử Vi (H)'];
    miss(trieu, 'Tử Phủ Triều Viên');
    trieu.boxes[3].majorStars = ['Thiên Cơ (M)'];
    trieu.boxes[7].majorStars = ['Tử Vi (M)'];
    trieu.boxes[9].majorStars = ['Thiên Phủ (M)'];
    miss(trieu, 'Tử Phủ Triều Viên');
    must(trieu, 'Tử Phủ Triều Viên', { profile: 'modern-broader' });

    const at = chart(3);
    at.boxes[7].goodStars = ['Thiên Khôi'];
    at.boxes[11].goodStars = ['Thiên Việt'];
    must(at, 'Thiên Ất Củng Mệnh');
    at.boxes[11].goodStars = [];
    miss(at, 'Thiên Ất Củng Mệnh');
    at.boxes[4].goodStars = ['Thiên Việt'];
    miss(at, 'Thiên Ất Củng Mệnh');

    const ta = chart(2);
    ta.boxes[2].goodStars = ['Tả Phù', 'Hữu Bật'];
    const taHit = must(ta, 'Tả Hữu Đồng Cung');
    assert.strictEqual(taHit.gradeStatus, 'not_certified');
    ta.boxes[2].goodStars = ['Tả Phù'];
    miss(ta, 'Tả Hữu Đồng Cung');

    const van = chart(3);
    van.boxes[7].goodStars = ['Văn Xương'];
    van.boxes[11].goodStars = ['Văn Khúc'];
    const vanHit = must(van, 'Văn Tinh Củng Mệnh');
    assert.strictEqual(vanHit.gradeStatus, 'met');
    van.boxes[7].badStars = ['Kình Dương'];
    assert.strictEqual(must(van, 'Văn Tinh Củng Mệnh').gradeStatus, 'not_met');
    van.boxes[11].goodStars = [];
    miss(van, 'Văn Tinh Củng Mệnh');

    const dong = chart(2);
    dong.boxes[8].majorStars = ['Thái Dương (M)', 'Thái Âm (M)'];
    must(dong, 'Nhật Nguyệt Đồng Lâm');
    miss(dong, 'Nhật Nguyệt Đồng Lâm', { profile: 'modern-108s' });
    dong.boxes[8].majorStars = [];
    dong.boxes[2].majorStars = ['Thái Dương (M)', 'Thái Âm (M)'];
    miss(dong, 'Nhật Nguyệt Đồng Lâm');
    must(dong, 'Nhật Nguyệt Đồng Lâm', { profile: 'modern-108s' });

    const tho = chart(1);
    tho.boxes[1].majorStars = ['Thiên Lương (M)'];
    const thoHit = must(tho, 'Thọ Tinh Nhập Miếu');
    assert.strictEqual(thoHit.gradeStatus, 'not_certified');
    const thoWrong = chart(4);
    thoWrong.boxes[4].majorStars = ['Thiên Lương (M)'];
    miss(thoWrong, 'Thọ Tinh Nhập Miếu');

    const anh = chart(1);
    anh.boxes[1].majorStars = ['Phá Quân (M)'];
    anh.boxes[7].majorStars = ['Liêm Trinh (V)', 'Thiên Tướng (M)'];
    const anhHit = must(anh, 'Anh Tinh Nhập Miếu');
    assert.strictEqual(anhHit.gradeStatus, 'not_certified');
    anh.boxes[7].majorStars = ['Liêm Trinh (V)'];
    miss(anh, 'Anh Tinh Nhập Miếu');

    const kinh = chart(2);
    kinh.boxes[2].badStars = ['Kình Dương'];
    const kinhHit = must(kinh, 'Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)');
    assert.strictEqual(kinhHit.evidence.displayIdentity, 'Kình Dương Nhập Miếu');
    assert.strictEqual(kinhHit.evidence.notASynonymOf, 'Mã Đầu Đới Tiễn');
    const ngo = chart(7);
    ngo.boxes[7].badStars = ['Kình Dương'];
    ngo.boxes[7].majorStars = ['Thất Sát (M)', 'Tham Lang (M)'];
    miss(ngo, 'Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)');

    const de = chart(3);
    de.boxes[3].goodStars = ['Hóa Khoa', 'Hóa Quyền'];
    const deHit = must(de, 'Giáp Đệ Đăng Khoa');
    assert.strictEqual(deHit.gradeStatus, 'not_certified');
    de.boxes[3].goodStars = ['Hóa Khoa'];
    de.boxes[2].goodStars = ['Hóa Quyền'];
    miss(de, 'Giáp Đệ Đăng Khoa');

    const tat = chart(1);
    label(tat, 8, 'TẬT ÁCH');
    tat.boxes[8].majorStars = ['Thái Dương (H)', 'Thái Âm (H)'];
    must(tat, 'Nhật Nguyệt Tật Ách');
    tat.boxes[8].majorStars = ['Thái Dương (H)'];
    tat.boxes[8].badStars = ['Hóa Kỵ'];
    miss(tat, 'Nhật Nguyệt Tật Ách');

    const khuc = chart(1);
    khuc.boxes[1].majorStars = ['Cự Môn (V)'];
    khuc.boxes[1].goodStars = ['Văn Khúc'];
    miss(khuc, 'Khúc Ám Đồng Cung');
    const khucHit = must(khuc, 'Khúc Ám Đồng Cung', { includeNonPublic: true });
    assert.strictEqual(khucHit.publicInterpretationAllowed, false);
    khuc.boxes[7].goodStars = ['Văn Khúc'];
    khuc.boxes[1].goodStars = [];
    miss(khuc, 'Khúc Ám Đồng Cung', { includeNonPublic: true });

    const coTy = chart(6);
    coTy.boxes[6].majorStars = ['Thiên Cơ (M)'];
    coTy.boxes[12].majorStars = ['Thái Âm (M)'];
    must(coTy, 'Thiên Cơ Tỵ Hợi');
    coTy.boxes[6].majorStars = ['Thiên Cơ (M)', 'Thiên Đồng (V)'];
    miss(coTy, 'Thiên Cơ Tỵ Hợi');
    coTy.boxes[6].majorStars = ['Thiên Cơ (M)'];
    coTy.boxes[12].majorStars = [];
    coTy.boxes[6].majorStars = ['Thiên Cơ (M)', 'Thái Âm (M)'];
    miss(coTy, 'Thiên Cơ Tỵ Hợi');

    const phu = chart(3);
    phu.boxes[3].majorStars = ['Thiên Phủ (M)'];
    phu.boxes[9].majorStars = ['Thiên Tướng (M)'];
    must(phu, 'Phủ Tướng Triều Viên');
    phu.boxes[3].majorStars = ['Thiên Phủ (H)'];
    miss(phu, 'Phủ Tướng Triều Viên');
    phu.boxes[3].majorStars = [];
    phu.boxes[7].majorStars = ['Thiên Phủ (M)'];
    miss(phu, 'Phủ Tướng Triều Viên');

    const le = chart(7);
    le.boxes[7].majorStars = ['Thái Dương (H)'];
    const leHit = must(le, 'Nhật Lệ Trung Thiên');
    assert.strictEqual(leHit.gradeStatus, 'not_certified');
    const leWrong = chart(8);
    leWrong.boxes[8].majorStars = ['Thái Dương (H)'];
    miss(leWrong, 'Nhật Lệ Trung Thiên');

    const giapKhong = chart(5);
    giapKhong.boxes[4].badStars = ['Địa Không'];
    giapKhong.boxes[6].badStars = ['Địa Kiếp'];
    must(giapKhong, 'Không Kiếp Giáp Mệnh');
    giapKhong.boxes[6].badStars = [];
    giapKhong.boxes[4].badStars = ['Địa Không', 'Địa Kiếp'];
    miss(giapKhong, 'Không Kiếp Giáp Mệnh');

    const giapKinh = chart(5);
    giapKinh.boxes[4].badStars = ['Đà La'];
    giapKinh.boxes[6].badStars = ['Kình Dương'];
    must(giapKinh, 'Kình Đà Giáp Mệnh');
    giapKinh.boxes[4].badStars = [];
    miss(giapKinh, 'Kình Đà Giáp Mệnh');

    const que = chart(1);
    que.boxes[1].majorStars = ['Thái Âm (M)'];
    must(que, 'Thủy Trừng Quế Ngạc');
    que.boxes[1].majorStars = ['Thái Âm (M)', 'Thiên Đồng (M)'];
    must(que, 'Thủy Trừng Quế Ngạc');
    que.boxes[1].majorStars = ['Thiên Đồng (M)'];
    miss(que, 'Thủy Trừng Quế Ngạc');

    const dongLuong = chart(6);
    dongLuong.boxes[6].majorStars = ['Thiên Đồng (M)'];
    dongLuong.boxes[12].majorStars = ['Thiên Lương (M)'];
    must(dongLuong, 'Đồng Lương Tỵ Hợi');
    dongLuong.boxes[6].majorStars = ['Thiên Lương (M)'];
    dongLuong.boxes[12].majorStars = ['Thiên Đồng (M)'];
    miss(dongLuong, 'Đồng Lương Tỵ Hợi');

    const coCu = chart(4);
    coCu.boxes[4].majorStars = ['Thiên Cơ (M)', 'Cự Môn (V)'];
    must(coCu, 'Cơ Cự Đồng Lâm');
    coCu.boxes[4].majorStars = ['Thiên Cơ (M)'];
    miss(coCu, 'Cơ Cự Đồng Lâm');
    console.log('courtyard and remaining formations passed');
}

function testCounterexamples() {
    const satNgo = natal(0, 0, 3, 2, 10);
    miss(satNgo, 'Thất Sát Triều Đẩu');
    const satThan = natal(0, 0, 4, 1, 7);
    must(satThan, 'Thất Sát Triều Đẩu');
    const quan = chart(3);
    label(quan, 9, 'QUAN LỘC');
    quan.boxes[9].majorStars = ['Thất Sát (M)'];
    quan.boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    must(quan, 'Thất Sát Triều Đẩu');
    miss(quan, 'Thất Sát Triều Đẩu', { profile: 'modern-108s' });
    const before = satThan.before;
    matchCombinations(satThan, catalog, { profile: 'modern-108s' });
    matchCombinations(satThan, catalog, { profile: 'tan-bien' });
    assert.strictEqual(JSON.stringify(satThan.boxes), before);

    const tinh = chart(2);
    tinh.boxes[7].majorStars = ['Thái Dương (M)'];
    tinh.boxes[1].majorStars = ['Thái Âm (M)'];
    miss(tinh, 'Nhật Nguyệt Tịnh Minh');
    tinh.boxes[7].majorStars = [];
    tinh.boxes[1].majorStars = [];
    tinh.boxes[6].majorStars = ['Thái Dương (H)'];
    tinh.boxes[10].majorStars = ['Thái Âm (H)'];
    must(tinh, 'Nhật Nguyệt Tịnh Minh');

    const tuong = chart(1);
    tuong.boxes[1].majorStars = ['Thiên Tướng (M)'];
    miss(tuong, 'Hình Tù Giáp Ấn');
    miss(tuong, 'Hình Kỵ Giáp Ấn');
    tuong.boxes[1].majorStars = ['Liêm Trinh (M)', 'Thiên Tướng (M)'];
    tuong.boxes[1].badStars = ['Kình Dương'];
    miss(tuong, 'Hình Tù Giáp Ấn');
    const tu108 = must(tuong, 'Hình Tù Giáp Ấn', { profile: 'modern-108s' });
    miss(tuong, 'Hình Kỵ Giáp Ấn', { profile: 'school-kinh-da-flank' });
    const flank = chart(5);
    flank.boxes[5].majorStars = ['Thiên Tướng (M)'];
    flank.boxes[4].badStars = ['Kình Dương'];
    flank.boxes[6].majorStars = ['Liêm Trinh (V)'];
    const tuTan = must(flank, 'Hình Tù Giáp Ấn');
    assert.notStrictEqual(tuTan.evidence.ruleId, tu108.evidence.ruleId);
    flank.boxes[6].majorStars = [];
    flank.boxes[6].badStars = ['Đà La'];
    miss(flank, 'Hình Tù Giáp Ấn');
    const ky = must(flank, 'Hình Kỵ Giáp Ấn', { profile: 'school-kinh-da-flank' });
    assert.notStrictEqual(ky.evidence.ruleId, tuTan.evidence.ruleId);
    assert.strictEqual(ky.publicInterpretationAllowed, true);

    const cu = chart(1);
    cu.boxes[1].majorStars = ['Cự Môn (V)'];
    cu.boxes[1].badStars = ['Kình Dương', 'Linh Tinh', 'Địa Không'];
    must(cu, 'Cự Phùng Tứ Sát');
    cu.boxes[1].badStars = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'];
    miss(cu, 'Cự Phùng Tứ Sát');
    cu.boxes[1].badStars = ['Kình Dương', 'Hỏa Tinh', 'Địa Kiếp'];
    must(cu, 'Cự Phùng Tứ Sát');

    const hoa = chart(1);
    label(hoa, 5, 'PHU THÊ');
    hoa.boxes[5].goodStars = ['Hoa Cái'];
    must(hoa, 'Hoa Cái Cư Phu Thê');
    hoa.boxes[5].goodStars = [];
    hoa.boxes[1].badStars = ['Hóa Kỵ'];
    miss(hoa, 'Hoa Cái Cư Phu Thê');

    const quanThan = chart(3);
    quanThan.boxes[3].majorStars = ['Tử Vi (M)'];
    quanThan.boxes[3].goodStars = ['Tả Phù', 'Hữu Bật', 'Thiên Khôi', 'Thiên Việt'];
    miss(quanThan, 'Quân Thần Khánh Hội');
    quanThan.boxes[7].goodStars = ['Văn Xương', 'Văn Khúc', 'Long Trì', 'Phượng Các'];
    must(quanThan, 'Quân Thần Khánh Hội');
    quanThan.boxes[7].goodStars = ['Văn Xương', 'Văn Khúc', 'Long Trì'];
    miss(quanThan, 'Quân Thần Khánh Hội');

    const tam = chart(4);
    tam.boxes[4].isTuan = true;
    tam.boxes[4].isTriet = true;
    tam.boxes[4].badStars = ['Địa Không'];
    miss(tam, 'Mệnh VCD Đắc Tam Không');
    miss(tam, 'Mệnh VCD Đắc Tam Không', { includeNonPublic: true });
    tam.boxes[4].badStars = [];
    tam.boxes[10].goodStars = ['Thiên Không'];
    const tamHit = must(tam, 'Mệnh VCD Đắc Tam Không', { includeNonPublic: true });
    assert.strictEqual(tamHit.publicInterpretationAllowed, false);
    miss(tam, 'Mệnh VCD Đắc Tam Không');

    const lo = chart(1);
    lo.boxes[1].majorStars = ['Liêm Trinh (M)', 'Thất Sát (M)'];
    miss(lo, 'Lộ Bàng Mai Thi');
    const loHit = must(lo, 'Lộ Bàng Mai Thi', { includeNonPublic: true });
    assert.strictEqual(loHit.publicInterpretationAllowed, false);
    assert.ok(!/chết|tử vong/.test(loHit.summary));

    const disabledCharts = [
        ['Hùng Tú Triều Viên', (() => { const c = chart(3); c.boxes[3].majorStars = ['Liêm Trinh (M)']; return c; })()],
        ['Bán Không Chiết Xỉ', (() => { const c = chart(1); c.boxes[1].majorStars = ['Thất Sát (M)']; c.boxes[1].badStars = ['Địa Không', 'Địa Kiếp']; return c; })()],
        ['Tài Ấn Giao Trì', (() => { const c = chart(3); c.boxes[3].majorStars = ['Vũ Khúc (V)', 'Thiên Tướng (M)']; return c; })()],
        ['Đế Ngộ Hung Đồ', (() => { const c = chart(1); c.boxes[1].majorStars = ['Tử Vi (M)']; c.boxes[1].badStars = ['Kình Dương', 'Hỏa Tinh']; return c; })()],
        ['Lưỡng Trùng Thiên Mã', (() => { const c = chart(1); c.boxes[1].goodStars = ['Thiên Mã']; c.boxes[7].goodStars = ['Thiên Mã']; return c; })()],
        ['Cát Xứ Tàng Hung', (() => { const c = chart(1); c.boxes[1].badStars = ['Địa Kiếp']; c.boxes[1].isTriet = true; return c; })()],
        ['Chúng Thủy Triều Đông', (() => { const c = chart(4); c.boxes[4].badStars = ['Đại Hao', 'Tiểu Hao']; return c; })()],
        ['Lộc Phùng Xung Phá', (() => { const c = chart(1); c.boxes[1].goodStars = ['Lộc Tồn']; c.boxes[7].majorStars = ['Phá Quân (M)']; return c; })()]
    ];
    disabledCharts.forEach(([name, ctx]) => {
        miss(ctx, name);
        miss(ctx, name, { includeNonPublic: true });
        assert.strictEqual(resolveRuntime(FORMULAS.find((item) => item.combination === name)).evaluable, false);
    });
    console.log('counterexamples passed');
}

function testCoverageClosed() {
    assert.strictEqual(covered.size, 63, [...FORMULAS.map((item) => item.combination)].filter((name) => !covered.has(name)).join(','));
    const inventory = formulaInventory();
    const report = readFileSync(fileURLToPath(new URL('../../docs/knowledge/SPRINT_9_FINAL_IMPLEMENTATION_REPORT.md', import.meta.url)), 'utf8');
    const spec = readFileSync(fileURLToPath(new URL('../../docs/knowledge/SPRINT_9_FINAL_FORMULA_SPEC.md', import.meta.url)), 'utf8');
    const line = `COUNTS active=${inventory.byState.ACTIVE} variant=${inventory.byState.VARIANT} internal_only=${inventory.byState.INTERNAL_ONLY} disabled=${inventory.byState.DISABLED} sum=${inventory.stateSum} public_default=${inventory.publicEligible} executable=${inventory.executable} variant_implementations=${inventory.variantImplementations} unimplemented_supported=${inventory.unimplementedSupported} rules_v2_rows=58 missing_rules=${inventory.missingRules.length}`;
    assert.ok(report.includes(line), line);
    assert.strictEqual((report.match(/^\| \d+ \|/gm) || []).length, 63);
    assert.ok(spec.includes('s9-v1'));
    assert.strictEqual(inventory.stateSum, 63);
    assert.strictEqual(inventory.unimplementedSupported, 0);
    console.log('all 63 catalog entries covered');
}

function natalChart(can, chi, day, month, hour) {
    const tv = calculateTuVi(can, chi, day, month, hour, 1, false);
    return {
        boxes: tv.boxes,
        menhIndex: tv.menh,
        menhChi: tv.boxes[tv.menh].chiName
    };
}

function testIndependentNatalFixtures() {
    const editorial = natalChart(0, 0, 14, 1, 2);
    assert.strictEqual(editorial.menhChi, 'Sửu');
    must(editorial, 'Nhật Nguyệt Tịnh Minh');
    const unpaired = natalChart(3, 1, 14, 1, 8);
    assert.strictEqual(unpaired.menhChi, 'Mùi');
    miss(unpaired, 'Nhật Nguyệt Tịnh Minh');
    const samePalace = natalChart(0, 0, 6, 3, 4);
    assert.strictEqual(samePalace.menhChi, 'Sửu');
    miss(samePalace, 'Nhật Nguyệt Đồng Lâm');
    must(samePalace, 'Nhật Nguyệt Đồng Lâm', { profile: 'modern-108s' });
    const before = JSON.stringify(samePalace.boxes);
    matchCombinations(samePalace, catalog, { profile: 'modern-108s' });
    matchCombinations(samePalace, catalog, { profile: 'tan-bien-editorial' });
    assert.strictEqual(JSON.stringify(samePalace.boxes), before);

    const thach = natalChart(2, 0, 9, 1, 9);
    assert.strictEqual(thach.menhChi, 'Ngọ');
    const thachHit = must(thach, 'Thạch Trung Ẩn Ngọc');
    assert.strictEqual(thachHit.gradeStatus, 'not_met');
    const satNgo = natalChart(0, 0, 3, 2, 10);
    assert.strictEqual(satNgo.menhChi, 'Ngọ');
    miss(satNgo, 'Thất Sát Triều Đẩu');

    const both = chart(3);
    both.boxes[3].majorStars = ['Tử Vi (M)', 'Thiên Phủ (M)'];
    must(both, 'Tử Phủ Đồng Cung');
    miss(both, 'Tử Phủ Triều Viên');

    const quan = chart(3);
    label(quan, 9, 'QUAN LỘC');
    const partner = relationNhiHop(9);
    quan.boxes[9].goodStars = ['Hóa Khoa'];
    quan.boxes[partner].goodStars = ['Lộc Tồn'];
    must(quan, 'Khoa Minh Lộc Ám');
    quan.boxes[partner].goodStars = [];
    miss(quan, 'Khoa Minh Lộc Ám');

    const hoaKy = chart(5);
    hoaKy.boxes[5].majorStars = ['Thiên Tướng (M)'];
    hoaKy.boxes[5].badStars = ['Hóa Kỵ', 'Kình Dương'];
    miss(hoaKy, 'Hình Kỵ Giáp Ấn', { profile: 'school-tuong-hoa-ky', includeNonPublic: true });
    miss(hoaKy, 'Hình Tù Giáp Ấn');
    const leaked = matchCombinations(unpaired, catalog);
    leaked.forEach((hit) => {
        assert.notStrictEqual(hit.engineeringState, 'DISABLED');
        assert.notStrictEqual(hit.engineeringState, 'INTERNAL_ONLY');
        assert.strictEqual(hit.publicInterpretationAllowed, true);
        assert.strictEqual(hit.expertVerified, false);
    });
    console.log('independent natal fixtures passed');
}

testInventory();
testBranchHelpers();
testMajorFormations();
testLocAndSpecial();
testCourtyardAndRest();
testCounterexamples();
testIndependentNatalFixtures();
testCoverageClosed();
console.log('formula V1 tests passed');
