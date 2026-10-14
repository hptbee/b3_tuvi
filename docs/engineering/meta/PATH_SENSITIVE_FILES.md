# Path-sensitive documentation files

These paths are imported by runtime code, tests, or embedded in JSON decision records. **Do not `git mv` without updating every consumer** and re-running backend tests.

## Runtime JSON imports (`backend/src`)

| Path | Consumers |
| --- | --- |
| `docs/knowledge/pilotClaims.json` | `interpretation/pipeline.js`, coverage/knowledge tests |
| `docs/knowledge/sources.json` | `interpretation/pipeline.js`, validate/coverage tests |
| `docs/knowledge/combination-source-matrix.json` | `interpretation/pipeline.js`, matrix tests |
| `docs/knowledge/provenance-contract.json` | `interpretation/pipeline.js`, `engine/evidenceV3.js`, provenance tests |
| `docs/knowledge/schools.json` | `knowledge/validateKnowledge.js` |
| `docs/knowledge/decisions/*.json` | `interpretation/tuPhuSlice.js` (and other decisions by slug) |

## Decision and review trees

- `docs/knowledge/passages/<slug>/span.txt` — referenced by `spanFile` in decision JSON.
- `docs/knowledge/reviews/<slug>/` — referenced by `reviewRef` in decisions.
- `docs/knowledge/research/sprint-9c/decisions/` and `.../reviews/` — Sprint 9C integrity tests.

## Tests with hard-coded doc paths

| Path | Test |
| --- | --- |
| `docs/archive/planning/AUTODEV_MASTER_PLAN.md` | `knowledgeCatalog.test.mjs` (historical locks) |
| `docs/planning/AUTODEV_MASTER_PLAN_V2.md` | `knowledgeCatalog.test.mjs` |
| `docs/engineering/TEST_FIXTURES.md` | `fixtureClasses.test.mjs` |
| `docs/archive/sprints/tuvi/sprint-9/SPRINT_9_*` | `formulaV1.test.mjs`, `sprint9Adjudication.test.mjs`, `combinationResearch.test.mjs`, `sprint9cDiscovery.test.mjs` |
| `docs/knowledge/SOURCE_IDENTITY_AUDIT_39.json` | `sprint9Adjudication.test.mjs` |

## Preserved in place (2026-10-14)

All files under `docs/knowledge/` **except** sprint markdown reports and B3 prompt markdown (moved to `docs/archive/`) remain at original paths. Numerology tree unchanged. Migration rationale: minimize churn on JSON graph and review references.
