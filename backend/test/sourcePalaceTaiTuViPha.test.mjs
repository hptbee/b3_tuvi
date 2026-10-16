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
const claimId = 'interp-quanshu-tai-tuvi-pha-quan-host';
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const claim = claims.find((item) => item.claimId === claimId);
const decision = json(claim.interpretationDecisionRef);
const evidence = {
    claims, decision, sources: json('docs/knowledge/sources.json'),
    bundle: json(decision.reviewBundleFile), execution: json(decision.executionFile),
    span: read(decision.spanFile), context: read(decision.contextFile),
    reviewA: json('docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-a.json'),
    reviewB: json('docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-b.json')
};
const candidate = evidence.bundle.candidates[0];
const oldClaim = claims.find((c) => c.claimId === 'interp-quanshu-tai-bach-tu-vi-four-adverse-host');
const registered = (e) => e.claims.find((item) => item.claimId === claimId);
const packet = (e) => e.bundle.candidates[0];
assert.equal(verifyStoredSourcePalaceEvidence(claimId, evidence).ok, true);
assert.equal(verifySourcePalaceBinding(structuredClone(claim)).ok, true);
assert.equal(approvedSentence(claim), candidate.proposedWording);
assert.ok(renderInternalProse([claim]).includes('không xác nhận công thức an sao của nguồn'));
assert.equal(candidate.conditionTree.op, 'same_palace');
assert.deepEqual(candidate.conditionTree.stars, ['Tử Vi', 'Phá Quân']);
assert.ok(candidate.limitations.includes('added_adverse_clauses_retained_but_not_evaluated'));
assert.ok(evidence.span.includes('加羊陀火鈴空劫不旺'));
assert.ok(evidence.span.includes('加空劫極貧'));

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
denied('wrong target', (e) => { packet(e).target = 'quan_loc'; });
for (const key of ['expertVerified', 'bookVerified', 'publicRelease']) {
    denied(`decision ${key}`, (e) => { e.decision[key] = true; });
}
denied('public permission', (e) => { registered(e).releasePermission = 'owner_released'; });
denied('modifier disclaimer removed', (e) => {
    registered(e).limitations = packet(e).limitations = packet(e).limitations.filter((s) => s !== 'added_adverse_clauses_retained_but_not_evaluated');
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
    { op: 'star_present', target: 'tai_bach', star: 'Tử Vi' },
    { op: 'or', items: [{ op: 'star_present', target: 'tai_bach', star: 'Tử Vi' }, { op: 'star_present', target: 'tai_bach', star: 'Phá Quân' }] },
    { op: 'same_palace', target: 'quan_loc', stars: ['Tử Vi', 'Phá Quân'] },
    { op: 'and', items: [candidate.conditionTree, { op: 'palace_branch', target: 'tai_bach', branches: ['Dậu'] }] }
]) denied(`coherent tree rewrite ${JSON.stringify(tree)}`, (e) => {
    for (const row of [registered(e), packet(e), e.reviewA[0], e.reviewB.reviews[0]]) row.conditionTree = tree;
    rehash(e, 'conditionTreeDigest', sha256Text(JSON.stringify(tree)));
});
denied('coherent wording rewrite', (e) => {
    const wording = 'Đã xác nhận tài sản và kết quả cuộc đời.';
    registered(e).approvedWording = packet(e).proposedWording = e.reviewA[0].reviewedWording = e.reviewB.reviews[0].approvedWording = wording;
    rehash(e, 'wordingDigest', sha256Text(wording));
});
denied('coherent fixture rewrite', (e) => {
    packet(e).fixtures[0].expected = !packet(e).fixtures[0].expected;
    rehash(e, 'fixturesDigest', sha256Text(JSON.stringify(packet(e).fixtures)));
});
for (const changes of [
    { claimId: 'unreviewed-clone' }, { approvedWording: 'UNREVIEWED' }, { limitations: [] },
    { conditionTree: { op: 'star_present', target: 'tai_bach', star: 'Tử Vi' } },
    { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/juan2-tai-tuvi.json' }
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
    'docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-a.json', 'docs/knowledge/reviews/juan2-palace/review-tai-tuvi-pha-b.json']) {
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
assert.equal(candidate.fixtures.length, 8);
assert.equal(candidate.fixtures.filter((f) => f.expected).length, 4);
const positiveCells = new Set();
for (const fixture of candidate.fixtures) {
    const chart = chartFrom(fixture.input), before = JSON.stringify(chart);
    const host = chart.palaces.find((p) => p.functionId === 'tai_bach');
    assert.deepEqual(chart.lunar, fixture.lunar);
    assert.deepEqual({ id: host.id, functionId: host.functionId, branchName: host.branchName }, fixture.host);
    const names = new Set(host.stars.map((s) => s.canonicalName));
    const independent = names.has('Tử Vi') && names.has('Phá Quân');
    assert.equal(independent, fixture.expected, fixture.id);
    if (independent) positiveCells.add(`${host.branchName}:${['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].some((s) => names.has(s))}`);
    const trace = evaluateCondition(candidate.conditionTree, chart, { schoolId: chart.schoolId, profile: claim.sourceProfile });
    assert.equal(trace.status, fixture.expected ? 'satisfied' : 'not_satisfied');
    const direct = claimEligibility(claim, chart, host);
    assert.equal(direct.eligible, fixture.expected);
    const statement = interpretChart(chart, { includeInternal: true }).statements.find((s) => s.statementId === 'palace:tai_bach');
    const gate = statement.claimApplicability.find((g) => g.claimId === claimId);
    const oldGate = statement.claimApplicability.find((g) => g.claimId === oldClaim.claimId);
    const expectedOld = names.has('Tử Vi') && ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].some((s) => names.has(s));
    assert.equal(oldGate.eligible, expectedOld, 'new pair cannot replace an independently eligible old note');
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
    if (fixture.expected) assert.ok(statement.internalProse.includes('các điều kiện gia sát ở các đoạn liên quan chưa được đánh giá'));
    const api = analyzeChartRequest(fixture.input);
    assert.equal(api.status, 200);
    const publicHost = api.body.statements.find((s) => s.statementId === 'palace:tai_bach');
    assert.equal(publicHost.claimApplicability.find((g) => g.claimId === claimId).eligible, fixture.expected);
    assert.equal(publicHost.claimApplicability.find((g) => g.claimId === oldClaim.claimId).eligible, expectedOld);
    assert.ok(api.body.statements.every((s) => s.prose === null && !Object.hasOwn(s, 'internalProse')));
    assert.ok(api.body.wholeChart.topics.every((t) => t.prose === null));
    assert.equal(JSON.stringify(chart), before);
}
assert.deepEqual([...positiveCells].sort(), ['Mùi:false', 'Mùi:true', 'Sửu:false', 'Sửu:true']);
// A prior approved real chart with Tử Vi/adverse but no Phá Quân must keep its old annotation.
const oldBundle = json('docs/knowledge/research/juan2-palace/review-bundle.json');
const oldPositive = oldBundle.candidates.find((c) => c.claimId === oldClaim.claimId).fixtures
    .filter((f) => f.expected).map((f) => chartFrom(f.input)).find((chart) => {
        const stars = chart.palaces.find((p) => p.functionId === 'tai_bach').stars.map((s) => s.canonicalName);
        return !stars.includes('Phá Quân');
    });
assert.ok(oldPositive, 'reachable pre-existing adverse-only witness');
const oldOnly = interpretChart(oldPositive, { includeInternal: true }).statements.find((s) => s.statementId === 'palace:tai_bach');
assert.equal(oldOnly.claimApplicability.find((g) => g.claimId === oldClaim.claimId).eligible, true);
assert.equal(oldOnly.claimApplicability.find((g) => g.claimId === claimId).eligible, false);
assert.equal(oldOnly.internalProse, renderInternalProse([oldClaim]));
console.log('Tài Tử Vi/Phá Quân: finite actual approval, immutable evidence, 8 real charts, Sửu/Mùi/adverse coverage and withheld public API passed');
