import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { validateChartInput } from '../../../../backend/src/engine/chartInput.js';
import { solarToLunar } from '../../../../backend/src/engine/lunar.js';
import { hourBranchIndex } from '../../../../backend/src/engine/hourBranch.js';
import { calculateTuVi } from '../../../../backend/src/engine/tuviRules.mjs';
import { normalizeChart } from '../../../../backend/src/engine/normalizeChart.js';
import { interpretChart, PALACE_FUNCTIONS } from '../../../../backend/src/interpretation/pipeline.js';
import { verifyInterpretationBinding } from '../../../../backend/src/knowledge/interpretationBinding.js';
const root = new URL('../../../../', import.meta.url);
const read = p => JSON.parse(readFileSync(new URL(p,root),'utf8'));
const claims = read('docs/knowledge/interpretation-claims.json').claims;
const sources = [
 'docs/knowledge/research/juan2-palace/review-bundle.json',
 'docs/knowledge/research/juan2-palace/review-bundle-quan.json',
 'docs/knowledge/research/juan2-palace/review-bundle-phuc-co-cu.json',
 'docs/knowledge/research/juan2-palace/review-bundle-tai-tuvi-pha.json',
 'docs/knowledge/research/juan2-palace/review-bundle-quan-mao.json',
 'docs/knowledge/research/fortune/modern-minor/fixtures.json'
];
const fixed = new Map();
function collect(v) { if (!v || typeof v !== 'object') return; if (v.input && ['day','month','year','hour','gender'].every(k=>Number.isInteger(v.input[k]))) { const input = Object.fromEntries(['day','month','year','hour','gender'].map(k=>[k,v.input[k]])); fixed.set(JSON.stringify(input),input); } for (const item of Object.values(v)) collect(item); }
for (const p of sources) collect(read(p));
const grid = [];
for (let year=1984;year<=1995;year++) for(let month=1;month<=12;month++) for(const hour of [0,6,12,18]) for(const gender of [-1,1]) grid.push({day:15,month,year,hour,gender});
function chartFrom(input) { assert.equal(validateChartInput(input).ok,true,JSON.stringify(input)); const lunar = solarToLunar(input.day,input.month,input.year); const info=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(input.hour),input.gender,lunar.isLeapMonth); const chart=normalizeChart({tuviInfo:info,lunarInfo:lunar,input:{}}); assert.equal(chart.ok,true); assert.equal(chart.palaces.length,12); return chart; }
function cohort(name, inputs) {
 const perClaim=Object.fromEntries(claims.map(c=>[c.claimId,{palace:c.relatedPalaces[0],positive:0,negative:0,unresolved:0,reasons:{},firstPositive:null}]));
 const perPalace=Object.fromEntries(PALACE_FUNCTIONS.map(p=>[p,{approvedClaims:claims.filter(c=>c.relatedPalaces.includes(p)).length,chartsWithInternalClaim:0,chartsWithoutInternalClaim:0}]));
 let any=0, publicCount=0;
 const proposed={dien_co_cu_mao:[],dien_co_cu_dau:[],thien_di_co_cu:[],thien_di_dong_luong:[],phu_the_dong_luong:[]};
 for(const input of inputs) { const chart=chartFrom(input); const reading=interpretChart(chart,{includeInternal:true}); assert.equal(reading.ok,true); let matched=false;
  for(const statement of reading.statements.filter(s=>!s.thanOverlay)) { const p=perPalace[statement.functionId]; const gates=statement.claimApplicability.filter(g=>perClaim[g.claimId]); if(gates.some(g=>g.eligible)) {p.chartsWithInternalClaim++;matched=true;} else p.chartsWithoutInternalClaim++;
   assert.equal(statement.prose,null); assert.equal(statement.publicInterpretationReleased,false);
   for(const g of gates) { const row=perClaim[g.claimId]; if(g.eligible) {row.positive++;row.firstPositive??=input;} else if(g.reasons.some(r=>/not_evaluated|binding|missing/.test(r))) row.unresolved++; else row.negative++; for(const r of g.reasons) row.reasons[r]=(row.reasons[r]||0)+1; if(g.publicRelease)publicCount++; }
  }
  if(matched)any++;
  for(const [key,target,pair,branch] of [['dien_co_cu_mao','dien_trach',['thien_co','cu_mon'],'Mão'],['dien_co_cu_dau','dien_trach',['thien_co','cu_mon'],'Dậu'],['thien_di_co_cu','thien_di',['thien_co','cu_mon']],['thien_di_dong_luong','thien_di',['thien_dong','thien_luong']],['phu_the_dong_luong','phu_the',['thien_dong','thien_luong']]]) {const p=chart.palaces.find(p=>p.functionId===target);if(pair.every(s=>p.stars.some(x=>x.starId===s))&&(!branch||p.branchName===branch)) proposed[key].push({input,branch:p.branchName,palaceId:p.id,alreadyHasApprovedInternalClaim:matched});}
 }
 return {name,size:inputs.length,inputSha256:createHash('sha256').update(JSON.stringify(inputs)).digest('hex'),chartsWithAnyApprovedInternalClaim:any,chartsWithoutAnyApprovedInternalClaim:inputs.length-any,publicReleaseCount:publicCount,perClaim,perPalace,unapprovedCandidateReachability:Object.fromEntries(Object.entries(proposed).map(([k,v])=>[k,{count:v.length,additionalChartsWithAnyInternalClaimIfSeparatelyApproved:v.filter(x=>!x.alreadyHasApprovedInternalClaim).length,first:v[0]??null}]))};
}
const result={classification:'engineering applicability observations, not source approval, expert goldens or population prevalence',bindings:claims.map(c=>({claimId:c.claimId,binding:verifyInterpretationBinding(c)})),sourceFiles:sources,cohorts:[cohort('deduplicated frozen reviewed fixture union including24modernMinorCharts',[...fixed.values()]),cohort('fixed solar grid 1984to1995 month1to12 day15 hours0_6_12_18 both genders',grid)]};
writeFileSync(new URL('baseline.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
writeFileSync(new URL('inputs.json',import.meta.url),JSON.stringify({reviewed:[...fixed.values()],grid},null,2)+'\n');
console.log(JSON.stringify(result,null,2));
