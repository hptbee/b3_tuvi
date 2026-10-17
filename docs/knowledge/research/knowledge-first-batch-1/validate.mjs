// Bounded documentation consistency check. No application imports or network access.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const registry = read('../../sources.json');
const inventory = read('./inventory.json');
const evidence = read('./evidence.json');
const unique = (rows, key) => {
  const ids = rows.map(row => row[key]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate ${key}`);
  return ids.sort();
};
assert.equal(inventory.sources.length, 14);
assert.equal(inventory.editions.length, 5);
assert.deepEqual(unique(inventory.sources, 'sourceId'), unique(registry.sources, 'sourceId'));
assert.deepEqual(unique(inventory.editions, 'editionId'), unique(registry.editions, 'editionId'));
for (const row of inventory.sources) {
  const original = registry.sources.find(s => s.sourceId === row.sourceId);
  assert.equal(row.titleAsRegistered, original.title);
  assert.equal(row.language, original.language);
  for (const key of ['familyId', 'bibliographicIdentity', 'digitalArtifactVerification',
    'originalEditionAuthentication', 'textualCollation', 'access', 'reuseRights',
    'researchProgress', 'nextAction']) assert.ok(row[key], `${row.sourceId}: ${key}`);
  assert.equal(row.sourceReviewThisBatch, 'not_executed');
  assert.equal(row.runtimeApproval, 'unchanged');
  assert.equal(row.publicRelease, 'unchanged_closed');
}
for (const row of inventory.editions) {
  const original = registry.editions.find(e => e.editionId === row.editionId);
  assert.ok(inventory.sources.some(s => s.sourceId === row.sourceId));
  assert.equal(row.sourceId, original.sourceId);
  assert.equal(row.registeredAuthentication.authenticated, original.authenticated);
  assert.equal(row.registeredAuthentication.scope, original.authenticationScope ?? null);
  assert.equal(row.registeredAuthentication.originalEditionAuthenticated,
    original.originalEditionAuthenticated ?? null);
  assert.equal(row.registeredAuthentication.textCollatedAgainstOriginal,
    original.textCollatedAgainstOriginal ?? null);
}
assert.equal(evidence.repositories.length, 6);
unique(evidence.repositories, 'repo');
for (const repo of evidence.repositories) assert.match(repo.pin, /^[0-9a-f]{40}$/);
for (const file of evidence.inspectedRepositoryFiles) {
  assert.ok(evidence.repositories.some(r => r.repo === file.repo && r.pin === file.pin));
  assert.match(file.blob, /^[0-9a-f]{40}$/);
}
assert.equal(evidence.forkComparison.comparedFiles.length, 18);
unique(evidence.forkComparison.comparedFiles, 'path');
for (const file of evidence.forkComparison.comparedFiles) {
  assert.match(file.chartBlob, /^[0-9a-f]{40}$/);
  assert.equal(file.chartBlob, file.por7Blob);
}
assert.equal(Object.values(evidence.knowledgePack.categories).reduce((a, b) => a + b, 0), 162);
assert.equal(evidence.knowledgePack.counts.stars, 162);
assert.equal(evidence.approval.sourceReviewExecuted, false);
assert.equal(evidence.approval.runtimeRequested, false);
assert.equal(evidence.renhuaiDataset.datasetDownloaded, false);
const raw = fs.readFileSync(new URL('../juan2-palace/foundational-single-star-packet/raw-juan2.html', import.meta.url));
assert.equal(crypto.createHash('sha256').update(raw).digest('hex'), evidence.retainedEvidence.sha256Rechecked);
console.log('PASS: 14 sources, 5 editions, 6 repository pins, 18 matching fork blobs; recorded gates and retained Juan2 identity consistent.');
