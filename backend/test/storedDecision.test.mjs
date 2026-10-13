import assert from 'assert';
import { createHash } from 'crypto';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { compareReviews } from '../src/knowledge/crossReview.js';
import { readDecision, validateDecisionRecord } from '../src/knowledge/decisionRegistry.js';

const root = fileURLToPath(new URL('../../docs/knowledge/', import.meta.url));
const manifest = JSON.parse(readFileSync(`${root}combination-passages.json`, 'utf8'));

function allowedIds(prompt) {
    const block = prompt.split('Allowed condition ids:\n')[1]?.split('\n\n')[0] || '';
    return block.split('\n').map((line) => line.trim()).filter(Boolean);
}

function anchorOf(prompt) {
    const line = prompt.split('\n').find((item) => item.includes('must include this anchor:'));
    if (!line) return null;
    return line.split('must include this anchor:')[1].replace(/^ /, '');
}

function requiredConditions(review, allowed) {
    const conditions = review.conditions;
    if (Array.isArray(conditions) && conditions.length > 0 && conditions.every((item) => typeof item === 'string' && item.trim() !== '')) {
        return conditions;
    }
    return allowed;
}

const NGUYET_ANCHORS = [
    'Cung Mệnh hay Quan Lộc an tại Hợi có Nguyệt tọa thủ',
    'xa lánh Tuần',
    'Sát tinh và Bại tinh',
    'Khoa, Quyền, Lộc'
];

const files = readdirSync(`${root}decisions`).filter((name) => name.endsWith('.json')).sort();
assert.ok(files.includes('nguyet-lang-thien-mon.json'));
assert.strictEqual(files.length, manifest.entries.filter((entry) => entry.located === true).length);

for (const file of files) {
    const slug = file.replace(/\.json$/, '');
    const decision = JSON.parse(readFileSync(`${root}decisions/${file}`, 'utf8'));
    const reviewA = JSON.parse(readFileSync(`${root}reviews/${slug}/review-a.json`, 'utf8'));
    const reviewB = JSON.parse(readFileSync(`${root}reviews/${slug}/review-b.json`, 'utf8'));
    const passage = manifest.entries.find((entry) => entry.claimId === decision.subjectId);
    assert.strictEqual(passage?.located, true, slug);
    const span = readFileSync(`${root}${passage.spanFile.replace('docs/knowledge/', '')}`, 'utf8').replace(/\n$/, '');
    assert.strictEqual(createHash('sha256').update(span).digest('hex'), decision.sourceDigest, slug);
    const checked = validateDecisionRecord(decision);
    assert.strictEqual(checked.ok, true, `${slug} ${JSON.stringify(checked.errors)}`);
    assert.strictEqual(readDecision(decision).decision, decision.decision, slug);
    assert.strictEqual(decision.expertVerified, false, slug);
    assert.strictEqual(decision.runtimeRuleChangeApplied, false, slug);
    const prompt = readFileSync(`${root}reviews/${slug}/prompt-v1.txt`, 'utf8');
    const promptSpan = prompt.split('SPAN:\n')[1]?.replace(/\n$/, '');
    assert.strictEqual(promptSpan, span, slug);
    const anchor = anchorOf(prompt);
    const nguyet = slug === 'nguyet-lang-thien-mon';
    const requiredAnchors = nguyet ? NGUYET_ANCHORS : [anchor];
    assert.ok(requiredAnchors.every((item) => typeof item === 'string' && item.length >= 4), slug);
    const compared = compareReviews({
        sourceAvailable: true,
        storedSpan: span,
        sourceDigest: decision.sourceDigest,
        editionId: decision.editionId,
        requiredConditions: nguyet ? decision.conditions : requiredConditions(reviewA, allowedIds(prompt)),
        requiredExceptions: nguyet ? decision.exceptions : [],
        requiredAnchors,
        reviews: [reviewA, reviewB]
    });
    assert.strictEqual(compared.decision, decision.decision, `${slug} ${compared.reason || ''}`);
    assert.strictEqual(compared.expertVerified, false, slug);
    if (decision.decision === 'AI_ACCEPTED') {
        assert.strictEqual(compared.formulaComparison, decision.formulaComparison, slug);
        assert.deepStrictEqual(compared.conditions, decision.conditions, slug);
        assert.deepStrictEqual(compared.exceptions, decision.exceptions, slug);
        assert.strictEqual(decision.crossReviewOutcome, 'AI_CROSS_REVIEWED', slug);
    } else {
        assert.notStrictEqual(decision.crossReviewOutcome, 'AI_CROSS_REVIEWED', slug);
    }
}

console.log(`stored decisions replayed=${files.length}`);
