# Lộ trình hoàn thiện sản phẩm

Ngày: 2026-10-13. SHA xuất phát: `f709e42`.  
Không gắn ngày tháng. Mỗi giai đoạn là một gói phụ thuộc. Không triển khai trong audit này.

Nguyên tắc: thêm hình và chương trước khi thêm chỉ số. Không sửa `pythagorean-vn-v1` 1.2.0 để giống một trang khác. Không gọi nhiều mục là xong.

## P0 — Lá số nhìn được

Máy tính đã chạy. Thiếu hình và thiếu chỗ đọc tổng. Gói này chia hai, vì hình không được chờ chữ bịa.

### P0a. Hình từ dữ liệu sẵn

Gồm:

- Tháp bốn đỉnh, đáy là `components`, nhãn thành phần master tắt.
- Trục thử thách cùng cửa sổ tuổi, số 0 giữ nguyên, không nhãn thử thách chính.
- Nét tám tuyến trên lưới theo present / partial / absent.
- Khối mở đầu chỉ gồm sự kiện đã tính và câu giới hạn đã có.
- Trên mobile 390px và bản in, các hình còn đọc được.

Không gồm lời đỉnh, tên mũi tên, lưới tên, chỉ số mới.

Phụ thuộc: không có. API hiện đủ cho tháp, trục và nét tuyến. Dải chín năm không bắt buộc trong P0a; nếu đưa vào thì vẫn dùng phép chu kỳ cũ và không tính trên client.

Xong khi:

- Ca 15/6/1990 có tên, ca không tên, và ca 29/3/1990 đều hiện đúng số như trang hiện tại.
- Đỉnh active trùng ngày xem.
- Không có đường đời nào đổi so với fixture 1.2.0.
- Hình không gọi components là period cycle.
- Ô trống không bị màu “yếu”.

### P0b. Chữ cho đỉnh, thử thách và tuyến

Chặn bởi nguồn. `PINNACLE_CONTENT_STATUS.md` vẫn đúng sau audit này: chưa có bài đủ điều kiện.

Xong khi mỗi số được đăng có review biên tập riêng, giới hạn nguồn, và không chép Decoz hay bảng mũi tên đang có trên web. Nếu nguồn không đủ, hình P0a tiếp tục hiện câu “chưa có lời”. Đó là trạng thái đạt, không phải lỗi.

Tên tám tuyến, nếu làm, là version nội dung mới. Không sửa rule tuyến trong profile tính toán.

## P1 — Bài đọc có chương

Sau P0a. Một phần có thể song song với việc chờ nguồn P0b.

- Mở 102 bài hiện có ngay trên thẻ, không thêm chữ.
- Hàng chín năm và mười hai tháng, số thôi, cộng bài đã có khi chọn đúng ô.
- Lưới tên chỉ sau một đoạn đặc tả đếm chữ vào ô. Lưới ghép chỉ sau lưới tên, và chỉ nói “có trong tên / có trong ngày”.
- Chương “những gì nối được” bản sự kiện trước, bản diễn giải sau khi có bảng quan hệ đã duyệt.
- In và JSON đi theo chương. JSON không bắt đầu tin số lưu trong file.
- Thuật ngữ ngắn do B3 viết.

Xong khi một người đọc từ mở đầu tới nguồn mà không gặp câu tâm lý không trỏ về số đã tính, và bản in không còn là danh sách thẻ như `print-named-1990-06-15.png`.

## P2 — Profile khác, chỉ số khác

Chỉ khi P0a đã xong và có đặc tả riêng. Mỗi mục là một profile hoặc một capability version, không vá vào 1.2.0.

Ứng viên, theo giá trị đã chấm: tên đang dùng (minor numbers), bridge, hidden passion, karmic lessons, balance, rational thought, period cycle đúng kiểu giữ master. Karmic debt và planes đứng sau. Transit và essence đứng cuối nhóm này vì phụ thuộc cả một lớp chu kỳ.

Xong từng mục khi: công thức ghi trong đặc tả, fixture riêng, dị bản với 1.2.0 được nêu trên trang, lời không đi trước số.

## P3 — Không làm để coi là đủ

Tương hợp, so hai người, đặt tên trẻ, AI dẫn đọc, thẻ ảnh, color chart, proportional chart. Roadmap A–Z đã loại tương hợp, tên trẻ và dự báo chắc chắn khỏi điều kiện V1. Audit này không nâng chúng lên.

Lưu lịch sử ngày sinh và báo cáo nghề/tiền/sức khỏe ở mức không làm.

## Gói làm đầu tiên

P0a, cộng một việc chữ không cần nguồn mới: đưa câu giới hạn và tóm tắt sự kiện lên đầu kết quả, và mở sẵn bài catalog hiện có trên thẻ chỉ số lõi và chu kỳ.

Lý do gói này đứng trước:

- Hết dữ liệu đã tính, không đụng công thức.
- Khắc đúng chỗ các trang Việt Nam tạo cảm giác “có tháp, có biểu đồ” trong khi B3 mới có danh sách.
- Không trộn Lo Shu với Pythagorean.
- Không tạo 102 đoạn mới cho dài.
- Lời đỉnh có thể đến sau mà hình không nói dối.

Việc không nhét vào gói đầu: tên mũi tên, lưới tên, chín năm nếu chưa kịp kiểm mobile, mọi chỉ số E01–E12, mọi mục O01–O08.

## Rủi ro cần ghi trên PR triển khai sau này

- Sửa nhãn cho giống Decoz trong khi số components khác.
- Tô màu ô trống.
- Mượn lời đường đời cho đỉnh.
- Tính chín năm trên trình duyệt.
- Coi PDF dài của site khác là chuẩn độ sâu.
