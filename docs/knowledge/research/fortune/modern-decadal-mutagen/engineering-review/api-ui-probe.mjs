import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,rmSync,writeFileSync} from 'node:fs';
import vm from 'node:vm';
const root='/workspace/b3_tuvi/';
const src=readFileSync(root+'frontend/src/components/StructuredAnalysis.jsx','utf8');
const scope=vm.createContext({});
vm.runInContext(src.slice(src.indexOf('const PALACE_LABELS'),src.indexOf('function Detail('))+'\nglobalThis.validators={validAnalysisBody,validMajorResponse,validMinorResponse};',scope);
const validators=scope.validators;
const temp=mkdtempSync('/tmp/t032-api-ui-');process.env.SQLITE_PATH=temp+'/test.sqlite';
const {createApp}=await import(root+'backend/src/app.js');
const db=await import(root+'backend/src/db/sqlite.js');const repo=await import(root+'backend/src/db/repositories.js');db.initDatabase();const before=repo.countHoroscopes();
const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});
const base='http://127.0.0.1:'+server.address().port+'/api/interpretations/';
const fixtures=JSON.parse(readFileSync(root+'docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json','utf8')).cases;
const profile='iztro-pinned-menh-cuc-decadal-mutagen';let requests=0,accepted=0,rejected=0;
async function post(body,endpoint='analyze'){requests++;const r=await fetch(base+endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});assert.match(r.headers.get('cache-control'),/no-store/);const bodyOut=await r.json();assert.equal(JSON.stringify(bodyOut).includes('PRIVATE-APIUI-T032'),false);return {r,body:bodyOut};}
function validate(body,major=null,minor=null){return validators.validAnalysisBody(body)&&validators.validMajorResponse(body,major)&&validators.validMinorResponse(body,minor);}
try{
 const failures=[];let oldAccepted=0,closedAccepted=0;
 for(const f of fixtures){const major={profile,nominalAge:f.periods[2].nominalAge};const req={...f.input,fullName:'PRIVATE-APIUI-T032',majorPeriod:major};const result=await post(req);assert.equal(result.r.status,200);
 const accepted=validate(result.body,major);if(!accepted)failures.push({fixture:f.fixtureId??f.id,input:f.input,analysisValid:validators.validAnalysisBody(result.body),majorValid:validators.validMajorResponse(result.body,major),rows:result.body.time.capabilities.dai_han_modern.mutagens.map(r=>({source:r.sourceStarName,display:result.body.statements.filter(s=>!s.thanOverlay).flatMap(s=>s.stars).find(s=>s.starId===r.sourceStarId)?.displayName}))});
 for(const old of [null,'iztro-pinned-menh-cuc-decadal','iztro-pinned-menh-cuc-decadal-stem']){const option=old?{profile:old,nominalAge:major.nominalAge}:null;const r=await post({...f.input,...(option?{majorPeriod:option}:{})});assert.equal(r.r.status,200);assert.equal(validate(r.body,option),true);oldAccepted++;}
 for(const nominalAge of [1,125]){const option={profile,nominalAge};const r=await post({...f.input,majorPeriod:option});assert.equal(r.r.status,200);if(r.body.time.capabilities.dai_han_modern.status==='not_applied'){assert.equal(validate(r.body,option),true);closedAccepted++;}}
 const minor={profile:'iztro-pinned-age1-sex-triad',nominalAge:14};const combined=await post({...req,minorPeriod:minor,viewYearBranch:'Ngọ'});assert.equal(combined.r.status,200);assert.deepEqual(combined.body.time.capabilities.dai_han_modern,result.body.time.capabilities.dai_han_modern);
 const ask=await post({...req,questionId:'why_menh'},'ask');assert.equal(ask.r.status,200);assert.equal(ask.body.prose,null);
 }
 assert.equal(repo.countHoroscopes(),before);assert.equal(failures.length,24);
 const proof={requests,confirmedFinding:'R3501',genuineOpenResponsesRejected:failures.length,oldAccepted,closedAccepted,frontendValidators:'unaltered source extracted in VM',browserLaunched:false,databaseWrites:0,noStore:true,privacyNameWithheld:true,failures};writeFileSync('/tmp/t032/api-ui-proof.json',JSON.stringify(proof,null,2));console.log(JSON.stringify({...proof,failures:failures.slice(0,1)},null,2));
}finally{await new Promise(resolve=>server.close(resolve));db.getDb().close();rmSync(temp,{recursive:true,force:true});}
