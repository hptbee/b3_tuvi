import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { validateChartInput } from '../src/engine/chartInput.js';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { evaluateCondition } from '../src/engine/conditionEval.js';
import { verifyStoredSourcePalaceEvidence, verifySourcePalaceBinding } from '../src/knowledge/sourcePalaceBinding.js';
import { verifyInterpretationBinding } from '../src/knowledge/interpretationBinding.js';
import { sha256Text } from '../src/knowledge/sourceBinding.js';
import { claimEligibility } from '../src/interpretation/eligibility.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { approvedSentence, renderInternalProse } from '../src/interpretation/synthesis.js';
import { interpretationApplicabilityReport } from '../scripts/interpretationApplicability.mjs';

const root = new URL('../../', import.meta.url);
const read = ref => readFileSync(new URL(ref, root), 'utf8');
const json = ref => JSON.parse(read(ref));
const base = 'docs/knowledge/research/juan2-palace/foundational-family-packet/';
const bundle = json(base + 'review-bundle.json');
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const originalIds = [
    "interp-tu-phu-dong-cung-giap-menh",
    "interp-quanshu-tai-bach-tu-vi-four-adverse-host",
    "interp-quanshu-phuc-duc-dong-luong-host",
    "interp-quanshu-quan-loc-co-cu-dau-host",
    "interp-quanshu-phuc-co-cu-host",
    "interp-quanshu-tai-tuvi-pha-quan-host",
    "interp-quanshu-quan-co-cu-mao-host"
];
originalIds.push(...["interp-quanshu-thien-di-thien-luong-host","interp-quanshu-no-boc-thien-luong-host","interp-quanshu-thien-di-cu-mon-host","interp-quanshu-dien-trach-thien-co-host"]);
const original = claims.filter(c => originalIds.includes(c.claimId));
assert.equal(original.length, 11);
assert.equal(bundle.candidates.length, 3);
let fixtureCount = 0;
for (const candidate of bundle.candidates) {
    const id = candidate.claimId, claim = claims.find(c => c.claimId === id);
    const decision = json(claim.interpretationDecisionRef);
    const evidence = { claims, sources: json('docs/knowledge/sources.json'), decision, bundle,
        reviewA: json(base + 'review-a.json'), reviewB: json(base + 'review-b.json'), execution: json(base + 'execution.json'),
        span: read(decision.spanFile), context: read(decision.contextFile) };
    for (const wrapper of [null, [], 1, 'invalid', {}, { claims: [null] }, { claims: Array(1) }]) {
        assert.equal(verifyStoredSourcePalaceEvidence(id, wrapper).ok, false, 'malformed or sparse wrapper');
    }
    assert.equal(verifyStoredSourcePalaceEvidence(id, evidence).ok, true, id);
    assert.equal(verifySourcePalaceBinding(claim).ok, true);
    assert.equal(approvedSentence(claim), candidate.proposedWording);
    assert.deepEqual(claim.conditionTree, candidate.conditionTree);
    assert.equal(claim.conditionTree.op, 'star_present');
    assert.deepEqual(claim.limitations, candidate.limitations);
    const pc = e => e.bundle.candidates.find(c => c.claimId === id);
    const cc = e => e.claims.find(c => c.claimId === id);
    const aa = e => e.reviewA.find(c => c.claimId === id);
    const bb = e => e.reviewB.reviews.find(c => c.claimId === id);
    function denied(label, change) {
        const altered = structuredClone(evidence); change(altered);
        let result;
        assert.doesNotThrow(() => { result = verifyStoredSourcePalaceEvidence(id, altered); }, label);
        assert.equal(result.ok, false, label); assert.equal(result.approvedWording, null, label);
    }
    for (const key of Object.keys(evidence)) {
        denied(`missing ${key}`, e => { delete e[key]; });
        denied(`null ${key}`, e => { e[key] = null; });
    }
    for (const key of ['reviewBundleFile', 'executionFile', 'spanFile', 'contextFile'])
        denied(`unregistered ${key}`, e => { e.decision[key] = '../unreviewed.json'; });
    denied('duplicate claim', e => e.claims.push(cc(e)));
    denied('duplicate candidate', e => e.bundle.candidates.push(pc(e)));
    denied('duplicate reviewer', e => { e.decision.reviewers[1].model = e.decision.reviewers[0].model; });
    denied('source promoted', e => { e.sources.sources.find(s => s.sourceId === claim.sourceId).bookVerified = true; });
    denied('edition replaced', e => { e.sources.editions.find(s => s.editionId === claim.editionId).contentSha256 = '0'.repeat(64); });
    denied('source identity replaced', e => { cc(e).sourceId = pc(e).sourceId = 'other'; });
    denied('public permission', e => { cc(e).releasePermission = 'owner_released'; });
    denied('missing source qualification', e => { cc(e).limitations = pc(e).limitations = []; });
    denied('full review document mutation', e => { e.reviewB.unreviewed = true; });
    denied('actual review unavailable', e => { aa(e).available = false; });
    denied('execution mismatch', e => { e.execution.reviewers[0].agentId = 'self'; });
    // Coherent rehashing of caller-supplied evidence still cannot move immutable approval pins.
    const rehash = (e, key, value) => {
        for (const row of [pc(e), e.decision, aa(e), bb(e), bb(e).verifiedDigests]) row[key] = value;
    };
    denied('coherent predicate rewrite', e => {
        const tree = { op: 'star_present', target: candidate.target, star: 'Thái Dương' };
        for (const row of [cc(e), pc(e), aa(e), bb(e)]) row.conditionTree = tree;
        rehash(e, 'conditionTreeDigest', sha256Text(JSON.stringify(tree)));
    });
    denied('coherent predictive wording rewrite', e => {
        const wording = 'Đã xác nhận kết quả cuộc đời.';
        cc(e).approvedWording = pc(e).proposedWording = aa(e).reviewedWording = bb(e).approvedWording = wording;
        rehash(e, 'wordingDigest', sha256Text(wording));
    });
    denied('coherent source rewrite', e => {
        e.span = pc(e).sourceSpan = e.span + 'UNREVIEWED';
        rehash(e, 'sourceDigest', sha256Text(e.span));
    });
    denied('coherent context rewrite', e => { e.context += 'UNREVIEWED'; rehash(e, 'contextDigest', sha256Text(e.context)); });
    denied('coherent fixture rewrite', e => {
        pc(e).fixtures[0].expected = !pc(e).fixtures[0].expected;
        rehash(e, 'fixturesDigest', sha256Text(JSON.stringify(pc(e).fixtures)));
    });
    for (const changes of [{ approvedWording: 'UNREVIEWED' }, { conditionTree: {} }, { limitations: [] }, { claimId: 'unreviewed-clone' }]) {
        assert.equal(verifyInterpretationBinding({ ...claim, ...changes }).ok, false);
        assert.equal(approvedSentence({ ...claim, ...changes }), null);
        assert.equal(verifyInterpretationBinding(claim).ok, true, 'caller mutation cannot poison accepted cache');
    }
    const result = verifySourcePalaceBinding(claim); result.ok = false; result.approvedWording = 'changed';
    assert.equal(verifySourcePalaceBinding(claim).approvedWording, candidate.proposedWording, 'defensive result copy');
    const labels = new Set(), genders = new Set();
    for (const f of candidate.fixtures) {
        fixtureCount++; assert.equal(validateChartInput(f.input).ok, true);
        const l = solarToLunar(f.input.day, f.input.month, f.input.year);
        assert.deepEqual(l, f.lunar);
        const chart = normalizeChart({ input: {}, lunarInfo: l, tuviInfo: calculateTuVi(l.canIndex, l.chiIndex,
            l.lunarDay, l.lunarMonth, hourBranchIndex(f.input.hour), f.input.gender, l.isLeapMonth) });
        assert.equal(chart.ok, true); const before = JSON.stringify(chart);
        const host = chart.palaces.find(p => p.functionId === candidate.target);
        assert.deepEqual({ id: host.id, functionId: host.functionId, branchName: host.branchName }, f.host);
        // Frozen expected values were independently derived before review; direct host membership is a second oracle.
        const expected = host.stars.some(s => s.canonicalName === candidate.conditionTree.star);
        assert.equal(expected, f.expected, f.id);
        assert.equal(evaluateCondition(candidate.conditionTree, chart, { schoolId: chart.schoolId, profile: claim.sourceProfile }).status,
            expected ? 'satisfied' : 'not_satisfied');
        assert.equal(claimEligibility(claim, chart, host).eligible, expected);
        const statement = interpretChart(chart, { includeInternal: true }).statements.find(s => !s.thanOverlay && s.functionId === candidate.target);
        const expectedClaims = bundle.candidates.filter(c => c.target === host.functionId && host.stars.some(s => s.canonicalName === c.conditionTree.star))
            .map(c => claims.find(cl => cl.claimId === c.claimId));
        assert.equal(statement.internalProse, renderInternalProse(expectedClaims));
        assert.equal(statement.internalProse?.includes(candidate.proposedWording) || false, expected);
        const gate = statement.claimApplicability.find(g => g.claimId === id);
        assert.equal(gate.eligible, expected); assert.equal(gate.publicRelease, false);
        assert.equal(gate.layers.formulaRuntime, 'not_applicable_source_predicate');
        assert.equal(gate.layers.grade, 'not_recorded'); assert.equal(gate.layers.breaking, 'not_implemented');
        assert.equal(statement.prose, null); assert.equal(statement.publicInterpretationReleased, false);
        assert.equal(JSON.stringify(chart), before);
        for (const label of f.labels) labels.add(label); genders.add(f.input.gender);
    }
    assert.deepEqual([...genders].sort(), [-1, 1]);
    for (const label of ['positive', 'negative_wrong_host', 'negative_missing_target_star', 'positive_standalone', 'positive_cohost', 'positive_four_adverse_present', 'positive_four_adverse_absent', 'negative_opposite_only']) assert(labels.has(label), label);
    // Cold fixed loader failures close all claims sharing the affected resource, preserving all eleven previous subjects.
    for (const resource of [decision.reviewBundleFile, decision.executionFile, decision.spanFile, decision.contextFile,
        base + 'review-a.json', base + 'review-b.json', claim.interpretationDecisionRef]) {
        const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
            import fs from 'node:fs'; import assert from 'node:assert/strict'; import { syncBuiltinESMExports } from 'node:module';
            const original = fs.readFileSync;
            fs.readFileSync = function(file, ...args) {
                if (String(file).endsWith('/' + ${JSON.stringify(resource)})) throw new Error('unavailable');
                return original.call(this, file, ...args);
            }; syncBuiltinESMExports();
            const { verifyInterpretationBinding: verify } = await import(${JSON.stringify(new URL('../src/knowledge/interpretationBinding.js', import.meta.url).href)});
            assert.equal(verify(${JSON.stringify(claim)}).ok, false);
            for (const old of ${JSON.stringify(original)}) assert.equal(verify(old).ok, true, old.claimId);
        `], { encoding: 'utf8' });
        assert.equal(child.status, 0, `${resource}: ${child.stderr}`);
    }
}
assert.equal(fixtureCount, 84);
for (const old of original) assert.equal(verifyInterpretationBinding(old).ok, true);
const actual = interpretationApplicabilityReport();
const subsetIds = [...originalIds, ...bundle.candidates.map(c => c.claimId)];
const subsetMatches = actual.chartMatches.map(r => r.eligibleClaimIds.filter(id => subsetIds.includes(id)));
assert.equal(subsetMatches.filter(ids => ids.length > 0).length, 647);
assert.equal(subsetMatches.reduce((total, ids) => total + ids.length, 0), 770);
assert.equal(subsetMatches.filter(ids => ids.length > 1).length, 123);
assert.equal(actual.chartMatches.filter(r => r.eligibleClaimIds.some(id => original.some(c => c.claimId === id))).length, 419);
for (const [target, count] of Object.entries({ menh: 2, phuc_duc: 38, quan_loc: 22, tai_bach: 30, thien_di: 194, no_boc: 92, dien_trach: 92, huynh_de: 88, phu_the: 210 }))
    assert.equal(actual.chartMatches.filter(r => r.eligibleClaimIds.some(id => subsetIds.includes(id)
        && actual.perClaim[id].palace === target)).length, count, target);
console.log('Family source notes: 84 real frozen charts, exact internal wording, immutable approval pins, cold loader closure and 647/1152 actual coverage');
