# P1.3A.1 — Đối chiếu nguồn cho 10 cách

Ngày đọc: 2026-10-12. HEAD lúc bắt đầu vẫn là `2ead661` cộng catalog P1.3A chưa commit. Không sửa `rulesV2.json`, `combinations.json`, SQLite, hay chữ trên UI.

## Hai vật không phải một ấn bản

| Vật | Nhận dạng | Đã đọc chữ cách cục? |
|---|---|---|
| PDF https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf | 277 trang. Bìa: “VÂN ĐẰNG THÁI THỨ LANG / TỬ VI ĐẨU SỐ TÂN BIÊN / SÀI GÒN - 1956”. Metadata: Adobe InDesign CC 2014, ngày tạo 2014-11-03. Không thấy tên nhà in trên bìa và lời nói đầu. | Có, mục 19 |
| Catalog EMIC 605898 | *Tử vi đẩu số tân biên : lập thành - luận đoán*, Vân Đằng Thái Thứ Lang. NXB Thời đại, Hà Nội, 2012, 427 trang. Bản lưu Thư viện Khoa học Tổng hợp TP.HCM, VV 3328/2012. | Không |

PDF là bản dựng lại bằng phần mềm, không phải ảnh chụp sách in. Bìa ghi 1956 không chứng minh file này là bản in năm đó. Bản thư viện 2012 dài hơn 150 trang. Không gộp hai vật.

Ấn bản in đã giám định: **0**.

## Đoạn đã thấy

Mười cách trong `docs/knowledge/pilotClaims.json`. Số trang in ở đầu trang PDF trùng số trang file ở các trang 229–232. Mục 19 là “Phân cục”.

Điều kiện chung của quý cục, mục 19.5 trang 233: cần tránh Tuần, Triệt, Sát tinh và Bại tinh, trừ ba mục 19.2.9, 19.2.16, 19.2.22. Mười cách pilot không nằm trong ba mục trừ đó. Rule v2 không mã hóa câu 19.5.

## Chín lời luận đã gắn cờ từ P1.3A

Chưa đối từng câu chữ trên UI với PDF. Không đưa câu đó ra thêm chỗ nào cho người dùng.

Trong cùng file, các đầu mục gần tên nhưng không phải cùng cách:

- “Nhật Nguyệt Tàng Hung” (19.3.4, trang 232) không phải “Nhật Nguyệt Tàng Huy”.
- “Lưỡng Trùng Hoa Cái” (19.3.7) chỉ sang mục 19.3.6, không phải “Lưỡng Trùng Thiên Mã”.
- “Mã Đầu Đới Kiếm” (19.2.19) không phải nhan đề repo “Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)”.

Mục 20.6 (trang 234) có câu truyền thống về tàn tật và bệnh. Đó là chữ trong file nghiên cứu, có điều kiện nhiều cung. Không phải kết luận y khoa và không được chép sang UI.

## Sẵn sàng schema pilot

**READY FOR P1.3B PILOT**

Mười claim có vị trí file, trạng thái công thức, và cờ ấn bản chưa xác thực. Đủ để thử bảng nguồn mà không coi 63 cách đã đúng thư. Chưa bắt đầu P1.3B. Chưa nạp SQLite.
