import { DIA_CHI } from '../engine/constants.js';

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
