import assert from 'assert';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart, toLegacyBoxes } from '../src/engine/normalizeChart.js';
import { resolveStar, listCatalogStars } from '../src/engine/starCatalog.js';
import { STAR_COLORS } from '../src/engine/constants.js';
import {
    getPalaceAtBranch,
    getPalaceByFunction,
    getTamHopPalaces,
    getOppositePalace,
    hasStarAtPalace,
    queryStars
} from '../src/engine/chartQuery.js';
import { matchCombinations } from '../src/engine/combinationMatch.js';
import catalog from '../src/data/combinations.json' with { type: 'json' };

function starLines(boxes) {
    const lines = [];
    for (let i = 1; i <= 12; i += 1) {
        const box = boxes[i];
        lines.push([
            ...(box.majorStars || []),
            ...(box.goodStars || []),
            ...(box.badStars || []),
            ...(box.minorStars || [])
        ].join('|'));
    }
    return lines;
}

function chartOf(can, chi, day, month, hour, gender, leap = false) {
    return calculateTuVi(can, chi, day, month, hour, gender, leap);
}

function testCatalog() {
    const stars = listCatalogStars();
    assert.strictEqual(stars.length, Object.keys(STAR_COLORS).length + 1);
    assert.ok(stars.some((star) => star.displayName === 'Thiên Trù' && star.starId === 'thien_tru'));
    assert.strictEqual(new Set(stars.map((star) => star.starId)).size, stars.length);
    assert.notStrictEqual(
        stars.find((star) => star.displayName === 'Quan Phù').starId,
        stars.find((star) => star.displayName === 'Quan Phủ').starId
    );
    const tuVi = resolveStar('Tử Vi (M)');
    assert.strictEqual(tuVi.starId, 'tu_vi');
    assert.strictEqual(tuVi.canonicalName, 'Tử Vi');
    assert.strictEqual(tuVi.brightness, 'M');
    assert.strictEqual(tuVi.brightnessLabel, 'Miếu');
    assert.strictEqual(tuVi.element, 'Thổ');
    assert.notStrictEqual(tuVi.displayName, tuVi.canonicalName);
    const alias = resolveStar('Hỏa tinh');
    assert.strictEqual(alias.starId, 'hoa_tinh');
    const unknown = resolveStar('Sao Không Có (H)');
    assert.strictEqual(unknown.status, 'unknown');
    assert.strictEqual(unknown.starId, null);
    assert.strictEqual(unknown.brightness, 'H');
    const hoa = resolveStar('Hóa Lộc');
    assert.strictEqual(hoa.category, 'tu_hoa');
    assert.strictEqual(hoa.element, null);
    console.log('star catalog passed');
}

function testNoLoss(tuviInfo, lunarInfo) {
    const before = JSON.stringify(tuviInfo.boxes);
    const normalized = normalizeChart({ tuviInfo, lunarInfo, input: { hour: 1, gender: 1 } });
    assert.strictEqual(JSON.stringify(tuviInfo.boxes), before);
    assert.strictEqual(normalized.ok, true);
    assert.strictEqual(normalized.palaces.length, 12);
    assert.deepStrictEqual(starLines(tuviInfo.boxes), starLines(toLegacyBoxes(normalized)));
    const rawCount = starLines(tuviInfo.boxes).join('|').split('|').filter(Boolean).length;
    const normalizedCount = normalized.palaces.reduce((sum, palace) => sum + palace.stars.length, 0);
    assert.strictEqual(normalizedCount, rawCount);
    return normalized;
}

function testIdentity() {
    const tuviInfo = chartOf(2, 3, 1, 1, 1, 1);
    const normalized = testNoLoss(tuviInfo, { canIndex: 2, chiIndex: 3, canName: 'Bính', chiName: 'Dần' });
    assert.strictEqual(normalized.schoolId, 'vn-tam-hop-default');
    assert.strictEqual(normalized.menhPalaceId, String(tuviInfo.menh));
    const menh = getPalaceByFunction(normalized, 'menh');
    const than = getPalaceByFunction(normalized, 'than');
    assert.strictEqual(menh.branchId, tuviInfo.menh);
    assert.strictEqual(menh.functionId, 'menh');
    assert.strictEqual(than.isThan, true);
    assert.notStrictEqual(than.functionId, 'than');
    assert.ok(getPalaceAtBranch(normalized, tuviInfo.menh).isMenh);
    const hoaKhoa = normalized.palaces.flatMap((palace) => palace.stars).find((star) => star.starId === 'hoa_khoa');
    assert.ok(hoaKhoa);
    assert.strictEqual(hoaKhoa.association.type, 'tu_hoa');
    assert.strictEqual(hoaKhoa.association.sourceStarId, 'van_xuong');
    assert.ok(hasStarAtPalace(normalized, 'van_xuong', hoaKhoa.palaceId));
    assert.notStrictEqual(hoaKhoa.starId, hoaKhoa.association.sourceStarId);
    console.log('normalized identity passed');
}

function testUnknownKept() {
    const tuviInfo = chartOf(0, 1, 8, 4, 6, -1);
    tuviInfo.boxes[3].goodStars = [...tuviInfo.boxes[3].goodStars, 'Sao Lạ (Z)'];
    const normalized = normalizeChart({ tuviInfo });
    assert.strictEqual(normalized.unknownStars.length, 1);
    assert.strictEqual(normalized.unknownStars[0].displayName, 'Sao Lạ (Z)');
    assert.strictEqual(normalized.unknownStars[0].brightness, null);
    const kept = normalized.palaces[2].stars.find((star) => star.displayName === 'Sao Lạ (Z)');
    assert.strictEqual(kept.status, 'unknown');
    assert.strictEqual(kept.brightnessStatus, 'unparsed');
    console.log('unknown star kept passed');
}

function testRelationsOnChart() {
    const tuviInfo = chartOf(4, 5, 15, 6, 3, 1);
    const normalized = normalizeChart({ tuviInfo });
    const menhId = normalized.menhPalaceId;
    assert.strictEqual(getTamHopPalaces(normalized, menhId).length, 2);
    assert.ok(getOppositePalace(normalized, menhId));
    assert.notStrictEqual(getOppositePalace(normalized, menhId).id, menhId);
    const opposite = getOppositePalace(normalized, menhId);
    assert.strictEqual(getOppositePalace(normalized, opposite.id).id, menhId);
    console.log('chart query relations passed');
}

function testQuerySamePalace() {
    const tuviInfo = chartOf(0, 1, 20, 2, 8, 1);
    const normalized = normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0 } });
    const menhStars = queryStars(normalized, { palaceId: normalized.menhPalaceId, relation: 'same' });
    assert.ok(menhStars.length >= 1);
    menhStars.forEach((star) => assert.strictEqual(star.palaceId, normalized.menhPalaceId));
    console.log('query same palace passed');
}

function testRegressionSample() {
    const cases = [];
    for (let hour = 1; hour <= 12; hour += 1) {
        for (const gender of [1, -1]) {
            cases.push(chartOf(hour % 2 === 0 ? 0 : 1, hour % 2 === 0 ? 1 : 2, 9, hour, hour, gender));
        }
    }
    cases.push(chartOf(6, 1, 14, 4, 1, 1, true));
    cases.push(chartOf(6, 1, 15, 4, 1, -1, true));
    for (const tuviInfo of cases) {
        testNoLoss(tuviInfo, { canIndex: 0, chiIndex: 1 });
        const normalized = normalizeChart({ tuviInfo, lunarInfo: { canIndex: 0 } });
        const legacy = {
            boxes: toLegacyBoxes(normalized),
            menhIndex: Number(normalized.menhPalaceId),
            menhChi: getPalaceAtBranch(normalized, normalized.menhPalaceId).branchName
        };
        const raw = {
            boxes: tuviInfo.boxes,
            menhIndex: tuviInfo.menh,
            menhChi: tuviInfo.boxes[tuviInfo.menh].chiName
        };
        assert.deepStrictEqual(
            matchCombinations(legacy, catalog).map((item) => item.name),
            matchCombinations(raw, catalog).map((item) => item.name)
        );
    }
    console.log(`regression ${cases.length} charts passed`);
}

testCatalog();
testIdentity();
testUnknownKept();
testRelationsOnChart();
testQuerySamePalace();
testRegressionSample();
console.log('All normalize chart tests passed');
