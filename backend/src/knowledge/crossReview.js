export const POLICY_VERSION = 'dual-ai-source-review-v1';

const AGREEMENT_FIELDS = ['schoolId', 'editionId', 'locator', 'claimId', 'formulaComparison', 'verdict'];

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

function spanContains(span, quotation) {
    return typeof quotation === 'string' && quotation.trim().length > 0 && span.includes(quotation);
}

function missingRequired(required, actual) {
    const items = listOf(actual) || [];
    return (required || []).some((item) => !items.includes(item));
}

export function compareReviews(input) {
    if (!input || input.sourceAvailable !== true || typeof input.storedSpan !== 'string' || input.storedSpan.trim() === '' || typeof input.sourceDigest !== 'string' || input.sourceDigest.trim() === '') {
        return decision({ decision: 'SOURCE_INACCESSIBLE', reason: 'stored source span or digest is missing' });
    }
    const reviews = Array.isArray(input.reviews) ? input.reviews : [];
    if (reviews.length === 0 || reviews.some((review) => !review || review.available === false)) {
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
    if (!spanContains(input.storedSpan, left.quotation) || !spanContains(input.storedSpan, right.quotation)) {
        return decision({ decision: 'UNRESOLVED', reason: 'quotation is not in the stored span' });
    }
    if (!sameList(left.conditions, right.conditions)) {
        return decision({ decision: 'CONFLICT', reason: 'reviews disagree on conditions' });
    }
    if (missingRequired(input.requiredConditions, left.conditions)) {
        return decision({ decision: 'UNRESOLVED', reason: 'a stored condition is missing from the reviews' });
    }
    if (!sameList(left.exceptions || [], right.exceptions || []) || missingRequired(input.requiredExceptions, left.exceptions || [])) {
        return decision({ decision: 'UNRESOLVED', reason: 'an exception is missing or disputed' });
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
