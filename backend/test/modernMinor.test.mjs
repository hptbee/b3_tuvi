import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { DIA_CHI } from '../src/engine/constants.js';
import { modernMinorBranch, modernMinorCapability, validateMinorPeriod, MODERN_MINOR_PROFILE as profile } from '../src/time/modernMinor.js';
import { timeOverlay } from '../src/time/timeEngine.js';
const fixtures = JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-minor/fixtures.json', import.meta.url), 'utf8'));
function chartFor(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    return normalizeChart({ lunarInfo: lunar, input: {}, tuviInfo: calculateTuVi(lunar.canIndex, lunar.chiIndex,
        lunar.lunarDay, lunar.lunarMonth, hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth) });
}
for (const fixture of fixtures.cases) {
    assert.equal(modernMinorBranch(fixture.input), fixture.expected.branch, fixture.id);
    const witness = fixture.actualNatalReachability;
    const chart = chartFor(witness.input);
    const before = JSON.stringify(chart);
    const actual = modernMinorCapability(chart, { gender: fixture.input.gender,
        minorPeriod: { profile, nominalAge: fixture.input.nominalAge } });
    assert.equal(actual.status, 'branch_placed'); assert.equal(actual.branch, fixture.expected.branch);
    assert.equal(actual.palaceMapping, 'mapped'); assert.equal(actual.palaceId, fixture.expected.palaceId);
    assert.equal(actual.functionId, witness.expectedBranchPalace.functionId);
    assert.equal(actual.functionLabel, witness.expectedBranchPalace.functionLabel);
    assert.equal(actual.publicFortune, false); assert.equal(actual.interpretation, null);
    assert.equal(JSON.stringify(chart), before);
}
// Independent source table enumeration: ages i+1+12j are assigned to successive sex-directed branches.
const starts = { 'Dần': 5, 'Ngọ': 5, 'Tuất': 5, 'Thân': 11, 'Tí': 11, 'Thìn': 11,
    'Tị': 8, 'Dậu': 8, 'Sửu': 8, 'Hợi': 2, 'Mão': 2, 'Mùi': 2 };
let comparisons = 0;
for (const [birthYearBranch, start] of Object.entries(starts)) for (const gender of [1, -1]) {
    let branchId = start;
    const seen = new Set();
    for (let step = 0; step < 12; step++) {
        for (let cycle = 0; cycle < 10; cycle++) {
            const nominalAge = cycle * 12 + step + 1; seen.add(nominalAge);
            assert.equal(modernMinorBranch({ birthYearBranch, gender, nominalAge }), DIA_CHI[branchId]); comparisons++;
        }
        branchId += gender; if (branchId === 13) branchId = 1; if (branchId === 0) branchId = 12;
    }
    assert.equal(seen.size, 120); assert.equal(seen.has(121), false);
}
assert.equal(comparisons, 2880);
for (const fixture of fixtures.badInputs) assert.equal(modernMinorBranch(fixture.input), null, fixture.invalidField);
for (const [gender, age, expected] of [[1,2,'Tị'],[-1,2,'Mão'],[1,12,'Mão'],[-1,12,'Tị'],[1,13,'Thìn'],[-1,13,'Thìn'],[1,120,'Mão'],[-1,120,'Tị'],[1,9,'Tí']]) {
    assert.equal(modernMinorBranch({ birthYearBranch: 'Ngọ', gender, nominalAge: age }), expected);
}
for (const nominalAge of [undefined,null,'1',true,0,-1,121,1.5,NaN,Infinity,[],{}]) {
    assert.equal(validateMinorPeriod({ profile, nominalAge }), false);
    assert.equal(modernMinorBranch({ birthYearBranch: 'Ngọ', gender: 1, nominalAge }), null);
}
for (const option of [null,undefined,[],{}, {profile}, {nominalAge:1}, {profile:'other',nominalAge:1},
    {profile,nominalAge:1,branch:'Ngọ'}, Object.assign(Object.create({profile}),{nominalAge:1})]) assert.equal(validateMinorPeriod(option), false);
const hidden = {profile,nominalAge:1}; Object.defineProperty(hidden,'extra',{value:1}); assert.equal(validateMinorPeriod(hidden), false);
const symbol = {profile,nominalAge:1,[Symbol('extra')]:true}; assert.equal(validateMinorPeriod(symbol), false);
const input = {day:15,month:6,year:1990,hour:8,gender:1};
const chart = chartFor(input); const options = {gender:1,minorPeriod:{profile,nominalAge:1}};
for (const gender of [null,undefined,0,2,'1']) assert.equal(modernMinorCapability(chart,{...options,gender}).reason,'invalid_chart');
for (const corrupt of [c=>{delete c.lunar;}, c=>{c.lunar.chiIndex=1;},c=>{c.lunar.chiName='other';}]) {
    const bad=structuredClone(chart);corrupt(bad);const actual=modernMinorCapability(bad,options);
    assert.equal(actual.reason,'invalid_chart');assert.equal(actual.branch,null);assert.equal(actual.palaceId,null);
}
for (const corrupt of [c=>c.palaces.pop(),c=>{c.palaces[0].branchId=c.palaces[1].branchId;},
    c=>{c.palaces[0].id='bad';},c=>{c.palaces[0].branchName='other';},
    c=>{c.palaces[0].functionId=c.palaces[1].functionId;},c=>{c.palaces[0].functionLabel='bad';}]) {
    const bad=structuredClone(chart);corrupt(bad);const actual=modernMinorCapability(bad,options);
    assert.equal(actual.palaceMapping,'invalid_chart');assert.equal(actual.palaceId,null);assert.equal(actual.functionId,null);
}
assert.equal(modernMinorCapability(chart).reason,'missing_explicit_profile_and_nominal_age');
assert.equal(modernMinorCapability(chart,{minorPeriod:null}).reason,'invalid_minor_period');
assert.equal(modernMinorBranch({birthYearBranch:'unknown',gender:1,nominalAge:1}),null);
for (const [day, expected] of [[9,'Sửu'],[10,'Tuất']]) {
    const boundary=chartFor({day,month:2,year:2024,hour:0,gender:1});
    assert.equal(modernMinorCapability(boundary,options).branch,expected);
}
for (const birth of [{day:15,month:6,year:1990,hour:23,gender:1},{day:22,month:3,year:2023,hour:0,gender:-1}]) {
    const actualChart=chartFor(birth);assert.equal(modernMinorCapability(actualChart,{...options,gender:birth.gender}).palaceMapping,'mapped');
}
assert.equal(solarToLunar(22,3,2023).isLeapMonth,true);
assert.deepEqual(modernMinorCapability(chartFor({...input,hour:0}),options).branch,modernMinorCapability(chartFor({...input,hour:23}),options).branch);
const base=timeOverlay(chart,options);const annual=timeOverlay(chart,{...options,viewYearBranch:'Tí'});
assert.deepEqual(base.capabilities.tieu_han_modern,annual.capabilities.tieu_han_modern);
assert.equal(base.capabilities.tieu_han.status,'blocked');
assert.deepEqual(base.research.missingParameters.tieu_han,['age_on_start_palace','step_size']);
assert.deepEqual(timeOverlay(chart,{...options,minorPeriod:{profile,nominalAge:2},viewYearBranch:'Tí'}).capabilities.thien_duc,annual.capabilities.thien_duc);
assert.deepEqual(modernMinorCapability(chart,options),modernMinorCapability(JSON.parse(JSON.stringify(chart)),options));
console.log('modern minor: 120 source-comparative endpoints, 2880 age allocations, reachable charts, strict boundaries and unchanged natal data');
