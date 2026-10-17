import { readFileSync,writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { validateChartInput } from '../../../../backend/src/engine/chartInput.js';
import { solarToLunar } from '../../../../backend/src/engine/lunar.js';
import { hourBranchIndex } from '../../../../backend/src/engine/hourBranch.js';
import { calculateTuVi } from '../../../../backend/src/engine/tuviRules.mjs';
import { normalizeChart } from '../../../../backend/src/engine/normalizeChart.js';
import { evaluateCondition } from '../../../../backend/src/engine/conditionEval.js';
const out=new URL('./',import.meta.url);const hash=v=>createHash('sha256').update(v).digest('hex');
const tree={op:'and',items:[{op:'same_palace',target:'dien_trach',stars:['Thiên Cơ','Cự Môn']},{op:'branch',target:'dien_trach',branches:['Mão']}]};
const direct=(p)=>p.stars.some(s=>s.canonicalName==='Thiên Cơ')&&p.stars.some(s=>s.canonicalName==='Cự Môn');
const adverse=['Kình Dương','Đà La','Hỏa Tinh','Linh Tinh'];
const selected=new Map();const buckets={};let count=0,maoSinglePartner=0,maoCharts=0;
function put(category, fixture) {buckets[category]=(buckets[category]||0)+1;if(!selected.has(category))selected.set(category,fixture);}
for(let year=1984;year<=1995;year++)for(let month=1;month<=12;month++)for(const day of [1,8,15,22])for(let hour=0;hour<24;hour+=2)for(const gender of [-1,1]){
 const input={day,month,year,hour,gender};assert.equal(validateChartInput(input).ok,true);
 const lunar=solarToLunar(day,month,year);const info=calculateTuVi(lunar.canIndex,lunar.chiIndex,lunar.lunarDay,lunar.lunarMonth,hourBranchIndex(hour),gender,lunar.isLeapMonth);const chart=normalizeChart({tuviInfo:info,lunarInfo:lunar,input:{}});assert.equal(chart.ok,true);
 const host=chart.palaces.find(p=>p.functionId==='dien_trach'); const stars=host.stars.map(s=>s.canonicalName);const expected=direct(host)&&host.branchName==='Mão';
 const trace=evaluateCondition(tree,chart,{schoolId:chart.schoolId,profile:'quanshu-iztro-2f00e2ab'});assert.equal(trace.status,expected?'satisfied':'not_satisfied');count++;
 const namedAdverses=stars.filter(s=>adverse.includes(s));
 const fixture={input,lunar,host:{id:host.id,functionId:host.functionId,branchName:host.branchName,stars},expected,namedAdverses,otherPairHosts:chart.palaces.filter(p=>p!==host&&direct(p)).map(p=>({functionId:p.functionId,branchName:p.branchName})),classification:'valid solar API input; natal placements are repository engineering observations, not independently authenticated historical or expert chart golden'};
 if(host.branchName==='Mão'){maoCharts++;if(stars.filter(s=>['Thiên Cơ','Cự Môn'].includes(s)).length===1)maoSinglePartner++;}
 if(expected)put(`positive_mao_${namedAdverses.length?'named_adverse':'no_named_four_adverse'}_${gender}`,fixture);
 else if(direct(host)&&host.branchName==='Dậu')put(`negative_dau_pair_${gender}`,fixture);
 else if(stars.includes('Thiên Cơ')&&!stars.includes('Cự Môn'))put(`negative_missing_cu_${gender}`,fixture);
 else if(stars.includes('Cự Môn')&&!stars.includes('Thiên Cơ'))put(`negative_missing_co_${gender}`,fixture);
 else if(host.branchName==='Mão'&&!direct(host))put(`negative_mao_neither_${gender}`,fixture);
 if(!expected&&fixture.otherPairHosts.some(p=>p.branchName==='Mão'))put(`negative_pair_mao_wrong_function_${gender}`,fixture);
}
const fixtures=[...selected.entries()].map(([id,v])=>({id:`T035/${id}`,...v}));
const limitations=['paragraph_scoped_only','textual_mao_branch_clause_only','direct_host_only','dau_clause_retained_not_applied','reciprocal_jumen_baseline_and_following_adverse_clause_retained_not_evaluated','source_brightness_not_engine_equivalence','no_property_or_wealth_prediction','not_a_whole_chart_judgment','not_a_verified_life_event','no_natal_formula_change','no_public_release'];
const wording='Trong mục Điền Trạch của bản chép này, nhánh Cự Môn đồng cung Thiên Cơ tại Mão được ghi “有田莊”. Đây là ghi chú về đúng nhánh văn bản truyền thống, không xác nhận quyền sở hữu nhà đất hay tài sản thực tế; các nhánh Dậu, đối ứng Cự Môn và điều kiện gia sát trong ngữ cảnh được giữ riêng, chưa tổng hợp thành lời luận.';
const source=readFileSync(new URL('source-span.txt',out));const context=readFileSync(new URL('review-context.txt',out));
const candidate={status:'PRELIMINARY_SOURCE_INSPECTED_NOT_APPROVED_NOT_FROZEN',claimId:'interp-quanshu-dien-co-cu-mao-host',locator:'juan2/田宅宮/天機',target:'dien_trach',sourceProfile:'quanshu-iztro-2f00e2ab',conditionTree:tree,conditions:['palace_dien_trach','thien_co_in_host','cu_mon_in_host','host_branch_mao','direct_host_only'],limitations,proposedWording:wording,fixtures,digests:{sourceDigest:hash(source),contextDigest:hash(context),conditionTreeDigest:hash(JSON.stringify(tree)),wordingDigest:hash(wording),fixturesDigest:hash(JSON.stringify(fixtures))},reviewQuestions:['Is source-cohost meaning of 巨門同 sufficient for this exact direct-host Mão branch annotation while complete original paragraph and entire section remain retained?', 'Does reciprocal Cự Môn general 廟旺/陷地 and terminal 加羊陀火鈴空劫田宅全無 make even quoted Mão clause misleading without additional predicate closure? Return unresolved/reject if so, never infer absence or engine brightness equivalence.', 'Dậu same-pair clause is not approved by or included in this candidate. Source-specific Mão branch is a textual attributed note, not a prediction of property ownership.', 'Verify all exact digests, true valid solar inputs, independent direct-name-set oracle versus AST, exact wording and all limitations. No earlier palace approval transfers.'],search:{inputs:count,range:'1984..1995, months1..12, days1/8/15/22, even clock hours0..22, genders-1/+1',buckets,maoCharts,maoSinglePartner,limitation:'No reachable same-Mão single-partner witness found; missing-partner negatives are on other branches. They do not independently discriminate every operand of full conjunction. Structural AST mutation checks remain needed.'},sourceReviewExecuted:false,approval:false};
writeFileSync(new URL('fixtures.json',out),JSON.stringify(fixtures,null,2)+'\n');writeFileSync(new URL('candidate.json',out),JSON.stringify(candidate,null,2)+'\n');console.log(JSON.stringify({count,fixtureCount:fixtures.length,maoCharts,maoSinglePartner,buckets,digests:candidate.digests},null,2));
