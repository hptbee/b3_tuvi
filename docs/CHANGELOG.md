# Nhật ký Thay đổi (Changelog)

Tất cả các thay đổi đáng chú ý của dự án **Tử Vi Việt Nam (Tuvi_B)** sẽ được ghi chép tại đây.

---

## [Unreleased]

### Thêm mới (Added)

- Documentation architecture: [docs/README.md](README.md) navigation index, [DOCUMENTATION_POLICY.md](DOCUMENTATION_POLICY.md), canonical map and migration manifest under `docs/engineering/meta/`, [DOC_LINK_CHECKER.md](engineering/DOC_LINK_CHECKER.md), and `scripts/check-doc-links.mjs` + regression test (CI `docs` job).

### Thay đổi (Changed)

- Reorganized human-readable docs into `planning/`, `architecture/`, `engineering/`, `tuvi/`, and `archive/`; runtime knowledge JSON and decision trees remain under `docs/knowledge/`.
- Root README and numerology roadmap/status reconciled with main after PR #31 (chaptered report, 154 readings, five formula-only advanced indicators).
- Model lá số chuẩn hóa và quan hệ cung (P1.1): `normalizedChart` trên API lập lá số, không đổi `tuviInfo`.
- Rule engine v2 cho 15 cách `matching_ok`, và các cách provisional có công thức vị trí, kể cả cung Phu Thê, Tật Ách, Tài Bạch, Thân và cờ Tuần/Triệt. Cách siết chặt hơn matcher cũ vẫn ghi `provisional`. Lưỡng Trùng Thiên Mã và Cát Xứ Tàng Hung chuyển sang `disabled`.
- Backend chuyển từ MongoDB/Mongoose sang SQLite (`node:sqlite`, file `backend/data/tuvi.sqlite`). Bỏ `docker-compose.yml` và dependency `mongoose`.
- Sổ nguồn và ma trận 63 cách (P1.3A): `docs/knowledge/`. Không có cách nào được gắn trang sách. Không đổi schema SQLite.
- P1.3A.1: mười cách có đoạn trong PDF Tân Biên 277 trang (bản dựng 2014, bìa ghi 1956). Không khớp rule đang chạy. Không sửa rule, không bật Khoa Minh Lộc Ám.
- AutoDev Master Plan (`docs/archive/planning/AUTODEV_MASTER_PLAN.md`): hàng đợi M0 → KB-01; P1.3B, LLM và vận hạn không READY.
- AutoDev Master Plan V2 (`docs/planning/AUTODEV_MASTER_PLAN_V2.md`): điều phối sau V1. V1 giữ làm lịch sử. AUTH-01 loại khỏi phạm vi. KB-02 và migration production vẫn chờ người.
- CONTRIBUTING: bốn điều cấm (công thức, nâng nguồn, ghi đè SQLite, merge nhạy cảm) và bốn lớp provenance.
- Hợp đồng provenance (`docs/knowledge/provenance-contract.json`): bốn lớp và cổng chuyển trạng thái. Test PASS không nâng thành primary hoặc `checked_against_edition`.
- CI (`.github/workflows/ci.yml`): backend `npm test`; frontend lint và build. Node 22. Không deploy.
- `docs/engineering/AGENT_ENGINEERING.md`: hàng rào cho agent, phạm vi đã loại, cổng cần người.
- Prototype schema tri thức trên DB tạm (`knowledgePrototype.js`). Không gọi từ `initDatabase()`. Không ghi `backend/data`. Không nạp description cách cục. Migration production vẫn chờ người.
- `POST /api/charts/generate` không lưu ngày giờ sinh. Không xóa hàng `horoscopes` đã có.
- Chủ dự án chấp nhận PDF Tân Biên 277 trang (`tuvithuchanh.com`) làm bản đối chiếu. `authenticated: true` chỉ cho file đó. Không chứng minh bản in 1956. Bản EMIC 2012 không mở được. Bản thay thế chưa duyệt: Internet Archive `TuViDdauSoTanBien-VDThaiThuLang-DV` (2017, nhiều PDF). Không sửa rule.

### Khắc phục lỗi (Fixed)
- Rule v2: độ sáng áp vào bản sao nằm trong vùng điều kiện, không loại cả ngôi sao vì một bản ở cung khác. Rule thiếu `id`, `samePalace` rỗng, `giap.mode` lạ, `countAtLeast.n` không hợp lệ, hoặc `excluded.relation` khác `same` thì không khớp.
- `GET /api/combinations` đọc `combinations.json`, cùng nguồn với matcher, không đọc catalog SQLite đã seed.
- `POST /api/combinations/match` có integration test đối chiếu pure matcher.
- Giáp cung phải có sao ở cả hai bên Mệnh. `require_ham` gắn với cung của quy tắc.
- Khóa cách cục trên lá số gồm giờ sinh, giới tính và fingerprint sao.

### Kế hoạch (chưa triển khai)
- Module AI luận giải, đăng nhập, lịch sử lá số, Tiểu hạn / lưu niên: **chưa có trong code**. Trang `/luan-giai` vẫn là placeholder.

## [0.5.0] - 2026-10-12

### Thêm mới (Added)
- Matcher cách cục thuần (`combinationMatch.js`), catalog `combinations.json` với `verification_status`.
- Hồ sơ trường phái mặc định `schoolProfile.js`.
- Test bảng an sao độc lập và regression cách cục.
- `docs/archive/implementation/p0-p1/P0_IMPLEMENTATION_REPORT.md`, `GOLDEN_TEST_REFERENCE.md`, `TU_VI_SCHOOL_VARIANTS.md`.

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
