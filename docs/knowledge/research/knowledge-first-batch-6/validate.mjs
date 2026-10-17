// Research consistency/self-audit only. No source authentication or approval.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {validateStatuses,checkSpan} from '../knowledge-first-batch-5/validate.mjs';
import {buildIndex} from './refresh-index.mjs';
export {validateStatuses,checkSpan};
const dir='docs/knowledge/research/knowledge-first-batch-6';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const unique=(xs,k)=>assert.equal(new Set(xs.map(x=>x[k])).size,xs.length,`Duplicate ${k}`);
export function validateScan(scan){
 assert.equal(scan.family,'quanshu-transmission');assert.equal(scan.editionId,null);
 assert.equal(scan.observedIdentity.year,null);assert.equal(scan.observedIdentity.officialLibraryChainVerified,false);
 unique(scan.images,'digitalLeafZeroBased');unique(scan.excerpts,'id');
 for(const i of scan.images){assert.equal(i.pdfPageOneBased,i.digitalLeafZeroBased+1);assert.equal(i.imageRetainedInRepository,false);assert.match(i.observedJpegSha256,/^[a-f0-9]{64}$/);assert.ok(i.bytes>0);}
 for(const e of scan.excerpts){assert.ok(scan.images.some(i=>i.digitalLeafZeroBased===e.leaf&&i.url===e.imageUrl));assert.equal(e.printedFolio,null);assert.equal(hash(e.diplomatic),e.transcriptSha256);assert.ok(e.pane&&e.analysis);}
 assert.equal(scan.remoteArtifacts.fullPdfOrZipDownloaded,false);
}
export function validateFamilyAccounting(f){
 assert.equal(f.previousKnownFamilies,3);assert.equal(f.newProvisionalAuthoredAttributions,1);
 assert.equal(f.scanAddsAuthoredFamily,false);assert.equal(f.exactAssistantExceptionMatched,false);
 assert.equal(f.provenHistoricallyIndependentFamilies,null);assert.equal(new Set(f.knownPlusProvisional).size,4);
}
function main(){
 const {records}=read(`${dir}/knowledge-records.json`),{comparisons}=read(`${dir}/comparisons.json`),{dispositions,p1Followups}=read(`${dir}/dispositions.json`),e=read(`${dir}/evidence.json`),scan=read(`${dir}/scan-collation.json`);
 const index=read('docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json'),registry=read('docs/knowledge/sources.json'),baseCells=read('docs/knowledge/research/knowledge-first-batch-2/major-star-palace-index.json').cells;
 validateStatuses(records,comparisons);validateScan(scan);validateFamilyAccounting(e.familyAccounting);unique(dispositions,'dispositionId');
 assert.equal(hash(fs.readFileSync(e.primary.path)),e.primary.sha256);
 const dossier=fs.readFileSync(`${dir}/DOSSIER.md`,'utf8').replace(/\r\n/g,'\n');
 function sourceCheck(s){
  assert.equal(s.originalQuotation,null);assert.equal(s.page,null);
  if(s.sourceId){assert.ok(registry.sources.some(x=>x.sourceId===s.sourceId));if(s.editionId)assert.ok(registry.editions.some(x=>x.editionId===s.editionId&&x.sourceId===s.sourceId));}
  if(s.location?.path)checkSpan(s.location);
  else if(s.provisionalWitnessId===scan.provisionalWitnessId){assert.equal(s.family,scan.family);assert.equal(s.printedFolio,null);assert.equal(s.pdfPageOneBased,s.digitalLeafZeroBased+1);assert.ok(scan.images.some(i=>i.url===s.url&&i.digitalLeafZeroBased===s.digitalLeafZeroBased));assert.equal(s.scanEvidenceRef,`${dir}/scan-collation.json`);}
  else if(s.reusedFromRecord){const old=read('docs/knowledge/research/knowledge-first-batch-4/knowledge-records.json').records.find(r=>r.recordId===s.reusedFromRecord);assert.ok(old.sourceReferences.some(x=>x.provisionalWitnessId===s.provisionalWitnessId&&x.location.observedDecodedHtmlSha256===s.location.observedDecodedHtmlSha256));}
  else {const witness=e.authoredWitnesses.find(w=>w.provisionalWitnessId===s.provisionalWitnessId);if(witness){assert.equal(s.author,witness.author);if(s.location?.observedDecodedHtmlSha256)assert.equal(s.location.observedDecodedHtmlSha256,witness.sha256);assert.equal(witness.sourceTextRetained,false);}else assert.equal(s.sourceId,e.vietnameseWitness.sourceId);assert.ok(s.url&&s.section);}
 }
 for(const r of records){
  for(const k of ['predicate','meaningVi','conditions','modifiers','exceptions','exclusions','uncertainties','rights','sourceFamilyDependencies','nextAction','governingContext','sourceReferences','originalTerms'])assert.ok(r[k]?.length??r[k],`${r.recordId}:${k}`);
  assert.equal(r.schoolId,null);assert.equal(r.verificationStatus.implementationStatus,'not_executable');assert.equal(r.verificationStatus.interpretationStatus,'unreviewed');assert.equal(r.verificationStatus.bibliographicStatus,'secondary');
  assert.ok(dossier.includes(`### ${r.recordId}\n`));assert.equal(r.recordFile,`${dir}/knowledge-records.json`);assert.equal(r.dossierRef,`${dir}/DOSSIER.md#${r.recordId.toLowerCase()}`);assert.equal(r.evidenceRef,`${dir}/evidence.json`);
  if(r.subject.starId)assert.ok(baseCells.some(c=>c.cellId===`${r.subject.palaceId}:${r.subject.starId}`));else assert.ok(r.subject.terms.length);
  r.sourceReferences.forEach(sourceCheck);
  for(const s of [r.governingContext.location,r.governingContext.preambleLocation,...r.relationships.map(x=>x.location)].filter(Boolean))checkSpan(s);
  for(const id of [...(r.extendsRecordIds??[]),...r.relationships.map(x=>x.recordId).filter(Boolean)])assert.ok(index.records.some(x=>x.recordId===id&&!x.file.includes('batch-6')));
  for(const id of r.contradicts)assert.ok(dispositions.some(d=>d.dispositionId===id));
 }
 for(const c of comparisons){sourceCheck(c.sourceReference);for(const id of c.recordIds)assert.ok(records.some(r=>r.recordId===id&&r.comparisonIds.includes(c.comparisonId)));}
 const prior=read('docs/knowledge/research/knowledge-first-batch-5/dispositions.json');assert.equal(dispositions.length,14);
 for(const d of prior.dispositions){const current=dispositions.find(x=>x.dispositionId===d.dispositionId);for(const k of Object.keys(d))assert.deepEqual(current[k],d[k],`Historical disposition replaced:${d.dispositionId}:${k}`);assert.ok(current.batch6CarryForwardRef&&current.batch6Observation);}
 for(const [i,old]of prior.p1Followups.entries())for(const k of Object.keys(old))assert.deepEqual(p1Followups[i][k],old[k]);
 for(const d of dispositions){assert.equal(d.resolutionClaim,false);for(const id of d.recordIds)assert.ok(index.records.some(r=>r.recordId===id));}
 const all=index.recordFiles.flatMap(file=>read(file).records.map(record=>({file,record})));
 const rebuilt=buildIndex(all,index);assert.deepEqual(index,rebuilt);unique(index.records,'recordId');
 const independentCells=new Map();
 for(const {record:r}of all){if(!r.subject.starId||!r.subject.palaceId)continue;const id=`${r.subject.palaceId}:${r.subject.starId}`;if(!independentCells.has(id))independentCells.set(id,[]);independentCells.get(id).push(r);}
 assert.equal(index.metrics.persistedRecords,all.length);assert.equal(index.metrics.contextualCells,independentCells.size);assert.equal(index.metrics.indexedCells,baseCells.length);
 assert.equal(index.metrics.starPalaceRecords,[...independentCells.values()].flat().length);assert.equal(index.metrics.nonCellRecords,all.length-index.metrics.starPalaceRecords);
 assert.equal(index.metrics.comparedCellsIncludingDisputed,[...independentCells.values()].filter(rs=>rs.some(r=>['COMPARED','CONFLICTING'].includes(r.status.research))).length);
 assert.equal(index.metrics.cellsWithConflictingResearchStatus,[...independentCells.values()].filter(rs=>rs.some(r=>r.status.research==='CONFLICTING')).length);
 assert.equal(index.metrics.cellsWithContradictionFlags,[...independentCells.values()].filter(rs=>rs.some(r=>r.contradicts.length)).length);
 assert.equal(comparisons.filter(c=>c.kind==='authored_comparison').length,4);assert.equal(comparisons.filter(c=>c.kind==='dependent_witness_collation').length,5);
 const observedFamilies=new Set(['quanshu-transmission',...comparisons.filter(c=>c.kind==='authored_comparison').map(c=>c.family)]);assert.deepEqual([...observedFamilies].sort(),[...e.familyAccounting.knownPlusProvisional].sort());
 const historical=all.filter(x=>!x.file.includes('batch-6')),cells=new Set(historical.filter(x=>x.record.subject.starId&&x.record.subject.palaceId).map(x=>`${x.record.subject.palaceId}:${x.record.subject.starId}`));
 assert.equal(historical.length,48);assert.equal(cells.size,38);assert.equal(new Set(historical.filter(x=>x.record.subject.starId==='thien_co').map(x=>x.record.subject.palaceId)).size,12);
 assert.equal(index.metrics.newBatch6Records,records.length);assert.equal(index.metrics.newBatch6Cells,3);assert.equal(index.metrics.contextualCells,41);assert.equal(index.metrics.locatedOnlyCells,127);
 assert.equal(e.baselineVerification.committedCounts.records,historical.length);assert.equal(e.baselineVerification.committedCounts.contextualCells,cells.size);
 const originalIndex=execFileSync('git',['show',`${e.baseCommit}:docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json`],{encoding:'utf8'}).replace(/\r\n/g,'\n');assert.equal(hash(originalIndex),e.baselineVerification.baselineIndexSha256LF);
 for(const [p,h]of Object.entries(e.historicalSnapshots))assert.equal(hash(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n')),h,`Historical change:${p}`);
 assert.equal(index.refreshToolRef,`${dir}/refresh-index.mjs`);
 const changed=execFileSync('git',['diff','--name-only',e.baseCommit],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 const untracked=execFileSync('git',['ls-files','--others','--exclude-standard'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
 const allowed=new Set(['docs/README.md','docs/planning/ROADMAP_KNOWLEDGE_RESEARCH.md','docs/knowledge/research/KNOWLEDGE_RECORD_INDEX.json']);
 for(const p of [...changed,...untracked])assert.ok(p.startsWith(`${dir}/`)||allowed.has(p),`Out of scope:${p}`);
 assert.equal(e.approval.sourceReviewExecuted,false);assert.equal(e.approval.runtimeApprovalRequested,false);assert.equal(e.approval.publicReleasePermission,'unchanged_closed');assert.equal(e.approval.t034,'unresolved_unapproved');
 console.log(`PASS: ${records.length} records / 3 new cells; 4 authored comparisons (partial included), 5 dependent collations; cumulative57 records /41 cells; 14 open dispositions; ${Object.keys(e.historicalSnapshots).length} protected hashes; references, spans, separate states and research-only scope consistent. Not source authentication/review.`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main();
