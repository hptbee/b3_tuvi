import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { FORMULAS } from '../data/formulaV1.mjs';
import { bindStoredDecision, digestOf } from './combinationBatch.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { SOURCE_PALACE_KIND, verifySourcePalaceBinding } from './sourcePalaceBinding.js';

// Only the existing registered subject is supported. These are evidence paths,
// not additional approvals; all identity, scope and wording come from the files.
const FILES = {
    claims: 'docs/knowledge/interpretation-claims.json',
    decision: 'docs/knowledge/interpretation-decisions/tu-phu-dong-cung.json',
    span: 'docs/knowledge/passages/tu-phu-dong-cung/span.txt',
    formula: 'docs/knowledge/decisions/tu-phu-dong-cung.json',
    passages: 'docs/knowledge/combination-passages.json',
    sources: 'docs/knowledge/sources.json',
    reviewA: 'docs/knowledge/reviews/tu-phu-dong-cung-interpretation/review-a.json',
    reviewB: 'docs/knowledge/reviews/tu-phu-dong-cung-interpretation/review-b.json'
};
const EVIDENCE_FILES = new Set(Object.values(FILES));
const CAVEAT = ' Đây là lời sách truyền thống, không phải sự kiện đời đã kiểm chứng.';
const VERDICT = 'INTERPRETATION_SUPPORTED_WITH_LIMITS';
// Finite scope of the existing shared Giáp quotation and recorded decision.
// The differing free-text review limitations cannot approve new predicates.
const REVIEWED_SCOPE = {
    yearStem: 'Giáp',
    relatedPalaces: ['menh'],
    sourceProfile: 'tan-bien',
    formulaCatalogId: 'tu_phu_dong_cung',
    limitations: [
        'giap_age_only',
        'not_a_verified_life_event',
        'verse_vo_sat_not_in_approved_sentence',
        'grade_not_certified',
        'breaking_not_implemented'
    ]
};
const text = (value) => typeof value === 'string' && value.trim() !== '' && value.trim() === value;
const texts = (value) => Array.isArray(value) && value.length > 0 && value.every(text);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const denied = (reason) => ({ ok: false, reason, approvedWording: null });

function read(ref) {
    if (!EVIDENCE_FILES.has(ref)) throw new Error('Unregistered interpretation evidence');
    return readFileSync(new URL(`../../../${ref}`, import.meta.url), 'utf8');
}

function loadEvidence() {
    const json = (ref) => JSON.parse(read(ref));
    const decision = json(FILES.decision);
    return {
        claims: json(FILES.claims).claims,
        decision,
        reviews: decision.reviewers.map(({ reviewRef }) => ({ reviewRef, document: json(reviewRef) })),
        span: read(decision.spanFile),
        formula: json(FILES.formula),
        passages: json(FILES.passages).entries,
        sources: json(FILES.sources)
    };
}

/** Checks stored evidence. Its result cannot be injected into runtime approval. */
export function verifyStoredInterpretationEvidence(evidence = {}) {
    const { claims, decision, reviews, span, formula, passages, sources } = evidence || {};
    if (!object(decision)) return denied('interpretation_decision_mismatch');
    const registered = Array.isArray(claims) ? claims.filter((item) => object(item) && item.claimId === decision.subjectId) : [];
    if (registered.length !== 1) return denied('interpretation_registry_invalid');
    const claim = registered[0];
    if (!text(claim.claimId) || claim.interpretationDecisionRef !== FILES.decision
        || claim.approvedForInterpretation !== true || claim.interpretationStatus !== 'sourced'
        || claim.sourceReviewStatus !== 'AI_CROSS_REVIEWED' || claim.formulaComparisonStatus !== 'MATCH'
        || claim.releasePermission !== 'withheld' || claim.expertVerified !== false
        || Object.entries(REVIEWED_SCOPE).some(([key, value]) => !isDeepStrictEqual(claim[key], value))
        || ['conditions', 'rule', 'relatedStars', 'breakingDependency'].some((key) => Object.hasOwn(claim, key))) {
        return denied('interpretation_registry_invalid');
    }
    if (decision.policyVersion !== 'dual-ai-interpretation-review-v1'
        || decision.subjectType !== 'interpretation_claim' || decision.subjectId !== claim.claimId
        || decision.sourceId !== claim.sourceId || decision.editionId !== claim.editionId
        || decision.schoolId !== claim.schoolId || decision.locator !== claim.section
        || decision.spanFile !== FILES.span || !text(decision.decisionId) || !text(decision.disagreement)
        || decision.decision !== 'AI_CROSS_REVIEWED' || decision.expertVerified !== false
        || decision.publicRelease !== false || decision.gradeStatus !== 'not_certified'
        || decision.breakingStatus !== 'not_implemented') return denied('interpretation_decision_mismatch');

    const source = Array.isArray(sources?.sources) ? sources.sources.find((item) => item?.sourceId === claim.sourceId) : null;
    const edition = Array.isArray(sources?.editions) ? sources.editions.find((item) => item?.editionId === claim.editionId) : null;
    if (!source || !edition || source.schoolId !== claim.schoolId || edition.sourceId !== source.sourceId) {
        return denied('interpretation_source_mismatch');
    }
    const reviewers = decision.reviewers;
    if (!Array.isArray(reviewers) || reviewers.length !== 2 || !Array.isArray(reviews) || reviews.length !== 2
        || ['model', 'agentId', 'reviewRef'].some((key) => {
            const values = reviewers.map((item) => item?.[key]);
            return !values.every(text) || new Set(values).size !== 2;
        })) return denied('interpretation_reviews_invalid');
    const actual = [];
    for (const reviewer of reviewers) {
        const matches = reviews.filter((item) => item?.reviewRef === reviewer.reviewRef);
        const review = matches[0]?.document;
        if (![FILES.reviewA, FILES.reviewB].includes(reviewer.reviewRef) || matches.length !== 1
            || !object(review) || review.scope !== 'interpretation' || review.subjectId !== decision.subjectId
            || review.model !== reviewer.model || review.agentId !== reviewer.agentId
            || reviewer.verdict !== VERDICT || review.verdict !== VERDICT || review.expertVerified !== false
            || !texts(review.supportedQuotes) || !texts(review.limitations) || !texts(review.absoluteClaims)) {
            return denied('interpretation_reviews_invalid');
        }
        actual.push(review);
    }
    const wording = claim.approvedWording;
    const quote = typeof wording === 'string' && wording.endsWith(CAVEAT) ? wording.slice(0, -CAVEAT.length) : '';
    if (quote.length < 40 || !/[.!?。！？]$/.test(quote) || typeof span !== 'string' || !span.includes(quote)
        || actual.some((review) => !review.supportedQuotes.includes(quote)
            || review.absoluteClaims.some((fragment) => !quote.includes(fragment)))) {
        return denied('interpretation_quotation_mismatch');
    }

    const passageMatches = Array.isArray(passages) ? passages.filter((item) => item?.claimId === formula?.subjectId) : [];
    const passage = passageMatches[0];
    const catalog = FORMULAS.find((item) => item.id === claim.formulaCatalogId);
    if (!object(formula) || !validateDecisionRecord(formula).ok || formula.decision !== 'AI_ACCEPTED'
        || formula.formulaComparison !== 'MATCH' || formula.decisionId !== decision.formulaDecisionId
        || !text(decision.formulaDecisionId) || passageMatches.length !== 1 || passage.located !== true
        || passage.spanFile !== decision.spanFile || catalog?.combination !== passage.combinationName
        || !catalog?.variants.some((variant) => variant.profile === claim.sourceProfile)
        || ['sourceId', 'editionId', 'schoolId', 'locator'].some((key) => formula[key] !== decision[key] || passage[key] !== decision[key])) {
        return denied('interpretation_formula_mismatch');
    }
    // Existing formula decisions hash the passage without its final LF.
    const formulaSpan = span.replace(/\n$/, '');
    const sourceDigest = digestOf(formulaSpan);
    if (sourceDigest !== formula.sourceDigest
        || !bindStoredDecision(formula, { ...passage, span: formulaSpan, sourceDigest }).ok) {
        return denied('interpretation_formula_unbound');
    }
    return { ok: true, reason: null, approvedWording: wording };
}

let stored = null;

/** No caller-supplied evidence, flags or fixture overrides can grant approval. */
export function verifyInterpretationBinding(claim) {
    if (claim?.interpretationKind === SOURCE_PALACE_KIND) return verifySourcePalaceBinding(claim);
    if (!claim?.interpretationDecisionRef) return denied('interpretation_binding_missing');
    if (!stored) {
        try {
            const evidence = loadEvidence();
            const result = verifyStoredInterpretationEvidence(evidence);
            stored = { claim: result.ok ? evidence.claims.find((item) => item?.claimId === evidence.decision.subjectId) : null, result };
        } catch {
            stored = { claim: null, result: denied('interpretation_evidence_unavailable') };
        }
    }
    if (!stored.result.ok) return { ...stored.result };
    // Exact stored scope also rejects newly added rules, weakened limits and
    // same-ID clones. Approval is never cached by caller-controlled claim ID.
    if (!isDeepStrictEqual(claim, stored.claim)) return denied('interpretation_binding_mismatch');
    return { ...stored.result };
}
