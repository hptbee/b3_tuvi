import contract from '../../../docs/knowledge/provenance-contract.json' with { type: 'json' };

const RELATIONSHIP_OPS = new Set(['giap_both_flanks', 'giap_anchor_flanks', 'clauses', 'linked', 'count']);
const LIMITED_EDITION_SCOPES = new Set([
    'digital_file_accepted_as_working_text',
    'library_record_accepted_by_owner',
    'archive_item_accepted_by_owner'
]);

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

function editionCanCarryTextProof(context) {
    return context.editionAuthenticated === true
        && context.textCollatedAgainstOriginal === true
        && !LIMITED_EDITION_SCOPES.has(context.authenticationScope);
}

function acceptLayer(layer, value, context, rejected) {
    if (value === undefined) return null;
    const allowed = contract.layers[layer] || [];
    const gate = contract.gates[layer]?.[value];
    const blockedByTest = context.inferredFromTestPass === true && (value === 'primary' || value === 'checked_against_edition');
    const gateClosed = (gate === 'editionAuthenticated' && !editionCanCarryTextProof(context))
        || (gate === 'sourceId' && !(typeof context.sourceId === 'string' && context.sourceId.length > 0))
        || (value === 'checked_against_edition' && context.formulaCheckedAgainstEdition !== true);
    if (!allowed.includes(value) || blockedByTest || gateClosed) {
        rejected.push({ layer, value });
        return null;
    }
    return value;
}

function verificationOf(context) {
    const rejected = [];
    const formulaStatus = acceptLayer('formulaStatus', context.formulaStatus, context, rejected);
    const bibliographicStatus = acceptLayer('bibliographicStatus', context.bibliographicStatus, context, rejected);
    const interpretationStatus = acceptLayer('interpretationStatus', context.interpretationStatus, context, rejected);
    const recorded = [formulaStatus, bibliographicStatus, interpretationStatus].filter((value) => value !== null);
    return {
        formulaStatus,
        bibliographicStatus,
        interpretationStatus,
        availability: recorded.length === 0 ? 'not_recorded' : 'recorded',
        rejected
    };
}

function formationOf(context) {
    const sourced = context.formationConditions === 'source_satisfied' || context.formationConditions === 'source_not_satisfied';
    if (sourced && context.formulaCheckedAgainstEdition === true && editionCanCarryTextProof(context)) {
        return context.formationConditions;
    }
    return 'unknown';
}

function breakingOf(context) {
    const evaluated = context.breakingConditions === 'checked_clear' || context.breakingConditions === 'checked_broken';
    if (context.breakingEvaluated === true && evaluated) return context.breakingConditions;
    if (context.breakingEvaluated === true) return 'unknown';
    return 'not_implemented';
}

/**
 * DTO cho một hit của rule engine.
 * Pattern match không chứng minh thành cách theo nguồn và không chứng minh phá cách.
 * @param {object | null | undefined} evidence
 * @param {object} [context]
 */
export function buildEvidenceV3(evidence, context = {}) {
    if (!evidence || typeof evidence !== 'object' || !evidence.ruleId) return null;
    const stars = Array.isArray(evidence.stars) ? evidence.stars : [];
    const matchedStarInstances = instancesOf(stars);
    const references = Array.isArray(context.sourceClaimReferences) ? context.sourceClaimReferences.map((item) => ({ ...item })) : [];
    return {
        version: 3,
        runtimeMatchStatus: 'matched',
        patternDetected: true,
        formationConditions: formationOf(context),
        breakingConditions: breakingOf(context),
        formulaReview: context.formulaCheckedAgainstEdition === true && editionCanCarryTextProof(context) ? 'checked_against_edition' : 'not_checked',
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
        satisfiedConditions: evidence.op ? [{ op: evidence.op, status: 'runtime_matched' }] : [],
        unresolvedConditions: [],
        sourceClaimReferences: references,
        verification: verificationOf(context)
    };
}
