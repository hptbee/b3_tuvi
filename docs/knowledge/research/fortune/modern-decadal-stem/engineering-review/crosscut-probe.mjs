import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const root='/workspace/b3_tuvi/';
const packet=root+'docs/knowledge/research/fortune/modern-decadal-stem/';
const manifest=JSON.parse(readFileSync(packet+'manifest.json','utf8')).files;
for(const [name,hash] of Object.entries(manifest)) assert.equal(createHash('sha256').update(readFileSync(packet+name)).digest('hex'),hash,name);
const binding=await import(root+'backend/src/knowledge/modernMajorStemBinding.js');
assert.deepEqual(binding.verifyModernMajorStemBinding(),{ok:true,reason:null});
const source=readFileSync(root+'frontend/src/components/StructuredAnalysis.jsx','utf8');
const scope={};vm.createContext(scope);vm.runInContext(source.slice(source.indexOf('const PALACE_LABELS'),source.indexOf('function Detail('))+'\nglobalThis.v={validAnalysisBody,validMajorResponse,validMinorResponse};',scope);
const temp=mkdtempSync('/tmp/t030-crosscut-');process.env.SQLITE_PATH=temp+'/db.sqlite';
const {createApp}=await import(root+'backend/src/app.js');
const db=await import(root+'backend/src/db/sqlite.js');const repo=await import(root+'backend/src/db/repositories.js');db.initDatabase();const before=repo.countHoroscopes();
const logs=[],log=console.log;console.log=(...x)=>logs.push(x.join(' '));
const server=createApp().listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
const fixtures=JSON.parse(readFileSync(packet+'fixtures.json','utf8')).fixtures;
const old='iztro-pinned-menh-cuc-decadal',stem='iztro-pinned-menh-cuc-decadal-stem',minorProfile='iztro-pinned-age1-sex-triad';
let requests=0,comparisons=0,clientAccepted=0,askChecks=0;
async function post(input,ep='analyze') {requests++;const res=await fetch(`http://127.0.0.1:${server.address().port}/api/interpretations/${ep}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...input,fullName:'PRIVATE-CROSSCUT-ONLY'})});assert.equal(res.status,200);assert.match(res.headers.get('cache-control'),/no-store/);const body=await res.json();assert.ok(!JSON.stringify(body).includes('PRIVATE-CROSSCUT-ONLY'));return body;}
function validate(body,opt,minor){assert.equal(scope.v.validAnalysisBody(body),true);assert.equal(scope.v.validMajorResponse(body,opt),true);assert.equal(scope.v.validMinorResponse(body,minor),true);clientAccepted++;}
try {
for(const f of fixtures){
 for(const nominalAge of [1,f.periods[0].startAge,f.periods[11].endAge,125]){
  const minor={profile:minorProfile,nominalAge:14};
  const common={...f.input,minorPeriod:minor,viewYearBranch:'Dậu'};
  const oldOpt={profile:old,nominalAge},newOpt={profile:stem,nominalAge};
  const a=await post({...common,majorPeriod:oldOpt}),b=await post({...common,majorPeriod:newOpt});validate(a,oldOpt,minor);validate(b,newOpt,minor);
  const ca=structuredClone(a),cb=structuredClone(b),oldcap=ca.time.capabilities.dai_han_modern,newcap=cb.time.capabilities.dai_han_modern;
  assert.equal(Object.hasOwn(oldcap,'heavenlyStem'),false);assert.equal(Object.hasOwn(oldcap,'stemPlacement'),false);
  newcap.profile=oldcap.profile;newcap.calendarCompatibility=oldcap.calendarCompatibility;delete newcap.heavenlyStem;delete newcap.stemPlacement;
  assert.deepEqual(cb,ca);comparisons++;
  assert.equal(b.time.capabilities.tieu_han.status,'blocked');assert.equal(b.time.capabilities.luu_nien.status,'blocked');
  assert.equal(b.statements.some(s=>Object.hasOwn(s,'internalProse')),false);
 }
 const ask=await post({...f.input,majorPeriod:{profile:stem,nominalAge:14},minorPeriod:{profile:minorProfile,nominalAge:14},viewYearBranch:'Ngọ',questionId:'why_menh'},'ask');assert.equal(ask.prose,null);askChecks++;
}
assert.equal(repo.countHoroscopes(),before);assert.equal(logs.some(x=>x.includes('PRIVATE-CROSSCUT-ONLY')),false);
const result={manifestFilesVerified:Object.keys(manifest).length,bindingActualComparatorAccepted:true,requests,wholeResponseOldNewComparisons:comparisons,genuineValidatorAccepted:clientAccepted,askChecks,dbWrites:0,privateNameLeak:false,browserRun:false};writeFileSync('/tmp/t030/crosscut-proof.json',JSON.stringify(result,null,2)+'\n');log(result);
} finally {await new Promise(r=>server.close(r));db.getDb().close();console.log=log;rmSync(temp,{recursive:true,force:true});}
