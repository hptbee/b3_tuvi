import { resolveStar } from '../engine/starCatalog.js';
import { readDecision } from '../knowledge/decisionRegistry.js';

const NGUYET_ID = resolveStar('Thái Âm').starId;

const STRUCTURAL = new Set([
    'palace_menh_or_quan_loc',
    'branch_hoi',
    'star_nguyet_toa_thu',
    'avoid_tuan',
    'avoid_triet'
]);

function result(decision, fields) {
    return {
        prose: null,
        expertVerified: false,
        usage: 'internal_research',
        claimId: decision?.subjectId || null,
        sourceId: decision?.sourceId || null,
        editionId: decision?.editionId || null,
        locator: decision?.locator || null,
        formulaComparison: decision?.formulaComparison || null,
        ...fields
    };
}

function hostPalace(chart) {
    return (chart?.palaces || []).find((palace) => (
        (palace.functionId === 'menh' || palace.functionId === 'quan_loc')
        && palace.branchName === 'Hợi'
        && (palace.stars || []).some((star) => star.starId === NGUYET_ID)
    )) || null;
}

function evaluateCondition(conditionId, chart) {
    if (!STRUCTURAL.has(conditionId)) {
        return { conditionId, status: 'not_implemented' };
    }
    const host = hostPalace(chart);
    if (!host) return { conditionId, status: 'not_satisfied' };
    if (conditionId === 'avoid_tuan') {
        return { conditionId, status: host.isTuan ? 'not_satisfied' : 'satisfied' };
    }
    if (conditionId === 'avoid_triet') {
        return { conditionId, status: host.isTriet ? 'not_satisfied' : 'satisfied' };
    }
    return { conditionId, status: 'satisfied' };
}

export function evaluateInternalSlice(chart, decision) {
    const read = readDecision(decision);
    if (!read.ok || read.decision !== 'AI_ACCEPTED') {
        return result(decision, { availabilityStatus: 'insufficient_evidence', conditionResults: [] });
    }
    if (!chart?.schoolId || chart.schoolId !== decision.schoolId) {
        return result(decision, { availabilityStatus: 'insufficient_evidence', reason: 'school_mismatch', conditionResults: [] });
    }
    const conditionResults = decision.conditions.map((conditionId) => evaluateCondition(conditionId, chart));
    if (conditionResults.some((item) => item.status === 'not_implemented')) {
        return result(decision, { availabilityStatus: 'not_implemented', conditionResults });
    }
    if (conditionResults.some((item) => item.status !== 'satisfied')) {
        return result(decision, { availabilityStatus: 'insufficient_evidence', conditionResults });
    }
    return result(decision, { availabilityStatus: 'conditional_match', conditionResults });
}
