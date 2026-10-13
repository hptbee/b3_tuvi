import assert from 'assert';
import { assessSourceBinding, quoteOnPage, sha256Text } from '../src/knowledge/sourceBinding.js';

const span = 'Cung Mệnh an tại Ngọ, có Nhật tọa thủ nên rất sáng sủa tốt đẹp.';
const absent = assessSourceBinding({ span });
assert.strictEqual(absent.binding, 'passage_hash_only');
assert.strictEqual(absent.fileHashMatches, null);
assert.strictEqual(absent.pdfTextChecked, false);
assert.strictEqual(absent.passageDigest, sha256Text(span));

const bytes = Buffer.from('not-the-pdf');
const digest = sha256Text(bytes);
const checked = assessSourceBinding({ fileBytes: bytes, declaredFileSha256: digest, span });
assert.strictEqual(checked.binding, 'file_hash_checked');
assert.strictEqual(checked.fileHashMatches, true);
assert.strictEqual(checked.pdfTextChecked, false);

const mismatch = assessSourceBinding({ fileBytes: bytes, declaredFileSha256: 'a'.repeat(64), span });
assert.strictEqual(mismatch.binding, 'file_hash_mismatch');
assert.strictEqual(mismatch.fileHashMatches, false);

const page = quoteOnPage(`trang 70 ${span} hết trang`, span);
assert.strictEqual(page.pdfTextChecked, true);
assert.strictEqual(page.quotationOnPage, true);
assert.strictEqual(page.binding, 'pdf_page_checked');
const missing = quoteOnPage('trang trống', span);
assert.strictEqual(missing.quotationOnPage, false);
assert.strictEqual(missing.binding, 'pdf_page_mismatch');

assert.strictEqual(assessSourceBinding({ span: 12 }).passageDigest, sha256Text(''));
assert.strictEqual(quoteOnPage(null, null).quotationOnPage, false);

console.log('source binding separates file hash, passage hash, and page text');
