import assert from 'assert';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { calculateTuVi } from '../src/engine/tuviRules.mjs';
import { normalizeChart } from '../src/engine/normalizeChart.js';
import { interpretChart } from '../src/interpretation/pipeline.js';
import { evaluateTuPhuDongCungSlice } from '../src/interpretation/tuPhuSlice.js';
import { analyzeChartRequest } from '../src/interpretation/analyze.js';

function serverChart(can, chi, day, month, hour) {
    const tuviInfo = calculateTuVi(can, chi, day, month, hour, 1, false);
    const chart = normalizeChart({ tuviInfo, lunarInfo: { canIndex: can, chiIndex: chi } });
    chart.chartSource = 'server';
    return chart;
}

function evaluations(chart, profile) {
    return interpretChart(chart, { sourceProfile: profile }).statements.flatMap((item) => item.formulaEvaluations || []);
}

const rulesBefore = readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8');

let positive = null;
let negative = null;
for (let can = 0; can < 6 && !positive; can += 1) {
    for (let chi = 0; chi < 12 && !positive; chi += 1) {
        if ((can % 2) !== (chi % 2)) continue;
        for (let month = 1; month <= 12 && !positive; month += 1) {
            for (let hour = 1; hour <= 12 && !positive; hour += 2) {
                const chart = serverChart(can, chi, 15, month, hour);
                const slice = evaluateTuPhuDongCungSlice(chart);
                if (slice.runtimeMatch.status === 'matched') positive = { can, chi, month, hour, chart, slice };
                else if (!negative) negative = { chart, slice };
            }
        }
    }
}
assert.ok(positive, 'need a reachable Tử Phủ Đồng Cung chart');
assert.ok(negative);
assert.strictEqual(positive.slice.prose, null);
assert.strictEqual(positive.slice.expertVerified, false);
assert.strictEqual(positive.slice.publicRelease, false);
assert.strictEqual(positive.slice.auspicious, false);
assert.strictEqual(positive.slice.formation.status, 'matched');
assert.strictEqual(positive.slice.grade.status, 'not_certified');
assert.strictEqual(positive.slice.breaking.status, 'not_evaluated');
assert.strictEqual(positive.slice.interpretationEligibility.eligible, false);
assert.ok(positive.slice.interpretationEligibility.reasons.includes('formula_match_is_not_interpretation_approval'));
assert.strictEqual(positive.slice.sourceVerification.formulaComparison, 'MATCH');
assert.strictEqual(positive.slice.sourceVerification.authorizesInterpretationProse, false);
assert.strictEqual(positive.slice.sourceVerification.expertVerified, false);
assert.strictEqual(negative.slice.runtimeMatch.status, 'not_matched');
assert.strictEqual(negative.slice.prose, null);
assert.strictEqual(negative.slice.interpretationEligibility.eligible, false);

const forged = evaluateTuPhuDongCungSlice({
    ok: true,
    chartSource: 'client',
    palaces: positive.chart.palaces
});
assert.strictEqual(forged.runtimeMatch.status, 'not_matched');
assert.strictEqual(forged.reason, 'chart_not_server_calculated');
assert.strictEqual(forged.prose, null);

const rejected = analyzeChartRequest({
    normalizedChart: { ok: true, chartSource: 'server', palaces: positive.chart.palaces },
    day: 15,
    month: 6,
    year: 1990,
    hour: 8,
    gender: 1
});
assert.strictEqual(rejected.status, 400);
assert.strictEqual(rejected.body.code, 'client_chart_rejected');
assert.strictEqual(rejected.body.internalInterpretation, undefined);

const analysis = interpretChart(positive.chart);
const names = evaluations(positive.chart);
assert.ok(names.some((item) => item.name === 'Tử Phủ Đồng Cung'));
assert.ok(names.every((item) => item.expertVerified === false && item.publicInterpretationAllowed === false));
assert.ok(!names.some((item) => item.engineeringState === 'DISABLED' || item.engineeringState === 'INTERNAL_ONLY'));
assert.ok(analysis.statements.every((item) => item.prose === null));
assert.ok(analysis.statements.every((item) => item.availabilityStatus !== 'eligible_claims_present'));

const before = JSON.stringify(positive.chart.palaces);
evaluations(positive.chart, 'modern-108s');
evaluations(positive.chart, 'school-tuong-hoa-ky');
assert.strictEqual(JSON.stringify(positive.chart.palaces), before);
const hoaKy = evaluations(positive.chart, 'school-tuong-hoa-ky');
assert.ok(!hoaKy.some((item) => item.name === 'Hình Kỵ Giáp Ấn'));

const satNgo = serverChart(0, 0, 3, 2, 10);
assert.strictEqual(satNgo.palaces.find((palace) => palace.functionId === 'menh').branchName, 'Ngọ');
assert.ok(!evaluations(satNgo).some((item) => item.name === 'Thất Sát Triều Đẩu'));

const editorial = serverChart(0, 0, 14, 1, 2);
assert.ok(evaluations(editorial).some((item) => item.name === 'Nhật Nguyệt Tịnh Minh'));
const unpaired = serverChart(3, 1, 14, 1, 8);
assert.ok(!evaluations(unpaired).some((item) => item.name === 'Nhật Nguyệt Tịnh Minh'));

const thach = serverChart(2, 0, 9, 1, 9);
const thachHit = evaluations(thach).find((item) => item.name === 'Thạch Trung Ẩn Ngọc');
assert.ok(thachHit);
assert.strictEqual(thachHit.formationStatus, 'matched');
assert.strictEqual(thachHit.gradeStatus, 'not_met');

const served = analyzeChartRequest({ day: 15, month: 6, year: 1990, hour: 8, gender: 1 });
assert.strictEqual(served.status, 200);
assert.strictEqual(served.body.chartSource, 'server');
assert.strictEqual(served.body.internalInterpretation.prose, null);
assert.strictEqual(served.body.internalInterpretation.expertVerified, false);
assert.strictEqual(served.body.internalInterpretation.interpretationEligibility.eligible, false);

assert.strictEqual(readFileSync(fileURLToPath(new URL('../src/data/rulesV2.json', import.meta.url)), 'utf8'), rulesBefore);
console.log(`sprint 9 closure slice witness can=${positive.can} chi=${positive.chi} month=${positive.month} hour=${positive.hour}`);
