# Sprint 9 V1 implementation report

This report is the engineering ledger for formula version `s9-v1`. It is not a claim that 63 formations are historically authenticated, expert-verified, or predictively validated. `expertVerified` stays false. Research decisions, spans, and model reviews were not rewritten.

COUNTS active=29 variant=24 internal_only=2 disabled=8 sum=63 public_default=50 executable=55 variant_implementations=68 unimplemented_supported=0 rules_v2_rows=58 missing_rules=5

ACTIVE + VARIANT + INTERNAL_ONLY + DISABLED = 29 + 24 + 2 + 8 = 63.

## Disposition totals

| Measure | Count |
| --- | --- |
| Catalog records | 63 |
| ACTIVE | 29 |
| VARIANT | 24 |
| INTERNAL_ONLY | 2 |
| DISABLED | 8 |
| Source-backed executable formations | 55 |
| Disabled patterns | 8 |
| Implemented source-variant formulas | 68 |
| Public on the default profile | 50 |
| Supported non-disabled predicates still unimplemented | 0 |
| Prior rulesV2 rows | 58 |
| Catalog names absent from rulesV2 | 5 |

The 58 researched runtime rows are disposed as kept 11, widened 6, narrowed 5, replaced 27, disabled 6, gated 1, internal 2. Those seven labels sum to 58. The five names that had no rulesV2 row are Khoa Minh Lộc Ám, Ám Lộc, Thiên Cơ Tỵ Hợi, Lưỡng Trùng Thiên Mã, Cát Xứ Tàng Hung. `rulesV2.json` remains the researched snapshot. The live matcher reads `backend/src/data/formulaV1.mjs`.

## Tests

Backend unit tests and backend integration tests were run from `backend/` with `node scripts/runTests.mjs unit` and `node scripts/runTests.mjs integration`. Catalog coverage, profile selection, negatives, and the 14 named counterexamples are in `backend/test/formulaV1.test.mjs`. Reachable natal witnesses used there include Thất Sát at Mệnh Ngọ (`can 0 chi 0 day 3 month 2 hour 10`), Thất Sát at Mệnh Thân with Tử Vi and Thiên Phủ opposite (`can 0 chi 0 day 4 month 1 hour 7`), and Phiếm Thủy (`can 8 chi 0 day 7 month 2 hour 4`). Frontend unit tests were not executed in this environment because `frontend/node_modules` is not installed. The combination API route was covered by the backend integration tests. GitHub CI status is reported after the pull request is opened.

## Known source and edition disagreements

These stay separate profiles. They are not merged into one predicate.

- Nhật Nguyệt Tịnh Minh: the PDF text layer reads Tý/Hợi, the rendered page-230 glyph reads Tỵ/Hợi, and the enabled variant is the editorial pair Tỵ/Dậu or Mão/Hợi. The enabled wording is not a 1956 authentication.
- Nhật Nguyệt Đồng Lâm: Tân Biên/editorial is the opposite-palace Sửu–Mùi conjunction. `modern-108s` is both luminaries in Mệnh at Sửu/Mùi.
- Minh Châu Xuất Hải: the default is Tân Biên Nguyệt Sinh Thương Hải, Thái Âm at Tý for Mệnh or Quan. Profile `b3-legacy` keeps Mệnh vô chính diệu at Mùi with Nhật Mão and Nguyệt Hợi.
- Mã Lạc Không Vong: Tân Biên is Thiên Mã at Mệnh with Tuần or Triệt. `modern-108s` is Thiên Mã at Mệnh with Địa Không or Địa Kiếp at Mệnh or the opposite palace.
- Thất Sát Triều Đẩu: Tân Biên allows Mệnh or Quan at Dần/Thân. `modern-108s` uses Mệnh only. Tý/Ngọ is not in either basic predicate.
- Tham Vũ Đồng Hành: Tân Biên is the Sửu/Mùi same-palace rule. The Thìn/Tuất opposite pattern is only `modern-108s`.
- Hình Tù Giáp Ấn: Tân Biên is a flank around Thiên Tướng. `modern-108s` is Liêm Trinh, Thiên Tướng, and Kình Dương in one palace at Tý/Ngọ.
- Lộc Mã Giao Trì: xung, same-palace, and hội chiếu are three profiles.

## Intentionally disabled or unpublished claims

Hùng Tú Triều Viên, Lộc Phùng Xung Phá, Bán Không Chiết Xỉ, Tài Ấn Giao Trì, Đế Ngộ Hung Đồ, Lưỡng Trùng Thiên Mã, Cát Xứ Tàng Hung, and Chúng Thủy Triều Đông do not return a match. Khúc Ám Đồng Cung and Lộ Bàng Mai Thi can be evaluated internally and do not receive a public interpretation. Cự Hỏa Kình Dương and Mệnh VCD Đắc Tam Không have structural predicates and stay out of the public result. Hình Kỵ Giáp Ấn has no default; a school profile must be selected.

## Ledger

| # | Catalog name | ID | State | Default profile | Formula / source variant | Grade | Identity | Runtime | Public eligibility | Tests | Limitation | rulesV2 disposition |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Tử Phủ Đồng Cung | `tu_phu_dong_cung` | ACTIVE | tan-bien | tan-bien: tan-bien base predicate | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 2 | Tử Phủ Vũ Tướng | `tu_phu_vu_tuong` | VARIANT | modern-structural | modern-structural: modern structural: four stars in Mệnh tam phương tứ chính | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | Not a verified classical formula and not a single-palace requirement. | widened |
| 3 | Cơ Nguyệt Đồng Lương | `co_nguyet_dong_luong` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/229 | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | narrowed |
| 4 | Sát Phá Tham | `sat_pha_tham` | ACTIVE | modern-108s | modern-108s: tam hợp Mệnh Tài Quan | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 5 | Nhật Nguyệt Tịnh Minh | `nhat_nguyet_tinh_minh` | VARIANT | tan-bien-editorial | tan-bien-editorial: editorial: Mệnh/Quan Sửu + Nhật Tỵ + Nguyệt Dậu, or Mệnh/Quan Mùi + Nhật Mão + Nguyệt Hợi | none | EDITORIAL_VARIANT | implemented | yes | formulaV1.test.mjs | The enabled wording is an editorial emendation. It is not authenticated from a 1956 printing. | replaced |
| 6 | Minh Châu Xuất Hải | `minh_chau_xuat_hai` | VARIANT | tan-bien | tan-bien: Tân Biên 19.2.13 Nguyệt Sinh Thương Hải<br>b3-legacy: b3-legacy Mệnh VCD at Mùi, Nhật Mão, Nguyệt Hợi | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | The older B3 Mệnh-VCD Mùi / Nhật Mão / Nguyệt Hợi formula remains profile b3-legacy. | replaced |
| 7 | Cự Nhật Đồng Cung | `cu_nhat_dong_cung` | ACTIVE | tan-bien | tan-bien: Tân Biên đồng cung Mệnh | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | Dần/Thân is a current placer invariant, not an explicit branch requirement in the stored passage. | widened |
| 8 | Dương Lương Xương Lộc | `duong_luong_xuong_loc` | VARIANT | modern-108s | modern-108s: modern OR of Hóa Lộc and Lộc Tồn | not_certified | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | kept |
| 9 | Nguyệt Lãng Thiên Môn | `nguyet_lang_thien_mon` | ACTIVE | tan-bien | tan-bien: Mệnh Hợi Thái Âm | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 10 | Nhật Chiếu Lôi Môn | `nhat_chieu_loi_mon` | ACTIVE | tan-bien | tan-bien: Mệnh Mão Thái Dương | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 11 | Thất Sát Triều Đẩu | `that_sat_trieu_dau` | ACTIVE | tan-bien | tan-bien: Tân Biên 19.2.8 Mệnh or Quan<br>modern-108s: https://www.108s.tw/article/info/207 target Mệnh | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 12 | Tham Vũ Đồng Hành | `tham_vu_dong_hanh` | ACTIVE | tan-bien | tan-bien: Tân Biên đồng cung Sửu/Mùi<br>modern-108s: 108s Thìn/Tuất opposite | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 13 | Hỏa Tham | `hoa_tham` | VARIANT | same-palace | same-palace: https://www.108s.tw/article/info/217 primary same palace<br>opposite-weaker: https://www.108s.tw/article/info/217 weaker opposite | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 14 | Linh Tham | `linh_tham` | VARIANT | same-palace | same-palace: https://www.108s.tw/article/info/217 primary same palace<br>opposite-weaker: https://www.108s.tw/article/info/217 weaker opposite | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 15 | Thạch Trung Ẩn Ngọc | `thach_trung_an_ngoc` | ACTIVE | toan-thu | toan-thu: basic Cự Môn at Mệnh Tý/Ngọ | evaluated when formation matches | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | widened |
| 16 | Tam Kỳ Gia Hội | `tam_ky_gia_hoi` | ACTIVE | tan-bien | tan-bien: tam phương tứ chính, no same-palace requirement | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 17 | Song Lộc Triều Viên | `song_loc_trieu_vien` | VARIANT | modern-108s | modern-108s: one Lộc in Tài and the other in Quan | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 18 | Khoa Minh Lộc Ám | `khoa_minh_loc_am` | ACTIVE | tan-bien | tan-bien: Tân Biên 19.2.25 reciprocal nhị hợp | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | missing |
| 19 | Lộc Mã Giao Trì | `loc_ma_giao_tri` | VARIANT | tan-bien-xung | tan-bien-xung: Tân Biên Lộc Tồn xung chiếu, Mã gặp tại Mệnh hoặc đối cung<br>same-palace: same-palace variant<br>hoi-chieu: hội chiếu variant | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 20 | Hùng Tú Triều Viên | `hung_tu_trieu_vien` | DISABLED | — | no executable predicate | none | NAME_MISMATCH | disabled | no | formulaV1.test.mjs | The Liêm Trinh Dần/Thân predicate is not kept under this title. A modern 雄宿朝垣 formula would need a distinct id and display name. | disabled |
| 21 | Linh Xương Đà Vũ | `linh_xuong_da_vu` | VARIANT | modern-108s | modern-108s: https://www.108s.tw/article/info/205 | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 22 | Hình Kỵ Giáp Ấn | `hinh_ky_giap_an` | VARIANT | — | school-kinh-da-flank: school: Kình Dương and Đà La flank Thiên Tướng<br>school-tuong-hoa-ky: school: Thiên Tướng meets Hóa Kỵ and Kình Dương | none | SCHOOL_GATED | school-gated; no default profile | no default; yes for a selected school profile | formulaV1.test.mjs | No unqualified default. Enabled only for a selected school profile. Distinct from Hình Tù Giáp Ấn. | gated |
| 23 | Mệnh Lý Phùng Không | `menh_ly_phung_khong` | VARIANT | modern-108s | modern-108s: 108s encounter at Mệnh; no Mệnh–Thân link<br>ty-hoi-vcd: more specific Tỵ/Hợi vô chính diệu form | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 24 | Kình Đà Hiệp Kỵ | `kinh_da_hiep_ky` | VARIANT | modern-108s | modern-108s: https://www.108s.tw/article/info/248 | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 25 | Lộc Phùng Xung Phá | `loc_phung_xung_pha` | DISABLED | — | no executable predicate | none | STAR_ALIAS_UNRESOLVED | disabled | no | formulaV1.test.mjs | The star-alias map does not establish which Phá is meant. Không, Kiếp, Hóa Kỵ, Tuần and Triệt are not substituted. | disabled |
| 26 | Mã Lạc Không Vong | `ma_lac_khong_vong` | VARIANT | tan-bien | tan-bien: Tân Biên: Thiên Mã at Mệnh gặp Tuần hoặc Triệt<br>modern-108s: https://www.108s.tw/article/info/268 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 27 | Cự Hỏa Kình Dương | `cu_hoa_kinh_duong` | VARIANT | tan-bien | tan-bien: structural hội of Cự, Hỏa, Kình, Đà | none | SOURCE_SCOPED | implemented | no | formulaV1.test.mjs | The extra inauspicious context is an incomplete modifier. No death or suicide interpretation is emitted. | replaced |
| 28 | Phiếm Thủy Đào Hoa | `phiem_thuy_dao_hoa` | ACTIVE | tan-bien | tan-bien: Tân Biên Kình or Đà đồng cung | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | narrowed |
| 29 | Phong Lưu Thái Trượng | `phong_luu_thai_truong` | ACTIVE | modern-108s | modern-108s: Mệnh Dần only | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | narrowed |
| 30 | Nhật Nguyệt Tàng Huy | `nhat_nguyet_tang_huy` | VARIANT | sprint9c-span | sprint9c-span: Sprint 9C two-alternative span | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 31 | Bán Không Chiết Xỉ | `ban_khong_chiet_xi` | DISABLED | — | no executable predicate | none | NAME_MISMATCH | disabled | no | formulaV1.test.mjs | Catalog identity is not established. The phrase is not implemented as this name. | disabled |
| 32 | Mệnh Vô Chính Diệu | `menh_vo_chinh_dieu` | ACTIVE | tan-bien | tan-bien: existing no-major predicate | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 33 | Ám Lộc | `am_loc` | ACTIVE | tan-bien | tan-bien: Tân Biên reciprocal Lộc Tồn and Hóa Lộc on a bright Mệnh | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | missing |
| 34 | Tử Phủ Triều Viên | `tu_phu_trieu_vien` | ACTIVE | tan-bien | tan-bien: Tân Biên 19.2.2 bright host and chiếu<br>modern-broader: broader modern tam phương tứ chính variant | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 35 | Thiên Ất Củng Mệnh | `thien_at_cung_menh` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/262 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | widened |
| 36 | Tả Hữu Đồng Cung | `ta_huu_dong_cung` | ACTIVE | tan-bien | tan-bien: đồng cung Sửu/Mùi | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 37 | Văn Tinh Củng Mệnh | `van_tinh_cung_menh` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/254 | evaluated when formation matches | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 38 | Nhật Nguyệt Đồng Lâm | `nhat_nguyet_dong_lam` | VARIANT | tan-bien-editorial | tan-bien-editorial: editorial opposite-palace conjunction<br>modern-108s: https://www.108s.tw/article/info/222 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 39 | Thọ Tinh Nhập Miếu | `tho_tinh_nhap_mieu` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/236 | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | widened |
| 40 | Anh Tinh Nhập Miếu | `anh_tinh_nhap_mieu` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/208 | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 41 | Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn) | `kinh_duong_nhap_mieu` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/265 | not_certified | CORRECTED_DISPLAY | implemented | yes | formulaV1.test.mjs | — | replaced |
| 42 | Tài Ấn Giao Trì | `tai_an_giao_tri` | DISABLED | — | no executable predicate | none | HISTORICAL_NAME_NOT_ESTABLISHED | disabled | no | formulaV1.test.mjs | Vũ Khúc + Thiên Tướng at Dần/Thân may be discussed as an internal pair. It is not published under this historical title. | disabled |
| 43 | Giáp Đệ Đăng Khoa | `giap_de_dang_khoa` | ACTIVE | modern-108s | modern-108s: 108s basic: host Hóa Khoa, Hóa Quyền hội chiếu | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | widened |
| 44 | Đế Ngộ Hung Đồ | `de_ngo_hung_do` | DISABLED | — | no executable predicate | none | HISTORICAL_NAME_NOT_ESTABLISHED | disabled | no | formulaV1.test.mjs | No precise rule is invented from the aphorism. | disabled |
| 45 | Nhật Nguyệt Tật Ách | `nhat_nguyet_tat_ach` | VARIANT | source-wording | source-wording: direct wording: both luminaries in Tật Ách | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | Illness wording in sources is not a medical diagnosis. | replaced |
| 46 | Khúc Ám Đồng Cung | `khuc_am_dong_cung` | INTERNAL_ONLY | structural | structural: internal same-palace pattern | none | UNRESOLVED_IDENTITY | internal evaluator only | no | formulaV1.test.mjs | — | internal |
| 47 | Thiên Cơ Tỵ Hợi | `thien_co_ty_hoi` | VARIANT | modern-source | modern-source: modern variant, no added sát or hãm requirement | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | missing |
| 48 | Hình Tù Giáp Ấn | `hinh_tu_giap_an` | VARIANT | tan-bien | tan-bien: Tân Biên 19.2.18 Ấn tọa thủ, Kình and Liêm giáp<br>modern-108s: https://www.108s.tw/article/info/210 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | The 108s same-palace formula is not used as the Tân Biên flank. A 10800-chart sample of this placer found same-palace Liêm–Tướng–Kình and no Kình/Liêm flank around Thiên Tướng, so the Tân Biên variant has no observed natal witness. A chart matches it only when the flank is actually present. | replaced |
| 49 | Cự Phùng Tứ Sát | `cu_phung_tu_sat` | VARIANT | sprint9c-span | sprint9c-span: OR within each sát group, AND across the three groups | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 50 | Lộ Bàng Mai Thi | `lo_bang_mai_thi` | INTERNAL_ONLY | structural | structural: đồng vị only | none | RELATED_APHORISM | internal evaluator only | no | formulaV1.test.mjs | No death interpretation. Sửu/Mùi, Hóa Kỵ, Kình and Đà are not added from that sentence. | internal |
| 51 | Hoa Cái Cư Phu Thê | `hoa_cai_cu_phu_the` | VARIANT | bound-source | bound-source: Hoa Cái at Phu Thê; Hóa Kỵ is not required | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 52 | Lưỡng Trùng Thiên Mã | `luong_trung_thien_ma` | DISABLED | — | no executable predicate | none | NAME_MISMATCH | disabled | no | formulaV1.test.mjs | No Lưu Thiên Mã overlay is invented for two Thiên Mã. | missing |
| 53 | Cát Xứ Tàng Hung | `cat_xu_tang_hung` | DISABLED | — | no executable predicate | none | HISTORICAL_NAME_NOT_ESTABLISHED | disabled | no | formulaV1.test.mjs | Not promoted to a standalone Địa Kiếp/Triệt pattern. | missing |
| 54 | Phủ Tướng Triều Viên | `phu_tuong_trieu_vien` | ACTIVE | tan-bien | tan-bien: Tân Biên 19.2.5 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 55 | Nhật Lệ Trung Thiên | `nhat_le_trung_thien` | ACTIVE | modern-108s | modern-108s: https://www.108s.tw/article/info/221 | not_certified | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 56 | Chúng Thủy Triều Đông | `chung_thuy_trieu_dong` | DISABLED | — | no executable predicate | none | STAR_IDENTITY_UNRESOLVED | disabled | no | formulaV1.test.mjs | Đại Hao + Tiểu Hao at Mão/Dậu is not an authorized substitute. The classical statement remains research evidence. | disabled |
| 57 | Không Kiếp Giáp Mệnh | `khong_kiep_giap_menh` | ACTIVE | tan-bien | tan-bien: one star on each flank | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | narrowed |
| 58 | Kình Đà Giáp Mệnh | `kinh_da_giap_menh` | ACTIVE | tan-bien | tan-bien: one star on each flank | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | narrowed |
| 59 | Quân Thần Khánh Hội | `quan_than_khanh_hoi` | ACTIVE | tan-bien | tan-bien: Tân Biên 19.2.3–19.2.4 | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | A missing auxiliary star returns no match. | replaced |
| 60 | Cơ Cự Đồng Lâm | `co_cu_dong_lam` | ACTIVE | tan-bien | tan-bien: đồng cung Mão/Dậu | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | kept |
| 61 | Thủy Trừng Quế Ngạc | `thuy_trung_que_ngac` | VARIANT | classical | classical: classical Thái Âm at Tý | none | SOURCE_SCOPED | implemented | yes | formulaV1.test.mjs | — | replaced |
| 62 | Đồng Lương Tỵ Hợi | `dong_luong_ty_hoi` | VARIANT | modern-source | modern-source: oriented opposite, not an unordered menh_or_opposite pair | none | MODERN_VARIANT | implemented | yes | formulaV1.test.mjs | — | replaced |
| 63 | Mệnh VCD Đắc Tam Không | `menh_vcd_tam_khong` | VARIANT | school-specific | school-specific: school-specific structural predicate | none | UNRESOLVED_IDENTITY | implemented | no | formulaV1.test.mjs | Public named-formation eligibility stays off. Đắc, Ngộ and Kiến Tam Không are not conflated. Địa Không is not counted. | replaced |
