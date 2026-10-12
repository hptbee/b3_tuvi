# Backend API Server - Tuvi_B

Máy chủ API **Node.js** + **Express**, xử lý an sao và lưu dữ liệu trong **SQLite** (file `data/tuvi.sqlite`).

## Cấu trúc thư mục

- **`src/engine/`**: Thuật toán lõi (lunar, tuviRules, matcher cách cục).
- **`src/db/`**: Kết nối SQLite và repositories.
- **`src/routes/`**: Endpoints API.
- **`src/config/`**: Khởi tạo database.
- **`src/scripts/`**: Seed, migrate, cleanup.

## Khởi chạy

```bash
npm install
npm run db:seed          # sao + cung (lần đầu)
npm run db:combinations  # catalog cách cục (tùy chọn cho GET /api/combinations)
npm run dev
```

## API tiêu biểu

- `POST /api/charts/generate` — lập lá số và lưu `horoscopes`.
- `GET /api/meanings/star/:name` — ý nghĩa sao (cần seed).
- `POST /api/combinations/match` — khớp cách cục (catalog JSON, không phụ thuộc DB).

## Công nghệ

- Express 5, CORS, dotenv
- SQLite qua `node:sqlite` (Node 22+)
