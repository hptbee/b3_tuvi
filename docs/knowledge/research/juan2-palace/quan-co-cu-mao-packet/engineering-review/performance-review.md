# T029 independent performance review — invocation pass 12

Scope: current dirty/untracked `codex/tuvi-quan-co-cu-mao-interpretation` compared with committed base `36799164a26396ccde485cfa266dab81bd4e7e6d`. Reviewed AGENTS.md, canonical performance-reviewer role, nodejs-runtime and performance dimension of code-review skills. This is a performance-only specialist report, not the parent review-loop outcome. No product edits, Git mutations, or delegated reviews were performed. No concrete medium-or-higher performance finding was confirmed; no R2801+ ID issued.

## Actual measurements

Used production `analyzeChartRequest` in fresh Node v24.19.0 processes, comparing current tree with a read-only `git archive 3679916` extraction under `/tmp/t029/perf-baseline`. Wrapped synchronous `fs.readFileSync` before ESM imports via `syncBuiltinESMExports`, then reset read counters after analyzer import. Import time is excluded from cold request timings. Three fresh processes per tree and fixture, with interleaved baseline/current ordering, each executed one cold request and 250 subsequent warm requests plus public JSON serialization. All 7,530 requests returned 200. New Mão eligibility matched the two positive and three negative chart predicates; old Dậu eligibility remained true only for the Dậu fixture in both trees. Public statements retained null prose and omitted internalProse.

| Fixture | Cold baseline/current ms range | Warm median baseline/current ms range | Serialization median baseline/current ms range | Public bytes baseline/current |
| --- | --- | --- | --- | --- |
| clean | 29.122–30.476 / 31.248–31.393 | 0.798–0.883 / 0.840–0.860 | 0.157–0.168 / 0.160–0.164 | 41,585 / 42,369 |
| adverse | 28.661–35.083 / 32.249–34.107 | 0.872–0.894 / 0.889–0.995 | 0.164–0.165 / 0.163–0.176 | 43,907 / 44,691 |
| dau | 28.800–33.672 / 30.294–35.335 | 0.879–0.921 / 0.898–1.001 | 0.159–0.161 / 0.163–0.169 | 41,088 / 42,782 |
| female | 28.914–32.149 / 29.978–30.567 | 0.905–0.995 / 0.898–0.919 | 0.164–0.169 / 0.165–0.171 | 43,548 / 44,394 |
| normal | 26.816–33.315 / 29.284–31.358 | 0.859–0.978 / 0.874–0.946 | 0.159–0.166 / 0.161–0.181 | 42,919 / 43,768 |

Fixtures are actual approved-packet inputs: T029/05 Mão without the named four adverse stars, T029/08 Mão with an adverse star, T029/04 Dậu old-only, T029/09 valid female Mão with neither required star, and T029/01 normal nonmatch. Their source/fixture correctness remains the other reviewers' scope. Timings measure local synchronous function execution, not HTTP/network latency, deployment throughput or an SLA.

## Bounded I/O and JSON/hash work

Every baseline cold request read 56 fixed evidence files, 488,957 bytes; every current cold request read 65, 577,833 bytes. The increment is exactly nine reads and 88,876 bytes, including the new finite subject evidence and increased shared registry reads in existing loaders. All subsequent warm requests performed zero synchronous reads, including 3,750 current warm requests. Inspection confirms module-private `stored` is keyed by the finite source claim ID; neither request inputs nor dates introduce growing cache entries. Existing evidence parsing, five digest checks and canonical review-document pins execute once for this subject per process. Warm callers retain the existing bounded deep-equality check.

The two new review documents canonically serialize to 5,930 and 7,961 bytes (13,891 total). An isolated 1,000-replay probe of both exact `sha256(JSON.stringify(review))` operations measured median 0.0543 ms, p95 0.1284 ms, maximum 1.1608 ms. This is synthetic isolated overhead, not an end-to-end request speed claim; actual request verification is cached.

Additional public response data is bounded applicability/provenance metadata for one subject. Raw evidence contexts, source packets and internal approved prose are not serialized by the public analyzer. The source production diff is an 18-line finite descriptor addition; it introduces no request-time network work, new looping logic, cache framework or new collection growth.

## Assessment and limits

The existing first-request architecture performs synchronous evidence I/O and hashing on the event loop. The measured finite increment does not establish a material regression requiring optimization: cold ranges overlap, warm medians stay around one millisecond and serializer medians around 0.16–0.18 milliseconds in this environment. No repository timing SLA was supplied or invented, and no flaky timing assertion or speculative optimization is recommended. Deployment-scale concurrency, peak RSS and uncached physical-disk behavior were not measured; no claims are made about them. Existing source-book, default-formula, public-interpretation and release restrictions remain unchanged.

Reproducible probes/results: `/tmp/t029/perf-probe.mjs`, `/tmp/t029/perf-run.mjs`, `/tmp/t029/performance-measurements.json`, `/tmp/t029/performance-summary.jsonl`, `/tmp/t029/perf-hash.json`. The first exploratory dataset was replaced by the final repeated dataset including explicit old-Dậu assertions. Production binder diff SHA-256: `50b919bad4520dc5bcc4c8a93d4d40cfff6f3c9cc6c96bcde160e98dd52459f8`.
