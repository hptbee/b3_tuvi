# Browser E2E inventory and routing

Runner: Playwright 1.55, project `chromium`. Config: `frontend/playwright.config.js`. It starts backend `npm start` and Vite on `127.0.0.1:5173`, or reuses a server already listening.

Historical local result on 2026-10-12: `npx playwright test` exit 0, 4 passed, 0 skipped, 4112ms. GitHub Actions was not run here.

| Flow | Spec | Historical result (2026-10-12) |
|---|---|---|
| Chart generation, 12-palace heading, Mệnh box | `e2e/chart.spec.js` first test | passed |
| Evidence text says formulas are not an approved reading | same test | passed |
| Combination heading is Cách cục, label Luận giải is absent | same test | passed |
| Print and JSON buttons are visible | same test | passed |
| Slower hour-8 analysis does not replace hour 10 | second test | passed |
| Analyze HTTP 500 shows an alert, chart heading remains | third test | passed |
| Print button can take keyboard focus | fourth test | passed |

Not covered by this spec: offline backend for chart generate, empty combination list, mobile viewport, screen reader output beyond accessible names, and the browser print dialog itself.


## Current selection policy

[TEST_STRATEGY](TEST_STRATEGY.md) is the canonical policy. Existing browser suites are retained: `chart`, `chart-errors`, `annual-placement`, `modern-minor-placement`, `modern-major-placement`, `combination-details`, `meaning-dialog`, `landing` and `numerology` specs. This inventory does not claim a fresh execution or expert verification.

Backend formulas use Node unit tests and targeted HTTP/source integration; new domain work does not automatically add or run browser tests. Component validation, draft state, request races and error rendering normally use Vitest/React Testing Library. Existing overlap is preserved until a specific redundancy is demonstrated.

CI preserves the `e2e` job identity. `.github/scripts/browser-test-scope.mjs` selects browser execution only for changed browser specs, Playwright configuration, frontend dependency manifests, or explicit `workflow_dispatch` input `browser_e2e: true`. Source/component-only edits do not select Playwright by themselves; an exceptional UI change must include its justified spec/config change or request a manual run. Unknown Git ranges fail routing. The job summary records unselected browser tests as NOT RUN, not PASS. No security/privacy/backend/frontend unit gate is removed.

During T030 work, four new uncommitted browser cases were authored and a run was started before the owner changed this policy; its historical runner log reports59passed. Those four additions were withdrawn and the existing tracked major-profile spec restored exactly. That historical run is not the verification gate for the revised T030 or a new run of the retained55-test suite. The revised task uses source-derived Node unit/HTTP cases and component tests. No browser is required or launched for the policy change.
