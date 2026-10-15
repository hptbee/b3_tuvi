import { verifyInterpretationBinding } from '../knowledge/interpretationBinding.js';

/**
 * Deterministic wording. Only copies a stored approved sentence.
 * Does not invent Vietnamese from star names or formula MATCH.
 */
export function approvedSentence(claim) {
    const text = typeof claim?.approvedWording === 'string' ? claim.approvedWording.trim() : '';
    if (!text) return null;
    if (claim.sourceReviewStatus !== 'AI_CROSS_REVIEWED') return null;
    if (claim.approvedForInterpretation !== true) return null;
    if (claim.interpretationStatus !== 'sourced') return null;
    if (!claim.sourceId || !claim.schoolId) return null;
    if (Array.isArray(claim.contradicts) && claim.contradicts.length > 0) return null;
    const binding = verifyInterpretationBinding(claim);
    return binding.ok ? binding.approvedWording : null;
}

export function renderInternalProse(eligibleClaims) {
    const sentences = [];
    for (const claim of eligibleClaims) {
        const sentence = approvedSentence(claim);
        if (!sentence) continue;
        const source = claim.sourceId;
        const school = claim.schoolId;
        sentences.push(`Theo nguồn ${source}, trường phái ${school}, khi điều kiện đã ghi được thỏa: ${sentence}`);
    }
    sentences.sort();
    return sentences.length ? sentences.join(' ') : null;
}
