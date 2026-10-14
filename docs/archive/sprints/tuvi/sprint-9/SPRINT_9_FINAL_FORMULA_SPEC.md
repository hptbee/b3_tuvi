# Sprint 9 V1 formula specification

Version: `s9-v1`

This file records the engineering decisions that the runtime implements. It does not replace the Tân Biên decisions, the Sprint 9C decisions, the adjudication matrix, or the stored model reviews. Those artifacts stay as research evidence. `expertVerified` is false.

The executable table is `backend/src/data/formulaV1.mjs`. `backend/src/data/rulesV2.json` remains the researched snapshot of the previous runtime and is not the live matcher.

## States

Every catalog record has one state:

| State | Meaning |
| --- | --- |
| ACTIVE | The selected source gives a structural formation the default profile can recognize. |
| VARIANT | The formula is tied to a named source or school profile. |
| INTERNAL_ONLY | A related star pattern or aphorism. The catalog name is not a public formation claim. |
| DISABLED | The name is unsupported, contradictory, misidentified, or not implementable from the bound source. |

ACTIVE is a recognition state. It is not historical authentication and it is not a validated prediction.

## Source profile

The default Vietnamese profile reads, in order, the registered Tân Biên digital text with the verified visual-page correction and the explicit editorial emendations named below, then identified Toàn Thư formulations, then 108s / 星林學苑 articles, then other labeled modern sources. A profile selects a formula. It does not change natal star placement. Predicates from different sources are not combined into one hybrid.

An editorial correction is stored as an editorial variant. It is not stored as unaltered original text.

## Rule shape

The existing rule engine evaluates each selected variant. The V1 record adds only the relations and filters that the current clauses could not say:

- `formation` is the variant rule. A match does not require the grade rule.
- `grade` is optional. `not_certified` means the higher bar is documented and not fully encoded. `met` or `not_met` is used only when the grade rule is complete.
- `modifiers` are notes. They are not life-outcome predictions.
- `variants` are independent formulas. `options.profile` selects one. An unknown profile does not fall back to the default.
- Targets may be Mệnh, Quan Lộc, Tài Bạch, Tật Ách, or Phu Thê.
- Relations used by these formulas are same palace, opposite, tam hợp, tam phương tứ chính, aspect (tam hợp partners plus opposite), neighboring flanks, and nhị hợp. Tí/Tý are one branch. Tị/Tỵ are one branch. Tý is not Tỵ.
- `identityStatus` and `publicInterpretationAllowed` travel with every returned match, together with the catalog id, source profile, formula version, formation status, grade status, source reference, and the matched palace and star evidence.

DISABLED, INTERNAL_ONLY, and unresolved public names do not return a public interpretation when stars happen to be present.

## Editorial and split formulas

Nhật Nguyệt Tịnh Minh, default profile `tan-bien-editorial`, matches only these pairs: Mệnh or Quan at Sửu with Thái Dương at Tỵ and Thái Âm at Dậu, or Mệnh or Quan at Mùi with Thái Dương at Mão and Thái Âm at Hợi. Unconstrained Sun Tị/Ngọ with Moon Dậu/Tí is not a formula. The text-layer Tý/Hợi reading and the rendered Tỵ/Hợi reading stay evidence. They are not extra match arms.

Nhật Nguyệt Đồng Lâm keeps the opposite-palace editorial formula and the `modern-108s` same-palace formula apart.

Minh Châu Xuất Hải defaults to Nguyệt Sinh Thương Hải: Mệnh or Quan at Tý with Thái Âm seated. Profile `b3-legacy` keeps the older Mệnh vô chính diệu at Mùi, Nhật at Mão, Nguyệt at Hợi formula.

Hình Kỵ Giáp Ấn has no default. `school-kinh-da-flank` and `school-tuong-hoa-ky` are separate from Hình Tù Giáp Ấn.

Lộc Phùng Xung Phá is disabled because the star-alias map does not identify Phá. Không, Kiếp, Hóa Kỵ, Tuần, and Triệt are not substitutes.

## Ledger

The disposition of all 63 records, the programmatic counts, and the per-entry limitations are in `docs/archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_IMPLEMENTATION_REPORT.md`.
