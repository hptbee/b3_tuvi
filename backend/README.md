# Backend API Server - Tuvi_B

Máy chủ API được xây dựng trên nền tảng **Node.js** và **Express**, chịu trách nhiệm xử lý logic an sao và quản lý dữ liệu MongoDB.

## 📁 Cấu trúc thư mục

-   **`src/engine/`**: Chứa thuật toán lõi (Lunar, TuviRules). Đây là phần quan trọng nhất.
-   **`src/models/`**: Định nghĩa các Mongoose Schemas (`Chart`, `Meaning`, `KnowledgeBase`).
-   **`src/routes/`**: Các endpoints định nghĩa giao tiếp API.
-   **`src/controllers/`**: Logic xử lý cho từng route (tách biệt khỏi route definition).
-   **`src/config/`**: Cấu hình kết nối Database và các biến môi trường.
-   **`src/scripts/`**: Các script hỗ trợ (migration, seed data, cleanup).

## 🚀 Khởi chạy

1.  Cài đặt dependencies:
    ```bash
    npm install
    ```
2.  Chạy ở chế độ phát triển (với nodemon):
    ```bash
    npm run dev
    ```
3.  Chạy production:
    ```bash
    npm start
    ```

## 🔌 API Endpoints tiêu biểu

### Charts
-   `POST /api/charts/generate`: Tạo mới một lá số từ thông tin người dùng.
-   `GET /api/charts`: Lấy danh sách các lá số đã lưu.
-   `GET /api/charts/:id`: Chi tiết một lá số.

### Meanings
-   `GET /api/meanings/star/:name`: Truy vấn ý nghĩa của một sao cụ thể.
-   `GET /api/meanings/palace/:name`: Truy vấn ý nghĩa của một cung cụ thể.

## 🛠 Công nghệ sử dụng
-   **Express**: Framework web.
-   **Mongoose**: ODM cho MongoDB.
-   **CORS**: Cho phép Frontend truy cập API.
-   **Nodemon**: Tự động reload server khi có thay đổi code.
