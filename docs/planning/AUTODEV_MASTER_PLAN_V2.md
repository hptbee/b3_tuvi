# AutoDev Master Plan V2 — Tử Vi Việt Nam (`b3_tuvi`)

- version: 2
- coordination: tài liệu này điều phối việc **sau** V1
- history: `docs/archive/planning/AUTODEV_MASTER_PLAN.md` giữ nguyên, không sửa để phản ánh V2
- baseline: `7ba68db95debf3565a0b07a1c74b004eb1de3d1f` (`Merge pull request #1`)
- audited: 2026-10-12, HEAD trùng baseline
- branch: `autodev/v2-foundation` (không merge `main` trong phiên này)

## 1. Product vision

Nền tảng nghiên cứu Tử Vi Đẩu Số: lập lá số, nhận diện cách cục, luận giải có điều kiện, nguồn, trường phái và căn cứ. Giải thích học thuyết truyền thống không phải dự báo đã được khoa học kiểm chứng.

Mười lớp: calculation, normalized chart, palace relations, rule engine, knowledge base, deterministic interpretation, fortune/time, AI có căn cứ, visualization, quality/deploy.

Ưu tiên **stateless chart generation**: API trả lá số mà không bắt buộc lưu ngày giờ sinh. Không tài khoản, không lịch sử lá số, không thanh toán.

## 2. Current baseline

| Kiểm tra | Kết quả lúc audit |
|---|---|
| `git rev-parse HEAD` | `7ba68db95debf3565a0b07a1c74b004eb1de3d1f` |
| `cd backend && npm test` | PASS |
| `cd frontend && npm run lint` | PASS |
| `cd frontend && npm run build` | PASS |
| CI workflow | chưa có |
| SQLite | schema v1. Sau `V2-M0-04`, `POST /api/charts/generate` không ghi ngày giờ sinh. Hàng cũ không bị xóa |
| Catalog | 63 cách, 58 rule v2; 10 pilot: 7 CONFLICT, 2 PARTIAL, 1 NOT_IMPLEMENTED, 0 MATCH |
| Ấn bản lúc audit | cả hai edition `authenticated: false`. Sau đó chủ dự án chấp nhận PDF 277 trang, rồi đặt `authenticated: true` cho phiếu 2012 và item Archive 2017. Sách 2012 chưa mở, scan 2017 chưa đối chữ |
| LLM / Tiểu hạn / đăng nhập | chưa có trong code |

Working tree lúc tách nhánh còn dirty **ngoài** V2: `package-lock.json`, `frontend/package-lock.json`, `.cursor/`, `rules/`. Không stage.

Commit `ca947b1` (pointer B3) nằm trên `autodev/m0-foundation`, không nằm trên `main`. Không cherry-pick vào V2.

## 3. V1 carryover

| V1 | V2 | Trạng thái lúc mở V2 |
|---|---|---|
| M0-01 | — | `ALREADY_COMPLETED` — `49a2234`, merge `7ba68db` |
| M0-02 | `V2-M0-01` | `READY` |
| KB-01 | `V2-KB-01` | `PLANNED` (sau M0-01) |
| KB-02 | `V2-KB-02` | `BLOCKED_HUMAN` |
| P1.3B | `V2-KB-03` | prototype `PLANNED`; production migration `BLOCKED_HUMAN` |
| COMBO-FIX | `V2-RULE-01` | `PLANNED` — không ghi đè `rulesV2.json` |
| FORTUNE-01 | `V2-TIME-*` | `PLANNED` |
| LLM-01 | `V2-AI-*` | `DEFERRED` đến khi có interpretation + evidence |
| AUTH-01 | — | `EXCLUDED_BY_PRODUCT_SCOPE` |

## 4. Excluded

`EXCLUDED_BY_PRODUCT_SCOPE`: đăng ký, đăng nhập, hồ sơ, lịch sử lá số, dashboard sinh, API lịch sử ngày giờ, đồng bộ cloud, subscription/payment. Không đưa lại với tên khác. Không MongoDB/PostgreSQL khi chưa có nhu cầu đã chứng minh.

## 5. Domain gates

Không đổi công thức an sao hay rule runtime khi chưa được duyệt. Không nâng `bibliographicStatus` / `authenticated` / `formulaCheckedAgainstSource` từ test PASS hoặc PDF dựng lại. Không ghi đè `backend/data/*.sqlite`. Không copy `description` cách cục vào claims. Không bật cách `disabled`. Không khẳng định bệnh tật, sinh tử, tai họa. Bốn lớp: `implementationStatus`, `formulaStatus`, `bibliographicStatus`, `interpretationStatus`.

## 6. Task contract

Trạng thái: `PLANNED`, `READY`, `IN_PROGRESS`, `BLOCKED`, `BLOCKED_HUMAN`, `COMPLETED`, `FAILED`, `DEFERRED`, `ALREADY_COMPLETED`, `EXCLUDED_BY_PRODUCT_SCOPE`.

Test V2 chỉ khóa invariant ổn định (AUTH bị loại, KB-02 còn `BLOCKED_HUMAN`, không tuyên bố ấn bản đã `authenticated`). Không khóa chữ `READY`/`PLANNED` của task đang chạy.

## 7. Near-term backlog

### V2-M0-01 — CONTRIBUTING safeguards

- epic: M0
- priority: P0
- status: COMPLETED
- dependencies: []
- dependency_class: TECHNICAL
- scope: `docs/engineering/CONTRIBUTING.md`, `docs/CHANGELOG.md`, dòng trạng thái trong file này
- outOfScope: engine, JSON rule, SQLite, V1 master plan
- acceptanceCriteria:
  - CONTRIBUTING nêu bốn điều cấm: sửa im công thức, nâng trạng thái nguồn, ghi đè SQLite người dùng, merge thay đổi nhạy cảm vào `main` khi chưa duyệt
  - Nêu bốn lớp provenance và tách chúng khỏi test PASS
  - Ghi AUTH/lịch sử lá số nằm ngoài phạm vi
- negativeTests: không diff `tuviRules.mjs`, `rulesV2.json`, `combinations.json`, `sqlite.js`
- verificationCommands: `cd backend && node test/knowledgeCatalog.test.mjs`
- requiresHumanApproval: no
- rollbackPlan: revert commit docs
- deliverables: `docs/engineering/CONTRIBUTING.md`

### V2-KB-01 — Provenance contract

- epic: KB
- priority: P0
- status: COMPLETED
- dependencies: [V2-M0-01]
- dependency_class: TECHNICAL
- scope: `docs/knowledge/provenance-contract.json`, `backend/src/knowledge/provenance.js`, `backend/test/provenance.test.mjs`, `backend/package.json` test script
- outOfScope: SQLite, rule runtime, nâng trạng thái catalog hiện có
- acceptanceCriteria:
  - Contract máy đọc được cho bốn chiều và transition hợp lệ
  - Negative test: test PASS không được thành bibliographic primary; không set `checked_against_edition` khi edition chưa authenticated
- negativeTests: catalog hiện tại vẫn cấm `bibliographicStatus: primary` và `formulaCheckedAgainstSource: true`
- verificationCommands: `cd backend && npm test`
- requiresHumanApproval: no
- rollbackPlan: xóa module và test; schema v1 không đổi
- deliverables: contract JSON + validator

### V2-M0-03 — CI

- epic: M0
- priority: P1
- status: COMPLETED
- dependencies: []
- dependency_class: TECHNICAL
- scope: `.github/workflows/ci.yml`
- outOfScope: deploy, secrets
- acceptanceCriteria: workflow chạy backend `npm test`, frontend `npm run lint` và `npm run build` trên push/PR
- negativeTests: workflow không chứa secret
- verificationCommands: đọc YAML; `actionlint` nếu có, không thì kiểm cú pháp cấu trúc
- requiresHumanApproval: no
- rollbackPlan: xóa workflow
- deliverables: `.github/workflows/ci.yml`

### V2-M0-02 — Agent engineering guidelines

- epic: M0
- priority: P1
- status: COMPLETED
- dependencies: [V2-M0-01]
- dependency_class: TECHNICAL
- scope: `docs/engineering/AGENT_ENGINEERING.md`
- outOfScope: copy skill B3 vào repo
- acceptanceCriteria: agent đọc được hàng rào domain, phạm vi loại trừ, và cổng duyệt người
- negativeTests: không thêm `.cursor/skills` bản sao
- verificationCommands: file tồn tại; catalog test PASS
- requiresHumanApproval: no
- rollbackPlan: xóa file
- deliverables: `docs/engineering/AGENT_ENGINEERING.md`

### V2-M0-07 — Không khóa status sống

- epic: M0
- priority: P1
- status: COMPLETED
- dependencies: []
- dependency_class: TECHNICAL
- scope: test V2 trong `knowledgeCatalog.test.mjs` (cùng commit plan)
- acceptanceCriteria: test V2 khóa invariant (AUTH loại trừ, KB-02 còn BLOCKED_HUMAN, production migration chưa COMPLETED); không khóa `status: READY` của từng task; test V1 vẫn khóa graph lịch sử vì file V1 không sửa
- completionEvidence: assert trong `knowledgeCatalog.test.mjs` khi commit plan
- requiresHumanApproval: no
- rollbackPlan: revert test
- deliverables: invariant test

### V2-KB-03 — Knowledge schema prototype

- epic: KB
- priority: P1
- status: COMPLETED
- dependencies: [V2-KB-01]
- dependency_class: TECHNICAL (prototype) / HUMAN_APPROVAL + DATA_MIGRATION (production)
- scope: module schema áp trên DB tạm; test temp file
- outOfScope: `initDatabase()` schema v1, file `backend/data/tuvi.sqlite`, import description
- acceptanceCriteria: prototype tạo bảng sources/editions/claims/claim_sources/claim_links/claim_revisions/combination_claims trên DB tạm; gọi lại không nhân đôi; DB mặc định vẫn schema 1
- negativeTests: không ghi `backend/data/tuvi.sqlite`; không copy description
- verificationCommands: `cd backend && npm test`
- requiresHumanApproval: prototype no; production migration yes
- rollbackPlan: không đụng DB thật; xóa module
- deliverables: prototype + test

### V2-M0-04 — Privacy / stateless generate

- epic: M0
- priority: P1
- status: COMPLETED
- dependencies: []
- dependency_class: SECURITY
- scope: `chartRoutes.js` và test: generate không bắt buộc ghi ngày giờ
- outOfScope: xóa hàng `horoscopes` đã có; tài khoản
- acceptanceCriteria: POST generate trả lá số khi không ghi SQLite; dữ liệu cũ không bị xóa; log lỗi không in payload ngày sinh
- negativeTests: không `DELETE FROM horoscopes`
- verificationCommands: `cd backend && npm test`
- requiresHumanApproval: no nếu không xóa dữ liệu cũ
- rollbackPlan: revert route
- deliverables: route + test

### V2-KB-02 — Edition dossier

- epic: KB
- priority: P0
- status: COMPLETED
- dependencies: []
- dependency_class: DOMAIN_SOURCE, HUMAN_APPROVAL
- scope: PDF 277 trang tuvithuchanh.com, do chủ dự án chấp nhận 2026-10-12
- acceptanceCriteria: `authenticated: true` trên edition PDF 277 trang, với `authenticationBasis: project_owner`. Không ghi năm in 1956 là đã chứng minh. Edition khác: `authenticated: true` chỉ sau khi người chấp nhận đúng bản.
- later: ngày 2026-10-12 chủ dự án đặt `authenticated: true` cho phiếu 2012 (`library_record_accepted_by_owner`) và item Archive 2017 (`archive_item_accepted_by_owner`). `physicalCopyInspected`, `textVerified`, `textCollatedAgainstOriginal` vẫn false.
- requiresHumanApproval: yes — đã có cho file PDF này
- rollbackPlan: đặt lại `authenticated: false` nếu chủ dự án rút chấp nhận
- deliverables: `docs/knowledge/sources.json`

### V2-KB-03-prod — Production schema migration

- status: BLOCKED_HUMAN
- dependencies: [V2-KB-02, V2-KB-03]
- requiresHumanApproval: yes
- note: vẫn BLOCKED_HUMAN. PDF 277 trang đã được chủ dự án chấp nhận, nhưng bibliographicStatus của tác phẩm vẫn `conflicting_secondary`, công thức pilot chưa MATCH, và không có duyệt migration.

## 8. Later epics (not READY)

Không thực thi trong phiên nền tảng trừ khi near-term ở trên đã xong và task vẫn không đụng cổng duyệt.

| Id | Epic | Status | Hard dependency | Human |
|---|---|---|---|---|
| V2-M0-05 | Backup/recovery checks trên DB tạm | COMPLETED | V2-KB-03 prototype | no |
| V2-M0-06 | Error handling/logging review | COMPLETED | none | no |
| V2-M0-08 | Tách golden vs regression fixtures | COMPLETED | none | no |
| V2-KB-04 | Knowledge validator | COMPLETED | V2-KB-01 | no |
| V2-KB-05 | Query layer | COMPLETED | V2-KB-03 | no |
| V2-KB-06 | Mở rộng 63 cách | PLANNED | V2-KB-02 cho claim đã duyệt | yes nếu nâng trạng thái |
| V2-RULE-01 | Đối chiếu CONFLICT/PARTIAL | PLANNED | nghiên cứu; sửa runtime cần duyệt | yes để ghi `rulesV2.json` |
| V2-RULE-02 | DSL mới | PLANNED | nhu cầu đã chứng minh | yes nếu bật disabled |
| V2-RULE-03 | Evidence v3 | COMPLETED | rule engine hiện tại | no nếu chỉ thêm DTO |
| V2-RULE-04 | Contradiction resolver | PLANNED | V2-KB-01 | no |
| V2-INTERPRET-01…08 | Luận giải tất định | foundation COMPLETED trên sprint 3; lời luận UI vẫn cần duyệt | claims có nhãn; không LLM | yes nếu đưa chữ tuyệt đối ra UI |
| V2-TIME-01…05 | Vận hạn | PARTIAL: đọc nhãn đại hạn; chu kỳ khác BLOCKED | nguồn công thức | yes trước khi luận UI |
| V2-AI-01 | POC nội bộ | COMPLETED trên sprint 7; public vẫn cần duyệt | interpretation + evidence DTO | yes trước public |
| V2-AI-02…06 | Provider, narrator, guard, chat, eval | DEFERRED | V2-AI-01 | yes trước public |
| V2-UX-01…08 | UI luận giải, evidence, export | PLANNED | API tương ứng | no |
| V2-OPS-01…08 | CD, security, monitor, deploy | PLANNED | CI | yes trước production |

`V2-UX-*` không gồm đăng nhập hay thư viện lịch sử. Export chỉ theo thao tác trực tiếp.

## 9. Dependency graph

```text
M0-01 V1 ALREADY_COMPLETED (7ba68db)
        │
V2-M0-01 CONTRIBUTING          READY
        │
V2-KB-01 provenance contract
        │
V2-KB-03 prototype (temp DB)     V2-M0-03 CI (độc lập)
        │
V2-KB-02 PDF 277 trang owner-accepted ── V2-KB-03-prod BLOCKED_HUMAN
        │
V2-RULE-01 (sửa runtime: HUMAN)
        │
V2-INTERPRET MVP
        │
V2-TIME (nguồn)          V2-AI POC (DEFERRED đến evidence)
        │
public AI / production   HUMAN
```

AUTH-01 không có cạnh.

## 10. Session order

Hàng gần ở mục 6 đã xong. Trạng thái từng task lấy ở mục 7: `V2-KB-02` là COMPLETED, không còn là cổng chặn. Production migration `V2-KB-03-prod` vẫn `BLOCKED_HUMAN`.

Các phiên sau nền tảng nằm ở mục 14 đến mục 19. Không sửa `docs/archive/planning/AUTODEV_MASTER_PLAN.md`.

## 11. Release milestones

| Mốc | Nội dung | Phiên này |
|---|---|---|
| R1 | Nền kỹ thuật, CI, privacy | mục tiêu một phần |
| R2 | KB pilot có contract, prototype, query | contract + prototype nếu kịp |
| R3–R4 | Luận Mệnh/Thân/Phúc/Tài/Quan rồi 12 cung | không |
| R5 | Vận hạn | không |
| R6 | AI | không |
| R7 | Production | không |

## 12. Risks

| Rủi ro | Xử lý |
|---|---|
| Sửa V1 plan làm gãy test historical | Không sửa `docs/archive/planning/AUTODEV_MASTER_PLAN.md` |
| Prototype schema chạy trên DB thật | Không gọi từ `initDatabase()` |
| Stateless generate xóa lá số cũ | Cấm DELETE |
| PDF 277 trang thành ấn bản 1956 | `BLOCKED_HUMAN` |
| Nhánh `ca947b1` lẫn vào V2 | Không cherry-pick |
| Lockfile / `.cursor` / `rules` | Không stage |

## 13. Progress rules

Một task `COMPLETED` khi acceptance đã kiểm bằng lệnh, review không còn finding chặn, commit trên feature branch. Checkpoint: `.b3/autodev/` (ignored). Không push `main`. PR là đề xuất review, không phải merge.

## 14. Sprint 2

Các task kỹ thuật sau foundation đã có mã trên `autodev/v2-sprint-2`: `V2-M0-05`, `V2-KB-04`, `V2-KB-05`, `V2-M0-06`, `V2-RULE-03`, `V2-M0-08`.

`V2-KB-03-prod` vẫn `BLOCKED_HUMAN`. Prototype và query layer không phải knowledge base production. Không có lá số expert-verified golden. Evidence v3 ghi runtime match; thành cách theo nguồn chỉ khi công thức đã đối chiếu trên edition `authenticated: true`. Phá cách không được suy từ pattern. Cổng edition chỉ nhìn `authenticated`. DTO này chưa nối vào response API. Deterministic interpretation pipeline trả phân tích có cấu trúc và `prose: null` khi chưa có claim được duyệt.

## 15. Sprint 3

`V2-INTERPRET` foundation trên `autodev/v2-sprint-3`: contract luận điểm, nối rule engine với evidence v3, eligibility, 12 cung chức cộng lớp Thân, mâu thuẫn và thiếu chứng cứ. Không có lời luận người dùng.

## 16. Sprint 4

Báo cáo coverage đọc catalog hiện có. Pilot claims giữ nguyên trạng thái đối chiếu. `rulesV2.json` không đổi. Edition authenticated không biến công thức thành đã kiểm. Ý nghĩa sao và cung trong SQLite chưa được review thư tịch.

## 17. Sprint 5

`POST /api/interpretations/analyze` trả 12 cung chức, lớp Thân, và tổng hợp chủ đề. Không có điểm toàn lá số và không có lời luận. Response không kèm payload ngày giờ sinh.

## 18. Sprint 6

Nhãn đại hạn đã có trên lá số gốc được đọc lại, không tính lại. Tiểu hạn, lưu niên, lưu tinh, tứ hóa hạn và vận hạn tháng nhuận ở `blocked` / `not_applied` vì chưa có công thức được duyệt. Không có luận vận hạn.

## 19. Sprint 7

POC nội bộ: hỏi đáp đọc DTO. Narrator chỉ giữ id đã có trong phân tích và không chuyển lời của model ra ngoài. Fallback khi model bịa id hoặc quá hạn. Không gọi model thật trong test. Không có API key. Chưa public.

## 20. Sprint 8

Nhánh `autodev/v2-sprint-8` từ `2ca0186`. Đo coverage trước khi thêm test: backend 76.06% dòng / 82.29% nhánh, frontend 0%. Sau test: backend 79.14 / 84.86, frontend 38.73 / 59.04. Chi tiết ở `docs/engineering/quality/`.

Đã thêm explorer chứng cứ theo cung, in và JSON không kèm luận giải đã duyệt, `createApp`, giới hạn body 256kb, và smoke Playwright local (4 passed). GitHub Actions của nhánh này chưa được chạy trong phiên lập báo cáo.

Không sửa `tuviRules.mjs`, `rulesV2.json`, hoặc `docs/archive/planning/AUTODEV_MASTER_PLAN.md`. Không duyệt claim. Không mở vận hạn hay AI public.

## 21. Sprint 9B status

Đo trên nhánh research sau integrity gate `69f7f86`. Research dossier 63/63. Nguồn đọc được trong span Tân Biên: 24/63. Trang PDF kiểm chữ: 0. Dual-AI: 24. `MATCH` không bị ép. 39 cách `SOURCE_INACCESSIBLE`. `expertVerified` vẫn false. Runtime rules không đổi. Báo cáo: `docs/archive/sprints/tuvi/sprint-9/SPRINT_9B_COMPLETION_REPORT.md`.

## 22. Sprint 9 closure status — merged and integration complete (2026-10-14)

Đã xác minh trên GitHub: PR #25 (merge `434345c`) và PR #27 (merge `1a85cd8`) đều nằm trên `main`; HEAD lúc rebaseline là `b014969`, gồm PR #24 của Thần Số Học; CI `38437441255` PASS tại `b014969`. Đây là **engineering-integration COMPLETE**, không phải historical/expert verification hoặc duyệt lời luận.

Formula V1 giữ 63 catalog records (ACTIVE 29, VARIANT 24, INTERNAL_ONLY 2, DISABLED 8); 55 predicates thực thi, 67 source variants, 50 default-profile recognition results. `rulesV2.json` giữ nguyên research snapshot. Combination matcher và `interpretChart` dùng chung `evaluateNormalizedFormulas`; profile không di chuyển sao nguyên cục. Lát cắt Tử Phủ Đồng Cung giữ `prose: null`, `expertVerified: false`, `interpretationEligibility.eligible: false`; `AI_ACCEPTED` / `MATCH` **không** duyệt nội dung luận giải. API phân tích mặc định không xuất `internalInterpretation`, từ chối `normalizedChart` do client đưa vào; giá trị cát/hung chưa xác định là `auspicious: null`. Chi tiết ở `docs/archive/sprints/tuvi/sprint-9/SPRINT_9_CLOSURE_REPORT.md`.

Các thiếu hụt thư tịch/điều kiện/claim còn mở đi tiếp dưới backlog có provenance; không lấy việc merge làm xác thực sử học hay duyệt claim.

## 23. Sprint 10 — READY / CONDITIONAL GO (2026-10-14)

- **Baseline xác minh:** `main` `b014969`; scope hiện tại là research và implementation của Condition DSL, formation/breaking, evidence và claim eligibility. **Chưa có implementation Sprint 10 được nghiệm thu**.
- **S10-01 — implemented in the Sprint 10 branch / P0:** operator matrix and `OPERATORS` list. Ambiguous prose conditions stay `not_implemented`.
- **S10-04 — recounted, dual-AI not re-run / P0:** live Tân Biên files are CONFLICT 12, PARTIAL 6, MATCH 3, NOT_IMPLEMENTED 2, UNRESOLVED 1. Sprint 9C files are CONFLICT 20, PARTIAL 11, MATCH 5, NOT_IMPLEMENTED 3. No new model invocation was recorded.
- **S10-02 — implemented / P0:** `evaluateCondition` returns `satisfied`, `not_satisfied`, `unknown`, or `not_implemented`. Unknown does not pass.
- **S10-03 — implemented / P0:** `evaluateLayers` does not copy a runtime match into formation, grade, breaking, or interpretation eligibility.
- **S10-06 — implemented / P1:** contradictory claims resolve to `unresolved` with `winner: null`.
- **S10-07 — implemented for the new evaluator / P1:** `backend/test/conditionEval.test.mjs` and the Tử Phủ slice regression.
- **S10-05 — no correction shipped / P1:** Formula V1 was not edited. A future source-sensitive change still needs its own review and owner merge.

**Acceptance:** một internal chart → Formula V1 → typed condition → evidence/provenance → claim eligibility flow có negative cases, với abstention nếu chưa đủ nguồn; CI backend/frontend/E2E PASS, coverage đo thật, review độc lập và report GO/NO-GO. Mặc định không phát public prose, fortune, AI, nâng `expertVerified`, hay ghi SQLite production. Owner vẫn duyệt từng PR và release gate.

**Tài liệu điều phối:** `docs/planning/ROADMAP_SPRINT_9_14.md` §6 là roadmap chi tiết; Master Plan V2 là tracker task chính. Giữ Master Plan V1 lịch sử, không tạo V3.

## 24. Sprint 11 — evidence-grounded interpretation (2026-10-14)

Baseline `18fab65` (PR #25, #27, #29, #32 on main). Formula V1 path: `backend/src/data/formulaV1.mjs`.

- **S11-01 — implemented:** eligibility layers; `MATCH` is not interpretation approval.
- **S11-02 — content blocked:** five priority palaces and Thân overlay stay structured. No fabricated readings.
- **S11-03 — implemented:** deterministic copy of `approvedWording` only, internal channel.
- **S11-04 — implemented:** evidence UI shows layer status.
- **S11-05 — implemented:** twelve palace functions always return a status.
- **S11-06 — implemented:** topic rollup, `score: null`.
- **S11-07 — fixtures only:** no new dual-AI interpretation review.
- **S11-08 — implemented:** public analyze and chart export omit unapproved prose.

**GO / NO-GO:** engineering CONDITIONAL GO; internal content NO-GO; public release NO-GO; Sprint 12 research CONDITIONAL GO. Matrix: `docs/archive/sprints/tuvi/sprint-11/INTERPRETATION_COVERAGE_MATRIX.md`.

## 25. Sprint 11B — one internal interpretation claim (2026-10-14)

PR #33 was not merged at start. Stacked on that branch. Two interpretation reviews of the stored Tân Biên Tử Phủ span were executed (`grok-4.7-high` `bc-f2233997-a2cb-5eed-9dd0-1dfac28c23e0`, `gpt-5.6-terra-medium` `bc-122a2db4-09d4-51f4-a029-2cd744690f1e`). Claim `interp-tu-phu-dong-cung-giap-menh` requires a live Formula V1 hit, profile `tan-bien`, palace Mệnh, and year stem Giáp. Grade is not certified. Breaking is not promoted. Public prose stays null. Report: `docs/archive/sprints/tuvi/sprint-11/SPRINT_11B_REPORT.md`.

