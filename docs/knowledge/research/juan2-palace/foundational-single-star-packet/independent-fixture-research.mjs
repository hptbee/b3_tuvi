import {readFileSync,existsSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
let root=dirname(fileURLToPath(import.meta.url));
while(!existsSync(join(root,'backend/src/engine/tuviRules.mjs'))){const parent=dirname(root);assert.notEqual(parent,root,'Could not locate product root');root=parent;}
const load=p=>import(pathToFileURL(join(root,p)).href);
const {validateChartInput}=await load('backend/src/engine/chartInput.js');
const {solarToLunar}=await load('backend/src/engine/lunar.js');
const {hourBranchIndex}=await load('backend/src/engine/hourBranch.js');
const {calculateTuVi}=await load('backend/src/engine/tuviRules.mjs');
const {normalizeChart}=await load('backend/src/engine/normalizeChart.js');
const data=JSON.parse(readFileSync(new URL('independent-fixtures.json',import.meta.url),'utf8'));
const definitions={'interp-quanshu-thien-di-thien-luong-host':['thien_di','thien_luong'],'interp-quanshu-no-boc-thien-luong-host':['no_boc','thien_luong'],'interp-quanshu-thien-di-cu-mon-host':['thien_di','cu_mon'],'interp-quanshu-dien-trach-thien-co-host':['dien_trach','thien_co']};
let count=0;
for(const [claimId,fixtures] of Object.entries(data.fixtures)){
assert(definitions[claimId]);const [target,star]=definitions[claimId];
for(const fixture of fixtures){assert.equal(validateChartInput(fixture.input).ok,true,fixture.id);const {day,month,year,hour,gender}=fixture.input;const lunar=solarToLunar(day,month,year);assert.deepEqual(lunar,fixture.lunar,fixture.id+' lunar');const info=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(hour),gender,lunar.isLeapMonth);const chart=normalizeChart({tuviInfo:info,lunarInfo:lunar,input:{}});assert.equal(chart.ok,true);assert.equal(chart.palaces.length,12);const p=chart.palaces.find(p=>p.functionId===target);assert.deepEqual({id:p.id,functionId:p.functionId,branchName:p.branchName},fixture.host);const expected=p.stars.some(s=>s.starId===star);assert.equal(expected,fixture.expected,fixture.id+' direct host oracle');const starHosts=chart.palaces.filter(p=>p.stars.some(s=>s.starId===star));assert.equal(starHosts.length,1);assert.deepEqual({id:starHosts[0].id,functionId:starHosts[0].functionId,branchName:starHosts[0].branchName},fixture.starLocation);count++;}
assert.deepEqual([...new Set(fixtures.map(f=>f.input.gender))].sort(),[-1,1]);assert(fixtures.some(f=>f.expected));assert(fixtures.some(f=>!f.expected));
}
assert.equal(count,112);console.log(JSON.stringify({status:'PASS',classification:'Engineering fixture replay only, no source judgment or approval',fixtures:count,claims:Object.keys(definitions).length,oracle:'independent direct host star membership; no condition evaluator',filesWritten:0}));
