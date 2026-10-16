import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { solarToLunar } from '../src/engine/lunar.js';
import { hourBranchIndex } from '../src/engine/hourBranch.js';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { modernMajorCapability, modernMajorStem, validateMajorPeriod,
    MODERN_MAJOR_PROFILE as oldProfile, MODERN_MAJOR_STEM_PROFILE as profile } from '../src/time/modernMajor.js';
const fixtures = JSON.parse(readFileSync(new URL('../../docs/knowledge/research/fortune/modern-decadal-stem/fixtures.json', import.meta.url), 'utf8')).fixtures;
function chartFor(input) {
    const lunar = solarToLunar(input.day, input.month, input.year);
    return normalizeChart({ lunarInfo: lunar, input: {}, tuviInfo: calculateTuVi(lunar.canIndex, lunar.chiIndex,
        lunar.lunarDay, lunar.lunarMonth, hourBranchIndex(input.hour), input.gender, lunar.isLeapMonth) });
}
const pureCases = new Map(); let periods = 0, queries = 0;
for (const fixture of fixtures) {
    const chart = chartFor(fixture.input), before = JSON.stringify(chart);
    assert.equal(chart.lunar.canIndex, fixture.natal.yearStemIndex);
    for (const p of fixture.periods) {
        periods++;
        const key = `${fixture.natal.yearStemIndex}:${p.branchId}`;
        if (pureCases.has(key)) assert.equal(pureCases.get(key).expected, p.heavenlyStem);
        pureCases.set(key, { input: { birthYearStemIndex: fixture.natal.yearStemIndex, selectedBranchId: p.branchId }, expected: p.heavenlyStem });
    }
    for (const { nominalAge, expected } of fixture.ageCases) {
        queries++;
        const options = { gender: fixture.input.gender, majorPeriod: { profile, nominalAge } };
        const actual = modernMajorCapability(chart, options);
        assert.equal(actual.profile, profile); assert.equal(actual.nominalAge, nominalAge);
        assert.equal(actual.heavenlyStem, expected.heavenlyStem); assert.equal(actual.status, expected.status);
        assert.equal(actual.branch, expected.branch);
        assert.equal(actual.stemPlacement, expected.status === 'branch_placed' ? 'supported' : 'not_applied');
        if (expected.status === 'branch_placed') {
            for (const key of ['decadeIndex','decadeStartAge','decadeEndAge','palaceId']) assert.equal(actual[key], expected[key]);
            assert.equal(actual.palaceMapping, 'mapped'); assert.equal(actual.branchPlacement, 'supported');
            assert.equal(actual.functionId, fixture.periods[expected.decadeIndex].functionId);
        } else {
            assert.equal(actual.reason, expected.reason); assert.equal(actual.palaceMapping, 'not_applied');
            for (const key of ['palaceId','functionId','functionLabel','decadeIndex','decadeStartAge','decadeEndAge']) assert.equal(actual[key], null);
        }
        assert.equal(actual.calendarCompatibility, 'server_natal_menh_cuc_stem_branch_sex_age_projection_not_full_iztro_astrolabe');
        assert.equal(actual.publicFortune, false); assert.equal(actual.interpretation, null);
        // Both branch projections are identical; the separate approval adds exactly its discriminated fields.
        const legacy = modernMajorCapability(chart, { ...options, majorPeriod: { profile: oldProfile, nominalAge } });
        const { heavenlyStem, stemPlacement, ...withoutStem } = actual;
        assert.deepEqual({ ...withoutStem, profile: oldProfile, calendarCompatibility: legacy.calendarCompatibility }, legacy);
        assert.equal(Object.hasOwn(legacy, 'heavenlyStem'), false); assert.equal(Object.hasOwn(legacy, 'stemPlacement'), false);
    }
    assert.equal(JSON.stringify(chart), before);
}
assert.equal(periods, 288); assert.equal(pureCases.size, 120);
for (const { input, expected } of pureCases.values()) assert.equal(modernMajorStem(input), expected);
for (const bad of [undefined,null,'1',true,-1,10,1.5,NaN,Infinity]) assert.equal(modernMajorStem({birthYearStemIndex:bad,selectedBranchId:1}),null);
for (const bad of [undefined,null,'1',true,0,13,1.5,NaN,Infinity]) assert.equal(modernMajorStem({birthYearStemIndex:0,selectedBranchId:bad}),null);
assert.equal(modernMajorStem(),null);
for (const nominalAge of [undefined,null,'1',true,0,-1,126,1.5,NaN,Infinity,[],{}]) assert.equal(validateMajorPeriod({profile,nominalAge}),false);
for (const option of [null,undefined,[],{}, {profile}, {nominalAge:1}, {profile:profile+'x',nominalAge:1},
    {profile,nominalAge:1,heavenlyStem:'Giáp'},Object.assign(Object.create({profile}),{nominalAge:1})]) assert.equal(validateMajorPeriod(option),false);
for (const extra of ['hidden',Symbol('extra')]) {
    const option={profile,nominalAge:1};Object.defineProperty(option,extra,{value:true});assert.equal(validateMajorPeriod(option),false);
}
assert.equal(validateMajorPeriod(Object.assign(Object.create(null),{profile,nominalAge:125})),true);
const chart=chartFor(fixtures[0].input);
// Civil input year/viewing year and natal palace stem are not stem-placement inputs.
const trustedOptions={gender:1,majorPeriod:{profile,nominalAge:14}};
const trustedResult=modernMajorCapability(chart,trustedOptions);
const irrelevant=structuredClone(chart);irrelevant.input.year=2026;irrelevant.lunar.lunarYear=2026;
for(const palace of irrelevant.palaces){palace.heavenlyStem='forged';palace.canName='forged';}
assert.deepEqual(modernMajorCapability(irrelevant,{...trustedOptions,viewYearBranch:'Ngọ',viewYear:2044,birthYearStemIndex:0}),trustedResult);
const corruptions=[c=>{c.ok=false;},c=>{c.schoolId='other';},c=>{c.lunar.canIndex=10;},c=>{c.lunar.canIndex='9';},
    c=>{c.lunar.canName='Ky';},c=>{c.lunar.canIndex=0;c.lunar.canName='Giáp';},c=>{c.lunar.chiName='Tý';},
    c=>{c.cuc.name='other';},c=>{c.input.gender=-1;},c=>{c.palaces.pop();},c=>{c.palaces[0].id='other';},c=>{c.menhPalaceId='bad';}];
for (const corrupt of corruptions) for (const nominalAge of [1,14,125]) {
    const bad=structuredClone(chart);corrupt(bad);
    const actual=modernMajorCapability(bad,{gender:1,majorPeriod:{profile,nominalAge}});
    assert.equal(actual.reason,'invalid_chart');assert.equal(actual.status,'blocked');
    assert.equal(actual.heavenlyStem,null);assert.equal(actual.stemPlacement,'not_applied');assert.equal(actual.palaceMapping,'invalid_chart');
}
// Captured from the unchanged pre-implementation module, not reconstructed using this implementation.
const legacySnapshots = [
  {
    "options": {},
    "expected": {
      "id": "dai_han_modern",
      "profile": null,
      "nominalAge": null,
      "sourceId": "iztro-modern-software",
      "sourcePin": "2f00e2ab0c80b1632e55bc362f2ae26e121245cb",
      "ageInput": "caller_supplied",
      "ageDerivation": "not_applied",
      "calendarCompatibility": "server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe",
      "branch": null,
      "branchPlacement": "not_applied",
      "palaceMapping": "not_applied",
      "palaceId": null,
      "functionId": null,
      "functionLabel": null,
      "decadeIndex": null,
      "decadeStartAge": null,
      "decadeEndAge": null,
      "publicFortune": false,
      "interpretation": null,
      "interpretationStatus": "blocked",
      "boundaries": {
        "ageConvention": "caller_supplied_nominal_age",
        "dateBoundary": "not_evaluated",
        "leapMonthFortune": "not_evaluated",
        "genderConvention": "sex_matches_birth_year_branch_yin_yang_forward_else_reverse"
      },
      "status": "not_applied",
      "reason": "missing_explicit_profile_and_nominal_age"
    }
  },
  {
    "options": {
      "majorPeriod": null
    },
    "expected": {
      "id": "dai_han_modern",
      "profile": null,
      "nominalAge": null,
      "sourceId": "iztro-modern-software",
      "sourcePin": "2f00e2ab0c80b1632e55bc362f2ae26e121245cb",
      "ageInput": "caller_supplied",
      "ageDerivation": "not_applied",
      "calendarCompatibility": "server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe",
      "branch": null,
      "branchPlacement": "not_applied",
      "palaceMapping": "not_applied",
      "palaceId": null,
      "functionId": null,
      "functionLabel": null,
      "decadeIndex": null,
      "decadeStartAge": null,
      "decadeEndAge": null,
      "publicFortune": false,
      "interpretation": null,
      "interpretationStatus": "blocked",
      "boundaries": {
        "ageConvention": "caller_supplied_nominal_age",
        "dateBoundary": "not_evaluated",
        "leapMonthFortune": "not_evaluated",
        "genderConvention": "sex_matches_birth_year_branch_yin_yang_forward_else_reverse"
      },
      "status": "not_applied",
      "reason": "invalid_major_period"
    }
  },
  {
    "options": {
      "gender": 1,
      "majorPeriod": {
        "profile": "iztro-pinned-menh-cuc-decadal",
        "nominalAge": 14
      }
    },
    "expected": {
      "id": "dai_han_modern",
      "profile": "iztro-pinned-menh-cuc-decadal",
      "nominalAge": 14,
      "sourceId": "iztro-modern-software",
      "sourcePin": "2f00e2ab0c80b1632e55bc362f2ae26e121245cb",
      "ageInput": "caller_supplied",
      "ageDerivation": "not_applied",
      "calendarCompatibility": "server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe",
      "branch": "Hợi",
      "branchPlacement": "supported",
      "palaceMapping": "mapped",
      "palaceId": "12",
      "functionId": "huynh_de",
      "functionLabel": "HUYNH ĐỆ",
      "decadeIndex": 1,
      "decadeStartAge": 14,
      "decadeEndAge": 23,
      "publicFortune": false,
      "interpretation": null,
      "interpretationStatus": "blocked",
      "boundaries": {
        "ageConvention": "caller_supplied_nominal_age",
        "dateBoundary": "not_evaluated",
        "leapMonthFortune": "not_evaluated",
        "genderConvention": "sex_matches_birth_year_branch_yin_yang_forward_else_reverse"
      },
      "reason": null,
      "status": "branch_placed"
    }
  },
  {
    "options": {
      "gender": 1,
      "majorPeriod": {
        "profile": "iztro-pinned-menh-cuc-decadal",
        "nominalAge": 1
      }
    },
    "expected": {
      "id": "dai_han_modern",
      "profile": "iztro-pinned-menh-cuc-decadal",
      "nominalAge": 1,
      "sourceId": "iztro-modern-software",
      "sourcePin": "2f00e2ab0c80b1632e55bc362f2ae26e121245cb",
      "ageInput": "caller_supplied",
      "ageDerivation": "not_applied",
      "calendarCompatibility": "server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe",
      "branch": null,
      "branchPlacement": "not_applied",
      "palaceMapping": "not_applied",
      "palaceId": null,
      "functionId": null,
      "functionLabel": null,
      "decadeIndex": null,
      "decadeStartAge": null,
      "decadeEndAge": null,
      "publicFortune": false,
      "interpretation": null,
      "interpretationStatus": "blocked",
      "boundaries": {
        "ageConvention": "caller_supplied_nominal_age",
        "dateBoundary": "not_evaluated",
        "leapMonthFortune": "not_evaluated",
        "genderConvention": "sex_matches_birth_year_branch_yin_yang_forward_else_reverse"
      },
      "status": "not_applied",
      "reason": "before_first_period"
    }
  }
];
for (const {options,expected} of legacySnapshots) assert.deepEqual(modernMajorCapability(chart,options),expected);
console.log(`modern major stem:24 independent charts,${periods} periods,${queries} queries,120 pure source-derived cases,legacy snapshots and trusted metadata closure`);
