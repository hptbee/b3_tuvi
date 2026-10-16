# Autonomous Product Completion

- version: 18
- source: User mission 2026-10-14; fresh run from upstream main 45615a48d0c75b90138cfc618320ffae6e9c34e0

## Original requirements
Audit latest main; prioritize actual product gaps; update existing master plan; execute research/design/implementation/tests/independent review/fixes/PR; continue to actionable completion or resource exhaustion. Cover Tử Vi, numerology, UX/accessibility, API/security/privacy, deployment. Preserve dual-review provenance and owner release gates.

## Scope
Stateless product within CONTRIBUTING scope. Highest priority: verified defects, then complete useful existing interactions. Current audited queue below; extend after evidence-based reassessment.

## Exclusions
Accounts/history/payments; auto-merge/deploy; invented formulas; unverified public fortune/prose/narration; production SQLite migration without approval.

## Technical context
React 19/Vite, Express 5/Node 22/SQLite, Node assertion tests, Vitest, Playwright, Actions. Historical 2026-10-14 baseline: main/origin main45615a4; current resume fetched main f0dec74973ef9d07129e19330356f8e6d2040227, preserving the prior receipts. Frontend baseline 57 tests PASS. Backend baseline fails storedDecision hash replay because core.autocrlf=true converts LF source evidence to CRLF.

## Architecture
Reuse existing app/routes, numerology request state/export, and page components. Preserve byte-exact evidence and published profiles. No new service or persistence.

## Assumptions
PR creation/push explicitly authorized by mission. Current mission permits passing blocked research tasks to independent useful work (overrides workflow stop on one research blocker). Existing checkpoint is historical Sprint 8 on another branch; archived under .b3/autodev-history-20261014, not resumed.

## Risks
Digest or source-status weakening forbidden. Snapshot pairing must survive stale requests. API errors must omit private payloads/stacks. Published formula/version must remain fixed. Live release needs unavailable deployment access and owner approval.

## Tasks

### T001 — Preserve reviewed evidence bytes across platforms
- status: completed
- depends_on: []
- scope: .gitattributes, .github/workflows/ci.yml, scripts/check-doc-links.mjs, scripts/check-doc-links.test.mjs, docs/planning/AUTODEV_MASTER_PLAN_V2.md
- acceptance_criteria:
  - Reviewed source text checks out with LF despite core.autocrlf=true
  - Original stored decision digests replay without changing hashes or domain logic
  - Backend CI covers Windows and Linux
  - Existing master plan records audited priorities, dependencies and release gates
- verification:
  - git check-attr; storedDecision.test.mjs; full backend test:ci; docs links

### T002 — Keep visible numerology report and export paired with committed input
- status: completed
- depends_on: []
- scope: frontend/src/numerology/NumerologyPage.jsx, frontend/src/numerology/NumerologyPage.test.jsx
- acceptance_criteria:
  - During held, failed, retried and stale cycle requests the visible/exported report uses the input that produced it
- verification:
  - Vitest held/failing cycle requests and export; lint/build; numerology E2E

### T003 — Return private stable API errors and prevent personal response caching
- status: completed
- depends_on: []
- scope: backend/src/app.js, backend/src/http, backend/test/httpApi.test.mjs, backend/test/apiErrors.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md
- acceptance_criteria:
  - Malformed URI, unsupported charset, unknown API route and unexpected error return bounded JSON without stack or request content
  - Chart and interpretation success/error/preflight responses use no-store
  - Existing numerology error envelope remains compatible
- verification:
  - HTTP integration negatives; backend test:ci

### T004 — Complete numerology import and exported report coverage
- status: completed
- depends_on: [T002]
- scope: frontend/src/numerology/NumerologyPage.jsx, frontend/src/numerology/numerologyExport.js, frontend/src/numerology tests and frontend/e2e/numerology.spec.js
- acceptance_criteria:
  - A fresh page imports and recalculates a prior report without requiring a manual calculation
  - Export includes supported indicators and chart structures with current name opt-in privacy
  - Import still treats client results as untrusted
- verification:
  - Export/import unit tests; fresh-page real-backend E2E; frontend CI/lint/build

### T005 — Explain unavailable numerology values consistently
- status: completed
- depends_on: [T002]
- scope: frontend/src/numerology/NumerologyPage.jsx, frontend/src/numerology/NumerologyAdvanced.jsx, frontend/src/numerology/metricAvailability.js, frontend/src/numerology/NumerologyPage.test.jsx, frontend/e2e/numerology.spec.js
- acceptance_criteria:
  - Accepted names with no vowels/consonants display an explicit unavailable state in overview and relationship summaries
  - No blank or literal null metric is presented as a calculated number
- verification:
  - LY and vowel-only API fixture UI tests; lint/build

### T006 — Replace content placeholders with useful source-aware product guidance
- status: completed
- depends_on: []
- scope: frontend/src/pages/Pages.jsx, frontend/src/pages/Pages.css, frontend/src/pages/Pages.test.jsx, frontend/e2e
- acceptance_criteria:
  - Knowledge and document pages contain useful reading/navigation guidance tied to actual capabilities and source limitations
  - Interpretation page explains structured evidence and current gates with working chart/numerology entry points
  - Contact does not advertise an unconfirmed email destination
- verification:
  - Official source research; page tests; mobile/keyboard E2E; lint/build

### T007 — Reassess domain capability and operational gaps
- status: pending
- depends_on: [T001,T002,T003,T004,T005,T006,T008,T009,T010,T011,T012,T013,T014,T015]
- scope: actual calculation/time/source evidence and release readiness
- acceptance_criteria:
  - Remaining actionable gaps become independently verifiable tasks; unavailable evidence and owner/deployment gates are recorded once
- verification:
  - Source/roadmap/code comparison and current CI evidence

## Completion criteria
All independently actionable tasks completed and integrated, checks/reviews/commits/PRs recorded; remaining scope either complete or genuinely gated. Production remains false without live staging, rollback, owner sign-off and actual domain requirements.

## Plan changes
Initial queue is based on audit and reproduced defects, not old sprint numbering. T001 precedes feature work because Windows cannot currently replay source evidence. Task selection resumes after each passing gate; blocked domain research will not cause repeated NO-GO PRs.

Version 3: T003 adds required fixture-catalog registration after actual test failure; T008/T009 record independent API audit defects; T007 reassessment now follows their completion. T003 backend and T004 frontend execute in parallel as current user explicitly authorizes independent work; commits and quality gates stay per task.
Version 4: T005 scope names a shared existing availability-copy extraction and real-backend LY/AE E2E cases. T006 pages and T005 numerology can implement independently in parallel. T003/T004/T008/T009 code gates completed; current Git is591c220.
Version 5: reassessment proves additional Tử Vi UI and data-safety defects. PrioritizeT012 reject-before-write, parallelT010/T011 complete detail/disclosure recovery, thenT013 evidence retry,T014 browser coverage,T015 readiness/smoke. T007 tracked master-plan reconciliation follows these meaningful code capabilities. Original domain/release gates remain unavailable and must not stop independent ready work.

### T008 — Bound limiter storage without resetting active budgets
- status: completed
- depends_on: []
- scope: backend/src/http/numerologyRateLimit.js, backend/test/numerologyRateLimit.test.mjs
- acceptance_criteria:
  - Live key storage stays bounded and overflow fails closed
  - Denied traffic cannot evict active keys or amplify cleanup to full scans on every request
  - Expired windows release capacity while proxy/token behavior remains compatible
- verification:
  - Limiter sustained-key/expiry/denial tests and full backend CI

### T009 — Validate meaning lookup parameters before database reads
- status: completed
- depends_on: []
- scope: backend/src/routes/meaningRoutes.js, backend/test/httpApi.test.mjs
- acceptance_criteria:
  - Repeated non-scalar palace queries return a stable 400
  - Express-decoded literal percent and Vietnamese route names do not decode twice
  - Existing palace aliases and meaning responses remain compatible
- verification:
  - Temporary SQLite HTTP fixtures, backend CI

### T010 — Reliable accessible star and palace detail dialogs
- status: in_progress
- depends_on: []
- scope: frontend/src/components/TuViChart.jsx, frontend/src/components/TuViChart.test.jsx, frontend/src/App.css, frontend/e2e/meaning-dialog.spec.js
- acceptance_criteria:
  - Loading, bounded errors and retry are visible without losing the chart
  - HTTP errors and malformed star/palace responses cannot crash rendering
  - Latest selection wins and closed/unmounted/replaced chart dialogs cannot reopen from stale requests
  - Keyboard opens/closes with Escape, focus stays within dialog and restores to trigger
- verification:
  - Detail response/race/retry component tests; real browser dialog keyboard/mobile tests; frontendCI/lint/build

### T011 — Accessible recoverable cách cục details
- status: in_progress
- depends_on: []
- scope: frontend/src/components/CachCucPanel.jsx, frontend/src/components/CachCucPanel.css, frontend/src/components/CachCucPanel.test.jsx, frontend/e2e/combination-details.spec.js
- acceptance_criteria:
  - Native disclosure buttons expose expansion/state and work with Enter/Space
  - Expansion belongs to current chart and cannot survive changed chart input incorrectly
  - Transient match failures retry current committed chart without regenerating birth chart
  - Malformed match responses do not crash grouping and existing disclaimers stay visible
- verification:
  - Disclosure/current-chart/retry/schema unit tests; keyboard/mobileE2E; frontendCI/lint/build

### T012 — Reject incompatible SQLite before writes
- status: completed
- depends_on: []
- scope: backend/src/db/sqlite.js, backend/test/sqlite.test.mjs
- acceptance_criteria:
  - Unsupported existing schema metadata rejects before schema/journal mutation
  - Rejected database retains its exact existing tables/data/version and no live failed connection remains
  - Existing fresh/legacy supported initialization and repeated initialization remain compatible
- verification:
  - Temporary incompatible SQLite schema/data/journal snapshots; existingSQLite andfullbackendCI

### T013 — Retry structured evidence without regenerating chart
- status: pending
- depends_on: []
- scope: frontend/src/components/StructuredAnalysis.jsx, frontend/src/components/StructuredAnalysis.test.jsx, frontend/e2e/chart-errors.spec.js
- acceptance_criteria:
  - Transient analysis failures retry the committed birth input and selected year branch in place
  - Older responses remain suppressed; chart and other sections stay usable
  - Malformed analysis success cannot crash UI
- verification:
  - Retry/view-year/stale/schema unit and browser tests; frontendCI/lint/build

### T014 — Verify supported flows across browser engines
- status: pending
- depends_on: [T010,T011,T013]
- scope: frontend/playwright.config.js, .github/workflows/ci.yml, relevant failing frontendE2E tests only if proved
- acceptance_criteria:
  - Chromium, Firefox and WebKit execute report/chart/navigation/import/dialog/disclosure tests
  - Proven browser-specific defects get minimal fixes and current review
  - Browser evidence does not imply release owner approval
- verification:
  - FullthreebrowserE2E; hostedCI whereavailable

### T015 — Operational readiness and executable staging smoke
- status: pending
- depends_on: [T012]
- scope: backend/src/app.js, backend/src/http/readiness.js, backend/src/db/sqlite.js, backend/test/readiness.test.mjs, backend/scripts/stagingSmoke.mjs, backend/test/stagingSmoke.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md, docs/numerology/RELEASE_READINESS.md
- acceptance_criteria:
  - Read-only ready endpoint checks existing connection/schema/minimum lookup records and loaded numerology capability without initializing or writing a database
  - Unready state returns fixed503/no-store without private details; health remainsliveness
  - Explicit-origin smoke command has bounded timeouts, synthetic inputs, schema/gate/cache checks and nonzero exit on failure
  - Local smoke runs have actual evidence; live staging/proxy/rollback/approval remain separately unverified
- verification:
  - TempDBready states and failure tests; realHTTPsmoke positive/negative/timeout; backendCI; localproductionbuild/previewAPIprobe





## Tu Vi resume — 2026-10-15 (version 6)
User narrowed the active mission to Tử Vi domain completion. Preserve all prior task IDs, scope and completion evidence; T010–T015 remain historical/out-of-active-queue pending separate reconciliation, not silently completed. Active domain tasks below take priority by explicit user instruction. Main reconciled at f0dec74973ef9d07129e19330356f8e6d2040227; PR49 research-only head 7d151bfa78f3151c3e1bcc5a0f1bead7fbb66582 is unmerged and supplies locators, not approvals. Backend full CI passes at baseline (86.77 lines / 87.50 branches).

### T016 — Complete source-supported annual star palace placement
- status: completed
- depends_on: []
- scope: backend/src/time/thienDuc.js, backend/src/time/timeEngine.js, backend/test/thienDuc.test.mjs, backend/src/engine/normalizeChart.js
- acceptance_criteria:
  - Existing accepted Thiên Đức/Nguyệt Đức branches resolve to the unique canonical natal palace without modifying natal stars or formulas
  - Invalid or ambiguous chart metadata never produces a palace placement
  - Existing branch/status/profile contracts remain compatible; public fortune and prose remain withheld
- verification:
  - All twelve view branches on reachable calculated charts, contrasting natal palace layouts, malformed chart negatives, API and non-mutation checks; backend full CI; isolated full-diff review

### T017 — Show source-scoped annual placements in chart evidence
- status: completed
- depends_on: [T016]
- scope: frontend/src/components/StructuredAnalysis.jsx, frontend/src/components/StructuredAnalysis.test.jsx, frontend/e2e
- acceptance_criteria:
  - Selecting a view-year branch displays each supported annual star branch and mapped natal palace in a separate readable section
  - Clear traditional source attribution and withheld interpretation remain visible; missing selection has a specific prompt, not an inaccurate unapproved-formula message
  - Stale responses, invalid mapping data and retries never display stale or unsafe placements
- verification:
  - Frontend unit/CI, lint/build, real backend Chromium E2E, isolated review

### T018 — Approved source-scoped Tài Bạch and Phúc Đức interpretations
- status: completed
- depends_on: []
- scope: docs/knowledge/research/juan2-palace/, docs/knowledge/reviews/juan2-palace/, docs/knowledge/interpretation-decisions/juan2-*.json (new only), docs/knowledge/interpretation-claims.json, docs/knowledge/sources.json, backend/src/knowledge/sourcePalaceBinding.js, backend/src/knowledge/interpretationBinding.js, backend/src/interpretation/eligibility.js, backend/src/interpretation/synthesis.js, backend/test/sourcePalaceBinding.test.mjs, backend/test/sourcePalaceInterpretation.test.mjs, backend/test/sprint11c12Evidence.test.mjs, backend/test/sourceHygiene.test.mjs, backend/test/knowledgeCatalog.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md, .gitignore
- acceptance_criteria:
  - Actual pinned complete passages/context and independent reachable fixtures receive distinct-model source and interpretation approval before activation
  - Two narrowly accepted claims match only the reviewed direct-host predicates and emit exactly approved internal wording, with no invented catalog/formula hit
  - Changed identity, scope, source/context/tree/wording/fixture bytes, partial or duplicate model reviews and unreviewed claims fail closed
  - Existing Tu Phu, old source decisions, natal formulas/school defaults and public-release gates remain intact
- verification:
  - Source comparison replay and mutation tests; all16 independently reviewed real solar fixtures and API no-public-prose checks; backend full CI; frontend API consumer regression; independent source/runtime review and fix loop

### T019 — New-source Mệnh vô Chính diệu interpretation
- status: incomplete
- depends_on: []
- scope: Existing knowledge and interpretation files/tests
- acceptance_criteria:
  - Define exact 吉星/拱照/target semantics from independently read Juan 3 evidence; preserve old Tân Biên insufficiency decision
  - Implement only dual-AI accepted complete conditions and prove reachable matches and negatives
- verification:
  - Source-scoped review evidence and runtime chart witnesses, regression/release-gate tests

### T020 — Reconcile complete fortune source profiles
- status: incomplete
- depends_on: []
- scope: Existing fortune source decisions, timeEngine and tests if complete semantics become accepted
- acceptance_criteria:
  - Keep adjacent-palace Quanshu and existing Mệnh-anchor natal annotations distinct
  - Establish full Đại hạn start age/span/age convention/yin-yang basis and Tiểu hạn start-age/step before any deterministic new placement
  - No natal formula/default profile changes or public predictions
- verification:
  - Independent source retrieval, actual dual-AI reviews, source-scoped reachable chart/age-boundary goldens if implemented

Version 6 prioritization: T018–T020 investigation runs in parallel; source-inaccessible candidates are recorded once and do not block independent T016/T017. Next capability selected from actual evidence, never source-intake alone. Existing .b3 checkpoint is tracked upstream despite AGENTS ignore policy; explicit user request to reconcile the committed checkpoint authorizes preserving and updating these two tracked files, excluding local runtime/history artifacts.

### T021 — Bind internal interpretation to actual approved evidence
- status: completed
- depends_on: []
- scope: backend/src/knowledge/interpretationBinding.js, backend/src/interpretation/eligibility.js, backend/src/interpretation/synthesis.js, backend/src/interpretation/pipeline.js (remove reproduced synthetic runtime-hit bypass), backend/test/interpretationBinding.test.mjs, backend/test/interpretationPipeline.test.mjs, backend/test/qualityEdges.test.mjs, backend/test/sprint11bInterpretation.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md
- acceptance_criteria:
  - Actual stored interpretation decision, two distinct-model review documents, exact shared source quotation and underlying formula binding are checked before approved internal wording is emitted
  - Modified identity, wording, school/profile/conditions/limits or missing/malformed evidence fail closed; flags alone never create internal prose
  - Existing reachable approved Tu Phu/Giáp positive remains internal-only; public prose and all old source decisions/formulas remain unchanged
- verification:
  - Real positive/negative chart integration, mutated binding evidence and duplicate-ID/clone regressions, direct synthesis tests, backend full CI and independent whole-scope review

Version7 adds T021 from reproduced internal provenance defect (arbitrary clone flags could emit unchecked internal prose). It executes independently of UI T017, in separate files, under explicit parallel-work mission; no new source approvals/framework. T018/T019/T020 require unavailable exact evidence and cannot be promoted by code tests.

Version8 technical scope refinement from actual CI/review: classify the new .mjs once in TEST_FIXTURES and remove inherited extraFormulaHits pipeline bypass proved on a reachable negative chart. No source/fomula/public-release scope changes; T021 acceptance remains the same.

## Current completion and resumable queue (2026-10-15)
T016/T017/T021 implemented and independently reviewed. Coverage: one existing approved internal interpretation remains one; two previously approved annual branch formulas now map to natal palaces across all twelve view-year branches (48 placements checked on two reachable natal layouts). No new Juan2/3 claim, decade/minor-period formula, grade, breaking condition or release is approved by this run.

T018/T019/T020 remain incomplete because exact source passages/complete profile parameters are unavailable, not because a software test disproves a traditional text. New dual-AI reviews are REVIEW_NOT_EXECUTED for unavailable new passages; no verdict records invented. Ordered next executable queue after access changes: (1) retrieve pinned Juan2 oldid1963110 and review full I02/I03/I04 clauses/modifiers; (2) retrieve Juan3 oldid2268626 and disambiguate I01吉星/拱照; (3) reconcile whole DaiHan/TieuHan school, age and boundary semantics with a matching witness. For each: genuinely distinct actual models → fail-closed comparison → exact conditions → reachable positive/negative chart → internal-only implementation → independent review/fixes/PR. If one remains insufficient, move to the next supported pilot without a research-only PR.

Branch stack (none merged/deployed): codex/tuvi-annual-palace-placement → codex/tuvi-annual-placement-ui → codex/tuvi-interpretation-evidence-binding. Git pushes work; GitHub API PR creation is Forbidden. Existing PR49 remains unmerged and unapproved intake. Continue from the top branch after fetch/reconciliation; do not silently replay its code from main while unmerged.

## Resume at 52319c9 — source packet now readable (version 9)
Latest user confirms existing dependency PRs #50→#51→#52; Git pull refs independently match c4281b0,8fbed3c,52319c9. Main remains f0dec74. Do not duplicate these PRs or replay T016/T017/T021. New branch extends #52; no merge/deploy.
PR49 is now298937d and contains the source-access packet with SylarLong/iztro pin2f00e2ab0c80b1632e55bc362f2ae26e121245cb. Pin fetched via Git; Juan2/3 HTML blobs extracted as inert text, script/style ignored. HTML SHA256 Juan2 438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a, Juan3 3b85b99796ee0dbf0f6285bd5c60f7b590e8d124fa52fe229413309dd495245c. This unblocks actual source context for T018/T019, not original-edition authentication or a claim of equality to fixed Wikisource revisions.
T018 current phase: independent complete-passage analysis and reachable solar fixture search BEFORE independent distinct-model review. Favor exact explicit co-location clauses or conservative sufficient modifier subsets; never force ambiguous 空/耗, 見/加 scope, source 入廟 versus legacy brightness equivalence or contradictory reciprocal paragraphs. Implement accepted claims end-to-end and preserve old decisions/release gates. If one candidate lacks semantics, record once and move to another eligible candidate, as latest mission requires.

### T022 — Resolve Quan Lộc source-profile semantics before an internal claim
- status: incomplete
- depends_on: [T018]
- scope: Existing source research and later interpretation files/tests only after complete evidence
- acceptance_criteria:
  - Resolve exact 空/耗 identities and 見/無 relation scope in full Thiên Phủ/Quan Lộc passage
  - Bind 入廟 to this transcription's own branch table or documented accepted profile, never silently equate legacy M marks
  - Obtain real distinct-model approval and reachable positive/negative fixtures before an eligible internal interpretation
- verification:
  - Exact new corroborating evidence, fail-closed review replay and complete chart witnesses

Version10 evidence-based refinement: original T018 three-palace pilot is split into the first independently verifiable accepted two-claim runtime integration (T018) and still-required Quan Lộc semantic resolution (T022). All original requirements retained. Source/fullsection analysts and independent 15,120-input/60-replay search preceded dual review; gpt-6.1-sol and gpt-6-astra each independently checked all16 selected fixtures and all digests, returning MATCH plus INTERPRETATION_SUPPORTED_WITH_LIMITS. Existing compareReviews replay returns AI_ACCEPTED for both exact narrowed candidates. This does not authenticate an edition, certify natal formulas, adjudicate Đồng-Cự, resolve 空/耗 or release public prose.

T018 completion gate: sourceunit+fresh runtime+performance+crosscut clear, R601closed; backend55files87.42/89.33, frontendconsumer37, Chromium25, docs181PASS. Approved internal registry1→3, two narrow newly covered palace conditions; all original/public gates preserved. Next supported candidate is distinct T023 Quan Cơ–CựDậu (actual dualmodel source approval and10fixtures complete, JIT approach inspected; activate only in next focused task).

### T023 — Quan Lộc Cơ–Cự tại Dậu source branch annotation
- status: completed
- depends_on: [T018]
- scope: docs/knowledge/research/juan2-palace/review-bundle-quan.json, docs/knowledge/research/juan2-palace/execution-quan.json, docs/knowledge/research/juan2-palace/quan-co-cu-dau-source-span.txt, docs/knowledge/research/juan2-palace/quan-co-cu-dau-review-context.txt, docs/knowledge/research/juan2-palace/README.md, docs/knowledge/reviews/juan2-palace/review-quan-a.json, docs/knowledge/reviews/juan2-palace/review-quan-b.json, docs/knowledge/interpretation-decisions/juan2-quan-co-cu-dau.json, docs/knowledge/interpretation-claims.json, backend/src/knowledge/sourcePalaceBinding.js, backend/src/interpretation/eligibility.js, backend/test/sourcePalaceQuan.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md
- acceptance_criteria:
  - Separate complete Quan passage, modifiers, reciprocal/brightness context and10independent reachable fixtures have actual distinct-model approval before activation
  - Exact reviewed Co-Cu same QuanLoc plus Dau predicate emits only approved internal textual-branch note; following modifiers remain explicitly unevaluated
  - Distinct finite evidence resources and branch label/ID consistency fail closed on changed/missing evidence or malformed chart
  - Existing Tai/Phuc/TuPhu evidence and behavior, natal formulas/source decisions and public gates remain unchanged
- verification:
  - Separate actual dual source review replay,10realfixtures and branch-negative/malformed/evidence-mutation tests; full backend CI and independent fullfeature review/fixes

### T024 — Explicit-age Tiểu hạn under a separate modern software profile
- status: completed
- depends_on: []
- scope: docs/knowledge/research/fortune/modern-minor/, .gitattributes, README.md, docs/planning/AUTODEV_MASTER_PLAN_V2.md, docs/knowledge/sources.json, docs/tuvi/MODERN_MINOR_PROFILE.md, backend/src/knowledge/modernMinorBinding.js, backend/src/time/modernMinor.js, backend/src/time/timeEngine.js, backend/src/interpretation/analyze.js, backend/test/modernMinorBinding.test.mjs, backend/test/modernMinor.test.mjs, backend/test/modernMinorApi.test.mjs, backend/test/timeEngine.test.mjs, backend/test/sourceHygiene.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md, frontend/src/components/StructuredAnalysis.jsx, frontend/src/App.css, frontend/src/components/StructuredAnalysis.test.jsx, frontend/e2e/modern-minor-placement.spec.js
- acceptance_criteria:
  - Independently approve complete age1/step/sex/triad/range semantics and declared branch-sex-explicit-age projection before implementation
  - Caller explicitly opts into the named profile and supplies integer nominal age1–120; no calendar-age/default/classical-profile inference
  - Complete API/UI maps branch to actual natal palace with source identity and no fortune prose; stale/forged/malformed responses fail closed
  - Preserve all existing formulas/source decisions, natal labels, independent annual controls and public gates
- verification:
  - Actual distinct-model source approval; independently checked120endpoint/2880all-age cases and reachable24chart/boundary/leap witnesses; backend/frontend CI and realbackend E2E; independent review/fix

Version11 priority: T018 is completed and pushed67ff179. T023 independently accepted Quan branch note is ready; original T022 ThienPhu remains unresolved. T024 is a newly evidenced explicit-age modern-software alternative, pending actual source review, not a substitute approval for classical Quanshu. No research-only PR and no unreviewed placement activation.

T023 completed gate: separately accepted exactsourcebranch note nowmapped throughactualchartAST withbranchlabel/IDcoherence. Registeredinternalclaims3→4 (TaiBach/QuanLoc/PhucDuc have newlyaccepted narrowcoverage). Backend56files87.45/89.43; source/runtime/crosscutclear,78actualHTTP→frontendvalidator checks across26fixtures/3yearstates; no public/natal/source-statuschange. T022ThienPhu andT019genericVCD remain incomplete.

Version12 detailedT024 readiness: actual source models gpt-6.1-sol/gpt-6-astra independentlyverify completealgorithm+projection, all19payloads and3additional locale/alias dependencies,120endpoints/2880all-agecomparisons/24natal/boundary/leap cases. Existingcomparator AI_ACCEPTED and all5digests/exactalgorithm+compatibilitymatch. This authorizes only explicitly selected modern projection, not calendar-age derivation/classical-defaultsource approval/predictions. Backend andUI namedapproaches inspected before implementation.

T024 completion: source/backend andUIunits clear; routedperformanceLOW coldvalidationcostaccepted; finalcumulativecrosscut285actualHTTP/validator/outagechecks clear. All59backendfiles169frontendtests29ChromiumE2E183doclinksPASS; parentqualitygatePASS. OptionalnamedmodernTiểuhạn explicitage1–120 placementcomplete; no calendarage/classicaldefault/natal/prediction/publicproseapproval. Total12/12reviewpasses exhausted; stopthisinvocation withresumablequeue, notanunreviewednextimplementation.

### T025 — Review a separate explicit-age modern Đại hạn projection
- status: completed
- depends_on: [T024]
- scope: docs/knowledge/research/fortune/modern-decadal/, docs/tuvi/MODERN_MAJOR_PROFILE.md, .gitattributes, README.md, docs/planning/AUTODEV_MASTER_PLAN_V2.md, backend/src/knowledge/modernMajorBinding.js, backend/src/time/modernMajor.js, backend/src/time/timeEngine.js, backend/src/interpretation/analyze.js, backend/test/modernMajorBinding.test.mjs, backend/test/modernMajor.test.mjs, backend/test/modernMajorApi.test.mjs, backend/test/timeEngine.test.mjs, backend/test/sourceHygiene.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md, frontend/src/components/StructuredAnalysis.jsx, frontend/src/components/StructuredAnalysis.test.jsx, frontend/src/App.css if layout requires, frontend/e2e/modern-major-placement.spec.js
- acceptance_criteria:
  - Independently validate complete Mệnh anchor, source Cục start-age/ten-year spans, yin-yang definition/sex direction, age range and wrap before any new placement
  - Explicitly model from/config/calendar dependencies and proposed product natal-Mệnh/Cục/year-branch projection; never certify whole upstream natal/calendar equivalence by assumption
  - Define pre-first-period and last-supported-age behavior without inventing childhood placement or extending source ranges
  - Independently generate real positive/negative and all period-boundary fixtures BEFORE actual distinct-model approval; no reuse of Tiểu hạn approval for Đại hạn
  - If accepted, deliver complete source-gated API/UI placement with exact current-input validation and no prose, while preserving classical Quanshu conflict/default labels
- verification:
  - Fresh source/fixture/model approval; current-time pipeline/mapper reuse, boundary/API/UI/outage tests, full CI and independent review budget in next invocation

Version13 resumable next queue after12-review cap: (1)T025 newly actionable modern Đại hạn source projection; (2)T019 source-specific 正曜/主星 taxonomy and complete 吉星/拱照; (3)T022 precise Thiên Phủ 空/耗/brightness/geometry; (4)T020 original classical profile/age conflict. T025 is pending research/readiness, not an approved formula or a request to bypass original source decisions. Existing #50–52 and all completed task IDs preserved.

T025 newinvocation reconciliation: ace285cfeaturesalreadymergedvia#50–55; latestmain4c1761e. Newreviewbudget0/12. Latestuserauthorizeseligibleauto-mergeaftergates; oldno-auto-mergeexclusionissupersededonlyforthisauthorization, no deployment/publicrelease/defaultformulaapprovalimplied. T025researchphase, readinessnotyetready, fullseparatevalidationbeforeimplementation.

Version14 T025 inspected scope: complete independent source analysis and 28 actual natal witnesses cover all five Cục, sexes, birth-year polarities, all twelve Mệnh branches and 1,759 independently replayed comparisons. Candidate explicitly accepts caller integer nominal age1–125, projects only twelve source decades Cục..Cục+119, and returns no placement before/after; no calendar age or childhood fallback. Existing modern-minor source identity is shared without changing its record, but algorithm/decision/reviews are entirely distinct. Actual dual-model approval remains pending; product implementation is not yet authorized by source readiness. One focused complete API/UI capability, not a new master plan.

### T026 — Juan3 Tài Bạch Tử Vi/Tả Phù/Hữu Bật source-scoped annotation
- status: incomplete
- depends_on: [T025]
- scope: Complete pinned Juan3 Tử Vi subsection and distinct source/interpretation packet, existing interpretation registry/binding/eligibility, narrow real-fixture regression tests only after exact independent dual approval
- acceptance_criteria:
  - Validate full verse including 或作三方為次吉 and 財帛 branch; no assumption that direct host subset is complete without independent source approval
  - Independently verify ten real positive/negative fixtures, discriminating each missing star and wrong host, before actual distinct-model source and exact-wording review
  - If accepted, activate only attributed internal 財賦之官 imagery for exact reviewed predicate, without grade, profession, wealth, whole-chart or public outcome claims
  - Preserve generic VCD taxonomy blocker, all existing claims/decisions, natal formulas and public gates
- verification:
  - Actual source/interpretation review and fail-closed digest/AST/wording/fixture binding, ten real fixtures, API public-prose regression, full relevant CI and independent engineering review

T019 follow-up inspection found a concrete textual conflict: the Juan2 list names19 star entities including祿存 but calls them18正曜. Keep generic VCD incomplete; do not drop a star to force the count. This is recorded once, not a research-only PR. T026 is a distinct newly actionable named-star/host candidate from Juan3 with independent fixture replay; it does not close T019 and remains unapproved until actual dual review.

Version15 adds only evidence-backed successor T026 after independent fullsection/fixture investigation, preserving all unfinished T019/T020/T022 requirements and existing task IDs. T025 implementation scope/acceptance unchanged.

### T027 — Juan2 Phúc Đức Cơ–Cự baseline source annotation
- status: completed
- depends_on: [T025]
- scope: backend/src/knowledge/sourcePalaceBinding.js, backend/test/sourcePalacePhucCoCu.test.mjs, backend/scripts/runTests.mjs, docs/engineering/TEST_FIXTURES.md, docs/knowledge/interpretation-claims.json, docs/knowledge/interpretation-decisions/juan2-phuc-co-cu.json, docs/knowledge/research/juan2-palace/, docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-a.json, docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-b.json, docs/knowledge/research/juan3-palace/tai-ziwei-fubi-candidate/, .gitattributes, README.md, docs/planning/AUTODEV_MASTER_PLAN_V2.md
- acceptance_criteria:
  - Independently adjudicate whether exact same-host Thiên Cơ/Cự Môn baseline wording is supported while terminal 加羊陀火鈴空劫 branches remain explicitly unevaluated
  - Preserve full reciprocal clauses, all source/context/AST/wording/fixture hashes and nineteen pre-review real charts including Mão/Dậu with/without named adverse-star witnesses
  - Activate only actual distinct-model accepted exact internal attribution; no invented absent-adverse, brightness, branch, personality, health or real-life outcome condition
  - Keep all original formulas/decisions/public-release gates and other approved claims unchanged
- verification:
  - Actual two-model source plus exact interpretation review, strict stored evidence/AST/wording replay, nineteen real positive/negative charts, API public-prose checks and independent engineering review/fix loop

Version16 completion: T025 complete source-gated API/UI passes all four independent technical reviews, full current backend/frontend CI and all55 Chromium tests. T026 remains unresolved by both actual source models (財帛-clause attachment); do not repeat review without new evidence. T027 is structurally ready for source review: independent analyst/replayer added the nineteenth Mão-with-adverse witness before packet freeze. Actual gpt-6.1-sol andgpt-6-astra attempts both failed with usage-limit errors: REVIEW_NOT_EXECUTED, no verdict/approval invented. New engineering review budget4/12 used, not exhausted; source-model resources are unavailable. Next executable action when models recover is T027 actual source/interpretation review, then fresh JIT and implementation only if accepted.

Version17 T027 actual retry after user continuation recovered model access: both genuine gpt-6.1-sol/gpt-6-astra judgments MATCH plus INTERPRETATION_SUPPORTED_WITH_LIMITS; parent verifies exact5digests/AST/wording/limitations and existing comparator AI_ACCEPTED/MATCH. Nineteen independent fixtures predate reviews. Precise baseline attribution only; source/natal/public flags unchanged. Minimal inspected scope one existing production binder, no new framework/API/UI. Preserve T026 rejected exact-scope evidence in same capability-delivery checkpoint, not another research-only PR.

### T028 — Tài Bạch Tử Vi/Phá Quân exact-source branch annotation
- status: pending
- depends_on: [T027]
- scope: Complete pinned Juan2 Tài Bạch Tử Vi/Phá Quân paragraphs and full section, independent positive/negative fixture packet and actual source/wording review; existing finite sourcePalaceBinding/registry/tests only if accepted with fresh JIT readiness
- acceptance_criteria:
  - Independently validate exact 破軍同先難後易 branch and complete reciprocal 紫微同先去後生 context, preceding/following adverse and brightness/branch modifiers without invented semantic equivalence
  - Verify reachable Sửu/Mùi with/without named-four-adverse positives, each missing partner and wrong-host negatives before actual distinct-model review
  - If accepted, enable only exact attributed internal primary-branch wording; no real financial outcome, age/calendar prediction, grade, absence-of-adverse or source/default/natal change
  - Preserve all existing claim approvals, complete source provenance and public interpretation/release gates
- verification:
  - Complete source+interpretation actual dual review, immutable five-digest and actual-document binding, independent real fixtures/tamper/public-output regressions, full relevant CI and independent review/fix cycle

Version18 adds evidence-backed successor T028 after actual complete-passage/real-chart research. T027 behavior/scope/fingerprint unchanged, code/review already underway; newtask is not source approval or a request to activate unsupported modifiers.

T027 parentqualitygatePASS: exactsourceapprovedinternalclaimintegratedwithonly24productionlines,new19fixture/mutation/publictests,63backendfiles88.39/90.09PASS. Independentfullfeaturepass5/performance6/crosscut7clear, actualHTTP→frontendvalidators19fixturesnopublicleak. Internalcoverage4→5, no other formula/source/default/public changes. Initial source-modelerror records arehistoricalattemptsnotremainingblockers; exactretryreviewsapproved and archived. T026remainsnotapproved. NextT028independentfixturepackaging/review, engineeringbudget7/12used.
