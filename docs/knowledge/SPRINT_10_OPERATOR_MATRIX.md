# Sprint 10 operator matrix

Executable contracts live in `backend/src/engine/conditionEval.js`. An operator that is not in this table returns `not_implemented`. `unknown` and `not_implemented` are not successes.

| Operator | Semantics | Executable | Constraint |
| --- | --- | --- | --- |
| `and` | `not_satisfied` wins, then `not_implemented`, then `unknown` | yes | Empty operand list is `not_implemented` |
| `or` | `satisfied` wins; otherwise `unknown` blocks success | yes | Empty operand list is `not_implemented` |
| `not` | Flips `satisfied` and `not_satisfied`; the other two statuses stay | yes | Missing operand is `not_implemented` |
| `same_palace` | Every named star is in the target palace | yes | Unknown star name is `not_implemented` |
| `opposite` | Every named star is in the opposite palace | yes | Missing palace is `unknown` |
| `tam_hop` | Every named star is in the target tam hợp, including the target | yes | Opposite-only placement is `not_satisfied` |
| `tam_phuong_tu_chinh` | Every named star is in the four-palace set | yes | |
| `nhi_hop` | The star is in the lục hợp partner. Tý is not Tỵ | yes | |
| `flank_split` | Two stars sit on opposite neighboring palaces | yes | Both stars on one side is `not_satisfied` |
| `star_present` | The star is in the target palace | yes | |
| `star_absent` | The star is absent from the target or requested zone | yes | Unsupported zone is `not_implemented` |
| `brightness` | The star's recorded mark is in the allowed list | yes | Missing brightness is `unknown`; absent star is `not_satisfied` |
| `branch` | Target branch is in the allowed list after alias normalization | yes | |
| `marker` | Tuần or Triệt present or absent on the target | yes | Other marker names are `not_implemented` |
| `tu_hoa` | Recorded association links the hóa star to the named source | yes | No association is `unknown`, not a pass |

Ám hợp, free-text prose conditions, and a school tứ hóa table that is not on the chart are not guessed. A condition with a `profile` or `schoolId` that does not match the evaluation scope returns `not_implemented` with reason `school_not_authorized`.

Formula V1 recognition stays in `formulaV1.mjs`. This matrix does not replace those predicates and does not change `rulesV2.json`.
