import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import catalog from '../src/data/combinations.json' with { type: 'json' };
import research from '../../docs/knowledge/combination-research.json' with { type: 'json' };
import passages from '../../docs/knowledge/combination-passages.json' with { type: 'json' };
import { loadCombinationBatch } from '../src/knowledge/combinationBatch.js';

const root = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const report = readFileSync(`${root}SPRINT_9B_COMPLETION_REPORT.md`, 'utf8');
const loaded = loadCombinationBatch();
const byName = new Map(loaded.rows.map((row) => [row.combinationName, row]));

assert.strictEqual(research.entries.length, catalog.length);
assert.strictEqual(research.pdfFilePresent, false);
assert.deepStrictEqual(research.entries.map((entry) => entry.combinationName), catalog.map((item) => item.name));

const ids = research.entries.map((entry) => entry.combinationId);
assert.strictEqual(new Set(ids).size, ids.length);

for (const entry of research.entries) {
    const passage = passages.entries.find((item) => item.combinationName === entry.combinationName);
    const row = byName.get(entry.combinationName);
    assert.strictEqual(entry.researchStatus, 'RESEARCH_COMPLETE', entry.combinationName);
    assert.strictEqual(entry.expertVerified, false, entry.combinationName);
    assert.strictEqual(entry.chineseName, null, entry.combinationName);
    assert.strictEqual(entry.otherSchoolVariantCreated, false, entry.combinationName);
    assert.strictEqual(entry.decision, row.batchStatus, entry.combinationName);
    assert.ok(entry.searchAttempts.length > 0, entry.combinationName);
    if (passage.located === true) {
        assert.strictEqual(entry.sourceStatus, 'SOURCE_LOCATED', entry.combinationName);
        assert.strictEqual(entry.evidence.locator, passage.locator, entry.combinationName);
        assert.strictEqual(entry.evidence.pdfTextChecked, false, entry.combinationName);
        assert.strictEqual(entry.evidence.binding, 'passage_hash_only', entry.combinationName);
        assert.notStrictEqual(entry.verificationStatus, 'NOT_REVIEWED', entry.combinationName);
    } else {
        assert.strictEqual(entry.sourceStatus, 'SOURCE_INACCESSIBLE', entry.combinationName);
        assert.strictEqual(entry.evidence, null, entry.combinationName);
        assert.strictEqual(entry.verificationStatus, 'NOT_REVIEWED', entry.combinationName);
        assert.notStrictEqual(entry.decision, 'AI_ACCEPTED', entry.combinationName);
        assert.strictEqual(entry.searchAttempts[0].rejectedAsDefiningPassage, true, entry.combinationName);
    }
}

assert.match(report, /Research coverage: 63\/63/);
assert.match(report, /Source located in the readable Tân Biên spans: 24\/63/);
assert.match(report, /PDF page text checked: 0\/63/);
assert.match(report, /Dual-AI reviewed: 24\/63/);
assert.match(report, /Formula MATCH: 3\. PARTIAL: 6\. CONFLICT: 3\. NOT_IMPLEMENTED: 2/);
assert.match(report, /RESEARCH_COMPLETE_WITH_GAPS/);

console.log('combination research covers 63 names without treating an inaccessible book as a passage');
