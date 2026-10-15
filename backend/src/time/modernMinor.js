import { DIA_CHI } from '../engine/constants.js';
import { MODERN_MINOR_ALGORITHM, MODERN_MINOR_PIN, MODERN_MINOR_PROFILE, MODERN_MINOR_SOURCE,
    verifyModernMinorBinding } from '../knowledge/modernMinorBinding.js';
import { mapAnnualStarToPalace } from './thienDuc.js';

export { MODERN_MINOR_PROFILE };

/** Present opt-in only: no coercion, inherited fields, or caller overrides. */
export function validateMinorPeriod(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)
        || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
    const keys = Reflect.ownKeys(value);
    return keys.length === 2 && keys.includes('profile') && keys.includes('nominalAge')
        && value.profile === MODERN_MINOR_PROFILE && typeof value.nominalAge === 'number'
        && Number.isInteger(value.nominalAge) && value.nominalAge >= 1 && value.nominalAge <= 120;
}

/** Pure finite branch/sex/explicit-age projection; no calendar-age inference. */
export function modernMinorBranch({ birthYearBranch, gender, nominalAge } = {}) {
    if (!validateMinorPeriod({ profile: MODERN_MINOR_PROFILE, nominalAge }) || ![1, -1].includes(gender)) return null;
    const start = MODERN_MINOR_ALGORITHM.triadStarts.find((row) => row.birthBranches.includes(birthYearBranch));
    if (!start) return null;
    const direction = MODERN_MINOR_ALGORITHM.genderDirections.find((row) => row.gender === gender).direction;
    const offset = start.startBranchId - 1 + direction * (nominalAge - MODERN_MINOR_ALGORITHM.ageAtStart);
    return DIA_CHI[((offset % MODERN_MINOR_ALGORITHM.wrap) + MODERN_MINOR_ALGORITHM.wrap) % MODERN_MINOR_ALGORITHM.wrap + 1];
}

function closed(extra) {
    return { id: 'tieu_han_modern', profile: null, nominalAge: null,
        sourceId: MODERN_MINOR_SOURCE, sourcePin: MODERN_MINOR_PIN,
        ageInput: 'caller_supplied', ageDerivation: 'not_applied',
        calendarCompatibility: 'branch_sex_age_projection_not_full_iztro_astrolabe',
        branch: null, branchPlacement: 'not_applied', palaceMapping: 'not_applied',
        palaceId: null, functionId: null, functionLabel: null,
        publicFortune: false, interpretation: null, interpretationStatus: 'blocked',
        boundaries: { ageConvention: 'caller_supplied_nominal_age', dateBoundary: 'not_evaluated',
            leapMonthFortune: 'not_evaluated', genderConvention: 'male_forward_female_reverse' }, ...extra };
}

export function modernMinorCapability(chart, options = {}) {
    if (!Object.hasOwn(options, 'minorPeriod')) return closed({ status: 'not_applied', reason: 'missing_explicit_profile_and_nominal_age' });
    if (!validateMinorPeriod(options.minorPeriod)) return closed({ status: 'not_applied', reason: 'invalid_minor_period' });
    const { profile, nominalAge } = options.minorPeriod;
    const requested = { profile, nominalAge };
    if (!verifyModernMinorBinding().ok) return closed({ ...requested, status: 'blocked', reason: 'modern_profile_not_approved' });
    const lunar = chart?.lunar;
    if (!chart?.ok || ![1, -1].includes(options.gender) || !Number.isInteger(lunar?.chiIndex)
        || lunar.chiIndex < 1 || lunar.chiIndex > 12 || DIA_CHI[lunar.chiIndex] !== lunar.chiName) {
        return closed({ ...requested, status: 'blocked', reason: 'invalid_chart', palaceMapping: 'invalid_chart' });
    }
    return mapAnnualStarToPalace(closed({ ...requested, status: 'branch_placed',
        birthYearBranch: lunar.chiName, birthYearBranchSource: 'server_natal_lunar_year',
        branch: modernMinorBranch({ birthYearBranch: lunar.chiName, gender: options.gender, nominalAge }),
        branchPlacement: 'supported' }), chart);
}
