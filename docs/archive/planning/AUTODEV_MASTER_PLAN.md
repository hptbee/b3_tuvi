# AutoDev Master Plan — Tử Vi Việt Nam (`b3_tuvi`)

- version: 1
- verified_at: `db253448798339946d1f90a25843c5b939756040` (2026-10-12)
- branch_policy: làm việc trên nhánh feature; không merge thay đổi nhạy cảm (công thức, nguồn, dữ liệu người dùng) vào `main` khi chưa được duyệt

Đây là **nguồn sự thật duy nhất** cho lộ trình AutoDev: thứ tự việc, phụ thuộc, tiêu chuẩn kỹ thuật, hàng rào domain, và tiêu chí nghiệm thu. Tài liệu pha (P0, P1.1, …) là bằng chứng đã làm, không phải lộ trình thứ hai.

## Hiện trạng đã kiểm (bỏ qua)

Không lập lại các việc này. Bằng chứng: commit và test tại HEAD trên.

| Id | Việc | Bằng chứng |
|---|---|---|
| P0 | Matcher cách cục thuần, catalog JSON, hồ sơ trường phái | `fb58d73`, `c93e23b`, `docs/archive/implementation/p0-p1/P0_IMPLEMENTATION_REPORT.md` |
| P1.1 | Model lá số chuẩn hóa, quan hệ cung | `c0690e4`, `docs/archive/implementation/p0-p1/P1_1_CHART_MODEL_REPORT.md` |
| P1.2 | Rule engine v2 | `3d6bb5d`, `docs/archive/implementation/p0-p1/P1_2_RULE_ENGINE.md` |
| P1.2.5 | Audit engine + thống nhất API catalog | `2ead661`, `docs/archive/implementation/p0-p1/P1_2_5_DEEP_AUDIT.md` |
| SQL-01 | MongoDB → SQLite schema v1 | `35301d2`, `docs/archive/specs/SQLITE_MIGRATION_VERIFICATION.md` |
| P1.3A | Sổ nguồn, ma trận 63 cách | `db25344`, `docs/knowledge/`, `docs/archive/implementation/p0-p1/P1_3A_KNOWLEDGE_AUDIT.md` |
| P1.3A.1 | Đối chiếu 10 cách với PDF Tân Biên 277 trang | `db25344`, `docs/archive/implementation/p0-p1/P1_3A_1_SOURCE_VERIFICATION.md` |

Kiểm tra catalog lúc lập kế hoạch: `cd backend && node test/knowledgeCatalog.test.mjs` — PASS. Schema SQLite = `1`. Không ấn bản in nào `authenticated: true`. Không cách nào `formulaCheckedAgainstSource: true`. Khoa Minh Lộc Ám vẫn `disabled`.

## Hàng rào domain (bắt buộc)

1. Không sửa im lặng công thức truyền thống (`tuviRules.mjs`, bảng an sao, `rulesV2.json`, `combinations.json` logic).
2. Không nâng `bibliographicStatus`, `formulaCheckedAgainstSource`, hay `verification_status` chỉ vì test phần mềm đã PASS hoặc đã có đoạn PDF chưa giám định bìa.
3. Không ghi đè dữ liệu người dùng (`backend/data/*.sqlite`).
4. Không merge thay đổi nhạy cảm vào `main` khi chưa được người duyệt.
5. Bốn lớp provenance không gộp thành một điểm: implementation, formula, bibliographic, interpretation (`docs/tuvi/KNOWLEDGE_CLAIM_MODEL.md`).
6. Không bật cách `disabled`. Không gọi LLM. Không luận Tiểu hạn / lưu niên / “vận hạn” khi nguồn chưa có.
7. Khác biệt phái ghi `schoolId`; không suy từ độ phổ biến trên web.

## Phạm vi không làm trong hàng đợi hiện tại

- Tích hợp LLM / AI luận giải / vector DB.
- Tính vận hạn, Tiểu hạn, lưu niên, câu “vận số”.
- Đăng nhập, màn hình lịch sử lá số.
- PostgreSQL.
- Copy mô tả 63 cách vào bảng claim.
- Commit bản sao B3 (`.cursor/`, `rules/`) vào repo sản phẩm.

## Hàng đợi thực thi

Thứ tự: **M0 → KB-01 → (dừng nếu cần người) → KB-02 → P1.3B**. Việc sau P1.3B chỉ mở khi claim đã dẫn nguồn.

### M0 — Nền tảng AutoDev

#### M0-01 — Công bố Master Plan (T001)

- status: completed (tài liệu này)
- depends_on: []
- scope: `docs/archive/planning/AUTODEV_MASTER_PLAN.md`, changelog, test khóa file này
- acceptance_criteria:
  - File này tồn tại và liệt kê việc đã xong, việc READY, việc BLOCKED/deferred.
  - Không tuyên bố công thức đã khớp thư hay ấn bản đã giám định.
- verification: `cd backend && node test/knowledgeCatalog.test.mjs`

#### M0-02 — Ghi hàng rào vào CONTRIBUTING (T002)

- status: pending
- depends_on: [M0-01]
- scope: `docs/engineering/CONTRIBUTING.md`
- acceptance_criteria: người đóng góp thấy rõ bốn điều cấm (công thức, nâng trạng thái nguồn, ghi đè SQLite, merge nhạy cảm vào `main`) và bốn lớp provenance.
- verification: diff chỉ gồm CONTRIBUTING; catalog test vẫn PASS.

### KB — Provenance tri thức

#### KB-01 — Hợp đồng provenance (T003)

- status: pending
- depends_on: [M0-02]
- scope: file policy/schema mới dưới `docs/knowledge/`, test catalog. **Không** `sqlite.js`.
- acceptance_criteria:
  - Contract máy đọc được cho bốn lớp trạng thái.
  - Test vẫn cấm `bibliographicStatus: primary` và `formulaCheckedAgainstSource: true` trên catalog hiện tại.
  - Không đổi rule runtime, không schema v2, không nạp `description` cách cục thành claim.
- verification: `cd backend && npm test`

#### KB-02 — Giám định một ấn bản in (T004)

- status: **BLOCKED** (cần người)
- depends_on: [KB-01]
- scope: `docs/knowledge/sources.json` (bìa, NXB, năm, số trang của ấn bản cầm tay hoặc catalog thư viện đã đối)
- acceptance_criteria: một `edition` có `authenticated: true` từ bìa/colophon, không từ PDF InDesign 2014 hay trang bán sách.
- verification: người xác nhận ảnh bìa / phiếu thư viện. Phần mềm không tự hoàn tất.

### P1.3B — Schema SQLite v2 (T005)

- status: **BLOCKED**
- depends_on: [KB-01, KB-02]
- Điều kiện trong `docs/archive/implementation/p0-p1/P1_3B_IMPLEMENTATION_PLAN.md` vẫn giữ: không còn `conflicting_secondary` / `unverified_attribution` trên ấn bản dùng để gắn claim, và ít nhất một claim có `page` hoặc `location` trỏ ấn bản đó.
- P1.3A.1 ghi “READY FOR P1.3B PILOT” nghĩa là *có thể thử bảng nguồn rỗng với cờ ấn bản chưa xác thực*. Việc đó **không** nằm trong hàng READY hiện tại. Không nạp 63 lời luận. Không đổi `verification_status`.

### Deferred (không READY)

| Id | Việc | Mở khi |
|---|---|---|
| LLM-01 | Luận giải bằng mô hình ngôn ngữ | Có claim đã dẫn nguồn; không dùng chữ chưa nguồn làm RAG |
| FORTUNE-01 | Tiểu hạn / lưu niên / câu vận hạn | Có nguồn và rule riêng, không suy từ Đại hạn |
| AUTH-01 | Đăng nhập / lịch sử UI | Sau M0; không đụng engine |
| COMBO-FIX | Sửa rule CONFLICT/PARTIAL theo Tân Biên | Sau KB-02 và quyết định phái/ấn bản |

Mười cách pilot: **0 MATCH**. 7 CONFLICT, 2 PARTIAL, 1 NOT_IMPLEMENTED. Không sửa rule trong M0/KB-01.

## Đồ thị phụ thuộc

```text
P0 … P1.3A.1 (completed)
        │
     M0-01  Master Plan          completed
        │
     M0-02  CONTRIBUTING safeguards  READY
        │
     KB-01  Provenance contract
        │
     KB-02  Authenticate edition  BLOCKED (human)
        │
     P1.3B  SQLite schema v2      BLOCKED
        │
    LLM-01 / FORTUNE-01           deferred
```

COMBO-FIX phụ thuộc KB-02 và không tự chạy từ PDF chưa giám định.

## Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Gộp test PASS với “đúng thư” | Bốn lớp provenance; test cấm nâng cờ |
| PDF 277 trang bị coi là in 1956 | Hai `edition` tách; cả hai `authenticated: false` |
| P1.3B tạo bảng rồi nhét `description` | Cấm trong plan P1.3B và KB-01 |
| Làm trên `main` | Nhánh `autodev/*`; không push/merge trừ khi được hỏi |
| Bắt đầu LLM sớm | LLM-01 deferred |

## Kế hoạch kiểm chứng

| Việc | Lệnh / bằng chứng |
|---|---|
| Catalog + provenance | `cd backend && node test/knowledgeCatalog.test.mjs` |
| Engine + SQLite | `cd backend && npm test` |
| Frontend (khi đụng UI) | `cd frontend && npm run lint` và `npm run build` |
| Domain | Đối chiếu `docs/knowledge/` và ấn bản đã `authenticated`; không dùng web làm primary |
| Git | Diff trong scope; không stage `.b3/`, lockfile lạ, `.cursor/`, `rules/` |

## Nghiệm thu một vòng AutoDev

Một task `completed` khi: tiêu chí quan sát được giữ, lệnh verification đã chạy PASS, review không còn finding CONFIRMED chặn, commit nằm trên nhánh feature, SHA ghi vào `.b3/autodev/progress.md`. Thiếu bằng chứng = INCOMPLETE. Cần người = BLOCKED.
