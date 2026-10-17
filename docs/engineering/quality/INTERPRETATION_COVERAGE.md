# Internal interpretation applicability

From `backend`, generate a JSON snapshot with `node scripts/interpretationApplicability.mjs > before.json`, or use `npm run report:interpretations` to inspect it interactively. Use the direct Node command when redirecting because npm includes its command banner in stdout. After an approved claim change, run `node scripts/interpretationApplicability.mjs --baseline before.json > after.json`.

The fixed cohort is 1,152 validated solar birth inputs: years1984–1995, every month on day15, hours0/6/12/18 and genders-1/+1. Its exact ordered input SHA256 is `832ede7ac4ad680293365b09c2f4f2861a042802d6014d0eb2ad429bdbfdb630`. Calendar and natal calculations use the existing production pipeline. These are engineering regression observations, not expert calendar goldens, population prevalence, empirical prediction accuracy or a product-completion percentage.

Only registered interpretations are evaluated, through production source bindings and eligibility. Candidate star presence and hypothetical approvals are excluded. Binding-verified claim count, positive/negative/unresolved eligibility, all12 palace functions, unique chart applicability, claim-hit counts and pairwise overlaps are reported separately. Thân overlay is excluded. A palace with one eligible and another unresolved claim counts once as positive; each claim's unresolved count remains visible. A negative is an evaluated nonmatch, not proof that the source has no interpretation for that chart.

Snapshots include eligible claim identities on each fixed chart. Comparison rejects incompatible cohort/version/hash, changed or missing rows, duplicate/unknown eligible IDs and invalid target/binding records. Gains/losses and per-palace deltas are derived from rows, not summary totals. A local comparison file does not authenticate historical source approval; preserve its commit identity.

The initial seven-claim subset has92matchingcharts,94claimhits and2charts with overlapping claims. Approved claims occupy Mệnh, Phúc Đức, Quan Lộc and Tài Bạch. New claims must preserve that subset. Targets30% and50% never override source scope or reviews.

The command fails if chart/knowledge construction is unavailable, readings omit a registered claim, or public prose/release gates open. It accepts no private birth inputs or custom approval. It changes no API, chart, claim or release permission. Browser testing is unnecessary for this offline report.

## First foundational tranche

Four separately reviewed source opening annotations add Thiên Lương at Thiên Di and Nô Bộc, Cự Môn at Thiên Di, and Thiên Cơ at Điền Trạch. The exact direct-host predicates and attributed wording have actual independent source decisions; this does not approve an integrated palace judgment or real-life prediction. Historical Nô Bộc terminology remains historical servants, without generalization to modern friends or colleagues.

The unchanged fixed cohort rises from92/1152(7.99%) to419/1152(36.37%):327newly matching charts,92retained,0lost. Registered source-bound claims increase7→11 and palace coverage4→7. There are472claimhits over419distinctcharts;53charts have overlapping claims. Existing seven-claim membership sets remain unchanged. Per-palace positives are Mệnh2, Phúc Đức38, Quan Lộc22, Tài Bạch30, Điền Trạch92, Nô Bộc92 and Thiên Di194; Phụ Mẫu, Tật Ách, Tử Tức, Phu Thê and Huynh Đệ remain0. These counts describe eligible internal source notes, not public readings or complete interpretations.

Each new claim's positives/negatives on the1,152charts are: Thiên Lương–Thiên Di96/1056, Thiên Lương–Nô Bộc92/1060, Cự Môn–Thiên Di98/1054, Thiên Cơ–Điền Trạch92/1060. None has an unresolved runtime predicate on this cohort. Retained source modifiers and historical authentication remain outside that runtime observation. Full evidence and exact scope are recorded in the [source packet](../../knowledge/research/juan2-palace/foundational-single-star-packet/CURRENT_STATUS.md).
