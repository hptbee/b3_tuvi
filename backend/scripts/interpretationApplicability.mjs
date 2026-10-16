import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import claimsDoc from '../../docs/knowledge/interpretation-claims.json' with { type: 'json' };
import { validateChartInput } from '../src/engine/chartInput.js';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { interpretChart, PALACE_FUNCTIONS } from '../src/interpretation/pipeline.js';
import { verifyInterpretationBinding } from '../src/knowledge/interpretationBinding.js';

const COHORT = 'solar-1984-1995-monthly15-hours0-6-12-18-sex-v1';
const ensure = (condition, message) => { if (!condition) throw new Error(message); };
export function fixedCoverageInputs() {
    const inputs = [];
    for (let year = 1984; year <= 1995; year++) for (let month = 1; month <= 12; month++)
        for (const hour of [0, 6, 12, 18]) for (const gender of [-1, 1]) inputs.push({ day: 15, month, year, hour, gender });
    return inputs;
}

export function interpretationApplicabilityReport() {
    const inputs = fixedCoverageInputs();
    const claims = claimsDoc.claims.map(claim => ({ claimId: claim.claimId, palace: claim.relatedPalaces?.[0],
        bindingVerified: verifyInterpretationBinding(claim).ok, limitations: claim.limitations || [] }));
    ensure(new Set(claims.map(c => c.claimId)).size === claims.length, 'Duplicate claim identity');
    ensure(claims.every(c => typeof c.claimId === 'string' && PALACE_FUNCTIONS.includes(c.palace)), 'Invalid claim target');
    const perClaim = Object.fromEntries(claims.map(c => [c.claimId, { ...c, positive: 0, negative: 0, unresolved: 0, reasons: {} }]));
    const perPalace = Object.fromEntries(PALACE_FUNCTIONS.map(p => [p, { approvedClaims: claims.filter(c => c.palace === p && c.bindingVerified).length,
        positive: 0, negative: 0, unresolved: 0 }]));
    const chartMatches = [];
    for (const input of inputs) {
        ensure(validateChartInput(input).ok, 'Invalid fixed birth input');
        const l = solarToLunar(input.day, input.month, input.year);
        const chart = normalizeChart({ input: {}, lunarInfo: l, tuviInfo: calculateTuVi(l.canIndex, l.chiIndex,
            l.lunarDay, l.lunarMonth, hourBranchIndex(input.hour), input.gender, l.isLeapMonth) });
        ensure(chart.ok, 'Invalid fixed natal chart');
        const reading = interpretChart(chart);
        ensure(reading.ok, 'Interpretation unavailable');
        const physical = reading.statements.filter(s => !s.thanOverlay);
        ensure(physical.length === 12 && new Set(physical.map(s => s.functionId)).size === 12, 'Incomplete palace readings');
        const matched = [];
        for (const statement of physical) {
            ensure(statement.prose === null && statement.publicInterpretationReleased === false, 'Public interpretation gate changed');
            const applicable = statement.claimApplicability.filter(g => Object.hasOwn(perClaim, g.claimId));
            const expected = claims.filter(c => c.palace === statement.functionId);
            ensure(applicable.length === expected.length && new Set(applicable.map(g => g.claimId)).size === expected.length
                && expected.every(c => applicable.some(g => g.claimId === c.claimId)), 'Incomplete claim readings');
            let hasMatch = false, hasUnresolved = false;
            for (const gate of applicable) {
                const row = perClaim[gate.claimId];
                ensure(gate.publicRelease === false, 'Public claim release changed');
                const unresolved = gate.layers.interpretationBinding !== 'verified' || gate.layers.runtimeConditions === 'not_evaluated';
                if (gate.eligible) {
                    ensure(row.bindingVerified && !unresolved, 'Eligible claim lacks executable binding');
                    row.positive++; hasMatch = true; matched.push(gate.claimId);
                } else if (unresolved) { row.unresolved++; hasUnresolved = true; }
                else row.negative++;
                for (const reason of gate.reasons) row.reasons[reason] = (row.reasons[reason] || 0) + 1;
            }
            perPalace[statement.functionId][hasMatch ? 'positive' : hasUnresolved ? 'unresolved' : 'negative']++;
        }
        chartMatches.push({ input, eligibleClaimIds: matched.sort() });
    }
    const overlap = [];
    for (let i = 0; i < claims.length; i++) for (let j = i + 1; j < claims.length; j++) {
        const ids = [claims[i].claimId, claims[j].claimId];
        overlap.push({ claimIds: ids, charts: chartMatches.filter(row => ids.every(id => row.eligibleClaimIds.includes(id))).length });
    }
    const histogram = {};
    for (const row of chartMatches) histogram[row.eligibleClaimIds.length] = (histogram[row.eligibleClaimIds.length] || 0) + 1;
    const positive = chartMatches.filter(row => row.eligibleClaimIds.length).length;
    return { schemaVersion: 1, cohortId: COHORT, inputSha256: createHash('sha256').update(JSON.stringify(inputs)).digest('hex'),
        classification: 'internal engineering applicability; not population prevalence, source approval or expert verification',
        summary: { charts: inputs.length, approvedExecutableClaims: claims.filter(c => c.bindingVerified).length,
            palacesWithApprovedClaims: Object.values(perPalace).filter(p => p.approvedClaims).length,
            chartsWithAnyClaim: positive, chartsWithoutAnyClaim: inputs.length - positive,
            applicabilityPercent: positive / inputs.length * 100, claimHits: chartMatches.reduce((n, r) => n + r.eligibleClaimIds.length, 0),
            chartsWithOverlappingClaims: chartMatches.filter(r => r.eligibleClaimIds.length > 1).length },
        perClaim, perPalace, claimCountHistogram: histogram, overlap, chartMatches };
}

export function compareApplicability(current, baseline) {
    ensure(baseline?.schemaVersion === 1 && baseline.cohortId === current.cohortId
        && baseline.inputSha256 === current.inputSha256 && Array.isArray(baseline.chartMatches)
        && baseline.chartMatches.length === current.chartMatches.length, 'Incompatible baseline cohort');
    ensure(baseline.perClaim && typeof baseline.perClaim === 'object' && !Array.isArray(baseline.perClaim), 'Invalid baseline claims');
    const deltas = Object.fromEntries(PALACE_FUNCTIONS.map(p => [p, { gained: 0, lost: 0, before: 0, after: 0 }]));
    let gained = 0, lost = 0, retained = 0;
    for (const [index, row] of baseline.chartMatches.entries()) {
        const after = current.chartMatches[index];
        ensure(row && JSON.stringify(row.input) === JSON.stringify(after.input)
            && Array.isArray(row.eligibleClaimIds) && row.eligibleClaimIds.every(id => typeof id === 'string'
                && Object.hasOwn(baseline.perClaim, id) && PALACE_FUNCTIONS.includes(baseline.perClaim[id]?.palace)
                && baseline.perClaim[id]?.bindingVerified === true)
            && new Set(row.eligibleClaimIds).size === row.eligibleClaimIds.length, 'Invalid baseline chart matches');
        const was = row.eligibleClaimIds.length > 0, now = after.eligibleClaimIds.length > 0;
        if (!was && now) gained++;
        if (was && !now) lost++;
        if (was && now) retained++;
        for (const palace of PALACE_FUNCTIONS) {
            const before = row.eligibleClaimIds.some(id => baseline.perClaim[id].palace === palace);
            const next = after.eligibleClaimIds.some(id => current.perClaim[id].palace === palace);
            const d = deltas[palace];
            d.before += Number(before); d.after += Number(next);
            d.gained += Number(!before && next); d.lost += Number(before && !next);
        }
    }
    return { gainedCharts: gained, lostCharts: lost, retainedCharts: retained, netCharts: gained - lost, perPalace: deltas };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        const args = process.argv.slice(2);
        ensure(args.length === 0 || (args.length === 2 && args[0] === '--baseline'), 'Usage: node scripts/interpretationApplicability.mjs [--baseline report.json]');
        const report = interpretationApplicabilityReport();
        if (args.length) report.comparison = compareApplicability(report, JSON.parse(readFileSync(args[1], 'utf8')));
        console.log(JSON.stringify(report, null, 2));
    } catch (error) {
        console.error(`Interpretation applicability report failed: ${error.message}`);
        process.exitCode = 1;
    }
}
