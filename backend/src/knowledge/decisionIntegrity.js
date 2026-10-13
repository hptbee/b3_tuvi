import { compareReviews } from './crossReview.js';

function sorted(value) {
    return [...(value || [])].sort();
}

function sameList(left, right) {
    const a = sorted(left);
    const b = sorted(right);
    return a.length === b.length && a.every((item, index) => item === b[index]);
}

export function verifyDecisionBinding({ record, reviews, storedSpan, baseline } = {}) {
    if (!record || !baseline || typeof storedSpan !== 'string' || !Array.isArray(reviews)) {
        return { ok: false, reason: 'binding_evidence_missing', compared: null };
    }
    const compared = compareReviews({
        sourceAvailable: baseline.sourceAvailable !== false,
        storedSpan,
        sourceDigest: baseline.sourceDigest,
        editionId: baseline.editionId,
        schoolId: baseline.schoolId,
        locator: baseline.locator,
        requiredConditions: baseline.requiredConditions,
        requiredExceptions: baseline.requiredExceptions || [],
        requiredAnchors: baseline.requiredAnchors,
        allowedConditions: baseline.allowedConditions,
        reviews
    });
    if (compared.decision !== record.decision) {
        return { ok: false, reason: 'replay_mismatch', compared };
    }
    if (record.sourceDigest !== baseline.sourceDigest) {
        return { ok: false, reason: 'digest_mismatch', compared };
    }
    if (record.decision === 'AI_ACCEPTED') {
        if (record.formulaComparison !== compared.formulaComparison) return { ok: false, reason: 'formula_tamper', compared };
        if (record.schoolId !== compared.schoolId) return { ok: false, reason: 'school_tamper', compared };
        if (record.editionId !== compared.editionId) return { ok: false, reason: 'edition_tamper', compared };
        if (record.locator !== compared.locator) return { ok: false, reason: 'locator_tamper', compared };
        if (!sameList(record.conditions, compared.conditions)) return { ok: false, reason: 'conditions_tamper', compared };
        if (!sameList(record.exceptions || [], compared.exceptions || [])) return { ok: false, reason: 'exceptions_tamper', compared };
        if (record.expertVerified !== false) return { ok: false, reason: 'expert_tamper', compared };
    }
    return { ok: true, reason: null, compared };
}
