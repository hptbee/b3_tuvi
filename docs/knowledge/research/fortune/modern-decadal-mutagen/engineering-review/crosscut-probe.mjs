import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import vm from 'node:vm';
const root='/workspace/b3_tuvi/';
const source=readFileSync(root+'frontend/src/components/StructuredAnalysis.jsx','utf8');
const scope=vm.createContext({});
vm.runInContext(source.slice(source.indexOf('const PALACE_LABELS'),source.indexOf('function Detail('))+'\nglobalThis.validators={validAnalysisBody,validMajorResponse,validMinorResponse};',scope);
const v=scope.validators;
const temp=mkdtempSync('/tmp/t032-crosscut-');process.env.SQLITE_PATH=temp+'/db.sqlite';
const {createApp}=await import(root+'backend/src/app.js');
const sqlite=await import(root+'backend/src/db/sqlite.js');const repo=await import(root+'backend/src/db/repositories.js');
const {default:map}=await import(root+'backend/src/data/tuHoaMap.json',{with:{type:'json'}});
const {verifyModernMajorMutagenBinding:binding}=await import(root+'backend/src/knowledge/modernMajorMutagenBinding.js');
sqlite.initDatabase();const before=repo.countHoroscopes();
const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});
const base='http://127.0.0.1:'+server.address().port+'/api/interpretations/';
const profile='iztro-pinned-menh-cuc-decadal-mutagen';
const fixtures=JSON.parse(readFileSync(root+'docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json','utf8')).cases;
const ids=['hoa_loc','hoa_quyen','hoa_khoa','hoa_ky'];const labels=['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'];
let requests=0,validated=0,associations=0,shared=0,brightness=0,closed=0,mutations=0;const stems=new Set(),targets=new Set();
async function post(input,option=null,extra={},endpoint='analyze') {requests++;const r=await fetch(base+endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...input,fullName:'PRIVATE-CROSSCUT-T032',...(option?{majorPeriod:option}:{}),...extra})});assert.equal(r.status,200);assert.match(r.headers.get('cache-control'),/no-store/);const body=await r.json();assert.equal(JSON.stringify(body).includes('PRIVATE-CROSSCUT-T032'),false);return body;}
function validate(body,option=null,minor=null){assert.equal(v.validAnalysisBody(body),true);assert.equal(v.validMajorResponse(body,option),true);assert.equal(v.validMinorResponse(body,minor),true);validated++;}
function cap(body){return body.time.capabilities.dai_han_modern;}
function withheld(c){assert.equal(c.publicFortune,false);assert.equal(c.interpretation,null);assert.equal(c.interpretationStatus,'blocked');}
try {
 assert.equal(binding().ok,true);
 for(const f of fixtures){
  for(const p of f.periods){
   for(const age of [p.nominalAge,p.nominalAge+9]){
    const option={profile,nominalAge:age};const body=await post(f.input,option);validate(body,option);const c=cap(body);withheld(c);assert.equal(c.status,'branch_placed');assert.equal(c.mutagens.length,4);assert.equal(c.decadeIndex,p.decadeIndex);assert.equal(c.decadeStartAge,p.nominalAge);assert.equal(c.decadeEndAge,p.nominalAge+9);stems.add(c.heavenlyStem);
    for(const [i,row] of c.mutagens.entries()) {const e=p.expectedAssociations[i];assert.deepEqual({...row,functionLabel:undefined},{mutagenId:ids[i],mutagenLabel:labels[i],sourceStarId:e.b3StarId,sourceStarName:e.sourceStarName,palaceId:e.palaceId,functionId:e.functionId,functionLabel:undefined});targets.add(row.sourceStarId);associations++;const found=body.statements.filter(s=>!s.thanOverlay).flatMap(s=>s.stars).find(s=>s.starId===row.sourceStarId);if(/ \([MVĐBH]\)$/.test(found.displayName))brightness++;}
    if(new Set(c.mutagens.map(x=>x.palaceId)).size<4)shared++;
   }
  }
  for(const age of [1,125]) {const option={profile,nominalAge:age};const body=await post(f.input,option);validate(body,option);withheld(cap(body));if(cap(body).status==='not_applied'){closed++;assert.deepEqual(cap(body).mutagens,[]);assert.equal(cap(body).heavenlyStem,null);assert.equal(cap(body).branch,null);}}
 }
 const f=fixtures[0],option={profile,nominalAge:f.periods[2].nominalAge};const good=await post(f.input,option);validate(good,option);
 const minor={profile:'iztro-pinned-age1-sex-triad',nominalAge:14};const combined=await post(f.input,option,{minorPeriod:minor,viewYearBranch:'Ngọ'});validate(combined,option,minor);assert.deepEqual(cap(combined),cap(good));
 const ask=await post(f.input,option,{questionId:'why_menh'},'ask');assert.equal(ask.prose,null);
 const oldOptions=[null,{profile:'iztro-pinned-menh-cuc-decadal',nominalAge:option.nominalAge},{profile:'iztro-pinned-menh-cuc-decadal-stem',nominalAge:option.nominalAge}];const old=[];
 for(const x of oldOptions){const body=await post(f.input,x);validate(body,x);old.push(body);}
 // Synthetic process-local tampering, not domain fixtures. Every table cell fails the entire new profile even after evidence cache warmed.
 for(const row of Object.values(map))for(let i=0;i<4;i++){const saved=row[i];try {row[i]='UNAPPROVED';assert.equal(binding().ok,false);const body=await post(f.input,option);validate(body,option);const c=cap(body);withheld(c);assert.equal(c.reason,'modern_mutagen_profile_not_approved');assert.equal(c.branch,null);assert.equal(c.heavenlyStem,null);assert.deepEqual(c.mutagens,[]);mutations++;}finally{row[i]=saved;}}
 const original=map['0'][0];try{map['0'][0]='UNAPPROVED';for(const [i,x]of oldOptions.entries()){const body=await post(f.input,x);validate(body,x);assert.deepEqual(body,old[i]);}}finally{map['0'][0]=original;}
 const restored=await post(f.input,option);validate(restored,option);assert.deepEqual(restored,good);assert.equal(binding().ok,true);assert.equal(repo.countHoroscopes(),before);assert.equal(stems.size,10);assert.equal(targets.size,15);assert.equal(shared,202);assert.equal(associations,2304);assert.equal(mutations,40);
 const proof={requests,validatedFrontendResponses:validated,fixtureCharts:24,sourceComparativePeriods:288,periodStartEndQueries:576,orderedAssociations:associations,sharedPalaceStartEndResponses:shared,actualSuffixedSourceOccurrences:brightness,closedAgeResponses:closed,all40TableCellsTamperClosed:mutations,selectedStems:stems.size,canonicalTargets:targets.size,legacyProfilesUnchangedWhileNewGateDenied:true,restoredProfileExact:true,combinedMinorYearIndependent:true,askProse:null,noStore:true,databaseWrites:0,privateNameWithheld:true,browserLaunched:false};writeFileSync('/tmp/t032/crosscut-proof.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify(proof,null,2));
}finally{await new Promise(resolve=>server.close(resolve));sqlite.getDb().close();rmSync(temp,{recursive:true,force:true});}
