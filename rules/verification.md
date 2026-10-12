---
type: rule
strength: hard
scope: global
source: synthesized
authority: high
---

# Verification

Hard rule: never claim a check passed unless that check was actually executed and produced supporting evidence.

Hard rule: a failed tool, timeout, missing dependency, skipped suite, or incomplete review is `UNKNOWN / INCOMPLETE`, not `PASS`.

Hard rule: “looks good”, “tests probably pass”, and “the model says it works” are not verification.

Strong guideline: after a fix, re-run the verification that would have caught the original issue, then say what was re-run.

If verification cannot be performed in the current environment, state that limitation and leave the outcome incomplete.
