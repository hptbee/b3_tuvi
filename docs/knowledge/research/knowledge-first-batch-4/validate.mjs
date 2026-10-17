// Offline research-data checks only, not source authentication or interpretation review.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir='docs/knowledge/research/knowledge-first-batch-4';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const {records}=read(`${dir}/knowledge-records.json`);
const {comparisons}=read(`${dir}/comparisons.json`);
const {dispositions}=read(`${dir}/dispositions.json`);
const evidence=read(`${dir}/evidence.json`);
const index=read('docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json');
const baseline=read('docs/knowledge/research/knowledge-first-batch-2/major-star-palace-index.json');
const registry=read('docs/knowledge/sources.json');
const dossier=fs.readFileSync(`${dir}/DOSSIER.md`,'utf8').replace(/\r\n/g,'\n');
const unique=(rs,key)=>assert.equal(new Set(rs.map(r=>r[key])).size,rs.length,`Duplicate ${key}`);
unique(records,'recordId');unique(comparisons,'comparisonId');unique(dispositions,'dispositionId');unique(index.records,'recordId');
const spanCheck=s=>{
 const lines=fs.readFileSync(s.path,'utf8').split(/\r?\n/);
 assert.ok(Number.isInteger(s.startLine)&&s.startLine>0&&s.endLine>=s.startLine&&s.endLine<=lines.length);
 assert.equal(hash(lines.slice(s.startLine-1,s.endLine).join('\n')),s.sha256,`${s.path}:${s.startLine}`);
};
for(const corpus of [evidence.primary,evidence.methodWitness])assert.equal(hash(fs.readFileSync(corpus.path)),corpus.sha256);
spanCheck(evidence.methodWitness.readSpan);
const sourceCheck=(ref,retained)=>{
 assert.equal(ref.originalQuotation,null);
 if(ref.sourceId){
  assert.ok(registry.sources.some(s=>s.sourceId===ref.sourceId),ref.sourceId);
  if(retained){assert.ok(registry.editions.some(e=>e.editionId===ref.editionId&&e.sourceId===ref.sourceId));spanCheck(ref.location);}
  else {assert.ok(ref.section&&ref.url);assert.equal(ref.page,null);}
 } else {
  const witness=evidence.authoredWitnesses.find(w=>w.provisionalWitnessId===ref.provisionalWitnessId);
  assert.ok(witness);assert.equal(ref.author,witness.author);
  assert.equal(ref.location.url,witness.url);assert.equal(ref.location.sourceTextRetained,false);
  assert.equal(ref.location.observedDecodedHtmlSha256,witness.sha256);
  assert.ok(ref.location.paragraphLocator&&ref.bibliographicLimit);
 }
};
for(const r of records){
 for(const key of ['predicate','meaningVi','governingContext','conditions','modifiers','exceptions','relationships','uncertainties','nextAction','sourceReferences','sourceFamilyDependencies','rights','dossierRef','evidenceRef'])assert.ok(r[key],`${r.recordId}: ${key}`);
 for(const key of ['conditions','modifiers','exceptions','uncertainties','exclusions'])assert.ok(r[key].length);
 assert.ok(['interpretation','strengthening','weakening','conflict','school_variant'].includes(r.claimType));
 assert.equal(r.schoolId,null);assert.equal(r.status.collection,'COLLECTED');assert.equal(r.status.contextMapping,'CONTEXT_MAPPED');
 assert.equal(r.status.sourceReview,'not_executed');assert.equal(r.status.runtimeApproval,'not_requested');assert.equal(r.status.publicRelease,'withheld_closed');
 assert.equal(r.verificationStatus.implementationStatus,'not_executable');assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');
 assert.ok(dossier.includes(`### ${r.recordId}\n`));assert.equal(r.dossierRef,`${dir}/DOSSIER.md#${r.recordId.toLowerCase()}`);
 assert.ok(fs.existsSync(r.evidenceRef));assert.equal(r.recordFile,`${dir}/knowledge-records.json`);
 if(r.subject.starId)assert.ok(baseline.cells.some(c=>c.cellId===`${r.subject.palaceId}:${r.subject.starId}`));
 else assert.ok(r.subject.terms.length);
 for(const ref of r.sourceReferences)sourceCheck(ref,!!ref.location?.path);
 if(r.governingContext.location)spanCheck(r.governingContext.location);
 if(r.governingContext.generalMethodReference)spanCheck(r.governingContext.generalMethodReference.location);
 for(const rel of r.relationships)if(rel.location)spanCheck(rel.location);
 for(const id of r.comparisonIds)assert.ok(comparisons.some(c=>c.comparisonId===id&&c.recordIds.includes(r.recordId)));
 assert.equal(r.status.comparison,r.comparisonIds.length?'performed_with_identity_limits':'not_performed');
 for(const id of r.extendsRecordIds??[])assert.ok(index.records.some(x=>x.recordId===id&&!x.file.includes('batch-4')&&JSON.stringify(x.subject)===JSON.stringify(r.subject)));
 for(const id of r.contradicts)assert.ok(dispositions.some(d=>d.dispositionId===id&&d.recordIds.includes(r.recordId)));
 if(r.status.research==='CONFLICTING')assert.ok(r.contradicts.length);
}
for(const c of comparisons){sourceCheck(c.sourceReference,false);for(const id of c.recordIds)assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));}
for(const d of dispositions){assert.equal(d.resolutionClaim,false);assert.ok(d.basis&&d.nextAction);for(const id of d.recordIds)assert.ok(index.records.some(r=>r.recordId===id));}
const all=index.recordFiles.flatMap(file=>read(file).records.map(record=>({file,record})));
assert.equal(all.length,index.records.length);
for(const ref of index.records){const found=all.filter(x=>x.file===ref.file&&x.record.recordId===ref.recordId);assert.equal(found.length,1);assert.deepEqual(ref.subject,found[0].record.subject);assert.equal(ref.researchStatus,found[0].record.status.research);}
const cells=new Map();
for(const {record:r} of all){if(!r.subject.starId||!r.subject.palaceId)continue;const id=`${r.subject.palaceId}:${r.subject.starId}`;if(!cells.has(id))cells.set(id,[]);cells.get(id).push(r);}
const previous=new Set(all.filter(x=>!x.file.includes('batch-4')&&x.record.subject.starId&&x.record.subject.palaceId).map(({record:r})=>`${r.subject.palaceId}:${r.subject.starId}`));
assert.equal(previous.size,20);
const m=index.metrics;
assert.equal(m.persistedRecords,all.length);assert.equal(m.indexedCells,baseline.cells.length);
assert.equal(m.starPalaceRecords,[...cells.values()].flat().length);assert.equal(m.nonCellRecords,all.length-m.starPalaceRecords);
assert.equal(m.contextualCells,cells.size);assert.equal(m.locatedOnlyCells,168-cells.size);
assert.equal(m.comparedCellsIncludingDisputed,[...cells.values()].filter(rs=>rs.some(r=>['COMPARED','CONFLICTING'].includes(r.status.research))).length);
assert.equal(m.cellsWithConflictingResearchStatus,[...cells.values()].filter(rs=>rs.some(r=>r.status.research==='CONFLICTING')).length);
assert.equal(m.cellsWithContradictionFlags,[...cells.values()].filter(rs=>rs.some(r=>r.contradicts.length)).length);
assert.equal(m.palacesWithContextualRecords,new Set([...cells.keys()].map(id=>id.split(':')[0])).size);
assert.equal(m.newBatch4Records,records.length);assert.equal(m.newBatch4Cells,[...cells.keys()].filter(id=>!previous.has(id)).length);
assert.equal(m.newBatch3Records,14);assert.equal(m.newBatch3Cells,11);
assert.equal(index.cells.length,cells.size);
for(const cell of index.cells){assert.ok(baseline.cells.some(c=>c.cellId===cell.cellId));assert.deepEqual(cell.recordIds,cells.get(cell.cellId).map(r=>r.recordId));assert.deepEqual(cell.researchStatesObserved,[...new Set(cells.get(cell.cellId).map(r=>r.status.research))]);}
for(const [file,sha]of Object.entries(evidence.historicalSnapshots))assert.equal(hash(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')),sha,`Historical change: ${file}`);
assert.equal(evidence.approval.sourceReviewExecuted,false);assert.equal(evidence.approval.runtimeApprovalRequested,false);assert.equal(evidence.approval.publicReleasePermission,'unchanged_closed');
console.log(`PASS: ${records.length} new records, ${m.newBatch4Cells} new cells, ${comparisons.length} comparisons, ${dispositions.length} unresolved dispositions; ${all.length} records / ${cells.size} contextual cells. Spans, historical hashes, links, cumulative metrics and separate closed gates consistent.`);
