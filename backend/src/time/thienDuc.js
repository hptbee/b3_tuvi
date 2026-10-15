import { DIA_CHI } from '../engine/constants.js';
import { FUNCTION_BY_LABEL } from '../engine/normalizeChart.js';

const ORDER = DIA_CHI.slice(1);

export function forwardBranch(startBranch, yearBranch) {
    const start = ORDER.indexOf(startBranch);
    const index = ORDER.indexOf(yearBranch);
    if (start < 0 || index < 0) return null;
    return ORDER[(start + index) % ORDER.length];
}

/**
 * Thiên Đức branch for a lưu-niên year branch.
 * Wikisource 紫微斗數全書卷二: 天德星從酉上起子，順數至流年太歲.
 * Forward order is the Hong Kong Observatory earthly-branch sequence
 * 子丑寅卯辰巳午未申酉戌亥, which matches Tí…Hợi in DIA_CHI.
 * This places a branch only. It is not a fortune prediction.
 */
function closed(extra) {
    return {
        publicFortune: false,
        interpretation: null,
        interpretationStatus: 'blocked',
        ...extra
    };
}

function placeFrom(startBranch, yearBranch) {
    const branch = forwardBranch(startBranch, yearBranch);
    if (!branch) {
        return closed({ ok: false, reason: 'unknown_year_branch', branch: null, branchPlacement: 'not_applied' });
    }
    return closed({
        ok: true,
        branch,
        branchPlacement: 'supported',
        profile: 'ziwei-quanshu-wikisource-juan2',
        convention: 'hko-earthly-branch-forward'
    });
}

export function thienDucBranch(yearBranch) {
    return placeFrom('Dậu', yearBranch);
}

export function nguyetDucBranch(yearBranch) {
    return placeFrom('Tí', yearBranch);
}

export function annualStarCapability(id, place, viewYearBranch) {
    if (viewYearBranch == null || viewYearBranch === '') {
        return closed({
            id,
            status: 'not_applied',
            reason: 'missing_view_year_branch',
            branch: null,
            branchPlacement: 'not_applied'
        });
    }
    const placed = place(viewYearBranch);
    if (!placed.ok) {
        return closed({
            id,
            status: 'not_applied',
            reason: placed.reason,
            branch: null,
            branchPlacement: 'not_applied'
        });
    }
    const { ok, ...placement } = placed;
    return closed({
        id,
        status: 'branch_placed',
        ...placement
    });
}

export function thienDucCapability(viewYearBranch) {
    return annualStarCapability('thien_duc', thienDucBranch, viewYearBranch);
}

export function nguyetDucCapability(viewYearBranch) {
    return annualStarCapability('nguyet_duc', nguyetDucBranch, viewYearBranch);
}

/** Resolve an accepted annual branch on the natal layout; never insert a natal star. */
export function mapAnnualStarToPalace(capability, chart) {
    const unmapped = { ...capability, palaceMapping: 'not_applied', palaceId: null, functionId: null, functionLabel: null };
    if (capability.status !== 'branch_placed') return unmapped;
    const palaces = chart?.palaces;
    if (!chart?.ok || !Array.isArray(palaces) || palaces.length !== 12
        || new Set(palaces.map((palace) => palace?.branchId)).size !== 12
        || new Set(palaces.map((palace) => palace?.functionId)).size !== 12
        || !Array.from(palaces).every((palace) => palace && Number.isInteger(palace.branchId)
            && palace.branchId >= 1 && palace.branchId <= 12
            && palace.id === String(palace.branchId)
            && palace.branchName === DIA_CHI[palace.branchId]
            && palace.functionStatus === 'known'
            && typeof palace.functionId === 'string'
            && typeof palace.functionLabel === 'string'
            && Object.hasOwn(FUNCTION_BY_LABEL, palace.functionLabel)
            && FUNCTION_BY_LABEL[palace.functionLabel] === palace.functionId)) {
        return { ...unmapped, palaceMapping: 'invalid_chart' };
    }
    const palace = palaces.find((item) => item.branchName === capability.branch);
    if (!palace) return { ...unmapped, palaceMapping: 'invalid_chart' };
    return {
        ...capability,
        palaceMapping: 'mapped',
        palaceId: palace.id,
        functionId: palace.functionId,
        functionLabel: palace.functionLabel
    };
}
