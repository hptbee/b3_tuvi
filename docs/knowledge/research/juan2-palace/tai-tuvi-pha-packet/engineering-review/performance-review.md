# T028 independent performance specialist — pass 9

Reviewed current dirty/untracked T028 feature on base `b33a2d55c4fb6a66124f31d58a69ddbec79fe5d4`, specifically the 18-line finite `interp-quanshu-tai-tuvi-pha-quan-host` descriptor addition in `backend/src/knowledge/sourcePalaceBinding.js` and new claim/evidence data. Read AGENTS.md, canonical performance-reviewer role, nodejs-runtime skill and code-review performance guidance. No confirmed medium-or-higher performance finding; no R2501+ finding issued. This is a specialist report, not a declaration of the parent review loop outcome. No product file edits or Git mutations performed.

## Actual production request probes

Created a read-only `git archive b33a2d5` extraction at `/tmp/t028/perf-baseline`, without switching branches. Compared baseline/current in alternating order, three fresh processes per input/tree, each with one cold production `analyzeChartRequest` and 250 warm requests plus public response serialization. Wrapped `fs.readFileSync` before importing the production modules using `syncBuiltinESMExports`; reset counters after import, so module import time is excluded.

Inputs are independent packet fixtures T028/04/positive_Mùi_adverse (8 February 1980, hour 4, male) and T028/01/negative_missing_pha (1 January 1980, hour 0, male). All 3,012 requests returned 200. On current positive the old Tử Vi/four-adverse claim and new Tử Vi/Phá Quân claim both remained eligible; both baseline/current preserve old eligibility. New claim is ineligible for the nonmatch and absent from baseline.

| Metric | Baseline positive | Current positive | Baseline nonmatch | Current nonmatch |
| --- | --- | --- | --- | --- |
| Cold request range, ms | 27.17–29.64 | 29.39–30.96 | 27.50–28.87 | 29.43–32.74 |
| Warm per-process median range, ms | 0.786–0.818 | 0.819–0.877 | 0.777–0.820 | 0.805–0.884 |
| Warm per-process p95 range, ms | 1.46–1.61 | 1.51–1.58 | 1.52–1.57 | 1.48–1.63 |
| Serialization median range, ms | 0.154–0.160 | 0.158–0.161 | 0.175–0.182 | 0.181–0.191 |
| Public response bytes, UTF-8 | 40,718 | 41,435 | 48,356 | 49,100 |
| Cold evidence reads | 47 | 56 | 47 | 56 |
| Cold evidence bytes read | 408,883 | 488,957 | 408,883 | 488,957 |
| Warm synchronous reads, 250 requests | 0 | 0 | 0 | 0 |

The exact cold increment is nine reads and 80,074 bytes overall, including registry growth read through pre-existing per-subject loaders. New evidence files are read once on first binding verification. Existing module-private `stored` Map remains bounded by the five fixed source-palace subject IDs; it is not keyed by birth/request inputs. Repeated warm requests across different positive/nonmatch probes added no synchronous file I/O.

An additional fresh-process probe instrumented built-in `crypto.createHash` before module import. Baseline cold positive used 28 hashes, current 36; all 250 subsequent warm requests used zero hashes on both trees. Source inspection accounts for the added eight: five evidence digests, two canonical review-document pins, and existing decision replay span verification. No review JSON serialization or evidence hashing repeats on warm requests. Current public serialization gained 717 bytes for coexisting positive and 744 for nonmatch, bounded claim applicability/provenance metadata. Assertions confirmed no internalProse fields, raw source span, reviewer source assessment, required anchors or fixture IDs were emitted in the public API response.

## Assessment and limits

The first request still performs synchronous fixed evidence I/O/JSON verification on the event loop. This is pre-existing architecture. The measured finite increment here does not establish a material new regression or justify speculative worker/cache refactoring. Cold current ranges increased modestly; warm/serialization ranges substantially overlap. There is no repository SLA to invent. No new per-request evidence reload, unbounded cache, request fan-out, database query, network fetch or raw artifact response path appears in this diff.

Measurements use local Node v24.19.0, a synchronous production analyzer call, and OS file cache. They do not establish deployment throughput, concurrent load, HTTP/network latency, memory leak absence or hardware-independent timing limits. No flaky timing assertion or optimization was added.

Reproduction/evidence: `/tmp/t028/perf-probe.mjs`, `/tmp/t028/perf-run.mjs`, `/tmp/t028/performance-measurements.json`, `/tmp/t028/perf-hash-probe.mjs`, `/tmp/t028/hash-current.json`, `/tmp/t028/hash-baseline.json`.
