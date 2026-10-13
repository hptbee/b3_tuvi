# Cursor task: Continue Sprint 9C to an evidence-accurate resolution (final four + audit of open questions)

Repo: https://github.com/hptbee/b3_tuvi
PR to continue: https://github.com/hptbee/b3_tuvi/pull/19
Previously observed PR head: `b398187e10fc28de77e5fcb4afc827e754eb104c`

Read these two new handoff files placed under `docs/knowledge/research/`:

- `B3_S9C_SOURCE_FINDINGS.md`
- `B3_S9C_RESEARCH_4.json`

## Objective

Continue **Sprint 9**, not Sprint 10. Research the **four** remaining Sprint 9C combinations while preserving all 24 original Tân Biên decisions and the 35 existing 9C review artifacts. Do not claim closure simply by reaching 39/39 model invocations. The owner's goal is all 63 combinations handled with accurately identified evidence, not fabricated source MATCH.

## Mandatory initial audit

1. Fetch `origin/main` and PR #19 branch; inspect changes since `b398187` and do not overwrite concurrent work.
2. Recompute count from repo artifacts. Confirm which four are `REVIEW_NOT_EXECUTED`.
3. Read `docs/knowledge/research/sprint-9c-search-exhaustion.json`, `docs/knowledge/SPRINT_9C_SOURCE_DISCOVERY_REPORT.md`, `docs/knowledge/research/sprint-9c/review-manifest.json`, `docs/knowledge/combination-research.json`, `backend/src/knowledge/crossReview.js`, `backend/src/knowledge/decisionIntegrity.js`, related tests and source registries.
4. Audit `combinations.json` vs existing `rulesV2.json` for each four, separating rule presence/absence from source verification.

## Target cases and hard constraints

**A. Tài Ấn Giao Trì:** Verify the modern `財印交馳` candidate for Wu Qu + Tian Xiang at Yin/Shen. Distinguish 財蔭夾印, 財印夾祿 and 財印坐馬. Do not claim historical origin from a modern article. Classify catalog-title identity separately.

**B. Khúc Ám Đồng Cung:** There is a readable Vietnamese passage for Văn Khúc + Cự Môn đồng cung. This does NOT by itself support an exact `Khúc Ám Đồng Cung` historical title or the catalog's extra `hội chiếu` branch. Search for explicit title independently; if absent, record valid `RELATED_STAR_COMBINATION` and unverified alias. Do not invent Chinese title or assume the two sources are independent originals.

**C. Hoa Cái Cư Phu Thê:** Read the modern Vietnamese article's exact definition of Hoa Cái at Phu Thê. Record B3 data inconsistency where required_stars is Hóa Kỵ, not Hoa Cái. Extra sát/Cô Quả requirements remain unsupported until evidenced. No change to catalog/runtime during 9C.

**D. Lưỡng Trùng Thiên Mã:** Conduct an identity-forensics review. Historical `兩重天祿天馬` means 祿存 + 化祿 + 天馬 under the annotated line, **not** two Tian Ma. Modern natal Tian Ma + annual moving Tian Ma is a different `疊馬`/overlay concept. Check whether B3's exact named formation exists in an identifiable edition. Never force a name match. Do not implement a time overlay.

## Source-binding workflow

For each candidate URL in the research JSON:

- Fetch/inspect the actual webpage; verify final URL and title, text/quote present in body, and the relevant section.
- Store a short, legally permissible quotation and stable locator, retrieval timestamp and digest of the actual extracted span; prefer revision IDs where available.
- Keep `webpage_excerpt` distinct from `digital_transcription` and checked PDF edition.
- Detect redirects, anti-bot/403, wrong title, non-defining snippets and duplicate quotations.
- Distinguish authentic source terms from assistant/translator-generated names.
- Do not claim exact classical formula unless identifiable primary text actually supports the stated conditions.

## Dual-AI review

- A: Grok 4.7 High, B: GPT 5.6 Terra Medium, real independent runs with separate prompts, locked initial verdicts, model/effort, agent references.
- Each evaluates source identity, school, required structural conditions, variants, exceptions, and current B3 catalog formula independently.
- Feed neither answer to the other before initial lock. Use existing versioned comparator and deterministic decision-integrity replay.
- If exact named formula is absent, a *source assertion about related stars* may be cross-reviewed **without promoting the original catalog name to verified**. If current schema cannot represent this distinction safely, store an independent assertion in research backlog instead of inserting a misleading `AI_ACCEPTED` decision on the catalog combination.
- `expertVerified=false`; retain both source-specific and formula-specific statuses. Never convert `UNRESOLVED_IDENTITY` to `EXACT_IDENTITY` solely because two models agree with each other.
- If model execution cannot happen, retain `REVIEW_NOT_EXECUTED` and record actual reason.

## Reconciliation of all 63

After the four, recalculate catalog counts. Preserve two separate dimensions:

1. Research and review execution coverage.
2. Verified identity/source/formula/implementation coverage.

Investigate the 11 current 9C cross-model `CONFLICT` cases by categorizing whether cause is text interpretation, structural extra/missing conditions, alias ambiguity or model disagreement; do **not** retune the validator just to increase acceptances.

Audit the 9 existing Tân Biên conflicts and 1 unresolved at **metadata/backlog level only**, no wholesale source re-review unless directly necessary and within current scope. Do not silently rewrite any accepted decision.

For every remaining `UNRESOLVED_IDENTITY`, record which additional text, historical locator or school attribution would be required to resolve it. Keep modern-source formula agreement separate from historical name accuracy. If catalog names are demonstrably synthetic/mistaken or variants, propose a versioned **catalog correction backlog** with migration strategy, not a runtime mutation.

## Test and PR requirements

- Replay 24 Tân Biên plus all existing 9C decisions; preserve `source-sentence-v2` semantics and v1 regressions.
- Negative tests for wrong alias, source title mismatch, modern name being treated as classic, content change, duplicate secondary origin, and Tài Ấn vs Tài Ấm/Ân name confusion.
- Specific regression: *Hoa Cái is not Hóa Kỵ*; *two 天祿 plus 馬 != two 天馬*; *đồng cung evidence != hội chiếu rule*.
- Backend unit + integration; report actual coverage and GitHub CI status. No fake test PASS; no lowering guardrails.
- Update PR #19 only, or create a small stacked PR if required; no unrelated formatting, no automatic merging.
- Exclude unrelated P1 E2E remediation, runtime engine/Sprint 10, public interpretation, production SQLite, and edits to `rulesV2.json`/`tuviRules.mjs`.

## Final report

Report: four-case evidence disposition; links and locator/edition; whether exact named formula is proved; identity vs formula verdict; reason when unresolved; cumulative 63-count with review numbers, accepted decisions, conflicts/unresolved, source and identity coverage; test results; suggested catalog-name corrections; actual blockers; PR commit SHA/link.

**Do not close Sprint 9 until scope is explicitly satisfied or the owner authorizes an evidence-gap closure policy.** `39/39 executed` is not sufficient alone.
