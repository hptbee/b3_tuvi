function readBody(text) {
    try {
        const body = JSON.parse(text);
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return { body: null, bodyStatus: 'malformed' };
        }
        return { body, bodyStatus: 'ok' };
    } catch {
        return { body: null, bodyStatus: 'malformed' };
    }
}

function mapClaim(row) {
    const parsed = readBody(row.body_json);
    return {
        claimId: row.claim_id,
        schoolId: row.school_id,
        body: parsed.body,
        bodyStatus: parsed.bodyStatus,
        implementationStatus: row.implementation_status,
        formulaStatus: row.formula_status,
        bibliographicStatus: row.bibliographic_status,
        interpretationStatus: row.interpretation_status,
        usage: 'research_or_fixture'
    };
}

function claims(db, sql, params = []) {
    return db.prepare(sql).all(...params).map(mapClaim);
}

export function createKnowledgeReader(db) {
    db.exec('PRAGMA query_only = ON');

    return {
        datasetUsage() {
            const row = db.prepare(`SELECT value FROM kb_prototype_meta WHERE key = 'usage'`).get();
            return {
                usage: row?.value || 'unspecified',
                approvedForUserInterpretation: false
            };
        },

        getClaimById(claimId) {
            const row = db.prepare(`SELECT * FROM claims WHERE claim_id = ?`).get(claimId);
            return row ? mapClaim(row) : null;
        },

        findClaimsByCombination(combinationName) {
            return claims(db, `
                SELECT c.* FROM claims c
                JOIN combination_claims cc ON cc.claim_id = c.claim_id
                WHERE cc.combination_name = ?
                ORDER BY c.claim_id
            `, [combinationName]);
        },

        findClaimsBySchool(schoolId) {
            return claims(db, `
                SELECT * FROM claims WHERE school_id = ? ORDER BY claim_id
            `, [schoolId]);
        },

        findClaimsByStar(starId) {
            return claims(db, `SELECT * FROM claims ORDER BY claim_id`).filter((claim) => {
                return claim.bodyStatus === 'ok' && Array.isArray(claim.body.relatedStars) && claim.body.relatedStars.includes(starId);
            });
        },

        findClaimsByPalace(palaceId) {
            return claims(db, `SELECT * FROM claims ORDER BY claim_id`).filter((claim) => {
                return claim.bodyStatus === 'ok' && Array.isArray(claim.body.relatedPalaces) && claim.body.relatedPalaces.includes(palaceId);
            });
        },

        getSourceReferences(claimId) {
            const found = db.prepare(`SELECT claim_id FROM claims WHERE claim_id = ?`).get(claimId);
            const references = db.prepare(`
                SELECT source_id AS sourceId, edition_id AS editionId, chapter, section, page, location, support_type AS supportType
                FROM claim_sources
                WHERE claim_id = ?
                ORDER BY id
            `).all(claimId);
            return {
                claimId,
                claimFound: Boolean(found),
                references,
                missingSource: references.length === 0
            };
        },

        getClaimDependencies(claimId) {
            const found = db.prepare(`SELECT claim_id FROM claims WHERE claim_id = ?`).get(claimId);
            const rows = db.prepare(`
                SELECT from_claim_id, to_claim_id, relation
                FROM claim_links
                WHERE from_claim_id = ? OR to_claim_id = ?
                ORDER BY relation, from_claim_id, to_claim_id
            `).all(claimId, claimId);
            const supports = [];
            const contradicts = [];
            for (const row of rows) {
                const direction = row.from_claim_id === claimId ? 'outgoing' : 'incoming';
                const otherId = row.from_claim_id === claimId ? row.to_claim_id : row.from_claim_id;
                const item = { claimId: otherId, direction };
                if (row.relation === 'supports') supports.push(item);
                if (row.relation === 'contradicts') contradicts.push(item);
            }
            return { claimId, claimFound: Boolean(found), supports, contradicts };
        },

        getVerificationStatuses(claimId) {
            const row = db.prepare(`
                SELECT implementation_status, formula_status, bibliographic_status, interpretation_status
                FROM claims WHERE claim_id = ?
            `).get(claimId);
            if (!row) {
                return {
                    claimId,
                    found: false,
                    implementationStatus: null,
                    formulaStatus: null,
                    bibliographicStatus: null,
                    interpretationStatus: null
                };
            }
            return {
                claimId,
                found: true,
                implementationStatus: row.implementation_status,
                formulaStatus: row.formula_status,
                bibliographicStatus: row.bibliographic_status,
                interpretationStatus: row.interpretation_status
            };
        }
    };
}
