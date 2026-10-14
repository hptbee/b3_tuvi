# Quan hệ cung

Module: `backend/src/engine/palaceRelation.js`.

Chỉ số `p` từ 1 đến 12. Chuẩn hóa bằng `wrapIndex`: kết quả luôn nằm trong 1…12.

| Quan hệ | Công thức | Gồm cung gốc? |
|---|---|---|
| Tam hợp | `p+4`, `p-4` | Không. Đúng hai đối tác |
| Xung chiếu | `p+6` | Không. Đúng một cung |
| Giáp / kề | `p-1` rồi `p+1` | Không. Lùi trước, tiến sau |
| Tam phương tứ chính | `p`, `p+4`, `p-4`, `p+6` | Có. Đúng bốn id khác nhau |
| Tọa thủ / same | `p` | Có |

`p-4` và `p+8` là cùng một chi. Thứ tự tam hợp trong API là tiến trước (`+4`), lùi sau (`-4`).

Ví dụ Tí (`p = 1`):

- Tam hợp: Thìn, Thân.
- Xung chiếu: Ngọ.
- Giáp: Hợi, Sửu.

Đối xứng: xung của xung là chính nó; mỗi đối tác tam hợp chứa lại cung gốc; mỗi cung giáp chứa lại cung gốc.

`getTamHopPalaces` trả hai cung đối tác. `getStarsByRelation(..., 'tam_hop')` lấy sao trên hai cung đó, không lấy sao tại cung gốc. Muốn cả bốn cung thì dùng `tam_phuong_tu_chinh`.

Nhị hợp và Ám hợp chưa có quy tắc đã chốt trong repo. `relatedBranchIds` trả `null` cho loại chưa hỗ trợ. Matcher vẫn để hai cách đó ở trạng thái `disabled`.

`palaceRelations()` trong matcher giữ hình cũ: mảng `tamHop` bắt đầu bằng cung gốc, rồi hai đối tác. Số liệu lấy từ cùng công thức, không tính lại một kiểu khác.
