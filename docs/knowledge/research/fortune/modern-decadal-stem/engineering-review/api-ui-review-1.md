# T030 API/UI independent review — pass 3 of this owner invocation

Reviewer: `/root/t030_api_ui_recovered`. Read-only product review; no production, tests, policy, or evidence modified. Temporary proof files only. Parent owns the overall quality gate.

## Scope and method

Actual current diff against task base `774ac6cff4b74e273a9bdf3a9c1ffa180d3d6b7b`, including untracked T030 files; HEAD `538385457c30e0259088994f1a94ef6a12267c2d` contains previously reviewed policy changes. Reviewed StructuredAnalysis.jsx and its component tests, modernMajorStemApi.test.mjs, modernMajor.js, new binding's interface, analyzer/timeEngine/HTTP routes. Read AGENTS.md, resolved cloud B3_HOME, project TEST_STRATEGY, canonical reviewer role, code-review skill, review-loop strategy/spec.

This is the API/UI logical unit, not a source-authority or hot-path specialist re-review. I inspected the fail-closed binding integration and distinct profile contract; independent source judgments and full binding artifact provenance belong to the separate source/core review units. No inference that old T025 approval covers stems.

## Findings

No confirmed critical/high/medium/low findings. No R3001+ IDs allocated. No product edits or fixes requested. This statement is this review's observations, not a declaration of the whole review-loop outcome.

## Independently executed evidence

- `npx vitest run src/components/StructuredAnalysis.test.jsx`: exit 0, **126 component tests passed**. `/tmp/t030/api-ui-component.log`.
- `node backend/test/modernMajorStemApi.test.mjs`: exit 0, **418 HTTP requests**, 24 independently sourced chart fixtures / 288 period placements, strict malformed request rejection, both overlays/year, ask, no-store/privacy/no persistence. `/tmp/t030/api-ui-existing-api.log`.
- `node backend/test/modernMajorStem.test.mjs`: exit 0, **654 queries / 120 pure source-derived cases**, 24 charts / 288 periods, legacy snapshots and malformed server metadata closure. `/tmp/t030/api-ui-existing-unit.log`.
- Own `/tmp/t030/api-ui-probe.mjs`: exit 0, **114 actual loopback HTTP requests**, **99 actual response bodies accepted by the genuine unmodified frontend validation functions**, **865 malformed response mutations rejected**. Extracted actual pre-JSX validators into Node VM, rather than a hand-copied validation model. New profile age probes cover first/before/last/125 across 24 valid fixture inputs, yielding 52 placed and 44 closed new-profile responses; additionally old/new combined minor/year responses and omitted major response. Actual ask responses retain null prose; malformed options produce 400 + existing ask analysis_failed envelope; caller chart rejected. DB count unchanged, no-store, private name absent from response/log. `/tmp/t030/api-ui-proof.json` and `/tmp/t030/api-ui-probe.log`.
- Scoped application diff whitespace check exit 0. Existing `frontend/e2e/modern-major-placement.spec.js` has **zero diff** from task base and clean status.

## Reviewed dimensions

- **Correctness/contracts:** request retains exactly two own keys, integer ages 1..125, distinct old/new profiles. Stem profile adds only its fields and exact declared compatibility scope. Existing omitted/old fields stay absent rather than adding null stem members. Stem uses server-computed lunar canIndex and selected physical branch, not viewing year or client-selected natal stem. Closed stem states require null stem / not_applied; old profiles reject unexpected stem fields. Client checks source pin, public withholding, exact option echo, canonical values, placement relationships and period ranges. The client does not have the natal lunar stem needed to independently recompute the formula; accepting a valid server stem is a server-trust contract, not client domain proof.
- **Reliability/state:** same-age profile switches alter the request signature; draft changes hide placement without sending a request; reverting draft restores committed output; clearing profile omits majorPeriod; retries preserve exact options; late old-profile responses cannot replace new-profile state; birth A→B→A clears private caller age/profile. Existing shared state/fetch structure is reused. Combined minor/year options remain independent.
- **Security/privacy:** publicFortune false and interpretation null remain mandatory; malformed source/profile/stem/placement data withheld. HTTP rejects caller normalized charts/options attempting to inject stem metadata. No new user-supplied source/artifact path or executable source hook; no name in request constructed by component. Actual HTTP no-store/private-name/no-write probes passed. No new raw HTML rendering.
- **UX/accessibility:** explicit unselected initial profile, source-scoped description without calendar-equivalence/prediction claims, labelled native select/input/button, numeric bounds and error association, status aria-live, retry/error flow covered at component level. The new conditional text is a canonical server stem, not a browser-only layout or interaction change; no browser-specific risk was identified.
- **Architecture/maintainability:** profile-discriminated extension reuses existing capability mapper and transport, no extra endpoint/fetch or independent state machine. Binding denial is handled before projection. New fields are isolated to explicit new profile. Original natal labels/classical blocked capabilities remain separate.
- **Performance (light):** added UI work is bounded constant-sized membership checking and text, no new request per draft/edit or extra endpoint; existing signature handles actual profile changes. Once-cached binding belongs to separate performance/core depth. No measured or evidenced UI performance regression found; no speculative optimization recommendation.
- **Simplification/residue:** old profile branch and new discriminant guards are **INTENTIONAL COMPLEXITY** for unchanged T025 compatibility and source trust; per-profile field checks have distinct fail-closed responsibilities. No confirmed redundant state, abandoned profile path, duplicate fetch or leftover browser additions. No confirmed cleanup recommendation.
- **Tests/policy:** source-comparative expectations remain attributed to accepted source packet; engineering mutations are synthetic structural tests, not expert golden cases. Existing Node runner reused. Browser E2E was neither changed nor executed. No Playwright created. Unit/component + HTTP integration exercise the scoped risks under current project policy; no skipped browser run is described as PASS.

## Limitations

This review did not recertify historical truth, source authenticity, expert approval, upstream full-calendar equality, all deployment infrastructure or hosted CI. Component tests are jsdom rather than browser layout tests by deliberate policy. Actual source approval remains separate and must be checked by parent before completion. No global loop PASS, merge, deployment or release determination is made here.
