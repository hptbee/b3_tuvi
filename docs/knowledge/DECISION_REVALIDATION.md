# Decision revalidation — Sprint 9B batch 0

Measured on `origin/main` at `c4d0e0a6ecda516aac445d2001e93532fb07425b`, then replayed after the integrity gate.

## What changed in the checker

Accepted decisions are replayed from the two review files and the stored span. The required-condition floor comes from phrases in the span that map to ids allowed by that passage's prompt, including stated branches and star placements such as `Dần, Thân`, `Tử Phủ tọa thủ đồng cung`, `an tại Hợi`, and `Nguyệt tọa thủ`. It does not come from `review-a.json` conditions. A short token that is only a prefix of a longer placement, such as `an tại Hợi` inside `Hợi, Tý`, is not a separate branch obligation.

A stored `AI_ACCEPTED` record fails closed when its `conditions`, `exceptions`, `schoolId`, `editionId`, `locator`, or `formulaComparison` no longer match that replay. The chart slice does not evaluate a decision unless the caller passes a binding result. The Tân Biên PDF bytes are not in this repository, so the file hash on the decision is not treated as a checked page.

## Result

All 24 stored decisions replay to the same `decision` value as the file. No decision JSON was rewritten.

`Mã Lạc Không Vong` stays `CONFLICT` because the two reviews disagree. The span also states Tuần and Triệt, and the prompt allows `avoid_tuan_triet`, which is not in both reviews. That omission does not change the stored status, because disagreement is decided first.

## Source binding

| Layer | Status |
| --- | --- |
| Extracted passage sha256 | Checked against `span.txt` for all 24 |
| Edition file sha256 `941b1045…` | Declared on the records. The PDF file is not in the repo, so `fileHashMatches` is null |
| PDF page text | Not checked. `pdfTextChecked` stays false |

`passage_hash_only` is not PDF verification.
