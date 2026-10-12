# Remediation plan

Small PRs. No repository-wide rewrite. No formula edits, no provenance upgrades, no production SQLite migration, no merge to `main` until reviewed.

Current integration: `origin/main` tree already equals Sprint 7 `608a5ca`. Do not open a PR whose only job is to replay PR #5, #8, #9, or #6.

## PR A — Fast-forward local main

- dependency: none
- scope: `git merge --ff-only origin/main` on a clean local `main`
- acceptance: local `main` is `9999610` or a later tip with the same modules present (`analyze.js`, `timeEngine.js`, `narrator.js`)
- verification: `git rev-parse HEAD` and `git merge-base --is-ancestor 608a5ca HEAD`
- risk: none if the worktree is clean

## PR B — Trust boundaries (F002, F003)

- dependency: PR A
- scope: `interpretationRoutes.js`, `analyze.js`, tests
- acceptance: `/ask` returns 400 when `analysis` is client-supplied. `/analyze` either rejects `normalizedChart` or marks `chartSource: 'client'` and cannot return `eligible_claims_present` for that path. Birth-input analyze still returns 12 palaces and `prose: null`
- verification: new negative tests plus `npm test`
- risk: low

## PR C — Eligibility (F001)

- dependency: PR B
- scope: `eligibility.js`, pipeline tests
- acceptance: missing `formulaComparisonStatus` is not eligible. A flagged claim does not become eligible when the palace has no stars that satisfy a stated condition. Live pilot claims stay ineligible
- verification: `node test/interpretationPipeline.test.mjs` and `npm test`
- risk: low. Does not touch `rulesV2.json`

## PR D — Do not title unverified copy as luận giải (F005)

- dependency: none relative to B/C; can run in parallel after A
- scope: `CachCucPanel.jsx` label only, unless the DTO prefix is the chosen fix in `toMatchDto` for display
- acceptance: `matching_ok` text is not under a "Luận giải" heading. Star-match disclaimer remains. No combination formula string is rewritten
- verification: frontend lint and build. Browser check of the combination panel if a chart can be generated locally
- risk: visible copy change

## PR E — Knowledge gate on interpret (F004)

- dependency: PR C
- scope: call `validateKnowledgeBundle` from the interpretation entry, fail closed
- acceptance: a bundle with `formulaCheckedAgainstSource: true` or bibliographic `primary` without an authenticated edition does not produce statements
- verification: knowledge validator tests and interpretation tests
- risk: low if the live bundle already validates, which `knowledgeValidate.test.mjs` currently says it does

## PR F — Test and doc sync (F008, F011, F009, F010)

- dependency: C for the eligibility fixture; otherwise independent
- scope: one shared `canhGio` helper, URL log without query, section 10 of `AUTODEV_MASTER_PLAN_V2.md` pointed at the later sprint sections, a coverage assertion that is not only "the report matches its own input"
- acceptance: V1 master plan file is untouched. Generate and analyze still agree on one birth sample
- verification: `npm test`, frontend lint
- risk: low

## Not in this sequence

- Editing `tuviRules.mjs` or `rulesV2.json` for the 7 CONFLICT / 2 PARTIAL / 1 NOT_IMPLEMENTED pilot rows. Needs a domain decision per rule.
- Production knowledge migration.
- Public AI, login, chart history, payments.
- Deleting `insertHoroscope` or the legacy matcher.
