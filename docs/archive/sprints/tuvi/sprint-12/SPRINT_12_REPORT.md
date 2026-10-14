# Sprint 12 — fortune intelligence

Date: 2026-10-14. Baseline: `origin/main` `b25478d`.

## Task status

| ID | Status | Evidence |
| --- | --- | --- |
| S12-01 | BLOCKED_SOURCE | Wikisource 紫微斗數全書 volume 2 states a đại hạn direction and a tiểu hạn start palace, and both reviews (`bc-3c27df54-6d4a-50a5-ab5c-83fe79a92e85`, `bc-76771a62-4ee3-5fa1-9aff-3dcff412f703`) found no age step. Lưu niên, lưu tinh, and tứ hóa hạn are not in that excerpt. The transcription is not an authenticated edition. |
| S12-02 | Implemented as an explicit block | `timeOverlay` returns natal labels and blocked cycle capabilities. Leap-month fortune and the effect of gender are `not_evaluated`, not a tested rule that gender never changes a cycle. |
| S12-03 | Implemented | The chart label remains the natal annotation. The API marks `fortuneFormula: not_applied`. The palace label title says it is not an approved fortune reading. |
| S12-04 | BLOCKED_SOURCE | No cycle has `AI_CROSS_REVIEWED` fortune evidence, so no fortune formula was implemented. |
| S12-05 | Implemented as non-inference | The overlay does not turn a natal label or a formula hit into a fortune statement. `interpretation` stays null. |
| S12-06 | Tested as a block only | Missing approval stays blocked. Leap month and gender are recorded as `not_evaluated`. The tests do not claim those boundaries were checked against a source. Natal `daiHan` is not rewritten. |
| S12-07 | Implemented | The evidence panel lists blocked cycles and states that the đại hạn number is a natal label. |

## Decisions

| Gate | Decision |
| --- | --- |
| Sprint 12 engineering of the block | CONDITIONAL GO |
| Fortune calculation | NO-GO |
| Public fortune prediction | NO-GO |
| Sprint 13 kickoff | NO-GO for narration. There is no approved fortune text and only one internal interpretation claim. Grounded narration would have almost nothing new to say and must stay disabled. |
