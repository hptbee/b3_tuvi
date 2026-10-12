# Tử Vi Việt Nam (Tuvi_B)

Dự án **Tử Vi Việt Nam** là một nền tảng web hoàn chỉnh giúp lập và luận giải lá số Tử Vi theo phong cách hiện đại. Hệ thống được xây dựng theo kiến trúc **3 lớp (3-Tier Architecture)** tách biệt rõ ràng: Giao diện (Frontend), Máy chủ API (Backend) và Cơ sở dữ liệu (Database).

> [!TIP]
> **Dành cho AI & Developers:** Dự án này được tối ưu để các mô hình AI (LLMs) có thể hỗ trợ phát triển nhanh chóng. Vui lòng đọc [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) và [docs/DOMAIN_KNOWLEDGE.md](docs/DOMAIN_KNOWLEDGE.md) để hiểu sâu về thuật toán an sao.

## ✨ Tính năng nổi bật

- 📅 **Chuyển đổi Lịch Âm – Dương**: Chính xác cao, tự động tính toán Can Chi năm sinh.
- ☯️ **Lập Lá số Tử Vi Trọn Bộ**: An bài 14 Chính tinh, Phụ tinh (Thái Tuế, Tràng Sinh, Lộc Tồn, Tứ Hóa...), Tuần, Triệt, Đại Hạn.
- 🔮 **Luận giải chi tiết**: Click trực tiếp vào Cung hoặc Sao để xem ý nghĩa chuyên sâu, lấy dữ liệu trực tiếp từ API.
- 🗺️ **Điều hướng đa trang (Multi-page Routing)**: Trang Chủ, Lập Lá Số, Luận Giải, Kiến Thức, Liên Hệ.
- 💾 **Lưu trữ lịch sử**: Tự động lưu mỗi lá số đã lập vào MongoDB để phục vụ tra cứu và phân tích sau.
- 🤖 **Sẵn sàng tích hợp AI**: Kiến trúc Backend/DB tách biệt giúp dễ dàng gắn module AI luận giải tự động.

## 🏗️ Kiến trúc Hệ thống

Hệ thống được thiết kế theo mô hình client-server hiện đại:

- **Frontend**: [React 19](frontend/README.md) + **Vite**. UI Glassmorphism hiện đại, tối ưu hiệu năng.
- **Backend**: [Node.js (Express)](backend/README.md) cung cấp REST API.
- **Engine**: Thuật toán an sao lõi nằm tại `backend/src/engine/`.
- **Database**: **MongoDB** lưu trữ thông tin lá số và cơ sở dữ liệu luận giải.

```
Tuvi_B/
├── frontend/          # React 19 + Vite (Giao diện) - [Xem Chi Tiết](frontend/README.md)
├── backend/           # Node.js + Express (API Server) - [Xem Chi Tiết](backend/README.md)
│   └── src/
│       ├── engine/    # Thuật toán Tử Vi (Lunar, TuviRules)
│       ├── models/    # MongoDB Schemas (User, Chart, Meaning)
│       └── routes/    # API Endpoints
├── docs/              # Tài liệu bổ trợ dành cho AI/Developer
│   ├── ARCHITECTURAL_OVERVIEW.md
│   ├── DOMAIN_KNOWLEDGE.md
│   ├── AI_CONTEXT.md
│   ├── CONTRIBUTING.md
│   └── CHANGELOG.md
```

| Thành phần | Công nghệ | Cổng |
|---|---|---|
| Frontend | React 19, Vite | `5173` |
| Backend | Node.js, Express | `5000` |
| Database | MongoDB (Docker) | `27017` |
| DB Admin UI | Mongo Express | `8081` |

## 🚀 Hướng dẫn Cài đặt và Chạy

**Yêu cầu:** Node.js LTS, Docker Desktop.

### Bước 1: Clone dự án

```bash
git clone https://github.com/your-username/Tuvi_B.git
cd Tuvi_B
```

### Bước 2: Khởi động Database (Docker)

Mở **Docker Desktop** trước, sau đó chạy:

```bash
docker-compose up -d
```

- MongoDB sẽ chạy tại `localhost:27017`
- Giao diện quản trị DB (Mongo Express) tại `http://localhost:8081`

### Bước 3: Chạy Backend (API Server)

```bash
cd backend
npm install
npm start # Hoặc npm run dev nếu có nodemon
```

Server API chạy tại `http://localhost:5000`.

### Bước 4: Chạy Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Truy cập ứng dụng tại `http://localhost:5173`.

## 🌐 API Endpoints (Sơ lược)

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra trạng thái server |
| `POST` | `/api/charts/generate` | Tính toán & lưu lá số |
| `GET` | `/api/meanings/star/:name` | Lấy ý nghĩa của một sao |

Chi tiết xem tại: [docs/ARCHITECTURAL_OVERVIEW.md](docs/ARCHITECTURAL_OVERVIEW.md)

## 🔧 Build Production

```bash
cd frontend
npm run build
```

## 🤝 Đóng góp

Xem chi tiết tại [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## 📋 Changelog

Lịch sử thay đổi tại [docs/CHANGELOG.md](docs/CHANGELOG.md).

## 📄 Giấy phép

MIT License.
