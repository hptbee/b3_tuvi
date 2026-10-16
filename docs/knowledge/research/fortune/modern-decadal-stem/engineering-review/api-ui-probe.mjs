import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const root='/workspace/b3_tuvi/';
const source=readFileSync(root+'frontend/src/components/StructuredAnalysis.jsx','utf8');
const scope={};vm.createContext(scope);
vm.runInContext(source.slice(source.indexOf('const PALACE_LABELS'),source.indexOf('function Detail('))+'\nglobalThis.validators={validAnalysisBody,validMajorResponse,validMinorResponse};',scope);
const {validAnalysisBody,validMajorResponse,validMinorResponse}=scope.validators;
const temp=mkdtempSync('/tmp/t030-api-ui-');process.env.SQLITE_PATH=temp+'/review.sqlite';
const {createApp}=await import(root+'backend/src/app.js');
const db=await import(root+'backend/src/db/sqlite.js');const repo=await import(root+'backend/src/db/repositories.js');db.initDatabase();
const before=repo.countHoroscopes();const logs=[];const originalLog=console.log;console.log=(...args)=>logs.push(args.join(' '));
const server=createApp().listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve));
const fixtures=JSON.parse(readFileSync(root+'docs/knowledge/research/fortune/modern-decadal-stem/fixtures.json','utf8')).fixtures;
const newProfile='iztro-pinned-menh-cuc-decadal-stem',oldProfile='iztro-pinned-menh-cuc-decadal';
let requests=0,accepted=0,rejectedMutations=0;
const counts={};
async function post(body,endpoint='analyze'){
 requests++;const res=await fetch(`http://127.0.0.1:${server.address().port}/api/interpretations/${endpoint}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...body,fullName:'PRIVATE-REVIEW-ONLY'})});
 assert.match(res.headers.get('cache-control'),/no-store/);const json=await res.json();assert.ok(!JSON.stringify(json).includes('PRIVATE-REVIEW-ONLY'));return {status:res.status,json};
}
function clientCheck(json,option,minor=null){assert.equal(validAnalysisBody(json),true);assert.equal(validMajorResponse(json,option),true);assert.equal(validMinorResponse(json,minor),true);accepted++;}
try{
 for(const f of fixtures){
   for(const age of [1,f.periods[0].startAge,f.periods[11].endAge,125]){
    const option={profile:newProfile,nominalAge:age};const {status,json}=await post({...f.input,majorPeriod:option});assert.equal(status,200);clientCheck(json,option);
    const cap=json.time.capabilities.dai_han_modern;counts[cap.status]=(counts[cap.status]||0)+1;
    for(const patch of [{profile:oldProfile},{nominalAge:age+1},{heavenlyStem:'Kỉ'},{heavenlyStem:undefined},{stemPlacement:'bad'},{calendarCompatibility:'wrong'},{sourcePin:'other'},{publicFortune:true},{interpretation:'prediction'}]){
      const bad=structuredClone(json);Object.assign(bad.time.capabilities.dai_han_modern,patch);assert.equal(validMajorResponse(bad,option),false);rejectedMutations++;
    }
   }
 }
 const birth=fixtures[0].input;
 for(const profile of [oldProfile,newProfile]){
   const option={profile,nominalAge:14},minor={profile:'iztro-pinned-age1-sex-triad',nominalAge:14};
   const {status,json}=await post({...birth,majorPeriod:option,minorPeriod:minor,viewYearBranch:'Ngọ'});assert.equal(status,200);clientCheck(json,option,minor);
   assert.equal(json.time.capabilities.thien_duc.palaceMapping,'mapped');assert.equal(json.time.capabilities.tieu_han.status,'blocked');
   assert.equal(json.statements.some(s=>Object.hasOwn(s,'internalProse')),false);
   if(profile===oldProfile){assert.equal(Object.hasOwn(json.time.capabilities.dai_han_modern,'heavenlyStem'),false);const bad=structuredClone(json);bad.time.capabilities.dai_han_modern.stemPlacement='not_applied';assert.equal(validMajorResponse(bad,option),false);rejectedMutations++;}
   const ask=await post({...birth,majorPeriod:option,questionId:'why_menh'},'ask');assert.equal(ask.status,200);assert.equal(ask.json.prose,null);
 }
 const omitted=await post(birth);clientCheck(omitted.json,null);
 for(const majorPeriod of [{profile:newProfile,nominalAge:0},{profile:newProfile,nominalAge:126},{profile:newProfile,nominalAge:'14'},{profile:newProfile,nominalAge:14,heavenlyStem:'Giáp'},{profile:'forged',nominalAge:14},null]){
  const {status,json}=await post({...birth,majorPeriod});assert.equal(status,400);assert.equal(json.code,'invalid_major_period');
  const ask=await post({...birth,majorPeriod,questionId:'why_menh'},'ask');assert.equal(ask.status,400);assert.deepEqual(ask.json,{ok:false,error:'analysis_failed',prose:null});
 }
 const forged=await post({...birth,majorPeriod:{profile:newProfile,nominalAge:14},normalizedChart:{ok:true}});assert.equal(forged.status,400);assert.equal(forged.json.code,'client_chart_rejected');
 assert.equal(repo.countHoroscopes(),before);assert.ok(!logs.some(s=>s.includes('PRIVATE-REVIEW-ONLY')));
 const report={requests,realResponsesAcceptedByGenuineValidators:accepted,malformedResponseMutationsRejected:rejectedMutations,states:counts,dbCountUnchanged:true,noStore:true,nameNotEchoedOrLogged:true,browserRun:false};
 writeFileSync('/tmp/t030/api-ui-proof.json',JSON.stringify(report,null,2)+'\n');originalLog(report);
}finally{await new Promise(resolve=>server.close(resolve));db.getDb().close();console.log=originalLog;rmSync(temp,{recursive:true,force:true});}
