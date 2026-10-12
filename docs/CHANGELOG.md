# Nhật ký Thay đổi (Changelog)

Tất cả các thay đổi đáng chú ý của dự án **Tử Vi Việt Nam (Tuvi_B)** sẽ được ghi chép tại đây.

---

## [Unreleased]

### Kế hoạch (chưa triển khai)
- Module AI luận giải, đăng nhập, lịch sử lá số, Tiểu hạn / lưu niên: **chưa có trong code**. Trang `/luan-giai` vẫn là placeholder.

## [0.5.0] - 2026-10-12

### Thêm mới (Added)
- Matcher cách cục thuần (`combinationMatch.js`), catalog `combinations.json` với `verification_status`.
- Hồ sơ trường phái mặc định `schoolProfile.js`.
- Test bảng an sao độc lập và regression cách cục.
- `docs/P0_IMPLEMENTATION_REPORT.md`, `GOLDEN_TEST_REFERENCE.md`, `TU_VI_SCHOOL_VARIANTS.md`.

### Thay đổi (Changed)
- `POST /api/combinations/match` dùng catalog JSON, không phụ thuộc Mongo.
- Hung cách kèm disclaimer; không luận sinh tử / bệnh / cha mẹ từ một tổ hợp.
- Ghi chú: changelog 0.1.0 từng ghi “Tiểu hạn” — UI chỉ có mốc Đại hạn, không có Tiểu hạn.

### Khắc phục lỗi (Fixed)
- Tứ Hóa bỏ sót Xương, Khúc, Tả, Hữu.
- Đường Phù, Văn Tinh (Mậu/Kỷ), Phá Toái, Thiên Đức, Nguyệt Đức, Chủ Thân năm Ngọ.
- Cách cục quét 12 cung khi thiếu vị trí (hung cách khớp ~100% lá số).
- Chuẩn hóa Tí/Tị; tắt Nhị hợp/Ám hợp và Nhật Nguyệt Tật Ách.
- `migrate.js` lỗi cú pháp; `stars.json` JSON hỏng.
- ESLint `set-state-in-effect` trên App và CachCucPanel.

---

## [0.4.0] - 2026-04-11

### Thêm mới (Added)
- **Kiến trúc 3-Tier**: Tái cấu trúc toàn bộ dự án thành Frontend, Backend và Database tách biệt.
- **Backend Node.js + Express** tại `backend/`:
  - `POST /api/charts/generate`: API tính toán và lưu lá số.
  - `GET /api/meanings/:type/:name`: API lấy dữ liệu luận giải sao/cung.
  - `GET /api/health`: Endpoint kiểm tra trạng thái server.
- **Database MongoDB** qua Docker với `docker-compose.yml`.
  - Schemas: `User`, `Chart`, `Meaning`.
  - Mongo Express UI quản trị DB tại cổng `8081`.
- **Multi-page Routing** (React Router DOM): Trang Chủ (`/`), Lập Lá Số (`/la-so`), Luận Giải, Kiến Thức, Tài Liệu, Liên Hệ.
- Logo header nhấn vào quay về Trang Chủ.
- Trang Lập Lá Số giữ nguyên form thông tin khi điều hướng qua URL params.

### Thay đổi (Changed)
- Thuật toán lõi (`tuviRules.js`, `lunar.js`) được chuyển sang Backend để bảo vệ tài sản trí tuệ.
- Frontend chuyển thành View-Layer thuần túy, mọi dữ liệu đều đi qua API.
- Tăng chiều cao mỗi ô Cung từ `220px` lên `280px` ngăn tràn khi nhiều phụ tinh.

### Khắc phục lỗi (Fixed)
- Sửa CSS phụ tinh bị lệch ngang do `display: inline-block` tràn.
- Sửa bảng Nạp Âm (60 Hoa Giáp) sai dẫn đến hiển thị sai Bản Mệnh.

---

## [0.3.0] - 2026-04-11

### Thêm mới (Added)
- Header với Logo, Navigation menu và Footer đầy đủ thông tin.
- Tài liệu dự án: `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.

---

## [0.2.0] - 2026-04-11

### Thêm mới (Added)
- Hệ thống Luận giải chi tiết:
  - Từ điển ý nghĩa 12 Cung (`palaceMeanings.js`) và 14 Chính tinh (`starMeanings.js`).
  - Click vào **tên Cung** hoặc **tên Sao** để xem Modal luận giải chuyên sâu.
- Dữ liệu ý nghĩa đầy đủ cho cung Thân và các cung kép.

### Thay đổi (Changed)
- Modal luận giải được dùng chung cho cả Cung và Sao.

---

## [0.1.0] - 2026-04-10

### Thêm mới (Added)
- Khởi tạo dự án với React 19 + Vite.
- Core engine Tử Vi: chuyển đổi Dương – Âm lịch, an 14 Chính tinh, các bộ Phụ tinh (Thái Tuế, Tràng Sinh, Lộc Tồn, Tứ Hóa, Tuần, Triệt).
- Giao diện lưới 12 Cung truyền thống với Đại Hạn, Tiểu Hạn.
- Form nhập thông tin người dùng và tính năng chia sẻ qua URL.
