# T025 independent API/UI technical review — pass 3/12

Reviewer: isolated `/root/major_api_ui_review`, not the author or fixer. Read repository AGENTS.md, canonical reviewer role, code-review skill and review-loop finding schema. Read the current working diff against base 4c1761e and the relevant untracked files. No product edits or Git mutations.

## Defined scope

- backend/src/interpretation/analyze.js, backend/src/time/timeEngine.js; modernMajor.js interface and existing map/binding interfaces only.
- backend/test/modernMajorApi.test.mjs, frontend/src/components/StructuredAnalysis.jsx and its changed tests, frontend/e2e/modern-major-placement.spec.js.
- README.md and docs/tuvi/MODERN_MAJOR_PROFILE.md.
- Existing request routing, no-store middleware placement, ask wrapper and existing minor UI behavior inspected as dependencies.

## Findings

No confirmed finding in this scope. R1901+ remains unallocated; no speculative concern promoted to a blocker. This report does not declare the review loop outcome.

## Evidence actually run

1. `node backend/test/modernMajorApi.test.mjs`: exit 0. Real HTTP requests covered omitted and combined profiles, both sexes, strict option/age rejection, first/next/final finite periods, before/after nonplacements, ask compatibility, no-store on normal/parser/payload/encoding errors, no private response echo or personal DB persistence/logging. Log: `/tmp/t025/reviewer-api-http.log`.
2. `npm test -- --run src/components/StructuredAnalysis.test.jsx` in frontend: exit 0; **101 tests passed**. Log: `/tmp/t025/reviewer-ui-unit.log`.
3. Independent read-only cross-layer probe extracted the actual frontend response validators and called the actual server analyzer for all **28 real-chart fixtures**, at distinct ages drawn from `[1, Cục, Cục+9, Cục+10, Cục+119, 125]`, with minor profile and viewing year simultaneously. **163 actual combined responses** accepted by both corresponding validators. For each, a corrupted returned major age was rejected. Probe exit 0. This checks frontend/server contract agreement, not historical formula truth.

## Dimensions reviewed

- **Architecture/correctness:** optional strict major option is validated before chart calculation; private validated gender enters the same server analyzer and time overlay as existing minor option. Omission preserves existing formulas and classical gates. Explicit integer 1–125 request contract is separate from minor 1–120. Finite 12-period placement and closed before/after states have exact null placement fields. UI renders server-owned placement and periods without calculating directions or selecting a palace itself.
- **Request and response trust:** explicit profile, returned age, fixed source identity and pin, compatibility, blocked public narration and target statement matching checked. Malformed response returns error/retry. An explicit request cannot accept a missing capability. Source pin and age mismatch tests exercised. UI does not display untrusted interpretation content from these capabilities.
- **State/data flow:** request keys include birth, year, committed minor option, committed major option and retry attempt. Major and minor draft changes remain isolated from committed request data; dirty state hides that profile's previous visible placement. Clear removes only the selected profile. Shared birth reset clears both profiles, including A→B→A. Abort plus sequence and active key prevent older responses replacing newer results. Retry uses committed values and restores focus after completion. Tests cover combined controls, late major response, birth return and retry.
- **Security/privacy:** new request option cannot inject server natal/chart parameters; unknown/excess fields are rejected. Analyze and ask retain prior server-derived chart boundaries. Shared API no-store precedes JSON parsing and applies to error responses. Actual HTTP test proves no personal body logging/persistence for the new path. No new HTML injection, execution or new public prose surface found.
- **Accessibility/responsiveness:** separately named sections and labels, text help, named submit controls, numeric bounds, live result region, error alert and aria-invalid/describedby linkage inspected. Reused existing form styling supplies wrapping, minimum 44px controls and focus-visible outlines. The committed E2E file checks 390px control bounds and explicit result transitions; this reviewer did not independently rerun browser tests.
- **Performance:** one analysis fetch remains shared; no extra fetch effect, client formula, polling or unbounded iteration introduced. New response validation performs one bounded statement scan. No measured regression observed in the 163 cross-layer calls. Full source binding cold-path cost belongs to the separate core review; no independent production-load claim here.
- **Simplification/residue:** separate draft/committed states are intentional complexity for two independently applied profiles. Reusing minor signature, empty draft and existing form CSS avoids duplicate request/state machinery. Similar response validators retain distinct source/age/period contracts. No confirmed obsolete path or redundant business calculation requiring deletion found.
- **Tests/maintainability:** new HTTP, component and browser tests target observable behavior rather than just reproducing internal arithmetic. Documentation makes projection limitations, 12-period finite range, distinct classical/natal status and public narration restriction explicit. Existing minor link assertion narrowed appropriately because there are now two source links.

## Deliberate exclusions / limits

- Raw 39 source artifacts, dual-model provenance and formula approval were not re-reviewed: separate core/evidence unit owns these. Cross-layer agreement is not source approval.
- Full backend/frontend CI, build/lint, all browser suites, external GitHub status/merge controls and production deployment readiness were not independently executed in this unit. Parent owns aggregate checks and gates. Actual focused checks above completed successfully; no claim about omitted checks.
- Accessibility review covers code semantics and existing tests, not a screen-reader/manual audit or a claim of comprehensive WCAG certification.
