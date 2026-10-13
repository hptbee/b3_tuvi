import { digitSum, reduceNumber } from './reduction.js';

const part = (label, value) => ({ label, values: [...String(value)].map(Number), total: digitSum(value) });
const metric = (formulaId, parts) => ({ status: 'available', formulaId,
    ...reduceNumber(parts.reduce((sum, item) => sum + item.total, 0), false), keepMasters: false,
    parts, meaning: null, meaningStatus: 'withheld' });

const YEAR_MIN = 1200;
const YEAR_MAX = 2199;
const iso = ({ year, month, day }) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const pad = value => String(value).padStart(2, '0');

function viewOnOrAfterBirth(birthDate, year, month) {
    const birth = iso(birthDate);
    const firstOfMonth = `${year}-${pad(month)}-01`;
    if (firstOfMonth >= birth && firstOfMonth <= '2199-12-31') return firstOfMonth;
    if (year === birthDate.year && month === birthDate.month && birth <= '2199-12-31') return birth;
    return null;
}

function yearViewDate(birthDate, year, preferredMonth) {
    return viewOnOrAfterBirth(birthDate, year, preferredMonth)
        || (year === birthDate.year ? iso(birthDate) : year > birthDate.year ? `${year}-01-01` : null);
}

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
        return { year: bandYear, personalYear: personalYearMetric(birthDate, bandYear), selected: bandYear === year, viewDate: yearViewDate(birthDate, bandYear, month) };
    });
    const months = Array.from({ length: 12 }, (_, index) => {
        const bandMonth = index + 1;
        return { month: bandMonth, personalMonth: personalMonthMetric(personalYear.value, bandMonth), selected: bandMonth === month, viewDate: viewOnOrAfterBirth(birthDate, year, bandMonth) };
    });
    return {
        version: '1.1.0', policy: 'calendar-year-v1', bandPolicy: 'personal-year-cycle-containing-target-v1',
        targetDate, year, month, day, personalYear, personalMonth, personalDay, yearBand, months
    };
}
