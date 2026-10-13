import { solarToLunar } from '../engine/lunar.js';
import { calculateTuVi } from '../engine/tuviRules.mjs';
import { validateChartInput } from '../engine/chartInput.js';
import { normalizeChart } from '../engine/normalizeChart.js';
import { hourBranchIndex } from '../engine/hourBranch.js';
import { PALACE_FUNCTIONS, interpretChart } from './pipeline.js';
import { evaluateTuPhuDongCungSlice } from './tuPhuSlice.js';
import { synthesize } from './wholeChart.js';
import { timeOverlay } from '../time/timeEngine.js';

function chartFromBirth(value) {
    const { day, month, year, hour, gender } = value;
    const lunar = solarToLunar(day, month, year);
    if (!lunar.lunarDay || !lunar.lunarMonth || !lunar.lunarYear) return null;
    const canhGio = hourBranchIndex(hour);
    const tuviInfo = calculateTuVi(
        lunar.canIndex,
        lunar.chiIndex,
        lunar.lunarDay,
        lunar.lunarMonth,
        canhGio,
        gender,
        lunar.isLeapMonth
    );
    const chart = normalizeChart({ tuviInfo, lunarInfo: lunar, input: {} });
    if (chart?.ok) chart.chartSource = 'server';
    return chart;
}

function responseFor(chart) {
    const analysis = interpretChart(chart);
    if (!analysis.ok) {
        if (analysis.error === 'knowledge_bundle_invalid') {
            return { status: 400, body: { error: 'Dữ liệu tri thức chưa được chấp nhận', code: 'knowledge_bundle_invalid' } };
        }
        return { status: 400, body: { error: 'Lá số không hợp lệ' } };
    }
    return {
        status: 200,
        body: {
            ...analysis,
            chartSource: 'server',
            palaceFunctions: analysis.statements.filter((statement) => !statement.thanOverlay).map((statement) => statement.functionId),
            wholeChart: synthesize(analysis),
            time: timeOverlay(chart),
            palaceCount: PALACE_FUNCTIONS.length,
            internalInterpretation: evaluateTuPhuDongCungSlice(chart)
        }
    };
}

export function analyzeChartRequest(body) {
    if (body?.normalizedChart) {
        return { status: 400, body: { error: 'Lá số phải được tính từ ngày giờ sinh', code: 'client_chart_rejected' } };
    }
    const parsed = validateChartInput(body);
    if (!parsed.ok) return { status: 400, body: { error: 'Dữ liệu lập lá số không hợp lệ', details: parsed.errors } };
    const chart = chartFromBirth(parsed.value);
    if (!chart?.ok) return { status: 400, body: { error: 'Không đổi được ngày dương sang âm lịch' } };
    return responseFor(chart);
}
