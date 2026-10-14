# CURSOR EXECUTION PROMPT — Sprint 9C Finish All 19 + Resolve 6 Short-Quote Cases

Repository: `hptbee/b3_tuvi`
Existing PR: https://github.com/hptbee/b3_tuvi/pull/19

## Mission

**Continue Sprint 9C; do not close Sprint 9 yet.** Complete the pending research workflow for the **19/39 Sprint 9C candidates without dual-AI reviews**, resolve the **6 existing `UNRESOLVED` records caused by the fixed 40-character quotation guard**, and reconcile the total 63-combination coverage. Preserve credible gaps as gaps: never invent a formula, an alias, a source passage, a model execution, or a `MATCH` verdict.

Use the attached reviewed research seed:

- `docs/archive/prompts/B3_TUVI_S9C_VERIFIED_SOURCE_REPORT.md`
- `docs/knowledge/research/B3_TUVI_S9C_VERIFIED_SOURCES_19.json`

These are **new source candidates**, not a source-verified oracle. The public URLs were searched and representative pages read on 2026-10-13, but each must be fetched and validated again in your own run. The source pack never authorizes automatic promotion.

## Step 0 — Branch and current state

1. Fetch `origin/main` and PR #19 HEAD. PR #19 was open at `cb1dd30dd2a146aace55973924391edc408df8d1` when this package was prepared. **Do not assume that SHA is still latest.**
2. If PR #19 is open, continue on its head branch `cursor/sprint-9c-discovery-69e0` if your working environment supports it; otherwise branch from that head and create a narrowly scoped follow-up PR with an explicit dependency. Do not create duplicate parallel registries.
3. Read project policies and docs including `docs/planning/ROADMAP_SPRINT_9_14.md`, `docs/planning/AUTODEV_MASTER_PLAN_V2.md`, `docs/knowledge/research/sprint-9c-url-verification.json`, `docs/knowledge/research/sprint-9c/review-manifest.json`, `docs/knowledge/research/sprint-9c/decisions/`, `backend/src/knowledge/crossReview.js`, `decisionIntegrity.js`, `sourceBinding.js`, `sprint9cBaseline.js` and related tests.
4. Derive all counts from the live tree. Expected PR #19 starting point: 39 candidates; 20 have dual-AI records (10 accepted, 4 cross-review conflict, 6 unresolved); **19 have not been sent to both models**. Existing 24 Tân Biên decisions must remain unchanged.
5. Check availability and actual identity of Cursor's two configured models before claiming any model execution.

## Group A — Run actual dual-AI for the 8 located excerpts

Exactly these eight:

1. Anh Tinh Nhập Miếu — `https://www.108s.tw/article/info/208` — review the clearly stated Phá Quân at Tý/Ngọ formation.
2. Nhật Nguyệt Tàng Huy — `https://www.jollen.tw/97-%E6%97%A5%E6%9C%88%E8%97%8F%E8%BC%9D.html` — competing alternatives versus B3's both-luminaries-hãm formula.
3. Bán Không Chiết Xỉ — `https://www.108s.tw/article/info/267` — **IDENTITY MISMATCH**: the page says `半天折翅` and titles `命裡逢空格`. First resolve the name; if equivalence unproven, review only as a related claim, not as exact B3 formula.
4. Đế Ngộ Hung Đồ — Wikisource `紫微斗數全書/全覽`, volume I, `太微賦`; search `帝遇兇徒`.
5. Lộ Bàng Mai Thi — same, search `路上埋屍` and check the catalog's *Bàng* versus source *Thượng*; verify conditions from sentence and context.
6. Cát Xứ Tàng Hung — same, search `吉處藏凶` along with its immediately connected `祿逢沖破`.
7. Chúng Thủy Triều Đông — same, search `眾水朝東`, verify `文耗居寅卯` vs B3's Đại Hao/Tiểu Hao at Mão/Dậu.
8. Thủy Trừng Quế Ngạc — same, search `水澄桂萼`, verify `太陰居子` vs B3's Thiên Đồng + Thái Âm same at Tý.

For Wikisource, record the exact retrievable revision ID (PR report previously cited oldid 850734), section, surrounding context, stable URL, retrieval date and normalized-digest algorithm. Treat it as a **digital transcription** rather than verified printed edition. Short classical lines may be **mentions or aphorisms**, not complete executable formulas: mark `INSUFFICIENT_FORMULA_EVIDENCE` when conditions cannot be uniquely extracted.

### Mandatory review method

- **Model A: Grok 4.7 High**; **Model B: GPT 5.6 Terra Medium**.
- Each model reads the original evidence independently and produces a structured initial verdict, including identity mapping, source type, school attribution, structural conditions, strength/breaking/exception layers, and formula comparison.
- Model B must NOT read model A's verdict before submitting B's initial verdict.
- Save real model ID/effort, prompt, run/agent reference, review JSON, source digest and URL/revision.
- Compare using existing policy, not a newly invented competing validator.
- For *Bán Không Chiết Xỉ*, force independent identity resolution and block exact-identity promotion until supported.
- `AI_ACCEPTED` may legitimately mean formula `CONFLICT`; never equate the two.

## Group B — Continue source discovery for the other 11

Start with the supplied `B3_TUVI_S9C_VERIFIED_SOURCES_19.json` candidates. The old URLs returning HTTP 200 are not sufficient evidence. Re-open all new URLs and verify actual text, title, formula, identity, edition/author and restrictions.

- Tử Phủ Vũ Tướng: verify the quartet/tam phương definition and note differences in naming/placement across Vietnamese pages.
- Sát Phá Tham: verify the fixed three-star tam hợp pattern; distinguish structural invariants from a specially auspicious formation.
- Tài Ấn Giao Trì: only a semantic Vũ Khúc–Thiên Tướng/`財印` source is located; **no verified exact historical title**. Seek exact named source; do not infer by generic labels.
- Khúc Ám Đồng Cung: sources discuss Văn Khúc–Cự Môn, but not the formal B3 name; verify same-palace versus aspect and canonical Chinese name.
- Thiên Cơ Tỵ Hợi: still no exact source in this research; broaden search carefully and leave open if unsupported.
- Cự Phùng Tứ Sát: compare Hán văn `巨逢四煞格` source against modern alternative including Không/Kiếp, and against B3's current required-stars array; record conflict by source/school.
- Hoa Cái Cư Phu Thê: direct modern Hoa Cái/Phu Thê discussion found, but B3 `required_stars` confusingly requires Hóa Kỵ. Record as explicit catalog-data mismatch.
- Lưỡng Trùng Thiên Mã: exact named source not established. Do not invent Lưu Thiên Mã placement/time data; keep runtime disabled.
- Đồng Lương Tỵ Hợi: primary candidate describes Thiên Đồng Tỵ/Hợi with Thiên Lương in **opposition**, not same palace; verify against deterministic star placements.
- Nhật Nguyệt Tật Ách: a page titled `日月疾厄格` has substantive text. Tag modern secondary and avoid presenting health/survival predictions as medical fact.
- Mệnh VCD Đắc Tam Không: modern article defines 1 Không at Mệnh + 2 at tam hợp; contrast B3 `require_no_major_at_menh:false`, document distinct Đắc/Ngộ/Kiến; don't blindly map variants.

For sources that genuinely define the right combination and can be bound to checked text, carry out **real independent dual-AI review** exactly as in Group A. For related-only or mismatched sources, do NOT fabricate two reviews for an exact rule: record `SOURCE_NOT_LOCATED_FOR_EXACT_IDENTITY` / `RELATED_CONCEPT_ONLY` and a reasoned search-exhaustion log.

## Group C — Fix 6 short-quotation `UNRESOLVED` cases without weakening evidence validation

Inspect `docs/knowledge/research/sprint-9c/decisions/*.json` and `reviews/` to derive **the exact 6 slugs** that failed solely because one quotation was shorter than 40 characters. Do not assume all failures have the same root cause without checking the stored comparator output.

Design a **versioned, source-aware quotation policy**, not simply `minLength=4`:

1. Verify exact substring/source ranges against a **retrieved and bound source**. For HTML, retain final URL, relevant source revision or date, stable locator/context and digest. For classical Chinese, a short complete sentence can be valid, but title-only or keywords alone are not enough to verify full formula.
2. Store two distinct concepts: short verbatim `quote` and larger original `evidenceSpan` (surrounding real context only). Never pad a quote with generated words, arbitrary non-contiguous sentences, or unrelated footers to exceed 40 characters.
3. Compare required semantic/structural conditions, negations, weakening/breaking clauses, and exceptions using source-grounded evidence. Ensure both models' quotations are actually contained in the bound span. Require an independent source/condition baseline, not the review A output or accepted decision as the oracle.
4. For insufficient evidence, retain `UNRESOLVED` even if a smaller threshold now passes. Avoid one-word quotes being promoted.
5. Version the comparator policy and document how older decisions are replayed under their original policy. **Do not silently edit previously accepted decisions or pretend the models reran.**
6. Add negative tests: short supported Han sentence accepted with full evidence; short fabricated string rejected; title-only rejected; missing source context rejected; model missing breaking condition rejected; wrong revision rejected; previous English/Vietnamese 40-char behavior remains compatible where intended.
7. Re-run all 24 Tân Biên decisions and 20 Sprint 9C decisions (including the 6 blocked ones) through their proper policy versions. Report which outcomes changed because of deterministic replay, and why; re-review with two real models when necessary.

## Research and engineering controls

- **No unrelated P1 work.** In particular, do not fix unrelated frontend E2E/CI in this Sprint 9C batch.
- Do not modify `rulesV2.json`, `tuviRules.mjs`, default school, production SQLite, disabled rules or public interpretation.
- Do not convert modern secondary sources into authenticated historical editions.
- Do not merge results from schools into a single purported universally correct formula.
- Any proposed formula corrections go ONLY to a separate `RULE_REMEDIATION_BACKLOG` item, with specific evidence and positive/negative tests planned for a future implementation PR.
- Source availability is not identity verification; identity verification is not formula verification; dual-model consensus is not scientific or historical proof.
- Source collection must obey access rights, copyright and privacy constraints.

## Tests and documentation

- Unit and integration tests required. Full existing CI must not regress as a result of code in this task.
- Target >=95% line coverage, >=90% branch coverage **for newly changed knowledge code**, subject to honest measurement; critical accept/reject gates tested with negatives.
- Keep source manifests synchronized and avoid duplicate combination IDs.
- Update `docs/archive/sprints/tuvi/sprint-9/SPRINT_9C_SOURCE_DISCOVERY_REPORT.md`, `SOURCE_COVERAGE_REPORT.md`, `UNRESOLVED_COMBINATIONS.md`, the research JSON and rule backlog. Clearly split old Tân Biên (24), prior Sprint 9C (20), newly reviewed candidates, and unsourced/identity-mismatched records.
- Show 63/63 catalog processing but report source-located / source-bound / identity-verified / dual-AI-reviewed / accepted / MATCH / PARTIAL / formula CONFLICT / NOT_IMPLEMENTED separately.
- If still blocked after thorough research, list exact attempts and unmet evidence and keep Sprint open per owner's request to resolve all feasible paths; do not invent completion.

## PR and final report

Prefer updating PR #19 with focused commits if the PR remains open. If the branch has moved, rebase/reconcile with its actual HEAD before adding work. Do not self-merge. Remove unrelated formatting or file changes.

Final response must include:

- Starting and ending Git SHA, PR link(s), changes made.
- 8 named items and their dual-AI decisions or documented reasons review cannot safely run.
- 11 named items and their new evidence/identity statuses; exact unresolved blockers.
- 6 short-quote names, cause, policy fix, replay status, and negatives.
- New / cumulative counts out of 39 and 63 (no percentage inflation).
- Actual model execution proof and list of models unavailable if any.
- Test commands and measured coverage, including non-passing checks if any.
- Concrete remaining source-acquisition and rule-remediation actions.

**Stop condition is not "all entries have a JSON row". Sprint 9C is not finished until the 19 pending cases and 6 short-quote cases have been processed honestly, with admissible source evidence or explicit irreducible gaps, and the owner can see the precise remaining limitations.**
