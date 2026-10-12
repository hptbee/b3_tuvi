# Test coverage baseline

Measured on branch `autodev/v2-sprint-8` at `2ca0186ff4d42c44321a594472ec300bef829fc3` before Sprint 8 behavior tests were added. Tooling (c8, Vitest) is present. No new behavior assertions are in this measurement.

## Commands

- Backend: `cd backend && npm run test:coverage` (c8 10.x, Node v22.23.2). Exit 0.
- Frontend: `cd frontend && npm run test:coverage` (Vitest 2.1.9, v8). Exit 0. Vitest printed `No test files found, exiting with code 0`.

Reports written by those commands:

- `backend/coverage/` text, HTML, `lcov.info`, `coverage-summary.json`
- `frontend/coverage/` text, HTML, `lcov.info`, `coverage-summary.json`

Those directories are gitignored. Totals below are copied from the json summaries of this run.

## Backend

| Metric | Covered | Total | Percent |
|---|---:|---:|---:|
| Lines | 3581 | 4708 | 76.06 |
| Statements | 3581 | 4708 | 76.06 |
| Functions | 188 | 212 | 88.67 |
| Branches | 1334 | 1621 | 82.29 |

c8 reported the same count for statements and lines. That is an instrumentation identity in this run, not a second measurement.

| Area | Lines % | Branches % | Notes |
|---|---:|---:|---|
| `src/engine` | 98.10 | 85.75 | `lunar.js` branches 61.29. `starNames.js` branches 58.82. `chartQuery.js` lines 86.84 |
| `src/interpretation` | 93.92 | 81.34 | `eligibility.js` lines 84.04, branches 82.53 |
| `src/knowledge` | 93.99 | 81.25 | `provenance.js` lines 88.46 |
| `src/ai` | 98.64 | 75.58 | `narrator.js` branches 73.01 |
| `src/time` | 100 | 87.50 | one branch on missing `daiHan` |
| `src/http` | 100 | 66.66 | null request and missing error name |
| `src/db` | 86.85 | 73.97 | repository helpers used by meaning routes |
| `src/routes` | 49.32 | 45.45 | `meaningRoutes.js` is 0 |
| `server.js` | 0 | 0 | not imported; `listen` runs on import |
| `src/config/db.js` | 0 | 0 | only used by `server.js` |
| `src/scripts` | 0 | 0 | CLI seed, migrate, cleanup, catalog builder |

## Frontend

| Metric | Covered | Total | Percent |
|---|---:|---:|---:|
| Lines | 0 | 775 | 0 |
| Statements | 0 | 775 | 0 |
| Functions | 0 | 10 | 0 |
| Branches | 0 | 10 | 0 |

Every file under `frontend/src` is in the include set and was not executed. Vitest counted almost no branches because the files never ran. That branch total is not a map of JSX conditions.

## Critical paths not checked by this corpus

- `meaningRoutes.js` has no test.
- `server.js` is not loaded, so the request log middleware and health route are unmeasured here.
- Eligibility rule-body success and empty-condition rejection are outside the covered lines (`eligibility.js` 20, 34–35, 48–49, 59–68).
- `analyze.js` lines 30–34, the invalid-knowledge response, were not hit.
- Whole-chart `eligible_claims_present` rollup (`wholeChart.js` 23–24) was not hit.
- Frontend chart, combination panel, and evidence panel have no component test.

## CI

GitHub Actions was not run for this measurement. The workflow on this commit still runs `backend` `npm test` plus frontend lint and build. It does not run coverage.

## Instrumentation limits

- Including `src/scripts` and `server.js` lowers the total because those files are not imported by the assertion scripts.
- Excluding them would raise the percentage without testing them. They stay in the denominator.
- Frontend `passWithNoTests` makes a zero report instead of a missing command. It is not evidence that components work.
