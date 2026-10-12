# Tử Vi Việt Nam (`b3_tuvi`)

Nền tảng web lập và luận giải **lá số Tử Vi**. Kiến trúc 3 lớp: giao diện React, API Node.js/Express, và SQLite (file cục bộ).

> **Dành cho AI & developers:** đọc [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) và [docs/DOMAIN_KNOWLEDGE.md](docs/DOMAIN_KNOWLEDGE.md) trước khi sửa thuật toán an sao.

## Tính năng

- **Chuyển Dương lịch → Âm lịch**, Can Chi năm sinh, hỗ trợ tháng nhuận khi an sao.
- **Lập lá số trọn bộ**: 14 chính tinh, phụ tinh (Thái Tuế, Trường Sinh, Lộc Tồn, Tứ Hóa, …), Tuần, Triệt, Đại Hạn.
- **Click sao / cung** trên lá số để xem ý nghĩa từ API (`stars`, `palaces`).
- **Luận cách cục**: khớp tổ hợp sao (cát / hung / đặc biệt) qua `POST /api/combinations/match`.
- **Chia sẻ lá số qua URL** (`/la-so?year=&month=&day=&hour=&gender=&name=`).
- Mỗi lần lập lá số được **lưu vào SQLite** (`horoscopes`). Chưa có màn hình lịch sử trên UI.

Các trang **Luận Giải**, **Kiến Thức**, **Tài Liệu**, **Liên Hệ** hiện là placeholder.

## Kiến trúc

| Thành phần | Công nghệ | Cổng mặc định |
|---|---|---|
| Frontend | React 19, Vite, React Router 7 | `5173` |
| Backend | Node.js, Express 5 | `5000` |
| Database | SQLite (`backend/data/tuvi.sqlite`) | — |

```
b3_tuvi/
├── frontend/                 # React + Vite
│   ├── src/components/       # TuViChart, PalaceBox, CachCucPanel, …
│   └── src/pages/            # Luận giải, kiến thức, tài liệu, liên hệ
├── backend/
│   ├── server.js
│   └── src/
│       ├── engine/           # lunar.js, tuviRules.mjs, chartInput.js
│       ├── data/             # Bảng an sao (JSON)
│       ├── db/               # SQLite + repositories
│       ├── routes/           # charts, meanings, combinations
│       └── scripts/          # seed, seedCombinations, migrate
└── docs/
```

Engine an sao nằm ở `backend/src/engine/`. Frontend chỉ gọi REST API (`frontend/src/apiBase.js`).

## Yêu cầu

- Node.js 22+ (dùng `node:sqlite` tích hợp)

## Cài đặt và chạy

### 1. Clone

```bash
git clone https://github.com/hptbee/b3_tuvi.git
cd b3_tuvi
```

### 2. Seed dữ liệu luận giải (lần đầu)

Không seed thì click sao/cung và panel cách cục sẽ trống hoặc fallback.

```bash
cd backend
npm install
npm run db:seed
npm run db:combinations
```

File DB mặc định: `backend/data/tuvi.sqlite`. Ghi đè bằng `SQLITE_PATH` trong `backend/.env` (xem `.env.example`).

### 3. Cài dependencies và chạy cả stack

Từ thư mục gốc:

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000 (`GET /api/health`)

Chạy từng phần:

```bash
cd backend && npm run dev    # nodemon
cd frontend && npm run dev
```

Frontend đọc `VITE_API_BASE_URL` (xem `frontend/.env.example`). Mặc định `http://localhost:5000`.

## API

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Trạng thái server |
| `POST` | `/api/charts/generate` | Tính, lưu, trả `{ lunarInfo, tuviInfo }` |
| `GET` | `/api/meanings/star/:name?palace=` | Ý nghĩa sao tại cung |
| `GET` | `/api/meanings/palace/:name` | Ý nghĩa cung (hỗ trợ cung kép `Mệnh / Thân`) |
| `POST` | `/api/combinations/match` | Khớp cách cục theo 12 cung |
| `GET` | `/api/combinations` | Catalog cách cục (`?type=` tùy chọn) |

Body lập lá số (`POST /api/charts/generate`):

| Field | Kiểu | Ghi chú |
|---|---|---|
| `name` | string | Tùy chọn, tối đa 100 ký tự |
| `day`, `month`, `year` | int | Ngày dương lịch thật |
| `hour` | int | `0`–`23` |
| `gender` | int | `1` nam, `-1` nữ |

Chi tiết luồng dữ liệu: [docs/ARCHITECTURAL_OVERVIEW.md](docs/ARCHITECTURAL_OVERVIEW.md).

## Test

```bash
cd backend
npm test
```

Chạy `backend/test/engine.test.mjs` (an sao / lịch).

## Build frontend

```bash
cd frontend
npm run build
npm run preview   # tùy chọn
```

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/AI_CONTEXT.md](docs/AI_CONTEXT.md) | Map file → chức năng cho AI |
| [docs/DOMAIN_KNOWLEDGE.md](docs/DOMAIN_KNOWLEDGE.md) | Thuật ngữ và quy tắc Tử Vi |
| [docs/ARCHITECTURAL_OVERVIEW.md](docs/ARCHITECTURAL_OVERVIEW.md) | Luồng dữ liệu, schema |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Cách đóng góp |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Lịch sử thay đổi |
| [frontend/README.md](frontend/README.md) | Ghi chú frontend |
| [backend/README.md](backend/README.md) | Ghi chú backend |
