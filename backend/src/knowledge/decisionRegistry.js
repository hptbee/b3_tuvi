import { POLICY_VERSION } from './crossReview.js';

const PLACEHOLDER_DIGEST = /placeholder|example-digest|actual-digest-at-runtime|todo/i;

function issue(code, message) {
    return { code, message };
}

export function validateDecisionRecord(record) {
    const errors = [];
    if (!record || typeof record !== 'object') {
        return { ok: false, errors: [issue('malformed', 'decision record required')] };
    }
    if (record.expertVerified !== false) {
        errors.push(issue('expert_verified', 'expertVerified must stay false'));
    }
    if (record.policyVersion !== POLICY_VERSION) {
        errors.push(issue('policy', 'policyVersion is not the dual-AI source policy'));
    }
    if (typeof record.sourceDigest !== 'string' || record.sourceDigest.trim() === '' || PLACEHOLDER_DIGEST.test(record.sourceDigest)) {
        errors.push(issue('digest', 'sourceDigest must be a measured digest'));
    }
    if (!Array.isArray(record.reviewers) || record.reviewers.length !== 2 || record.reviewers.some((reviewer) => !reviewer || typeof reviewer.reviewRef !== 'string' || reviewer.reviewRef.trim() === '')) {
        errors.push(issue('reviewers', 'two review refs are required'));
    }
    if (record.decision === 'AI_ACCEPTED') {
        if (record.crossReviewOutcome !== 'AI_CROSS_REVIEWED') {
            errors.push(issue('promotion', 'AI_ACCEPTED requires a cross-review outcome'));
        }
        if ((record.reviewers || []).some((reviewer) => reviewer?.available === false)) {
            errors.push(issue('promotion', 'an unavailable review cannot be accepted'));
        }
    }
    if (record.decision === 'REVIEW_NOT_EXECUTED' && record.crossReviewOutcome === 'AI_CROSS_REVIEWED') {
        errors.push(issue('promotion', 'REVIEW_NOT_EXECUTED cannot be cross-reviewed'));
    }
    return { ok: errors.length === 0, errors };
}

export function readDecision(record) {
    const checked = validateDecisionRecord(record);
    if (!checked.ok) return { ok: false, decision: null, expertVerified: false, errors: checked.errors };
    return { ok: true, decision: record.decision, expertVerified: false, errors: [] };
}
