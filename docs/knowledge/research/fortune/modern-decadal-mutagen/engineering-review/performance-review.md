# T032 independent performance review — technical pass 7

Target: base `655c2190e017c710ea0dcad08e2c3d722138a339` plus the current tracked/untracked nonignored T032 implementation. Reviewer read root AGENTS, canonical performance reviewer and review-loop strategy, project unit-first testing policy, new binding, period mapping, and frontend diff. Read-only review: no repository edits, browser, worktree, checkout, commits or gate declaration. Measurement scripts/results live in this directory; parent owns final quality gate.

## Finding result

No CONFIRMED or EVIDENCED RISK performance finding. No R3601+ IDs allocated. No optimization proposed. This is a measured performance assessment, not source formula approval or an SLA/capacity certification.

## Measurements and correctness

Node `v24.19.0`; read-only `git archive` baseline in `/tmp/t032/performance-baseline`. Fresh-process runs instrument synchronous fs reads, createHash calls and shared 10x4 table deep comparisons through `syncBuiltinESMExports`. Imports complete before cold-request counters start; these numbers describe request-time initialization, not full process boot. Each mode checks one cold and 400 warm full analyzer calls, including serialization separately. Requests are source-comparative fixtures, not expert-verified domain goldens.

| Current mode | Cold request ms | Warm median / p95 ms | New evidence reads | Warm reads / hashes | Response bytes |
| --- | ---: | ---: | ---: | ---: | ---: |
| omitted | 34.48 | 0.899 / 1.580 | 0 | 0 / 0 | 48,263 |
| branch | 43.87 | 0.990 / 1.735 | 0 | 0 / 0 | 48,242 |
| stem | 72.06 | 1.374 / 2.323 | 0 | 0 / 0 | 48,303 |
| new placed | 63.57 | 0.889 / 1.815 | 49 | 0 / 0 | 49,130 |
| before first | 60.20 | 0.958 / 1.788 | 49 | 0 / 0 | 48,436 |
| after last | 66.60 | 1.025 / 1.615 | 49 | 0 / 0 | 48,436 |
| new + minor + view-year | 83.64 | 1.074 / 1.744 | 49 | 0 / 0 | 49,296 |
| shared physical palace | 90.58 | 0.895 / 1.727 | 49 | 0 / 0 | 49,133 |

- New-only evidence initialization reads exactly **49 pinned artifacts / 1,204,430 bytes**, plus one existing source registry read. Relative to stem, total cold reads increase 152→202 and hashes 131→181. Counts fixed independently of age/chart; closed before/after requests deliberately validate approval before declining placement. This adds a bounded cold verification cost, not per-request artifact scanning.
- Every measured mode performs **zero warm fs reads and zero warm hashes** over 400 calls. New modes perform exactly 400 shared-table comparisons, two on first request (runtime plus initial stored verification). Total measured table-comparison time was 2.73–3.31 ms over 400 calls, about 6.8–8.3 µs each with instrumentation. An independent **20,000 warm full guard** loop took 69.86 ms, **3.49 µs/call** (without instrumentation), including table-content comparison and existing prerequisite checks. The guard must continue checking mutable shared content; memoizing it away would violate the reviewed fail-closed behavior.
- Prior profiles and omitted calls have identical fs/hash counts to baseline and **zero new table comparisons/reads**. Baseline warm medians/p95 were omitted 0.809/1.404, branch 0.887/1.719, stem 0.846/1.609 ms. These sequential local samples ran on a shared host, with root/other review activity; especially stem timing variation does not establish a source-induced latency regression. Mechanism and identical old code paths show no added verification on those request branches. No artificial threshold applied.
- Full analyzer responses are byte-shape/deep-value compatible for **864 current-versus-baseline requests**: all 24 independent chart inputs × omitted/branch/stem × six ages × standalone/combined minor+year. No timestamps stripped or fields ignored.
- Warm table mutation independently reproduced: new profile fails closed after an unapproved content change, all three old/omitted response modes remain exactly equal to baseline, and restoring content restores new-profile supported output. Mutation existed only in the probe process, never in files.
- New placed capability grows from 896 bytes (stem) to 1,723 bytes, +827 bytes on the chosen same chart/age; whole response similarly grows 48,303→49,130 bytes. This is exactly four fixed records, not a source table/report dump. Four associations are retained even on a shared palace; no deduplication. PublicFortune stays false and interpretation null in every call. Before/after emit empty records and no stem; combined minor and view-year placements remain mapped.
- Association work is four passes over fixed 12 natal palaces and their existing star collections; no remote I/O, DB query, source execution, recursive expansion or growing global cache. New immutable algorithm is bounded; evidence file maps/source parse locals are not retained by the cache, which stores only the verdict. Frontend validation similarly processes four association records against existing response statements; rendering adds exactly four keyed list entries. No extra fetch or render-triggering state was added. Browser not used per testing policy.

Artifacts: `performance-probe.mjs`, `performance-compatibility.mjs`, `performance-guard.mjs`, `performance-measurements.json` and individual per-mode JSON files. Total independently asserted analyzer calls: 4,411 timed probe calls + 1,737 compatibility calls (864 paired plus nine mutation/control calls) = **6,148**. Timings are local descriptive observations; hosted load, sustained concurrency and deployment performance remain unverified and are not claimed.
