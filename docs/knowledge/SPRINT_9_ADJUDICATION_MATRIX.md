# Sprint 9 adjudication matrix

Sprint 9 stays open. The 24 Tân Biên decisions and 39 Sprint 9C decisions were not rewritten. The two models were not rerun. A row here is a scoped research record, not a new `MATCH`.

Baseline: `7a4504c580dbafcabdd904b3fec0d08cf5f7a02b`. Records: 21.

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
| Nhật Nguyệt Tịnh Minh | `CONFLICT` | CONDITION_LIST | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Cự Nhật Đồng Cung | `CONFLICT` | RUBRIC_SCOPE | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Thất Sát Triều Đẩu | `CONFLICT` | RUBRIC_SCOPE | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Tham Vũ Đồng Hành | `CONFLICT` | CONDITION_LIST | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Mã Lạc Không Vong | `CONFLICT` | CONDITION_LIST | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Tử Phủ Triều Viên | `CONFLICT` | CONDITION_LIST | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
| Nhật Nguyệt Đồng Lâm | `CONFLICT` | CONDITION_LIST | `INSUFFICIENT_EVIDENCE` | `HISTORICAL_NAME_NOT_ESTABLISHED` |
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

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Stored Tân Biên reviews disagree on condition ids, including an extra avoid_tuan and branch_ty on the Grok side. The Tân Biên PDF page was not reopened. The 108s lead was not re-fetched in this pass, so it is not accepted as a replacement source.
- Fetch: 108s info/250 not re-fetched

### Cự Nhật Đồng Cung

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Same extracted conditions, PARTIAL versus MATCH. The Tân Biên span was not reopened, and the 108s branch wording was not re-fetched, so the branch dispute stays unresolved.
- Fetch: 108s info/223 not re-fetched

### Thất Sát Triều Đẩu

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Same extracted conditions, CONFLICT versus PARTIAL. The Tân Biên page was not reopened and 108s info/207 was not re-fetched.
- Fetch: 108s info/207 not re-fetched

### Tham Vũ Đồng Hành

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Both formula labels are MATCH, but Terra adds branch_suu beside the shared branch_suu_mui. The comparator records CONFLICT. The Tân Biên page was not reopened, so neither condition list is selected.
- Fetch: 108s info/22 not re-fetched

### Mã Lạc Không Vong

- Recognition: `PARTIAL`. Full grade: `NOT_APPLICABLE`.
- Runtime: The stored Cát Xứ Wikisource span already contains 馬遇空亡，終身奔走. That aphorism does not state same-palace Địa Không. rulesV2 looks for Thiên Mã in tam phương tứ chính with Địa Không or Tuần/Triệt. 108s info/268 was not re-fetched. The operational formula is not equated with the aphorism.
- Fetch: 108s info/268 not re-fetched

### Tử Phủ Triều Viên

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Condition lists differ by a bright id. The Tân Biên page was not reopened. 108s info/196 was not re-fetched. It stays distinct from Tử Phủ Vũ Tướng.
- Fetch: 108s info/196 not re-fetched

### Nhật Nguyệt Đồng Lâm

- Recognition: `UNRESOLVED`. Full grade: `UNRESOLVED`.
- Runtime: Grok includes extra branches that Terra omits. The Tân Biên locator 19.2.14 was not reopened. 108s info/222 was not re-fetched.
- Fetch: 108s info/222 not re-fetched

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
