import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { sha256Text } from './sourceBinding.js';
import { validateDecisionRecord } from './decisionRegistry.js';
import { verifyDecisionBinding } from './decisionIntegrity.js';
import { MODERN_MAJOR_STEM_ALGORITHM, verifyModernMajorStemBinding } from './modernMajorStemBinding.js';
import tuHoaMap from '../data/tuHoaMap.json' with { type: 'json' };

export const MODERN_MAJOR_MUTAGEN_PROFILE = 'iztro-pinned-menh-cuc-decadal-mutagen';
const BASE = 'docs/knowledge/research/fortune/modern-decadal-mutagen/';
function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
}
export const MODERN_MAJOR_MUTAGEN_ALGORITHM = freeze({
    baseAlgorithmSpec: MODERN_MAJOR_STEM_ALGORITHM,
    "profileId": "iztro-pinned-menh-cuc-decadal-mutagen",
    "baseProfileId": "iztro-pinned-menh-cuc-decadal-stem",
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
    "mutagenIds": [
        "hoa_loc",
        "hoa_quyen",
        "hoa_khoa",
        "hoa_ky"
    ],
    "mutagenLabels": [
        "Hóa Lộc",
        "Hóa Quyền",
        "Hóa Khoa",
        "Hóa Kỵ"
    ],
    "sourceMutagenOrder": [
        "sihuaLu",
        "sihuaQuan",
        "sihuaKe",
        "sihuaJi"
    ],
    "defaultTable": {
        "0": [
            "Liêm Trinh",
            "Phá Quân",
            "Vũ Khúc",
            "Thái Dương"
        ],
        "1": [
            "Thiên Cơ",
            "Thiên Lương",
            "Tử Vi",
            "Thái Âm"
        ],
        "2": [
            "Thiên Đồng",
            "Thiên Cơ",
            "Văn Xương",
            "Liêm Trinh"
        ],
        "3": [
            "Thái Âm",
            "Thiên Đồng",
            "Thiên Cơ",
            "Cự Môn"
        ],
        "4": [
            "Tham Lang",
            "Thái Âm",
            "Hữu Bật",
            "Thiên Cơ"
        ],
        "5": [
            "Vũ Khúc",
            "Tham Lang",
            "Thiên Lương",
            "Văn Khúc"
        ],
        "6": [
            "Thái Dương",
            "Vũ Khúc",
            "Thái Âm",
            "Thiên Đồng"
        ],
        "7": [
            "Cự Môn",
            "Thái Dương",
            "Văn Khúc",
            "Văn Xương"
        ],
        "8": [
            "Thiên Lương",
            "Tử Vi",
            "Tả Phù",
            "Vũ Khúc"
        ],
        "9": [
            "Phá Quân",
            "Cự Môn",
            "Thái Âm",
            "Tham Lang"
        ]
    },
    "starMapping": [
        {
            "sourceStarKey": "jumenMaj",
            "canonicalName": "Cự Môn",
            "starId": "cu_mon",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "lianzhenMaj",
            "canonicalName": "Liêm Trinh",
            "starId": "liem_trinh",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "pojunMaj",
            "canonicalName": "Phá Quân",
            "starId": "pha_quan",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "taiyangMaj",
            "canonicalName": "Thái Dương",
            "starId": "thai_duong",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "taiyinMaj",
            "canonicalName": "Thái Âm",
            "starId": "thai_am",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "tanlangMaj",
            "canonicalName": "Tham Lang",
            "starId": "tham_lang",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "tianjiMaj",
            "canonicalName": "Thiên Cơ",
            "starId": "thien_co",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "tianliangMaj",
            "canonicalName": "Thiên Lương",
            "starId": "thien_luong",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "tiantongMaj",
            "canonicalName": "Thiên Đồng",
            "starId": "thien_dong",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "wenchangMin",
            "canonicalName": "Văn Xương",
            "starId": "van_xuong",
            "category": "phu_tinh",
            "list": "good"
        },
        {
            "sourceStarKey": "wenquMin",
            "canonicalName": "Văn Khúc",
            "starId": "van_khuc",
            "category": "phu_tinh",
            "list": "good"
        },
        {
            "sourceStarKey": "wuquMaj",
            "canonicalName": "Vũ Khúc",
            "starId": "vu_khuc",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "youbiMin",
            "canonicalName": "Hữu Bật",
            "starId": "huu_bat",
            "category": "phu_tinh",
            "list": "good"
        },
        {
            "sourceStarKey": "ziweiMaj",
            "canonicalName": "Tử Vi",
            "starId": "tu_vi",
            "category": "chinh_tinh",
            "list": "major"
        },
        {
            "sourceStarKey": "zuofuMin",
            "canonicalName": "Tả Phù",
            "starId": "ta_phu",
            "category": "phu_tinh",
            "list": "good"
        }
    ],
    "selectedStemSource": "T030_accepted_selected_decadal_heavenlyStem_not_birth_or_view_year",
    "tableSelection": "pinned_builtin_default_only_no_custom_override",
    "sourceMembership": "natal_major_and_minor_canonical_stars_at_physical_palace",
    "productGuard": "each_selected_source_star_exactly_one_known_consistent_id_name_category_list_palace_link_else_close_entire_new_profile",
    "retainAllFour": true,
    "sharedPalaceAllowed": true,
    "rotatedDecadalFunctions": false,
    "insertNatalStars": false,
    "outputContract": {
        "newProfileOnly": true,
        "mutagenScope": "natal_physical_palaces",
        "mutagenPlacement": "supported only all four associations coherent and evidence accepted; not_applied otherwise",
        "mutagens": "Exactly4 ordered records on supported, [] closed",
        "recordKeys": [
            "mutagenId",
            "mutagenLabel",
            "sourceStarId",
            "sourceStarName",
            "palaceId",
            "functionId",
            "functionLabel"
        ],
        "mutagenIds": [
            "hoa_loc",
            "hoa_quyen",
            "hoa_khoa",
            "hoa_ky"
        ],
        "mutagenLabels": [
            "Hóa Lộc",
            "Hóa Quyền",
            "Hóa Khoa",
            "Hóa Kỵ"
        ],
        "calendarCompatibility": "server_natal_menh_cuc_stem_branch_sex_age_and_default_mutagen_projection_not_full_iztro_astrolabe",
        "integrityFailure": "Fail closed all associations, selected stem and branch; no partial or stale association retained",
        "legacyProfiles": "Exact unchanged shape/behavior, no new fields",
        "publicFortune": false,
        "interpretation": null,
        "interpretationStatus": "blocked"
    },
    "runtimeTableContentMustEqualApproved": true,
    "legacyProfilesUnchanged": true,
    "publicFortune": false,
    "interpretationReviewed": false
});
const HASHES = freeze({
    "manifest.json": "0c395d5ff2f3ee8db2437827070910bd0d5e27bcb3d5b63106d5e00a58adf8b6",
    "decision.json": "7bd579dfaf54bd4facce27d41f737a06cdfa6ba666f743b5028a65d6b76403bd",
    "review-a.json": "033c124d546aadbe91dbe687cd05423d5652eed215dae469ebc64de488709224",
    "review-b.json": "de09ec1bc5f3972dd29a5ff9ab860f61a67b928f16cd3bdaa1992f7defc0f404",
    "execution.json": "7acd30dfb2537ee08b37b7c11ddb26595b47ae632a398b612b8f0f145bc48eee",
    "README.md": "76d70dda57c7911d79399cc32d77a7dc83f29e2f42d85215b276674f36cddc97",
    "build-source-proof.py": "9f6ba8fb80afa399b26bff82fe08d3470e700f5e49422d007a63a60f9797c47c",
    "candidate-algorithm.json": "1dfe3e4440a65d37380572a8a3bc13f36cbefad91b41e49550876e91a222f7ba",
    "canonical-mapping.json": "42402be14db680607d39c739c335164ef9da0bc171165b9862cb08f882188103",
    "fixtures.json": "1b09a7d56fd92aff8483885d9f912e2ca82108c5195d7fba22144a6c072eb00f",
    "independent-fixtures.md": "64212c1da6a753ed1dae535ce37777a2413537baa8af8322fb4edac1b244e993",
    "independent-replay.mjs": "65312959f9f4d763c62528aa92b6bb32c714d6fb55c56a7b40c69e5cb5170a42",
    "review-bundle.json": "32fd32d795bc6b7e06d68fde0d08475fe10f7e70e13c64d7e11b3680bf0bab48",
    "review-context.txt": "e0e053ddf39a07a4a9395d8d1beaed0c37c4900e730a3e7816ffcf47d99c0035",
    "review-output-contract.json": "d78c4b04356d9c5dff04a6cd2b315681b9d5dc63e7ee228a54accd076fe18d32",
    "source-analysis.md": "e0e053ddf39a07a4a9395d8d1beaed0c37c4900e730a3e7816ffcf47d99c0035",
    "source-proof.json": "14a9f5c0c7191d85357a3fa5962774cf7dce1811fbc57a632f99d1ac8024b8ab",
    "source-provenance.json": "1f9dae377204c5af60d6490bafb53b81070c243c0432692b1095afe24182990b",
    "source-span.txt": "93fe46cdcf03529c47c7bda24b1081922d582da204cdaf449673482162e0acdf",
    "write-analysis.py": "a2ec9f9bc55b59e94d519cdad0f2162823f6e57257fa58a75f155fb74b3b1fe8",
    "raw/LICENSE": "e6c7b6e313cbda3135b41bccc66c98be132cb8319d0d465903d17e669e748b36",
    "raw/package.json": "2b7d04100c48599e4fe02f5ec1521f5ca45b41914adf5a5472e86abc6dfa1ee6",
    "raw/src/astro/FunctionalAstrolabe.ts": "584fd8d2d3ac76b3b8d7990ec6d26cac42eb5f1fcac9175326f29497d60d2d9c",
    "raw/src/astro/FunctionalHoroscope.ts": "b62ce85093f40f3ba2faead2da31b0e36b705ff37147ed3d58b104a0e5eba56a",
    "raw/src/astro/FunctionalPalace.ts": "8e3c7fb122f168a91a08ea7285dbf9500d6a4136fb4a8ed98b68e57d3811ff7b",
    "raw/src/astro/analyzer.ts": "202d19282f71e557bdbb6132c357fc56def1ca7d9bcb04d3b04e8f6c9f820acb",
    "raw/src/astro/astro.ts": "84e1fd5121bc6c5e7fb17ef3d8aadd0f8473ff8f2704c17c1af96e77388d49f8",
    "raw/src/astro/config.ts": "e74d2bf23630f8faadfae9fd2d29c592ceb7a18d7396c0aba5d74959ea5d134e",
    "raw/src/astro/context.ts": "e76bdb18f2ffa4a77d6c7364a5edb2838b5542f6b4e65fbc8be66e30dcedefdc",
    "raw/src/astro/palace.ts": "a9c6d8444d5edcd241068f5bd83fed3aa38a57b206cebb221f86b8d4057b5273",
    "raw/src/data/constants.ts": "e2411f73c7ea438b5186f2a3ef29fa54587ab78e25620b5a52b409ce9244043a",
    "raw/src/data/heavenlyStems.ts": "f50a96b4fda42f834b2ff7aea36533a38bd5bcee94b74d5ecc1deb22ee07279c",
    "raw/src/data/index.ts": "e45e0875d60c2aede27dad389f11d3cdda7e31d1694e5f53ff32cd025288f2a2",
    "raw/src/data/stars.ts": "b616ea6bf47086ef01ac897eb4f9122ec30d44716ed5debc373db361066e8c76",
    "raw/src/i18n/index.ts": "06da411d37e4e5f3dc7d922f3dbce0f9fcb2fe1125619873e6a651eabc63d558",
    "raw/src/i18n/starAliases.ts": "5db704982d754e9e9487c80dfc171b51584cb89014b68171f7c6b87171a49b14",
    "raw/src/utils/index.ts": "9f3699115c9c149dc261f9a293e6c7ad40ac4f744884dba21b367b96d9bbfe16",
    "raw/src/data/types/astro.ts": "b24c25fa535e6b89fbe9b0e93deebe3851dd943cdd3baa290747b863506e3b85",
    "raw/src/data/types/general.ts": "db3015c93d9fc16fea8de2878a4402f5303e2c46f5b87ae6fdbf43ab64289191",
    "raw/src/data/types/star.ts": "af91fd781367447d745b326badefd5556148f79b5a904ea9be506e6950d2fecd",
    "raw/src/i18n/types/HeavenlyStem.ts": "3ed84c7e10b8b98a6fe4fd82ec4d3922a10842270f7c41a20f2c399f49c2cb9b",
    "raw/src/i18n/types/Star.ts": "96e900aa0c04e620296db2ec0fee805118b2d4b0586cbde206ab186bbf08a3a7",
    "raw/src/i18n/types/mutagen.ts": "a690c9e01e6083bf5542c71e2d7d6a361851caacee957e97f7d5c1cac8949491",
    "raw/src/i18n/locales/vi-VN/heavenlyStem.ts": "4b0805baf3aa2555e4db3c804e6947f179e5905b1e73c9c261cbd35e38d6b2ea",
    "raw/src/i18n/locales/vi-VN/index.ts": "8c29e943943dae442c5bd3e37924fbf7558f6f3ee14616b0a40d092f1c5f9007",
    "raw/src/i18n/locales/vi-VN/mutagen.ts": "405a4efae2bfd2cb3cdbc73934b37625ec8f90c16c8ed28353c16fb902775643",
    "raw/src/i18n/locales/vi-VN/star.ts": "5733ac862f38dc80af54e84321af04794381c976cd2946eeea12a92fe74cfb04",
    "raw/src/i18n/locales/zh-CN/star.ts": "cb82069097bf3a0d2d358ef49bb6c2c9e9e12e36e73b334c56c88fcad9454814",
    "raw/src/i18n/locales/zh-TW/star.ts": "319a90e1752e45cf7da911d41e7ccf35b9defb8cec0e39294ef9f4a86b10f062"
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
export function verifyStoredModernMajorMutagenEvidence({ files, sources, table = tuHoaMap } = {}) {
    try {
        if (!isDeepStrictEqual(table, MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable)) return denied('modern_major_mutagen_table_invalid');
        if (!files || Object.entries(HASHES).some(([file, digest]) => typeof files[file] !== 'string'
            || sha256Text(files[file]) !== digest)) return denied('modern_major_mutagen_evidence_invalid');
        const select = (rows, key, value) => Array.isArray(rows) ? rows.filter(row => row?.[key] === value) : [];
        if (!isDeepStrictEqual(select(sources?.sources, 'sourceId', 'iztro-modern-software'), SOURCE_IDENTITY.sources)
            || !isDeepStrictEqual(select(sources?.editions, 'editionId', 'iztro-modern-2f00e2ab0c80'), SOURCE_IDENTITY.editions)) {
            return denied('modern_major_mutagen_source_invalid');
        }
        const json = ref => JSON.parse(files[ref]);
        const bundle = json('review-bundle.json'), decision = json('decision.json');
        if (!isDeepStrictEqual(bundle.algorithmSpec, MODERN_MAJOR_MUTAGEN_ALGORITHM)
            || !isDeepStrictEqual(decision.algorithmSpec, MODERN_MAJOR_MUTAGEN_ALGORITHM)
            || !validateDecisionRecord(decision).ok) return denied('modern_major_mutagen_decision_invalid');
        const replay = verifyDecisionBinding({ record: decision,
            reviews: [json('review-a.json'), json('review-b.json')], storedSpan: files['source-span.txt'], baseline: {
                sourceDigest: bundle.sourceDigest, editionId: bundle.editionId, schoolId: bundle.schoolId,
                locator: bundle.locator, requiredConditions: bundle.conditionIds, allowedConditions: bundle.conditionIds,
                requiredExceptions: bundle.exceptions, requiredAnchors: bundle.requiredAnchors
            } });
        return replay.ok && replay.compared?.decision === 'AI_ACCEPTED' && replay.compared.formulaComparison === 'MATCH'
            ? { ok: true, reason: null } : denied('modern_major_mutagen_replay_failed');
    } catch { return denied('modern_major_mutagen_evidence_invalid'); }
}
let cached;
/** The existing branch/stem approvals remain prerequisites; validate new immutable artifacts once. */
export function verifyModernMajorMutagenBinding() {
    if (!verifyModernMajorStemBinding().ok) return denied('modern_major_stem_not_approved');
    // The imported shared natal table is not frozen or mutated; detect any later override too.
    if (!isDeepStrictEqual(tuHoaMap, MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable)) return denied('modern_major_mutagen_table_invalid');
    if (!cached) {
        try {
            const files = Object.fromEntries(Object.keys(HASHES).map(ref => [ref,
                readFileSync(new URL(`../../../${BASE}${ref}`, import.meta.url), 'utf8')]));
            const sources = JSON.parse(readFileSync(new URL('../../../docs/knowledge/sources.json', import.meta.url), 'utf8'));
            cached = verifyStoredModernMajorMutagenEvidence({ files, sources });
        } catch { cached = denied('modern_major_mutagen_evidence_unavailable'); }
    }
    return { ...cached };
}
