import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { sha256Text } from './sourceBinding.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';
export const MODERN_MAJOR_PROFILE = 'iztro-pinned-menh-cuc-decadal';
export const MODERN_MAJOR_PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
export const MODERN_MAJOR_SOURCE = 'iztro-modern-software';
const BASE = 'docs/knowledge/research/fortune/modern-decadal/';
function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
}
export const MODERN_MAJOR_ALGORITHM = freeze({
    "profileId": "iztro-pinned-menh-cuc-decadal",
    "inputFields": [
        "menhBranchId",
        "cucNumber",
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
    "firstPalace": "natal_menh",
    "startingAge": "cuc_number",
    "cucStartAges": [
        {
            "element": "water",
            "number": 2
        },
        {
            "element": "wood",
            "number": 3
        },
        {
            "element": "metal",
            "number": 4
        },
        {
            "element": "earth",
            "number": 5
        },
        {
            "element": "fire",
            "number": 6
        }
    ],
    "yearYangBranches": [
        "Tí",
        "Dần",
        "Thìn",
        "Ngọ",
        "Thân",
        "Tuất"
    ],
    "yearYinBranches": [
        "Sửu",
        "Mão",
        "Tị",
        "Mùi",
        "Dậu",
        "Hợi"
    ],
    "genderMapping": [
        {
            "gender": 1,
            "sourceKey": "male",
            "yinYang": "阳"
        },
        {
            "gender": -1,
            "sourceKey": "female",
            "yinYang": "阴"
        }
    ],
    "directionRule": "gender_yin_yang_equals_birth_year_branch_yin_yang_forward_else_reverse",
    "forwardDirection": 1,
    "reverseDirection": -1,
    "periodCount": 12,
    "yearsPerPeriod": 10,
    "rangeEndOffset": 9,
    "periodIndex": "zero_based_0_to_11",
    "palacesPerPeriod": 1,
    "wrap": 12,
    "nominalAgeRange": {
        "min": 1,
        "max": 125,
        "integer": true
    },
    "validPerChartAgeRange": "cucNumber_through_cucNumber_plus_119_inclusive",
    "periodFormula": "floor((nominalAge - cucNumber) / 10)",
    "outputFormula": "branchId = ((menhBranchId - 1 + direction * periodIndex) % 12 + 12) % 12 + 1",
    "periodRangeFormula": "start = cucNumber + 10 * periodIndex; end = start + 9",
    "sourcePalaceToProductBranchId": "((sourcePalaceIndex + 2) % 12) + 1",
    "beforeFirstPeriod": "not_applied_no_placement",
    "afterLastPeriod": "not_applied_no_placement",
    "childhoodApplied": false,
    "thirteenthPeriodApplied": false,
    "calendarAgeDerivation": false,
    "yearYinYangAffectsDirection": true,
    "extendsBeyondSourceRange": false
});
const HASHES = freeze({
    "review-bundle.json": "a2811da20a2d0396c483dcc827b19f8b971e94d85ad57960f1e9ebbf1889def8",
    "decision.json": "b7e73d897aea97374cf6c630ec23ac65e67674455bf50fbd6b18e9b0053363fb",
    "review-a.json": "7e63d0804fb72937ed4c1f50ad1b442cd1826f14122a2e0e04c238edb428667b",
    "review-b.json": "ef91eebd01e3a67a5656ca9bb8803273852ca80f8057e64a2524bf9254231c9e",
    "execution.json": "0a4a6dff49d35c8c6179965ad6bd84e89d1e65c8e122f19ca5d39efd58bf8025",
    "provenance.json": "fd8fa1fcff4d85a2d88759571815304d38f307b8e35688146e94ec3134543921",
    "source-span.txt": "d5342272cab276bc6d17d1be3e837873a67410d4f961cd22bfc1975a843cc817",
    "review-context.txt": "ec445067020c392a2187fe2261e9c8ec53eb1cb679795d50acaed7febcca2321",
    "fixtures.json": "d9a2a37c2c4235c05003994d818427903ce52db07946d133c7e8df9f37c7a1ca",
    "age-convention-witnesses.json": "d01ce69297a52cab2cf02ae42b6b49088fe9ea7335e58f820518d2595b45bd67",
    "LICENSE.txt": "e6c7b6e313cbda3135b41bccc66c98be132cb8319d0d465903d17e669e748b36",
    "raw/LICENSE": "e6c7b6e313cbda3135b41bccc66c98be132cb8319d0d465903d17e669e748b36",
    "raw/docs/zh_TW/learn/horoscope.html": "e1bd9053258d022e2dc2295e23a6847a92eb004655090252a91494bcff48a0f4",
    "raw/docs/zh_TW/posts/config-n-plugin.html": "145949e340fa8b0fe9cdd26fa892343ca7a5690491de7b27490d94c9f9ac9f19",
    "raw/src/astro/FunctionalAstrolabe.ts": "584fd8d2d3ac76b3b8d7990ec6d26cac42eb5f1fcac9175326f29497d60d2d9c",
    "raw/src/astro/astro.ts": "84e1fd5121bc6c5e7fb17ef3d8aadd0f8473ff8f2704c17c1af96e77388d49f8",
    "raw/src/astro/config.ts": "e74d2bf23630f8faadfae9fd2d29c592ceb7a18d7396c0aba5d74959ea5d134e",
    "raw/src/astro/palace.ts": "a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273",
    "raw/src/data/constants.ts": "e2411f73c7ea438b5186f2a3ef29fa54587ab78e25620b5a52b409ce9244043a",
    "raw/src/data/earthlyBranches.ts": "3dd6e4b260a18a2a8c0e4aec2a12e766f29e52d7b4c01ecbf332f6066a3f1b34",
    "raw/src/data/heavenlyStems.ts": "f50a96b4fda42f834b2ff7aea36533a38bd5bcee94b74d5ecc1deb22ee07279c",
    "raw/src/data/index.ts": "e45e0875d60c2aede27dad389f11d3cdda7e31d1694e5f53ff32cd025288f2a2",
    "raw/src/data/types/astro.ts": "b24c25fa535e6b89fbe9b0e93deebe3851dd943cdd3baa290747b863506e3b85",
    "raw/src/i18n/index.ts": "06da411d37e4e5f3dc7d922f3dbce0f9fcb2fe1125619873e6a651eabc63d558",
    "raw/src/i18n/locales/en-US/earthlyBranch.ts": "dcf7ffb67233fede74de6290e2c341dce80bcbd81b053c48e9667f42ad0bd0f2",
    "raw/src/i18n/locales/en-US/fiveElementsClass.ts": "05a4919dab702883c0cb85b869c11af7ee47a9afd5a500ccee0e0f34f78e09be",
    "raw/src/i18n/locales/en-US/gender.ts": "8c2b91082c2d88bd27cc4678965003c67b8636799ed83bd2f94369de0e367a0d",
    "raw/src/i18n/locales/en-US/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/ja-JP/earthlyBranch.ts": "8672f42c8460b8ae0079e643e1fe62db133fcd19879dd2ad08b5ab3b606a2ab8",
    "raw/src/i18n/locales/ja-JP/fiveElementsClass.ts": "01a3f688b35cb994845e6051e8bf97ab687fbe30ca594e44ea85f70583b15c85",
    "raw/src/i18n/locales/ja-JP/gender.ts": "a19607ebf4055ed0f0daa3a78b21288185a67fdf8190e750251be72de19e5d8d",
    "raw/src/i18n/locales/ja-JP/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/ko-KR/earthlyBranch.ts": "f2a7dc855e5cdf71c74dba286e3463f2fd063fa31b39ce3b14cced0da4784fc7",
    "raw/src/i18n/locales/ko-KR/fiveElementsClass.ts": "f43e780a5c5ea4a8ebf1f4900364fe7c9931bdc85d6ec10ea593bd26d215a5ad",
    "raw/src/i18n/locales/ko-KR/gender.ts": "aa0f5ffe65da671b0c1c663e2bf4895801b02783e6e8c1e3f105d0046713b0e5",
    "raw/src/i18n/locales/ko-KR/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/vi-VN/earthlyBranch.ts": "933f9475bd0b580904515dc3198f059f8924310de10dd8538d2eb02e26311f0c",
    "raw/src/i18n/locales/vi-VN/fiveElementsClass.ts": "b5b7923adb3df59f2b24cc579347c5ffa8eb86082d0e6b05b3aa3a961ea9d858",
    "raw/src/i18n/locales/vi-VN/gender.ts": "79ab1b39e62fda211cd5b21e916446ee58d6afa10b3a639dd7799987ef7ef3d4",
    "raw/src/i18n/locales/vi-VN/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/zh-CN/earthlyBranch.ts": "8672f42c8460b8ae0079e643e1fe62db133fcd19879dd2ad08b5ab3b606a2ab8",
    "raw/src/i18n/locales/zh-CN/fiveElementsClass.ts": "4378134b7172d28231a77980a137b6c1448f8f4b1227a6317306fba85c0f4366",
    "raw/src/i18n/locales/zh-CN/gender.ts": "a19607ebf4055ed0f0daa3a78b21288185a67fdf8190e750251be72de19e5d8d",
    "raw/src/i18n/locales/zh-CN/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/zh-TW/earthlyBranch.ts": "8672f42c8460b8ae0079e643e1fe62db133fcd19879dd2ad08b5ab3b606a2ab8",
    "raw/src/i18n/locales/zh-TW/fiveElementsClass.ts": "4378134b7172d28231a77980a137b6c1448f8f4b1227a6317306fba85c0f4366",
    "raw/src/i18n/locales/zh-TW/gender.ts": "a19607ebf4055ed0f0daa3a78b21288185a67fdf8190e750251be72de19e5d8d",
    "raw/src/i18n/locales/zh-TW/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/starAliases.ts": "5db704982d754e9e9487c80dfc171b51584cb89014b68171f7c6b87171a49b14",
    "raw/src/utils/index.ts": "9f3699115c9c149dc261f9a293e6c7ad40ac4f744884dba21b367b96d9bbfe16"
});
const SOURCE = freeze({
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
});
const EDITION = freeze({
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
});
const denied = (reason) => ({ ok: false, reason });
/** Pure fixed-artifact verifier for tests. HTTP callers cannot supply evidence. */
export function verifyStoredModernMajorEvidence({ files, sources } = {}) {
    try {
        if (!files || Object.entries(HASHES).some(([file, digest]) => typeof files[file] !== 'string'
            || sha256Text(files[file]) !== digest)) return denied('modern_major_evidence_invalid');
        const select = (rows, key, value) => Array.isArray(rows) ? rows.filter(row => row?.[key] === value) : [];
        if (!isDeepStrictEqual(select(sources?.sources, 'sourceId', MODERN_MAJOR_SOURCE), [SOURCE])
            || !isDeepStrictEqual(select(sources?.editions, 'editionId', EDITION.editionId), [EDITION])) return denied('modern_major_source_invalid');
        const json = ref => JSON.parse(files[ref]);
        const bundle = json('review-bundle.json'), decision = json('decision.json');
        const reviews = [json('review-a.json'), json('review-b.json')];
        if (!isDeepStrictEqual(bundle.algorithmSpec, MODERN_MAJOR_ALGORITHM)
            || !isDeepStrictEqual(decision.algorithmSpec, MODERN_MAJOR_ALGORITHM)
            || !validateDecisionRecord(decision).ok) return denied('modern_major_decision_invalid');
        const replay = verifyDecisionBinding({ record: decision, reviews, storedSpan: files['source-span.txt'], baseline: {
            sourceDigest: bundle.sourceDigest, editionId: bundle.editionId, schoolId: bundle.schoolId,
            locator: bundle.locator, requiredConditions: bundle.conditionIds, allowedConditions: bundle.conditionIds,
            requiredExceptions: [], requiredAnchors: bundle.requiredAnchors
        } });
        return replay.ok && replay.compared?.decision === 'AI_ACCEPTED' && replay.compared.formulaComparison === 'MATCH'
            ? { ok: true, reason: null } : denied('modern_major_replay_failed');
    } catch { return denied('modern_major_evidence_invalid'); }
}
let cached;
/** Fixed local evidence, validated once; return a defensive result on every call. */
export function verifyModernMajorBinding() {
    if (!cached) {
        try {
            const files = Object.fromEntries(Object.keys(HASHES).map(ref => [ref,
                readFileSync(new URL(`../../../${BASE}${ref}`, import.meta.url), 'utf8')]));
            const sources = JSON.parse(readFileSync(new URL('../../../docs/knowledge/sources.json', import.meta.url), 'utf8'));
            cached = verifyStoredModernMajorEvidence({ files, sources });
        } catch { cached = denied('modern_major_evidence_unavailable'); }
    }
    return { ...cached };
}
