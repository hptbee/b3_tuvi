# Findings

## T001 — V2-M0-05

- reviewer: b5284d13-8f6a-49ac-9b44-0557a58f593b
- result: no confirmed findings
- residual: file symlink end-to-end skipped when the OS returns EPERM; hard-link write-through is the executed fixture. Check-then-open is not atomic. Temp dirs from older cases are not all removed.
- fix before commit: `finally` cleanup for the new outside sentinel and rollback/recovery dirs. Not a product defect.
