# Remaining coverage gaps

Classified after the Sprint 8 c8 and Vitest reports. Not a promise to close them in this sprint.

## Missing behavior test

- `frontend/src/App.jsx` and `CachCucPanel.jsx`: generate and combination fetch. E2E hits them once.
- `TuViChart.jsx` and `CenterInfo.jsx`: star and palace meaning modals.
- Meaning route fallbacks when a star has no palace-specific text (`meaningRoutes.js` around the default meaning).

## Missing error-path test

- `catch` in `chartRoutes.js`, `combinationRoutes.js`, and `interpretationRoutes.js`.
- `connectDB` in `src/config/db.js` calls `process.exit(1)`.
- `server.js` listen path.

## Unreachable until the live bundle fails

- `analyze.js` lines 30–34. `knowledgeValidate.test.mjs` already says the live bundle is schema-valid, so this HTTP branch does not run on current data.

## Domain behavior requiring expert validation

- Lunar conversion and an-sao results. Tests lock the current functions. They are not a collated edition.
- Pilot claims stay unapproved. Coverage does not make them `MATCH`.

## Instrumentation

- c8 statement counts matched line counts in both the baseline and the final run.
- Frontend branch totals were not meaningful at baseline because no file executed. The after-report (105 branches) is the first real branch denominator.
- CLI files under `backend/src/scripts` are 0% and are still included. Removing them would raise the percentage without testing them.
