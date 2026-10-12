import rulesV2 from '../data/rulesV2.json' with { type: 'json' };
import pilot from '../../../docs/knowledge/pilotClaims.json' with { type: 'json' };
import { evaluateRule } from '../engine/ruleEngine.js';
import { buildEvidenceV3 } from '../engine/evidenceV3.js';
import { branchIndexRelations } from '../engine/palaceRelation.js';
import { claimEligibility } from './eligibility.js';

export const PALACE_FUNCTIONS = [
    'menh',
    'phu_mau',
    'phuc_duc',
    'dien_trach',
    'quan_loc',
    'no_boc',
    'thien_di',
    'tat_ach',
    'tai_bach',
    'tu_tuc',
    'phu_the',
    'huynh_de'
];

export const CORE_PALACES = ['menh', 'phuc_duc', 'quan_loc', 'tai_bach'];

function byId(left, right) {
    return String(left.claimId || left.ruleId || left.starId || '').localeCompare(String(right.claimId || right.ruleId || right.starId || ''));
}

function catalogClaims(extra) {
    const fromPilot = pilot.claims.map((claim) => ({
        ...claim,
        sourceId: claim.sourceId || pilot.sourceId,
        editionId: claim.editionId || pilot.editionId,
        usage: 'research_pilot'
    }));
    return [...fromPilot, ...(extra || [])];
}

function applicableClaims(claims, chart, functionId, hits) {
    const hitRuleIds = new Set(hits.map((hit) => hit.ruleId));
    return claims.filter((claim) => {
        if (!claim || typeof claim !== 'object') return false;
        if (Array.isArray(claim.relatedPalaces) && claim.relatedPalaces.includes(functionId)) return true;
        return Boolean(claim.ruleId) && hitRuleIds.has(claim.ruleId);
    }).sort(byId);
}

function linkEvidence(claims) {
    const ids = new Set(claims.map((claim) => claim.claimId));
    const supportingEvidence = [];
    const contradictoryEvidence = [];
    for (const claim of claims) {
        for (const target of claim.supports || []) {
            if (ids.has(target)) supportingEvidence.push({ fromClaimId: claim.claimId, toClaimId: target });
        }
        for (const target of claim.contradicts || []) {
            if (ids.has(target)) contradictoryEvidence.push({ fromClaimId: claim.claimId, toClaimId: target });
        }
    }
    return { supportingEvidence, contradictoryEvidence };
}

function starsOf(palace) {
    return (palace?.stars || []).map((star) => ({
        starId: star.starId,
        displayName: star.displayName,
        list: star.list,
        brightness: star.brightness,
        brightnessStatus: star.brightnessStatus,
        tuHoa: star.association?.type === 'tu_hoa' ? star.association : null
    })).sort(byId);
}

function rollupFormation(hits) {
    if (!hits.length) return 'unknown';
    const values = new Set(hits.map((hit) => hit.evidence?.formationConditions));
    if (values.size === 1 && (values.has('source_satisfied') || values.has('source_not_satisfied'))) {
        return [...values][0];
    }
    return 'unknown';
}

function statementFor(chart, palace, spec, hits, claims) {
    const palaceHits = palace ? hits.filter((hit) => hit.palaceId === palace.id) : [];
    const applied = applicableClaims(claims, chart, spec.functionId, palaceHits);
    const eligibility = applied.map((claim) => claimEligibility(claim, chart));
    const links = linkEvidence(applied);
    const eligible = eligibility.filter((item) => item.eligible);
    let availabilityStatus = 'insufficient_evidence';
    if (!palace) availabilityStatus = 'missing_palace';
    else if (links.contradictoryEvidence.length > 0) availabilityStatus = 'contradiction';
    else if (eligible.length > 0) availabilityStatus = 'eligible_claims_present';
    const limitations = ['no_absolute_life_event'];
    if (availabilityStatus !== 'eligible_claims_present') limitations.push('no_eligible_interpretation_claim');
    if (rollupFormation(palaceHits) === 'unknown') limitations.push('formation_unknown');
    if (!palaceHits.length || palaceHits.some((hit) => hit.evidence?.breakingConditions === 'not_implemented' || hit.evidence?.breakingConditions === 'unknown')) {
        limitations.push('breaking_not_evaluated');
    }
    if (spec.thanOverlay) limitations.push('than_is_overlay_not_a_thirteenth_palace');
    const relations = palace ? branchIndexRelations(palace.branchId) : null;
    return {
        statementId: spec.statementId,
        palaceId: palace?.id || null,
        functionId: spec.functionId,
        topic: spec.topic,
        thanOverlay: Boolean(spec.thanOverlay),
        schoolId: chart.schoolId || null,
        stars: starsOf(palace),
        coLocatedStarIds: starsOf(palace).map((star) => star.starId).filter(Boolean),
        markers: palace ? { tuan: Boolean(palace.isTuan), triet: Boolean(palace.isTriet) } : null,
        relations: relations ? {
            tamHop: relations.tamHop,
            xungChieu: relations.xungChieu,
            giap: relations.giap,
            tamPhuongTuChinh: relations.tamPhuongTuChinh
        } : null,
        claimIds: applied.map((claim) => claim.claimId),
        claimApplicability: eligibility,
        ruleEvidence: palaceHits.map((hit) => hit.evidence),
        sourceReferences: applied.map((claim) => ({
            claimId: claim.claimId,
            sourceId: claim.sourceId || null,
            editionId: claim.editionId || null,
            section: claim.section || null,
            pageNumber: claim.pageNumber || null
        })),
        verificationStatuses: {
            formulaStatus: null,
            bibliographicStatus: null,
            interpretationStatus: null,
            availability: 'not_recorded'
        },
        runtimeMatchStatus: palaceHits.length > 0 ? 'matched' : 'not_matched',
        formationConditions: rollupFormation(palaceHits),
        breakingConditions: palaceHits.length > 0 && palaceHits.every((hit) => hit.evidence?.breakingConditions === 'checked_clear' || hit.evidence?.breakingConditions === 'checked_broken')
            ? (palaceHits.some((hit) => hit.evidence?.breakingConditions === 'checked_broken') ? 'checked_broken' : 'checked_clear')
            : 'not_implemented',
        supportingEvidence: links.supportingEvidence,
        contradictoryEvidence: links.contradictoryEvidence,
        unresolvedConditions: palaceHits.length > 0 ? ['source_formation_not_inferred_from_runtime_match'] : ['no_runtime_rule_hit'],
        availabilityStatus,
        limitations,
        prose: null,
        usage: 'structured_analysis'
    };
}

export function interpretChart(chart, options = {}) {
    if (!chart || chart.ok === false || !Array.isArray(chart.palaces) || chart.palaces.length !== 12) {
        return { ok: false, error: 'malformed_chart', statements: [], usage: 'structured_analysis' };
    }
    const rules = options.rules || rulesV2;
    const claims = catalogClaims(options.claims);
    const hits = [];
    for (const rule of rules) {
        const hit = evaluateRule(chart, rule);
        if (!hit?.evidence) continue;
        hits.push({
            ruleId: rule.id,
            palaceId: String(hit.evidence.palaceId),
            evidence: buildEvidenceV3(hit.evidence, options.evidenceContext || {})
        });
    }
    hits.sort((left, right) => left.ruleId.localeCompare(right.ruleId));
    const statements = PALACE_FUNCTIONS.map((functionId) => statementFor(chart, chart.palaces.find((palace) => palace.functionId === functionId), {
        statementId: `palace:${functionId}`,
        functionId,
        topic: functionId
    }, hits, claims));
    const thanPalace = chart.palaces.find((palace) => palace.isThan) || null;
    statements.push(statementFor(chart, thanPalace, {
        statementId: `than:${thanPalace?.id || 'missing'}`,
        functionId: thanPalace?.functionId || null,
        topic: 'than',
        thanOverlay: true
    }, hits, claims));
    return {
        ok: true,
        usage: 'structured_analysis',
        schoolId: chart.schoolId || null,
        statements
    };
}
