# Release readiness

Assessed against `origin/main` `9999610` (tree identical to `608a5ca`) on 2026-10-12.

Evidence: `cd backend && npm test` passed. `cd frontend && npm run lint` and `npm run build` passed. No browser E2E. No expert-signed chart. No live model call.

| Area | Status | What works | Missing | Blocker | Next action |
|---|---|---|---|---|---|
| Calculation engine | Implemented in repo, formulas `UNVERIFIED` against a collated edition | Lunar conversion, chart placement, Tứ Hóa, Tuần/Triệt, brightness, normalization. Tests include placement tables and 26-chart / 73-chart regressions against the repo itself | Independent check of giờ Tý, leap month, and decade placement | No expert golden chart | Keep tests. Do not treat pass as book-accurate |
| Rule engine | Implemented for 58 rules | Disabled ways stay out. V2/legacy parity on non-strict names. Evidence v3 does not invent formation | 4 disabled ways have no rule. 44 provisional. Breaking is not evaluated | Formula edits need approval | Leave `rulesV2.json` unchanged |
| Knowledge base | Research catalog, not a production KB | Provenance contract, validator, temp prototype, query layer, 3 owner-authenticated edition records | 0 claims approved for interpretation. 0 `formulaCheckedAgainstSource`. Prototype is not production SQLite | `V2-KB-03-prod` `BLOCKED_HUMAN` | Do not migrate |
| Structured interpretation | Server API exists | 12 palaces, Thân overlay, contradictions kept, `prose: null`, no life score | UI does not call it. F001–F003 | Fix trust and eligibility before any UI hookup | PR B then PR C |
| Expert interpretation | Not ready | None | No approved claim, no collated formula match | Human approval per claim | Do not generate readings |
| Fortune engine | Partial | Reads existing `daiHan`. Other cycles `blocked` / `not_applied`. No fortune prose | Tiểu hạn, lưu niên, lưu tinh, tứ hóa hạn formulas | No approved formulas | Keep blocked |
| AI POC | Internal only | Mock path rejects unknown ids. Model text is not returned | No real-model eval, no cost measurement | Public AI needs approval | Keep text withheld |
| Public AI | Not ready | Not in the UI | Guard is id-based and untested on a provider | F002 plus no approval | Do not expose a narrator |
| Frontend UX | Chart and combination cards | Generate, palace grid, combination match with a partial disclaimer | No structured evidence, no provenance, combination "Luận giải" label (F005). Accessibility of the click-only cards was not fully reviewed | F005 | Change the label before adding more prose |
| Deployment | Not ready | CI workflow runs backend test and frontend lint/build on push and PR | No production migration, no deploy pipeline in this audit | Human approval before production | Do not deploy |

Sprint 8: **NO-GO** for expert interpretation, fortune prediction, and public AI.

Sprint 8 engineering on remediation PR B–F: **CONDITIONAL GO** after local `main` matches `origin/main`. That work is not a license to change an-sao formulas or to mark claims verified.
