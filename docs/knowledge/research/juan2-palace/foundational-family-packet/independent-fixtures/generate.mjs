import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const out=dirname(fileURLToPath(import.meta.url));
let root=out;while(!existsSync(join(root,'backend/src/engine/tuviRules.mjs'))){const parent=dirname(root);assert.notEqual(parent,root);root=parent;}
const load=p=>import(pathToFileURL(join(root,p)).href),read=p=>JSON.parse(readFileSync(join(root,p),'utf8'));
const {validateChartInput}=await load('backend/src/engine/chartInput.js');
const {solarToLunar}=await load('backend/src/engine/lunar.js');
const {hourBranchIndex}=await load('backend/src/engine/hourBranch.js');
const {calculateTuVi}=await load('backend/src/engine/tuviRules.mjs');
const {normalizeChart}=await load('backend/src/engine/normalizeChart.js');
const inputs=[];for(let year=1984;year<=1995;year++)for(let month=1;month<=12;month++)for(const hour of [0,6,12,18])for(const gender of [-1,1])inputs.push({day:15,month,year,hour,gender});assert.equal(inputs.length,1152);
const hash=x=>createHash('sha256').update(x).digest('hex');
assert.equal(hash(JSON.stringify(inputs)),'832ede7ac4ad680293365b09c2f4f2861a042802d6014d0eb2ad429bdbfdb630');
const lunarSource=readFileSync(join(root,'backend/src/engine/lunar.js'),'utf8');
// Independent inverse implementation, sharing year-code tables only. This is
// round-trip consistency evidence, not an independent astronomical calendar.
const tables=Object.fromEntries([20,21].map(c=>[c,[...lunarSource.match(new RegExp(`const TK${c}=\\[([^\\]]+)\\]`))[1].matchAll(/0x[\da-f]+/g)].map(m=>Number(m[0]))]));
function inverse(lunar){
 const y=lunar.lunarYear,code=tables[Math.floor(y/100)+1][y%100],rows=[];
 for(let m=1;m<=12;m++){rows.push({m,leap:false,n:29+((code>>(16-m))&1)});if(m===(code&15))rows.push({m,leap:true,n:29+((code>>16)&1)});}
 const i=rows.findIndex(r=>r.m===lunar.lunarMonth&&r.leap===lunar.isLeapMonth);assert(i>=0);assert(lunar.lunarDay>=1&&lunar.lunarDay<=rows[i].n);
 const days=(code>>17)+rows.slice(0,i).reduce((n,r)=>n+r.n,0)+lunar.lunarDay-1,d=new Date(Date.UTC(y,0,1)+days*86400000);
 return {day:d.getUTCDate(),month:d.getUTCMonth()+1,year:d.getUTCFullYear()};
}
const charts=inputs.map(input=>{assert.equal(validateChartInput(input).ok,true);const lunar=solarToLunar(input.day,input.month,input.year);assert.deepEqual(inverse(lunar),{day:input.day,month:input.month,year:input.year});const tuviInfo=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(input.hour),input.gender,lunar.isLeapMonth);const chart=normalizeChart({tuviInfo,lunarInfo:lunar,input:{}});assert.equal(chart.ok,true);assert.equal(chart.palaces.length,12);return {input,lunar,chart};});
const host=(c,p)=>c.chart.palaces.find(x=>x.functionId===p),has=(c,p,s)=>host(c,p).stars.some(x=>x.starId===s);
const adverse=['kinh_duong','da_la','hoa_tinh','linh_tinh'];
const defs=[['huynh_de','tu_vi','Tử Vi'],['phu_the','thien_luong','Thiên Lương'],['phu_the','thien_tuong','Thiên Tướng']];
const fixtures={},cells={},candidateSets={};
for(const [target,star,name] of defs){
 const claimId=`interp-quanshu-${target.replaceAll('_','-')}-${star.replaceAll('_','-')}-host`,key=target+'/'+star,chosen=new Map(),report=[];
 const positive=c=>has(c,target,star),majors=c=>host(c,target).stars.filter(s=>s.list==='major'),adv=c=>adverse.some(s=>has(c,target,s));
 const starHost=c=>{const rows=c.chart.palaces.filter(p=>p.stars.some(s=>s.starId===star));assert.equal(rows.length,1);return rows[0];};
 const indexes=charts.flatMap((c,i)=>positive(c)?[i]:[]);candidateSets[key]=indexes;
 for(const gender of [-1,1]){
  const pool=charts.filter(c=>c.input.gender===gender);
  const modes=[['positive',positive],['positive_standalone',c=>positive(c)&&majors(c).length===1],['positive_cohost',c=>positive(c)&&majors(c).length>1],['positive_four_adverse_present',c=>positive(c)&&adv(c)],['positive_four_adverse_absent',c=>positive(c)&&!adv(c)],['negative_wrong_host',c=>!positive(c)&&Math.abs(Number(starHost(c).id)-Number(host(c,target).id))!==6],['negative_opposite_only',c=>!positive(c)&&Math.abs(Number(starHost(c).id)-Number(host(c,target).id))===6],['negative_missing_target_star',c=>!positive(c)],['negative_globally_missing_star',c=>c.chart.palaces.every(p=>p.stars.every(s=>s.starId!==star))]];
  for(const branch of [...new Set(pool.filter(positive).map(c=>host(c,target).branchName))])modes.push(['positive_branch_'+branch,c=>positive(c)&&host(c,target).branchName===branch]);
  for(const combination of [...new Set(pool.filter(positive).map(c=>majors(c).map(s=>s.starId).sort().join('+')))])modes.push(['positive_major_configuration_'+combination,c=>positive(c)&&majors(c).map(s=>s.starId).sort().join('+')===combination]);
  for(const [label,predicate] of modes){const matches=pool.filter(predicate);report.push({gender,label,reachableInFrozenGrid:matches.length});if(matches[0]){const c=matches[0],k=JSON.stringify(c.input),entry=chosen.get(k)||{c,labels:[]};entry.labels.push(label);chosen.set(k,entry);}}
 }
 const identity=p=>({id:p.id,functionId:p.functionId,branchName:p.branchName});
 fixtures[claimId]=[...chosen.values()].map(({c,labels},i)=>({id:claimId+'-independent-'+String(i+1).padStart(2,'0'),input:c.input,lunar:c.lunar,host:identity(host(c,target)),starLocation:identity(starHost(c)),expected:positive(c),condition:{op:'star_present',target,star:name},labels,majorStars:majors(c).map(s=>s.starId),adverseStars:host(c,target).stars.filter(s=>adverse.includes(s.starId)).map(s=>s.starId),oracle:'Canonical normalized host starId membership; condition evaluator never imported'}));cells[claimId]=report;
 assert(fixtures[claimId].some(f=>f.expected));assert(fixtures[claimId].some(f=>!f.expected));
}
// Baseline reconstructed directly from original seven predicates, not runtime
// evaluator output or a wider catalog that may be implemented concurrently.
const both=(c,p,a,b)=>has(c,p,a)&&has(c,p,b);
const baselineDefs=[['menh',c=>both(c,'menh','tu_vi','thien_phu')&&['Dần','Thân'].includes(host(c,'menh').branchName)&&c.lunar.canName==='Giáp'],['tai_bach',c=>has(c,'tai_bach','tu_vi')&&adverse.some(s=>has(c,'tai_bach',s))],['phuc_duc',c=>both(c,'phuc_duc','thien_dong','thien_luong')],['quan_loc',c=>both(c,'quan_loc','thien_co','cu_mon')&&host(c,'quan_loc').branchName==='Dậu'],['phuc_duc',c=>both(c,'phuc_duc','thien_co','cu_mon')],['tai_bach',c=>both(c,'tai_bach','tu_vi','pha_quan')],['quan_loc',c=>both(c,'quan_loc','thien_co','cu_mon')&&host(c,'quan_loc').branchName==='Mão']];
const baselineSets=baselineDefs.map(([,p])=>charts.flatMap((c,i)=>p(c)?[i]:[])),union=sets=>[...new Set(sets.flat())].sort((a,b)=>a-b),baseline=union(baselineSets);assert.equal(baseline.length,92);
const initial=['thien_di/thien_luong','no_boc/thien_luong','thien_di/cu_mon','dien_trach/thien_co'];
for(const key of initial){const [p,s]=key.split('/');candidateSets[key]=charts.flatMap((c,i)=>has(c,p,s)?[i]:[]);}
const intersection=(a,b)=>a.filter(i=>b.includes(i)).length;
let cumulative=union([baseline,...initial.map(k=>candidateSets[k])]);assert.equal(cumulative.length,419);
const steps=defs.map(([p,s])=>{const key=p+'/'+s,set=candidateSets[key],before=cumulative.length;const overlap=intersection(set,cumulative);cumulative=union([cumulative,set]);return {key,count:set.length,overlapPriorCumulative:overlap,marginal:cumulative.length-before,cumulative:cumulative.length,percent:100*cumulative.length/1152};});assert.equal(cumulative.length,647);
const palaces=charts[0].chart.palaces.map(p=>p.functionId),initialSets=initial.map(k=>candidateSets[k]);
const perPalace=Object.fromEntries(palaces.map(p=>{const base=baselineSets.filter((s,i)=>baselineDefs[i][0]===p),earlier=initial.filter(k=>k.startsWith(p+'/')).map(k=>candidateSets[k]),newer=defs.filter(([target])=>target===p).map(([target,s])=>candidateSets[target+'/'+s]);return [p,{originalSeven:union(base).length,conditionalT037:union([...base,...earlier]).length,conditionalT038:union([...base,...earlier,...newer]).length}];}));
const coverage={classification:'Conditional unapproved predicate reachability; no source judgment; original seven baseline independently reconstructed',gridSha256:hash(JSON.stringify(inputs)),total:1152,originalSevenApproved:92,conditionalT037:419,conditionalT038:647,steps,perPalace,overlapMatrix:Object.fromEntries(Object.keys(candidateSets).map(a=>[a,Object.fromEntries(Object.keys(candidateSets).map(b=>[b,intersection(candidateSets[a],candidateSets[b])]))])),conditionalT038ClaimMatchHistogram:Object.fromEntries(Array.from({length:15},(_,n)=>[n,charts.filter((c,i)=>[...baselineSets,...Object.values(candidateSets)].filter(s=>s.includes(i)).length===n).length])),sourceApproval:false,publicRelease:false};
const payload={classification:'Valid real fixed-grid solar chart engineering witnesses only; no source approval',gridSha256:coverage.gridSha256,lunarValidation:'Independent inverse implementation sharing B3 year-code tables; all 1152 round trips pass, not independent astronomy',limitations:['Placement uses production star engine and normalizer; membership oracle independent of condition evaluator only.','Four-adverse absent means only Kình Dương/Đà La/Hỏa Tinh/Linh Tinh absent, not six-adverse absence or favorable status.','Globally missing major star is unreachable on valid charts; no synthetic chart is mislabeled real.','Single star_present predicate only; no claim of independent full AND evaluation.','Original seven approved coverage is historical baseline; later source approvals do not change this measurement definition.'],fixtures,cells};
const encoded=JSON.stringify(payload,null,2)+'\n',coverageEncoded=JSON.stringify(coverage,null,2)+'\n';
if(process.argv.includes('--check')){assert.equal(readFileSync(join(out,'fixtures.json'),'utf8'),encoded,'Frozen fixture bytes differ from independent regeneration');assert.equal(readFileSync(join(out,'coverage.json'),'utf8'),coverageEncoded,'Frozen coverage bytes differ from independent regeneration');}
else{writeFileSync(join(out,'fixtures.json'),encoded);writeFileSync(join(out,'coverage.json'),coverageEncoded);}
console.log(JSON.stringify({status:'PASS_ENGINEERING_ONLY',fixtureSha256:hash(encoded),fixtures:Object.fromEntries(Object.entries(fixtures).map(([k,v])=>[k,{total:v.length,positive:v.filter(f=>f.expected).length,negative:v.filter(f=>!f.expected).length}])),coverage:{originalSeven:92,conditionalT037:419,conditionalT038:647},unreachableCells:Object.fromEntries(Object.entries(cells).map(([k,v])=>[k,v.filter(r=>!r.reachableInFrozenGrid)]))},null,2));
