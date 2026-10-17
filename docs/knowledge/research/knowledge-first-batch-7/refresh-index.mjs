// Bounded extension of the frozen Batch6 builder; no migration of old packets.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {buildIndex as buildPrevious} from '../knowledge-first-batch-6/refresh-index.mjs';
export const files=Array.from({length:6},(_,i)=>`docs/knowledge/research/knowledge-first-batch-${i+2}/knowledge-records.json`);
export function buildIndex(loaded,previous,latestBatch=7){
 if(![7,8].includes(latestBatch))throw Error('Unsupported research batch');
 const index=buildPrevious(loaded,previous);
 index.recordFiles=Array.from({length:latestBatch-1},(_,i)=>`docs/knowledge/research/knowledge-first-batch-${i+2}/knowledge-records.json`);
 index.refreshToolRef=`docs/knowledge/research/knowledge-first-batch-${latestBatch}/refresh-index.mjs`;
 for(let n=7;n<=latestBatch;n++){
  index.metrics[`newBatch${n}Records`]=loaded.filter(x=>x.file===index.recordFiles[n-2]).length;
  const prior=new Set(loaded.filter(x=>index.recordFiles.indexOf(x.file)<n-2).filter(({record:r})=>r.subject.starId&&r.subject.palaceId).map(({record:r})=>`${r.subject.palaceId}:${r.subject.starId}`));
  index.metrics[`newBatch${n}Cells`]=index.cells.filter(c=>!prior.has(c.cellId)&&c.recordIds.some(id=>id.startsWith(`KRB${n}-`))).length;
 }
 return index;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const canonical='docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json';
 const loaded=files.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
 const index=buildIndex(loaded,JSON.parse(fs.readFileSync(canonical,'utf8')));
 for(const file of [canonical,'docs/knowledge/research/knowledge-first-batch-7/index-snapshot.json'])fs.writeFileSync(file,JSON.stringify(index,null,2)+'\n');
 console.log(JSON.stringify(index.metrics));
}
