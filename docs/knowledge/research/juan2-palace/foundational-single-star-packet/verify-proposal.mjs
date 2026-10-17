import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const repositoryRoot=path.resolve(process.argv[2]||process.cwd());
const load=p=>import(pathToFileURL(path.join(repositoryRoot,p)).href);
const [{solarToLunar},{hourBranchIndex},{calculateTuVi},{normalizeChart},{evaluateCondition},{validateChartInput},{analyzeChartRequest}]=await Promise.all([load('backend/src/engine/lunar.js'),load('backend/src/engine/hourBranch.js'),load('backend/src/engine/tuviRules.mjs'),load('backend/src/engine/normalizeChart.js'),load('backend/src/engine/conditionEval.js'),load('backend/src/engine/chartInput.js'),load('backend/src/interpretation/analyze.js')]);
const bytes=p=>fs.readFileSync(new URL(p,import.meta.url)),read=p=>bytes(p).toString('utf8'),sha=v=>crypto.createHash('sha256').update(v).digest('hex');
const bundle=JSON.parse(read('review-bundle.json')),independent=JSON.parse(read('independent-fixtures.json')),fixtures=JSON.parse(read('fixtures.json'));
assert.equal(sha(bytes('raw-juan2.html')),bundle.rawHtmlSha256);assert.equal(sha(bytes('derived-juan2.txt')),bundle.sourceIdentity.derivedTextSha256);assert.equal(bundle.candidates.length,4);
const results=[];
for(const c of bundle.candidates){
 assert.equal(sha(read(c.spanFile)),c.sourceDigest);assert.equal(sha(read(c.contextFile)),c.contextDigest);assert.equal(sha(JSON.stringify(c.conditionTree)),c.conditionTreeDigest);assert.equal(sha(c.proposedWording),c.wordingDigest);assert.equal(sha(JSON.stringify(c.fixtures)),c.fixturesDigest);assert.deepEqual(fixtures[c.claimId],c.fixtures);assert.deepEqual(independent.fixtures[c.claimId],c.fixtures);
 assert.deepEqual(Object.keys(c.conditionTree),['op','target','star']);assert.equal(c.conditionTree.op,'star_present');assert.equal(c.conditionTree.target,c.target);assert.ok(c.fixtures.some(f=>f.expected));assert.ok(c.fixtures.some(f=>!f.expected));
 for(const anchor of c.requiredAnchors)assert.ok(c.sourceSpan.includes(anchor));assert.equal(read(c.spanFile),c.sourceSpan);assert.ok(read(c.contextFile).includes(c.sourceSpan));assert.ok(read(c.contextFile).includes(read(c.natalContextFile)));assert.ok(read(c.contextFile).includes(read(c.palaceSectionFile)));
 for(const f of c.fixtures){
  const i=f.input;assert.ok([1,-1].includes(i.gender));assert.equal(validateChartInput(i).ok,true);assert.equal(analyzeChartRequest(i).status,200);
  const lunar=solarToLunar(i.day,i.month,i.year),tuviInfo=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(i.hour),i.gender,lunar.isLeapMonth),chart=normalizeChart({tuviInfo,lunarInfo:lunar,input:{}}),before=JSON.stringify(chart);
  const hosts=chart.palaces.filter(p=>p.functionId===c.target);assert.equal(hosts.length,1);const host=hosts[0],direct=host.stars.some(s=>s.canonicalName===c.conditionTree.star);assert.equal(direct,f.expected);assert.equal(evaluateCondition(c.conditionTree,chart,{schoolId:c.schoolId,profile:c.sourceProfile}).status,direct?'satisfied':'not_satisfied');assert.deepEqual(chart.lunar,f.lunar);assert.deepEqual({id:host.id,functionId:host.functionId,branchName:host.branchName},f.host);assert.deepEqual(host.stars.filter(s=>s.list==='major').map(s=>s.starId),f.majorStars);const adverse=['kinh_duong','da_la','hoa_tinh','linh_tinh'];assert.deepEqual(host.stars.filter(s=>adverse.includes(s.starId)).map(s=>s.starId),f.adverseStars);
  const starHosts=chart.palaces.filter(p=>p.stars.some(s=>s.canonicalName===c.conditionTree.star));assert.equal(starHosts.length,1);assert.deepEqual({id:starHosts[0].id,functionId:starHosts[0].functionId,branchName:starHosts[0].branchName},f.starLocation);assert.deepEqual(f.condition,c.conditionTree);assert.equal(JSON.stringify(chart),before);
 }
 for(const gender of [-1,1])for(const label of ['positive','negative','positive_standalone','positive_cohost','positive_adverse_present','positive_adverse_absent','negative_opposite_only'])assert.ok(c.fixtures.some(f=>f.input.gender===gender&&f.labels.includes(label)),c.claimId+'/'+gender+'/'+label);
 results.push({claimId:c.claimId,fixtures:c.fixtures.length,positive:c.fixtures.filter(f=>f.expected).length,negative:c.fixtures.filter(f=>!f.expected).length});
}
const manifest=new URL('manifest.json',import.meta.url);if(fs.existsSync(manifest))for(const[n,d]of Object.entries(JSON.parse(fs.readFileSync(manifest,'utf8')).files))assert.equal(sha(bytes(n)),d,n);
console.log(JSON.stringify({status:'PASS_PROPOSAL_INTEGRITY_API_VALID_REPLAY_NOT_SOURCE_APPROVAL',fiveDigestClassesExact:true,sourceArtifactHashesExact:true,allBirthInputsValid:true,allAnalyzerResponses200:true,sourceSemanticApproval:false,publicRelease:false,candidates:results}));

