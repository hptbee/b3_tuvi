import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { solarToLunar } from '/workspace/b3_tuvi/backend/src/engine/lunar.js';
import { hourBranchIndex } from '/workspace/b3_tuvi/backend/src/engine/hourBranch.js';
import { calculateTuVi } from '/workspace/b3_tuvi/backend/src/engine/tuviRules.mjs';
import { normalizeChart } from '/workspace/b3_tuvi/backend/src/engine/normalizeChart.js';
import { evaluateCondition } from '/workspace/b3_tuvi/backend/src/engine/conditionEval.js';
const source=readFileSync('/tmp/tuvi-juan-pinned/juan2.txt','utf8');
const lines=source.split('\n');
const section=lines.slice(lines.findIndex(x=>x.startsWith('財帛宮')),lines.findIndex(x=>x.startsWith('疾厄宮'))).join('\n');
const tuvi=lines.slice(633,635).join('\n'); const pha=lines.slice(650,652).join('\n');
if(!tuvi.includes('破軍同先難後易')||!pha.includes('紫微同先去後生'))throw Error('source bounds');
const span=tuvi+'\n'+pha;
const brightness=lines.slice(125,134).join('\n')+'\n'+lines.slice(365,375).join('\n');
for(const [f,v]of Object.entries({'source-span.txt':span,'tai-full-section.txt':section,'branch-brightness-context.txt':brightness}))writeFileSync('/tmp/t028/'+f,v);
const ast={op:'same_palace',target:'tai_bach',stars:['Tử Vi','Phá Quân']};
const cats=new Map();let searched=0;
const bad=['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh'];
function names(p){return p.stars.map(s=>s.canonicalName)}
outer:for(let year=1980;year<=2000;year++)for(let month=1;month<=12;month++)for(const day of[1,8,15,22,28])for(let hour=0;hour<24;hour+=2){
searched++;const input={day,month,year,hour,gender:1};const lunar=solarToLunar(day,month,year);const info=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(hour),1,lunar.isLeapMonth);const chart=normalizeChart({tuviInfo:info,lunarInfo:lunar,input:{}});const host=chart.palaces.find(p=>p.functionId==='tai_bach');const stars=names(host);const direct=ast.stars.every(x=>stars.includes(x));let category=null;
if(direct)category='positive_'+host.branchName+'_'+(bad.some(x=>stars.includes(x))?'adverse':'no_four_adverse');
else if(stars.includes('Tử Vi'))category='negative_missing_pha';
else if(stars.includes('Phá Quân'))category='negative_missing_tuvi';
else if(chart.palaces.some(p=>p.functionId==='menh'&&ast.stars.every(x=>names(p).includes(x))))category='negative_wrong_host_menh';
else if(chart.palaces.some(p=>p.functionId==='quan_loc'&&ast.stars.every(x=>names(p).includes(x))))category='negative_wrong_host_quan';
if(category&&!cats.has(category)){
 const before=JSON.stringify(chart);const trace=evaluateCondition(ast,chart,{schoolId:chart.schoolId,profile:'quanshu-iztro-2f00e2ab'});if(trace.status!==(direct?'satisfied':'not_satisfied')||JSON.stringify(chart)!==before)throw Error('AST/replay');
 cats.set(category,{id:category,input,expected:direct,lunar:chart.lunar,cuc:chart.cuc,menhPalaceId:chart.menhPalaceId,host:{id:host.id,functionId:host.functionId,branchName:host.branchName,stars:host.stars.map(x=>({canonicalName:x.canonicalName,brightness:x.brightness}))},pairPalaces:chart.palaces.filter(p=>ast.stars.every(x=>names(p).includes(x))).map(p=>({id:p.id,functionId:p.functionId,branchName:p.branchName})),trace});
}
if(cats.size===8)break outer;
}
const sha=v=>createHash('sha256').update(v).digest('hex');
const out={status:'UNREVIEWED_RESEARCH_CANDIDATE',sourceId:'ziwei-quanshu-iztro-transcription',sourcePin:'2f00e2ab0c80b1632e55bc362f2ae26e121245cb',sourcePath:'docs/zh_TW/learn/ancientBook-2.html',rawHtmlSha256:sha(readFileSync('/tmp/tuvi-juan-pinned/juan2.html')),locator:'juan2/財帛宮/紫微-and-破軍',spanSha256:sha(span),contextSha256:sha(section),brightnessContextSha256:sha(brightness),conditionTree:ast,searched,cases:[...cats.values()],expertVerified:false,bookVerified:false,publicRelease:false};
writeFileSync('/tmp/t028/candidate.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({searched,categories:[...cats.keys()],fixtures:[...cats.values()].map(x=>({id:x.id,input:x.input,stars:x.host.stars}))},null,2));
