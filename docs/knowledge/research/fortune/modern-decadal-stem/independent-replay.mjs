import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(process.argv[2]||'/workspace/b3_tuvi');
const out=resolve(process.argv[3]||'/tmp/t030-fixtures');mkdirSync(out,{recursive:true});
const mod=p=>import(pathToFileURL(join(root,p)));
const {validateChartInput}=await mod('backend/src/engine/chartInput.js');
const {solarToLunar}=await mod('backend/src/engine/lunar.js');
const {calculateTuVi}=await mod('backend/src/engine/tuviRules.mjs');
const {normalizeChart}=await mod('backend/src/engine/normalizeChart.js');
const {hourBranchIndex}=await mod('backend/src/engine/hourBranch.js');
const {analyzeChartRequest}=await mod('backend/src/interpretation/analyze.js');
const {createApp}=await mod('backend/src/app.js');
const archive=join(root,'docs/knowledge/research/fortune/modern-decadal');
const text=p=>readFileSync(join(archive,p),'utf8');
const bundle=JSON.parse(text('review-bundle.json'));
const constants=text('raw/src/data/constants.ts'),palace=text('raw/src/astro/palace.ts');
const sourceFiles=['raw/src/data/constants.ts','raw/src/astro/palace.ts','raw/src/utils/index.ts'];
const proofs=sourceFiles.map(path=>{const data=readFileSync(join(archive,path));const sha256=createHash('sha256').update(data).digest('hex');const old=[...bundle.contextManifest,...bundle.payloadHashManifest].find(x=>x.path===path);assert.ok(old,`prior retained manifest ${path}`);assert.equal(sha256,old.sha256);return {path,bytes:data.length,sha256,retainedManifestMatch:true};});
const stems=[...constants.match(/export const HEAVENLY_STEMS = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const branches=[...constants.match(/export const EARTHLY_BRANCHES = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const tiger=Object.fromEntries([...constants.match(/export const TIGER_RULE = \{([\s\S]*?)\}/)[1].matchAll(/(\w+): '(\w+)'/g)].map(m=>[m[1],m[2]]));
assert.equal(stems.length,10);assert.equal(branches.length,12);assert.equal(Object.keys(tiger).length,10);
assert.ok(palace.includes('HEAVENLY_STEMS.indexOf(startHeavenlyStem) + idx, 10'));
assert.ok(palace.includes("EARTHLY_BRANCHES.indexOf('yinEarthly') + idx"));
const vn=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const branchVN=['Tí','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
const wrap=(x,n)=>((x%n)+n)%n;
function natal(input){assert.equal(validateChartInput(input).ok,true);const l=solarToLunar(input.day,input.month,input.year);const chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(input.hour),input.gender,l.isLeapMonth)});assert.equal(chart.ok,true);return chart;}
const candidates=[];
for(let year=1984;year<=1996;year++)for(const month of [1,6])for(const gender of [1,-1])for(let hour=0;hour<24;hour+=2){const input={day:1,month,year,hour,gender},chart=natal(input);candidates.push({input,chart});}
function keys({input,chart}){const l=chart.lunar;return [`stem:${l.canIndex}:sex:${input.gender}`,`yearBranch:${l.chiIndex}:sex:${input.gender}`,`cuc:${chart.cuc.number}:sex:${input.gender}:parity:${(l.chiIndex-1)%2}`,`menh:${chart.menhPalaceId}`,`solarBoundary:${input.year!==l.lunarYear}`];}
const required=new Set(candidates.flatMap(keys)),missing=new Set(required),selected=[];
while(missing.size){let best,score=0;for(const c of candidates){const s=keys(c).filter(k=>missing.has(k)).length;if(s>score){score=s;best=c;}}assert.ok(best);selected.push(best);for(const k of keys(best))missing.delete(k);}
const fixtures=[];let queryCount=0;const wrong={solarYear:0,targetZodiacIndex:0,directionDecade:0,unwrappedSoulPlusDecade:0,yearStemDirect:0};
for(const [num,{input,chart}] of selected.entries()){
 const l=chart.lunar,soulZ=Number(chart.menhPalaceId)-1,soulTiger=wrap(soulZ-branches.indexOf('yinEarthly'),12),cuc=chart.cuc.number;
 const direction=(input.gender===1)===((l.chiIndex-1)%2===0)?1:-1;
 // Independently replay the retained upstream loop; never consult runtime modernMajorPeriod for expected stems.
 const periods=[];
 for(let i=0;i<12;i++){
  const idx=wrap(soulTiger+direction*i,12),stemIndex=wrap(stems.indexOf(tiger[stems[l.canIndex]])+idx,10),zodiac=wrap(branches.indexOf('yinEarthly')+idx,12);
  const p=chart.palaces.find(p=>p.branchId===zodiac+1);assert.ok(p);
  const closed=wrap((l.canIndex%5)*2+2+wrap(zodiac-2,12),10);assert.equal(closed,stemIndex);
  const incorrect={solarYear:wrap(stems.indexOf(tiger[stems[wrap(input.year-4,10)]])+idx,10),targetZodiacIndex:wrap(stems.indexOf(tiger[stems[l.canIndex]])+zodiac,10),directionDecade:wrap(stems.indexOf(tiger[stems[l.canIndex]])+direction*i,10),unwrappedSoulPlusDecade:wrap(stems.indexOf(tiger[stems[l.canIndex]])+soulTiger+direction*i,10),yearStemDirect:wrap(l.canIndex+idx,10)};
  const distinguishes=Object.entries(incorrect).filter(([,v])=>v!==stemIndex).map(([key])=>key);for(const key of distinguishes)wrong[key]++;
  periods.push({decadeIndex:i,startAge:cuc+10*i,endAge:cuc+10*i+9,branch:branchVN[zodiac],branchId:zodiac+1,tigerBasedPalaceIndex:idx,palaceId:p.id,functionId:p.functionId,heavenlyStemIndex:stemIndex,heavenlyStem:vn[stemIndex],distinguishes});
 }
 const ageSet=new Set([1,125,...periods.flatMap(p=>[p.startAge,p.endAge]),cuc-1,cuc+120].filter(a=>a>=1&&a<=125));
 const ageCases=[];
 for(const nominalAge of [...ageSet].sort((a,b)=>a-b)){
  const p=periods.find(p=>nominalAge>=p.startAge&&nominalAge<=p.endAge),expected=p?{status:'branch_placed',branch:p.branch,heavenlyStem:p.heavenlyStem,heavenlyStemIndex:p.heavenlyStemIndex,decadeIndex:p.decadeIndex,decadeStartAge:p.startAge,decadeEndAge:p.endAge,palaceId:p.palaceId}:{status:'not_applied',reason:nominalAge<cuc?'before_first_period':'after_last_period',branch:null,heavenlyStem:null,heavenlyStemIndex:null};
  const result=analyzeChartRequest({...input,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal',nominalAge}});assert.equal(result.status,200);
  const actual=result.body.time.capabilities.dai_han_modern;assert.equal(actual.status,expected.status);assert.equal(actual.branch,expected.branch);if(p){assert.equal(actual.decadeIndex,p.decadeIndex);assert.equal(actual.palaceId,p.palaceId);}else assert.equal(actual.reason,expected.reason);
  // T030 is not implemented at freeze; API branch/age assertions prove real reachability only, never claim runtime stem validation.
  ageCases.push({nominalAge,expected,analyzeStatus:result.status,branchReachabilityVerified:true});queryCount++;
 }
 fixtures.push({id:`T030-F${String(num+1).padStart(2,'0')}`,input,validatedInput:true,natal:{lunarYear:l.lunarYear,yearStemIndex:l.canIndex,yearStem:l.canName,yearBranchIndex:l.chiIndex,yearBranch:l.chiName,menhPalaceId:chart.menhPalaceId,cuc:chart.cuc.number,direction,calendarYearDiffersFromLunarYear:input.year!==l.lunarYear},periods,ageCases});
}
// Real HTTP for every selected birth and its first/last supported plus before/after where API-valid.
const originalLog=console.log;console.log=()=>{};
const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});let httpCount=0;
try{for(const f of fixtures){const cuc=f.natal.cuc;const ages=[1,cuc,cuc+119,cuc+120,125].filter((a,i,arr)=>a<=125&&arr.indexOf(a)===i);f.httpWitnesses=[];for(const nominalAge of ages){const res=await fetch(`http://127.0.0.1:${server.address().port}/api/interpretations/analyze`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...f.input,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal',nominalAge}})});assert.equal(res.status,200);assert.match(res.headers.get('cache-control'),/no-store/);const b=await res.json();const expected=f.ageCases.find(x=>x.nominalAge===nominalAge).expected;assert.equal(b.time.capabilities.dai_han_modern.branch,expected.branch);f.httpWitnesses.push({nominalAge,status:res.status,noStore:true});httpCount++;}}}finally{await new Promise(resolve=>server.close(resolve));console.log=originalLog;}
assert.equal(new Set(fixtures.map(f=>f.natal.yearStemIndex)).size,10);assert.equal(new Set(fixtures.map(f=>f.natal.yearBranchIndex)).size,12);assert.equal(new Set(fixtures.map(f=>f.natal.cuc)).size,5);for(const n of Object.values(wrong))assert.ok(n>0);
const output={status:'INDEPENDENT_SOURCE_DERIVED_FIXTURES_NOT_SOURCE_APPROVAL',sourcePin:bundle.sourcePin,method:'Retained full getHoroscope loop and TIGER_RULE parsed independently; chart engine provides trusted natal metadata only; no expected value imported from production modernMajor helper or analyst.',scope:'Explicit supplied B3 lunar stem + selected approved branch projection. Not upstream complete calendar equivalence. No future stems/Tu Hoa/stars/interpretation inferred.',sourceProofs:proofs,coverage:{searchedValidCharts:candidates.length,selectedCharts:fixtures.length,periods:fixtures.length*12,analyzeRequests:queryCount,httpRequests:httpCount,required:[...required].sort(),covered:[...new Set(selected.flatMap(keys))].sort(),targetBranches:branchVN,yearStemIndexes:[...new Set(fixtures.map(f=>f.natal.yearStemIndex))].sort((a,b)=>a-b),directions:[...new Set(fixtures.map(f=>f.natal.direction))].sort(),distinguishingPeriodCounts:wrong},fixtures};
writeFileSync(join(out,'fixtures.json'),JSON.stringify(output,null,2)+'\n');writeFileSync(join(out,'source-proof.json'),JSON.stringify({sourcePin:bundle.sourcePin,proofs},null,2)+'\n');console.log(JSON.stringify(output.coverage,null,2));
