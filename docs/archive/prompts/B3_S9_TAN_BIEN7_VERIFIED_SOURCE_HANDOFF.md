# B3 Tử Vi — Sprint 9D: Source handoff for 7 unresolved Tân Biên cases

Research date: 2026-10-13. PR #19 reviewed at `00f93ccdb03c1dd9bec0f1ff162552bcccc1a51c`.

## What was actually verified

- Checked stored Tân Biên spans from `docs/knowledge/passages/<slug>/span.txt`, their two stored review JSON files, and actual `backend/src/data/rulesV2.json` at PR head.
- Independently opened seven **public HTML pages** on `108s.tw`: 250, 223, 207, 197, 268, 196, 222. Verified page titles and substantive `形成條件` text. These are modern descriptions, **NOT verification of Tân Biên printed pages or evidence of a shared school**.
- Opened Wikisource `紫微斗數全書/卷一`; the site exposes an `oldid=7913704` for that transcription. This is not a checked historical edition.
- Did **not** obtain/reopen the original Tân Biên PDF, verify its PDF SHA, check actual page scans, or rerun either configured model. Do not claim page-level binding.

## Source URLs checked (HTML)

1. 日月並明格 (Nhật Nguyệt Tịnh Minh): https://www.108s.tw/article/info/250 — `形成條件` lines 41–45; sample chart configurations lines 51–66.
2. 巨日同宮格 (Cự Nhật Đồng Cung): https://www.108s.tw/article/info/223 — `形成條件` lines 41–45; explanation lines 65–66. **Internal inconsistency**: the first formation sentence says 寅 or 未, while later text contrasts 寅 and 申. Do not silently correct source spelling.
3. 七殺朝斗格 (Thất Sát Triều Đẩu): https://www.108s.tw/article/info/207 — `形成條件` lines 41–45.
4. 武貪同行格 (Tham Vũ Đồng Hành): https://www.108s.tw/article/info/197 — `形成條件` lines 41–43; sections 55–58 clarify basic vs high-grade variants.
5. 馬落空亡格 (Mã Lạc Không Vong): https://www.108s.tw/article/info/268 — `形成條件` lines 41–43.
6. 紫府朝垣格 (Tử Phủ Triều Viên): https://www.108s.tw/article/info/196 — `形成條件` and four illustrated configurations; modern school-specific explanation.
7. 日月同臨格 (Nhật Nguyệt Đồng Lâm): https://www.108s.tw/article/info/222 — `形成條件` says both luminaries share Sửu or Mùi, distinguishes quý-grade requirements.
8. Digitally transcribed older text: https://zh.wikisource.org/w/index.php?title=紫微斗數全書/卷一&oldid=7913704 — `定貴局` names 七殺朝斗, 日月並明, 日月同臨 and 紫府朝垣, usually referring the reader to earlier annotations; `定貧賤局` names 馬落空亡, and the prose has 馬遇空亡. These references are helpful corroboration of names, **not complete conditions**.

## Case-specific adjudication findings

### 1. Nhật Nguyệt Tịnh Minh — `nhat-nguyet-tinh-minh`
- Tân Biên stored span at locator `19.2.15+19.5` specifies separate placements, including Sun at Tý/Mão and Moon at Hợi, and an Mệnh/Quan at Sửu/Mùi. **Verify the printed page and relationship geometry** before relying on these coordinates: the stored text is not equivalent to the broad modern bright-Sun-and-Moon definition on 108s #250.
- Grok conditions include standalone `avoid_tuan` and `branch_ty`; Terra omits them but both include `avoid_tuan_triet`. Investigate duplicate condition modeling and Vietnamese `Tý` vs `Tỵ` normalization. `avoid_tuan` need not be a second standalone condition if `avoid_tuan_triet` already captures both (requires schema semantics, not just spelling).
- `rulesV2.json` checks different Sun/Moon branch sets from the stored Tân Biên span. Strong **formula-scope conflict candidate**, NOT approved formula change.
- **Next evidence gate:** original edition PDF page + page-index offset + passage comparison; if mismatch, version corrected extracted span and reviews, never rewrite prior evidence.

### 2. Cự Nhật Đồng Cung — `cu-nhat-dong-cung`
- Tân Biên stored excerpt says Cự Môn and Thái Dương together in Mệnh, with **no branch requirement** in that passage.
- Both existing model reviews extracted the same conditions; votes `PARTIAL` and `MATCH`.
- Runtime adds `branches:[Dần,Thân]`, meaning it is narrower than the quoted Tân Biên condition. On **that source only**, equality (`MATCH`) is not demonstrated; this is at least a scope difference.
- 108s #223 is itself internally inconsistent between 寅/未 (first formation statement) and 寅/申 (later paragraph). Use additional source (e.g. https://www.108s.tw/article/info/348) before claiming a branch is a universal condition.
- **Next:** compare `source_conditions` vs `runtime_conditions` side-by-side and ask a scoped independent adjudication, not a generic full re-review.

### 3. Thất Sát Triều Đẩu — `that-sat-trieu-dau`
- Tân Biên stored span `19.2.8+19.5`: target can be Mệnh or Quan Lộc; Dần/Thân; Thất Sát tọa thủ; opposite has Tử Vi and Thiên Phủ together.
- Modern #207 independently describes an underlying Mệnh Dần/Thân + opposite 紫微天府 recognition, and separates quý-grade auxiliaries.
- Runtime instead allows Thất Sát at Mệnh Dần/Thân/**Tý/Ngọ**, and does not enforce the opposite Tử/Phủ. That permits cases unsupported by the stored Tân Biên formula.
- **Strong source-to-runtime conflict candidate.** Do not treat 108s quý-grade extras as required formation conditions; do not rewrite runtime in Sprint 9.

### 4. Tham Vũ Đồng Hành — `tham-vu-dong-hanh`
- Tân Biên stored span: Tham Lang + Vũ Khúc same Mệnh at Sửu or Mùi. Runtime `samePalace` and `branches:[Sửu,Mùi]` implement this basic structure.
- Both stored model votes are `MATCH`. Terra adds `branch_suu` on top of `branch_suu_mui`, while Grok lists only `branch_suu_mui`.
- **Candidate for deterministic evidence-supported adjudication:** `branch_suu` is a *subset* of `branch_suu_mui`; the Tân Biên excerpt names both Sửu and Mùi, so Sửu-only is **not** an additional universally required condition.
- Modern #197 distinguishes both Sửu/Mùi basic formation from Sửu stronger quý-grade and also recognizes a distinct 辰/戌 opposing-stars configuration. Do not replace the Tân Biên rule with the modern expansion.
- Preserve raw conflict; document normalized formation agreement separately. Only rerun if traceability/policy requires it.

### 5. Mã Lạc Không Vong — `ma-lac-khong-vong`
- Stored Tân Biên `19.3.8+19.5`: Thiên Mã at Mệnh meets Tuần/Triệt; supplementary `19.5` discusses mitigation and additional bright stars, not mandatory formation.
- Grok misses explicit Tuần/Triệt while Terra includes `avoid_tuan_triet` plus `bright`. That merges recognition with mitigation. Both reviews' formula labels differ.
- Runtime allows Mã in tam phương tứ chính with Địa Không or Tuần/Triệt: wider scope than Tân Biên.
- Modern 108s #268 instead defines encounters with **Địa Không/Địa Kiếp** same or opposing palace (no Tuần/Triệt as necessary basic condition). These are different source formulas; record a school/source variant, do not assume one overwrites the other.
- Wikisource's aphorism mentioning 馬遇空亡 is too short to specify which void stars/positions.
- **Next:** source-specific condition matrices: Tân Biên recognition vs 108s recognition vs runtime, plus supplementary mitigation as separate section.

### 6. Tử Phủ Triều Viên — `tu-phu-trieu-vien`
- Stored Tân Biên `19.2.2+19.5`: Mệnh or Quan; **either** bright Tử Vi at target with Thiên Phủ shining/opposing **or** bright Thiên Phủ at target with Tử Vi shining/opposing.
- Grok conditions include brightness embedded in star-specific IDs; Terra adds general `bright`. Investigate whether the latter is redundant rather than independent mandatory evidence.
- Runtime requires the pair only within Mệnh's `tam_phuong_tu_chinh`, with no brightness or alternative target semantics; does not implement the exact Tân Biên predicate.
- Modern 108s #196 describes broader 紫微/天府 meeting Mệnh in 三方四正 with several configurations and optional stricter grade. Do not elevate broad description over specific Tân Biên wording.
- **Next:** represent Tân Biên formula as disjunction of two branches and keep `recognition`, `bright/grade`, and `target palace` separate.

### 7. Nhật Nguyệt Đồng Lâm — `nhat-nguyet-dong-lam`
- Stored Tân Biên `19.2.14+19.5` includes a text about Mệnh/Quan at Sửu/Mùi with Sun at Tý, Moon at Hợi or both at Sửu opposite, not plainly the same as modern #222.
- Existing Grok lists extra `branch_ty`, `branch_hoi`, `star_nhat_nguyet`; Terra does not. The dispute is not resolved by ignoring these tokens.
- Modern 108s #222 defines **Sun and Moon same palace at Sửu/Mùi**, distinct from the specific stored Tân Biên text.
- Runtime implements same-palace at Sửu/Mùi. It may match 108s recognition but cannot be promoted as matching stored Tân Biên until printed-page source verification.
- **Next evidence gate:** obtain the exact Tân Biên PDF edition used by source registry, verify hash, check the printed passage, compare branch/charts; preserve edition variants and research original wording.

## Primary-source access leads (NOT VERIFIED AS SAME FILE)

- Tân Biên 1956, 277 pages text edition listing and Google Drive link: https://vietbooks.info/threads/tu-vi-dau-so-tan-bien-nxb-tin-duc-thu-xa-1956-thai-thu-lang-277-trang.23142/
- Scribd 277-page version with web reading: https://www.scribd.com/doc/289515451/T%E1%BB%AD-Vi-%C4%90%E1%BA%A7u-S%E1%BB%91-Tan-Bien-Van-%C4%90%E1%BA%B1ng-Thai-Th%E1%BB%A9-Lang

These are **discovery leads**, not validated hashes, permission to republish, or confirmed matching PDF to source registry. Access lawfully; store copies only where permitted, never commit a third-party copyrighted book into public Git without permission.

## Quality gate / recommended decision process

For each contested source-specific claim, verify: edition and page when possible → identity → exact quoted clause → classify recognition vs grade vs modifier vs exception → normalize equivalent/subset condition IDs → compare runtime set inclusions on concrete counterexamples → ask two model reviewers to adjudicate a specific remaining question (if needed) → use versioned decision and audit trail; do not overwrite old results.

Do not report `SOURCE_VERIFIED` solely because a modern page HTTP 200 or two models agreed. Do not report `MATCH` unless *the chosen edition/school's* required conditions match the runtime semantic predicate, not just star names. `expertVerified=false` until human specialist verification. Sprint 9 stays open under user's policy.
