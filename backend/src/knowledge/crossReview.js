import { createHash } from 'crypto';

export const POLICY_VERSION = 'dual-ai-source-review-v1';

const AGREEMENT_FIELDS = ['schoolId', 'editionId', 'locator', 'claimId', 'formulaComparison', 'verdict'];
const FORMULA = new Set(['MATCH', 'PARTIAL', 'CONFLICT', 'NOT_IMPLEMENTED']);
const HEX64 = /^[0-9a-f]{64}$/;

function decision(fields) {
    return {
        policyVersion: POLICY_VERSION,
        reviewMethod: 'dual_ai_independent_then_cross_review',
        expertVerified: false,
        runtimeRuleChangeApplied: false,
        ...fields
    };
}

function listOf(value) {
    if (!Array.isArray(value)) return null;
    if (value.some((item) => typeof item !== 'string' || item.trim() === '')) return null;
    return [...value].sort();
}

function sameList(left, right) {
    const a = listOf(left);
    const b = listOf(right);
    if (!a || !b || a.length !== b.length) return false;
    return a.every((item, index) => item === b[index]);
}

function text(value) {
    return typeof value === 'string' && value.trim() !== '';
}

function spanContains(span, quotation) {
    return typeof quotation === 'string' && quotation.trim().length >= 40 && quotation.trim() === quotation && span.includes(quotation);
}

function digestOf(span) {
    return createHash('sha256').update(span).digest('hex');
}

function missingRequired(required, actual) {
    const items = listOf(actual) || [];
    return (required || []).some((item) => !items.includes(item));
}

export function compareReviews(input) {
    if (!input || input.sourceAvailable !== true || typeof input.storedSpan !== 'string' || input.storedSpan.trim() === '') {
        return decision({ decision: 'SOURCE_INACCESSIBLE', reason: 'stored source span is missing' });
    }
    if (!HEX64.test(input.sourceDigest || '') || digestOf(input.storedSpan) !== input.sourceDigest) {
        return decision({ decision: 'UNRESOLVED', reason: 'source digest does not match the stored span' });
    }
    if (!text(input.editionId) || !Array.isArray(input.requiredConditions) || input.requiredConditions.length === 0 || !Array.isArray(input.requiredExceptions) || !Array.isArray(input.requiredAnchors) || input.requiredAnchors.length === 0) {
        return decision({ decision: 'UNRESOLVED', reason: 'stored edition, conditions, or anchors are missing' });
    }
    const reviews = Array.isArray(input.reviews) ? input.reviews : [];
    if (reviews.some((review) => !review || review.available !== true)) {
        return decision({ decision: 'REVIEW_NOT_EXECUTED', reason: 'a configured model did not return a review' });
    }
    if (reviews.length !== 2) {
        return decision({ decision: 'UNRESOLVED', reason: 'cross-review needs exactly two reviews' });
    }
    const [left, right] = reviews;
    if (left.sourceDigest !== input.sourceDigest || right.sourceDigest !== input.sourceDigest) {
        return decision({ decision: 'UNRESOLVED', reason: 'review digest does not match the stored source' });
    }
    if (input.editionId && (left.editionId !== input.editionId || right.editionId !== input.editionId)) {
        return decision({
            decision: left.editionId === right.editionId ? 'UNRESOLVED' : 'CONFLICT',
            reason: 'edition does not match the stored edition'
        });
    }
    const disagreements = AGREEMENT_FIELDS.filter((field) => left[field] !== right[field]);
    if (disagreements.length > 0) {
        return decision({ decision: 'CONFLICT', reason: 'reviews disagree', disagreements });
    }
    if (text(input.schoolId) && left.schoolId !== input.schoolId) {
        return decision({ decision: 'UNRESOLVED', reason: 'school does not match the stored school' });
    }
    if (text(input.locator) && left.locator !== input.locator) {
        return decision({ decision: 'UNRESOLVED', reason: 'locator does not match the stored locator' });
    }
    if (!text(left.model) || !text(right.model) || left.model.trim() !== left.model || right.model.trim() !== right.model || left.model.trim() === right.model.trim()) {
        return decision({ decision: 'UNRESOLVED', reason: 'reviews are not from two models' });
    }
    if (['schoolId', 'editionId', 'locator', 'claimId'].some((field) => !text(left[field])) || !FORMULA.has(left.formulaComparison)) {
        return decision({ decision: 'UNRESOLVED', reason: 'agreed identity or formula status is incomplete' });
    }
    if (left.formulaComparison !== left.verdict || right.formulaComparison !== right.verdict) {
        return decision({ decision: 'UNRESOLVED', reason: 'verdict does not match formulaComparison' });
    }
    if (!spanContains(input.storedSpan, left.quotation) || !spanContains(input.storedSpan, right.quotation)) {
        return decision({ decision: 'UNRESOLVED', reason: 'quotation is not in the stored span' });
    }
    if (!sameList(left.conditions, right.conditions)) {
        return decision({ decision: 'CONFLICT', reason: 'reviews disagree on conditions' });
    }
    if (Array.isArray(input.allowedConditions) && input.allowedConditions.length > 0) {
        const allowed = new Set(input.allowedConditions);
        if ((listOf(left.conditions) || []).some((item) => !allowed.has(item))) {
            return decision({ decision: 'UNRESOLVED', reason: 'reviews add a condition outside the allowed set' });
        }
    }
    if (missingRequired(input.requiredConditions, left.conditions)) {
        return decision({ decision: 'UNRESOLVED', reason: 'a stored condition is missing from the reviews' });
    }
    if (!sameList(left.exceptions || [], right.exceptions || [])) {
        return decision({ decision: 'CONFLICT', reason: 'reviews disagree on exceptions' });
    }
    if (missingRequired(input.requiredExceptions, left.exceptions || [])) {
        return decision({ decision: 'UNRESOLVED', reason: 'an exception is missing' });
    }
    if (input.requiredAnchors.some((anchor) => typeof anchor !== 'string' || anchor.length < 4 || !left.quotation.includes(anchor) || !right.quotation.includes(anchor))) {
        return decision({ decision: 'UNRESOLVED', reason: 'quotation does not contain a required anchor' });
    }
    return decision({
        decision: 'AI_ACCEPTED',
        crossReviewOutcome: 'AI_CROSS_REVIEWED',
        schoolId: left.schoolId,
        editionId: left.editionId,
        locator: left.locator,
        sourceDigest: input.sourceDigest,
        claimId: left.claimId,
        formulaComparison: left.formulaComparison,
        conditions: listOf(left.conditions),
        exceptions: listOf(left.exceptions || [])
    });
}
