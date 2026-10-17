// Two known batch files -> references only. Never copies or changes historical records.
import fs from 'node:fs';
const files=['docs/knowledge/research/knowledge-first-batch-2/knowledge-records.json','docs/knowledge/research/knowledge-first-batch-3/knowledge-records.json'];
const loaded=files.flatMap(file=>JSON.parse(fs.readFileSync(file,'utf8')).records.map(record=>({file,record})));
const refs=loaded.map(({file,record:r})=>({recordId:r.recordId,file,subject:r.subject,researchStatus:r.status.research}));
if(new Set(refs.map(r=>r.recordId)).size!==refs.length) throw Error('Duplicate recordId');
const cells=new Map();
for(const r of refs){
 if(!r.subject.starId||!r.subject.palaceId) continue;
 const cellId=`${r.subject.palaceId}:${r.subject.starId}`;
 if(!cells.has(cellId)) cells.set(cellId,{cellId,recordIds:[],researchStatesObserved:[]});
 const cell=cells.get(cellId); cell.recordIds.push(r.recordId);
 if(!cell.researchStatesObserved.includes(r.researchStatus)) cell.researchStatesObserved.push(r.researchStatus);
}
const deep=[...cells.values()];
const compared=deep.filter(c=>c.researchStatesObserved.some(s=>['COMPARED','CONFLICTING'].includes(s)));
const flagged=new Set(loaded.filter(({record:r})=>r.contradicts.length&&r.subject.starId&&r.subject.palaceId).map(({record:r})=>`${r.subject.palaceId}:${r.subject.starId}`));
const data={purpose:'Canonical research-only navigation to persisted records; no runtime loading or approval changes',updatedAt:'2026-10-17',baselineNavigationIndexRef:'docs/knowledge/research/knowledge-first-batch-2/major-star-palace-index.json',recordFiles:files,metrics:{indexedCells:168,persistedRecords:refs.length,starPalaceRecords:refs.filter(r=>r.subject.starId&&r.subject.palaceId).length,nonCellRecords:refs.filter(r=>!r.subject.starId||!r.subject.palaceId).length,contextualCells:deep.length,locatedOnlyCells:168-deep.length,comparedCellsIncludingDisputed:compared.length,cellsWithConflictingResearchStatus:deep.filter(c=>c.researchStatesObserved.includes('CONFLICTING')).length,cellsWithContradictionFlags:flagged.size,palacesWithContextualRecords:new Set(refs.filter(r=>r.subject.palaceId).map(r=>r.subject.palaceId)).size,newBatch3Records:refs.filter(r=>r.file.includes('batch-3')).length,newBatch3Cells:deep.filter(c=>!c.recordIds.some(id=>id.startsWith('KRB2-'))).length},metricMeaning:'Compared includes actually performed conditional comparisons with identity limits and disputed readings; not source acceptance. Contradiction flags include a linked dispute on a record whose main research status may be COMPARED.',familySummary:['quanshu-transmission: pinned digital witnesses, not independent mirrors','ham-so-attributed-web: separate authored attribution, print edition unresolved','ling-donglai-authored-commentary: author-published web discussion, print edition unresolved; classical/book quotations remain dependent'],sourceReviewThisBatch:'not_executed',runtimeApprovalThisBatch:'not_requested',publicReleasePermission:'unchanged_closed',records:refs,cells:deep};
fs.writeFileSync('docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json',JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(data.metrics));
