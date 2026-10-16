import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { verifyInterpretationBinding, verifyStoredInterpretationEvidence } from '../src/knowledge/interpretationBinding.js';
import { approvedSentence, renderInternalProse } from '../src/interpretation/synthesis.js';

const root = new URL('../../', import.meta.url);
const read = (ref) => readFileSync(new URL(ref, root), 'utf8');
const json = (ref) => JSON.parse(read(ref));
const decision = json('docs/knowledge/interpretation-decisions/tu-phu-dong-cung.json');
const evidence = {
    claims: json('docs/knowledge/interpretation-claims.json').claims,
    decision,
    reviews: decision.reviewers.map(({ reviewRef }) => ({ reviewRef, document: json(reviewRef) })),
    span: read(decision.spanFile),
    formula: json('docs/knowledge/decisions/tu-phu-dong-cung.json'),
    passages: json('docs/knowledge/combination-passages.json').entries,
    sources: json('docs/knowledge/sources.json')
};
const claim = evidence.claims[0];
assert.deepEqual(verifyStoredInterpretationEvidence(evidence), { ok: true, reason: null, approvedWording: claim.approvedWording });
const futureIntake = structuredClone(evidence);
futureIntake.claims.unshift({ claimId: 'unreviewed-future-subject', interpretationStatus: 'draft' });
assert.equal(verifyStoredInterpretationEvidence(futureIntake).ok, true);
assert.equal(verifyInterpretationBinding(structuredClone(claim)).ok, true);
assert.equal(approvedSentence(claim), claim.approvedWording);
assert.equal(approvedSentence(null), null);
assert.equal(renderInternalProse([]), null);

// Caller mutations cannot borrow the registered subject's approval, including
// added executable conditions and constraints omitted from the reviewed scope.
const claimMutations = [
    ['identity', { claimId: 'unreviewed-clone' }],
    ['missing reference', { interpretationDecisionRef: undefined }],
    ['unregistered reference', { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/missing.json' }],
    ['traversal', { interpretationDecisionRef: 'docs/knowledge/interpretation-decisions/../tu-phu-dong-cung.json' }],
    ['absolute path', { interpretationDecisionRef: '/tmp/approval.json' }],
    ['source', { sourceId: 'other-source' }],
    ['edition', { editionId: 'other-edition' }],
    ['locator', { section: 'other-section' }],
    ['school', { schoolId: 'other-school' }],
    ['profile', { sourceProfile: 'modern-108s' }],
    ['catalog', { formulaCatalogId: 'other-formula' }],
    ['wording', { approvedWording: 'UNREVIEWED SENTENCE' }],
    ['appended wording', { approvedWording: `${claim.approvedWording} Thêm lời chưa duyệt.` }],
    ['removed caveat', { approvedWording: evidence.reviews[0].document.supportedQuotes[0] }],
    ['removed stem', { yearStem: undefined }],
    ['changed stem', { yearStem: 'Ất' }],
    ['palace', { relatedPalaces: ['tai_bach'] }],
    ['limits', { limitations: claim.limitations.slice(1) }],
    ['conditions', { conditions: [] }],
    ['stars', { relatedStars: [] }],
    ['rule', { rule: { target: 'menh', noMajor: true } }],
    ['release', { releasePermission: 'owner_released' }],
    ['expert', { expertVerified: true }],
    ['synthetic', { usage: 'synthetic_test_fixture' }],
    ['contradiction', { contradicts: ['another-claim'] }]
];
for (const [name, changes] of claimMutations) {
    const clone = { ...claim, ...changes };
    assert.equal(verifyInterpretationBinding(clone).ok, false, name);
    assert.equal(approvedSentence(clone), null, name);
    assert.equal(renderInternalProse([clone]), null, name);
}
// A failed same-ID clone must not poison or reuse a prior result.
assert.equal(verifyInterpretationBinding(claim).ok, true);

const badEvidence = (name, mutate, reason) => {
    const changed = structuredClone(evidence);
    mutate(changed);
    const result = verifyStoredInterpretationEvidence(changed);
    assert.equal(result.ok, false, name);
    assert.equal(result.approvedWording, null, name);
    if (reason) assert.equal(result.reason, reason, name);
};
for (const missing of [undefined, null, {}, { claims: null }, { claims: [null] }]) {
    assert.equal(verifyStoredInterpretationEvidence(missing).ok, false);
}
badEvidence('duplicate registered subject', (e) => e.claims.push(e.claims[0]));
badEvidence('unapproved registry', (e) => { e.claims[0].approvedForInterpretation = false; });
badEvidence('registry changes reviewed year stem', (e) => { e.claims[0].yearStem = 'Ất'; });
badEvidence('registry changes reviewed palace', (e) => { e.claims[0].relatedPalaces = ['tai_bach']; });
badEvidence('registry adds executable rule', (e) => { e.claims[0].rule = { noMajor: true }; });
badEvidence('registry adds executable conditions', (e) => { e.claims[0].conditions = []; });
badEvidence('registry adds executable star predicate', (e) => { e.claims[0].relatedStars = ['tu_vi']; });
for (const limit of claim.limitations) {
    badEvidence(`registry removes recorded limit ${limit}`, (e) => {
        e.claims[0].limitations = e.claims[0].limitations.filter((item) => item !== limit);
    });
}
badEvidence('missing decision', (e) => { e.decision = null; });
for (const [key, value] of [
    ['policyVersion', 'dual-ai-source-review-v1'], ['subjectType', 'claim'], ['subjectId', 'other-subject'],
    ['sourceId', 'other-source'], ['editionId', 'other-edition'], ['schoolId', 'other-school'],
    ['locator', 'other-locator'], ['spanFile', 'docs/knowledge/passages/../span.txt'],
    ['decision', 'UNRESOLVED'], ['expertVerified', true], ['publicRelease', true],
    ['gradeStatus', 'satisfied'], ['breakingStatus', 'checked_clear'], ['disagreement', '']
]) badEvidence(`decision ${key}`, (e) => { e.decision[key] = value; });
badEvidence('missing source', (e) => { e.sources = null; });
badEvidence('malformed source list', (e) => { e.sources.sources = {}; });
badEvidence('malformed edition list', (e) => { e.sources.editions = {}; });
badEvidence('wrong source school', (e) => { e.sources.sources.find((s) => s.sourceId === claim.sourceId).schoolId = 'other'; });
badEvidence('wrong edition source', (e) => { e.sources.editions.find((s) => s.editionId === claim.editionId).sourceId = 'other'; });
badEvidence('missing reviewers', (e) => { e.decision.reviewers = null; });
badEvidence('one reviewer', (e) => e.decision.reviewers.pop());
badEvidence('one actual review', (e) => e.reviews.pop());
badEvidence('missing actual reviews', (e) => { e.reviews = null; });
badEvidence('null reviewer', (e) => { e.decision.reviewers[0] = null; });
for (const key of ['model', 'agentId', 'reviewRef']) {
    badEvidence(`duplicate ${key}`, (e) => { e.decision.reviewers[1][key] = e.decision.reviewers[0][key]; });
    badEvidence(`blank ${key}`, (e) => { e.decision.reviewers[0][key] = ' '; });
}
badEvidence('review traversal reference', (e) => { e.decision.reviewers[0].reviewRef = 'docs/knowledge/reviews/../other.json'; });
badEvidence('missing review document', (e) => { e.reviews[0].document = null; });
badEvidence('duplicate actual reference', (e) => { e.reviews[1].reviewRef = e.reviews[0].reviewRef; });
badEvidence('decision reviewer verdict', (e) => { e.decision.reviewers[0].verdict = 'MATCH'; });
for (const [key, value] of [
    ['scope', 'formula'], ['subjectId', 'other'], ['model', 'copied-label'], ['agentId', 'copied-agent'],
    ['verdict', 'UNRESOLVED'], ['expertVerified', true], ['supportedQuotes', []], ['limitations', []],
    ['absoluteClaims', ['UNREVIEWED ABSOLUTE CLAIM']]
]) badEvidence(`actual review ${key}`, (e) => { e.reviews[0].document[key] = value; });
badEvidence('one-review-only quotation', (e) => { e.reviews[1].document.supportedQuotes = ['A different complete source sentence.']; });
badEvidence('shared substring only', (e) => {
    for (const item of e.reviews) item.document.supportedQuotes = ['Tuổi Giáp có cách này'];
});
badEvidence('quotation outside span', (e) => { e.span = 'Other source text'; });
badEvidence('missing span', (e) => { e.span = null; });
badEvidence('missing caveat in registry', (e) => { e.claims[0].approvedWording = e.reviews[0].document.supportedQuotes[0]; });
badEvidence('missing formula', (e) => { e.formula = null; });
badEvidence('missing formula decision ID', (e) => { e.decision.formulaDecisionId = undefined; });
badEvidence('wrong formula decision ID', (e) => { e.decision.formulaDecisionId = 'other'; });
badEvidence('formula not accepted', (e) => { e.formula.decision = 'UNRESOLVED'; });
badEvidence('formula source mismatch', (e) => { e.formula.sourceId = 'other'; });
badEvidence('formula subject mismatch', (e) => { e.formula.subjectId = 'other'; });
badEvidence('missing passage', (e) => { e.passages = []; });
badEvidence('malformed passages', (e) => { e.passages = {}; });
badEvidence('duplicate passage', (e) => e.passages.push(e.passages[0]));
badEvidence('different span file', (e) => { e.passages[0].spanFile = 'other'; });
badEvidence('different formula catalog', (e) => { e.claims[0].formulaCatalogId = 'unknown'; });
badEvidence('different formula profile', (e) => { e.claims[0].sourceProfile = 'modern-108s'; });
badEvidence('wrong digest', (e) => { e.formula.sourceDigest = '0'.repeat(64); }, 'interpretation_formula_unbound');
badEvidence('altered span outside approved quote', (e) => { e.span += '\nAltered source evidence'; }, 'interpretation_formula_unbound');
badEvidence('formula replay mismatch', (e) => e.formula.conditions.pop(), 'interpretation_formula_unbound');

// Exercise missing/malformed on-disk evidence without editing any repository
// document or adding an approval bypass. Each child owns its temporary fs mock.
for (const mode of ['missing', 'malformed', 'unregistered_ref']) {
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
        import fs from 'node:fs';
        import { syncBuiltinESMExports } from 'node:module';
        import assert from 'node:assert/strict';
        const original = fs.readFileSync;
        fs.readFileSync = function (file, ...args) {
            if (String(file).endsWith('/docs/knowledge/interpretation-decisions/tu-phu-dong-cung.json')) {
                if (${JSON.stringify(mode)} === 'missing') throw new Error('unavailable');
                if (${JSON.stringify(mode)} === 'malformed') return '{';
                const record = JSON.parse(original.call(this, file, ...args));
                record.reviewers[0].reviewRef = '/tmp/unregistered-approval.json';
                return JSON.stringify(record);
            }
            return original.call(this, file, ...args);
        };
        syncBuiltinESMExports();
        const { verifyInterpretationBinding } = await import(${JSON.stringify(new URL('../src/knowledge/interpretationBinding.js', import.meta.url).href)});
        const { approvedSentence } = await import(${JSON.stringify(new URL('../src/interpretation/synthesis.js', import.meta.url).href)});
        const claim = ${JSON.stringify(claim)};
        assert.equal(verifyInterpretationBinding(claim).reason, 'interpretation_evidence_unavailable');
        assert.equal(approvedSentence(claim), null);
    `], { encoding: 'utf8' });
    assert.equal(child.status, 0, `${mode}: ${child.stderr}`);
}

console.log('interpretation evidence binds the existing decision, actual reviews, quote and formula; unreviewed clones stay closed');
