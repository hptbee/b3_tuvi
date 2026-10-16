import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { evaluateCondition } from '../src/engine/conditionEval.js';
import { sha256Text } from '../src/knowledge/sourceBinding.js';
import { verifyStoredSourcePalaceEvidence, verifySourcePalaceBinding } from '../src/knowledge/sourcePalaceBinding.js';
import { verifyInterpretationBinding } from '../src/knowledge/interpretationBinding.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';
import { approvedSentence, renderInternalProse } from '../src/interpretation/synthesis.js';

const root = new URL('../../', import.meta.url);
const read = (ref) => readFileSync(new URL(ref, root), 'utf8');
const json = (ref) => JSON.parse(read(ref));
const claimId = 'interp-quanshu-quan-co-cu-mao-host';
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const claim = claims.find((item) => item.claimId === claimId);
const decision = json(claim.interpretationDecisionRef);
const evidence = {
    claims, decision, sources: json('docs/knowledge/sources.json'),
    bundle: json(decision.reviewBundleFile), execution: json(decision.executionFile),
    span: read(decision.spanFile), context: read(decision.contextFile),
    reviewA: json('docs/knowledge/reviews/juan2-palace/review-quan-mao-a.json'),
    reviewB: json('docs/knowledge/reviews/juan2-palace/review-quan-mao-b.json')
};
const candidate = evidence.bundle.candidates[0];
const oldClaim = claims.find((c) => c.claimId === 'interp-quanshu-quan-loc-co-cu-dau-host');
const registered = (e) => e.claims.find((item) => item.claimId === claimId);
const packet = (e) => e.bundle.candidates[0];
assert.equal(verifyStoredSourcePalaceEvidence(claimId, evidence).ok, true);
assert.equal(verifySourcePalaceBinding(structuredClone(claim)).ok, true);
assert.equal(approvedSentence(claim), candidate.proposedWording);
assert.ok(renderInternalProse([claim]).includes('không xác nhận công thức an sao của nguồn'));
assert.equal(candidate.conditionTree.op, 'and');
assert.deepEqual(candidate.conditionTree.items, [
    { op: 'same_palace', target: 'quan_loc', stars: ['Thiên Cơ', 'Cự Môn'] },
    { op: 'branch', target: 'quan_loc', branches: ['Mão'] }
]);
assert.ok(candidate.limitations.includes('modifier_not_evaluated'));
assert.ok(evidence.span.includes('天機同在卯宮吉美'));
assert.ok(evidence.span.includes('在酉宮雖美無始終'));
assert.ok(evidence.span.includes('加羊陀火鈴空劫更不美'));
assert.ok(evidence.span.includes('退宮卸職'));

function denied(name, mutate) {
    const e = structuredClone(evidence);
    mutate(e);
    let result;
    assert.doesNotThrow(() => { result = verifyStoredSourcePalaceEvidence(claimId, e); }, name);
    assert.equal(result.ok, false, name);
    assert.equal(result.approvedWording, null, name);
}
for (const key of Object.keys(evidence)) {
    denied(`null ${key}`, (e) => { e[key] = null; });
    denied(`missing ${key}`, (e) => { delete e[key]; });
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
for (const key of ['model', 'agentId', 'reviewRef', 'requestedModel', 'hostBuildId']) {
    denied(`execution ${key}`, (e) => { e.execution.reviewers[0][key] = 'UNRECORDED'; });
}
for (const key of ['sourceId', 'editionId', 'schoolId', 'sourceProfile', 'target', 'locator', 'quotationPolicy']) {
    denied(`review A ${key}`, (e) => { e.reviewA[0][key] = 'other'; });
}
for (const review of ['reviewA', 'reviewB']) {
    denied(`${review} whole-document annotation`, (e) => {
        const row = review === 'reviewA' ? e.reviewA[0] : e.reviewB;
        row.unreviewedAnnotation = 'self-declared approval';
    });
}
denied('source fetch not verified', (e) => { e.reviewA[0].sourceAssessment.independentPinnedRawFetch.status = 403; });
denied('interpretation approval missing', (e) => { e.reviewB.reviews[0].interpretationVerdict = 'UNRESOLVED'; });
denied('source promoted', (e) => { e.sources.sources.find((s) => s.sourceId === claim.sourceId).bookVerified = true; });
denied('edition authenticated', (e) => { e.sources.editions.find((s) => s.editionId === claim.editionId).authenticated = true; });
denied('changed context', (e) => { e.context += 'UNREVIEWED'; });
denied('removed full final modifiers', (e) => { e.span = e.span.replace(/加羊陀火鈴空劫[^。]*。/gu, '。'); });
denied('wrong target', (e) => { packet(e).target = 'phuc_duc'; });
for (const key of ['expertVerified', 'bookVerified', 'publicRelease']) {
    denied(`decision ${key}`, (e) => { e.decision[key] = true; });
}
denied('public permission', (e) => { registered(e).releasePermission = 'owner_released'; });
denied('modifier disclaimer removed', (e) => {
    registered(e).limitations = packet(e).limitations = packet(e).limitations.filter((s) => s !== 'modifier_not_evaluated');
});
for (const key of ['sourceDigest', 'contextDigest', 'conditionTreeDigest', 'wordingDigest', 'fixturesDigest']) {
    for (const part of ['packet', 'decision', 'A', 'B']) denied(`${part} ${key}`, (e) => {
        ({ packet: packet(e), decision: e.decision, A: e.reviewA[0], B: e.reviewB.reviews[0] })[part][key] = '0'.repeat(64);
    });
}
// Even a coherent rewrite of every stored digest cannot manufacture a new approval.
function rehash(e, key, value) {
    for (const row of [packet(e), e.decision, e.reviewA[0], e.reviewB.reviews[0], e.reviewB.reviews[0].verifiedDigests]) row[key] = value;
}
for (const tree of [
    { op: 'star_present', target: 'quan_loc', star: 'Thiên Cơ' },
    { op: 'or', items: [{ op: 'star_present', target: 'quan_loc', star: 'Thiên Cơ' }, { op: 'star_present', target: 'quan_loc', star: 'Cự Môn' }] },
    { op: 'same_palace', target: 'phuc_duc', stars: ['Thiên Cơ', 'Cự Môn'] },
    { op: 'branch', target: 'quan_loc', branches: ['Mão'] },
    { op: 'and', items: [{ op: 'same_palace', target: 'quan_loc', stars: ['Cự Môn'] }, candidate.conditionTree.items[1]] },
    { op: 'and', items: [{ op: 'same_palace', target: 'quan_loc', stars: ['Thiên Cơ'] }, candidate.conditionTree.items[1]] },
    { op: 'and', items: [candidate.conditionTree.items[0], { op: 'branch', target: 'quan_loc', branches: ['Mão', 'Dậu'] }] }
]) denied(`coherent tree rewrite ${JSON.stringify(tree)}`, (e) => {
    for (const row of [registered(e), packet(e), e.reviewA[0], e.reviewB.reviews[0]]) row.conditionTree = tree;
    rehash(e, 'conditionTreeDigest', sha256Text(JSON.stringify(tree)));
});
denied('coherent wording rewrite', (e) => {
    const wording = 'Đã xác nhận công danh và kết quả cuộc đời.';
    registered(e).approvedWording = packet(e).proposedWording = e.reviewA[0].reviewedWording = e.reviewB.reviews[0].approvedWording = wording;
    rehash(e, 'wordingDigest', sha256Text(wording));
});
denied('coherent fixture rewrite', (e) => {
    packet(e).fixtures[0].expected = !packet(e).fixtures[0].expected;
    rehash(e, 'fixturesDigest', sha256Text(JSON.stringify(packet(e).fixtures)));
});
for (const changes of [
    { claimId: 'unreviewed-clone' }, { approvedWording: 'UNREVIEWED' }, { limitations: [] },
    { conditionTree: { op: 'star_present', target: 'quan_loc', star: 'Thiên Cơ' } },
    { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/juan2-quan-co-cu-dau.json' }
]) {
    const clone = { ...claim, ...changes };
    assert.equal(verifyInterpretationBinding(clone).ok, false);
    assert.equal(approvedSentence(clone), null);
    assert.equal(verifySourcePalaceBinding(claim).ok, true, 'rejected caller clones cannot poison successful cache');
}
for (const previous of claims.filter((item) => item.claimId !== claimId)) {
    assert.equal(verifyInterpretationBinding(previous).ok, true, previous.claimId);
}

// Exercise the fixed production reader in fresh processes without editing source artifacts.
for (const resource of [decision.reviewBundleFile, decision.executionFile, decision.spanFile, decision.contextFile,
    'docs/knowledge/reviews/juan2-palace/review-quan-mao-a.json', 'docs/knowledge/reviews/juan2-palace/review-quan-mao-b.json']) {
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
        import fs from 'node:fs'; import assert from 'node:assert/strict';
        import { syncBuiltinESMExports } from 'node:module';
        const original = fs.readFileSync;
        fs.readFileSync = function(file, ...args) {
            if (String(file).endsWith('/' + ${JSON.stringify(resource)})) throw new Error('unavailable');
            return original.call(this, file, ...args);
        };
        syncBuiltinESMExports();
        const { verifyInterpretationBinding } = await import(${JSON.stringify(new URL('../src/knowledge/interpretationBinding.js', import.meta.url).href)});
        assert.equal(verifyInterpretationBinding(${JSON.stringify(claim)}).ok, false);
    `], { encoding: 'utf8' });
    assert.equal(child.status, 0, `${resource}: ${child.stderr}`);
}

function chartFrom(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    return normalizeChart({ input, lunarInfo: lunar, tuviInfo: calculateTuVi(lunar.canIndex, lunar.chiIndex,
        lunar.lunarDay, lunar.lunarMonth, hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth) });
}
assert.equal(candidate.fixtures.length, 9);
assert.equal(candidate.fixtures.filter((f) => f.expected).length, 2);
const positiveCells = new Set();
for (const fixture of candidate.fixtures) {
    const chart = chartFrom(fixture.input), before = JSON.stringify(chart);
    const host = chart.palaces.find((p) => p.functionId === 'quan_loc');
    assert.deepEqual(chart.lunar, fixture.lunar);
    assert.deepEqual({ id: host.id, functionId: host.functionId, branchName: host.branchName }, fixture.host);
    const names = new Set(host.stars.map((s) => s.canonicalName));
    const independent = names.has('Thiên Cơ') && names.has('Cự Môn') && host.branchId === 4 && host.branchName === 'Mão';
    assert.equal(independent, fixture.expected, fixture.id);
    if (independent) positiveCells.add(`${host.branchName}:${['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].some((s) => names.has(s))}`);
    const trace = evaluateCondition(candidate.conditionTree, chart, { schoolId: chart.schoolId, profile: claim.sourceProfile });
    assert.equal(trace.status, fixture.expected ? 'satisfied' : 'not_satisfied');
    const direct = claimEligibility(claim, chart, host);
    assert.equal(direct.eligible, fixture.expected);
    const statement = interpretChart(chart, { includeInternal: true }).statements.find((s) => s.statementId === 'palace:quan_loc');
    const gate = statement.claimApplicability.find((g) => g.claimId === claimId);
    const oldGate = statement.claimApplicability.find((g) => g.claimId === oldClaim.claimId);
    const expectedOld = names.has('Thiên Cơ') && names.has('Cự Môn') && host.branchId === 10 && host.branchName === 'Dậu';
    assert.equal(fixture.expected && expectedOld, false, 'coherent Mão and Dậu branches are mutually exclusive');
    assert.equal(oldGate.eligible, expectedOld, 'new Mão branch must preserve the separately approved Dậu note');
    const expectedClaims = [...(fixture.expected ? [claim] : []), ...(expectedOld ? [oldClaim] : [])];
    assert.equal(statement.internalProse, renderInternalProse(expectedClaims));
    for (const eligibleClaim of expectedClaims) assert.equal(statement.internalProse.split(eligibleClaim.approvedWording).length - 1, 1, 'each exact approved note appears once');
    assert.equal(gate.eligible, fixture.expected);
    assert.equal(gate.layers.formulaRuntime, 'not_applicable_source_predicate');
    assert.equal(gate.layers.grade, 'not_recorded');
    assert.equal(gate.layers.breaking, 'not_implemented');
    assert.equal(gate.publicRelease, false);
    assert.equal(statement.prose, null);
    assert.equal(statement.publicInterpretationReleased, false);
    assert.equal(statement.internalProse?.includes(candidate.proposedWording) || false, fixture.expected);
    if (fixture.expected) assert.ok(statement.internalProse.includes('các điều kiện gia sát trong đoạn chưa được đánh giá'));
    const api = analyzeChartRequest(fixture.input);
    assert.equal(api.status, 200);
    const publicHost = api.body.statements.find((s) => s.statementId === 'palace:quan_loc');
    assert.equal(publicHost.claimApplicability.find((g) => g.claimId === claimId).eligible, fixture.expected);
    assert.equal(publicHost.claimApplicability.find((g) => g.claimId === oldClaim.claimId).eligible, expectedOld);
    assert.ok(api.body.statements.every((s) => s.prose === null && !Object.hasOwn(s, 'internalProse')));
    assert.ok(api.body.wholeChart.topics.every((t) => t.prose === null));
    assert.equal(JSON.stringify(chart), before);
}
assert.deepEqual([...positiveCells].sort(), ['Mão:false', 'Mão:true']);
// Old approved Dậu positive fixtures retain exactly the old text after Mão activation.
const oldBundle = json('docs/knowledge/research/juan2-palace/review-bundle-quan.json');
for (const fixture of oldBundle.candidates[0].fixtures.filter((f) => f.expected)) {
    const oldChart = chartFrom(fixture.input);
    const statement = interpretChart(oldChart, { includeInternal: true }).statements.find((s) => s.statementId === 'palace:quan_loc');
    assert.equal(statement.claimApplicability.find((g) => g.claimId === oldClaim.claimId).eligible, true);
    assert.equal(statement.claimApplicability.find((g) => g.claimId === claimId).eligible, false);
    assert.equal(statement.internalProse, renderInternalProse([oldClaim]));
}
const femaleNeither = candidate.fixtures.find((f) => f.input.gender === -1);
assert.ok(femaleNeither, 'valid female Mão case is retained before approval');
const neitherHost = chartFrom(femaleNeither.input).palaces.find((p) => p.functionId === 'quan_loc');
assert.equal(neitherHost.branchName, 'Mão');
assert.ok(!neitherHost.stars.some((s) => ['Thiên Cơ', 'Cự Môn'].includes(s.canonicalName)));
assert.equal(femaleNeither.expected, false);
// Single-partner Mão charts were not found in independent valid-input search;
// immutable AST mutations above protect both required stars without invented charts.
console.log('Quan Mão: finite actual approval, 9 valid charts, separate Mão/Dậu notes, immutable star/branch conditions and withheld public API passed');
