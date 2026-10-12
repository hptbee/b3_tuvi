# Kiểm chứng Rule Engine v2

Phạm vi: `ruleEngine.js`, `combinationMatch.js`, `rulesV2.json`, `combinations.json`. Đây là kiểm chứng phần mềm và độ trung thành với công thức đã ghi trong catalog. Không phải thẩm định thư tịch.

## Toán tử

| Toán tử | Ngữ nghĩa sau P1.2.5 | Ghi chú |
|---|---|---|
| `target` | `menh`, id chức (`than`, `tat_ach`, `tai_bach`, `phu_the`, …), hoặc chỉ số chi | Thiếu cung đích thì không khớp |
| `branches` | Địa chi của cung đích | |
| `samePalace` | Mọi sao cùng cung đích. Mảng rỗng không khớp | Không phải “có mặt trong tam hợp” |
| `brightness` trên `samePalace` | Đúng mức của instance tại cung đích | |
| `clauses` | Mỗi sao, hoặc một sao nếu `any`, phải có instance trong `at` | `stars` rỗng không khớp |
| `clauses.at` | `target`, `tam_hop` (gồm đích), `tam_hop_partners`, `tam_phuong_tu_chinh`, `opposite`, `menh_or_opposite`, `chart` | Giá trị lạ ra vùng rỗng, không khớp |
| `clauses.brightness` | Áp vào instance đã nằm trong vùng | Không dùng `.every()` trên cả lá số |
| `clauses.samePalaceAny` | Cung của instance đó có một sao hoặc cờ `tuan` / `triet` | Sao lạ trong danh sách làm clause fail |
| `countAtLeast` | Ít nhất `n` tín hiệu tại cung đích. `n` nguyên ≥ 1 | Marker không phải id sao catalog |
| `linked` | Hai cung chức, `orSwap` đổi bên | Cần nhãn chức hoặc `THÂN` trên cung |
| `giap` | `both_flanks` hoặc `anchor_flanks` | Mode lạ không khớp |
| `excluded` | Chỉ `relation: "same"` tại cung đích | Relation khác không bị bỏ qua; cả rule không khớp |
| `noMajor` | Cung đích không có chính tinh | Đi với clause hoặc đếm; một mình vẫn là điều kiện hợp lệ |
| `anyOf` | Nhánh đầu tiên khớp | |
| `strict` | Khác matcher cũ; cách vẫn `provisional` | Không nâng trạng thái |

Nhị hợp và Ám hợp không có toán tử. Trả `null` ở tầng quan hệ cung.

## Evidence

`evaluateRule` ghi evidence từ điều kiện vừa chạy, không bịa sau khi khớp:

- `ruleId`, `palaceId`, `branchName`, `op`, `schoolId` (null nếu lá số không có)
- `stars[]`: `starId`, `palaces`, và `brightness` với `samePalace` / `clauses`

DTO API thêm `verification_status`, `certainty`, `disclaimer` từ catalog. UI hiện không đọc `evidence`.

Giáp và `countAtLeast` chưa gắn mảng `brightness` trên từng hàng. Marker Tuần/Triệt xuất hiện như `starId` chuỗi `tuan` hoặc `triet`.

## Phân loại 63 cách

| Lớp | Số | Ý nghĩa |
|---|---|---|
| `matching_ok` và có rule | 15 | Công thức vị trí đã khóa trong DSL. Test nội bộ. Chưa đối chiếu chuyên gia |
| `provisional`, rule không `strict` | 16 | Nằm trong 31 rule giữ cùng tập tên với matcher cũ trên 73 lá mẫu (cùng 15 cách `matching_ok`) |
| `provisional` và `strict: true` | 27 | Siết hơn matcher cũ hoặc đổi cung chức. Vẫn chưa xác thực |
| `provisional`, không rule | 1 | Thiên Cơ Tỵ Hợi — “sát tinh” không có danh sách đóng |
| `disabled` | 4 | Nhị hợp / Ám hợp (2), lưu Thiên Mã, Cát Xứ Tàng Hung |

Test pass không biến rule `provisional` thành đã kiểm chứng thư tịch.

Đồng Lương Tỵ Hợi không bắt độ sáng hãm: `starStatus.json` ghi Thiên Đồng tại Tị/Hợi là đắc, Thiên Lương tại hai chi đó là hãm. Xung đột này được giữ, không bị bịa cho khớp câu cổ.

## API

`POST /api/combinations/match` dùng rule v2 khi tên cách có trong `rulesV2.json`. Cách không có rule đi matcher cũ. Cách `disabled` không trả về.

`GET /api/combinations` trả cùng file JSON. Bảng SQLite `combinations` không còn bị GET đọc.

Input rỗng của POST trả `{ count: 0, combinations: [] }`.
