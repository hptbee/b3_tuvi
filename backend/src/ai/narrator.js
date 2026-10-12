export function narrationBudget(config = {}) {
    return {
        timeoutMs: Number.isInteger(config.timeoutMs) && config.timeoutMs > 0 ? config.timeoutMs : 1000,
        maxOutputChars: Number.isInteger(config.maxOutputChars) && config.maxOutputChars > 0 ? config.maxOutputChars : 2000
    };
}

export function collectAllowedIds(analysis) {
    const ids = new Set();
    for (const statement of analysis?.statements || []) {
        ids.add(statement.statementId);
        for (const id of statement.claimIds || []) ids.add(id);
        for (const star of statement.stars || []) if (star.starId) ids.add(star.starId);
        for (const evidence of statement.ruleEvidence || []) if (evidence.ruleId) ids.add(evidence.ruleId);
        for (const reference of statement.sourceReferences || []) if (reference.sourceId) ids.add(reference.sourceId);
    }
    return ids;
}

export function evaluateNarration(draft, analysis) {
    const allowed = collectAllowedIds(analysis);
    const referenced = Array.isArray(draft?.referencedIds) ? draft.referencedIds : [];
    const extra = Array.isArray(draft?.extraClaims) ? draft.extraClaims : [];
    const unknown = referenced.filter((id) => !allowed.has(id));
    return {
        modelCalled: draft?.modelCalled === true,
        evidenceFidelity: unknown.length === 0 && extra.length === 0,
        unsupportedStatements: extra,
        sourceHallucinations: unknown,
        structuredOutput: draft?.text == null || typeof draft.text === 'string',
        cost: draft?.cost ?? null,
        latencyMs: draft?.latencyMs ?? null
    };
}

export function deterministicFallback(analysis) {
    return {
        text: null,
        referencedIds: (analysis?.statements || []).map((statement) => statement.statementId),
        extraClaims: [],
        source: 'deterministic_fallback',
        modelCalled: false
    };
}

export async function narrate(analysis, provider, config = {}) {
    const budget = narrationBudget(config);
    if (typeof provider?.complete !== 'function') {
        const narration = deterministicFallback(analysis);
        return { narration, evaluation: evaluateNarration(narration, analysis), rejected: false };
    }
    let draft;
    try {
        draft = await Promise.race([
            provider.complete(analysis),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error('timeout')), budget.timeoutMs);
            })
        ]);
    } catch {
        const narration = deterministicFallback(analysis);
        return { narration, evaluation: evaluateNarration(narration, analysis), rejected: true };
    }
    if (typeof draft?.text === 'string' && draft.text.length > budget.maxOutputChars) {
        draft = { ...draft, text: draft.text.slice(0, budget.maxOutputChars) };
    }
    const evaluation = evaluateNarration({ ...draft, modelCalled: true }, analysis);
    if (!evaluation.evidenceFidelity) {
        return { narration: deterministicFallback(analysis), evaluation, rejected: true };
    }
    return {
        narration: {
            text: null,
            referencedIds: Array.isArray(draft?.referencedIds) ? draft.referencedIds : [],
            extraClaims: [],
            source: 'provider',
            modelCalled: true,
            withheldProse: typeof draft?.text === 'string' && draft.text.length > 0
        },
        evaluation,
        rejected: false
    };
}
