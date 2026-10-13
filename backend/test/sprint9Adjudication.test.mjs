import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { compareReviews } from '../src/knowledge/crossReview.js';

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
    'INSUFFICIENT_EVIDENCE'
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

console.log('sprint 9 adjudication keeps the stored decisions and separates scope from match');
