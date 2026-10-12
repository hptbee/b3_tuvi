import { canTransition, validateProvenance } from './provenance.js';
import { getStarById } from '../engine/starCatalog.js';
import { DEFAULT_SCHOOL } from '../engine/schoolProfile.js';

export const CLAIM_TYPES = new Set([
    'placement',
    'combination_match',
    'formation',
    'breaking',
    'strengthening',
    'weakening',
    'interpretation',
    'school_variant',
    'conflict'
]);

export const SUPPORT_TYPES = new Set(['states', 'paraphrase', 'conflicts', 'comments']);

export const PALACE_FUNCTION_IDS = new Set([
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
]);

export const FORMULA_COMPARISON = new Set(['CONFLICT', 'PARTIAL', 'NOT_IMPLEMENTED', 'MATCH']);

const LAYERS = [
    'implementationStatus',
    'formulaStatus',
    'bibliographicStatus',
    'interpretationStatus'
];

function issue(code, message, subject) {
    return { code, message, subject: subject || null };
}

function uniqueRecords(items, key, label, errors) {
    const seen = new Set();
    for (const item of items) {
        if (!item || typeof item !== 'object') {
            errors.push(issue('malformed_json', `${label} must be an object`));
            continue;
        }
        const id = item[key];
        if (!id || seen.has(id)) errors.push(issue('duplicate_id', `${label} id duplicated or empty`, id || label));
        if (id) seen.add(id);
    }
}

function blankStrings(list) {
    return list.some((item) => typeof item !== 'string' || item.trim() === '');
}

export function parseKnowledgeJson(text) {
    try {
        const value = JSON.parse(text);
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return { ok: false, value: null, errors: [issue('malformed_json', 'root must be an object')] };
        }
        return { ok: true, value, errors: [] };
    } catch {
        return { ok: false, value: null, errors: [issue('malformed_json', 'invalid JSON')] };
    }
}

function provenanceOf(claim) {
    const present = LAYERS.filter((layer) => claim[layer] !== undefined);
    if (present.length === 0) return null;
    return Object.fromEntries(LAYERS.map((layer) => [layer, claim[layer]]));
}

function claimSourceId(claim, bundleSourceId) {
    return claim.sourceId || bundleSourceId || null;
}

function citedSourceIds(claim, bundleSourceId) {
    const ids = new Set();
    const direct = claimSourceId(claim, bundleSourceId);
    if (direct) ids.add(direct);
    for (const reference of claim.sourceReferences || []) {
        if (reference && typeof reference === 'object' && reference.sourceId) ids.add(reference.sourceId);
    }
    return ids;
}

function citedEdition(claim, bundleSourceId, editionById) {
    if (!claim?.editionId) return null;
    const edition = editionById.get(claim.editionId);
    if (!edition || !citedSourceIds(claim, bundleSourceId).has(edition.sourceId)) return null;
    return edition;
}

export function validateKnowledgeBundle(bundle) {
    const errors = [];
    const gaps = [];
    const sources = bundle.sources?.sources || bundle.sources || [];
    const editions = bundle.sources?.editions || bundle.editions || [];
    const pilot = bundle.pilot || { claims: [] };
    const claims = pilot.claims || bundle.claims || [];
    const matrixRows = Array.isArray(bundle.matrix?.rows) ? bundle.matrix.rows : (bundle.matrix ? null : []);
    const names = new Set(bundle.combinationNames || []);
    const contract = bundle.contract;
    const schools = new Set([DEFAULT_SCHOOL.id]);

    if (!Array.isArray(sources) || !Array.isArray(editions) || !Array.isArray(claims) || !Array.isArray(matrixRows)) {
        errors.push(issue('malformed_json', 'sources, editions, and claims must be arrays'));
        return finish(errors, gaps, [], bundle, false);
    }

    const sourceIds = new Set(sources.filter((source) => source && typeof source === 'object').map((source) => source.sourceId));
    const editionById = new Map(editions.filter((edition) => edition && typeof edition === 'object').map((edition) => [edition.editionId, edition]));

    uniqueRecords(sources, 'sourceId', 'source', errors);
    uniqueRecords(editions, 'editionId', 'edition', errors);
    uniqueRecords(claims, 'claimId', 'claim', errors);

    for (const source of sources) {
        if (!source || typeof source !== 'object') continue;
        const allowed = contract?.layers?.bibliographicStatus;
        if (allowed && !allowed.includes(source.bibliographicStatus)) {
            errors.push(issue('invalid_provenance', 'bibliographicStatus is not allowed', source.sourceId));
        }
        if (source.schoolId && !schools.has(source.schoolId)) {
            errors.push(issue('unknown_school', 'schoolId is not registered', source.sourceId));
        }
    }

    for (const edition of editions) {
        if (!edition || typeof edition !== 'object') continue;
        if (!sourceIds.has(edition.sourceId)) {
            errors.push(issue('broken_reference', 'edition sourceId is missing', edition.editionId));
        }
        if (edition.authenticated === true && (typeof edition.authenticationBasis !== 'string' || edition.authenticationBasis.length === 0)) {
            errors.push(issue('unsupported_promotion', 'authenticated edition needs authenticationBasis', edition.editionId));
        }
    }

    const authenticatedSource = new Set(
        editions.filter((edition) => edition && edition.authenticated === true).map((edition) => edition.sourceId)
    );
    for (const source of sources) {
        if (!source || typeof source !== 'object') continue;
        if (source.bibliographicStatus === 'primary' && !authenticatedSource.has(source.sourceId)) {
            errors.push(issue('unsupported_promotion', 'primary requires an authenticated edition', source.sourceId));
        }
    }

    for (const row of matrixRows) {
        if (!row || typeof row !== 'object') {
            errors.push(issue('malformed_json', 'matrix row must be an object'));
            continue;
        }
        if (names.size > 0 && !names.has(row.name)) {
            errors.push(issue('unknown_combination', 'matrix combination is not in the catalog', row.name));
        }
        for (const sourceId of row.sources || []) {
            if (!sourceIds.has(sourceId)) {
                errors.push(issue('broken_reference', 'matrix source is missing', row.name));
            }
        }
        if (row.formulaCheckedAgainstSource === true) {
            errors.push(issue('unsupported_promotion', 'formulaCheckedAgainstSource is not granted by a valid file', row.name));
        }
        if ((row.sources || []).length === 0) {
            gaps.push({ code: 'missing_citation', subject: row.name, sourceVerificationStatus: row.sourceVerificationStatus || 'none' });
        }
    }

    const claimIds = new Set(claims.filter((claim) => claim && typeof claim === 'object').map((claim) => claim.claimId));
    for (const claim of claims) {
        if (!claim || typeof claim !== 'object') {
            errors.push(issue('malformed_json', 'claim must be an object'));
            continue;
        }
        if (!CLAIM_TYPES.has(claim.claimType)) {
            errors.push(issue('invalid_claim_type', 'claimType is not allowed', claim.claimId));
        }
        if (claim.combinationName && names.size > 0 && !names.has(claim.combinationName)) {
            errors.push(issue('unknown_combination', 'combinationName is not in the catalog', claim.claimId));
        }
        if (claim.schoolId && !schools.has(claim.schoolId)) {
            errors.push(issue('unknown_school', 'schoolId is not registered', claim.claimId));
        }
        if (claim.formulaComparisonStatus && !FORMULA_COMPARISON.has(claim.formulaComparisonStatus)) {
            errors.push(issue('invalid_provenance', 'formulaComparisonStatus is not allowed', claim.claimId));
        }
        for (const starId of claim.relatedStars || []) {
            if (!getStarById(starId)) errors.push(issue('unknown_star', 'related star is not in the catalog', claim.claimId));
        }
        for (const palaceId of claim.relatedPalaces || []) {
            if (!PALACE_FUNCTION_IDS.has(palaceId)) {
                errors.push(issue('unknown_palace', 'related palace is not a function id', claim.claimId));
            }
        }
        if (Array.isArray(claim.conditions) && claim.conditions.some((item) => typeof item !== 'string' || item.trim() === '')) {
            errors.push(issue('invalid_empty_condition', 'condition text is empty', claim.claimId));
        }
        if (Array.isArray(claim.rule?.clauses) && (
            claim.rule.clauses.length === 0
            || claim.rule.clauses.some((clause) => {
                if (!clause || typeof clause !== 'object') return true;
                if (!Array.isArray(clause.stars)) return false;
                return clause.stars.length === 0 || blankStrings(clause.stars);
            })
        )) {
            errors.push(issue('invalid_empty_condition', 'rule clauses are empty', claim.claimId));
        }
        if (Array.isArray(claim.rule?.samePalace) && (claim.rule.samePalace.length === 0 || blankStrings(claim.rule.samePalace))) {
            errors.push(issue('invalid_empty_condition', 'samePalace stars are empty', claim.claimId));
        }
        const sourceId = claimSourceId(claim, pilot.sourceId);
        const references = claim.sourceReferences || (sourceId ? [{ sourceId, supportType: claim.supportType }] : []);
        if (references.length === 0) {
            errors.push(issue('missing_citation', 'claim has no source', claim.claimId));
        }
        for (const reference of references) {
            if (!reference || typeof reference !== 'object') {
                errors.push(issue('malformed_json', 'citation must be an object', claim.claimId));
                continue;
            }
            if (!sourceIds.has(reference.sourceId)) {
                errors.push(issue('broken_reference', 'citation source is missing', claim.claimId));
            }
            if (reference.supportType && !SUPPORT_TYPES.has(reference.supportType)) {
                errors.push(issue('unsupported_citation', 'supportType is not allowed', claim.claimId));
            }
        }
        if (claim.editionId) {
            const edition = editionById.get(claim.editionId);
            if (!edition) errors.push(issue('broken_reference', 'editionId is missing', claim.claimId));
            else if (!citedSourceIds(claim, pilot.sourceId).has(edition.sourceId)) {
                errors.push(issue('mismatched_edition', 'edition belongs to another source', claim.claimId));
            }
        }
        for (const link of [...(claim.contradicts || []), ...(claim.supports || [])]) {
            if (!claimIds.has(link)) errors.push(issue('broken_reference', 'claim link target is missing', claim.claimId));
        }
        const status = provenanceOf(claim);
        if (status && contract) {
            if (LAYERS.some((layer) => status[layer] === undefined)) {
                errors.push(issue('invalid_provenance', 'provenance layers are incomplete', claim.claimId));
            } else {
                const edition = citedEdition(claim, pilot.sourceId, editionById);
                const context = {
                    editionAuthenticated: edition?.authenticated === true,
                    sourceId: sourceId || undefined,
                    inferredFromTestPass: claim.inferredFromTestPass === true
                };
                const checked = validateProvenance(status, context, contract);
                for (const message of checked.errors) {
                    errors.push(issue('invalid_provenance', message, claim.claimId));
                }
                if (claim.previousStatus) {
                    const moved = canTransition(claim.previousStatus, status, context, contract);
                    for (const message of moved.errors) {
                        errors.push(issue('invalid_transition', message, claim.claimId));
                    }
                }
            }
        }
    }

    const gatesHold = provenanceGatesHold(claims, pilot, editionById, contract);
    return finish(errors, gaps, claims, bundle, gatesHold);
}

function provenanceGatesHold(claims, pilot, editionById, contract) {
    if (!contract || claims.length === 0) return false;
    return claims.every((claim) => {
        if (!claim || typeof claim !== 'object') return false;
        const status = provenanceOf(claim);
        if (!status || LAYERS.some((layer) => status[layer] === undefined)) return false;
        const sourceId = claimSourceId(claim, pilot.sourceId);
        const edition = citedEdition(claim, pilot.sourceId, editionById);
        return validateProvenance(status, {
            editionAuthenticated: edition?.authenticated === true,
            sourceId: sourceId || undefined,
            inferredFromTestPass: claim.inferredFromTestPass === true
        }, contract).ok;
    });
}

function citedSourcesArePrimary(sources, claims, pilot) {
    if (!Array.isArray(claims) || !Array.isArray(sources)) return false;
    const used = new Set();
    for (const claim of claims) {
        if (!claim || typeof claim !== 'object') return false;
        const sourceId = claimSourceId(claim, pilot.sourceId);
        if (sourceId) used.add(sourceId);
        for (const reference of claim.sourceReferences || []) used.add(reference.sourceId);
    }
    if (used.size === 0) return false;
    return [...used].every((id) => sources.find((source) => source && source.sourceId === id)?.bibliographicStatus === 'primary');
}

function finish(errors, gaps, claims, bundle, gatesHold) {
    const sources = bundle.sources?.sources || bundle.sources || [];
    const pilot = bundle.pilot || {};
    const human = bundle.humanReview || {};
    const list = Array.isArray(claims) ? claims : [];
    const schemaValid = errors.length === 0;
    const sourceLinked = schemaValid && list.length > 0 && list.every((claim) => {
        const sourceId = claimSourceId(claim, pilot.sourceId);
        return Boolean(sourceId) || (claim.sourceReferences || []).length > 0;
    });
    const formulaChecked = list.length > 0 && list.every((claim) => claim && claim.formulaStatus === 'checked_against_edition');
    const interpretationSourced = list.length > 0 && list.every((claim) => claim && claim.interpretationStatus === 'sourced');
    const bibliographicPrimary = list.length > 0 && list.every((claim) => claim && claim.bibliographicStatus === 'primary');
    return {
        ok: schemaValid,
        errors,
        gaps,
        levels: {
            schemaValid,
            sourceLinked,
            bibliographicallyVerified: schemaValid && gatesHold === true && human.bibliographic === true && bibliographicPrimary && citedSourcesArePrimary(sources, list, pilot),
            formulaVerified: schemaValid && gatesHold === true && human.formula === true && formulaChecked,
            approvedForInterpretation: schemaValid && gatesHold === true && sourceLinked && human.interpretation === true && interpretationSourced
        }
    };
}
