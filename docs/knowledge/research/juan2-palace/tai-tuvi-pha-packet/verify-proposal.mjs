import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const repositoryRoot=path.resolve(process.argv[2]||process.cwd());
const load=relative=>import(pathToFileURL(path.join(repositoryRoot,relative)).href);
const [{solarToLunar},{hourBranchIndex},{calculateTuVi},{normalizeChart},{evaluateCondition}]=await Promise.all([
  load('backend/src/engine/lunar.js'),load('backend/src/engine/hourBranch.js'),load('backend/src/engine/tuviRules.mjs'),
  load('backend/src/engine/normalizeChart.js'),load('backend/src/engine/conditionEval.js')]);
const bytes=n=>fs.readFileSync(new URL(n,import.meta.url));
const read=n=>bytes(n).toString('utf8');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const bundle=JSON.parse(read('review-bundle.json')),candidate=bundle.candidates[0];
const independent=JSON.parse(read('independent-fixtures.json'));
assert.equal(sha(read(candidate.spanFile)),candidate.sourceDigest);
assert.equal(sha(read(candidate.contextFile)),candidate.contextDigest);
assert.equal(sha(JSON.stringify(candidate.conditionTree)),candidate.conditionTreeDigest);
assert.equal(sha(candidate.proposedWording),candidate.wordingDigest);
assert.equal(sha(JSON.stringify(candidate.fixtures)),candidate.fixturesDigest);
assert.equal(sha(bytes('raw-juan2.html')),bundle.rawHtmlSha256);
assert.equal(sha(bytes('derived-juan2.txt')),bundle.sourceIdentity.derivedTextSha256);
assert.equal(JSON.parse(read('fixtures.json')).length,candidate.fixtures.length);
assert.equal(candidate.fixtures.length,8);
let count=0;
for(const f of candidate.fixtures){
  const i=f.input,lunar=solarToLunar(i.day,i.month,i.year);
  const tuviInfo=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(i.hour),i.gender,lunar.isLeapMonth);
  const chart=normalizeChart({tuviInfo,lunarInfo:lunar,input:{}}),before=JSON.stringify(chart);
  const hosts=chart.palaces.filter(p=>p.functionId===candidate.target);assert.equal(hosts.length,1);
  const host=hosts[0],names=new Set(host.stars.map(s=>s.canonicalName));
  const direct=candidate.conditionTree.stars.every(n=>names.has(n));assert.equal(direct,f.expected);
  assert.equal(evaluateCondition(candidate.conditionTree,chart,{schoolId:candidate.schoolId,profile:candidate.sourceProfile}).status,direct?'satisfied':'not_satisfied');
  assert.deepEqual(chart.lunar,f.lunar);assert.deepEqual({id:host.id,functionId:host.functionId,branchName:host.branchName},f.host);
  const witness=independent.cases.find(x=>JSON.stringify(x.input)===JSON.stringify(i));assert.ok(witness);
  assert.equal(witness.expected,f.expected);assert.deepEqual(chart.cuc,witness.cuc);assert.equal(chart.menhPalaceId,witness.menhPalaceId);
  assert.deepEqual(host.stars.map(s=>({canonicalName:s.canonicalName,brightness:s.brightness})),witness.stars);
  assert.equal(JSON.stringify(chart),before);count++;
}
const manifestUrl=new URL('manifest.json',import.meta.url);
if(fs.existsSync(manifestUrl))for(const[file,digest]of Object.entries(JSON.parse(fs.readFileSync(manifestUrl,'utf8')).files))assert.equal(sha(bytes(file)),digest,file);
console.log(JSON.stringify({status:'PASS_PROPOSAL_INTEGRITY_AND_REPLAY_NOT_SOURCE_APPROVAL',fiveDigestClassesExact:true,sourceArtifactHashesExact:true,fixtures:count,positive:candidate.fixtures.filter(f=>f.expected).length,negative:candidate.fixtures.filter(f=>!f.expected).length,sourceSemanticApproval:false,publicRelease:false}));
