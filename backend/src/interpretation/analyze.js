import { solarToLunar } from '../engine/lunar.js';
import { calculateTuVi } from '../engine/tuviRules.mjs';
import { validateChartInput } from '../engine/chartInput.js';
import { normalizeChart } from '../engine/normalizeChart.js';
import { PALACE_FUNCTIONS, interpretChart } from './pipeline.js';
import { synthesize } from './wholeChart.js';
import { timeOverlay } from '../time/timeEngine.js';

function chartFromBirth(value) {
    const { day, month, year, hour, gender } = value;
    const lunar = solarToLunar(day, month, year);
    if (!lunar.lunarDay || !lunar.lunarMonth || !lunar.lunarYear) return null;
    let canhGio = Math.floor((hour + 1) / 2) + 1;
    if (canhGio > 12) canhGio = 1;
    const tuviInfo = calculateTuVi(
        lunar.canIndex,
        lunar.chiIndex,
        lunar.lunarDay,
        lunar.lunarMonth,
        canhGio,
        gender,
        lunar.isLeapMonth
    );
    return normalizeChart({ tuviInfo, lunarInfo: lunar, input: {} });
}

function responseFor(chart) {
    const analysis = interpretChart(chart);
    if (!analysis.ok) return { status: 400, body: { error: 'Lá số không hợp lệ' } };
    return {
        status: 200,
        body: {
            ...analysis,
            palaceFunctions: analysis.statements.filter((statement) => !statement.thanOverlay).map((statement) => statement.functionId),
            wholeChart: synthesize(analysis),
            time: timeOverlay(chart),
            palaceCount: PALACE_FUNCTIONS.length
        }
    };
}

export function analyzeChartRequest(body) {
    if (body?.normalizedChart) {
        if (!body.normalizedChart.ok) return { status: 400, body: { error: 'Lá số không hợp lệ' } };
        return responseFor(body.normalizedChart);
    }
    const parsed = validateChartInput(body);
    if (!parsed.ok) return { status: 400, body: { error: 'Dữ liệu lập lá số không hợp lệ', details: parsed.errors } };
    const chart = chartFromBirth(parsed.value);
    if (!chart?.ok) return { status: 400, body: { error: 'Không đổi được ngày dương sang âm lịch' } };
    return responseFor(chart);
}
