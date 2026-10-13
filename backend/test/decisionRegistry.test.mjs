import assert from 'assert';
import { POLICY_VERSION } from '../src/knowledge/crossReview.js';
import { readDecision, validateDecisionRecord } from '../src/knowledge/decisionRegistry.js';

function record(overrides = {}) {
    return {
        decisionId: 'decision-1',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '19.2.11+19.5',
        policyVersion: POLICY_VERSION,
        sourceDigest: '941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458',
        expertVerified: false,
        decision: 'AI_ACCEPTED',
        crossReviewOutcome: 'AI_CROSS_REVIEWED',
        reviewers: [
            { model: 'grok', reviewRef: 'review-a', available: true },
            { model: 'gpt', reviewRef: 'review-b', available: true }
        ],
        conditions: ['palace_menh_or_quan_loc'],
        ...overrides
    };
}

const stored = validateDecisionRecord(record());
assert.strictEqual(stored.ok, true, JSON.stringify(stored.errors));
assert.strictEqual(readDecision(record()).decision, 'AI_ACCEPTED');
assert.strictEqual(readDecision(record()).expertVerified, false);

assert.strictEqual(validateDecisionRecord(record({ sourceDigest: 'actual-digest-at-runtime-not-a-placeholder' })).ok, false);
assert.strictEqual(validateDecisionRecord(record({ sourceDigest: '1' })).ok, false);
assert.strictEqual(validateDecisionRecord(record({ conditions: [] })).ok, false);
assert.strictEqual(validateDecisionRecord(record({ conditions: [' '] })).ok, false);
assert.strictEqual(validateDecisionRecord(record({ editionId: '' })).ok, false);
assert.strictEqual(validateDecisionRecord(record({
    reviewers: [
        { model: 'grok', reviewRef: 'review-a', available: true },
        { model: 'grok ', reviewRef: 'review-b', available: true }
    ]
})).ok, false);
assert.strictEqual(validateDecisionRecord(record({
    reviewers: [
        { model: 'grok', reviewRef: 'same', available: true },
        { model: 'gpt', reviewRef: 'same', available: true }
    ]
})).ok, false);
assert.strictEqual(validateDecisionRecord(record({
    decision: 'CONFLICT',
    crossReviewOutcome: 'AI_CROSS_REVIEWED'
})).ok, false);
assert.strictEqual(validateDecisionRecord(record({ expertVerified: true })).ok, false);
assert.strictEqual(validateDecisionRecord(record({ reviewers: [{ reviewRef: 'only-one' }] })).ok, false);

const notRun = record({
    decision: 'REVIEW_NOT_EXECUTED',
    crossReviewOutcome: 'AI_CROSS_REVIEWED'
});
assert.strictEqual(validateDecisionRecord(notRun).ok, false);
assert.strictEqual(readDecision(notRun).decision, null);

const withheld = record({
    decision: 'REVIEW_NOT_EXECUTED',
    crossReviewOutcome: null
});
assert.strictEqual(readDecision(withheld).decision, 'REVIEW_NOT_EXECUTED');
assert.notStrictEqual(readDecision(withheld).decision, 'AI_ACCEPTED');

console.log('decision registry rejects placeholder digests and expert verification');
