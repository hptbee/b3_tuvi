import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(process.argv[2]||process.cwd());
const out=resolve(process.argv[3]||dirname(fileURLToPath(import.meta.url)));mkdirSync(out,{recursive:true});
const load=p=>import(pathToFileURL(join(root,p)));
const {validateChartInput}=await load('backend/src/engine/chartInput.js');
const {solarToLunar}=await load('backend/src/engine/lunar.js');
const {calculateTuVi}=await load('backend/src/engine/tuviRules.mjs');
const {normalizeChart}=await load('backend/src/engine/normalizeChart.js');
const {hourBranchIndex}=await load('backend/src/engine/hourBranch.js');
const {modernMinorBranch}=await load('backend/src/time/modernMinor.js');
const {analyzeChartRequest}=await load('backend/src/interpretation/analyze.js');
const archive=join(root,'docs/knowledge/research/fortune/modern-decadal-stem');
const retained=JSON.parse(readFileSync(join(archive,'source-proof.json'),'utf8'));
const proofs=['src/astro/palace.ts','src/astro/astro.ts','src/data/constants.ts','src/utils/index.ts'].map(path=>{
 const bytes=readFileSync(join(archive,'raw',path)),sha256=createHash('sha256').update(bytes).digest('hex');
 const manifest=retained.files.find(f=>f.path===path);assert.ok(manifest);assert.equal(sha256,manifest.sha256);
 return {archive:'modern-decadal-stem',path,bytes:bytes.length,sha256,retainedPinManifestMatch:true};
});
const constants=readFileSync(join(archive,'raw/src/data/constants.ts'),'utf8');
const utils=readFileSync(join(archive,'raw/src/utils/index.ts'),'utf8');
const stems=[...constants.match(/export const HEAVENLY_STEMS = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const branches=[...constants.match(/export const EARTHLY_BRANCHES = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const tiger=Object.fromEntries([...constants.match(/export const TIGER_RULE = \{([\s\S]*?)\}/)[1].matchAll(/(\w+): '(\w+)'/g)].map(m=>[m[1],m[2]]));
const agePart=utils.slice(utils.indexOf('export const getAgeIndex'),utils.indexOf('return ageIdx;',utils.indexOf('export const getAgeIndex')));
const anchors=new Map();for(const match of agePart.matchAll(/\[([^\]]+)\]\.includes\(earthlyBranch\)\) \{\s*ageIdx = (?:fixIndex\()?fixEarthlyBranchIndex\('([^']+)'\)/g)){
 for(const branch of [...match[1].matchAll(/'([^']+)'/g)].map(m=>m[1]))anchors.set(branch,branches.indexOf(match[2]+'Earthly'));
}assert.equal(anchors.size,12);
const wrap=(x,n)=>((x%n)+n)%n;
const names=['Giáp','Ất','Bính','Đinh','Mậu','Kỷ','Canh','Tân','Nhâm','Quý'];
const branchNames=['Tí','Sửu','Dần','Mão','Thìn','Tị','Ngọ','Mùi','Thân','Dậu','Tuất','Hợi'];
// Independently invert the retained B3 year-code tables, without invoking its
// private decoder, Julian-day routine, or solarToLunar as the inverse oracle.
const lunarSource=readFileSync(join(root,'backend/src/engine/lunar.js'),'utf8');
const yearTables=Object.fromEntries([20,21].map(century=>[century,[...lunarSource.match(new RegExp(`const TK${century}=\\[([^\\]]+)\\]`))[1].matchAll(/0x[\da-f]+/g)].map(m=>Number(m[0]))]));
function inverseLunar(lunar){
 const year=lunar.lunarYear,code=yearTables[Math.floor(year/100)+1][year%100],leapMonth=code&15;
 const rows=[];for(let month=1;month<=12;month++){
  rows.push({month,leap:false,length:29+((code>>(16-month))&1)});
  if(month===leapMonth)rows.push({month,leap:true,length:29+((code>>16)&1)});
 }
 const selected=rows.findIndex(row=>row.month===lunar.lunarMonth&&row.leap===lunar.isLeapMonth);assert.ok(selected>=0);
 assert.ok(lunar.lunarDay>=1&&lunar.lunarDay<=rows[selected].length);
 const offset=(code>>17)+rows.slice(0,selected).reduce((sum,row)=>sum+row.length,0)+lunar.lunarDay-1;
 const date=new Date(Date.UTC(year,0,1)+offset*86400000);
 return {day:date.getUTCDate(),month:date.getUTCMonth()+1,year:date.getUTCFullYear()};
}
const start=s=>stems.indexOf(tiger[stems[s]]);
const full120=[];for(let yearStem=0;yearStem<10;yearStem++)for(let branchId=1;branchId<=12;branchId++){
 const idx=wrap(branchId-3,12),stemIndex=wrap(start(yearStem)+idx,10);
 full120.push({yearStemIndex:yearStem,branchId,palaceIndex:idx,stemIndex,stem:names[stemIndex]});
}
const pure=[];for(let birth=0;birth<12;birth++)for(const gender of [1,-1]){
 const ages=Array.from({length:12},()=>[]);for(let i=0;i<12;i++){const index=wrap(anchors.get(branches[birth])-2+(gender===1?i:-i),12);for(let j=0;j<10;j++)ages[index].push(12*j+i+1);}
 for(let age=1;age<=120;age++){
  const target=ages.findIndex(a=>a.includes(age)),branchId=wrap(target+2,12)+1;
  assert.equal(modernMinorBranch({birthYearBranch:branchNames[birth],gender,nominalAge:age}),branchNames[branchId-1]);
  pure.push({birthYearBranchId:birth+1,gender,nominalAge:age,branchId});
 }
}
const inputs=[];for(let year=1984;year<=1996;year++)for(const month of [1,6])for(const gender of [1,-1])inputs.push({day:1,month,year,hour:(year%12)*2,gender});
for(const [day,month,year] of [[21,1,2023],[22,1,2023],[22,3,2023],[6,4,2023]])for(const gender of [1,-1])inputs.push({day,month,year,hour:0,gender});
const fixtures=[],differentMajor=[],solarYearDifference=[];let reachabilityRequests=0;
for(const [n,input] of inputs.entries()){
 assert.equal(validateChartInput(input).ok,true);const lunar=solarToLunar(input.day,input.month,input.year);
 const inverseSolar=inverseLunar(lunar);assert.deepEqual(inverseSolar,{day:input.day,month:input.month,year:input.year});
 const chart=normalizeChart({lunarInfo:lunar,input:{},tuviInfo:calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(input.hour),input.gender,lunar.isLeapMonth)});assert.equal(chart.ok,true);
 const soulIndex=wrap(chart.menhPalaceId-3,12),soulStemIndex=wrap(start(lunar.canIndex)+soulIndex,10);
 const natalPalaces=Array.from({length:12},(_,index)=>({index,branchId:wrap(index+2,12)+1,stemIndex:wrap(soulStemIndex-soulIndex+index,10)}));
 for(const p of natalPalaces)assert.equal(p.stemIndex,full120.find(f=>f.yearStemIndex===lunar.canIndex&&f.branchId===p.branchId).stemIndex);
 const ageCases=[];
 for(let nominalAge=1;nominalAge<=120;nominalAge++){
  const branchId=pure.find(p=>p.birthYearBranchId===lunar.chiIndex&&p.gender===input.gender&&p.nominalAge===nominalAge).branchId;
  const p=natalPalaces.find(p=>p.branchId===branchId),mapped=chart.palaces.find(p=>p.branchId===branchId);assert.ok(mapped);
  const ageCase={nominalAge,branchId,branch:branchNames[branchId-1],palaceIndex:p.index,stemIndex:p.stemIndex,stem:names[p.stemIndex],palaceId:mapped.id};
  const decade=Math.floor((nominalAge-chart.cuc.number)/10);
  if(decade>=0&&decade<12){const majorDir=(input.gender===1)===((lunar.chiIndex-1)%2===0)?1:-1,majorIndex=wrap(soulIndex+majorDir*decade,12),majorStem=wrap(start(lunar.canIndex)+majorIndex,10);
   if(majorStem!==p.stemIndex&&differentMajor.length<24)differentMajor.push({fixtureId:`MINOR-F${String(n+1).padStart(2,'0')}`,nominalAge,minorBranchId:branchId,minorStemIndex:p.stemIndex,majorBranchId:wrap(majorIndex+2,12)+1,majorStemIndex:majorStem});
  }
  const solarWrong=wrap(start(wrap(input.year-4,10))+p.index,10);if(solarWrong!==p.stemIndex&&solarYearDifference.length<12)solarYearDifference.push({fixtureId:`MINOR-F${String(n+1).padStart(2,'0')}`,nominalAge,expected:p.stemIndex,incorrectSolarYearStem:solarWrong});
  if([1,12,120].includes(nominalAge)){
   const response=analyzeChartRequest({...input,minorPeriod:{profile:'iztro-pinned-age1-sex-triad',nominalAge}});assert.equal(response.status,200);
   const actual=response.body.time.capabilities.tieu_han_modern;assert.equal(actual.branch,ageCase.branch);assert.equal(actual.palaceId,ageCase.palaceId);assert.equal(actual.publicFortune,false);assert.equal(actual.interpretation,null);reachabilityRequests++;
  }
  ageCases.push(ageCase);
 }
 fixtures.push({id:`MINOR-F${String(n+1).padStart(2,'0')}`,input,validatedSolarInput:true,serverLunar:lunar,independentTableInverse:{solar:inverseSolar,roundtripMatches:true,evidenceClass:'engineering regression fixture; same B3 year-code tables, independent inverse implementation, not independent astronomical golden'},menhPalaceId:chart.menhPalaceId,cuc:chart.cuc.number,sourceSoulIndex:soulIndex,natalPalaces,ageCases});
}
const coverage={validCharts:fixtures.length,ageCases:fixtures.length*120,pureBranchSexAgeComparisons:pure.length,fullStemBranchMapping:full120.length,reachabilityRequests,yearStemIndexes:[...new Set(fixtures.map(f=>f.serverLunar.canIndex))].sort((a,b)=>a-b),yearBranchIds:[...new Set(fixtures.map(f=>f.serverLunar.chiIndex))].sort((a,b)=>a-b),sexes:[-1,1],leapCharts:fixtures.filter(f=>f.serverLunar.isLeapMonth).length,differentMajorWitnesses:differentMajor.length,solarYearWitnesses:solarYearDifference.length};
assert.equal(coverage.yearStemIndexes.length,10);assert.equal(coverage.yearBranchIds.length,12);assert.ok(coverage.leapCharts>0);assert.ok(differentMajor.length);assert.ok(solarYearDifference.length);
for(const gender of [-1,1]){for(let index=0;index<10;index++)assert.ok(fixtures.some(f=>f.input.gender===gender&&f.serverLunar.canIndex===index));for(let branch=1;branch<=12;branch++)assert.ok(fixtures.some(f=>f.input.gender===gender&&f.serverLunar.chiIndex===branch));}
coverage.allYearStemsBothSexes=true;coverage.allYearBranchesBothSexes=true;
coverage.validLunarInverseRoundtrips=fixtures.length;
const result={status:'INDEPENDENT_SOURCE_COMPARATIVE_FIXTURES_NOT_APPROVAL',sourcePin:retained.pin,method:'Parse retained TIGER_RULE and getAgeIndex; replay source finite age arrays; calculate natal palace stems by full soul-subtraction expression, then compare separate closed 120-map. B3 natal pipeline supplies valid chart metadata only. Existing runtime verifies approved branch reachability after expected construction.',evidenceClasses:{stems:'source-comparative fixture',calendarAndApi:'engineering regression fixture',expertVerifiedGoldens:false,syntheticMutations:false},nonEquivalence:['No execution of upstream iztro/lunar-lite','No independent calendar golden or upstream calendar equivalence','No age derivation','No classical authentication, interpretation, predictions, approval, release or technical reviewer PASS'],sourceProofs:proofs,coverage,full120,differentMajor,solarYearDifference,fixtures};
writeFileSync(join(out,'fixtures.json'),JSON.stringify(result,null,2)+'\n');writeFileSync(join(out,'summary.json'),JSON.stringify({status:result.status,sourcePin:retained.pin,coverage,sourceProofs:proofs},null,2)+'\n');console.log(JSON.stringify(coverage,null,2));
