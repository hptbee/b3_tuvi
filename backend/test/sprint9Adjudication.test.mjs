import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { compareReviews } from '../src/knowledge/crossReview.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const matrix = JSON.parse(readFileSync(`${root}docs/knowledge/research/sprint-9-adjudication-matrix.json`, 'utf8'));
const audit = JSON.parse(readFileSync(`${root}docs/knowledge/SOURCE_IDENTITY_AUDIT_39.json`, 'utf8'));
const rules = JSON.parse(readFileSync(`${root}backend/src/data/rulesV2.json`, 'utf8'));
const report = readFileSync(`${root}docs/knowledge/SPRINT_9_ADJUDICATION_MATRIX.md`, 'utf8');
const allowed = new Set([
    'DOCUMENTED_SOURCE_VARIANT',
    'HISTORICAL_NAME_NOT_ESTABLISHED',
    'IDENTITY_MISMATCH',
    'SOURCE_CONTRADICTION',
    'INSUFFICIENT_EVIDENCE',
    'PDF_TEXT_LAYER_MISMATCH_CONFIRMED'
]);

assert.strictEqual(matrix.cases.length, 21);
assert.strictEqual(matrix.modelsRerun, false);
assert.strictEqual(matrix.originalDecisionsPreserved, true);
const names = new Set();
for (const row of matrix.cases) {
    assert.ok(allowed.has(row.disposition), row.slug);
    assert.strictEqual(row.modelsRerun, false, row.slug);
    assert.notStrictEqual(row.disposition, 'FORMULA_MATCH', row.slug);
    const stored = JSON.parse(readFileSync(`${root}${row.path}`, 'utf8'));
    assert.strictEqual(stored.decision, row.originalDecision, row.slug);
    assert.ok(report.includes(row.name), row.slug);
    names.add(row.name);
}
assert.strictEqual(names.size, 21);

const rubric = matrix.cases.filter((row) => row.disagreementClass === 'RUBRIC_SCOPE' && row.conditionsEqual === true);
assert.ok(rubric.length >= 6);
const thienAt = matrix.cases.find((row) => row.slug === 'thien-at-cung-menh');
assert.strictEqual(thienAt.grok, 'CONFLICT');
assert.strictEqual(thienAt.terra, 'MATCH');
const kinh = matrix.cases.find((row) => row.slug === 'kinh-duong-nhap-mieu');
assert.strictEqual(kinh.originalDecision, 'UNRESOLVED');
assert.strictEqual(kinh.disposition, 'IDENTITY_MISMATCH');
const banKhong = matrix.cases.find((row) => row.slug === 'ban-khong-chiet-xi');
assert.match(banKhong.fetch, /phrase absent/);

assert.strictEqual(audit.count, 39);
assert.deepStrictEqual(audit.nameMismatch.sort(), ['Bán Không Chiết Xỉ', 'Hùng Tú Triều Viên', 'Lưỡng Trùng Thiên Mã'].sort());
assert.strictEqual(audit.unresolvedIdentity, 36);
assert.deepStrictEqual(audit.promotedToExactIdentity, []);

const thienRule = rules.find((row) => row.id === 'thien_at_cung_menh');
assert.strictEqual(thienRule.clauses[0].at, 'menh_or_opposite');
const anhRule = rules.find((row) => row.id === 'anh_tinh_nhap_mieu');
assert.deepStrictEqual(anhRule.samePalace, ['Phá Quân']);
const hinhTu = rules.find((row) => row.id === 'hinh_tu_giap_an');
const hinhKy = rules.find((row) => row.id === 'hinh_ky_giap_an');
assert.notDeepStrictEqual(hinhTu.giap.flankGroups, hinhKy.giap.flankGroups);

assert.strictEqual(compareReviews({
    sourceAvailable: true,
    storedSpan: '太陽居午，謂之日麗中天。',
    sourceDigest: 'ab',
    editionId: 'sample',
    requiredConditions: ['sun_ngo'],
    requiredExceptions: [],
    requiredAnchors: ['太陽居午']
}).decision, 'UNRESOLVED');

const seven = JSON.parse(readFileSync(`${root}docs/knowledge/research/sprint-9d-seven-cases.json`, 'utf8'));
assert.strictEqual(seven.modelsRerun, false);
assert.strictEqual(seven.pdfPageChecked, false);
assert.strictEqual(seven.cases.length, 7);
const tinhSpan = readFileSync(`${root}docs/knowledge/passages/nhat-nguyet-tinh-minh/span.txt`, 'utf8');
assert.ok(tinhSpan.includes('Tý'));
assert.ok(!tinhSpan.includes('Tỵ'));
const thamSpan = readFileSync(`${root}docs/knowledge/passages/tham-vu-dong-hanh/span.txt`, 'utf8');
assert.ok(thamSpan.includes('Sửu, Mùi'));
const boxes = (chart) => Object.values(chart.boxes);
const has = (box, name) => (box.majorStars || []).some((star) => String(star).startsWith(name));
const menh = (chart) => boxes(chart).find((box) => (box.cungName || '').includes('MỆNH'));
const opposite = (chart, box) => {
    const list = boxes(chart);
    return list[(list.indexOf(box) + 6) % 12];
};
const satOutside = calculateTuVi(0, 0, 3, 2, 10, 1, false);
const satMenh = menh(satOutside);
assert.strictEqual(satMenh.chiName, 'Ngọ');
assert.ok(has(satMenh, 'Thất Sát'));
const satOpp = opposite(satOutside, satMenh);
assert.ok(!(has(satOpp, 'Tử Vi') && has(satOpp, 'Thiên Phủ')));
const samePalace = calculateTuVi(0, 0, 6, 3, 4, 1, false);
const sameMenh = menh(samePalace);
assert.strictEqual(sameMenh.chiName, 'Sửu');
assert.ok(has(sameMenh, 'Thái Dương') && has(sameMenh, 'Thái Âm'));
const oppositeLuminaries = calculateTuVi(0, 0, 3, 3, 10, 1, false);
const oppositeMenh = menh(oppositeLuminaries);
assert.strictEqual(oppositeMenh.chiName, 'Mùi');
const suu = boxes(oppositeLuminaries).find((box) => box.chiName === 'Sửu');
assert.ok(has(suu, 'Thái Dương') && has(suu, 'Thái Âm'));
assert.ok(!(has(oppositeMenh, 'Thái Dương') && has(oppositeMenh, 'Thái Âm')));
const visualTinh = calculateTuVi(0, 0, 14, 2, 3, 1, false);
const visualMenh = menh(visualTinh);
assert.strictEqual(visualMenh.chiName, 'Sửu');
assert.strictEqual(boxes(visualTinh).find((box) => has(box, 'Thái Dương')).chiName, 'Tị');
assert.strictEqual(boxes(visualTinh).find((box) => has(box, 'Thái Âm')).chiName, 'Dậu');
const clause2 = calculateTuVi(0, 0, 1, 2, 9, 1, false);
assert.strictEqual(menh(clause2).chiName, 'Mùi');
assert.strictEqual(boxes(clause2).find((box) => has(box, 'Thái Dương')).chiName, 'Mão');
assert.strictEqual(boxes(clause2).find((box) => has(box, 'Thái Âm')).chiName, 'Hợi');
const editorialOpposite = calculateTuVi(0, 0, 18, 2, 3, 1, false);
assert.strictEqual(menh(editorialOpposite).chiName, 'Sửu');
assert.strictEqual(boxes(editorialOpposite).find((box) => has(box, 'Thái Dương')).chiName, 'Mùi');
assert.ok(!has(menh(editorialOpposite), 'Thái Dương'));
const tinhRule = rules.find((row) => row.id === 'nhat_nguyet_tinh_minh');
assert.deepStrictEqual(tinhRule.clauses[0].branches, ['Tị', 'Ngọ']);
assert.deepStrictEqual(tinhRule.clauses[1].branches, ['Dậu', 'Tí']);
const dongRule = rules.find((row) => row.id === 'nhat_nguyet_dong_lam');
assert.deepStrictEqual(dongRule.samePalace, ['Thái Dương', 'Thái Âm']);
assert.ok(tinhSpan.includes('Tý') && !tinhSpan.includes('Tỵ'));
const visualCase = matrix.cases.find((row) => row.slug === 'nhat-nguyet-tinh-minh');
assert.strictEqual(visualCase.disposition, 'PDF_TEXT_LAYER_MISMATCH_CONFIRMED');
assert.strictEqual(visualCase.originalDecision, 'CONFLICT');

console.log('sprint 9 adjudication keeps the stored decisions and separates scope from match');
