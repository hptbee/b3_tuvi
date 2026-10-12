# Sprint 8 release readiness

Three decisions, measured on 2026-10-12. Coverage is not a production approval.

## STRUCTURED_CHART_AND_EVIDENCE_UI

Conditional. Local backend tests, frontend unit tests, lint, production build, and 4 Chromium smoke tests passed. The chart page can open per-palace evidence, print, and download JSON without an approved reading. GitHub Actions on this branch was not executed in this session.

## EXPERT_INTERPRETATION

No. No claim is approved for interpretation. Catalog text is still labeled as a catalog description. Eligibility requires `formulaComparisonStatus === 'MATCH'` and a star or rule check. The live pilot does not pass that gate.

## PUBLIC_FORTUNE_AND_AI

No. Tiểu hạn, lưu niên, lưu tinh, tứ hóa hạn, and leap-month fortune stay blocked. Narrator tests keep `text: null` and do not call a live model. There is no API key in the narrator module.

## Security notes from this sprint

- Public interpretation routes reject a client `analysis` object and a client `normalizedChart`.
- JSON bodies over 256kb return `413` with a JSON error.
- Malformed JSON returns `400` with `JSON không hợp lệ`.
- Request logs use the path without the query string.
- A client `x-request-id` up to 80 characters is echoed. It is not a secret.
- CORS remains the existing open `cors()` default. Authentication was not added.
- `npm audit` reported vulnerabilities in the new dev dependencies. They were not patched in this sprint.

## Not ready

Production SQLite migration, login, history, payments, formula edits, and public narration stay out of scope.
