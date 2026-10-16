# T027 independent performance review — pass 6

Scope: new `interp-quanshu-phuc-co-cu-host` registration, accepted five-hash comparison and two canonical review JSON pins in `backend/src/knowledge/sourcePalaceBinding.js`; current working tree on `codex/tuvi-phuc-co-cu-interpretation`, compared with committed base `300bcd6`. No product edits or Git mutations performed. Reviewed AGENTS.md, canonical performance-reviewer role, nodejs-runtime and performance dimension of code-review skills. No findings of medium or higher severity confirmed; no R2201+ finding issued. This report does not declare the parent review loop outcome.

## Actual request-path measurements

Used Node `performance.now()` around synchronous `analyzeChartRequest` and public `JSON.stringify(response.body)`. Fresh processes imported the analyzer before the cold request; import time is excluded. Wrapped `fs.readFileSync` with `syncBuiltinESMExports()` before importing the production code and reset counts after import. Compared unchanged current tree against a read-only `git archive 300bcd6` extraction under `/tmp/t027/perf-baseline`, without switching branches or editing tracked files.

Replayed independent packet fixtures `T027/07/positive_cohost_clean` (8 January 1980, hour 10, male) and `T027/01/negative_cu_only_in_relation` (8 January 1980, hour 2, male). Each has five independent fresh processes and 250 subsequent warm requests per process. Interleaved baseline/current execution order to reduce ordering bias. Actual production API returned 200 in all 5,020 measured requests; new gate true for positive and false for negative, absent at baseline as expected.

| Metric | Baseline positive | Current positive | Baseline nonmatch | Current nonmatch |
| --- | --- | --- | --- | --- |
| Cold request range (ms) | 23.63–31.91 | 26.16–33.33 | 24.52–30.43 | 27.90–48.83 |
| Warm per-process median range (ms) | 0.677–0.743 | 0.735–0.849 | 0.702–0.886 | 0.788–0.818 |
| Warm per-process p95 range (ms) | 1.36–1.73 | 1.43–2.01 | 1.47–2.48 | 1.45–2.57 |
| Serialization median range (ms) | 0.151–0.153 | 0.147–0.160 | 0.149–0.176 | 0.152–0.158 |
| Public response UTF-8 bytes | 38,713 | 39,376 | 39,197 | 40,643 |
| Cold synchronous evidence reads | 38 | 47 | 38 | 47 |
| Cold evidence bytes read | 326,785 | 408,883 | 326,785 | 408,883 |
| Warm synchronous reads, 250 requests | 0 | 0 | 0 | 0 |

Current cold request adds exactly nine fixed evidence reads and 82,098 bytes overall. This includes the new finite evidence set plus increased claims registry bytes read by existing per-subject loaders. Every new evidence file is loaded once on initial subject verification; no new file reads occurred across 2,500 measured current warm requests. Source inspection confirms the existing module-private `Map` is keyed by the finite subject IDs, not dates/requests. The new document pins and five digest checks run only during this initial cached binding verification. Warm requests perform the existing bounded deep equality claim comparison, not review JSON hashing.

## New canonical JSON/hash cost

The two new parsed review documents serialize to 7,077 and 8,211 UTF-8 bytes (15,288 total). Isolated 1,000 replays of the exact two `sha256Text(JSON.stringify(review))` operations measured median 0.0577 ms, p95 0.0955 ms, maximum 0.9173 ms. This is synthetic isolated overhead evidence, not an end-to-end speed claim; in actual requests it occurs once per process subject verification, not on warm requests. No fixture/source context or raw dossier is serialized into the public response. Additional public response bytes are bounded claim applicability/provenance metadata and vary with existing eligible-versus-ineligible metadata.

## Assessment and limits

The first request still performs synchronous fixed evidence I/O and hashing on the event loop. That is pre-existing architecture, and the measured increment for one finite subject does not establish a material new regression or justify speculative caching/worker changes. Current median cold timings were roughly 3–5 ms above baseline in these local runs, with a single 48.83 ms current nonmatch outlier; warm and serialization ranges overlap substantially. There is no repository SLA to claim or invent. No unbounded collection, per-request evidence reload, retained request-key cache, extra network request, or growing response data path was introduced by this diff.

Measurements are local single-process CPU/file-cache observations; they do not establish deployment hardware throughput, concurrent load behavior, peak RSS, or an HTTP/network latency guarantee. Those unmeasured properties are not asserted. No flaky timing test or optimization was added.

Reproducible probes and raw results: `/tmp/t027/perf-probe.mjs`, `/tmp/t027/perf-run.mjs`, `/tmp/t027/performance-measurements.json`. The initial two exploratory probe executions are separate from the repeated table dataset.

Runtime: Node v24.19.0. Base/HEAD: `300bcd6e89f7412cbf85682dd69c7f470e7b128d`. Reviewed production diff SHA-256: `8e1e124e31e29c4d60966faf2c730e66a0ebffc25846acf964c552cccb50c497`.
