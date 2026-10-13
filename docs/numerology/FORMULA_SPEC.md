# Core calculator specification — 1.2.0

Status: experimental product convention, not externally source-verified. Implementation starts from the proposed numerical rules in [the roadmap](../ROADMAP_NUMEROLOGY_A_TO_Z.md), following the owner's request to implement. This does not promote any source, formula, or personal interpretation status.

The pure calculator accepts Gregorian integer birthDate (1200–2199), an optional Latin/Vietnamese fullName and an injected referenceDate. No hidden clock, database, network, hour or gender. Future birth dates are invalid. Missing name is allowed; unsupported characters are errors.

| Metric | Formula | Masters |
|---|---|---|
| lifePath | All birth-date digits summed, then reduced | 11/22/33 |
| birthday | Day number reduced; originalDay retained | 11/22 |
| attitude | Day and month digit sums reduced | None |
| expression | All normalized letter values | 11/22/33 |
| soulUrge | A/E/I/O/U vowel values | 11/22/33 |
| personality | Consonant values; Y is always a consonant | 11/22/33 |
| maturity | lifePath.value + expression.value | 11/22/33 |

Reduction records each input/digits/output step and retains rootValue (1–9). A metric keeps a master at any reduction step; attitude always reduces to 1–9. Empty name subset is unavailable, not 0. Maturity requires a supplied name.

Name policy: reject control/format and Unicode default-ignorable characters before normalization (including hidden combining grapheme joiner and variation selectors), then NFC trim and a 100-codepoint bound. Decompose Latin/Vietnamese accents with NFD, Đ→D, uppercase, and treat spaces/hyphen/apostrophes as separators. A–Z map to repeating 1–9 (A/J/S=1, … I/R=9). Combining accents must follow a supported Latin letter and belong to this explicit set: U+0300, U+0301, U+0302, U+0303, U+0304, U+0306, U+0307, U+0308, U+0309, U+030A, U+030B, U+030C, U+030F, U+0311, U+031B, U+0323, U+0324, U+0325, U+0326, U+0327, U+0328, U+032D, U+032E, U+0330, U+0331. Only these accents are removed; NFC/NFD Vietnamese and common accented Latin spellings produce equivalent letters. Other combining marks (for example Devanagari vowel marks and enclosing keycaps), unsupported ligatures and scripts are rejected rather than silently transliterated.

Every result has profile/schema versions, status, raw total, parts, steps, root/master information. Meaning remains null/withheld until a separately eligible content policy is enabled. Birth grid, personal cycles, and pinnacles/challenges are implemented as versioned experimental capabilities. Catalog 1.2.0 adds experimental editorial for pinnacle stages and challenges 1–8. Challenge 0 and number 33 stay without a reading.

## Birth grid — capability version1.0.0

Format the validated date as **DDMMYYYY** (8 digits). Count1–9 without reduction; zeros, including day/month padding zeros, increment `ignoredZeroCount` only. Grid rows3/6/9,2/5/8,1/4/7; layoutVersion3-6-9-v1. Do not add lifePath/name/calculated digits. Present+ignored counts conserve8.

Eight lines:123,456,789,147,258,369,159,357. `present` iff all3digits appear, `absent` iff none, otherwise `partial`; repeats never imply a complete line. Names/psychological meanings of lines are not inferred. Empty cells describe absence from this date, not a lack of ability.

## Personal cycles — capability version1.0.0

Optional strict ISO `targetDate`, validated Gregorian1200–2199 and not before birth. Omitted defaults to injectedreferenceDate captured by HTTP in Vietnam. Future viewing dates through2199 are allowed; futurebirths remain rejected. Each response includes exact targetDate and policycalendar-year-v1.

Year = reduce(digitSum(birthDay)+digitSum(birthMonth)+digitSum(targetYear),false). Month = reduce(personalYear.value+digitSum(targetMonth),false). Day = reduce(personalMonth.value+digitSum(targetDay),false). **All three reduce to1–9, including totals11/22/33.** Periods follow calendar year January1–December31, month and day; no birthday rollover. Parts/reduction traces are serialized exactly like core metrics. No implicit clock or inferred astrology.

Capability version 1.1.0 adds two views that reuse those formulas. `yearBand` is nine calendar years. It starts at the year whose personal year is 1 and that contains the selected year. If that window would leave 1200–2199, it shifts so all nine years stay inside the range. `months` is January–December of the selected personal year. The selected year and month match `personalYear` and `personalMonth`. Each year and month carries `viewDate`: the earliest valid target on or after the birthday for that cell, or `null` when the whole cell is before birth. The client sends that date and does not recompute either list.

## Name chart and combined chart — capability version 1.0.0

`pythagorean-letter-count-v1` counts the same normalized letters used by Expression. Each letter value 1–9 increments one cell. The layout is the birth-grid layout so the two charts can be compared. It does not reduce to a single number and it does not assign arrow meanings. Missing name returns `unavailable`, not an empty zero grid.

`birth-name-presence-v1` pairs each digit 1–9 with `birth` count, `name` count, and `presence`: `both`, `birth`, `name`, or `neither`. A name that contains a digit absent from the date does not “fill” or repair that cell. Missing name leaves the combined chart unavailable.

Active profile/schema1.2.0 adds pinnacles and challenges without changing the seven core numeric formulas, the birth grid, or personal cycles. Explicit requests for inactive profile1.1.0 or1.0.0 return404; no silent version substitution. Original fixtures retain their expected core numbers. These are product conventions, not externally verified school claims.

## Pinnacles and challenges — capability version1.0.0

Policy `component-reduce-root-age-v1`. Reduce month, day, and year separately with masters off: November 11 becomes 2 and day 22 becomes 4. P1 is the reduced month plus day, P2 the reduced day plus year, P3 the P1 value plus P2 value, and P4 the reduced month plus year. Those four sums keep 11/22/33. P3 can be 22 when both inputs are 11; 33 is not produced by these sums. Challenges are absolute differences of the same pairs, and the third challenge is the absolute difference of the first two challenge values. A challenge of 0 stays 0. It is not treated as missing.

The first period ends at age `36 - lifePath.rootValue`, using the 1–9 root even when the life path is 11, 22, or 33. The next periods last nine years, nine years, then the open remainder. Age is the number of birthdays reached on the same `targetDate` used by cycles, not `targetYear - birthYear`. A 29 February birth uses 1 March in a non-leap year and 29 February in a leap year. Each period includes its start and end ages. The transition day belongs to the newly entered period only. Period dates may fall after 2199; that does not make the birth date invalid.

These objects carry reduction traces for pinnacles and operands for challenges. Catalog 1.2.0 attaches experimental editorial to pinnacle values 1–9, 11 and 22 and to challenge values 1–8. Challenge 0 stays withheld with reason `content_not_in_scope` and is not rewritten as 9. Number 33 has no reading. A client-supplied `pinnacles` field is rejected.
