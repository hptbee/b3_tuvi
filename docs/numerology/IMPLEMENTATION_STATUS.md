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
| API | `GET /api/numerology/profiles`, `POST /api/numerology/calculate`; typed errors, scoped parser boundary, schema/profile/referenceDate |
| UI | Landing tím với menu trên cùng; validation/focus, loading, retry, input snapshot, abort/sequence guard, trace bằng bàn phím và mobile; biểu đồ ngày sinh, chu kỳ và bốn giai đoạn đỉnh cao/thử thách |
| Riêng tư | POST, no-store kể cả lỗi/preflight; không thêm persistence/URL/browser storage; không log tên/body/query |

Frontend chỉ hiển thị kết quả server, không copy công thức. Engine thuần nhận ngày tham chiếu được inject; API chụp ngày một lần theo `Asia/Ho_Chi_Minh`. Không thay công thức Tử Vi, không migration SQLite, không thêm dependency hoặc tài khoản.

## Quy ước và giới hạn nguồn

- Đường đời cộng tất cả chữ số ngày sinh, khác phương pháp rút gọn từng thành phần.
- Giữ 11/22/33 cho Đường đời, Ngày sinh, Biểu đạt, Linh hồn, Nhân cách, Trưởng thành; Thái độ về 1–9. Master vẫn có `rootValue`.
- Tên: NFC/NFD tương đương, accent whitelist Latin/tiếng Việt, Đ → D, A–Z → 1–9, nguyên âm AEIOU, Y là phụ âm. Cho phép khoảng trắng/gạch nối/apostrophe như spec; từ chối ký tự ẩn, unsupported script/mark/ligature thay vì bỏ âm thầm. Tên rỗng/whitespace thường là không có tên.
- `status=experimental`, `sourceStatus=product_specification_only`. Lời luận gốc đã duyệt vẫn là `experimental_editorial` cho các chỉ số cốt lõi và chu kỳ. Đỉnh cao và thử thách giữ `meaning=null`, `meaningStatus=withheld`, vì nhóm này chưa có bài biên tập.

[Formula spec](FORMULA_SPEC.md), [decision register](DECISIONS.md), [source registry](SOURCE_REGISTRY.md), [fixture handbook](FIXTURES.md) và [API contract](API_CONTRACT.md) ghi quy ước thực tế. Tám fixture số học được tính độc lập với mã engine, có derivation; chúng kiểm chứng đúng theo quy ước sản phẩm, không chứng minh nguồn bên ngoài đã xác minh hoặc tính đúng chuyên môn. Chưa có source dossier bên ngoài hoặc lời luận đủ điều kiện.

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

Bằng chứng local ở snapshot này:

- Backend CI chạy đủ **27 script unit/integration** trong runner và syntax check, đạt coverage floor: **79.97% lines, 85.75% branches** toàn backend. Numerology engine đạt 100% lines/98.07% branches ở lần chạy này.
- Frontend CI: **20 test đạt**; lint/build đạt. Numerology đạt 100% lines/88.42% branches; không đồng nhất với coverage toàn frontend.
- Bộ mới có **13 E2E**: ngày-only, bảy số với tên tiếng Việt, ba master11/22/33, invalid date/hidden name/Đ, snapshot/retry, thay request chậm/chuyển trang, keyboard, mobile320/390, no-store và URL/storage. Happy paths và số mong đợi dùng backend thật; chỉ fault/delay lifecycle được intercept.
- Toàn bộ **28 E2E đạt** trên Chromium hệ thống (13 mới + 15 landing/Tử Vi), không skip. Giữ **15 E2E** landing/Tử Vi. Test export chọn response completed/readable để tránh response200 bị StrictMode hủy; các so sánh JSON vẫn nguyên.
- Review độc lập cho core/API/UI; lỗi Unicode, compressed parser, preflight, raw hidden name và malformed response được sửa với test hồi quy trước khi commit các task.

Đây là kết quả local tại snapshot, không phải trạng thái live GitHub Actions. Chưa kiểm chứng staging/production, Safari/Firefox hoặc audit WCAG toàn diện. Probe keyboard/focus và responsive không thay thế audit accessibility đầy đủ. `no-store`/không persist không loại bỏ việc input được gửi qua mạng để backend tính.

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

1. **Nguồn/công thức:** tìm source dossier có locator/edition và conflict matrix, review các quyết định; nếu thay quy ước thì tạo profile/version và fixture mới.
2. **Nội dung:** schema/catalog validator, eligibility, lời luận có nguồn và trạng thái review; hiện không có catalog/meaning endpoint.
3. **V1 còn lại:** biểu đồ, chu kỳ và đỉnh cao/thử thách đã có theo quy ước thử nghiệm profile 1.2.0. Chưa có lời luận cho đỉnh cao/thử thách. Export/import/print vẫn chưa có.
4. **Export/import/print riêng:** opt-in tên, kiểm tra version và recalculate, print layout/E2E. Tử Vi export sẵn có không đồng nghĩa Thần Số Học đã hỗ trợ.
5. **Release:** production rate limit, benchmark thực tế, metadata/noindex, staging SPA rewrite/refresh, logging/monitoring, rollback và các gate §15 roadmap. Không đánh dấu checklist release hoàn tất từ tests local.
6. **Tùy chọn:** nhiều profile, AI, cross-browser; không bắt buộc để chạy calculator hiện tại.
