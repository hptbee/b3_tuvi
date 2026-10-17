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
const FOUNDATIONAL_RESOURCES = {
    evidenceBase: 'docs/knowledge/research/juan2-palace/foundational-single-star-packet/',
    reviewA: 'docs/knowledge/research/juan2-palace/foundational-single-star-packet/review-a.json',
    reviewB: 'docs/knowledge/research/juan2-palace/foundational-single-star-packet/review-b.json',
    bundleFile: 'docs/knowledge/research/juan2-palace/foundational-single-star-packet/review-bundle.json',
    executionFile: 'docs/knowledge/research/juan2-palace/foundational-single-star-packet/execution.json',
    reviewDocumentDigests: [
        '88e717a166970004d4d5134136724e4c96cebaca285213698101f8a6cf43ed76',
        '524f6941bded067b55de7d8019b94bcf7443f5f5b8bd426322317fff73f0bde3'
    ]
};
const SUBJECTS = {
    'interp-quanshu-thien-di-thien-luong-host': {
        ...FOUNDATIONAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-foundational-thien-di-thien-luong.json',
        target: 'thien_di',
        spanFile: 'thien-di-thien-luong-span.txt',
        contextFile: 'thien-di-thien-luong-context.txt',
        acceptedDigests: {
            sourceDigest: 'dd94a7c808ecefcfe95c66fd8f6c3ec2e6b61a6bb23f604a56a4b9e64be8b217',
            contextDigest: 'e5319ff9178dfe2c269c1ca97db08ef187a59cfe044d3ab2449c1b7e638cadee',
            conditionTreeDigest: 'f09f1fe7b4476fa3b3991eb6a7129b9c1bfce1d459e74d180cb9617422605869',
            wordingDigest: '870f7b3a90dcbedeb9829a39d464085b55f0d8174edfd94dcee09f99cad4bb25',
            fixturesDigest: '9704f4c4e926fb61af1d79a3e20ffce785d5e372de424f6e0ac357d3ab440062'
        }
    },
    'interp-quanshu-no-boc-thien-luong-host': {
        ...FOUNDATIONAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-foundational-no-boc-thien-luong.json',
        target: 'no_boc',
        spanFile: 'no-boc-thien-luong-span.txt',
        contextFile: 'no-boc-thien-luong-context.txt',
        acceptedDigests: {
            sourceDigest: '525f6d99ce9ea7241944b550fe9587f318eaad1e32c4d24bca43bc6380549989',
            contextDigest: '5c5f7a54b37ec1695bd08f0b6c8691760955c3c3c1bdc33cae4569838986acf2',
            conditionTreeDigest: 'd4d3437aa6b1cddeebf08546b61fc59e8be95b854194d6cd60786b01690c4b50',
            wordingDigest: 'c3002bfb51953aece27e0871bf9df6bbe60fca73083685f892a503af6f4f130f',
            fixturesDigest: 'a61319638ed1c8ca0fd96cca0ebf5657bfbad5dc4bedab18cce8adfedec722f5'
        }
    },
    'interp-quanshu-thien-di-cu-mon-host': {
        ...FOUNDATIONAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-foundational-thien-di-cu-mon.json',
        target: 'thien_di',
        spanFile: 'thien-di-cu-mon-span.txt',
        contextFile: 'thien-di-cu-mon-context.txt',
        acceptedDigests: {
            sourceDigest: '07a3061d21a4bbc92d6d0f06d8915ea3a6a52b87f1a74d7f5a537ff04dd7bce7',
            contextDigest: 'bb3286776f073e145c1ca12a20c79d1bf81afdd626a0bedd3abac9574a873e73',
            conditionTreeDigest: '47a77add0f31e36965310131185d13fbf825a6823ba3138e38c0c957cc25f833',
            wordingDigest: 'fa83219c0dea5a5be74fbeb1dbc7063564a9a416fb703c59a88e89b3c210dd9e',
            fixturesDigest: '206de75c37766f01fc1a10148a8a0bbb27a021303c4e4f3b996627df6ef22a06'
        }
    },
    'interp-quanshu-dien-trach-thien-co-host': {
        ...FOUNDATIONAL_RESOURCES,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-foundational-dien-trach-thien-co.json',
        target: 'dien_trach',
        spanFile: 'dien-trach-thien-co-span.txt',
        contextFile: 'dien-trach-thien-co-context.txt',
        acceptedDigests: {
            sourceDigest: '4aeb0c94263499259240be3230a90c6aa9227135c49131029c638d834fadecdd',
            contextDigest: 'dcc35fed124101895768b322b65bca804bfd9279afd747f20dd3579e02a05971',
            conditionTreeDigest: 'b29b13f211f2928407a4ef7c6ac77a7b8b4cf64db177ca3bb1c2981fa7557b9e',
            wordingDigest: '2e86d4a925be056009cb346b566e539650374c9b9637fad04608bb8634cc623e',
            fixturesDigest: '4adf22000781ce980959d38ceb1bf3f49553b4bbc472ea22cd5c28be0195121a'
        }
    },
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
    'interp-quanshu-phuc-co-cu-host': {
        reviewA: 'docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-a.json',
        reviewB: 'docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-b.json',
        bundleFile: `${RESEARCH}review-bundle-phuc-co-cu.json`, executionFile: `${RESEARCH}execution-phuc-co-cu.json`,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-phuc-co-cu.json',
        target: 'phuc_duc', spanFile: 'phuc-co-cu-complete-spans.txt', contextFile: 'phuc-full-section.txt',
        acceptedDigests: {
            sourceDigest: 'ecab3739a743b233911914a43ef297847c2328b60254bddbed4e69c559f7b186',
            contextDigest: '1ad123491278d5fcc8c568956085100468f59e45bc57035339586d3387bc5757',
            conditionTreeDigest: '2b53a285d252dc8a7183322d9bd76fe1891fb8ec980ecc50b13118428c5e61b8',
            wordingDigest: '5804e6d68fb5de7bdd03d50decc0280aaf2faaae002296f31409c16ace3fe9ac',
            fixturesDigest: 'fc389b054837ae2eb3369b62cbb8f7cd8464403f06389bf84740edccadc46487'
        },
        reviewDocumentDigests: [
            'ba606fb765e0281b4ec034cd034dda177005d1caa0993a405ffcbc12e459a87f',
            '791a98d5fba2e309528cb233fbefb83d69c839e03ad760b94b616dc495749ce1'
        ]
    },
    'interp-quanshu-tai-tuvi-pha-quan-host': {
        reviewA: 'docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-a.json',
        reviewB: 'docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-b.json',
        bundleFile: `${RESEARCH}review-bundle-tai-tuvi-pha.json`, executionFile: `${RESEARCH}execution-tai-tuvi-pha.json`,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-tai-tuvi-pha.json',
        target: 'tai_bach', spanFile: 'tai-tuvi-pha-complete-spans.txt', contextFile: 'tai-full-section.txt',
        acceptedDigests: {
            sourceDigest: '97c498dbad297a90345a1817af3c8ec19d8793ec67fb1802f88972123efc5df5',
            contextDigest: '18e05f3a45cf27553642da48035fa263e267e90d49c9a1211df734a6dc54ee13',
            conditionTreeDigest: 'c1c9dd401e41bca4fb5dcceeacc06c38b0531b5e191765f700302790d0dab7b3',
            wordingDigest: '21fb32648cbd151dd37c62859254200885d7557a18b06ce4f6cd63bb2ff76fb5',
            fixturesDigest: 'c87eb5805eea4396db96b019948b2acee01d621b8516b080f4d70714a7e005ac'
        },
        reviewDocumentDigests: [
            'bdf3f1cdd4215f4ce52e6b2d71dbd86a222831acb338d36bc50955acd771462b',
            '90fbeabf5fbcb3dbc61c1692d3519e59ddd37bcc7a75497dadd0aa865510d550'
        ]
    },
    'interp-quanshu-quan-co-cu-mao-host': {
        reviewA: 'docs/knowledge/reviews/juan2-palace/review-quan-mao-a.json',
        reviewB: 'docs/knowledge/reviews/juan2-palace/review-quan-mao-b.json',
        bundleFile: `${RESEARCH}review-bundle-quan-mao.json`, executionFile: `${RESEARCH}execution-quan-mao.json`,
        decisionRef: 'docs/knowledge/interpretation-decisions/juan2-quan-co-cu-mao.json',
        target: 'quan_loc', spanFile: 'quan-co-cu-mao-source-span.txt', contextFile: 'quan-co-cu-mao-context.txt',
        acceptedDigests: {
            sourceDigest: 'ae7aec7a8cb175d88b956f6562e7ccc138b45c65268c7bd0f7a7aba5a0966443',
            contextDigest: 'bc5cb3737a70e083f983b4498af51281a266ae35ba2df71aa75fa46e7ad42ba4',
            conditionTreeDigest: '712cb19572c1e5e54708fdc1055c14c6b1cda46e38bd34d7273e1f79aba05e51',
            wordingDigest: '4ac9b9acbb853b7c601c5d2df4e13c2b41522eb489125177ad101fc500efbb62',
            fixturesDigest: '62310a0b6c2ef5b3fe6e32d13aefeebccaa4fa66c3fd4ef234a8f23fd7730c7b'
        },
        reviewDocumentDigests: [
            'ac4e78696d2b65991bb8bb1c7dd83aac1904be97ef06066eb7f2e089c7024e83',
            'f3b5605b9b4a0a5e4d1ad58a61b6f6f2115fd476d0a9082a85b16ae1a2bba19a'
        ]
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
        subject.bundleFile, subject.executionFile, (subject.evidenceBase || RESEARCH) + subject.spanFile, (subject.evidenceBase || RESEARCH) + subject.contextFile])
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
        span: read((subject.evidenceBase || RESEARCH) + subject.spanFile), context: read((subject.evidenceBase || RESEARCH) + subject.contextFile)
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
        || decision.spanFile !== (subject.evidenceBase || RESEARCH) + subject.spanFile || decision.contextFile !== (subject.evidenceBase || RESEARCH) + subject.contextFile
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

    if (subject.acceptedDigests && (!Array.isArray(reviewA) || !object(reviewB)
        || Object.entries(subject.acceptedDigests).some(([key, value]) => digests[key] !== value)
        || [reviewA, reviewB].some((review, index) => sha256Text(JSON.stringify(review)) !== subject.reviewDocumentDigests[index]))) {
        return denied('source_palace_accepted_evidence_mismatch');
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
