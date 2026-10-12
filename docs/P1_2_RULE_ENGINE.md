# Rule engine v2

Phạm vi: 15 cách `matching_ok`, cộng các cách provisional có công thức vị trí viết được. Nhị hợp và Ám hợp vẫn tắt. Lưỡng Trùng Thiên Mã và Cát Xứ Tàng Hung tắt vì công thức chưa đóng: lưu niên, hoặc chính tinh đắc địa không liệt kê.

## Điều kiện

File: `backend/src/data/rulesV2.json`. Đánh giá: `evaluateRule` trong `ruleEngine.js`.

| Trường | Ý nghĩa |
|---|---|
| `target` | `menh`, hoặc id chức `than` `tat_ach` `tai_bach` `phu_the`. Fallback Mệnh theo `menhPalaceId` |
| `branches` | Địa chi của cung đích |
| `samePalace` | Mọi sao đứng cùng cung đích |
| `brightness` | Một mức `M` `V` `Đ` `B` `H` tại cung đích |
| `clauses` | Mỗi sao (hoặc một sao nếu `any`) phải nằm trong `at` và đúng chi, độ sáng nếu có |
| `clauses.at` | `target`, `tam_hop` (gồm Mệnh), `tam_hop_partners`, `tam_phuong_tu_chinh`, `opposite`, `menh_or_opposite`, `chart` |
| `clauses.samePalaceAny` | Cung của sao vừa khớp phải có một sao trong `stars` hoặc cờ `tuan` / `triet` |
| `countAtLeast` | Ít nhất `n` tín hiệu trong `stars` và `markers` tại cung đích |
| `linked` | Hai cung chức, mỗi bên đủ `min` tín hiệu. `orSwap` đổi hai bên |
| `excluded` | `relation: "same"` — sao loại trừ tại cung đích thì không khớp |
| `noMajor` | Cung đích không có chính tinh. Có thể đi cùng `countAtLeast` hoặc `clauses` |
| `giap.mode` | `both_flanks` hoặc `anchor_flanks` (sao neo tại Mệnh, hai nhóm ở hai bên) |
| `strict` | Rule chặt hơn matcher cũ. Cách vẫn `provisional` |
| `anyOf` | Một trong các nhánh điều kiện |

`clauses.brightness` yêu cầu mọi bản sao của ngôi đó đúng mức sáng, rồi mới lấy bản nằm trong vùng.

Tên sao chưa có trong catalog làm rule không khớp.

Kết quả matcher thêm `evidence`: `ruleId`, `palaceId`, `op`, và `stars` kèm chỉ số cung.

## Rule chặt hơn matcher cũ

| Cách | Điều kiện v2 |
|---|---|
| Tử Phủ Vũ Tướng | Bốn sao trong tam hợp Mệnh–Tài–Quan, không tính xung chiếu |
| Giáp Đệ Đăng Khoa | Hóa Khoa tại Mệnh, Hóa Quyền tại một cung tam hợp kia |
| Phủ Tướng Triều Viên | Thiên Phủ và Thiên Tướng nằm trong hai cung tam hợp kia, không tính Mệnh |
| Văn Tinh Củng Mệnh | Xương, Khúc, Khoa đồng cung Mệnh |
| Dương Lương Xương Lộc | Dương, Lương, Xương tại Mão, thêm Lộc Tồn hoặc Hóa Lộc cùng cung |
| Nhật Nguyệt Tịnh Minh | Mệnh Sửu hoặc Mùi; Dương miếu/vượng tại Tị hoặc Ngọ; Âm miếu/vượng tại Dậu hoặc Tí |
| Minh Châu Xuất Hải | Mệnh Mùi vô chính diệu; Âm tại Hợi; Dương tại Mão |
| Kình Đà Hiệp Kỵ | Hóa Kỵ tại Mệnh; Kình và Đà mỗi sao một bên |
| Hình Kỵ Giáp Ấn | Tướng tại Mệnh; một bên Kình hoặc Hình, bên kia Hóa Kỵ |
| Hình Tù Giáp Ấn | Tướng tại Mệnh; một bên Kình hoặc Hình, bên kia Liêm Trinh |
| Hỏa Tham / Linh Tham | Tham Lang miếu, vượng hoặc đắc trong tam phương tứ chính, cùng Hỏa hoặc Linh |
| Thạch Trung Ẩn Ngọc | Cự Môn tại Mệnh Tí hoặc Ngọ, thêm Hóa Lộc, Hóa Quyền hoặc Lộc Tồn |
| Lộc Mã Giao Trì | Thiên Mã và một trong Lộc Tồn, Hóa Lộc trong tam phương tứ chính |
| Mã Lạc Không Vong | Thiên Mã đồng cung Địa Không, Tuần hoặc Triệt trong tam phương tứ chính |
| Bán Không Chiết Xỉ | Tại Mệnh: Thất Sát hoặc Thiên Tướng, cùng Địa Không và Địa Kiếp. Hạn chưa xét |
| Kình Dương Nhập Miếu | Kình tại Mệnh Thìn, Tuất, Sửu, Mùi hoặc Ngọ, thêm Thất Sát hoặc Tham Lang |
| Cự Phùng Tứ Sát | Cự Môn tại Mệnh; Kình, Đà, Hỏa, Linh trong tam phương tứ chính |
| Lộ Bàng Mai Thi | Liêm Trinh và Thất Sát tại Mệnh Sửu hoặc Mùi; Hóa Kỵ, Kình, Đà trong tam phương tứ chính |
| Hoa Cái Cư Phu Thê | Hoa Cái tại Phu Thê, cùng một sao trong Cô Thần, Quả Tú, Kình, Đà, Hỏa, Linh, Địa Không, Địa Kiếp |
| Chúng Thủy Triều Đông | Đại Hao và Tiểu Hao đồng cung tại Mệnh hoặc Tài Bạch, chi Mão hoặc Dậu |
| Quân Thần Khánh Hội | Tử Vi tại Mệnh; Tả, Hữu, Khôi, Việt trong tam phương tứ chính. Xương Khúc không bắt buộc |
| Mệnh VCD Đắc Tam Không | Mệnh vô chính diệu và ít nhất ba trong Thiên Không, Địa Không, Tuần, Triệt |
| Mệnh Lý Phùng Không | Mệnh có Địa Không, Tuần hoặc Triệt và Thân có Địa Kiếp, hoặc đổi hai bên |
| Lộc Phùng Xung Phá | Lộc Tồn hoặc Hóa Lộc tại Mệnh hoặc xung, đồng cung Không, Kiếp, Hóa Kỵ, Tuần hoặc Triệt |
| Linh Xương Đà Vũ | Bốn sao đồng cung Mệnh. Hạn chưa xét |
| Nhật Nguyệt Tật Ách | Thái Dương, Thái Âm và Hóa Kỵ trong tam phương tứ chính của Tật Ách. Sát tinh chưa liệt kê |

Cự Hỏa Kình Dương, Khúc Ám Đồng Cung, Đế Ngộ Hung Đồ và Đồng Lương Tỵ Hợi chuyển sang v2 và giữ cùng tập lá số với matcher cũ trên mẫu kiểm thử. Đồng Lương không bắt độ sáng hãm: bảng độ sáng của dự án ghi Thiên Đồng tại Tị và Hợi là đắc, Thiên Lương tại hai chi đó là hãm.

Các cách đồng cung, tọa thủ một sao, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Tử Phủ Triều Viên, Song Lộc, Tam Kỳ, Thiên Ất và Nhật Nguyệt Tàng Huy chuyển sang v2 nhưng giữ cùng tập lá số với matcher cũ trên mẫu kiểm thử.

## Chưa chuyển

Hạn, lưu niên, và các chữ "sát tinh" không liệt kê đủ. Thiên Cơ Tỵ Hợi vẫn matcher cũ vì "ngộ sát tinh" không có danh sách đóng. Nhị hợp, Ám hợp, Lưỡng Trùng Thiên Mã và Cát Xứ Tàng Hung là `disabled`.

Giáp `both_flanks` của Không Kiếp và Kình Đà Giáp Mệnh giữ hành vi P0.5.

## Kiểm thử

`backend/test/ruleEngine.test.mjs`

- Mọi cách `matching_ok` có rule. Cách `disabled` không có rule.
- 73 lá số: tên cách không thuộc rule `strict` trùng matcher cũ.
- Tử Vi và Thiên Phủ ở hai cung khác nhau không thành Tử Phủ Đồng Cung.
- Rule chặt: tam hợp không nhận sao chỉ ở xung; Minh Châu không nhận Âm ở cung xung; giáp neo không nhận hai sao cùng một bên; Tịnh Minh không nhận Dương hãm; Hỏa Tham không nhận Tham hãm; Hoa Cái chỉ tại Phu Thê; Tam Không cần đủ ba tín hiệu; Nhật Nguyệt Tật Ách không nhận Hóa Kỵ chỉ ở Mệnh.
