/** Contradictory claims stay unresolved. This function does not pick a school or a winner. */
export function contradictionResolution(pairs = []) {
    const sides = (pairs || []).map((pair) => ({
        fromClaimId: pair.fromClaimId,
        toClaimId: pair.toClaimId
    }));
    if (sides.length === 0) return { status: 'none', winner: null, sides: [] };
    return { status: 'unresolved', winner: null, sides };
}
