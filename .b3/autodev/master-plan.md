# Autonomous Product Completion

- version: 5
- source: User mission 2026-10-14; fresh run from upstream main 45615a48d0c75b90138cfc618320ffae6e9c34e0

## Original requirements
Audit latest main; prioritize actual product gaps; update existing master plan; execute research/design/implementation/tests/independent review/fixes/PR; continue to actionable completion or resource exhaustion. Cover Tử Vi, numerology, UX/accessibility, API/security/privacy, deployment. Preserve dual-review provenance and owner release gates.

## Scope
Stateless product within CONTRIBUTING scope. Highest priority: verified defects, then complete useful existing interactions. Current audited queue below; extend after evidence-based reassessment.

## Exclusions
Accounts/history/payments; auto-merge/deploy; invented formulas; unverified public fortune/prose/narration; production SQLite migration without approval.

## Technical context
React 19/Vite, Express 5/Node 22/SQLite, Node assertion tests, Vitest, Playwright, Actions. Main and origin/main equal 45615a4, clean at start. Frontend baseline 57 tests PASS. Backend baseline fails storedDecision hash replay because core.autocrlf=true converts LF source evidence to CRLF.

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
- status: in_progress
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




