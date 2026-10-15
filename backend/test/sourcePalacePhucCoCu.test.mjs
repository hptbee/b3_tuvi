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
const claimId = 'interp-quanshu-phuc-co-cu-host';
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const claim = claims.find((item) => item.claimId === claimId);
const decision = json(claim.interpretationDecisionRef);
const evidence = {
    claims, decision, sources: json('docs/knowledge/sources.json'),
    bundle: json(decision.reviewBundleFile), execution: json(decision.executionFile),
    span: read(decision.spanFile), context: read(decision.contextFile),
    reviewA: json('docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-a.json'),
    reviewB: json('docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-b.json')
};
const candidate = evidence.bundle.candidates[0];
const registered = (e) => e.claims.find((item) => item.claimId === claimId);
const packet = (e) => e.bundle.candidates[0];
assert.equal(verifyStoredSourcePalaceEvidence(claimId, evidence).ok, true);
assert.equal(verifySourcePalaceBinding(structuredClone(claim)).ok, true);
assert.equal(approvedSentence(claim), candidate.proposedWording);
assert.ok(renderInternalProse([claim]).includes('không xác nhận công thức an sao của nguồn'));
assert.equal(candidate.conditionTree.op, 'same_palace');
assert.deepEqual(candidate.conditionTree.stars, ['Thiên Cơ', 'Cự Môn']);
assert.ok(candidate.limitations.includes('added_adverse_clauses_retained_but_not_evaluated'));
assert.ok(evidence.span.includes('加羊陀火鈴空劫奔走不得寧靜'));
assert.ok(evidence.span.includes('加羊陀火鈴空劫生平多憂'));

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
    { op: 'star_present', target: 'phuc_duc', star: 'Thiên Cơ' },
    { op: 'or', items: [{ op: 'star_present', target: 'phuc_duc', star: 'Thiên Cơ' }, { op: 'star_present', target: 'phuc_duc', star: 'Cự Môn' }] },
    { op: 'same_palace', target: 'quan_loc', stars: ['Thiên Cơ', 'Cự Môn'] },
    { op: 'and', items: [candidate.conditionTree, { op: 'palace_branch', target: 'phuc_duc', branches: ['Dậu'] }] }
]) denied(`coherent tree rewrite ${JSON.stringify(tree)}`, (e) => {
    for (const row of [registered(e), packet(e), e.reviewA[0], e.reviewB.reviews[0]]) row.conditionTree = tree;
    rehash(e, 'conditionTreeDigest', sha256Text(JSON.stringify(tree)));
});
denied('coherent wording rewrite', (e) => {
    const wording = 'Đã xác nhận sức khỏe và tính cách.';
    registered(e).approvedWording = packet(e).proposedWording = e.reviewA[0].reviewedWording = e.reviewB.reviews[0].approvedWording = wording;
    rehash(e, 'wordingDigest', sha256Text(wording));
});
denied('coherent fixture rewrite', (e) => {
    packet(e).fixtures[0].expected = !packet(e).fixtures[0].expected;
    rehash(e, 'fixturesDigest', sha256Text(JSON.stringify(packet(e).fixtures)));
});
for (const changes of [
    { claimId: 'unreviewed-clone' }, { approvedWording: 'UNREVIEWED' }, { limitations: [] },
    { conditionTree: { op: 'star_present', target: 'phuc_duc', star: 'Thiên Cơ' } },
    { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/juan2-phuc-dong-luong.json' }
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
    'docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-a.json', 'docs/knowledge/reviews/juan2-palace/review-phuc-co-cu-b.json']) {
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
assert.equal(candidate.fixtures.length, 19);
assert.equal(candidate.fixtures.filter((f) => f.expected).length, 7);
const positiveCells = new Set();
for (const fixture of candidate.fixtures) {
    const chart = chartFrom(fixture.input), before = JSON.stringify(chart);
    const host = chart.palaces.find((p) => p.functionId === 'phuc_duc');
    assert.deepEqual(chart.lunar, fixture.lunar);
    assert.deepEqual({ id: host.id, functionId: host.functionId, branchName: host.branchName }, fixture.host);
    const names = new Set(host.stars.map((s) => s.canonicalName));
    const independent = names.has('Thiên Cơ') && names.has('Cự Môn');
    assert.equal(independent, fixture.expected, fixture.id);
    if (independent) positiveCells.add(`${host.branchName}:${['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh'].some((s) => names.has(s))}`);
    const trace = evaluateCondition(candidate.conditionTree, chart, { schoolId: chart.schoolId, profile: claim.sourceProfile });
    assert.equal(trace.status, fixture.expected ? 'satisfied' : 'not_satisfied');
    const direct = claimEligibility(claim, chart, host);
    assert.equal(direct.eligible, fixture.expected);
    const statement = interpretChart(chart, { includeInternal: true }).statements.find((s) => s.statementId === 'palace:phuc_duc');
    const gate = statement.claimApplicability.find((g) => g.claimId === claimId);
    assert.equal(gate.eligible, fixture.expected);
    assert.equal(gate.layers.formulaRuntime, 'not_applicable_source_predicate');
    assert.equal(gate.layers.grade, 'not_recorded');
    assert.equal(gate.layers.breaking, 'not_implemented');
    assert.equal(gate.publicRelease, false);
    assert.equal(statement.prose, null);
    assert.equal(statement.publicInterpretationReleased, false);
    assert.equal(statement.internalProse?.includes(candidate.proposedWording) || false, fixture.expected);
    if (fixture.expected) assert.ok(statement.internalProse.includes('các điều kiện gia sát ở cuối đoạn chưa được đánh giá'));
    const api = analyzeChartRequest(fixture.input);
    assert.equal(api.status, 200);
    const publicHost = api.body.statements.find((s) => s.statementId === 'palace:phuc_duc');
    assert.equal(publicHost.claimApplicability.find((g) => g.claimId === claimId).eligible, fixture.expected);
    assert.ok(api.body.statements.every((s) => s.prose === null && !Object.hasOwn(s, 'internalProse')));
    assert.ok(api.body.wholeChart.topics.every((t) => t.prose === null));
    assert.equal(JSON.stringify(chart), before);
}
assert.deepEqual([...positiveCells].sort(), ['Dậu:false', 'Dậu:true', 'Mão:false', 'Mão:true']);
console.log('Phúc Cơ/Cự: finite actual approval, immutable evidence, 19 real charts, Mão/Dậu/adverse coverage and withheld public API passed');
