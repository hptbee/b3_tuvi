// Reuse ten historical integrity/status tests unchanged; two bounded additions.
import '../knowledge-first-batch-8/validate.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {buildIndex} from './refresh-index.mjs';
import {checkEmbeddedSpans,checkHistory} from './validate.mjs';
test('nested evidence span edits and invalid checkpoint requests fail',()=>{
 const r=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-9/knowledge-records.json','utf8')).records[0];
 checkEmbeddedSpans({nested:[r.sourceReferences]});
 const bad=structuredClone(r.sourceReferences);bad[0].location.sha256='0'.repeat(64);
 assert.throws(()=>checkEmbeddedSpans({nested:[bad]}));
 assert.throws(()=>checkHistory({},11));
});
test('method supplements and repeated cells do not inflate new-cell metrics',()=>{
 const path=n=>`docs/knowledge/research/knowledge-first-batch-${n}/knowledge-records.json`;
 const record=(recordId,subject)=>({recordId,subject,status:{research:'CONTEXT_MAPPED'},contradicts:[]});
 const loaded=[{file:path(8),record:record('KRB8-OLD',{starId:'tu_vi',palaceId:'menh'})},{file:path(9),record:record('KRB9-SUPPLEMENT',{terms:['scope']})},{file:path(9),record:record('KRB9-REPEAT',{starId:'tu_vi',palaceId:'menh'})}];
 const i=buildIndex(loaded,{},9);assert.equal(i.metrics.newBatch9Records,2);assert.equal(i.metrics.newBatch9Cells,0);assert.equal(i.metrics.contextualCells,1);
 assert.throws(()=>buildIndex(loaded,{},11));
});
test('current history manifest cannot invent baseline bytes or lose checkpoint protection',()=>{
 const e=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-9/evidence.json','utf8'));
 checkHistory(e,9);
 const wrong=structuredClone(e);wrong.historicalSnapshots['docs/knowledge/provenance-contract.json']='0'.repeat(64);
 assert.throws(()=>checkHistory(wrong,9));
 const missing=structuredClone(e);delete missing.historicalSnapshots['docs/knowledge/research/knowledge-first-batch-8/README.md'];
 assert.throws(()=>checkHistory(missing,9));
});
