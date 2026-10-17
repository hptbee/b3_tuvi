import test from 'node:test';
import assert from 'node:assert/strict';
import {validateStatuses,checkSpan} from './validate.mjs';
import {buildIndex} from './refresh-index.mjs';
const record=(id,kind='COMPARED')=>({recordId:id,subject:{starId:'thien_co',palaceId:'menh'},contradicts:[],comparisonIds:['C1'],status:{collection:'COLLECTED',contextMapping:'CONTEXT_MAPPED',sourceReview:'not_executed',runtimeApproval:'not_requested',publicRelease:'withheld_closed',research:kind,comparison:'performed_with_identity_limits'}});
const comparison=(kind='authored_comparison')=>[{comparisonId:'C1',recordIds:['KRB5-X'],kind}];
test('research acceptance cannot silently open public or runtime approval',()=>{
 const r=record('KRB5-X');validateStatuses([r],comparison());
 for(const [key,value]of [['publicRelease','open'],['runtimeApproval','approved'],['sourceReview','accepted']]){const bad=structuredClone(r);bad.status[key]=value;assert.throws(()=>validateStatuses([bad],comparison()));}
});
test('dependent mirrors cannot produce an authored comparison status',()=>{
 assert.throws(()=>validateStatuses([record('KRB5-X')],comparison('dependent_witness_collation')));
 const mapped=record('KRB5-X','CONTEXT_MAPPED');mapped.status.comparison='performed_dependent_collation';validateStatuses([mapped],comparison('dependent_witness_collation'));
});
test('duplicate or broken comparison identities rejected',()=>{
 assert.throws(()=>validateStatuses([record('KRB5-X'),record('KRB5-X')],comparison()));
 const broken=record('KRB5-X');broken.comparisonIds=['missing'];assert.throws(()=>validateStatuses([broken],comparison()));
});
test('supplements and methods do not inflate unique cells or historical counters',()=>{
 const r=record('KRB4-X');const s=record('KRB5-X');const n=record('KRB5-N');n.subject={starId:'thien_co',palaceId:'phu_mau'};const method=record('KRB5-M');method.subject={starId:null,palaceId:null,terms:['method']};
 const loaded=[r,s,n,method].map(record=>({file:`docs/knowledge/research/knowledge-first-batch-${record.recordId[3]}/knowledge-records.json`,record}));
 const frozen=JSON.stringify(loaded);const i=buildIndex(loaded,{});assert.equal(i.metrics.persistedRecords,4);assert.equal(i.metrics.contextualCells,2);assert.equal(i.metrics.newBatch4Cells,1);assert.equal(i.metrics.newBatch5Cells,1);assert.equal(i.metrics.nonCellRecords,1);assert.equal(JSON.stringify(loaded),frozen);
 assert.throws(()=>buildIndex([...loaded,loaded[0]],{}));
});
test('altered retained span identity is rejected',()=>{
 assert.throws(()=>checkSpan({path:'docs/knowledge/research/juan2-palace/foundational-single-star-packet/derived-juan2.txt',startLine:666,endLine:666,sha256:'0'.repeat(64)}));
});
