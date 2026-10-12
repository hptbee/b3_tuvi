# Test coverage final

Measured after Sprint 8 tests, on the working tree that produced commit `2703b8d` plus this document. Commands:

- `cd backend && npm run test:coverage` (c8, Node v22.23.2). Exit 0.
- `cd frontend && npm run test:coverage` (Vitest 2.1.9). Exit 0. 4 files, 9 tests.
- `cd backend && node scripts/checkCoverageFloor.mjs`. Exit 0. Printed `coverage floor holds at lines 79.14 branches 84.86`.

Before numbers are from `docs/quality/TEST_COVERAGE_BASELINE.md`, measured at `2ca0186` with the same include sets.

## Totals

| Suite | Lines before | Lines after | Branches before | Branches after |
|---|---:|---:|---:|---:|
| Backend | 76.06 (3581/4708) | 79.14 (3737/4722) | 82.29 (1334/1621) | 84.86 (1469/1731) |
| Frontend | 0 (0/775) | 38.73 (342/883) | 0 (0/10) | 59.04 (62/105) |

Backend statements stayed equal to lines in c8 (79.14). Functions 88.67 → 90.56. Frontend statements 38.73, functions 66.66.

The 90% line and 85% branch targets were not met. CLI scripts, `server.js`, and `src/config/db.js` stay in the denominator at 0. Frontend `App.jsx`, `CachCucPanel.jsx`, `TuViChart.jsx`, `CenterInfo.jsx`, `Pages.jsx`, and `main.jsx` are still 0. They were not removed from the include set.

## Modules

| Module | Lines before | Lines after | Branches before | Branches after | Risk |
|---|---:|---:|---:|---:|---|
| Calculation engine `src/engine` | 98.10 | 98.46 | 85.75 | 87.86 | Low for repo behavior. Not an expert oracle |
| Rule engine `ruleEngine.js` | 99.34 | 99.34 | 89.76 | 90.15 | Lines 24 and 45 are still uncovered |
| Evidence v3 | 100 | 100 | 82.53 | 88.05 | Runtime match still does not set source formation by itself |
| Knowledge | 93.99 | 94.87 | 81.25 | 82.44 | Validator gaps remain on some malformed citations |
| Interpretation | 93.92 | 98.22 | 81.34 | 83.56 | `eligibility.js` lines 100, branches 85. `analyze.js` lines 30–34 still need a failing live bundle |
| Fortune `timeEngine.js` | 100 | 100 | 87.50 | 100 | No new fortune formula |
| AI | 98.64 | 100 | 75.58 | 86.73 | `narrator.js` branches 81.81. Text stays null. Not a live-model eval |
| HTTP routes | 49.32 | 86.42 | 45.45 | 56.09 | Catch paths in chart, match, analyze, and ask are still untested |
| Frontend | 0 | 38.73 | 0 | 59.04 | Chart shell and combination panel have no component test |

Changed-file coverage was not computed by a diff coverage tool. Newly added `src/app.js` is 97.61 lines / 81.25 branches. `chartExport.js` and `ChartActions.jsx` are 100/100. `eligibility.js` is 100 lines / 85 branches, under the 90 branch target for new code.

## Tests

- Backend suite: `npm run test:coverage` exit 0. No skipped tests printed.
- Frontend unit: 9 passed, 0 failed, 0 skipped.
- E2E: `npx playwright test` on this machine, Chromium, 4 passed, 0 failed, 4112ms.
- GitHub Actions was not executed in this session. The workflow file now runs backend `test:ci`, frontend lint, `test:ci`, build, and Playwright.

## Gate

`checkCoverageFloor.mjs` compares c8 totals with `docs/quality/coverage-baseline.json`. This run is above that floor. It does not enforce the 90/85 aspiration.

## Uncovered critical branches

- `server.js` and `src/config/db.js` (process exit on SQLite failure) are untested because importing `server.js` listens.
- Route `catch` blocks that return 500 are untested.
- `analyze.js` 30–34, invalid knowledge bundle on the HTTP path, is untested while the live bundle validates.
- Frontend chart page orchestration (`App.jsx`) and combination fetching (`CachCucPanel.jsx`) have no unit test. E2E covers the happy path and one failed analyze response.
