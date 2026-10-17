# T037 independent API/privacy/coverage review, pass 3 of current continuation

Reviewer scope: base `98496ca93c2097cacc59d53d1886695446f9fb03` plus current working/untracked implementation. Reviewed `backend/test/sourcePalaceFoundationalApi.test.mjs`, `backend/test/interpretationPipeline.test.mjs`, runner registration, README, TEST_FIXTURES, INTERPRETATION_COVERAGE and master-plan updates. Read production app middleware, analysis/ask routes, response stripping, production frontend validators, SQLite interfaces, foundational subset assertions and coverage comparator as dependencies. The pending family packet/T038 is excluded. Canonical reviewer/security-reviewer roles, API-security/code-review skills, review-loop spec/strategy and project testing policy applied.

## Findings

No new actionable findings in this unit (R4401+ unused). This is findings-only evidence; the parent owns quality-gate and review-budget decisions.

R4301 fresh closure evidence: the original blanket unavailable assertion was invalid once a default synthetic chart legitimately matched built-in accepted direct-host claims. The current missing-star fixture supplies an explicit structural negative while retaining all other determinism/formation/public and unbound-claim controls. `claims: []` would not suppress the built-in catalog. Independently ran the corrected pipeline test successfully. Independently replayed an in-memory sensitivity probe replacing the missing-star chart with the star-bearing chart and removing the separate empty-star assertion: expected exit 1 occurred specifically at the moved availability assertion. This supports CLOSED for R4301 without modifying runtime or source approval.

## Verification executed

- `node backend/test/interpretationPipeline.test.mjs`: exit 0.
- `node backend/test/sourcePalaceFoundationalApi.test.mjs`: first sandbox run could not connect to loopback (EACCES); retried with authorized local-network escalation, exit 0, 112 actual fixture responses / 128 requests. This is an executed successful retry, not treating the initial tool failure as success.
- Direct `interpretationApplicabilityReport()` plus `compareApplicability()` against preserved `measurement-before.json`: 11 verified claims, 7 palaces, 419/1152 distinct charts, 472 hits, 53 overlapping charts; gained 327, retained 92, lost 0. Per-palace positives independently matched documented counts: menh 2, phuc_duc 38, quan_loc 22, tai_bach 30, dien_trach 92, no_boc 92, thien_di 194; other five palaces 0.
- In-memory R4301 sensitivity probe: expected assertion failure, outer probe exit 0.

## Dimensions examined

Architecture/correctness: test imports genuine production frontend contract functions and reaches createApp over HTTP; no duplicate client validator implementation. All four frozen subjects and both positive/negative expected fixture values are exercised. Unchanged registered claims remain included in real measurement; the docs identify internal notes rather than an entire palace judgment. Claims of 30% achievement are cohort applicability, not prediction validation.

Security/privacy: /analyze and /ask take birth inputs, reject a supplied normalized chart or supplied ask analysis, and do not take object IDs or introduce protected/admin functions. API1/API5 object/function authorization is therefore not introduced by this unit. Actual responses exclude private marker, internalProse and every approved exact wording; public statement prose/release, whole-chart prose and fortune interpretation remain closed. No-store is checked on all normal/error responses, including malformed JSON, excessive body and unsupported encoding. Request logger uses method/path rather than input bodies. SQLite total_changes is compared after initialization. Routes invoke structured answer code, not an AI provider. Existing broader narrator/fortune tests remain registered; this HTTP test does not purport to evaluate live narration or explicit time-profile placements.

Reliability: temporary SQLite path precedes imports; server, connection, env value, directory and console hooks are cleaned in finally. The failed sandbox HTTP run also exited after finally. The new case is registered in integration tests and source fixture/unit tests stay in the unit list.

Performance (light): finite 112 chart requests, eight ask cases and eight malformed boundaries are intentional coverage of HTTP serialization/fixture paths. No new request-path code, persistence work or unbounded collection operation is introduced by these scoped changes. No measured regression found or specialist performance pass requested here.

Simplification/residue: repeated source fixture replays have a separate transport/client/privacy responsibility from unit assertions; this is intentional complexity. The moved unavailable assertion now has a valid named structural boundary and is sensitivity-tested. No confirmed redundant implementation or obsolete workaround found.

Testing/maintainability: the source-comparative vs synthetic/engineering classes are accurately distinguished; docs do not claim expert goldens, public approval, empirical outcomes or historical authentication. Frontend code is unchanged. Browser testing is out of scope because this unit changes API/catalog/tests/docs and exercises no browser-only print/download/focus/layout behavior. Full backend CI, docs checks, source semantic decisions and cross-cutting review remain parent responsibilities; they are not inferred from this focused pass.
