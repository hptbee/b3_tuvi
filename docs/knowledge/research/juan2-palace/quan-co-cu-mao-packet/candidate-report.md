# T029 next candidate — Quan Lộc Cơ/Cự at MÃO (new source branch)

Status: READONLY research proposal, NOT source/model approval or implementation readiness. No product/checkpoint/source-decision/Git files edited. Old T023 DẬU approval is preserved and not reused to approve MÃO. This narrowly scoped new claim can reuse existing AST/binding infrastructure if actual independent fixture verification and actual dual reviews accept its exact source scope; no new layer is warranted.

## Complete pinned source and provenance

Exact SylarLong/iztro revision `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`, `docs/zh_TW/learn/ancientBook-2.html`, independently reread by git show, raw SHA256 `438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a`. A stdlib HTMLParser independently extracted complete two-paragraph 官祿巨門 entry plus reciprocal 官祿天機; exact matches recorded `/tmp/t029/source-provenance.json`. Raw/derived source and MIT notice retained; no upstream execution. Existing secondary mirror source/edition stay unauthenticated/book/expert false; no empirical or public permission.

Full 巨門 passage (both paragraphs, including final modifier):

> 巨門入廟武職權貴，文人不耐久，太陽同有進退，入廟久長，天機同在卯宮吉美，在酉宮雖美無始終，
> 陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職。

Reciprocal 官祿天機 (complete):

> 天機入廟權貴，會文曲為良巨，見羊陀火鈴方宜，天梁同文武之材，太陰同名振邊夷，陷宮退官失職，吏員立腳。

Full 官祿 section, both source star-description/brightness blocks and full branch tables retained in `/tmp/t029/quan-co-cu-mao-context.txt`; separate full section and branch-brightness-context files provided. Exact span SHA256 `ae7aec7a8cb175d88b956f6562e7ccc138b45c65268c7bd0f7a7aba5a0966443`, context SHA256 `bc5cb3737a70e083f983b4498af51281a266ae35ba2df71aa75fa46e7ad42ba4`. Primary span omits no original text; its LF convention is newly measured, not a mutation of the old Dậu span/reviews.

Source own star branch descriptions: Thiên Cơ 卯酉旺地, Cự Môn 卯酉入廟. Engine labels both M in these reachable branches. Preserve the exact source 旺 versus 廟 distinction; do not treat engine M as accepted source-equivalence, change brightness tables or add a fabricated brightness threshold. Source natal-Mệnh stem/rank notes and 官祿 paragraph-level qualifiers remain separate contexts.

## Proposed exact new scope

New unused claim proposal `interp-quanshu-quan-loc-co-cu-mao-host`. Existing source/edition/profile unchanged. AST:

`{op:'and',items:[{op:'same_palace',target:'quan_loc',stars:['Thiên Cơ','Cự Môn']},{op:'branch',target:'quan_loc',branches:['Mão']}]}`

The actual supported operator is `branch` with branches array, not palace_branch. The predicate requires BOTH stars directly in Quan Lộc AND that host's branch Mão. It deliberately excludes the Dậu case already covered by old T023. No adverse-absence, brightness-equality, born-stem, calendar-age or whole-career condition is invented.

Exact draft wording FOR REVIEW ONLY:

> Trong mục Quan Lộc của bản chép này, trường hợp Cự Môn đồng cung Thiên Cơ tại Mão được ghi “吉美”. Đây là ghi chú về đúng nhánh văn bản, không phải xếp hạng, kết luận toàn bộ công danh hay sự kiện đời đã kiểm chứng; các điều kiện gia sát trong đoạn chưa được đánh giá.

Limitations should preserve paragraph_scoped_only/textual_branch_clause_only/modifier_not_evaluated/following_adverse_clause_not_omitted/not_an_integrated_career_judgment/not_a_whole_chart_judgment/not_a_brightness_change/source_brightness_not_engine_equivalence/not_a_verified_life_event/no_public_release. Do not translate 吉美 into a grade, profession, guaranteed success, wealth or positive future event.

## Exact scope question for actual dual models

The primary source expressly distinguishes Mão `吉美` from Dậu `雖美無始終`, but the entry also begins with brightness/profession and ends with 陷宮/加羊陀火鈴空劫/退宮卸職 clauses. Actual reviewers must decide whether an **attributed literal Mão-branch annotation** is valid while those modifiers remain retained and unevaluated. If they govern closure such that literal-baseline output is misleading, reject/preserve unresolved rather than manufacture adverse-free conditions or transfer old Dậu approval. Reciprocal 官祿天機 does not name Cự Môn and its 見羊陀火鈴方宜 is itself a distinct contextual phrase; it must not be suppressed or harmonized into an all-context favorable Mão claim. Reachable fixtures cannot adjudicate textual grammar.

## Actual candidate fixture search before any approval

`node /tmp/t029/research.mjs` searched15,120 solar→lunar→calculateTuVi→normalizeChart inputs (1980–2000, every month, five days, even hours, gender1). Direct canonical-name AND host-branch predicate was independently compared to the existing AST, pair subtrace and branch subtrace; input charts were unchanged. Full input/lunar/Cục/Mệnh/host stars+brightness/pair-location/subtrace metadata in `/tmp/t029/candidate.json`.

| Category | Solar date/hour, gender1 | Quan host |
| --- | --- | --- |
| Mão positive, four named adverses absent |1980-03-01h06|Mão, Cơ+Cự|
| Mão positive, named adverse present |1980-06-15h14|Mão, Cơ+Cự+Linh Tinh|
| Dậu negative, four absent |1980-02-15h16|Dậu, Cơ+Cự; Đại Hao present|
| Dậu negative, adverse present |1980-06-08h00|Dậu, Cơ+Cự+Kình|
| Missing Thiên Cơ |1980-01-01h08|Tí, Cự Môn only among pair|
| Missing Cự Môn |1980-01-01h18|Mùi, Thiên Cơ only among pair|
| Wrong host Tài |1980-02-01h12|Quan Hợi; pair in Tài|
| Wrong host Mệnh |1980-03-01h22|Quan Mùi; pair in Mệnh|

**Material honest fixture limitation:** no single-partner Quan-Mão witness was found among1,260 actual Quan-Mão charts in the search (0). This is consistent with the existing natal placement cohost invariant at Mão. Thus the real missing-partner negatives are at other branches; their pair subtrace is false and full AST false, but dropping a partner condition could still pass these full-AND real-chart booleans because branch fails too. Do not label them proof that every operand is independently discriminated on a reachable Mão chart. Exact AST/claim/decision tamper tests can enforce both required names in the binding; synthetic malformed charts, if used for evaluator rejection, must remain classified as such and never sold as reachable source goldens. Dậu negatives genuinely discriminate branch requirement with pair present. A separate independent investigator must replay all8 before actual dual approval.

Four-adverse-absent means only no direct Kình/Đà/Hỏa/Linh; not “clean”, favorable or absence of 空/劫/Hóa Kỵ/other context. All witnesses male: this predicate suite makes no sex/calendar/fortune variant coverage claim.

## Execution fit and restriction

Source-scoped annotation is distinct from old Dậu and can add bounded approved internal coverage without new public text or formula changes. No missing explicit branch/name parameter remains for presenting the literal quote; the unresolved modifier-scope judgment is for actual independent models, not this research author. If accepted, keep scope a focused existing-binder extension plus meaningful regression tests; no source registry mutation, natal formula, UI infrastructure or release policy changes. No approval or implementation has been authored here.
