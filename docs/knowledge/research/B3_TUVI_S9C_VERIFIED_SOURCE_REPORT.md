# B3 Tử Vi — Sprint 9C · Nguồn bổ sung đã kiểm tra cho 19 cách còn lại

**Ngày rà soát:** 2026-10-13 · **Repo:** `hptbee/b3_tuvi` · **PR #19 head đã kiểm:** `cb1dd30`  
**Mục đích:** Gói research seed cho Cursor, **không phải** quyết định `AI_ACCEPTED`, và **không phải** xác minh bản in cổ thư.

## Phương pháp kiểm tra

Đối chiếu các cách cục với `backend/src/data/combinations.json` trên nhánh PR #19; tra cứu trực tuyến và **mở** các trang nguồn được ghi ở cột URL; kiểm tên bài, nội dung công thức/đoạn liên quan, và so sánh với công thức B3. Các liên kết không có đoạn định nghĩa đúng tên giữ mức `RELATED_ONLY` hoặc `NO_EXACT_SOURCE`. Một tên đúng nhưng công thức không tương ứng vẫn chưa được phép nâng trạng thái.

Đối với Wikisource, đã trực tiếp đọc phần *太微賦*, quyển I tại <https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽> (khoảng dòng 231–259 trên trang hiển thị). PR #19 nêu oldid `850734`; cần ghim lại revision khi Cursor tải nội dung. Đây là **bản phiên chép số**, không phải bản in đã giám định.

## Nhóm A — 8 cách có đoạn/câu nhưng chưa dual-AI

| Cách | Mức nguồn | Link đã mở | Phát hiện cần kiểm tra |
|---|---|---|---|
| **Anh Tinh Nhập Miếu** | `DIRECT_FORMULA_PAGE` | [Mở nguồn](https://www.108s.tw/article/info/208) | Compare core structural rule to B3 Phá Quân Tý/Ngọ; classify extra conditions rather than forcing them all to be mandatory. |
| **Nhật Nguyệt Tàng Huy** | `MODERN_FORMULA_VARIANT` | [Mở nguồn](https://www.jollen.tw/97-%E6%97%A5%E6%9C%88%E8%97%8F%E8%BC%9D.html) | Potential FORMULA_CONFLICT: B3 uses both Thái Dương and Thái Âm in hãm status. Verify source identity and if author cites real historical text. |
| **Bán Không Chiết Xỉ** | `RELATED_SOURCE_ALIAS_MISMATCH` | [Mở nguồn](https://www.108s.tw/article/info/267) | Do NOT accept identity as proven; check Vietnamese transcription/Xỉ vs Sí, and whether B3 formula about Không Kiếp meeting authority stars is supported. |
| **Đế Ngộ Hung Đồ** | `HISTORICAL_TRANSCRIPTION_MENTION` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Prompt the two models to avoid inferring Kình/Hỏa thresholds from the phrase; may be incomplete/not executable. |
| **Lộ Bàng Mai Thi** | `HISTORICAL_TRANSCRIPTION_ALIAS_MISMATCH` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Separate verified phrase from catalog alias; B3 adds Sửu/Mùi and Hóa Kỵ/Kình Đà, which this short clause does not establish. |
| **Cát Xứ Tàng Hung** | `HISTORICAL_TRANSCRIPTION_MENTION` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Potential FORMULA_CONFLICT: B3 requires Địa Kiếp/Triệt. Do not infer those from 祿逢沖破. |
| **Chúng Thủy Triều Đông** | `HISTORICAL_TRANSCRIPTION_MENTION` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Potential FORMULA_CONFLICT: B3 uses Đại Hao + Tiểu Hao in Mão/Dậu. Distinguish 文耗, exact star and palace positions before asserting equivalence. |
| **Thủy Trừng Quế Ngạc** | `HISTORICAL_TRANSCRIPTION_MENTION` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Potential FORMULA_CONFLICT: B3 requires Thiên Đồng and Thái Âm same at Tý; passage only explicitly states Thái Âm at Tý. |

**Không chạy thẳng AI_ACCEPTED cho Bán Không Chiết Xỉ**: bài nguồn nói *半天折翅*, không phải tên hiện tại của catalog. Các câu ngắn trong *太微賦* cần chứng cứ từ đoạn lân cận, đúng locator và thẩm định xem đó là tên cách riêng hay câu phú miêu tả.

## Nhóm B — 11 cách đã kiểm URL trước đây nhưng không có đoạn định nghĩa phù hợp

| Cách | Kết quả bổ sung | Link đã mở | Lưu ý |
|---|---|---|---|
| **Tử Phủ Vũ Tướng** | `NEW_CANDIDATE_DIRECT` | [Mở nguồn](https://www.thaiam.vn/tu-vi-wiki/cach-cuc/tu-phu-vu-tuong.html) | Validate structural claims against deterministic star placement; beware varying versions requiring Tử Phủ cùng cung vs broad tetrad in tam phương. |
| **Sát Phá Tham** | `NEW_CANDIDATE_DIRECT` | [Mở nguồn](https://thienco.vn/sat-pha-tham.html) | Check whether this is near-automatic structural invariant under certain placements; do not count it as a rare special good fortune on merely seeing three stars. |
| **Tài Ấn Giao Trì** | `RELATED_ONLY` | [Mở nguồn](https://ziweiai.com/zh-TW/notes/wuqu-tianxiang-yinshen-minggong-justice-service) | Retain unverified name. Seek print source with formal exact name, or classify as a derived star pair not a named source-verified cách cục. |
| **Khúc Ám Đồng Cung** | `RELATED_ONLY` | [Mở nguồn](https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽) | Maintain RELATED_CONCEPT; verify whether Ám refers to Cự Môn, and whether đồng cung vs hội chiếu are separately supported. |
| **Thiên Cơ Tỵ Hợi** | `NO_EXACT_SOURCE` | Không tìm được URL xác nhận công thức đúng tên | Keep SOURCE_NOT_LOCATED; do not infer hãm+sat from generic Thiên Cơ interpretations. Try authenticated source indexes or page-specific book references. |
| **Cự Phùng Tứ Sát** | `NEW_CANDIDATE_DIRECT` | [Mở nguồn](https://hocvienlyso.org/tu-vi-dau-so-khan-cach-cuc.html) | Mark CONFLICTING_SOURCE_DEFINITIONS. B3 currently demands all Kình, Đà, Hỏa, Linh; do not simply choose one by model consensus. |
| **Hoa Cái Cư Phu Thê** | `RELATED_ONLY` | [Mở nguồn](https://services.shen88.cn/ziweidoushu/pc-108861.html) | Critical catalog issue: B3 required_stars is Hóa Kỵ despite name/formula referring to Hoa Cái. Research identity and create remediation finding, not runtime edit. |
| **Lưỡng Trùng Thiên Mã** | `NO_EXACT_SOURCE` | Không tìm được URL xác nhận công thức đúng tên | Keep source inaccessible for exact rule and runtime disabled. Do not invent the moving-star calculation or dates. |
| **Đồng Lương Tỵ Hợi** | `NEW_CANDIDATE_STRUCTURAL` | [Mở nguồn](https://blog.udn.com/jo52348/9125487) | Potential FORMULA_CONFLICT: B3 allows đồng cung OR opposition at Tỵ/Hợi and marks both hãm. Verify placement against engine; do not equate same-palace with this source. |
| **Nhật Nguyệt Tật Ách** | `NEW_CANDIDATE_DIRECT` | [Mở nguồn](https://display.tw/p122.htm) | Possible source-backed concept but not historical print authentication. Flag health predictions as cultural interpretation, not medical facts. |
| **Mệnh VCD Đắc Tam Không** | `NEW_CANDIDATE_SECONDARY` | [Mở nguồn](https://baomoi.com/menh-vo-chinh-dieu-la-gi-dac-diem-nguoi-co-menh-vo-chinh-dieu-c48694795.epi) | Critical FORMULA_CONFLICT candidate. Must distinguish Đắc/Ngộ/Kiến Tam Không and number/placements of stars; do not auto-promote. |

## Những bất nhất quan trọng giữa B3 và dữ liệu đã đọc

1. **Thủy Trừng Quế Ngạc:** Wikisource ghi *Thái Âm tại Tý*, nhưng B3 yêu cầu **Thiên Đồng + Thái Âm đồng cung Tý**. Đây là ứng viên `FORMULA_CONFLICT`, chưa kết luận hoàn tất.
2. **Chúng Thủy Triều Đông:** bản số ghi **文耗居寅卯**, khác B3 **Đại Hao + Tiểu Hao tại Mão/Dậu**; tên sao và quan hệ cần truy nguồn.
3. **Cát Xứ Tàng Hung:** câu gốc đi kèm **Lộc phùng xung phá**, B3 lại dùng Địa Kiếp/Triệt; chưa thấy nguồn buộc ba thứ đó tương đương.
4. **Hoa Cái Cư Phu Thê:** `required_stars` B3 là **Hóa Kỵ**, trong khi tên/công thức là **Hoa Cái** tại Phu Thê; probable catalog implementation/data inconsistency.
5. **Mệnh VCD Đắc Tam Không:** nguồn thứ cấp phân biệt 1 Không tại Mệnh + 2 trong tam hợp và các nhánh khác; B3 có `require_no_major_at_menh:false`; phải coi là finding nghiêm trọng, không sửa runtime tại Sprint 9C.
6. **Đồng Lương Tỵ Hợi:** nguồn mô tả Thiên Đồng ở Mệnh Tỵ/Hợi **đối diện** Thiên Lương, không phải đồng cung ở đó.
7. **Nhật Nguyệt Tàng Huy:** bài Jollen nêu điều kiện theo **một** Nhật **hoặc** Nguyệt ở vị trí hãm; B3 đòi **cả hai** hãm; là variant/identity conflict candidate.
8. **Cự Phùng Tứ Sát:** công thức trong các nguồn thứ cấp khác nhau; không được suy một nghĩa nhất quán của chữ Tứ Sát từ tên gọi.

## Xử lý 6 decision UNRESOLVED do ngưỡng trích dẫn 40 ký tự

`backend/src/knowledge/crossReview.js` trên nhánh PR #19 dùng `quotation.trim().length >= 40` để nhận quotation, vô tình đánh rớt nhiều câu Hán ngắn. **Không được nối câu bất liên quan hoặc thêm chữ để đủ 40**. Thay bằng chính sách có version: quote nguyên văn theo ranh giới đoạn/sentence, check source URL/revision/digest/anchor, enforce presence of structural conditions, verify exact containment and duplicate/overlap. Đối với phần văn bản ngắn, lưu surrounding-context span **nếu thực sự có trên cùng nguồn**. Nếu chỉ có tiêu đề hoặc 4–5 chữ không đủ công thức, tiếp tục `UNRESOLVED`. Replay 24 Tân Biên + 20 mới không thay quyết định cũ giả tạo.

## Ranh giới triển khai

- Gói này là **web discovery evidence**; trang nào chưa được kiểm trong phiên Cursor hiện tại phải FETCH lại, ghi retrieval date + content fingerprint.
- Không gắn `EXACT_IDENTITY` chỉ vì title tương tự; không gắn `MATCH` nếu logic B3 khác câu nguồn.
- Các trang văn bản học thuật/website đương đại phải gắn `secondary` hoặc `modern` phù hợp; không coi cổ văn họ tự trích là bản gốc đã xác minh.
- Không sửa `rulesV2.json`, `tuviRules.mjs`, mặc định phái, SQLite hoặc public interpretation.
- Khi cần thay đổi rule, tạo riêng `RULE_REMEDIATION_BACKLOG` và PR kỹ thuật sau này.

## Bộ chứng cứ phụ để Cursor truy ngược


**Tử Phủ Vũ Tướng**
- [modern_specific](https://tuvica.net/tra-cuu/tu-phu-vu-tuong) — Claims citation to Áo Bí pp341–342, print edition not checked
- [other](https://thienco.vn/tu-phu-vu-tuong.html) — Defines star quartet/tam phương
- [other](https://tuvi.cohoc.net/cach-cuc-trong-tu-vi-la-gi-mot-so-cach-cuc-tieu-bieu-trong-tu-vi-nid-18755.html) — Mentions variant Tử Phủ Vũ Tướng Liêm

**Sát Phá Tham**
- [specific](https://tuvixemtuong.net/hoc-tu-vi/cach-cuc/sat-pha-tham) — Discusses structural relationships and classic citation

**Khúc Ám Đồng Cung**
- [chinese_secondary](https://www.ziwei.info/zh-tw/detail/3233) — 文曲巨門同宮 phrase, not formal named rule

**Cự Phùng Tứ Sát**
- [divergent](https://tuvisonkhiem.vn/thu-vien/cach-cuc/cu-phung-tu-sat/) — Modern rule using three sát families differs from Kình/Đà/Hỏa/Linh rule

**Hoa Cái Cư Phu Thê**
- [modern](https://www.xingchen-douwu.com/%E7%B4%AB%E5%BE%AE%E6%96%97%E6%95%B8/%F0%9F%91%91%E8%8F%AF%E8%93%8B%E6%98%9F%EF%BC%9A%E5%AD%A4%E5%82%B2%E5%85%A7%E6%96%82%E8%88%87%E7%8E%84%E5%AD%B8%E8%97%9D%E8%A1%93%E6%8C%87%E4%BB%A4/) — Palace-specific interpretation, not formal classic named cách

## Quy ước đầu ra Sprint 9C

`RESEARCH_COMPLETE_WITH_GAPS` chỉ khi 19/19 có xác nhận đã tìm đúng nguồn, hoặc báo rõ vì sao chưa tìm được; 8 case chuyển sang review thật khi đủ câu định nghĩa; 11 case không có nguồn chính xác tiếp tục nghiên cứu và được ghi `EXACT_SOURCE_NOT_LOCATED` nếu cạn nguồn; 6 short-quote cases replay v2 có test. **Không đặt deadline hoặc giả báo 63/63 xác thực.**

