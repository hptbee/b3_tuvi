import { PROFILE, publicProfile } from './profile.js';
import { parseInput } from './input.js';
import { contentStore } from './content.js';

import { digitSum, reduceNumber } from './reduction.js';
import { buildBirthGrid } from './birthGrid.js';
import { calculateCycles } from './cycles.js';
import { calculatePinnacles } from './pinnacles.js';
import { buildCombinedChart, buildNameChart } from './charts.js';
import { calculateIndicators } from './indicators.js';
export { digitSum, reduceNumber } from './reduction.js';

const missing = reason => ({ status: 'unavailable', reason, value: null, meaning: null, meaningStatus: 'withheld' });
const metric = (formulaId, total, keepMasters, parts) => ({
    status: 'available', formulaId, ...reduceNumber(total, keepMasters), keepMasters,
    parts, meaning: null, meaningStatus: 'withheld'
});
const datePart = (label, number) => ({ label, values: [...String(number)].map(Number), total: digitSum(number) });
const lettersPart = (label, letters) => ({ label, values: letters.map(item => item.value), total: letters.reduce((sum, item) => sum + item.value, 0) });

export function calculateNumerology(body, referenceDate) {
    const { birthDate, name, targetDate } = parseInput(body, referenceDate);
    const { year, month, day } = birthDate;
    const dateParts = [datePart('day', day), datePart('month', month), datePart('year', year)];
    const metrics = {
        lifePath: metric('life-path-all-date-digits-v1', dateParts.reduce((sum, part) => sum + part.total, 0), true, dateParts),
        birthday: { ...metric('birthday-v1', day, true, [{ label: 'day', values: [day], total: day }]), originalDay: day },
        attitude: metric('attitude-v1', dateParts[0].total + dateParts[1].total, false, dateParts.slice(0, 2))
    };
    for (const [id, kind, reason] of [['expression', null, 'missing_name'], ['soulUrge', 'vowel', 'no_vowels'], ['personality', 'consonant', 'no_consonants']]) {
        if (!name) { metrics[id] = missing('missing_name'); continue; }
        const letters = name.letters.filter(letter => kind === null || letter.kind === kind);
        if (!letters.length) { metrics[id] = missing(reason); continue; }
        const part = lettersPart(id, letters);
        metrics[id] = metric(`${id}-latin-vn-v1`, part.total, true, [part]);
    }
    metrics.maturity = metrics.expression.status === 'available'
        ? metric('maturity-v1', metrics.lifePath.value + metrics.expression.value, true, [
            { label: 'lifePath', values: [metrics.lifePath.value], total: metrics.lifePath.value },
            { label: 'expression', values: [metrics.expression.value], total: metrics.expression.value }
        ]) : missing('missing_name');
    const meaningOptions = { profileId: PROFILE.id, profileVersion: PROFILE.version, locale: PROFILE.locale };
    const cycles = calculateCycles(birthDate, targetDate);
    for (const [id, value] of Object.entries(metrics)) {
        if (value.status === 'available') Object.assign(value, contentStore.getMeaning(id, value.value, meaningOptions));
    }
    for (const id of ['personalYear', 'personalMonth', 'personalDay']) {
        Object.assign(cycles[id], contentStore.getMeaning(id, cycles[id].value, meaningOptions));
    }
    for (const item of cycles.yearBand) Object.assign(item.personalYear, contentStore.getMeaning('personalYear', item.personalYear.value, meaningOptions));
    for (const item of cycles.months) Object.assign(item.personalMonth, contentStore.getMeaning('personalMonth', item.personalMonth.value, meaningOptions));
    const birthGrid = buildBirthGrid(birthDate);
    const nameChart = buildNameChart(name);
    const pinnacles = calculatePinnacles(birthDate, targetDate, metrics.lifePath.rootValue);
    const publish = (target, metricId, value) => {
        const editorial = contentStore.getMeaning(metricId, value, meaningOptions);
        if (editorial.meaningStatus === 'experimental_editorial') Object.assign(target, editorial);
    };
    for (const period of pinnacles.periods) {
        publish(period.pinnacle, period.id, period.pinnacle.value);
        if (period.challenge.value > 0) publish(period.challenge, 'challenge', period.challenge.value);
    }
    return {
        ok: true, schemaVersion: '1.2.0', profile: publicProfile(), referenceDate,
        contentVersion: contentStore.contentVersion, metrics, nameAnalysis: name,
        birthGrid, nameChart, combinedChart: buildCombinedChart(birthGrid, nameChart), cycles, pinnacles,
        indicators: calculateIndicators({ name, metrics, birthDay: day }),
        capabilities: publicProfile().capabilities,
        warnings: name?.letters.some(letter => letter.letter === 'Y') ? [{ code: 'Y_AS_CONSONANT', field: 'fullName' }] : []
    };
}
