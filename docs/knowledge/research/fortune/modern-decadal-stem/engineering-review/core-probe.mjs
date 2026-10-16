import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import{createHash}from'node:crypto';
import{modernMajorCapability as cap,modernMajorStem as stem}from'/workspace/b3_tuvi/backend/src/time/modernMajor.js';
import{solarToLunar}from'/workspace/b3_tuvi/backend/src/engine/lunar.js';
import{calculateTuVi}from'/workspace/b3_tuvi/backend/src/engine/tuviRules.mjs';
import{normalizeChart}from'/workspace/b3_tuvi/backend/src/engine/normalizeChart.js';
import{hourBranchIndex}from'/workspace/b3_tuvi/backend/src/engine/hourBranch.js';
import{validateChartInput}from'/workspace/b3_tuvi/backend/src/engine/chartInput.js';
const base='/workspace/b3_tuvi/docs/knowledge/research/fortune/modern-decadal-stem/';
const read=p=>readFileSync(base+p,'utf8'),sha=s=>createHash('sha256').update(s).digest('hex');
let artifacts=0;for(const[p,h]of Object.entries(JSON.parse(read('manifest.json')).files)){assert.equal(sha(read(p)),h,p);artifacts++;}
const frozen=read('fixtures.json'),replayed=readFileSync('/tmp/t030/core-independent-replay/fixtures.json','utf8');assert.equal(sha(frozen),sha(replayed));
const constants=read('raw/src/data/constants.ts');const keys=[...constants.match(/HEAVENLY_STEMS = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
const tiger=Object.fromEntries([...constants.match(/TIGER_RULE = \{([\s\S]*?)\}/)[1].matchAll(/(\w+): '(\w+)'/g)].map(x=>[x[1],x[2]]));
const locale=read('raw/src/i18n/locales/vi-VN/heavenlyStem.ts');const names=Object.fromEntries([...locale.matchAll(/(\w+): '([^']+)'/g)].map(x=>[x[1],x[2]]));
let pure=0,charts=0,queries=0;const old='iztro-pinned-menh-cuc-decadal',profile=old+'-stem';
for(let ys=0;ys<10;ys++)for(let target=1;target<=12;target++){const idx=[3,4,5,6,7,8,9,10,11,12,1,2].indexOf(target);assert.equal(stem({birthYearStemIndex:ys,selectedBranchId:target}),names[keys[(keys.indexOf(tiger[keys[ys]])+idx)%10]]);pure++;}
for(let year=1979;year<=2008;year++)for(const gender of[-1,1])for(const hour of[0,6,12,18]){const input={day:1,month:year%2?1:6,year,hour,gender};assert.equal(validateChartInput(input).ok,true);const l=solarToLunar(input.day,input.month,year);const chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(hour),gender,l.isLeapMonth)});charts++;
for(let age=1;age<=125;age++){const x=cap(chart,{gender,majorPeriod:{profile,nominalAge:age}}),legacy=cap(chart,{gender,majorPeriod:{profile:old,nominalAge:age}});const{heavenlyStem,stemPlacement,...rest}=x;assert.deepEqual({...rest,profile:old,calendarCompatibility:legacy.calendarCompatibility},legacy);if(x.status==='branch_placed'){const selected=Number(x.palaceId);const idx=[3,4,5,6,7,8,9,10,11,12,1,2].indexOf(selected);assert.equal(heavenlyStem,names[keys[(keys.indexOf(tiger[keys[l.canIndex]])+idx)%10]]);assert.equal(stemPlacement,'supported');}else{assert.equal(heavenlyStem,null);assert.equal(stemPlacement,'not_applied');}queries++;}}
const proof={artifacts,replayFixtureDigest:sha(replayed),sourceParsedMappings:pure,validatedCharts:charts,oldNewAgeComparisons:queries,publicAndClassicalChanges:false};writeFileSync('/tmp/t030/core-proof.json',JSON.stringify(proof,null,2)+'\n');console.log(proof);
