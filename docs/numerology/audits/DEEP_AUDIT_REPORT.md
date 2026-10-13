# Kiểm toán sâu Thần Số Học và kế hoạch V1

Ngày: 2026-10-13. Ngôn ngữ báo cáo: tiếng Việt. Định danh kỹ thuật giữ nguyên tiếng Anh.

## Baseline

- Remote đã fetch: `origin/main`.
- Commit bắt đầu và commit mã nguồn khi đo test: `e4f06aacc5803224054bcea4d72dc46b81a49902`.
- Đó là merge PR #18. Profile trong mã: `pythagorean-vn-v1` `1.2.0`, schema `1.2.0`.
- Route: `/than-so-hoc`.
- Nhánh kiểm toán: `cursor/numerology-v1-audit-2318`.

Các mốc người giao (bảy chỉ số, lưới, tám tuyến, chu kỳ, bốn đỉnh/thử thách, 102 bài, CI từng xanh ở baseline) được kiểm lại trên HEAD này. Chúng vẫn đúng với runtime. Các câu trong tài liệu nói “chưa có endpoint nội dung” và “mọi meaning đều null” thì không còn đúng.

## Năng lực đang có

Backend là nơi tính. Frontend gửi ngày sinh, tên tùy chọn, ngày xem tùy chọn, rồi hiển thị response.

Đã có:

- Đường đời, ngày sinh, thái độ, biểu đạt, linh hồn, nhân cách, trưởng thành.
- Lưới `DDMMYYYY`, tám tuyến `present` / `partial` / `absent`.
- Năm, tháng, ngày cá nhân theo năm lịch, kết quả 1–9.
- Bốn đỉnh và bốn thử thách, tuổi theo gốc Đường đời, 29/02 về 01/03 ở năm không nhuận.
- Catalog 102 mục biên tập thử nghiệm và `GET /api/numerology/meanings/:metricId/:value`.
- `no-store`, không ghi ngày sinh vào log, không nhận kết quả do client nhét vào body.

Chưa có:

- Lời đỉnh, lời thử thách, lời số 33.
- Export JSON, import, in/PDF.
- Rate limit, staging, rollback, meta SEO của trang.
- Profile thứ hai. Không có LLM trong lúc tính.

## Công thức

Không có `IMPLEMENTATION_BUG` so với spec 1.2.0. Chi tiết nằm ở [FORMULA_VERIFICATION_MATRIX.md](FORMULA_VERIFICATION_MATRIX.md).

Độ lệch có số cụ thể với trang Hans Decoz đã đọc trong đợt này:

- Đường đời mọi chữ số khác cách rút từng thành phần có giữ master. 11/09/2000: profile 4, Decoz 22.
- Đỉnh rút master ở tháng và ngày trước khi cộng. 22/11/1992: profile P1=6, Decoz 33.
- Y luôn là phụ âm. Biểu đạt cộng cả chuỗi một lần, không rút từng phần tên.
- Thời lượng thử thách trên UI trùng kỳ đỉnh. Trang Decoz nói các kỳ thử thách là ước lượng và có chồng lấn.

Khớp trang Decoz ở mức trang web, chưa phải sách:

- Tuổi đỉnh `36` trừ Đường đời đã về một chữ số.
- Phép thử thách là hiệu tuyệt đối sau khi thành phần đã về 1–9. Số 0 hợp lệ.
- Chu kỳ cá nhân theo năm lịch và không giữ 11.

Các nhãn này không có nghĩa thần số đã được chứng minh.

## Nguồn

Năm URL worldnumerology.com được đọc trong đợt này. Bậc `source_read`, `edition_verified=false`. Không có sách in nào được mở. Kho cộng đồng giữ nguyên vai trò `community_reference`. Báo cáo đầy đủ: [SOURCE_RESEARCH_REPORT.md](SOURCE_RESEARCH_REPORT.md).

## Hai model độc lập

Hai lượt chạy tách nhau, cùng một đề bài, không nhận kết luận của nhau.

| Vai trò | Model được yêu cầu | Agent |
|---|---|---|
| Model A | `grok-4.7-high` | `bc-d2710337-cc3a-5881-ac0e-7be24807077d` |
| Model B | `gpt-5.6-terra-medium` | `bc-b3f56997-16ee-574c-821a-5924607e7871` |

Cả hai chỉ thấy bản tóm tắt công thức và vài mẩu tìm kiếm. Chúng chưa thấy năm trang Decoz được tải sau đó. Phần so với Decoz ở các file kia là việc của lượt kiểm toán cha, không phải đồng thuận của hai model.

Hai bên cùng kết luận:

- Bốn fixture tay khớp quy tắc được đưa vào đề bài.
- Không có bug số học bên trong các quy tắc đó.
- Đường đời mọi chữ số là một trường, khác cách rút từng thành phần.
- Chu kỳ theo năm lịch khác chu kỳ theo sinh nhật.
- Lời 33 và lời đỉnh/thử thách là `NOT_IMPLEMENTED`.
- Câu diễn đạt sai trong đề bài, rằng 11/09/2000 theo mọi chữ số ra 11, là sai số học. Fixture thật trong repo kỳ vọng 4, và derivation ghi cách thành phần có master ra 22.

Bất đồng được giữ:

- Model A đặt `SOURCE_NOT_VERIFIED` làm nhãn chính khi chưa đọc sách, kể cả chỗ mã khớp profile.
- Model B đặt `IMPLEMENTATION_CORRECT_FOR_PROFILE` khi mã khớp profile, và để “chưa đọc sách” ở cột chứng cứ.
- Model A gọi biểu đồ là `SPEC_AMBIGUOUS` vì đề bài không đưa map tám tuyến. Spec trong repo có map đó. Nhãn sau đối chiếu mã: `IMPLEMENTATION_CORRECT_FOR_PROFILE`.
- Model A để ngỏ tháng 10 của năm cá nhân 1, vì chưa được đưa câu “11 không giữ ở chu kỳ”. Trang tháng đã đọc sau đó có câu này. Ví dụ đó về 2 ở cả hai dạng cộng.

Quy tắc chốt của báo cáo này theo Model B cho nhãn “có khớp profile hay không”, và theo Model A cho việc không biến trang web thành sách. Sự đồng thuận của hai model không được ghi là đã xác minh nguồn.

## Nội dung

102/102 mục là ghép 10 khung ngữ cảnh với 11 thân chữ. Không có thân 33. Quét cụm dự báo cứng: 0 khớp. Điểm và đề xuất chữ, chưa xuất bản, nằm ở [CONTENT_QUALITY_AUDIT.md](CONTENT_QUALITY_AUDIT.md). `approvedForPublic` không đổi.

## API và an toàn

- Tính thuần trong `calculate.js`. Không dùng SQLite để lưu hồ sơ thần số. App vẫn mở SQLite cho Tử Vi; test API thần số dùng file tạm.
- Body chỉ nhận các trường input. `metrics`, `birthGrid`, `cycles`, `pinnacles` bị `CLIENT_RESULT_REJECTED`.
- Version khác `1.2.0` ra `PROFILE_NOT_FOUND`.
- `Cache-Control: no-store` trên route, kể cả lỗi.
- Log lỗi tính chung một câu, không ghi ngày hay tên.
- Parser JSON 256kb. Không thấy rate limit trong router thần số.
- Nội dung fail-closed: lệch profile, chưa review, hoặc không có bài.
- Không thấy coupling công thức với engine Tử Vi. Không sửa runtime Tử Vi.

## UI

Tóm tắt ở [UI_UX_AUDIT.md](UI_UX_AUDIT.md). E2E thần số 17/17. Chưa có bản in riêng. `index.html` vẫn `lang="en"` và title `tuvi-b`.

## Test

Chi tiết ở [TEST_COVERAGE_REPORT.md](TEST_COVERAGE_REPORT.md).

- Backend CI đạt. Module thần số: 100% lines, 98.44% branches.
- Frontend CI đạt. Module thần số: 100% lines, 93.10% branches.
- Lint và build frontend đạt.
- Playwright chỉ chạy `e2e/numerology.spec.js`: 17/17. Toàn bộ `npm run test:e2e` không chạy trong đợt này.

Coverage toàn backend 82.6% lines không phải coverage của module thần số.

## Phân loại

| Lớp | Nhãn | Vì sao |
|---|---|---|
| Calculator profile 1.2.0 | `V1_FEATURE_COMPLETE` cho các chỉ số đã công bố | Core, lưới, chu kỳ, đỉnh, API, 102 bài cốt lõi/chu kỳ đã chạy và có test. |
| Numerology V1 theo roadmap §15.3 | `V1_PARTIAL` | Thiếu export/import/in, lời đỉnh, và cổng phát hành. |
| Xác minh công thức với sách | Không đạt “đã xác minh” | Khớp profile. Một phần khớp hoặc lệch trang Decoz. Chưa có ấn bản. |
| Production | Không `PRODUCTION_READY` | Chưa rate limit, staging, rollback, SEO. Test local không thay các cổng đó. |

Nhãn tổng: **`V1_PARTIAL`**.

Không đánh dấu đã xác minh chỉ vì fixture tự khớp hoặc vì hai model cùng một hướng.
