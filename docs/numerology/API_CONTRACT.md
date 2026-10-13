# Numerology API — core + grid/cycles schema 1.1.0

Implemented endpoints: `GET /api/numerology/profiles` and `POST /api/numerology/calculate`. The profile is experimental product-spec arithmetic; personal meanings are null/withheld. There is no catalog/meanings endpoint, persistence, AI or pinnacles/challenges engine in this release.

POST JSON:

```json
{"birthDate":{"year":1990,"month":6,"day":15},"fullName":"Nguyễn Văn An","profileId":"pythagorean-vn-v1","profileVersion":"1.1.0","locale":"vi-VN"}
```

Only birthDate is required. FullName is optional; omitted/blank gives unavailable name metrics. The other fields select the currently sole allowlisted profile/version/locale. Integers are required for year/month/day. Optional `targetDate` is strict YYYY-MM-DD, a valid Gregorian date from birth through2199. If omitted, use captured referenceDate. No client-supplied results, birthGrid, cycles, normalizedName, referenceDate, hour or gender. Future birth dates rejected against a reference date captured once in Asia/Ho_Chi_Minh, returned in the response and injected into the pure engine.

Success returns `ok`, schemaVersion, experimental profile metadata, referenceDate, `contentVersion:null`, seven metrics, birthGrid, personal year/month/day cycles, normalized `nameAnalysis` for the user's calculation trace, capability states and policy warnings. Each available metric carries rawTotal, parts, reduction steps, rootValue and master status. No raw entered name is echoed; normalized name and numeric traces are private response data, not public catalog data.

Errors: `{ok:false,error:{code,message,fields:[{path,code,message}]}}`; 400 body/date/name/locale/client-result/JSON or corrupt/truncated/dictionary-dependent compressed body (`INVALID_BODY_ENCODING`), 404 unknown profile/version, 413 existing 256kb parser limit, 415 unsupported charset (`UNSUPPORTED_CHARSET`) or content encoding (`UNSUPPORTED_ENCODING`), 500 generic calculation failure. Parser errors use fixed messages and empty fields; internal error details are withheld. Numerology error translation is scoped so existing Tu Vi error shapes remain unchanged.

All numerology responses, including parser errors and CORS OPTIONS preflight responses, use `Cache-Control:no-store`. The existing logger records method/path without query/body; no name/date persistence is added. POST results must not be copied into URLs or shared browser storage by frontend. Production rate limiting, source-reviewed content and deployment are separate future release gates; this development implementation does not claim production hardening.

Advanced response: `birthGrid` has version1.0.0/layoutVersion3-6-9-v1/policyddmmyyyy-zero-excluded-v1, all9counts, presentDigits/missingDigits/ignoredZeroCount, layout and eight{id,digits,state}lines. `cycles` has version1.0.0/calendar-year-v1, exacttargetDate and year/month/day, personalYear/Month/Day metrics with ordinary reduction/trace. Invalid target returns400 INVALID_TARGET_DATE with fieldpath targetDate. Target default uses capturedreferenceDate exactly once; targetfuture is permitted, futurebirth is rejected. Client-injected advancedresults rejected400. Activeprofile1.1.0; explicit inactive1.0.0 returns404 to avoid silent version changes.
