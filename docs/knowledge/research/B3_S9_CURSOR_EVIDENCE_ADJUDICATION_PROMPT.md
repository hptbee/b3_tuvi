# Cursor execution prompt — Sprint 9 evidence adjudication (not another generic review)

Continue `hptbee/b3_tuvi` Sprint 9. PR #19 baseline reviewed at `7a4504c580dbafcabdd904b3fec0d08cf5f7a02b`. Refresh the remote PR HEAD first; preserve every original Tân Biên (24) and Sprint 9C (39) review artifact. Sprint 9 is **OPEN**; do not merge/close automatically and do not start Sprint 10.

Read these attached files under `docs/knowledge/research/`:

- `B3_S9_ADJUDICATION_EVIDENCE_21.md` (21 source-and-conflict dossiers)
- `B3_S9_ADJUDICATION_EVIDENCE_21.json` (machine-readable inputs)
- `B3_S9_RUNTIME_COMPARISON.md` (observations from actual rulesV2 and stored reviews)

All supplied links are research leads, NOT preaccepted evidence. Verify the live full page/section, source work and revision, content, URL/redirects, source types and extracts from actual material before creating any accepted evidence. Chinese Wikisource is a transcription, not a photographed book. Modern commentary is not equivalent to a historical edition.

## Objective

Solve **underlying claims**, not merely make reviewer verdict strings identical. Target the **11 Sprint 9C decision conflicts, 9 Tân Biên conflicts, and Kình Dương Nhập Miếu unresolved**. Check the 39 Sprint 9C identities separately; do not automatically mark all historically verified because two models agreed on a modern web page.

## Mandatory semantic decomposition (main root cause)

Per source and combination represent independent assertions:

1. `identity`: exact historical name, author, edition, school, source revision; alias/equivalence and evidence.
2. `recognition`: mandatory basic geometric structure, branch, palace and stars.
3. `grade`: quý/chính cách and strengthening conditions (not automatically mandatory for recognition).
4. `breaking`: exceptions, damaging conditions, their actual source scope.
5. `interpretation`: historical claim, kept separate from pattern-detection rule.
6. `runtimeMapping`: exact fields and operations currently implemented by rulesV2/tuviRules.

A single overall `MATCH/PARTIAL/CONFLICT` is often under-specified if the source has two tiers. Introduce an **additive** scoped comparison/dossier in research artifacts: recognitionComparison, fullGradeComparison, identityStatus, supported vs derived conditions, and source variant. Keep the original comparator API and existing decisions intact unless the user separately approves a versioned migration. Do NOT rewrite historic decisions to make a new label pass.

## First investigate deterministic disagreements without repeating both AI calls

Read each existing `review-a.json` and `review-b.json` and the exact rulesV2 entry. If the two model outputs share identical `conditions` and differ only in `formulaComparison`, the disagreement may be rubric/scoping rather than evidence extraction. Record this directly with a source-specific proof matrix. Do not rerun models until there is genuine new evidence or a targeted unresolved semantic question. Never silently select one model.

Known concrete examples verified from PR #19:

- **Anh Tinh Nhập Miếu**: source: Phá Quân alone at Mệnh Tý/Ngọ, opposite Liêm Tướng; source has separate quý-grade restrictions. Runtime `anh_tinh_nhap_mieu` checks Phá Quân Mệnh Tý/Ngọ. Both reviews list the same structural conditions but Grok `CONFLICT`, Terra `PARTIAL`; test which scope each compared. A high-grade missing constraint should not invalidate a base-level recognition match.
- **Thiên Ất Củng Mệnh**: source 108s allows Thiên Khôi/Thiên Việt in Mệnh `三方四正`, versus runtime `menh_or_opposite` ONLY. This is narrower geometry than source and cannot be an unqualified MATCH. Independently test charts where one star is in Tài/Quan; compare school convention.
- **Văn Tinh Củng Mệnh**: source 108s basic has Xương/Khúc in Mệnh 三方四正; runtime requires **Văn Xương, Văn Khúc and Hóa Khoa samePalace**. The same-placement/Hóa Khoa conjunction is an extra requirement vs that source. Original historical transcription uses title `文星朝命` (not automatically verified alias `文星拱命`). Distinguish source identity, recognition, strengthened variant.
- **Thạch Trung Ẩn Ngọc**: Wikisource names basic 巨門 in Mệnh Tý/Ngọ, subsequent poem adds 三方科祿 as enhancement; 108s likewise basic vs quý grade. Runtime requires an additional Hóa Lộc/Hóa Quyền/Lộc Tồn at Mệnh. Both model reviews listed identical conditions but disagreed on formula label. Compare runtime to both levels separately and account for missing 'no malefics' conditions on the elite grade.
- **Hình Kỵ Giáp Ấn**: 108s describes genuine alternative schools (羊陀夾天相 vs 天相化忌+擎羊); Lu Bin Zhao comment has 擎羊 and 化忌 in adjacent houses. Runtime has `giap(anchor=Thiên Tướng, flankGroups=[Kình Dương|Thiên Hình, Hóa Kỵ])`. Evaluate **per named school variant**, never force a universal verdict. Do not confuse with Hình Tù Giáp Ấn (`刑囚夾印`).
- **Sát Phá Tham**: independent sources say 七殺 破軍 貪狼 are geometrically linked at 三合 and Mệnh sitting in that trine determines recognition. Verify whether runtime `at: tam_hop` does precisely that. Do not convert an almost structural invariant into a promise of high grade.
- **Bán Không Chiết Xỉ**: candidate phrase actually `半天折翅` and comes from 命裡逢空 discussion, NOT proof of a standalone pattern named Bán Không Chiết Xỉ. Keep NAME_MISMATCH and split proposed catalog identity change from rule work.
- **Lộ Bàng Mai Thi**: Wikisource states `七殺廉貞同位，路上埋屍`; it does not explicitly state Sửu/Mùi or Hóa Kỵ. Store inferred branches from an independent stellar-placement proof; regard extra bad stars as later commentary, not verbatim required conditions.
- **Kình Dương Nhập Miếu**: 108s separates 擎羊入廟 (Mệnh Sửu/Thìn/Mùi/Tuất) from 馬頭帶箭 and 馬頭帶劍 (Ngọ-related). This looks like a **catalog-level conflation** requiring identity split. DO NOT turn these into synonyms; resolve original Tân Biên digest only after acquiring the genuine edition or confirming the stored evidence limitation.

## Two-model adjudication

1. Build a written and machine-readable **evidence matrix** for each of the 21. For every required predicate, label `EXPLICIT_QUOTE`, `DERIVED_FROM_AN_XAO` (prove via code/test), `SECONDARY_VARIANT`, `NOT_IN_SOURCE`, or `UNRESOLVED`.
2. Review the scoped model conclusions with source text visible. For material new source assertions, independently invoke **Grok 4.7 High** and **GPT 5.6 Terra Medium** without cross-contamination, keeping actual IDs/prompts/response artifacts. If the model API cannot be invoked, record unavailable, never fake.
3. Run deterministic source replay, including page/section/edition checks and code geom validation where relevant.
4. Accept `DOCUMENTED_SOURCE_VARIANT`, `HISTORICAL_NAME_NOT_ESTABLISHED`, `IDENTITY_MISMATCH`, `SOURCE_CONTRADICTION`, or `INSUFFICIENT_EVIDENCE` as honest final research dispositions. Those states can mean *investigation complete*, NOT `SOURCE_VERIFIED` or `FORMULA_MATCH`.
5. Prefer the source's literal condition and explicit school affiliation. Never vote between models; do not force consensus via repeated review loops, relaxing string validators, or rewriting sources.
6. Do not use historical predictions of illness, death, or accident as factual medical outcomes.

## Exact 21 targets

Sprint 9C 11: Anh Tinh Nhập Miếu; Hình Kỵ Giáp Ấn; Nhật Nguyệt Tật Ách; Sát Phá Tham; Thạch Trung Ẩn Ngọc; Thiên Ất Củng Mệnh; Tử Phủ Vũ Tướng; Văn Tinh Củng Mệnh; Bán Không Chiết Xỉ; Lộ Bàng Mai Thi; Mệnh VCD Đắc Tam Không.

Tân Biên 9: Nhật Nguyệt Tịnh Minh; Cự Nhật Đồng Cung; Thất Sát Triều Đẩu; Tham Vũ Đồng Hành; Mã Lạc Không Vong; Tử Phủ Triều Viên; Nhật Nguyệt Đồng Lâm; Hình Tù Giáp Ấn; Nhật Lệ Trung Thiên.

Tân Biên unresolved 1: Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn).

For each, read the corresponding dossier in the source pack and the actual old review/digest. Preserve old history; store any second-pass output as versioned artifacts.

## Stop conditions / quality gates

- Tests: backend unit/integration, new positive/negative source-identity-and-condition fixtures; test `三方四正` vs `命遷`, same-palace vs opposite, recognition vs grade, historical alias vs modern description, separate 夾印 names, old PDF unavailable, and deterministic star-placement implications.
- No changes to `rulesV2.json`, `tuviRules.mjs`, SQLite, or public interpretation; catalog remediation PRs remain proposals until owner approval.
- Do not fix unrelated P1 E2E/CI in this scope; report GitHub check statuses honestly.
- Incremental changes only; avoid giant data churn in already-large PR #19. If needed, create a focused stacked PR based on current PR #19 head (clearly state base).
- Do not claim all 21 can be resolved if the corpus does not support that. Give evidence-based remaining blockers with precise missing source/edition/page input.

## Deliverables

- `docs/knowledge/SPRINT_9_ADJUDICATION_MATRIX.md` and corresponding JSON with individual source claims and results for all 21.
- `docs/knowledge/SOURCE_IDENTITY_AUDIT_39.md` with reproducible classification, marking the 36 non-confirmed names distinct from the 3 name mismatches; only promote identity on independent explicit evidence.
- `docs/knowledge/FORMULA_SCOPE_DIFF.md` with scoped recognition, quý/grade, breaking, and runtime discrepancies.
- Versioned review/dissent artifacts only for genuinely new evidence.
- Updated `docs/knowledge/RULE_REMEDIATION_BACKLOG.md`, without runtime changes.
- Unit/integration test results, live GitHub CI truth, PR link(s), exact residual blockers.

Sprint 9 stays OPEN until project owner accepts an evidence-based closure policy; 63/63 executed reviews are a progress metric, not verified historical knowledge.
