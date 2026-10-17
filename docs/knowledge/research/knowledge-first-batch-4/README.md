# Batch 4 — Thiên Cơ, điều kiện và witness độc lập

Ngày nghiên cứu **2026-10-17**; main nền `a99b66fd23680ae6297b09b3e8da0ae78d19159f`, nhánh `codex/knowledge-research-batch-4`. Phạm vi chỉ nghiên cứu và lưu tri thức; không AutoDev, agent, technical review loop hay application CI.

## Tri thức đã lưu

**14 record mới** trong [knowledge-records.json](knowledge-records.json):

- **9 ô Thiên Cơ mới:** Mệnh, Quan Lộc, Tài Bạch, Phúc Đức, Thiên Di, Điền Trạch, Nô Bộc, Phu Thê, Huynh Đệ. Mỗi record giữ nhánh riêng theo cung, độ sáng/vị trí khi nguồn có, cohost, modifier, ngoại lệ và entry đối ứng.
- **2 ô mới còn lại:** Tử Vi/Quan Lộc, Thiên Lương/Tài Bạch. Chưa hoàn tất Tử Vi/Thiên Lương ở mười hai cung.
- **2 bổ sung witness:** `KRB4-NB-PHU-LDL` → `KRB3-NB-PHU`, `KRB4-HD-AM-LDL` → `KRB3-HD-AM`. Đúng sao thủ cung, không dùng giáp cung thay thế; không sửa record cũ, không tính hai lần ô nghiên cứu.
- **1 record phương pháp:** `KRB4-METHOD-CO-ASSISTANTS`, giữ cách một tác giả phân hiệu lực trợ tinh theo host, cohost và cung liên quan. Chưa so sánh độc lập cùng cấu hình; không tạo công thức chung hoặc quy tắc runtime.

[Dossier](DOSSIER.md) giải thích ngữ cảnh từng case; [comparisons](comparisons.json) lưu 13 đối chiếu có giới hạn một lần; [evidence](evidence.json) ghi phạm vi đọc, identity/hash, quyền và snapshot lịch sử. Các câu tiếng Hán được tham chiếu bằng span trong corpus đã lưu; không sao chép bài/sách hiện đại. Nội dung tiếng Việt là phân tích nghiên cứu, không phải tư vấn cá nhân hay chứng cứ thực nghiệm.

Điểm sâu có thể tái dùng gồm: không đảo mệnh đề vắng sát → có điền thành có sát → mất điền; tách bận tâm khỏi thiếu phúc; giữ số lượng anh em khác với hòa thuận; giữ điều kiện sao hội, đồng cung, đối cung và cung nhận trợ riêng. Các mô tả thuận không xóa nhánh bất lợi nằm trong entry đối ứng.

## Nguồn thực sự đọc

1. **Quanshu Juan2**, witness iztro pin `2f00e2ab0c80b1632e55bc362f2ae26e121245cb`: trọn block Cơ **146–162** và tám mục cung **553–575, 576–599, 633–662, 687–711, 712–736, 737–764, 765–788, 789–816**. Đọc đoạn mục tiêu cùng entry đối ứng, không chỉ tìm tên sao. Các mục cung này không có văn xuôi dẫn riêng trước entry đầu; không mượn lời dẫn Phụ/Tử/Tật của Batch 2. Juan3 **談星要論 48–66** cung cấp ngữ cảnh phương pháp liên quan, cùng family, không phải xác nhận độc lập. Không đọc một bản in gốc mới hay toàn bộ mười bốn natal chapter.
2. **[Tử Vi Hàm Số — web attribution Nguyễn Phát Lộc](https://tuvi.xemtuong.net/show.php?id=tu_vi_ham_so)**: trọn mục Thiên Cơ **2154–2365**, Lương/Ở Tài **2661–2669**, Vi/Ở Quan **3147–3152** và ngữ cảnh lân cận. Locator theo reader tại lần truy cập, không phải trang in. Edition, đường truyền bản và học phái chưa xác thực; trích dẫn tác giả khác trong đó không phải một sách khác đã được đọc.
3. **令东来, bài trên website tác giả:** [Thiên Cơ 169](https://www.xuanmen.com.cn/archives/169.html), [Thiên Phủ 131](https://www.xuanmen.com.cn/archives/131.html), [Thái Âm 167](https://www.xuanmen.com.cn/archives/167.html). Đã đọc credit/phần mở đầu, body liên quan Cơ và nguyên đoạn Huynh/Nô cùng qualifiers xung quanh của hai bài sau. HTTP trực tiếp trả 200; bản HTML chỉ xử lý trong bộ nhớ. Bài tự nhận là trích sách, chưa có edition/năm/trang in được xác nhận. Ba URL thuộc **một** family tác giả đã có ở Batch 3. Hash HTML động nhận diện quan sát, không phải artifact đã lưu có thể tái chạy offline.

Không thu thêm scan/PDF, ebook nguyên văn, corpus hoặc dataset; không thử lại vô hạn các đường scan cũ. Quyền sao chép bài hiện đại chưa rõ nên chỉ lưu metadata, locator và ghi chú phân tích ngắn. Attribution không tự là giấy phép tái phát hành. Không gán học phái hoặc đồng thuận liên phái khi nguồn chưa đủ.

## Đối chiếu và nghi vấn

Khoảng trống acquisition **Phủ/Nô** và **Âm/Huynh** đã có comparator đúng placement. Điều này cho phép trạng thái so sánh ở mức ô trong cumulative index; các record cũ vẫn CONTEXT_MAPPED trong snapshot. Số lượng và những chữ khó của Q chưa được hai bài mới xác nhận. Thiên Lương/Tật đã có witness tác giả ở Batch 3; batch này không nhân đôi cùng bài thành nguồn độc lập mới.

[10 disposition](dispositions.json) giữ bảy nhóm câu hỏi cũ cùng ba nhóm mới. **Không có RESOLVED_WITH_EVIDENCE.** SOURCE_VARIANT và INTERPRETATION_DIFFERENCE mô tả quan sát, không đóng nghi vấn. Nhóm mới là bảng sáng Cơ khác nhau giữa Q/V; 良巨/方宜 trong Cơ/Quan; Cự Nguyệt và Cự Lương trong hai mục Cơ của Hàm Số. Không tự sửa chữ cho tự nhiên hoặc chọn một bảng sáng chuẩn. T034 vẫn chưa duyệt.

## Chỉ số tích lũy

[Index chung](../KNOWLEDGE_RECORD_INDEX.json) liên kết record gốc, không nhân bản nội dung hay thay registry runtime:

- Record **23 → 37**: 35 record sao/cung trên 31 ô, 2 record ngoài mẫu số ô. Batch này 13 record sao/cung gồm 11 ô mới và 2 witness bổ sung; 1 record phương pháp ngoài ô.
- Ô có nghiên cứu ngữ cảnh **20 → 31/168 (18,45%)**; còn **137** ô chỉ có locator trong chuỗi nghiên cứu này. Cả 12 cung có ít nhất một case, chưa đủ sâu để gọi hoàn tất.
- Ô có đối chiếu thực hiện, gồm disputed/partial overlap: **18 → 31**. Hai ô cũ có witness mới và cả 11 ô mới được so sánh; không đồng nghĩa 31 ô được xác nhận đúng.
- Ô có trạng thái CONFLICTING: **4 → 5**. Ô có bất kỳ flag nghi vấn: **5 → 9**. Những flag này khác 10 chủ đề disposition và không đếm như approval.
- Vẫn **3 textual/authored families**: truyền bản Quanshu, Hàm Số theo attribution, bình giải 令东来. Không có bản in gốc mới được xác thực.
- Source-review mới **0**, runtime approval mới **0**, public interpretation/AI narration/release permission **không đổi, đóng**. Không đo lại độ áp dụng chart hoặc dùng tỷ lệ ô làm tỷ lệ chart.

Chỉ sửa tối thiểu `refresh-index.mjs` của Batch 3 để đọc thêm file Batch 4, giữ đúng metric riêng Batch 3 và bổ sung metric Batch 4. Các snapshot Batch 1–3, nguồn, quyết định và T030–T038 không sửa.

## Kiểm tra nhẹ

Từ git root:

```text
node docs/knowledge/research/knowledge-first-batch-3/refresh-index.mjs
node docs/knowledge/research/knowledge-first-batch-4/validate.mjs
npm run docs:links:test
npm run docs:links
git diff --check
```

Validator kiểm JSON/ID, source/edition hoặc provisional witness, locator/span hash, supplement/cross-record links, flags, index tích lũy và snapshot lịch sử. Nó không xác nhận nghĩa đúng, bản in thật, tính độc lập hoàn toàn hay quyền tái sử dụng.

Kết quả thực chạy: **PASS** validator Batch 4 (14 record, 13 comparison, 10 disposition; 37 reference/31 ô tích lũy) và validator lịch sử Batch 3 với index mở rộng; **PASS** tests của checker link; **PASS** link trên 293 file Markdown; **PASS** `git diff --check`. Không chạy application test suite hoặc technical review loop.

## Batch 5

1. Ưu tiên một witness có **edition và trang định danh** cho bảng sáng Cơ và câu Cơ/Quan khó; đối chiếu trọn câu, không sửa từ suy đoán. Giữ các lỗi nghi chép Cự Nguyệt/Cự Lương chờ đúng trang.
2. Đào sâu Cơ còn lại ở **Phụ Mẫu, Tử Tức, Tật Ách** bằng lời dẫn đúng cung và entry đối ứng. Chưa có record Cơ ở ba ô này trong chuỗi lưu tri thức.
3. Chọn nhóm còn nông của Tử Vi/Thiên Lương từ index; ưu tiên nguồn tác giả khác có điều kiện cùng placement, không lấy thêm bài của cùng tác giả làm family mới.
4. Đối chiếu độc lập ngoại lệ Cơ–Lương/Tả–Hữu theo đúng cung nhận trợ. Chưa có cơ sở cho thứ bậc hoặc điểm số xuyên nguồn.
5. Tiếp tục acquisition trang gốc cho Nhật–Lương, Tử–Tham/Phụ, Lương/Thân, Nhật/Phu và thuật ngữ; chỉ thử scan cũ khi có đường truy cập/locator mới. Không để các blocker này chặn case đọc được khác. T034 và tất cả cổng duyệt giữ nguyên.
