# Dị bản trường phái đang áp dụng trong engine

Engine mặc định dùng hồ sơ `vn-tam-hop-default` (`backend/src/engine/schoolProfile.js`).

`matching_ok` ở đây nghĩa là **logic khớp với quy tắc đã chọn**, không phải tiên đoán đã được khoa học kiểm chứng.

## Quy tắc đã chốt cho P0 (không còn coi là dị bản trong code)

| Hạng mục | Quy tắc mặc định | Lý do chọn | Nguồn đối chiếu |
|---|---|---|---|
| Tứ Hóa | An sau Xương, Khúc, Tả, Hữu; dò mọi danh sách sao | Bảng Tứ Hóa của chính project có Văn Xương, Văn Khúc, Tả Phù, Hữu Bật | Kabala ch.4; `tuHoaMap.json` |
| Đường Phù | Từ Lộc Tồn kể 1, đếm nghịch đến cung 8 | Khớp bảng Giáp Mùi … Quý Tị | [Kabala – Cách lập lá số](https://hoc.kabala.vn/cach-lap-la-so-tu-vi/) |
| Văn Tinh Mậu/Kỷ | Mậu Thân, Kỷ Dậu | Ba bảng can tiếng Việt khớp nhau | Kabala; [Xemsomenh](https://xemsomenh.com/an-sao-tu-vi); Phong Thủy Thanh Hóa |
| Phá Toái | Tứ Chính → Tị; Tứ Sinh → Dậu; Tứ Mộ → Sửu | Khẩu quyết phổ biến VN | [Kabala ch.4](https://hoc.kabala.vn/chuong-4-an-sao-la-so-tu-vi-phan-2/); [Sơn Khiêm](https://tuvisonkhiem.vn/thu-vien/sao/pha-toai/) |
| Thiên Đức / Nguyệt Đức | Theo chi năm: Tí khởi Dậu / Tị, đếm thuận | Không an theo tháng | [Học viện lý số bài 12](https://hocvienlyso.org/tu-hoc-tu-vi-sao-theo-chi-nam-sinh.html) |
| Chủ Thân năm Ngọ | Linh Tinh | Ba nguồn khớp; bản cũ Hỏa Tinh là lỗi | Kabala; Học viện lý số; tracuulasotuvi |

## Dị bản còn mở — engine chọn một giá trị và ghi rõ

Không được trộn hai cột “mặc định” và “dị bản” trong cùng một lần tính.

| Khóa | Mặc định P0 | Dị bản không mặc định | Ghi chú |
|---|---|---|---|
| `chuMenhBy` | `yearChi` (chi năm sinh) | `menhChi` (chi cung Mệnh) | [Sơn Khiêm – Mệnh chủ](https://tuvisonkhiem.vn/thu-vien/thuat-ngu/menh-chu-la-gi/) ghi rõ hai thuyết. Truyền `schoolProfile.chuMenhBy = 'menhChi'` để đổi. |
| `vanTinhNham` | `dan` (Dần) | `dau` (Dậu) | Bảng Kabala ghi Dần; một số bảng web ghi Dậu. |
| `leapMonth` | `day15` | An tháng nhuận như tháng thường | P0 không đổi. |
| `tyHour` | `keepSolarDate` (23h = Tí, giữ ngày dương) | Tý sớm: 23h tính ngày hôm sau | Chưa cấu hình runtime. |
| Thiên Thương / Thiên Sứ | Cố định Nô Bộc / Tật Ách | Đổi chỗ với Âm nam Dương nữ | Học viện lý số vs Kabala. |
| Hỏa / Linh chiều đi | Theo âm dương nam nữ (`isThuan`) | Luôn đếm thuận | Hai nhánh `isDuong` trong code cũ giống nhau; chiều thực tế do `isThuan`. |
| Khôi Việt can Canh | Sửu / Mùi (bảng JSON hiện tại) | Ngọ / Dần | Chưa sửa vì chưa đủ nguồn thống nhất. |
| Lưu Hà can Đinh, Canh, Tân | Bảng `lHMap` hiện tại | Bảng Kabala khác vài can | P1. |

## Ngoài phạm vi P0

- Tứ Hóa phái / Phi Tinh / Khâm Thiên Môn: thiên bàn, địa bàn, nhân bàn, phi hóa.
- Phái Thiên Lương: an Lộc/Kình/Đà có thể khác; luận theo vòng Thái Tuế.
- Tiểu hạn, lưu niên, Tứ Hóa Đại hạn.
