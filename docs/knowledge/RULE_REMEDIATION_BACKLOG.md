# Rule remediation backlog

No runtime rule was changed in this batch. Each gap below needs its own reviewed implementation PR after a readable source is in hand.

## Sprint 9C formula gaps

These notes cite a bound 9C span or a catalog field. They are not runtime edits.

| Combination | Evidence | Gap | Action |
| --- | --- | --- | --- |
| Nhật Nguyệt Tàng Huy | jollen excerpt, two alternatives with Cự Môn | rulesV2 requires both luminaries hãm | hold_runtime_change_for_separate_reviewed_pr |
| Đế Ngộ Hung Đồ | Wikisource aphorism 帝遇兇徒 | rulesV2 adds Tử Vi, Kình Dương, Hỏa Tinh at mệnh | hold_runtime_change_for_separate_reviewed_pr |
| Lộ Bàng Mai Thi | Wikisource 七殺廉貞同位，路上埋屍 | rulesV2 adds Sửu/Mùi and Hóa Kỵ/Kình/Đà | hold_runtime_change_for_separate_reviewed_pr |
| Cát Xứ Tàng Hung | Wikisource 祿逢沖破，吉處藏凶 | rulesV2 row is absent; catalog required_stars is Địa Kiếp | do_not_infer_stars_that_the_span_does_not_name |
| Chúng Thủy Triều Đông | Wikisource 文耗居寅卯 | rulesV2 uses Đại Hao and Tiểu Hao at Mão/Dậu | hold_runtime_change_for_separate_reviewed_pr |
| Thủy Trừng Quế Ngạc | Wikisource 太陰居子 | rulesV2 adds Thiên Đồng at Tý | hold_runtime_change_for_separate_reviewed_pr |
| Cự Phùng Tứ Sát | tuvisonkhiem, hoặc inside each sát pair | rulesV2 requires all of Kình, Đà, Hỏa, Linh | hold_runtime_change_for_separate_reviewed_pr |
| Đồng Lương Tỵ Hợi | yishihui, opposite palace required | rulesV2 allows menh_or_opposite | hold_runtime_change_for_separate_reviewed_pr |
| Thiên Cơ Tỵ Hợi | display.tw p128, alone at 巳/亥, opposite Thái Âm | no rulesV2 row; catalog formula_text says hãm plus sát | hold_runtime_change_for_separate_reviewed_pr |
| Nhật Nguyệt Tật Ách | display.tw p122, both luminaries in the illness palace | rulesV2 also requires Hóa Kỵ | hold_runtime_change_for_separate_reviewed_pr |
| Mệnh VCD Đắc Tam Không | phamngochien sentence requires vô chính diệu | catalog require_no_major_at_menh is false; rulesV2 noMajor is true and counts Địa Không | hold_runtime_change_for_separate_reviewed_pr |
| Hoa Cái Cư Phu Thê | combinations.json required_stars is Hóa Kỵ | formula_text and rulesV2 name Hoa Cái at Phu Thê | hold_runtime_change_for_separate_reviewed_pr |
| Tử Phủ Vũ Tướng | thienco span names four stars and rejects one palace | rulesV2 places them at tam_hop, which the span does not say | hold_runtime_change_for_separate_reviewed_pr |
| Bán Không Chiết Xỉ | 108s page titles 命裡逢空格 and says 半天折翅 | name is not the catalog name | do_not_promote_exact_identity |
| Tài Ấn Giao Trì | xuanjige 财印交驰 with 武曲 at 寅申 | span omits 天相 and 命宫; 财印坐马格 is a different name that adds 天马 | hold_runtime_change_for_separate_reviewed_pr |
| Khúc Ám Đồng Cung | hocvienlyso item 9, đồng cung only | catalog and rulesV2 also allow hội chiếu; the name Khúc Ám is not in the span | do_not_infer_hoi_chieu_from_dong_cung |
| Hoa Cái Cư Phu Thê | tracuutuvi placement sentence; combinations.json required_stars is Hóa Kỵ | Hoa Cái is not Hóa Kỵ; rulesV2 also requires a malefic the span does not state | hold_catalog_correction_for_separate_reviewed_pr |
| Lưỡng Trùng Thiên Mã | ichingtrilogy 兩重天祿天馬 = 祿存 + 化祿 + one 天馬 | catalog name reads as two Thiên Mã; 疊馬 is a third concept; no rulesV2 row | do_not_equate_two_loc_plus_ma_with_two_ma |

| Combination | School | Source | Decision | Formula | Gap | Action |
| --- | --- | --- | --- | --- | --- | --- |
| Tử Phủ Đồng Cung | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/57 | AI_ACCEPTED | MATCH | agreed_match_runtime_unchanged | hold_runtime_change_for_separate_reviewed_pr |
| Tử Phủ Vũ Tướng | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Cơ Nguyệt Đồng Lương | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/76 | AI_ACCEPTED | MATCH | agreed_match_runtime_unchanged | hold_runtime_change_for_separate_reviewed_pr |
| Sát Phá Tham | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Nhật Nguyệt Tịnh Minh | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.15+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Minh Châu Xuất Hải | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.12+19.2.13+19.5 | AI_ACCEPTED | CONFLICT | rule_conflicts_with_span | hold_runtime_change_for_separate_reviewed_pr |
| Cự Nhật Đồng Cung | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/88 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Dương Lương Xương Lộc | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Nguyệt Lãng Thiên Môn | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.11+19.5 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Nhật Chiếu Lôi Môn | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Thất Sát Triều Đẩu | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.8+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Tham Vũ Đồng Hành | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/83 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Hỏa Tham | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Linh Tham | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Thạch Trung Ẩn Ngọc | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Tam Kỳ Gia Hội | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Song Lộc Triều Viên | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Khoa Minh Lộc Ám | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.25+19.5 | AI_ACCEPTED | NOT_IMPLEMENTED | not_implemented | hold_runtime_change_for_separate_reviewed_pr |
| Lộc Mã Giao Trì | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/42 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Hùng Tú Triều Viên | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Linh Xương Đà Vũ | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Hình Kỵ Giáp Ấn | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Mệnh Lý Phùng Không | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Kình Đà Hiệp Kỵ | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Lộc Phùng Xung Phá | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/107 | AI_ACCEPTED | CONFLICT | rule_conflicts_with_span | hold_runtime_change_for_separate_reviewed_pr |
| Mã Lạc Không Vong | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.3.8+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Cự Hỏa Kình Dương | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/90 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Phiếm Thủy Đào Hoa | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/84 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Phong Lưu Thái Trượng | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Nhật Nguyệt Tàng Huy | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Bán Không Chiết Xỉ | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Mệnh Vô Chính Diệu | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 dai-cuong/31 | AI_ACCEPTED | MATCH | agreed_match_runtime_unchanged | hold_runtime_change_for_separate_reviewed_pr |
| Ám Lộc | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/108 | AI_ACCEPTED | NOT_IMPLEMENTED | not_implemented | hold_runtime_change_for_separate_reviewed_pr |
| Tử Phủ Triều Viên | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.2+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Thiên Ất Củng Mệnh | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Tả Hữu Đồng Cung | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/109 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Văn Tinh Củng Mệnh | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Nhật Nguyệt Đồng Lâm | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.14+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Thọ Tinh Nhập Miếu | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Anh Tinh Nhập Miếu | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn) | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/111 | UNRESOLVED | — | unresolved | hold_runtime_change_for_separate_reviewed_pr |
| Tài Ấn Giao Trì | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Giáp Đệ Đăng Khoa | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Đế Ngộ Hung Đồ | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Nhật Nguyệt Tật Ách | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Khúc Ám Đồng Cung | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Thiên Cơ Tỵ Hợi | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Hình Tù Giáp Ấn | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.18+19.5 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Cự Phùng Tứ Sát | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Lộ Bàng Mai Thi | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Hoa Cái Cư Phu Thê | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Lưỡng Trùng Thiên Mã | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Cát Xứ Tàng Hung | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Phủ Tướng Triều Viên | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.5+19.5 | AI_ACCEPTED | CONFLICT | rule_conflicts_with_span | hold_runtime_change_for_separate_reviewed_pr |
| Nhật Lệ Trung Thiên | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 phu-giai/70 | CONFLICT | — | cross_review_disagreement | hold_runtime_change_for_separate_reviewed_pr |
| Chúng Thủy Triều Đông | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Không Kiếp Giáp Mệnh | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Kình Đà Giáp Mệnh | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Quân Thần Khánh Hội | vn-tam-hop-default | tan-bien-retypeset-277-cover-1956 19.2.3+19.2.4+19.5 | AI_ACCEPTED | PARTIAL | partial_gap | hold_runtime_change_for_separate_reviewed_pr |
| Cơ Cự Đồng Lâm | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Thủy Trừng Quế Ngạc | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Đồng Lương Tỵ Hợi | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
| Mệnh VCD Đắc Tam Không | vn-tam-hop-default | none readable | PASSAGE_NOT_LOCATED | — | no_source_in_readable_corpus | obtain_readable_edition_before_review |
