import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { MODERN_MINOR_ALGORITHM, verifyModernMinorBinding, verifyStoredModernMinorEvidence } from '../src/knowledge/modernMinorBinding.js';
const base = new URL('../../docs/knowledge/research/fortune/modern-minor/', import.meta.url);
const text = (file) => readFileSync(new URL(file, base), 'utf8');
const json = (file) => JSON.parse(text(file));
const decision = json('decision.json');
const evidence = { bundle: json('review-bundle.json'), span: text('source-span.txt'), context: text('review-context.txt'),
    fixturesText: text('fixtures.json'), provenance: json('provenance.json'),
    reviews: [json('review-a.json'), json('review-b.json')], execution: json('execution.json'), decision,
    license: text('LICENSE.txt'), sources: JSON.parse(readFileSync(new URL('../../docs/knowledge/sources.json', import.meta.url), 'utf8')),
    supplements: Object.fromEntries(decision.supplementalEvidence.map((row) => [row.upstreamPath,
        readFileSync(new URL('../../' + row.localFile, import.meta.url), 'utf8')])) };
assert.deepEqual(verifyStoredModernMinorEvidence(evidence), { ok: true, reason: null });
assert.equal(verifyModernMinorBinding().ok, true);
for (const missing of Object.keys(evidence)) {
    const changed = structuredClone(evidence); delete changed[missing];
    assert.equal(verifyStoredModernMinorEvidence(changed).ok, false, `missing ${missing}`);
}
const mutations = [
    e => { e.span += '\n'; }, e => { e.context += '\n'; }, e => { e.fixturesText += '\n'; },
    e => { e.bundle.algorithmSpec.triadStarts[0].startBranchId = 6; },
    e => { e.decision.algorithmSpec.ageAtStart = 0; },
    e => { e.bundle.compatibilitySpec.calendarAgeDerivation = true; },
    e => { e.reviews[0].algorithmDigest = '0'.repeat(64); },
    e => { e.reviews[1].compatibilitySpec.scope = 'full_calendar'; },
    e => { e.decision.subjectType = 'interpretation_claim'; },
    e => { e.decision.profileId = 'other'; }, e => { e.decision.sourcePin = 'other'; },
    e => { e.decision.publicRelease = true; }, e => { e.decision.interpretationReviewed = true; },
    e => { e.decision.runtimeRuleChangeApplied = true; }, e => { e.decision.algorithmApproval = 'UNRESOLVED'; },
    e => { e.decision.conditions.pop(); }, e => { e.decision.exceptions.push('new'); },
    e => { e.decision.reviewers[0].available = false; },
    e => { e.decision.reviewers[1].model = e.decision.reviewers[0].model; },
    e => { e.reviews[0].available = false; }, e => { e.reviews[1].verdict = 'CONFLICT'; },
    e => { e.reviews[1].independence.otherModelVerdictRead = true; },
    e => { e.reviews[0].independentReviewIsolation = 'Read the other review'; },
    e => { e.execution.reviewers[0].agentId = 'unrelated'; },
    e => { e.execution.reviewers[0].hostBuildId = 'invented'; e.decision.reviewers[0].hostBuildId = 'invented'; },
    e => { e.bundle.payloadHashManifest = []; },
    e => { e.reviews[1].pinVerification.supplementalEvidence[0].sourcePin = 'other'; },
    e => { e.reviews[0].independentPinVerification.supplementalPinnedSources[0].pinnedUrl = 'https://example.com'; },
    e => { e.decision.reviewers[0].reviewRef = e.decision.reviewers[1].reviewRef; },
    e => { e.provenance.revision = 'other'; }, e => { e.provenance.sources[0].sha256 = '0'.repeat(64); },
    e => { e.license += '\n'; },
    e => { e.supplements['src/i18n/starAliases.ts'] += '//changed'; },
    e => { e.decision.supplementalEvidence[0].includedInOriginalContextDigest = true; },
    e => { e.decision.supplementalEvidence[0].localFile = '../../etc/passwd'; },
    e => { e.reviews[0].independentPinVerification.supplementalPinnedSources[0].sha256 = '0'.repeat(64); },
    e => { e.reviews[1].pinVerification.verifiedPayloads[0].sha256 = '0'.repeat(64); },
    e => { e.sources.sources.find(x => x.sourceId === 'iztro-modern-software').schoolId = 'vn-tam-hop-default'; },
    e => { e.sources.editions.find(x => x.editionId === 'iztro-modern-2f00e2ab0c80').authenticated = true; },
    e => { e.sources.editions.find(x => x.editionId === 'iztro-modern-2f00e2ab0c80').contentSha256 = '0'.repeat(64); }
];
mutations.forEach((mutate, index) => {
    const changed = structuredClone(evidence); mutate(changed);
    assert.equal(verifyStoredModernMinorEvidence(changed).ok, false, `mutation ${index}`);
});
assert.equal(verifyStoredModernMinorEvidence(null).ok, false);
assert.throws(() => { MODERN_MINOR_ALGORITHM.triadStarts[0].startBranchId = 12; }, TypeError);
const result = verifyModernMinorBinding(); result.ok = false;
assert.equal(verifyModernMinorBinding().ok, true);
console.log('modern minor evidence: accepted exact scope; missing and mutated evidence remains closed');
