# B3 Tử Vi — Sprint 9C: Research handoff for the final four combinations

**Research date:** 2026-10-13  
**Repo:** `hptbee/b3_tuvi`  
**PR #19 observed HEAD:** `b398187e10fc28de77e5fcb4afc827e754eb104c` (open, not merged at observation)  
**Research method:** targeted web search, inspection of readable public HTML, comparison with `backend/src/data/combinations.json` and PR #19's `sprint-9c-search-exhaustion.json`.

## Scope and status

Cursor's latest summary: 63/63 research dossiers; 24 existing Tân Biên reviews untouched; 35/39 Sprint 9C cases dual-AI reviewed; 4/39 have `REVIEW_NOT_EXECUTED`. These figures are an observed snapshot, **not automatically promoted by this handoff**.

This report offers **new candidate textual evidence**. It does not assert that these four have passed source identity, dual-model cross-review, or historical-edition checks.

## 1. Tài Ấn Giao Trì

- **B3 target:** Vũ Khúc (Tài) + Thiên Tướng (Ấn), đồng cung Dần/Thân.
- **Candidate written name:** `財印交馳` / `财印交驰`.
- **Verified readable page:** https://askziwei.com/blog/en/finance-star.html — section *Company changes the reading* contains a configuration row naming 武曲 + 天相 = 财印交驰.
- **Additional readable page:** https://www.xuanjige.app/articles/tianxiang-qianyi — describes 武曲/天相 at 寅申 with the same naming.
- **Counter-check:** https://www.chinazwds.com/Home/ArticleDetails/c6365cb199df40708220b417fd4a61ee describes an overlapping but distinct `財印坐馬格`; it mentions 天馬 and must not be silently merged.
- **Source classification:** modern secondary formula, **not** verified classical provenance.
- **Research question:** Is the Vietnamese name Tài Ấn Giao Trì a grounded translation/alias of 財印交馳? Is Dần/Thân supported by the source under the same school? Distinguish `財印交馳`, `財蔭夾印`, `財印夾祿`, and `財印坐馬`.
- **Required result:** independently extracted rule/alias mapping, short exact quote within lawful quotation limits, source revision/hash; conflict if aliases are not proven.

## 2. Khúc Ám Đồng Cung

- **B3 target:** Văn Khúc and Cự Môn, with catalog rule allowing `đồng cung` **or** `hội chiếu`.
- **Readable source:** https://hocvienlyso.org/chuong-20-van-xuong-van-khuc.html — list item 9 concerns **Văn Khúc Cự Môn đồng cung**.
- **Related passage:** https://hocvienlyso.org/luan-giai-cac-sao-phu-tinh-tu-vi-dai-toan.html — comparable star-pair statement. May be a duplicate excerpt, not a second independent original.
- **Source classification:** source assertion for a **star combination only**; not an established named cách under the precise title "Khúc Ám Đồng Cung".
- **Research question:** Can any original text or named source establish `Khúc Ám` explicitly as a name for this pairing? If only `đồng cung` is stated, `hội chiếu` remains unsupported.
- **Required result:** store `RELATED_STAR_COMBINATION` if no exact named source; do not invent `曲暗同宮` as a historical title.

## 3. Hoa Cái Cư Phu Thê

- **B3 target:** name describes Hoa Cái at Phu Thê (with possible other stars); B3 catalog mistakenly lists `Hóa Kỵ` as `required_stars`.
- **Verified readable source:** https://tracuutuvi.com/hoa-cai-cung-phu-the.html — section *Hoa Cái cung Phu Thê là gì?* directly defines Hoa Cái at the Phu Thê palace. Section 2 separately discusses conditional combinations with other stars.
- **Additional Chinese modern source:** https://goodfate.tw/star-library/%E8%8F%AF%E8%93%8B/%E5%A4%AB%E5%A6%BB%E5%AE%AE — `華蓋在夫妻宮`; no evidence by itself that this is a named ancient formation.
- **Unavailable/unstable:** https://tuvi.cohoc.net/phu-tinh-trong-cung-phu-the-nid-1428.html redirected on direct open to a 404/anti-spam URL; do not treat snippet as validated full-text access.
- **Source classification:** modern palace-placement interpretation, **not authenticated classical named rule**.
- **Critical data inconsistency:** **Hoa Cái ≠ Hóa Kỵ**. Record a P1-domain-data remediation finding, but do not modify `combinations.json`, `rulesV2.json` or runtime code within 9C.
- **Research question:** Does the source prove the placement alone or specific mandatory sát/Cô Quả conditions? Only the former is directly established by the first paragraph.

## 4. Lưỡng Trùng Thiên Mã

This item contains an unusually important **identity ambiguity**.

- **B3 target:** natal Thiên Mã combined with Lưu Thiên Mã in a time-period overlay, plus possible sát condition; rule disabled.
- **Classical-looking line in transcribed `女命骨髓賦`:** `呂后專權、兩重天祿天馬`.
  - https://blog.udn.com/article/article_print.jsp?f_ART_ID=4124683&f_CODE=1786764589785&uid=DejaVu
  - https://ichingtrilogy.com/post/tian-ma-xing/
  - https://ekachai.pixnet.net/blog/posts/11365236026
- **Meaning of this separate phrase:** the annotated sources explain **祿存 + 化祿 + 天馬**, *not* two Tian Ma stars. It must not be promoted as the B3 named source merely because the words overlap.
- **Different modern overlay concept:** https://tuvisonlong.com/sao-thien-ma-trong-tu-vi-mau-nguoi-dich-ma/ discusses natal Thiên Mã and Lưu Thiên Mã meeting during a period. https://www.ziweitai.com/topic/lucunxing discusses `疊馬` and distinguishes it from `疊祿`.
- **Research question:** Can "Lưỡng Trùng Thiên Mã" be verified as a specific named formation, or is it an ad hoc label for natal/annual `疊馬`, or a truncation/corruption of `兩重天祿天馬`?
- **Required result:** three **separate** source assertions, not one forced alias: (A) classic double-Lộc-plus-Mã line; (B) modern natal/annual overlap; (C) B3's named catalog rule. Do not bind A or B to C as `EXACT_IDENTITY` without explicit evidence.
- **Do not** add Lưu Thiên Mã calculation in Sprint 9C or enable the disabled runtime rule.

## Evidence labeling and release gates

1. `HTTP_200` is a transport fact, not verified text or formula identity.
2. A readable modern source can prove its own statement. It does not prove a historical attribution or the Vietnamese catalog title.
3. For every claim: URL, title, exact locator, retrieval date, source version/hash where possible, a short exact substring and the independently supported conditions.
4. Separate `SOURCE_ASSERTION_RECORDED`, `IDENTITY_VERIFIED`, `DUAL_AI_REVIEWED`, `FORMULA_COMPARED`, `RUNTIME_READY`, `PUBLIC_READY`.
5. If the catalog name cannot be established, keep `UNRESOLVED_IDENTITY`/`RELATED_CONCEPT_ONLY`; mark research complete with an evidence gap, not source verified.
6. Do not create synthetic review files to reach 39/39. Model A Grok 4.7 High and Model B GPT 5.6 Terra Medium must really run independently.
7. The two historically styled Chinese web passages are not checked printed editions.
8. `expertVerified=false`, `pdfTextChecked=false` absent real PDF-page checking.

## Remaining Sprint 9 concerns beyond the final four

PR #19 has 11 cross-model decision `CONFLICT` for 9C and existing 9 review conflicts + 1 unresolved in Tân Biên. It also reports `UNRESOLVED_IDENTITY` for **most** 9C decisions. Thus **finishing the last four executions will not alone mean all 63 combinations have verified identities or formulas**. Track these separately and do not close the Sprint on `dual-AI run count` alone.

## Source priority

- High-value now: readable exact structural candidates — Tài Ấn Giao Trì, Hoa Cái Cư Phu Thê.
- Medium: readable star pairing, but not proven named cách — Khúc Ám Đồng Cung.
- High-priority name audit: Lưỡng Trùng Thiên Mã; likely multiple conflated concepts, do not force a MATCH.

