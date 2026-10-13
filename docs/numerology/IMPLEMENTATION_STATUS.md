# Thần Số Học — trạng thái triển khai

Snapshot phát triển ngày **2026-10-13**. Đã có **MVP số học thử nghiệm** tại `/than-so-hoc`, gồm engine → API → landing/form/kết quả → tests. Chưa phải phát hành production hoặc V1 đầy đủ trong [roadmap A–Z](../ROADMAP_NUMEROLOGY_A_TO_Z.md).

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
| UI | Landing tím với menu trên cùng; validation/focus, loading, retry, input snapshot, abort/sequence guard, trace bằng bàn phím và mobile; biểu đồ ngày sinh, chu kỳ và bốn giai đoạn đỉnh cao/thử thách |
| Riêng tư | POST, no-store kể cả lỗi/preflight; không thêm persistence/URL/browser storage; không log tên/body/query |

Frontend chỉ hiển thị kết quả server, không copy công thức. Engine thuần nhận ngày tham chiếu được inject; API chụp ngày một lần theo `Asia/Ho_Chi_Minh`. Không thay công thức Tử Vi, không migration SQLite, không thêm dependency hoặc tài khoản.

## Quy ước và giới hạn nguồn

- Đường đời cộng tất cả chữ số ngày sinh, khác phương pháp rút gọn từng thành phần.
- Giữ 11/22/33 cho Đường đời, Ngày sinh, Biểu đạt, Linh hồn, Nhân cách, Trưởng thành; Thái độ về 1–9. Master vẫn có `rootValue`.
- Tên: NFC/NFD tương đương, accent whitelist Latin/tiếng Việt, Đ → D, A–Z → 1–9, nguyên âm AEIOU, Y là phụ âm. Cho phép khoảng trắng/gạch nối/apostrophe như spec; từ chối ký tự ẩn, unsupported script/mark/ligature thay vì bỏ âm thầm. Tên rỗng/whitespace thường là không có tên.
- `status=experimental`, `sourceStatus=product_specification_only`. Catalog `1.0.0` xuất lời `experimental_editorial` cho bảy chỉ số cốt lõi và ba chu kỳ (102 mục). Đỉnh cao và thử thách giữ `meaning=null`, `meaningStatus=withheld`, lý do `content_not_in_scope`. Số 33 không có bài.

[Formula spec](FORMULA_SPEC.md), [decision register](DECISIONS.md), [source registry](SOURCE_REGISTRY.md), [fixture handbook](FIXTURES.md) và [API contract](API_CONTRACT.md) ghi quy ước thực tế. Fixture số học được tính độc lập với mã engine. Chúng kiểm chứng đúng theo quy ước sản phẩm, không chứng minh một ấn bản sách đã được đối chiếu. Kiểm toán 2026-10-13 đọc được các trang công thức trên worldnumerology.com; bậc là `source_read`, không phải `edition_verified`. Xem [báo cáo kiểm toán](audits/DEEP_AUDIT_REPORT.md).

Ví dụ kiểm chứng: `15/6/1990`, `Nguyễn Văn An` → `NGUYEN VAN AN`; thứ tự Đường đời/Ngày sinh/Thái độ/Biểu đạt/Linh hồn/Nhân cách/Trưởng thành = **4 / 6 / 3 / 3 / 1 / 11 / 7**.

## Kiểm chứng phát triển

Các lệnh chạy từ repository root, trừ Playwright từ `frontend`:

```bash
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
cd frontend
npm run test:e2e
```

Trong cloud này Chromium hệ thống `/usr/bin/chromium` được chọn bởi runtime config ignored `frontend/.b3/playwright.cloud.mjs`: từ `frontend`, chạy `npx playwright test --config .b3/playwright.cloud.mjs`. CI và máy cài bundled Chromium vẫn dùng `playwright.config.js` đã commit. Không cần commit config riêng của máy.

Các số 79.97% lines, 20 test frontend và 28 E2E thuộc snapshot cũ hơn HEAD `e4f06aa`. Không dùng chúng làm kết quả hiện tại.

Bằng chứng chạy lại trên `e4f06aa` ngày 2026-10-13, chi tiết ở [TEST_COVERAGE_REPORT.md](audits/TEST_COVERAGE_REPORT.md):

- `npm run test:ci --prefix backend` đạt. Toàn backend 82.6% lines, 87.41% branches. Module `backend/src/numerology` 100% lines, 98.44% branches.
- `npm run test:ci --prefix frontend` đạt: 42 test. Module `frontend/src/numerology` 100% lines, 93.10% branches. Coverage toàn frontend thấp hơn vì các màn Tử Vi không nằm trong bộ vitest này.
- `npm run lint --prefix frontend` và `npm run build --prefix frontend` đạt.
- Playwright bằng `frontend/playwright.config.js`, chỉ file `e2e/numerology.spec.js`: 17/17. Đợt này không chạy đủ `npm run test:e2e`, nên không kết luận các spec Tử Vi.

Đây là kết quả local, không phải trạng thái live GitHub Actions. Chưa kiểm chứng staging/production, Safari/Firefox hoặc audit WCAG toàn diện. Probe keyboard/focus và responsive không thay thế audit accessibility đầy đủ. `no-store`/không persist không loại bỏ việc input được gửi qua mạng để backend tính.

## Commit triển khai

| Task | Commit | Phạm vi |
|---|---|---|
| T001 | `9849b55169e7ec9ba9436c13fe2993ae907d8dc6` | Routing prompt B3 cloud; readable skill links không tự đăng ký native catalog |
| T002 | `c9e0903effa372f48cc0f1ef8f11b6be0ecfffd7` | Profile/spec, pure core, fixtures/validation |
| Engine đỉnh cao | `1570d7eb8ea962b5ddf75e9b9b14feaf36c0ff17` | Bốn giai đoạn, thử thách 0, tuổi gốc Đường đời, năm nhuận |
| T003 | `b91fd75d7e08bfc313b1af50ff75131159df0bb2` | API và privacy/error boundary |
| T004 | `3cc3496` | Public landing/form/kết quả và frontend regressions |

T005 thêm tài liệu này và integrated E2E; tìm commit bằng lịch sử Git. Checkpoint autodev cục bộ nằm ở `.b3/autodev/`, không commit cùng sản phẩm. Autodev tạo task commits cục bộ; push/merge/deploy là hành động riêng.

## Chưa triển khai và trình tự tiếp theo

1. **Nguồn/công thức:** profile 1.2.0 khớp fixture của chính nó. Kiểm toán đã đọc các trang công thức Decoz và ghi conflict (Đường đời mọi chữ số, đỉnh không giữ master ở thành phần, Y phụ âm). Chưa có ấn bản sách. Nếu đổi quy ước thì tạo profile/version và fixture mới; không sửa số của 1.2.0.
2. **Nội dung:** catalog và `GET /api/numerology/meanings/:metricId/:value` đã có, 102 mục thí nghiệm cho chỉ số cốt lõi và chu kỳ. Việc còn lại là giảm lặp thân chữ và chỉ xuất bản bài mới sau cổng review. Không có lời 33, đỉnh hoặc thử thách.
3. **V1 còn lại:** biểu đồ, chu kỳ và đỉnh cao/thử thách đã có theo quy ước thử nghiệm profile 1.2.0. Export/import/print vẫn chưa có.
4. **Export/import/print riêng:** opt-in tên, kiểm tra version và recalculate, print layout/E2E. Tử Vi export sẵn có không đồng nghĩa Thần Số Học đã hỗ trợ.
5. **Release:** production rate limit, benchmark thực tế, metadata/noindex, staging SPA rewrite/refresh, logging/monitoring, rollback và các gate §15 roadmap. Không đánh dấu checklist release hoàn tất từ tests local.
6. **Tùy chọn:** nhiều profile, AI, cross-browser; không bắt buộc để chạy calculator hiện tại.
