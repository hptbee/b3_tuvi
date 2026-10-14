# Full repository audit

- audited: 2026-10-12
- mode: audit only; no implementation change
- local HEAD during audit: `608a5ca01ce5a78a1129463725e8a73a91a0644f` (`autodev/v2-sprint-7`)
- `origin/main`: `9999610f072d6ec074771d35199e2baa6f086a0d`
- tree of `origin/main` and of `608a5ca`: both `fc286c3a5f42b8c2acbc33e874513c5d344cca7f`
- local `main` ref: `2b1e745` (behind `origin/main`; not the remote tip)
- working tree: clean

## Executive summary

The calculation engine, rule matcher, and stateless chart API are implemented and covered by the backend suite. That suite passed in this audit. Frontend lint and production build also passed. None of that is evidence that a Tử Vi formula matches a collated book or an expert.

Structured interpretation exists and does not write a reading. It is not expert interpretation and not a public reading. Fortune cycles other than the existing natal decade label are blocked. The AI path withholds model prose and was not run against a real model.

Three confirmed high findings should be fixed before any user-facing interpretation: eligibility ignores whether a claim's conditions hold, `POST /api/interpretations/ask` trusts a client-supplied analysis, and `POST /api/interpretations/analyze` will interpret a client-supplied normalized chart without recalculating it.

No confirmed P0 (data loss, secret in source, or a broken calculate path) was found. `POST /api/charts/generate` still does not call `insertHoroscope`.

## Scope

Reviewed Git ancestry, backend engine and knowledge modules, interpretation, time, AI routes, frontend combination panel, CI workflow, and the V1/V2 plans. Browser end-to-end was not run. A real LLM was not called. Formulas were not edited.

## Methodology

`git fetch`, `git merge-base --is-ancestor`, tree hashes, and `git ls-tree` for integration. Source reading for eligibility, routes, chart generation, combination DTO, and the combination panel. Counts from the JSON catalogs. `cd backend && npm test`, `cd frontend && npm run lint`, and `cd frontend && npm run build`.

## Git integration

The snapshot "main is `73819bc` and Sprint 5–7 are absent" is no longer true.

| Commit | On `origin/main` | Role |
|---|---|---|
| `7ba68db` PR #1 | yes | V1 foundation |
| `f4edcc0` PR #2, `9138253` PR #3 | yes | V2 foundation |
| `2b1e745` PR #4 | yes | Sprint 2 |
| `73819bc` PR #7 | yes | Sprint 3 merge |
| `608a5ca` | yes, as second parent of PR #10 | Sprint 3–7 linear tip |
| `9999610` PR #10 | yes, tip | Merges `73819bc` and `608a5ca` |

`df91e06` (PR #5 into the sprint 3 branch), `2b0facc` (PR #8), `6268897` (PR #9), and `6ee2f74` (PR #6) are **not** ancestors of `origin/main`. They are merge commits on the stacked branch refs. Their file changes are already inside `608a5ca`, and that tree equals `origin/main`. No Sprint 5–7 source file is missing from `origin/main`.

No further integration PR is required to land that tree. Local `main` should be fast-forwarded to `origin/main` before the next branch. Do not merge the stale stacked branch tips again; that only replays merge commits.

## Architecture

Backend is a single Express process. Chart calculation is pure. SQLite is used for star/palace meaning lookup and is not on the generate path. Knowledge prototype and query stay off `backend/data`. Interpretation, time overlay, and Q&A are in-process libraries plus two POST routes.

The frontend still talks only to `POST /api/charts/generate` and `POST /api/combinations/match`. It does not call the interpretation API.

Coupling that is real: `interpretChart` imports `rulesV2.json` and `pilotClaims.json` directly. It does not use `knowledgeQuery.js` or `validateKnowledge.js`. Birth-to-chart hour conversion is copied in `chartRoutes.js` and `analyze.js`.

No microservice split is justified.

## Domain correctness

Catalog on this tree: 63 combinations, 58 v2 rules, 4 combinations `disabled` and none of those have a v2 rule, 15 `matching_ok`, 44 `provisional`. Pilot: 10 claims, 7 CONFLICT, 2 PARTIAL, 1 NOT_IMPLEMENTED, 0 MATCH. `formulaCheckedAgainstSource` count in the matrix is 0.

Those comparison results are project research notes, not an independent collation and not an expert sign-off. Status for the uncompared 53 combinations and for the natal formulas (including the decade number written in `tuviRules.mjs`) is `UNVERIFIED`, not `INCORRECT`.

`calculateTuVi` sets `schoolId` from the default school profile. Giờ Tý keeping the solar date, and the leap-month day-15 rule, are documented conventions in `schoolProfile.js`. They were not re-proved against a collated edition in this audit.

## Rule engine

`matchCombinations` skips `disabled`. Legacy and v2 parity is tested on shared names. Evidence v3 does not set formation to satisfied from a hit alone. Breaking stays `not_implemented` unless a caller passes an evaluated result. This audit did not find a disabled rule being returned.

`matching_ok` still means the repo rule matched. It does not mean the formula was checked against an edition.

## Knowledge

Edition gate in `provenance.js` and `evidenceV3.js` is `editionAuthenticated === true` only. Collation fields are not gates. A checked formula still needs `formulaCheckedAgainstEdition === true` inside evidence v3, so an authenticated edition does not verify every rule. Live catalogs still forbid `bibliographicStatus: primary` and `formulaCheckedAgainstSource: true`.

Zero pilot claims are approved for user interpretation. Meaning text in SQLite was not bibliographically reviewed (`meaningStoresReviewed: false` in the coverage report).

## Interpretation

Twelve function palaces are emitted. Thân is one extra statement with `thanOverlay` and the host palace's `functionId`. `prose` is null. Runtime match does not become `source_satisfied` unless every hit on that palace already carries that evidence status.

`claimEligibility` does not read `conditions`. See F001. The HTTP analyze route accepts a client chart. See F003. The ask route does not recompute. See F002.

Readiness, kept separate:

| Level | Status |
|---|---|
| STRUCTURED_ANALYSIS_READY | yes, with the three high findings open |
| EXPERT_INTERPRETATION_READY | no |
| PUBLIC_INTERPRETATION_READY | no |

## Fortune

`timeOverlay` reads `palace.daiHan` already stored by the natal engine. It does not recompute it. Tiểu hạn, lưu niên, lưu tinh, tứ hóa hạn are `blocked` with `no_approved_formula`. Leap-month fortune is `not_applied`. `interpretation` is null. The chart UI still displays the decade number. That display is a natal annotation, not a fortune reading, and the formula behind the number remains `UNVERIFIED`.

## AI

`narrate` does not copy provider `text` into the result. Unknown referenced ids and `extraClaims` fall back to `text: null`. No API key literal in `narrator.js`. Tests use a mock. This is not a production hallucination guard: fidelity is id membership, and no live model was measured. `POST /api/interpretations/ask` is mounted on the public app with CORS enabled and no login, by product scope, and it trusts the body. See F002.

## Security and privacy

`chartRoutes.js` does not reference `insertHoroscope`. The only callers are repository tests and `chartGenerate.test.mjs`, which asserts the route stays free of that call and that a temp database row count does not change. Generate still returns lunar data and `normalizedChart.input` to the caller who sent the birth data. That is a response, not a SQLite write.

`server.js` logs method and URL, not the JSON body. Route catch blocks use `logSafeError`. CORS is the `cors()` default. There is no account system, by product decision. Body size is the Express default. No secret was found in `narrator.js`.

## Code quality

`insertHoroscope` is not dead: tests and the schema use it, and generate must keep not calling it. `matchLegacyCombinations` is the parity oracle. Do not delete either as unused.

Hour-branch conversion is duplicated. Interpretation does not use the knowledge query layer. V2 plan section 10 still says work stops before `V2-KB-02`, while section 7 marks that task COMPLETED.

## Testing

Backend `npm test` passed on this tree (engine, placement, combinations, rules, sqlite, provenance, prototype, validator, query, logging, evidence, interpretation, coverage, twelve-palace, time, narrator, fixtures, chart generate, catalog). Frontend `npm run lint` and `npm run build` passed. No browser E2E. No expert golden chart. Coverage tests that re-read the same JSON they assert cannot catch a wrong bibliographic comparison.

## Integration

Birth input to chart generate to combination match is what the UI exercises. The chain through evidence v3, eligibility, whole-chart topics, time overlay, and Q&A exists on the server and is not wired to the UI. Knowledge query is not on that chain. Treat the longer chain as an internal API, not a production reading flow.

## Known limitations

53 of 63 combinations have no pilot comparison. No claim is approved for user interpretation. Fortune readings are blocked. AI public is not approved. Production SQLite migration stays `BLOCKED_HUMAN`.

## Release readiness

See `docs/archive/audits/RELEASE_READINESS.md`. Sprint 8 is **NO-GO** for expert interpretation, fortune prediction, and public AI. Engineering work on the confirmed findings can proceed.
