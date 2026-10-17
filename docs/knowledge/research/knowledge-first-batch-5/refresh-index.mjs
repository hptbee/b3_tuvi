// Current bounded refresh. Historical Batch1–4 tools and snapshots remain frozen.
import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
export const files=[2,3,4,5].map(n=>`docs/knowledge/research/knowledge-first-batch-${n}/knowledge-records.json`);
export function buildIndex(loaded,previous){
 const refs=loaded.map(({file,record:r})=>({recordId:r.recordId,file,subject:r.subject,researchStatus:r.status.research}));
 if(new Set(refs.map(r=>r.recordId)).size!==refs.length)throw Error('Duplicate recordId');
 const cells=new Map();
 for(const r of refs){
  if(!r.subject.starId||!r.subject.palaceId)continue;
  const cellId=`${r.subject.palaceId}:${r.subject.starId}`;
  if(!cells.has(cellId))cells.set(cellId,{cellId,recordIds:[],researchStatesObserved:[]});
  const c=cells.get(cellId);c.recordIds.push(r.recordId);
  if(!c.researchStatesObserved.includes(r.researchStatus))c.researchStatesObserved.push(r.researchStatus);
 }
 const deep=[...cells.values()];const m={indexedCells:168,persistedRecords:refs.length,starPalaceRecords:refs.filter(r=>r.subject.starId&&r.subject.palaceId).length,nonCellRecords:refs.filter(r=>!r.subject.starId||!r.subject.palaceId).length,contextualCells:deep.length,locatedOnlyCells:168-deep.length,comparedCellsIncludingDisputed:deep.filter(c=>c.researchStatesObserved.some(s=>['COMPARED','CONFLICTING'].includes(s))).length,cellsWithConflictingResearchStatus:deep.filter(c=>c.researchStatesObserved.includes('CONFLICTING')).length,cellsWithContradictionFlags:new Set(loaded.filter(({record:r})=>r.subject.starId&&r.subject.palaceId&&r.contradicts.length).map(({record:r})=>`${r.subject.palaceId}:${r.subject.starId}`)).size,palacesWithContextualRecords:new Set(refs.filter(r=>r.subject.palaceId).map(r=>r.subject.palaceId)).size};
 for(const n of [3,4,5]){
  m[`newBatch${n}Records`]=refs.filter(r=>r.file.includes(`batch-${n}/`)).length;
  m[`newBatch${n}Cells`]=deep.filter(c=>c.recordIds.some(id=>id.startsWith(`KRB${n}-`))&&!c.recordIds.some(id=>Number(id.match(/^KRB(\d+)-/)?.[1])<n)).length;
 }
 return {...previous,updatedAt:'2026-10-17',refreshToolRef:'docs/knowledge/research/knowledge-first-batch-5/refresh-index.mjs',recordFiles:files,metrics:m,records:refs,cells:deep};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const path='docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json';
 const previous=JSON.parse(fs.readFileSync(path,'utf8'));
 const loaded=files.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
 const index=buildIndex(loaded,previous);fs.writeFileSync(path,JSON.stringify(index,null,2)+'\n');console.log(JSON.stringify(index.metrics));
}
