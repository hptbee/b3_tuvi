# Sprint 11 — interpretation claim coverage matrix

Baseline: `origin/main` `18fab6546f0de1f7c9913ab09ad7173164db3640` (PR #32 merged).  
Measured from stored pilot claims and decision files. No new dual-AI interpretation review was executed in this sprint.

| Gate | Live catalog result |
| --- | --- |
| Interpretation claim exists | Pilot research claims exist. They are not interpretation approvals. |
| Source and edition traceable | Some Tân Biên decisions have locators. Many formations remain `SOURCE_INACCESSIBLE` or identity-unresolved. |
| Source text supports a meaning sentence | No stored `approvedWording` on live claims. |
| School/profile scope | Default school is recorded on formulas. Interpretation school approval is not. |
| Independent review executed for interpretation | Formula dual-AI reviews exist for a subset. They are formula/identity reviews, not interpretation approvals. |
| Runtime conditions executable and satisfied | Condition engine evaluates typed operators. Formation/breaking are not inferred from a runtime match. |
| Interpretation use approved | `approvedForInterpretation` stays false on live claims. `expertVerified` stays false. |
| Public release | `releasePermission` is not `owner_released`. Public `prose` stays null. |

| Palace function | Status |
| --- | --- |
| Mệnh, Phúc Đức, Quan Lộc, Tài Bạch | Structured analysis only. `insufficient_evidence` unless a test injects an eligible claim. |
| Thân | Overlay on the body palace. Not a thirteenth palace. |
| Remaining eight functions | Same abstention. Architecture covers all twelve. |

`AI_ACCEPTED` / formula `MATCH` does not set `sourceReviewStatus: AI_CROSS_REVIEWED` for interpretation and does not open prose.
