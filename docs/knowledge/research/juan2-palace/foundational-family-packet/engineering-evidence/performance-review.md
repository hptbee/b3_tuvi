# T038 independent performance review

Scope: technical reviewer pass 9, base `6c947c3954b1aa1ede504cd7897277d5f63e6a6a` versus the staged/current T038 family note addition. The runtime diff is three finite subjects and their evidence resources in `sourcePalaceBinding.js`; `interpretationBinding.js` and the interpretation pipeline have no diff. Applied the canonical performance-reviewer role, nodejs-runtime and verification skills, engineering/evidence/portability/verification rules, and project unit-first testing policy. No product or Git index files were edited by this reviewer. Parent owns the overall gate.

Finding count: **0 CONFIRMED / EVIDENCED RISK findings**. R5201+ remains unused. Measured costs increase with the three additional claims; there is no named SLA or load requirement establishing a material regression that warrants changing the existing cache design.

## Actual method and checks

Node v22.23.2 on the local Windows host. `git archive` extracted base `backend/src` and `docs/knowledge` into ignored `.b3/autodev/interpretation-expansion/t038-performance-baseline/`; exact base `backend/package.json` was also restored there for correct ESM interpretation. Baseline production files were never substituted into the working tree. Helper `.b3/autodev/interpretation-expansion/t038-performance-probe.mjs` adapts the prior probe explicitly to the new 84 family fixtures and the actual 11 versus 14 accepted binding counts.

The helper instruments `fs.readFileSync` and `crypto.createHash` with synchronized builtin ESM exports. Each version runs in a fresh process, verifies all registered approvals once, then repeats successful binding checks 10,000 times per accepted claim. Both versions generate and normalize the same 84 frozen valid family inputs. After warming, seven rounds each measure `JSON.stringify(interpretChart(chart))`; public and internal-option result byte sizes are recorded separately. These are pipeline result timings and sizes, not full HTTP envelope/network/compression measurements. Public measured statements are asserted to retain null prose and false public release flags.

Executed:

- `node backend/test/sourcePalaceFamily.test.mjs`: exit 0. Actual 84 fixtures, immutable evidence, cold loader failure closure, and fixed cohort assertions succeed. The test independently asserts 647/1,152 total matches, 770 claim hits, 123 charts with overlap, and preservation of the original eleven-claim 419-chart subset.
- `node .b3/autodev/interpretation-expansion/t038-performance-probe.mjs .b3/autodev/interpretation-expansion/t038-performance-baseline` and the same helper with `.`: three alternating fresh-process pairs after correcting base package metadata; every command exit 0. Raw results: `t038-performance-samples-corrected.jsonl` in the same ignored directory.

An earlier three-pair run omitted base package metadata and emitted Node's typeless-module warning. Those samples remain in `t038-performance-samples.jsonl` for traceability and are excluded from the following timing summary. Read/hash counts and JSON sizes were identical. No failed runtime test is being converted into success.

## Measurements

Cold binding verification accepts 11 base versus 14 current claims. Every corrected sample has base 101 reads / 1,789,809 bytes / 76 hashes and current 128 reads / 2,639,669 bytes / 100 hashes. Increment: 27 synchronous reads, 849,860 bytes and 24 hashes, confined to first verification of finite registered evidence. Base cold elapsed samples are 25.627 / 24.317 / 24.205 ms; current 32.446 / 31.740 / 31.293 ms. Median observed increment is about 7.42 ms. OS cache/JIT and local host effects limit interpretation; this is not a startup SLA or concurrency guarantee.

Warm verification performs **zero reads and zero hashes** in both versions. Base 110,000 calls take 214.362 / 214.461 / 214.080 ms; current 140,000 calls take 272.581 / 261.373 / 263.435 ms. This is roughly 1.95 microseconds per base call and 1.87–1.95 microseconds per current call. Different claim mixes preclude a speedup claim. Warm pipeline rounds likewise record zero reads and zero hashes.

Per-process median warm pipeline-plus-serialization costs per chart: base 0.71733 / 0.70370 / 0.69338 ms; current 0.85519 / 0.83633 / 0.83628 ms. Median across processes is 0.70370 to 0.83633 ms: approximately +0.133 ms, or +18.85%, while evaluating/serializing three additional notes for the same valid inputs.

Public pipeline JSON mean rises from 41,034.20 to 43,186.63 bytes (+2,152.43; +5.25%). Base range 37,970–46,191 bytes; current 40,121–48,342. Internal-option mean rises from 41,192.61 to 44,015.51 (+2,822.90; +6.85%); ranges 37,970–46,191 and 40,737–49,075. These sizes reflect structured gated provenance plus internally authorized source wording, not released public narration.

## Interpretation and limits

Inspection confirms the existing cache is keyed by finite allowlisted subject IDs; new code only registers three fixed subjects. First-use replay still synchronously reads/revalidates packet evidence per subject. This bounded cold behavior is measurable above, and the existing cache removes the reads/hashes on subsequent requests. No new network fetch, repeated source I/O on warmed requests, cache cardinality proportional to request count, or alternate serialization implementation was introduced. No optimization is recommended without a corresponding measured deployment requirement.

No browser was run because this unit changes backend finite evidence registration. This reviewer did not rerun the full CI or HTTP suite already assigned to other review units. Production throughput, concurrent startup, p95/p99, memory retention under sustained traffic, network latency and compression were not measured, so no claims are made for them. The requested local before/after cold and warm evidence was produced successfully; overall review-loop status remains the parent's decision.
