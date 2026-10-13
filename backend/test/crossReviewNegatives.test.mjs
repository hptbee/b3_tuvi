import assert from 'assert';
import { createHash } from 'crypto';
import { compareReviews, QUOTATION_POLICY_V2 } from '../src/knowledge/crossReview.js';

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
    }),
    wrong_school: packet({
        schoolId: 'vn-tam-hop-default',
        reviews: [
            review({ model: 'a', schoolId: 'other-school' }),
            review({ model: 'b', schoolId: 'other-school' })
        ]
    }),
    wrong_locator: packet({
        locator: '19.2.11+19.5',
        reviews: [
            review({ model: 'a', locator: 'other-page' }),
            review({ model: 'b', locator: 'other-page' })
        ]
    }),
    verdict_mismatch: packet({
        reviews: [
            review({ model: 'a', verdict: 'MATCH', formulaComparison: 'PARTIAL' }),
            review({ model: 'b', verdict: 'MATCH', formulaComparison: 'PARTIAL' })
        ]
    }),
    unsupported_condition: packet({
        allowedConditions: ['palace_menh_or_quan_loc', 'avoid_tuan'],
        reviews: [
            review({ model: 'a', conditions: ['palace_menh_or_quan_loc', 'avoid_tuan', 'invented'] }),
            review({ model: 'b', conditions: ['palace_menh_or_quan_loc', 'avoid_tuan', 'invented'] })
        ]
    }),
    exception_disagreement: packet({
        reviews: [
            review({ model: 'a', exceptions: ['xa_tuan_triet'] }),
            review({ model: 'b', exceptions: [] })
        ]
    })
};

assert.strictEqual(compareReviews(cases.single_model).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.shared_fabricated_quotation).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.long_quotation_outside_span).decision, 'UNRESOLVED');
assert.notStrictEqual(compareReviews(cases.long_quotation_outside_span).decision, 'AI_ACCEPTED');
assert.notStrictEqual(compareReviews(cases.wrong_edition).decision, 'AI_ACCEPTED');
assert.strictEqual(compareReviews(cases.missing_source).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews(null).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews({ sourceAvailable: true, storedSpan: '   ' }).decision, 'SOURCE_INACCESSIBLE');
assert.strictEqual(compareReviews(packet({ sourceDigest: 'zz' })).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.dropped_condition).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.ignored_exception).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.unavailable_model).decision, 'REVIEW_NOT_EXECUTED');
assert.strictEqual(compareReviews(cases.wrong_school).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.wrong_locator).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.verdict_mismatch).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.unsupported_condition).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(cases.exception_disagreement).decision, 'CONFLICT');
assert.strictEqual(compareReviews(packet({
    reviews: [
        review({ model: 'a', claimId: '' }),
        review({ model: 'b', claimId: '' })
    ]
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(packet({
    requiredAnchors: ['ab']
})).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(packet({
    reviews: [
        review({ model: 'a', exceptions: [] }),
        review({ model: 'b', exceptions: [] })
    ]
})).reason, 'an exception is missing');
const disagreement = compareReviews(cases.disagreement).decision;
assert.ok(disagreement === 'CONFLICT' || disagreement === 'UNRESOLVED');
for (const [name, body] of Object.entries(cases)) {
    assert.notStrictEqual(compareReviews(body).decision, 'AI_ACCEPTED', name);
    assert.strictEqual(compareReviews(body).expertVerified, false, name);
}

const classical = '祿逢沖破，吉處藏凶。馬遇空亡，終身奔走。';
const classicalSpan = `例曰 ${classical}`;
const classicalDigest = createHash('sha256').update(classicalSpan).digest('hex');
function classicalReview(model, quotation) {
    return {
        available: true,
        model,
        schoolId: 'vn-tam-hop-default',
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '1',
        sourceDigest: classicalDigest,
        claimId: 'claim-short',
        formulaComparison: 'NOT_IMPLEMENTED',
        verdict: 'NOT_IMPLEMENTED',
        quotation,
        conditions: ['loc_clash'],
        exceptions: []
    };
}
function classicalPacket(quotation, policy) {
    return {
        sourceAvailable: true,
        storedSpan: classicalSpan,
        sourceDigest: classicalDigest,
        editionId: 'tan-bien-retypeset-277-cover-1956',
        locator: '1',
        schoolId: 'vn-tam-hop-default',
        requiredConditions: ['loc_clash'],
        requiredExceptions: [],
        requiredAnchors: ['祿逢沖破'],
        allowedConditions: ['loc_clash'],
        quotationPolicy: policy,
        reviews: [classicalReview('grok-4.7-high', quotation), classicalReview('gpt-5.6-terra-medium', quotation)]
    };
}
assert.strictEqual(compareReviews(classicalPacket(classical, 'min-40-v1')).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(classicalPacket(classical, QUOTATION_POLICY_V2)).decision, 'AI_ACCEPTED');
assert.strictEqual(compareReviews(classicalPacket('吉處藏凶。', QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(classicalPacket('這句不在原文，但是完整句。', QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(classicalPacket('陽梁昌祿格', QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');

const noStop = '祿逢沖破，吉處藏凶。馬遇空亡，終身';
assert.ok(noStop.length >= 16);
assert.strictEqual(compareReviews(classicalPacket(noStop, QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');
const noComma = '這一句完整但是沒有任何逗號存在。';
assert.ok(classicalSpan.includes(noComma) === false);
const noCommaSpan = `例曰 ${noComma}`;
const noCommaDigest = createHash('sha256').update(noCommaSpan).digest('hex');
assert.strictEqual(compareReviews({
    ...classicalPacket(noComma, QUOTATION_POLICY_V2),
    storedSpan: noCommaSpan,
    sourceDigest: noCommaDigest,
    reviews: [
        { ...classicalReview('grok-4.7-high', noComma), sourceDigest: noCommaDigest },
        { ...classicalReview('gpt-5.6-terra-medium', noComma), sourceDigest: noCommaDigest }
    ]
}).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(classicalPacket(`${classical} `, QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(classicalPacket(12, QUOTATION_POLICY_V2)).decision, 'UNRESOLVED');
assert.strictEqual(compareReviews(packet({
    reviews: [
        review({ model: 'a', editionId: 'edition-left' }),
        review({ model: 'b', editionId: 'edition-right' })
    ]
})).decision, 'CONFLICT');

console.log('cross-review negatives stay fail-closed');
