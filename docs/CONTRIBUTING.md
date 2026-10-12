# Hướng dẫn đóng góp (Contributing Guidelines)

Chào mừng bạn đến với dự án **Tử Vi Việt Nam (Tuvi_B)**! Chúng tôi rất trân trọng mọi đóng góp, dù lớn hay nhỏ, để làm cho ứng dụng trở nên phong phú và chính xác hơn.

## Cấu trúc dự án

```
Tuvi_B/
├── frontend/          # React 19 + Vite — mọi thay đổi giao diện nằm ở đây
├── backend/           # Node.js + Express — logic và API nằm ở đây
│   └── src/
│       ├── engine/    # Thuật toán lõi Tử Vi — sửa đổi cẩn thận!
│       ├── db/        # SQLite + repositories
│       ├── routes/    # API Endpoints
│       └── config/    # Cấu hình kết nối DB
```

## Làm thế nào để đóng góp?

### 1. Báo cáo lỗi (Report a Bug)
Nếu phát hiện lỗi an sao, lỗi hiển thị, hoặc API trả về kết quả sai, hãy tạo **Issue** với thông tin:
- Lá số gặp lỗi (Giới tính, Ngày, Tháng, Năm, Giờ sinh).
- Mô tả lỗi cụ thể (Ví dụ: Sao Thiên Cơ an sai ở cung Dần).
- Kết quả mong đợi (theo lý thuyết Tử Vi bạn tham chiếu).

### 2. Đề xuất tính năng (Suggesting Enhancements)
Tạo **Issue** với nhãn `enhancement`, mô tả rõ:
- Tính năng đó hoạt động thế nào?
- Tại sao nó cần thiết?
- (Tuỳ chọn) Ý tưởng thiết kế UI/UX.

### 3. Đóng góp dữ liệu Luận giải (Astrology Data)
Dữ liệu luận giải tĩnh ở `backend/src/data/`. Ý nghĩa sao/cung và lá số đã lập nằm trong SQLite (`backend/data/tuvi.sqlite`) sau khi seed/chạy API.
- `starMeanings.js`: Ý nghĩa các sao.
- `palaceMeanings.js`: Ý nghĩa các cung.
- Lời văn cần logic, khách quan, không chứa thông tin cực đoan.

### 4. Đóng góp mã nguồn (Pull Requests)

1. Fork dự án.
2. Tạo branch mới: `git checkout -b feature/TenTinhNang`
3. Chạy đầy đủ môi trường để test:
   - `cd backend && npm run db:seed` (lần đầu)
   - `cd backend && node server.js` (API)
   - `cd frontend && npm run dev` (UI)
4. Commit: `git commit -m 'feat: Mô tả thay đổi'`
5. Push và tạo Pull Request.

## Tiêu chuẩn Code (Code Style)

**Frontend (`frontend/`):**
- Chuẩn ES6+, React functional components với hooks.
- Tổ chức CSS theo Vanilla CSS, tránh xung đột class.
- Không import trực tiếp từ `backend/` — mọi dữ liệu phải đi qua API.

**Backend (`backend/`):**
- ES Modules (`import/export`), không dùng `require`.
- Logic thuật toán nằm trong `src/engine/` — tránh đặt logic nghiệp vụ vào routes.
- Routes chỉ nên xử lý request/response, delegate sang controller hoặc engine.

**Thuật toán lõi (`backend/src/engine/`):**
- Đây là phần quan trọng nhất. Mọi thay đổi cần được kiểm tra bằng test case cụ thể (năm sinh, tháng, giờ → vị trí sao mong đợi).

Cảm ơn bạn đã đồng hành cùng chúng tôi! 🙏
