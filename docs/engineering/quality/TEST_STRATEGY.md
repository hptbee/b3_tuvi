# Test strategy

Sprint 8 keeps the existing Node assertion scripts and adds Vitest only for React. Playwright covers a few browser flows. Coverage includes files that tests never import.

## What is tested

- Unit: calendar bounds, star-name helpers, chart queries, evidence v3 promotion gates, claim eligibility accept and reject, whole-chart rollup, narrator withholding, provenance transitions.
- HTTP: generate, match, analyze, ask, and meaning routes on an ephemeral port, including forged chart, forged analysis, malformed JSON, and a 256kb body limit.
- Privacy: those routes do not insert `horoscopes`. Request logs drop the query string. Error logs keep name and message only.
- UI: evidence palace selection, stale analyze response, palace buttons, JSON export shape, print button.
- Browser: chart generation, evidence text, combination heading, failed analyze, focus on print.

## What is not a proof

- A passing placement or rule test locks current repo behavior. It is not an expert-verified golden chart. `docs/engineering/TEST_FIXTURES.md` still says none exist.
- Narrator tests use a fake provider. `qualityEvaluated` stays false. They do not score a live model.
- The perf smoke only fails above 5 seconds. One local run recorded `chartLoopMs=4` and `analysisMs=13` for 20 charts plus one analysis. That is not a latency budget.

## Commands

- `cd backend && npm test`
- `cd backend && npm run test:unit`
- `cd backend && npm run test:integration`
- `cd backend && npm run test:coverage`
- `cd backend && npm run test:ci`
- `cd frontend && npm test`
- `cd frontend && npm run test:coverage`
- `cd frontend && npm run test:e2e`
