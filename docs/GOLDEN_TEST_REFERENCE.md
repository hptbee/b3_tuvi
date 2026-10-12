# Tham chiếu test lập lá số

Không dùng output của `calculateTuVi` để tự sinh expected cho chính hàm đó.

## Phân loại fixture

| Loại | File | Ý nghĩa |
|---|---|---|
| Independent table | `backend/src/data/placementReference.json` + `backend/src/data/tuHoaMap.json` + `backend/src/data/locMap.json` | Bảng/quy tắc lấy từ nguồn ngoài hoặc data tĩnh, không compute từ engine |
| Provisional historical | cùng file, mục `tetDates`, `leapMonths` | Ngày Tết / tháng nhuận Việt Nam đã công bố; chưa phải bộ golden do nhà nghiên cứu duyệt |
| Regression | `backend/test/engine.test.mjs`, `combinationMatch.test.mjs` | Chặn lỗi đã sửa tái xuất hiện |

Không có fixture nào được gắn nhãn **golden** vì chưa có bộ lá số đối chiếu độc lập do chuyên gia chốt.

## Phủ tối thiểu P0

| Nhóm | Cách phủ | Test |
|---|---|---|
| 10 thiên can | Mọi can hợp lệ với chi cùng tính chẵn lẻ | `placement.tables.test.mjs` |
| 12 địa chi | 60 Hoa Giáp | Phá Toái, Đức, Chủ Thân |
| 12 tháng âm | `month = 1..12` | `testHoursAndGender` |
| Tháng nhuận | 14/15 và 3 mốc lịch sử | `engine.test.mjs` + `leapMonths` |
| 12 giờ | canh 1–12 | `testHoursAndGender` |
| Nam / nữ | `gender` 1 và -1 | cùng test; Đại hạn chiều đi gián tiếp |
| Giờ Tý giao ngày | Tài liệu: 23h giữ ngày dương | `testTyHourDocumented` — **chưa đổi ngày** |
| Tết VN khác TQ | 1968, 1985, 2007 | `tetDates` |
| Bảng sao từng lỗi | Tứ Hóa phụ tinh, Đường Phù, Văn Tinh, Phá Toái, Đức, Chủ Thân Ngọ | `placement.tables.test.mjs` |

## Cách cục

Catalog: `backend/src/data/combinations.json`.

- Matcher thuần: `backend/src/engine/combinationMatch.js`.
- Positive/negative: Tử Phủ Đồng Cung, Phiếm Thủy Đào Hoa, Mệnh Vô Chính Diệu.
- Edge: input thiếu → `[]`; điều kiện rỗng → không khớp; `disabled` không bao giờ trả về.
- Regression: 6 hung cách từng khớp ~100% lá số không được vượt 50% trên mẫu 960 lá số.

Nhật Nguyệt Tàng Huy sau khi siết `require_ham` vẫn khớp khoảng 20%–60% tùy mẫu vì Thái Dương/Thái Âm hãm đồng thời là điều kiện thật, không còn là “sao có mặt ở đâu đó trên 12 cung”.

## Chạy

```bash
cd backend && npm test
```

Gồm `engine.test.mjs`, `placement.tables.test.mjs`, `combinationMatch.test.mjs`, và `node --check src/scripts/migrate.js`.
