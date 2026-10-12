# Frontend Web App - Tuvi_B

Ứng dụng web được xây dựng bằng **React 19** và **Vite**, mang lại trải nghiệm mượt mà với giao diện hiện đại.

## 📁 Cấu trúc thư mục

-   **`src/components/`**: Các thành phần giao diện dùng chung và chuyên biệt (Form, Chart, Panels).
-   **`src/pages/`**: Các trang chính của ứng dụng (Home, Analysis, Knowledge).
-   **`src/assets/`**: Hình ảnh, biểu tượng và các tài nguyên tĩnh khác.
-   **`src/engine/`**: (Lưu ý) Có thể chứa bản copy hoặc logic phụ trợ liên quan đến hiển thị lá số.
-   **`App.jsx`**: Điểm bắt đầu chính, quản lý Routing và Layout.
-   **`App.css`**: Chứa các style chính và các biến màu CSS (Glassmorphism).

## 🚀 Khởi chạy

1.  Cài đặt dependencies:
    ```bash
    npm install
    ```
2.  Chạy ở chế độ phát triển:
    ```bash
    npm run dev
    ```
3.  Truy cập tại: `http://localhost:5173`

## 🎨 Design System

Dự án sử dụng phong cách **Glassmorphism**:
-   Nền mờ (Backdrop filter blur).
-   Màu sắc hài hòa, hiện đại.
-   Responsive tốt trên các thiết bị di động.

## 🛠 Công nghệ sử dụng
-   **React 19**: Library UI chính.
-   **Vite**: Build tool siêu nhanh.
-   **React Router**: Quản lý điều hướng đa trang.
-   **Lucide React**: Hệ thống icon.
