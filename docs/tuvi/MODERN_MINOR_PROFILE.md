# Tiểu hạn: explicit-age modern source profile

The optional profile `iztro-pinned-age1-sex-triad` places a supplied nominal age on the existing natal chart. Its source is the pinned modern iztro implementation, separately reviewed from the classical Quanshu material. It provides a structural location, with interpretation and public fortune predictions withheld.

In the chart evidence panel, select the iztro variant, enter a nominal age (tuổi mụ) from 1 through 120, and apply it. The application does not calculate that age from today's date, the viewing year or the birth date. Changing the birth input clears the optional age/profile. Annual Thiên Đức/Nguyệt Đức viewing-year controls remain independent.

## Exact supported mapping

| Natal birth-year branch | Age-1 branch |
| --- | --- |
| Dần, Ngọ, Tuất | Thìn |
| Thân, Tí, Thìn | Tuất |
| Tị, Dậu, Sửu | Mùi |
| Hợi, Mão, Mùi | Sửu |

Male moves forward and female backward by one palace per age, wrapping after twelve. Product gender codes are strictly `1` and `-1`. Ages outside 1–120 are unsupported. The existing server natal lunar-year branch is the input; its name and index must agree. No upstream `yearDivide`, birthday or leap-month age convention is inferred by this projection.

## API

`POST /api/interpretations/analyze` retains the existing birth fields and accepts one optional object:

```json
{
  "day": 15,
  "month": 6,
  "year": 1990,
  "hour": 8,
  "gender": 1,
  "minorPeriod": {
    "profile": "iztro-pinned-age1-sex-triad",
    "nominalAge": 1
  }
}
```

A present object requires exactly `profile` and `nominalAge`, with an exact known profile and numeric integer age. Null, arrays, numeric strings, fractional/out-of-range ages, missing or extra keys return HTTP 400 with `code: invalid_minor_period`. The error does not echo the submitted values. The existing `/ask` analysis-failure wrapper remains unchanged.

The additive result is `time.capabilities.tieu_han_modern`. A successful result identifies the profile, pinned modern source, supplied age, trusted birth-year branch, resulting branch and actual natal palace/function. It states `ageInput: caller_supplied`, `ageDerivation: not_applied`, `calendarCompatibility: branch_sex_age_projection_not_full_iztro_astrolabe`, `publicFortune: false` and `interpretation: null`. The UI verifies the source/profile/age and actual response palace mapping before displaying it.

Omission yields `not_applied` with no branch or mapped palace. Missing or invalid approval evidence yields `blocked` rather than an unreviewed placement. A malformed trusted lunar/sex record cannot place a branch. A corrupted natal layout cannot establish a mapped palace, even when branch arithmetic is otherwise valid. This optional result does not replace the separate blocked classical `tieu_han` capability.

## Evidence and limits

The [source dossier](../knowledge/research/fortune/modern-minor/README.md) preserves exact source, context, fixtures, actual model judgments and decision replay. Independent checks cover all birth-branch/sex combinations, all supported ages, actual natal layouts, Tết boundaries and leap-month births. These validate structural correspondence and engineering behavior; they are not empirical life-outcome goldens.

The modern software source/edition remains secondary and historically unauthenticated, with book/expert verification false. Approval does not certify full iztro calendar/natal equivalence, authenticate an ancient edition, settle the classical Đại hạn/Tiểu hạn source-profile conflicts, release narration or authorize predictions. No calculation is stored, and no new account/history feature is introduced.
