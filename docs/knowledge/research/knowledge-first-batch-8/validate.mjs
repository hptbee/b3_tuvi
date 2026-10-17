// Research validation only; no source/semantic/runtime approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validatePacket} from '../knowledge-first-batch-7/validate.mjs';
const dir='docs/knowledge/research/knowledge-first-batch-8';
const previous='docs/knowledge/research/knowledge-first-batch-7';
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
export function validatePreviousCheckpoint(e){
 assert.equal(e.baseCommit,'5d7757245fe2f046756156f32953a3e7e52dc8c4');
 assert.equal(e.previousCheckpoint.commit,e.baseCommit);
 execFileSync('git',['merge-base','--is-ancestor',e.baseCommit,'HEAD']);
 assert.equal(e.previousCheckpoint.indexSnapshotSha256LF,hash(fs.readFileSync(`${previous}/index-snapshot.json`,'utf8').replace(/\r\n/g,'\n')));
 const oldFiles=execFileSync('git',['ls-tree','-r','--name-only',e.baseCommit,'--',previous],{encoding:'utf8'}).trim().split('\n');
 for(const file of oldFiles)assert.equal(e.historicalSnapshots[file],hash(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n')),`Missing/changed Batch7 checkpoint file:${file}`);
}
export function validateBatch8(){
 const result=validatePacket(8),e=JSON.parse(fs.readFileSync(`${dir}/evidence.json`,'utf8'));
 validatePreviousCheckpoint(e);
 const d=JSON.parse(fs.readFileSync(`${dir}/dispositions.json`,'utf8')).dispositions;
 const resolved=d.filter(x=>x.disposition==='RESOLVED_WITH_EVIDENCE').length;
 assert.equal(e.dispositionMetrics.open,d.length-resolved);assert.equal(e.dispositionMetrics.resolvedWithEvidence,resolved);
 assert.equal(resolved,0,'No source-backed closure acquired in these batches');
 return {...result,openDispositions:d.length-resolved,resolvedWithEvidence:resolved};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(validateBatch8()));
