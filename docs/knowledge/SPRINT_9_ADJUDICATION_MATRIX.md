# Sprint 9 adjudication matrix

Sprint 9 stays open. Stored decisions were not rewritten. The two Nhật Nguyệt rows now record a confirmed text-layer mismatch on the registered PDF. That is not formula MATCH and not expert verification.

Records: 21. Seven-case update: `sprint9d-seven-v1`. Visual collation: page 230 glyph versus text layer.

| Combination | Stored decision | Disagreement | Disposition | Identity |
| --- | --- | --- | --- | --- |
| Anh Tinh Nhập Miếu | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Hình Kỵ Giáp Ấn | `CONFLICT` | SCHOOL_VARIANT | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Nhật Nguyệt Tật Ách | `CONFLICT` | RUBRIC_SCOPE | `HISTORICAL_NAME_NOT_ESTABLISHED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Sát Phá Tham | `CONFLICT` | RUBRIC_SCOPE | `HISTORICAL_NAME_NOT_ESTABLISHED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Thạch Trung Ẩn Ngọc | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Thiên Ất Củng Mệnh | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Tử Phủ Vũ Tướng | `CONFLICT` | RUBRIC_SCOPE | `HISTORICAL_NAME_NOT_ESTABLISHED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Văn Tinh Củng Mệnh | `CONFLICT` | RUBRIC_SCOPE | `HISTORICAL_NAME_NOT_ESTABLISHED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Bán Không Chiết Xỉ | `CONFLICT` | IDENTITY | `IDENTITY_MISMATCH` | `IDENTITY_MISMATCH` |
| Lộ Bàng Mai Thi | `CONFLICT` | CONDITION_LIST | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Mệnh VCD Đắc Tam Không | `CONFLICT` | CONDITION_LIST | `SOURCE_CONTRADICTION` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Nhật Nguyệt Tịnh Minh | `CONFLICT` | CONDITION_LIST | `PDF_TEXT_LAYER_MISMATCH_CONFIRMED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Cự Nhật Đồng Cung | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Thất Sát Triều Đẩu | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Tham Vũ Đồng Hành | `CONFLICT` | CONDITION_ID_REDUNDANCY | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Mã Lạc Không Vong | `CONFLICT` | CONDITION_LIST | `SOURCE_CONTRADICTION` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Tử Phủ Triều Viên | `CONFLICT` | CONDITION_ID_REDUNDANCY | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Nhật Nguyệt Đồng Lâm | `CONFLICT` | CONDITION_LIST | `PDF_TEXT_LAYER_MISMATCH_CONFIRMED` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Hình Tù Giáp Ấn | `CONFLICT` | CONDITION_LIST | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Nhật Lệ Trung Thiên | `CONFLICT` | RUBRIC_SCOPE | `DOCUMENTED_SOURCE_VARIANT` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn) | `UNRESOLVED` | DIGEST_MISMATCH | `IDENTITY_MISMATCH` | `IDENTITY_MISMATCH` |

## Scoped notes

### Anh Tinh Nhập Miếu

- Recognition: `PARTIAL`. Full grade: `NOT_COMPARED_AS_SEPARATE_VERDICT`.
- Runtime: rulesV2 anh_tinh_nhap_mieu checks Phá Quân at Mệnh Tí/Ngọ only. The bound 108s span also states opposite Liêm Trinh and Thiên Tướng. Astroverse meta, fetched HTTP 200, says 破軍在子宮或午宮坐命 and quotes 破軍子午宮無殺 as a separate sentence.
- Fetch: astroverse.com.tw/ziwei/patterns/ying-xing-ru-miao HTTP 200; phrase present in retrieved text

### Hình Kỵ Giáp Ấn

- Recognition: `SOURCE_CONTRADICTION`. Full grade: `NOT_A_GRADE_SPLIT`.
- Runtime: rulesV2 hinh_ky_giap_an flanks Thiên Tướng with Kình Dương or Thiên Hình, and Hóa Kỵ. Fetched 108s info/206 says schools differ: 羊陀夾天相 versus 天相化忌 with 擎羊. That is not Hình Tù Giáp Ấn.
- Fetch: 108s.info/206 HTTP 200; school sentence present

### Nhật Nguyệt Tật Ách

- Recognition: `CONFLICT`. Full grade: `NOT_IN_BOUND_SPAN`.
- Runtime: Both models extracted Thái Dương and Thái Âm in the illness palace. rulesV2 also requires Hóa Kỵ. Hóa Kỵ is not in the bound display.tw sentence. No second historical definition was accepted.
- Fetch: No new page was required; the bound span already lacks Hóa Kỵ

### Sát Phá Tham

- Recognition: `PARTIAL`. Full grade: `NOT_IN_SOURCE`.
- Runtime: rulesV2 requires Thất Sát, Phá Quân, and Tham Lang at tam_hop of Mệnh. Astroverse meta, HTTP 200, says the three stars are always in tam hợp and the pattern is seeing them with Mệnh. The retrieved text does not contain a located ancient fu line. Geometry is not a promise of high grade.
- Fetch: astroverse sha-po-lang HTTP 200; body is a short meta description

### Thạch Trung Ẩn Ngọc

- Recognition: `PARTIAL`. Full grade: `CONFLICT`.
- Runtime: Fetched 108s info/227: basic is Cự Môn at Mệnh Tý/Ngọ; quý grade adds Lộc/Quyền/Lộc Tồn and no sát. rulesV2 requires Cự Môn at Tí/Ngọ plus one of Hóa Lộc, Hóa Quyền, or Lộc Tồn at Mệnh, so it implements the quý addition as mandatory and does not encode no-sát. Terra MATCH treats that addition as the whole pattern.
- Fetch: 108s.info/227 HTTP 200

### Thiên Ất Củng Mệnh

- Recognition: `CONFLICT`. Full grade: `NOT_A_GRADE_SPLIT`.
- Runtime: Fetched 108s info/262: Thiên Khôi and Thiên Việt in the Mệnh 三方四正, explicitly including Tài and Quan, not only Mệnh and the opposite palace. rulesV2 uses menh_or_opposite. Terra MATCH is not supported by that sentence.
- Fetch: 108s.info/262 HTTP 200

### Tử Phủ Vũ Tướng

- Recognition: `PARTIAL`. Full grade: `NOT_IN_SOURCE`.
- Runtime: Newton encyclopedia HTTP 200 calls 紫府武相 a four-star meeting in 三方四正 and also calls it 紫府格. That page is tertiary and also cites 紫府同宮, a different name. rulesV2 uses tam_hop. The earlier thienco span does not say tam hợp. Terra MATCH is not an identity proof.
- Fetch: newton.com.tw wiki HTTP 200

### Văn Tinh Củng Mệnh

- Recognition: `CONFLICT`. Full grade: `PARTIAL`.
- Runtime: Fetched ziweidoushu.com9.tw pattern/20: 文昌 and 文曲 in the Mệnh 三方四正, titled 文星拱命格. The string 朝命 is absent there. rulesV2 requires Văn Xương, Văn Khúc, and Hóa Khoa in the same palace. Wikisource 論文星朝命格 was not re-fetched in this pass.
- Fetch: ziweidoushu.com9.tw/pattern/20 HTTP 200

### Bán Không Chiết Xỉ

- Recognition: `NOT_THE_CATALOG_NAME`. Full grade: `NOT_APPLICABLE`.
- Runtime: Stored decision identity is NAME_MISMATCH. The bound 108s span says 半天折翅 inside a 命裡逢空 discussion. shenjige.cn returned HTTP 200 and the retrieved HTML does not contain 半天折翅, so that lead is not accepted.
- Fetch: shenjige.cn HTTP 200; target phrase absent

### Lộ Bàng Mai Thi

- Recognition: `CONFLICT`. Full grade: `SECONDARY_ONLY`.
- Runtime: Both models said formula CONFLICT. Terra omitted alias_lo_thuong. The bound Wikisource sentence is 七殺廉貞同位，路上埋屍 and does not state Sửu/Mùi or Hóa Kỵ. xingge.tw, HTTP 200, repeats that sentence and treats 化忌 as a worsening note. rulesV2 adds Sửu/Mùi and Hóa Kỵ/Kình/Đà. Sửu/Mùi was not proved here as a placement invariant.
- Fetch: xingge.tw tongyuan-qisha HTTP 200

### Mệnh VCD Đắc Tam Không

- Recognition: `PARTIAL`. Full grade: `NOT_APPLICABLE`.
- Runtime: The bound sentence states vô chính diệu, Tuần or Triệt at the palace, and Thiên Không aspect. Grok omitted thien_khong_aspect. That omission is not resolved by picking Terra. Other Đắc/Ngộ/Kiến definitions remain separate. Catalog require_no_major_at_menh is false. rulesV2 sets noMajor true and counts Địa Không.
- Fetch: No new body; existing bound sentence reused

### Nhật Nguyệt Tịnh Minh

- Recognition: `VISUAL_TY_HOI_UNREACHABLE`. Full grade: `EDITORIAL_TY_DAU_REACHABLE`.
- Runtime: SHA-256 of https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf matches the registry 941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458. Printed page 230, PDF index 229. The text layer encodes the Sun position as U+0054 U+00FD (Tý). The rendered glyph has a detached dot below the y, the same shape as page 71 words whose text layer is U+1EF5 (Tỵ). On page 71, U+00FD in lý has an acute and no dot below, so the font can draw both. This is a text-layer mismatch, not a 1956-edition proof. The stored span was not rewritten. Visual first clause is Sửu / Sun Tỵ / Moon Hợi. That Sun/Moon pair is not produced by the current placer. Quách Ngọc Bội, fetched 2026-10-13, says the book wrote Hợi by mistake and the Moon should be Dậu. Page 71 labels a separate illustration Nhật Tỵ Nguyệt Dậu at Sửu, and another illustration on the same page puts Sun Mão and Moon Hợi at Sửu. Those are not one rule. Editorial Sửu / Tỵ / Dậu is reachable at can=0,chi=0,day=14,month=2,hour=3. Clause 2 Mùi / Mão / Hợi is reachable at can=0,chi=0,day=1,month=2,hour=9. rulesV2 allows Sun Tị or Ngọ and Moon Dậu or Tí, so it covers the editorial pair and also other mixtures, and it does not implement clause 2. Original decision stays CONFLICT. expertVerified remains false.
- Fetch: PDF sha matched; page 230 glyph crop; page 71 comparison; sonchu.vn Quách Ngọc Bội sections 14-15 HTTP 200

### Cự Nhật Đồng Cung

- Recognition: `RUNTIME_NARROWER_THAN_SILENT_SPAN`. Full grade: `NOT_IN_TAN_BIEN_SPAN`.
- Runtime: Stored Tân Biên span requires Cự Môn and Thái Dương together at Mệnh and states no branch. rulesV2 adds branches Dần and Thân. A placement search of the current engine found that same-palace pair only at Dần and Thân, so no reachable chart was excluded. 108s info/223, retrieved 2026-10-13, says the basic seat is 寅 or 未, then later says 寅 is better than 申. Those two sentences were not collapsed. PDF page not verified.
- Fetch: 108s info/223 HTTP 200; Wikisource oldid 7913704 names 巨日同宫 without the branch sentence

### Thất Sát Triều Đẩu

- Recognition: `OVERLAPPING_DIFFERENT`. Full grade: `GRADE_ONLY_ON_108S`.
- Runtime: Stored Tân Biên span: Mệnh or Quan at Dần/Thân, Thất Sát there, Tử Vi and Thiên Phủ together opposite. rulesV2 allows Thất Sát at Mệnh Dần, Thân, Tí, or Ngọ and does not require the opposite pair. Reachable chart can=0,chi=0,day=4,month=1,hour=7 has Mệnh Thân and the opposite pair. Reachable chart can=0,chi=0,day=3,month=2,hour=10 has Mệnh Ngọ and the opposite palace does not hold both Tử Vi and Thiên Phủ. 108s info/207 basic sentence matches the Dần/Thân plus opposite pair and keeps auxiliaries as quý grade. PDF page not verified.
- Fetch: 108s info/207 HTTP 200

### Tham Vũ Đồng Hành

- Recognition: `EQUIVALENT_ON_BASIC_SPAN`. Full grade: `MODERN_PAGE_ADDS_CHEN_TUAT`.
- Runtime: Stored span: Tham Lang and Vũ Khúc together at Mệnh Sửu or Mùi. Both reviews say MATCH. Terra also lists branch_suu, which the span does not require by itself. rulesV2 uses branches Sửu and Mùi and samePalace of those two stars. 108s info/197 also treats 辰/戌 opposition as basic and 丑 as the quý seat. That expansion is not the Tân Biên sentence. Original decision stays CONFLICT. PDF page not verified.
- Fetch: 108s info/197 HTTP 200

### Mã Lạc Không Vong

- Recognition: `OVERLAPPING_DIFFERENT`. Full grade: `MITIGATION_SEPARATE`.
- Runtime: Stored span: Thiên Mã at Mệnh meets Tuần or Triệt. The following phụ luận is mitigation, not the formation. Grok omits Tuần/Triệt; Terra adds avoid_tuan_triet and bright. rulesV2 allows Thiên Mã in tam phương tứ chính with Địa Không or Tuần/Triệt. 108s info/268 requires Thiên Mã with Địa Không or Địa Kiếp in the same palace or opposite, and does not require Tuần/Triệt. Wikisource oldid 7913704 says 马落空亡 is 马既落亡 and separately has 馬遇空亡 in another transcription already stored. These formulas were not merged. PDF page not verified.
- Fetch: 108s info/268 HTTP 200; Wikisource oldid 7913704

### Tử Phủ Triều Viên

- Recognition: `OVERLAPPING_DIFFERENT`. Full grade: `BRIGHTNESS_IN_SPAN`.
- Runtime: Stored span is a disjunction: bright Tử Vi at Mệnh or Quan with Thiên Phủ opposite, or bright Thiên Phủ at Mệnh or Quan with Tử Vi opposite. Terra adds a general bright id beside the star-specific bright ids. rulesV2 only requires Tử Vi and Thiên Phủ somewhere in tam phương tứ chính of Mệnh, with no brightness and no Quan target. 108s info/196 describes eight configurations in 三方四正. That modern page was not substituted for the Tân Biên sentence. PDF page not verified.
- Fetch: 108s info/196 HTTP 200

### Nhật Nguyệt Đồng Lâm

- Recognition: `OPPOSITE_PALACE_NOT_SAME_PALACE`. Full grade: `EDITORIAL_OPPOSITE_CONJUNCTION`.
- Runtime: SHA-256 of https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf matches the registry 941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458. Printed page 230, PDF index 229. The text layer encodes the Sun position as U+0054 U+00FD (Tý). The rendered glyph has a detached dot below the y, the same shape as page 71 words whose text layer is U+1EF5 (Tỵ). On page 71, U+00FD in lý has an acute and no dot below, so the font can draw both. This is a text-layer mismatch, not a 1956-edition proof. The stored span was not rewritten. Visual first clause Sửu / Sun Tỵ / Moon Hợi is unreachable. The printed second clause, Mệnh Mùi with both luminaries at Sửu, is reachable at can=0,chi=0,day=3,month=3,hour=10. Section 19.1.5 on printed page 229 and Quách Ngọc Bội section 14 put both luminaries opposite the target: Sửu with the pair at Mùi, or Mùi with the pair at Sửu. The opposite Sửu-target chart is reachable at can=0,chi=0,day=18,month=2,hour=3. rulesV2 requires both stars in the target palace at Sửu or Mùi. That matches a different same-palace chart, can=0,chi=0,day=6,month=3,hour=4, and does not match the opposite-palace clauses. Original decision stays CONFLICT.
- Fetch: PDF sha matched; page 230 glyph crop; page 229 text 19.1.5; sonchu.vn section 14

### Hình Tù Giáp Ấn

- Recognition: `CONFLICT`. Full grade: `NOT_A_GRADE_SPLIT`.
- Runtime: Fetched 108s info/210: Liêm Trinh, Thiên Tướng, and Kình Dương together at Mệnh Tý/Ngọ. The page says 夾 here means same palace because Liêm cannot flank Thiên Tướng. rulesV2 hinh_tu_giap_an uses anchor flanks, not that same-palace sentence. This name is not Hình Kỵ Giáp Ấn. The Tân Biên conflict is not closed.
- Fetch: 108s.info/210 HTTP 200

### Nhật Lệ Trung Thiên

- Recognition: `PARTIAL`. Full grade: `NOT_IMPLEMENTED_AS_SEPARATE_RULE`.
- Runtime: Fetched 108s info/221: basic is Thái Dương at Mệnh Ngọ; quý grade adds auxiliaries. rulesV2 checks Thái Dương at Ngọ only. Terra adds a bright condition the Grok review omits. The Tân Biên page phu-giai/70 was not reopened, so the stored conflict stays.
- Fetch: 108s.info/221 HTTP 200

### Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn)

- Recognition: `UNRESOLVED`. Full grade: `NOT_APPLICABLE`.
- Runtime: The stored comparator reason is a review digest that does not match the Tân Biên span. That digest was not repaired and the models were not rerun. Fetched 108s info/265: 擎羊 alone at Mệnh Sửu/Thìn/Mùi/Tuất. Fetched info/219 is titled 馬頭帶箭 and describes Ngọ patterns with Kình Dương plus other stars. 馬頭帶劍 was not in that retrieved page. The three names are not treated as synonyms.
- Fetch: 108s info/265 and info/219 HTTP 200
