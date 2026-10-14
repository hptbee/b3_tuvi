# Domain Knowledge - Tử Vi Việt Nam

Tài liệu này giải thích các khái niệm chuyên môn về Tử Vi được sử dụng trong mã nguồn, giúp AI và các nhà phát triển hiểu được logic nghiệp vụ.

## 1. Hệ thống Can Chi

Tử Vi sử dụng hệ thống lịch tiết khí dựa trên Thiên Can và Địa Chi.

- **Thiên Can (10)**: Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý.
  - Trong code: `THIEN_CAN` (mảng index 0-9).
- **Địa Chi (12)**: Tí, Sửu, Dần, Mão, Thìn, Tị, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi.
  - Trong code: `DIA_CHI` (mảng index 1-12, index 0 bỏ trống).

## 2. Các Cung (Palaces)

Lá số Tử Vi có 12 cung được sắp xếp theo vòng tròn. Mỗi cung đại diện cho một phương diện cuộc sống.

- **Cung Chức (`CUNG_CHUC`)**: Mệnh (Self), Phụ Mẫu (Parents), Phúc Đức (Karma), Điền Trạch (Property), Quan Lộc (Career), Nô Bộc (Friends/Peers), Thiên Di (Travel), Tật Ách (Health), Tài Bạch (Wealth), Tử Tức (Children), Phu Thê (Spouse), Huynh Đệ (Siblings).
- **Cung Thân**: Một cung đặc biệt nằm đè lên một trong các cung trên, đại diện cho hậu vận.

## 3. Hệ thống Sao (Stars)

Các sao được chia thành nhiều nhóm:

- **Chính Tinh (14)**: Tử Vi, Thiên Phủ, Thái Dương, Vũ Khúc... Đây là các sao chủ lực định hình lá số.
- **Tứ Hóa**: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ. Thể hiện sự biến đổi tính chất của các sao.
- **Phụ Tinh**: Các sao hỗ trợ hoặc gây trở ngại (ví dụ: Lộc Tồn, Thái Tuế, Kình Dương, Đà La...).

## 4. Ngũ Hành (Elements)

Mỗi sao và mỗi cung đều có hành riêng (Kim, Mộc, Thủy, Hỏa, Thổ). Trong code, ngũ hành được sử dụng để:
- Tính toán sự tương sinh/tương khắc.
- Xác định màu sắc hiển thị trên UI (xem `NGU_HANH_COLORS` trong `constants.js`).

## 5. Thuật toán An Sao (Core Logic)

Quy trình an sao cơ bản trong `tuviRules.mjs`:
1. **Xác định Cục (Cục Số)**: Dựa vào Can năm sinh và vị trí cung Mệnh. Có 5 loại: Thủy nhị cục (2), Mộc tam cục (3), Kim tứ cục (4), Thổ ngũ cục (5), Hỏa lục cục (6).
2. **An Chính Tinh**: Dựa vào ngày sinh và Cục số để tìm vị trí sao Tử Vi, sau đó suy ra các chính tinh khác.
3. **An Phụ Tinh**: Dựa vào năm, tháng, ngày, giờ sinh theo các quy luật riêng biệt.

## 6. Trạng thái Sao (Star Status)

- **Miếu Địa (M)**: Rất tốt.
- **Vượng Địa (V)**: Tốt.
- **Đắc Địa (Đ)**: Khá.
- **Bình Hòa (B)**: Bình thường.
- **Hãm Địa (H)**: Xấu.

`getStarStatus(star, pos)` đọc `backend/src/data/starStatus.json`. Bảng 14 chính tinh tách Miếu và Vượng theo Tử Vi Đẩu Số Toàn Thư; vị trí 1 là Tí, 12 là Hợi. Sao không có trong bảng được giữ nguyên tên.

Tháng nhuận không được an như tháng thường. `resolveAnSaoMonth` áp dụng quy tắc: trước ngày 15 giữ số tháng nhuận, từ ngày 15 tính sang tháng sau.
