import { evaluateRule } from '../engine/ruleEngine.js';

function listedIds(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((item) => typeof item === 'string' && item.trim() !== '');
}

function palaceStars(palace) {
    return new Set((palace?.stars || []).map((star) => star.starId).filter(Boolean));
}

function targetsFor(claim, chart, palace) {
    if (palace) return [palace];
    const ids = listedIds(claim?.relatedPalaces);
    return (chart?.palaces || []).filter((item) => ids.includes(item.functionId));
}

const RULE_KEYS = new Set([
    'samePalace', 'giap', 'clauses', 'countAtLeast', 'linked', 'noMajor',
    'anyOf', 'branches', 'brightHost', 'soleMajor', 'absent', 'excluded',
    'splitPalaces', 'brightness'
]);

function ruleBody(rule) {
    if (!rule || typeof rule !== 'object') return false;
    const keys = Object.keys(rule).filter((key) => key !== 'id' && key !== 'target');
    if (keys.some((key) => !RULE_KEYS.has(key))) return 'unknown';
    return keys.length > 0;
}

/**
 * A condition evaluation is non-empty only when at least one star check
 * actually ran against a palace. Unknown prose in `conditions` is not a pass.
 */
export function evaluateClaimConditions(claim, chart = {}, palace = null) {
    const stars = listedIds(claim?.relatedStars);
    const phrases = Array.isArray(claim?.conditions) ? claim.conditions : null;
    const rule = claim?.rule && typeof claim.rule === 'object' ? claim.rule : null;
    const targets = targetsFor(claim, chart, palace);
    if (phrases && phrases.some((item) => typeof item !== 'string' || item.trim() === '')) {
        return { evaluated: false, holds: false };
    }
    const executablePhrases = phrases ? phrases.map((item) => item.trim()).filter(Boolean) : [];
    const parsed = [];
    for (const phrase of executablePhrases) {
        const match = /^starId=([a-z0-9_]+)$/.exec(phrase);
        if (!match) return { evaluated: false, holds: false };
        parsed.push(match[1]);
    }
    const hasRule = ruleBody(rule);
    if (hasRule === 'unknown') return { evaluated: false, holds: false };
    if (stars.length === 0 && parsed.length === 0 && !hasRule) {
        return { evaluated: false, holds: false };
    }
    if ((stars.length > 0 || parsed.length > 0) && targets.length === 0) {
        return { evaluated: false, holds: false };
    }
    const required = [...stars, ...parsed];
    if (required.length > 0) {
        const holds = targets.every((target) => {
            const present = palaceStars(target);
            return required.every((starId) => present.has(starId));
        });
        if (!holds) return { evaluated: true, holds: false };
    }
    if (hasRule) {
        const hit = evaluateRule(chart, {
            ...rule,
            id: rule.id || claim.claimId || 'claim-rule',
            target: rule.target || palace?.functionId || claim.relatedPalaces?.[0] || 'menh'
        });
        if (!hit) return { evaluated: true, holds: false };
        if (palace && String(hit.evidence?.palaceId) !== String(palace.id)) {
            return { evaluated: true, holds: false };
        }
    }
    return { evaluated: true, holds: true };
}

/**
 * Separate gates. Formula MATCH and AI formula review do not approve interpretation.
 * Public release stays withheld unless releasePermission is owner_released.
 */
export function claimEligibility(claim, chart = {}, palace = null) {
    const reasons = [];
    if (!claim || typeof claim !== 'object' || !claim.claimId) reasons.push('missing_claim');
    if (claim?.usage === 'synthetic_test_fixture') reasons.push('synthetic_fixture');
    const hasSource = Boolean(claim?.sourceId) || (claim?.sourceReferences || []).length > 0;
    const sourceReview = claim?.sourceReviewStatus === 'AI_CROSS_REVIEWED' && hasSource
        ? 'traceable'
        : (claim?.sourceReviewStatus === 'contradictory' ? 'contradictory' : 'missing');
    if (!hasSource) reasons.push('missing_source');
    if (claim?.sourceReviewStatus === 'contradictory') reasons.push('source_review_contradictory');
    else if (claim?.sourceReviewStatus !== 'AI_CROSS_REVIEWED') reasons.push('source_review_not_recorded');
    if (claim?.formulaComparisonStatus !== 'MATCH') {
        reasons.push(claim?.formulaComparisonStatus ? 'formula_not_matched' : 'formula_status_missing');
    }
    if (claim?.approvedForInterpretation !== true) reasons.push('not_approved_for_interpretation');
    if (claim?.interpretationStatus !== 'sourced') reasons.push('interpretation_not_sourced');
    if (claim?.schoolId && claim.schoolId !== chart.schoolId) {
        reasons.push('school_mismatch');
    }
    const conditions = evaluateClaimConditions(claim, chart, palace);
    if (!conditions.evaluated) reasons.push('conditions_not_evaluated');
    else if (!conditions.holds) reasons.push('conditions_not_met');
    const releasePermission = claim?.releasePermission === 'owner_released' ? 'owner_released' : 'withheld';
    const layers = {
        sourceReview,
        formulaComparison: claim?.formulaComparisonStatus === 'MATCH' ? 'match' : 'not_match',
        runtimeConditions: !conditions.evaluated ? 'not_evaluated' : (conditions.holds ? 'satisfied' : 'unsatisfied'),
        interpretationApproval: claim?.approvedForInterpretation === true && claim?.interpretationStatus === 'sourced'
            ? 'approved'
            : 'not_approved',
        releasePermission
    };
    return {
        claimId: claim?.claimId || null,
        eligible: reasons.length === 0,
        reasons,
        layers,
        publicRelease: releasePermission === 'owner_released' && reasons.length === 0
    };
}
