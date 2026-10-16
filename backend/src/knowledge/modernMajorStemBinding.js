import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { sha256Text } from './sourceBinding.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';
import { MODERN_MAJOR_ALGORITHM, verifyModernMajorBinding } from './modernMajorBinding.js';

export const MODERN_MAJOR_STEM_PROFILE = 'iztro-pinned-menh-cuc-decadal-stem';
const BASE = 'docs/knowledge/research/fortune/modern-decadal-stem/';
function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
}
export const MODERN_MAJOR_STEM_ALGORITHM = freeze({
    baseAlgorithmSpec: MODERN_MAJOR_ALGORITHM,
    "profileId": "iztro-pinned-menh-cuc-decadal-stem",
    "baseProfileId": "iztro-pinned-menh-cuc-decadal",
    "inputFields": [
        "menhBranchId",
        "cucNumber",
        "birthYearBranch",
        "gender",
        "nominalAge",
        "birthYearStemIndex"
    ],
    "stemNames": [
        "Giáp",
        "Ất",
        "Bính",
        "Đinh",
        "Mậu",
        "Kỷ",
        "Canh",
        "Tân",
        "Nhâm",
        "Quý"
    ],
    "tigerStartStemIndexes": [
        2,
        4,
        6,
        8,
        0,
        2,
        4,
        6,
        8,
        0
    ],
    "sourcePalaceIndex": "((selectedBranchId - 3) % 12 + 12) % 12",
    "stemIndex": "(tigerStartStemIndexes[birthYearStemIndex] + sourcePalaceIndex) % 10",
    "stemOutput": "stemNames[stemIndex]",
    "selectedBranchSource": "unchanged_approved_modernMajorPeriod",
    "stemYearSource": "trusted_server_natal_lunar_canIndex_and_exact_canName_with_branch_parity",
    "oldProfileFields": "unchanged_no_heavenlyStem_or_stemPlacement",
    "placedNewFields": {
        "heavenlyStem": "canonical_stem",
        "stemPlacement": "supported"
    },
    "closedNewFields": {
        "heavenlyStem": null,
        "stemPlacement": "not_applied"
    },
    "calendarAgeDerivation": false,
    "interpretationReviewed": false,
    "publicFortune": false
});
const HASHES = freeze({
    "review-bundle.json": "86b0df497643d23056c14c39c1344ab5e893103141089aa209c856f40ff6ccef",
    "decision.json": "12090304924096be326c0c40881b911af0c4330f46680e4f6ca597cccf12a672",
    "review-a.json": "38354ed2132f61195b283bb24e7cda157764115ed4b0f773bd592e6eace18ddb",
    "review-b.json": "af778fa38d0516c6ab7e7649d2b8488ff2eceef19424240784a26c4938ca4baf",
    "execution.json": "707e28870caaa1e92d23c2ad9ae0681c259ee15f92d991a5cb1f0ed454170c85",
    "manifest.json": "7c0207f9d1c10f3a0659f3274e58a8c97c1b63e2a7ba7579ea1562900afb699c",
    "candidate-algorithm.json": "272bfd16020e47687e1a08d9e22e00aea05ff68c7940bfc59c37276796192c53",
    "source-span.txt": "d5342272cab276bc6d17d1be3e837873a67410d4f961cd22bfc1975a843cc817",
    "review-context.txt": "8abb9bcfb763e1e5c8e4ee6f6892a46a0983f13a92ba538bcff85e4712d21267",
    "fixtures.json": "8313ef2f8c81dceafd81cd3302ce710e7e3d81ca6ae9c104fbab71209a101817",
    "README.md": "ebf36c7215d8b6760d9372042e25fe5c8e69b083b1b5b4e8793f1a865de1adf6",
    "conditional-design.md": "c74083fcde56eee01bbe961bfd4dc8c0f7d50fbf5a69aeb78c50fcb8094d6b23",
    "decadal-main-block.txt": "ff1cd395ccd3bb912d5f96391138007e2514c1f0d1fa84300b8375fa1739d6e7",
    "finalize-source.py": "98ca7e4f569d2f3daa41f5d40af72954221f575882525867e6b60997e24feb2b",
    "independent-fixtures.md": "0c1a6de7e53dbd1a2cd58c7593da98c2af95929a7ed6dc3d9bd8468dc98e95cd",
    "independent-replay.mjs": "c30f476e047a65ef42f1ab5532675f28c2aab70e537201cdcf13fd9f008b0103",
    "independent-source-proof.json": "46783d95a972421161de26b3dfbd98fe6396e28302a154fed13edd403adbb296",
    "source-analysis.md": "2c61f3ebd7ae4d5f62d6cf19cafd1f050e05a6b1e35f4d0684ca0ea491748f22",
    "source-build.py": "6a45d70a7d93f2cf6f6189caad62b0a5b45f2db88480e0cdd86743c8753a70cd",
    "source-proof.json": "d88e782931dd7d6c4625edc9c55ece4c21ff47b6b472f3ee76745916b375ca23",
    "write-analysis.py": "4507c70a94082a8c447874d980c037a1cc687232eee84fb4215e2bba6955384d",
    "dependency/lunar-lite-0.2.8-ganzhi.js": "5b7ec19b55f1d703bce40694a7dfb172ddbf3358cef2682f7c048c65b01cba2d",
    "raw/LICENSE": "e6c7b6e313cbda3135b41bccc66c98be132cb8319d0d465903d17e669e748b36",
    "raw/package.json": "2b7d04100c48599e4fe02f5ec1521f5ca45b41914adf5a5472e86abc6dfa1ee6",
    "raw/yarn.lock": "0a20660c41f9fe4ae7138fd508dd60a3399146a41bcc741bde375a1a285a2111",
    "raw/src/astro/astro.ts": "84e1fd5121bc6c5e7fb17ef3d8aadd0f8473ff8f2704c17c1af96e77388d49f8",
    "raw/src/astro/config.ts": "e74d2bf23630f8faadfae9fd2d29c592ceb7a18d7396c0aba5d74959ea5d134e",
    "raw/src/astro/palace.ts": "a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273",
    "raw/src/data/constants.ts": "e2411f73c7ea438b5186f2a3ef29fa54587ab78e25620b5a52b409ce9244043a",
    "raw/src/i18n/index.ts": "06da411d37e4e5f3dc7d922f3dbce0f9fcb2fe1125619873e6a651eabc63d558",
    "raw/src/utils/index.ts": "9f3699115c9c149dc261f9a293e6c7ad40ac4f744884dba21b367b96d9bbfe16",
    "raw/src/data/types/astro.ts": "b24c25fa535e6b89fbe9b0e93deebe3851dd943cdd3baa290747b863506e3b85",
    "raw/src/i18n/locales/vi-VN/earthlyBranch.ts": "933f9475bd0b580904515dc3198f059f8924310de10dd8538d2eb02e26311f0c",
    "raw/src/i18n/locales/vi-VN/heavenlyStem.ts": "4b0805baf3aa2555e4db3c804e6947f179e5905b1e73c9c261cbd35e38d6b2ea",
    "raw/src/i18n/locales/vi-VN/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007"
});
const SOURCE_IDENTITY = freeze({
    "sources": [
        {
            "sourceId": "iztro-modern-software",
            "title": "iztro pinned modern software — explicit nominal-age minor-period mapping",
            "author": "SylarLong and contributors",
            "tradition": "Modern Zi Wei software documentation and source implementation; separately named structural projection",
            "schoolId": null,
            "sourceType": "modern_software_reference",
            "publicationYear": null,
            "edition": null,
            "publisher": null,
            "language": "zh/en/vi",
            "url": "https://github.com/SylarLong/iztro/blob/2f00e2ab0c80b1632e55bc362f2ae26e121245cb/src/astro/palace.ts",
            "accessedAt": "2026-10-15",
            "bibliographicStatus": "secondary",
            "bookVerified": false,
            "expertVerified": false,
            "verificationNotes": "Exact Git pin and source/locale payloads independently checked by two actual models. Approval covers a branch/sex/explicit nominal-age projection, not an authenticated historical edition or full upstream/product calendar/natal equivalence.",
            "copyrightNotes": "MIT software reference; full notice preserved. Source/context and supplemental code are inert evidence text, not imported, installed, executed or served as application assets."
        }
    ],
    "editions": [
        {
            "editionId": "iztro-modern-2f00e2ab0c80",
            "sourceId": "iztro-modern-software",
            "documentType": "pinned_modern_software_reference",
            "documentUrl": "https://github.com/SylarLong/iztro/blob/2f00e2ab0c80b1632e55bc362f2ae26e121245cb/src/astro/palace.ts",
            "gitRepository": "https://github.com/SylarLong/iztro",
            "gitCommit": "2f00e2ab0c80b1632e55bc362f2ae26e121245cb",
            "gitPath": "src/astro/palace.ts",
            "contentSha256": "a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273",
            "authenticated": false,
            "digitalArtifactVerified": true,
            "originalEditionAuthenticated": false,
            "textCollatedAgainstOriginal": false,
            "bookVerified": false,
            "expertVerified": false,
            "verificationNotes": "Modern implementation identity only. Primary full-file hash differs deliberately from the bounded reviewed function span hash. No historical/classical-source or natal-school authentication."
        }
    ]
});
const denied = reason => ({ ok: false, reason });
/** Fixed source-scoped artifacts only; no HTTP caller can supply evidence. */
export function verifyStoredModernMajorStemEvidence({ files, sources } = {}) {
    try {
        if (!files || Object.entries(HASHES).some(([file, digest]) => typeof files[file] !== 'string'
            || sha256Text(files[file]) !== digest)) return denied('modern_major_stem_evidence_invalid');
        const select = (rows, key, value) => Array.isArray(rows) ? rows.filter(row => row?.[key] === value) : [];
        if (!isDeepStrictEqual(select(sources?.sources, 'sourceId', 'iztro-modern-software'), SOURCE_IDENTITY.sources)
            || !isDeepStrictEqual(select(sources?.editions, 'editionId', 'iztro-modern-2f00e2ab0c80'), SOURCE_IDENTITY.editions)) {
            return denied('modern_major_stem_source_invalid');
        }
        const json = ref => JSON.parse(files[ref]);
        const bundle = json('review-bundle.json'), decision = json('decision.json');
        if (!isDeepStrictEqual(bundle.algorithmSpec, MODERN_MAJOR_STEM_ALGORITHM)
            || !isDeepStrictEqual(decision.algorithmSpec, MODERN_MAJOR_STEM_ALGORITHM)
            || !validateDecisionRecord(decision).ok) return denied('modern_major_stem_decision_invalid');
        const replay = verifyDecisionBinding({ record: decision,
            reviews: [json('review-a.json'), json('review-b.json')], storedSpan: files['source-span.txt'], baseline: {
                sourceDigest: bundle.sourceDigest, editionId: bundle.editionId, schoolId: bundle.schoolId,
                locator: bundle.locator, requiredConditions: bundle.conditionIds, allowedConditions: bundle.conditionIds,
                requiredExceptions: bundle.exceptions, requiredAnchors: bundle.requiredAnchors
            } });
        return replay.ok && replay.compared?.decision === 'AI_ACCEPTED' && replay.compared.formulaComparison === 'MATCH'
            ? { ok: true, reason: null } : denied('modern_major_stem_replay_failed');
    } catch { return denied('modern_major_stem_evidence_invalid'); }
}
let cached;
/** Old branch approval remains mandatory; validate new immutable artifacts once. */
export function verifyModernMajorStemBinding() {
    if (!verifyModernMajorBinding().ok) return denied('modern_major_base_not_approved');
    if (!cached) {
        try {
            const files = Object.fromEntries(Object.keys(HASHES).map(ref => [ref,
                readFileSync(new URL(`../../../${BASE}${ref}`, import.meta.url), 'utf8')]));
            const sources = JSON.parse(readFileSync(new URL('../../../docs/knowledge/sources.json', import.meta.url), 'utf8'));
            cached = verifyStoredModernMajorStemEvidence({ files, sources });
        } catch { cached = denied('modern_major_stem_evidence_unavailable'); }
    }
    return { ...cached };
}
