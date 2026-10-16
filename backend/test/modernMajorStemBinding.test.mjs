import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, cpSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { sha256Text } from '../src/knowledge/sourceBinding.js';
import { MODERN_MAJOR_STEM_ALGORITHM, verifyModernMajorStemBinding, verifyStoredModernMajorStemEvidence } from '../src/knowledge/modernMajorStemBinding.js';
const base=new URL('../../docs/knowledge/research/fortune/modern-decadal-stem/',import.meta.url);
const read=ref=>readFileSync(new URL(ref,base),'utf8');
const refs=[...new Set(['manifest.json','review-bundle.json','decision.json','review-a.json','review-b.json','execution.json',
    ...Object.keys(JSON.parse(read('manifest.json')).files)])];
const files=Object.fromEntries(refs.map(ref=>[ref,read(ref)]));
const sources=JSON.parse(readFileSync(new URL('../../docs/knowledge/sources.json',import.meta.url),'utf8'));
const evidence={files,sources};
assert.deepEqual(verifyStoredModernMajorStemEvidence(evidence),{ok:true,reason:null});
assert.deepEqual(verifyModernMajorStemBinding(),{ok:true,reason:null});
const result=verifyModernMajorStemBinding();result.ok=false;assert.equal(verifyModernMajorStemBinding().ok,true);
assert.throws(()=>{MODERN_MAJOR_STEM_ALGORITHM.tigerStartStemIndexes[0]=0;},TypeError);
assert.throws(()=>{MODERN_MAJOR_STEM_ALGORITHM.baseAlgorithmSpec.periodCount=13;},TypeError);
for (const file of refs) {
    assert.equal(verifyStoredModernMajorStemEvidence({...evidence,files:{...files,[file]:files[file]+'\n'}}).ok,false,file);
    const missing={...files};delete missing[file];assert.equal(verifyStoredModernMajorStemEvidence({...evidence,files:missing}).ok,false,file);
}
for (const change of [s=>s.sources.push({...s.sources.find(r=>r.sourceId==='iztro-modern-software')}),
    s=>s.editions.push({...s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80')}),
    s=>{s.sources.find(r=>r.sourceId==='iztro-modern-software').expertVerified=true;},
    s=>{s.editions.find(r=>r.editionId==='iztro-modern-2f00e2ab0c80').gitCommit='other';},s=>{s.sources=[];},s=>{s.editions=[];}]) {
    const bad=structuredClone(sources);change(bad);assert.equal(verifyStoredModernMajorStemEvidence({files,sources:bad}).ok,false);
}
const unrelated=structuredClone(sources);unrelated.sources.push({sourceId:'unrelated'});
assert.equal(verifyStoredModernMajorStemEvidence({files,sources:unrelated}).ok,true);
assert.equal(verifyStoredModernMajorStemEvidence().ok,false);
// A coherent pair of edited "accepted" records cannot mint a new runtime approval, even after digest repair.
for (const mutation of ['table','conditions','execution','identity']) {
    const edited={...files};
    const bundle=JSON.parse(edited['review-bundle.json']),decision=JSON.parse(edited['decision.json']);
    const reviews=['review-a.json','review-b.json'].map(ref=>JSON.parse(edited[ref]));
    if (mutation==='table') for (const record of [bundle,decision,...reviews]) {
        record.algorithmSpec.tigerStartStemIndexes[0]=0;
        record.algorithmDigest=sha256Text(JSON.stringify(record.algorithmSpec));
    }
    if (mutation==='conditions') for (const record of [bundle,decision,...reviews]) {
        if(record.conditionIds)record.conditionIds=record.conditionIds.filter(x=>x!=='dan_relative_selected_branch_index_not_decade');
        if(record.conditions)record.conditions=record.conditions.filter(x=>x!=='dan_relative_selected_branch_index_not_decade');
    }
    if (mutation==='execution') {const e=JSON.parse(edited['execution.json']);e.reviewers[1].model=e.reviewers[0].model;edited['execution.json']=JSON.stringify(e);}
    if (mutation==='identity') for (const review of reviews) {review.modelId='same-forged-model';review.model='same-forged-model';}
    edited['review-bundle.json']=JSON.stringify(bundle);edited['decision.json']=JSON.stringify(decision);
    reviews.forEach((review,i)=>{review.bundleDigest=sha256Text(edited['review-bundle.json']);edited[`review-${i?'b':'a'}.json`]=JSON.stringify(review);});
    const manifest=JSON.parse(edited['manifest.json']);
    for (const ref of Object.keys(manifest.files)) manifest.files[ref]=sha256Text(edited[ref]);
    edited['manifest.json']=JSON.stringify(manifest);
    assert.equal(verifyStoredModernMajorStemEvidence({files:edited,sources}).ok,false,mutation);
}
// Real fixed-loader/cache and reader failures run in an isolated tree; no mutable runtime override.
const temp=mkdtempSync(join(tmpdir(),'modern-major-stem-binding-'));
try {
    cpSync(new URL('../src/',import.meta.url),join(temp,'backend/src'),{recursive:true});
    for (const name of ['modern-decadal','modern-decadal-stem']) cpSync(new URL(`../../docs/knowledge/research/fortune/${name}/`,import.meta.url),join(temp,`docs/knowledge/research/fortune/${name}`),{recursive:true});
    cpSync(new URL('../../docs/knowledge/sources.json',import.meta.url),join(temp,'docs/knowledge/sources.json'));
    writeFileSync(join(temp,'package.json'),'{"type":"module"}');
    const run=script=>{const p=spawnSync(process.execPath,['--input-type=module','-e',script],{cwd:temp,encoding:'utf8'});assert.equal(p.status,0,p.stderr||p.stdout);};
    const imports="import assert from 'node:assert/strict';import fs from 'node:fs';import{syncBuiltinESMExports}from'node:module';import{verifyModernMajorBinding}from'./backend/src/knowledge/modernMajorBinding.js';import{verifyModernMajorStemBinding}from'./backend/src/knowledge/modernMajorStemBinding.js';";
    run(imports+"assert.equal(verifyModernMajorStemBinding().ok,true);fs.readFileSync=()=>{throw Error('no reads after cache')};syncBuiltinESMExports();const x=verifyModernMajorStemBinding();x.ok=false;assert.equal(verifyModernMajorStemBinding().ok,true);");
    run(imports+"assert.equal(verifyModernMajorBinding().ok,true);fs.readFileSync=()=>{throw Error('reader failed')};syncBuiltinESMExports();assert.equal(verifyModernMajorStemBinding().ok,false);assert.equal(verifyModernMajorBinding().ok,true);");
    const probe=imports+"assert.equal(verifyModernMajorStemBinding().ok,false);assert.equal(verifyModernMajorBinding().ok,true);";
    const artifact=join(temp,'docs/knowledge/research/fortune/modern-decadal-stem/review-a.json');
    writeFileSync(artifact,'{}');run(probe);rmSync(artifact);run(probe);
    // Whole-capability failure isolation, including closed new fields and unaffected old output.
    run("import assert from 'node:assert/strict';import{modernMajorCapability as cap}from'./backend/src/time/modernMajor.js';import{solarToLunar}from'./backend/src/engine/lunar.js';import{hourBranchIndex}from'./backend/src/engine/hourBranch.js';import{calculateTuVi}from'./backend/src/engine/tuviRules.mjs';import{normalizeChart}from'./backend/src/engine/normalizeChart.js';const l=solarToLunar(1,1,1984);const chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(0),1,l.isLeapMonth)});const x=cap(chart,{gender:1,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal-stem',nominalAge:14}});assert.equal(x.reason,'modern_stem_profile_not_approved');assert.equal(x.heavenlyStem,null);assert.equal(x.stemPlacement,'not_applied');const old=cap(chart,{gender:1,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal',nominalAge:14}});assert.equal(old.palaceMapping,'mapped');assert.equal(old.branch,'Hợi');assert.equal(Object.hasOwn(old,'heavenlyStem'),false);");
    writeFileSync(artifact,files['review-a.json']);
    rmSync(join(temp,'docs/knowledge/research/fortune/modern-decadal/review-a.json'));
    run(imports+"assert.equal(verifyModernMajorBinding().ok,false);assert.equal(verifyModernMajorStemBinding().reason,'modern_major_base_not_approved');");
} finally {rmSync(temp,{recursive:true,force:true});}
console.log(`modern major stem binding:${refs.length} fixed artifacts,actual dual-review replay,coherent forgery rejection,source identity,defensive cache and isolated failures`);
