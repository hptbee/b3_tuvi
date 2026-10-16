# T028 independent source-text and engineering fixture verification

Completed independently by `/root/tai_independent_fixtures`. This is a pre-review fixture investigation, not source approval, engineering review, historical-golden certification, or external validation of existing natal formulas. No product, checkpoint, source decision, or Git files were modified.

## Executed evidence

- `node /tmp/t028-independent-fixtures.mjs` exited 0; log `/tmp/t028-independent-fixtures.log`.
- `python /tmp/t028-independent-source.py` exited 0; structured result `/tmp/t028-independent-source.json`.
- Frozen result `/tmp/t028-independent-fixtures.json` has a `cases` array with 8 independently reconstructed witnesses. Every case contains original `input`, independently computed `expected`, actual AST `observed`, complete `lunar`, `cuc`, `menhPalaceId`, target `hostBranch`/`hostPalaceId`, full canonical `stars`/brightness, `fourNamedAdversePresent`, `hoaKyPresent`, `pairPalaces`, and metadata/freeze/immutability evidence.

I rebuilt each original solar DOB/hour/sex through existing `solarToLunar → hourBranchIndex → calculateTuVi → normalizeChart`. Expected truth was computed directly from the unique Tài Bạch host's canonical-name Set containing both Tử Vi and Phá Quân, independently of `evaluateCondition`; the existing same_palace AST was checked only afterward. Exact lunar, Cục, Mệnh, host stars/brightness, pair-host coordinates and traces matched the candidate. Both chart and AST were recursively frozen before evaluation; the serialized chart remained unchanged.

## Complete reachable matrix

| Cell | Input (solar, hour, gender=1) | Result | Four named adverse stars at Tài Bạch |
| --- | --- | --- | --- |
| Sửu, adverse absent | 1980-01-15 14h | satisfied | none |
| Sửu, adverse present | 1982-04-28 00h | satisfied | Hỏa Tinh |
| Mùi, adverse absent | 1981-02-22 06h | satisfied | none; Hóa Kỵ is present |
| Mùi, adverse present | 1980-02-08 04h | satisfied | Kình Dương, Hỏa Tinh |
| Missing Phá Quân | 1980-01-01 00h | not_satisfied | target Thân has Tử Vi + Thiên Phủ |
| Missing Tử Vi | 1980-01-01 04h | not_satisfied | target Ngọ has Phá Quân |
| Pair in Quan Lộc | 1980-02-08 20h | not_satisfied | target Hợi does not contain pair |
| Pair in Mệnh | 1980-03-01 02h | not_satisfied | target Dậu does not contain pair |

No missing cell or structural negative was found; no additional fixture was necessary. “Adverse present” means at least one of Kình Dương/Đà La/Hỏa Tinh/Linh Tinh, not all four. “Adverse absent” means absence of that four-star set only, never universally auspicious or free of adverse context. All eight current witnesses use male input; this is acceptable for a condition depending solely on actual host/stars, but must not be called a sex/age/calendar-variant coverage suite.

## Independent complete-passage check and unresolved semantics

An independent stdlib HTMLParser extracted full Tử Vi entry up to the next 天機 entry, and full Phá Quân entry up to the next 文昌 entry from inert `/tmp/t028/pinned-juan2.html`. The two complete paragraphs equal the proposed span ignoring formatting whitespace; raw SHA256 is `438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a`, span SHA256 `97c498dbad297a90345a1817af3c8ec19d8793ec67fb1802f88972123efc5df5`. I did not independently authenticate the original edition or re-fetch a remote Git object.

The Tử Vi clause is exactly `破軍同先難後易`; its immediately preceding adverse clause `加羊陀火鈴空劫不旺` must remain visible to actual source reviewers. The reciprocal Phá Quân entry says the different phrase `紫微同先去後生`, follows earlier branch/brightness language, and ends after the 廉貞 clause with `加空劫極貧`. Neither fixture success nor source text extraction establishes how far those modifiers govern. Source reviewers must explicitly resolve whether a narrowly attributed Tử Vi-clause annotation can remain valid in all four tested branch/adverse contexts, or require extra conditions/unresolved status.

Source Mệnh star descriptions explicitly contain `丑未宮入廟與破軍同度` and `丑未宮旺地與紫微同度`; this supports source reachability of both branch cohosts, not blanket transfer of natal-Mệnh stem/rank rules into Tài Bạch. The odd `陷宮破不祖聚` wording remains unchanged. No guaranteed wealth outcome, quantified timing, interpreted cycle, public prediction, or natal formula certification follows from this investigation.

Actual independent dual-model source review and normal implementation readiness gates remain outstanding. All source and public-release restrictions remain in force.
