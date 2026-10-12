# Kiểm chứng chuyển SQLite

Thay MongoDB/Mongoose bằng `node:sqlite` (Node 22). File mặc định: `backend/data/tuvi.sqlite`. Đường dẫn ghi đè: `SQLITE_PATH`. File `*.sqlite`, `*.sqlite-wal`, `*.sqlite-shm` nằm trong `.gitignore`.

## Đã xác nhận bằng test

Lệnh: `node test/sqlite.test.mjs` (gộp trong `npm test`). Database tạm, không ghi `backend/data/tuvi.sqlite`.

- Tạo schema, ghi `horoscopes`, đóng kết nối, mở lại, đọc đúng `input_data` và `full_chart`.
- `getHoroscopeById` không thấy id thì trả `null`.
- Upsert sao hai lần vẫn một dòng, lời nghĩa là lần sau.
- Bảng `schema_meta.schema_version` = `1`.
- Kết nối `DatabaseSync` thứ hai ghi được cung trong khi kết nối ứng dụng đang mở (`busy_timeout` 5000, WAL).
- File tạo trước khi có `schema_meta`, nhưng đã có bảng `horoscopes` cùng cột, được gắn version `1` và vẫn đọc được hàng cũ.

`GET /api/combinations` không trả dòng chỉ có trong SQLite. Xem `combinationRoute.integration.test.mjs`.

Runtime `backend/src` không import `mongoose`. `backend/package.json` không còn dependency `mongoose`.

## Hành vi ứng dụng

- `POST /api/charts/generate` gọi `insertHoroscope`. `full_chart` vẫn là `tuviInfo`.
- Không có `GET /api/charts`. Id tự tăng, API không có đăng nhập. Mở list hoặc get công khai sẽ lộ ngày giờ sinh. Đọc theo id chỉ có trong repository cho test và script.
- `GET /api/meanings/...` đọc bảng `stars` và `palaces` sau `npm run db:seed`. Chưa seed thì API trả câu “chưa có dữ liệu”.
- Seed sao/cung/cách cục bọc `BEGIN IMMEDIATE` / `COMMIT`.
- `PRAGMA journal_mode = WAL`, `busy_timeout = 5000`, `foreign_keys = ON`.
- Schema lạ (version khác `1`) làm `initDatabase` đóng file và ném lỗi.

## Chưa xác minh / giới hạn

- `node:sqlite` vẫn in `ExperimentalWarning` trên Node 22.23.2.
- Không có bộ ALTER cho bảng đã tạo với cột khác. Version `1` chỉ chứng nhận file do schema này tạo, hoặc file cũ cùng cột được gắn version lúc mở.
- Không chạy thử đồng thời nhiều request HTTP lập lá số. Test đồng thời là hai kết nối ghi tuần tự trên cùng file.
- Không có backup tự động. Cách sao lưu: dừng tiến trình, copy `tuvi.sqlite` (và wal/shm nếu đang mở thì checkpoint trước).
- JSON hỏng trong cột text được `parseJson` nuốt thành fallback (`{}` hoặc `[]`), không báo corrupt.
- Dữ liệu MongoDB cũ không được nhập. Lá số đã lưu trên Mongo không còn trong SQLite.
- Không có API xóa một lá số. `cleanup.js` xóa cả bảng.

## Bảo mật dữ liệu sinh

Ngày, giờ, tên nằm trong `horoscopes.input_data`. File DB là dữ liệu cá nhân cục bộ. Không commit file đó. Không thêm endpoint liệt kê lá số khi chưa có quyền truy cập.
