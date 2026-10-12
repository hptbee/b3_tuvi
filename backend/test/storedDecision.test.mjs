import assert from 'assert';
import { createHash } from 'crypto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { compareReviews } from '../src/knowledge/crossReview.js';
import { readDecision, validateDecisionRecord } from '../src/knowledge/decisionRegistry.js';

const root = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const decision = JSON.parse(readFileSync(`${root}decisions/nguyet-lang-thien-mon.json`, 'utf8'));
const reviewA = JSON.parse(readFileSync(`${root}reviews/nguyet-lang-thien-mon/review-a.json`, 'utf8'));
const reviewB = JSON.parse(readFileSync(`${root}reviews/nguyet-lang-thien-mon/review-b.json`, 'utf8'));
const span = readFileSync(`${root}reviews/nguyet-lang-thien-mon/span.txt`, 'utf8').replace(/\n$/, '');
assert.strictEqual(createHash('sha256').update(span).digest('hex'), decision.sourceDigest);

const checked = validateDecisionRecord(decision);
assert.strictEqual(checked.ok, true, JSON.stringify(checked.errors));
assert.strictEqual(readDecision(decision).decision, 'AI_ACCEPTED');
assert.strictEqual(decision.expertVerified, false);
assert.strictEqual(decision.runtimeRuleChangeApplied, false);
assert.notStrictEqual(decision.decision, 'REVIEW_NOT_EXECUTED');

const compared = compareReviews({
    sourceAvailable: true,
    storedSpan: span,
    sourceDigest: decision.sourceDigest,
    editionId: decision.editionId,
    requiredConditions: decision.conditions,
    requiredExceptions: decision.exceptions,
    requiredAnchors: [
        'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ',
        'xa lánh Tuần',
        'Sát tinh và Bại tinh',
        'Khoa, Quyền, Lộc'
    ],
    reviews: [reviewA, reviewB]
});
assert.strictEqual(compared.decision, decision.decision);
assert.strictEqual(compared.expertVerified, false);
assert.strictEqual(compared.formulaComparison, decision.formulaComparison);
assert.deepStrictEqual(compared.conditions, decision.conditions);

console.log('stored Nguyệt Lãng decision matches the comparator');
