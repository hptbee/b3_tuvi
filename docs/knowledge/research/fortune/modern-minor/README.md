# Explicit-age modern Tiểu hạn profile evidence

This is the separately named modern software profile `iztro-pinned-age1-sex-triad`, source `iztro-modern-software`, edition `iztro-modern-2f00e2ab0c80`. It is a restricted branch/sex/supplied-age projection, independently reviewed against iztro commit `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`. It does not approve classical Quanshu, authenticate a historical edition, derive calendar age or certify the application's natal chart as a complete iztro astrolabe.

## Scope and actual decisions

The [immutable proposed packet](review-bundle.json), [complete function span](source-span.txt), [full context](review-context.txt), [comparative fixtures](fixtures.json), and [payload provenance](provenance.json) retain the exact reviewed bytes. A proposal remains marked `PROPOSED_NOT_APPROVED`; the separate [decision](decision.json) records actual acceptance. [Raw review A](review-a.json) and [raw review B](review-b.json) are the unedited judgments of gpt-6.1-sol and gpt-6-astra. [Execution metadata](execution.json) is captured separately by the orchestrator; unknown host build IDs remain null.

Both models returned `MATCH` for the exact algorithm and compatibility scope after independent source/fixture verification; the existing comparator replays `AI_ACCEPTED`. No interpretation was reviewed, and public predictions, historical authentication and expert/book verification remain false/withheld.

The accepted parameters are four birth-year triad anchors, age 1 at the anchor, one palace per age, male forward/female reverse, twelve-palace wrap and ages 1–120. Input branch, sex and nominal age are explicit validated inputs to this projection. The product uses its own server-calculated lunar birth-year branch and validated sex; the user supplies nominal age. Neither an upstream calendar boundary nor an age-today convention is inferred. Strict rejection of malformed inputs is the proposed product adapter contract, not a claim that upstream rejects those values.

## Independent evidence and hash conventions

Pre-review independent verification covered 120 endpoint cases, 2,880 all-age comparisons, 24 real natal chart layouts, eight Tết boundary projections and twelve leap-month projections; see the [verification summary](independent-verification-summary.json). These are engineering/comparative witnesses, not authenticated historical or empirical outcome goldens. Both actual models independently reproduced the source parameters and fixtures before approval.

Source/context/fixture file digests include raw UTF-8 terminal LF. Algorithm and compatibility digests use compact `JSON.stringify` property/array order. `fixturesJsonDigest` separately identifies compact JSON, while `fixturesDigest` identifies the complete pretty-printed fixture file. Model quotations omit only terminal whitespace to meet the unchanged comparator contract.

The nineteen original payloads are not an exhaustive list of upstream imports. Both reviewers independently located and checked three additional en-US locale/alias dependencies. Their identical bytes are preserved as inert [branch locale](supplement/src__i18n__locales__en-US__earthlyBranch.ts.txt), [locale index](supplement/src__i18n__locales__en-US__index.ts.txt), and [aliases](supplement/src__i18n__starAliases.ts.txt). The decision maps these persisted files to the exact pinned upstream paths and hashes; they are explicitly outside the original context digest. Actual model responses retain their original supplemental paths.

The [MIT notice](LICENSE.txt) is preserved. Context contains inert original HTML/code as source-review data; none is imported, installed, executed or served as application assets. The complete primary `palace.ts` artifact hash intentionally differs from the bounded reviewed function-span hash. Direct raw HTTP failed with DNS `EAI_AGAIN` for one reviewer; pin verification used actual Git objects and is not described as a successful HTTP fetch.

## Runtime boundary

A fixed profile-specific verifier must bind the source/edition, actual distinct model records, execution identities, exact algorithm/compatibility/fixtures, supplemental bytes and existing comparison result before placement. Public API requests cannot supply evidence or approval. Omitted profile/age means no placement; calendar-age derivation and classical/default fortune capabilities retain their separate gates. Existing annual placements remain independent of the supplied nominal age.
