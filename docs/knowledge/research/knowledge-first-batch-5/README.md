# Batch 5 — Hoàn thiện ngữ cảnh Thiên Cơ, không hợp nhất phương pháp

Nghiên cứu ngày **2026-10-17**. Đã fetch `origin/main`, xác nhận **PR #67 merge** lúc `2026-10-17T11:10:44Z`; tạo nhánh `codex/knowledge-research-batch-5` từ **`0bb82f99a717ba092fe66375f8a7f7dde6824d6f`**. Đếm lại record/cell từ file đã commit xác nhận nền **37 record, 31/168 ô ngữ cảnh, 137 ô còn ở locator và 10 disposition mở**. Không ghi đè Batch 1–4 hoặc chạy AutoDev.

## Tri thức thực sự được lưu

[11 record mới](knowledge-records.json), liên kết với [dossier](DOSSIER.md), [comparisons](comparisons.json), [evidence](evidence.json) và [dispositions](dispositions.json):

- **Ba ô Cơ còn thiếu:** Phụ Mẫu, Tử Tức, Tật Ách. Cả ba có entry độc lập trong corpus đã đọc; Lương/Tật chỉ xuất hiện làm cohost, không được sáng tác entry Lương riêng. Giữ nguyên lời dẫn Nhật/Nguyệt/ngày-đêm của Phụ, bản cung/đối cung/tam phương của Tử, và tầng Mệnh thủ-chiếu trước Tật.
- **Bốn ô Tử Vi/Thiên Lương:** Vi/Tài giữ Sát đồng **cộng thêm cát**, Vi/Di giữ căng thẳng nhánh Phá; Lương/Phu giữ tuổi/chủ thể lịch sử cùng qualifier trợ/sát; Lương/Di lưu qualifier trong entry đối ứng. Đây là nhóm có giá trị điều kiện, không chọn chỉ để tăng ô.
- **Hai supplement collation:** Cơ/Mệnh và Cơ/Quan được đối chiếu với Wikisource revision `1963110`, cùng family Quanshu. Liên kết record Batch 4, giữ trạng thái nghiên cứu CONTEXT_MAPPED cho phần mới; không dùng mirror để cấp COMPARED độc lập hoặc thêm ô mới.
- **Hai record phương pháp theo nguồn:** Q3 giữ thứ tự xét, phá/cứu cách và các nhánh định tính; V giữ phân cách theo bộ/sáng/trợ và phạm vi cung. Ngoại lệ trợ tinh của 令东来 được đối chiếu có giới hạn, không ghi đè record phương pháp Batch 4.

Thiên Cơ hiện có contextual record ở **12/12 cung** trong chuỗi này. Đây là đủ vị trí để tiếp tục đào sâu, không phải hoàn tất tri thức của sao, xác nhận nguyên bản hay có mười hai rule dùng được.

## Nguồn thực sự đã đọc và quyền lưu

**Quanshu, witness iztro đã lưu**: đọc trọn các mục **Phu Thê576–599, Tử600–632, Tài633–662, Tật663–686, Di687–711, Phụ817–846**, kèm block Cơ146–162, mục Quan737–764 và **Juan3 談星要論48–66**. Locator/hash từng span nằm trong record. Các mục Phu/Tài/Di không có lời dẫn tổng riêng trước entry đầu; không mượn lời dẫn của ba cung kia. Chỉ đây là các phạm vi đọc, không đọc mới toàn bộ sách hoặc bản in gốc.

**[Hàm Số, attribution Nguyễn Phát Lộc](https://tuvi.xemtuong.net/show.php?id=tu_vi_ham_so)**: mục B) Cách460–532; toàn mục Cơ2154–2365, trong đó bệnh lý nói rõ cung Tật; các mục Lương/Phu–Di2637–2682 và Vi/Di–Tài3154–3174. Các lời dẫn Thái Thứ Lang hoặc “có sách” trong witness không phải sách khác đã được đọc; bản in/borrowing chưa xác thực. Chỉ lưu locator và ghi chú phân tích ngắn, không sao chép toàn chương.

**[令东来, bài Cơ169](https://www.xuanmen.com.cn/archives/169.html)**: đọc credit và body có các đoạn Phụ/Tử/Tật, trợ tinh, cohost và cung nhận trợ. Web reader lỗi; DNS shell hạn chế lỗi; HTTPS bình thường ngoài sandbox thành công200. Hash HTML lần này khác Batch 4 do trang động, không chứng minh nội dung sách đã đổi. Chỉ lưu identity quan sát và phân tích ngắn; không giữ HTML/body. Tác giả tự nhận trích sách; edition/năm/trang và license tái sử dụng chưa rõ.

**[Wikisource Juan2](https://zh.wikisource.org/wiki/紫微斗數全書/卷二)**: block Cơ705–726, trọn Quan1483–1531, các entry/preamble liên quan, và footer1625–1629 xác nhận revision `1963110`. Bản đọc dạng script conversion không phải dị bản in độc lập. Footer nêu CC BY-SA4.0 kèm khả năng điều khoản bổ sung; packet chỉ giữ reference/phân tích, không nhập bản chép đầy đủ.

Vẫn **ba family đã biết**: truyền bản Quanshu, Hàm Số theo attribution, bình giải 令东来. Wikisource không làm tăng số family. Không có học phái, original edition, expert verification hay quyền corpus mới được xác nhận. Các lời bệnh, số con, giới, hôn nhân, tài sản và quan chế chỉ là lịch sử diễn giải, không là y học hoặc lời khuyên cá nhân.

## So sánh, khác biệt và blocker

Đã lưu **12 observation đối chiếu tác giả** và **2 collation cùng family**, phân biệt bằng `kind`. So sánh gồm phạm vi khớp một phần và căng thẳng, không đồng nghĩa đồng thuận hoặc source review.

- Wikisource cũng giữ chữ khó Cơ/Quan và bảng sáng của Q. Điều này ngăn dùng giả định “chỉ một bản số có chữ ấy” để sửa; chưa chọn được chữ/bảng đúng.
- Cơ–Lương/Tử ghi chi khác block Mệnh. Bệnh lý Cơ của V dùng “Cự Lương”. Vi/Di có căng thẳng sắc thái Phá giữa Q/V. Cả ba được lưu nguyên phạm vi, không sửa hay hòa giải bằng điều kiện tự thêm.
- Ví dụ trợ tinh của V ở Nô/Phu Thê khác đầy đủ tiền đề Mệnh/Phụ của Ling. Các lời có thể cùng tồn tại dưới khác cung/cohost, chưa chứng minh ưu tiên xuyên tác giả.
- Q3 có phân hạng và ngoại lệ định tính; V có hệ phân cách riêng. Nguồn chưa cho phép công thức chấm điểm chung, bảng ưu tiên hoàn chỉnh hay chuyển thẳng thành rule deterministic.

**Mười disposition cũ giữ nguyên ID, nội dung, trạng thái và next action**, thêm quan sát Batch 5. Có **bốn câu hỏi mới**, tổng **14 mở; 0 RESOLVED_WITH_EVIDENCE**. Nhãn SOURCE_VARIANT/INTERPRETATION_DIFFERENCE mô tả tình trạng nghiên cứu, không đóng vấn đề. Follow-up Phủ/Nô vẫn thiếu gloss bản in cho 天家; Âm/Huynh không có witness mới xác nhận số lượng.

Một route catalog/preview mới trên Google Play và trang có gợi ý sửa Cơ/Quan trả lỗi reader; chưa đọc được target page/edition. Search snippet không được dùng làm chứng cứ sửa chữ. Không lặp lại route scan Nhật, RAR hoặc PDF cũ khi không có đường mới. Bước tiếp là trang in có định danh và đúng mục, không thêm mirror để bỏ phiếu.

## Chỉ số có thể tái tính

[Index tích lũy](../KNOWLEDGE_RECORD_INDEX.json): **37 → 48 record**, **31 → 38/168 ô ngữ cảnh (22,62%)**, còn **130 ô** chỉ ở mức locator. Bảy ô mới khác hai supplement và hai record phương pháp ngoài mẫu số168. Có 44 record sao/cung trên38ô và4 record ngoài ô.

Ô có so sánh tác giả thực hiện, gồm partial/disputed: **31 → 38**. Ô có CONFLICTING: **5 → 7**; ô có flag nghi vấn: **12**. Bốn câu hỏi mới gồm một phương pháp ngoài ô, nên số disposition không phải số ô conflict. Tử Vi/Thiên Lương còn **9/24 ô** chưa có contextual record trong chuỗi này; các ô có record cũng chưa hoàn tất mọi nhánh.

Không đo lại chart applicability, prediction accuracy hay production readiness. **Source-review mới: 0; runtime approval mới: 0; public-release permission không đổi, đóng.** T034 vẫn chưa duyệt; T030–T038, Formula V1, app và quyết định lịch sử không sửa.

## Kiểm tra và công cụ hiện hành

Giữ nguyên toàn bộ helper/validator Batch 1–4 để bảo toàn snapshot. [refresh-index.mjs](refresh-index.mjs) Batch 5 dùng cách đọc danh sách file rõ ràng như trước; index có `refreshToolRef` chỉ tới helper hiện hành. Helper cũ tái tạo phạm vi lịch sử, không phải đầu vào cập nhật Batch 5. Không có ingestion framework hay registry tri thức mới.

```text
node docs/knowledge/research/knowledge-first-batch-5/refresh-index.mjs
node --test docs/knowledge/research/knowledge-first-batch-5/validate.test.mjs
node docs/knowledge/research/knowledge-first-batch-5/validate.mjs
npm run docs:links:test
npm run docs:links
git diff --check
```

Validator kiểm ID/link/span hash, mười disposition carry-forward, metric độc lập theo tập ô, snapshot Batch 1–4/quyết định, trạng thái riêng và phạm vi diff chỉ nghiên cứu. Năm test nhỏ dành cho validator/helper mới bắt lỗi mở gate, mirror cấp COMPARED, duplicate/broken IDs, đếm supplement/phương pháp và sai hash. Không chạy app test, E2E hay technical review loop.

Kết quả thực chạy: **PASS** validator packet/index và hash của 74 file lịch sử được bảo vệ; **PASS 5/5** test validator/helper; **PASS** tests checker link và link trên 295 file Markdown; **PASS** whitespace. [Evidence](evidence.json) giữ kết quả cùng giới hạn: đây là consistency/self-audit, không phải source review độc lập hoặc xác nhận diễn giải.

## Batch 6

1. Xin/tìm quyền đọc **trang in cụ thể** của cùng edition cho Cơ–Lương/Tử, Cơ/Tật và Cơ/Quan; ghi đủ title/copyright/page. Không sửa chi, sao hoặc chữ từ một sơ đồ an sao.
2. Kiểm Cơ–Lương/Tả–Hữu ở **cùng Mệnh**, đồng thời Vi/Phụ nhận trợ, bằng một tác giả độc lập có định danh. Chưa dùng ví dụ khác cung làm lời giải.
3. Chọn từ chín ô Tử Vi/Thiên Lương còn nông: ưu tiên Vi/Phu và Lương/Điền hoặc Phúc. Lương/Phúc đang chỉ có cohost references trong corpus, cần mô tả đúng phạm vi trước khi thêm record.
4. Giải gloss và scope Vi–Phá/Di, Phủ/Nô 天家, số Âm/Huynh; chỉ tiếp tục scan cũ khi có route/locator khác có ích. Giữ toàn bộ14 câu hỏi nếu chưa có bằng chứng đóng.
5. Tìm chú giải cùng edition cho lộc nguyên ở Q3 và một witness độc lập giải thứ tự điều kiện; không triển khai điểm số, RAG, rule hoặc mở narration từ nghiên cứu này.
