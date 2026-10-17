// Additional identity guard for selected standalone entries; not semantic approval.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {validatePacket} from '../knowledge-first-batch-9/validate.mjs';
import {checkSpan} from '../knowledge-first-batch-7/validate.mjs';
export function validateSelectedEntries(records){
 const {stars}=JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-2/major-star-palace-index.json','utf8'));
 for(const r of records){
  const s=r.sourceReferences[0].location,full=r.governingContext.location;
  checkSpan(s);assert.equal(s.path,full.path);assert.ok(s.startLine>=full.startLine&&s.endLine<=full.endLine);
  const name=stars.find(x=>x.starId===r.subject.starId)?.name;assert.ok(name);
  const text=fs.readFileSync(s.path,'utf8').split(/\r?\n/)[s.startLine-1].trim();
  assert.ok(text.startsWith(name),`Selected entry is not ${name}:${r.recordId}:${s.startLine}`);
 }
}
export function validateBatch10(){
 validateSelectedEntries(JSON.parse(fs.readFileSync('docs/knowledge/research/knowledge-first-batch-10/knowledge-records.json','utf8')).records);
 return validatePacket(10);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validateBatch10()));
