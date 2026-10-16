# T025 independent source-derived real-chart fixtures

Status: engineering witnesses, not source approval, historical authentication, expert goldens, or public fortune eligibility. No product file or formula changed.

## Source and derivation

Read the exact Git object at SylarLong/iztro `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`, `src/astro/palace.ts#getHoroscope`, `src/data/constants.ts` (GENDER, FiveElementsClass, EARTHLY_BRANCHES), `src/data/earthlyBranches.ts`, and `src/astro/FunctionalAstrolabe.ts` date query. The repository has a no-checkout clone. No upstream source/scripts were executed. The source comment says start at Mệnh, yang male/yin female forward, other combinations backward, each decade advances one palace. The actual loop compares gender yin/yang to the birth-year BRANCH yin/yang; period i starts Cục + 10i and ends +9 inclusive, i = 0..11. The enum explicitly says these are 虚岁: Cục n starts age n. These are source-code-defined semantics of this modern variant, not confirmation of classical Quanshu.

The fixture builder derives expected tables by rotating a literal 12-branch ring to Mệnh, then visiting each branch once in the source direction and incrementing age by ten. Existing natal `daiHan` values are read only AFTER expected construction. A separate replay script independently transcribes the source loop in Dần-based indices and compares all expected tables and selected age queries. No product fortune function was used as expected oracle.

## Coverage and actual results

`fixtures-analysis.json` contains 28 real solar → Vietnamese lunar → calculateTuVi → normalizeChart witnesses selected from 1,440 searched natal charts. It includes input, all normalized lunar/Cục/Mệnh metadata, all 12 normalized palace IDs/branches/functions/legacy decade labels, 12 independent periods each, and 1,423 explicit age-boundary queries.

Coverage is all five Cục crossed with both sexes and both birth-year yin/yang states (20 combinations), all twelve birth-year branches crossed with both sexes (24 combinations), and all twelve Mệnh locations. Extra witnesses cover lunar-new-year adjacent dates 9–10 February 2024, a leap-month date 22 March 2023, and hour 23. These extra dates expose the actual chart metadata; they do not certify cross-library calendar or late-Zi-hour equivalence.

- 336 independently constructed period start ages exactly match existing natal `daiHan` labels, zero differences on these fixtures.
- Independent source-loop replay: 1,759 successful table/query comparisons.
- Fixtures include Cục-1, Cục, Cục+1; every period start/end ±1; twelfth period; last source-supported inclusive age; and one age after the complete source range.
- First period is Mệnh, never an adjacent palace. All subsequent periods visit each branch once. The ring crosses branch 12→1 or 1→12 naturally. There is NO thirteenth period or modulo-age wrap into the first decade.
- Last inclusive ages differ by Cục: Thủy 121, Mộc 122, Kim 123, Thổ 124, Hỏa 125. The source emits twelve complete decades; a UI policy limited to 120 would intentionally truncate the final decade. An explicit caller-age adapter could permit 1..125 and return outside-range for ages beyond Cục+119, or impose a narrower declared product range; the source should not be misquoted as universally ending at age 120.

## Exact comparison with natal labels

Legacy engine `tuviRules.mjs` line 111 places only start ages `cucId + i * 10` at Mệnh ±i. Source loop places inclusive `[start,start+9]`. The mathematical period location agrees for all valid reachable fixtures. Legacy chooses direction from birth-year STEM parity; modern source uses BRANCH parity. Valid sexagenary years have equal stem/branch yin-yang parity, checked for all searched charts, so the direction agrees for actual input charts. This agreement does NOT independently approve calendar conventions, natal Mệnh/Cục calculation, childhood fortune, classical source fidelity, or public outcomes.

For any adapter built on existing normalized charts, describe the result as a read-only source-predicate projection using existing natal Mệnh/Cục/year/gender. Do not claim an independently computed full iztro astrolabe: iztro has configurable yearDivide, dayDivide, leap handling, calendar-library semantics and an optional `from` five-element override; this dataset does not equate these to the existing natal engine or implement those overrides.

## Age convention: explicit input versus upstream date-derived age

The source enum states 虚岁. The full upstream date query normally computes target lunar year − birth lunar year +1. When `ageDivide === birthday`, it instead starts from the lunar-year difference and adds one only when target lunar month/day is STRICTLY AFTER the birthday. On the exact birthday equality is false. `age-convention-witnesses.json` demonstrates this source rule using actual reachable lunar metadata for solar birth 15 June 1990 (lunar 23/5): 4 July 1991 is lunar 23/5 and yields normal age 2, birthday-rule age 1; 5 July (24/5) yields 2 for both. These examples use this repository's lunar converter, not an upstream cross-calendar oracle.

An explicit `nominalAge` caller input avoids choosing a date ageDivide rule. It must be labeled supplied age, not silently equated with Gregorian age, legal age, date-derived lunar age, or displayed viewing year. Do not derive it from viewYear or reuse yearly branch as age.

Before Cục, the source's full FunctionalAstrolabe query may fall back to childhood palaces: ages 1..6 map Mệnh/Tài/Tật/Phu/Phúc/Quan. This is a separate fallback, not a decade placement. The table-selection witness records `before_first_decade` with no decade palace. Implementing only decade ranges should preserve this explicit absence and should NOT claim upstream full-horoscope equivalence or infer childhood semantics automatically. After the twelfth decade, do not reset to Mệnh; the source contains no thirteenth decade.

## Classical contrast

The committed `ziwei-quanshu-juan2-limits.txt` states `陽男陰女從命前一宮起順行 是父母宮。陰男陽女從命後一宮起逆行 是兄弟宮`. This differs from the modern source Mệnh anchor: first expected source-scoped classical anchor would be the ADJACENT palace in direction (Phụ Mẫu forward, Huynh Đệ backward), matching modern period 1 location, not modern period 0. Every fixture records this anchor-only contrast. The classical excerpt DOES NOT establish Cục start age, inclusive endpoints, twelve-range extent or date-age convention; do not fabricate a complete classical age placement from the contrast or relabel unchanged natal decades as authenticated Quanshu. Prior provenance and no-public gates remain unchanged.

## Adapter-negative cases

The JSON records proposed strict-adapter negatives separately from source behavior: non-number/noninteger/zero/negative/nonfinite age, invalid gender, missing/unknown/classical/implicit profile, unknown Cục, missing/duplicate Mệnh or branches, impossible stem/branch parity, conflicting options versus birth gender. These are new product fail-closed choices, NOT claims about upstream API validation. Before-first and beyond-twelve-decade ages are valid numeric inputs with no decade match, not malformed source inputs. Final API envelope/profile/range requires the parent design decision and independent source review before implementation.

## Reproduction

Run `node /tmp/t025/build-fixtures.mjs` then `node /tmp/t025/replay-fixtures.mjs`. Logs are `fixtures-build.log` and `fixtures-replay.log`. JSON SHA-256 at this checkpoint: `d9a2a37c2c4235c05003994d818427903ce52db07946d133c7e8df9f37c7a1ca`.
