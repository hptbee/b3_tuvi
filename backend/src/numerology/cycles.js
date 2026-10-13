import { digitSum, reduceNumber } from './reduction.js';

const part = (label, value) => ({ label, values: [...String(value)].map(Number), total: digitSum(value) });
const metric = (formulaId, parts) => ({ status: 'available', formulaId,
    ...reduceNumber(parts.reduce((sum, item) => sum + item.total, 0), false), keepMasters: false,
    parts, meaning: null, meaningStatus: 'withheld' });
export function calculateCycles(birthDate, targetDate) {
    const [year, month, day] = targetDate.split('-').map(Number);
    const personalYear = metric('personal-year-calendar-v1', [part('birthDay', birthDate.day), part('birthMonth', birthDate.month), part('targetYear', year)]);
    const personalMonth = metric('personal-month-v1', [part('personalYear', personalYear.value), part('targetMonth', month)]);
    const personalDay = metric('personal-day-v1', [part('personalMonth', personalMonth.value), part('targetDay', day)]);
    return { version: '1.0.0', policy: 'calendar-year-v1', targetDate, year, month, day, personalYear, personalMonth, personalDay };
}
