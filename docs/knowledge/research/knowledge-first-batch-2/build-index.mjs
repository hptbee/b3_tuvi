// Literal passage-location index only. This does not infer meanings or approvals.
import fs from 'node:fs';
import crypto from 'node:crypto';
const dir = new URL('./', import.meta.url);
const evidence = JSON.parse(fs.readFileSync(new URL('evidence.json', dir), 'utf8'));
const records = JSON.parse(fs.readFileSync(new URL('knowledge-records.json', dir), 'utf8')).records;
const source = fs.readFileSync(evidence.primary.path);
if (crypto.createHash('sha256').update(source).digest('hex') !== evidence.primary.sha256) throw Error('Source identity changed');
const lines = source.toString('utf8').split(/\r?\n/);
const stars = [['tu_vi','紫微'],['thien_co','天機'],['thai_duong','太陽'],['vu_khuc','武曲'],['thien_dong','天同'],['liem_trinh','廉貞'],['thien_phu','天府'],['thai_am','太陰'],['tham_lang','貪狼'],['cu_mon','巨門'],['thien_tuong','天相'],['thien_luong','天梁'],['that_sat','七殺'],['pha_quan','破軍']].map(([starId,name])=>({starId,name}));
const palaces = [['menh','命宮',125,552],['huynh_de','兄弟宮',553,575],['phu_the','夫妻宮',576,599],['tu_tuc','子女宮',600,632],['tai_bach','財帛宮',633,662],['tat_ach','疾厄宮',663,686],['thien_di','遷移宮',687,711],['no_boc','奴仆宮',712,736],['quan_loc','官祿宮',737,764],['dien_trach','田宅宮',765,788],['phuc_duc','福德宮',789,816],['phu_mau','父母宮',817,846]].map(([palaceId,name,startLine,endLine])=>({palaceId,name,startLine,endLine}));
const cells = palaces.flatMap(p => stars.map(s => {
  const range = lines.slice(p.startLine, p.endLine);
  const headings = range.flatMap((line,i)=>line.startsWith(s.name)?[p.startLine+i+1]:[]);
  const mentions = range.flatMap((line,i)=>line.includes(s.name)?[p.startLine+i+1]:[]);
  const located = headings.length ? headings : mentions;
  const record = records.find(r=>r.subject.starId===s.starId&&r.subject.palaceId===p.palaceId);
  return {cellId:`${p.palaceId}:${s.starId}`,palaceId:p.palaceId,starId:s.starId,
    status:record?.status.research ?? (located.length?'PASSAGE_LOCATED':'NO_PASSAGE_FOUND_IN_SEARCHED_CORPUS'),
    location:{kind:headings.length?'paragraph_opening':mentions.length?'explicit_reference_only':'not_found',lineNumbers:located},
    recordIds:record?[record.recordId]:[]};
}));
const counts = cells.reduce((o,c)=>(o[c.status]=(o[c.status]??0)+1,o),{});
const result = {batchId:evidence.batchId,scope:'168-cell research navigation over one retained digital witness; automated location plus nine manually researched cases. Not a runtime knowledge catalog.',
  statusVocabulary:['NOT_RESEARCHED','PASSAGE_LOCATED','CONTEXT_MAPPED','COMPARED','CONFLICTING','NO_PASSAGE_FOUND_IN_SEARCHED_CORPUS'],
  absenceMeaning:'Only the named searched section of the named byte-identified corpus. A cohost mention is a located reference, not a standalone interpretation. No all-source absence asserted.',
  corpus:{sourceId:evidence.primary.sourceId,editionId:evidence.primary.editionId,path:evidence.primary.path,sha256:evidence.primary.sha256,search:'Exact traditional star-name string, restricted to the corresponding palaces entry line bounds; no all-book search'},
  earlierResearch:'This navigation index does not downgrade existing decisions or assert prior research never occurred. Historical approved scope remains in unchanged docs/knowledge/interpretation-claims.json.',
  depth:'Cells without recordIds are literal locations only, not contextual interpretations. Referenced records govern scope and uncertainties, including cohost-only cases.',
  sourceReviewThisBatch:'not_executed',runtimeApprovalThisBatch:'not_requested',
  stars,palaces,counts,cells};
fs.writeFileSync(new URL('major-star-palace-index.json',dir),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({cells:cells.length,counts,explicitReferenceOnly:cells.filter(c=>c.location.kind==='explicit_reference_only').map(c=>c.cellId)}));
