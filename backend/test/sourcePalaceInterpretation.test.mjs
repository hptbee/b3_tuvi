import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { evaluateCondition } from '../src/engine/conditionEval.js';
import { DEFAULT_SCHOOL } from '../src/engine/schoolProfile.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { renderInternalProse } from '../src/interpretation/synthesis.js';
import claimsDoc from '../../docs/knowledge/interpretation-claims.json' with { type: 'json' };
import bundle from '../../docs/knowledge/research/juan2-palace/review-bundle.json' with { type: 'json' };

const frozenPaths = ['../src/data/formulaV1.mjs', '../src/data/rulesV2.json', '../src/data/starStatus.json', '../src/engine/schoolProfile.js'];
const frozen = frozenPaths.map((ref) => readFileSync(new URL(ref, import.meta.url), 'utf8'));
function chartFrom(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    const tuviInfo = calculateTuVi(lunar.canIndex, lunar.chiIndex, lunar.lunarDay, lunar.lunarMonth,
        hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth);
    return normalizeChart({ tuviInfo, lunarInfo: lunar, input: {} });
}
let count = 0;
for (const candidate of bundle.candidates) {
    const claim = claimsDoc.claims.find((item) => item.claimId === candidate.claimId);
    const positiveInput = candidate.fixtures.find((item) => item.expected).input;
    const positive = chartFrom(positiveInput);
    const positiveHost = positive.palaces.find((palace) => palace.functionId === candidate.target);
    for (const fixture of candidate.fixtures) {
        const chart = chartFrom(fixture.input);
        const before = JSON.stringify(chart);
        assert.equal(chart.ok, true);
        assert.equal(chart.schoolId, DEFAULT_SCHOOL.id);
        assert.deepEqual(chart.lunar, fixture.lunar);
        const host = chart.palaces.find((palace) => palace.functionId === candidate.target);
        assert.equal(host.id, fixture.host.id);
        assert.equal(host.branchName, fixture.host.branchName);
        const stars = new Set(host.stars.map((star) => star.canonicalName));
        const independentMatch = candidate.target === 'phuc_duc'
            ? stars.has('Thiên Đồng') && stars.has('Thiên Lương')
            : stars.has('Tử Vi') && ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].some((star) => stars.has(star));
        assert.equal(independentMatch, fixture.expected, fixture.id);
        const trace = evaluateCondition(candidate.conditionTree, chart, { schoolId: chart.schoolId, profile: candidate.sourceProfile });
        assert.equal(trace.status, fixture.expected ? 'satisfied' : 'not_satisfied', fixture.id);
        const reading = interpretChart(chart, { includeInternal: true });
        const statement = reading.statements.find((item) => item.statementId === `palace:${candidate.target}`);
        const gate = statement.claimApplicability.find((item) => item.claimId === claim.claimId);
        assert.equal(gate.eligible, fixture.expected, fixture.id);
        assert.equal(gate.conditionTrace.status, trace.status);
        assert.equal(gate.layers.formulaRuntime, 'not_applicable_source_predicate');
        assert.equal(gate.layers.grade, 'not_recorded');
        assert.equal(gate.publicRelease, false);
        assert.equal(statement.prose, null);
        assert.equal(statement.publicInterpretationReleased, false);
        assert.equal(statement.internalProse?.includes(claim.approvedWording) || false, fixture.expected, fixture.id);
        if (fixture.expected) {
            assert.ok(statement.internalProse.includes(candidate.sourceProfile));
            assert.ok(statement.internalProse.includes('không xác nhận công thức an sao của nguồn'));
            assert.ok(!gate.reasons.includes('formula_runtime_unbound'));
        } else {
            assert.equal(statement.internalProse, null);
            assert.ok(gate.reasons.includes('conditions_not_met'));
        }
        assert.equal(JSON.stringify(chart), before, 'condition projection must not mutate natal data');
        const api = analyzeChartRequest(fixture.input);
        assert.equal(api.status, 200);
        const publicStatement = api.body.statements.find((item) => item.statementId === `palace:${candidate.target}`);
        assert.equal(publicStatement.claimApplicability.find((item) => item.claimId === claim.claimId).eligible, fixture.expected);
        assert.ok(api.body.statements.every((item) => item.prose === null && !Object.hasOwn(item, 'internalProse')));
        assert.ok(api.body.wholeChart.topics.every((topic) => topic.prose === null));
        count++;
    }
    const direct = claimEligibility(claim, positive, positiveHost);
    assert.equal(direct.eligible, true);
    assert.equal(direct.conditionTrace.status, 'satisfied');
    for (const clone of [
        { ...claim, claimId: 'unreviewed-clone' }, { ...claim, approvedWording: 'UNREVIEWED SENTENCE' },
        { ...claim, conditionTree: { op: 'mystery' } }, { ...claim, limitations: [] },
        { ...claim, sourceProfile: 'tan-bien' }, { ...claim, interpretationDecisionRef: 'missing.json' },
        { ...claim, approvedForInterpretation: false }
    ]) {
        const gate = claimEligibility(clone, positive, positiveHost);
        assert.equal(gate.eligible, false);
        if (clone.approvedForInterpretation) assert.ok(gate.reasons.includes('formula_runtime_unbound'));
        assert.equal(Object.hasOwn(gate, 'conditionTrace'), false);
        const withClone = interpretChart(positive, { includeInternal: true, claims: [clone] });
        const statement = withClone.statements.find((item) => item.statementId === `palace:${candidate.target}`);
        assert.equal(statement.internalProse.includes('UNREVIEWED SENTENCE'), false);
        assert.equal(statement.internalProse, interpretChart(positive, { includeInternal: true }).statements
            .find((item) => item.statementId === `palace:${candidate.target}`).internalProse);
    }
    const wrongSchool = claimEligibility(claim, { ...positive, schoolId: 'other' }, positiveHost);
    assert.equal(wrongSchool.eligible, false);
    assert.ok(wrongSchool.reasons.includes('school_mismatch'));
    const otherHost = positive.palaces.find((palace) => palace.functionId !== candidate.target);
    assert.equal(claimEligibility(claim, positive, otherHost).conditionTrace.reason, 'statement_palace_mismatch');
    for (const badChart of [
        {}, { ...positive, byStarId: undefined }, { ...positive, byStarId: { malformed: null } },
        { ...positive, palaces: positive.palaces.filter((palace) => palace.functionId !== candidate.target) },
        { ...positive, palaces: [...positive.palaces, positiveHost] },
        { ...positive, palaces: positive.palaces.map((p) => p === positiveHost ? { ...p, functionStatus: 'unknown' } : p) },
        { ...positive, palaces: positive.palaces.map((p) => p === positiveHost ? { ...p, stars: [] } : p) }
    ]) {
        const gate = claimEligibility(claim, badChart);
        assert.equal(gate.eligible, false);
        assert.equal(gate.conditionTrace.status, 'unknown');
        assert.ok(gate.reasons.includes('conditions_not_evaluated'));
    }
    const requiredStar = candidate.target === 'tai_bach' ? 'tu_vi' : 'thien_dong';
    const corruptions = [
        ['null index placement', (chart) => chart.byStarId[requiredStar].unshift(null)],
        ['sparse index placements', (chart) => { delete chart.byStarId[requiredStar][0]; }],
        ['missing placement ID', (chart) => { delete chart.byStarId[requiredStar][0].palaceId; }],
        ['invalid placement ID', (chart) => { chart.byStarId[requiredStar][0].palaceId = 'not-a-palace'; }],
        ['null unrelated palace', (chart) => { chart.palaces[chart.palaces.findIndex((p) => p.functionId !== candidate.target)] = null; }],
        ['sparse unrelated palace', (chart) => { delete chart.palaces[chart.palaces.findIndex((p) => p.functionId !== candidate.target)]; }],
        ['missing target branch', (chart) => { delete chart.palaces.find((p) => p.functionId === candidate.target).branchId; }],
        ['invalid target branch', (chart) => { chart.palaces.find((p) => p.functionId === candidate.target).branchId = 13; }],
        ['mismatched target ID', (chart) => { chart.palaces.find((p) => p.functionId === candidate.target).id = '12'; }],
        ['null target star', (chart) => chart.palaces.find((p) => p.functionId === candidate.target).stars.unshift(null)],
        ['sparse target stars', (chart) => { delete chart.palaces.find((p) => p.functionId === candidate.target).stars[0]; }]
    ];
    for (const [name, corrupt] of corruptions) {
        const badChart = structuredClone(positive);
        corrupt(badChart);
        const before = structuredClone(badChart);
        let gate;
        assert.doesNotThrow(() => { gate = claimEligibility(claim, badChart); }, `${claim.claimId}: ${name}`);
        assert.equal(gate.eligible, false, name);
        assert.equal(gate.conditionTrace.status, 'unknown', name);
        assert.ok(gate.reasons.includes('conditions_not_evaluated'), name);
        assert.equal(renderInternalProse(gate.eligible ? [claim] : []), null, name);
        assert.deepEqual(badChart, before, name);
    }
    const conflict = interpretChart(positive, { includeInternal: true, claims: [
        { ...claim, claimId: 'contradictory-unreviewed', contradicts: [claim.claimId] }
    ] });
    assert.equal(conflict.statements.find((s) => s.statementId === `palace:${candidate.target}`).internalProse, null);
}
assert.equal(count, 16);
const legacy = claimsDoc.claims.find((claim) => claim.claimId === 'interp-tu-phu-dong-cung-giap-menh');
for (const [day, eligible] of [[7, true], [2, false]]) {
    const api = analyzeChartRequest({ day, month: 2, year: 1984, hour: 0, gender: 1 });
    assert.equal(api.status, 200);
    const menh = api.body.statements.find((item) => item.statementId === 'palace:menh');
    assert.equal(menh.claimApplicability.find((item) => item.claimId === legacy.claimId).eligible, eligible);
}
const negative = chartFrom({ day: 2, month: 2, year: 1984, hour: 0, gender: 1 });
const injected = interpretChart(negative, { includeInternal: true, extraFormulaHits: [{
    catalogId: 'tu_phu_dong_cung', palaceId: negative.menhPalaceId, sourceProfile: 'tan-bien', gradeStatus: 'not_certified'
}] });
assert.equal(injected.statements.find((item) => item.statementId === 'palace:menh').internalProse, null);
for (const [index, ref] of frozenPaths.entries()) assert.equal(readFileSync(new URL(ref, import.meta.url), 'utf8'), frozen[index]);
console.log('source-palace interpretation: all 16 solar witnesses, immutable natal data, real condition traces, legacy guards and public prose withholding passed');
