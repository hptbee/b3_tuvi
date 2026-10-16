# T025 independent performance review — technical pass 2/12

Scope: current modern-major binding and major capability/analyze request path against base `4c1761e`, including untracked new files. Read AGENTS, canonical performance-reviewer role, code-review, verification, and nodejs-runtime skills. No source/product edits. This report does not declare the review loop outcome.

## Findings

No confirmed medium-or-higher performance finding. No R1801+ blocker allocated.

The new fixed-artifact verifier performs synchronous disk reads, hashing, decision validation and JSON parsing once per process on the first explicitly enabled major-period request (`modernMajorBinding.js:231–240`). This is real cold-request event-loop work, not a repeated hot-path operation. It is bounded by fixed locally compiled artifact names and cached whether approved or denied. The gate is not called at all when majorPeriod is omitted (`modernMajor.js:60`). It continues the explicitly accepted fixed-evidence cold-start pattern rather than adding unbounded user-controlled evidence processing. Observed cold cost below is a deployment consideration; without an agreed latency target or demonstrated serving regression, startup prewarming/offloading would be a speculative optimization, not a required fix.

## Actual probes

Commands executed successfully from `/workspace/b3_tuvi`:

- `node /tmp/t025/performance-probe.mjs omitted > /tmp/t025/performance-omitted.json`
- `node /tmp/t025/performance-probe.mjs major > /tmp/t025/performance-major.json`
- `node /tmp/t025/performance-probe.mjs combined > /tmp/t025/performance-combined.json`
- Isolated `node --input-type=module` binding/mutation probe, recorded in `/tmp/t025/performance-cache.json`.

The reusable probe instruments `node:fs.readFileSync`, updates builtin named exports, dynamically imports actual `analyzeChartRequest`, and uses realistic DOB 15 June 1990 08:00 male. Each mode runs in a fresh process: one cold analysis, then 100 warm analyses and 100 actual JSON serializations. Combined mode enables major age16, minor age16 and annual Tí. Every actual analysis returned HTTP-layer result status200 and the expected placed/omitted capabilities. No database or browser was needed for this scoped synchronous analyzer path.

| Probe | Omitted | Major only | Major + minor + annual |
| --- | ---: | ---: | ---: |
| First actual analysis, ms | 26.965 | 35.386 | 53.324 |
| Warm analysis median, ms | 0.903 | 0.874 | 1.116 |
| Warm analysis p95, ms | 1.787 | 1.973 | 2.377 |
| Warm JSON median, ms | 0.177 | 0.173 | 0.171 |
| Response JSON bytes | 43,811 | 43,801 | 43,970 |
| Cold major evidence reads/bytes | 0 / 0 | 50 / 1,100,170 | 50 / 1,100,170 |
| Warm filesystem reads across 100 analyses | 0 | 0 | 0 |

Major source-registry read is additional to the 50 modern-decadal files: 18,750 bytes once. The fixtures JSON is hashed as fixed inert text, not parsed/replayed into every chart. The largest fixture artifact is669,296 bytes; evidence data is not included in responses. No live upstream fetch or source execution occurs.

The independent binding-only fresh-process probe measured 25.472ms cold including51 reads, followed by 10,000 cached verified calls in2.859ms with **zero additional reads**. A caller changing the returned object's `ok`/`reason` did not alter subsequent success. Nested algorithm object/array/row freezing was asserted. Source and profile constants are immutable; cache contains only the small result object, not per-request chart data. This measurement is deliberately reported separately; it must not be arithmetically treated as identical to the analyzer timing difference because import/JIT/shared validation state differs between probes.

## Mechanism inspection

- Missing/invalid explicit profile returns before evidence I/O.
- Evidence approval/denial is cached; defensive return copy prevents caller cache corruption.
- No per-birth/age chart cache or growing map; no chart retained by the gate.
- Chart input checks, modern period math, and shared mapper operate on the existing fixed12-palace chart. Two layout validations intentionally enforce valid natal layout even for closed age ranges, then validate selected placement; their cost is bounded and not a measured bottleneck.
- New evidence remains server-side; response size is effectively unchanged between these three current feature states. This comparison is not a claim that response size is identical to base main.
- Existing interpretation/minor cold gates account for additional cold reads. They were observed rather than incorrectly attributed to major. Omitted first analysis read38 other files326,785bytes; combined enabled the existing minor's13 files918,065bytes separately.

## Limits

These are local diagnostic measurements, not an SLA, HTTP concurrency benchmark, production-storage test, heap-leak proof, or throughput claim. No timing assertions were added. No full feature/security/UI review was performed. The initial guessed nodejs-runtime skill path was absent; locating and reading its actual backend path succeeded before conclusions. No optimization is requested from this evidence.
