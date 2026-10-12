# Sprint 8 final report

## Heads

- Start: `origin/main` `2ca0186ff4d42c44321a594472ec300bef829fc3` (merge of PR #11).
- Branch: `autodev/v2-sprint-8`.
- Code tip before this document: `2703b8d`.

## Commits

| Commit | Why |
|---|---|
| `076ef49` | Coverage runners and the measured baseline |
| `03bb424` | Eligibility, evidence, and calendar edge tests |
| `5e8e944` | `createApp`, forged-input rejection, meaning route test |
| `a2def8c` | Palace evidence explorer and component tests |
| `16db7eb` | Print and JSON export |
| `425a09a` | Playwright Chromium smoke |
| `2703b8d` | Coverage floor and CI jobs |

## What changed

- c8 and Vitest, with `npm test`, `test:unit`, `test:integration`, `test:coverage`, and `test:ci`.
- Evidence panel selects a palace and shows stars, relations, runtime match, formation, breaking, claim reasons, and missing sources.
- Stale analyze responses are dropped when the birth key changes.
- Palace and star controls are buttons.
- Print CSS and a JSON download with `approvedInterpretation: false` and `prose: null`.
- Body limit 256kb, JSON parse errors, echoed request id.
- CI workflow runs backend coverage, frontend unit coverage, lint, build, and Playwright.

## Checks in this session

| Check | Result |
|---|---|
| `cd backend && npm run test:coverage` | exit 0, lines 79.14, branches 84.86 |
| `node scripts/checkCoverageFloor.mjs` | exit 0 |
| `cd frontend && npm test` | 9 passed |
| `cd frontend && npm run test:coverage` | exit 0, lines 38.73, branches 59.04 |
| `cd frontend && npm run lint` | exit 0 |
| `cd frontend && npm run build` | exit 0, JS 256.98 kB, gzip 81.66 kB |
| `npx playwright test` | 4 passed, 0 skipped, 4112ms |
| `perfSmoke` | `chartLoopMs=4`, `analysisMs=13`, under the 5000ms hang cap |
| GitHub Actions | not run |

## Coverage

See `TEST_COVERAGE_FINAL.md`. The 90% backend and 85% frontend line targets were not reached. The baseline floor was not lowered.

## Domain safety

`tuviRules.mjs` and `rulesV2.json` were not edited. No claim was marked approved. No expert golden chart was added. Production SQLite was not migrated.

## Release

- `STRUCTURED_CHART_AND_EVIDENCE_UI`: conditional on local checks.
- `EXPERT_INTERPRETATION`: no.
- `PUBLIC_FORTUNE_AND_AI`: no.

## Next

- Run the updated GitHub Actions workflow on this branch.
- Component tests for `App.jsx` and `CachCucPanel.jsx` if the frontend line number should move.
- Leave formula and interpretation approval for a human decision per claim.
