import { digitSum, reduceNumber } from './reduction.js';

const part = (label, value) => ({ label, values: [...String(value)].map(Number), total: digitSum(value) });
const metric = (formulaId, parts) => ({ status: 'available', formulaId,
    ...reduceNumber(parts.reduce((sum, item) => sum + item.total, 0), false), keepMasters: false,
    parts, meaning: null, meaningStatus: 'withheld' });

const YEAR_MIN = 1200;
const YEAR_MAX = 2199;

export function personalYearMetric(birthDate, year) {
    return metric('personal-year-calendar-v1', [part('birthDay', birthDate.day), part('birthMonth', birthDate.month), part('targetYear', year)]);
}

export function personalMonthMetric(personalYearValue, month) {
    return metric('personal-month-v1', [part('personalYear', personalYearValue), part('targetMonth', month)]);
}

export function calculateCycles(birthDate, targetDate) {
    const [year, month, day] = targetDate.split('-').map(Number);
    const personalYear = personalYearMetric(birthDate, year);
    const personalMonth = personalMonthMetric(personalYear.value, month);
    const personalDay = metric('personal-day-v1', [part('personalMonth', personalMonth.value), part('targetDay', day)]);
    const alignedStart = year - (personalYear.value - 1);
    const startYear = Math.min(Math.max(alignedStart, YEAR_MIN), YEAR_MAX - 8);
    const yearBand = Array.from({ length: 9 }, (_, index) => {
        const bandYear = startYear + index;
        return { year: bandYear, personalYear: personalYearMetric(birthDate, bandYear), selected: bandYear === year };
    });
    const months = Array.from({ length: 12 }, (_, index) => {
        const bandMonth = index + 1;
        return { month: bandMonth, personalMonth: personalMonthMetric(personalYear.value, bandMonth), selected: bandMonth === month };
    });
    return {
        version: '1.1.0', policy: 'calendar-year-v1', bandPolicy: 'personal-year-cycle-containing-target-v1',
        targetDate, year, month, day, personalYear, personalMonth, personalDay, yearBand, months
    };
}
