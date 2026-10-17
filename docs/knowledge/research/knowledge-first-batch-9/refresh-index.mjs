// Research index only; reuse the frozen builder without rewriting old checkpoints.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {buildIndex as previousBuild} from '../knowledge-first-batch-7/refresh-index.mjs';
export const recordFiles=n=>Array.from({length:n-1},(_,i)=>`docs/knowledge/research/knowledge-first-batch-${i+2}/knowledge-records.json`);
export function buildIndex(loaded,previous,n=9){
 if(![9,10].includes(n))throw Error('Unsupported research checkpoint');
 const index=previousBuild(loaded,previous,8);index.recordFiles=recordFiles(n);
 index.refreshToolRef=`docs/knowledge/research/knowledge-first-batch-${n}/refresh-index.mjs`;
 for(let batch=9;batch<=n;batch++){
  const added=loaded.filter(x=>x.file===index.recordFiles[batch-2]);
  const prior=new Set(loaded.filter(x=>index.recordFiles.indexOf(x.file)<batch-2).filter(x=>x.record.subject.starId&&x.record.subject.palaceId).map(x=>`${x.record.subject.palaceId}:${x.record.subject.starId}`));
  index.metrics[`newBatch${batch}Records`]=added.length;
  index.metrics[`newBatch${batch}Cells`]=new Set(added.filter(x=>x.record.subject.starId&&x.record.subject.palaceId).map(x=>`${x.record.subject.palaceId}:${x.record.subject.starId}`).filter(x=>!prior.has(x))).size;
 }
 return index;
}
export function refresh(n){
 const canonical='docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json';
 const loaded=recordFiles(n).flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
 const index=buildIndex(loaded,JSON.parse(fs.readFileSync(canonical,'utf8')),n);
 for(const p of [canonical,`docs/knowledge/research/knowledge-first-batch-${n}/index-snapshot.json`])fs.writeFileSync(p,JSON.stringify(index,null,2)+'\n');
 return index.metrics;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(refresh(9)));
