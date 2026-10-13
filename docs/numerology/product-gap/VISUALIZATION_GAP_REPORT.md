# Khoảng trống hình

Ngày: 2026-10-13. SHA: `f709e42`.  
Ảnh hiện trạng: `screenshots/`. Không đề xuất phần trăm, thanh năng lượng, hay màu “mạnh/yếu” không có trong profile.

## Hiện trạng đã thấy

Desktop 1440px, Nguyễn Văn An 15/6/1990: bảy thẻ số, lưới 3×3, tám dòng trạng thái, ba thẻ chu kỳ, bốn thẻ giai đoạn xếp dọc. Mỗi thẻ giai đoạn có tuổi, ngày, đỉnh, thử thách và hai toán hạng. Một giai đoạn có dòng “Đang trong giai đoạn này”.

Mobile 390px: cùng các khối xếp một cột. Danh sách giai đoạn đọc được. Không có hình nào cần xoay ngang.

Không tên: bốn thẻ tên báo chưa có dữ liệu. Lưới và đỉnh vẫn hiện.

29/3/1990: Đường đời 33 và Ngày sinh 11 có dòng gốc. Đỉnh trên ca này không phải master, nên nhãn master của đỉnh chưa xuất hiện trong ảnh; code có cùng dòng nhãn khi `isMaster`.

In: nav, form và nút biến mất. Nội dung còn lại vẫn là các thẻ.

Hero `3 9 6` là trang trí, `aria-hidden`.

## Hình đang thiếu

### 1. Kim tự tháp bốn đỉnh

1. Hiện bốn đỉnh, đáy là ba thành phần, và cách các tổng nằm trên các cạnh.
2. Trả lời: đỉnh nào đang diễn ra, bắt đầu năm nào, tính từ đâu.
3. Dữ liệu sẵn: `periods[].pinnacle`, tuổi, ngày, `active`, `isMaster`, `components.month/day/year`.
4. Hình: một tháp bốn tầng, không phải minh họa tự do.
   - Đáy: ba ô Tháng, Ngày, Năm, đúng giá trị `components` (master tắt).
   - Tầng 1 đặt trên Tháng+Ngày. Tầng 2 trên Ngày+Năm. Tầng 4 trên Tháng+Năm. Tầng 3 đặt trên tầng 1 và tầng 2 vì P3 = P1+P2.
   - Mỗi đỉnh ghi số, tuổi bắt đầu–kết thúc, năm lịch. Đỉnh `active` có viền. Master ghi “số đặc biệt” và gốc, không đổi kích thước thành “mạnh hơn”.
5. Mobile: tháp thu thành một cột bốn bậc, mỗi bậc vẫn hiện hai thành phần tạo ra nó. Không bắt vuốt ngang.
6. Thay thế khi không nhìn hình: danh sách có thứ tự, đúng như hiện nay, thêm câu “tính từ thành phần nào”.
7. Đủ dữ liệu của profile 1.2.0. Không cần phép mới.
8. Rủi ro: gọi ba ô đáy là Period Cycle của Decoz. Trang https://www.worldnumerology.com/free-forecasts/long-term-numerology.html (`PUBLIC_PAGE_VERIFIED`) giữ master khi rút tháng, ngày, năm. B3 không giữ. Nhãn trên hình phải là “thành phần đỉnh, master tắt”.
9. Người dùng thấy vì sao có bốn số và đang đứng ở đâu. Đây là khoảng trống hình lớn nhất so với cách các trang Việt Nam gọi tên “kim tự tháp”.

### Trước và sau cho bốn đỉnh

Trước, đúng ảnh `desktop-named-1990-06-15.png`:

```
Đỉnh cao và thử thách
Giai đoạn 1    tuổi · ngày
  Đỉnh cao: n     Thử thách: n
Giai đoạn 2    …
Giai đoạn 3    …
Giai đoạn 4    …
```

Sau, cùng số, thêm hình. Ví dụ cấu trúc, không phải kết quả của Nguyễn Văn An:

```
                Đỉnh 3
             (P1 + P2)
            tuổi · năm
         Đỉnh 1     Đỉnh 2
        Tháng+Ngày  Ngày+Năm
                 Đỉnh 4
               Tháng+Năm
     [Tháng]    [Ngày]    [Năm]
     component  component component
```

Đỉnh đang diễn ra được đánh dấu. Dưới hình là một dòng công thức của profile: thành phần rút master tắt; tổng đỉnh giữ 11/22/33; đỉnh 3 không tạo ra 33 với cặp số của profile này. Cạnh đó, không thay thế hình, là bốn thử thách.

Hình sai cần tránh: một kim tự tháp đẹp mà bốn số không nối đúng cặp cộng; hoặc đáy ghi tháng lịch gốc (11) trong khi profile đã rút thành 2.

### 2. Trục thử thách

1. Bốn thử thách trên cùng các cửa sổ tuổi với đỉnh.
2. Trả lời: trong giai đoạn này thử thách là số nào, có phải 0 không, khác đỉnh chỗ nào.
3. `periods[].challenge.value`, `operands`, cùng tuổi và ngày của đỉnh, cờ `active`.
4. Một trục ngang bốn đoạn. Mỗi đoạn ghi số thử thách và hiệu `|a − b|`. Số 0 vẫn là một đoạn, không để trống. Đỉnh của cùng giai đoạn ghi nhỏ bên dưới để thấy cặp, không để thử thách trông như “nửa kia của đỉnh”.
5. Mobile: bốn đoạn xếp dọc, cùng thứ tự tuổi.
6. Bảng bốn dòng: giai đoạn, tuổi, thử thách, hai toán hạng.
7. Đủ dữ liệu.
8. Vẽ các đoạn chồng lên nhau sẽ đổi nghĩa profile. Trang Decoz mô tả thời lượng thử thách khác; UI hiện đã có một câu về việc đó. Hình mới phải lặp lại câu đó.
9. Tách “việc đang học” khỏi “bối cảnh giai đoạn” mà không bịa thêm số.

### 3. Lưới ngày sinh có chú thích tuyến

1. Các ô và tám tuyến đã tính.
2. Trả lời: tuyến nào đủ ba số, tuyến nào trống, ô nào không xuất hiện.
3. `birthGrid.counts`, `lines[].state`, `ignoredZeroCount`.
4. Giữ bảng 3×3. Vẽ tuyến đủ bằng một nét nối ba ô. Tuyến thiếu một phần dùng nét đứt. Tuyến trống không vẽ nét, chỉ liệt kê. Số lần nằm trong ô. Không tô “năng lượng”.
5. Mobile: lưới giữ 3×3. Danh sách tuyến ở dưới, bấm một tuyến thì chỉ tô ba ô đó.
6. Bảng đã có: số, số lần, trạng thái tuyến. Không chỉ dựa vào màu.
7. Đủ để vẽ trạng thái. Chưa đủ để ghi tên “kế hoạch / thực tế / …”. Tên đó là lớp chữ, xem mục 4.
8. Tô đỏ ô trống sẽ biến quy ước “không phán năng lực” thành hình phán năng lực.
9. Người đọc thấy mẫu hình thay vì tám dòng chữ.

### 4. Tên mũi tên

1. Không có số mới. Chỉ là nhãn cho tám `line.id` đã có.
2. Trả lời: tuyến này được một trường phái gọi là gì.
3. Bảng nhãn đã chọn và đã review. Chưa có trong catalog.
4. Nhãn đặt cạnh tuyến, sau khi người dùng mở “Tên gọi trong lớp trình bày …”. Mặc định vẫn là 123, 456, … như hiện nay.
5. Cùng tương tác với mục 3.
6. Văn bản đầy đủ trong danh sách.
7. Chưa đủ nội dung. Hình ở mục 3 không bị chặn bởi việc này.
8. Gắn tên Lo Shu vào profile 1.2.0 mà không tăng version nội dung sẽ trộn hai lớp. Bảng tên trên https://thansohoconline.com/ là `PUBLIC_PAGE_VERIFIED` cho việc họ đặt tên, không phải nguồn để chép lời.
9. Người đọc Việt Nam tìm thấy ngôn ngữ họ đã thấy ở nơi khác, với ranh giới nguồn rõ.

### 5. Biểu đồ tên

1. Các chữ của tên rơi vào ô 1–9 theo giá trị Pythagorean đã dùng.
2. Trả lời: tên lặp số nào, khác lưới ngày sinh chỗ nào.
3. `nameAnalysis.letters` đã có giá trị từng chữ. Chưa có quy tắc “một chữ một ô” hay “đếm rồi mới vẽ mũi tên”. Cần một đoạn đặc tả trước khi vẽ.
4. Lưới thứ hai, cùng bố cục 3-6-9, tiêu đề “Từ tên”. Không cộng vào lưới ngày sinh.
5. Xếp dưới lưới ngày sinh.
6. Bảng chữ, giá trị, số lần.
7. Thiếu đặc tả đếm. Dãy chữ hiện tại chỉ đủ cho một danh sách, chưa đủ cho mũi tên tên.
8. Dùng cùng tâm lý mũi tên của ngày sinh cho tên là một quyết định riêng. Không làm im lặng trong lúc vẽ.
9. Thấy tên là một lớp số khác ngày sinh.

### 6. Lưới ghép

1. Hợp đếm của ngày sinh và của tên, nếu mục 5 đã định nghĩa phép đếm.
2. Trả lời: số nào chỉ có trong tên, số nào chỉ có trong ngày, số nào cả hai.
3. Hai bảng đếm. Chưa có.
4. Một lưới, mỗi ô có hai ký hiệu (ngày / tên), không trộn thành một màu duy nhất.
5. Chú giải cố định trên ô. Mobile dùng hai hàng ký hiệu trong ô thay vì màu đơn.
6. Bảng ba cột: số, lần trong ngày, lần trong tên.
7. Chưa đủ, phụ thuộc mục 5.
8. Nói “tên đã chữa ô trống” là một kết luận. Hình chỉ được nói “tên có chữ số mà ngày sinh không có”.
9. Cao, sau khi phép đếm tồn tại. Không nằm trong gói hình đầu.

### 7. Chín năm và mười hai tháng

1. Năm cá nhân của chín năm quanh năm đang xem; mười hai tháng của năm đó.
2. Trả lời: năm này nằm ở đâu trong nhịp 1–9, tháng nào cùng số với năm.
3. Phép `calendar-year-v1` lặp lại. Không có mảng sẵn trong response; có thể tính từ cùng hàm khi làm sản phẩm. Audit này không thêm API.
4. Một hàng chín ô năm, ô hiện tại viền đậm. Bên dưới, mười hai ô tháng. Số trong ô, không có biểu đồ đường giả lập xu hướng.
5. Chín ô xuống hàng; tháng xếp 3×4 hoặc danh sách.
6. Bảng năm và bảng tháng.
7. Đủ công thức. Chưa có mảng trong payload hiện tại.
8. Vẽ thành đường tăng/giảm sẽ ngụ ý năm sau “cao hơn” năm trước. Các số 1–9 không phải thang đo.
9. Biến ba thẻ của một ngày thành nhịp nhìn được. Đây là hình lời nhất trong số các hình chỉ cần phép cũ.

### 8. Sơ đồ quan hệ giữa chỉ số lõi

1. Bảy số và các quan hệ đã định nghĩa: trưởng thành = đường đời + biểu đạt; gốc của master; tên thiếu thì bốn ô không có.
2. Trả lời: số nào từ ngày, số nào từ tên, số nào là tổng của hai số kia.
3. `metrics` hiện có.
4. Hai cột “từ ngày” và “từ tên”, một cạnh nối tới trưởng thành. Không có mũi tên tâm lý.
5. Hai cột xếp dọc.
6. Bảng nguồn của từng số.
7. Đủ.
8. Nối mọi số với mọi số sẽ giả vờ đã có lý thuyết tổng hợp.
9. Trung bình. Hữu ích ở chương mở đầu, không thay lời.

### 9. Những hình không vẽ

| Hình | Lý do |
|---|---|
| Thanh phần trăm tương hợp | Không có công thức, dễ thành điểm giả. |
| Biểu đồ tỷ trọng kiểu Decoz | Trang chart nói dùng khoảng mười chín yếu tố và trọng số riêng, master bị rút trên đồ thị. Profile B3 không có trọng số đó. |
| Color chart một trang của Decoz | Bố cục gắn với period, transit, essence. B3 chưa tính các chu kỳ đó. |
| Nhiệt ô “yếu” | Trái câu đang in trên lưới. |
| Đường dự báo sự kiện | Chu kỳ B3 là nhịp lịch, không phải sự kiện. |

## Gói hình có thể làm trước lời mới

Chỉ bốn hình dùng dữ liệu và câu chữ đã có:

1. Tháp bốn đỉnh với đáy là components, nhãn đúng profile.
2. Trục bốn thử thách cùng cửa sổ tuổi, số 0 giữ nguyên.
3. Nét tuyến trên lưới ngày sinh theo present/partial/absent, chưa có tên tâm lý.
4. Hàng chín năm và mười hai tháng, tính bằng phép chu kỳ hiện có, trình bày như lịch suy ngẫm.

Bốn hình này không cần catalog mới. Lời đỉnh, tên mũi tên và lưới tên vẫn là việc nội dung riêng.
