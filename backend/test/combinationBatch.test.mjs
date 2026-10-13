import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import rules from '../src/data/rulesV2.json' with { type: 'json' };
import matrix from '../../docs/knowledge/combination-source-matrix.json' with { type: 'json' };
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { loadCombinationBatch } from '../src/knowledge/combinationBatch.js';

const loaded = loadCombinationBatch();
assert.strictEqual(loaded.rows.length, loaded.catalog.length);
assert.strictEqual(new Set(loaded.rows.map((row) => row.combinationName)).size, loaded.catalog.length);

const byName = new Map(loaded.rows.map((row) => [row.combinationName, row]));
for (const item of loaded.catalog) {
    const row = byName.get(item.name);
    assert.ok(row, item.name);
    assert.strictEqual(row.expertVerified, false, item.name);
    assert.strictEqual(row.formulaCheckedAgainstSource, false, item.name);
    assert.strictEqual(row.runtimeRuleChangeApplied, false, item.name);
    assert.strictEqual(row.schoolId, 'vn-tam-hop-default', item.name);
}

const notLocated = loaded.rows.filter((row) => row.batchStatus === 'PASSAGE_NOT_LOCATED');
assert.ok(notLocated.length > 0);
for (const row of notLocated) {
    assert.strictEqual(row.formulaComparison, null, row.combinationName);
    assert.notStrictEqual(row.batchStatus, 'AI_ACCEPTED', row.combinationName);
    assert.notStrictEqual(row.formulaComparison, 'MATCH', row.combinationName);
}

const nguyet = byName.get('Nguyệt Lãng Thiên Môn');
assert.strictEqual(nguyet.batchStatus, 'AI_ACCEPTED');
assert.strictEqual(nguyet.formulaComparison, 'PARTIAL');
assert.strictEqual(nguyet.expertVerified, false);

const locatedPending = loaded.passages.filter((passage) => passage.located === true && passage.claimId !== 'claim-nguyet-lang-thien-mon');
for (const passage of locatedPending) {
    const row = byName.get(passage.combinationName);
    assert.strictEqual(row.batchStatus, 'REVIEW_NOT_EXECUTED', passage.combinationName);
    assert.ok(passage.sourceDigest, passage.combinationName);
}

for (const matrixRow of matrix.rows) {
    const row = byName.get(matrixRow.name);
    assert.strictEqual(matrixRow.batchStatus, row.batchStatus, matrixRow.name);
    assert.strictEqual(matrixRow.formulaCheckedAgainstSource, false, matrixRow.name);
    assert.strictEqual(matrixRow.interpretationSourced, false, matrixRow.name);
}

const rulesSource = readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8');
assert.ok(rulesSource.includes('"id": "nguyet_lang_thien_mon"'));
assert.strictEqual(rules.find((rule) => rule.id === 'nguyet_lang_thien_mon').target, 'menh');

const closed = claimEligibility({
    approvedForInterpretation: false,
    formulaComparisonStatus: 'PARTIAL'
});
assert.strictEqual(closed.eligible, false);

console.log(`combination batch located=${loaded.passages.filter((passage) => passage.located).length} notLocated=${notLocated.length}`);
