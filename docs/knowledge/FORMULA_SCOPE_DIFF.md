# Formula scope differences

These notes separate recognition, quý grade, breaking conditions, and the current `rulesV2.json` shape. No runtime field was changed.

## Geometry

- Thiên Ất Củng Mệnh on 108s info/262, retrieved 2026-10-13, places Thiên Khôi and Thiên Việt in the Mệnh 三方四正, including Tài and Quan. `thien_at_cung_menh` uses `menh_or_opposite`. Those predicates are not the same.
- Văn Tinh on ziweidoushu.com9.tw pattern/20 places Văn Xương and Văn Khúc in the Mệnh 三方四正. `van_tinh_cung_menh` requires Văn Xương, Văn Khúc, and Hóa Khoa in one palace.
- Hình Tù on 108s info/210 is Liêm Trinh, Thiên Tướng, and Kình Dương in the same palace at Tý/Ngọ. `hinh_tu_giap_an` uses flank groups. The page says neighboring palaces cannot hold Liêm Trinh opposite that arrangement.
- Hình Kỵ on 108s info/206 is school-dependent. `hinh_ky_giap_an` implements one flank formula. It is not Hình Tù.

## Recognition versus grade

- Anh Tinh: Phá Quân at Tý/Ngọ is the base sentence. Astroverse adds 無殺 as a quoted verse, not as the base test. `anh_tinh_nhap_mieu` checks only Phá Quân at Tí/Ngọ.
- Thạch Trung Ẩn Ngọc: 108s info/227 basic is Cự Môn at Tý/Ngọ. The quý sentence adds Lộc/Quyền and no sát. `thach_trung_an_ngoc` makes one of Hóa Lộc, Hóa Quyền, or Lộc Tồn mandatory and does not encode no sát.
- Nhật Lệ Trung Thiên: 108s info/221 basic is Thái Dương at Ngọ. The quý sentence adds auxiliaries. `nhat_le_trung_thien` checks Thái Dương at Ngọ.
- Sát Phá Tham: the retrieved Astroverse sentence describes a geometric meeting. It does not state a high-grade promise. `sat_pha_tham` checks the three stars at `tam_hop`.

## Identity splits

- Bán Không Chiết Xỉ stays `NAME_MISMATCH`. The shenjige lead returned HTTP 200 and did not contain 半天折翅.
- Kình Dương Nhập Miếu, 馬頭帶箭, and 馬頭帶劍 are not synonyms. info/265 is Kình alone at the four tomb branches. info/219 is a different Ngọ pattern. The stored Tân Biên decision stays `UNRESOLVED` because the review digest does not match the span.
- Lộ Bàng Mai Thi: the bound sentence is Liêm and Thất Sát together and 路上埋屍. Sửu/Mùi and Hóa Kỵ are not in that sentence. The xingge note treats Hóa Kỵ as a worsening comment.
- Mệnh VCD Đắc Tam Không: the bound sentence and `rulesV2` `noMajor: true` disagree with catalog `require_no_major_at_menh: false`. Địa Không is in the runtime count and not in that sentence.

## Seven Tân Biên rows rechecked on 2026-10-13

- Cự Nhật Đồng Cung: the span states no branch. `cu_nhat_dong_cung` adds Dần and Thân. The placer produced that pair only at those branches. 108s info/223 says 寅 or 未, then compares 寅 with 申.
- Thất Sát Triều Đẩu: the span requires Dần/Thân and opposite Tử Vi with Thiên Phủ. `that_sat_trieu_dau` also allows Tí and Ngọ and does not require the opposite pair.
- Tham Vũ Đồng Hành: the span and `tham_vu_dong_hanh` use Sửu or Mùi. `branch_suu` is not a further requirement. 108s info/197 also accepts 辰/戌 opposition.
- Mã Lạc Không Vong: the span is Thiên Mã at Mệnh with Tuần or Triệt. 108s info/268 uses Địa Không or Địa Kiếp. `ma_lac_khong_vong` uses tam phương tứ chính.
- Tử Phủ Triều Viên: the span is a bright disjunction at Mệnh or Quan. `tu_phu_trieu_vien` requires the two stars in tam phương tứ chính.
- Nhật Nguyệt Tịnh Minh and Nhật Nguyệt Đồng Lâm: the stored coordinates and the modern same-palace or bright-aspect pages are different formulas. The printed pages were not opened.
