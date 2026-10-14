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

## Annual-star pass

The rest of volume 2 was read after the đại hạn excerpt. New lines for Tang Môn, Lưu Lộc, and Thiên Đức were reviewed on their own.

| Formula | Result |
| --- | --- |
| Lưu Lộc / Lưu Kình / Lưu Đà | Both reviewers: the 己丑 sentence is one example, not a general rule. |
| Tang Môn, Điếu Khách, Bạch Hổ, Quan Phủ | Reviewers disagree, and neither gives a branch order for 前/後. |
| Thiên Đức / Nguyệt Đức | Reviewers disagree, and neither gives a branch order for 順. |

Agents: grok-4.7-high `bc-a74566ff-5e13-5f0c-ae16-e95d39b8f1e3`, gpt-5.6-terra-medium `bc-ede9b5be-fde7-573d-be43-62ded2b9a29c`. No annual-star position is calculated.

## Convention pass

Hong Kong Observatory states the earthly-branch order 子丑寅卯辰巳午未申酉戌亥 and the sexagenary steps 甲子, 乙丑, 丙寅 (https://www.weather.gov.hk/tc/gts/time/stemsandbranches.htm). The same Wikisource volume places 擎羊 on 丑 and 陀羅 on 亥 when 祿 is on 子, so 前/後 in that example follows this order.

With that convention supplied, both later reviews (`bc-d0b76e9e-ec49-5c8b-aca4-39131e280e29`, `bc-69fdf8e1-6801-5ce0-9202-fbcde4d0ce03`) allow Thiên Đức as a branch placement: start at 酉 for 子 and count forward to the year branch. They do not allow Đại hạn or Tiểu hạn. Tang Môn stays blocked because they do not agree that 對照 is six steps.

Thiên Đức returns a branch only when a view-year branch is supplied. It does not use the birth year, and `interpretation` stays null.
