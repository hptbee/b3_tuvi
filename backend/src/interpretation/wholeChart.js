export const TOPICS = [
    { id: 'ban_than', palaceTopics: ['menh'], includeThan: true },
    { id: 'cong_viec', palaceTopics: ['quan_loc'] },
    { id: 'tai_chinh', palaceTopics: ['tai_bach'] },
    { id: 'gia_dinh', palaceTopics: ['phu_mau', 'phuc_duc', 'huynh_de', 'tu_tuc'] },
    { id: 'hon_nhan', palaceTopics: ['phu_the'] },
    { id: 'quan_he', palaceTopics: ['no_boc', 'thien_di'] },
    { id: 'tai_san', palaceTopics: ['dien_trach'] },
    { id: 'suc_khoe', palaceTopics: ['tat_ach'], limitation: 'not_a_medical_or_life_event_conclusion' }
];

export function synthesize(analysis) {
    if (!analysis?.ok) return null;
    return {
        score: null,
        topics: TOPICS.map((topic) => {
            const statements = analysis.statements.filter((statement) => (
                topic.palaceTopics.includes(statement.topic) || (topic.includeThan && statement.thanOverlay)
            ));
            let availabilityStatus = 'insufficient_evidence';
            if (statements.some((statement) => statement.availabilityStatus === 'contradiction')) availabilityStatus = 'contradiction';
            else if (statements.length > 0 && statements.every((statement) => statement.availabilityStatus === 'eligible_claims_present')) {
                availabilityStatus = 'eligible_claims_present';
            }
            return {
                topicId: topic.id,
                statementIds: statements.map((statement) => statement.statementId),
                availabilityStatus,
                limitations: [topic.limitation, 'no_numeric_life_score'].filter(Boolean),
                prose: null
            };
        })
    };
}
