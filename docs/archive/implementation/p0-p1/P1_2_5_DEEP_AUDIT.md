# P1.2.5 — Kiểm toán sâu và ổn định hóa

Ngày kiểm: 2026-10-12. HEAD lúc bắt đầu: `35301d2` (`Replace MongoDB with a local SQLite file store.`). Backend `1.0.0`. Node đã chạy test: v22.23.2.

Working tree lúc bắt đầu còn `package-lock.json` và `frontend/package-lock.json` lệch, không thuộc pha này và không được sửa.

## Hiện trạng trước khi sửa

- P0, P0.5, P1.1, P1.2 và chuyển SQLite đã có trên `main`.
- `npm test` trong `backend` PASS trước khi thêm test mới.
- 63 cách trong `combinations.json`: 15 `matching_ok`, 44 `provisional`, 4 `disabled`.
- 58 rule trong `rulesV2.json`. 27 rule có `strict: true`. 5 cách không có rule: Khoa Minh Lộc Ám, Ám Lộc, Thiên Cơ Tỵ Hợi, Lưỡng Trùng Thiên Mã, Cát Xứ Tàng Hung.
- `POST /api/combinations/match` gọi `matchCombinations` → `evaluateRule` khi có rule, nếu không thì matcher cũ.
- UI không đọc `evidence` hay `normalizedChart`. UI vẫn dùng `tuviInfo`.

## Kết quả P1.1

`normalizeChart` giữ 12 cung, sao unknown, Tứ Hóa dạng association, `schoolId` từ `tuviInfo`. `byStarId` là mảng nhiều bản sao (`instanceId`, `palaceId`, `brightness`), không gộp thành một bản.

`queryStars` lọc độ sáng trên đúng instance trong quan hệ. Lỗi độ sáng nằm ở rule engine, không nằm ở index.

`chartFromMatchInput` truyền `than: null`. Với đầu ra `calculateTuVi`, nhãn `THÂN` nằm trong `cungName`, nên `isThan` vẫn đúng. Lá số giả không ghi `THÂN` trong tên cung thì rule `linked` không thấy Thân. Đó là hệ quả của input thiếu, không phải mất Thân trên lá số engine.

## Lỗi đã xác nhận và đã sửa

### P1 — Độ sáng áp lên mọi bản sao trước khi lọc vùng

`instancesInClause` dùng `hits.every(brightness)` trước khi lọc `at`. Test tổng hợp: Thái Dương `(M)` tại Mệnh và Thái Dương `(H)` tại Tí. Clause đòi `(M)` tại Mệnh trả `null`.

An sao hiện đặt mỗi ngôi một lần, nên các lá `calculateTuVi` chưa cho thấy false negative này. Model vẫn sai khi cùng `starId` xuất hiện hai nơi.

Sửa: lọc vùng và chi trước, rồi giữ bản sao trong vùng có độ sáng được phép.

### P1 — Rule hỏng có thể khớp

Đã chứng minh bằng test, rồi sửa để không khớp:

- thiếu `id`
- `samePalace: []`
- `giap.mode` không phải `both_flanks` hoặc `anchor_flanks`
- `countAtLeast` thiếu `n` nguyên ≥ 1
- `clauses` có `stars` rỗng
- `excluded.relation` khác `same`

Trước sửa, `giap.mode` lạ và `countAtLeast` thiếu `n` đi tới `finish` với hàng rỗng hoặc điều kiện đếm luôn đúng.

### P1 — GET và POST cách cục lệch nguồn

`GET /api/combinations` ưu tiên bảng SQLite sau seed. `POST /match` luôn đọc JSON. Catalog DB cũ sẽ khác rule đang chạy.

Sửa: GET trả `combinations.json`, cùng thứ tự và cùng bản ghi với matcher. Test cấy một cách chỉ có trong SQLite và xác nhận GET không trả cách đó.

## Không phải lỗi

- `samePalace` không nhận hai sao ở hai cung tam hợp. Đã có test Tử Phủ Đồng Cung.
- Sao không có trong catalog làm rule không khớp.
- Cách `disabled` bị bỏ trước khi đánh giá rule.
- Không còn import `mongoose` trong `backend/src`.

## Chưa xác minh

- Không có lá số chuyên gia độc lập. `matching_ok` nghĩa là công thức đã viết được và test nội bộ, không phải đã đối chiếu thư tịch.
- MongoDB cũ không được mở trong pha này. Không có dữ liệu lá số để đối chiếu sau chuyển SQLite.
- Frontend không được duyệt trên trình duyệt trong pha này vì không đổi UI. `npm run lint` và `npm run build` trong `frontend` PASS.

## Việc để sau

- Không bật Nhị hợp, Ám hợp, Lưỡng Trùng Thiên Mã, Cát Xứ Tàng Hung.
- Thiên Cơ Tỵ Hợi vẫn matcher cũ.
- Không làm P1.3, vận hạn, hay LLM.
