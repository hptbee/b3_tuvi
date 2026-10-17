// Research consistency only; never interpretation authentication or approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
const dir='docs/knowledge/research/knowledge-first-batch-5';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const unique=(xs,k)=>assert.equal(new Set(xs.map(x=>x[k])).size,xs.length,`Duplicate ${k}`);
export function validateStatuses(records,comparisons){
 unique(records,'recordId');unique(comparisons,'comparisonId');
 for(const r of records){
  assert.equal(r.status.collection,'COLLECTED');assert.equal(r.status.contextMapping,'CONTEXT_MAPPED');
  assert.equal(r.status.sourceReview,'not_executed');assert.equal(r.status.runtimeApproval,'not_requested');assert.equal(r.status.publicRelease,'withheld_closed');
  const cs=r.comparisonIds.map(id=>comparisons.find(c=>c.comparisonId===id&&c.recordIds.includes(r.recordId)));
  assert.ok(cs.every(Boolean),'Broken comparison reference');
  if(['COMPARED','CONFLICTING'].includes(r.status.research))assert.ok(cs.some(c=>c.kind==='authored_comparison'),'Dependent collation cannot grant authored COMPARED');
  if(r.status.comparison==='performed_dependent_collation'){assert.ok(cs.length&&cs.every(c=>c.kind==='dependent_witness_collation'));assert.equal(r.status.research,'CONTEXT_MAPPED');}
  if(r.status.research==='CONFLICTING')assert.ok(r.contradicts.length);
 }
}
export function checkSpan(s){
 const lines=fs.readFileSync(s.path,'utf8').split(/\r?\n/);
 assert.ok(Number.isInteger(s.startLine)&&s.startLine>0&&s.endLine>=s.startLine&&s.endLine<=lines.length);
 assert.equal(hash(lines.slice(s.startLine-1,s.endLine).join('\n')),s.sha256,`${s.path}:${s.startLine}`);
}
function main(){
 const {records}=read(`${dir}/knowledge-records.json`);const {comparisons}=read(`${dir}/comparisons.json`);const {dispositions}=read(`${dir}/dispositions.json`);const evidence=read(`${dir}/evidence.json`);
 const index=read('docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json');const baseline=read('docs/knowledge/research/knowledge-first-batch-2/major-star-palace-index.json');const registry=read('docs/knowledge/sources.json');
 const dossier=fs.readFileSync(`${dir}/DOSSIER.md`,'utf8').replace(/\r\n/g,'\n');
 validateStatuses(records,comparisons);unique(dispositions,'dispositionId');unique(index.records,'recordId');
 for(const c of [evidence.primary,evidence.methodWitness])assert.equal(hash(fs.readFileSync(c.path)),c.sha256);
 checkSpan(evidence.methodWitness.readSpan);
 const sourceCheck=ref=>{
  assert.equal(ref.originalQuotation,null);assert.equal(ref.page,null);
  if(ref.sourceId){assert.ok(registry.sources.some(s=>s.sourceId===ref.sourceId));if(ref.editionId)assert.ok(registry.editions.some(e=>e.editionId===ref.editionId&&e.sourceId===ref.sourceId));}
  if(ref.location?.path)checkSpan(ref.location);
  else if(ref.provisionalWitnessId===evidence.authoredWitnesses[0].provisionalWitnessId){assert.equal(ref.author,evidence.authoredWitnesses[0].author);assert.equal(ref.location.sourceTextRetained,false);assert.equal(ref.location.observedDecodedHtmlSha256,evidence.authoredWitnesses[0].sha256);assert.ok(ref.location.paragraphLocator);}
  else {assert.ok(ref.url&&ref.section&&ref.readerLines?.length===2);if(ref.revision){assert.equal(ref.revision,1963110);assert.equal(ref.family,'quanshu-transmission');}}
 };
 for(const r of records){
  for(const k of ['predicate','meaningVi','sourceReferences','conditions','modifiers','exceptions','exclusions','uncertainties','rights','sourceFamilyDependencies','nextAction','governingContext'])assert.ok(r[k]?.length??r[k],`${r.recordId}:${k}`);
  assert.equal(r.schoolId,null);assert.equal(r.verificationStatus.implementationStatus,'not_executable');assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');
  assert.ok(r.originalTerms?.length,`Missing original-language terms:${r.recordId}`);
  assert.ok(dossier.includes(`### ${r.recordId}\n`));assert.equal(r.dossierRef,`${dir}/DOSSIER.md#${r.recordId.toLowerCase()}`);assert.ok(fs.existsSync(r.evidenceRef));assert.equal(r.recordFile,`${dir}/knowledge-records.json`);
  if(r.subject.starId)assert.ok(baseline.cells.some(c=>c.cellId===`${r.subject.palaceId}:${r.subject.starId}`));else assert.ok(r.subject.terms.length);
  for(const ref of r.sourceReferences)sourceCheck(ref);
  for(const s of [r.governingContext.location,r.governingContext.preambleLocation,r.governingContext.generalMethodReference?.location,...r.relationships.map(x=>x.location)].filter(Boolean))checkSpan(s);
  for(const id of r.extendsRecordIds??[])assert.ok(index.records.some(x=>x.recordId===id&&!x.file.includes('batch-5')&&(r.subject.starId?JSON.stringify(x.subject)===JSON.stringify(r.subject):!x.subject.starId)));
  for(const id of r.contradicts)assert.ok(dispositions.some(d=>d.dispositionId===id));
 }
 for(const c of comparisons){sourceCheck(c.sourceReference);for(const id of c.recordIds)assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));}
 const oldDispositions=read('docs/knowledge/research/knowledge-first-batch-4/dispositions.json').dispositions;
 for(const old of oldDispositions){const next=dispositions.find(d=>d.dispositionId===old.dispositionId);assert.ok(next?.carriedFrom);for(const k of Object.keys(old))assert.deepEqual(next[k],old[k],`Unjustified old disposition replacement:${old.dispositionId}:${k}`);}
 for(const d of dispositions){assert.equal(d.resolutionClaim,false);assert.ok(d.basis&&d.nextAction);for(const id of d.recordIds)assert.ok(index.records.some(r=>r.recordId===id));}
 const all=index.recordFiles.flatMap(file=>read(file).records.map(record=>({file,record})));assert.equal(all.length,index.records.length);
 for(const ref of index.records){const rs=all.filter(x=>x.file===ref.file&&x.record.recordId===ref.recordId);assert.equal(rs.length,1);assert.deepEqual(ref.subject,rs[0].record.subject);assert.equal(ref.researchStatus,rs[0].record.status.research);}
 const cells=new Map();for(const {record:r}of all){if(!r.subject.starId||!r.subject.palaceId)continue;const key=`${r.subject.palaceId}:${r.subject.starId}`;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(r);}
 const prior=all.filter(x=>!x.file.includes('batch-5'));const priorCells=new Set(prior.filter(({record:r})=>r.subject.starId&&r.subject.palaceId).map(({record:r})=>`${r.subject.palaceId}:${r.subject.starId}`));
 assert.equal(prior.length,37);assert.equal(priorCells.size,31);assert.equal(evidence.baselineVerification.committedCounts.records,prior.length);assert.equal(evidence.baselineVerification.committedCounts.contextualCells,priorCells.size);
 const m=index.metrics;assert.equal(m.persistedRecords,all.length);assert.equal(m.indexedCells,baseline.cells.length);assert.equal(m.contextualCells,cells.size);assert.equal(m.locatedOnlyCells,168-cells.size);
 assert.equal(m.starPalaceRecords,[...cells.values()].flat().length);assert.equal(m.nonCellRecords,all.length-m.starPalaceRecords);
 assert.equal(m.comparedCellsIncludingDisputed,[...cells.values()].filter(rs=>rs.some(r=>['COMPARED','CONFLICTING'].includes(r.status.research))).length);
 assert.equal(m.cellsWithConflictingResearchStatus,[...cells.values()].filter(rs=>rs.some(r=>r.status.research==='CONFLICTING')).length);assert.equal(m.cellsWithContradictionFlags,[...cells.values()].filter(rs=>rs.some(r=>r.contradicts.length)).length);
 assert.equal(m.newBatch5Records,records.length);assert.equal(m.newBatch5Cells,[...cells.keys()].filter(id=>!priorCells.has(id)).length);assert.equal(m.newBatch3Cells,11);assert.equal(m.newBatch4Cells,11);assert.equal(m.newBatch3Records,14);assert.equal(m.newBatch4Records,14);assert.equal(m.palacesWithContextualRecords,new Set([...cells.keys()].map(k=>k.split(':')[0])).size);
 assert.equal(index.cells.length,cells.size);for(const c of index.cells){assert.ok(baseline.cells.some(x=>x.cellId===c.cellId));assert.deepEqual(c.recordIds,cells.get(c.cellId).map(r=>r.recordId));assert.deepEqual(c.researchStatesObserved,[...new Set(cells.get(c.cellId).map(r=>r.status.research))]);}
 for(const [path,sha]of Object.entries(evidence.historicalSnapshots))assert.equal(hash(fs.readFileSync(path,'utf8').replace(/\r\n/g,'\n')),sha,`Historical change:${path}`);
 assert.equal(index.refreshToolRef,`${dir}/refresh-index.mjs`);
 const changed=execFileSync('git',['diff','--name-only',evidence.baseCommit],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 const allowed=new Set(['docs/README.md','docs/planning/ROADMAP_KNOWLEDGE_RESEARCH.md','docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json']);
 for(const path of changed)assert.ok(path.startsWith(`${dir}/`)||allowed.has(path),`Out-of-scope change:${path}`);
 assert.equal(evidence.approval.sourceReviewExecuted,false);assert.equal(evidence.approval.runtimeApprovalRequested,false);assert.equal(evidence.approval.publicReleasePermission,'unchanged_closed');
 console.log(`PASS: ${records.length} new records / ${m.newBatch5Cells} new cells; ${comparisons.filter(c=>c.kind==='authored_comparison').length} authored comparisons + ${comparisons.filter(c=>c.kind==='dependent_witness_collation').length} dependent collations; ${dispositions.length} open dispositions (all ten old retained); cumulative ${all.length} records / ${cells.size} cells. Historical hashes, references, spans and separate approval states consistent.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
