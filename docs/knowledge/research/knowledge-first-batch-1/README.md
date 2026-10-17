# Knowledge Research & Acquisition — Batch 1

Observed **2026-10-17**; branch started from main `492eedd0a966cecd910bd4f07ab5f266236f5cb9`. This packet implements the first bounded batch of the [canonical research roadmap](../../../planning/ROADMAP_KNOWLEDGE_RESEARCH.md). It contains research observations, not source-review decisions.

- [Inventory assessment](inventory.json): all 14 registered sources and five editions, preserving registered identities and authentication scopes. This is an assessment overlay referencing [sources.json](../../sources.json), not another registry.
- [Acquisition assessment](ACQUISITION.md): ranked books, six pinned repositories, dataset rights and source dependencies.
- [Comparative dossier](DOSSIER.md): terminology and contextual interpretation findings from actually readable passages.
- [Twelve-palace evidence/gap index](PALACE_GAPS.md): all section headings located; initial governing-context maps for the three priority gaps.
- [Evidence observations](evidence.json): pins, file identities, dependency comparisons, publisher-preview hash, revision URLs and access failures. Run `node docs/knowledge/research/knowledge-first-batch-1/validate.mjs` from the repository root.

## What was accomplished

**KR-01: initial inventory audit delivered; continuing.** All 14/14 registered source records and 5/5 edition records have separate access, identity, original-authentication, collation, reuse and research assessments. Eleven provisional provenance clusters are identified among registered sources; these are not eleven independent books read. Website host clusters may conceal further borrowed sources. Bibliographic introductions, retailer excerpts, attributed web text and retained transcriptions are explicitly distinguished. No new original print edition was authenticated or fully collated.

**KR-07: initial assessment delivered; continuing.** All six requested repositories have commit pins and selected-file inspection. Two important dependencies were established: Ziwei Chat imports Renhuai passages; all 18 knowledge-db blobs compared between por7 and Ziwei Chart match exactly at the recorded pins. The x-iztro pack declares iztro-docs ancestry. A publisher's ten-page preview supplied actual new Chinese commentary; Vietnamese and Chinese catalog leads supply acquisition routes, not full-book reading. No large dataset or unclear-rights book was downloaded.

**KR-02: bounded comparative pilot delivered; continuing.** The dossier compares five concrete questions. It preserves unresolved terminology, contextual qualifications and the difference between authored commentary and classical transcription. Two distinct authored traditions are consulted for the Thiên Phủ comparison, but the Vietnamese attribution is not authenticated against a print edition. This is qualified comparative research, not independent source acceptance.

**KR-03: preparation delivered.** Twelve palace sections are located; three preambles have initial context maps. No 14 × 12 interpretation grid is claimed complete. The nine other section headings are an index, not nine newly mapped interpretations.

## Quality snapshot and boundaries

Before this batch, the roadmap's research-depth measures were not baselined. This batch establishes record-level assessment accountability at 14/14 sources and 5/5 editions, repository assessment at 6/6 requested repositories, section location at 12/12 palaces, and initial priority-preamble mapping at 3/12. Major-star/palace cell indexing and two-family cell comparison have **not** been completed or counted. Findings K01–K05 each retain a locator, context, uncertainty and next action; none is REVIEW_READY or SOURCE_REVIEWED. External lead counts are not added to the registered-source denominator.

Inventory access states include two introduction-only records, one catalog-search-only record and one retrieval-error record. Other records range from articles and retailer excerpts to retained bounded evidence and transcriptions; none of these categories implies an authenticated complete ebook. Rights and edition gaps remain explicit in every assessment. Unknown-rights artifacts are limited to locators, metadata and original bounded notes; no reuse clearance is inferred from accessibility.

For the 14 registered records, the complete access grouping is: six currently readable text records (one transcription, one attributed web excerpt, one retailer excerpt, three articles); three retained-evidence records; two introductions; one search-only catalog lead; one internal local catalog; one retrieval error. These are access categories, not six independent usable books. Rights assessment: ten records explicitly RIGHTS_UNCLEAR; two distinguish classical work from modern transcription rights and retain bounded notes only; one internal catalog grants no external rights; one software record has an observed MIT notice without third-party text clearance. Thus all 14 have explicit states, but none gains a blanket corpus-reuse clearance from this audit. The five edition access states are separately recorded rather than added to these source totals.

Historical engineering baseline is retained as reported: 14 internal executable claims across nine palaces; 647/1,152 charts (56.16%), 770 claim hits and 123 overlapping charts. These figures were **not rerun** and measure applicability, not research depth or predictive validity. Existing source decisions, runtime bindings, formulas, T030–T038 evidence and unresolved T034 are unchanged. Source review was not executed. Runtime approval was not requested. Public interpretation, AI narration and release permissions remain closed. AutoDev, technical review loops and application CI were not invoked.

## Durable handoff: next bounded batch

1. Obtain lawful title/copyright pages and the relevant Thiên Phủ/Không Kiếp pages of *Tử Vi Hàm Số*. Resolve the 1972 marketing date versus catalogued 1974 original/1980 reprint before assigning edition identity. Compare the attributed web excerpt against that edition.
2. Seek an identifiable original Quanshu scan for the Juan2/3 preambles and Juan1 Thiên Phủ passage. Collate rather than treating iztro and Wikisource as independent traditions. Preserve T034's separate unresolved evidence.
3. Extend the three priority preambles into explicitly indexed star cells, retaining Sun/Moon, day/night, cohost, adverse and relational conditions. Do not extract stand-alone family/health predictions.
4. Acquire a permitted bounded extract of the named Trung Châu lectures; pursue an identifiable Phi tinh/Tứ Hóa source before comparing schools. The current retailer/search leads do not establish that coverage.
5. Continue ambiguity dossiers for 吉星, 空/耗, brightness vocabularies and Tứ Hóa. The x-iztro pack can supply modern terminology contrasts, never substitute for an original textual witness. Keep generated datasets out of the evidence denominator for expert validation.

Validation performed: the packet consistency check passed (14 sources, five editions, six repository pins, 18 matching fork blobs and the retained Juan2 hash); `npm run docs:links:test` passed; `npm run docs:links` passed with 287 Markdown files scanned; `git diff --check` passed. The packet check preserves unknown authentication fields as unknown rather than treating them as false. No application tests or external repository code were run. Git delivery is recorded in the batch PR. Re-run only the lightweight packet and documentation checks when this packet changes.
