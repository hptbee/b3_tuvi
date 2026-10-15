import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { solarToLunar } from '/workspace/b3_tuvi/backend/src/engine/lunar.js';
import { hourBranchIndex } from '/workspace/b3_tuvi/backend/src/engine/hourBranch.js';
import { calculateTuVi } from '/workspace/b3_tuvi/backend/src/engine/tuviRules.mjs';
import { normalizeChart } from '/workspace/b3_tuvi/backend/src/engine/normalizeChart.js';
import { evaluateCondition } from '/workspace/b3_tuvi/backend/src/engine/conditionEval.js';
const c=JSON.parse(readFileSync('/tmp/t019/narrow-candidate.json','utf8'));
const ast={op:'same_palace',target:'tai_bach',stars:['Tử Vi','Tả Phù','Hữu Bật']};
assert.deepEqual(ast,c.conditionTree);
const sha=s=>createHash('sha256').update(s).digest('hex');
const span=readFileSync('/tmp/t019/juan3-tai-ziwei-fubi-span.txt','utf8');
const context=readFileSync('/tmp/t019/juan3-ziwei-complete-context.txt','utf8');
assert.equal(sha(span),c.spanSha256);assert.equal(sha(context),c.contextSha256);assert.ok(context.includes(span));
function chartFor(input){const lunar=solarToLunar(input.day,input.month,input.year);const tuviInfo=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(input.hour),input.gender,lunar.isLeapMonth);return normalizeChart({tuviInfo,lunarInfo:lunar,input:{}});}
function inspect(input){const chart=chartFor(input);assert.equal(chart.ok,true);const before=JSON.stringify(chart);const host=chart.palaces.find(p=>p.functionId==='tai_bach');const hostNames=host.stars.map(s=>s.canonicalName);const direct=ast.stars.every(s=>hostNames.includes(s));const trace=evaluateCondition(ast,chart,{schoolId:chart.schoolId,profile:'quanshu-iztro-juan3-2f00e2ab'});assert.equal(trace.status,direct?'satisfied':'not_satisfied');assert.equal(JSON.stringify(chart),before);return{input,lunar:chart.lunar,cuc:chart.cuc,menhPalaceId:chart.menhPalaceId,anSaoMonth:chart.anSaoMonth,host:{id:host.id,branchName:host.branchName,functionId:host.functionId,stars:hostNames},present:ast.stars.filter(s=>hostNames.includes(s)),missing:ast.stars.filter(s=>!hostNames.includes(s)),allThreePalaces:chart.palaces.filter(p=>ast.stars.every(s=>p.stars.some(x=>x.canonicalName===s))).map(p=>({id:p.id,functionId:p.functionId,branchName:p.branchName})),actual:direct,conditionTrace:trace,chart};}
const results=[];
for(let i=0;i<c.cases.length;i++){const f=c.cases[i];const r=inspect(f.input);assert.equal(r.actual,f.expected);assert.deepEqual(r.lunar,f.lunar);assert.deepEqual(r.cuc,f.cuc);assert.equal(r.menhPalaceId,f.menhPalaceId);assert.equal(r.anSaoMonth,f.anSaoMonth);for(const p of f.palaces){const actual=r.chart.palaces.find(x=>x.id===p.id);assert.deepEqual({id:actual.id,branchName:actual.branchName,functionId:actual.functionId,stars:actual.stars.map(x=>x.canonicalName)},p);}delete r.chart;results.push({id:`independent-${i+1}`,case:f.case,expected:f.expected,...r});}
let additional=null,searched=0;
outer:for(let year=1980;year<=1984;year++)for(let month=1;month<=12;month++)for(const day of [1,8,15,22,28])for(let hour=0;hour<24;hour+=2){searched++;const input={day,month,year,hour,gender:1};const chart=chartFor(input);const host=chart.palaces.find(p=>p.functionId==='tai_bach');const names=host.stars.map(s=>s.canonicalName);if(names.includes('Tử Vi')&&names.includes('Hữu Bật')&&!names.includes('Tả Phù')){additional=inspect(input);delete additional.chart;break outer;}}
assert.ok(additional,'need discriminating missing-Ta fixture');assert.equal(additional.actual,false);
const out={status:'INDEPENDENT_REPLAY_COMPLETED_NOT_SOURCE_APPROVAL',sourcePin:c.sourcePin,spanSha256:sha(span),contextSha256:sha(context),sourceSpan:span,conditionTree:ast,replayCount:results.length,positiveCount:results.filter(r=>r.actual).length,negativeCount:results.filter(r=>!r.actual).length,allExpected:true,metadataReplayAllExact:true,chartMutation:false,results,additionalMissingTaFixture:{searched,...additional},publicRelease:false,expertVerified:false,bookVerified:false};
writeFileSync('/tmp/t026-independent-fixtures.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({replayed:results.length,positive:out.positiveCount,negative:out.negativeCount,missingByOriginalNegative:results.filter(x=>!x.actual).map(x=>x.missing),extraMissingTa:additional.input,searched}));
