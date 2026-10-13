import assert from 'assert';
import { readdirSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import verification from '../../docs/knowledge/research/sprint-9c-url-verification.json' with { type: 'json' };
import manifest from '../../docs/knowledge/research/sprint-9c/review-manifest.json' with { type: 'json' };
import { compareReviews } from '../src/knowledge/crossReview.js';
import { verifyDecisionBinding } from '../src/knowledge/decisionIntegrity.js';
import { sprint9cObligationIds } from '../src/knowledge/sprint9cBaseline.js';

const root = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const prior = new Set(readdirSync(`${root}decisions`).filter((name) => name.endsWith('.json')));
assert.strictEqual(prior.size, 24);
assert.ok(![...prior].some((name) => name.startsWith('claim-9c')));

assert.strictEqual(verification.candidates.length, 39);
assert.strictEqual(verification.wikisourceOldid, 850734);
const names = new Set(verification.candidates.map((row) => row.combinationName));
assert.strictEqual(names.size, 39);
for (const row of verification.candidates) {
    assert.strictEqual(row.httpStatus, 200, row.combinationName);
    assert.strictEqual(row.pdfTextChecked, false, row.combinationName);
    assert.notStrictEqual(row.binding, 'pdf_page_checked', row.combinationName);
    assert.strictEqual(row.expertVerified, undefined);
}
assert.strictEqual(verification.candidates.find((row) => row.combinationName === 'Tử Phủ Vũ Tướng').identity, 'EXACT_IDENTITY');
assert.strictEqual(verification.candidates.find((row) => row.combinationName === 'Hùng Tú Triều Viên').identity, 'NAME_MISMATCH');
assert.strictEqual(verification.candidates.find((row) => row.combinationName === 'Bán Không Chiết Xỉ').identity, 'NAME_MISMATCH');
assert.strictEqual(verification.candidates.find((row) => row.combinationName === 'Sát Phá Tham').identity, 'RELATED_CONCEPT');

for (const item of manifest) {
    const span = readFileSync(`${root}research/sprint-9c/passages/${item.slug}.txt`, 'utf8').replace(/\n$/, '');
    assert.strictEqual(createHash('sha256').update(span).digest('hex'), item.sourceDigest, item.slug);
    const reviewA = JSON.parse(readFileSync(`${root}research/sprint-9c/reviews/${item.slug}/review-a.json`, 'utf8'));
    const reviewB = JSON.parse(readFileSync(`${root}research/sprint-9c/reviews/${item.slug}/review-b.json`, 'utf8'));
    const decision = JSON.parse(readFileSync(`${root}research/sprint-9c/decisions/${item.slug}.json`, 'utf8'));
    assert.strictEqual(decision.expertVerified, false, item.slug);
    assert.strictEqual(decision.runtimeRuleChangeApplied, false, item.slug);
    const expectedIdentity = ['hung-tu-trieu-vien', 'ban-khong-chiet-xi', 'luong-trung-thien-ma'].includes(item.slug) ? 'NAME_MISMATCH' : 'UNRESOLVED_IDENTITY';
    assert.strictEqual(decision.identity, expectedIdentity, item.slug);
    assert.strictEqual(decision.pdfTextChecked, false, item.slug);
    const required = sprint9cObligationIds(span, item.allowed);
    assert.ok(required.length > 0, item.slug);
    const baseline = {
        sourceDigest: item.sourceDigest,
        editionId: decision.editionId,
        schoolId: decision.schoolId,
        locator: decision.locator,
        requiredConditions: required,
        requiredExceptions: [],
        requiredAnchors: [item.anchor],
        allowedConditions: item.allowed,
        quotationPolicy: decision.quotationPolicy
    };
    const binding = verifyDecisionBinding({ record: decision, reviews: [reviewA, reviewB], storedSpan: span, baseline });
    assert.strictEqual(binding.ok, true, `${item.slug} ${binding.reason || ''} ${binding.compared?.reason || ''}`);
    const tampered = verifyDecisionBinding({
        record: { ...decision, decision: decision.decision === 'AI_ACCEPTED' ? 'CONFLICT' : 'AI_ACCEPTED', crossReviewOutcome: null },
        reviews: [reviewA, reviewB],
        storedSpan: span,
        baseline
    });
    assert.strictEqual(tampered.ok, false, item.slug);
    if (item.slug === 'khong-kiep-giap-menh') {
        const v1 = compareReviews({ sourceAvailable: true, storedSpan: span, ...baseline, quotationPolicy: 'min-40-v1', reviews: [reviewA, reviewB] });
        assert.strictEqual(v1.decision, 'UNRESOLVED');
        assert.strictEqual(decision.quotationPolicy, 'source-sentence-v2');
    }
}

const report = readFileSync(`${root}SPRINT_9C_SOURCE_DISCOVERY_REPORT.md`, 'utf8');
assert.match(report, /Candidates examined: 39\/39/);
assert.match(report, /URL validity checked: 39\/39/);
assert.match(report, /Dual-AI reviewed: 39\/39/);
assert.match(report, /REVIEW_NOT_EXECUTED`: 0/);

assert.deepStrictEqual(sprint9cObligationIds(null, null), []);

const taiSpan = readFileSync(`${root}research/sprint-9c/passages/tai-an-giao-tri.txt`, 'utf8').replace(/\n$/, '');
const khucSpan = readFileSync(`${root}research/sprint-9c/passages/khuc-am-dong-cung.txt`, 'utf8').replace(/\n$/, '');
const hoaSpan = readFileSync(`${root}research/sprint-9c/passages/hoa-cai-cu-phu-the.txt`, 'utf8').replace(/\n$/, '');
const maSpan = readFileSync(`${root}research/sprint-9c/passages/luong-trung-thien-ma.txt`, 'utf8').replace(/\n$/, '');
assert.strictEqual(taiSpan.includes('财印坐马'), false);
assert.strictEqual(taiSpan.includes('天相'), false);
assert.strictEqual(khucSpan.includes('hội chiếu'), false);
assert.strictEqual(hoaSpan.includes('Hóa Kỵ'), false);
assert.strictEqual(maSpan.includes('兩重天馬'), false);
assert.ok(maSpan.includes('祿存又逢化祿'));
const taiDecision = JSON.parse(readFileSync(`${root}research/sprint-9c/decisions/tai-an-giao-tri.json`, 'utf8'));
const khucDecision = JSON.parse(readFileSync(`${root}research/sprint-9c/decisions/khuc-am-dong-cung.json`, 'utf8'));
const hoaDecision = JSON.parse(readFileSync(`${root}research/sprint-9c/decisions/hoa-cai-cu-phu-the.json`, 'utf8'));
const maDecision = JSON.parse(readFileSync(`${root}research/sprint-9c/decisions/luong-trung-thien-ma.json`, 'utf8'));
assert.strictEqual(taiDecision.formulaComparison, 'CONFLICT');
assert.strictEqual(khucDecision.formulaComparison, 'CONFLICT');
assert.strictEqual(hoaDecision.formulaComparison, 'CONFLICT');
assert.strictEqual(maDecision.formulaComparison, 'NOT_IMPLEMENTED');
assert.strictEqual(maDecision.identity, 'NAME_MISMATCH');
const catalog = JSON.parse(readFileSync(fileURLToPath(new URL('../../backend/src/data/combinations.json', import.meta.url)), 'utf8'));
const hoaCatalog = catalog.find((row) => row.name === 'Hoa Cái Cư Phu Thê');
assert.ok(hoaCatalog.logic_conditions.required_stars.includes('Hoa Cái'));
assert.ok(!hoaCatalog.logic_conditions.required_stars.includes('Hóa Kỵ'));
assert.ok(hoaCatalog.logic_conditions.formula_text.includes('Hoa Cái'));
assert.notStrictEqual(compareReviews({
    sourceAvailable: true,
    storedSpan: taiSpan,
    sourceDigest: taiDecision.sourceDigest,
    editionId: taiDecision.editionId,
    schoolId: taiDecision.schoolId,
    locator: taiDecision.locator,
    requiredConditions: ['alias_tai_an_modern'],
    requiredExceptions: [],
    requiredAnchors: ['财印交驰'],
    allowedConditions: ['alias_tai_an_modern', 'star_vu_dan_than'],
    quotationPolicy: 'min-40-v1',
    reviews: [
        { available: true, model: 'grok-4.7-high', schoolId: taiDecision.schoolId, editionId: taiDecision.editionId, locator: taiDecision.locator, sourceDigest: taiDecision.sourceDigest, claimId: taiDecision.subjectId, formulaComparison: 'CONFLICT', verdict: 'CONFLICT', conditions: ['alias_tai_an_modern'], exceptions: [], quotation: '财印坐马格' },
        { available: true, model: 'gpt-5.6-terra-medium', schoolId: taiDecision.schoolId, editionId: taiDecision.editionId, locator: taiDecision.locator, sourceDigest: taiDecision.sourceDigest, claimId: taiDecision.subjectId, formulaComparison: 'CONFLICT', verdict: 'CONFLICT', conditions: ['alias_tai_an_modern'], exceptions: [], quotation: '财印坐马格' }
    ]
}).decision, 'AI_ACCEPTED');

console.log('sprint 9c keeps the prior 24 decisions and does not promote a short quotation');
