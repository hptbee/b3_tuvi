import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createApp} from '/workspace/b3_tuvi/backend/src/app.js';
const source=fs.readFileSync('/workspace/b3_tuvi/frontend/src/components/StructuredAnalysis.jsx','utf8');
const scope={};
vm.runInNewContext(source.slice(0, source.indexOf('function serverErrorMessage')).replace(/^import .*;\n/gm,'')+'\nglobalThis.validators={validAnalysisBody,validMinorResponse,validMajorResponse};',scope);
const {validators:v}=scope;
const bundle=JSON.parse(fs.readFileSync('/workspace/b3_tuvi/docs/knowledge/research/juan2-palace/review-bundle-quan-mao.json','utf8'));
const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});
const endpoint=`http://127.0.0.1:${server.address().port}/api/interpretations`;
let checks=0;
try {
for(const fixture of bundle.candidates[0].fixtures){
 for(const withOptions of [false,true]) {
 const minor=withOptions?{profile:'iztro-pinned-age1-sex-triad',nominalAge:30}:null;
 const major=withOptions?{profile:'iztro-pinned-menh-cuc-decadal',nominalAge:30}:null;
 const request={...fixture.input,...(withOptions?{minorPeriod:minor,majorPeriod:major,viewYearBranch:'Ngọ'}:{})};
 const response=await fetch(endpoint+'/analyze',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(request)});
 assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
 const body=await response.json();
 assert.equal(v.validAnalysisBody(body),true,fixture.id);
 assert.equal(v.validMinorResponse(body,minor),true,fixture.id);
 assert.equal(v.validMajorResponse(body,major),true,fixture.id);
 const host=body.statements.find(s=>s.statementId==='palace:quan_loc');
 assert.equal(host.claimApplicability.find(c=>c.claimId==='interp-quanshu-quan-co-cu-mao-host').eligible,fixture.expected);
 assert.ok(body.statements.every(s=>s.prose===null&&!Object.hasOwn(s,'internalProse')));
 assert.ok(body.wholeChart.topics.every(t=>t.prose===null));
 assert.ok(!JSON.stringify(body).includes('吉美'));
 assert.ok(!JSON.stringify(body).includes('1980'));
 if(withOptions)for(const key of ['thien_duc','nguyet_duc','tieu_han_modern','dai_han_modern'])assert.equal(body.time.capabilities[key].status,'branch_placed',key);
 checks++;
 }
}
const positive=bundle.candidates[0].fixtures.find(f=>f.expected);
for(const questionId of ['why_topic','which_stars','breaking_checked','where_is_source','why_no_conclusion']){
 const response=await fetch(endpoint+'/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...positive.input,topic:'quan_loc',questionId})});
 assert.equal(response.status,200);const body=await response.json();assert.equal(body.prose,null);assert.ok(!JSON.stringify(body).includes('吉美'));checks++;
}
console.log(`Independent review HTTP/frontend probe: ${checks} requests passed; both profiles/year coexist, exact Mão eligibility, withheld public prose, no birth echo and no-store.`);
}finally{await new Promise(resolve=>server.close(resolve));}
