import { DIA_CHI } from '../engine/constants.js';

const ORDER = DIA_CHI.slice(1);
const START = ORDER.indexOf('Dậu');

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

export function thienDucBranch(yearBranch) {
    const index = ORDER.indexOf(yearBranch);
    if (index < 0 || START < 0) {
        return closed({ ok: false, reason: 'unknown_year_branch', branch: null, branchPlacement: 'not_applied' });
    }
    return closed({
        ok: true,
        branch: ORDER[(START + index) % ORDER.length],
        branchPlacement: 'supported',
        profile: 'ziwei-quanshu-wikisource-juan2',
        convention: 'hko-earthly-branch-forward'
    });
}

export function thienDucCapability(viewYearBranch) {
    if (viewYearBranch == null || viewYearBranch === '') {
        return closed({
            id: 'thien_duc',
            status: 'not_applied',
            reason: 'missing_view_year_branch',
            branch: null,
            branchPlacement: 'not_applied'
        });
    }
    const placed = thienDucBranch(viewYearBranch);
    if (!placed.ok) {
        return closed({
            id: 'thien_duc',
            status: 'not_applied',
            reason: placed.reason,
            branch: null,
            branchPlacement: 'not_applied'
        });
    }
    const { ok, ...placement } = placed;
    return closed({
        id: 'thien_duc',
        status: 'branch_placed',
        ...placement
    });
}
