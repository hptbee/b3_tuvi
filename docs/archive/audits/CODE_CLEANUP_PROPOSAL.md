# Code cleanup proposal

No deletion in this audit. Each row is a recommendation only.

## KEEP

| Item | Why | Caller evidence | Risk if removed |
|---|---|---|---|
| `insertHoroscope` | Schema and privacy test depend on it. Generate must continue not to call it. | `repositories.js`, `sqlite.test.mjs`, `chartGenerate.test.mjs` | The privacy regression test disappears |
| `matchLegacyCombinations` | Parity oracle for v2 on non-strict names | `combinationMatch.js`, `ruleEngine.test.mjs` | Parity coverage is lost |
| `knowledgeQuery.js` and `knowledgePrototype.js` | Read-only research tools. Not on the user chart path, and not safe to point at `backend/data` | prototype and query tests | Knowledge work has to be rewritten |
| Evidence v3 beside `evaluateRule` | Keeps the current match payload stable | `evidenceV3.js`, combination tests still read `hit.evidence` without `version` | Match API shape changes |
| Pilot claim file | Research record. Not approved interpretations | `pilotClaims.json`, catalog test | Comparison history is lost |

## REFACTOR

| Item | Why | Impact | Tests after |
|---|---|---|---|
| Shared hour-branch helper | F009. Two copies of `canhGio` | Generate and analyze stay aligned | `chartGenerate.test.mjs`, `wholeChart.test.mjs` |
| `claimEligibility` | F001. Flags are not conditions | Stops a future approved claim from skipping the chart | `interpretationPipeline.test.mjs` |
| Ask and analyze inputs | F002, F003. Public routes trust client DTOs | Answers and matches come from a calculated chart | route-level tests with a forged body |

## CONSOLIDATE

| Item | Why | Do not |
|---|---|---|
| Knowledge JSON import vs validator | F004. Pipeline and validator can disagree | Load claims into production SQLite |
| Combination card copy | F005. `description`, `summary`, and the "Luận giải" label are three surfaces for one unverified string | Rewrite formula text inside `combinations.json` as part of cleanup |

## REMOVE

Nothing in this pass has a proven zero-caller path that is also free of a compatibility job.

`insertHoroscope` looks unused from routes and is still required by tests. Do not remove it.

The stacked merge commits (`df91e06`, `2b0facc`, `6268897`, `6ee2f74`) are git history on side branches. Deleting those branches after `origin/main` is the source of truth is a branch-hygiene choice, not a code deletion. Confirm no open PR still uses them as a base.

## INVESTIGATE

| Item | Why it is not a removal yet |
|---|---|
| 15 `matching_ok` summaries shown as luận giải | Need a product decision on copy, not a dead-code deletion. Bibliographic status is still not primary |
| Decade numbers in `tuviRules.mjs` and `PalaceBox.jsx` | The time module marks fortune interpretation unapproved. The number is still part of the natal chart. Do not delete the field without a domain decision |
| `server.js` request log | Confirm no client puts birth data in the query string before changing the log format |
| Star and palace meanings in SQLite | Served by `/api/meanings`. Not reviewed as sources. Do not bulk-delete seed text in a cleanup PR |
