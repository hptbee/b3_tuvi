import { validateMajorPeriod } from '../time/modernMajor.js';
import { validateMinorPeriod } from '../time/modernMinor.js';
import { solarToLunar } from '../engine/lunar.js';
import { calculateTuVi } from '../engine/tuviRules.mjs';
import { validateChartInput } from '../engine/chartInput.js';
import { normalizeChart } from '../engine/normalizeChart.js';
import { hourBranchIndex } from '../engine/hourBranch.js';
import { PALACE_FUNCTIONS, interpretChart } from './pipeline.js';
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

function responseFor(chart, timeOptions) {
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
            statements: analysis.statements.map(({ internalProse, ...statement }) => statement),
            chartSource: 'server',
            palaceFunctions: analysis.statements.filter((statement) => !statement.thanOverlay).map((statement) => statement.functionId),
            wholeChart: synthesize(analysis),
            time: timeOverlay(chart, timeOptions),
            palaceCount: PALACE_FUNCTIONS.length
        }
    };
}

export function analyzeChartRequest(body) {
    if (body?.normalizedChart) {
        return { status: 400, body: { error: 'Lá số phải được tính từ ngày giờ sinh', code: 'client_chart_rejected' } };
    }
    const parsed = validateChartInput(body);
    if (!parsed.ok) return { status: 400, body: { error: 'Dữ liệu lập lá số không hợp lệ', details: parsed.errors } };
    const hasMinorPeriod = Object.hasOwn(body, 'minorPeriod');
    if (hasMinorPeriod && !validateMinorPeriod(body.minorPeriod)) {
        return { status: 400, body: { error: 'Tùy chọn Tiểu hạn không hợp lệ', code: 'invalid_minor_period' } };
    }
    const hasMajorPeriod = Object.hasOwn(body, 'majorPeriod');
    if (hasMajorPeriod && !validateMajorPeriod(body.majorPeriod)) {
        return { status: 400, body: { error: 'Tùy chọn Đại hạn không hợp lệ', code: 'invalid_major_period' } };
    }
    const chart = chartFromBirth(parsed.value);
    if (!chart?.ok) return { status: 400, body: { error: 'Không đổi được ngày dương sang âm lịch' } };
    const viewYearBranch = body.viewYearBranch;
    if (viewYearBranch != null && viewYearBranch !== '' && typeof viewYearBranch !== 'string') {
        return { status: 400, body: { error: 'Chi năm xem không hợp lệ', code: 'invalid_view_year_branch' } };
    }
    return responseFor(chart, { viewYearBranch, gender: parsed.value.gender,
        ...(hasMinorPeriod ? { minorPeriod: body.minorPeriod } : {}),
        ...(hasMajorPeriod ? { majorPeriod: body.majorPeriod } : {}) });
}
