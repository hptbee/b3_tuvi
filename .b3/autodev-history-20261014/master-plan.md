# Sprint 8 — Product completion, quality engineering, release readiness

- version: 1
- source: user Sprint 8 brief, continuing docs/AUTODEV_MASTER_PLAN_V2.md
- run_base: origin/main 2ca0186ff4d42c44321a594472ec300bef829fc3

## Original requirements

Raise real test coverage and confidence, connect the existing chart and evidence UI, add print/export and browser smoke tests, tighten privacy/observability, and write release documents from executed measurements. Do not change an-sao formulas, rulesV2.json, provenance promotions, production SQLite, or public AI.

## Scope

Backend test runner and c8 coverage, frontend Vitest, unit and HTTP tests, evidence explorer, print/JSON export, Playwright smoke, request limits and request ids, CI jobs, quality docs.

## Exclusions

- Formula edits in tuviRules.mjs or rulesV2.json
- Enabling disabled combinations
- Formula or interpretation approval upgrades
- Login, history, payments, public AI narration
- Production SQLite migration
- Merge to main or production deploy
- Expert-verified golden charts

## Technical context

Tests are Node assertion scripts. Express listens inside server.js. Frontend is Vite 5 + React 19 with no unit runner. CI runs backend npm test plus frontend lint and build on Node 22.

## Architecture

Keep the assertion scripts. Add c8 around them and Vitest only for React. Extract createApp so HTTP tests do not bind port 5000. Evidence explorer reads the existing analyze DTO. Print uses the browser. No new knowledge store.

## Assumptions

- c8 child-process coverage works on Node 22 for `node test/*.mjs`.
- Vitest 2 matches Vite 5.
- Playwright Chromium can install in this environment. If it cannot, E2E stays INCOMPLETE in the report, not PASS.

## Risks

- Coverage denominator includes untested CLI scripts and will miss 90% without pretending those files are out of scope.
- Timing assertions flake. Benchmarks record durations and only fail on multi-second hangs.
- UI changes can regress the chart grid. Browser check is required for the explorer and print controls.

## Tasks

### T001 — Coverage infrastructure and baseline

- status: pending
- depends_on: []
- scope: backend test scripts and c8, frontend Vitest config, docs/quality/TEST_COVERAGE_BASELINE.md
- acceptance_criteria:
  - npm test still runs the existing backend assertions
  - npm run test:coverage writes text, html, lcov, and json-summary including source files tests do not import
  - frontend test:coverage runs and the baseline file quotes those measured percentages
- verification:
  - cd backend && npm test
  - cd backend && npm run test:coverage
  - cd frontend && npm run test:coverage

### T002 — Backend unit expansion

- status: pending
- depends_on: [T001]
- scope: backend/test unit files for hour, eligibility, evidence, time, analyze, narrator edges, lunar and rule operator gaps
- acceptance_criteria:
  - negative eligibility and trust cases fail if flags alone mark a claim eligible
  - hour 0 and 23 stay branch 1
  - no rulesV2.json or tuviRules.mjs formula edit
- verification:
  - cd backend && npm run test:unit
  - cd backend && npm test

### T003 — HTTP app factory and route tests

- status: pending
- depends_on: [T001]
- scope: createApp extraction, route integration tests, privacy assertions
- acceptance_criteria:
  - generate, match, analyze, ask, and meaning routes answer on an ephemeral port
  - client chart and client analysis are rejected
  - generate, analyze, and ask do not insert horoscopes
  - request logs omit query birth data
- verification:
  - cd backend && npm run test:integration
  - cd backend && npm test

### T004 — Evidence explorer and component tests

- status: pending
- depends_on: [T001]
- scope: StructuredAnalysis, chart empty/error states, frontend unit tests
- acceptance_criteria:
  - a palace can be selected and shows stars, relations, rule evidence, formation, breaking, and claim reasons
  - unapproved claims are not labeled as an expert reading
  - stale analyze responses do not replace a newer birth input
- verification:
  - cd frontend && npm test
  - cd frontend && npm run lint
  - browser check of /la-so

### T005 — Print and JSON export

- status: pending
- depends_on: [T004]
- scope: print stylesheet and export control on the chart page
- acceptance_criteria:
  - print/export actions exist
  - export JSON has no approved-reading prose
  - export does not write server history
- verification:
  - cd frontend && npm test
  - browser check of the export control

### T006 — Playwright smoke

- status: pending
- depends_on: [T005]
- scope: frontend e2e for chart, combinations, evidence, input change, failure, export, keyboard
- acceptance_criteria:
  - Chromium smoke covers the seven flows when the browser installs
  - a failed install is recorded as not run
- verification:
  - cd frontend && npm run test:e2e

### T007 — Limits, request ids, CI, benchmark

- status: pending
- depends_on: [T003]
- scope: JSON body limit, request id, CI workflow, non-fragile benchmark
- acceptance_criteria:
  - oversized JSON is rejected
  - health and errors can carry a request id without logging birth payloads
  - CI runs backend coverage, frontend unit coverage, lint, build, and e2e when browsers exist
  - coverage job fails if totals fall below the measured baseline floors
- verification:
  - cd backend && npm test
  - cd backend && npm run test:ci
  - workflow file names those jobs

### T008 — Quality documents from executed numbers

- status: pending
- depends_on: [T002, T003, T004, T005, T006, T007]
- scope: docs/quality final reports and Master Plan V2 sprint 8 section
- acceptance_criteria:
  - final coverage tables use the measured before and after summaries
  - release states for chart UI, expert interpretation, and public fortune/AI are separate
  - V1 master plan is untouched
- verification:
  - coverage summary files exist
  - cd backend && npm test
  - cd frontend && npm test
  - cd frontend && npm run lint
  - cd frontend && npm run build

## Completion criteria

Every task above is completed with a commit, checks recorded, and the final report distinguishes measured coverage from unmet targets.

## Plan changes
