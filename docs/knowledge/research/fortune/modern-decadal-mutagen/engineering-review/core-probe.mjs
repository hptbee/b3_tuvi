import assert from 'node:assert/strict';
import fs from 'node:fs';
const root='/workspace/b3_tuvi/';
const {solarToLunar}=await import(root+'backend/src/engine/lunar.js');
const {hourBranchIndex}=await import(root+'backend/src/engine/hourBranch.js');
const {calculateTuVi}=await import(root+'backend/src/engine/tuviRules.mjs');
const {normalizeChart}=await import(root+'backend/src/engine/normalizeChart.js');
const {modernMajorCapability:cap,MODERN_MAJOR_MUTAGEN_PROFILE:profile}=await import(root+'backend/src/time/modernMajor.js');
const {verifyDecisionBinding}=await import(root+'backend/src/knowledge/decisionIntegrity.js');
const path=root+'docs/knowledge/research/fortune/modern-decadal-mutagen/';
const read=f=>fs.readFileSync(path+f,'utf8'),json=f=>JSON.parse(read(f));
const bundle=json('review-bundle.json'),decision=json('decision.json');
const r=verifyDecisionBinding({record:decision,reviews:[json('review-a.json'),json('review-b.json')],storedSpan:read('source-span.txt'),baseline:{sourceDigest:bundle.sourceDigest,editionId:bundle.editionId,schoolId:bundle.schoolId,locator:bundle.locator,requiredConditions:bundle.conditionIds,allowedConditions:bundle.conditionIds,requiredExceptions:bundle.exceptions,requiredAnchors:bundle.requiredAnchors}});
assert.equal(r.ok,true);assert.equal(r.compared.decision,'AI_ACCEPTED');assert.equal(r.compared.formulaComparison,'MATCH');
for(const side of ['a','b'])assert.equal(read('review-'+side+'.json'),fs.readFileSync('/tmp/t032/review-'+side+'.json','utf8'));
const seen=new Set();let probes=0;
for(const f of json('fixtures.json').cases){
 const i=f.input,l=solarToLunar(i.day,i.month,i.year),chart=normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,hourBranchIndex(i.hour),i.gender,l.isLeapMonth)});
 for(const p of f.periods){
  const options={gender:i.gender,majorPeriod:{profile,nominalAge:p.nominalAge}};
  const good=cap(chart,options);assert.equal(good.mutagenPlacement,'supported');
  for(const a of good.mutagens){
   if(seen.has(a.sourceStarId))continue;seen.add(a.sourceStarId);
   for(const mutate of [c=>{for(const palace of c.palaces)palace.stars=palace.stars.filter(s=>s.starId!==a.sourceStarId)},...['status','starId','canonicalName','category','list','palaceId'].map(key=>c=>{c.palaces.flatMap(p=>p.stars).find(s=>s.starId===a.sourceStarId)[key]='invalid';}),c=>{c.palaces[0].stars.push(structuredClone(c.palaces.flatMap(p=>p.stars).find(s=>s.starId===a.sourceStarId)));}]){
    const bad=structuredClone(chart);mutate(bad);const x=cap(bad,options);probes++;
    assert.equal(x.reason,'invalid_chart');assert.equal(x.branch,null);assert.equal(x.heavenlyStem,null);assert.deepEqual(x.mutagens,[]);
    for(const old of ['iztro-pinned-menh-cuc-decadal','iztro-pinned-menh-cuc-decadal-stem'])assert.deepEqual(cap(bad,{...options,majorPeriod:{profile:old,nominalAge:p.nominalAge}}),cap(chart,{...options,majorPeriod:{profile:old,nominalAge:p.nominalAge}}));
   }
  }
 }
}
assert.equal(seen.size,15);assert.equal(probes,120);
console.log(JSON.stringify({comparator:r.compared.decision,formula:r.compared.formulaComparison,rawJudgmentsUnchanged:true,selectedTargets:seen.size,syntheticProbes:probes,closedWholeNewProfile:true,oldProfilesByteEquivalent:true},null,2));
