# Ma trận hoàn thành lá số Thần số học

Ngày: 2026-10-13. Nhánh: `cursor/numerology-complete-experience-2318`. Baseline audit: `5b15f30`.

Các nhãn dưới đây không cộng thành một phần trăm “hệ thống đã xong”.

| Chiều | Trạng thái |
|---|---|
| `FORMULA_PROFILE_CONSISTENT` | Đạt cho `pythagorean-vn-v1` `1.2.0`. Số lõi, lưới đếm, chu kỳ ngày đang xem, đỉnh và thử thách không đổi phép. |
| `FORMULA_SOURCE_VERIFIED` | Chưa đạt. Hồ sơ vẫn là quy ước sản phẩm. Chưa đối chiếu ấn bản sách. |
| `CONTENT_REVIEWED` | Đạt cho catalog `1.2.0` ở mức review mô hình. Không phải chuyên gia, không phải sách. |
| `VISUALIZATION_COMPLETE` | Đạt cho các hình trong bảng dưới. |
| `INTERPRETATION_COMPLETE` | Chỉ đạt ở ô có bài đã review. Ô withheld không được tính là đã có lời. |
| `PRODUCT_FEATURE_COMPLETE` | Đạt cho hành trình đọc báo cáo ở mục Định nghĩa xong. Không đạt cho toàn bộ thần số học. |
| `PRODUCTION_READY` | Chưa đạt. Chưa staging, chưa duyệt phát hành, limiter một process. |

## Từng năng lực

| Năng lực | Calculation | Visualization | Interpretation | UX | Tests | Evidence |
|---|---|---|---|---|---|---|
| Bảy chỉ số cốt lõi | VERIFIED | VERIFIED | VERIFIED cho 1–9, 11, 22. Số 33 withheld | VERIFIED | VERIFIED | Fixture cũ và e2e |
| Biểu đồ ngày sinh | VERIFIED | VERIFIED | Tên tuyến chỉ khi đủ số, lớp `arrow-labels-vn-v1`. Ô trống không phải điểm yếu | VERIFIED | VERIFIED | Ảnh `desktop-birth-grid.png`, `desktop-line-selected.png` |
| Tháp bốn đỉnh | VERIFIED | VERIFIED | VERIFIED cho 1–9, 11, 22 theo giai đoạn. Không dùng bài Đường đời | VERIFIED | VERIFIED | Ảnh `desktop-pinnacles.png`. Đỉnh 4 là tháng + năm |
| Thử thách | VERIFIED | VERIFIED | VERIFIED cho 1–8. Số 0 withheld, không đổi thành 9 | VERIFIED | VERIFIED | Cùng ảnh đỉnh. Không nhãn thử thách chính |
| Chín năm và mười hai tháng | VERIFIED | VERIFIED | VERIFIED bằng bài chu kỳ đã có | VERIFIED | VERIFIED | Server trả `viewDate`. Ảnh `desktop-cycles.png`, `desktop-year-2027.png` |
| Biểu đồ tên | VERIFIED | VERIFIED | Không gắn mũi tên tâm lý. Đó là phạm vi đã chọn | VERIFIED | VERIFIED | Đếm chữ Pythagorean. Ảnh thiếu tên: `desktop-name-unavailable.png` |
| Biểu đồ ghép | VERIFIED | VERIFIED | Không nói tên bù ô trống | VERIFIED | VERIFIED | Ảnh `mobile-390-combined.png` |
| Mối nối | VERIFIED | VERIFIED | Chỉ câu đúng phép tính. Không có điểm tương hợp | VERIFIED | Có mặt trên trang; chưa có e2e riêng cho từng câu | Không bịa quan hệ tâm lý |
| In và JSON | VERIFIED | VERIFIED | N/A | VERIFIED | VERIFIED | Tên và vết chữ cái ra khỏi bản in trừ khi chọn. Import tính lại |
| P2: Hidden Passion, Karmic Lessons, Balance, Rational Thought, Bridge | BLOCKED_BY_SOURCE | OUT_OF_SCOPE | OUT_OF_SCOPE | OUT_OF_SCOPE | OUT_OF_SCOPE | `P2_INDICATOR_GATE.md` |

## Việc người dùng làm được

- Đọc tổng quan từ ngày sinh, tên nếu có, các chỉ số đã tính, đỉnh và thử thách đang diễn ra, năm cá nhân và ngày xem.
- Xem lưới ngày sinh, chọn tuyến, thấy đủ / một phần / không có.
- Xem tháp bốn đỉnh và bốn thử thách cùng cửa sổ tuổi.
- Đọc bài đã đủ điều kiện ngay trên thẻ. Nguồn vẫn nằm trong mục đóng.
- Khi có tên: xem biểu đồ tên và bảng ghép.
- Chọn một năm hoặc một tháng trong vòng đã tính. Ô trước ngày sinh không bấm được.
- Xuất JSON và in. Họ tên chỉ vào tệp hoặc bản in khi chọn.

## Việc còn không có

- Lời cho thử thách 0 và cho số 33.
- Năm chỉ số P2.
- Chu kỳ period kiểu giữ master trên tháng, ngày và năm.
- Tương hợp, lưu lịch sử, đặt tên trẻ, kết luận nghề, tiền hoặc sức khỏe.
- Xác minh sách hoặc chuyên gia.

## Kiểm thử local ngày 2026-10-13

- `npm run test:ci` trong `backend`: đạt sau khi thêm `viewDate`. Coverage floor giữ.
- `npm run test:ci`, `npm run lint` và `npm run build` trong `frontend`: đạt sau vòng sửa. `NumerologyPage.test.jsx` có 40 test.
- Playwright `e2e/numerology.spec.js`: 19 đạt sau vòng sửa, gồm 320px, 390px và bản in.
- Push `5802da8`: GitHub Actions run `38430068692` đạt backend, frontend và e2e.
- Pull request run `38430111858` đạt backend và frontend. e2e trượt một lần ở `chart.spec.js`: combobox giờ sinh còn giá trị `1` vì URL đã về `/` trước khi React vẽ lại form. Test chờ form về giờ `1` rồi mới chọn giờ `10`.
- Chưa staging.

Review biên tập catalog 1.2.0: Grok 4.7 High `bc-6cf43e1a-4ac7-5421-b817-a9585126aa26`, GPT 5.6 Terra Medium `bc-2fe196a2-a651-53cc-a48a-dfb7a60a24e9`. Review mã tích hợp: `bc-d540b6fc-df93-56d0-89aa-4c4999573732`. Bốn lỗi đã sửa: ngày xem trước ngày sinh, tên hiện khi in dù chưa chọn, câu “đang chờ” cho thử thách 0, và focus bị kéo lên đầu khi chọn năm.
