# Đặc tả chỉ số bổ sung `decoz-frequency-initials-bridge-v1` `1.0.0`

Profile tính số cũ vẫn là `pythagorean-vn-v1` `1.2.0`. Schema phản hồi vẫn `1.2.0`. Đối tượng mới là `indicators`.

## Chung

- Chữ cái: cùng bảng Pythagorean và cùng `normalizeName` của profile.
- Y là phụ âm, như profile.
- Thiếu tên: đam mê ẩn, bài học từ tên, cân bằng, tư duy là `unavailable` / `missing_name`, không phải số 0.
- Cầu Life Path–Birthday vẫn tính khi không có tên.
- `meaningStatus` của nhóm này là `withheld`. Chưa có bài catalog.

## Đam mê ẩn

Đếm giá trị 1–9 của mọi chữ tên. Trả mọi giá trị có số lần bằng mức cao nhất, theo thứ tự tăng. `count` là mức đó.

## Bài học từ tên

Mọi giá trị 1–9 có số lần bằng 0, thứ tự tăng. Danh sách rỗng là hợp lệ: tên có đủ chín giá trị.

## Cân bằng

Mỗi token sau chuẩn hóa góp chữ cái đầu. Cộng các giá trị. `reduceNumber(total, false)`.

## Tư duy

Token đầu. Cộng chữ, rút không giữ master. Cộng số ngày dương lịch gốc (1–31), không dùng số Ngày sinh đã giữ master. Rút không giữ master.

## Cầu

Ba cầu, theo thứ tự:

1. `lifePath-expression`
2. `soulUrge-personality`
3. `lifePath-birthday`

Giá trị là `|số đã công bố − số đã công bố|`. Không rút master trước. Không rút hiệu sau.

## Tương thích

Client cũ bỏ qua `indicators` vẫn đọc được `metrics`. Client mới từ chối thân bài thiếu `indicators` đúng phiên bản `1.0.0`.
