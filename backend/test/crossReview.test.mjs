import assert from 'assert';
import { compareReviews } from '../src/knowledge/crossReview.js';

const span = 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.';

function review(overrides = {}) {
    return {
        available: true,
        model: 'model-a',
        schoolId: 'vn-tam-hop-default',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '19.2.11/230',
        sourceDigest: 'digest-1',
        claimId: 'claim-nguyet-lang-thien-mon',
        formulaComparison: 'PARTIAL',
        verdict: 'PARTIAL',
        quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ.',
        conditions: ['menh_or_quan', 'hai', 'nguyet_toa_thu'],
        exceptions: ['xa_tuan_triet'],
        ...overrides
    };
}

function input(overrides = {}) {
    return {
        sourceAvailable: true,
        storedSpan: span,
        sourceDigest: 'digest-1',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        requiredConditions: ['menh_or_quan', 'hai', 'nguyet_toa_thu'],
        requiredExceptions: ['xa_tuan_triet'],
        reviews: [review({ model: 'grok' }), review({ model: 'gpt' })],
        ...overrides
    };
}

const accepted = compareReviews(input());
assert.strictEqual(accepted.decision, 'AI_ACCEPTED');
assert.strictEqual(accepted.crossReviewOutcome, 'AI_CROSS_REVIEWED');
assert.strictEqual(accepted.expertVerified, false);
assert.strictEqual(accepted.runtimeRuleChangeApplied, false);

const conflict = compareReviews(input({
    reviews: [review(), review({ formulaComparison: 'MATCH', verdict: 'MATCH' })]
}));
assert.strictEqual(conflict.decision, 'CONFLICT');
assert.ok(conflict.disagreements.includes('formulaComparison'));

assert.strictEqual(compareReviews(input({ sourceAvailable: false })).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews(input({ storedSpan: '' })).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews(input({ reviews: [review()] })).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review(), review({ available: false })]
})).decision, 'REVIEW_NOT_EXECUTED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ quotation: 'câu không có trong đoạn' }), review({ quotation: 'câu không có trong đoạn' })]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ editionId: 'other-edition' }), review({ editionId: 'other-edition' })]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ conditions: ['menh_or_quan', 'hai'] }), review({ conditions: ['menh_or_quan', 'hai'] })]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ exceptions: [] }), review({ exceptions: [] })]
})).decision, 'UNRESOLVED');

console.log('cross-review accepts only two agreeing reviews of the stored span');
