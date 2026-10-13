import assert from 'assert';
import { createHash } from 'crypto';
import { compareReviews } from '../src/knowledge/crossReview.js';

const span = 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.';
const digest = createHash('sha256').update(span).digest('hex');

function review(overrides = {}) {
    return {
        available: true,
        model: 'model-a',
        schoolId: 'vn-tam-hop-default',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '19.2.11/230',
        sourceDigest: digest,
        claimId: 'claim-nguyet-lang-thien-mon',
        formulaComparison: 'PARTIAL',
        verdict: 'PARTIAL',
        quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.',
        conditions: ['menh_or_quan', 'hai', 'nguyet_toa_thu'],
        exceptions: ['xa_tuan_triet'],
        ...overrides
    };
}

function input(overrides = {}) {
    return {
        sourceAvailable: true,
        storedSpan: span,
        sourceDigest: digest,
        editionId: 'tan-bien-retypeset-277-cover-1956',
        requiredConditions: ['menh_or_quan', 'hai', 'nguyet_toa_thu'],
        requiredExceptions: ['xa_tuan_triet'],
        requiredAnchors: ['Mệnh hay Quan Lộc', 'an tại Hợi', 'Nguyệt tọa thủ', 'Xa Tuần Triệt'],
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
const outsideSpan = compareReviews(input({
    reviews: [
        review({ model: 'grok', quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.X' }),
        review({ model: 'gpt', quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.X' })
    ]
}));
assert.strictEqual(outsideSpan.decision, 'UNRESOLVED');
assert.notStrictEqual(outsideSpan.decision, 'AI_ACCEPTED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ editionId: 'other-edition' }), review({ editionId: 'other-edition' })]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ conditions: ['menh_or_quan', 'hai'] }), review({ conditions: ['menh_or_quan', 'hai'] })]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ exceptions: [] }), review({ exceptions: [] })]
})).decision, 'UNRESOLVED');
assert.notStrictEqual(compareReviews(input({ editionId: '', reviews: [review({ model: 'grok' }), review({ model: 'gpt' })] })).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(input({
    reviews: [review({ model: 'same' }), review({ model: 'same' })]
})).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(input({
    reviews: [review({ model: 'grok', quotation: 'Hợi' }), review({ model: 'gpt', quotation: 'Hợi' })]
})).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(input({
    reviews: [review({ model: 'grok', quotation: 'Cung Mệnh hay Quan L' }), review({ model: 'gpt', quotation: 'Cung Mệnh hay Quan L' })]
})).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(input({
    reviews: [
        review({ model: 'grok', quotation: 'có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.' }),
        review({ model: 'gpt', quotation: 'có Nguyệt tọa thủ. Xa Tuần Triệt thì cách mới đủ.' })
    ]
})).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(input({ sourceDigest: 'a'.repeat(64) })).decision, 'AI_ACCEPTED');
assert.strictEqual(compareReviews(input({
    reviews: [review({ model: 'grok', available: undefined }), review({ model: 'gpt' })]
})).decision, 'REVIEW_NOT_EXECUTED');
assert.notStrictEqual(compareReviews(input({
    reviews: [review({ model: 'grok' }), review({ model: 'grok ' })]
})).decision, 'AI_ACCEPTED');

console.log('cross-review accepts only two agreeing reviews of the stored span');
