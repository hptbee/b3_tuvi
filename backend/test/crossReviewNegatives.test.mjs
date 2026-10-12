import assert from 'assert';
import { createHash } from 'crypto';
import { compareReviews } from '../src/knowledge/crossReview.js';

const span = 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ. Xa Tuần Triệt.';
const digest = createHash('sha256').update(span).digest('hex');

function review(overrides = {}) {
    return {
        available: true,
        schoolId: 'vn-tam-hop-default',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '19.2.11+19.5',
        sourceDigest: digest,
        claimId: 'claim-nguyet-lang-thien-mon',
        formulaComparison: 'PARTIAL',
        verdict: 'PARTIAL',
        quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ.',
        conditions: ['palace_menh_or_quan_loc', 'avoid_tuan'],
        exceptions: ['xa_tuan_triet'],
        ...overrides
    };
}

function packet(overrides = {}) {
    return {
        sourceAvailable: true,
        storedSpan: span,
        sourceDigest: digest,
        editionId: 'tan-bien-retypeset-277-cover-1956',
        requiredConditions: ['palace_menh_or_quan_loc', 'avoid_tuan'],
        requiredExceptions: ['xa_tuan_triet'],
        requiredAnchors: ['Mệnh hay Quan Lộc', 'Nguyệt tọa thủ'],
        reviews: [review({ model: 'a' }), review({ model: 'b' })],
        ...overrides
    };
}

const cases = {
    single_model: packet({ reviews: [review()] }),
    shared_fabricated_quotation: packet({
        reviews: [
            review({ quotation: 'câu không có trong đoạn' }),
            review({ quotation: 'câu không có trong đoạn' })
        ]
    }),
    long_quotation_outside_span: packet({
        reviews: [
            review({ model: 'a', quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ.X' }),
            review({ model: 'b', quotation: 'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ.X' })
        ]
    }),
    wrong_edition: packet({
        reviews: [review({ editionId: 'other-edition' }), review({ editionId: 'other-edition' })]
    }),
    missing_source: packet({ sourceAvailable: false, storedSpan: '' }),
    dropped_condition: packet({
        reviews: [
            review({ conditions: ['palace_menh_or_quan_loc'] }),
            review({ conditions: ['palace_menh_or_quan_loc'] })
        ]
    }),
    ignored_exception: packet({
        reviews: [review({ exceptions: [] }), review({ exceptions: [] })]
    }),
    unavailable_model: packet({
        reviews: [review(), review({ available: false })]
    }),
    disagreement: packet({
        reviews: [review(), review({ verdict: 'MATCH', formulaComparison: 'MATCH' })]
    })
};

assert.strictEqual(compareReviews(cases.single_model).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.shared_fabricated_quotation).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.long_quotation_outside_span).decision, 'UNRESOLVED');
assert.notStrictEqual(compareReviews(cases.long_quotation_outside_span).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(cases.wrong_edition).decision, 'AI_ACCEPTED');
assert.strictEqual(compareReviews(cases.missing_source).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews(cases.dropped_condition).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.ignored_exception).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.unavailable_model).decision, 'REVIEW_NOT_EXECUTED');
const disagreement = compareReviews(cases.disagreement).decision;
assert.ok(disagreement === 'CONFLICT' || disagreement === 'UNRESOLVED');
for (const [name, body] of Object.entries(cases)) {
    assert.notStrictEqual(compareReviews(body).decision, 'AI_ACCEPTED', name);
    assert.strictEqual(compareReviews(body).expertVerified, false, name);
}

console.log('cross-review negatives stay fail-closed');
