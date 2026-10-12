const RELATIONSHIP_OPS = new Set(['giap_both_flanks', 'giap_anchor_flanks', 'clauses', 'linked', 'count']);

function instancesOf(stars) {
    return stars.flatMap((star) => {
        const palaces = Array.isArray(star.palaces) ? star.palaces : [];
        return palaces.map((palaceId, index) => ({
            starId: star.starId,
            palaceId,
            brightness: Array.isArray(star.brightness) ? (star.brightness[index] ?? null) : (star.brightness ?? null)
        }));
    });
}

/**
 * DTO cho một hit đã có của rule engine. Không đánh giá phá cách và không đổi kết quả match.
 * @param {object | null | undefined} evidence evidence hiện tại của evaluateRule
 * @param {{ sourceClaimReferences?: { claimId: string, sourceId?: string }[] }} [context]
 */
export function buildEvidenceV3(evidence, context = {}) {
    if (!evidence || typeof evidence !== 'object' || !evidence.ruleId) return null;
    const stars = Array.isArray(evidence.stars) ? evidence.stars : [];
    const matchedStarInstances = instancesOf(stars);
    const references = Array.isArray(context.sourceClaimReferences) ? context.sourceClaimReferences.map((item) => ({ ...item })) : [];
    return {
        version: 3,
        patternDetected: true,
        formationConditions: 'satisfied',
        breakingConditions: 'unknown',
        ruleId: evidence.ruleId,
        schoolId: evidence.schoolId ?? null,
        targetPalace: {
            palaceId: evidence.palaceId ?? null,
            branchName: evidence.branchName ?? null
        },
        matchedStars: stars.map((star) => star.starId),
        matchedStarInstances,
        relationshipEvidence: RELATIONSHIP_OPS.has(evidence.op)
            ? [{ op: evidence.op, starIds: stars.map((star) => star.starId) }]
            : [],
        brightnessEvidence: matchedStarInstances.filter((item) => item.brightness),
        satisfiedConditions: evidence.op ? [{ op: evidence.op, status: 'satisfied' }] : [],
        unresolvedConditions: [],
        sourceClaimReferences: references,
        verification: {
            formulaStatus: 'undocumented',
            bibliographicStatus: 'unverified',
            interpretationStatus: 'unreviewed'
        }
    };
}
