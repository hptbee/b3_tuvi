import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { sha256Text } from './sourceBinding.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';

export const SOURCE_PALACE_KIND = 'source_palace_interpretation';
const PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
const HTML_DIGEST = '438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a';
const PROFILE = 'quanshu-iztro-2f00e2ab';
const SOURCE_URL = `https://github.com/SylarLong/iztro/blob/${PIN}/docs/zh_TW/learn/ancientBook-2.html`;
const SOURCE = 'ziwei-quanshu-iztro-transcription';
const EDITION = 'iztro-juan2-2f00e2ab0c80';
const COMPATIBILITY = 'condition_read_only_projection_not_natal_formula_certification';
const VERDICT = 'INTERPRETATION_SUPPORTED_WITH_LIMITS';
const RESEARCH = 'docs/knowledge/research/juan2-palace/';
const ORIGINAL_RESOURCES = {
    reviewA: 'docs/knowledge/reviews/juan2-palace/review-a.json',
    reviewB: 'docs/knowledge/reviews/juan2-palace/review-b.json',
    bundleFile: `${RESEARCH}review-bundle.json`, executionFile: `${RESEARCH}execution.json`
};
const QUAN_RESOURCES = {
    reviewA: 'docs/knowledge/reviews/juan2-palace/review-quan-a.json',
    reviewB: 'docs/knowledge/reviews/juan2-palace/review-quan-b.json',
    bundleFile: `${RESEARCH}review-bundle-quan.json`, executionFile: `${RESEARCH}execution-quan.json`
};
const CLAIMS = 'docs/knowledge/interpretation-claims.json';
const SOURCES = 'docs/knowledge/sources.json';
const SUBJECTS = {
    'interp-quanshu-tai-bach-tu-vi-four-adverse-host': {
        ...ORIGINAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-tai-tuvi.json',
        target: 'tai_bach', spanFile: 'tai-tuvi-span.txt', contextFile: 'I02-full-section.txt'
    },
    'interp-quanshu-phuc-duc-dong-luong-host': {
        ...ORIGINAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-phuc-dong-luong.json',
        target: 'phuc_duc', spanFile: 'phuc-dong-span.txt', contextFile: 'I04-full-section.txt'
    },
    'interp-quanshu-quan-loc-co-cu-dau-host': {
        ...QUAN_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-quan-co-cu-dau.json',
        target: 'quan_loc', spanFile: 'quan-co-cu-dau-source-span.txt', contextFile: 'quan-co-cu-dau-review-context.txt',
        projectionA: ['sourceProjectionVerdict', 'SOURCE_BRANCH_PROJECTION_SUPPORTED_WITH_LIMITS'],
        projectionB: ['projectionVerdict', 'MATCH']
    }
};
const FILES = new Set([
    CLAIMS, SOURCES,
    ...Object.values(SUBJECTS).flatMap((subject) => [subject.decisionRef, subject.reviewA, subject.reviewB,
        subject.bundleFile, subject.executionFile, RESEARCH + subject.spanFile, RESEARCH + subject.contextFile])
]);
const text = (value) => typeof value === 'string' && value.trim() !== '' && value === value.trim();
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const denied = (reason) => ({ ok: false, reason, approvedWording: null });
const one = (rows, predicate) => {
    const matches = Array.isArray(rows) ? rows.filter(predicate) : [];
    return matches.length === 1 ? matches[0] : null;
};

function read(ref) {
    if (!FILES.has(ref)) throw new Error('Unregistered source-palace evidence');
    return readFileSync(new URL(`../../../${ref}`, import.meta.url), 'utf8');
}

function loadEvidence(subject) {
    const json = (ref) => JSON.parse(read(ref));
    return {
        claims: json(CLAIMS).claims, sources: json(SOURCES),
        decision: json(subject.decisionRef), bundle: json(subject.bundleFile),
        reviewA: json(subject.reviewA), reviewB: json(subject.reviewB), execution: json(subject.executionFile),
        span: read(RESEARCH + subject.spanFile), context: read(RESEARCH + subject.contextFile)
    };
}

/** Pure stored-evidence replay. Runtime never accepts an injected result. */
export function verifyStoredSourcePalaceEvidence(claimId, evidence = {}) {
    const subject = Object.hasOwn(SUBJECTS, claimId) ? SUBJECTS[claimId] : null;
    if (!subject) return denied('source_palace_subject_unknown');
    const { claims, sources, decision, bundle, reviewA, reviewB, execution, span, context } = evidence || {};
    const claim = one(claims, (item) => item?.claimId === claimId);
    const candidate = one(bundle?.candidates, (item) => item?.claimId === claimId);
    if (!object(claim) || !object(candidate) || bundle.pin !== PIN || bundle.rawHtmlSha256 !== HTML_DIGEST) {
        return denied('source_palace_registry_invalid');
    }
    if (claim.claimType !== 'interpretation' || claim.interpretationKind !== SOURCE_PALACE_KIND
        || claim.interpretationDecisionRef !== subject.decisionRef || claim.sourceId !== SOURCE
        || claim.editionId !== EDITION || claim.schoolId !== 'vn-tam-hop-default' || claim.sourceProfile !== PROFILE
        || claim.sourceReviewStatus !== 'AI_CROSS_REVIEWED' || claim.formulaComparisonStatus !== 'MATCH'
        || claim.approvedForInterpretation !== true || claim.interpretationStatus !== 'sourced'
        || claim.expertVerified !== false || claim.bookVerified !== false || claim.releasePermission !== 'withheld'
        || claim.compatibilityNote !== COMPATIBILITY || !isDeepStrictEqual(claim.relatedPalaces, [subject.target])
        || ['formulaCatalogId', 'ruleId', 'rule', 'conditions', 'relatedStars', 'yearStem', 'breakingDependency', 'publicRelease']
            .some((key) => Object.hasOwn(claim, key))) return denied('source_palace_registry_invalid');
    if (candidate.target !== subject.target || candidate.spanFile !== subject.spanFile || candidate.contextFile !== subject.contextFile
        || candidate.sourceId !== claim.sourceId || candidate.editionId !== claim.editionId
        || candidate.schoolId !== claim.schoolId || candidate.sourceProfile !== claim.sourceProfile
        || candidate.locator !== claim.section || candidate.usage !== 'internal_research'
        || candidate.expertVerified !== false || candidate.bookVerified !== false || candidate.releasePermission !== 'withheld'
        || !isDeepStrictEqual(claim.conditionTree, candidate.conditionTree)
        || !isDeepStrictEqual(claim.conditionIds, candidate.conditions) || !isDeepStrictEqual(claim.limitations, candidate.limitations)
        || !Array.isArray(claim.limitations) || !claim.limitations.length || !claim.limitations.every(text)
        || !object(candidate.conditionTree) || !Array.isArray(candidate.conditions) || !candidate.conditions.length
        || !candidate.conditions.every(text) || !text(candidate.proposedWording)
        || claim.approvedWording !== candidate.proposedWording) return denied('source_palace_scope_mismatch');

    const source = one(sources?.sources, (item) => item?.sourceId === SOURCE);
    const edition = one(sources?.editions, (item) => item?.editionId === EDITION);
    if (!source || !edition || source.bibliographicStatus !== 'secondary' || source.schoolId !== null
        || source.sourceType !== 'secondary_transcription' || source.url !== SOURCE_URL
        || source.expertVerified !== false || source.bookVerified !== false || edition.sourceId !== SOURCE
        || edition.documentType !== 'pinned_html_transcription' || edition.documentUrl !== SOURCE_URL
        || edition.gitCommit !== PIN || edition.contentSha256 !== HTML_DIGEST
        || edition.gitRepository !== 'https://github.com/SylarLong/iztro'
        || edition.gitPath !== 'docs/zh_TW/learn/ancientBook-2.html'
        || edition.authenticated !== false || edition.originalEditionAuthenticated !== false
        || edition.textCollatedAgainstOriginal !== false || edition.expertVerified !== false || edition.bookVerified !== false) {
        return denied('source_palace_source_mismatch');
    }
    if (!object(decision) || !validateDecisionRecord(decision).ok || decision.decision !== 'AI_ACCEPTED'
        || decision.formulaComparison !== 'MATCH' || decision.subjectType !== 'interpretation_claim'
        || decision.subjectId !== claimId || decision.claimId !== claimId || !text(decision.decisionId)
        || decision.interpretationDecision !== 'AI_CROSS_REVIEWED' || decision.interpretationVerdict !== VERDICT
        || decision.reviewBundleFile !== subject.bundleFile || decision.executionFile !== subject.executionFile
        || decision.spanFile !== RESEARCH + subject.spanFile || decision.contextFile !== RESEARCH + subject.contextFile
        || decision.sourcePin !== PIN || decision.artifactSha256 !== HTML_DIGEST
        || decision.bookVerified !== false || decision.publicRelease !== false || decision.releasePermission !== 'withheld'
        || decision.runtimeRuleChangeApplied !== false || decision.compatibilityNote !== COMPATIBILITY
        || ['sourceId', 'editionId', 'schoolId', 'sourceProfile', 'target', 'locator', 'quotationPolicy'].some((key) => decision[key] !== candidate[key])
        || !isDeepStrictEqual(decision.limitations, candidate.limitations)
        || !isDeepStrictEqual(decision.requiredAnchors, candidate.requiredAnchors)) return denied('source_palace_decision_mismatch');

    if (typeof span !== 'string' || typeof context !== 'string' || span !== candidate.sourceSpan
        || !Array.isArray(candidate.fixtures) || !candidate.fixtures.some((item) => item?.expected === true)
        || !candidate.fixtures.some((item) => item?.expected === false)) return denied('source_palace_evidence_invalid');
    const digests = {
        sourceDigest: sha256Text(span), contextDigest: sha256Text(context),
        conditionTreeDigest: sha256Text(JSON.stringify(candidate.conditionTree)),
        wordingDigest: sha256Text(candidate.proposedWording), fixturesDigest: sha256Text(JSON.stringify(candidate.fixtures))
    };
    if (Object.entries(digests).some(([key, value]) => value !== candidate[key] || value !== decision[key])) {
        return denied('source_palace_digest_mismatch');
    }

    const reviewers = decision.reviewers;
    if (['model', 'agentId', 'reviewRef'].some((key) => {
        const values = reviewers.map((item) => item?.[key]);
        return !values.every(text) || new Set(values).size !== 2;
    }) || !object(reviewB) || reviewB.available !== true || reviewB.independent !== true
        || reviewB.otherReviewerVerdictsRead !== false || reviewB.pin !== PIN || reviewB.rawHtmlSha256 !== HTML_DIGEST
        || reviewB.expertVerified !== false || reviewB.publicRelease !== false) return denied('source_palace_reviews_invalid');
    const actual = [];
    for (const reviewer of reviewers) {
        const isA = reviewer.reviewRef === subject.reviewA;
        if (!isA && reviewer.reviewRef !== subject.reviewB) return denied('source_palace_reviews_invalid');
        const review = one(isA ? reviewA : reviewB.reviews, (item) => item?.claimId === claimId);
        const executed = one(execution?.reviewers, (item) => item?.reviewRef === reviewer.reviewRef);
        if (!review || !executed || ['model', 'agentId', 'reviewRef', 'requestedModel', 'hostBuildId']
            .some((key) => !isDeepStrictEqual(reviewer[key], executed[key]))
            || !text(executed.requestedModel) || reviewer.model !== review.model
            || (!isA && reviewB.model !== review.model) || review.available !== true
            || reviewer.verdict !== 'MATCH' || reviewer.interpretationVerdict !== VERDICT
            || review.interpretationVerdict !== VERDICT || review.expertVerified !== false || review.bookVerified !== false
            || review.publicRelease !== false || review.releasePermission !== 'withheld' || review.usage !== 'internal_research'
            || ['sourceId', 'editionId', 'schoolId', 'sourceProfile', 'target', 'locator', 'quotationPolicy'].some((key) => review[key] !== candidate[key])
            || !isDeepStrictEqual(review.conditionTree, candidate.conditionTree) || !isDeepStrictEqual(review.limitations, candidate.limitations)
            || (isA ? review.reviewedWording : review.approvedWording) !== candidate.proposedWording
            || Object.entries(digests).some(([key, value]) => review[key] !== value)) return denied('source_palace_reviews_invalid');
        const projection = isA ? subject.projectionA : subject.projectionB;
        if (projection && review[projection[0]] !== projection[1]) return denied('source_palace_reviews_invalid');
        if (isA) {
            const assessment = review.sourceAssessment;
            if (assessment?.pin !== PIN || assessment.rawHtmlSha256 !== HTML_DIGEST || assessment.editionAuthenticated !== false
                || assessment.independentPinnedRawFetch?.status !== 200 || assessment.independentPinnedRawFetch.sha256 !== HTML_DIGEST
                || review.runtimeRuleChangeApplied !== false) return denied('source_palace_reviews_invalid');
        } else if (review.defaultFormulaChangeAuthorized !== false || review.empiricalTruthVerified !== false
            || Object.entries(digests).some(([key, value]) => review.verifiedDigests?.[key] !== value)) {
            return denied('source_palace_reviews_invalid');
        }
        actual.push(review);
    }
    const replay = verifyDecisionBinding({ record: decision, reviews: actual, storedSpan: span, baseline: {
        sourceDigest: digests.sourceDigest, editionId: candidate.editionId, schoolId: candidate.schoolId,
        locator: candidate.locator, requiredConditions: candidate.conditions, allowedConditions: candidate.conditions,
        requiredExceptions: [], requiredAnchors: candidate.requiredAnchors, quotationPolicy: candidate.quotationPolicy
    } });
    if (!replay.ok || replay.compared?.decision !== 'AI_ACCEPTED' || replay.compared.formulaComparison !== 'MATCH') {
        return denied('source_palace_review_replay_failed');
    }
    return { ok: true, reason: null, kind: SOURCE_PALACE_KIND, target: subject.target,
        sourceProfile: PROFILE, approvedWording: claim.approvedWording };
}

const stored = new Map();

/** Fixed repository evidence only: no runtime custom approval/fixture input. */
export function verifySourcePalaceBinding(claim) {
    const subject = Object.hasOwn(SUBJECTS, claim?.claimId) ? SUBJECTS[claim.claimId] : null;
    if (!subject || claim.interpretationDecisionRef !== subject.decisionRef) return denied('source_palace_binding_mismatch');
    if (!stored.has(claim.claimId)) {
        try {
            const evidence = loadEvidence(subject);
            stored.set(claim.claimId, { claim: one(evidence.claims, (item) => item?.claimId === claim.claimId),
                result: verifyStoredSourcePalaceEvidence(claim.claimId, evidence) });
        } catch {
            stored.set(claim.claimId, { claim: null, result: denied('source_palace_evidence_unavailable') });
        }
    }
    const checked = stored.get(claim.claimId);
    if (!checked.result.ok) return { ...checked.result };
    if (!isDeepStrictEqual(claim, checked.claim)) return denied('source_palace_binding_mismatch');
    return { ...checked.result };
}
