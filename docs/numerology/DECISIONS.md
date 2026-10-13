# Numerology MVP decisions

Implementation convention: `pythagorean-vn-v1`, version 1.0.0, experimental.

- D01/D02/D03: use proposed Pythagorean all-date-digits calculation and per-metric 11/22/33 preservation. A 11/09/2000 divergence fixture prevents silent switch to component reduction.
- D04/D05/D06/D09: optional entered name, Latin/Vietnamese accent normalization, explicit Y=consonant, missing name/subsets unavailable. No name inferred from Tu Vi or browser storage.
- D08: Gregorian date-only, integer fields, same supported year bounds as current product; injected referenceDate rejects future dates.
- D11: no externally reviewed content exists. All meanings withheld; no positive source-verification flags and no AI prose.
- D12: POST calculation, no personal query string or persistence; no-store and safe logging tested at API boundary.
- D07/D10: cycles and pinnacle/challenge policies remain future V1 work; not enabled by this initial implementation.

Request to start implementation authorizes developing this product convention. It does not certify the numerological method, authorize production release or turn arithmetic fixtures into expert golden cases. Changing Y/master/all-digits semantics requires a new explicit profile version and fixtures.
