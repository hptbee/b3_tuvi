import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { interpretationApplicabilityReport, compareApplicability, fixedCoverageInputs } from '../scripts/interpretationApplicability.mjs';

// Independent prior source-fixture/grid observations; future claims preserve this subset.
const oldCounts = {
    'interp-tu-phu-dong-cung-giap-menh': 2,
    'interp-quanshu-tai-bach-tu-vi-four-adverse-host': 22,
    'interp-quanshu-phuc-duc-dong-luong-host': 20,
    'interp-quanshu-quan-loc-co-cu-dau-host': 4,
    'interp-quanshu-phuc-co-cu-host': 18,
    'interp-quanshu-tai-tuvi-pha-quan-host': 10,
    'interp-quanshu-quan-co-cu-mao-host': 18
};
const report = interpretationApplicabilityReport();
assert.equal(report.inputSha256, '832ede7ac4ad680293365b09c2f4f2861a042802d6014d0eb2ad429bdbfdb630');
assert.equal(report.chartMatches.length, 1152);
assert.deepEqual(report.chartMatches.map(r => r.input), fixedCoverageInputs());
assert.equal(Object.keys(report.perPalace).length, 12);
for (const [id, positive] of Object.entries(oldCounts)) {
    assert.equal(report.perClaim[id].positive, positive, id);
    assert.equal(report.perClaim[id].negative, 1152 - positive, id);
    assert.equal(report.perClaim[id].unresolved, 0, id);
    assert.equal(report.perClaim[id].bindingVerified, true);
}
const oldMatches = report.chartMatches.map(r => r.eligibleClaimIds.filter(id => Object.hasOwn(oldCounts, id)));
assert.equal(oldMatches.filter(ids => ids.length).length, 92);
assert.equal(oldMatches.filter(ids => ids.length > 1).length, 2);
assert.equal(oldMatches.reduce((n, ids) => n + ids.length, 0), 94);
for (const p of Object.values(report.perPalace)) assert.equal(p.positive + p.negative + p.unresolved, 1152);
assert.equal(Object.values(report.claimCountHistogram).reduce((a, b) => a + b, 0), 1152);
for (const row of report.overlap) assert.equal(row.charts,
    report.chartMatches.filter(r => row.claimIds.every(id => r.eligibleClaimIds.includes(id))).length);
assert.deepEqual(compareApplicability(report, report), { gainedCharts: 0, lostCharts: 0, retainedCharts: report.summary.chartsWithAnyClaim,
    netCharts: 0, perPalace: Object.fromEntries(Object.entries(report.perPalace).map(([id, p]) => [id, { gained: 0, lost: 0, before: p.positive, after: p.positive }])) });

// Explicitly synthetic snapshots: comparison must derive counts from rows, not stale totals.
const none = structuredClone(report);
none.chartMatches.forEach(r => { r.eligibleClaimIds = []; });
assert.equal(compareApplicability(report, none).gainedCharts, report.summary.chartsWithAnyClaim);
assert.equal(compareApplicability(none, report).lostCharts, report.summary.chartsWithAnyClaim);
const firstPositive = report.chartMatches.findIndex(r => r.eligibleClaimIds.length);
for (const mutate of [
    r => { r.schemaVersion = 2; }, r => { r.cohortId = 'other'; }, r => { r.inputSha256 = '0'.repeat(64); },
    r => { r.chartMatches.pop(); }, r => { r.chartMatches = {}; }, r => { r.perClaim = []; },
    r => { r.chartMatches[0].input.year = 2000; }, r => { r.chartMatches[0] = null; },
    r => { r.chartMatches[0].eligibleClaimIds = ['unknown']; }, r => { r.chartMatches[0].eligibleClaimIds = [7]; },
    r => { r.chartMatches[firstPositive].eligibleClaimIds.push(r.chartMatches[firstPositive].eligibleClaimIds[0]); },
    r => { r.perClaim[r.chartMatches[firstPositive].eligibleClaimIds[0]].bindingVerified = false; },
    r => { r.perClaim[r.chartMatches[firstPositive].eligibleClaimIds[0]].palace = 'unrecognized'; }
]) { const bad = structuredClone(report); mutate(bad); assert.throws(() => compareApplicability(report, bad)); }
assert.throws(() => compareApplicability(report, null));
const temp = mkdtempSync(join(tmpdir(), 'interpretation-applicability-'));
try {
    const baseline = join(temp, 'baseline.json');
    writeFileSync(baseline, JSON.stringify(report));
    const run = args => spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/interpretationApplicability.mjs', import.meta.url)), ...args],
        { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    const success = run(['--baseline', baseline]);
    assert.equal(success.status, 0, success.stderr);
    const actual = JSON.parse(success.stdout);
    assert.deepEqual(actual.summary, report.summary);
    assert.equal(actual.comparison.netCharts, 0);
    writeFileSync(baseline, '{');
    assert.notEqual(run(['--baseline', baseline]).status, 0);
    assert.notEqual(run(['--bad']).status, 0);
} finally { rmSync(temp, { recursive: true, force: true }); }
console.log('interpretation applicability: fixed1152 cohort, seven baseline counts, overlap, actual CLI and malformed baseline boundaries');
