import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { verifyStoredSourcePalaceEvidence, verifySourcePalaceBinding } from '../src/knowledge/sourcePalaceBinding.js';
import { verifyInterpretationBinding } from '../src/knowledge/interpretationBinding.js';
import { approvedSentence, renderInternalProse } from '../src/interpretation/synthesis.js';

const root = new URL('../../', import.meta.url);
const research = 'docs/knowledge/research/juan2-palace/';
const read = (ref) => readFileSync(new URL(ref, root), 'utf8');
const json = (ref) => JSON.parse(read(ref));
const claims = json('docs/knowledge/interpretation-claims.json').claims;
const bundle = json(`${research}review-bundle.json`);
for (const candidate of bundle.candidates) {
    const claim = claims.find((item) => item.claimId === candidate.claimId);
    const decision = json(claim.interpretationDecisionRef);
    const evidence = {
        claims, bundle, decision, sources: json('docs/knowledge/sources.json'),
        execution: json(decision.executionFile), span: read(decision.spanFile), context: read(decision.contextFile),
        reviewA: json('docs/knowledge/reviews/juan2-palace/review-a.json'),
        reviewB: json('docs/knowledge/reviews/juan2-palace/review-b.json')
    };
    const checked = verifyStoredSourcePalaceEvidence(claim.claimId, evidence);
    assert.equal(checked.ok, true, claim.claimId);
    assert.equal(checked.kind, 'source_palace_interpretation');
    assert.equal(checked.approvedWording, claim.approvedWording);
    assert.equal(verifyInterpretationBinding(structuredClone(claim)).ok, true);
    assert.equal(approvedSentence(claim), claim.approvedWording);
    assert.ok(renderInternalProse([claim]).includes(claim.sourceProfile));
    assert.ok(renderInternalProse([claim]).includes('không xác nhận công thức an sao của nguồn'));

    const extraIntake = structuredClone(evidence);
    extraIntake.claims.unshift({ claimId: 'future-subject', approvedForInterpretation: false });
    extraIntake.bundle.candidates.push({ claimId: 'future-subject' });
    assert.equal(verifyStoredSourcePalaceEvidence(claim.claimId, extraIntake).ok, true);

    const mutations = [
        ['subject', { claimId: 'unreviewed-clone' }], ['kind', { interpretationKind: 'other' }],
        ['type', { claimType: 'placement' }], ['source', { sourceId: 'other' }], ['edition', { editionId: 'other' }],
        ['school', { schoolId: 'other' }], ['profile', { sourceProfile: 'tan-bien' }],
        ['palace', { relatedPalaces: ['menh'] }], ['locator', { section: 'other' }],
        ['tree', { conditionTree: { op: 'star_present', target: candidate.target, star: 'Tử Vi' } }],
        ['limits', { limitations: [] }], ['condition IDs', { conditionIds: [] }],
        ['wording', { approvedWording: `${claim.approvedWording} UNREVIEWED` }],
        ['release', { releasePermission: 'owner_released' }], ['expert', { expertVerified: true }],
        ['book', { bookVerified: true }], ['synthetic', { usage: 'synthetic_test_fixture' }],
        ['legacy formula', { formulaCatalogId: 'tu_phu_dong_cung' }], ['legacy rule', { rule: { noMajor: true } }],
        ['legacy conditions', { conditions: [] }], ['new stem restriction', { yearStem: 'Giáp' }],
        ['missing decision', { interpretationDecisionRef: undefined }],
        ['traversal', { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/../approval.json' }],
        ['absolute ref', { interpretationDecisionRef: '/tmp/approval.json' }]
    ];
    for (const [name, changes] of mutations) {
        const clone = { ...claim, ...changes };
        assert.equal(verifyInterpretationBinding(clone).ok, false, name);
        assert.equal(approvedSentence(clone), null, name);
    }
    assert.equal(verifyInterpretationBinding(claim).ok, true);

    const bad = (name, mutate) => {
        const e = structuredClone(evidence);
        mutate(e);
        const result = verifyStoredSourcePalaceEvidence(claim.claimId, e);
        assert.equal(result.ok, false, `${claim.claimId}: ${name}`);
        assert.equal(result.approvedWording, null, name);
    };
    const selected = (e) => e.bundle.candidates.find((c) => c.claimId === claim.claimId);
    const registered = (e) => e.claims.find((c) => c.claimId === claim.claimId);
    const actualA = (e) => e.reviewA.find((c) => c.claimId === claim.claimId);
    const actualB = (e) => e.reviewB.reviews.find((c) => c.claimId === claim.claimId);
    for (const key of ['claims', 'bundle', 'decision', 'sources', 'execution', 'reviewA', 'reviewB', 'span', 'context']) {
        bad(`missing ${key}`, (e) => { e[key] = null; });
    }
    bad('duplicate registry subject', (e) => e.claims.push(registered(e)));
    bad('duplicate bundle subject', (e) => e.bundle.candidates.push(selected(e)));
    bad('wrong pin', (e) => { e.bundle.pin = 'other'; });
    bad('wrong artifact digest', (e) => { e.bundle.rawHtmlSha256 = '0'.repeat(64); });
    bad('unapproved registry', (e) => { registered(e).approvedForInterpretation = false; });
    bad('mixed executable fields', (e) => { registered(e).formulaCatalogId = 'fake'; });
    bad('new stored rule', (e) => { registered(e).rule = { noMajor: true }; });
    bad('wrong target', (e) => { selected(e).target = 'menh'; });
    bad('wrong span path', (e) => { selected(e).spanFile = '../span.txt'; });
    bad('wrong context path', (e) => { selected(e).contextFile = '../context.txt'; });
    bad('weakened tree and canonical claim', (e) => {
        registered(e).conditionTree = selected(e).conditionTree = { op: 'star_present', target: candidate.target, star: 'Tử Vi' };
    });
    for (const limit of claim.limitations) {
        bad(`removed recorded limit ${limit}`, (e) => {
            registered(e).limitations = selected(e).limitations = selected(e).limitations.filter((item) => item !== limit);
        });
    }
    bad('reworded canonical and packet', (e) => { registered(e).approvedWording = selected(e).proposedWording = 'UNREVIEWED'; });
    bad('removed source IDs', (e) => { registered(e).conditionIds = selected(e).conditions = []; });
    bad('fixture mutation', (e) => { selected(e).fixtures[0].expected = false; });
    bad('no negative fixtures', (e) => { selected(e).fixtures = selected(e).fixtures.filter((f) => f.expected); });
    bad('span mutation', (e) => { e.span += '\nChanged'; });
    bad('context mutation', (e) => { e.context += '\nChanged'; });
    for (const key of ['sourceDigest', 'contextDigest', 'conditionTreeDigest', 'wordingDigest', 'fixturesDigest']) {
        bad(`packet ${key}`, (e) => { selected(e)[key] = '0'.repeat(64); });
        bad(`decision ${key}`, (e) => { e.decision[key] = '0'.repeat(64); });
        bad(`actual A ${key}`, (e) => { actualA(e)[key] = '0'.repeat(64); });
        bad(`actual B ${key}`, (e) => { actualB(e)[key] = '0'.repeat(64); });
        bad(`verified B ${key}`, (e) => { actualB(e).verifiedDigests[key] = '0'.repeat(64); });
    }
    for (const [key, value] of [
        ['subjectId', 'other'], ['claimId', 'other'], ['sourceId', 'other'], ['sourceProfile', 'other'],
        ['target', 'menh'], ['locator', 'other'], ['policyVersion', 'other'], ['decision', 'UNRESOLVED'],
        ['interpretationDecision', 'UNRESOLVED'], ['interpretationVerdict', 'UNRESOLVED'],
        ['reviewBundleFile', '../packet.json'], ['executionFile', '/tmp/execution.json'],
        ['spanFile', '../span.txt'], ['contextFile', '../context.txt'], ['sourcePin', 'other'],
        ['publicRelease', true], ['bookVerified', true], ['runtimeRuleChangeApplied', true], ['compatibilityNote', 'other']
    ]) bad(`decision ${key}`, (e) => { e.decision[key] = value; });
    const source = (e) => e.sources.sources.find((s) => s.sourceId === claim.sourceId);
    const edition = (e) => e.sources.editions.find((s) => s.editionId === claim.editionId);
    bad('primary promotion', (e) => { source(e).bibliographicStatus = 'primary'; });
    bad('source-school equivalence', (e) => { source(e).schoolId = 'vn-tam-hop-default'; });
    bad('different source URL', (e) => { source(e).url = 'https://example.com'; });
    bad('different witness type', (e) => { edition(e).documentType = 'original_edition'; });
    bad('authenticated edition', (e) => { edition(e).authenticated = true; });
    bad('original-edition promotion', (e) => { edition(e).originalEditionAuthenticated = true; });
    bad('different revision', (e) => { edition(e).gitCommit = 'other'; });
    bad('different acquired HTML', (e) => { edition(e).contentSha256 = '0'.repeat(64); });
    for (const key of ['model', 'agentId', 'reviewRef']) {
        bad(`duplicate ${key}`, (e) => { e.decision.reviewers[1][key] = e.decision.reviewers[0][key]; });
        bad(`execution ${key}`, (e) => { e.execution.reviewers[0][key] = 'other'; });
    }
    bad('reviewer verdict', (e) => { e.decision.reviewers[0].interpretationVerdict = 'UNRESOLVED'; });
    bad('missing reviewer', (e) => e.decision.reviewers.pop());
    bad('duplicate execution', (e) => e.execution.reviewers.push(e.execution.reviewers[0]));
    bad('unregistered review path', (e) => { e.decision.reviewers[0].reviewRef = '../review.json'; });
    bad('duplicate actual subject', (e) => e.reviewA.push(actualA(e)));
    bad('wrong actual model', (e) => { actualA(e).model = 'other'; });
    bad('envelope independence', (e) => { e.reviewB.otherReviewerVerdictsRead = true; });
    bad('MATCH without interpretation approval', (e) => { actualB(e).interpretationVerdict = 'UNRESOLVED'; });
    bad('actual unavailable', (e) => { actualA(e).available = false; });
    bad('actual wording A', (e) => { actualA(e).reviewedWording = 'UNREVIEWED'; });
    bad('actual wording B', (e) => { actualB(e).approvedWording = 'UNREVIEWED'; });
    bad('actual limits', (e) => actualA(e).limitations.pop());
    bad('actual tree', (e) => { actualB(e).conditionTree = { op: 'not', item: candidate.conditionTree }; });
    bad('source acquisition identity', (e) => { actualA(e).sourceAssessment.pin = 'other'; });
    bad('source acquisition hash', (e) => { actualA(e).sourceAssessment.independentPinnedRawFetch.sha256 = '0'.repeat(64); });
    bad('default formula promotion', (e) => { actualB(e).defaultFormulaChangeAuthorized = true; });
    bad('replay quotation', (e) => { actualA(e).quotation = 'Not in the source'; });
    bad('replay conditions', (e) => actualB(e).conditions.pop());
    bad('replay decision conditions', (e) => e.decision.conditions.pop());
}
assert.equal(verifySourcePalaceBinding(null).ok, false);
assert.equal(verifyStoredSourcePalaceEvidence('unknown', {}).ok, false);
for (const malformed of [undefined, null, {}, { claims: [] }]) {
    assert.equal(verifyStoredSourcePalaceEvidence(bundle.candidates[0].claimId, malformed).ok, false);
}

// Default facade fails closed on real read/parse failures without changing the
// repository evidence or exposing a runtime approval override.
for (const mode of ['missing', 'malformed']) {
    const claim = claims.find((item) => item.claimId === bundle.candidates[0].claimId);
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
        import fs from 'node:fs';
        import { syncBuiltinESMExports } from 'node:module';
        import assert from 'node:assert/strict';
        const original = fs.readFileSync;
        fs.readFileSync = function(file, ...args) {
            if(String(file).endsWith('/docs/knowledge/research/juan2-palace/review-bundle.json')) {
                if(${JSON.stringify(mode)} === 'missing') throw new Error('unavailable');
                return '{';
            }
            return original.call(this,file,...args);
        };
        syncBuiltinESMExports();
        const { verifyInterpretationBinding } = await import(${JSON.stringify(new URL('../src/knowledge/interpretationBinding.js', import.meta.url).href)});
        assert.equal(verifyInterpretationBinding(${JSON.stringify(claim)}).reason, 'source_palace_evidence_unavailable');
    `], { encoding: 'utf8' });
    assert.equal(child.status, 0, child.stderr);
}
console.log('source-palace evidence: two actual model documents, source replay, five digests and exact scope remain bound');
