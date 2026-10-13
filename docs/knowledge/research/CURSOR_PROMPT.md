# Cursor Execution Prompt — Sprint 9D Visual PDF Collation and Final Two Adjudications

Continue **Sprint 9** (not Sprint 10) in `hptbee/b3_tuvi`, on the latest HEAD of PR #19. Baseline at time of handoff: `f80e10f7bb1bc54d4ad22f54fef208c4fc430bae`. Do not merge or mark Sprint 9 complete.

First read:
- `docs/knowledge/research/SOURCE_FINDINGS.md`
- `docs/knowledge/research/SOURCE_EVIDENCE.json`
- `docs/knowledge/sources.json`
- `docs/knowledge/SPRINT_9D_SEVEN_CASE_ADJUDICATION.md`
- `docs/knowledge/SPRINT_9_ADJUDICATION_MATRIX.md`
- both stored `span.txt` files and reviews/decisions for `nhat-nguyet-tinh-minh`, `nhat-nguyet-dong-lam`.

## Objective: settle the exact remaining textual uncertainty using a directly inspected source page

1. Download the **registered 277-page PDF**, not a different scan:
   `https://tuvithuchanh.com/wp-content/uploads/2022/11/Tu-vi-dau-so.pdf`
   Save privately in the research workspace without adding copyrighted full-book bytes to git. Compute SHA-256 and compare to `941b104504dd552fe967354759da1683dda30a529aa59a8e570b05727f5b4458`. If bytes differ or inaccessible, record blocker rather than claim authenticity.
2. Render zero-based pages **229**, **70**, **228** to images at >=200 DPI and inspect visually. Printed pages are respectively **230**, **71**, **229**. Compare visible glyph with the PDF text layer; page 230 visibly says **Tỵ**, while extracted text/repo `span.txt` says **Tý**, in sections **19.2.14** and **19.2.15**. Verify the difference independently. Record evidence with page images/crops, metadata, positions, Unicode-normalized comparisons, hash and timestamp.
3. Compare the same work's phú giải on printed page 71 and §19.1.5 on printed page 229. Explicitly flag that the same phú giải page 71 also uses **Sửu / Nhật Mão / Nguyệt Hợi** under a different aphorism, so these paragraphs cannot be fused mechanically into one formation. Then read Quách Ngọc Bội editorial commentary, https://sonchu.vn/nghien-cuu/suu-tap-cac-bai-viet-cua-quach-ngoc-boi, sections 14 and 15, and verify its specific suggested corrections. Preserve source-original, text-layer extraction, and modern editorial emendation as distinct claims.
4. Try to retrieve and visually inspect the corresponding page in the archive multipart scan `https://archive.org/details/TuViDdauSoTanBien-VDThaiThuLang-DV` (likely `dv06.pdf`); do not assert that its document is a true 1956 first edition without documentary proof. Archive access failure is acceptable if stated.
5. Separate the **two cases**:
   - *Nhật Nguyệt Tịnh Minh*: printed line has Sửu / Sun Tỵ / Moon Hợi; same-volume phú giải and editor give Sửu / Sun Tỵ / Moon Dậu; second clause Mùi / Sun Mão / Moon Hợi. Determine whether the first printed clause is an internal error and assess placement geometry and reachable charts. Do not silently change Hợi to Dậu in the source quotation.
   - *Nhật Nguyệt Đồng Lâm*: printed line has Sửu / Sun Tỵ / Moon Hợi, and the alternate Mùi / conjunction at Sửu. The same edition §19.1.5 and independent editorial discussion support Sửu / conjunction at Mùi or Mùi / conjunction at Sửu. Compare the competing propositions and reachability. Do not silently substitute the emended formula for the printed one.
6. Compare each *labeled* formula version to the actual `rulesV2.json` and true engine semantics with positive and negative witness fixtures. For Tịnh Minh check both (Sửu, Tỵ/Dậu) and (Mùi, Mão/Hợi) and reject invalid mixtures. For Đồng Lâm explicitly distinguish `stars in target` from `stars opposite target` and verify target Mệnh/Quan. Include counterexamples.
7. Create **versioned research-only** evidence and an updated two-case adjudication matrix. Old 24 Tân Biên decisions, old 39 Sprint 9C decisions, stored spans and original reviews MUST NOT be silently overwritten. Keep all original digests. A new normalized visual span may live beside originals with a separate ID, source binding and explicit reason. Only rerun independent Grok 4.7 High and GPT 5.6 Terra Medium if new evidence requires an actual new semantic judgment; save true invocation/run IDs and initial reviews; no fabricated reviews or forced agreement.
8. Validate regression / tamper / source-binding / unit / integration tests. If a versioned decision can be confidently adjudicated, record an accurate reason and policy version; do **not** translate editorial corrections into `expertVerified: true` or unconditional formula `MATCH`. Keep unsupported historical claims fail-closed.
9. Update `SPRINT_9D_SEVEN_CASE_ADJUDICATION.md`, `SPRINT_9_ADJUDICATION_MATRIX.md`, provenance and issue backlog. Report separately: visually verified working PDF, original-printed-edition verified, raw reading, editorial emendation, runtime equivalence and identity conclusion. CI status must be fetched after push, not assumed.

## Exclusions

- Do not edit `rulesV2.json`, `tuviRules.mjs`, SQLite, public interpretation or any production formula in this research PR.
- Do not fix unrelated P1 E2E/CI issues, refactor frontend or start Sprint 10.
- Do not invent missing pages, OCR results, model runs or historical edition metadata.
- Do not close Sprint 9 simply because seven cases have a written disposition; other unresolved identity/school/source gaps retain their own gates.

## Required output

A focused PR #19 update or smaller stacked research PR, exact source hashes, rendered-page evidence, visual-vs-extraction diff, two evidence-grounded formula comparisons, independent adjudication results and remaining blockers. Explain explicitly whether the two `INSUFFICIENT_EVIDENCE` cases can be downgraded to scoped `SOURCE_TEXT_DISCREPANCY_CONFIRMED` / `EDITORIAL_CORRECTION_SUPPORTED`, without falsely claiming historical certainty or promoting production calculations.
