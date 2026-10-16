# Internal interpretation applicability

From `backend`, generate a JSON snapshot with `node scripts/interpretationApplicability.mjs > before.json`, or use `npm run report:interpretations` to inspect it interactively. Use the direct Node command when redirecting because npm includes its command banner in stdout. After an approved claim change, run `node scripts/interpretationApplicability.mjs --baseline before.json > after.json`.

The fixed cohort is 1,152 validated solar birth inputs: years1984–1995, every month on day15, hours0/6/12/18 and genders-1/+1. Its exact ordered input SHA256 is `832ede7ac4ad680293365b09c2f4f2861a042802d6014d0eb2ad429bdbfdb630`. Calendar and natal calculations use the existing production pipeline. These are engineering regression observations, not expert calendar goldens, population prevalence, empirical prediction accuracy or a product-completion percentage.

Only registered interpretations are evaluated, through production source bindings and eligibility. Candidate star presence and hypothetical approvals are excluded. Binding-verified claim count, positive/negative/unresolved eligibility, all12 palace functions, unique chart applicability, claim-hit counts and pairwise overlaps are reported separately. Thân overlay is excluded. A palace with one eligible and another unresolved claim counts once as positive; each claim's unresolved count remains visible. A negative is an evaluated nonmatch, not proof that the source has no interpretation for that chart.

Snapshots include eligible claim identities on each fixed chart. Comparison rejects incompatible cohort/version/hash, changed or missing rows, duplicate/unknown eligible IDs and invalid target/binding records. Gains/losses and per-palace deltas are derived from rows, not summary totals. A local comparison file does not authenticate historical source approval; preserve its commit identity.

The initial seven-claim subset has92matchingcharts,94claimhits and2charts with overlapping claims. Approved claims occupy Mệnh, Phúc Đức, Quan Lộc and Tài Bạch. New claims must preserve that subset. Targets30% and50% never override source scope or reviews.

The command fails if chart/knowledge construction is unavailable, readings omit a registered claim, or public prose/release gates open. It accepts no private birth inputs or custom approval. It changes no API, chart, claim or release permission. Browser testing is unnecessary for this offline report.
