# Juan 2: hai nhánh luận nội bộ theo bản chép đã pin

Nguồn: [SylarLong/iztro, commit 2f00e2ab0c80b1632e55bc362f2ae26e121245cb](https://github.com/SylarLong/iztro/blob/2f00e2ab0c80b1632e55bc362f2ae26e121245cb/docs/zh_TW/learn/ancientBook-2.html), trang `紫微鬥數全書 —— 卷二`. PR #49 cung cấp locator và packet truy cập; nội dung đã được lấy lại qua Git, rồi hai model đọc độc lập cả đoạn và ngữ cảnh. Không chạy JavaScript, không cài hoặc build dự án mirror.

HTML gốc có SHA-256 `438d8a20c62e9e27168f5b7e2f969d6ea196ce2b83732b8679ab14644118443a`. Các đoạn trích là văn bản UTF-8 lấy từ nội dung HTML; đoạn Tử Vi/Tài Bạch nối **cả hai** phần liên tiếp, không dừng tại dấu phẩy của phần đầu. Context là bản trích có đánh số dòng của toàn mục cung, không phải byte HTML gốc. Hash của từng lớp được giữ riêng trong packet và quyết định.

Đây là bản chép hiện đại, không phải ảnh sách hoặc ấn bản lịch sử đã giám định. Không xác nhận nó bằng đúng Wikisource oldid 1963110/2268626, không coi hai bản chép giống nhau là hai chứng nhân lịch sử độc lập. `authenticated`, `bookVerified`, `expertVerified` đều giữ false cho nguồn mới. [Thông báo MIT quan sát được](mirror-LICENSE.txt) được giữ nguyên; footer trang cũng có dòng all rights reserved. Không suy từ license của repository ra danh tính hoặc quyền sở hữu ấn bản cổ.

## Phạm vi hai claim

| Cung | Điều kiện đã được review | Câu nguồn được dùng | Không suy ra |
| --- | --- | --- | --- |
| Tài Bạch | Tử Vi và ít nhất một trong Kình Dương, Đà La, Hỏa Tinh, Linh Tinh **cùng cung Tài Bạch** | Mệnh đề `加羊陀火鈴空劫不旺` trong cả đoạn Tử Vi | Không ánh xạ 空/劫; không định nghĩa mọi phạm vi 加; không đổi độ sáng; không suy không có bốn sao là sung túc |
| Phúc Đức | Thiên Đồng và Thiên Lương **đồng cung Phúc Đức** | Riêng nhánh `天梁同清閑快樂` trong cả đoạn Thiên Đồng | Không thừa hưởng lời tuổi thọ; không tổng kết toàn lá số; không phân xử Đồng–Cự hoặc tự thêm điều kiện vắng sát tinh |

Mỗi câu tiếng Việt là chú giải nguyên gốc cho đúng nhánh nguồn, không phải dự đoán thực nghiệm. Predicate Tài Bạch chỉ là một tập con đủ hẹp của trường hợp được nêu, không phải mô hình đầy đủ cho mọi sao/quan hệ trong đoạn. Predicate Phúc Đức không được mở sang chiếu/tam hợp hoặc sang nhánh Thái Âm/Cự Môn. Các đồng sao khác, mệnh đề bổ sung và giới hạn được hai reviewer đọc trong context; không có phép ưu tiên toàn lá số nào được tự bổ sung.

## Thứ tự kiểm chứng

1. Đọc độc lập cả các mục Tài Bạch, Quan Lộc, Phúc Đức và các đoạn đối ứng; kiểm lại pin và hash HTML.
2. Một tác nhân khác tìm 15.120 đầu vào dương lịch bằng engine hiện có, lưu 60 cấu hình và replay toàn bộ. Chọn 16 ca dương/âm tính cho đúng hai AST; “dương tính” nghĩa là predicate khớp, không phải vận tốt. Đây là engineering regression fixtures, **không phải golden đã được chuyên gia hoặc sách độc lập xác nhận**.
3. `gpt-6.1-sol` và `gpt-6-astra` đọc độc lập cùng packet, ngữ cảnh và lời văn; mỗi model tự tái lập 16/16 ca. Cả hai chấp nhận đúng predicate, lời văn, giới hạn và hash đã đề xuất.
4. `compareReviews` hiện có được chạy lại trên đúng span, locator, condition IDs và hai phản hồi thật; kết quả là `AI_ACCEPTED` / `AI_CROSS_REVIEWED`. Cổng riêng vẫn yêu cầu `INTERPRETATION_SUPPORTED_WITH_LIMITS` cùng hash AST, lời văn, fixtures và context. MATCH công thức không tự mở lời luận.
5. Runtime phải kiểm lại hồ sơ nguồn và chạy AST trên lá số tính thật; API công khai vẫn bỏ lời luận nội bộ. `releasePermission=withheld`; không đổi công thức an sao hoặc school mặc định.

[Packet đã đưa cho hai model](review-bundle.json) giữ nguyên nhãn đề xuất vì đó là đối tượng đã được review, không phải bảng phê duyệt runtime. Phê duyệt thực tế nằm tại [quyết định Tài Bạch](../../interpretation-decisions/juan2-tai-tuvi.json), [quyết định Phúc Đức](../../interpretation-decisions/juan2-phuc-dong-luong.json), [review A](../../reviews/juan2-palace/review-a.json), [review B](../../reviews/juan2-palace/review-b.json). [Execution metadata](execution.json) do orchestrator ghi từ hai tool invocation thật; không thêm verdict hoặc giả host build ID vào phản hồi của model.

Hash span/context dùng đúng byte UTF-8 lưu trong file, không tự bỏ LF. Hash JSON AST/fixtures dùng `JSON.stringify` gọn theo thứ tự key trong packet; lời văn dùng đúng chuỗi Unicode. Sửa bất kỳ nội dung được bind nào phải làm cổng đóng lại; không cập nhật hash để hợp thức hóa một lời luận mới.

## Các điểm chưa được hai claim này giải quyết

Quan Lộc/Thiên Phủ còn thiếu ánh xạ chắc chắn của 空/耗 và phạm vi 見/無; bảng 入廟 trong bản chép cũng khác nhãn M của engine ở nhiều chi. Có fixture dương lịch đạt giao hai bảng nhưng đó không phải bằng chứng đủ để duyệt toàn mệnh đề. Đồng–Cự có lời đối ứng khác nhau ngay trong cùng mục Phúc Đức. Các điểm này giữ riêng, không kéo xuống thành lời luận đã duyệt.

Mirror Juan 2–3 này không có các đoạn `安大限訣`/`安小限訣` của locator Wikisource trước đó; không dùng nó để xóa xung đột cung khởi đầu hoặc bù tuổi khởi/bước chuyển còn thiếu. Các quyết định nguồn cũ và cổng vận hạn/phát hành giữ nguyên.

## Separate Quan Lộc branch annotation

T023 adds its own immutable [proposed packet](review-bundle-quan.json), [complete two-paragraph source span](quan-co-cu-dau-source-span.txt), [full review context](quan-co-cu-dau-review-context.txt), [execution metadata](execution-quan.json), and [decision](../../interpretation-decisions/juan2-quan-co-cu-dau.json). Raw model judgments are [review A](../../reviews/juan2-palace/review-quan-a.json) and [review B](../../reviews/juan2-palace/review-quan-b.json). Earlier Tài Bạch/Phúc Đức packets and approvals are unchanged and do not authorize this claim.

Both actual independent models accepted only the attributed `在酉宮雖美無始終` textual branch note for Thiên Cơ and Cự Môn directly sharing Quan Lộc at Dậu. The full span retains `陷宮遭悔吝，加羊陀火鈴空劫更不美，退宮卸職`; those following modifiers remain **not evaluated**. This note does not assert dismissal, integrated career results, longevity or empirical facts. Source Thiên Cơ `旺地` is not equated with the engine's `M`, and no brightness predicate/table is changed. Quan Lộc Thiên Phủ remains unresolved under T022.

Ten unique real solar inputs were independently replayed before both model reviews: three structural positives and seven conjunction negatives. Mão with the same pair must not match Dậu; TPTC alone is insufficient. The fixture named `positive_dau_host_clean_TPTC_adverse` records Hóa Kỵ in an expanded engineering inventory, outside the paragraph's named adverse list. It establishes no source modifier applicability. The wrong-function witness also has a different branch, so it is not an isolated Dậu/function counterexample.

The raw source span and context include final LF in their SHA-256 hashes. Quotations omit only terminal LF to satisfy the unchanged comparator's whitespace contract; both complete paragraphs and all required anchors remain. JSON tree/fixture hashing still uses compact `JSON.stringify` byte order. Both model responses bind all five digest groups, exact predicate, wording and limitations; the existing comparator replays `AI_ACCEPTED`. This separately approved internal note does not authenticate an original edition, certify natal formulas, release public prose or resolve the modifier system.


## Phúc Đức Cơ–Cự: nhánh văn bản đối ứng

Hai đoạn đầy đủ ghi `巨門同勞力欠安` và `天機同心忙不安`. Claim `interp-quanshu-phuc-co-cu-host` dùng đúng Thiên Cơ và Cự Môn đồng cung Phúc Đức, không thêm điều kiện Dậu, brightness hoặc vắng sát tinh. Lời chú giải trích dẫn phạm vi nguồn, không xác nhận tính cách/sức khỏe và nói rõ hai nhánh gia sát ở cuối đoạn chưa được đánh giá.

[Packet gốc và trạng thái](phuc-co-cu-packet/STATUS.md), [bundle](review-bundle-phuc-co-cu.json), [execution](execution-phuc-co-cu.json) và [quyết định](../../interpretation-decisions/juan2-phuc-co-cu.json) giữ nguyên hai đánh giá thực tế cùng 19 lá số kiểm tra độc lập trước duyệt. Các phép biến đổi AST/lời văn/fixture dù tự tính lại hash cũng không thay được phạm vi đã khóa trong runtime. Đây là claim nội bộ thứ năm; nguồn/ấn bản cũ, công thức natal và public prose không thay đổi.

Ứng viên Juan3 Tài Bạch Tử Vi/Tả/Hữu bị cả hai review giữ PARTIAL / UNRESOLVED do phạm vi ngữ pháp chưa rõ; [bằng chứng ứng viên](../juan3-palace/tai-ziwei-fubi-candidate/STATUS.md) được lưu để tiếp tục khi có nguồn mới, không kích hoạt claim.
