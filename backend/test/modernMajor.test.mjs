import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { modernMajorPeriod, modernMajorCapability, validateMajorPeriod, MODERN_MAJOR_PROFILE as profile } from '../src/time/modernMajor.js';
import { timeOverlay } from '../src/time/timeEngine.js';
const fixtures = JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-decadal/fixtures.json', import.meta.url), 'utf8'));
function chartFor(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    return normalizeChart({ lunarInfo: lunar, input: {}, tuviInfo: calculateTuVi(lunar.canIndex, lunar.chiIndex,
        lunar.lunarDay, lunar.lunarMonth, hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth) });
}
let queries = 0, periods = 0;
for (const fixture of fixtures.fixtures) {
    const chart = chartFor(fixture.input), before = JSON.stringify(chart);
    assert.equal(chart.menhPalaceId, fixture.normalized.menhPalaceId);
    assert.deepEqual(chart.cuc, fixture.normalized.cuc);
    for (const period of fixture.periods) {
        assert.equal(chart.palaces.find(p => p.id === period.palaceId).daiHan, period.ageStart);
        periods++;
    }
    for (const { nominalAge, expected } of fixture.ageCases) {
        queries++;
        const result = modernMajorCapability(chart, { gender: fixture.input.gender, majorPeriod: { profile, nominalAge } });
        if (nominalAge > 125) { assert.equal(result.reason, 'invalid_major_period'); continue; }
        if (expected.status !== 'placed') {
            assert.equal(result.reason, expected.status === 'before_first_decade' ? 'before_first_period' : 'after_last_period');
            for (const key of ['branch','palaceId','functionId','functionLabel','decadeIndex','decadeStartAge','decadeEndAge']) assert.equal(result[key], null);
        } else {
            assert.equal(result.status, 'branch_placed'); assert.equal(result.reason, null);
            assert.equal(result.branch, expected.branch); assert.equal(result.palaceId, expected.palaceId);
            assert.equal(result.functionId, expected.functionId); assert.equal(result.palaceMapping, 'mapped');
            assert.equal(result.decadeIndex, expected.periodIndex); assert.equal(result.decadeStartAge, expected.ageStart);
            assert.equal(result.decadeEndAge, expected.ageEnd);
            const pure = modernMajorPeriod({ menhBranchId: Number(chart.menhPalaceId), cucNumber: chart.cuc.number,
                birthYearBranch: chart.lunar.chiName, gender: fixture.input.gender, nominalAge });
            assert.equal(pure.branch, expected.branch);
        }
        assert.equal(result.publicFortune, false); assert.equal(result.interpretation, null);
    }
    assert.equal(JSON.stringify(chart), before);
}
assert.equal(queries,1423); assert.equal(periods,336);
for (const nominalAge of [undefined,null,'1',true,0,-1,126,1.5,NaN,Infinity,[],{}]) {
    assert.equal(validateMajorPeriod({profile,nominalAge}),false);
    assert.equal(modernMajorPeriod({menhBranchId:1,cucNumber:2,birthYearBranch:'Tí',gender:1,nominalAge}),null);
}
for (const option of [null,undefined,[],{}, {profile}, {nominalAge:1}, {profile:'other',nominalAge:1},
    {profile,nominalAge:1,branch:'Ngọ'}, Object.assign(Object.create({profile}),{nominalAge:1})]) assert.equal(validateMajorPeriod(option),false);
for (const extra of ['hidden',Symbol('extra')]) {
    const option={profile,nominalAge:1};Object.defineProperty(option,extra,{value:true});assert.equal(validateMajorPeriod(option),false);
}
assert.equal(validateMajorPeriod(Object.assign(Object.create(null),{profile,nominalAge:125})),true);
for (const invalid of [{menhBranchId:0},{menhBranchId:1.5},{cucNumber:7},{birthYearBranch:'Tý'},{gender:0}]) {
    assert.equal(modernMajorPeriod({menhBranchId:1,cucNumber:2,birthYearBranch:'Tí',gender:1,nominalAge:2,...invalid}),null);
}
const chart=chartFor(fixtures.fixtures[0].input), options={gender:1,majorPeriod:{profile,nominalAge:12}};
const corruptions=[c=>{c.input.gender=-1;},c=>{c.ok=false;},c=>{c.schoolId='other';},c=>{delete c.lunar;},c=>{c.lunar.canIndex=10;},
    c=>{c.lunar.canName='wrong';},c=>{c.lunar.chiIndex=13;},c=>{c.lunar.chiName='wrong';},
    c=>{c.lunar.canIndex=0;c.lunar.canName='Giáp';},c=>{c.cuc.number=7;},c=>{c.cuc.name='wrong';},
    c=>{c.menhPalaceId='2';},c=>{c.palaces[0].isMenh=false;},c=>{c.palaces[1].isMenh=true;},
    c=>{c.palaces[0].functionId='other';},c=>{c.palaces.pop();},c=>{c.palaces[0].id='bad';},
    c=>{c.palaces[0].branchId=2;},c=>{c.palaces[1].functionLabel='wrong';},c=>{delete c.palaces;}];
for (const corrupt of corruptions) {
    const bad=structuredClone(chart);corrupt(bad);
    for (const nominalAge of [1,12,125]) {
        const actual=modernMajorCapability(bad,{...options,majorPeriod:{profile,nominalAge}});
        assert.equal(actual.reason,'invalid_chart');assert.equal(actual.status,'blocked');assert.equal(actual.palaceMapping,'invalid_chart');
        assert.equal(actual.branch,null);assert.equal(actual.decadeStartAge,null);
    }
}
for (const gender of [null,undefined,0,2,'1']) assert.equal(modernMajorCapability(chart,{...options,gender}).reason,'invalid_chart');
assert.equal(modernMajorCapability(chart).reason,'missing_explicit_profile_and_nominal_age');
assert.equal(modernMajorCapability(chart,{majorPeriod:null}).reason,'invalid_major_period');
const before=timeOverlay(chart,{gender:1,viewYearBranch:'Tí',minorPeriod:{profile:'iztro-pinned-age1-sex-triad',nominalAge:12}});
const after=timeOverlay(chart,{...options,viewYearBranch:'Tí',minorPeriod:{profile:'iztro-pinned-age1-sex-triad',nominalAge:12}});
for (const key of ['natalDecadeLabels','research','boundaries']) assert.deepEqual(after[key],before[key]);
for (const key of Object.keys(before.capabilities).filter(k=>k!=='dai_han_modern')) assert.deepEqual(after.capabilities[key],before.capabilities[key]);
const changed=structuredClone(chart);changed.palaces[0].daiHan=999;
assert.deepEqual(modernMajorCapability(changed,options),modernMajorCapability(chart,options));
console.log('modern major: independent 28 charts,336 periods,1423 queries; strict projection, invalid chart and unchanged natal/minor/classical gates');
