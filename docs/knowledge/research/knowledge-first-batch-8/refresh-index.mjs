// Current research snapshot; historical Batch7 generator remains frozen.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {buildIndex as previousBuild} from '../knowledge-first-batch-7/refresh-index.mjs';
export const files=Array.from({length:7},(_,i)=>`docs/knowledge/research/knowledge-first-batch-${i+2}/knowledge-records.json`);
export const buildIndex=(loaded,previous)=>previousBuild(loaded,previous,8);
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const canonical='docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json';
 const loaded=files.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
 const index=buildIndex(loaded,JSON.parse(fs.readFileSync(canonical,'utf8')));
 for(const file of [canonical,'docs/knowledge/research/knowledge-first-batch-8/index-snapshot.json'])fs.writeFileSync(file,JSON.stringify(index,null,2)+'\n');
 console.log(JSON.stringify(index.metrics));
}
