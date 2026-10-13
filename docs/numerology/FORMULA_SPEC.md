# Core calculator specification — 1.0.0

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

Every result has profile/schema versions, status, raw total, parts, steps, root/master information. Meaning is always null/withheld in this numeric MVP. Birth grid, personal cycles and pinnacles remain not_implemented, not numeric placeholder values.
