import { reduceNumber } from './reduction.js';

const iso = (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const isLeap = year => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const anniversary = (birth, years) => {
    const year = birth.year + years;
    if (birth.month === 2 && birth.day === 29 && !isLeap(year)) return iso(year, 3, 1);
    return iso(year, birth.month, birth.day);
};
const previousDay = value => {
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() - 1);
    return iso(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
};
const completedAge = (birth, onDate) => {
    const [year, month, day] = onDate.split('-').map(Number);
    let age = year - birth.year;
    const [, annMonth, annDay] = anniversary(birth, age).split('-').map(Number);
    if (month < annMonth || (month === annMonth && day < annDay)) age -= 1;
    if (!Number.isInteger(age) || age < 0) throw new RangeError('Completed age must be a non-negative integer');
    return age;
};
const withheld = { meaning: null, meaningStatus: 'withheld', meaningReason: 'content_not_in_scope' };
const component = (label, number) => ({
    status: 'available', formulaId: 'pinnacle-component-v1', ...reduceNumber(number, false), keepMasters: false,
    parts: [{ label, values: [number], total: number }], ...withheld
});
const pinnacle = parts => ({
    status: 'available', formulaId: 'pinnacle-sum-v1',
    ...reduceNumber(parts.reduce((sum, part) => sum + part.total, 0), true),
    keepMasters: true, parts, ...withheld
});
const challenge = (left, right) => ({
    status: 'available', formulaId: 'challenge-absolute-difference-v1',
    value: Math.abs(left - right), operands: [left, right], ...withheld
});

export function calculatePinnacles(birthDate, targetDate, lifePathRoot) {
    if (!Number.isInteger(lifePathRoot) || lifePathRoot < 1 || lifePathRoot > 9) {
        throw new RangeError('Pinnacle ages require a life-path root from 1 to 9');
    }
    const month = component('month', birthDate.month);
    const day = component('day', birthDate.day);
    const year = component('year', birthDate.year);
    const pinnacles = [
        pinnacle([{ label: 'reducedMonth', values: [month.value], total: month.value }, { label: 'reducedDay', values: [day.value], total: day.value }]),
        pinnacle([{ label: 'reducedDay', values: [day.value], total: day.value }, { label: 'reducedYear', values: [year.value], total: year.value }])
    ];
    pinnacles.push(pinnacle([{ label: 'pinnacle1', values: [pinnacles[0].value], total: pinnacles[0].value }, { label: 'pinnacle2', values: [pinnacles[1].value], total: pinnacles[1].value }]));
    pinnacles.push(pinnacle([{ label: 'reducedMonth', values: [month.value], total: month.value }, { label: 'reducedYear', values: [year.value], total: year.value }]));
    const challenges = [challenge(month.value, day.value), challenge(day.value, year.value)];
    challenges.push(challenge(challenges[0].value, challenges[1].value), challenge(month.value, year.value));
    const firstCycleEndAge = 36 - lifePathRoot;
    const bounds = [
        [0, firstCycleEndAge],
        [firstCycleEndAge + 1, firstCycleEndAge + 9],
        [firstCycleEndAge + 10, firstCycleEndAge + 18],
        [firstCycleEndAge + 19, null]
    ];
    const completedYears = completedAge(birthDate, targetDate);
    const periods = bounds.map(([startAgeInclusive, endAgeInclusive], index) => ({
        id: `p${index + 1}`,
        pinnacle: pinnacles[index],
        challenge: challenges[index],
        startAgeInclusive,
        endAgeInclusive,
        startDate: anniversary(birthDate, startAgeInclusive),
        endDate: endAgeInclusive === null ? null : previousDay(anniversary(birthDate, endAgeInclusive + 1)),
        active: completedYears >= startAgeInclusive && (endAgeInclusive === null || completedYears <= endAgeInclusive)
    }));
    if (periods.filter(period => period.active).length !== 1) throw new RangeError('Pinnacle periods must have exactly one active phase');
    return {
        version: '1.0.0', policy: 'component-reduce-root-age-v1', anniversaryPolicy: 'feb29-mar1-nonleap-v1',
        asOf: targetDate, completedAge: completedYears, lifePathRoot, firstCycleEndAge,
        components: { month, day, year }, periods
    };
}
