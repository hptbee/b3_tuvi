import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { sha256Text } from './sourceBinding.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';

export const MODERN_MINOR_PROFILE = 'iztro-pinned-age1-sex-triad';
export const MODERN_MINOR_PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
export const MODERN_MINOR_SOURCE = 'iztro-modern-software';
const EDITION = 'iztro-modern-2f00e2ab0c80';
const BASE = 'docs/knowledge/research/fortune/modern-minor/';
const SOURCE_URL = `https://github.com/SylarLong/iztro/blob/${MODERN_MINOR_PIN}/src/astro/palace.ts`;
function freeze(value) {
    if (value && typeof value === 'object') {
        Object.values(value).forEach(freeze);
        Object.freeze(value);
    }
    return value;
}
// The single immutable algorithm is shared by the evidence gate and placement.
export const MODERN_MINOR_ALGORITHM = freeze({
    "profileId": "iztro-pinned-age1-sex-triad",
    "inputFields": [
        "birthYearBranch",
        "gender",
        "nominalAge"
    ],
    "branchOrder": [
        "Tí",
        "Sửu",
        "Dần",
        "Mão",
        "Thìn",
        "Tị",
        "Ngọ",
        "Mùi",
        "Thân",
        "Dậu",
        "Tuất",
        "Hợi"
    ],
    "branchIds": "one_based_1_to_12",
    "triadStarts": [
        {
            "birthBranches": [
                "Dần",
                "Ngọ",
                "Tuất"
            ],
            "startBranch": "Thìn",
            "startBranchId": 5
        },
        {
            "birthBranches": [
                "Thân",
                "Tí",
                "Thìn"
            ],
            "startBranch": "Tuất",
            "startBranchId": 11
        },
        {
            "birthBranches": [
                "Tị",
                "Dậu",
                "Sửu"
            ],
            "startBranch": "Mùi",
            "startBranchId": 8
        },
        {
            "birthBranches": [
                "Hợi",
                "Mão",
                "Mùi"
            ],
            "startBranch": "Sửu",
            "startBranchId": 2
        }
    ],
    "genderDirections": [
        {
            "gender": 1,
            "sourceKey": "male",
            "direction": 1
        },
        {
            "gender": -1,
            "sourceKey": "female",
            "direction": -1
        }
    ],
    "ageAtStart": 1,
    "ageStep": 1,
    "palacesPerAgeStep": 1,
    "wrap": 12,
    "nominalAgeRange": {
        "min": 1,
        "max": 120,
        "integer": true
    },
    "outputFormula": "branchId = ((startBranchId - 1 + direction * (nominalAge - 1)) % 12 + 12) % 12 + 1",
    "sourcePalaceToProductBranchId": "((sourcePalaceIndex + 2) % 12) + 1",
    "yearYinYangAffectsDirection": false,
    "calendarAgeDerivation": false,
    "extendsBeyondSourceRange": false
});
const DIGESTS = freeze({
    "sourceDigest": "d5342272cab276bc6d17d1be3e837873a67410d4f961cd22bfc1975a843cc817",
    "contextDigest": "084984efdc46adbc115fc35707f80d1dfd28d114ac26645f3c8dd561f1b1cf09",
    "algorithmDigest": "73617dee8c9cc2b8ecc30a5e785139cc40fff6adda1f8b866db46f0b5497c50d",
    "compatibilityDigest": "786bfeb18c04ad84371ecd0f526266a7aef55288d19aeee6c682f718a5b55344",
    "fixturesDigest": "053fbdd20d76ce2e31da097dcfb991c969f333f8e19104c88374899f31883215"
});
const SUPPLEMENTS = freeze([
    {
        "path": "src/i18n/locales/en-US/earthlyBranch.ts",
        "file": "supplement/src__i18n__locales__en-US__earthlyBranch.ts.txt",
        "digest": "dcf7ffb67233fede74de6290e2c341dce80bcbd81b053c48e9667f42ad0bd0f2",
        "bytes": 280
    },
    {
        "path": "src/i18n/locales/en-US/index.ts",
        "file": "supplement/src__i18n__locales__en-US__index.ts.txt",
        "digest": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
        "bytes": 503
    },
    {
        "path": "src/i18n/starAliases.ts",
        "file": "supplement/src__i18n__starAliases.ts.txt",
        "digest": "5db704982d754e9e9487c80dfc171b51584cb89014b68171f7c6b87171a49b14",
        "bytes": 744
    }
]);
const CONDITIONS = freeze([
    "explicit_named_modern_profile",
    "four_birth_branch_triad_starts",
    "male_forward_female_reverse",
    "age_one_at_triad_start",
    "one_palace_per_year_wrap_twelve",
    "finite_integer_age_one_to_120",
    "explicit_branch_sex_age_projection",
    "no_calendar_age_derivation",
    "not_classical_or_public_prediction_approval"
]);
const ANCHORS = freeze([
    "const ageIdx = getAgeIndex(yearly[1]);",
    "age.push(12 * j + i + 1);",
    "kot<GenderKey>(gender!) === 'male' ? fixIndex(ageIdx + i) : fixIndex(ageIdx - i)",
    "ages[idx] = age;"
]);
const denied = (reason) => ({ ok: false, reason });
const same = isDeepStrictEqual;
const one = (rows, predicate) => {
    const found = Array.isArray(rows) ? rows.filter(predicate) : [];
    return found.length === 1 ? found[0] : null;
};
const refs = ['review-bundle.json', 'source-span.txt', 'review-context.txt', 'fixtures.json',
    'provenance.json', 'review-a.json', 'review-b.json', 'execution.json', 'decision.json', 'LICENSE.txt',
    ...SUPPLEMENTS.map((item) => item.file)];
const allowed = new Set([...refs.map((ref) => BASE + ref), 'docs/knowledge/sources.json']);
function read(ref) {
    if (!allowed.has(ref)) throw new Error('Unregistered modern-minor evidence');
    return readFileSync(new URL(`../../../${ref}`, import.meta.url), 'utf8');
}
function load() {
    const json = (ref) => JSON.parse(read(BASE + ref));
    return { bundle: json('review-bundle.json'), span: read(BASE + 'source-span.txt'),
        context: read(BASE + 'review-context.txt'), fixturesText: read(BASE + 'fixtures.json'),
        provenance: json('provenance.json'), reviews: [json('review-a.json'), json('review-b.json')],
        execution: json('execution.json'), decision: json('decision.json'),
        license: read(BASE + 'LICENSE.txt'), sources: JSON.parse(read('docs/knowledge/sources.json')),
        supplements: Object.fromEntries(SUPPLEMENTS.map((item) => [item.path, read(BASE + item.file)])) };
}

/** Pure evidence replay for one finite profile; no HTTP evidence injection. */
export function verifyStoredModernMinorEvidence(evidence = {}) {
    try {
        return verify(evidence);
    } catch {
        return denied('modern_minor_evidence_invalid');
    }
}
function verify({ bundle, span, context, fixturesText, provenance, reviews, execution, decision, sources, supplements, license }) {
    if (!bundle || !decision || !provenance || !Array.isArray(reviews) || reviews.length !== 2
        || typeof span !== 'string' || typeof context !== 'string' || typeof fixturesText !== 'string') return denied('modern_minor_evidence_missing');
    const identities = { subjectType: 'fortune_placement_profile', subjectId: MODERN_MINOR_PROFILE,
        profileId: MODERN_MINOR_PROFILE, sourceId: MODERN_MINOR_SOURCE, sourceProfile: MODERN_MINOR_PROFILE,
        editionId: EDITION, schoolId: 'vn-tam-hop-default', locator: 'src/astro/palace.ts#getHoroscope',
        sourcePin: MODERN_MINOR_PIN, sourceClass: 'pinned_modern_software_and_documentation_not_classical_edition' };
    if ([bundle, decision, ...reviews].some((row) => Object.entries(identities).some(([key, value]) => row?.[key] !== value))) {
        return denied('modern_minor_subject_mismatch');
    }
    if (!same(bundle.algorithmSpec, MODERN_MINOR_ALGORITHM) || !same(decision.algorithmSpec, MODERN_MINOR_ALGORITHM)
        || sha256Text(JSON.stringify(MODERN_MINOR_ALGORITHM)) !== DIGESTS.algorithmDigest) return denied('modern_minor_algorithm_mismatch');
    const measured = { sourceDigest: sha256Text(span), contextDigest: sha256Text(context),
        algorithmDigest: sha256Text(JSON.stringify(bundle.algorithmSpec)),
        compatibilityDigest: sha256Text(JSON.stringify(bundle.compatibilitySpec)), fixturesDigest: sha256Text(fixturesText) };
    if (span !== bundle.sourceSpan || Object.entries(DIGESTS).some(([key, value]) => measured[key] !== value
        || [bundle, decision, ...reviews].some((row) => row[key] !== value))) return denied('modern_minor_digest_mismatch');
    if (!same(bundle.compatibilitySpec, decision.compatibilitySpec)
        || bundle.compatibilitySpec.scope !== 'branch_sex_age_projection_not_full_iztro_astrolabe'
        || [bundle, decision, ...reviews].some((row) => row.expertVerified !== false || row.bookVerified !== false || row.publicRelease !== false)
        || bundle.sourceAuthenticatedHistoricalEdition !== false || decision.historicalAuthenticated !== false
        || decision.interpretationReviewed !== false || decision.runtimeRuleChangeApplied !== false
        || decision.releasePermission !== 'withheld' || decision.schoolCompatibilityOnly !== true
        || decision.algorithmApproval !== 'AI_CROSS_REVIEWED') return denied('modern_minor_scope_mismatch');
    const paths = { reviewBundleFile: 'review-bundle.json', sourceSpanFile: 'source-span.txt', contextFile: 'review-context.txt',
        fixturesFile: 'fixtures.json', provenanceFile: 'provenance.json', executionFile: 'execution.json' };
    if (Object.entries(paths).some(([key, value]) => decision[key] !== BASE + value)
        || !same(bundle.conditionIds, CONDITIONS) || !same(decision.conditionIds, CONDITIONS)
        || !same(bundle.requiredAnchors, ANCHORS) || !same(decision.requiredAnchors, ANCHORS)
        || decision.sourceArtifactPath !== 'src/astro/palace.ts'
        || decision.sourceArtifactDigest !== 'a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273'
        || decision.compatibilityScope !== bundle.compatibilitySpec.scope) return denied('modern_minor_scope_mismatch');
    const fixtures = JSON.parse(fixturesText);
    if (sha256Text(JSON.stringify(fixtures)) !== bundle.fixturesJsonDigest || decision.fixturesJsonDigest !== bundle.fixturesJsonDigest
        || fixtures.calendarAgeDerivation !== false || fixtures.sourceRevision !== MODERN_MINOR_PIN
        || fixtures.cases?.length !== 120 || fixtures.reachableNatalCharts?.length !== 24) return denied('modern_minor_fixtures_invalid');
    const source = one(sources?.sources, (row) => row?.sourceId === MODERN_MINOR_SOURCE);
    const edition = one(sources?.editions, (row) => row?.editionId === EDITION);
    if (!source || !edition || source.schoolId !== null || source.sourceType !== 'modern_software_reference'
        || source.bibliographicStatus !== 'secondary' || source.url !== SOURCE_URL
        || source.expertVerified !== false || source.bookVerified !== false || source.authenticated === true || edition.sourceId !== MODERN_MINOR_SOURCE
        || edition.documentType !== 'pinned_modern_software_reference' || edition.documentUrl !== SOURCE_URL
        || edition.gitRepository !== 'https://github.com/SylarLong/iztro' || edition.gitCommit !== MODERN_MINOR_PIN
        || edition.gitPath !== decision.sourceArtifactPath || edition.contentSha256 !== decision.sourceArtifactDigest
        || ['authenticated', 'originalEditionAuthenticated', 'textCollatedAgainstOriginal', 'bookVerified', 'expertVerified']
            .some((key) => edition[key] !== false)) return denied('modern_minor_source_invalid');
    if (provenance.revision !== MODERN_MINOR_PIN || provenance.repository !== 'https://github.com/SylarLong/iztro'
        || provenance.upstreamCodeExecuted !== false || provenance.sourceClass !== identities.sourceClass
        || sha256Text(license) !== 'e6c7b6e313cbda3135b41bccc66c98be132cb8319d0d465903d17e669e748b36') return denied('modern_minor_provenance_invalid');
    if (!validateDecisionRecord(decision).ok || decision.decision !== 'AI_ACCEPTED' || decision.formulaComparison !== 'MATCH'
        || !Array.isArray(execution?.reviewers) || execution.reviewers.length !== 2
        || bundle.payloadHashManifest?.length !== 19 || provenance.sources?.length !== 19
        || decision.supplementalEvidence?.length !== 3
        || new Set(decision.reviewers.map((row) => row.agentId)).size !== 2) return denied('modern_minor_decision_invalid');
    for (let index = 0; index < 2; index++) {
        const review = reviews[index];
        const ref = BASE + (index === 0 ? 'review-a.json' : 'review-b.json');
        const reviewer = one(decision.reviewers, (row) => row.reviewRef === ref);
        const executed = one(execution.reviewers, (row) => row.reviewRef === ref);
        if (review.model !== (index === 0 ? 'gpt-6.1-sol' : 'gpt-6-astra')
            || !reviewer || !executed || executed.hostBuildId !== null || ['model', 'agentId', 'reviewRef', 'requestedModel', 'hostBuildId']
            .some((key) => reviewer[key] !== executed[key]) || typeof executed.agentId !== 'string' || !executed.agentId.trim()
            || executed.requestedModel !== review.model || reviewer.model !== review.model
            || reviewer.verdict !== 'MATCH' || reviewer.available !== true || review.available !== true
            || review.verdict !== 'MATCH' || review.formulaComparison !== 'MATCH'
            || review.interpretationReviewed !== false || review.runtimeRuleChangeApplied !== false
            || review.releasePermission !== 'withheld' || !same(review.conditionIds, CONDITIONS)
            || !same(review.requiredAnchors, ANCHORS) || !same(review.algorithmSpec, bundle.algorithmSpec)
            || !same(review.compatibilitySpec, bundle.compatibilitySpec)) return denied('modern_minor_reviews_invalid');
        const pinProof = index === 0 ? review.independentPinVerification : review.pinVerification;
        for (const payload of bundle.payloadHashManifest || []) {
            const proof = one(pinProof?.verifiedPayloads, (row) => row.path === payload.upstreamPath);
            const original = one(provenance.sources, (row) => row.upstreamPath === payload.upstreamPath);
            if (!proof || !original || proof.sha256 !== payload.sha256 || original.sha256 !== payload.sha256
                || original.bytes !== payload.bytes || original.pinnedUrl !== payload.pinnedUrl) return denied('modern_minor_provenance_invalid');
        }
        if (index === 0 ? review.historicalAuthentication !== false || !review.independentReviewIsolation?.startsWith('No other model verdict')
            : review.historicalAuthenticated !== false || review.independence?.otherModelVerdictRead !== false
                || review.independence?.ownFixtureVerificationExecuted !== true) return denied('modern_minor_reviews_invalid');
        const extra = index === 0 ? pinProof?.supplementalPinnedSources : pinProof?.supplementalEvidence;
        for (const item of SUPPLEMENTS) {
            const proof = one(extra, (row) => row.path === item.path);
            const stored = one(decision.supplementalEvidence, (row) => row.upstreamPath === item.path);
            const bytes = supplements?.[item.path];
            if (!proof || !stored || typeof bytes !== 'string' || sha256Text(bytes) !== item.digest
                || proof.sha256 !== item.digest || proof.bytes !== item.bytes || stored.sha256 !== item.digest
                || stored.bytes !== item.bytes || Buffer.byteLength(bytes, 'utf8') !== item.bytes
                || stored.sourcePin !== MODERN_MINOR_PIN || stored.localFile !== BASE + item.file
                || stored.includedInOriginalContextDigest !== false
                || (index === 0 ? proof.pinnedUrl !== `https://github.com/SylarLong/iztro/blob/${MODERN_MINOR_PIN}/${item.path}`
                    : proof.sourcePin !== MODERN_MINOR_PIN || proof.includedInOriginalContextDigest !== false)) return denied('modern_minor_supplement_invalid');
        }
    }
    const replay = verifyDecisionBinding({ record: decision, reviews, storedSpan: span, baseline: {
        sourceDigest: DIGESTS.sourceDigest, editionId: EDITION, schoolId: identities.schoolId, locator: identities.locator,
        requiredConditions: CONDITIONS, allowedConditions: CONDITIONS, requiredExceptions: [], requiredAnchors: ANCHORS
    } });
    return replay.ok && replay.compared?.decision === 'AI_ACCEPTED' && replay.compared.formulaComparison === 'MATCH'
        ? { ok: true, reason: null } : denied('modern_minor_replay_failed');
}
let cached;
/** Loads fixed repository files once; callers cannot replace approval or mutate cache. */
export function verifyModernMinorBinding() {
    if (!cached) {
        try { cached = verifyStoredModernMinorEvidence(load()); }
        catch { cached = denied('modern_minor_evidence_unavailable'); }
    }
    return { ...cached };
}
