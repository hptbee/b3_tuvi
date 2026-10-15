import assert from 'assert';
import sourcesDoc from '../../docs/knowledge/sources.json' with { type: 'json' };
import matrix from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };

const byId = new Map(sourcesDoc.sources.map((source) => [source.sourceId, source]));
const hamSo = byId.get('nguyen-phat-loc-ham-so');
const thienLuong = byId.get('thien-luong-nghiem-ly');
const tanBien = sourcesDoc.editions.find((edition) => edition.editionId === 'tan-bien-retypeset-277-cover-1956');

assert.strictEqual(hamSo.url, 'https://tuvisonkhiem.vn/thu-vien/sach/tu-vi-ham-so/');
assert.ok(!hamSo.url.includes('tu-vi-dau-so-tan-bien'));
assert.strictEqual(hamSo.access.checkedAt, '2026-10-12');
assert.strictEqual(hamSo.access.rejectedTitle, 'Tử Vi Đẩu Số Tân Biên');
assert.strictEqual(hamSo.access.observedTitle, 'Tử Vi Hàm Số');
assert.strictEqual(hamSo.access.documentClass, 'secondary_introduction');
assert.strictEqual(hamSo.access.textLocated, false);
assert.notStrictEqual(hamSo.bibliographicStatus, 'primary');

const nghiemLyToanThuUrl = 'https://tuvisonkhiem.vn/thu-vien/sach/tu-vi-nghiem-ly-toan-thu/';

assert.strictEqual(thienLuong.url, null);
assert.strictEqual(thienLuong.access.checkedAt, '2026-10-12');
assert.ok(thienLuong.access.rejectedUrl.includes('tu-vi-lap-thanh-va-phu-doan'));
assert.strictEqual(thienLuong.access.rejectedTitle, 'Tử Vi Lập Thành Và Phú Đoán');
assert.strictEqual(thienLuong.access.documentClass, 'wrong_title_url_removed');
assert.strictEqual(thienLuong.access.textLocated, false);
assert.strictEqual(thienLuong.access.distinctWorkNotAttached.url, nghiemLyToanThuUrl);
assert.notStrictEqual(thienLuong.url, thienLuong.access.distinctWorkNotAttached.url);
assert.ok(sourcesDoc.sources.every((source) => source.url !== nghiemLyToanThuUrl));
assert.notStrictEqual(thienLuong.bibliographicStatus, 'primary');

assert.strictEqual(tanBien.documentType, 're_typeset_digital');
assert.strictEqual(tanBien.contentSha256, '941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458');
assert.strictEqual(tanBien.byteLength, 2202452);
assert.strictEqual(tanBien.pageObjectCount, 277);
assert.strictEqual(tanBien.pageCount, tanBien.pageObjectCount);
assert.notStrictEqual(sourcesDoc.editions.find((edition) => edition.editionId === 'tan-bien-nxb-thoi-dai-2012').documentType, 're_typeset_digital');

assert.ok(sourcesDoc.sources.every((source) => source.bibliographicStatus !== 'primary'));
assert.ok(matrix.rows.every((row) => row.formulaCheckedAgainstSource === false));

const mirror = byId.get('ziwei-quanshu-iztro-transcription');
const mirrorEdition = sourcesDoc.editions.find((edition) => edition.editionId === 'iztro-juan2-2f00e2ab0c80');
assert.strictEqual(mirror.schoolId, null);
assert.strictEqual(mirror.sourceType, 'secondary_transcription');
assert.strictEqual(mirror.bibliographicStatus, 'secondary');
assert.strictEqual(mirror.bookVerified, false);
assert.strictEqual(mirror.expertVerified, false);
assert.strictEqual(mirrorEdition.sourceId, mirror.sourceId);
assert.strictEqual(mirrorEdition.documentType, 'pinned_html_transcription');
assert.strictEqual(mirrorEdition.gitCommit, '2f00e2ab0c80b1632e55bc362f2ae26e121245cb');
assert.strictEqual(mirrorEdition.contentSha256, '438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a');
assert.strictEqual(mirrorEdition.gitPath, 'docs/zh_TW/learn/ancientBook-2.html');
assert.ok(mirror.url.includes(mirrorEdition.gitCommit));
assert.strictEqual(mirrorEdition.authenticated, false);
assert.strictEqual(mirrorEdition.originalEditionAuthenticated, false);
assert.strictEqual(mirrorEdition.textCollatedAgainstOriginal, false);
assert.strictEqual(mirrorEdition.bookVerified, false);
assert.strictEqual(mirrorEdition.expertVerified, false);

const modernSource = byId.get('iztro-modern-software');
const modernEdition = sourcesDoc.editions.find((edition) => edition.editionId === 'iztro-modern-2f00e2ab0c80');
assert.strictEqual(modernSource.sourceType, 'modern_software_reference');
assert.strictEqual(modernSource.schoolId, null);
assert.strictEqual(modernSource.bibliographicStatus, 'secondary');
assert.strictEqual(modernSource.bookVerified, false);
assert.strictEqual(modernSource.expertVerified, false);
assert.strictEqual(modernEdition.gitCommit, '2f00e2ab0c80b1632e55bc362f2ae26e121245cb');
assert.strictEqual(modernEdition.contentSha256, 'a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273');
for (const key of ['authenticated','originalEditionAuthenticated','textCollatedAgainstOriginal','bookVerified','expertVerified']) {
    assert.strictEqual(modernEdition[key], false);
}

console.log('source hygiene keeps wrong titles off the registry and does not promote formulas');
