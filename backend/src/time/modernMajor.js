import { CUC_SO_MAP, DIA_CHI, THIEN_CAN } from '../engine/constants.js';
import { MODERN_MAJOR_ALGORITHM as A, MODERN_MAJOR_PIN, MODERN_MAJOR_PROFILE, MODERN_MAJOR_SOURCE,
    verifyModernMajorBinding } from '../knowledge/modernMajorBinding.js';
import { mapAnnualStarToPalace } from './thienDuc.js';

export { MODERN_MAJOR_PROFILE };
export function validateMajorPeriod(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)
        || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
    const keys = Reflect.ownKeys(value);
    return keys.length === 2 && keys.includes('profile') && keys.includes('nominalAge')
        && value.profile === MODERN_MAJOR_PROFILE && Number.isInteger(value.nominalAge)
        && value.nominalAge >= A.nominalAgeRange.min && value.nominalAge <= A.nominalAgeRange.max;
}
/** Pure projection of the twelve allocated source periods; no calendar or childhood inference. */
export function modernMajorPeriod({ menhBranchId, cucNumber, birthYearBranch, gender, nominalAge } = {}) {
    if (!Number.isInteger(menhBranchId) || menhBranchId < 1 || menhBranchId > A.wrap
        || !A.cucStartAges.some(row => row.number === cucNumber) || ![1, -1].includes(gender)
        || !DIA_CHI.slice(1).includes(birthYearBranch)
        || !validateMajorPeriod({ profile: MODERN_MAJOR_PROFILE, nominalAge })) return null;
    const decadeIndex = Math.floor((nominalAge - cucNumber) / A.yearsPerPeriod);
    if (decadeIndex < 0) return { reason: 'before_first_period' };
    if (decadeIndex >= A.periodCount) return { reason: 'after_last_period' };
    const yearYang = A.yearYangBranches.includes(birthYearBranch);
    const direction = (gender === 1) === yearYang ? A.forwardDirection : A.reverseDirection;
    const offset = menhBranchId - 1 + direction * decadeIndex * A.palacesPerPeriod;
    const branch = DIA_CHI[((offset % A.wrap) + A.wrap) % A.wrap + 1];
    const decadeStartAge = cucNumber + A.yearsPerPeriod * decadeIndex;
    return { reason: null, branch, decadeIndex, decadeStartAge, decadeEndAge: decadeStartAge + A.rangeEndOffset };
}
function closed(extra) {
    return { id: 'dai_han_modern', profile: null, nominalAge: null,
        sourceId: MODERN_MAJOR_SOURCE, sourcePin: MODERN_MAJOR_PIN,
        ageInput: 'caller_supplied', ageDerivation: 'not_applied',
        calendarCompatibility: 'server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe',
        branch: null, branchPlacement: 'not_applied', palaceMapping: 'not_applied',
        palaceId: null, functionId: null, functionLabel: null,
        decadeIndex: null, decadeStartAge: null, decadeEndAge: null,
        publicFortune: false, interpretation: null, interpretationStatus: 'blocked',
        boundaries: { ageConvention: 'caller_supplied_nominal_age', dateBoundary: 'not_evaluated',
            leapMonthFortune: 'not_evaluated', genderConvention: 'sex_matches_birth_year_branch_yin_yang_forward_else_reverse' }, ...extra };
}
function trustedInputs(chart, gender) {
    const lunar = chart?.lunar, cuc = chart?.cuc;
    if (!chart?.ok || chart.schoolId !== 'vn-tam-hop-default' || ![1, -1].includes(gender)
        || (chart.input?.gender != null && chart.input.gender !== gender)
        || !Number.isInteger(lunar?.chiIndex) || lunar.chiIndex < 1 || lunar.chiIndex > 12
        || DIA_CHI[lunar.chiIndex] !== lunar.chiName || !Number.isInteger(lunar.canIndex)
        || lunar.canIndex < 0 || lunar.canIndex > 9 || THIEN_CAN[lunar.canIndex] !== lunar.canName
        || lunar.canIndex % 2 !== (lunar.chiIndex - 1) % 2
        || !Number.isInteger(cuc?.number) || !A.cucStartAges.some(row => row.number === cuc.number)
        || CUC_SO_MAP[cuc.number] !== cuc.name || !Array.isArray(chart.palaces)) return null;
    const menh = chart.palaces.filter(p => p?.isMenh === true);
    if (menh.length !== 1 || menh[0].functionId !== 'menh' || menh[0].id !== chart.menhPalaceId) return null;
    // Validate the complete existing layout before selecting any period, including closed age ranges.
    if (mapAnnualStarToPalace({ status: 'branch_placed', branch: menh[0].branchName }, chart).palaceMapping !== 'mapped') return null;
    return { menhBranchId: menh[0].branchId, cucNumber: cuc.number, birthYearBranch: lunar.chiName, gender };
}
export function modernMajorCapability(chart, options = {}) {
    if (!Object.hasOwn(options, 'majorPeriod')) return closed({ status: 'not_applied', reason: 'missing_explicit_profile_and_nominal_age' });
    if (!validateMajorPeriod(options.majorPeriod)) return closed({ status: 'not_applied', reason: 'invalid_major_period' });
    const { profile, nominalAge } = options.majorPeriod, requested = { profile, nominalAge };
    if (!verifyModernMajorBinding().ok) return closed({ ...requested, status: 'blocked', reason: 'modern_profile_not_approved' });
    const input = trustedInputs(chart, options.gender);
    if (!input) return closed({ ...requested, status: 'blocked', reason: 'invalid_chart', palaceMapping: 'invalid_chart' });
    const period = modernMajorPeriod({ ...input, nominalAge });
    if (period.reason) return closed({ ...requested, status: 'not_applied', reason: period.reason });
    return mapAnnualStarToPalace(closed({ ...requested, ...period, status: 'branch_placed', branchPlacement: 'supported' }), chart);
}
