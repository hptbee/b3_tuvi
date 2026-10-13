# Numerology release readiness — 2026-10-13

Local evidence for the stacked branches ending at `cursor/numerology-release-hardening-2318`. This is not a production approval.

## Completion dimensions

| Dimension | Status | Evidence |
|---|---|---|
| `CALCULATION_FEATURE_COMPLETE` | Met for the published calculator | Profile `pythagorean-vn-v1` `1.2.0` still calculates the seven metrics, birth grid, personal cycles, and four pinnacle/challenge periods. |
| `FORMULA_PROFILE_CONSISTENT` | Met | No calculation file changed in the content, feature, or hardening commits. Existing fixtures still pass. |
| `FORMULA_SOURCE_VERIFIED` | Not met | Web pages read in the audit stay `source_read`. `editionVerificationStatus` and `expertVerificationStatus` stay unverified. |
| `CONTENT_REVIEWED` | Met for catalog `1.1.0`, then for the added `1.2.0` stage copy | `1.1.0` had two editorial passes. `1.2.0` adds pinnacle-stage and challenge 1–8 readings after two further passes in `reviews/CONTENT_1_2_REVIEW.md`. Challenge 0 and number 33 stay withheld. Neither pass is expert or book verification. |
| `V1_FEATURE_COMPLETE` | Met for the named V1 interactions | Export, import-with-recalculate, and A4 print are implemented and covered by unit and Playwright tests. |
| `RELEASE_GATES_PASSED` | Not met | Local commands below passed. GitHub Actions for this branch is recorded only after the push. Staging was not executed. No release owner has approved. |
| `PRODUCTION_READY` | Not met | The in-process limiter does not coordinate multiple instances. Live staging, rollback rehearsal, and release approval are absent. |

## Rate limit

`GET /api/numerology/profiles`, `GET /api/numerology/meanings/:metricId/:value`, and `POST /api/numerology/calculate` share one fixed window. The default is 120 requests per 60 seconds per key. `OPTIONS` is not counted. A rejection is HTTP 429, `Cache-Control: no-store`, `Retry-After`, and `{ ok:false, error:{ code:"RATE_LIMITED", message, fields:[] } }`. The key is never the name or birth date.

Default key: the socket address. `X-Forwarded-For` is ignored, so a client cannot create a new bucket by changing that header. Behind one proxy this also means every visitor shares the proxy's socket bucket. That fails closed.

To use a forwarded address, set `NUMEROLOGY_TRUST_PROXY=1` and `NUMEROLOGY_PROXY_TOKEN` to a secret only the proxy knows. The proxy must send that secret in `X-Numerology-Proxy-Token` and must append the observed client address. The app uses the rightmost hop. A missing or wrong token keeps the socket key. Do not expose the Node port directly while trust is enabled.

Each Node process has its own map. Two or more instances need the same budget at the reverse proxy. An example for one proxy in front of the app:

```nginx
limit_req_zone $binary_remote_addr zone=numerology:10m rate=120r/m;
server {
  location /api/numerology/ {
    limit_req zone=numerology nodelay;
    proxy_set_header X-Numerology-Proxy-Token $numerology_proxy_token;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://numerology_app;
  }
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

`$numerology_proxy_token` must be defined in the proxy, not taken from the client. This example was not applied to a live server.

## Chart request ordering

`frontend/e2e/chart.spec.js` scenario `a slow chart cannot replace the latest chart after navigation` had failed with `1 giờ 00 phút` where the test expected `10 giờ 00 phút`. Hour 1 is `DEFAULT_INPUT`, not the delayed hour-8 response. Leaving `/la-so` clears the query, and the shared form discards an edit that was stored against the previous query. The test could select hour 10 on the chart form before the landing form had committed, then submit the default.

The test now waits until the URL is `/`, selects hour 10, and checks the combobox value before submit. The displayed-hour assertion is unchanged. Local result on 2026-10-13: the full Playwright suite passed 34 tests, and this scenario then passed 10/10 with two workers. That is local evidence, not a claim that GitHub Actions has already run it.

## Performance and privacy probe

Command: `node scripts/numerologyPerfProbe.mjs` from `backend/`.

Environment: Node `v22.14.0`, Linux x64, one process, loopback, no proxy. Measured 2026-10-13.

| Case | Result |
|---|---|
| 30 sequential calculations, `15/6/1990`, `Nguyễn Văn An` | min 1.30 ms, p50 1.54 ms, p95 3.38 ms, max 44.00 ms |
| 20 concurrent calculations | wall 42.79 ms, 20 responses with status 200 |
| JSON body about 300 KB | 413 in 2.40 ms |
| Name `漢` | 400 in 1.28 ms |
| Name of 100 `A` characters | 200 in 1.88 ms |
| Day 31 in February 1990 | 400 in 1.08 ms |
| `Cache-Control` on the first success | `no-store` |
| Heap used | 11,562,496 bytes before, 16,506,936 bytes after |
| RSS | 70,729,728 bytes before, 96,919,552 bytes after |

These numbers are one local run. They are not a production SLO. The existing API test still checks that request logs omit the name and birth year.

## Metadata

`frontend/index.html` uses `lang="vi"`. The numerology view sets the document title to `Thần số học · Chiêm nghiệm`. `/la-so` sets `noindex, nofollow` because that URL contains birth fields. Other routes in this app set `index, follow`. A canonical link is added only when `VITE_SITE_ORIGIN` is an `https` origin with no path; the canonical path does not include the query string. No origin is configured in this repository, so the local build has no canonical link. `frontend/public/robots.txt` disallows `/la-so`.

## Local commands on this branch

- `npm run test:ci --prefix backend`: passed. Coverage floor held at 82.81% lines and 87.59% branches. `backend/src/numerology` remained 100% lines and 98.46% branches. `backend/src/http/numerologyRateLimit.js` was 100% lines and 97.67% branches on that run.
- `npm run test:ci --prefix frontend`: 54 passed. `frontend/src/numerology` was 100% lines and 93.43% branches.
- `npm run lint --prefix frontend`: passed.
- `npm run build --prefix frontend`: passed. `dist/robots.txt` contains `Disallow: /la-so`.
- `npm run test:e2e --prefix frontend`: 34 passed.
- Chart navigation scenario repeated with `--repeat-each=10`: 10 passed.

GitHub Actions run `38395357768` on `cursor/numerology-release-hardening-2318` completed with `backend`, `frontend`, and `e2e` successful. The pull-request run `38395391186` also completed with those three jobs successful. Earlier branches still contain the unsynchronized chart test: audit run `38386327026` and content push run `38391879426` failed `e2e` on `chart.spec.js` expecting `10 giờ 00 phút` and receiving `1 giờ 00 phút`. Their other recorded runs passed, which matches the race rather than a calculation change.

## Staging checklist

Live staging was not executed. No deployment credentials or staging host were available in this session. Nothing was deployed.

| Check | Local substitute | Live staging |
|---|---|---|
| Frontend build | `npm run build --prefix frontend` passed | Not executed |
| Backend startup | API and Playwright servers started | Not executed |
| API base URL | Playwright uses the Vite dev server and `127.0.0.1:5000` | Set the deployed frontend to the deployed API origin. Not executed |
| `/than-so-hoc` open and refresh | Playwright navigation and the existing reload assertion | Not executed on a static host. The host must use `try_files` or an equivalent SPA fallback |
| Profiles, calculate, meanings | Backend API tests | Not executed |
| Meaning eligibility | Content tests publish catalog 1.2.0 stage readings, withhold 33, and withhold challenge 0 | Not executed |
| Export, import, print | Unit tests and the numerology Playwright print/import test | Not executed |
| Mobile 320 and 390 | Playwright | Not executed |
| `Cache-Control: no-store` | API test and the probe | Not executed |
| Rate limit 429 and reset | `numerologyRateLimit.test.mjs` | Proxy limit not executed |
| Error handling | API negatives and the chart error spec | Not executed |
| Rollback | Not rehearsed | Redeploy the previous build artifact and the previous backend revision. Numerology stores no birth history, so rollback does not migrate user data |

## Rollback

Do not delete SQLite to roll back Numerology. The calculator does not write birth data. Roll back by deploying the previous frontend build and backend revision. Unset `NUMEROLOGY_TRUST_PROXY` if the proxy token was not installed. The in-process limiter disappears with the process; the proxy limit, if added, is removed by reverting the proxy configuration.
