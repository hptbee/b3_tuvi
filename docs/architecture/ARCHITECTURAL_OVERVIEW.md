# Architectural Overview - Tuvi_B

Tài liệu này cung cấp cái nhìn chi tiết về kiến trúc hệ thống và luồng dữ liệu trong dự án **Tử Vi Việt Nam**.

## 1. Mô hình tổng quan (3-Tier Architecture)

Dự án tuân thủ mô hình 3 lớp tiêu chuẩn:

1.  **Presentation Layer (Frontend)**: 
    - React 19 + Vite.
    - Chịu trách nhiệm hiển thị lá số và tiếp nhận dữ liệu đầu vào (Họ tên, Ngày/Giờ sinh).
    - Giao tiếp với Backend qua REST API.
2.  **Application Layer (Backend)**:
    - Node.js + Express.
    - Chứa thuật toán an sao lõi (Astrology Engine).
    - Xử lý logic nghiệp vụ và điều phối dữ liệu.
3.  **Data Layer (Database)**:
    - SQLite file (`backend/data/tuvi.sqlite`) lưu ý nghĩa sao/cung và catalog cách cục đã seed. API lập lá số không thêm hàng ngày giờ sinh.
    - Truy cập qua `src/db/repositories.js` (`node:sqlite`).

## 2. Luồng dữ liệu (Data Flow)

### Quy trình lập lá số:
1.  **Input**: Người dùng nhập thông tin tại `TuviFormBox` trong `frontend/src/App.jsx`.
2.  **Request**: Frontend gửi `POST /api/charts/generate` tới gốc URL trong `frontend/src/apiBase.js`.
3.  **Processing**:
    - Backend nhận request tại `chartRoutes.js` và kiểm tra payload bằng `chartInput.js` trước khi tính.
    - Gọi `lunar.js` để chuyển Dương lịch sang Âm lịch (`isLeapMonth`).
    - Gọi `calculateTuVi` trong `tuviRules.mjs` để an 14 chính tinh, phụ tinh, Tuần, Triệt, đại hạn. Tháng nhuận đi qua `resolveAnSaoMonth`.
    - Kết quả tính là `{ lunarInfo, tuviInfo }`. Response thêm `normalizedChart` (model P1.1). `tuviInfo` giữ nguyên cho UI.
4.  **Storage**: `POST /api/charts/generate` không ghi ngày giờ sinh. Hàng `horoscopes` đã có từ trước vẫn nằm trong file SQLite và không bị xóa bởi API lập lá số.
5.  **Response**: `TuViChart` chỉ đọc `lunarInfo` và `tuviInfo`. Panel cách cục gọi `POST /api/combinations/match`.

## 3. Cấu trúc Engine (Astrology Engine)

Engine nằm tại `backend/src/engine/` và là "trái tim" của hệ thống:

-   **`constants.js`**: Định nghĩa danh sách Thiên Can, Địa Chi, Cung Chức, và bảng màu cho các Sao (Ngũ hành).
-   **`lunar.js`**: Thuật toán chuyển đổi lịch và tính toán Can/Chi/Tiết khí. Tương đối phức tạp, dựa trên các công thức thiên văn học.
-   **`tuviRules.mjs`**: `calculateTuVi` an toàn bộ lá số. Bảng độ sáng nằm ở `data/starStatus.json`. Đầu ra là 12 cung, mỗi cung có danh sách sao dạng chuỗi.
-   **`starCatalog.js`**: ID sao ổn định, tách độ sáng khỏi tên.
-   **`normalizeChart.js`**: đổi `tuviInfo` thành model 12 cung. Không ghi đè engine.
-   **`palaceRelation.js` / `chartQuery.js`**: tam hợp, xung chiếu, giáp, tứ chính cho mọi chi. Chi tiết: `docs/tuvi/PALACE_RELATIONSHIPS.md`, `docs/architecture/CHART_DOMAIN_MODEL.md`.
-   **`ruleEngine.js`**: rule trong `rulesV2.json` cho cách `matching_ok` và các cách provisional có công thức vị trí. Cách còn lại vẫn đi `combinationMatch.js`.

## 4. Mô hình dữ liệu (Database Schemas)

-   **Horoscope**: Một lá số đã lập (input dương lịch, âm lịch kể cả `isLeap` và `anSaoMonth`, `full_chart`).
-   **Star / Palace**: Ý nghĩa sao và cung cho thao tác click trên lá số.
-   **Combination**: `GET /api/combinations` và `POST /api/combinations/match` đều đọc `combinations.json`. Bảng SQLite `combinations` chỉ là bản seed, API không đọc.

## 5. Tích hợp AI (AI Ready)

Hệ thống được thiết kế để dễ dàng mở rộng AI:
-   **Dữ liệu cấu trúc**: Kết quả trả về từ API là JSON chuẩn, giúp các mô hình AI dễ dàng đọc hiểu và đưa ra lời luận giải tự động.
-   **Vector Database (Tiềm năng)**: Backend có thể mở rộng để lưu các bản luận giải vào Vector DB nhằm tăng cường khả năng của AI trong tương lai.
