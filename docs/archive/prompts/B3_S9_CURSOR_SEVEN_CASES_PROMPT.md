# Cursor execution prompt — Sprint 9D targeted 7-case evidence adjudication

Continue Sprint 9 in `hptbee/b3_tuvi`. Base from PR #19 latest HEAD, initially `00f93ccdb03c1dd9bec0f1ff162552bcccc1a51c`; refetch before editing. Keep PR #19 open, do not merge or close Sprint 9.

## Inputs

Read `docs/archive/prompts/B3_S9_TAN_BIEN7_VERIFIED_SOURCE_HANDOFF.md`, then read original persisted Tân Biên spans, both reviews, decision files, `docs/archive/sprints/tuvi/sprint-9/SPRINT_9_ADJUDICATION_MATRIX.md`, `backend/src/data/rulesV2.json`, `backend/src/data/combinations.json`, and validator implementation. Do not use this handoff as a replacement for opening/validating actual sources.

## Objective

Target seven `INSUFFICIENT_EVIDENCE` Tân Biên rows: Nhật Nguyệt Tịnh Minh, Cự Nhật Đồng Cung, Thất Sát Triều Đẩu, Tham Vũ Đồng Hành, Mã Lạc Không Vong, Tử Phủ Triều Viên, Nhật Nguyệt Đồng Lâm.

First fetch/re-check the seven identified modern HTML pages and old-version Wikisource transcription. Verify page title, target phrase, citation span, URL/final URL, retrieval time, digest, attribution, and source-school uncertainty. HTML secondary sources must NEVER silently replace Tân Biên original edition or be attributed to that school's formula.

### Analysis per case

1. Reconstruct formula in structured schema distinguishing `identity`, `recognition`, `high_grade`, `modifier`, `breaking`, `exception`, `interpretation`, `school`, `edition`.
2. Classify each condition as `REQUIRED`, `ALTERNATIVE`, `OPTIONAL`, `GRADE_ONLY`, `MITIGATION`, `UNSUPPORTED`, or `UNRESOLVED` with source phrase and provenance.
3. Compare to runtime as logical predicates: `EQUIVALENT`, `RUNTIME_NARROWER`, `RUNTIME_BROADER`, `OVERLAPPING_DIFFERENT`, `DISJOINT`, or `CANNOT_DETERMINE`. Include at least one concrete positive and negative counterexample for any non-equivalence, grounded in the actual engine grammar; do not invent valid chart states.
4. Specifically investigate: ambiguous `branch_ty` (Tý vs Tỵ); duplicate `avoid_tuan`/`avoid_tuan_triet`; non-required `branch_suu` subset of `branch_suu_mui`; optional `bright` vs star-specific brightness; `Mã` at Mệnh vs tam phương; source variant with 地空/地劫; Tân Biên text geometry for Sun/Moon; and branches in 108s #223 which internally conflicts (寅/未 vs 寅/申).
5. For print-based claims, acquire accessible legitimate copy of Tân Biên *matching declared source edition and hash*, verify PDF text on exact page using page-oriented reading; if unavailable keep `PDF_PAGE_NOT_VERIFIED` and distinguish secondary sources. Do not bypass paywalls, fabricate page verification or publish copyrighted full-book copies.
6. Preserve original two reviews and decisions. Store new evidence and adjudication as versioned child records. Any source discrepancy creates a new derived evidence version; never silently mutate stored text/digest or fix a test by rewriting historical reviews.
7. Only if distinct evidence now resolves a precise disagreement and actual model execution is supported, run Grok 4.7 High and GPT 5.6 Terra Medium *independently*, sealed before reconciliation. Ask narrowly scoped questions (e.g., is `branch_suu` mandatory vs optional?) instead of generic review loops. If models unavailable, record blocker; do not fake reviews.

### Specific provisional dispositions to investigate, NOT pre-approved final answers

- Cự Nhật: underlying Tân Biên formula in stored span omits Dần/Thân runtime restriction → likely `RUNTIME_NARROWER`.
- Thất Sát: runtime adds Tý/Ngọ and omits opposite Tử/Phủ → likely `RUNTIME_BROADER`/`OVERLAPPING_DIFFERENT` vs Tân Biên.
- Tham Vũ: both models say MATCH; extra Sửu-specific token is not additional Tân Biên requirement → candidate normalization of structural agreement.
- Mã Lạc: existing review mixes formation with mitigation, and 108s uses an alternate void definition → `SOURCE_VARIANT` plus mismatch vs Tân Biên.
- Tử Phủ: target Mệnh/Quan, bright host + opposing star, alternatives; runtime broadly recognizes two stars in tam phương → not proven `MATCH`.
- Nhật Nguyệt Tịnh Minh / Đồng Lâm: **printed source check needed**; the stored branch relationships differ from modern secondary-page descriptions. Do not choose convenient wording.

## Deliverables

- Versioned `SPRINT_9D_SEVEN_CASE_ADJUDICATION.md` and machine-readable rows, with source URLs, hashes/retrieval metadata, quote locators, claims, identity limits, differences and proof/counterexamples.
- An updated `SPRINT_9_ADJUDICATION_MATRIX.md` with new evidence and any legitimately supported dispositions (not forced AI_ACCEPTED/MATCH).
- New evidence-grounded negative, integrity and logical normalization tests; do not hardcode target counts to falsely pass.
- Comprehensive cumulative audit across 63 cases and remaining real blockers. Preserve original 24 Tân Biên + 39 Sprint 9C decisions.
- Actual local unit and integration results and GitHub checks; do not call pending checks PASS.

## Excluded

Unrelated P1 work, runtime rules edits, `rulesV2.json`, `tuviRules.mjs`, SQLite schema, public interpretation, and Sprint 10. No automatic merge. Focus on genuine resolution rather than relabeling status.
