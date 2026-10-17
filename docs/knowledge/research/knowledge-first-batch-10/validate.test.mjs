import '../knowledge-first-batch-9/validate.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {checkHistory} from '../knowledge-first-batch-9/validate.mjs';
test('Batch10 must preserve every independently committed Batch9 artifact',()=>{
 const e=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-10/evidence.json','utf8'));
 checkHistory(e,10);
 const missing=structuredClone(e);delete missing.historicalSnapshots['docs/knowledge/research/knowledge-first-batch-9/index-snapshot.json'];
 assert.throws(()=>checkHistory(missing,10));
 const wrong=structuredClone(e);wrong.previousCheckpoint.commit=e.originalBaseCommit;
 assert.throws(()=>checkHistory(wrong,10));
});
import crypto from 'node:crypto';
import {validateSelectedEntries} from './validate.mjs';
test('a valid hash at another star entry cannot substantiate the selected star',()=>{
 const records=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-10/knowledge-records.json','utf8')).records;
 validateSelectedEntries(records);
 const bad=structuredClone(records.find(r=>r.recordId==='KRB10-TB-AM'));
 const wrong=bad.sourceReferences[0].location;
 wrong.startLine=642;wrong.endLine=642;
 wrong.sha256=crypto.createHash('sha256').update(fs.readFileSync(wrong.path,'utf8').split(/\r?\n/)[641]).digest('hex');
 assert.throws(()=>validateSelectedEntries([bad]),/Selected entry is not 太陰/);
});
