# Thần Số Học — trạng thái triển khai

> **Rebaseline:** 2026-10-14 · baseline `main 2d08b2e` (merge [PR #31](https://github.com/hptbee/b3_tuvi/pull/31) — năm chỉ số nâng cao, công thức-only).
> **Current:** `V1_FEATURE_COMPLETE` cho calculator + báo cáo nhiều chương; `FORMULA_PROFILE_CONSISTENT` với `pythagorean-vn-v1` `1.2.0`; catalog `1.2.0` (154 bài). **Không** `FORMULA_SOURCE_VERIFIED`, **không** `PRODUCTION_READY`.
> **Merged:** PR #18, #20–#24, **#31**. **CI:** xác nhận trên main sau merge #31 (backend/frontend/e2e). Không triển khai staging/production trong các PR này.

Tài liệu này ghi **runtime hiện hành**, còn các commit ban đầu và phép đo ở SHA cũ là *historical evidence*. Roadmap cập nhật tại [ROADMAP_NUMEROLOGY_A_TO_Z](../planning/ROADMAP_NUMEROLOGY_A_TO_Z.md) §12.9, §15–18.

## Năng lực đang hoạt động

| Phần | Đã triển khai |
|---|---|
| Input | Ngày sinh dương lịch, năm 1200–2199, không ở tương lai; họ tên khai sinh tùy chọn; không yêu cầu giờ/giới tính |
| Profile | `pythagorean-vn-v1`, phiên bản `1.2.0`; một quy ước sản phẩm rõ ràng, không silent fallback |
| Chỉ số ngày | Đường đời, Ngày sinh, Thái độ |
| Chỉ số tên | Biểu đạt, Linh hồn, Nhân cách; Trưởng thành từ Đường đời + Biểu đạt |
| Trace | Thành phần phép cộng, từng bước rút gọn, master/root; tên chuẩn hóa và giá trị từng chữ |
| Trạng thái thiếu dữ liệu | Không có tên → bốn chỉ số tên unavailable; thiếu nguyên âm/phụ âm → chỉ nhóm tương ứng unavailable |
| API | `GET /api/numerology/profiles`, `GET /api/numerology/meanings/:metricId/:value`, `POST /api/numerology/calculate`; typed errors, scoped parser boundary, schema/profile/referenceDate |
| UI | Báo cáo nhiều chương: overview, core metrics + inline readings (154 bài), Birth Grid 8 tuyến, Name/Combined 3×3, pinnacles/challenges, 9-year/12-month cycle, bridges, **5 advanced indicators** (formula + trace, meaning withheld), JSON/import/print, mobile 320/390 |
| Riêng tư | POST, no-store kể cả lỗi/preflight/429; không thêm persistence/URL/browser storage; không log tên/body/query; họ tên chỉ vào JSON/bản in khi opt-in; import chỉ đưa input sang backend để tính lại |

Frontend chỉ hiển thị kết quả server, không copy công thức. Engine thuần nhận ngày tham chiếu được inject; API chụp ngày một lần theo `Asia/Ho_Chi_Minh`. Không thay công thức Tử Vi, không migration SQLite, không thêm dependency hoặc tài khoản.

## Quy ước và giới hạn nguồn

- Đường đời cộng tất cả chữ số ngày sinh, khác phương pháp rút gọn từng thành phần.
- Giữ 11/22/33 cho Đường đời, Ngày sinh, Biểu đạt, Linh hồn, Nhân cách, Trưởng thành; Thái độ về 1–9. Master vẫn có `rootValue`.
- Tên: NFC/NFD tương đương, accent whitelist Latin/tiếng Việt, Đ → D, A–Z → 1–9, nguyên âm AEIOU, Y là phụ âm. Cho phép khoảng trắng/gạch nối/apostrophe như spec; từ chối ký tự ẩn, unsupported script/mark/ligature thay vì bỏ âm thầm. Tên rỗng/whitespace thường là không có tên.
- `status=experimental`, `sourceStatus=product_specification_only`. Catalog `1.2.0` giữ 102 bài cốt lõi và chu kỳ của `1.1.0`, rồi thêm 44 bài đỉnh theo giai đoạn và 8 bài thử thách. Thử thách 0 và số 33 không có bài. Review: [CONTENT_1_1_REVIEW.md](reviews/CONTENT_1_1_REVIEW.md), [CONTENT_1_2_REVIEW.md](reviews/CONTENT_1_2_REVIEW.md). Hai lượt review không phải xác minh chuyên gia.

[Formula spec](FORMULA_SPEC.md), [decision register](DECISIONS.md), [source registry](SOURCE_REGISTRY.md), [fixture handbook](FIXTURES.md) và [API contract](API_CONTRACT.md) ghi quy ước thực tế. Fixture số học được tính độc lập với mã engine. Chúng kiểm chứng đúng theo quy ước sản phẩm, không chứng minh một ấn bản sách đã được đối chiếu. Kiểm toán 2026-10-13 đọc được các trang công thức trên worldnumerology.com; bậc là `source_read`, không phải `edition_verified`. Xem [báo cáo kiểm toán](audits/DEEP_AUDIT_REPORT.md).

Ví dụ kiểm chứng: `15/6/1990`, `Nguyễn Văn An` → `NGUYEN VAN AN`; thứ tự Đường đời/Ngày sinh/Thái độ/Biểu đạt/Linh hồn/Nhân cách/Trưởng thành = **4 / 6 / 3 / 3 / 1 / 11 / 7**.

## Kiểm chứng phát triển

### Baseline hiện hành

- `main ed31ad1` — [GitHub Actions 38438302551](https://github.com/hptbee/b3_tuvi/actions/runs/38438302551): **backend PASS, frontend PASS, e2e PASS**. Bằng chứng CI này không thay staging.
- PR #24 tích hợp visual acceptance: tháp đỉnh có cạnh, trục thử thách, grid chọn tuyến, combined chart, 320px/390px/A4 screenshots tại [screenshots/after](implementation/screenshots/after/).
- Local validation trong nhánh báo cáo: frontend test:ci **56 tests** tại visual pass; Playwright Numerology **19 passed**; build/lint passed (những số này là bằng chứng của đợt thực thi, không tuyên bố là số test toàn repository tại SHA khác).
- Các bug đã xử lý trong chuỗi PR: click cycle trước ngày sinh, print name opt-in, Challenge 0 copy, keyboard focus, chart hour navigation race.

### Các lệnh xác nhận chuẩn

```bash
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
npm run test:e2e --prefix frontend
```

Tại thời điểm này **chưa có bằng chứng** live staging, Safari/Firefox, comprehensive WCAG audit hoặc proxy multi-instance deployment. Profile source `product_specification_only`; Decoz `source_read` không phải authenticated book edition. Dữ liệu ngày sinh/tên gửi qua mạng đến backend để tính, dù server không persist.

## Commit triển khai ban đầu (historical)

| Task | Commit | Phạm vi |
|---|---|---|
| T001 | `9849b55169e7ec9ba9436c13fe2993ae907d8dc6` | Routing prompt B3 cloud; readable skill links không tự đăng ký native catalog |
| T002 | `c9e0903effa372f48cc0f1ef8f11b6be0ecfffd7` | Profile/spec, pure core, fixtures/validation |
| Engine đỉnh cao | `1570d7eb8ea962b5ddf75e9b9b14feaf36c0ff17` | Bốn giai đoạn, thử thách 0, tuổi gốc Đường đời, năm nhuận |
| T003 | `b91fd75d7e08bfc313b1af50ff75131159df0bb2` | API và privacy/error boundary |
| T004 | `3cc3496` | Public landing/form/kết quả và frontend regressions |

T005 thêm tài liệu này và integrated E2E; tìm commit bằng lịch sử Git. Checkpoint autodev cục bộ nằm ở `.b3/autodev/`, không commit cùng sản phẩm. Autodev tạo task commits cục bộ; push/merge/deploy là hành động riêng.

## Phần còn thiếu và trình tự tiếp theo

| Track | Phạm vi | Trạng thái |
|---|---|---|
| Knowledge K0 | Hidden Passion, Karmic Lessons, Balance, Rational Thought, Bridge | **`FORMULA_COMPLETE` / PR #31**: tính trong `POST /calculate`, `indicators` `1.0.0`, `meaningStatus: withheld`; không đổi profile `1.2.0` |
| Content K1 | Master 33 và Challenge 0 | `WITHHELD`; không fallback 33→6 hoặc 0→9 |
| Content K2 | Độ sâu 154 bài, grid/arrow/name/combined chart semantics theo trường phái | `PARTIAL`; tiếp tục research/editorial |
| Synthesis K3 | Quan hệ đa chỉ số có rule registry, không tự gán compatibility score | `NOT IMPLEMENTED` ở mức luận biểu tượng |
| UX K4 | Progressive interpretation, chapter links, PDF page breaks | `FOLLOW-UP` |
| Release R0 | Live staging, shared proxy limiter, rollback rehearsal, approval | `NOT READY` |

Xem [PRODUCT_COMPLETION_ROADMAP](product-gap/PRODUCT_COMPLETION_ROADMAP.md) và [roadmap chính §18](../planning/ROADMAP_NUMEROLOGY_A_TO_Z.md) cho `NUM-K001–009` / `NUM-R001–005`. Những giai đoạn khác như AI narration, alternate Decoz profiles, compatibility, baby-name recommendations hoặc user history không là release scope hiện tại.

**Kết luận:** Không cần làm lại N0–N4 hoặc mở lại product gap audit; nên dùng một AutoDev scoped cho Knowledge Expansion nếu muốn tiến về nội dung sâu hơn. Hoặc đi track Release Validation riêng khi muốn phát hành công khai. Không auto merge/deploy.

