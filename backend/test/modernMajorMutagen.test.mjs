import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { validateChartInput } from '../src/engine/chartInput.js';
import { DIA_CHI } from '../src/engine/constants.js';
import { modernMajorCapability as cap, validateMajorPeriod, MODERN_MAJOR_MUTAGEN_PROFILE as profile,
    MODERN_MAJOR_PROFILE as branchProfile, MODERN_MAJOR_STEM_PROFILE as stemProfile } from '../src/time/modernMajor.js';
import { MODERN_MAJOR_MUTAGEN_ALGORITHM as A } from '../src/knowledge/modernMajorMutagenBinding.js';
import tuHoaMap from '../src/data/tuHoaMap.json' with { type: 'json' };
const fixture = JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-decadal-mutagen/fixtures.json', import.meta.url), 'utf8'));
const labels=['Hóa Lộc','Hóa Quyền','Hóa Khoa','Hóa Kỵ'], ids=['hoa_loc','hoa_quyen','hoa_khoa','hoa_ky'];
const compatibility='server_natal_menh_cuc_stem_branch_sex_age_and_default_mutagen_projection_not_full_iztro_astrolabe';
function chartFor(input) {
    assert.equal(validateChartInput(input).ok,true);
    const l=solarToLunar(input.day,input.month,input.year);
    return normalizeChart({lunarInfo:l,input:{},tuviInfo:calculateTuVi(l.canIndex,l.chiIndex,l.lunarDay,l.lunarMonth,
        hourBranchIndex(input.hour),input.gender,l.isLeapMonth)});
}
function options(f,nominalAge){return {gender:f.input.gender,majorPeriod:{profile,nominalAge}};}
function checkClosed(x) {
    assert.deepEqual(x.mutagens,[]);assert.equal(x.mutagenPlacement,'not_applied');assert.equal(x.heavenlyStem,null);
    assert.equal(x.stemPlacement,'not_applied');assert.equal(x.branch,null);assert.equal(x.branchPlacement,'not_applied');
    for(const key of ['palaceId','functionId','functionLabel','decadeIndex','decadeStartAge','decadeEndAge']) assert.equal(x[key],null);
    assert.equal(x.publicFortune,false);assert.equal(x.interpretation,null);assert.equal(x.interpretationStatus,'blocked');
}
// Independent reviewed table expectations: do not call the candidate to manufacture expected values.
for(const row of fixture.table) assert.deepEqual(tuHoaMap[String(row.stemIndex)],row.associations.map(x=>x.sourceStarName));
const seenStems=new Set(),seenTargets=new Set();let periods=0,associations=0,shared=0,queries=0;
for(const f of fixture.cases) {
    const chart=chartFor(f.input),before=JSON.stringify(chart);
    for(const p of f.periods) {
        periods++;seenStems.add(p.selectedStemIndex);
        if(new Set(p.expectedAssociations.map(x=>x.palaceId)).size<4) shared++;
        const expected=p.expectedAssociations.map((x,i)=>{
            seenTargets.add(x.b3StarId);associations++;
            return {mutagenId:ids[i],mutagenLabel:labels[i],sourceStarId:x.b3StarId,sourceStarName:x.sourceStarName,
                palaceId:x.palaceId,functionId:x.functionId,functionLabel:chart.palaces.find(y=>y.id===x.palaceId).functionLabel};
        });
        for(const nominalAge of [p.nominalAge,p.nominalAge+9]) {
            queries++;const request=options(f,nominalAge),actual=cap(chart,request);
            assert.equal(actual.mutagenScope,'natal_physical_palaces');assert.equal(actual.mutagenPlacement,'supported');
            assert.deepEqual(actual.mutagens,expected);assert.equal(actual.heavenlyStem,A.stemNames[p.selectedStemIndex]);
            assert.equal(actual.branch,DIA_CHI[p.selectedBranchId]);assert.equal(actual.decadeIndex,p.decadeIndex);
            assert.equal(actual.decadeStartAge,p.nominalAge);assert.equal(actual.decadeEndAge,p.nominalAge+9);
            assert.equal(actual.calendarCompatibility,compatibility);assert.equal(actual.publicFortune,false);
            assert.equal(actual.interpretation,null);assert.equal(actual.interpretationStatus,'blocked');
            // Exact T030 capability projection is unchanged after deleting only the three new fields.
            const old=cap(chart,{...request,majorPeriod:{profile:stemProfile,nominalAge}});
            const {mutagenScope,mutagenPlacement,mutagens,...without}=actual;
            assert.deepEqual({...without,profile:stemProfile,calendarCompatibility:old.calendarCompatibility},old);
            for(const key of ['mutagenScope','mutagenPlacement','mutagens'])assert.equal(Object.hasOwn(old,key),false);
        }
        // Birth/view-year substitutions and category rotation differ on independently identified witnesses.
        const names=expected.map(x=>x.sourceStarName);
        if(p.distinguishes.birthStem)assert.notDeepEqual(names,fixture.table[f.natal.birthStemIndex].associations.map(x=>x.sourceStarName));
        if(p.distinguishes.viewYearStem)assert.notDeepEqual(names,fixture.table[p.viewYearStemIndex].associations.map(x=>x.sourceStarName));
        if(p.distinguishes.categoryRotation)assert.notDeepEqual(names,[...names.slice(1),names[0]]);
    }
    for(const nominalAge of [1,125]) {
        const actual=cap(chart,options(f,nominalAge));
        if(nominalAge<f.natal.cuc||nominalAge>f.natal.cuc+119) {checkClosed(actual);assert.equal(actual.status,'not_applied');}
    }
    assert.equal(JSON.stringify(chart),before);
}
assert.equal(periods,288);assert.equal(associations,1152);assert.equal(shared,101);assert.equal(seenStems.size,10);assert.equal(seenTargets.size,15);
const f=fixture.cases[0],chart=chartFor(f.input),request=options(f,f.periods[0].nominalAge),good=cap(chart,request);
// Structural synthetic cases, never real-chart/domain witnesses. Catch name OR identity conflicts, not just coherent duplicates.
const selected=good.mutagens[0];
const locate=c=>c.palaces.flatMap(p=>p.stars).find(s=>s.starId===selected.sourceStarId);
const mutations=[
    c=>{for(const p of c.palaces)p.stars=p.stars.filter(s=>s.starId!==selected.sourceStarId);},
    c=>{c.palaces[0].stars.push(structuredClone(locate(c)));},
    c=>{c.palaces[0].stars.push({...locate(c),canonicalName:'unknown'});},
    c=>{c.palaces[0].stars.push({...locate(c),starId:'unknown'});},
    c=>{locate(c).status='unknown';},c=>{locate(c).starId='forged';},c=>{locate(c).canonicalName='forged';},
    c=>{locate(c).category='tu_hoa';},c=>{locate(c).list='minor';},c=>{locate(c).palaceId='other';},
    c=>{c.palaces[0].stars=null;},c=>{c.palaces[0].stars={};},c=>{c.palaces[0].stars=undefined;},
    c=>{c.lunar.canName='forged';},c=>{c.lunar.canIndex=10;},c=>{c.schoolId='other';},
    c=>{c.palaces[0].functionId='other';},c=>{c.palaces.pop();},c=>{c.menhPalaceId='other';}
];
for(const mutate of mutations){const bad=structuredClone(chart);mutate(bad);const x=cap(bad,request);checkClosed(x);assert.equal(x.reason,'invalid_chart');assert.equal(x.status,'blocked');assert.equal(x.palaceMapping,'invalid_chart');}
const irrelevant=structuredClone(chart);irrelevant.byStarId={forged:true};irrelevant.input.year=2044;
irrelevant.palaces[0].stars.push({status:'unknown',starId:null,canonicalName:null});
assert.deepEqual(cap(irrelevant,{...request,viewYear:2044,viewYearBranch:'Tí',birthYearStemIndex:1,mutagens:{},config:{mutagens:{}}}),good);
assert.equal(Object.isFrozen(tuHoaMap),false);assert.equal(Object.isFrozen(tuHoaMap['0']),false);
for(const nominalAge of [null,undefined,true,'4',0,-1,126,1.5,NaN,Infinity,[],{}])assert.equal(validateMajorPeriod({profile,nominalAge}),false);
for(const key of ['mutagens','config','heavenlyStem','approval','birthYearStemIndex'])assert.equal(validateMajorPeriod({...request.majorPeriod,[key]:true}),false);
for(const key of [Symbol('hidden'),'hidden']){const value={...request.majorPeriod};Object.defineProperty(value,key,{value:true});assert.equal(validateMajorPeriod(value),false);}
assert.equal(validateMajorPeriod({profile,nominalAge:1}),true);assert.equal(validateMajorPeriod({profile,nominalAge:125}),true);
for(const old of [branchProfile,stemProfile])for(const nominalAge of [1,4,125]){
    const x=cap(chart,{gender:f.input.gender,majorPeriod:{profile:old,nominalAge}});
    for(const key of ['mutagenScope','mutagenPlacement','mutagens'])assert.equal(Object.hasOwn(x,key),false);
}
for(const options of [{},{majorPeriod:null},{majorPeriod:{profile:'other',nominalAge:4}}]){
    const x=cap(chart,options);for(const key of ['mutagenScope','mutagenPlacement','mutagens'])assert.equal(Object.hasOwn(x,key),false);
}
console.log(`modern major mutagen:24 valid independent charts,${periods} periods,${associations} associations,${queries} endpoint queries,40 cells/15 targets/${shared} shared-palace periods; synthetic integrity closure and unchanged old profiles`);
