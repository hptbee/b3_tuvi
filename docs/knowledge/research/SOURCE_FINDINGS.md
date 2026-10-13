# B3 Tử Vi — Sprint 9D: PDF visual collation for the remaining two cases

Research date: 2026-10-13. Base PR: https://github.com/hptbee/b3_tuvi/pull/19; observed HEAD `f80e10f7bb1bc54d4ad22f54fef208c4fc430bae`.

## Executive finding

**The rendered PDF and its searchable text layer disagree.** In the project's registered 277-page working PDF, printed page **230** (zero-based PDF index **229**), §§19.2.14 and 19.2.15 visibly write **Tỵ** for the Sun's position. The extracted PDF text and B3's stored spans write **Tý** in this location. This is a visual/text-extraction mismatch, not an authorized emendation of the printed work.

Registered working file: https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf#page=230
Registry: `docs/knowledge/sources.json`, edition ID `tan-bien-retypeset-277-cover-1956`, expected SHA256 `941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458` (declared in registry; **not independently rehashed in this research session**).

Second place *within the same digital edition*: printed page **71**, zero-based PDF index **70**, https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf#page=71 . Its phú giải describes Mệnh Sửu with Sun Tỵ / Moon Dậu and Mệnh Mùi with Sun Mão / Moon Hợi; it also describes the two luminaries together at the opposite palace. **Caution:** the same page 71 also has a separate `Nhật, Nguyệt tinh minh, tá cửu trùng kim điện` illustration assigning Mệnh Sửu / Sun Mão / Moon Hợi. That is yet another internal location inconsistency; do not treat the entire page as a single coherent rule. The Tỵ/Dậu passage is the explicitly labeled `Nhật, Tỵ, Nguyệt, Sửu cung Mệnh` illustration. These are source-internal cross-references, not proof of a historical printed edition.

Third source: Quách Ngọc Bội's editorial discussion as hosted by Học quán Sơn Chu:
https://sonchu.vn/nghien-cuu/suu-tap-cac-bai-viet-cua-quach-ngoc-boi
See items **14. Nhật Nguyệt đồng lâm** and **15. Nhật Nguyệt tịnh minh**. The author explicitly proposes (i) opposite-palace conjunction at Sửu/Mùi for Đồng Lâm, and (ii) Sun Tỵ / Moon Dậu for the Sửu clause of Tịnh Minh. The author identifies Hợi in the printed Tịnh Minh clause as an apparent book error. **This is editorial commentary, not the printed wording.**

Additional cross-check: same PDF §19.1.5, printed page **229** (zero-based index **228**) describes the symmetrical opposite-palace conjunction under Nhật Nguyệt Chiếu Bích. Link: https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf#page=229 .

Archive candidate: https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV (multi-PDF item, particularly `...dv06.pdf`). Metadata/item existence identified but the scan page was **not successfully visually collated** in this research session; do not use it as verified agreement.

## Case A — Nhật Nguyệt Tịnh Minh (19.2.15)

| Evidence layer | Meaning | Status |
|---|---|---|
| Project span / PDF text | Sun Tý / Moon Hợi when Mệnh/Quan Sửu | Extracted, contradicted by rendered glyph |
| Rendered PDF page 230 | Sun **Tỵ** / Moon Hợi at Sửu; alternative Sun Mão / Moon Hợi at Mùi | Visually checked as printed in 277-page PDF |
| Same-PDF phú giải page 71 | Sun **Tỵ** / Moon **Dậu** at Sửu; Sun Mão / Moon Hợi at Mùi | Visual cross-reference checked |
| Quách Ngọc Bội editorial correction | First clause should be Sun Tỵ / Moon Dậu | Secondary commentary; not original page |
| Current runtime | Sun Tỵ/Ngọ and Moon Dậu/Tý, other conditions | Not semantically equivalent to the full two-branch proposed correction; audit with real placer's reachable cases |

Tasks: verify visually under local downloaded file and hash; record three separate text representations (extracted, visually transcribed, editorial emendation). Do not overwrite historic span. Compare semantic invariants for Sửu Tỵ/Dậu and Mùi Mão/Hợi, plus negative cases, and determine which version the app can honestly implement as which school/edition profile.

## Case B — Nhật Nguyệt Đồng Lâm (19.2.14)

| Evidence layer | Meaning | Status |
|---|---|---|
| Project span / PDF text | Sửu: Sun Tý, Moon Hợi; Mùi: both luminaries at Sửu | Extracted; text layer differs from image |
| Rendered PDF page 230 | Sửu: Sun **Tỵ**, Moon Hợi; Mùi: both stars at Sửu | Visually checked as printed |
| Same-PDF §19.1.5 page 229 | Sửu: both luminaries at Mùi; Mùi: both at Sửu | Source-internal cross-reference |
| Same-PDF phú giải page 71 | Confirms opposite-palace conjunction possibilities | Source-internal support |
| Quách Ngọc Bội editorial correction | Sửu: both stars at Mùi; Mùi: both at Sửu | Secondary commentary |
| Current runtime | Both stars same palace Sửu or Mùi, with Mệnh as target | Distinguish target-palace conjunction from opposition of stars relative to Mệnh/Quan |

Tasks: do not conflate `(a) luminaries in the target palace` and `(b) luminaries jointly opposite the target palace`. Trace relationship semantics through actual `rulesV2` and engine. Proposed emended source rule is not proof that the original 1956 printing had those words.

## Critical integrity instructions

- Do not claim original 1956 printing authenticated; current PDF is re-typeset and its cover year alone proves nothing.
- Do not claim file SHA-256 matched unless someone actually downloaded and hashed the file. GitHub registry is a declared reference, not fresh verification.
- Do not silently replace the 24 stored Tân Biên decisions; create versioned `visual-collation` and `editorial-correction` evidence side by side.
- Do not mark `AI_ACCEPTED`, `MATCH`, `expertVerified`, `pdfTextChecked` or `PUBLIC_READY` just because a secondary commentator proposes a correction.
- A verified image-transcription should explicitly store the PDF page index, printed number, crop/page evidence, and extraction mismatch with Unicode codepoints for `Tý` and `Tỵ`.
- If the source page is accessible, ensure visual checks use the rendered page itself rather than OCR/extraction alone.
- Maintain separate school/edition identity fields and school-aware runtime comparison.

## Important implementation-note targets

- `docs/knowledge/passages/nhat-nguyet-tinh-minh/span.txt`
- `docs/knowledge/passages/nhat-nguyet-dong-lam/span.txt`
- `docs/knowledge/SPRINT_9D_SEVEN_CASE_ADJUDICATION.md`
- `docs/knowledge/SPRINT_9_ADJUDICATION_MATRIX.md`
- `docs/knowledge/sources.json`
- `backend/src/data/rulesV2.json` (**READ ONLY** in research PR)
- source binding, review replay and decision integrity modules.

### Proposed research dispositions

1. `PDF_TEXT_LAYER_MISMATCH_CONFIRMED` for the two Tý/Tỵ tokens, after local visual/hash check.
2. `EDITORIAL_EMENDATION_SUPPORTED_NOT_ORIGINAL` for corrected geometry from Quách Ngọc Bội and internal §19.1.5 / phú giải.
3. `RUNTIME_FORMULA_DIVERGENCE` on any tested scenario violating the chosen *explicitly-labeled* source variant, not a generic unverifiable MATCH.
4. Keep decision unverified until page/binding/identity and semantic conditions have been independently reconciled; close only scoped research tickets on real evidence.
