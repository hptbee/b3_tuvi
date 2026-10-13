# Nghiên cứu nguồn — chỉ số nâng cao, số 33, thử thách 0

Ngày: 2026-10-13. Baseline `b014969844b9e9accf3e8ef6be5bd0f629775658`.
Không chép đoạn luận có bản quyền. Chỉ ghi quy tắc tính và chỗ mâu thuẫn.

## Nguồn chính đã mở

| Nguồn | URL | Mức truy cập | Bản quyền |
|---|---|---|---|
| Hans Decoz, How to Do Your Own Numerology Reading | https://www.worldnumerology.com/do-your-own-reading/ | Trang công khai, đã đọc 2026-10-13 | Văn của Decoz. Không chép lời luận. |
| Hans Decoz, Balance Number | https://www.worldnumerology.com/numerology-balance-number/ | Trang công khai, đã đọc | Có ví dụ số Thomas John Hancock. |
| Hans Decoz, Rational Thought | https://www.worldnumerology.com/numerology-articles/rational-thought-number.html | Trang công khai, đã đọc | Có ví dụ Thomas = 22/4, ngày 3, kết quả 7. Có câu về Rational Thought 22 mâu thuẫn với trang tính. |
| Hans Decoz, Bridge Numbers | https://www.worldnumerology.com/numerology-bridge-numbers/ | Trang công khai, đã đọc | Ví dụ 4−1=3, 9−4=5, 7 và 6 thành cầu 1. Không nói cách xử lý master. |
| Hans Decoz, Karmic Lessons | https://www.worldnumerology.com/numerology-karmic-lessons/ | Trang công khai, đã đọc | Số thiếu trong tên đầy đủ. Có thể nhiều số hoặc không thiếu số nào. |
| Hans Decoz, Master Number 33 | https://www.worldnumerology.com/numerology-master-numbers/master-number-33/ | Trang công khai, đã đọc phần mở | 33 không phải bài của 6. Decoz chỉ giữ 33 ở một số vị trí. |
| Hans Decoz, Challenge Numbers | https://www.worldnumerology.com/numerology-challenges/ | Đoạn tìm được về thử thách 0 | Decoz nói thử thách 0 mang đặc điểm của 9 nhưng vẫn gọi là 0. |
| Hans Decoz, Power of Nothing | https://www.worldnumerology.com/numerology-articles/numerology-power-of-nothing.html | Trang công khai, đã đọc đoạn | Hiệu hai số một chữ số không ra 9; hiệu 0 được ông gắn phẩm chất của 9. |
| Motivational Numerology `meaning_en.js` | https://github.com/evoluteur/motivational-numerology/blob/c0535c9c9e7bcdc340b7eed255f89f64146dd8d5/i18n/meaning_en.js | Đã đọc bản ghim | Không có khóa 33. Không có thử thách 0. |
| Affinity Numerology, Hidden Passion | https://affinitynumerology.com/using-numerology/your-hidden-passion-number.php | Trang công khai | Hòa thì phá hòa bằng số khác trong lá. Khác với Decoz. |
| Numerologist.com, Karmic Lessons | https://numerologist.com/numerology/karmic-lessons | Trang công khai | Cùng quy tắc đếm thiếu 1–9 trong tên khai sinh. |
| Landnum / Numerologist.com, Challenge 0 | các trang công khai đã tìm | Nguồn phụ | Đọc 0 là không có một bài học duy nhất, không nói 0 trở thành 9. |

Sách in không được mở trong lượt này. Không bịa số trang. `expertVerified` và `bookVerified` vẫn false.

## Hidden Passion

Trang tính của Decoz: “The Hidden Passion is the number most often represented in the full name at birth. There can be more than one.”
Đếm giá trị Pythagorean của mọi chữ trong tên khai sinh. Giá trị 1–9 xuất hiện nhiều nhất. Hòa thì có nhiều hơn một số. Không có quy tắc phá hòa trên trang đó.
Affinity phá hòa bằng Destiny rồi Heart's Desire. Quy tắc đó không được chọn.

## Karmic Lessons

Decoz: số thiếu trong tên đầy đủ lúc sinh. Có thể nhiều số. Không thiếu số nào cũng bình thường. Khác karmic debt. Ô trống của ngày sinh là biểu đồ khác.

## Balance

Decoz: cộng giá trị chữ cái đầu của họ tên khai sinh, rút về một chữ số, kể cả master.
Ví dụ Thomas John Hancock: T=2, J=1, H=8, tổng 11, rút thành 2.
Trang “do your own reading”: “Master numbers do not apply here.”
Gạch nối: ví dụ transit của Decoz giữ “Hancock-Johnson” là một họ. Hồ sơ B3 đã biến gạch nối và nháy thành khoảng trắng trước khi đếm chữ. Cân bằng dùng chính token đó, nên “Hancock-Johnson” ra hai chữ cái đầu H và J. Đây là khác biệt đã ghi, không thêm bộ chuẩn hóa thứ hai.

## Rational Thought

Trang tính: cộng ngày sinh với mọi chữ của first name, rút một chữ số, master không áp dụng.
Bài Rational Thought: Thomas rút 22/4, ngày sinh 3, kết quả 7.
Cùng bài nói Rational Thought 22 chỉ ra từ 11 của tên cộng ngày 11 hoặc 29. Câu này mâu thuẫn với “master không áp dụng” và với ví dụ đã rút 22 thành 4 trước khi cộng.
Quy ước đã chọn: rút phần tên đứng đầu không giữ master, cộng số ngày dương lịch, rút tổng không giữ master. Kết quả luôn 1–9. Không triển khai ngoại lệ 22.

Với tên Việt ghi họ trước, token đầu là họ. Giao diện không gọi đó là tên gọi.

## Bridge

Decoz: hiệu của hai số lõi.
Đã tính tường minh: Life Path và Expression; Heart's Desire và Personality. Ông còn nêu Life Path và Birthday (7 và 6 thành 1) như cùng một phép.
Không nói có trừ master trước hay không. Nguồn phụ mâu thuẫn: có nơi rút master về gốc trước, có nơi giữ master.
Quy ước đã chọn: hiệu tuyệt đối của đúng số đã công bố (11, 22, 33 giữ nguyên), không rút tiếp. Ví dụ một chữ số của ông vẫn khớp. Hiệu lớn hơn 9 không có bài số đơn trên trang của ông. Hiệu 0 là hai số bằng nhau; trang của ông không có bài riêng cho 0.

## Số 33

Decoz gọi 33 là master teacher, khác bài của 6, và nói chỉ kích hoạt ở Life Path, Soul Urge, Expression, Personality, Maturity, Essence hoặc Pinnacle. Chỗ khác ông rút thành 6.
B3 đã giữ 33 ở những phép profile bật master, và không rút thành 6. Nguồn cộng đồng đã ghim không có bài 33. Cổng catalog không nhận URL ngoài GitHub blob. Vì vậy không phát hành bài 33.

## Thử thách 0

Decoz: thử thách 0 hay gặp; ông gắn đặc điểm của 9 cho hiệu 0 và vẫn gọi đó là thử thách 0.
Nguồn khác: 0 nghĩa là không có một thử thách duy nhất.
Hai cách đọc không cùng một kết luận. Hồ sơ không đổi 0 thành 9 và không phát hành bài catalog.
