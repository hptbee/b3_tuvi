import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { MODERN_MAJOR_ALGORITHM, verifyModernMajorBinding, verifyStoredModernMajorEvidence } from '../src/knowledge/modernMajorBinding.js';
const base=new URL('../../docs/knowledge/research/fortune/modern-decadal/',import.meta.url);
const files={};
function walk(url,prefix='') { for (const entry of readdirSync(url,{withFileTypes:true})) {
    const ref=prefix+entry.name; if(entry.isDirectory())walk(new URL(entry.name+'/',url),ref+'/');
    else files[ref]=readFileSync(new URL(entry.name,url),'utf8');
} }
walk(base);
const sources=JSON.parse(readFileSync(new URL('../../docs/knowledge/sources.json',import.meta.url),'utf8'));
const evidence={files,sources};assert.deepEqual(verifyStoredModernMajorEvidence(evidence),{ok:true,reason:null});
assert.deepEqual(verifyModernMajorBinding(),{ok:true,reason:null});
const result=verifyModernMajorBinding();result.ok=false;assert.equal(verifyModernMajorBinding().ok,true);
assert.throws(()=>{MODERN_MAJOR_ALGORITHM.periodCount=13;},TypeError);
assert.throws(()=>{MODERN_MAJOR_ALGORITHM.cucStartAges[0].number=1;},TypeError);
for (const file of ['review-bundle.json','decision.json','review-a.json','review-b.json','execution.json','provenance.json',
    'source-span.txt','review-context.txt','fixtures.json','age-convention-witnesses.json','LICENSE.txt',
    ...JSON.parse(files['review-bundle.json']).payloadHashManifest.map(row=>row.localPath)]) {
    assert.equal(verifyStoredModernMajorEvidence({...evidence,files:{...files,[file]:files[file]+'\n'}}).ok,false,file);
    const missing={...files};delete missing[file];assert.equal(verifyStoredModernMajorEvidence({...evidence,files:missing}).ok,false,file);
}
for (const change of [s=>s.sources.push({...s.sources.find(r=>r.sourceId==='iztro-modern-software')}),
    s=>s.editions.push({...s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80')}),
    s=>{s.sources.find(r=>r.sourceId==='iztro-modern-software').expertVerified=true;},
    s=>{s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80').gitCommit='other';},
    s=>{s.sources=[];},s=>{s.editions=[];}]) {
    const bad=structuredClone(sources);change(bad);assert.equal(verifyStoredModernMajorEvidence({files,sources:bad}).ok,false);
}
const unrelated=structuredClone(sources);unrelated.sources.push({sourceId:'unrelated'});
assert.equal(verifyStoredModernMajorEvidence({files,sources:unrelated}).ok,true);
assert.equal(verifyStoredModernMajorEvidence().ok,false);
// Isolated real fixed-loader failures: no evidence overrides are exposed by the runtime API.
const temp=mkdtempSync(join(tmpdir(),'modern-major-binding-'));
try {
    cpSync(new URL('../src/',import.meta.url),join(temp,'backend/src'),{recursive:true});
    cpSync(new URL('../../docs/knowledge/',import.meta.url),join(temp,'docs/knowledge'),{recursive:true});
    writeFileSync(join(temp,'package.json'),' {"type":"module"}');
    const probe=()=>spawnSync(process.execPath,['--input-type=module','-e',
        "import{verifyModernMajorBinding}from './backend/src/knowledge/modernMajorBinding.js';if(verifyModernMajorBinding().ok)process.exit(1);"],{cwd:temp,encoding:'utf8'});
    writeFileSync(join(temp,'docs/knowledge/research/fortune/modern-decadal/review-a.json'),'{}');
    assert.equal(probe().status,0);
    rmSync(join(temp,'docs/knowledge/research/fortune/modern-decadal/review-a.json'));
    assert.equal(probe().status,0);
} finally {rmSync(temp,{recursive:true,force:true});}
console.log('modern major binding: immutable dual-review artifacts,39 payloads,selected source identity,tamper/missing fail closed and defensive cached loader');
