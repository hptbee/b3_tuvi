import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const rows=[];
for(let repeat=0;repeat<3;repeat++) for(const kind of ['clean','adverse','dau','female','normal']) for(const root of (repeat%2?['/tmp/t029/perf-baseline','/workspace/b3_tuvi']:['/workspace/b3_tuvi','/tmp/t029/perf-baseline'])) {
 const result=spawnSync(process.execPath,['/tmp/t029/perf-probe.mjs',root,kind],{encoding:'utf8'});
 if(result.status!==0) throw new Error(result.stderr); rows.push(JSON.parse(result.stdout));
}
fs.writeFileSync('/tmp/t029/performance-measurements.json',JSON.stringify(rows,null,2)+'\n');
for(const kind of ['clean','adverse','dau','female','normal']) for(const current of [false,true]){
 const group=rows.filter(r=>r.kind===kind&&(r.root==='/workspace/b3_tuvi')===current);
 const range=key=>group.map(key);
 console.log(JSON.stringify({kind,current,coldMs:range(r=>r.coldMs),warmMedians:range(r=>r.warmMs.median),warmP95:range(r=>r.warmMs.p95),serializeMedians:range(r=>r.serializationMs.median),readCount:range(r=>r.coldReads.length),readBytes:range(r=>r.coldReads.reduce((n,r)=>n+r.bytes,0)),warmReads:range(r=>r.warmReadCount),bytes:range(r=>r.responseBytes),gate:range(r=>r.gate)}));
}
