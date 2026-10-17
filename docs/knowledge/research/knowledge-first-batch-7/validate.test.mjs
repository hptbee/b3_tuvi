import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateStatuses,validateDispositions,checkSpan} from './validate.mjs';
import {buildIndex} from './refresh-index.mjs';
const record=id=>({recordId:id,subject:{starId:'thien_co',palaceId:'menh'},contradicts:[],comparisonIds:[],status:{collection:'COLLECTED',contextMapping:'CONTEXT_MAPPED',comparison:'not_performed',research:'CONTEXT_MAPPED',sourceReview:'not_executed',runtimeApproval:'not_requested',publicRelease:'withheld_closed'}});
const comparison=kind=>({comparisonId:'C1',recordIds:['KRB7-X'],kind,family:kind==='authored_comparison'?'separately-attributed':'quanshu-transmission',sourceReference:{author:'Provisional author'},rights:'Locator only, no redistribution',independence:'Attribution differs; historical borrowing remains unknown',observationVi:'Bounded scope comparison'});
test('unperformed research remains context-mapped with all approval gates closed',()=>{
 validateStatuses([record('KRB7-X')],[]);
 for(const [key,value]of [['publicRelease','open'],['runtimeApproval','approved'],['sourceReview','accepted'],['research','REVIEW_READY'],['comparison','silently_approved']]){
  const r=record('KRB7-X');r.status[key]=value;assert.throws(()=>validateStatuses([r],[]));
 }
});
test('dependent collation and no comparison cannot promote authored COMPARED',()=>{
 const r=record('KRB7-X');r.status.research='COMPARED';assert.throws(()=>validateStatuses([r],[]));
 r.comparisonIds=['C1'];r.status.comparison='performed_dependent_collation';assert.throws(()=>validateStatuses([r],[comparison('dependent_witness_collation')]));
 r.status.research='CONTEXT_MAPPED';validateStatuses([r],[comparison('dependent_witness_collation')]);
});
test('comparison kinds, author identity and same-family independence are checked',()=>{
 const r=record('KRB7-X');r.comparisonIds=['C1'];r.status.comparison='performed_with_identity_limits';r.status.research='COMPARED';
 const c=comparison('authored_comparison');validateStatuses([r],[c]);
 for(const mutate of [c=>c.kind='web_hit',c=>c.family='quanshu-transmission',c=>c.sourceReference.author=null,c=>c.observationVi='']){
  const bad=structuredClone(c);mutate(bad);assert.throws(()=>validateStatuses([r],[bad]));
 }
});
test('within-source context comparison remains distinct from authored comparison',()=>{
 const r=record('KRB7-X');r.comparisonIds=['C1'];r.status.comparison='performed_with_identity_limits';
 const c=comparison('within_source_context_comparison');validateStatuses([r],[c]);
 for(const research of ['COMPARED','CONFLICTING']){r.status.research=research;assert.throws(()=>validateStatuses([r],[c]));}
});
test('duplicate identities, stale comparison state and broken links fail',()=>{
 const r=record('KRB7-X');assert.throws(()=>validateStatuses([r,r],[]));
 r.comparisonIds=['missing'];assert.throws(()=>validateStatuses([r],[]));
 r.comparisonIds=['C1'];assert.throws(()=>validateStatuses([r],[comparison('authored_comparison')]));
});
test('historical disposition status, basis and P1 fields cannot be overwritten',()=>{
 const prior=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-6/dispositions.json','utf8'));
 const next=structuredClone(prior);for(const d of next.dispositions)d.batch7Observation='No new evidence; unchanged';validateDispositions(next,prior,7);
 for(const mutate of [x=>x.dispositions[0].basis='new unsupported replacement',x=>x.dispositions[0].resolutionClaim=true,x=>x.dispositions[0].batch6Observation='rewritten',x=>x.dispositions.pop(),x=>x.p1Followups[0].observation='changed']){
  const bad=structuredClone(next);mutate(bad);assert.throws(()=>validateDispositions(bad,prior,7));
 }
 const eighth=structuredClone(next);for(const d of eighth.dispositions)d.batch8Observation='Separate bounded batch, still unresolved';validateDispositions(eighth,next,8);
});
test('retained primary span cannot be modified or silently moved',()=>{
 const r=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-6/knowledge-records.json','utf8')).records[0];
 const span=r.sourceReferences[0].location;checkSpan(span);
 assert.throws(()=>checkSpan({...span,sha256:'0'.repeat(64)}));assert.throws(()=>checkSpan({...span,startLine:0}));
});
test('new source-scoped unresolved questions may be added without rewriting history',()=>{
 const prior=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-6/dispositions.json','utf8'));
 const next=structuredClone(prior);for(const d of next.dispositions)d.batch7Observation='Prior uncertainty retained';
 next.dispositions.push({dispositionId:'B7D01',topic:'New exact reciprocal scope question',basis:'Source-scoped difference, pending identified comparison',nextAction:'Inspect complete counterpart',recordIds:['KRB7-X'],evidenceRef:'packet/evidence.json',contextScope:'One specified palace and reciprocal clause only',resolutionClaim:false,disposition:'STILL_UNRESOLVED'});
 validateDispositions(next,prior,7);
 for(const mutate of [d=>d.disposition='RESOLVED',d=>d.resolutionClaim=true,d=>d.basis='',d=>d.evidenceRef=null,d=>d.contextScope=null,d=>d.dispositionId='B6D999']){
  const bad=structuredClone(next);mutate(bad.dispositions.at(-1));assert.throws(()=>validateDispositions(bad,prior,7));
 }
 const duplicate=structuredClone(next);duplicate.dispositions.push(structuredClone(duplicate.dispositions.at(-1)));assert.throws(()=>validateDispositions(duplicate,prior,7));
});
test('index reuse counts genuine additions once and is immutable across next batch',()=>{
 const old=record('KRB6-X'),supplement=record('KRB7-X'),newCell=record('KRB7-Y'),method=record('KRB7-M');
 newCell.subject={starId:'thien_co',palaceId:'phu_mau'};method.subject={starId:null,palaceId:null,terms:['context']};
 const loaded=[old,supplement,newCell,method].map(record=>({file:`docs/knowledge/research/knowledge-first-batch-${record.recordId[3]}/knowledge-records.json`,record}));
 const bytes=JSON.stringify(loaded),b7=buildIndex(loaded,{});assert.equal(b7.metrics.newBatch7Records,3);assert.equal(b7.metrics.newBatch7Cells,1);assert.equal(b7.metrics.contextualCells,2);assert.equal(b7.metrics.nonCellRecords,1);assert.equal(JSON.stringify(loaded),bytes);
 const eighth=record('KRB8-X');eighth.subject={starId:'thien_co',palaceId:'quan_loc'};
 const b8=buildIndex([...loaded,{file:'docs/knowledge/research/knowledge-first-batch-8/knowledge-records.json',record:eighth}],b7,8);
 assert.equal(b8.metrics.newBatch8Cells,1);assert.equal(b8.metrics.newBatch7Cells,1);assert.equal(b7.recordFiles.length,6);assert.equal(b8.recordFiles.length,7);assert.equal(b7.metrics.newBatch8Cells,undefined);
 assert.throws(()=>buildIndex([...loaded,loaded[0]],{}));assert.throws(()=>buildIndex(loaded,{},9));
});
