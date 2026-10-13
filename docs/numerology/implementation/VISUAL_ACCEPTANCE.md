# Tiêu chí chấp nhận hình lá số

Ngày: 2026-10-13. Nhánh `cursor/numerology-product-gap-2318` sau khi đã gộp PR #26. Không đổi phép tính `1.2.0` và không thêm lời.

## Đạt khi

1. Sơ đồ đỉnh là hình có cạnh. Đỉnh 1 nối tháng và ngày. Đỉnh 2 nối ngày và năm. Đỉnh 3 nối đỉnh 1 và đỉnh 2. Đỉnh 4 nối tháng và năm, không có cạnh tới đỉnh 3. Giai đoạn đang diễn ra và số master được gắn nhãn. Có mô tả đọc được.
2. Thử thách là một trục tuổi: mốc tuổi, năm, số thử thách, giai đoạn đang chọn. Số 0 vẫn hiện và không đổi thành 9. Độ cao các đoạn không tỉ lệ với giá trị thử thách.
3. Lưới ngày sinh vẽ đúng tuyến được chọn. Đủ số, một phần và không có số có nét khác nhau. Chỉ một tuyến được tô. Danh sách chữ vẫn là cách chọn và cách đọc.
4. Biểu đồ ghép là lưới 3×3. Mỗi ô có số lần trong ngày sinh và số lần trong tên. Bảng chi tiết vẫn còn.
5. Tổng quan là các sự kiện đã tính, gọn, không dùng hình trang trí của trang mở đầu.
6. 320px và 390px không tràn ngang. In A4 vẫn ẩn form và giữ đúng các hình. Nút có trạng thái focus.

## Đã kiểm trên nhánh này

Ngày 2026-10-13, fixture Nguyễn Văn An 15/6/1990, ngày xem 2026-10-13:

- Đường đời 4, biểu đạt 3, đỉnh 3 / 7 / 1 / 7, thử thách 0 / 5 / 5 / 5.
- Tám cạnh: tháng–đỉnh 1, ngày–đỉnh 1, ngày–đỉnh 2, năm–đỉnh 2, đỉnh 1–đỉnh 3, đỉnh 2–đỉnh 3, tháng–đỉnh 4, năm–đỉnh 4. Không có cạnh đỉnh 3–đỉnh 4.
- Đầu cạnh trùng tâm ô ở desktop, 390px, 320px và bản in. Các ô không chồng.
- Tuyến 1–5–9 lệch tâm ô dưới 3px ở desktop và 320px.
- Ảnh sau nằm ở `screenshots/after/`. Ảnh trước vẫn là các tệp cùng thư mục cha.

## Không làm

P2, lời mới, Tử Vi, cơ sở dữ liệu, deploy.
