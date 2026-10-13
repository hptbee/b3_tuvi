# Numerology source inventory

| ID | Evidence class | Locator | Status / allowed use |
|---|---|---|---|
| product-roadmap-v1 | Product specification | docs/ROADMAP_NUMEROLOGY_A_TO_Z.md §4–6 | Proposed calculation convention; implement as experimental numeric calculator, not sourced interpretation |
| independent-arithmetic-v1 | Hand-derived arithmetic | backend/test/fixtures/numerologyCore.json | Independent expected numbers under the product convention; not a domain/edition reference |

No external book/edition has been acquired, authenticated or compared in this implementation. No external formula, book or expert interpretation is marked authenticated or source-verified. Original editorial publication is a separate explicitly labelled gate, recorded below. Do not fabricate bibliographic IDs, citations or interpretations to populate the UI. A future source dossier must specify edition, locator, access rights, conflicts, reviewer and capability decision before sourced prose can be enabled.


## Community reference acquired2026-10-13

- ID `motivational-community-c0535c9`; repository [Motivational-Numerology](https://github.com/evoluteur/motivational-numerology), NPMmetadata version2.3.5; README/comments/package identify Sally Faubion and Olivier Giulieri. Gitrevision `c0535c9c9e7bcdc340b7eed255f89f64146dd8d5` actually cloned/read through GitHTTPSproxy.
- Exact locator [i18n/meaning_en.js](https://github.com/evoluteur/motivational-numerology/blob/c0535c9c9e7bcdc340b7eed255f89f64146dd8d5/i18n/meaning_en.js), symbolic themes in `destiny.1`–`destiny.9`, `destiny.11`, `destiny.22`. SHA256 `612f68459b972d7d1702da3f7337987c0afb837ea467ea6fd2266de0dccb8a92`.
- Evidenceclass `community_reference`, acquisitionstatus `reference_checked`. This checks the public software artifact/locator; **not** expert-reviewed/scientific/bookauthentication. Its README links a book but that book/edition was not acquired or verified. Do not cite the book as evidence read here.
- Repository license AGPL-3.0. No external source code, translations or passages are copied into the product; only broad ideas already common to symbolic number readings are compared. Vietnamese summaries, contextual applications and questions are original editorial writing. No dependency/import of the external library. This dossier credits the community reference without asserting endorsement or equivalence.

| Topic | Community artifact | Product decision / use |
|---|---|---|
| Single-digit symbolic themes | destiny1–9 | General reference for original reflective themes; not assertions about the person |
| 11/22 | destiny11/22 | Separate editorial themes; root not substituted |
| 33 | No matching entry | Withhold interpretations for33, never manufacture source or reuse6 |
| Metric names | destiny/character/personality/agenda/purpose differ from product | Metricrole from product specification; citations only general-number-theme, never claimed exact sourced metricarticle |
| Y | Source conditionalvowel | Productfixedconsonant unchanged; no sourcevalidation claim |
| Masters | Source11/22 | Product11/22/33 unchanged; source does not authenticate rule33 |
| Cycles | Sourcejs/perso.js usesbirthdayrollover | Productcalendar-year unchanged. Cycletext is original reflective planning context using broadnumberthemes, not a translated/sourcedpersonal-cycleforecast |
| Birthday | Source1–31 meanings | Productreducedbirthday unchanged; source is not claimed to substantiate ourreduceddayformula |

Supplementary inspected artifact: NPM `@csessh/sochumenh@0.3.0`, MITlicense, packageauthor agentics-vn; LICENSE identifies La Quoc Thinh2023. Tarballintegrity verified `sha512-scB6AoRzYyhtx//2ccMPQqGUAPvZP4j65LKeXUOfubXF4HMvI1fzZ/fCAhoj3EjMw6TcjchoIM0bwtYxOlU2CA==`; files read asdata withscriptsdisabled, not executed/imported. Statedrepository URL didnotresolve. This is a comparison artifact only, not a publishedcontent source or authenticated book; its imperativecareer/finance-like claims were not adopted.

Acquisition limits ghi tại lần lập registry: direct article HTTP to numerology.com/worldnumerology.com/Wikipedia returned proxy 403; a network grant did not change that result; direct TLS failed DNS. NPM public metadata and Git HTTPS worked for the community artifact above. No forged bibliography was added then.

## Web pages read in the 2026-10-13 audit

A later audit fetch read these Hans Decoz pages. Status `source_read`. `edition_verified=false`. They are not books, and they do not replace the product profile.

| ID | URL | Use |
|---|---|---|
| SRC-DECOZ-METHOD | https://www.worldnumerology.com/do-your-own-reading/ | Component life path with masters; pinnacle inputs keep masters; challenge subtraction; per-name expression; conditional Y; calendar personal cycles |
| SRC-DECOZ-LIFEPATH | https://www.worldnumerology.com/numerology-life-path/ | Same life-path method, with worked dates |
| SRC-DECOZ-PINNACLE | https://www.worldnumerology.com/numerology-pinnacles/ | Pinnacle sums and age `36` minus the single-digit life path |
| SRC-DECOZ-CHALLENGE | https://www.worldnumerology.com/numerology-challenges/ | Absolute differences after master reduction; durations described as approximate |
| SRC-DECOZ-MONTH | https://www.worldnumerology.com/free-forecasts/monthly-numerology-forecast.html | Calendar personal month/day; 11 is not kept on personal cycles |

Conflicts with `pythagorean-vn-v1` 1.2.0 are recorded in [audits/SOURCE_RESEARCH_REPORT.md](audits/SOURCE_RESEARCH_REPORT.md). Do not copy interpretive paragraphs from these pages into the catalog. The earlier 403 note stays as the record of that attempt. Content eligibility remains in [CONTENT_POLICY](CONTENT_POLICY.md).
