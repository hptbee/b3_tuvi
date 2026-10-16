import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { sha256Text } from '../src/knowledge/sourceBinding.js';
import { MODERN_MAJOR_MUTAGEN_ALGORITHM, verifyModernMajorMutagenBinding, verifyStoredModernMajorMutagenEvidence } from '../src/knowledge/modernMajorMutagenBinding.js';
const base=new URL('../../docs/knowledge/research/fortune/modern-decadal-mutagen/',import.meta.url);
const read=ref=>readFileSync(new URL(ref,base),'utf8');
const refs=[...new Set(['manifest.json','review-bundle.json','decision.json','review-a.json','review-b.json','execution.json',
    ...Object.keys(JSON.parse(read('manifest.json')).files)])];
const files=Object.fromEntries(refs.map(ref=>[ref,read(ref)]));
const sources=JSON.parse(readFileSync(new URL('../../docs/knowledge/sources.json',import.meta.url),'utf8'));
const evidence={files,sources};
assert.deepEqual(verifyStoredModernMajorMutagenEvidence(evidence),{ok:true,reason:null});
assert.deepEqual(verifyModernMajorMutagenBinding(),{ok:true,reason:null});
const result=verifyModernMajorMutagenBinding();result.ok=false;assert.equal(verifyModernMajorMutagenBinding().ok,true);
assert.throws(()=>{MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable['0'][0]='forged';},TypeError);
assert.throws(()=>{MODERN_MAJOR_MUTAGEN_ALGORITHM.baseAlgorithmSpec.baseAlgorithmSpec.periodCount=13;},TypeError);
for (const file of refs) {
    assert.equal(verifyStoredModernMajorMutagenEvidence({...evidence,files:{...files,[file]:files[file]+'\n'}}).ok,false,file);
    const missing={...files};delete missing[file];assert.equal(verifyStoredModernMajorMutagenEvidence({...evidence,files:missing}).ok,false,file);
}
for (const change of [s=>s.sources.push({...s.sources.find(r=>r.sourceId==='iztro-modern-software')}),
    s=>s.editions.push({...s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80')}),
    s=>{s.sources.find(r=>r.sourceId==='iztro-modern-software').expertVerified=true;},
    s=>{s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80').gitCommit='other';},s=>{s.sources=[];},s=>{s.editions=[];}]) {
    const bad=structuredClone(sources);change(bad);assert.equal(verifyStoredModernMajorMutagenEvidence({files,sources:bad}).ok,false);
}
const unrelated=structuredClone(sources);unrelated.sources.push({sourceId:'unrelated'});
assert.equal(verifyStoredModernMajorMutagenEvidence({files,sources:unrelated}).ok,true);
assert.equal(verifyStoredModernMajorMutagenEvidence().ok,false);
// A coherent pair of edited "accepted" records cannot mint a new runtime approval, even after digest repair.
for (const mutation of ['table','conditions','execution','identity']) {
    const edited={...files};
    const bundle=JSON.parse(edited['review-bundle.json']),decision=JSON.parse(edited['decision.json']);
    const reviews=['review-a.json','review-b.json'].map(ref=>JSON.parse(edited[ref]));
    if (mutation==='table') for (const record of [bundle,decision,...reviews]) {
        record.algorithmSpec.defaultTable['0'][0]='forged';
        record.algorithmDigest=sha256Text(JSON.stringify(record.algorithmSpec));
    }
    if (mutation==='conditions') for (const record of [bundle,decision,...reviews]) {
        if(record.conditionIds)record.conditionIds=record.conditionIds.filter(x=>x!=='pinned_builtin_default_40cell_table_only');
        if(record.conditions)record.conditions=record.conditions.filter(x=>x!=='pinned_builtin_default_40cell_table_only');
    }
    if (mutation==='execution') {const e=JSON.parse(edited['execution.json']);e.reviewers[1].model=e.reviewers[0].model;edited['execution.json']=JSON.stringify(e);}
    if (mutation==='identity') for (const review of reviews) {review.modelId='same-forged-model';review.model='same-forged-model';}
    edited['review-bundle.json']=JSON.stringify(bundle);edited['decision.json']=JSON.stringify(decision);
    reviews.forEach((review,i)=>{review.bundleDigest=sha256Text(edited['review-bundle.json']);edited[`review-${i?'b':'a'}.json`]=JSON.stringify(review);});
    const manifest=JSON.parse(edited['manifest.json']);
    for (const ref of Object.keys(manifest.files)) manifest.files[ref]=sha256Text(edited[ref]);
    edited['manifest.json']=JSON.stringify(manifest);
    assert.equal(verifyStoredModernMajorMutagenEvidence({files:edited,sources}).ok,false,mutation);
}
// Every approved cell, row shape and extra/missing keys fail strict content equality on mutation.
for(const key of Object.keys(MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable))for(let index=0;index<4;index++){
    const table=structuredClone(MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable);table[key][index]='forged';
    assert.equal(verifyStoredModernMajorMutagenEvidence({...evidence,table}).reason,'modern_major_mutagen_table_invalid');
}
for(const mutate of [t=>{delete t['0'];},t=>{t.extra=[];},t=>{t['0'].pop();},t=>{t['0'].push('extra');},t=>{t['0']={...t['0']};}]){
    const table=structuredClone(MODERN_MAJOR_MUTAGEN_ALGORITHM.defaultTable);mutate(table);
    assert.equal(verifyStoredModernMajorMutagenEvidence({...evidence,table}).ok,false);
}
// Real fixed-loader/cache and reader failures run in an isolated tree; no mutable runtime override.
const temp=mkdtempSync(join(tmpdir(),'modern-major-mutagen-binding-'));
try {
    cpSync(new URL('../src/',import.meta.url),join(temp,'backend/src'),{recursive:true});
    for (const name of ['modern-decadal','modern-decadal-stem','modern-decadal-mutagen']) cpSync(new URL(`../../docs/knowledge/research/fortune/${name}/`,import.meta.url),join(temp,`docs/knowledge/research/fortune/${name}`),{recursive:true});
    cpSync(new URL('../../docs/knowledge/sources.json',import.meta.url),join(temp,'docs/knowledge/sources.json'));
    writeFileSync(join(temp,'package.json'),'{"type":"module"}');
    const run=script=>{const p=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:temp,encoding:'utf8'});assert.equal(p.status,0,p.stderr||p.stdout);};
    const imports="import assert from 'node:assert/strict';import fs from 'node:fs';import{syncBuiltinESMExports}from'node:module';import{verifyModernMajorBinding}from'./backend/src/knowledge/modernMajorBinding.js';import{verifyModernMajorStemBinding}from'./backend/src/knowledge/modernMajorStemBinding.js';import{verifyModernMajorMutagenBinding}from'./backend/src/knowledge/modernMajorMutagenBinding.js';";
    run(imports+"assert.equal(verifyModernMajorMutagenBinding().ok,true);fs.readFileSync=()=>{throw Error('no reads after cache')};syncBuiltinESMExports();const x=verifyModernMajorMutagenBinding();x.ok=false;assert.equal(verifyModernMajorMutagenBinding().ok,true);");
    run(imports+"assert.equal(verifyModernMajorStemBinding().ok,true);fs.readFileSync=()=>{throw Error('reader failed')};syncBuiltinESMExports();assert.equal(verifyModernMajorMutagenBinding().reason,'modern_major_mutagen_evidence_unavailable');assert.equal(verifyModernMajorStemBinding().ok,true);assert.equal(verifyModernMajorBinding().ok,true);");
    run(imports+"import table from './backend/src/data/tuHoaMap.json' with{type:'json'};assert.equal(verifyModernMajorMutagenBinding().ok,true);assert.equal(Object.isFrozen(table),false);table['0'][0]='changed after cache';assert.equal(verifyModernMajorMutagenBinding().reason,'modern_major_mutagen_table_invalid');table['0'][0]='Liêm Trinh';assert.equal(verifyModernMajorMutagenBinding().ok,true);");
    run(imports+"assert.equal(verifyModernMajorStemBinding().ok,true);fs.readFileSync=()=>{throw Error('new-only reader fails')};syncBuiltinESMExports();assert.equal(verifyModernMajorStemBinding().ok,true);assert.equal(verifyModernMajorMutagenBinding().ok,false);assert.equal(verifyModernMajorStemBinding().ok,true);");
    const probe=imports+"assert.equal(verifyModernMajorMutagenBinding().ok,false);assert.equal(verifyModernMajorBinding().ok,true);";
    const artifact=join(temp,'docs/knowledge/research/fortune/modern-decadal-mutagen/review-a.json');
    writeFileSync(artifact,'{}');run(probe);rmSync(artifact);run(probe);
    // Missing separate T032 approval withholds entire capability; both earlier profiles remain isolated.
    run("import assert from 'node:assert/strict';import{modernMajorCapability as cap}from'./backend/src/time/modernMajor.js';import{solarToLunar}from'./backend/src/engine/lunar.js';import{hourBranchIndex}from'./backend/src/engine/hourBranch.js';import{calculateTuVi}from'./backend/src/engine/tuviRules.mjs';import{normalizeChart}from'./backend/src/engine/normalizeChart.js';const l=solarToLunar(1,1,1984);const chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(0),1,l.isLeapMonth)});const x=cap(chart,{gender:1,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal-mutagen',nominalAge:14}});assert.equal(x.reason,'modern_mutagen_profile_not_approved');assert.equal(x.heavenlyStem,null);assert.equal(x.branch,null);assert.equal(x.stemPlacement,'not_applied');assert.equal(x.mutagenPlacement,'not_applied');assert.deepEqual(x.mutagens,[]);for(const profile of ['iztro-pinned-menh-cuc-decadal','iztro-pinned-menh-cuc-decadal-stem']){const old=cap(chart,{gender:1,majorPeriod:{profile,nominalAge:14}});assert.equal(old.palaceMapping,'mapped');assert.equal(old.branch,'Hợi');assert.equal(Object.hasOwn(old,'mutagens'),false);}");
    writeFileSync(artifact,files['review-a.json']);
    rmSync(join(temp,'docs/knowledge/research/fortune/modern-decadal/review-a.json'));
    run(imports+"assert.equal(verifyModernMajorBinding().ok,false);assert.equal(verifyModernMajorMutagenBinding().reason,'modern_major_stem_not_approved');");
} finally {rmSync(temp,{recursive:true,force:true});}
console.log(`modern major mutagen binding:${refs.length} fixed artifacts,actual dual-review replay,coherent forgery rejection,source identity,defensive cache and isolated failures`);
