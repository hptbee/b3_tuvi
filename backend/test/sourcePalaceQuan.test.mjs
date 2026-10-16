import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { DIA_CHI } from '../src/engine/constants.js';
import { evaluateCondition } from '../src/engine/conditionEval.js';
import { verifyStoredSourcePalaceEvidence, verifySourcePalaceBinding } from '../src/knowledge/sourcePalaceBinding.js';
import { verifyInterpretationBinding } from '../src/knowledge/interpretationBinding.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { approvedSentence, renderInternalProse } from '../src/interpretation/synthesis.js';

const root = new URL('../../', import.meta.url);
const read = (ref) => readFileSync(new URL(ref, root), 'utf8');
const json = (ref) => JSON.parse(read(ref));
const claimId = 'interp-quanshu-quan-loc-co-cu-dau-host';
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const claim = claims.find((item) => item.claimId === claimId);
const decision = json(claim.interpretationDecisionRef);
const evidence = {
    claims, decision, sources: json('docs/knowledge/sources.json'),
    bundle: json(decision.reviewBundleFile), execution: json(decision.executionFile),
    span: read(decision.spanFile), context: read(decision.contextFile),
    reviewA: json('docs/knowledge/reviews/juan2-palace/review-quan-a.json'),
    reviewB: json('docs/knowledge/reviews/juan2-palace/review-quan-b.json')
};
const candidate = evidence.bundle.candidates[0];
assert.equal(verifyStoredSourcePalaceEvidence(claimId, evidence).ok, true);
assert.equal(verifySourcePalaceBinding(structuredClone(claim)).ok, true);
assert.equal(approvedSentence(claim), candidate.proposedWording);
assert.ok(evidence.span.endsWith('\n'));
assert.equal(evidence.reviewA[0].quotation, evidence.span.trim());
assert.equal(evidence.reviewB.reviews[0].quotation, evidence.span.trim());
assert.ok(claim.limitations.includes('modifier_not_evaluated'));

const registered = (e) => e.claims.find((item) => item.claimId === claimId);
const packet = (e) => e.bundle.candidates[0];
function denied(name, mutate) {
    const e = structuredClone(evidence);
    mutate(e);
    let result;
    assert.doesNotThrow(() => { result = verifyStoredSourcePalaceEvidence(claimId, e); }, name);
    assert.equal(result.ok, false, name);
    assert.equal(result.approvedWording, null, name);
}
for (const key of Object.keys(evidence)) denied(`missing ${key}`, (e) => { e[key] = null; });
for (const key of ['claims', 'bundle', 'decision', 'execution', 'reviewA', 'reviewB']) {
    denied(`borrow old ${key}`, (e) => {
        const refs = {
            bundle: 'docs/knowledge/research/juan2-palace/review-bundle.json',
            execution: 'docs/knowledge/research/juan2-palace/execution.json',
            decision: 'docs/knowledge/interpretation-decisions/juan2-tai-tuvi.json',
            reviewA: 'docs/knowledge/reviews/juan2-palace/review-a.json',
            reviewB: 'docs/knowledge/reviews/juan2-palace/review-b.json'
        };
        e[key] = key === 'claims' ? claims.filter((item) => item.claimId !== claimId) : json(refs[key]);
    });
}
for (const key of ['reviewBundleFile', 'executionFile', 'spanFile', 'contextFile']) {
    denied(`traversal ${key}`, (e) => { e.decision[key] = '../approval.json'; });
}
denied('duplicate claim', (e) => e.claims.push(registered(e)));
denied('duplicate packet', (e) => e.bundle.candidates.push(packet(e)));
denied('duplicate actual A', (e) => e.reviewA.push(e.reviewA[0]));
denied('duplicate actual B', (e) => e.reviewB.reviews.push(e.reviewB.reviews[0]));
denied('duplicate execution', (e) => e.execution.reviewers.push(e.execution.reviewers[0]));
for (const key of ['model', 'agentId', 'reviewRef']) {
    denied(`duplicate reviewer ${key}`, (e) => { e.decision.reviewers[1][key] = e.decision.reviewers[0][key]; });
}
denied('swapped reviews', (e) => { [e.reviewA, e.reviewB] = [e.reviewB, e.reviewA]; });
denied('MATCH without interpretation approval', (e) => { e.reviewA[0].interpretationVerdict = 'UNRESOLVED'; });
denied('A projection unresolved', (e) => { e.reviewA[0].sourceProjectionVerdict = 'UNRESOLVED'; });
denied('B projection unresolved', (e) => { e.reviewB.reviews[0].projectionVerdict = 'UNRESOLVED'; });
denied('changed wording', (e) => { registered(e).approvedWording = packet(e).proposedWording = 'UNREVIEWED'; });
denied('remove modifier limit', (e) => {
    registered(e).limitations = packet(e).limitations = packet(e).limitations.filter((item) => item !== 'modifier_not_evaluated');
});
for (const branch of [['Mão'], ['Mão', 'Dậu']]) denied(`changed branch ${branch}`, (e) => {
    registered(e).conditionTree.items[1].branches = packet(e).conditionTree.items[1].branches = branch;
});
denied('changed required star', (e) => {
    registered(e).conditionTree.items[0].stars[0] = packet(e).conditionTree.items[0].stars[0] = 'Tử Vi';
});
denied('strip raw span LF', (e) => { e.span = e.span.trim(); });
denied('change full context', (e) => { e.context += 'UNREVIEWED'; });
denied('fixture change', (e) => { packet(e).fixtures[0].expected = false; });
for (const key of ['sourceDigest', 'contextDigest', 'conditionTreeDigest', 'wordingDigest', 'fixturesDigest']) {
    for (const part of ['packet', 'decision', 'A', 'B']) denied(`${part} ${key}`, (e) => {
        const row = { packet: packet(e), decision: e.decision, A: e.reviewA[0], B: e.reviewB.reviews[0] }[part];
        row[key] = '0'.repeat(64);
    });
}
const extra = structuredClone(evidence);
extra.claims.push({ claimId: 'future-subject' });
extra.bundle.candidates.push({ claimId: 'future-subject' });
assert.equal(verifyStoredSourcePalaceEvidence(claimId, extra).ok, true);
for (const changes of [
    { claimId: 'unreviewed-clone' }, { approvedWording: 'UNREVIEWED' }, { limitations: [] },
    { conditionTree: { op: 'branch', target: 'quan_loc', branches: ['Mão', 'Dậu'] } },
    { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/juan2-tai-tuvi.json' }
]) {
    const clone = { ...claim, ...changes };
    assert.equal(verifyInterpretationBinding(clone).ok, false);
    assert.equal(approvedSentence(clone), null);
}
for (const previous of claims.filter((item) => item.claimId !== claimId)) {
    assert.equal(verifyInterpretationBinding(previous).ok, true, previous.claimId);
}

// Production's fixed evidence loader denies real read/parse failures without a
// runtime approval override or edits to the checked-in evidence.
for (const resource of [decision.reviewBundleFile, decision.executionFile, decision.spanFile, decision.contextFile,
    'docs/knowledge/reviews/juan2-palace/review-quan-a.json', 'docs/knowledge/reviews/juan2-palace/review-quan-b.json']) {
    for (const mode of ['missing', 'malformed']) {
        const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
            import fs from 'node:fs';
            import { syncBuiltinESMExports } from 'node:module';
            import assert from 'node:assert/strict';
            const original = fs.readFileSync;
            fs.readFileSync = function(file, ...args) {
                if (String(file).endsWith('/' + ${JSON.stringify(resource)})) {
                    if (${JSON.stringify(mode)} === 'missing') throw new Error('unavailable');
                    return '{';
                }
                return original.call(this, file, ...args);
            };
            syncBuiltinESMExports();
            const { verifyInterpretationBinding } = await import(${JSON.stringify(new URL('../src/knowledge/interpretationBinding.js', import.meta.url).href)});
            assert.equal(verifyInterpretationBinding(${JSON.stringify(claim)}).ok, false);
        `], { encoding: 'utf8' });
        assert.equal(child.status, 0, `${resource} ${mode}: ${child.stderr}`);
    }
}

function chartFrom(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    const tuviInfo = calculateTuVi(lunar.canIndex, lunar.chiIndex, lunar.lunarDay, lunar.lunarMonth,
        hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth);
    return normalizeChart({ tuviInfo, lunarInfo: lunar, input: {} });
}
assert.equal(candidate.fixtures.length, 10);
assert.equal(candidate.fixtures.filter((item) => item.expected).length, 3);
for (const fixture of candidate.fixtures) {
    const chart = chartFrom(fixture.input);
    const before = structuredClone(chart);
    const host = chart.palaces.find((palace) => palace.functionId === 'quan_loc');
    assert.equal(chart.ok, true);
    assert.deepEqual(chart.lunar, fixture.lunar);
    assert.deepEqual({ id: host.id, functionId: host.functionId, branchName: host.branchName }, fixture.host);
    const stars = new Set(host.stars.map((star) => star.canonicalName));
    const independent = stars.has('Thiên Cơ') && stars.has('Cự Môn') && DIA_CHI[Number(host.branchId)] === 'Dậu';
    assert.equal(independent, fixture.expected, fixture.id);
    const reading = interpretChart(chart, { includeInternal: true });
    const statement = reading.statements.find((item) => item.statementId === 'palace:quan_loc');
    const gate = statement.claimApplicability.find((item) => item.claimId === claimId);
    assert.equal(gate.eligible, fixture.expected, fixture.id);
    assert.equal(gate.conditionTrace.status, fixture.expected ? 'satisfied' : 'not_satisfied', fixture.id);
    assert.equal(gate.layers.formulaRuntime, 'not_applicable_source_predicate');
    assert.equal(gate.layers.grade, 'not_recorded');
    assert.equal(gate.layers.breaking, 'not_implemented');
    assert.equal(gate.publicRelease, false);
    assert.equal(statement.prose, null);
    assert.equal(statement.publicInterpretationReleased, false);
    if (fixture.expected) {
        assert.equal(statement.internalProse, renderInternalProse([claim]));
        assert.ok(statement.internalProse.includes(candidate.proposedWording));
        assert.ok(statement.internalProse.includes(claim.sourceProfile));
        assert.ok(statement.internalProse.includes('không xác nhận công thức an sao của nguồn'));
    } else {
        assert.equal(statement.internalProse?.includes(claim.approvedWording) || false, false,
            'another independently eligible source branch cannot render this ineligible Dậu claim');
        assert.ok(gate.reasons.includes('conditions_not_met'));
    }
    const api = analyzeChartRequest(fixture.input);
    assert.equal(api.status, 200);
    const publicStatement = api.body.statements.find((item) => item.statementId === 'palace:quan_loc');
    assert.equal(publicStatement.claimApplicability.find((item) => item.claimId === claimId).eligible, fixture.expected);
    assert.ok(api.body.statements.every((item) => item.prose === null && !Object.hasOwn(item, 'internalProse')));
    assert.ok(api.body.wholeChart.topics.every((item) => item.prose === null));
    assert.deepEqual(chart, before, fixture.id);
}

const maoFixture = candidate.fixtures.find((item) => item.id === 'negative_mao_pair_no_host_adverses');
const mao = chartFrom(maoFixture.input);
const spoofed = structuredClone(mao);
spoofed.palaces.find((item) => item.functionId === 'quan_loc').branchName = 'Dậu';
assert.equal(evaluateCondition(candidate.conditionTree, spoofed, { schoolId: spoofed.schoolId, profile: claim.sourceProfile }).status,
    'satisfied', 'raw evaluator reproduction shows why branch coherence is required');
const positive = chartFrom(candidate.fixtures[0].input);
const corruptions = [
    ['missing label', (host) => { delete host.branchName; }],
    ['coercible label', (host) => { host.branchName = ['Dậu']; }],
    ['invalid label', (host) => { host.branchName = 'not-a-branch'; }],
    ['contradictory label', (host) => { host.branchName = 'Mão'; }],
    ['mismatched branch ID', (host) => { host.branchId = '4'; }],
    ['consistent IDs contradict label', (host) => { host.branchId = host.id = '4'; }]
];
for (const [name, corrupt] of corruptions) {
    const chart = structuredClone(positive);
    corrupt(chart.palaces.find((item) => item.functionId === 'quan_loc'));
    checkUnknown(chart, name);
}
checkUnknown(spoofed, 'actual Mão pair relabelled Dậu');
function checkUnknown(chart, name) {
    const before = structuredClone(chart);
    let gate;
    assert.doesNotThrow(() => { gate = claimEligibility(claim, chart); }, name);
    assert.equal(gate.eligible, false, name);
    assert.equal(gate.conditionTrace.status, 'unknown', name);
    assert.ok(gate.reasons.includes('conditions_not_evaluated'), name);
    const statement = interpretChart(chart, { includeInternal: true }).statements.find((item) => item.statementId === 'palace:quan_loc');
    assert.equal(statement.internalProse, null, name);
    assert.equal(statement.prose, null, name);
    assert.deepEqual(chart, before, name);
}
// Shared validation applies to the original finite source subjects as well.
const oldBundle = json('docs/knowledge/research/juan2-palace/review-bundle.json');
for (const old of oldBundle.candidates) {
    const oldClaim = claims.find((item) => item.claimId === old.claimId);
    for (const badName of [undefined, ['Dậu'], 'not-a-branch']) {
        const chart = chartFrom(old.fixtures.find((item) => item.expected).input);
        chart.palaces.find((item) => item.functionId === old.target).branchName = badName;
        const gate = claimEligibility(oldClaim, chart);
        assert.equal(gate.eligible, false);
        assert.equal(gate.conditionTrace.status, 'unknown');
    }
}
console.log('Quan source branch: separate actual approval, evidence mutations, 10 real charts/API and malformed branch rejection passed');
