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
 for(const f of fixtures){const major={profile,nominalAge:f.periods[2].nominalAge};const req={...f.input,fullName:'PRIVATE-APIUI-T032',majorPeriod:major};const {r,body}=await post(req);assert.equal(r.status,200);if(!validate(body,major)) console.log(JSON.stringify({v:[validators.validAnalysisBody(body),validators.validMajorResponse(body,major),validators.validMinorResponse(body,null)],cap:body.time.capabilities.dai_han_modern,statements:body.statements.map(({palaceId,functionId,thanOverlay,stars})=>({palaceId,functionId,thanOverlay,stars}))},null,2));assert.equal(validate(body,major),true);accepted++;
  for(const mutate of [c=>c.mutagens.reverse(),c=>c.mutagens.pop(),c=>c.mutagens.push(c.mutagens[0]),c=>c.mutagens[0].extra=true,c=>c.mutagens[0].sourceStarId='thien_phu',c=>c.mutagens[0].sourceStarName='Forged',c=>c.mutagens[0].mutagenId='hoa_ky',c=>c.mutagens[0].palaceId='13',c=>c.mutagens[0].palaceId=Number(c.mutagens[0].palaceId),c=>c.mutagens[0].functionLabel='BAD',c=>c.mutagenScope='rotated',c=>c.mutagenPlacement='not_applied']){const copy=structuredClone(body);mutate(copy.time.capabilities.dai_han_modern);assert.equal(validate(copy,major),false);rejected++;}
  const overlay=structuredClone(body),row=overlay.time.capabilities.dai_han_modern.mutagens[0];overlay.statements.find(s=>!s.thanOverlay&&s.palaceId===row.palaceId).thanOverlay=true;assert.equal(validate(overlay,major),false);rejected++;
  const minor={profile:'iztro-pinned-age1-sex-triad',nominalAge:14};const combined=await post({...req,minorPeriod:minor,viewYearBranch:'Ngọ'});assert.equal(combined.r.status,200);assert.equal(validate(combined.body,major,minor),true);assert.deepEqual(combined.body.time.capabilities.dai_han_modern,body.time.capabilities.dai_han_modern);accepted++;
  for(const old of [null,'iztro-pinned-menh-cuc-decadal','iztro-pinned-menh-cuc-decadal-stem']){const option=old?{profile:old,nominalAge:major.nominalAge}:null;const result=await post({...f.input,...(option?{majorPeriod:option}:{})});assert.equal(result.r.status,200);assert.equal(validate(result.body,option),true);for(const key of ['mutagens','mutagenScope','mutagenPlacement'])assert.equal(Object.hasOwn(result.body.time.capabilities.dai_han_modern,key),false);accepted++;}
  for(const nominalAge of [1,125]){const option={profile,nominalAge};const result=await post({...f.input,majorPeriod:option});assert.equal(result.r.status,200);assert.equal(validate(result.body,option),true);accepted++;if(result.body.time.capabilities.dai_han_modern.status==='not_applied'){const copy=structuredClone(result.body);copy.time.capabilities.dai_han_modern.mutagens=body.time.capabilities.dai_han_modern.mutagens;assert.equal(validate(copy,option),false);rejected++;}}
  const ask=await post({...req,questionId:'why_menh'},'ask');assert.equal(ask.r.status,200);assert.equal(ask.body.prose,null);
 }
 assert.equal(repo.countHoroscopes(),before);
 const proof={requests,acceptedGenuineResponses:accepted,rejectedSyntheticForgeries:rejected,fixtures:fixtures.length,frontendValidators:'unaltered source extracted in VM',browserLaunched:false,databaseWrites:0,noStore:true,privacyNameWithheld:true};writeFileSync('/tmp/t032/api-ui-proof.json',JSON.stringify(proof,null,2));console.log(JSON.stringify(proof,null,2));
}finally{await new Promise(resolve=>server.close(resolve));db.getDb().close();rmSync(temp,{recursive:true,force:true});}
