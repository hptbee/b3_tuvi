# T029 corrected independent pre-review source and fixture investigation

Status: engineering reachability and inert source-text check completed; NOT source approval, engineering review, historical golden certification, or an independent certification of existing natal formulas. No product, checkpoint, source decision, or Git file was changed.

## Correction of prior invalid pre-review attempt

My initial independent search used gender `[0,1]` and called these both sexes. This was incorrect: the product's `validateChartInput` accepts only `-1` and `1`. Its proposed ninth gender-0 witness was therefore not API reachable and is withdrawn. The invalid prior JSON is retained only at `/tmp/t029-independent-fixtures-invalid-prior.json` for audit; it must not be included as approved evidence or substituted for the corrected packet.

I replaced the search with actual genders `[-1,1]` and reran the entire calculation. Every original and search input now passes `validateChartInput(input).ok === true` BEFORE solar/lunar/chart calculation. The ninth witness was reconstructed from scratch with gender `-1`, including natal stars and all metadata; its analysis request returned status 200. Matching counts below are fresh executed counts, not copied from the withdrawn run.

## Actual execution and frozen files

- `node /tmp/t029-independent-fixtures.mjs` exited 0; log `/tmp/t029-independent-fixtures.log`.
- `python /tmp/t029-independent-source.py` exited 0; log `/tmp/t029-independent-source.log`.
- `/tmp/t029-independent-fixtures.json`: all eight original witnesses plus one additional valid real witness. Each includes input, lunar/Cục/Mệnh, host stars/brightness, independently expected pair/branch/full values, actual AST/subtraces and frozen-chart immutability evidence.
- `/tmp/t029-independent-source.json`: exact Git object identity, complete source paragraphs, full section/context checks. Source approval remains false.

## Original eight independent replays

I independently rebuilt each input through existing `solarToLunar → hourBranchIndex → calculateTuVi → normalizeChart`. The oracle finds the unique Quan Lộc host, builds its canonical-name Set, tests both Thiên Cơ and Cự Môn, then separately tests branch Mão. It does not derive expected values from `evaluateCondition`. Actual existing AST and each pair/branch subtrace were compared afterward. Lunar metadata, Cục, Mệnh, complete host stars/brightness, actual pair-host positions and traces matched the candidate exactly. Chart and AST were recursively frozen before evaluation and serialized chart bytes remained unchanged.

| Original category | Solar date/hour, gender=1 | Quan branch | Pair | Mão branch | Full AND |
| --- | --- | --- | --- | --- | --- |
| Mão, four-named adverse absent | 1980-03-01 06h | Mão | true | true | true |
| Mão, adverse present | 1980-06-15 14h | Mão | true | true | true |
| Dậu, four-named adverse absent | 1980-02-15 16h | Dậu | true | false | false |
| Dậu, adverse present | 1980-06-08 00h | Dậu | true | false | false |
| Missing Thiên Cơ | 1980-01-01 08h | Tí | false | false | false |
| Missing Cự Môn | 1980-01-01 18h | Mùi | false | false | false |
| Pair at Tài Bạch | 1980-02-01 12h | Hợi | false | false | false |
| Pair at Mệnh | 1980-03-01 22h | Mùi | false | false | false |

“Four-named adverse” refers only to direct Kình Dương/Đà La/Hỏa Tinh/Linh Tinh, with present meaning at least one. Absence does not imply a clean, favorable, or fully evaluated chart. Dậu negatives genuinely discriminate the Mão branch condition while retaining the pair; they do not reapprove the existing Dậu claim.

## Independent broader finite search and added ninth witness

Fresh search covered every valid civil date in 1991–1994, every even hour 0..22, and BOTH API-valid genders `[-1,1]`. All 35,064 inputs were validated before calculation. Observed Quan-Mão charts: 2,922; exactly-one-partner charts: 0; neither-partner charts: 2,612. This finite observation is consistent with a cohost invariant but does not prove universal unreachability or external formula accuracy.

Added real witness `negative_mao_both_partners_absent`:

- Solar 1991-01-01, hour 2, gender **-1**; `validateChartInput` succeeds.
- Lunar 1990-11-16, Canh Ngọ, non-leap; Thổ ngũ cục; Mệnh palace 12.
- Quan Lộc palace 4, branch Mão; neither Thiên Cơ nor Cự Môn. Exact full star metadata is retained in JSON.
- Pair subtrace `not_satisfied`, branch subtrace `satisfied`, full AND `not_satisfied`; chart immutable.
- Actual `analyzeChartRequest(input).status === 200`; this is execution of the shared analysis request handler, not a fabricated HTTP transport test.

This ninth case catches a mutant that drops the whole pair requirement and uses only Mão. It still cannot distinguish dropping just one named star, because no reachable Quan-Mão single-partner witness was found. The original missing-partner negatives prove pair-subtrace rejection, while their full AND also fails the branch. Exact AST/claim/decision/source-binding mutation checks remain necessary to preserve both required star names. Never describe the real-chart suite as independently discriminating every operand; synthetic malformed charts, if used, must remain explicitly synthetic.

## Independent source identity and complete context

Read the exact inert Git object from local `/tmp/tuvi-iztro-pinned` at pin `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`, path `docs/zh_TW/learn/ancientBook-2.html`, using `git show`. Its bytes exactly match the proposed raw HTML. An independent stdlib HTMLParser extracted the complete 巨門 Quan entry through `退宮卸職。` before the next 天相 entry, and the complete reciprocal 天機 Quan entry before 太陽. The span matches ignoring formatting whitespace; the complete 官祿 section also matches. Context includes the complete section and retained branch/brightness blocks.

Verified raw HTML SHA256 `438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a`, span `ae7aec7a8cb175d88b956f6562e7ccc138b45c65268c7bd0f7a7aba5a0966443`, context `bc5cb3737a70e083f983b4498af51281a266ae35ba2df71aa75fa46e7ad42ba4`.

Exact source distinguishes `天機同在卯宮吉美` from `在酉宮雖美無始終`. It begins with brightness/profession language and ends with `陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職。`; reciprocal 天機 contains `見羊陀火鈴方宜`. These contextual modifiers remain for actual dual-model adjudication. Source star descriptions say Thiên Cơ 卯酉旺地 and Cự Môn 卯酉入廟; preserve this distinction rather than equate both to engine M. No old Dậu approval, historical-edition authentication, expert/book status, public permission, whole-career verdict, or empirical future outcome is inferred.
