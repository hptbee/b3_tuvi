# AI Context & Developer Handbook - Tuvi_B

Tài liệu này được thiết kế để cung cấp cho mô hình AI (như Claude, GPT, Gemini) các hướng dẫn kỹ thuật cụ thể để làm việc với codebase này hiệu quả nhất.

## Nguyên tắc chung (AI Guidelines)

- **Ngôn ngữ**: Mã nguồn sử dụng tên biến và comments kết hợp tiếng Anh và tiếng Việt (chủ yếu là thuật ngữ chuyên môn). Khi viết code mới, hãy duy trì phong cách này.
- **Tiêu chuẩn ES6+**: Luôn sử dụng `import/export` (Backend hỗ trợ ES Modules).
- **Domain First**: Mọi thay đổi logic phải đối chiếu với `docs/tuvi/DOMAIN_KNOWLEDGE.md`.

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
| SQLite | `backend/src/db/sqlite.js`, `backend/src/db/repositories.js`, `docs/archive/specs/SQLITE_MIGRATION_VERIFICATION.md` |
| Ý nghĩa sao / cung | bảng `stars`, `palaces` sau `npm run db:seed` |
| Cách cục | `backend/src/engine/combinationMatch.js`, `backend/src/data/combinations.json`, `backend/src/routes/combinationRoutes.js` |
| Model lá số chuẩn hóa | `backend/src/engine/normalizeChart.js`, `backend/src/engine/starCatalog.js`, `docs/architecture/CHART_DOMAIN_MODEL.md` |
| Quan hệ cung | `backend/src/engine/palaceRelation.js`, `backend/src/engine/chartQuery.js`, `docs/tuvi/PALACE_RELATIONSHIPS.md` |
| Formula V1 (matcher + interpretation) | `backend/src/data/formulaV1.mjs`, `backend/src/engine/combinationMatch.js`, `docs/archive/sprints/tuvi/sprint-9/SPRINT_9_FINAL_FORMULA_SPEC.md` |
| Rule cách cục v2 (research snapshot) | `backend/src/engine/ruleEngine.js`, `backend/src/data/rulesV2.json`, `docs/archive/implementation/p0-p1/P1_2_RULE_ENGINE.md` |
| Hồ sơ trường phái | `backend/src/engine/schoolProfile.js`, `docs/tuvi/TU_VI_SCHOOL_VARIANTS.md` |
| UI lá số | `frontend/src/components/TuViChart.jsx` |
| Form nhập liệu | `TuviFormBox` trong `frontend/src/App.jsx` |
| Gốc URL API | `frontend/src/apiBase.js` (`VITE_API_BASE_URL`) |

## Hướng dẫn thực hiện các tác vụ phổ biến

### 1. Thêm một Sao mới vào Engine
1. Mở `backend/src/engine/constants.js`: Thêm tên sao và màu sắc vào `STAR_COLORS`.
2. Mở `backend/src/engine/tuviRules.mjs`: an sao đó trong `calculateTuVi`.
3. Nếu sao có miếu/vượng/đắc/hãm, thêm dòng vào `backend/src/data/starStatus.json`.
4. (Tùy chọn) Seed ý nghĩa sao/cung: `cd backend && npm run db:seed`.

### 2. Sửa đổi giao diện Cung
- Component lá số là `frontend/src/components/TuViChart.jsx`.
- Mỗi cung là `frontend/src/components/PalaceBox.jsx`.

### 3. Debug thuật toán an sao
- Chạy `npm test` trong `backend` (không cần file SQLite; matcher dùng JSON).
- Input API: `{ day, month, year, hour, gender, name }`. `hour` là giờ đồng hồ 0–23. `gender` là `1` hoặc `-1`.

## Lưu ý kỹ thuật (Gotchas)

- **Index Địa Chi**: Trong mảng `DIA_CHI`, index 1 là "Tí", index 12 là "Hợi".
- **Tháng nhuận**: `solarToLunar` trả `isLeapMonth`. `calculateTuVi` nhận cờ đó và gọi `resolveAnSaoMonth`: trước ngày 15 giữ số tháng, từ ngày 15 tính tháng sau (tháng 12 nhuận sang tháng 1).
- **Múi giờ**: Giờ nhập là giờ đồng hồ, route đổi sang canh giờ 1–12 trước khi gọi engine. Mặc định giờ Việt Nam (GMT+7).
- **Cách cục**: `POST /api/combinations/match` dùng `combinations.json`. Matcher mặc định Tọa thủ. Chi tiết P0: `docs/archive/implementation/p0-p1/P0_IMPLEMENTATION_REPORT.md`.
- **Lá số chuẩn hóa**: `POST /api/charts/generate` thêm `normalizedChart`. UI vẫn dùng `tuviInfo`. Xem `docs/archive/implementation/p0-p1/P1_1_CHART_MODEL_REPORT.md`.
- **Formula V1 (runtime):** `POST /api/combinations/match` và interpretation pipeline dùng `evaluateNormalizedFormulas` / Formula V1. `rulesV2.json` không phải nguồn matcher hiện tại; giữ làm snapshot nghiên cứu.
- **Rule v2 (lịch sử):** mô tả trong báo cáo P1.2; xem `docs/archive/implementation/p0-p1/P1_2_RULE_ENGINE.md` nếu cần ngữ cảnh triển khai cũ.

## Prompting Tips cho AI
Khi yêu cầu AI viết code mới, hãy kèm theo các chỉ dẫn:
- *"Dựa vào constants.js để lấy đúng tên sao."*
- *"Đảm bảo logic an sao tuân thủ calculateTuVi trong tuviRules.mjs."*
- *"Sử dụng React 19 functional components cho Frontend."*
- *"Gọi API qua API_BASE, không hard-code localhost."*
