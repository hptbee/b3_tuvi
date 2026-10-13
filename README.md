# Chiêm nghiệm — Tử Vi & Thần Số Học (`b3_tuvi`)

Ứng dụng web giúp người dùng khám phá lá số Tử Vi và tìm hiểu các góc nhìn về bản thân. Giao diện theo hướng **landing page**, với menu ngang, phần giới thiệu, hai khu vực Tử Vi/Thần Số Học, form lập lá số và FAQ.

**Tử Vi đã có công cụ tính. Thần Số Học hiện là trang giới thiệu, chưa có engine hoặc API tính toán.** Kế hoạch triển khai chi tiết nằm trong [Roadmap Thần Số Học từ A–Z](docs/ROADMAP_NUMEROLOGY_A_TO_Z.md).

> Dành cho developers/agents: đọc [AI Context](docs/AI_CONTEXT.md), [Agent Engineering](docs/AGENT_ENGINEERING.md) và [Contributing](docs/CONTRIBUTING.md). Trước khi sửa công thức Tử Vi, đọc thêm [Domain Knowledge](docs/DOMAIN_KNOWLEDGE.md). Test phần mềm đạt không đồng nghĩa công thức hoặc lời luận đã được đối chiếu nguồn.

## Trạng thái tính năng

| Khu vực | Hiện có | Giới hạn |
|---|---|---|
| Landing page | Hero, CTA đến form, hai lĩnh vực, hướng dẫn và FAQ | Không có tài khoản hoặc dashboard cá nhân |
| Tử Vi | Đổi dương lịch sang âm lịch, an sao, 12 cung, Tuần/Triệt, nhãn Đại hạn | Độ đúng theo nguồn phải được đánh giá riêng với test kỹ thuật |
| Ý nghĩa sao/cung | Chạm tên sao/cung để tra cứu API | Cần seed SQLite; nội dung tra cứu không phải luận giải cá nhân đã duyệt |
| Cách cục | Đối chiếu catalog JSON; hiển thị trạng thái và giới hạn | Khớp điều kiện runtime không tự chứng minh thành/phá cách theo nguồn |
| Phân tích có cấu trúc | Cung, sao, quan hệ, rule và trạng thái chứng cứ | Chưa có lời luận tự do đã duyệt; hỏi đáp trả dữ liệu cấu trúc |
| In / xuất JSON | In lá số, tải `la-so.json` | Không kèm luận giải đã duyệt |
| Thần Số Học | Trang riêng, phong cách tím, thông báo đang phát triển | Chưa tính chỉ số từ ngày sinh/họ tên |
| Nội dung khác | Các route Kiến thức, Tài liệu, Luận giải, Liên hệ | Nội dung vẫn còn sơ khai/placeholder |

### Luồng sử dụng

1. Vào trang chủ, chọn **Khám phá lá số của bạn** hoặc **Lập lá số** trên menu.
2. Nhập ngày sinh **dương lịch**, giờ sinh theo giờ Việt Nam và giới tính; họ tên không bắt buộc.
3. Chọn **Lập Lá Số** để mở trang kết quả. Chạm tên sao/cung để đọc thêm.
4. Có thể in, tải JSON hoặc chia sẻ đường dẫn. Trên điện thoại, vuốt ngang trong vùng lá số để xem đủ 12 cung.

Form đang sửa và dữ liệu lá số đã lập được tách riêng. Thay giờ sinh trong form chưa làm thay đổi lá số cho đến khi gửi lại. Request cũ bị hủy khi chuyển input/route; lỗi API có thông báo và thao tác thử lại.

### Route giao diện

| Route | Nội dung |
|---|---|
| `/` | Landing page; `#hai-goc-nhin` và `#lap-la-so` là các vị trí cuộn trên trang |
| `/la-so` | Form lập lá số; chưa có query thì chưa tính |
| `/la-so?day=15&month=6&year=1990&hour=8&gender=1` | Tự lập lá số từ query |
| `/than-so-hoc` | Trang giới thiệu Thần Số Học, chưa có công cụ tính |
| `/kien-thuc`, `/tai-lieu`, `/luan-giai`, `/lien-he` | Các trang nội dung hiện có |

## Kiến trúc

| Thành phần | Công nghệ | Cổng mặc định |
|---|---|---|
| Frontend | React 19, React Router 7, Vite 5 | `5173` |
| Backend | Node.js 22+, Express 5, ES Modules | `5000` |
| Database | SQLite qua `node:sqlite` | File cục bộ |
| Kiểm thử | Node scripts, Vitest, Testing Library, Playwright/Chromium | CI trên GitHub Actions |

```text
b3_tuvi/
├── package.json                   # Chạy đồng thời backend/frontend
├── frontend/
│   ├── src/App.jsx                # Navigation, landing, form và luồng request
│   ├── src/App.css                # Lá số, panels và style hiện có
│   ├── src/Landing.css            # Landing page và menu chung
│   ├── src/components/            # Lá số, cách cục, chứng cứ, export
│   ├── src/apiBase.js             # Gốc URL API
│   └── e2e/                      # Luồng landing, lá số, lỗi và download
├── backend/
│   ├── server.js
│   ├── scripts/                  # Test runner và coverage floor
│   ├── data/tuvi.sqlite          # Sinh cục bộ sau seed; không commit
│   └── src/
│       ├── engine/               # Đổi lịch, an sao, normalize, rule engine
│       ├── routes/               # Charts, meanings, combinations, interpretations
│       ├── interpretation/       # Phân tích cấu trúc, eligibility, tổng hợp
│       ├── knowledge/            # Provenance và kiểm tra tri thức
│       ├── time/                 # Time overlay và giới hạn năng lực
│       ├── ai/                   # Hỏi đáp cấu trúc, narrator prototype
│       ├── db/                   # SQLite và repositories
│       ├── data/                 # Catalog và bảng JSON
│       └── scripts/              # Seed dữ liệu
└── docs/                         # Domain, kiến trúc, roadmap và báo cáo
```

Frontend gọi REST API; không import thuật toán backend. Engine Tử Vi ở `backend/src/engine/`. API cách cục đọc `backend/src/data/combinations.json`, không đọc bảng SQLite `combinations`.

## Yêu cầu

- **Node.js 22+** có `node:sqlite`; CI hiện dùng Node 22. Môi trường cloud đã được kiểm tra với Node 24.19.0.
- npm; các thư mục gốc, backend và frontend đều có lockfile.
- Chromium của Playwright nếu chạy E2E.
- Không cần database server, tài khoản hoặc API key để chạy luồng Tử Vi hiện tại.

## Cài đặt và chạy

### 1. Lấy mã nguồn và cài dependency

```bash
git clone https://github.com/hptbee/b3_tuvi.git
cd b3_tuvi
npm ci
npm ci --prefix backend
npm ci --prefix frontend
```

Trong môi trường cloud đã có checkout, dùng thư mục hiện có; không clone hoặc tạo worktree mới chỉ để chạy dự án.

### 2. Seed dữ liệu lần đầu

```bash
npm run db:seed --prefix backend
npm run db:combinations --prefix backend
```

- `db:seed`: upsert dữ liệu ý nghĩa sao và cung; cần cho thao tác tra cứu trên lá số.
- `db:combinations`: upsert bản catalog vào SQLite; API cách cục vẫn đọc JSON và không phụ thuộc bước seed này.
- SQLite mặc định: `backend/data/tuvi.sqlite`. Không xóa hoặc ghi đè file của người dùng; sao lưu trước khi thay đổi schema hoặc dữ liệu đang sử dụng.

### 3. Cấu hình cục bộ nếu cần

Tham khảo `backend/.env.example` và `frontend/.env.example`. Tạo `.env` riêng khi cần override, giữ nguyên file cục bộ đã có và không commit secrets.

| Biến | Thành phần | Mặc định / ý nghĩa |
|---|---|---|
| `PORT` | Backend | `5000` |
| `SQLITE_PATH` | Backend | File mặc định ở `backend/data`; đường dẫn tương đối tính từ thư mục chạy backend |
| `VITE_API_BASE_URL` | Frontend | `http://localhost:5000`; giá trị Vite đọc khi chạy/build |

### 4. Chạy chế độ phát triển

Từ thư mục gốc:

```bash
npm run dev
```

Hoặc chạy hai terminal:

```bash
# Terminal 1, từ thư mục gốc
npm run dev --prefix backend
```

```bash
# Terminal 2, từ thư mục gốc
npm run dev --prefix frontend -- --host 127.0.0.1 --port 5173 --strictPort
```

Frontend mặc định cổng 5173, backend cổng 5000. Kiểm tra backend bằng `GET /api/health`; phản hồi có `database: "sqlite"` khi database được khởi tạo.

## B3 / autodev trên Codex cloud

Các skill B3 không nằm trong Git checkout của sản phẩm: `.agents/skills` là index liên kết cục bộ, còn `.b3/home` có thể trỏ tới máy Windows. Trên Linux/cloud, chạy từ thư mục gốc:

```bash
bash scripts/setup-b3-cloud.sh
export B3_HOME="$(cat .b3/cloud-home)"
bash scripts/setup-b3-cloud.sh --verify
```

Bootstrap cài nguồn B3 được pin và dùng installer chính thức để tạo liên kết cho `$autodev` cùng các skill khác. Nó giữ nguyên `.b3/home`, không sao chép nội dung skill và không thay skill riêng đang có. Cần quyền đọc repository `hptbee/b3_ai-engineering` qua Git; không cần tự thêm token nếu authentication hiện tại hoạt động.

Kiểm tra hồi quy installer: `bash scripts/test-b3-cloud.sh` (có kiểm tra clone mới, cần mạng). Xem thêm [hướng dẫn Codex cloud](.cursor/README.md#codex-cloud--linux).

Codex cloud không đăng ký B3 vào catalog chỉ bằng việc tạo liên kết trên filesystem. Dùng tin nhắn thường: **`B3: autodev status`**, **`B3: plan <yêu cầu>`**, **`B3: autodev <yêu cầu hoặc plan>`**. `AGENTS.md` hướng dẫn agent đọc và thực hiện thủ tục B3 gốc; không cần menu `$skill` hoặc slash command. Xem [hướng dẫn B3 trên Codex cloud](docs/CODEX_CLOUD_B3.md). Không coi restart/Publish là bằng chứng native discovery hoạt động.

## API hiện có

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Trạng thái ứng dụng và database |
| `POST` | `/api/charts/generate` | Tính và trả `lunarInfo`, `tuviInfo`, `normalizedChart`; không lưu ngày giờ sinh |
| `GET` | `/api/meanings/star/:name?palace=` | Ý nghĩa sao tại cung; dùng SQLite |
| `GET` | `/api/meanings/palace/:name` | Ý nghĩa cung; hỗ trợ cung kép `Mệnh / Thân` |
| `POST` | `/api/combinations/match` | Khớp cách cục từ `boxes`, `menhIndex`, `menhChi` |
| `GET` | `/api/combinations?type=` | Catalog JSON; lọc loại nếu truyền `type` |
| `POST` | `/api/interpretations/analyze` | Tính lại lá số từ input sinh và trả phân tích cấu trúc |
| `POST` | `/api/interpretations/ask` | Hỏi theo `questionId`/`topic`, dựa trên phân tích server; `prose: null` |

Input sinh dùng cho `/charts/generate` và `/interpretations/analyze`:

| Field | Kiểu | Yêu cầu |
|---|---|---|
| `name` | string | Không bắt buộc, tối đa 100 ký tự sau trim |
| `day`, `month`, `year` | integer | Ngày dương lịch tồn tại; năm `1200`–`2199` |
| `hour` | integer | `0`–`23` |
| `gender` | integer | `1` nam, `-1` nữ |

Ví dụ kiểm tra API bằng dữ liệu mẫu:

```bash
curl --fail --silent http://127.0.0.1:5000/api/health
curl --fail --silent http://127.0.0.1:5000/api/charts/generate \
  -H 'Content-Type: application/json' \
  --data '{"day":15,"month":6,"year":1990,"hour":8,"gender":1}'
```

API Thần Số Học trong roadmap là **đề xuất**, chưa tồn tại ở runtime.

## Kiểm thử

Từ thư mục gốc:

```bash
npm test --prefix backend
npm test --prefix frontend
npm run lint --prefix frontend
npm run build --prefix frontend
```

Backend runner chạy các test unit/integration được liệt kê trong `backend/scripts/runTests.mjs`, không chỉ `engine.test.mjs`. Test mới phải được đăng ký vào runner để CI thực sự chạy.

Coverage và kiểm tra CI:

```bash
npm run test:ci --prefix backend
npm run test:ci --prefix frontend
```

### E2E

Từ `frontend`:

```bash
cd frontend
npx playwright install --with-deps chromium
npm run test:e2e
```

Playwright tự khởi động backend/frontend theo `frontend/playwright.config.js`; có thể tái sử dụng server đang chạy. Nếu đã dùng `SQLITE_PATH`, `PORT` hoặc `VITE_API_BASE_URL` riêng, bảo đảm cấu hình khớp cổng/dữ liệu cần kiểm tra. Browser dependencies cần được cài theo quyền của hệ điều hành.

Các nhóm E2E hiện có:

- `chart.spec.js`: lập lá số, chứng cứ, xử lý request chậm, input đã gửi, in bằng bàn phím và mobile.
- `chart-errors.spec.js`: ngày sai, retry, lỗi cách cục và nội dung JSON download.
- `landing.spec.js`: CTA desktop/mobile, navigation và FAQ.

Tại commit [`8fc5a01`](https://github.com/hptbee/b3_tuvi/commit/8fc5a01), **15 E2E đã đạt trên Chromium trong môi trường cloud**. Đây là kết quả của lần chạy đó, không phải trạng thái CI live hoặc bằng chứng đúng chuyên môn. Môi trường cloud này dùng cấu hình ignored `.b3/playwright.cloud.mjs` với Chromium hệ thống; CI dùng cấu hình Playwright được commit.

GitHub Actions có ba job `backend`, `frontend`, `e2e`; xem [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Build và triển khai

```bash
npm run build --prefix frontend
npm run preview --prefix frontend
```

- `frontend/dist` là output static; `preview` chỉ dùng kiểm tra build cục bộ.
- Production: chạy backend riêng, đặt `VITE_API_BASE_URL` đúng trước khi build; nên dùng reverse proxy cùng origin.
- Static host phải rewrite các route SPA như `/la-so` và `/than-so-hoc` về `index.html`.
- SQLite cần volume có thể ghi và sao lưu; không để file database trong web root.
- CORS, giới hạn tần suất request và vận hành production cần được cấu hình theo môi trường. Không coi `npm run dev` là quy trình production.

## Dữ liệu cá nhân và giới hạn diễn giải

API lập lá số không ghi ngày giờ sinh vào SQLite. Tuy nhiên, **URL chia sẻ chứa dữ liệu nhập**, có thể xuất hiện trong lịch sử trình duyệt, screenshot hoặc hệ thống log bên ngoài. File JSON/in cũng là dữ liệu người dùng chủ động xuất; không đồng nhất “không lưu database” với “không có dữ liệu nhạy cảm”. Bảng `horoscopes` từ phiên bản cũ, nếu có, vẫn tồn tại.

Tử Vi và Thần Số Học là các hệ thống diễn giải mang tính tham khảo. Runtime match, kết quả tính số, nguồn công thức và nội dung đã được duyệt là các trạng thái khác nhau. Không tự nâng trạng thái nguồn hoặc thêm lời luận chỉ vì test xanh.

## Roadmap và tài liệu

| Tài liệu | Phạm vi |
|---|---|
| [Roadmap Thần Số Học A–Z](docs/ROADMAP_NUMEROLOGY_A_TO_Z.md) | Kế hoạch mới: công thức, chuẩn hóa tên, engine, API, nội dung, UX, tests và phát hành |
| [Roadmap Tử Vi Sprint 9–14](docs/ROADMAP_SPRINT_9_14.md) | Tri thức Tử Vi, đối chiếu nguồn, vận hạn và AI có chứng cứ |
| [Autodev Master Plan V2](docs/AUTODEV_MASTER_PLAN_V2.md) | Kế hoạch/điều phối hiện có; không thay bằng roadmap Thần Số Học |
| [AI Context](docs/AI_CONTEXT.md) | Map file và hướng dẫn developers/agents |
| [Architectural Overview](docs/ARCHITECTURAL_OVERVIEW.md) | Luồng dữ liệu và kiến trúc Tử Vi |
| [Contributing](docs/CONTRIBUTING.md) | Quy tắc thay đổi mã nguồn, domain và dữ liệu |
| [Domain Knowledge](docs/DOMAIN_KNOWLEDGE.md) | Thuật ngữ và quy tắc Tử Vi |
| [Remaining Coverage Gaps](docs/quality/REMAINING_COVERAGE_GAPS.md) | Gaps của báo cáo Sprint 8; cần đối chiếu với tests mới |

Roadmap mô tả công việc dự kiến, không xác nhận tính năng đã được triển khai hoặc nguồn đã được duyệt. Bắt đầu Thần Số Học bằng việc chốt rule profile và bộ fixture độc lập trước khi viết engine.
