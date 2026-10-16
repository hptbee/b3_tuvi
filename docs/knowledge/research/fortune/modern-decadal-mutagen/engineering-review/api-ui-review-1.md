# T032 API/UI independent review — actual pass 8, iteration 1

Scope: LARGE API/UI logical unit; base 655c2190e017c710ea0dcad08e2c3d722138a339 through current tracked/untracked T032 implementation. Read AGENTS, resolved B3_HOME, canonical reviewer/code-review/review strategy, B3 Tử Vi unit-first testing policy. Read current StructuredAnalysis.jsx/test.jsx diff, new modernMajorMutagenApi.test.mjs and required modernMajor/binding/analyze/timeEngine/statement interfaces. Read-only: no product edits, fixes, commits, browsers or loop verdict. Prior quota-failed attempt executed no review and is not evidence.

## Confirmed finding

| ID | Severity | Confidence | Category | Status |
|---|---|---|---|---|
| R3501 | HIGH | HIGH, actual HTTP reproduction | correctness / API-UI integration / regression coverage | OPEN |

`frontend/src/components/StructuredAnalysis.jsx:100` requires the physical statement star's `displayName` to equal the canonical association `sourceStarName`. Real public statements intentionally preserve display brightness suffixes (`backend/src/interpretation/pipeline.js:91` passes through existing normalized displayName). For reachable accepted T032-F01 `{day:1,month:1,year:1984,hour:0,gender:1}`, new profile age24 returns `Thiên Lương (V)`, `Tử Vi (M)`, `Vũ Khúc (V)` in statement stars, while association canonical names remain `Thiên Lương`, `Tử Vi`, `Vũ Khúc`. `validAnalysisBody` returns true and `validMajorResponse` returns false. Therefore selecting the new profile produces the generic invalid-response error instead of rendering legitimate associations.

Independent real HTTP -> genuine unmodified frontend validators (extracted from source into VM) reproduces rejection for **all 24 independently accepted source-comparative fixture charts**, not just a malformed fixture. Old/omitted profile responses remain accepted. Component mocks strip brightness suffixes and consequently miss this integration defect.

Fix requirement: retain canonical row identity and unique physical palace correspondence; correctly validate the existing display-name/brightness contract without duplicating the transformation formula or weakening forged identity checks. Add regression coverage using actual statement display shapes or an actual HTTP-derived component envelope. Preserve rejection of unknown suffix/name/identity/duplicate/overlay-only cases. Do not solve by changing legacy statement output or source review artifacts. Verification must show real valid responses accepted, malformed forgeries rejected and old profiles unchanged, then independent fresh review of current unit.

Evidence:
- `api-ui-initial-repro.mjs` / `.log`: first-request failing assertion, cap + physical statement dump.
- `api-ui-probe.mjs` / `.log`, `api-ui-proof.json`: 192 real HTTP requests, 24/24 valid new open responses rejected; 72 old/omitted responses accepted; 44 applicable closed responses accepted. Combined minor/view-year capability equals standalone; ask200/prose null; no-store each response; private name not echoed; DB row count unchanged.

## Actual tests

- `cd backend && node test/modernMajorMutagenApi.test.mjs`: exit0; **395 requests /24 independent charts /288 periods**, strict contract, overlays, ask, no-store/privacy. Log `api-ui-node.log`.
- `cd frontend && npx vitest run src/components/StructuredAnalysis.test.jsx`: exit0; **195 component tests**, log `api-ui-vitest.log`. Green mocks do not invalidate R3501.
- No Playwright/browser launched; unit/component plus HTTP integration exercises the defect directly under canonical project policy. No browser spec edited by this review.

## Other dimensions examined

Correctness/source governance: server-only formula, explicit third profile, all seven row fields, canonical 15 star identities, ordered four categories, same-palace associations allowed, physical-vs-Thân distinction, closed-state withholding and old-profile field isolation read. Actual binding is separate from T030; new profile checks full chain before projection. One confirmed integration bug above, no invented source verdict.

Security/privacy: exact request two-key validation reused; public interpretation remains null/blocked, generic `tu_hoa_han` remains blocked, no public prose activation; server chart and sex from validated input; no client chart trust; actual HTTP privacy/no-store/DB proof above. No new auth/storage/logging dependency.

Reliability/state: existing request key includes profile and age, generation+AbortController guards, draft/committed split and A->B->A resets reused. Tests exercise same-age switch, stale response, retry, clearing and combined minor/year. No additional confirmed issue found.

Accessibility/UX: labeled selector/number input, validation alert, busy/error handling, readable named association list and explicit placement-only caveat; no raw 40-cell formula in client. Browser geometry not examined because no new layout mechanism or browser-only risk was introduced.

Architecture/complexity/residue: identity-only UI mapping is INTENTIONAL COMPLEXITY at an untrusted API boundary; it is not duplicate formula execution. Existing major state and request machinery reused, no temporary compatibility layer/dead flag detected. No CONFIRMED REDUNDANCY cleanup request.

Performance (light): bounded four-row association check over fixed twelve natal palaces; no new network round trip or unbounded collection. Specialist pass independently covers startup/cache/request performance; no speculative optimization findings raised here.

Conclusion: this independent pass found **one confirmed HIGH OPEN finding (R3501)**. Parent owns finding validation, fixing delegation, fresh review and loop outcome. No loop PASS declared.
