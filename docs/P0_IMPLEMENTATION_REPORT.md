# Báo cáo triển khai P0

Ngày: 2026-10-12. Phạm vi: sửa an sao đã xác nhận, siết matcher cách cục, test hồi quy. Không làm AI, vận hạn, hay P1–P3.

## 1. Lỗi đã sửa

| ID | Lỗi | Trạng thái |
|---|---|---|
| C1 | 7 hung cách khớp mọi lá số vì quét 12 cung / điều kiện rỗng | Matcher mặc định Tọa thủ; không khớp khi thiếu sao hoặc thiếu input |
| C2 | `excluded_stars` không đọc | Đã đọc; phá cách nếu sao loại trừ nằm trong vùng |
| C3 | Tý/Tỵ vs Tí/Tị | Chuẩn hóa chi |
| C4 | Nhị hợp / Ám hợp bị bỏ qua nhưng vẫn có thể khớp nhầm | `disabled` |
| C5 | Văn bản tuyệt đối về cha mẹ / mắt / sinh tử | Viết lại + disclaimer hung cách; Nhật Nguyệt Tật Ách `disabled` |
| S1 | Tứ Hóa bỏ Xương Khúc Tả Hữu | An Tứ Hóa sau phụ tinh; dò mọi list |
| S2 | Đường Phù sai 6/10 can | `fixChi(locPos - 7)` |
| S3 | Văn Tinh Mậu/Kỷ | Thân / Dậu |
| S4 | Phá Toái theo tam hợp sai | Tứ Chính/Sinh/Mộ |
| S5 | Thiên Đức, Nguyệt Đức theo tháng | Theo chi năm |
| S6 | Chủ Thân năm Ngọ = Hỏa Tinh | Linh Tinh |
| R1 | `migrate.js` `import` giữa hàm | Sửa; `node --check` pass |
| R2 | `stars.json` JSON hỏng | JSON hợp lệ, stub 3 sao; nguồn luận giải vẫn là `seed.js` |
| R3 | ESLint `set-state-in-effect` | App.jsx, CachCucPanel.jsx sạch |
| R4 | CHANGELOG nhận Tiểu hạn / AI như đã có | Ghi Unreleased là kế hoạch, không phải đã ship |

## 2. Root cause

**Cách cục:** `combinationRoutes.js` cũ, khi `positions` rỗng và không có `required_palaces`, gán `checkIndices = 1..12`. Mọi lá số đều có Địa Không, Nhật, Nguyệt, Kình, Hỏa ở *nào đó*, nên hung cách chỉ liệt kê sao là true. Điều kiện rỗng (`required_stars: []` trừ VCD) cũng trả true.

**Tứ Hóa:** vòng lặp chỉ `majorStars.some(ms => ms.includes(st))` và chạy trước khi an Xương Khúc Tả Hữu.

**Đường Phù / Văn Tinh / Phá Toái / Đức / Chủ Thân:** bảng cứng lệch nguồn Tam Hợp VN đã đối chiếu.

## 3. File thay đổi (chính)

- `backend/src/engine/tuviRules.mjs`, `starNames.js`, `schoolProfile.js`, `combinationMatch.js`
- `backend/src/data/combinations.json`, `placementReference.json`, `stars.json`
- `backend/src/routes/combinationRoutes.js`, `models/Combination.js`
- `backend/src/scripts/seedCombinations.js`, `migrate.js`, `buildCombinationsCatalog.mjs`
- `backend/test/engine.test.mjs`, `placement.tables.test.mjs`, `combinationMatch.test.mjs`
- `frontend/src/App.jsx`, `frontend/src/components/CachCucPanel.jsx`
- `docs/P0_IMPLEMENTATION_REPORT.md`, `GOLDEN_TEST_REFERENCE.md`, `TU_VI_SCHOOL_VARIANTS.md`, `CHANGELOG.md`

## 4. Test bổ sung

- Placement tables độc lập (Tứ Hóa phụ tinh, Đường Phù, Văn Tinh, Phá Toái, Đức, Chủ Thân, 12 giờ/tháng, nam nữ, Tết, nhuận).
- Matcher: input invalid, empty rule, disabled, VCD, Tử Phủ Đồng Cung, Phiếm Thủy, Tàng Huy không 100%, hung cách nguy hiểm không universal, catalog 63, disclaimer.
- `node --check migrate.js`.

## 5. Kết quả chạy thật

```
cd backend && npm test
```

PASS (2026-10-12): engine + placement tables + combinations + migrate syntax.

```
cd frontend && npx eslint src/App.jsx src/components/CachCucPanel.jsx
```

PASS: no issues.

```
cd frontend && npm run build
```

PASS: Vite 5.4.21, `dist/assets/index-Bj30Nlv2.js`.

Không chạy được integration MongoDB: Docker daemon không có trong môi trường kiểm toán. Matcher không phụ thuộc Mongo (catalog JSON).

### Trước / sau (matcher)

Mẫu kiểm toán cũ: 7 hung cách 100%. Sau P0: mặc định Tọa thủ; Tàng Huy dùng hãm địa toàn cục (12/60 Hoa Giáp ngày 15/6 giờ Tí trong unit test); 6 cách còn lại < 50% trên 960 lá số mẫu.

### An sao vốn đúng

Test cũ (Mệnh tháng 1 giờ Tí = Dần, 14 chính tinh, nhuận ngày 15, getStarStatus, validate input) vẫn PASS.

## 6. Chưa xác minh

- Khôi Việt can Canh, Lưu Hà vài can, chiều Hỏa/Linh vs “luôn thuận”, Thiên Thương đổi chỗ: dị bản, chưa sửa.
- `chuMenhBy: yearChi` là chọn mặc định, không phải “đúng duy nhất”.
- Văn Tinh Nhâm = Dần: dị bản Dậu chưa mặc định.
- Không có golden lá số do chuyên gia duyệt.
- GET `/api/combinations` khi Mongo trống fallback JSON — chưa hit API thật.
- 45 cách `provisional`: siết vị trí nhưng công thức cổ (Hội tụ, Tam hợp từ Mệnh, không xét cung chức) vẫn gần đúng chứ không đủ điều kiện thành/phá cách.

## 7. Chuyển P1 (không làm trong P0)

- DSL cách cục: cung chức, phá cách đầy đủ, miếu hãm, cùng cung vs vùng.
- Bật lại Khoa Minh Lộc Ám, Ám Lộc (Nhị hợp/Ám hợp), Nhật Nguyệt Tật Ách (cung Tật Ách).
- Tiểu hạn, lưu niên, Tứ Hóa hạn.
- Knowledge base sao/cung có nguồn.
- Hồ sơ trường phái runtime trên API.
- Health check Mongo thật, rate limit, không ghi DB mỗi F5.

## 8. Rủi ro còn lại

- Matcher gộp sao trong vùng tam hợp: “đồng cung hoặc hội chiếu” vẫn lỏng hơn “cả cụm phải đồng cung”.
- Nhật Nguyệt Tàng Huy khớp khá thường xuyên vì điều kiện hãm đồng thời của hai sao cố định tương đối trên vòng — đây là hệ quả lý thuyết, không phải bug quét 12 cung, nhưng luận giải vẫn không được đọc như chẩn đoán.
- Catalog JSON và Mongo có thể lệch nếu chỉ seed bản cũ; matcher P0 **chỉ đọc JSON**.
- `stars.json` không còn là nguồn seed đầy đủ.

## Catalog 63 cách

| verification_status | Số lượng | Ý nghĩa |
|---|---|---|
| matching_ok | 15 | Điều kiện khớp công thức đơn giản đã siết |
| provisional | 45 | Có điều kiện hợp lệ nhưng nguồn/chi tiết thành cách chưa đủ |
| disabled | 3 | Khoa Minh Lộc Ám, Ám Lộc (Nhị hợp/Ám hợp); Nhật Nguyệt Tật Ách (cung chức) |

Tiêu chí P0: lỗi an sao đã xác nhận đã sửa và có test bảng; hung cách không còn khớp hàng loạt; 63 cách có trạng thái xác thực; có regression. **Không chuyển P1.**
