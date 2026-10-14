# E2E test matrix

Runner: Playwright 1.55, project `chromium`. Config: `frontend/playwright.config.js`. It starts backend `npm start` and Vite on `127.0.0.1:5173`, or reuses a server already listening.

Local result on 2026-10-12: `npx playwright test` exit 0, 4 passed, 0 skipped, 4112ms. GitHub Actions was not run here.

| Flow | Spec | Result in this session |
|---|---|---|
| Chart generation, 12-palace heading, Mệnh box | `e2e/chart.spec.js` first test | passed |
| Evidence text says formulas are not an approved reading | same test | passed |
| Combination heading is Cách cục, label Luận giải is absent | same test | passed |
| Print and JSON buttons are visible | same test | passed |
| Slower hour-8 analysis does not replace hour 10 | second test | passed |
| Analyze HTTP 500 shows an alert, chart heading remains | third test | passed |
| Print button can take keyboard focus | fourth test | passed |

Not covered by this spec: offline backend for chart generate, empty combination list, mobile viewport, screen reader output beyond accessible names, and the browser print dialog itself.
