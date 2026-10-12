const LAYERS = [
    'implementationStatus',
    'formulaStatus',
    'bibliographicStatus',
    'interpretationStatus'
];

// editionAuthenticated is edition.authenticated === true. Collation and scope are not gates.

function gateOpen(gate, context) {
    if (gate === 'editionAuthenticated') return context.editionAuthenticated === true;
    if (gate === 'sourceId') return typeof context.sourceId === 'string' && context.sourceId.length > 0;
    return false;
}

export function validateProvenance(status, context = {}, contract) {
    const errors = [];
    if (!status || typeof status !== 'object') {
        return { ok: false, errors: ['status object required'] };
    }
    for (const layer of LAYERS) {
        const value = status[layer];
        const allowed = contract.layers[layer];
        if (!allowed.includes(value)) {
            errors.push(`${layer} invalid`);
            continue;
        }
        const gate = contract.gates[layer]?.[value];
        if (gate && !gateOpen(gate, context)) {
            errors.push(`${layer}=${value} requires ${gate}`);
        }
        if (context.inferredFromTestPass === true && (value === 'primary' || value === 'checked_against_edition')) {
            errors.push(`${layer}=${value} cannot be inferred from test pass`);
        }
    }
    return { ok: errors.length === 0, errors };
}

export function canTransition(from, to, context = {}, contract) {
    const current = validateProvenance(from, { editionAuthenticated: true, sourceId: 'historical' }, contract);
    if (!current.ok) return { ok: false, errors: current.errors.map((e) => `from: ${e}`) };
    const next = validateProvenance(to, context, contract);
    const errors = [...next.errors];
    for (const layer of LAYERS) {
        if (from[layer] === to[layer]) continue;
        const allowed = contract.transitions[layer][from[layer]] || [];
        if (!allowed.includes(to[layer])) {
            errors.push(`${layer} ${from[layer]} -> ${to[layer]} not allowed`);
        }
    }
    return { ok: errors.length === 0, errors };
}
