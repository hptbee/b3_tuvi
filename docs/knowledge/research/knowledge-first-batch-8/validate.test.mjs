// Reuse the nine closed-state/history/span/index tests; do not modify Batch7.
import '../knowledge-first-batch-7/validate.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {validatePreviousCheckpoint} from './validate.mjs';
test('Batch8 must protect every independently committed Batch7 artifact',()=>{
 const baseCommit='5d7757245fe2f046756156f32953a3e7e52dc8c4';
 const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
 const prefix='docs/knowledge/research/knowledge-first-batch-7';
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseCommit,'--',prefix],{encoding:'utf8'}).trim().split('\n');
 const historicalSnapshots=Object.fromEntries(files.map(p=>[p,hash(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'))]));
 const e={baseCommit,previousCheckpoint:{commit:baseCommit,indexSnapshotSha256LF:historicalSnapshots[`${prefix}/index-snapshot.json`]},historicalSnapshots};
 validatePreviousCheckpoint(e);
 assert.throws(()=>validatePreviousCheckpoint({...e,baseCommit:'811655f90102c062458735371d326b8bcbc8848f'}));
 assert.throws(()=>validatePreviousCheckpoint({...e,previousCheckpoint:{...e.previousCheckpoint,indexSnapshotSha256LF:'0'.repeat(64)}}));
 assert.throws(()=>validatePreviousCheckpoint({...e,historicalSnapshots:{}}));
});
