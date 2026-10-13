# Ma trận xác minh công thức Thần Số Học

Ngày kiểm: 2026-10-13. Profile `pythagorean-vn-v1` `1.2.0`. Nhãn mô tả sự khớp với một quy ước đã nêu, không phải bằng chứng khoa học rằng thần số dự đoán tính cách hay sự kiện.

## Quy tắc chọn nhãn chính

1. `IMPLEMENTATION_BUG` nếu mã khác spec profile.
2. `NOT_IMPLEMENTED` nếu năng lực hoặc lời luận không có trong runtime.
3. `SOURCE_VARIANT` nếu một trang đã đọc trong đợt này cho ra số khác trên một ví dụ cụ thể.
4. `IMPLEMENTATION_CORRECT_FOR_PROFILE` nếu mã khớp spec và không có ví dụ đã đọc bị lệch số.
5. `SOURCE_NOT_VERIFIED` là bậc chứng cứ khi chưa đọc ấn bản sách. Nó chỉ thành nhãn chính khi profile cũng không chốt được phép tính.
6. `SPEC_AMBIGUOUS` khi chính văn profile không xác định được hàm số.

Cột “Ngoài profile” ghi thêm biến thể hoặc chỗ chưa đọc sách. Không gộp hai ý đó thành một nhãn rồi bỏ mất ý kia.

## Định nghĩa rút gọn dùng chung

Với số nguyên dương `n`, `digitSum(n)` là tổng các chữ số thập phân. `reduce(n, keepMasters)` lặp tổng chữ số. Nếu `keepMasters` và tổng là 11, 22 hoặc 33 thì dừng. Ngược lại tiếp tục tới một chữ số 1–9. `root(n)` luôn là chữ số 1–9, kể cả khi giá trị giữ master (11→2, 22→4, 33→6). Hàm rút gọn không nhận tổng nhỏ hơn 1, nên thử thách 0 không đi qua hàm này.

## Ma trận

| Chỉ số | Định nghĩa profile | Nhãn chính | Ngoài profile |
|---|---|---|---|
| Rút gọn | Như đoạn trên. Master chỉ khi cờ của chỉ số bật. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Sách chưa đọc. Decoz giữ 11/22/33 ở một số bước và bỏ ở chu kỳ cá nhân. |
| Đường đời | Tổng mọi chữ số của ngày, tháng, năm dương lịch, rồi `reduce(..., true)`. | `SOURCE_VARIANT` | Profile đúng với quyết định D03. Trang Decoz đã đọc coi cách cộng mọi chữ số là cách không dùng, và rút từng thành phần trước, có giữ master. Ví dụ 11/09/2000: profile ra 4; cách Decoz ra 22. |
| Ngày sinh | `reduce(ngày, true)`. Có thể ra 11 hoặc 22. Không ra 33. API còn giữ `originalDay`. | `SOURCE_VARIANT` | Profile khớp mã. Trang Decoz mô tả ngày sinh là chính ngày đó, xem cả dạng hai chữ số lẫn một chữ số. Giá trị công bố của ngày 15 trong profile là 6. |
| Thái độ | `digitSum(ngày)+digitSum(tháng)`, master tắt, ra 1–9. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Câu Decoz chỉ nói cộng tháng và ngày, không chốt master. Các ví dụ số thường gặp cùng gốc. Chưa đủ để gọi lệch số. Sách chưa đọc. |
| Bảng chữ | NFC/NFD, Đ→D, A–Z theo vị trí rút về 1–9: AJS 1 … IR 9. Nguyên âm AEIOU. Y luôn là phụ âm. | `SOURCE_VARIANT` | Bảng A–Z khớp cách “vị trí trong alphabet rồi rút gọn” trên trang Decoz. Y trên trang đó có thể là nguyên âm hoặc phụ âm. Profile cố định Y là phụ âm (D06). |
| Biểu đạt | Tổng giá trị mọi chữ của cả chuỗi đã chuẩn hóa, `reduce(..., true)`. Không rút từng từ rồi mới cộng. | `SOURCE_VARIANT` | Phép profile khớp mã. Decoz rút từng phần tên rồi cộng, có giữ master. Minh họa số: hai phần cùng tổng 38. Decoz 11+11=22. Tổng 76 của profile ra 13 rồi 4. |
| Linh hồn | Chỉ nguyên âm AEIOU, một lần tổng, có master. Y không vào tổng này. | `SOURCE_VARIANT` | Cùng độ lệch “rút từng phần tên” và độ lệch Y. |
| Nhân cách | Mọi chữ không thuộc AEIOU, gồm Y, một lần tổng, có master. | `SOURCE_VARIANT` | Cùng hai độ lệch trên. |
| Trưởng thành | `reduce(lifePath.value + expression.value, true)`. Dùng giá trị đã giữ master, không thay bằng gốc trước khi cộng. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Phép cộng khớp câu Decoz. Kết quả vẫn đổi nếu Đường đời hoặc Biểu đạt đổi theo trường phái khác. |
| Biểu đồ ngày sinh | Đếm chữ số 1–9 trong `DDMMYYYY`. Số 0 không có ô. Tám tuyến `123,456,789,147,258,369,159,357`. `present` khi đủ ba số, `absent` khi không có số nào, còn lại `partial`. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Spec và mã xác định hàm này. Các trang Decoz đã đọc không định nghĩa lưới này. Sách chưa đọc: `SOURCE_NOT_VERIFIED`. |
| Năm cá nhân | `digitSum(ngày sinh)+digitSum(tháng sinh)+digitSum(năm dương lịch đang xem)`, master tắt, ra 1–9. Cửa sổ 01/01–31/12. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Khớp trường lịch dương trên trang Decoz về kết quả 1–9, vì trang đó cũng không giữ 11 ở chu kỳ. Dạng cộng khác (Decoz cộng tháng/ngày chưa rút) cùng gốc số khi không dừng ở master. Trường “từ sinh nhật đến sinh nhật” chỉ mới thấy gián tiếp, chưa đọc ấn bản. |
| Tháng cá nhân | `personalYear.value + digitSum(tháng đang xem)`, master tắt. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Trang Decoz: cộng số tháng vào năm cá nhân rồi rút về một chữ số. Tháng 10 với năm cá nhân 1: cả hai về 2 nếu 11 không được giữ. |
| Ngày cá nhân | `personalMonth.value + digitSum(ngày đang xem)`, master tắt. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Trang Decoz cộng chính ngày lịch, ví dụ 7+31=38, rồi 11, rồi 2, và nói 11 không được coi là master ở chu kỳ. Profile dùng tổng chữ số của 31 là 4, rồi 7+4=11, rồi 2. Kết quả 1–9 trùng trên ví dụ đó. |
| Tuổi và 29/02 | Tuổi là số sinh nhật đã qua trên `targetDate`. Mặc định là ngày dân sự `Asia/Ho_Chi_Minh`. Năm không nhuận, gồm 1900 và 2100, kỷ niệm 29/02 vào 01/03. Năm 2000 là năm nhuận. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Quy ước lịch của profile. Trang Decoz không chốt 29/02 trong các trang đã đọc. |
| Thành phần đỉnh cao | Tháng, ngày, năm đều `reduce(..., false)` trước khi cộng. Tháng 11 thành 2. Ngày 22 thành 4. | `SOURCE_VARIANT` | Profile và fixture `components-do-not-keep-masters` đúng với nhau. Decoz giữ master ngay ở tháng/ngày trước khi cộng đỉnh. 22/11/1992: profile P1=6; cách Decoz P1=11+22=33. |
| Bốn đỉnh | P1=`reduce(M+D, true)`, P2=`reduce(D+Y, true)`, P3=`reduce(P1.value+P2.value, true)`, P4=`reduce(M+Y, true)`. | `SOURCE_VARIANT` | Thứ tự cộng khớp Decoz. Độ lệch nằm ở bước thành phần phía trên, không phải ở thứ tự P1–P4. Khi thành phần không phải master, ví dụ 15/05/1949, hai bên cùng P1=11, P2=11, P3=22, P4=1. |
| Bốn thử thách | C1=`abs(M-D)`, C2=`abs(D-Y)`, C3=`abs(C1-C2)`, C4=`abs(M-Y)`. Số 0 hợp lệ, không rút gọn. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Phép trừ và việc rút master trước khi trừ khớp trang thử thách Decoz. Vì profile đã rút master ở M/D/Y, các thử thách của 22/11/1992 trùng phép Decoz (2, 1, 1, 1) dù P1 thì không trùng. |
| Cửa sổ tuổi | `E=36-lifePath.rootValue`. Các đoạn `[0,E]`, `[E+1,E+9]`, `[E+10,E+18]`, `[E+19, mở)`. Đường đời 11 dùng gốc 2 nên E=34. | `IMPLEMENTATION_CORRECT_FOR_PROFILE` | Công thức tuổi đỉnh khớp trang Decoz đã đọc, kể cả việc đưa master về một chữ số trước khi trừ 36. Đây là trang web, chưa phải ấn bản sách. |
| Thời lượng thử thách | UI gắn mỗi thử thách vào đúng cửa sổ tuổi của đỉnh tương ứng. | `SOURCE_VARIANT` | Giá trị số khớp như hàng trên. Trang Decoz nói thời lượng thử thách chỉ là ước lượng và các giai đoạn chồng lên nhau, không dùng cùng mốc đóng của đỉnh. |
| Lời số 33 | Không có bài. Không thay bằng 6. | `NOT_IMPLEMENTED` | Đúng cổng nội dung. Chưa có nguồn đã đọc cho một bài 33 được phép đăng. |
| Lời đỉnh và thử thách | `meaning=null`, lý do `content_not_in_scope`. | `NOT_IMPLEMENTED` | Đúng phạm vi profile 1.2.0. Không chép lời dự báo từ trang Decoz. |

## Ví dụ tính tay, không lấy từ engine

Các số này được cộng bằng tay để so profile với trang đã đọc.

**11/09/2000, Đường đời**

- Mọi chữ số `1+1+0+9+2+0+0+0=13`, rồi `1+3=4`.
- Decoz: ngày 11 giữ nguyên, tháng 9, năm `2+0+0+0=2`. Tổng `11+9+2=22`.
- Fixture `method-divergence` kỳ vọng Đường đời 4. Đó là profile, không phải bug.

**15/10/1998, Đường đời**

- Profile: `1+0+1+5+1+9+9+8=34`, rồi `3+4=7`.
- Decoz trên trang đã đọc: tháng 10→1, ngày 15→6, năm 1998→27 rồi 9. Tổng `1+6+9=16`, rồi 7. Trang này gọi cách cộng mọi chữ số là không dùng, vì bỏ mất 16.
- Profile không lưu 16 như karmic debt. Chỉ số cuối cùng cùng là 7, nhưng đường đi khác.

**22/11/1992, đỉnh**

- Profile: tháng 11→2, ngày 22→4, năm 1992→3. P1=`2+4=6`. Fixture `components-do-not-keep-masters` kỳ vọng 6, 7, 4, 5 và thử thách 2, 1, 1, 1.
- Decoz: giữ 11 và 22. P1=`11+22=33`. P2=`22+3=25` rồi 7. P3 và P4 không được suy từ trang này cho riêng ngày này ngoài quy tắc cộng đã nêu.

**15/05/1949, đỉnh, không có master ở thành phần**

- Tháng 5, ngày 15→6, năm 1949→5.
- P1=11, P2=11, P3=22, P4=10→1. Khớp ví dụ trên trang Decoz và cũng khớp quy tắc profile.

**15/05/2026, năm cá nhân**

- Decoz: `5+15+2026=2046`, rồi 12, rồi 3.
- Profile: `digitSum(15)+digitSum(5)+digitSum(2026)=6+5+10=21`, rồi 3.
- Cùng kết quả 3. Không đủ để nói hai dạng cộng luôn khác nhau.

## Bug triển khai

Không có `IMPLEMENTATION_BUG` so với spec `1.2.0` và các fixture tay đang có. Lệch với Decoz là biến thể đã được profile chọn, chưa phải lỗi mã.

## Chưa được xác minh bằng ấn bản

Chưa đọc sách in hoặc file ấn bản của Hans Decoz, Javane, Bunker, Goodwin, hoặc sách được README kho cộng đồng nhắc tới. Mọi câu ở báo cáo nguồn là từ trang web lấy được trong đợt này, bậc `source_read`, `edition_verified=false`.
