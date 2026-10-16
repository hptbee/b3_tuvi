# T032 backend author handoff

Implementation is frozen for independent engineering review. No source artifacts, prior gates, natal table, frontend, master plan, or Git history edited by this author.

## Files

- backend/src/time/modernMajor.js: third exact-two-key profile, unchanged existing period/stem helpers, separate source gate, small inverse membership adapter. Requires complete existing palace mapping plus valid palace star arrays. Matches each selected source target by canonical name OR ID, then requires exactly one coherent known status/ID/name/category/list/palace link. All four ordered associations retained when palaces share. Failure closes whole capability including stem/branch. Old profiles never consult new binding or gain new fields.
- backend/src/knowledge/modernMajorMutagenBinding.js: deeply frozen exact reviewed algorithm (reuses frozen stem algorithm), 49 fixed artifact hashes (44 frozen inputs + manifest + decision + actual A/B + execution, deduplicating bundle), unchanged decision registry/replay, exact source/edition identity, existing stem prerequisite, cached defensive evidence result. Existing shared tuHoaMap import only read, not frozen or mutated; strict all-40-cell equality rechecked per new-profile call, including post-cache mutation withholding. No caller-supplied evidence/configuration.
- backend/test/modernMajorMutagen.test.mjs: independently justified source table/stem fixtures + engineering observed B3 physical metadata; 24 valid reachable solar inputs, 288 periods, 1,152 associations, 576 start/end queries, all 10 selected stems/40 cells/15 identities/101 shared-palace periods; wrong birth/view stem/order, old-profile equivalence/isolation, age/option boundaries, and explicitly synthetic selected metadata failure cases. B3 positions are not independently approved natal formula proof.
- backend/test/modernMajorMutagenBinding.test.mjs: 49 artifact mutation/removal pairs; actual reviews/replay; coherent table/condition/model/execution forgery; all40 cells, row shape and extra/missing keys; source identity; defensive cache; isolated loader/read failure, post-cache shared table mutation, base prerequisite, new-only rejection and both earlier profiles unaffected.
- backend/test/modernMajorMutagenApi.test.mjs: 395 real HTTP requests, all24 charts/288 periods, closed boundaries, strict request/override errors and ask wrappers, legacy/combined overlays, client chart rejection, no-store/private name log/body withholding and SQLite count unchanged.
- backend/scripts/runTests.mjs: +2 unit/+1 integration in existing Node runner, no framework/browser.
- docs/engineering/TEST_FIXTURES.md: classify new suites exactly once, distinguish source-comparative from observed regression and synthetic cases, no expert verification.

## Actual verification

1. `node backend/test/modernMajorMutagen.test.mjs` — PASS.
2. `node backend/test/modernMajorMutagenBinding.test.mjs` — PASS.
3. `node backend/test/modernMajorMutagenApi.test.mjs` — PASS,395 HTTP requests (`/tmp/t032/backend-mutagen-api.log`).
4. `node backend/test/fixtureClasses.test.mjs` — PASS.
5. `node backend/test/modernMajorStem.test.mjs` — PASS,24 charts/288 periods/654 queries/120 pure source-derived cases.
6. `node backend/test/modernMajor.test.mjs` — PASS,28 charts/336 periods/1,423 queries.
7. `cd backend && npm run test:ci` — exit0,58 unit +13 integration scripts,89.15% lines/90.00% branches,coverage floor PASS (`/tmp/t032/backend-ci.log`). New runtime module + binding100% lines. Coverage does not grant source approval.
8. Scoped `git diff --check` — PASS.

No browser launched. No commit/push performed. Parent owns final gates/review budget and delivery. Existing default/natal/classical/public interpretation/release semantics unchanged.
