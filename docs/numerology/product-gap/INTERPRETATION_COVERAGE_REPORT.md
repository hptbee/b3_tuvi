# Độ phủ diễn giải

Ngày: 2026-10-13. SHA: `f709e42`. Catalog `1.1.0`, profile `pythagorean-vn-v1` `1.2.0`.

Thần số học ở đây là hệ biểu tượng. Các đoạn chữ không phải phát hiện tâm lý đã kiểm chứng. Báo cáo này chấm độ phủ chữ, không chấm “độ đúng” của một trường phái.

## Những gì đang có

Catalog có 11 chủ đề (1–9, 11, 22) và 10 ngữ cảnh:

| Ngữ cảnh | Số bài | Ghi chú |
|---|---|---|
| Đường đời | 11 | 1–9, 11, 22 |
| Ngày sinh | 11 | 1–9, 11, 22 |
| Thái độ | 9 | 1–9, không master |
| Biểu đạt | 11 | |
| Linh hồn | 11 | |
| Nhân cách | 11 | |
| Trưởng thành | 11 | |
| Năm cá nhân | 9 | 1–9 |
| Tháng cá nhân | 9 | |
| Ngày cá nhân | 9 | |
| Tổng | 102 | |

Độ dài đoạn `readings`: 63–164 ký tự, trung vị 110, trung bình 108. Mỗi ngữ cảnh còn opening, application và prompt riêng. Giao diện ghép thành một đoạn trong `<details>`, kèm câu hỏi và khối nguồn.

Ví dụ độ sâu, Đường đời 4 trong catalog: một câu về việc dựng thứ còn đứng được và về quy tắc lỗi thời. Đó là một gợi ý, không phải bài đọc theo chặng đời.

Chính sách đã chốt trong `CONTENT_POLICY.md` và `PINNACLE_CONTENT_STATUS.md`:

- Quan hệ nguồn chỉ là `general_number_theme`.
- `expertVerified` và `bookVerified` đều false.
- Hai lượt review biên tập cho 1.1.0 không phải review chuyên gia. Mã `bc-63fd3b46-7494-5598-a998-4825ce2e1ea8` và `bc-dc2cc9ca-0499-5214-bfc2-916a530b6aaa`. Năm sửa chữ sau đó chưa review lại.
- Số 33: `source_unavailable`. UI hiện “Chưa có lời luận đủ căn cứ cho số 33.” Không dùng gốc 6.
- Đỉnh và thử thách: `content_not_in_scope`, `meaning` null.
- Lưới và tuyến: mô tả sự có mặt, không phán tính cách.

Trên ảnh chụp, lời nằm sau nút “Lời luận tham khảo”. Lần nhìn đầu của cả trang là các con số.

## Chấm theo câu hỏi của một bài đọc

| Câu hỏi | Bảy chỉ số và ba chu kỳ | Đỉnh, thử thách | Lưới, tuyến | Bản tổng |
|---|---|---|---|---|
| Số này đại diện điều gì trong profile? | Có một vai trò ngắn | Chỉ có định nghĩa tính toán | Có câu “không phải đánh giá năng lực” | Không |
| Bài cơ bản | Một đoạn ~100 ký tự | Không | Không | Không |
| Riêng cho đúng chỉ số này | Có, 10 ngữ cảnh khác opening | Không | Không | Không |
| Mặt thuận và mặt khó | Không tách | Không | Không, và không được bịa mặt xấu cho ô trống | Không |
| Câu hỏi để tự nhìn | Có, trong details | Không | Không | Không |
| Đổi theo tuổi | Không | Tuổi đã tính, chữ chưa có | Không áp | Không |
| Số khác đổi ngữ cảnh thế nào | Không | Không nói đỉnh cùng năm cá nhân | Không nói tên với ngày sinh | Không |
| Giới hạn nguồn | Có, và đáng giữ | Có câu “chưa có lời” | Có câu từ chối mũi tên | Có footer |

## Chỗ chữ lặp và chỗ chữ mỏng

102 bài không phải 102 nhãn dùng chung: cùng số 4 được viết lại theo đường đời, linh hồn, năm cá nhân. Đó là điểm đáng giữ.

Độ mỏng nằm ở chỗ khác:

- Một đoạn không đủ để nói số đó làm gì trong chỉ số đó qua nhiều tình huống.
- Người đọc không thấy mặt thuận và mặt khó thành hai ý có căn cứ.
- Ba chu kỳ dùng cùng vốn số 1–9. Năm, tháng và ngày khác nhau ở opening, nhưng vẫn là một câu. Chưa có cách đọc “năm 4 gặp tháng 4”.
- Lời đóng trong details nên đa số người chỉ thấy số. Khoảng trống trải nghiệm lớn hơn khoảng trống số lượng bài.
- Không có đoạn nào trích một ấn bản sách. Thêm chữ không làm nguồn mạnh hơn.

Không viết thêm đoạn cho đủ số từ. Bài dài hơn chỉ đáng làm khi thêm được một ý kiểm được: vai trò của chỉ số, một giới hạn, hoặc một quan hệ đã định nghĩa với số khác.

## Việc chưa có chữ

### Đỉnh

Bốn giá trị và bốn cửa sổ tuổi đã hiện. Người dùng không đọc được số đó nói gì, cũng không đọc được “số này ở giai đoạn đầu” khác “cùng số đó ở giai đoạn cuối” thế nào.

Nguồn đã loại trong `PINNACLE_CONTENT_STATUS.md`: catalog cộng đồng không có bài đỉnh; trang Decoz có lời về cơ hội, nghề, tiền, sức khỏe và không được chép; thử thách 0 của Decoz được diễn giải theo hướng số 9 và nghề, không đủ điều kiện đăng; chưa có sách đã đối chiếu.

Hệ quả: có thể vẽ tháp ngay. Không thể bịa bốn bài để dán lên tháp.

### Thử thách

Người dùng thấy hiệu tuyệt đối, kể cả 0, và một câu nói 0 là hợp lệ. Chưa có bài cho 0–8. Profile không gọi thử thách thứ ba là thử thách chính. Bài mới không được thêm nhãn đó.

Thử thách và đỉnh đang ngồi cùng một thẻ. Dù sau này có chữ, chữ cần nói đây là hai phép: tổng và hiệu, cùng một cửa sổ tuổi theo profile này, không phải một ý.

### Tuyến và ô

Tám trạng thái là dữ liệu. Tên 123 kế hoạch, 147 thực tế, 159 quyết tâm, 258 cảm xúc, 369 trí tuệ, 456 ý chí, 789 hành động, 357 tâm linh xuất hiện như bảng trên https://thansohoconline.com/ (`PUBLIC_PAGE_VERIFIED` cho việc trang đó đặt tên). B3 chưa chọn lớp tên này.

Nếu chọn, cần một version nội dung mới, viết lại bằng lời của B3, giữ câu ô trống không phải thiếu năng lực, và không sửa rule present/partial/absent. Bài vietsohoc về từng mũi tên là `DOCUMENTATION_ONLY`, không phải nguồn để chép.

### Số 33

Chủ đích để trống. somenh gắn nhãn 33/6 trong bách khoa (`PUBLIC_PAGE_VERIFIED` khung mục lục). Làm ngược lại sẽ phá quyết định đã công bố.

### Chỉ số chưa tính

Rational Thought, Balance, Hidden Passion, Karmic Lessons, Karmic Debt, Subconscious Self, Cornerstone, Capstone, First Vowel, Bridge, Minor numbers, Planes, Transit, Essence không có số và không có chữ. Viết chữ trước phép tính sẽ tạo bài không gắn được vào kết quả.

## Diễn giải nối

Đối thủ nói họ đọc nhiều số cùng lúc. Bằng chứng phiên này chỉ tới mức chủ trương:

- bandothanso FAQ (`PUBLIC_PAGE_VERIFIED`): bản trả phí đọc mô thức giữa ngày sinh, tên, thử thách và 12 tháng. Bản đó `PAYWALLED`.
- Decoz trang chart (`PUBLIC_PAGE_VERIFIED`): gợi ý thứ tự đọc, từ đường đời sang ngày sinh, biểu đạt, linh hồn, nhân cách, rồi thử thách, trưởng thành, karmic lessons, hidden passion. Đó là thứ tự giảng, không phải một lá số đã in ra.

B3 chưa có quan hệ nào trong số này dưới dạng chữ gắn vào kết quả thật.

Những quan hệ có thể viết mà không bịa tâm lý, vì chúng là sự kiện đã tính:

| Quan hệ | Sự kiện dùng được | Chưa được phép nói |
|---|---|---|
| Đường đời và biểu đạt | Hai số, một từ ngày, một từ tên, trưởng thành là tổng | “Hợp” hay “mâu thuẫn” nếu chưa có bảng quan hệ |
| Đường đời và linh hồn | Cùng cách so hai số | Động cơ bên trong chắc chắn |
| Biểu đạt và nhân cách | Nguyên âm đã tách khỏi phụ âm | Người khác “thấy” bạn như thế nào, như một sự thật |
| Đường đời và trưởng thành | Tổng đã có | Mốc tuổi “sau 30 trưởng thành mới vào đời” của Decoz, nếu profile không ghi |
| Lưới và tên | Chưa có lưới tên | Tên đã bù khuyết điểm |
| Đỉnh và năm cá nhân | Cùng một ngày xem có cả hai số | Năm đó “kích” đỉnh |
| Đỉnh và thử thách | Cùng cửa sổ, tổng đối hiệu | Thử thách là bài học tiền kiếp của đỉnh |
| Số lặp trên lưới | Số lần đếm được | Số trội tạo tính cách |
| Master và gốc | Cả hai số đều hiện | Gốc mới là “bản thật” |

Bản tổng hợp phiên bản đầu nên là một trang sự kiện:

- Ngày và tên đã chuẩn hóa.
- Bảy số, hoặc bốn số nếu thiếu tên.
- Tuyến đủ và tuyến trống, chưa đặt tên tâm lý.
- Đỉnh đang active, tuổi, năm lịch, thử thách cùng giai đoạn.
- Năm, tháng, ngày cá nhân của ngày xem.
- Câu giới hạn đã có.

Chỉ khi một bảng quan hệ được viết và review thì mới thêm câu “hai số này được profile đọc cùng nhau theo quy tắc X”.

## Thứ tự viết, nếu làm nội dung

1. Không thêm bài. Đưa 102 bài hiện có ra khỏi details cho bảy chỉ số và ba chu kỳ, giữ nguyên chữ.
2. Trang tóm tắt sự kiện, không có tính từ tâm lý mới.
3. Cổng riêng cho lời đỉnh và thử thách. Thiếu nguồn thì để trống trên hình tháp.
4. Cổng riêng cho tên tuyến. Có thể là profile trình bày mới, không sửa `pythagorean-vn-v1` 1.2.0.
5. Sau đó mới xét bài dài hơn cho chỉ số lõi: thêm một ý kiểm được, không thêm đoạn đồng nghĩa.
6. Bài nối hai số chỉ sau bảng quan hệ.
7. Không viết nghề, tiền, sức khỏe, tương hợp, hay “bạn sẽ”.

Tiêu chí nhận một bài mới: gắn một chỉ số và một giá trị; khác bài của cùng số ở chỉ số khác; có giới hạn; không dùng số 33 để thế; không chép trang đối thủ; qua review biên tập mới; `expertVerified` vẫn false cho đến khi có chuyên gia thật.
