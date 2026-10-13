import decision from '../../../docs/knowledge/decisions/tu-phu-dong-cung.json' with { type: 'json' };
import combinations from '../data/combinations.json' with { type: 'json' };
import { evaluateNormalizedFormulas } from '../engine/combinationMatch.js';
import { readDecision } from '../knowledge/decisionRegistry.js';

const COMBINATION = 'Tử Phủ Đồng Cung';

function closed(extra) {
    return {
        usage: 'internal_research',
        combination: COMBINATION,
        prose: null,
        expertVerified: false,
        publicRelease: false,
        auspicious: false,
        ...extra
    };
}

/**
 * Internal path for one formation. A formula MATCH does not authorize interpretation prose.
 * The chart must already be the server-normalized chart. This function does not accept birth data
 * and does not treat a caller-supplied palace list as a substitute for that normalization contract.
 */
export function evaluateTuPhuDongCungSlice(chart) {
    const stored = readDecision(decision);
    const sourceVerification = {
        decisionId: decision.decisionId,
        decision: stored.ok ? stored.decision : null,
        formulaComparison: decision.formulaComparison,
        expertVerified: false,
        sourceId: decision.sourceId,
        editionId: decision.editionId,
        locator: decision.locator,
        reviewMethod: decision.reviewMethod,
        authorizesInterpretationProse: false
    };
    const interpretationEligibility = {
        eligible: false,
        reasons: ['formula_match_is_not_interpretation_approval', 'not_approved_for_interpretation']
    };
    if (!stored.ok || !chart?.ok || !Array.isArray(chart.palaces) || chart.palaces.length !== 12 || chart.chartSource !== 'server') {
        return closed({
            availabilityStatus: 'insufficient_evidence',
            reason: chart?.chartSource === 'server' ? 'decision_not_readable' : 'chart_not_server_calculated',
            runtimeMatch: { status: 'not_matched' },
            formation: { status: 'not_matched' },
            grade: { status: 'not_applicable' },
            breaking: { status: 'not_evaluated' },
            sourceVerification,
            interpretationEligibility
        });
    }
    const catalog = combinations.filter((item) => item.name === COMBINATION);
    const hit = evaluateNormalizedFormulas(chart, catalog)[0] || null;
    return closed({
        availabilityStatus: 'insufficient_evidence',
        reason: 'formula_match_is_not_interpretation_approval',
        runtimeMatch: hit ? {
            status: 'matched',
            catalogId: hit.catalogId,
            ruleId: hit.evidence?.ruleId || null,
            palaceId: hit.evidence?.palaceId || null,
            branchName: hit.evidence?.branchName || null,
            sourceProfile: hit.sourceProfile
        } : { status: 'not_matched' },
        formation: { status: hit ? 'matched' : 'not_matched' },
        grade: { status: hit?.gradeStatus || 'not_applicable' },
        breaking: { status: 'not_evaluated' },
        sourceVerification,
        interpretationEligibility
    });
}
