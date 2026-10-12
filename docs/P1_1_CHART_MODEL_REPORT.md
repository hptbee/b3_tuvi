# Báo cáo P1.1 — model lá số và quan hệ cung

Ngày: 2026-10-12. HEAD trước khi làm: `fb58d73` trên `main`. Baseline `npm test` lúc đó PASS. Không có regression P0.5 cần chặn.

Không làm AI, văn bản luận giải mới, vận hạn, hay P1.2.

## Kiến trúc

Engine an sao vẫn trả `tuviInfo.boxes`. Ba module mới chỉ đọc kết quả đó:

- `starCatalog.js` — ID sao.
- `normalizeChart.js` — Chart / Palace / StarInstance.
- `palaceRelation.js` và `chartQuery.js` — quan hệ và truy vấn.

`combinationMatch.js` lấy số liệu giáp, tam hợp, xung từ `branchIndexRelations`. Điều kiện khớp cách cục không đổi.

## API

`POST /api/charts/generate` thêm `normalizedChart`. `lunarInfo` và `tuviInfo` giữ nguyên. Mongo vẫn lưu `full_chart = tuviInfo`. Không đổi schema, không migration.

Frontend không đọc trường mới. `TuViChart` vẫn nhận `tuviInfo`.

## Test đã chạy

`cd backend && npm test` — PASS. Gồm test P0/P0.5 cũ, bảng 12 chi, chuẩn hóa, và 26 lá số (12 giờ × 2 giới tính, cộng hai mốc nhuận ngày 14 và 15) đối chiếu chuỗi sao và kết quả matcher.

`cd frontend && npx eslint src/App.jsx src/components/CachCucPanel.jsx src/components/TuViChart.jsx` — PASS, no issues.

`cd frontend && npm run build` — PASS. Vite 5.4.21, `dist/assets/index-tUQI8EkX.js`. Frontend không đổi file render lá số; bundle trùng hash bản P0.5.

MongoDB không được gọi. Lưu `Horoscope` chưa xác minh trong pha này.

## Giới hạn

- `palaceId` là địa chi, không phải id cung chức. P1.2 phải gọi `getPalaceByFunction` khi quy tắc nói "cung Tật Ách".
- Ngũ hành chỉ có cho sao seed ghi `element`. Sao khác là `unknown`.
- Tứ Hóa chỉ gắn sao gốc khi có `canIndex` và hai sao cùng cung.
- Nhị hợp, Ám hợp chưa tính.
- 63 cách cục chưa viết lại trên model mới. `queryStars` và `toLegacyBoxes` là điểm nối.

## P1.2 nên dùng

```js
queryStars(chart, { palaceId: chart.menhPalaceId, relation: 'same', starIds: ['tu_vi', 'thien_phu'] })
queryStars(chart, { palaceId: chart.menhPalaceId, relation: 'tam_phuong_tu_chinh', starIds: ['loc_ton'] })
queryStars(chart, { palaceId: chart.menhPalaceId, relation: 'xung_chieu', brightness: 'H' })
getPalaceByFunction(chart, 'tat_ach')
```

Không lấy sao tam hợp bằng cách gộp tên rồi bỏ mất cung. `findStarPlacements` trả `palaceId` của từng instance.
