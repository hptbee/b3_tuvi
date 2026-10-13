# B3 Tử Vi — Gói nguồn nghiên cứu bổ sung cho 39 cách cục

> **Ngày nghiên cứu:** 13/10/2026  
 > **Phạm vi:** 39 cách cục đang `SOURCE_INACCESSIBLE` trong báo cáo Sprint 9B.  
 > **Mức khẳng định:** **source discovery / candidate only**, chưa phải `SOURCE_VERIFIED`, `AI_ACCEPTED` hoặc `MATCH`.  
> **Định dạng máy đọc:** [`B3_TUVI_SOURCE_DISCOVERY_39.json`](./B3_TUVI_SOURCE_DISCOVERY_39.json).

## Kết quả kiểm kê

- 39/39 cách cục được gắn ít nhất một đầu mối nghiên cứu hoặc ghi rõ chưa định vị được nguồn.
- Có hai nguồn chính có văn bản HTML: bản chép Hán văn trên Wikisource và loạt bài chi tiết của 星林學苑.
- Các trường hợp có tên gần giống nhưng công thức khác nhau đã được gắn `NAME_MISMATCH_REQUIRES_REVIEW` hoặc `RELATED_ONLY`.
- Không copy toàn văn tài liệu thương mại vào repository.

### Quy ước trạng thái

- `ORIGINAL_TEXT_LOCATED`: thấy cụm/câu có liên quan trực tiếp trong bản chép cổ thư; chưa chứng minh đủ điều kiện của cách cục hay đúng bản in.
- `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA`: có câu cổ thư liên quan và một trang giải thích hiện đại; không được xem là hai chứng cứ cùng xác minh một công thức.
- `MODERN_FORMULA_PAGE`: có bài web hiện đại nói về công thức, không phải nguồn cổ thư.
- `NAME_MISMATCH_REQUIRES_REVIEW`: có tên Hán hoặc thuật ngữ gần giống nhưng chưa đủ để xác định là đúng một cách.
- `RELATED_OR_ALIAS_REQUIRES_REVIEW` / `RELATED_ONLY`: có tư liệu về sao hoặc cấu trúc gần kề, chưa có định nghĩa cách đúng tên.
- `NO_EXACT_FORMULA_FOUND`: chưa tìm thấy công thức đáng tin gắn với đúng danh xưng.

## Năm nguồn nên nạp vào Source Registry

| Nguồn | URL | Phân loại |
|---|---|---|
| 紫微斗數全書 全覽 (Wikisource transcription) | [wikisource-zwds-quanshu-web](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | public-domain historical text transcription |
| 星林學苑 / 從星開始 紫微研究苑 — 格局解析 | [xinglin-combination-index](https://www.108s.tw/article/index/20/40) | modern interpretive articles |
| Iztro 格局 | [iztro-patterns](https://iztro.com/zh_TW/learn/pattern) | modern annotated material |
| 易德軒 紫微斗數格局分析 | [yidexuan-pattern-list](https://ziwei.yi958.com/zwds/5343/) | secondary compilation |
| Jollen 日月藏輝 | [jollen-riyue](https://www.jollen.tw/97-%E6%97%A5%E6%9C%88%E8%97%8F%E8%BC%9D.html) | modern analysis |

## Mapping đầy đủ 39 cách

| # | Cách cục B3 | Tên Hán / cụm tìm được | Trạng thái | Trang có thể mở |
|---:|---|---|---|---|
| 1 | Tử Phủ Vũ Tướng | 紫府武相 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://amlichvietnam.vn/kien-thuc/tu-vi/cach-tu-phu-vu-tuong) |
| 2 | Sát Phá Tham | 殺破狼 | `RELATED_OR_ALIAS_REQUIRES_REVIEW` | [Mở nguồn](https://fortunecloud.co/learn/san-he-school) |
| 3 | Dương Lương Xương Lộc | 陽梁昌祿 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/225) |
| 4 | Nhật Chiếu Lôi Môn | 日照雷門 / 日出扶桑 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://www.108s.tw/article/info/224) |
| 5 | Hỏa Tham | 火貪 / 貪火相逢 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://www.108s.tw/article/info/217) |
| 6 | Linh Tham | 鈴貪 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/217) |
| 7 | Thạch Trung Ẩn Ngọc | 石中隱玉 | `ORIGINAL_TEXT_LOCATED` | [Mở nguồn](https://www.108s.tw/article/info/227) |
| 8 | Tam Kỳ Gia Hội | 三奇嘉會 / 科權祿拱 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://www.108s.tw/article/info/257) |
| 9 | Song Lộc Triều Viên | 雙祿朝垣 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://ziweidoushu.com9.tw/pattern/34) |
| 10 | Hùng Tú Triều Viên | 雄宿朝垣 | `NAME_MISMATCH_REQUIRES_REVIEW` | [Mở nguồn](https://www.108s.tw/article/info/213) |
| 11 | Linh Xương Đà Vũ | 鈴昌陀武 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/205) |
| 12 | Hình Kỵ Giáp Ấn | 刑忌夾印 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/206) |
| 13 | Mệnh Lý Phùng Không | 命裡逢空 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/267) |
| 14 | Kình Đà Hiệp Kỵ | 羊陀夾忌 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/248) |
| 15 | Phong Lưu Thái Trượng | 風流綵杖 / 風流彩杖 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://www.108s.tw/article/info/220) |
| 16 | Nhật Nguyệt Tàng Huy | 日月藏輝 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.jollen.tw/97-%E6%97%A5%E6%9C%88%E8%97%8F%E8%BC%9D.html) |
| 17 | Bán Không Chiết Xỉ | 半天折翅 / 半空折翅 | `NAME_MISMATCH_REQUIRES_REVIEW` | [Mở nguồn](https://www.108s.tw/article/info/267) |
| 18 | Thiên Ất Củng Mệnh | 天乙拱命 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/262) |
| 19 | Văn Tinh Củng Mệnh | 文星拱命 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/254) |
| 20 | Thọ Tinh Nhập Miếu | 壽星入廟 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/236) |
| 21 | Anh Tinh Nhập Miếu | 英星入廟 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/208) |
| 22 | Tài Ấn Giao Trì | Chưa tìm được | `NO_EXACT_FORMULA_FOUND` | [Mở nguồn](https://ziwei.yi958.com/zwds/5343/) |
| 23 | Giáp Đệ Đăng Khoa | 甲第登科 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/259) |
| 24 | Đế Ngộ Hung Đồ | 帝遇凶徒 | `ORIGINAL_TEXT_LOCATED` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) |
| 25 | Nhật Nguyệt Tật Ách | 日月疾厄 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://m.gushiwen.cn/guwen/bookv_ffb4d5228ab7.aspx) |
| 26 | Khúc Ám Đồng Cung | Chưa tìm được | `NO_EXACT_FORMULA_FOUND` | [Mở nguồn](https://ziwei.yi958.com/zwds/5343/) |
| 27 | Thiên Cơ Tỵ Hợi | 巳亥天機守命 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://ziwei.yi958.com/zwds/5343/) |
| 28 | Cự Phùng Tứ Sát | 巨逢四煞 / 巨門四殺 | `ORIGINAL_TEXT_RELATED_AND_MODERN_FORMULA` | [Mở nguồn](https://ziwei.yi958.com/zwds/5343/) |
| 29 | Lộ Bàng Mai Thi | 路上埋屍 | `NAME_MISMATCH_REQUIRES_REVIEW` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) |
| 30 | Hoa Cái Cư Phu Thê | 華蓋在夫妻宮 | `RELATED_ONLY` | [Mở nguồn](https://tuvi.cohoc.net/hoa-cai-cung-phu-the-la-gi-luan-giai-y-nghia-khi-ket-hop-voi-cac-sao-nid-18579.html) |
| 31 | Lưỡng Trùng Thiên Mã | Chưa tìm được | `NO_EXACT_FORMULA_FOUND` | [Mở nguồn](https://www.108s.tw/article/index/20/40) |
| 32 | Cát Xứ Tàng Hung | 吉處藏凶 | `ORIGINAL_TEXT_LOCATED` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) |
| 33 | Chúng Thủy Triều Đông | 眾水朝東 | `ORIGINAL_TEXT_LOCATED` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) |
| 34 | Không Kiếp Giáp Mệnh | 空劫夾命 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/245) |
| 35 | Kình Đà Giáp Mệnh | 羊陀夾命 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/247) |
| 36 | Cơ Cự Đồng Lâm | 機巨同臨 | `MODERN_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/232) |
| 37 | Thủy Trừng Quế Ngạc | 水澄桂萼 | `ORIGINAL_TEXT_LOCATED` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) |
| 38 | Đồng Lương Tỵ Hợi | 天同/天梁在巳亥 | `RELATED_ONLY` | [Mở nguồn](https://www.108s.tw/article/info/430) |
| 39 | Mệnh VCD Đắc Tam Không | 命無正曜; 三空 | `NO_EXACT_FORMULA_FOUND` | [Mở nguồn](https://destiny.to/ubbthreads/topic/69716) |

## Ghi chú bắt buộc theo từng cách

1. **Tử Phủ Vũ Tướng** — **Mô tả cách cục trên trang**. Chưa có đối chiếu cổ thư cho nhóm bốn sao; không dùng lời phú tự xưng không dẫn bản. [Nguồn đối chiếu bổ sung](https://www.tuvi-pkb.com/tra-cuu/cach-cuc/cach-tu-phu-vu-tuong).
2. **Sát Phá Tham** — **星系 殺破狼, đoạn nói về nhóm sao**. Nguồn coi Sát Phá Tham là tinh hệ; không khẳng định đồng nghĩa một cách cục có điều kiện riêng. [Nguồn đối chiếu bổ sung](https://astroverse.com.tw/ziwei/patterns).
3. **Dương Lương Xương Lộc** — **★形成條件**. Bài đưa công thức Mệnh Mão đồng cung Dương/Lương/Văn Xương và Lộc; có thể khác rule rộng tam phương.
4. **Nhật Chiếu Lôi Môn** — **★形成條件; ★古書詩賦**. Bài modern yêu cầu Dương/Lương đồng cung Mão; cổ thư Định貴局 có 日出扶桑 với Dương ở Mão, không mặc nhiên cùng tất cả điều kiện. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽).
5. **Hỏa Tham** — **★形成條件; 《全書》卷一 定貴局 貪火相逢**. Có điều kiện riêng cho Hỏa Tham trong bài; cổ thư mô tả 貪火相逢. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽).
6. **Linh Tham** — **★形成條件**. Trang hiện đại tách Linh Tham; Iztro lưu ý tên này không được mô tả trực tiếp trong bản 全書 mà họ xét. [Nguồn đối chiếu bổ sung](https://iztro.com/zh_TW/learn/pattern).
7. **Thạch Trung Ẩn Ngọc** — **★形成條件; 全書卷三 巨門段**. Có đoạn cổ thư liên quan Cự Môn tại Tý/Ngọ; đánh giá điều kiện Lộc/Quyền/Khoa cẩn thận. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷三).
8. **Tam Kỳ Gia Hội** — **★形成條件; 全書卷一 增補太微賦**. Cổ thư nói 科權祿拱, cách gọi 三奇嘉會 thuộc hệ luận sau, phải kiểm sự tương đương. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽).
9. **Song Lộc Triều Viên** — **雙祿朝垣格**. Không tự đổi thành 雙祿交流: hai danh xưng/cách diễn đạt có phân biệt.
10. **Hùng Tú Triều Viên** — **★形成條件**. Nguồn có tên 雄宿 (Hùng Túc), catalog ghi Hùng Tú; cần xét typo/nhánh khác trước khi match.
11. **Linh Xương Đà Vũ** — **★形成條件**. Bài ghi Vũ Khúc, Linh, Văn Xương, Đà và vị trí; chú ý phân biệt nguyên cục vs hạn.
12. **Hình Kỵ Giáp Ấn** — **★形成條件**. Tác giả nói nhiều phái khác cách hiểu; có trường phái cho Thiên Tướng hóa Kỵ, không trộn vào default.
13. **Mệnh Lý Phùng Không** — **★形成條件**. Có đoạn mô tả Địa Không/Địa Kiếp tại Mệnh; không đánh đồng với Mệnh Vô Chính Diệu Đắc Tam Không.
14. **Kình Đà Hiệp Kỵ** — **★形成條件**. Bài hiện đại ghi Lộc Tồn bị Kình Đà giáp và thêm Hóa Kỵ; điều kiện tuỳ phái.
15. **Phong Lưu Thái Trượng** — **★形成條件; 全書卷一 太微賦**. Cổ thư có lời về 刑遇貪狼, danh xưng chữ Hán có dị bản 綵/彩; đối chiếu từ và vị trí. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽).
16. **Nhật Nguyệt Tàng Huy** — **97. 日月藏輝**. Các nguồn khác mô tả như 日月反背, có thể khác điều kiện; cần hai AI so sánh từng bản. [Nguồn đối chiếu bổ sung](https://andylifemap.com/ri-yue-fan-bei-ge/).
17. **Bán Không Chiết Xỉ** — **古書詩賦 trong 命裡逢空**. Catalog ghi Chiết Xỉ trong khi nguồn ghi 折翅 (Chiết Sí); KHÔNG tự quy về cùng rule. [Nguồn đối chiếu bổ sung](https://tsight.io/articles/4752831).
18. **Thiên Ất Củng Mệnh** — **★形成條件**. Trang ghi Thiên Khôi/Thiên Việt ở tam phương tứ chính; phân biệt 坐貴向貴.
19. **Văn Tinh Củng Mệnh** — **★形成條件**. Trang ghi Văn Xương/Văn Khúc trong tam phương tứ chính; không tự thay bằng 文星暗拱.
20. **Thọ Tinh Nhập Miếu** — **★形成條件**. Trang ghi Thiên Lương ở Tý/Ngọ và điều kiện bổ sung; là nhận định cổ truyền, không dự báo tuổi thọ thực.
21. **Anh Tinh Nhập Miếu** — **★形成條件**. Trang ghi Phá Quân tại Tý/Ngọ; có điều kiện bổ sung theo can/miếu/phá cách.
22. **Tài Ấn Giao Trì** — **Có các mục 財印夾祿 hoặc 財蔭夾印 (KHÔNG PHẢI同名)**. Chưa tìm thấy trang công thức với đúng tên; không thay nhầm Tài Ấn Giao Trì bằng Tài Ấn Giáp Lộc.
23. **Giáp Đệ Đăng Khoa** — **★形成條件**. Trang ghi Hóa Khoa ở Mệnh hội Hóa Quyền tam phương; danh xưng 甲第登庸 là dị danh trong nguồn.
24. **Đế Ngộ Hung Đồ** — **卷一 太微賦**. Có cụm tên trong cổ phú; đây là một mệnh đề thơ, chưa đương nhiên là executable combination.
25. **Nhật Nguyệt Tật Ách** — **卷三 日月段: 日月疾厄命宮空**. Có câu liên quan trong bản chép cổ văn và trang giảng giải; cần kiểm lại đúng định nghĩa rule. [Nguồn đối chiếu bổ sung](https://ziwei.yi958.com/zwds/5343/).
26. **Khúc Ám Đồng Cung** — **Research index**. Chưa thấy định nghĩa nguồn đáng tin với đúng tên; không suy rằng 文曲 + 巨門 là một cách đã chứng thư.
27. **Thiên Cơ Tỵ Hợi** — **格局分析: 巳亥天機守命格**. Trang thứ cấp có tên và điều kiện gặp sát, cần kiểm nguồn cổ thư.
28. **Cự Phùng Tứ Sát** — **格局分析: 巨逢四殺格; 全書卷三 巨門**. Có đoạn cổ thư 巨門四殺陷而凶, nhưng phải phân loại phạm vi và sao bắt buộc. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷三).
29. **Lộ Bàng Mai Thi** — **卷一 太微賦: 七殺廉貞同位; 卷三 七殺段**. Cổ thư dùng 路上埋屍 (Lộ Thượng Mai Thi), catalog ghi Lộ Bàng; cần kiểm dị danh.
30. **Hoa Cái Cư Phu Thê** — **Hoa Cái cung Phu Thê**. Có bài về vị trí Hoa Cái trong Phu Thê, chưa chứng minh đây là tên cách cục cổ thư.
31. **Lưỡng Trùng Thiên Mã** — **Research catalog**. Chưa định vị văn bản đủ căn cứ cho tên Lưỡng Trùng Thiên Mã.
32. **Cát Xứ Tàng Hung** — **卷一 太微賦 / 祿逢沖破**. Có câu cổ phú với đúng cụm; phải xem cùng câu để phân tích tiền đề.
33. **Chúng Thủy Triều Đông** — **卷一 太微賦 / 文耗居寅卯**. Có đoạn cổ thư đúng cụm, không tự giản lược thành công thức sao nếu chưa phân tích 文耗.
34. **Không Kiếp Giáp Mệnh** — **★形成條件**. Định nghĩa hai sao Không/Kiếp giáp Mệnh; không nhầm với Không Kiếp đồng Mệnh.
35. **Kình Đà Giáp Mệnh** — **★形成條件**. Kiểm điểm giáp cung theo Lộc Tồn và vị trí Kình/Đà trong trường phái đang dùng.
36. **Cơ Cự Đồng Lâm** — **★形成條件**. Nguồn có mục 機巨同臨; cổ thư còn có 巨機居卯 nhưng chưa đồng nhất điều kiện. [Nguồn đối chiếu bổ sung](https://zh.wikisource.org/zh-hant/紫微斗數全書/卷三).
37. **Thủy Trừng Quế Ngạc** — **卷一 太微賦 / 太陰居子**. Có câu cổ phú trực tiếp về Thái Âm tại Tý.
38. **Đồng Lương Tỵ Hợi** — **天梁坐巳/亥，對宮天同**. Nguồn nói về bố cục Thiên Lương ở Tỵ/Hợi xung Thiên Đồng, nhưng chưa xác định quy tắc đúng của tên Việt.
39. **Mệnh VCD Đắc Tam Không** — **Bàn về 命無正曜; không đủ chứng minh 三空**. Nguồn nói Mệnh vô chính diệu, không có định nghĩa Tam Không đủ căn cứ; không gán tự động.

## Quy trình sử dụng trong Cursor (không cần prompt dài)

1. Import JSON như **discovery candidates**, không ghi đè `combination-source-matrix.json` status.
2. Mỗi URL cần GET thành công, xác nhận title thực tế, quyền sử dụng và lưu URL/date/HTML revision nếu có.
3. Với cổ thư Wikisource, khóa title, `oldid`/revision, mục/đoạn Hán văn, văn bản thô và digest; ghi là digital transcription, **không** tự xác nhận bản in cổ.
4. Với bài hiện đại, lưu đúng authorship/site, trích đoạn ngắn theo quyền sử dụng và điều kiện nguồn nêu; KHÔNG ghi là nguồn sơ cấp.
5. Tách `source quote` khỏi `interpretation`, `formation`, `breaking` và `author commentary`. Nếu tên Hán sai khác chỉ tạo alias **candidate**.
6. Chạy Grok 4.7 High và GPT 5.6 Terra Medium độc lập trên đúng đoạn; validator replay, kiểm conditions và hash. Hai model đồng ý vẫn có thể cùng sai.
7. Cập nhật progress: `CANDIDATE_FOUND → PASSAGE_EXTRACTED → SOURCE_BOUND → DUAL_AI_REVIEWED → FORMULA_COMPARED`. Không được nhảy bước.
8. Chỉ đề xuất PR sửa runtime sau khi source/rule đủ điều kiện; tests green không biến thành source verification.

## Các ca đặc biệt cần phản biện kỹ

- **Bán Không Chiết Xỉ:** có thể là sai chính tả so với `半天折翅` (Bán Thiên Chiết Sí); **không tự đổi canonical name**.
- **Hùng Tú Triều Viên:** trang truy cập là `雄宿朝垣` (Hùng Túc Triều Viên); cần chứng minh trùng cách.
- **Lộ Bàng Mai Thi:** cổ thư `路上埋屍` (Lộ Thượng Mai Thi) có cụm liên quan, tên hiện tại khác.
- **Hình Kỵ Giáp Ấn:** 108s nêu nhiều dị bản, một số phái cho Thiên Tướng hóa Kỵ; không dùng cho default nếu không hợp bảng Tứ Hóa.
- **Song Lộc Triều Viên:** `雙祿朝垣` khác tên `雙祿交流`, cần giữ hai candidate.
- **Sát Phá Tham:** có thể là phân loại tinh hệ thay vì cách cục có điều kiện riêng.
- **Mệnh VCD Đắc Tam Không:** không áp công thức Mệnh VCD thông thường làm proxy cho Tam Không.

## Phạm vi và bản quyền

- Bản cổ thư trên Wikisource có thông báo public domain, nhưng vẫn phải xác thực riêng nguồn chữ/văn bản và điều kiện tái sử dụng nếu copy.
- Các trang của 星林學苑, Iztro và website hiện đại là nội dung có bản quyền của tác giả/website. Chỉ liên kết và ghi metadata, không sao chép trọn bài.
- Bản nghiên cứu này không đánh giá khả năng tiên đoán khoa học của Tử Vi.
