# Batch 2 — Deep interpretation knowledge

Research date: **2026-10-17**. Base: main `05e5c2dc8fe4d946e1b6d97002827654ca052213`, after PR #64 merged at 09:08:51 UTC. Branch: `codex/knowledge-research-batch-2`. This packet follows the [canonical roadmap](../../../planning/ROADMAP_KNOWLEDGE_RESEARCH.md) and preserves [Batch 1](../knowledge-first-batch-1/README.md) as a historical snapshot.

The durable deliverable is **nine non-runtime knowledge records**, not a list of acquisition links. Each preserves a stable star/palace identity, registered source/edition, exact retained-text span and hash, Vietnamese meaning, preamble, conditions, relationships, modifiers, exclusions, uncertainties, rights and independent status dimensions.

- [knowledge-records.json](knowledge-records.json): substantive knowledge accepted for bounded research storage, including disputed readings; never a runtime claim registry.
- [DOSSIER.md](DOSSIER.md): deep palace analysis, comparison boundaries and unresolved candidates; each record links its case heading here.
- [comparisons.json](comparisons.json): six concise, separately located Hàm Số comparison observations covering seven cases, referenced without duplicating the web text.
- [evidence.json](evidence.json): corpus identities, full sections read, precise negative searches and acquisition blockers. Existing raw/derived evidence is referenced without rewriting it.
- [major-star-palace-index.json](major-star-palace-index.json): 168 explicit research-navigation cells; literal passage location is separate from contextual depth.
- [build-index.mjs](build-index.mjs) and [validate.mjs](validate.mjs): small offline locator/consistency tools; no app imports, network, ingestion framework or schema changes.

## Actual knowledge gained

Read the complete Tử Tức, Tật Ách and Phụ Mẫu sections in the retained pinned iztro transcription and the readable Wikisource witness. These are related transmission witnesses, not independent authored corroboration. The immutable source/edition IDs and historical authentication scopes are unchanged. The working Wikisource page reports revision 1963110; direct oldid retrieval failed, so this access distinction is recorded.

Nine cases now have manual contextual records: Phụ Mẫu × Tử Vi, Thiên Lương, Thái Dương, Thái Âm; Tử Tức × Tử Vi, Thiên Lương; Tật Ách × Tử Vi, Thiên Lương, Thiên Phủ. The Thiên Lương/Tật Ách record is expressly limited to the Cơ–Lương and Đồng–Lương cohost branches. It supplies no fabricated standalone reading.

New observations include unequal reciprocal wording for Nhật–Lương at Phụ Mẫu, differing conditional granularity in the Vietnamese witness, the need to read opposite-entry cohost qualifications in Tử Tức, and the difference between a broad “tai ít” description and specific adverse disease clauses. Kiếp Sát/Không Vong in the Thiên Phủ/Tật Ách branch remain distinct unresolved names rather than automatically becoming Địa Kiếp/Địa Không. Exact conditions are in the records; historical family, fertility and disease assertions are not verified personal outcomes.

The attributed Nguyễn Phát Lộc web witness enabled seven bounded comparisons with a separately authored attribution. Five records are COMPARED, two remain CONFLICTING, and two are CONTEXT_MAPPED without an independent case-specific comparison. This is not seven authenticated print cross-checks: Hàm Số edition identity, textual collation and permissions remain unresolved. Six shared comparator observations are stored once; the Sun/Moon cases share one observation.

## Metrics and approval separation

Batch 1 had twelve section headings and three initial preamble maps, with no enumerated star/palace grid. This batch establishes all **168/168 index cells** against a named, byte-identified retained corpus. Exact-name searches locate text for every cell: **159 PASSAGE_LOCATED, five COMPARED, two CONFLICTING, two CONTEXT_MAPPED**. Thus **9/168 (5.36%)** have this batch's manually documented deep case evidence. Locating text for 168 cells does not produce 168 interpretations.

Four cells have references only, without their own star-led paragraph: Tật Ách/Tham Lang, Tật Ách/Thiên Lương, Điền Trạch/Thất Sát and Phúc Đức/Thiên Lương. The index exposes this distinction. No NO_PASSAGE_FOUND status is used because references actually occur; the absence observation for a *standalone* Thiên Lương/Tật Ách paragraph is narrower. Prior decisions and approved notes remain valid in their existing exact scopes; the conservative index statuses do not downgrade or replace them.

All nine records have collection COLLECTED and contextual mapping CONTEXT_MAPPED. Comparison, source review, runtime approval and public permission are independent fields. **Source reviews this batch: zero. New runtime approvals: zero. New original print authentications: zero.** Accepted-for-research storage includes uncertainty and disagreement; it is not accepted interpretation. Public interpretation, AI narration and release gates remain closed.

No runtime source registry, interpretation claim, formula, application code, historical T030–T038 evidence or T034 decision changed. Existing applicability numbers were not rerun or used as research-depth measures. No AutoDev, technical review loop, application tests, bulk book acquisition or generated dataset ingestion occurred.

## Remaining candidates and Batch 3 priorities

1. **Resolve the Nhật–Lương reciprocal discrepancy first.** Obtain the exact original pages for both entries; investigate omitted qualifiers and punctuation without choosing the more favorable sentence.
2. **Edition collation:** the official Japanese archive item found via Shuge returned HTTP 403 through the reader. No scan was inspected. The seven-volume work's palace chapters belong to volume 4, so its numbering must not silently be equated with modern Juan2. Hàm Số's forum RAR offers no authenticated print pages or rights basis; it was not downloaded. Seek lawful title/copyright and target-page access.
3. **Complete source-specific terms:** define the actual roster, if any, for 吉星 and 四殺 in the precise clauses; retain named adverse sets separately. Collate the ambiguous Thái Âm clause in the Sun/Phụ Mẫu entry and the final adverse scope in Lương/Tử Tức. Brightness and day/night thresholds remain unspecified here.
4. **Deepen a few cells rather than inventing breadth:** acquire a standalone Thiên Lương/Tật Ách passage from an identifiable edition; compare the three Tật Ách cases with a named independent commentary. Follow KR-04's remaining Tử Vi/Thiên Lương cells beyond these palaces using the locator index.
5. **Schools and rights:** Trung Châu and Phi tinh/Tứ Hóa remain passage-access gaps for these cases. The previously read publisher preview lacks the needed complete palace chapters; no school consensus is inferred. Retain original analysis/locators until any source-text storage permission is established.

## Lightweight verification

From repository root, run `node docs/knowledge/research/knowledge-first-batch-2/validate.mjs`, `npm run docs:links:test`, `npm run docs:links`, and `git diff --check`. The validator checks references, stable identities, exact span hashes, reciprocal links, distinct status dimensions and all 168 literal locations. These checks establish record consistency, not correctness of historical interpretation, original-edition authenticity or expert acceptance. Batch 1's fixed-size validator is unchanged and is not a gate on future source acquisition.

Executed for this batch: packet validation **PASS** (nine records, six comparator notes, 168 cells); documentation-checker tests **PASS**; documentation links **PASS** (289 Markdown files); whitespace check **PASS**. The final change scope is limited to this new research packet, the canonical roadmap and documentation navigation. Existing source registries, decisions, application files, Batch 1 and frozen earlier research remain outside the diff.
