import assert from 'assert';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const doc = readFileSync(fileURLToPath(new URL('../../docs/engineering/TEST_FIXTURES.md', import.meta.url)), 'utf8');
const files = readdirSync(fileURLToPath(new URL('.', import.meta.url))).filter((name) => name.endsWith('.mjs'));

for (const name of files) {
    assert.strictEqual(doc.split(name).length - 1, 1, name);
}

for (const heading of [
    '## Independent domain reference',
    '## Expert-verified golden case',
    '## Regression fixture',
    '## Synthetic test case',
    '## Property/invariant test'
]) {
    assert.ok(doc.includes(heading), heading);
}

const golden = doc.split('## Expert-verified golden case')[1].split('## ')[0];
assert.match(golden, /Không có file expert-verified golden/);
assert.ok(!golden.includes('.mjs'));

console.log('backend tests are classified once and none are expert-verified golden cases');
