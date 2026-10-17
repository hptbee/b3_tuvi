# Batch 6 — Dị văn bản khắc và ba ngữ cảnh Vi/Lương

Ngày **2026-10-17**. Đã fetch main và xác nhận PR #68 merge lúc **2026-10-17T11:28:47Z**, base **`d95a4cd6c64bee218ca9ce0cbb3bd952c6706de9`**; nhánh `codex/knowledge-research-batch-6`. Đếm từ file đã commit: **48 record, 38/168 ô ngữ cảnh, 130 ô locator, 14 disposition mở, 0 đã giải bằng bằng chứng**, Cơ có ngữ cảnh ở12/12 cung. Không chạy AutoDev.

## Tri thức đã lưu

[Chín record mới](knowledge-records.json), [dossier](DOSSIER.md), [comparisons](comparisons.json), [source evidence](evidence.json) và [đối chiếu ảnh](scan-collation.json) lưu kiến thức thực cùng điều kiện, phạm vi, nguồn và giới hạn:

- **Vi/Phu Thê:** entry độc lập, nhánh Phủ/Tướng/Phá/Tham, thời điểm/tuổi và cát–adverse. Đọc trọn Q576–599, đối chiếu Hàm Số3184–3195. Không dùng câu hài lão ở entry đối ứng để xóa qualifier; V có phạm vi và đánh giá Tướng khác. Giữ nguyên chữ nối Ngọ “và” Phủ của V, không sửa theo an sao.
- **Lương/Điền:** miếu/vượng, tổ nghiệp, Đồng đồng trước khó/sau dễ; Cơ đồng phải giữ điều kiện không thấy Dương/Đà/Hỏa/Linh/Không/Kiếp. Đọc Q765–788 và toàn đoạn Điền của Ling154; tách thừa kế với tạo/mua, đồng cung với hội chiếu, Đinh/Nhâm/Ất và cát hóa. Không coi hai tác giả đã nói cùng một bộ điều kiện.
- **Lương/Phúc:** đọc Q789–816, chỉ có cohost Cơ/Nhật/Đồng; **không có entry Lương độc lập trong mục này**. Ling154 có đoạn riêng với cát/cát hóa, sát/Kỵ và một nhánh đồng cung được tác giả đánh giá bất lợi. So sánh khác độ chi tiết, không phục dựng lời cổ thiếu.
- **Năm supplement collation:** Cơ/Mệnh, Tử, Tật, Quan và Phủ/Nô, liên kết record lịch sử. Chỉ CONTEXT_MAPPED vì cùng family Quanshu; không thêm ô hoặc xác nhận tác giả độc lập.
- **Một record phương pháp:** witness gán Vương Đình Chi có phần gần cấu hình Cơ–Lương/trợ tinh, nhưng còn khác quan hệ và thiếu endpoint Vi/Phụ. Lưu giá trị một phần và căng thẳng nội văn; không đóng ngoại lệ.

## Đã đọc ảnh nào, edition nào

Đường mới từ một lead dẫn tới [IA item20260506_20260506_1217](https://archive.org/details/20260506_20260506_1217). Đã đọc ảnh riêng từng leaf, không tải PDF853MB hoặc JP2zip. [Scan evidence](scan-collation.json) giữ18 locator/hash ảnh quan sát, năm đoạn chép tay ngắn, analysis tách riêng và giới hạn. Một số leaf chỉ dùng định vị/ngữ cảnh, không phải đã chép hoặc đọc trọn chương in.

Ảnh bìa0 có dấu **内閣文庫**, nhãn **子60–1 / 15856**. Leaf4 ghi **新鋟希夷陳先生紫微斗數全書卷之一**, credit 潘希尹補輯 / 楊一宇恭閱 / 書林葆和堂葉梓行. Đây là định danh trực tiếp nhìn thấy trên reproduction, **chưa xác minh chuỗi lưu trữ chính thức, niên đại hoặc toàn edition**. Uploader ghi1600/明代南陽堂 không được nâng thành năm in xác thực; `editionId`, năm, folio in đều null. Nội dung cung trong digital Juan2 lại ở scan juan4; không đồng nhất số quyển.

Locator dùng **leaf zero-based**, kèm page PDF suy ra bằng leaf+1, pane và incipit. Đây không phải folio in. JPEG hash là bytes quan sát, không có artifact ảnh để replay offline. Hash transcript kiểm integrity ghi chú của chúng ta; không xác thực nét ảnh. OCR thử định vị bị lỗi, không dùng làm chứng cứ chữ; IIIF timeout, không lặp lại. Không giữ OCR hoặc ảnh trong repository.

## Kết quả chữ và câu hỏi còn mở

- **Cơ/Quan — leaf147:** chép tay đọc `會文曲為良不見羊陀火鈴方宜`; sau 良 là 不, không có 巨/臣 trong đoạn được đọc. Phân đoạn `為良 / 不見羊陀火鈴 / 方宜` là dấu câu phân tích. Q739 giữ `良巨，見…方宜`. Có bằng chứng dị văn trực tiếp, không tự sửa Q hoặc chọn “良臣”; chưa đủ chốt lịch sử chữ chuẩn.
- **Cơ–Lương/Tử — leaf135:** vẫn ghi **寅/申**, thêm chữ 同 sau 巨門 so với Q607. **Leaf90 cùng artifact** ghi Lương **辰戌** ở phần Mệnh. Sự bất nhất hiện có cả trong witness ảnh; không giải bằng thuật toán vị trí hoặc tự thay chi.
- **Cơ/Tật — leaf140:** có Cự đồng huyết khí, Lương đồng hạ bộ ngay entry Cơ; lời dẫn Mệnh trước Tật vẫn giữ. Chỉ xác nhận chữ Quanshu ở đoạn nhìn rõ, không sửa “Cự Lương” tại V2179 thuộc sách khác. Thuật ngữ bệnh cổ không là bằng chứng y học.
- **Cơ/Mệnh — leaf90:** sáu nhãn sáng khớp Q; một số can/wording khác. Không gọi cả bảng hoàn toàn đồng văn hay chọn bảng đúng đối với V.
- **Phủ/Nô — leaf145:** đọc **助主衛家**, khác **天家** ở Q719; đã nhìn phóng vùng chữ. Cải thiện câu hỏi về chữ, chưa có gloss theo edition hoặc xác nhận con số.

[Dispositions](dispositions.json) giữ nguyên mọi trường cũ của **14 ID**, thêm quan sát Batch6 và đường carry-forward; **14 vẫn mở, 0 RESOLVED_WITH_EVIDENCE**. B4D09 có câu trả lời hẹp cho witness mới nhưng vấn đề nguồn gốc rộng còn thiếu. Vi–Phá/Di chưa có gloss mới đủ điều kiện; Âm/Huynh và lộc nguyên Q3 không có chứng cứ mới, không lặp route cũ hoặc tạo lời giải.

## So sánh tác giả và quyền

Đã đọc [Hàm Số](https://tuvi.xemtuong.net/show.php?id=tu_vi_ham_so), mục Vi/Phu3184–3195 và vùng Lương liên quan. Heading2699 “Ở ĐIỀN” có body nói phúc/thọ/họ hàng; không âm thầm đổi heading hoặc dùng làm exact property comparator. Edition/trang in và borrowing vẫn chưa xác thực.

[Ling154](https://www.xuanmen.com.cn/archives/154.html): đọc credit/title, đoạn Điền đầy đủ và ba đoạn Phúc liên tiếp. Dùng **cùng provisional identity Batch3**, không tính URL/tải lại thành family mới. Hash decoded HTML là observation động, không artifact nguồn đã lưu. Những sách/tác giả Ling dẫn lại không phải sách mới đã kiểm riêng.

[鬥數零談 gán Vương Đình Chi](https://www.scribd.com/document/871559757/王亭之-斗数零谈): đọc body credit, lời tựa và mục Cơ850–913, running labels77–83 chưa được kiểm trang in. Cơ hội Lương, thấy Phụ/Bật/Xương/Khúc chỉ khớp một phần; không có đủ Vi/Phụ nhận trợ. Câu898/909 còn căng nhau về sao nào phát huy khi Hình/Kỵ. Không suy precedence hoặc sửa từ OCR. Ngày lời tựa1993/1994 không thành năm xuất bản; description AI-enhanced không là xác thực.

Vẫn ba family đã biết, thêm **một attribution tác giả provisional** Wang. Ling có trích Wang và dùng cổ quyết chung; không chứng minh bốn truyền thống lịch sử độc lập. **Bốn authored comparisons** gồm khác độ chi tiết/partial; **năm dependent collations** không cấp COMPARED độc lập. Không có comparator khớp đủ ngoại lệ Mệnh/Phụ.

Nguồn hiện đại chỉ lưu locator và phân tích gốc ngắn, không body/HTML/PDF. Bản cổ chỉ giữ các excerpt chép tay có giới hạn; quyền tái sử dụng scan chưa rõ, không phân phối ảnh/corpus. Đủ dùng nghiên cứu giới hạn không đồng nghĩa được tái xuất bản, source review hay public interpretation.

## Chỉ số và kiểm tra

[Index tích lũy](../KNOWLEDGE_RECORD_INDEX.json): **48 → 57 record; 38 → 41/168 ô ngữ cảnh (24,40%); còn127 ô locator**. Có52 star/palace records và5 non-cell. Cả41 ô có performed authored comparison, gồm partial/disputed; bảy ô có CONFLICTING,12 ô có flag. Tử Vi/Lương còn **6/24 ô** chưa có contextual record. Không đo chart applicability, độ chính xác dự đoán hoặc readiness.

Helper Batch6 đọc thêm một file batch vào danh sách rõ ràng. Validator tái dùng hai kiểm trạng thái/span từ helper Batch5 đã đóng băng; không sửa helper lịch sử hoặc tạo ingestion framework.

```text
node docs/knowledge/research/knowledge-first-batch-6/refresh-index.mjs
node --test docs/knowledge/research/knowledge-first-batch-6/validate.test.mjs
node docs/knowledge/research/knowledge-first-batch-6/validate.mjs
npm run docs:links:test
npm run docs:links
git diff --check
```

Kết quả chạy được ghi trong [evidence](evidence.json). Kiểm tra consistency không chứng minh nguyên bản, diễn giải đúng, expert verification hoặc source review. Không chạy app tests, E2E, full CI hoặc technical review loop cho thay đổi nghiên cứu này.

**Source review: chưa thực hiện. Runtime approval: không yêu cầu. Public interpretation/AI narration/release: vẫn đóng. T034 chưa duyệt; T030–T038, quyết định, Formula V1 và app giữ nguyên.**

## Batch 7

1. Xác minh IA reproduction với catalog chính thức theo nhãn15856/子60–1 và credits, lấy folio in/colophon nếu đọc được. Đối chiếu edition khác cho Quan `為良不見…`, Mệnh can sinh và Tử寅申/辰戌; không chuyển narrow reading thành xác thực cả edition.
2. Tìm **trang in Hàm Số đúng V2179** và các chỗ heading/body lệch; Quanshu không thể sửa chữ của sách khác.
3. Tìm tác giả có đúng toàn bộ Cơ–Lương Mệnh + Tả/Hữu + Vi/Phụ nhận trợ. Dùng Wang để xác lập partial overlap, tìm trang in cho căng thẳng898/909; không lặp đoạn này làm direct confirmation.
4. Sáu ô Vi/Lương còn nông: **Vi/Tật, Nô, Điền, Phúc; Lương/Huynh, Tài**. Chọn ít ô có đủ ngữ cảnh; mở rộng thêm không thay việc kiểm phần cohost-only Lương/Phúc.
5. Giữ14 dispositions, theo đuổi gloss Phủ衛家, Vi–Phá/Di, Âm/Huynh và lộc nguyên chỉ khi có evidence mới, đúng edition/quan hệ/qualifier. Chưa chuyển nghiên cứu thành runtime hoặc mở gate.
