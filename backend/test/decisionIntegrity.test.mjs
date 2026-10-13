import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { verifyDecisionBinding } from '../src/knowledge/decisionIntegrity.js';
import { allowedIdsFromPrompt, anchorFromPrompt, obligationIds, reviewBaseline } from '../src/knowledge/extractionBaseline.js';
import { compareReviews } from '../src/knowledge/crossReview.js';
import { buildCombinationBatch, bindStoredDecision } from '../src/knowledge/combinationBatch.js';

const root = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const decision = JSON.parse(readFileSync(`${root}decisions/tu-phu-dong-cung.json`, 'utf8'));
const reviewA = JSON.parse(readFileSync(`${root}reviews/tu-phu-dong-cung/review-a.json`, 'utf8'));
const reviewB = JSON.parse(readFileSync(`${root}reviews/tu-phu-dong-cung/review-b.json`, 'utf8'));
const span = readFileSync(`${root}passages/tu-phu-dong-cung/span.txt`, 'utf8').replace(/\n$/, '');
const prompt = readFileSync(`${root}reviews/tu-phu-dong-cung/prompt-v1.txt`, 'utf8');
const baseline = reviewBaseline({
    span,
    prompt,
    editionId: decision.editionId,
    schoolId: decision.schoolId,
    locator: decision.locator,
    sourceDigest: decision.sourceDigest,
    fallbackAnchors: []
});
const intact = verifyDecisionBinding({ record: decision, reviews: [reviewA, reviewB], storedSpan: span, baseline });
assert.strictEqual(intact.ok, true, intact.reason);

for (const [reason, patch] of [
    ['conditions_tamper', { conditions: ['palace_menh'] }],
    ['exceptions_tamper', { exceptions: ['sat_does_not_reduce'] }],
    ['school_tamper', { schoolId: 'trung-chau' }],
    ['edition_tamper', { editionId: 'other-edition' }],
    ['formula_tamper', { formulaComparison: 'CONFLICT' }],
    ['locator_tamper', { locator: 'other-page' }],
    ['expert_tamper', { expertVerified: true }],
    ['replay_mismatch', { decision: 'CONFLICT', crossReviewOutcome: null }]
]) {
    const tampered = verifyDecisionBinding({
        record: { ...decision, ...patch },
        reviews: [reviewA, reviewB],
        storedSpan: span,
        baseline
    });
    assert.strictEqual(tampered.ok, false, reason);
}

const omittedSpan = 'Cung Mệnh an tại Tý có sao sáng và phải xa lánh Tuần, Triệt thì mới đủ.';
const digest = createHash('sha256').update(omittedSpan).digest('hex');
const allowed = ['palace_menh', 'avoid_tuan', 'avoid_triet'];
assert.deepStrictEqual(obligationIds(omittedSpan, allowed), ['avoid_triet', 'avoid_tuan', 'palace_menh']);
function side(model) {
    return {
        available: true,
        model,
        schoolId: 'vn-tam-hop-default',
        editionId: 'edition',
        locator: 'p1',
        sourceDigest: digest,
        claimId: 'claim',
        formulaComparison: 'PARTIAL',
        verdict: 'PARTIAL',
        quotation: omittedSpan,
        conditions: ['palace_menh'],
        exceptions: []
    };
}
const omitted = compareReviews({
    sourceAvailable: true,
    storedSpan: omittedSpan,
    sourceDigest: digest,
    editionId: 'edition',
    schoolId: 'vn-tam-hop-default',
    locator: 'p1',
    requiredConditions: obligationIds(omittedSpan, allowed),
    requiredExceptions: [],
    requiredAnchors: ['Cung Mệnh an tại Tý'],
    allowedConditions: allowed,
    reviews: [side('grok-4.7-high'), side('gpt-5.6-terra-medium')]
});
assert.strictEqual(omitted.decision, 'UNRESOLVED');
assert.strictEqual(omitted.reason, 'a stored condition is missing from the reviews');

const rows = buildCombinationBatch({
    catalog: [{ name: 'Tử Phủ Đồng Cung' }],
    passages: [{
        combinationName: 'Tử Phủ Đồng Cung',
        claimId: decision.subjectId,
        located: true,
        schoolId: decision.schoolId,
        sourceDigest: decision.sourceDigest
    }],
    decisions: [{ ...decision, bindingOk: false }]
});
assert.strictEqual(rows[0].batchStatus, 'UNRESOLVED');

const tuSpan = span;
const tuLeft = { ...reviewA, conditions: ['palace_menh'] };
const tuRight = { ...reviewB, conditions: ['palace_menh'] };
const tuRecord = { ...decision, conditions: ['palace_menh'] };
const tuDropped = verifyDecisionBinding({
    record: tuRecord,
    reviews: [tuLeft, tuRight],
    storedSpan: tuSpan,
    baseline
});
assert.strictEqual(tuDropped.ok, false);
assert.strictEqual(tuDropped.compared.decision, 'UNRESOLVED');

const quan = JSON.parse(readFileSync(`${root}decisions/quan-than-khanh-hoi.json`, 'utf8'));
const quanA = JSON.parse(readFileSync(`${root}reviews/quan-than-khanh-hoi/review-a.json`, 'utf8'));
const quanB = JSON.parse(readFileSync(`${root}reviews/quan-than-khanh-hoi/review-b.json`, 'utf8'));
const quanSpan = readFileSync(`${root}passages/quan-than-khanh-hoi/span.txt`, 'utf8').replace(/\n$/, '');
const quanPrompt = readFileSync(`${root}reviews/quan-than-khanh-hoi/prompt-v1.txt`, 'utf8');
const quanBase = reviewBaseline({
    span: quanSpan,
    prompt: quanPrompt,
    editionId: quan.editionId,
    schoolId: quan.schoolId,
    locator: quan.locator,
    sourceDigest: quan.sourceDigest,
    fallbackAnchors: []
});
const strip = (ids) => ids.filter((id) => id !== 'star_tu_bright_host' && id !== 'star_phu_bat_opposite');
const quanDropped = verifyDecisionBinding({
    record: { ...quan, conditions: strip(quan.conditions) },
    reviews: [
        { ...quanA, conditions: strip(quanA.conditions) },
        { ...quanB, conditions: strip(quanB.conditions) }
    ],
    storedSpan: quanSpan,
    baseline: quanBase
});
assert.strictEqual(quanDropped.ok, false);

assert.strictEqual(verifyDecisionBinding().ok, false);
const digestMismatch = verifyDecisionBinding({
    record: { ...decision, sourceDigest: 'b'.repeat(64) },
    reviews: [reviewA, reviewB],
    storedSpan: span,
    baseline
});
assert.strictEqual(digestMismatch.reason, 'digest_mismatch');
const inaccessible = verifyDecisionBinding({
    record: decision,
    reviews: [reviewA, reviewB],
    storedSpan: span,
    baseline: { ...baseline, sourceAvailable: false }
});
assert.strictEqual(inaccessible.reason, 'replay_mismatch');
const nullConditions = verifyDecisionBinding({
    record: { ...decision, conditions: null },
    reviews: [reviewA, reviewB],
    storedSpan: span,
    baseline
});
assert.strictEqual(nullConditions.ok, false);

assert.deepStrictEqual(obligationIds(null, ['palace_menh']), []);
assert.deepStrictEqual(allowedIdsFromPrompt(null), []);
assert.strictEqual(anchorFromPrompt('no anchor line'), null);
const kinhSpan = readFileSync(`${root}passages/kinh-duong-nhap-mieu/span.txt`, 'utf8');
const kinhPrompt = readFileSync(`${root}reviews/kinh-duong-nhap-mieu/prompt-v1.txt`, 'utf8');
assert.ok(!obligationIds(kinhSpan, allowedIdsFromPrompt(kinhPrompt)).includes('branch_suu_mui'));
for (const slug of ['ta-huu-dong-cung', 'tham-vu-dong-hanh']) {
    const text = readFileSync(`${root}passages/${slug}/span.txt`, 'utf8');
    const ids = allowedIdsFromPrompt(readFileSync(`${root}reviews/${slug}/prompt-v1.txt`, 'utf8'));
    assert.ok(obligationIds(text, ids).includes('branch_suu_mui'), slug);
}
assert.deepStrictEqual(obligationIds('Cung Mệnh hay Quan Lộc gặp Tuần và Triệt', ['avoid_tuan', 'avoid_triet', 'palace_menh_or_quan_loc']), [
    'avoid_triet',
    'avoid_tuan',
    'palace_menh_or_quan_loc'
]);

const absentName = buildCombinationBatch({
    catalog: [{ name: 'Không có trong manifest' }],
    passages: [],
    decisions: []
});
assert.strictEqual(absentName[0].batchStatus, 'PASSAGE_NOT_LOCATED');
assert.strictEqual(absentName[0].locator, null);
const notLocated = buildCombinationBatch({
    catalog: [{ name: 'Tử Phủ Vũ Tướng' }],
    passages: [{ combinationName: 'Tử Phủ Vũ Tướng', located: false, schoolId: 'vn-tam-hop-default' }],
    decisions: []
});
assert.strictEqual(notLocated[0].batchStatus, 'PASSAGE_NOT_LOCATED');

const missingDecision = buildCombinationBatch({
    catalog: [{ name: 'Tử Phủ Đồng Cung' }],
    passages: [{ combinationName: 'Tử Phủ Đồng Cung', claimId: 'claim-tu-phu-dong-cung', located: true, schoolId: 'vn-tam-hop-default' }],
    decisions: []
});
assert.strictEqual(missingDecision[0].batchStatus, 'REVIEW_NOT_EXECUTED');

const missingFile = bindStoredDecision({
    ...decision,
    reviewers: [
        { reviewRef: 'docs/knowledge/reviews/tu-phu-dong-cung/missing.json' },
        { reviewRef: 'docs/knowledge/reviews/tu-phu-dong-cung/review-b.json' }
    ]
}, { span, spanFile: 'docs/knowledge/passages/tu-phu-dong-cung/span.txt', sourceDigest: decision.sourceDigest, editionId: decision.editionId, schoolId: decision.schoolId, locator: decision.locator });
assert.strictEqual(missingFile.ok, false);

const badRef = bindStoredDecision({
    ...decision,
    reviewers: [{ reviewRef: '../outside.json' }, { reviewRef: 'docs/knowledge/reviews/tu-phu-dong-cung/review-b.json' }]
}, { span, spanFile: 'docs/knowledge/passages/tu-phu-dong-cung/span.txt', sourceDigest: decision.sourceDigest, editionId: decision.editionId, schoolId: decision.schoolId, locator: decision.locator });
assert.strictEqual(badRef.ok, false);

const missingPrompt = bindStoredDecision(decision, {
    span,
    spanFile: 'docs/knowledge/passages/not-a-real-slug/span.txt',
    sourceDigest: decision.sourceDigest,
    editionId: decision.editionId,
    schoolId: decision.schoolId,
    locator: decision.locator
});
assert.strictEqual(missingPrompt.ok, false);
const noSpan = bindStoredDecision(decision, {
    spanFile: 'docs/knowledge/passages/tu-phu-dong-cung/span.txt',
    sourceDigest: decision.sourceDigest
});
assert.strictEqual(noSpan.ok, false);
assert.strictEqual(bindStoredDecision({ reviewers: null }, {
    span: 'x',
    spanFile: 'docs/knowledge/passages/tu-phu-dong-cung/span.txt'
}).ok, false);

console.log('decision binding rejects tampering and a shared omitted condition');
