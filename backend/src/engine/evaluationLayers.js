/**
 * Each layer is computed from its own input.
 * A runtime match is never copied into formation, grade, breaking, or interpretation eligibility.
 */
export function evaluateLayers({
    runtimeMatch = 'not_matched',
    formation,
    grade,
    breaking,
    interpretationEligible = false
} = {}) {
    return {
        runtimeMatch: { status: runtimeMatch === 'matched' ? 'matched' : 'not_matched' },
        formation: layerStatus(formation, 'unknown'),
        grade: gradeStatus(grade),
        breaking: breakingStatus(breaking),
        interpretationEligibility: {
            eligible: interpretationEligible === true,
            reasons: interpretationEligible === true ? [] : ['not_approved_for_interpretation']
        }
    };
}

function layerStatus(value, fallback) {
    if (!value || typeof value !== 'object' || !value.status) return { status: fallback };
    return { status: value.status, ...(value.reason ? { reason: value.reason } : {}) };
}

function gradeStatus(value) {
    if (!value || typeof value !== 'object' || !value.status) return { status: 'not_certified' };
    return { status: value.status };
}

function breakingStatus(value) {
    if (!value || typeof value !== 'object' || !value.status) return { status: 'not_implemented' };
    if (value.status === 'checked_clear' && value.evaluated !== true) return { status: 'not_implemented' };
    return { status: value.status };
}
