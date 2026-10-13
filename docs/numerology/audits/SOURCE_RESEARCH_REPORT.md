# Báo cáo nghiên cứu nguồn Thần Số Học

Ngày đọc: 2026-10-13. Không bịa tên sách, số trang, hoặc lời trích chưa lấy được. Kho Motivational-Numerology vẫn chỉ là nguồn so sánh cộng đồng, không được nâng thành giáo trình.

Bậc dùng trong báo cáo:

- `source_discovered`: thấy URL hoặc thư mục, chưa đọc đủ bài.
- `source_read`: đã lấy nội dung trang hoặc file trong đợt này.
- `formula_supported`: phép tính trên nguồn khớp profile ở ví dụ đã kiểm.
- `formula_conflict`: phép tính trên nguồn ra số khác profile ở một ví dụ cụ thể.
- `edition_verified`: đã đối chiếu ấn bản sách. Đợt này không có mục nào đạt bậc này.

## Nguồn đã đọc

### SRC-DECOZ-METHOD

- Tác giả ghi trên trang: Hans Decoz.
- Nhãn trang: How to Do Your Own Numerology Reading.
- URL: https://www.worldnumerology.com/do-your-own-reading/
- Bậc: `source_read`. Không có số trang sách. `edition_verified=false`.
- Bản quyền: trang web có lời luận dài. Báo cáo chỉ giữ các bước tính cần để so sánh, không chép phần diễn giải tính cách.
- Hỗ trợ và lệch:
  - Đường đời: rút tháng, ngày, năm, giữ 11/22/33, rồi cộng. Trang gọi việc cộng mọi chữ số của ngày sinh là cách không dùng. `formula_conflict` với D03. Ví dụ trên trang: 15/10/1998.
  - Đỉnh: giữ master ở tháng và ngày trước khi cộng. Tháng 11 được giữ là 11. `formula_conflict` với `component-reduce-root-age-v1` khi thành phần là 11 hoặc 22.
  - Tuổi đỉnh: đỉnh một tới tuổi 36 trừ Đường đời. `formula_supported` cho công thức tuổi, ở mức trang web.
  - Thử thách: rút master rồi lấy hiệu. Số 0 được trang gọi là trường hợp thường gặp. Phép tính `formula_supported`. Thời lượng trên trang là ước lượng và có chồng lấn, khác cửa sổ cứng của profile.
  - Biểu đạt và linh hồn: rút từng phần tên, giữ master. `formula_conflict` với tổng một lần của cả chuỗi.
  - Y: có thể là nguyên âm hoặc phụ âm tùy chữ bên cạnh. `formula_conflict` với D06.
  - Trưởng thành: cộng Đường đời và Biểu đạt, giữ master. Phép cộng `formula_supported` nếu hai số đầu vào đã cùng quy ước.
  - Thái độ: một câu “cộng tháng sinh với ngày sinh”, chưa thấy quy tắc master. Chưa gọi là conflict.
  - Năm/tháng/ngày cá nhân: cộng tháng sinh, ngày sinh và năm/tháng/ngày lịch. Ví dụ 15/05/2026 ra 3. `formula_supported` cho kết quả 1–9 của trường lịch dương.

### SRC-DECOZ-LIFEPATH

- URL: https://www.worldnumerology.com/numerology-life-path/
- Bậc: `source_read`, `edition_verified=false`.
- Lặp lại quy tắc thành phần có master và ví dụ 12/08/1990 ra 3, 22/11/1983 ra 9.
- Phần ý nghĩa trên trang là diễn giải tính cách, nghề và quan hệ. Catalog sản phẩm không được lấy các đoạn đó.

### SRC-DECOZ-PINNACLE

- URL: https://www.worldnumerology.com/numerology-pinnacles/
- Bậc: `source_read`, `edition_verified=false`.
- Nhắc lại P1 = tháng + ngày, có giữ master, và mốc “sinh nhật thứ 36 trừ Đường đời”; master phải về một chữ số trước khi trừ.
- Trang cũng có lời về cơ hội và sự kiện trong giai đoạn. Phần đó không phải công thức và không được đưa vào catalog.

### SRC-DECOZ-CHALLENGE

- URL: https://www.worldnumerology.com/numerology-challenges/
- Bậc: `source_read`, `edition_verified=false`.
- Quy tắc: khi tính thử thách thì master bị rút. Hiệu tuyệt đối của tháng/ngày, ngày/năm, hai thử thách đầu, và tháng/năm. Ví dụ 07/03/1962 ra các thành phần 7, 3, 9 và thử thách 4, 6, 2, 2.
- Trang nói thời lượng chỉ là khoảng xấp xỉ. `formula_conflict` với việc UI gắn thử thách vào đúng kỳ đỉnh.
- Các đoạn về nghề, tiền, sức khỏe và “thách thức 0 mang tính chất của 9” không được chép.

### SRC-DECOZ-MONTH

- URL: https://www.worldnumerology.com/free-forecasts/monthly-numerology-forecast.html
- Bậc: `source_read`, `edition_verified=false`.
- Năm cá nhân = số mặt trời (tháng + ngày, về một chữ số) cộng năm lịch.
- Tháng cá nhân = cộng số tháng vào năm cá nhân.
- Ngày cá nhân = cộng ngày lịch vào tháng cá nhân. Ví dụ tháng cá nhân 7 và ngày 31: 7+31=38, qua 11, rồi 2. Câu trên trang: 11 không được nhận là master đối với năm, tháng và ngày cá nhân.
- Phần dự báo tháng là nội dung tiên đoán. Không dùng làm lời catalog.

### SRC-COMMUNITY

- ID đã có: `motivational-community-c0535c9`.
- URL: https://github.com/evoluteur/motivational-numerology/blob/c0535c9c9e7bcdc340b7eed255f89f64146dd8d5/i18n/meaning_en.js
- Revision và SHA256 nằm trong `sources.json`. Đợt này không tải lại file và không tính lại hash. Bậc giữ nguyên `reference_checked` từ registry, không nâng thành `edition_verified`.
- Registry đã ghi: Y có điều kiện, chu kỳ theo sinh nhật, không có `destiny.33`. Những điểm đó vẫn là khác biệt đã biết, không phải giáo trình.

## Nguồn chỉ mới thấy tên

| ID | Điều đã thấy | Bậc | Không được kết luận |
|---|---|---|---|
| SRC-NUMBERORIGIN | Trang NumberOrigin mô tả một máy tính năm cá nhân theo lịch dương và tổng chữ số. | `source_discovered` | Không dùng làm chuẩn Pythagorean và không đối chiếu hết ví dụ. |
| Javane / Bunker / Goodwin | Tên xuất hiện trong tài liệu thứ cấp về chu kỳ theo sinh nhật hoặc theo năm lịch. | Không đọc | Không gán quy tắc, năm xuất bản, hoặc số trang. |
| Sách được README kho cộng đồng nhắc | Registry nói có liên kết sách nhưng sách không được lấy. | Không đọc | Không trích sách đó. |

## So với profile

| Quy ước | Profile 1.2.0 | Trang Decoz đã đọc |
|---|---|---|
| Đường đời | Mọi chữ số, giữ 11/22/33 trên tổng | Từng thành phần, giữ master, rồi cộng |
| Y | Luôn phụ âm | Tùy chữ kề |
| Biểu đạt | Một tổng cho cả tên | Từng phần tên rồi cộng |
| Đỉnh, đầu vào | Rút master trước | Giữ 11/22 ở tháng và ngày |
| Tuổi đỉnh | 36 trừ gốc 1–9 | 36 trừ Đường đời đã về một chữ số |
| Giá trị thử thách | Hiệu tuyệt đối, gốc thành phần | Cùng phép trừ sau khi rút master |
| Thời lượng thử thách | Cùng cửa sổ với đỉnh | Ước lượng, có chồng lấn |
| Chu kỳ cá nhân | Năm lịch, kết quả 1–9 | Năm lịch, 11 không giữ ở chu kỳ |
| Lời 33, đỉnh, thử thách | Không đăng | Trang có diễn giải; sản phẩm không chép |

## Hệ quả nếu muốn khớp Decoz

Chưa đổi mã. Nếu sau này chọn trang Decoz làm quy ước mới, cần profile mới, ví dụ một id khác `pythagorean-vn-v1` `1.2.0`. Profile cũ phải tiếp tục trả các số hiện tại.

Ảnh hưởng số:

- Đường đời đổi ở các ngày mà thành phần 11/22/33 làm tổng khác tổng mọi chữ số. Mốc đã khóa: 11/09/2000 từ 4 sang 22.
- Đỉnh đổi khi tháng là 11 hoặc ngày là 11/22. Mốc đã khóa: 22/11/1992, P1 từ 6 sang 33.
- Biểu đạt, linh hồn, nhân cách và trưởng thành đổi khi việc rút từng phần tên hoặc cách xét Y làm đổi tổng.
- Ngày sinh có thể cần công bố cả ngày gốc lẫn số rút gọn. API đã có `originalDay`.
- Tuổi đỉnh và phép thử thách không cần đổi chỉ vì trang Decoz, trừ khi muốn bỏ cửa sổ cứng của thử thách.

API hiện từ chối version lạ bằng `PROFILE_NOT_FOUND`. Client cũ gửi `1.2.0` không bị đổi số. Không có dữ liệu sinh đã lưu nên không cần migration hồ sơ.

## Giới hạn truy cập

Lần registry trước ghi HTTP trực tiếp tới worldnumerology.com bị 403. Đợt này công cụ lấy trang web của phiên kiểm toán đã đọc được năm URL ở trên. Điều đó không biến các trang thành ấn bản đã xác minh, và không xóa ghi chú 403 của lần lấy trước.
