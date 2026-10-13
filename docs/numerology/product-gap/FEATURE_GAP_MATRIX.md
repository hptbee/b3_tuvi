# Ma trận khoảng trống

Ngày: 2026-10-13. SHA: `f709e42`.  
Mức B3 lấy từ [FULL_FEATURE_INVENTORY.md](FULL_FEATURE_INVENTORY.md). Bằng chứng đối thủ lấy từ [COMPETITOR_BENCHMARK.md](COMPETITOR_BENCHMARK.md).

Cột đối thủ ghi site và mức bằng chứng, không ghi là đã xem lá số của họ. Không có đối thủ nào `LIVE_RESULT_VERIFIED` trong phiên này.

Ưu tiên: `P0` trải nghiệm còn trống dù máy tính đã chạy; `P1` báo cáo đủ đọc; `P2` chỉ số thêm, cần profile mới; `P3` tùy chọn; `SKIP` không làm.

## Chỉ số cốt lõi

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Đường đời C01 | BASIC | Mọi trang đều chào | Decoz: số quan trọng nhất | VN `PUBLIC_PAGE` hoặc `MARKETING`; Decoz chart page `PUBLIC_PAGE` | Cao | P0 lời, không phải P0 phép tính | Giữ phép cộng toàn bộ chữ số. Đưa lời ra khỏi details. Không đổi sang phép Decoz (rút tháng/ngày/năm, giữ master). |
| Ngày sinh C02 | BASIC | somenh, quizvn có mục | Decoz có | cùng mức trên | Cao | P1 | Giữ. Viết rõ quan hệ với đường đời khi có quy tắc nối. |
| Thái độ C03 | BASIC | thansohoc online kể trong 8 số chính | Decoz kể Attitude | `PUBLIC_PAGE` | Trung bình | P1 | Giữ. Nói master không áp dụng cho chỉ số này. |
| Biểu đạt C04 | BASIC | “sứ mệnh” trên hầu hết site VN | Expression / Destiny | `PUBLIC_PAGE` | Cao | P0 trong tóm tắt | Giữ Pythagorean, Y là phụ âm. |
| Linh hồn C05 | BASIC | có | Soul Urge / Heart's Desire | `PUBLIC_PAGE` | Cao | P1 | Giữ. |
| Nhân cách C06 | BASIC | có | Personality | `PUBLIC_PAGE` | Cao | P1 | Giữ. |
| Trưởng thành C07 | BASIC | thansohoc online có | Decoz có, nói ảnh hưởng tăng sau khoảng 30 | Decoz `DOCUMENTATION` trên trang chart | Trung bình | P1 | Giữ phép cộng. Lời theo tuổi là nội dung mới, chưa có nguồn. |
| Master 11/22 C08 | BASIC | có bài riêng | Decoz giữ 11/22/33 | `PUBLIC_PAGE` | Cao | P1 | Giữ nhãn gốc. |
| Lời số 33 C09 | MISSING | somenh gắn nhãn 33/6 | Decoz kể 33 là master | somenh `PUBLIC_PAGE` khung bách khoa | Trung bình | giữ trống | Không thế bằng lời số 6. Chỉ viết khi có nguồn riêng. |
| Thiếu tên C11 | COMPLETE | quizvn nói tên đang dùng không vào phép chính | Decoz tách minor numbers | quizvn `PUBLIC_PAGE`; Decoz `PUBLIC_PAGE` | Cao | giữ | Không phá hành vi này. |
| Trace C12, dãy chữ C13 | BASIC | ít trang giải thích từng bước trên trang chủ | Decoz giải thích trên trang học | B3 `LIVE_RESULT` | Cao với người muốn kiểm tra | P1 | Để trace mở được ngay tại hình tháp và lưới, không chỉ trong details. |

## Chỉ số mở rộng

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Tư duy / Rational Thought E01 | MISSING | quizvn liệt kê | Decoz liệt kê | quizvn `PUBLIC_PAGE` danh sách; Decoz `PUBLIC_PAGE`; đầu ra `UNVERIFIED` | Trung bình | P2 | Profile mới. Không đoán công thức. |
| Balance E02 | MISSING | thansohoc online có “vượt khó”, không chắc cùng công thức | Decoz có Balance | `PUBLIC_PAGE` tên gọi; công thức VN `UNVERIFIED` | Trung bình | P2 | Không gán “vượt khó” của trang VN vào Balance. |
| Hidden Passion E03 | MISSING | không thấy tên này trên các trang VN đã đọc | Decoz có | Decoz `PUBLIC_PAGE` | Trung bình | P2 | Profile mới, đếm chữ tên. |
| Karmic Lessons E04 | MISSING | không tách bạch trên trang đã đọc | Decoz có | Decoz `PUBLIC_PAGE` | Trung bình | P2 | Khác với ô trống của lưới ngày sinh. Không trộn. |
| Nợ nghiệp E05 | MISSING | thansohoc online và quizvn chào | Decoz FAQ kể 13/14/16/19 | `PUBLIC_PAGE` / `MARKETING` | Dễ gây hiểu nhầm tiền kiếp | P2 hoặc SKIP | Nếu làm, chỉ khi profile nói rõ số kép trung gian. Không viết nghĩa tiền kiếp nếu nguồn không đủ. |
| Subconscious Self E06 | MISSING | không thấy | Decoz có, nằm trong “vòm” color chart | Decoz `PUBLIC_PAGE` mô tả bố cục | Thấp đến trung bình | P2 | Không ưu tiên trước tháp và lời đỉnh. |
| Cornerstone, Capstone, First Vowel E07–E09 | MISSING | không thấy trên trang đã đọc | Decoz có, tam giác trên color chart | Decoz `PUBLIC_PAGE` | Thấp | P2 | Gói sau, cùng profile tên. |
| Bridge E10 | MISSING | không thấy | Decoz kể hai bridge | Decoz `PUBLIC_PAGE` | Trung bình, vì là cầu nối có thật giữa hai số | P2 | Công thức hiệu số thì đơn giản; lời thì chưa có. Làm sau khi có quy tắc diễn giải. |
| Minor từ tên đang dùng E11 | MISSING | tracuuthansohoc có ô tên thường dùng; quizvn bảo tra lần hai | Decoz tính minor từ current name | form `PUBLIC_PAGE`; kết quả `UNVERIFIED` | Cao nếu người dùng có tên đang dùng | P2 | Hai lần tính với profile hiện tại đã làm được ở tầng thủ công. Chỉ số minor là profile mới. |
| Planes of Expression E12 | MISSING | không thấy | Decoz chia bốn nhóm chữ | Decoz `PUBLIC_PAGE` | Thấp | P2 | Không làm trong gói đầu. |

## Biểu đồ

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Lưới ngày sinh B01 | BASIC | somenh, bandothanso, quizvn, thansohoc online | Decoz không dùng Lo Shu làm lõi bài đọc trên các trang đã mở | VN `PUBLIC_PAGE`; mẫu bandothanso là hình trang chủ, không phải lá số đã tính | Cao | P0 lời | Giữ lưới 3-6-9. Không thêm chữ số đường đời vào ô. |
| Tần suất B02 | NUMBER_ONLY | somenh có mục tần suất | không phải trọng tâm Decoz | somenh `PUBLIC_PAGE` khung | Trung bình | P1 | Gắn câu hỏi khi một số lặp, chỉ sau khi có quy tắc. |
| Tám tuyến B03 | BASIC | tám mũi tên có tên trên thansohoc online; bài vietsohoc; quizvn liệt kê | không thấy trên ba trang Decoz đã đọc | thansohoc online `PUBLIC_PAGE` bảng tên; vietsohoc `DOCUMENTATION_ONLY` | Rất cao với người đọc VN | P0 nội dung, sau khi chọn lớp | Viết nghĩa như một lớp trình bày có version. Không sửa định nghĩa present/partial/absent. |
| Ô và mũi tên trống B04–B06 | MISSING | bài và FAQ bandothanso nói số thiếu không phải điểm xấu | không thấy | bandothanso FAQ `PUBLIC_PAGE` | Cao | P0 cùng B03 | Cùng nguồn với mũi tên. Cấm câu phán “thiếu năng lực”. |
| Biểu đồ tên B07–B08 | MISSING | thansohoc online nói mũi tên trên cả biểu đồ tên | không thấy lưới chữ kiểu Lo Shu trên Decoz | `MARKETING` / `PUBLIC_PAGE` mô tả | Cao | P1 | Quy ước riêng: chữ nào rơi vào ô nào. Không chép lưới đối thủ. |
| Lưới ghép B09–B10 | MISSING | thansohoc online nói biểu đồ tổng hợp; bandothanso nói tên đang bù vùng của ngày sinh | Decoz không ghép theo kiểu này trên trang đã đọc | `PUBLIC_PAGE` lời mô tả; đầu ra `UNVERIFIED` | Cao | P1 | Chỉ làm khi B07 đã định nghĩa. Tên “lấp” số là phép đếm, phải viết công thức trước. |
| Hai tên B11 | MISSING | ô tên thường dùng trên tracuuthansohoc | color chart tách hai tên | form `PUBLIC_PAGE` | Trung bình | P2 | Xem E11. |

## Đỉnh và thử thách

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Bốn giai đoạn P01, P06, P07 | BASIC | somenh và quizvn có mục tháp; thansohoc online mô tả bốn đỉnh | Decoz có bài và widget | B3 `LIVE_RESULT`; đối thủ `PUBLIC_PAGE` hoặc `DOCUMENTATION` | Cao | P0 hình | Giữ tuổi 36 − gốc, hai cửa sổ 9 năm, cửa sổ mở. |
| Kim tự tháp P02 | MISSING | được gọi tên trên ba site VN | Decoz nói chu kỳ, trang đã đọc không chứng minh một SVG tháp | VN `PUBLIC_PAGE` lời; không `LIVE_RESULT` | Rất cao | P0 | Vẽ từ dữ liệu sẵn. Ghi công thức cạnh hình. |
| Thành phần đáy P03 | DATA_ONLY | không thấy công thức đáy trên trang VN đã đọc | Decoz period = tháng/ngày/năm, giữ master | Decoz long-term `PUBLIC_PAGE` | Cao | P0 hình, không đổi số | Hiện components như “thành phần của profile này”, master tắt. Không gắn nhãn Period Cycle. |
| Lời đỉnh P04–P05 | MISSING | được hứa trong mô tả tháp | Decoz nói cơ hội, môi trường, nghề; không đủ điều kiện chép | `PINNACLE_CONTENT_STATUS.md`; Decoz `DOCUMENTATION_ONLY` | Rất cao | P0 nội dung, cổng riêng | Không bịa để lấp hình. |
| Số thử thách P08 | NUMBER_ONLY | somenh ghi “4 thách thức” | Decoz có bốn challenge | somenh khung `PUBLIC_PAGE`; Decoz chart `PUBLIC_PAGE` | Cao | P0 hình | Giữ hiệu tuyệt đối và số 0. |
| Lời thử thách P10 | MISSING | chưa xem bài của một số cụ thể | Decoz có lời, gồm cách đọc số 0 | không chép | Cao | P0 nội dung | Cùng cổng với lời đỉnh. |
| Hình thử thách P11 | MISSING | không thấy trục riêng trên trang đã fetch | không thấy biểu đồ riêng | `UNVERIFIED` hình đối thủ | Cao | P0 | Trục cùng cửa sổ với đỉnh, chú thích profile không dùng chồng lấn. |
| Thử thách chính P12 | NOT_APPLICABLE | không thấy | Decoz gọi challenge thứ ba là Main | Decoz chart page `PUBLIC_PAGE` | Dễ gây lệch profile | SKIP | Không thêm nhãn “chính” vào profile 1.2.0. |
| Chồng lấn P13 | BASIC | không thấy | Decoz nói thời lượng thử thách ước lượng và có chồng | đã ghi trong UI B3; nguồn Decoz từ audit trước, trang pinnacle lần này không đủ chi tiết thời lượng | Trung bình | giữ câu hiện có | Không đổi cửa sổ tuổi. |

## Chu kỳ

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Năm / tháng / ngày L01–L03 | BASIC | năm cá nhân rất phổ biến; tháng ít thấy trên trang chủ | Decoz có cả ba, cộng duality | B3 `LIVE_RESULT`; đối thủ `PUBLIC_PAGE` | Cao | P1 hình | Giữ lịch 01/01 và rút 1–9. |
| Chọn ngày L04 | BASIC | tracuuthansohoc có ô năm muốn xem | widget Decoz chọn bằng form | `PUBLIC_PAGE` | Trung bình | P1 | Giữ ô ngày. Thêm dải năm bên dưới. |
| Chín năm L05 | MISSING | quizvn nói chu kỳ 11 năm; somenh có mục Y1–Y9 trong bách khoa | Decoz personal year nằm trong forecast | quizvn `PUBLIC_PAGE` danh sách, đầu ra `UNVERIFIED` | Cao | P1 | Chín năm từ phép hiện có. Không đổi thành 11 năm nếu chưa có profile. |
| 12 tháng L06 | MISSING | bandothanso chào trong bản trả phí | Decoz personal month | bandothanso `PAYWALLED` cho bản đầy đủ; preview `UNVERIFIED` | Cao | P1 | Tính 12 tháng của năm đang xem. Nhịp suy ngẫm, không dự báo sự kiện. |
| Lịch ngày L07 | MISSING | không thấy lịch ngày trên trang đã đọc | Decoz kể Personal Day | Decoz `PUBLIC_PAGE` danh sách | Trung bình | P2 | Dễ rối trên mobile. Làm sau dải tháng. |
| Nhiều năm L08 | MISSING | không thấy | forecast “current and coming year” | Decoz `MARKETING` trên trang chart | Trung bình | P1 | Hai hoặc ba năm cạnh nhau là đủ cho gói đầu. |
| Period như chặng đời L09 | DATA_ONLY | không thấy ba chặng 30 năm trên site VN đã đọc | Decoz giải thích rõ | long-term page `PUBLIC_PAGE` | Cao nhưng dễ tính sai | P2 | Profile mới nếu muốn đúng Decoz. Không dán nhãn lên components. |
| Transit, Essence, Duality L10–L12 | MISSING | không thấy | Decoz liệt kê và mô tả vị trí trên color chart | `PUBLIC_PAGE` mô tả; widget `UNVERIFIED` | Trung bình | P2 | Phép mới. Không nằm trong gói hình đầu. |

## Diễn giải và báo cáo

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Bài ngắn I01–I02, I04 | BASIC | site VN có bài dài theo số; chưa xem bài gắn vào lá số thật | Decoz: bản miễn phí là mô tả ngắn, bản 55 trang là trả phí | độ dài B3 đo trên catalog; đối thủ `MARKETING` hoặc `DOCUMENTATION` | Nền | P1 | Giữ tính riêng từng chỉ số. Không thêm chữ cho đủ dài. |
| Mặt thuận / khó I03 | MISSING | somenh có khối “thử thách và vùng tối” trên khung | Decoz nói challenge là chỗ phải luyện | somenh khung `PUBLIC_PAGE`, nội dung số `UNVERIFIED` | Trung bình | P1 | Chỉ khi viết được từ chủ đề đã có, không bịa mặt tối. |
| Giới hạn I05 | COMPLETE | bandothanso và quizvn từ chối khoa học hóa; vài site VN thì khẳng định là khoa học | Decoz không được dùng để tuyên bố khoa học | B3 `LIVE_RESULT`; quizvn và bandothanso FAQ `PUBLIC_PAGE` | Cao | giữ | Đưa câu từ chối lên đầu kết quả, không chỉ footer. |
| Lời theo tuổi I06 | MISSING | không kiểm được | Decoz nói đỉnh đổi theo giai đoạn | `DOCUMENTATION_ONLY` | Cao | P0 nội dung | Phụ thuộc cổng lời đỉnh. |
| Nối chỉ số I07–I09 | MISSING | bandothanso nói đọc mô thức giữa ngày sinh và tên | Decoz nói các số hấp thu lẫn nhau trên color chart | `PUBLIC_PAGE` chủ trương; bài mẫu `PAYWALLED` hoặc `UNVERIFIED` | Rất cao | P1 | Chỉ viết quan hệ đã định nghĩa: cùng số, số master và gốc, tuyến đủ/thiếu, đỉnh đang active. |
| Tóm tắt lá I10, chương R01–R02 | MISSING | bandothanso khen phần tổng quan trong lời khách; chưa xem báo cáo | Decoz có thứ tự đọc gợi ý trên trang chart | thứ tự Decoz `PUBLIC_PAGE`; báo cáo VN `PAYWALLED` | Rất cao | P0 bản sự kiện, P1 bản lời | Bản đầu chỉ lặp lại số đã tính. |
| JSON / in / nhập R03–R05 | PARTIAL | PDF là sản phẩm trả phí ở vài site | không đối chiếu file của Decoz | B3 nút `LIVE_RESULT`; file JSON phiên này không tải lại | Trung bình | P1 sau khi có chương | Giữ cơ chế. Bản in sau này đi theo chương, không thêm trang trống. |
| Bài in R06 | MISSING | PDF dài là lời hứa | 55 trang là sản phẩm khác | `PAYWALLED` / `MARKETING` | Cao | P1 | Độ dài không phải mục tiêu. |

## Giao diện và hạng mục bỏ qua

| Feature | B3 | Việt Nam | Quốc tế | Bằng chứng | Giá trị | Ưu tiên | Đề nghị |
|---|---|---|---|---|---|---|---|
| Form U01 | COMPLETE | form phổ biến | form Decoz | B3 `LIVE_RESULT` | Nền | giữ | Không thêm giờ sinh hay giới tính. |
| Một cột mobile U03 | PARTIAL | bandothanso nói đọc điện thoại trong lời khách | không kiểm | B3 ảnh 390px `LIVE_RESULT` | Cao | P0 khi có tháp | Tháp phải đọc được trên một cột. |
| Thuật ngữ U05 | MISSING | bài vietsohoc giải thích rời | trang Decoz có bài theo số | `DOCUMENTATION_ONLY` | Trung bình | P1 | Mục lục thuật ngữ ngắn, viết mới. |
| Tương hợp O01 | MISSING | tracuuthansohoc có ô; vietsohoc có bài | numerology.com chào | `PUBLIC_PAGE` / `MARKETING` | Dễ thành điểm phần trăm giả | P3 SKIP cho V1 | Ngoài roadmap §2.3. |
| So hai lá O02 | MISSING | chưa thấy công cụ cạnh nhau | chưa thấy | `UNVERIFIED` | Trung bình | P3 | Chỉ khi lá một người đã đủ đọc. |
| Trẻ em / đặt tên O03 | MISSING | tracuuthansohoc 1–17 tuổi; thansohoc online chào đặt tên | không thấy trên trang Decoz đã mở | `PUBLIC_PAGE` form hoặc `MARKETING` | Nhạy cảm | SKIP | Không làm. |
| Lưu lịch sử O04 | NOT_APPLICABLE | quizvn dùng localStorage; somenh có hồ sơ | không kiểm | quizvn `PUBLIC_PAGE` | Tiện, trái privacy đã chốt | SKIP | Không lưu. |
| Nghề, tiền, bệnh O05 | NOT_APPLICABLE | nhiều lời chào | Decoz gắn biểu đạt với nghề trên trang học | `MARKETING` và `DOCUMENTATION` | Gây hiểu nhầm | SKIP | Không viết câu chắc chắn. |
| AI O06 | MISSING | không thấy trên các URL đã mở | không thấy | không | Dễ bịa lời nối | P3 | Chỉ sau khi có quan hệ đã định nghĩa. |
| Color / proportional O07 | MISSING | không thấy | Decoz mô tả cả hai | `PUBLIC_PAGE` mô tả công cụ; biểu đồ mẫu không được tính lại | Cao với người học Decoz | P3 | Không vẽ nếu chưa có trọng số công khai trong profile B3. |
| Thẻ ảnh O08 | MISSING | somenh có nút | không thấy | nút `PUBLIC_PAGE`, ảnh `UNVERIFIED` | Thấp | P3 | Không ưu tiên. |

## Chỗ B3 đang chắc hơn lời hứa của đối thủ

- Trace từng bước và profile có version nhìn thấy trên trang.
- Thiếu tên thì không ra số 0.
- Số 33 không bị đổi thành 6.
- Thử thách 0 được giữ và được nói là hợp lệ.
- Câu từ chối khoa học và chuyên gia nằm trong sản phẩm, không chỉ trong bài marketing.
- JSON tính lại từ đầu vào, không tin số đã xuất.

Những điểm này không bù cho việc chưa có tháp, chưa có lời đỉnh, chưa có nghĩa tuyến, và chưa có chương tổng.
