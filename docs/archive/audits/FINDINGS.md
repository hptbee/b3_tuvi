# Findings

Sorted by severity. Confidence is `CONFIRMED` only when the current tree shows the behavior. Domain disagreements without a collated edition stay out of this list.

## F001 — Eligibility does not check conditions

- severity: P1
- category: interpretation
- confidence: CONFIRMED
- file: `backend/src/interpretation/eligibility.js` lines 1–19

Expected: a claim is eligible for interpretation only when its conditions hold on the chart, the formula was matched, a source is present, and approval was recorded.

Actual: the function checks flags only. `conditions` is never read. If `formulaComparisonStatus` is omitted, the formula check is skipped (`if (claim?.formulaComparisonStatus && ...)`). A claim with `approvedForInterpretation`, `interpretationStatus: 'sourced'`, a `sourceId`, and `relatedPalaces` is eligible on an empty palace. `backend/test/interpretationPipeline.test.mjs` locks that result as `eligible_claims_present`.

The live pilot file does not set those approval flags, so today's catalog does not become a user reading. The gate that would allow one does not evaluate the chart.

Impact: the first approved claim can be marked eligible without the stars or palaces it describes.

Proposed fix: require `formulaComparisonStatus === 'MATCH'`, require a non-empty condition evaluation against the chart, and reject missing formula status. Add a negative test with flags set and stars absent.

Risk: low. Does not change an-sao or `rulesV2.json`.

## F002 — Ask answers from the client object

- severity: P1
- category: security / trust boundary
- confidence: CONFIRMED
- file: `backend/src/routes/interpretationRoutes.js` lines 18–24
- also: `backend/src/ai/questions.js` lines 6–16

Expected: an answer is derived from an analysis this server just calculated.

Actual: `POST /api/interpretations/ask` passes `req.body.analysis` to `answerQuestion`. The handler returns `availabilityStatus`, `ruleIds`, and `sourceReferences` from that object. `prose` stays null, so this is not a generated essay, but the server confirms whatever status and ids the client sent.

Reproduction: POST `{ "analysis": { "ok": true, "statements": [{ "topic": "menh", "statementId": "palace:menh", "availabilityStatus": "eligible_claims_present", "ruleEvidence": [{ "ruleId": "not-a-real-rule" }], "stars": [], "sourceReferences": [], "contradictoryEvidence": [], "limitations": [], "breakingConditions": "checked_clear" }] }, "questionId": "why_menh" }`.

Impact: a public route, with default CORS, echoes an untrusted DTO as an API result.

Proposed fix: accept birth input or a server-side chart only, run `analyzeChartRequest`, then answer from that result. Reject a raw `analysis` body.

Risk: low. No new account system.

## F003 — Analyze trusts a client chart

- severity: P1
- category: trust boundary
- confidence: CONFIRMED
- file: `backend/src/interpretation/analyze.js` lines 42–45

Expected: a chart in the interpretation response was produced by `calculateTuVi` from validated birth input, or the response says the chart was supplied by the caller.

Actual: if `body.normalizedChart.ok` is true, `responseFor` interprets that object and does not recompute. A client can place any stars on Mệnh and receive `runtimeMatchStatus: 'matched'` when a repo rule fits those stars.

Impact: the same URL used for a real birth chart also certifies a fictional chart. Combined with F001, a later eligible claim would attach to fiction.

Proposed fix: either remove the `normalizedChart` branch from the public route, or set `chartSource: 'client'` and refuse `eligible_claims_present` on that path.

Risk: low. Tests that post a normalized chart need to expect the label.

## F004 — Interpretation does not use the knowledge layer

- severity: P2
- category: integration
- confidence: CONFIRMED
- file: `backend/src/interpretation/pipeline.js` lines 1–4 and 152–153

Expected: claims, editions, and provenance gates used at interpretation time go through the validator or the read-only query layer.

Actual: the pipeline imports `pilotClaims.json` and `rulesV2.json` itself. `knowledgeQuery.js` and `validateKnowledge.js` are not on this path. SQLite knowledge prototype is not read, which is correct for production data, but the two knowledge stacks can drift.

Impact: a catalog that fails validation can still be interpreted if it is the imported JSON.

Proposed fix: run `validateKnowledgeBundle` on the imported documents at startup or inside `interpretChart`, and fail closed on `ok: false`. Do not point the query layer at `backend/data/tuvi.sqlite`.

Risk: low.

## F005 — Matching catalog text is labeled luận giải

- severity: P2
- category: product / provenance
- confidence: CONFIRMED
- file: `frontend/src/components/CachCucPanel.jsx` lines 144–155
- also: `backend/src/engine/combinationMatch.js` lines 299–306

Expected: text shown as luận giải is an approved interpretation with a source, or it is visibly not one.

Actual: `matching_ok` summaries are returned without the `[Chưa xác thực]` prefix. The panel prints them under the label `Luận giải`. A smaller line says the match is only the declared star condition. `matching_ok` is still not `formulaCheckedAgainstSource` and not bibliographic primary. 15 combinations are in that state.

Impact: the UI the user actually sees can present unverified catalog sentences as a reading. The new interpretation API is not what the UI calls.

Proposed fix: keep the star-match line, and do not title catalog `description` / `summary` as luận giải until interpretation approval exists. This is a copy change, not a formula change.

Risk: low. Users will see less prose.

## F006 — Narrator fidelity is id membership

- severity: P2
- category: AI
- confidence: CONFIRMED
- file: `backend/src/ai/narrator.js` (`evaluateNarration`, and the return that sets `text: null`)

Expected: a model cannot add a statement that the evidence does not support.

Actual: rejected ids and `extraClaims` fall back to empty text. Accepted provider output still sets `text: null` and `withheldProse`. That stops prose hallucination on the current return path. A cited id is accepted if it appears anywhere in the analysis, with no check that the sentence would have been about that id. No live model was called. Cost and latency are only present when the mock sends them.

Impact: not a production guard. Safe only while text stays withheld.

Proposed fix: keep withholding text until a public-AI approval. Do not treat the mock suite as a quality evaluation.

Risk: none if text remains null.

## F007 — Frontend ignores the interpretation API

- severity: P2
- category: integration
- confidence: CONFIRMED
- file: `frontend/src/App.jsx` (generate), `frontend/src/components/CachCucPanel.jsx` (match)

No component calls `/api/interpretations/analyze` or `/ask`. Structured analysis, topic synthesis, and blocked fortune status are invisible in the UI. The decade number is still rendered from `box.daiHan` in `PalaceBox.jsx`.

Impact: server work in Sprints 3–7 is not the product surface. The product surface is still generate plus combination cards (F005).

Proposed fix: do not wire the new API to the UI until F001–F003 and F005 are addressed.

## F008 — Coverage test cannot fail a wrong comparison

- severity: P2
- category: tests
- confidence: CONFIRMED
- file: `backend/src/knowledge/coverageReport.js` and `backend/test/knowledgeCoverage.test.mjs`

The test asserts the report's counts equal the same JSON files the report reads. A wrong `researchNotes` or a silent status upgrade that stays internally consistent still passes. There is no expert golden chart. Fixture classes correctly say none exist.

Impact: green tests do not mean the 10 pilot comparisons are right, and they do not cover the other 53 ways.

Proposed fix: keep the count test, and add fixtures that fail if a pilot claim is marked `MATCH` or `approvedForInterpretation` without a separate human field the test does not derive from the claim body alone.

## F009 — Hour conversion is duplicated

- severity: P3
- category: residue
- confidence: CONFIRMED
- files: `backend/src/routes/chartRoutes.js` lines 28–30; `backend/src/interpretation/analyze.js` lines 13–14

Both compute `canhGio` the same way. They match today. A future edit can diverge generate from analyze.

Proposed fix: one exported function used by both. Re-run chart generate and whole-chart tests.

Risk: low.

## F010 — Request log includes the URL

- severity: P3
- category: privacy
- confidence: CONFIRMED
- file: `backend/server.js` lines 16–18

The middleware logs method and URL. POST bodies are not logged. Route failures use `logSafeError`. A birth date placed in a query string would be logged. Current chart calls are POST.

Proposed fix: log method and path only, with the query stripped.

Risk: low.

## F011 — V2 plan section 10 is stale

- severity: P3
- category: documentation
- confidence: CONFIRMED
- file: `docs/planning/AUTODEV_MASTER_PLAN_V2.md` lines 251–262

Section 10 says production migration and `V2-KB-02` are still `BLOCKED_HUMAN` and to stop before `V2-KB-02`. Section 7 marks `V2-KB-02` COMPLETED. Later sections describe Sprints 3–7. V1 plan was not rewritten, which is correct.

Proposed fix: replace section 10 with a pointer to sections 14–19. Do not edit `docs/archive/planning/AUTODEV_MASTER_PLAN.md`.

## Not filed

- Disabled rules are not returned (`disabledRules` count against the 58 rules is 0).
- Generate does not insert horoscopes.
- Edition authentication is `authenticated === true` only. That matches the current owner decision.
- Stacked PR merge commits are absent from `main`, but their trees are not. See the integration report. Not a missing-code defect after PR #10.
- Natal formulas that disagree with a book were not re-labeled `INCORRECT`. The pilot CONFLICT rows remain research findings, `NEEDS_DOMAIN_VERIFICATION`.
