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
    const expectedIdentity = item.slug === 'hung-tu-trieu-vien' ? 'NAME_MISMATCH' : 'UNRESOLVED_IDENTITY';
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
        allowedConditions: item.allowed
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
        assert.strictEqual(decision.decision, 'UNRESOLVED');
        assert.notStrictEqual(compareReviews({ sourceAvailable: true, storedSpan: span, ...baseline, reviews: [reviewA, reviewB] }).decision, 'AI_ACCEPTED');
    }
}

const report = readFileSync(`${root}SPRINT_9C_SOURCE_DISCOVERY_REPORT.md`, 'utf8');
assert.match(report, /Candidates examined: 39\/39/);
assert.match(report, /URL validity checked: 39\/39/);
assert.match(report, /Dual-AI reviewed: 20\/39/);
assert.match(report, /REVIEW_NOT_EXECUTED`: 19/);

assert.deepStrictEqual(sprint9cObligationIds(null, null), []);

console.log('sprint 9c keeps the prior 24 decisions and does not promote a short quotation');
