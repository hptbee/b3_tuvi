import { POLICY_VERSION } from './crossReview.js';

const HEX64 = /^[0-9a-f]{64}$/;
const DECISIONS = new Set(['AI_ACCEPTED', 'CONFLICT', 'UNRESOLVED', 'SOURCE_INACCESSIBLE', 'REVIEW_NOT_EXECUTED']);

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
    if (typeof record.sourceDigest !== 'string' || !HEX64.test(record.sourceDigest)) {
        errors.push(issue('digest', 'sourceDigest must be a measured sha256'));
    }
    if (!DECISIONS.has(record.decision)) {
        errors.push(issue('decision', 'decision is not a known outcome'));
    }
    const reviewers = Array.isArray(record.reviewers) ? record.reviewers : [];
    const refs = reviewers.map((reviewer) => reviewer?.reviewRef);
    if (reviewers.length !== 2 || refs.some((ref) => typeof ref !== 'string' || ref.trim() === '' || ref.trim() !== ref) || new Set(refs.map((ref) => ref.trim())).size !== 2) {
        errors.push(issue('reviewers', 'two distinct review refs are required'));
    }
    if (record.crossReviewOutcome === 'AI_CROSS_REVIEWED' && record.decision !== 'AI_ACCEPTED') {
        errors.push(issue('promotion', 'only an accepted decision is cross-reviewed'));
    }
    if (record.decision === 'AI_ACCEPTED') {
        if (record.crossReviewOutcome !== 'AI_CROSS_REVIEWED') {
            errors.push(issue('promotion', 'AI_ACCEPTED requires a cross-review outcome'));
        }
        if (typeof record.editionId !== 'string' || record.editionId.trim() === '' || typeof record.locator !== 'string' || record.locator.trim() === '') {
            errors.push(issue('locator', 'an accepted decision needs an edition and locator'));
        }
        const models = reviewers.map((reviewer) => reviewer?.model);
        if (models.some((model) => typeof model !== 'string' || model.trim() === '' || model.trim() !== model) || new Set(models.map((model) => model.trim())).size !== 2) {
            errors.push(issue('reviewers', 'accepted reviews need two models'));
        }
        if (reviewers.some((reviewer) => reviewer?.available !== true)) {
            errors.push(issue('promotion', 'an unavailable review cannot be accepted'));
        }
        if (!Array.isArray(record.conditions) || record.conditions.length === 0 || record.conditions.some((item) => typeof item !== 'string' || item.trim() === '')) {
            errors.push(issue('conditions', 'an accepted decision needs conditions'));
        }
    }
    return { ok: errors.length === 0, errors };
}

export function readDecision(record) {
    const checked = validateDecisionRecord(record);
    if (!checked.ok) return { ok: false, decision: null, expertVerified: false, errors: checked.errors };
    return { ok: true, decision: record.decision, expertVerified: false, errors: [] };
}
