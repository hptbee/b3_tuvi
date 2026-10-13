# Kiểm kê sản phẩm Thần số học

Ngày kiểm: 2026-10-13.  
SHA đã kiểm: `f709e42d466cf974a07bbe318de75694cd5ca845` (`f709e42`, merge PR #20 vào `main`). `main` tại SHA này đã chứa các merge trước đó của PR #21 (nội dung 1.1.0), #22 (xuất/nhập/in) và #23 (giới hạn tần suất).  
Profile đang chạy: `pythagorean-vn-v1` `1.2.0`. Catalog: `1.1.0`, locale `vi-VN`.  
Phạm vi: trải nghiệm người dùng. Một số được tính ra không đồng nghĩa tính năng đã hoàn chỉnh.

## Cách xem sản phẩm

Ứng dụng chạy cục bộ: API `127.0.0.1:5000`, Vite `127.0.0.1:5173`, trang `/than-so-hoc`. Playwright Chromium chụp năm màn hình, lưu tại `screenshots/`:

| Tệp | Trường hợp | Khung |
|---|---|---|
| `desktop-named-1990-06-15.png` | Nguyễn Văn An, 15/6/1990 | 1440×900, cả trang |
| `mobile-named-1990-06-15.png` | cùng dữ liệu | 390×844 |
| `desktop-date-only-1990-06-15.png` | chỉ ngày 15/6/1990 | 1440×900 |
| `desktop-master33-1990-03-29.png` | 29/3/1990, đường đời 33 | 1440×900 |
| `print-named-1990-06-15.png` | Nguyễn Văn An, giả lập in | print media |

Ba trường hợp có tên, không tên và số chủ 33 đều render được. Ngày xem chu kỳ để trống nên dùng ngày tham chiếu 13/10/2026. Không bấm lại luồng nhập JSON trong phiên này; cơ chế nhập nằm trên SHA đã kiểm và được ghi `CODE_ON_SHA`, không phải ảnh chụp lần này.

Ảnh hero `3 9 6` là trang trí `aria-hidden`, không phải chỉ số của người dùng.

## Thang mức

Mỗi hạng mục được chấm riêng năm lớp: tính toán, hình, lời luận, ngữ cảnh, thao tác. Cột **Mức** là trải nghiệm người dùng, không phải độ đúng của phép tính.

| Mức | Ý nghĩa |
|---|---|
| `MISSING` | Chưa có trong sản phẩm. |
| `DATA_ONLY` | Đã tính hoặc có trong API, người dùng không thấy thành một ý. |
| `NUMBER_ONLY` | Thấy con số, chưa có hình hoặc lời đủ để hiểu. |
| `BASIC` | Có câu ngắn hoặc hình sơ khai. |
| `PARTIAL` | Dùng được, còn thiếu nội dung, hình hoặc tương tác quan trọng. |
| `COMPLETE` | Trọn một việc trong đúng phạm vi đã công bố. |
| `NOT_APPLICABLE` | Không thuộc profile hiện tại hoặc nằm ngoài phạm vi sản phẩm đã chốt. |

## Số lượng

9 nhóm, 90 hạng mục.

| Mức | Số hạng mục |
|---|---|
| `COMPLETE` | 3 |
| `PARTIAL` | 4 |
| `BASIC` | 27 |
| `NUMBER_ONLY` | 2 |
| `DATA_ONLY` | 2 |
| `MISSING` | 49 |
| `NOT_APPLICABLE` | 3 |

27 mục `BASIC` cộng 2 mục `NUMBER_ONLY` và 2 mục `DATA_ONLY` là phần máy đã có số nhưng người đọc vẫn thấy nông. 49 mục chưa có mặt trong trải nghiệm.

## 1. Chỉ số cốt lõi

Bảy chỉ số có trace, nhãn và — khi catalog cho phép — một đoạn lời trong `<details>`. Mặc định thẻ đóng, nên lần quét đầu chỉ thấy số lớn.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| C01 | Đường đời | đủ trong profile | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C02 | Ngày sinh | đủ | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C03 | Thái độ | đủ, không giữ master | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C04 | Biểu đạt | đủ khi có tên | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C05 | Linh hồn | đủ khi có tên | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C06 | Nhân cách | đủ khi có tên; Y là phụ âm | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C07 | Trưởng thành | lifePath + expression | số lớn | một đoạn | vai trò riêng | mở lời bằng tay | BASIC |
| C08 | Nhãn master 11/22 | giữ số | dòng “Số đặc biệt · Gốc” | chung với số đó | có gốc 1–9 | thấy ngay | BASIC |
| C09 | Lời cho số 33 | số 33 được giữ | nhãn master | cố ý không có | không thế bằng gốc 6 | một câu từ chối | MISSING |
| C10 | Câu báo chưa có lời cho 33 | không áp | không áp | một câu | nói rõ thiếu căn cứ | thấy ngay trên thẻ | BASIC |
| C11 | Không nhập tên | bốn chỉ số tên `unavailable` | thẻ trống có giải thích | không bịa số 0 | ngày sinh vẫn đủ | đã thấy trên ảnh date-only | COMPLETE |
| C12 | Trace rút gọn | từng bước | nằm trong details | không áp | đủ để đối chiếu | phải mở | BASIC |
| C13 | Dãy chữ → số của tên | có trong `nameAnalysis` | danh sách chữ/số, details đóng | không giải thích từng chữ | nói Đ→D, Y phụ âm | phải mở | BASIC |

Ảnh date-only: Biểu đạt, Linh hồn, Nhân cách, Trưởng thành hiện trạng thái chưa có tên. Ảnh 29/3/1990: Đường đời 33 và Ngày sinh 11 có dòng gốc. Lời 33 không được thay bằng lời của 6.

## 2. Chỉ số mở rộng

Các mục dưới đây có mặt trên trang tính biểu đồ của World Numerology và/hoặc trang công cụ QuizVN. Profile `pythagorean-vn-v1` không định nghĩa chúng. Thêm vào cần profile hoặc phụ lục mới, không sửa công thức 1.2.0.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| E01 | Rational Thought / Tư duy | không | không | không | trường phái khác | không | MISSING |
| E02 | Balance | không | không | không | trường phái khác | không | MISSING |
| E03 | Hidden Passion | không | không | không | đếm chữ tên | không | MISSING |
| E04 | Karmic Lessons | không | không | không | chữ thiếu trong tên | không | MISSING |
| E05 | Karmic Debt 13/14/16/19 | profile rút tiếp, không giữ nợ | không | không | Decoz giữ số kép trung gian | không | MISSING |
| E06 | Subconscious Self | không | không | không | trường phái khác | không | MISSING |
| E07 | Cornerstone | không | không | không | chữ đầu tên | không | MISSING |
| E08 | Capstone | không | không | không | chữ cuối tên | không | MISSING |
| E09 | First Vowel | không | không | không | nguyên âm đầu | không | MISSING |
| E10 | Bridge numbers | không | không | không | hiệu hai chỉ số | không | MISSING |
| E11 | Minor Expression / Soul / Personality | không có tên đang dùng | không | không | Decoz tách tên hiện tại | không | MISSING |
| E12 | Planes of Expression | không | không | không | bốn mặt chữ | không | MISSING |

## 3. Biểu đồ ngày sinh, tên và biểu đồ ghép

Lưới ngày sinh là bảng 3×3, hàng 3-6-9 / 2-5-8 / 1-4-7. Ô có số và ô trống khác màu. Tám tuyến chỉ có trạng thái đủ / một phần / không có. Dòng chữ trên trang: “Chưa diễn giải ý nghĩa mũi tên.”

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| B01 | Lưới ngày sinh | đếm DDMMYYYY, bỏ số 0 | bảng 3×3 | một câu giới hạn | không phán năng lực | thấy trên desktop và mobile | BASIC |
| B02 | Tần suất 1–9 | có counts | danh sách số lần | không | không nói số lặp nghĩa gì | đọc được | NUMBER_ONLY |
| B03 | Tám tuyến | present/partial/absent | danh sách | câu từ chối diễn giải | không gắn tên mũi tên | thấy được | BASIC |
| B04 | Nghĩa mũi tên đủ số | cố ý không suy | không | không | Lo Shu/VN là lớp khác | không | MISSING |
| B05 | Nghĩa mũi tên trống | cố ý không suy | không | không | cùng lớp trên | không | MISSING |
| B06 | Nghĩa từng ô | cố ý không suy | ô chỉ có số lần | không | bài marketing VN có bảng ô | không | MISSING |
| B07 | Biểu đồ tên dạng lưới | không | không | không | cần quy ước riêng | không | MISSING |
| B08 | Mũi tên trên biểu đồ tên | không | không | không | không trộn với lưới ngày | không | MISSING |
| B09 | Lưới ngày + tên | không | không | không | “tên lấp số thiếu” là quy ước VN | không | MISSING |
| B10 | Tên bù chữ số thiếu | không | không | không | phụ thuộc B09 | không | MISSING |
| B11 | Tên khai sinh đối chiếu tên đang dùng | một ô tên | không có hai lưới | không | QuizVN gợi ý tra cứu lần hai | không | MISSING |

C13 không phải B07. Dãy chữ/số là trace phép cộng, không phải biểu đồ tên.

## 4. Đỉnh cao và thử thách

API trả bốn giai đoạn: tuổi, ngày lịch, cờ đang diễn ra, đỉnh, thử thách, trace đỉnh, hai toán hạng của thử thách, và `components` tháng/ngày/năm đã rút gọn với master tắt. Giao diện là danh sách dọc. Không có kim tự tháp. `meaning` của đỉnh và thử thách là `null`, lý do `content_not_in_scope`.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| P01 | Bốn giai đoạn đỉnh | đúng profile 1.2.0 | danh sách, không phải tháp | không | có tuổi và ngày | thấy giai đoạn đang active | BASIC |
| P02 | Kim tự tháp bốn đỉnh | số đã có | không có hình tháp | không | đối thủ gọi là kim tự tháp | không | MISSING |
| P03 | Đáy tháp = tháng, ngày, năm | có trong `components` | không vẽ | không | master tắt, khác Decoz | người dùng không thấy | DATA_ONLY |
| P04 | Lời từng đỉnh | không xuất bản | không | null | catalog không có bài đỉnh | không | MISSING |
| P05 | Đỉnh trong ngữ cảnh chặng đời | tuổi đã có | không | không | cần lời theo giai đoạn, không chỉ theo số | không | MISSING |
| P06 | Đánh dấu đỉnh hiện tại | `active` | một dòng chữ | không | theo ngày xem | thấy trên ảnh | BASIC |
| P07 | Mốc lịch của từng giai đoạn | có start/end | chữ ngày trong thẻ | không | chưa phải trục thời gian | đọc được | BASIC |
| P08 | Bốn thử thách | hiệu tuyệt đối, 0 hợp lệ | chỉ là số cạnh đỉnh | không | ghép cùng cửa sổ tuổi của profile | thấy số và hai toán hạng | NUMBER_ONLY |
| P09 | Giải thích thử thách 0 | 0 không bị xoá | không | một câu quy ước | không biến 0 thành 9 | đọc trên mục | BASIC |
| P10 | Lời từng thử thách | không | không | null | Decoz có lời, không đủ điều kiện chép | không | MISSING |
| P11 | Trục thời gian thử thách riêng | cửa sổ đã có | không tách khỏi danh sách đỉnh | không | profile không dùng chồng lấn | không | MISSING |
| P12 | Thử thách chính là thử thách thứ ba | profile không định nghĩa | không | không | khái niệm Decoz | không áp vào profile này | NOT_APPLICABLE |
| P13 | Nói khác biệt chồng lấn | không đổi phép tính | không | một đoạn | `SOURCE_VARIANT` | đọc được | BASIC |

Ảnh named và master-33 đều hiện bốn thẻ “Giai đoạn”, mỗi thẻ có đỉnh và thử thách. Không có tam giác, không có nhãn tháng/ngày/năm ở chân tháp.

## 5. Chu kỳ đời

Năm, tháng, ngày cá nhân rút về 1–9 theo năm dương lịch. Ô “Ngày xem chu kỳ” chọn một ngày. Không có dải chín năm, mười hai tháng, lịch ngày, hay nhiều năm.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| L01 | Năm cá nhân | đủ, master tắt | một thẻ | một đoạn | một năm đang xem | mở lời bằng tay | BASIC |
| L02 | Tháng cá nhân | đủ | một thẻ | một đoạn | một tháng | mở lời bằng tay | BASIC |
| L03 | Ngày cá nhân | đủ | một thẻ | một đoạn | một ngày | mở lời bằng tay | BASIC |
| L04 | Chọn ngày xem | API `targetDate` | một ô date | gợi ý để trống = hôm nay | cũng chọn đỉnh đang active | có trên form | BASIC |
| L05 | Chu kỳ chín năm | công thức năm có thể lặp 9 lần | không | catalog có lời từng năm, không có hành trình | không | không | MISSING |
| L06 | Dải 12 tháng | công thức tháng có thể lặp | không | không | không | không | MISSING |
| L07 | Lịch ngày cá nhân | công thức ngày có thể lặp | không | không | không | không | MISSING |
| L08 | Nhìn nhiều năm | cùng công thức | không | không | không | không | MISSING |
| L09 | Period cycle như ba chặng nội tại | components không phải period Decoz | không trình bày | không | Decoz giữ master trên tháng/ngày/năm | không được gắn nhầm tên | DATA_ONLY |
| L10 | Transit | không | không | không | cần phép mới | không | MISSING |
| L11 | Essence | không | không | không | cần phép mới | không | MISSING |
| L12 | Duality (essence + năm) | không | không | không | phụ thuộc L11 | không | MISSING |

L05–L08 dùng lại phép đã có. L09–L12 không được suy từ `components` của profile này. Trang Decoz nói period cycle là tháng, ngày, năm sau khi rút gọn và **giữ** master. Profile B3 tắt master trước khi cộng đỉnh. Hai dãy số không hoán đổi cho nhau.

## 6. Diễn giải

Catalog 1.1.0: 11 chủ đề số (1–9, 11, 22), 10 ngữ cảnh, 102 bài. Độ dài bài: ngắn nhất 63 ký tự, trung vị 110, dài nhất 164, trung bình 108. Mỗi ngữ cảnh có opening, application và prompt riêng. Số 4 ở Đường đời khác số 4 ở Năm cá nhân. Không có mặt sáng/mặt khó, không có lời đổi theo tuổi, không có đoạn nối hai chỉ số.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| I01 | Bài ngắn theo chỉ số | không áp | không | 102 đoạn | đúng vai trò chỉ số | nằm trong details | BASIC |
| I02 | Cùng một số, khác chỉ số | không áp | không | có opening riêng | không dùng một bài cho mọi ô | phải mở từng thẻ | BASIC |
| I03 | Mặt thuận và mặt khó | không | không | không tách | đối thủ có “vùng tối” | không | MISSING |
| I04 | Câu hỏi tự suy ngẫm | không | không | một hoặc vài prompt | không phải dự báo | trong details | BASIC |
| I05 | Giới hạn và nguồn | không | không | footer, aside, details nguồn | experimental, không khoa học, không chuyên gia | thấy không cần mở lời | COMPLETE |
| I06 | Lời đổi theo chặng đời | tuổi đỉnh đã có | không | không | cùng số ở đỉnh 1 và đỉnh 4 chưa được tách | không | MISSING |
| I07 | Nối hai chỉ số | các số đã có | không | không | chưa có quan hệ đã định nghĩa | không | MISSING |
| I08 | Chỉ số nhìn bề ngoài mâu thuẫn | không | không | không | cần quy tắc nối, không bịa | không | MISSING |
| I09 | Số lặp / số trội | counts lưới đã có | không | không | chưa có quy tắc “trội” | không | MISSING |
| I10 | Tóm tắt cả lá số | mọi số đã tính | không | không có chương mở | người đọc phải tự ghép | không | MISSING |

I05 được chấm `COMPLETE` trong việc nó làm: nói rõ bản thử nghiệm, nguồn cộng đồng, không phải khoa học và không chuyên gia xác minh. Nó không biến 102 đoạn ngắn thành một bài đọc.

Năm review nội dung là review biên tập, không phải chuyên gia sách. Hai mã đã ghi: `bc-63fd3b46-7494-5598-a998-4825ce2e1ea8`, `bc-dc2cc9ca-0499-5214-bfc2-916a530b6aaa`. Năm sửa chữ sau review không được review lại. Chi tiết nằm ở `docs/numerology/reviews/CONTENT_1_1_REVIEW.md`.

## 7. Báo cáo

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| R01 | Chương tổng quan | số đã có | không | không | không có mục lục đọc | không | MISSING |
| R02 | Mục lục trong trang | không | không | không | một trang dài | không nhảy chương | MISSING |
| R03 | Tải JSON | schema xuất 1.0.0 | không phải bài đọc | kèm nghĩa nếu có | tuỳ chọn kèm tên | nút có trên trang; phiên này không tải lại file | PARTIAL |
| R04 | In | không đổi số | A4, ẩn nav/form/nút | vẫn là các thẻ | ảnh print xác nhận | in được, chưa thành báo cáo | PARTIAL |
| R05 | Nhập JSON để tính lại | máy tính lại, không tin số trong file | không | không | không lưu lịch sử | có nút; phiên này không bấm | PARTIAL |
| R06 | Bản in thành bài đọc | không | trang in vẫn là thẻ | không có chương | thiếu P02, I10 | không | MISSING |

## 8. Trang và cách đọc

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| U01 | Form ngày, tên, ngày xem | kiểm tra đầu vào | form rõ | gợi ý tên không bắt buộc | nói profile đang dùng | ba ca chụp đều ra kết quả | COMPLETE |
| U02 | Thứ tự trang | không | hero trang trí rồi form rồi thẻ | lời bị đóng | người mới không có lộ trình | cuộn một mạch | BASIC |
| U03 | Mobile | cùng dữ liệu | một cột, đọc được | cùng độ sâu | tháp không có nên không gãy | không có hình thích ứng | PARTIAL |
| U04 | Lần nhìn đầu chỉ thấy số | lời có sẵn | số chiếm thẻ | details đóng | dễ tưởng sản phẩm chỉ tính số | một lần bấm mới thấy chữ | BASIC |
| U05 | Bảng thuật ngữ | không | không | không | thuật ngữ Anh/Việt chưa được giải tại chỗ | không | MISSING |

U01 chấm `COMPLETE` cho việc thu thập đúng dữ liệu profile cho phép. Nó không chấm cho chất lượng bài đọc phía dưới.

## 9. Hạng mục tùy chọn

Roadmap A–Z §2.3 đã loại tài khoản, lịch sử sinh, tương hợp, đặt tên em bé, và dự báo sức khỏe/tài chính khỏi điều kiện xong V1. Bảng này ghi để khỏi bị coi là lỗ hổng bắt buộc.

| ID | Hạng mục | Tính | Hình | Lời | Ngữ cảnh | Thao tác | Mức |
|---|---|---|---|---|---|---|---|
| O01 | Tương hợp hai người | không | không | không | nhiều site VN chào bán | không nằm trong V1 | MISSING |
| O02 | So hai lá số cạnh nhau | không | không | không | hữu ích nếu làm sau, không phải lõi | không | MISSING |
| O03 | Thần số cho trẻ / đặt tên | không | không | không | trang VN có công cụ 1–17 tuổi | không khuyến nghị | MISSING |
| O04 | Lưu lịch sử ngày sinh | cố ý không lưu | không | không | privacy đã chốt | không làm | NOT_APPLICABLE |
| O05 | Báo cáo nghề, tiền, sức khỏe chắc chắn | không | không | chính sách cấm | đối thủ có mục này | không làm | NOT_APPLICABLE |
| O06 | Dẫn đọc bằng AI | tắt | không | không có dữ liệu nối | roadmap để tùy chọn | không | MISSING |
| O07 | Color chart / proportional chart | không | không | Decoz có hệ trọng số riêng | cần profile Decoz | không | MISSING |
| O08 | Thẻ ảnh chia sẻ | không | không | không | nút trên somenh, chưa xem ảnh xuất | không | MISSING |

## Việc tính đã xong, việc đọc thì chưa

Trong phạm vi profile 1.2.0, phép tính của bảy chỉ số, lưới ngày sinh, chu kỳ ngày-tháng-năm và bốn đỉnh/thử thách đã có trace. Đó là nền của một máy tính. Người mở `/than-so-hoc` vẫn nhận một danh sách thẻ: số lớn, lời một câu nằm sau nút, tám tuyến không tên, bốn giai đoạn không hình tháp, không chương tổng.

Ba mục `COMPLETE` là các việc hẹp đã làm tròn: thiếu tên thì không bịa chỉ số tên; trang nói rõ giới hạn; form nhận đúng ngày, tên và ngày xem.
