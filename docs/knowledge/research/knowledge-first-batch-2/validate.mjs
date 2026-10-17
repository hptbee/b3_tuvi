// Offline research-record validation; no application code or external source execution.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir = new URL('./', import.meta.url);
const read = file => JSON.parse(fs.readFileSync(new URL(file,dir),'utf8'));
const registry = read('../../sources.json');
const records = read('knowledge-records.json').records;
const comparisons = read('comparisons.json').comparisons;
const evidence = read('evidence.json');
const index = read('major-star-palace-index.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const bytes = fs.readFileSync(evidence.primary.path);
const lines = bytes.toString('utf8').split(/\r?\n/);
assert.equal(sha(bytes), evidence.primary.sha256);
const unique = (rows,key) => assert.equal(new Set(rows.map(r=>r[key])).size,rows.length,`Duplicate ${key}`);
unique(records,'recordId'); unique(comparisons,'comparisonId'); unique(index.cells,'cellId');
const spanCheck = span => {
  assert.equal(span.path,evidence.primary.path);
  assert.ok(Number.isInteger(span.startLine) && span.startLine>0 && span.endLine>=span.startLine);
  assert.ok(span.endLine<=lines.length);
  assert.equal(sha(lines.slice(span.startLine-1,span.endLine).join('\n')),span.sha256);
};
const dossier = fs.readFileSync(new URL('DOSSIER.md',dir),'utf8');
const subjects = new Set();
for(const r of records){
  const key = `${r.subject.palaceId}:${r.subject.starId}`;
  assert.ok(!subjects.has(key),`Duplicate case ${key}`); subjects.add(key);
  assert.ok(index.stars.some(s=>s.starId===r.subject.starId));
  assert.ok(index.palaces.some(p=>p.palaceId===r.subject.palaceId));
  for(const field of ['predicate','meaningVi','conditions','modifiers','exceptions','relationships',
    'positiveBranches','adverseBranches','uncertainties','contradicts','nextAction','rights','sourceFamilyDependencies']) {
    assert.ok(Object.hasOwn(r,field),`${r.recordId} missing ${field}`);
  }
  assert.ok(r.conditions.length && r.uncertainties.length && r.exclusions.length);
  assert.equal(r.status.collection,'COLLECTED');
  assert.equal(r.status.contextMapping,'CONTEXT_MAPPED');
  assert.equal(r.status.sourceReview,'not_executed');
  assert.equal(r.status.runtimeApproval,'not_requested');
  assert.equal(r.status.publicRelease,'withheld_closed');
  assert.equal(r.verificationStatus.implementationStatus,'not_executable');
  assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');
  assert.equal(r.schoolId,null);
  assert.ok(dossier.includes(`### ${r.recordId}\n`));
  assert.ok(fs.existsSync(r.dossierRef.split('#')[0]));
  assert.ok(fs.existsSync(r.evidenceRef));
  spanCheck(r.governingContext.location);
  for(const ref of r.sourceReferences){
    const registered = registry.sources.find(s=>s.sourceId===ref.sourceId);
    assert.ok(registered);
    assert.ok(registry.editions.some(e=>e.editionId===ref.editionId&&e.sourceId===ref.sourceId));
    assert.equal(ref.author,registered.author);
    assert.equal(ref.originalQuotation,null);
    spanCheck(ref.location);
  }
  for(const rel of r.relationships) if(rel.location) spanCheck(rel.location);
  for(const id of r.comparisonIds){
    const c = comparisons.find(c=>c.comparisonId===id);
    assert.ok(c && c.recordIds.includes(r.recordId));
  }
  if(r.status.research==='CONFLICTING') assert.ok(r.contradicts.length);
}
for(const c of comparisons){
  assert.ok(registry.sources.some(s=>s.sourceId===c.sourceReference.sourceId));
  assert.equal(c.sourceReference.editionId,null); // attributed web witness, no invented edition
  assert.equal(c.sourceReference.originalQuotation,null);
  for(const id of c.recordIds) assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));
}
assert.equal(index.stars.length,14); assert.equal(index.palaces.length,12); assert.equal(index.cells.length,168);
unique(index.stars,'starId'); unique(index.palaces,'palaceId');
const counts={};
for(const c of index.cells){
  const p=index.palaces.find(p=>p.palaceId===c.palaceId);
  const s=index.stars.find(s=>s.starId===c.starId);
  assert.ok(p&&s); assert.equal(c.cellId,`${p.palaceId}:${s.starId}`);
  assert.ok(index.statusVocabulary.includes(c.status));
  counts[c.status]=(counts[c.status]??0)+1;
  for(const n of c.location.lineNumbers){
    assert.ok(n>p.startLine&&n<=p.endLine);
    assert.ok(lines[n-1].includes(s.name));
    if(c.location.kind==='paragraph_opening') assert.ok(lines[n-1].startsWith(s.name));
  }
  if(c.status==='NO_PASSAGE_FOUND_IN_SEARCHED_CORPUS') {
    assert.ok(!lines.slice(p.startLine,p.endLine).some(line=>line.includes(s.name)));
  } else assert.ok(c.location.lineNumbers.length);
  for(const id of c.recordIds){
    const r=records.find(r=>r.recordId===id);
    assert.ok(r&&r.subject.starId===s.starId&&r.subject.palaceId===p.palaceId);
    assert.equal(c.status,r.status.research);
  }
  if(['COMPARED','CONTEXT_MAPPED','CONFLICTING'].includes(c.status)) assert.ok(c.recordIds.length);
}
assert.deepEqual(counts,index.counts);
for(const r of records) assert.ok(index.cells.some(c=>c.recordIds.includes(r.recordId)));
assert.equal(evidence.approval.sourceReviewExecuted,false);
assert.equal(evidence.approval.runtimeApprovalRequested,false);
console.log(`PASS: ${records.length} persisted cases, ${comparisons.length} comparator notes, 168 exact-location cells; span hashes, references and closed approval dimensions consistent.`);
