# T030 independent performance review — invocation technical pass 4/12

Scope: task base `774ac6cff4b74e273a9bdf3a9c1ffa180d3d6b7b` through current checkout, including untracked T030 artifacts. Policy-only HEAD `5383854` was already reviewed separately; this pass examines T030 request/runtime/UI mechanisms. Read AGENTS, canonical performance-reviewer role, review-loop strategy and Node.js runtime skill. Report only; parent owns the quality gate. No application, source-evidence or Git mutation, no browser launched.

## Findings

No confirmed or evidenced material performance defect. No R3101+ finding allocated. Cold synchronous evidence validation is real bounded event-loop work; warm request evidence work is cached. These diagnostic measurements do not establish a production SLA or prove unlimited scalability, and no speculative optimization is requested.

## Independent measurements

`performance-probe.mjs` instruments `node:fs.readFileSync` and `node:crypto.createHash`, calls `syncBuiltinESMExports`, then imports the actual analyzer. Each mode runs in its own fresh process, with one cold and 200 warm analyses plus actual response JSON serialization. All 1,608 analyses returned status200 and asserted expected closed/placed capability, publicFortune false, interpretation null and private-name absence. Birth input is valid 1984-01-01 hour0 male; new profile age14 selects Hợi/Quý; ages1 and125 close before/after the 4..123 period range. Combined selects existing minor age14 and annual Tí as mapped as well.

Baseline is a read-only `git archive` of task base into `/tmp/t030/performance-baseline`, with dependency symlinks, never another worktree or checkout. Actual old/omitted request shapes are identical across baseline and current.

| Mode | Cold ms | Warm median / p95 ms | JSON bytes | Stem artifact reads / bytes | Warm reads / hashes (200 calls) |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline omitted | 31.988 | 0.997 / 1.938 | 48,263 | 0 / 0 | 0 / 0 |
| Current omitted | 32.241 | 0.909 / 1.417 | 48,263 | 0 / 0 | 0 / 0 |
| Baseline old profile | 41.157 | 0.954 / 1.512 | 48,256 | 0 / 0 | 0 / 0 |
| Current old profile | 42.317 | 0.965 / 1.810 | 48,256 | 0 / 0 | 0 / 0 |
| New profile placed | 47.734 | 1.033 / 1.833 | 48,316 | 35 / 893,573 | 0 / 0 |
| New before first | 48.030 | 1.021 / 1.824 | 48,326 | 35 / 893,573 | 0 / 0 |
| New after last | 47.131 | 0.965 / 1.758 | 48,326 | 35 / 893,573 | 0 / 0 |
| New + minor + annual | 58.891 | 0.962 / 1.600 | 48,485 | 35 / 893,573 | 0 / 0 |

New-profile evidence incurs the same fixed35 file reads in every fresh enabled mode plus one existing source-registry read (18,750 bytes). The new-versus-old cold read delta is36 reads /912,323 bytes; SHA count delta36 (131 versus95). Existing unrelated cold evidence explains the remaining reads and hashes. New evidence fixtures and lockfile are hashed as inert text, not executed or replayed on each chart. Response payloads contain neither evidence nor its raw bytes. Warm actual SHA calls are **zero**, not merely zero disk reads. Warm serialization medians remain0.177–0.181ms across measured modes.

`performance-compatibility.mjs` separately deep-compared eight complete actual analyzer responses between baseline/current: omitted, and old profile ages1/4/13/14/123/124/125. All exactly equal, not just equal sizes or selected fields.

Independently executed `node backend/test/modernMajorStemApi.test.mjs`: exit0, **418 real HTTP requests**,24 valid natal charts/288 allocated periods plus closed boundaries, malformed configurations, combined overlays, ask and no-store/privacy/no-DB-write assertions. Log `performance-independent-http.log`. This reuses committed-intended domain fixtures for contract verification and does not claim independent historical correctness or source approval.

## Mechanism inspection

- Stem gate runs only after explicit valid new-profile selection; old/omitted requests never read the new dossier, confirmed by instrumentation. The module imports freeze a bounded small algorithm/hash descriptor, not raw evidence.
- New verifier requires the old approved gate; success or denial is cached in one module-scoped result, copied on return. Evidence strings, parsed reviews and manifests are temporary cold locals; no per-chart/age growing cache retains private request data.
- Closed before/after requests still validate approval/trusted natal metadata, then return heavenlyStem null/stemPlacement not_applied; this is intentional fail-closed governance, not unused warm evidence work.
- The stem calculation is fixed arithmetic, one10-element lookup and the existing12-palace map. No upstream network, dependency execution, additional DB query or per-period expansion occurs.
- UI reuses the existing single analyze effect, committed profile/age option and request signature. It adds a finite select option and bounded scalar response checks, no new request effect or chart enumeration. Lower-level component tests cover that integration; no browser performance claim is made.

## Limits and evidence

Raw compact results: `performance-base-{omitted,old}.json`, `performance-current-{omitted,old,new,before,after,combined}.json`; each retains cold stem artifact names/bytes. Probe scripts and compatibility result are in `/tmp/t030`. Local sequential diagnostic samples are not concurrency/load/production-storage measurements, heap-leak proof, or timing assertions. Small timing differences are not evidence of a meaningful regression without a reproducible bottleneck/SLA. No source decision or public gate is broadened by this review.
