# AI Context & Developer Handbook - Tuvi_B

Tài liệu này được thiết kế để cung cấp cho mô hình AI (như Claude, GPT, Gemini) các hướng dẫn kỹ thuật cụ thể để làm việc với codebase này hiệu quả nhất.

## Nguyên tắc chung (AI Guidelines)

- **Ngôn ngữ**: Mã nguồn sử dụng tên biến và comments kết hợp tiếng Anh và tiếng Việt (chủ yếu là thuật ngữ chuyên môn). Khi viết code mới, hãy duy trì phong cách này.
- **Tiêu chuẩn ES6+**: Luôn sử dụng `import/export` (Backend hỗ trợ ES Modules).
- **Domain First**: Mọi thay đổi logic phải đối chiếu với `DOMAIN_KNOWLEDGE.md`.

## Mapping chức năng theo File

| Chức năng | File/Thư mục quan trọng |
|---|---|
| Chuyển đổi lịch | `backend/src/engine/lunar.js` |
| Tháng nhuận dùng để an sao | `resolveAnSaoMonth` trong `backend/src/engine/tuviRules.mjs` |
| Thuật toán an sao | `backend/src/engine/tuviRules.mjs` (`calculateTuVi`) |
| Độ sáng sao (M/V/Đ/B/H) | `backend/src/data/starStatus.json` |
| Kiểm tra input lập lá số | `backend/src/engine/chartInput.js` |
| Cấu hình thuật ngữ | `backend/src/engine/constants.js` |
| API lập lá số | `backend/src/routes/chartRoutes.js` |
| Schema lá số | `backend/src/models/Horoscope.js` |
| Ý nghĩa sao / cung | `backend/src/models/Star.js`, `backend/src/models/Palace.js` |
| Cách cục | `backend/src/engine/combinationMatch.js`, `backend/src/data/combinations.json`, `backend/src/routes/combinationRoutes.js` |
| Hồ sơ trường phái | `backend/src/engine/schoolProfile.js`, `docs/TU_VI_SCHOOL_VARIANTS.md` |
| UI lá số | `frontend/src/components/TuViChart.jsx` |
| Form nhập liệu | `TuviFormBox` trong `frontend/src/App.jsx` |
| Gốc URL API | `frontend/src/apiBase.js` (`VITE_API_BASE_URL`) |

## Hướng dẫn thực hiện các tác vụ phổ biến

### 1. Thêm một Sao mới vào Engine
1. Mở `backend/src/engine/constants.js`: Thêm tên sao và màu sắc vào `STAR_COLORS`.
2. Mở `backend/src/engine/tuviRules.mjs`: an sao đó trong `calculateTuVi`.
3. Nếu sao có miếu/vượng/đắc/hãm, thêm dòng vào `backend/src/data/starStatus.json`.
4. (Tùy chọn) Thêm ý nghĩa sao vào MongoDB collection `stars`.

### 2. Sửa đổi giao diện Cung
- Component lá số là `frontend/src/components/TuViChart.jsx`.
- Mỗi cung là `frontend/src/components/PalaceBox.jsx`.

### 3. Debug thuật toán an sao
- Chạy `npm test` trong `backend` (không cần MongoDB).
- Input API: `{ day, month, year, hour, gender, name }`. `hour` là giờ đồng hồ 0–23. `gender` là `1` hoặc `-1`.

## Lưu ý kỹ thuật (Gotchas)

- **Index Địa Chi**: Trong mảng `DIA_CHI`, index 1 là "Tí", index 12 là "Hợi".
- **Tháng nhuận**: `solarToLunar` trả `isLeapMonth`. `calculateTuVi` nhận cờ đó và gọi `resolveAnSaoMonth`: trước ngày 15 giữ số tháng, từ ngày 15 tính tháng sau (tháng 12 nhuận sang tháng 1).
- **Múi giờ**: Giờ nhập là giờ đồng hồ, route đổi sang canh giờ 1–12 trước khi gọi engine. Mặc định giờ Việt Nam (GMT+7).
- **Cách cục**: `POST /api/combinations/match` dùng `combinations.json` (không cache Mongo). Matcher mặc định Tọa thủ; không khớp khi thiếu sao hoặc `verification_status: disabled`. Chi tiết P0: `docs/P0_IMPLEMENTATION_REPORT.md`.

## Prompting Tips cho AI
Khi yêu cầu AI viết code mới, hãy kèm theo các chỉ dẫn:
- *"Dựa vào constants.js để lấy đúng tên sao."*
- *"Đảm bảo logic an sao tuân thủ calculateTuVi trong tuviRules.mjs."*
- *"Sử dụng React 19 functional components cho Frontend."*
- *"Gọi API qua API_BASE, không hard-code localhost."*
