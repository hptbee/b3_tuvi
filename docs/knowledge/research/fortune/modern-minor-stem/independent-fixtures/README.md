# Independent modern minor natal-palace stem fixtures

These are source-comparative engineering witnesses, **not approval** or a technical review result. No runtime files were edited. No upstream iztro/lunar-lite executable was imported or run. The source pin is `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`.

The investigator read the retained full `palace.ts#getHoroscope`, `utils/index.ts#getAgeIndex`, `astro.ts` natal-palace constructor, and `constants.ts` ordered arrays/TIGER_RULE. Their exact retained bytes are SHA-256 checked against the earlier modern-decadal-stem source manifest on every replay. This is retained-byte verification, not a fresh remote retrieval. The separate source investigation must establish the pinned `FunctionalAstrolabe.ts` selection semantics; this fixture task does not replace that evidence.

`replay.mjs` parses the source's four triad anchors and TIGER_RULE. It independently constructs the source's finite age arrays (twelve palaces, ten ages each), inverts age membership, and maps the selected palace to its natal heavenly stem. Expected values never call the candidate stem implementation or use runtime output as an oracle. The existing approved branch helper is called only after finite-array expected branches are constructed.

The natal stem is calculated with the full source expression:

`soulStem = mod10(tigerStart + soulIndex)`

`natalPalaceStem = mod10(soulStem - soulIndex + selectedPalaceIndex)`

Both palace indices are Dần-relative, wrapped into 0..11 **before** stem calculation. A separate direct `mod10(tigerStart + selectedPalaceIndex)` map is compared for all 10 year stems × 12 branches. Tí/Sửu therefore have palace offsets 10/11; crossing Sửu→Dần resets the palace offset, rather than continuing an age-ordered mod10 stem walk.

For an ordinary chart and the **same target palace**, the natal formula and major-period formula give equal stems. The selected minor palace may differ from the currently applied major palace at the same age. `differentMajor` records 24 valid input/age witnesses with differing stems to catch an incorrect lookup of the current major period. These witnesses do not claim two same-palace formulas differ.

The fixture corpus covers 60 actual validated solar birth inputs and their unchanged server-converted lunar metadata. It includes 7,200 age1..120 cases, every year stem and year branch with both sexes, 4 leap-month charts, pre/post lunar-new-year inputs, and explicit lunar-year versus Gregorian-year mistake witnesses. All 2,880 birth-branch×sex×age comparisons agree with the approved old minor branch helper. Three ages (1,12,120) per chart are sent through `analyzeChartRequest`: 180 successful existing-profile branch/palace mappings, with public fortune false and interpretation null. This establishes existing branch reachability; it does **not** claim that candidate runtime stems were implemented or tested. No HTTP server/browser/database is required.

All 60 lunar results also pass an independently written inverse: parse the B3 TK20/TK21 year-code tables, enumerate regular and leap month lengths from their bits, validate lunar day against the selected month, add the Tết offset to Gregorian January1 using UTC civil-date arithmetic, and require exact equality to the original solar day/month/year. This inverse calls neither the converter's private decoder nor its Julian-day routine. Each fixture preserves the returned inverse date and result, including the pre/post Tết and both leap-month dates. It establishes lunar input validity and roundtrip consistency with those tables; the tables are shared evidence, so it does not independently authenticate the tables astronomically.

Calendar expectations are engineering regression fixtures from that independent table inverse and the existing B3 converter, not independent calendar goldens and not full upstream calendar equivalence. Stem expectations are source-comparative fixtures from the pinned modern software. There are no expert-verified goldens or synthetic chart mutations. Supplied nominal age stays explicit; no birthday, age-today, `yearDivide`, `from`, upstream complete-chart equivalence, historical authentication, transformations, stars, interpretation, prediction, public release, or source acceptance follows from these fixtures.

Run from the repository root:

```sh
node docs/knowledge/research/fortune/modern-minor-stem/independent-fixtures/replay.mjs
```

Optional arguments are repository root and output directory. Node22+ and repository dependencies are required. The generator writes deterministic `fixtures.json` and compact `summary.json` without dates, ports, names, or personal input. A failed replay is incomplete evidence; successful replay never grants domain approval.
