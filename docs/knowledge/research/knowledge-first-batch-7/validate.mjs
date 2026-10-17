// Research consistency only: neither source authentication nor formula approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validateStatuses as priorStatuses,checkSpan} from '../knowledge-first-batch-5/validate.mjs';
import {buildIndex} from './refresh-index.mjs';
export {checkSpan};
const root='docs/knowledge/research';
const canonical=`${root}/KNOWLEDGE_RECORD_INDEX.json`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const unique=(xs,k)=>assert.equal(new Set(xs.map(x=>x[k])).size,xs.length,`Duplicate ${k}`);
const required=(value,label)=>assert.ok(typeof value==='string'?value.trim():Array.isArray(value)?value.length:value&&Object.keys(value).length,label);
export function validateStatuses(records,comparisons){
 priorStatuses(records,comparisons);
 for(const r of records){
  assert.ok(['CONTEXT_MAPPED','COMPARED','CONFLICTING'].includes(r.status.research),'Unapproved research promotion');
  assert.ok(['not_performed','performed_with_identity_limits','performed_dependent_collation'].includes(r.status.comparison),'Unknown comparison state');
  if(!r.comparisonIds.length)assert.equal(r.status.comparison,'not_performed');
  if(r.status.comparison==='not_performed')assert.equal(r.comparisonIds.length,0);
 }
 for(const c of comparisons){
  assert.ok(['authored_comparison','dependent_witness_collation','within_source_context_comparison'].includes(c.kind),'Unknown comparison kind');
  for(const k of ['recordIds','sourceReference','family','rights','independence','observationVi'])required(c[k],`Comparison ${c.comparisonId}:${k}`);
  if(c.kind==='within_source_context_comparison')for(const id of c.recordIds)assert.equal(records.find(r=>r.recordId===id)?.status.research,'CONTEXT_MAPPED','Within-source context cannot grant independent comparison');
  if(c.kind==='authored_comparison'){
   assert.notEqual(c.family,'quanshu-transmission','Same-family witness is not independent authorship');
   required(c.sourceReference.author,`Authored comparison ${c.comparisonId} lacks attribution`);
  }
 }
}
export function validateDispositions(current,prior,batchNumber){
 unique(current.dispositions,'dispositionId');
 assert.ok(current.dispositions.length>=prior.dispositions.length,'Historical disposition removed');
 for(const old of prior.dispositions){
  const next=current.dispositions.find(d=>d.dispositionId===old.dispositionId);assert.ok(next);
  for(const k of Object.keys(old))assert.deepEqual(next[k],old[k],`Historical disposition changed:${old.dispositionId}:${k}`);
  required(next[`batch${batchNumber}Observation`],`Missing carry-forward observation:${old.dispositionId}`);
  assert.equal(next.resolutionClaim,false);
 }
 for(const d of current.dispositions.filter(d=>!prior.dispositions.some(old=>old.dispositionId===d.dispositionId))){
  assert.match(d.dispositionId,new RegExp(`^B${batchNumber}D\\d+$`));
  for(const k of ['topic','basis','nextAction','recordIds','evidenceRef','contextScope'])required(d[k],`New disposition ${d.dispositionId}:${k}`);
  assert.equal(d.resolutionClaim,false);
  assert.ok(['STILL_UNRESOLVED','SOURCE_VARIANT','INTERPRETATION_DIFFERENCE','CONFLICTING'].includes(d.disposition),'New question cannot claim resolution');
 }
 assert.equal(current.p1Followups.length,prior.p1Followups.length);
 for(const [i,old]of prior.p1Followups.entries())for(const k of Object.keys(old))assert.deepEqual(current.p1Followups[i][k],old[k],`Historical P1 changed:${i}:${k}`);
}
export function validatePacket(dirOrBatchNumber=7){
 const dir=typeof dirOrBatchNumber==='number'?`${root}/knowledge-first-batch-${dirOrBatchNumber}`:dirOrBatchNumber;
 const n=Number(dir.match(/knowledge-first-batch-(\d+)\/?$/)?.[1]);assert.ok([7,8].includes(n),'Unsupported packet');
 const {records}=read(`${dir}/knowledge-records.json`),{comparisons}=read(`${dir}/comparisons.json`),current=read(`${dir}/dispositions.json`),e=read(`${dir}/evidence.json`);
 const index=read(`${dir}/index-snapshot.json`),registry=read('docs/knowledge/sources.json');
 const cells=read(`${root}/knowledge-first-batch-2/major-star-palace-index.json`).cells;
 const dossier=fs.readFileSync(`${dir}/DOSSIER.md`,'utf8').replace(/\r\n/g,'\n');
 assert.equal(e.batchNumber,n);assert.equal(e.originalBaseCommit,'811655f90102c062458735371d326b8bcbc8848f');
 assert.match(e.baseCommit,/^[a-f0-9]{40}$/);assert.equal(hash(fs.readFileSync(e.primary.path)),e.primary.sha256);
 const baseline=JSON.parse(execFileSync('git',['show',`${e.baseCommit}:${canonical}`],{encoding:'utf8'}));
 assert.deepEqual(e.baselineMetrics,baseline.metrics);
 for(const [p,h]of Object.entries(e.historicalSnapshots))assert.equal(hash(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),h,`Historical change:${p}`);
 assert.ok(Object.keys(e.historicalSnapshots).length,'Historical protection required');
 validateStatuses(records,comparisons);
 function sourceCheck(s){
  assert.equal(s.originalQuotation,null);assert.equal(s.page,null);
  if(s.sourceId){assert.ok(registry.sources.some(x=>x.sourceId===s.sourceId),'Unregistered source');if(s.editionId)assert.ok(registry.editions.some(x=>x.editionId===s.editionId&&x.sourceId===s.sourceId),'Unregistered edition');}
  else required(s.provisionalWitnessId,'Missing source identity');
  if(s.location?.path)checkSpan(s.location);
  else {required(s.url,'Missing source locator');required(s.section,'Missing section');}
 }
 for(const r of records){
  assert.ok(r.recordId.startsWith(`KRB${n}-`));
  for(const k of ['predicate','meaningVi','conditions','modifiers','exceptions','exclusions','uncertainties','rights','sourceFamilyDependencies','nextAction','governingContext','sourceReferences','originalTerms'])required(r[k],`${r.recordId}:${k}`);
  assert.equal(r.schoolId,null);assert.equal(r.verificationStatus.implementationStatus,'not_executable');assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');
  assert.equal(r.verificationStatus.formulaStatus,'undocumented');assert.equal(r.verificationStatus.bibliographicStatus,'secondary');
  assert.ok(dossier.includes(`### ${r.recordId}\n`),'Missing dossier anchor');
  assert.equal(r.recordFile,`${dir}/knowledge-records.json`);assert.equal(r.evidenceRef,`${dir}/evidence.json`);assert.equal(r.dossierRef,`${dir}/DOSSIER.md#${r.recordId.toLowerCase()}`);
  if(r.subject.starId)assert.ok(cells.some(c=>c.cellId===`${r.subject.palaceId}:${r.subject.starId}`),'Unknown star/palace');else required(r.subject.terms,'Missing non-cell terms');
  r.sourceReferences.forEach(sourceCheck);
  required(r.governingContext.location,'Missing full context span');
  for(const s of [r.governingContext.location,r.governingContext.preambleLocation,r.governingContext.generalMethodReference?.location,...r.relationships.map(x=>x.location)].filter(Boolean))checkSpan(s);
  for(const id of [...(r.extendsRecordIds??[]),...r.relationships.map(x=>x.recordId).filter(Boolean)])assert.ok(index.records.some(x=>x.recordId===id),'Broken internal record reference');
  for(const id of r.contradicts)assert.ok(current.dispositions.some(d=>d.dispositionId===id),'Broken disposition reference');
 }
 for(const c of comparisons){sourceCheck(c.sourceReference);for(const id of c.recordIds)assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)),'Broken comparison backlink');}
 validateDispositions(current,read(`${root}/knowledge-first-batch-${n-1}/dispositions.json`),n);
 for(const d of current.dispositions)for(const id of d.recordIds)assert.ok(index.records.some(r=>r.recordId===id),'Unknown disposition record');
 const files=Array.from({length:n-1},(_,i)=>`${root}/knowledge-first-batch-${i+2}/knowledge-records.json`);assert.deepEqual(index.recordFiles,files);
 const loaded=files.flatMap(file=>read(file).records.map(record=>({file,record})));
 assert.deepEqual(index,buildIndex(loaded,index,n));unique(index.records,'recordId');
 assert.equal(index.metrics.indexedCells,cells.length);assert.deepEqual(e.metricsAfter,index.metrics);
 const now=read(canonical);if(now.refreshToolRef===index.refreshToolRef)assert.deepEqual(now,index);
 const changed=execFileSync('git',['diff','--name-only',e.originalBaseCommit],{encoding:'utf8'});
 const untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'});
 const allowed=new Set(['docs/README.md','docs/planning/ROADMAP_KNOWLEDGE_RESEARCH.md',canonical]);
 for(const p of `${changed}\n${untracked}`.split(/\r?\n/).filter(Boolean))assert.ok(/^docs\/knowledge\/research\/knowledge-first-batch-[78]\//.test(p)||allowed.has(p),`Out of research scope:${p}`);
 assert.equal(e.approval.sourceReviewExecuted,false);assert.equal(e.approval.runtimeApprovalRequested,false);assert.equal(e.approval.publicReleasePermission,'unchanged_closed');assert.equal(e.approval.t034,'unresolved_unapproved');
 return {batchNumber:n,records:records.length,newCells:index.metrics[`newBatch${n}Cells`],authoredComparisons:comparisons.filter(c=>c.kind==='authored_comparison').length,metrics:index.metrics};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validatePacket(process.argv[2]?Number(process.argv[2]):7)));
