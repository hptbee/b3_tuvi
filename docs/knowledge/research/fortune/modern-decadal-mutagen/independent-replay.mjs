import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const here=dirname(fileURLToPath(import.meta.url)),root=resolve(process.argv[2]),out=resolve(process.argv[3]);mkdirSync(out,{recursive:true});
const read=p=>readFileSync(join(here,'raw',p),'utf8'),proof=JSON.parse(readFileSync(join(here,'source-proof.json')));
for(const f of proof.files){const b=readFileSync(join(here,'raw',f.path));assert.equal(b.length,f.bytes);assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);}
const strings=t=>[...t.matchAll(/'([^']+)'/g)].map(m=>m[1]);
const stems=strings(read('src/data/constants.ts').match(/HEAVENLY_STEMS = \[([\s\S]*?)\]/)[1]);
const branches=strings(read('src/data/constants.ts').match(/EARTHLY_BRANCHES = \[([\s\S]*?)\]/)[1]);
const order=strings(read('src/data/stars.ts').match(/MUTAGEN = \[([^\]]+)\]/)[1]);assert.deepEqual(order,['sihuaLu','sihuaQuan','sihuaKe','sihuaJi']);
const names=Object.fromEntries([...read('src/i18n/locales/vi-VN/star.ts').matchAll(/(\w+): '([^']+)'/g)].map(m=>[m[1],m[2]]));
const stemNames=Object.fromEntries([...read('src/i18n/locales/vi-VN/heavenlyStem.ts').matchAll(/(\w+): '([^']+)'/g)].map(m=>[m[1],m[2]]));
const labels=Object.fromEntries([...read('src/i18n/locales/vi-VN/mutagen.ts').matchAll(/(\w+): '([^']+)'/g)].map(m=>[m[1],m[2]]));
const rows=Object.fromEntries([...read('src/data/heavenlyStems.ts').matchAll(/(\w+Heavenly): \{([\s\S]*?)\n  \}/g)].map(m=>[m[1],strings(m[2].match(/mutagen: \[([^\]]+)\]/)[1])]));
assert.equal(stems.length,10);assert.equal(Object.keys(rows).length,10);for(const r of Object.values(rows))assert.equal(r.length,4);
assert.ok(read('src/utils/index.ts').includes('mutagens && mutagens[heavenlyStem]'));assert.ok(read('src/astro/config.ts').includes('mutagens: {}'));
assert.ok(read('src/astro/FunctionalHoroscope.ts').includes('const stars = mergeStars([majorStars], [minorStars])[0]'));
assert.ok(read('src/astro/FunctionalHoroscope.ts').includes('this[scope].mutagen[mutagenIndex]'));
assert.ok(read('src/astro/FunctionalAstrolabe.ts').includes('mutagen: getMutagensByHeavenlyStem(heavenlyStemOfDecade)'));
const tiger=Object.fromEntries([...read('src/data/constants.ts').match(/TIGER_RULE = \{([\s\S]*?)\}/)[1].matchAll(/(\w+): '(\w+)'/g)].map(m=>[m[1],m[2]]));
const table=stems.map((stem,index)=>({stemIndex:index,stemKey:stem,associations:rows[stem].map((key,i)=>({mutagenKey:order[i],mutagen:labels[order[i]],sourceStarKey:key,sourceStarName:names[key],sourceCategory:key.endsWith('Maj')?'major':'minor'}))}));
const mod=p=>import(pathToFileURL(join(root,p)));const {validateChartInput}=await mod('backend/src/engine/chartInput.js');const {solarToLunar}=await mod('backend/src/engine/lunar.js');const {calculateTuVi}=await mod('backend/src/engine/tuviRules.mjs');const {normalizeChart}=await mod('backend/src/engine/normalizeChart.js');const {hourBranchIndex}=await mod('backend/src/engine/hourBranch.js');const {analyzeChartRequest}=await mod('backend/src/interpretation/analyze.js');
const old=JSON.parse(readFileSync(join(root,'docs/knowledge/research/fortune/modern-decadal-stem/fixtures.json'))),wrap=(n,m)=>(n%m+m)%m;
const cases=[],stemCounts=Array(10).fill(0),wrong={birthStem:0,viewYearStem:0,nextStem:0,categoryRotation:0,b3NatalAssociationReuse:0},shared=[];
let analyzeRequests=0;const allNames=new Set(),allIds=new Set();
for(const prior of old.fixtures){const input=prior.input;assert.equal(validateChartInput(input).ok,true);const l=solarToLunar(input.day,input.month,input.year),chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(input.hour),input.gender,l.isLeapMonth)});assert.equal(chart.ok,true);
 const stars=chart.palaces.flatMap(p=>p.stars.map(s=>({p,s}))),soulTiger=wrap(Number(chart.menhPalaceId)-1-2,12),direction=(input.gender===1)===((l.chiIndex-1)%2===0)?1:-1;
 const periods=[];
 for(let i=0;i<12;i++){const idx=wrap(soulTiger+direction*i,12),stemIndex=wrap(stems.indexOf(tiger[stems[l.canIndex]])+idx,10),branchId=wrap(idx+2,12)+1,age=chart.cuc.number+10*i;
  const associates=table[stemIndex].associations.map(a=>{const matches=stars.filter(({s})=>s.canonicalName===a.sourceStarName&&s.category!=='tu_hoa');assert.equal(matches.length,1,`${prior.id} ${a.sourceStarName}`);const {p,s}=matches[0];assert.equal(s.status,'known');assert.equal(s.list==='major',a.sourceCategory==='major');assert.equal(s.palaceId,p.id);allNames.add(a.sourceStarName);allIds.add(s.starId);return {...a,b3StarId:s.starId,b3InstanceId:s.instanceId,b3List:s.list,palaceId:p.id,functionId:p.functionId,branchId:p.branchId,branch:p.branchName};});
  const viewedYear=2037;const viewCan=solarToLunar(1,6,viewedYear).canIndex;
  const distinguish={birthStem:stemIndex!==l.canIndex,viewYearStem:stemIndex!==viewCan,nextStem:JSON.stringify(rows[stems[stemIndex]])!==JSON.stringify(rows[stems[wrap(stemIndex+1,10)]]),categoryRotation:associates[0].sourceStarKey!==associates[1].sourceStarKey,b3NatalAssociationReuse:stemIndex!==l.canIndex};for(const [k,v]of Object.entries(distinguish))if(v)wrong[k]++;
  const result=analyzeChartRequest({...input,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal-stem',nominalAge:age}});assert.equal(result.status,200);analyzeRequests++;const actual=result.body.time.capabilities.dai_han_modern;assert.equal(actual.heavenlyStem,stemNames[stems[stemIndex]]);assert.equal(actual.palaceId,String(branchId));assert.equal(actual.decadeIndex,i);
  const distinctPalaces=new Set(associates.map(a=>a.palaceId)).size;if(distinctPalaces<4)shared.push({fixture:prior.id,decadeIndex:i,records:4,distinctPalaces});
  stemCounts[stemIndex]++;periods.push({decadeIndex:i,nominalAge:age,selectedStemIndex:stemIndex,selectedStemKey:stems[stemIndex],selectedBranchId:branchId,viewYear:viewedYear,viewYearStemIndex:viewCan,expectedAssociations:associates,distinguishes:distinguish,analyzeStatus:200});
 }
 cases.push({id:prior.id.replace('T030','T032'),input,natal:{lunarYear:l.lunarYear,birthStemIndex:l.canIndex,birthBranchIndex:l.chiIndex,cuc:chart.cuc.number,direction},periods});
}
const {createApp}=await mod('backend/src/app.js');const originalLog=console.log;console.log=()=>{};let httpRequests=0;
const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});
try{for(const c of cases){const res=await fetch(`http://127.0.0.1:${server.address().port}/api/interpretations/analyze`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...c.input,majorPeriod:{profile:'iztro-pinned-menh-cuc-decadal-stem',nominalAge:c.periods[0].nominalAge}})});assert.equal(res.status,200);assert.match(res.headers.get('cache-control'),/no-store/);const body=await res.json();assert.equal(body.time.capabilities.dai_han_modern.heavenlyStem,stemNames[c.periods[0].selectedStemKey]);c.httpWitness={status:res.status,noStore:true,nominalAge:c.periods[0].nominalAge};httpRequests++;}}finally{await new Promise(resolve=>server.close(resolve));console.log=originalLog;}
assert.ok(stemCounts.every(n=>n>0));assert.equal(allNames.size,15);assert.equal(allIds.size,15);assert.ok(shared.length>0);assert.ok(Object.values(wrong).every(n=>n>0));
const expected={status:'INDEPENDENT_SOURCE_COMPARATIVE_CANDIDATE_NOT_APPROVED_NOT_IMPLEMENTED',sourcePin:proof.sourcePin,scope:'Default no custom mutagens; selected T030 approved decadal stem projects pinned table onto B3 physical natal major/minor stars. Not upstream whole chart equivalence; no origin-scope mutagen query or physical transit stars, no interpretation/public approval.',table,coverage:{charts:cases.length,periods:cases.length*12,associationRecords:cases.length*48,analyzeRequests,httpRequests,selectedStemPeriodCounts:stemCounts,uniqueSourceCanonicalStars:[...allNames].sort(),uniqueB3StarIds:[...allIds].sort(),sexes:[...new Set(cases.map(c=>c.input.gender))].sort(),directions:[...new Set(cases.map(c=>c.natal.direction))].sort(),cuc:[...new Set(cases.map(c=>c.natal.cuc))].sort(),wrongAlgorithmWitnessCounts:wrong,sharedPalacePeriodCount:shared.length},sharedPalaceWitnesses:shared.slice(0,12),syntheticNegativeRequirements:['missing selected source star: do not fabricate placement','duplicate source star in same/different natal palace: do not pick first','forged starId/canonicalName/category/list/palace linkage','custom/partial mutagens override excluded even though upstream supports it','missing/conflicting trusted T030 stem/branch metadata','old profile never activates candidate','wrong mutagen category order or birth/view stem must not substitute'],cases};
writeFileSync(join(out,'fixtures.json'),JSON.stringify(expected,null,2)+'\n');console.log(JSON.stringify(expected.coverage,null,2));
