// Offline provenance/reference checks only; these do not certify interpretation truth.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir=new URL('./',import.meta.url);
const read=file=>JSON.parse(fs.readFileSync(new URL(file,dir),'utf8'));
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const registry=read('../../sources.json');
const records=read('knowledge-records.json').records;
const comparisons=read('comparisons.json').comparisons;
const evidence=read('evidence.json');
const index=read('../KNOWLEDGE_RECORD_INDEX.json');
const baseline=read('../knowledge-first-batch-2/major-star-palace-index.json');
const dossier=fs.readFileSync(new URL('DOSSIER.md',dir),'utf8');
const unique=(rows,key)=>assert.equal(new Set(rows.map(r=>r[key])).size,rows.length,`Duplicate ${key}`);
unique(records,'recordId'); unique(comparisons,'comparisonId'); unique(index.records,'recordId');
for(const corpus of [evidence.primary,evidence.methodWitness]) assert.equal(hash(fs.readFileSync(corpus.path)),corpus.sha256);
const spanCheck=s=>{
  const lines=fs.readFileSync(s.path,'utf8').split(/\r?\n/);
  assert.ok(Number.isInteger(s.startLine)&&s.startLine>0&&s.endLine>=s.startLine&&s.endLine<=lines.length);
  assert.equal(hash(lines.slice(s.startLine-1,s.endLine).join('\n')),s.sha256);
};
for(const r of records){
  for(const key of ['predicate','meaningVi','governingContext','conditions','modifiers','exceptions','relationships','uncertainties','nextAction','sourceReferences','sourceFamilyDependencies','rights','dossierRef','evidenceRef']) assert.ok(r[key],`${r.recordId}: ${key}`);
  assert.ok(r.conditions.length&&r.uncertainties.length&&r.exclusions.length);
  assert.equal(r.schoolId,null);
  assert.equal(r.status.collection,'COLLECTED'); assert.equal(r.status.contextMapping,'CONTEXT_MAPPED');
  assert.equal(r.status.sourceReview,'not_executed'); assert.equal(r.status.runtimeApproval,'not_requested');
  assert.equal(r.status.publicRelease,'withheld_closed');
  assert.equal(r.verificationStatus.implementationStatus,'not_executable');
  assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');
  assert.ok(dossier.includes(`### ${r.recordId}\n`));
  for(const path of [r.dossierRef.split('#')[0],r.evidenceRef]) assert.ok(fs.existsSync(path));
  if(r.subject.starId){
    assert.ok(baseline.stars.some(s=>s.starId===r.subject.starId));
    assert.ok(baseline.palaces.some(p=>p.palaceId===r.subject.palaceId));
  } else assert.ok(r.subject.terms.length);
  for(const ref of r.sourceReferences){
    assert.equal(ref.originalQuotation,null);
    if(ref.sourceId){
      assert.ok(registry.sources.some(s=>s.sourceId===ref.sourceId));
      assert.ok(registry.editions.some(e=>e.editionId===ref.editionId&&e.sourceId===ref.sourceId));
      spanCheck(ref.location);
    } else {
      assert.equal(ref.provisionalWitnessId,evidence.lingDirectAccess.provisionalWitnessId);
      assert.equal(ref.author,evidence.lingDirectAccess.author);
      assert.equal(ref.location.sourceTextRetained,false);
    }
  }
  if(r.governingContext.location) spanCheck(r.governingContext.location);
  if(r.governingContext.generalMethodReference) spanCheck(r.governingContext.generalMethodReference.location);
  for(const rel of r.relationships) if(rel.location) spanCheck(rel.location);
  for(const id of r.comparisonIds) assert.ok(comparisons.some(c=>c.comparisonId===id&&c.recordIds.includes(r.recordId)));
  for(const id of r.extendsRecordIds??[]) assert.ok(index.records.some(x=>x.recordId===id&&x.file.includes('batch-2')));
  if(r.status.research==='CONFLICTING') assert.ok(r.contradicts.length);
}
for(const c of comparisons){
  assert.equal(c.sourceReference.originalQuotation,null);
  assert.ok(c.sourceReference.sourceId?registry.sources.some(s=>s.sourceId===c.sourceReference.sourceId):c.sourceReference.provisionalWitnessId===evidence.lingDirectAccess.provisionalWitnessId);
  for(const id of c.recordIds) assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));
}
const all=index.recordFiles.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
assert.equal(index.records.length,all.length);
for(const entry of index.records) assert.equal(all.filter(({file,record:r})=>file===entry.file&&r.recordId===entry.recordId).length,1);
const cellMap=new Map();
for(const {record:r}of all){
  if(!r.subject.starId||!r.subject.palaceId)continue;
  const key=`${r.subject.palaceId}:${r.subject.starId}`;
  if(!cellMap.has(key))cellMap.set(key,[]);cellMap.get(key).push(r);
}
assert.equal(index.metrics.contextualCells,cellMap.size); assert.equal(index.metrics.indexedCells,baseline.cells.length);
assert.equal(index.metrics.locatedOnlyCells,168-cellMap.size);
assert.equal(index.metrics.comparedCellsIncludingDisputed,[...cellMap.values()].filter(rs=>rs.some(r=>['COMPARED','CONFLICTING'].includes(r.status.research))).length);
assert.equal(index.metrics.cellsWithConflictingResearchStatus,[...cellMap.values()].filter(rs=>rs.some(r=>r.status.research==='CONFLICTING')).length);
assert.equal(index.metrics.cellsWithContradictionFlags,[...cellMap.values()].filter(rs=>rs.some(r=>r.contradicts.length)).length);
for(const cell of index.cells){assert.ok(baseline.cells.some(c=>c.cellId===cell.cellId));assert.deepEqual(cell.recordIds,cellMap.get(cell.cellId).map(r=>r.recordId));}
for(const [path,sha]of Object.entries(evidence.historicalSnapshots??{}))assert.equal(hash(fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n')),sha);
assert.equal(evidence.approval.sourceReviewExecuted,false);assert.equal(evidence.approval.runtimeApprovalRequested,false);
console.log(`PASS: ${records.length} new records, ${comparisons.length} comparison notes; ${all.length} canonical references, ${cellMap.size}/168 contextual cells; identities, locators, linked supplements and closed gates consistent.`);
