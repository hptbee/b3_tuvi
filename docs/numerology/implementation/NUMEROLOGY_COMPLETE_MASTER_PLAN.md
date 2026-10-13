# Kế hoạch triển khai lá số Thần số học

- version: 1
- source: yêu cầu AutoDev 2026-10-13, audit PR #24 tại `5b15f30`
- baseline: `5b15f308998bdb81dc6a0ec6170b83551a25fef2` trên `cursor/numerology-product-gap-2318`
- nhánh làm việc: `cursor/numerology-complete-experience-2318` (xếp trên audit, không sửa PR #24)

## Original requirements

Biến `/than-so-hoc` từ máy tính kèm lời ngắn thành một báo cáo có hình, chương và lời đủ điều kiện. Giữ profile `pythagorean-vn-v1` `1.2.0`. Không bịa lời khi nguồn không đủ. Không tự merge, không deploy.

## Scope

P0a hình và tóm tắt. P0b lời đỉnh, thử thách và chú thích tuyến nếu qua cổng biên tập. P1 biểu đồ tên, biểu đồ ghép, chín năm, mười hai tháng, quan hệ đúng công thức, mục lục, in/JSON. P2 chỉ khi có đặc tả phép tính đã kiểm được từ nguồn trong repo.

## Exclusions

Tương hợp, đặt tên trẻ, lưu lịch sử, AI, color chart, proportional chart, period cycle kiểu Decoz (giữ master trên tháng/ngày/năm), thử thách chính, chồng lấn cửa sổ tuổi, đổi 33 thành 6, Tử Vi, SQLite.

P2 Hidden Passion, Karmic Lessons, Balance, Rational Thought, Bridge: `REQUIRES_SPEC`. Trang Decoz đã đọc chỉ liệt kê tên chỉ số, không đưa công thức đủ để viết fixture độc lập (hòa, master, tên đang dùng). Không đoán. Ghi ở `P2_INDICATOR_GATE.md`.

## Technical context

Engine thuần trong `backend/src/numerology/`. Phép 1.2.0 không đổi. Schema phản hồi giữ `1.2.0` và thêm trường: `cycles.yearBand`, `cycles.months`, `nameChart`, `combinedChart`. Profile version không tăng. Client từ chối response thiếu các trường đó. Import JSON 1.2.0 vẫn chỉ lấy ngày, tên, ngày xem rồi tính lại.

## Architecture

Không thêm service. Hàm mới nằm cạnh `cycles.js` và `charts.js`. React chỉ hiển thị số server trả. Chọn năm hoặc tháng trên biểu đồ gửi `targetDate` mới, không cộng số trong trình duyệt.

Lời đỉnh dùng cùng catalog, context `p1`–`p4` và `challenge`, cùng chủ đề số 1–9/11/22 đã ghim, đoạn chữ mới theo giai đoạn. Không copy bài Đường đời. Số 0 và số 33 không có chủ đề: tiếp tục withheld kèm câu giải thích.

Tên tám tuyến là lớp `arrow-labels-vn-v1`, tách khỏi phép đếm lưới. Ô trống không bị gọi là điểm yếu.

## Assumptions

- Cửa sổ chín năm bắt đầu ở năm có Năm cá nhân 1 và chứa năm đang xem. Nếu cửa sổ chạm 1200 hoặc 2199 thì dịch để vẫn đủ chín năm trong biên đã cho phép.
- Biểu đồ tên đếm giá trị Pythagorean của từng chữ đã chuẩn hóa. Không vẽ mũi tên tâm lý trên biểu đồ tên.
- Biểu đồ ghép chỉ phân loại có trong ngày, có trong tên, có cả hai, hoặc không có. Không nói tên “bù” khuyết điểm.

## Risks

- Lời giai đoạn bị đọc như dự báo. Mỗi bài có câu giới hạn.
- Hình tháp bị hiểu là period cycle Decoz. Nhãn đáy nói master tắt.
- Test cũ chờ lời nằm trong `<details>`. Hành vi mới là lời hiện ngay; nguồn vẫn đóng. Test được sửa theo yêu cầu sản phẩm, không nới điều kiện đúng số.

## Tasks

### T001 — Kế hoạch và cổng P2

- status: pending
- depends_on: []
- scope: `docs/numerology/implementation/`
- acceptance_criteria:
  - Có master plan và tài liệu P2 nói rõ vì sao năm chỉ số chưa vào API.
- verification:
  - Đọc file, đối chiếu danh sách loại trừ.

### T002 — Chu kỳ nhiều năm, biểu đồ tên, biểu đồ ghép

- status: pending
- depends_on: []
- scope: backend numerology engine, tests, formula spec, API contract
- acceptance_criteria:
  - Số lõi, lưới, đỉnh và ba chu kỳ của ngày xem không đổi so với fixture cũ.
  - `yearBand` có chín năm, đúng một năm được chọn, Năm cá nhân của năm đó trùng `cycles.personalYear`.
  - `months` có mười hai tháng của năm đang xem, tháng được chọn trùng `personalMonth`.
  - Không tên thì biểu đồ tên và biểu đồ ghép `unavailable`.
  - Có tên thì đếm chữ khớp `nameAnalysis.letters`.
- verification:
  - `node --test backend/test/numerologyAdvanced.test.mjs backend/test/numerologyPinnacles.test.mjs backend/test/numerologyCharts.test.mjs`

### T003 — Báo cáo trên trang

- status: pending
- depends_on: [T002]
- scope: `frontend/src/numerology/`, e2e liên quan
- acceptance_criteria:
  - Có mục lục, tóm tắt sự kiện, tháp bốn đỉnh, trục thử thách, lưới chọn tuyến, biểu đồ tên, biểu đồ ghép, chín năm, mười hai tháng, quan hệ công thức.
  - Đỉnh 4 ghi tháng + năm, không ghi là suy từ đỉnh 3.
  - Thử thách 0 vẫn hiện. Không có nhãn thử thách chính.
  - Lời đủ điều kiện hiện không cần mở details. Nguồn vẫn mở được.
  - Thiếu tên thì bốn chỉ số tên vẫn báo thiếu, và hai chương tên giải thích chưa có tên.
  - 320px và 390px không tràn ngang. In ẩn form.
- verification:
  - `npm test -- src/numerology` trong frontend
  - Playwright `numerology.spec.js` khi server chạy

### T004 — Lời đỉnh, thử thách và chú thích tuyến

- status: pending
- depends_on: [T002]
- scope: catalog, content gate, review record
- acceptance_criteria:
  - Bài mới là tiếng Việt, khác bài Đường đời, khác nhau giữa bốn giai đoạn.
  - Không khớp regex cấm của test nội dung.
  - Hai review biên tập độc lập được ghi. Chỉ gắn `approvedForPublic` khi cả hai không chặn.
  - Số 33 và thử thách 0 không nhận bài thế bằng số khác.
- verification:
  - `node --test backend/test/numerologyContent.test.mjs`
  - Biên bản review trong `docs/numerology/reviews/`

### T005 — Ảnh, lộ trình, kiểm thử tích hợp

- status: pending
- depends_on: [T003, T004]
- scope: screenshots, roadmap, test suite còn lại của numerology
- acceptance_criteria:
  - Ảnh desktop, mobile, print của lá số mới.
  - Roadmap ghi việc đã làm và việc còn chặn.
- verification:
  - Frontend test:ci hoặc test + build; backend numerology tests

## Completion criteria

Người dùng đọc được tổng quan, bảy chỉ số, lưới, tháp, thử thách, chu kỳ nhiều năm và nhiều tháng, biểu đồ tên khi có tên, và các quan hệ đúng phép tính. Chỗ chưa có lời nói rõ lý do. Profile 1.2.0 không đổi số cũ.

## Plan changes

Chưa có.
