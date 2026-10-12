function statementFor(analysis, topic) {
    return (analysis?.statements || []).find((statement) => statement.topic === topic && !statement.thanOverlay)
        || (analysis?.statements || []).find((statement) => statement.topic === 'menh');
}

export function answerQuestion(analysis, questionId, topic = 'menh') {
    const statement = statementFor(analysis, topic);
    if (!analysis?.ok || !statement) return { ok: false, error: 'missing_statement', prose: null };
    if (questionId === 'why_menh' || questionId === 'why_topic') {
        return {
            ok: true,
            statementId: statement.statementId,
            availabilityStatus: statement.availabilityStatus,
            ruleIds: (statement.ruleEvidence || []).map((item) => item.ruleId),
            prose: null
        };
    }
    if (questionId === 'which_stars') {
        return { ok: true, statementId: statement.statementId, starIds: statement.stars.map((star) => star.starId), prose: null };
    }
    if (questionId === 'breaking_checked') {
        return { ok: true, statementId: statement.statementId, breakingConditions: statement.breakingConditions, prose: null };
    }
    if (questionId === 'why_contradiction') {
        return { ok: true, statementId: statement.statementId, contradictoryEvidence: statement.contradictoryEvidence, prose: null };
    }
    if (questionId === 'where_is_source') {
        return {
            ok: true,
            statementId: statement.statementId,
            sourceReferences: statement.sourceReferences,
            missingSource: statement.sourceReferences.every((item) => !item.sourceId),
            prose: null
        };
    }
    if (questionId === 'why_no_conclusion') {
        return {
            ok: true,
            statementId: statement.statementId,
            availabilityStatus: statement.availabilityStatus,
            limitations: statement.limitations,
            prose: null
        };
    }
    return { ok: false, error: 'unknown_question', prose: null };
}
