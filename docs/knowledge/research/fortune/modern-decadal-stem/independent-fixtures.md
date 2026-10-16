# T030 independent fixture investigation

Status: independent engineering witnesses, not domain approval. No production files edited.

## Source and exact scope

Read the full retained `raw/src/astro/palace.ts#getHoroscope`, `raw/src/data/constants.ts` (ordered stem/branch arrays and TIGER_RULE), and `raw/src/utils/index.ts` (fixIndex). Verified each exact byte SHA-256 against the retained T025 payload/context manifests. The source pin is `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`. This is local retained-byte verification; I did not claim a new live remote fetch or execute upstream lunar-lite/iztro.

The source loop allocates the decade into `idx`, a **wrapped Dần-based target-palace index 0..11**. It then computes stem index modulo 10 from `HEAVENLY_STEMS.indexOf(TIGER_RULE[yearStem]) + idx`. For a supplied B3 zodiac branch id (Tí=1, Dần=3), this means `tigerIndex = wrap(branchId - 3, 12)`. Wrap by 12 occurs **before** adding to the source start stem and wrapping by 10; replacing the first wrap with an unbounded signed palace offset changes results when crossing the Dần-origin ring boundary.

This investigation proposes only projection from the **already trusted B3 lunar-year stem and the selected approved B3 decade branch**. `getHoroscope` obtains its own source yearly values using `getConfig().yearDivide`; upstream `from` may alter soul anchor/Cục. Neither source yearDivide/config nor `from` compatibility has been established for B3. Do not claim full upstream astrolabe/calendar equivalence, derive future year stems, add period stars/Tứ Hóa, or imply predictions. Sex/direction/Cục influence the approved target branch; once that branch is fixed they do not independently alter its stem. No user-supplied heavenly stem is trusted.

## Independent construction and reachability

The replay script parses the pinned arrays/TIGER_RULE directly. It independently replays the source loop on server-native natal Mệnh/Cục/year branch/sex metadata, then crosschecks a separately written closed formula. It never imports modernMajorPeriod or uses a candidate implementation as expected-value oracle. Existing current API branch/age results are compared only **after** expected construction to verify that these witnesses are reachable in the existing approved profile.

All inputs use the actual `validateChartInput`, solarToLunar → hourBranchIndex → calculateTuVi → normalizeChart pipeline. There are no forged charts or post-conversion mutations. Negative witnesses mean real charts/cases that discriminate a specified incorrect stem algorithm; these are not claims that a chart lacks an applied decade. Before/after age cases are distinct valid requests with no applied decade and expected null stem. Structural/tamper rejection belongs in implementation tests and is not presented as an independently reachable chart.

- Searched 624 valid real charts, selected 24 charts by a deterministic greedy coverage matrix (78 required cells, all covered).
- 288 complete supported periods; 654 successful direct analyze requests; 106 real HTTP 200 requests with no-store verified.
- All 10 lunar-year stems × both valid sexes, all 12 lunar-year branches × both sexes, all 5 Cục × both sexes × both year-branch parities, and all 12 natal Mệnh branches. Every selected chart enumerates all 12 target branches. Both directions occur.
- Every decade start/end boundary is included. First valid, age 1 before-first, last valid, and after-last (where ≤125) included. For Cục 6, last age125 is valid and first-after126 is API-invalid: no fabricated API-valid after-last case is claimed.
- Fresh fixtures use solar dates 1984–1996, Jan/June day1, actual sex ±1; these do not validate the whole 1200–2199 date range.
- The existing implementation has no T030 stem output at fixture freeze: all claimed runtime validations are for existing branch/age reachability only. The expected stem values are independently source-derived engineering witnesses for the subsequent approved implementation.

## Algorithm-discriminating real cases

| Incorrect algorithm | Period witnesses with different result |
| --- | ---: |
| `solarYear` | 24 |
| `targetZodiacIndex` | 240 |
| `directionDecade` | 263 |
| `unwrappedSoulPlusDecade` | 118 |
| `yearStemDirect` | 264 |

The solar-year mistake is distinguished by January charts whose B3 lunar year differs from the supplied solar year. This checks the B3 projection boundary only, not upstream lunar-lite calendar equivalence. The `directionDecade` mistake adds signed decade number to the source Tiger starting stem; `unwrappedSoulPlusDecade` skips source 12-palace wrapping; `targetZodiacIndex` uses the Tí-origin index; `yearStemDirect` omits TIGER_RULE. Each fixture period records which mistakes it distinguishes.

## Compact coverage matrix

| Fixture | Solar birth (hour,sex) | Lunar stem/branch | Mệnh id | Cục | Direction |
| --- | --- | --- | ---: | ---: | ---: |
| T030-F01 | 1984-01-01 (0,1) | Quý Hợi | 1 | 4 | -1 |
| T030-F02 | 1984-06-01 (0,1) | Giáp Tí | 7 | 5 | 1 |
| T030-F03 | 1984-01-01 (2,-1) | Quý Hợi | 12 | 2 | 1 |
| T030-F04 | 1984-06-01 (2,-1) | Giáp Tí | 6 | 3 | -1 |
| T030-F05 | 1985-06-01 (4,1) | Ất Sửu | 4 | 5 | -1 |
| T030-F06 | 1985-06-01 (2,-1) | Ất Sửu | 5 | 4 | 1 |
| T030-F07 | 1986-06-01 (6,1) | Bính Dần | 3 | 3 | 1 |
| T030-F08 | 1986-06-01 (8,-1) | Bính Dần | 2 | 5 | -1 |
| T030-F09 | 1987-06-01 (22,1) | Đinh Mão | 8 | 2 | -1 |
| T030-F10 | 1987-06-01 (18,-1) | Đinh Mão | 10 | 5 | 1 |
| T030-F11 | 1988-06-01 (14,1) | Mậu Thìn | 11 | 2 | 1 |
| T030-F12 | 1990-06-01 (20,-1) | Canh Ngọ | 9 | 2 | -1 |
| T030-F13 | 1988-06-01 (8,-1) | Mậu Thìn | 2 | 4 | -1 |
| T030-F14 | 1989-06-01 (0,1) | Kỷ Tị | 6 | 3 | -1 |
| T030-F15 | 1989-06-01 (0,-1) | Kỷ Tị | 6 | 3 | 1 |
| T030-F16 | 1990-06-01 (2,1) | Canh Ngọ | 6 | 4 | 1 |
| T030-F17 | 1991-06-01 (16,1) | Tân Mùi | 10 | 6 | -1 |
| T030-F18 | 1991-06-01 (16,-1) | Tân Mùi | 10 | 6 | 1 |
| T030-F19 | 1992-06-01 (2,1) | Nhâm Thân | 6 | 6 | 1 |
| T030-F20 | 1992-06-01 (2,-1) | Nhâm Thân | 6 | 6 | -1 |
| T030-F21 | 1993-06-01 (0,1) | Quý Dậu | 6 | 5 | -1 |
| T030-F22 | 1993-06-01 (0,-1) | Quý Dậu | 6 | 5 | 1 |
| T030-F23 | 1994-06-01 (0,1) | Giáp Tuất | 6 | 3 | 1 |
| T030-F24 | 1994-06-01 (0,-1) | Giáp Tuất | 6 | 3 | -1 |

## Reproduction

`node independent-replay.mjs /absolute/path/to/b3_tuvi /tmp/t030-replay`

Requires repository backend dependencies and Node22+. Starts one ephemeral localhost HTTP server without initializing or writing a SQLite database; closes it after the requests. Creates fixtures.json, source-proof.json, and emits coverage. Fixture output is deterministic; it carries no timestamps or ephemeral ports. Real original birth data are synthetic examples, no names.

No conclusion here upgrades classical source status, authenticates the iztro edition as a classical book, approves production release, or opens public interpretation gates.
