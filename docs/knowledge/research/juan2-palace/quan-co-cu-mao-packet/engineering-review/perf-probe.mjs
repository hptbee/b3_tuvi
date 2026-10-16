import fs from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
import {performance} from 'node:perf_hooks';
import {pathToFileURL} from 'node:url';
const [root, kind] = process.argv.slice(2);
const fixtures=JSON.parse(fs.readFileSync('/workspace/b3_tuvi/docs/knowledge/research/juan2-palace/review-bundle-quan-mao.json','utf8')).candidates[0].fixtures;
const ids={clean:'T029/05/',adverse:'T029/08/',dau:'T029/04/',female:'T029/09/',normal:'T029/01/'}; const fixture=fixtures.find(f=>f.id.startsWith(ids[kind]));
const original=fs.readFileSync; let reads=[];
fs.readFileSync=function(file,...args){ const value=original.call(this,file,...args); reads.push({path:String(file), bytes:Buffer.byteLength(value)}); return value; };
syncBuiltinESMExports();
const {analyzeChartRequest}=await import(pathToFileURL(root+'/backend/src/interpretation/analyze.js'));
reads=[];
const start=performance.now(); const cold=analyzeChartRequest(fixture.input); const coldMs=performance.now()-start;
if(cold.status!==200) throw new Error(JSON.stringify(cold));
const coldReads=reads; reads=[];
const samples=[], serialization=[]; let bytes;
for(let i=0;i<250;i++){
 let t=performance.now(); const result=analyzeChartRequest(fixture.input); samples.push(performance.now()-t);
 t=performance.now(); const serialized=JSON.stringify(result.body); serialization.push(performance.now()-t); bytes=Buffer.byteLength(serialized);
 if(result.status!==200) throw new Error('non200');
}
const stats=a=>{a.sort((x,y)=>x-y);return {min:a[0],median:a[Math.floor(a.length/2)],p95:a[Math.floor(a.length*.95)],max:a.at(-1)}};
if(cold.body.statements.some(s=>s.prose!==null || Object.hasOwn(s,'internalProse'))) throw new Error('public prose leak');
const gate=cold.body.statements.find(s=>s.functionId==='quan_loc').claimApplicability.find(g=>g.claimId==='interp-quanshu-quan-co-cu-mao-host');
if(root==='/workspace/b3_tuvi' && gate?.eligible!==fixture.expected) throw new Error('gate mismatch');
const oldGate=cold.body.statements.find(s=>s.functionId==='quan_loc').claimApplicability.find(g=>g.claimId==='interp-quanshu-quan-loc-co-cu-dau-host'); if(oldGate?.eligible!==(kind==='dau')) throw new Error('old gate mismatch');
console.log(JSON.stringify({oldGate:oldGate.eligible,root,kind,fixture:fixture.id,coldMs,coldReads,warmReadCount:reads.length,warmMs:stats(samples),serializationMs:stats(serialization),responseBytes:bytes,gate:gate?.eligible??null}));
