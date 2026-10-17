// Research integrity; no source authentication, formula execution or approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validateStatuses,validateDispositions,checkSpan} from '../knowledge-first-batch-7/validate.mjs';
import {buildIndex,recordFiles} from './refresh-index.mjs';
const root='docs/knowledge/research',canonical=`${root}/KNOWLEDGE_RECORD_INDEX.json`;
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const lf=s=>s.replace(/\r\n/g,'\n');
const required=(v,label)=>assert.ok(typeof v==='string'?v.trim():Array.isArray(v)?v.length:v&&Object.keys(v).length,label);
export function checkHistory(e,n){
 assert.ok([9,10].includes(n));assert.match(e.baseCommit,/^[a-f0-9]{40}$/);
 assert.equal(e.originalBaseCommit,'52f578e09451cdceb5ed968c41a8ca8158dda902');
 if(n===9)assert.equal(e.baseCommit,e.originalBaseCommit);
 execFileSync('git',['merge-base','--is-ancestor',e.baseCommit,'HEAD']);
 const prefix=`${root}/knowledge-first-batch-${n-1}`;
 assert.equal(e.previousCheckpoint.batchNumber,n-1);assert.equal(e.previousCheckpoint.commit,e.baseCommit);
 const snapshot=`${prefix}/index-snapshot.json`;
 assert.equal(e.previousCheckpoint.indexSnapshotSha256LF,hash(lf(fs.readFileSync(snapshot,'utf8'))));
 const priorFiles=execFileSync('git',['ls-tree','-r','--name-only',e.baseCommit,'--',prefix],{encoding:'utf8'}).trim().split('\n');
 for(const file of priorFiles)required(e.historicalSnapshots[file],`Unprotected previous file:${file}`);
 const inherited=read(`${prefix}/evidence.json`).historicalSnapshots;
 for(const [file,h]of Object.entries(inherited))assert.equal(e.historicalSnapshots[file],h,`Lost inherited protection:${file}`);
 for(const [file,h]of Object.entries(e.historicalSnapshots)){
  assert.equal(hash(lf(execFileSync('git',['show',`${e.baseCommit}:${file}`],{encoding:'utf8'}))),h,`Snapshot not grounded in base:${file}`);
  assert.equal(hash(lf(fs.readFileSync(file,'utf8'))),h,`Historical mutation:${file}`);
 }
 assert.deepEqual(e.baselineMetrics,JSON.parse(execFileSync('git',['show',`${e.baseCommit}:${canonical}`],{encoding:'utf8'})).metrics);
}
export function checkEmbeddedSpans(value){
 if(Array.isArray(value)){for(const x of value)checkEmbeddedSpans(x);}
 else if(value&&typeof value==='object'){
  if(value.path&&value.startLine!==undefined)checkSpan(value);
  for(const x of Object.values(value))checkEmbeddedSpans(x);
 }
}
export function validatePacket(n=9){
 assert.ok([9,10].includes(n));const dir=`${root}/knowledge-first-batch-${n}`;
 const records=read(`${dir}/knowledge-records.json`).records,comparisons=read(`${dir}/comparisons.json`).comparisons;
 const e=read(`${dir}/evidence.json`),d=read(`${dir}/dispositions.json`),index=read(`${dir}/index-snapshot.json`);
 assert.equal(e.batchNumber,n);checkHistory(e,n);validateStatuses(records,comparisons);
 const registry=read('docs/knowledge/sources.json'),cells=read(`${root}/knowledge-first-batch-2/major-star-palace-index.json`).cells;
 const dossier=fs.readFileSync(`${dir}/DOSSIER.md`,'utf8');
 const sourceCheck=s=>{
  assert.equal(s.page,null);assert.equal(s.originalQuotation,null);
  if(s.sourceId){assert.ok(registry.sources.some(x=>x.sourceId===s.sourceId));if(s.editionId)assert.ok(registry.editions.some(x=>x.editionId===s.editionId&&x.sourceId===s.sourceId));}
  else required(s.provisionalWitnessId,'Missing source identity');
  if(s.location?.path)checkSpan(s.location);else {required(s.url,'Missing URL');required(s.section,'Missing section');}
 };
 for(const r of records){
  assert.ok(r.recordId.startsWith(`KRB${n}-`));
  for(const k of ['predicate','meaningVi','conditions','modifiers','exceptions','exclusions','uncertainties','rights','sourceFamilyDependencies','nextAction','governingContext','sourceReferences','originalTerms'])required(r[k],`${r.recordId}:${k}`);
  assert.equal(r.schoolId,null);assert.deepEqual(r.verificationStatus,{implementationStatus:'not_executable',formulaStatus:'undocumented',bibliographicStatus:'secondary',interpretationStatus:'unreviewed'});
  assert.equal(r.recordFile,`${dir}/knowledge-records.json`);assert.equal(r.evidenceRef,`${dir}/evidence.json`);assert.equal(r.dossierRef,`${dir}/DOSSIER.md#${r.recordId.toLowerCase()}`);assert.ok(dossier.includes(`### ${r.recordId}\n`));
  if(r.subject.starId)assert.ok(cells.some(c=>c.cellId===`${r.subject.palaceId}:${r.subject.starId}`));else required(r.subject.terms,'Missing method terms');
  r.sourceReferences.forEach(sourceCheck);required(r.governingContext.location,'Missing full context');
  for(const id of [...(r.extendsRecordIds??[]),...r.relationships.map(x=>x.recordId).filter(Boolean)])assert.ok(index.records.some(x=>x.recordId===id));
  for(const id of r.contradicts)assert.ok(d.dispositions.some(x=>x.dispositionId===id));
 }
 for(const c of comparisons){sourceCheck(c.sourceReference);for(const id of c.recordIds)assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));}
 validateDispositions(d,read(`${root}/knowledge-first-batch-${n-1}/dispositions.json`),n);
 for(const x of d.dispositions)for(const id of x.recordIds)assert.ok(index.records.some(r=>r.recordId===id));
 for(const file of fs.readdirSync(dir).filter(x=>x.endsWith('.json')))checkEmbeddedSpans(read(`${dir}/${file}`));
 assert.deepEqual(index.recordFiles,recordFiles(n));
 const loaded=index.recordFiles.flatMap(file=>read(file).records.map(record=>({file,record})));
 assert.deepEqual(index,buildIndex(loaded,index,n));assert.deepEqual(e.metricsAfter,index.metrics);
 const now=read(canonical);if(now.refreshToolRef===index.refreshToolRef)assert.deepEqual(now,index);
 const resolved=d.dispositions.filter(x=>x.disposition==='RESOLVED_WITH_EVIDENCE').length;
 assert.deepEqual(e.dispositionMetrics,{open:d.dispositions.length-resolved,resolvedWithEvidence:resolved});
 assert.equal(resolved,0,'No direct evidence supports closure in this packet');
 assert.deepEqual(e.approval,{sourceReviewExecuted:false,runtimeApprovalRequested:false,publicReleasePermission:'unchanged_closed',t034:'unresolved_unapproved'});
 const changed=execFileSync('git',['diff','--name-only',e.originalBaseCommit],{encoding:'utf8'}),untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'});
 for(const p of `${changed}\n${untracked}`.split(/\r?\n/).filter(Boolean))assert.ok(/^docs\/knowledge\/research\/knowledge-first-batch-(9|10)\//.test(p)||['docs/README.md','docs/planning/ROADMAP_KNOWLEDGE_RESEARCH.md',canonical].includes(p),`Out of scope:${p}`);
 return {batch:n,records:records.length,newCells:index.metrics[`newBatch${n}Cells`],historicalHashes:Object.keys(e.historicalSnapshots).length,open:d.dispositions.length-resolved,resolvedWithEvidence:resolved,metrics:index.metrics};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validatePacket(9)));
