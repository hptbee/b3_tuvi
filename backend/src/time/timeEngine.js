const BLOCKED_REASON = 'no_approved_formula';

function blocked(name) {
    return { id: name, status: 'blocked', reason: BLOCKED_REASON, interpretation: null };
}

export function timeOverlay(chart) {
    if (!chart?.ok || !Array.isArray(chart.palaces)) {
        return { ok: false, error: 'malformed_chart', interpretation: null };
    }
    return {
        ok: true,
        usage: 'natal_annotation_only',
        natalDecadeLabels: chart.palaces.map((palace) => ({
            palaceId: palace.id,
            functionId: palace.functionId,
            daiHan: palace.daiHan ?? null
        })),
        capabilities: {
            dai_han_label: {
                status: 'read_existing_natal_annotation',
                interpretation: 'not_approved',
                fortuneFormula: 'not_applied',
                reason: 'natal_label_is_not_a_reviewed_fortune_formula'
            },
            tieu_han: blocked('tieu_han'),
            luu_nien: blocked('luu_nien'),
            luu_tinh: blocked('luu_tinh'),
            tu_hoa_han: blocked('tu_hoa_han'),
            leap_month_fortune: { id: 'leap_month_fortune', status: 'not_applied', reason: BLOCKED_REASON, interpretation: null }
        },
        interpretation: null,
        research: {
            dai_han: 'BLOCKED_SOURCE',
            tieu_han: 'BLOCKED_SOURCE',
            luu_nien: 'BLOCKED_SOURCE',
            luu_tinh: 'BLOCKED_SOURCE',
            tu_hoa_han: 'BLOCKED_SOURCE'
        },
        boundaries: {
            timezone: 'Asia/Ho_Chi_Minh',
            leapMonthFortune: 'not_applied',
            genderChangesCycle: false,
            ageConvention: 'not_approved'
        }
    };
}
