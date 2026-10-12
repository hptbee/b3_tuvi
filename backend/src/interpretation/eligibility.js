export function claimEligibility(claim, chart = {}) {
    const reasons = [];
    if (!claim || typeof claim !== 'object' || !claim.claimId) reasons.push('missing_claim');
    if (claim?.usage === 'synthetic_test_fixture') reasons.push('synthetic_fixture');
    if (claim?.approvedForInterpretation !== true) reasons.push('not_approved_for_interpretation');
    if (claim?.interpretationStatus !== 'sourced') reasons.push('interpretation_not_sourced');
    const hasSource = Boolean(claim?.sourceId) || (claim?.sourceReferences || []).length > 0;
    if (!hasSource) reasons.push('missing_source');
    if (claim?.formulaComparisonStatus && claim.formulaComparisonStatus !== 'MATCH') {
        reasons.push('formula_not_matched');
    }
    if (claim?.schoolId && chart.schoolId && claim.schoolId !== chart.schoolId) {
        reasons.push('school_mismatch');
    }
    return {
        claimId: claim?.claimId || null,
        eligible: reasons.length === 0,
        reasons
    };
}
