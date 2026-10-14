# Tử Vi — source-intake to unblock Sprint 11/12 (2026-10-15)

**Status: RESEARCH_INTAKE / NOT REVIEWED / NOT APPROVED.** This is a locator and implementation-dependency inventory, not a new verified edition, AI cross-review, approved life-outcome claim, or enabled fortune rule. Do not edit existing decision files, source spans, natal formulas, interpretation claims, or release gates based solely on this note.

**Baseline checked:** `main f0dec74973ef9d07129e19330356f8e6d2040227`. Existing research examined a narrow Tân Biên claim set and a limited `紫微斗數全書` 卷二 excerpt. The two full Wikisource transcriptions below have additional **distinct** passages. Do not relabel an earlier insufficient *excerpt* decision as a mistake: its outcome remains valid for the text that was reviewed.

## 1. Source identity and stable locators

| ID in this intake | Source | Stable transcription revision | Status |
| --- | --- | --- | --- |
| `quanshu-wikisource-v2-1963110` | `紫微斗數全書`, 卷二; headings `五財帛`, `九官祿`, `十一福德`, `安大限訣`, `安小限訣`, `起例圖` | https://zh.wikisource.org/w/index.php?title=紫微斗數全書/卷二&oldid=1963110 | Public transcription; **no photographed/edition-authenticated original** |
| `quanshu-wikisource-v3-2268626` | `紫微斗數全書`, 卷三; `談星要論`, `論大限十年禍福何如`, `論諸星同垣各司所宜分別富貴貧賤夭壽` | https://zh.wikisource.org/w/index.php?title=紫微斗數全書/卷三&oldid=2268626 | Public transcription; **no photographed/edition-authenticated original** |
| `hko-earthly-branch-order` | Hong Kong Observatory, sexagenary stem/branch order | https://www.weather.gov.hk/tc/gts/time/stemsandbranches.htm | Calendar convention only; does not approve Tử Vi interpretation or fortune formulas |

Links and passage locations were inspected on 2026-10-15. Attribution/edition identity, textual variants, passage integrity and downstream licensing remain separate gates. This file uses short references and independent paraphrases rather than bulk copying a transcription.

## 2. High-value NEW interpretation candidates (Sprint 11)

The previous `menh-vo-chinh-dieu` decision found only a *definition* in its **stored Tân Biên passage**. It must remain unchanged. 卷三 has a different passage containing an explicitly conditional traditional outcome, so a **new, source-scoped claim candidate** can be reviewed without retroactively approving the old one.

| Intake candidate (not a runtime ID yet) | Exact source locator | Positive source conditions to parse | Contradictions / missing runtime decisions |
| --- | --- | --- | --- |
| `I01-menhvcd-taiquan-support` | 卷三 → `談星要論`, sentence beginning `若命宮無正曜者` | Mệnh has no main star **and** benefic stars illuminate the Tài Bạch/Quan Lộc relation; text goes beyond a definition | Define `吉星`, `拱照` and target palace relation per source; test no-major but absent benefics as negative; record independent review and old-wording limitations |
| `I02-taibach-ziwei` | 卷二 → `五財帛`, paragraph beginning `紫微` | Tử Vi at Tài Bạch, with named adverse-star modifiers in the same paragraph | Do not publish a positive outcome while a modifier is present/unknown; review parsing of punctuation/clause boundaries |
| `I03-quanloc-tianfu` | 卷二 → `九官祿`, paragraph beginning `天府入廟` | Thiên Phủ at Quan Lộc, miếu status, and stated exclusions involving 羊/陀/火/鈴/空/耗 | Map `入廟` and each excluded star precisely; `耗` aliases need explicit verification; only source-scoped, historical wording |
| `I04-phucduc-tiantong` | 卷二 → `十一福德`, paragraph beginning `天同` | Thiên Đồng at Phúc Đức; source distinguishes additional combinations with 巨門/太陰/天梁 | Do not assume base claim survives all other stars; separate explicit branches, negatives and contradictions |
| `I05-than-juxtaposition` | 卷三 → `論諸星同垣各司所宜分別富貴貧賤夭壽`, subsection `身宮` | Clauses describe 身 with adjacent stars and relation to 命 | `身` is an overlay on one of the twelve palaces, not palace #13; scope may be too vague for execution until `夾` and 吉/凶 are typed |
| `I06-fortune-nonpublic-prose` | 卷三 → `論大限十年禍福何如` | Explicit *conditional* traditional ten-year outcomes; useful to define future time-claim syntax | **Not actionable for prediction** until a matching fortune palace has separately approved placement, condition DSL and release gate |

**Value:** 卷二 includes a separate star-by-star treatment under all twelve palace-function headings, not merely formation names. Expand the source search to those headings before spending more cycles on the same Tân Biên lines. A locator is not an approved interpretation, and old fatalistic/sexist/health claims should not be repackaged as verified facts about a user.

### Suggested pilot contract

For each accepted future claim: `sourceId + transcriptionRevision + section + line/phrase locator + school/profile + target palace + star set + placement/brightness conditions + adverse modifiers + independently checked positive/negative reachable charts + independent dual-AI verdicts + original Vietnamese paraphrase + releasePermission=withheld`.

Start with **I02 or I03** as narrow same-palace candidates, then **I01** once `拱照` is disambiguated. Preserve the sole existing `interp-tu-phu-dong-cung-giap-menh` claim; do not promote `AI_ACCEPTED` formula matches into public readings. Keep `approvedWording` withheld pending source-specific decisions and owner release.

## 3. New fortune dependencies to verify together (Sprint 12)

| Candidate | Source and locator | What the text now contributes | Remaining gate |
| --- | --- | --- | --- |
| `F01-decade-duration` | 卷三 → heading `論大限十年禍福何如`; 卷二 star sections including `化祿` discuss ten-year 大限 | Explicit **ten-year span** exists outside the earlier tiny 卷二 `安大限訣` excerpt | Check that span maps to the same school and starting palace before implementation |
| `F02-decade-starting-age` | 卷二 → `起例圖`, 水二/木三/金四/土五/火六局 verse headings | 2/3/4/5/6-year associations are present (e.g., water-two, wood-three, metal-four, earth-five, fire-six) | These verses sit in *star placement charts*, not a fully explicit cross-reference defining **first 大限 virtual age**; require independent source/method corroboration and age convention |
| `F03-decade-direction-and-anchor` | 卷二 → `安大限訣` | Source explicitly starts from adjacent **父母** or **兄弟** palace according to gender/yin-yang combination | Current `backend/src/engine/tuviRules.mjs` assigns `cucId + i*10` starting at **命宮**. **Different school/profile anchor**. Never silently use a source-age fragment to certify current natal placement; independently define 陽/陰 (stem vs branch) |
| `F04-minor-period` | 卷二 → `安小限訣`, `安童限訣` (different rule) | Annual start palace groups and gender direction for 小限; a **separate** 童限 section explicitly numbers early ages | Do **not** substitute 童限 age indexing for 小限. 小限 age-on-start and annual step remain pending authentic, profile-scoped linkage |
| `F05-annual-stars` | 卷二 → `安喪門白虎吊客官府四飛星訣` | Direct rule for Tang Môn/Điếu Khách and opposite placements for Bạch Hổ/Quan Phủ | `前`/`後` and `對照` geometry require a jointly accepted source-scoped branch walk; previous disagreement remains unchanged |
| `F06-year-stem-transformations` | 卷二 → `安祿權科忌四星變化訣` and `安流祿流羊流陀訣` | A **natal** stem-based transformation table, plus one annual `己丑` example | Do not turn natal table or single example into a universal annual transformation; `流四化` remains blocked until reviewed |

### Existing code reconciliation (before writing new formulas)

- `backend/src/engine/tuviRules.mjs`: `cucId` → `daiHan = cucId + i*10` on 命宮 and subsequent palaces; direction uses year yin/yang and gender. It is a **natal label** already used by the UI, not a validated source-specific time overlay.
- `backend/src/time/timeEngine.js`: all full decade/minor/year/transform fortune capabilities remain blocked, but `thien_duc` and `nguyet_duc` place branches for an explicit view-year branch. Preserve these safety boundaries.
- **Audit inconsistency first:** 卷二 `安大限訣` says begin at the adjacent palace, whereas the existing `cucId + i*10` runtime begins at 命宮. Treat as **source-profile conflict**, not an off-by-one bug automatically patched into the natal engine.
- Do not claim that seeing `10` and `2/3/4/5/6` in distinct sections has already passed the dual-AI formula gate. Gather source identity, explicit age meaning, direction and independently documented example charts before implementing the first year-to-palace function.

## 4. Work packages Codex can execute without repeated NO-GO reports

1. **Source intake/edition:** independently fetch fixed revisions, verify text and section boundaries, find a page-image/edition witness when accessible. Register the two revision IDs separately from the Tân Biên PDF. Copyright and provenance review before storing full passages. Reuse existing source registry/schema; no parallel source-truth framework.
2. **Three claim pilots:** try I02 (Tài/Tử Vi), I03 (Quan/Thiên Phủ), I04 (Phúc/Thiên Đồng), each with exact statement spans, typed runtime conditions, modifiers, positive/negative chart witnesses and two genuinely independent reviews. Implement only accepted claims, never auto-release.
3. **VCD cross-source:** I01 under an independent `quanshu` school/profile; compare and preserve earlier Tân Biên insufficiency. If `拱照` semantics are unresolved, keep it pending while I02/I03 advance.
4. **Fortune reconciliation:** F01–F04 combined dossier. Explicitly compare ancient adjacent-palace 大限 anchor against modern natal 命宮 anchor, age convention and gender/yin-yang basis. Do not mutate natal calculations merely to align snippets.
5. **Safe deterministic tests:** independently sourced golden charts per school; verify reachable positive and negative conditions, leap/month/age boundaries, and that unapproved cases emit no public prose. Time computation is separate from time interpretation.
6. **UI value in parallel:** improve source-aware explanations for chart/cung/cách cục with accepted static terminology only, no unsupported personal outcome. Keep release gates as a separate operational track.

**Stop rule:** Record source gaps once. Do not spin repeat-review NO-GO PRs for unchanged passages. Move to the next independently actionable pilot.

## 5. Source and verification caveats

- The URLs are **Wikisource transcriptions**, not authenticated editions or direct historical page-image checks. Labels such as `bookVerified` and `expertVerified` remain false.
- Strong textual conditional wording does not demonstrate that Tử Vi predictions empirically work. Product presentation must label them as traditional interpretations and avoid deterministic real-life promises, especially medicine, death, marriage, and children.
- This research changes no trusted source hashes, existing reviews, formula version, `rulesV2.json`, `timeOverlay` runtime contract or release state.
- **Proposed gate at intake:** `NEW_EVIDENCE_LOCATED; APPROVAL_PENDING`, not `MATCH`, `AI_CROSS_REVIEWED`, or `PUBLIC_READY`.
