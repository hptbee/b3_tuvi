# Trải nghiệm lá số đề xuất

Ngày: 2026-10-13. SHA hiện tại: `f709e42`.  
Đây là giả thuyết bố cục, không phải đặc tả đã được duyệt để code. Phép tính profile 1.2.0 giữ nguyên.

Người mở trang cần trả lời được ba câu, không chỉ một câu:

1. Số của tôi là gì?
2. Phần này của lá số nghĩa là gì, và tính ra sao?
3. Nó nối với phần còn lại bằng quan hệ nào mà sản phẩm thực sự định nghĩa?

## Các chương

### 1. Mở đầu

Mục đích: nói ngày, tên đã chuẩn hóa, và năm số hoặc sự kiện nổi bật, trước khi có thẻ.

Thứ bậc: tên hoặc “theo ngày sinh”; ngày sinh; ngày xem; đường đời; đỉnh đang diễn ra và thử thách cùng giai đoạn; một tuyến đủ và một tuyến trống nếu có. Không có tính từ mới.

Hình: không bắt buộc. Một dòng “đang ở giai đoạn n” là đủ.

Chữ: chỉ sự kiện. Câu giới hạn đặt ở đây, không chờ footer.

Thao tác: nhảy tới chương. Mobile: khối này nằm trên kết quả, dưới form.

Phụ thuộc: không phụ thuộc catalog mới. Số đã có trên response.

Xong khi: một người không mở details vẫn đọc được đường đời, giai đoạn hiện tại và câu “không phải đánh giá khoa học”.

### 2. Chỉ số lõi

Mục đích: bảy thẻ, lời hiện có đọc được không cần săn.

Thứ bậc: nhóm từ ngày (đường đời, ngày sinh, thái độ) rồi nhóm từ tên (biểu đạt, linh hồn, nhân cách, trưởng thành). Thiếu tên thì nhóm tên giải thích vì sao trống.

Hình: sơ đồ hai cột nguồn, cạnh nối tới trưởng thành. Trace nằm ngay dưới số, đóng mở được.

Chữ: 102 bài hiện tại, không viết thêm trong gói đầu. Số 33 vẫn là câu từ chối.

Thao tác: mở trace. Không bắt mở lời mới thấy chữ.

Mobile: một cột, lời nằm dưới số của chính thẻ đó.

Phụ thuộc: không.

Xong khi: lời và trace của đường đời thấy được trong vùng nhìn đầu của chương, và ca không tên vẫn không hiện số 0.

### 3. Lưới ngày sinh và, sau này, lưới tên

Mục đích: thấy ô và tuyến như một hình, không như tám dòng trạng thái.

Thứ bậc: lưới ngày sinh; chú thích số 0 bị bỏ; danh sách tuyến; lớp tên mũi tên chỉ khi version nội dung đã có. Lưới tên và lưới ghép là chương con, ẩn cho đến khi có đặc tả đếm.

Hình: lưới 3×3 và nét tuyến theo trạng thái. Chưa có tên tâm lý trong gói đầu.

Chữ: câu giới hạn hiện có. Không thêm “điểm yếu”.

Thao tác: chọn một tuyến để tô ba ô.

Mobile: lưới giữ vuông; chú thích ở dưới.

Phụ thuộc: tên mũi tên và lưới tên cần quyết định nội dung. Nét tuyến thì không.

Xong khi: tuyến đủ và tuyến trống phân biệt được bằng hình và bằng chữ, trên 390px.

### 4. Tháp đỉnh

Mục đích: bốn đỉnh thành một hình đúng phép cộng.

Thứ bậc: hình tháp; dòng công thức; bốn bậc chi tiết có trace; nhãn master nếu có.

Hình: đúng [VISUALIZATION_GAP_REPORT.md](VISUALIZATION_GAP_REPORT.md) mục tháp. Đáy là components, master tắt, nhãn không phải Period Cycle.

Chữ: nếu chưa có bài đỉnh, ô chữ ghi “chưa có lời cho đỉnh này”, không để trống im lặng và không mượn lời đường đời.

Thao tác: chọn đỉnh đang active mặc định; chọn đỉnh khác để xem tuổi và năm.

Mobile: bốn bậc dọc, mỗi bậc ghi hai thành phần.

Phụ thuộc: không cần API mới. Cần không đổi `component-reduce-root-age-v1`.

Xong khi: nhìn hình trả lời được đỉnh nào đang diễn ra, tính từ cặp nào, và master có bị giữ ở tổng hay không.

### 5. Thử thách

Mục đích: không để thử thách là số phụ trên thẻ đỉnh.

Thứ bậc: một câu khác biệt tổng và hiệu; trục bốn đoạn; số 0; câu về cửa sổ tuổi của profile và về cách tài liệu khác ước lượng chồng lấn.

Hình: trục cùng cửa sổ với tháp.

Chữ: bài riêng khi có cổng. Trước đó giữ câu 0 hợp lệ.

Thao tác: chọn một giai đoạn thì tháp và trục cùng nhảy.

Mobile: bốn đoạn dọc.

Phụ thuộc: không đổi phép hiệu.

Xong khi: thử thách 0 vẫn hiện, và không có nhãn “thử thách chính”.

### 6. Chu kỳ

Mục đích: nhịp nhiều năm thay vì ba số của một ngày.

Thứ bậc: ngày đang xem; hàng chín năm; mười hai tháng của năm đó; ngày cá nhân của ngày đã chọn. Lịch từng ngày là lớp sau.

Hình: ô số, không đường xu hướng.

Chữ: bài năm/tháng/ngày đã có cho ô đang chọn. Các ô khác chỉ hiện số cho đến khi người dùng chọn.

Thao tác: chọn năm hoặc tháng cập nhật số và, nếu làm sản phẩm, gọi cùng API `targetDate`. Không tính công thức trên trình duyệt.

Mobile: lưới chín ô và lưới tháng xuống dòng.

Phụ thuộc: phép đã có. Có thể cần response trả sẵn dải năm/tháng để khỏi tính ở client. Đó là việc triển khai sau, không thuộc audit này.

Xong khi: đổi năm làm đổi năm cá nhân trên hình, và chữ trên trang vẫn nói đây không phải dự báo sự kiện.

### 7. Nối các phần

Mục đích: một chỗ nói quan hệ nào đã được định nghĩa.

Thứ bậc: danh sách sự kiện đã tính; các quan hệ được phép trong bảng của [INTERPRETATION_COVERAGE_REPORT.md](INTERPRETATION_COVERAGE_REPORT.md); chỗ chưa có quy tắc thì ghi “chưa diễn giải mối liên hệ này”.

Hình: không bắt buộc. Nếu vẽ, chỉ vẽ các cạnh có trong bảng.

Chữ: không có điểm phần trăm, không có “bạn là người…”.

Thao tác: mỗi sự kiện link ngược về chương nguồn.

Mobile: danh sách.

Phụ thuộc: bảng quan hệ phải được duyệt trước khi có câu diễn giải. Bản sự kiện thì không.

Xong khi: mọi câu trong chương trỏ được về một trường trên kết quả tính.

### 8. Chi tiết và nguồn

Mục đích: trace đầy đủ, profile, catalog version, giới hạn, thuật ngữ ngắn.

Thứ bậc: profile và version; cách rút số; cách xử lý tên; cửa sổ đỉnh; lý do 33 và đỉnh chưa có lời; liên kết nguồn cộng đồng đã ghim.

Hình: không.

Chữ: lấy từ đặc tả và câu đã công bố. Thuật ngữ viết mới, không chép bài đối thủ.

Thao tác: mở từng mục.

Mobile: cùng nội dung.

Phụ thuộc: không.

Xong khi: một người có thể đối chiếu số trên màn hình với quy ước mà không đọc mã nguồn.

### 9. Bản mang đi

Mục đích: in và JSON đi theo chương, không theo thứ tự thẻ cũ.

Thứ bậc: mở đầu, lõi, lưới, tháp, thử thách, chu kỳ, nguồn. JSON giữ schema đã có, thêm không bắt buộc cho đến khi có việc triển khai riêng.

Hình: tháp và trục phải còn nghĩa khi in một cột.

Chữ: tên chỉ in khi người dùng giữ ô “kèm họ tên”.

Thao tác: in, tải, nhập lại để tính lại. Không tài khoản.

Mobile: in theo trang dọc.

Phụ thuộc: chương 1–6 đã có thì bản in mới khác ảnh `print-named-1990-06-15.png`.

Xong khi: bản in không còn nav/form, có mục lục ngắn, và không thêm lời chưa review.

## Khung desktop

```
[form: ngày, tên, ngày xem]

Mở đầu
  sự kiện · giới hạn · nhảy chương

Chỉ số lõi
  từ ngày | từ tên
  lời hiện ngay · trace đóng mở

Lưới ngày sinh
  3×3 và nét tuyến

Tháp
  đáy components · bốn đỉnh · đỉnh active

Thử thách
  trục cùng cửa sổ tuổi

Chu kỳ
  9 năm · 12 tháng · ngày đã chọn

Những gì nối được
  chỉ sự kiện và quan hệ đã duyệt

Nguồn
In / JSON
```

## Khung mobile

Cùng thứ tự, một cột. Tháp thành bốn bậc. Lưới vẫn 3×3. Chương mở đầu dính dưới form để không phải cuộn qua hero trang trí mới thấy số của mình. Hero `3 9 6` không được đứng cạnh kết quả như thể đó là đường đời.

## Việc cố ý chưa đưa vào lộ trình đọc

Tương hợp, đặt tên trẻ, hồ sơ lưu trữ, AI dẫn chuyện, color chart, điểm nghề nghiệp. Chúng làm trang dài ra mà không trả lời ba câu ở trên bằng dữ liệu profile này.
