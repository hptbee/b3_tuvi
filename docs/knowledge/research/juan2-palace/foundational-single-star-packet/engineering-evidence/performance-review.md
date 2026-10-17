# T037 independent performance review

Scope: technical reviewer pass 4; base `98496ca93c2097cacc59d53d1886695446f9fb03` versus the current T037 four foundational annotations, fixed source binder registration, and associated tests. T038 family packet has no runtime registration and is excluded. No product files changed by this reviewer. No loop verdict is assigned here.

Finding count: **0 CONFIRMED / EVIDENCED RISK findings**. No R4601+ finding is warranted by the measurements. This is a bounded annotation increase; measured cost does increase, but no SLA or load requirement establishes that this is a material regression requiring optimization.

## Method and actual evidence

Applied canonical performance-reviewer role, nodejs-runtime and verification skills, review-loop performance routing, and project unit-first policy. Base source/knowledge snapshot extracted using `git archive` into ignored `performance-baseline/`; production source in the working tree was not replaced. Probe: `.b3/autodev/interpretation-expansion/t037-performance-probe.mjs`. Node v22.23.2, local Windows host; no browser, external load, or production timing claim.

Probe imports each version in a fresh process, instruments `fs.readFileSync` and `crypto.createHash` through synchronized builtin ESM exports, verifies all approved claims, repeats binding verification 10,000 times per claim, then generates and normalizes the same 112 independently frozen fixture inputs for both versions. It measures `JSON.stringify(interpretChart(chart))` over seven 112-chart rounds after warming and records public/internal structured result bytes. JSON measurements refer to the pipeline result, not the entire HTTP envelope or network latency.

Commands executed:

- `node backend/test/sourcePalaceFoundational.test.mjs`: exit 0; all 112 actual chart fixtures, immutable accepted evidence, cold loader failures, unchanged original seven bindings, and actual coverage assertions succeeded. Original seven subset still matches 92/1,152; total 419/1,152, 472 claim hits, 53 charts with overlap.
- `node .b3/autodev/interpretation-expansion/t037-performance-probe.mjs .b3/autodev/interpretation-expansion/performance-baseline`: three fresh-process samples, exit 0 each.
- `node .b3/autodev/interpretation-expansion/t037-performance-probe.mjs .`: three fresh-process samples, exit 0 each.
- `node backend/test/sourcePalaceFoundationalApi.test.mjs`: initial restricted execution failed `connect EACCES 127.0.0.1`. Authorized elevated rerun exited 0: 112 actual fixture HTTP responses, 128 requests total, production client validators, no public/internal prose leakage, unchanged closed AI/fortune gates, malformed boundaries, no-store, privacy, and no database writes.

## Measurements and interpretation

Cold binding verification accepts 7 baseline claims versus 11 current claims. Baseline reads 65 files totaling 588,702 bytes with 44 hash calls; current reads 101 totaling 1,783,256 bytes with 76 hash calls. These counts are stable across all three samples. Shared packet/review files are read independently for each of the four subjects during that first verification; the existing cache is keyed by finite registered claim ID. Additional cold cost is 36 synchronous reads, 1,194,554 bytes and 32 hashes. Baseline cold elapsed samples: 235.47 ms (initial disk/JIT outlier), 13.97 ms, 14.37 ms. Current: 24.79 ms, 26.10 ms, 24.15 ms. Timing is observational and includes OS cache/JIT effects; no startup or concurrent-load SLA is asserted.

Warm binding baseline: 70,000 calls in 148.21 / 151.36 / 152.96 ms; current: 110,000 calls in 212.87 / 215.59 / 214.84 ms. This is roughly 2.1–2.2 microseconds versus 1.9–2.0 microseconds per call; different subject mixes preclude a speedup claim. **Both versions perform zero synchronous file reads and zero hashes for all those warm calls**. Warm pipeline rounds likewise perform zero reads/hashes. Code inspection confirms cached results are copied and caller claims are compared with the separately loaded stored claim; the mutation and evidence-unavailable unit assertions passed. No cache weakening is recommended.

Median per-chart warm pipeline plus serialization for each run: baseline 0.510 / 0.540 / 0.504 ms; current 0.678 / 0.705 / 0.680 ms. Median across runs is approximately 0.510→0.680 ms (+0.171 ms, ~33%). This represents evaluating and serializing four additional annotations for the same valid charts, rather than equivalent coverage at identical catalog size.

Public pipeline JSON mean 39,203.48→42,720.34 bytes (+3,516.86, ~8.97%); range 34,746–47,697→39,057–50,532 bytes. Internal-enabled pipeline JSON mean 39,228.55→43,387.95 bytes (+4,159.39, ~10.60%); range 34,746–47,697→39,773–51,585. These are bounded structured provenance and withheld-gate records, with accepted source-comparative wording included only under internal options. Every measured public statement retains null prose and false release flags. HTTP tests separately confirm the actual API omits internal prose and passes existing response validators.

The changed binder adds fixed subjects and evidence-path selection to the existing first-use replay/cache design. There is no new per-request source I/O or rehash, unbounded cache cardinality, network fetch, or growth proportional to request count. The finite cold packet rereads and ~0.17 ms warm local increment do not justify a speculative cache redesign. Production throughput, p95/p99, concurrent startup and network/compression behavior were not measured; this report makes no claims about them.
