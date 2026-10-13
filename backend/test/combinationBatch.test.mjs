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

const located = loaded.passages.filter((passage) => passage.located === true);
const byClaim = new Map(loaded.decisions.map((decision) => [decision.subjectId, decision]));
assert.strictEqual(loaded.decisions.length, located.length);
const locatedClaims = new Set(located.map((passage) => passage.claimId));
for (const decision of loaded.decisions) {
    assert.ok(locatedClaims.has(decision.subjectId), decision.subjectId);
    assert.strictEqual(decision.expertVerified, false, decision.subjectId);
    assert.strictEqual(decision.runtimeRuleChangeApplied, false, decision.subjectId);
}
for (const passage of located) {
    const decision = byClaim.get(passage.claimId);
    assert.ok(decision, passage.combinationName);
    assert.strictEqual(decision.sourceDigest, passage.sourceDigest, passage.combinationName);
    const row = byName.get(passage.combinationName);
    assert.strictEqual(row.batchStatus, decision.decision, passage.combinationName);
    if (decision.decision === 'AI_ACCEPTED') {
        assert.strictEqual(row.formulaComparison, decision.formulaComparison, passage.combinationName);
        assert.strictEqual(row.crossReviewOutcome, 'AI_CROSS_REVIEWED', passage.combinationName);
    } else {
        assert.strictEqual(row.formulaComparison, null, passage.combinationName);
        assert.notStrictEqual(row.batchStatus, 'AI_ACCEPTED', passage.combinationName);
    }
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
