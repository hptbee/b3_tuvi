import { getDb, parseJson } from './sqlite.js';

function palaceMeaningsToJson(value) {
    if (value instanceof Map) return JSON.stringify(Object.fromEntries(value));
    return JSON.stringify(value || {});
}

export function upsertStar(doc) {
    const db = getDb();
    db.prepare(`
        INSERT INTO stars (name, element, group_name, basic_meaning, palace_meanings, rules, updated_at)
        VALUES (@name, @element, @group_name, @basic_meaning, @palace_meanings, @rules, datetime('now'))
        ON CONFLICT(name) DO UPDATE SET
            element = excluded.element,
            group_name = excluded.group_name,
            basic_meaning = excluded.basic_meaning,
            palace_meanings = excluded.palace_meanings,
            rules = excluded.rules,
            updated_at = datetime('now')
    `).run({
        name: doc.name,
        element: doc.element || '',
        group_name: doc.group || doc.group_name || '',
        basic_meaning: doc.basic_meaning,
        palace_meanings: palaceMeaningsToJson(doc.palace_meanings),
        rules: JSON.stringify(doc.rules || [])
    });
}

export function findStarByName(name) {
    const row = getDb().prepare('SELECT * FROM stars WHERE name = ?').get(name);
    if (!row) return null;
    return {
        name: row.name,
        element: row.element,
        group: row.group_name,
        basic_meaning: row.basic_meaning,
        palace_meanings: parseJson(row.palace_meanings, {}),
        rules: parseJson(row.rules, [])
    };
}

export function countStars() {
    return getDb().prepare('SELECT COUNT(*) AS n FROM stars').get().n;
}

export function upsertPalace(doc) {
    getDb().prepare(`
        INSERT INTO palaces (palace_name, short_name, core_meaning, life_aspect, keywords, updated_at)
        VALUES (@palace_name, @short_name, @core_meaning, @life_aspect, @keywords, datetime('now'))
        ON CONFLICT(palace_name) DO UPDATE SET
            short_name = excluded.short_name,
            core_meaning = excluded.core_meaning,
            life_aspect = excluded.life_aspect,
            keywords = excluded.keywords,
            updated_at = datetime('now')
    `).run({
        palace_name: doc.palace_name,
        short_name: doc.short_name || '',
        core_meaning: doc.core_meaning,
        life_aspect: JSON.stringify(doc.life_aspect || []),
        keywords: JSON.stringify(doc.keywords || [])
    });
}

export function findPalaceByName(palaceName) {
    const row = getDb().prepare('SELECT * FROM palaces WHERE palace_name = ?').get(palaceName);
    if (!row) return null;
    return {
        palace_name: row.palace_name,
        short_name: row.short_name,
        core_meaning: row.core_meaning,
        life_aspect: parseJson(row.life_aspect, []),
        keywords: parseJson(row.keywords, [])
    };
}

export function countPalaces() {
    return getDb().prepare('SELECT COUNT(*) AS n FROM palaces').get().n;
}

export function insertHoroscope(doc) {
    const db = getDb();
    const result = db.prepare(`
        INSERT INTO horoscopes (user_id, input_data, lunar_data, full_chart, is_public, notes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
        doc.user_id || null,
        JSON.stringify(doc.input_data),
        JSON.stringify(doc.lunar_data || {}),
        JSON.stringify(doc.full_chart),
        doc.is_public ? 1 : 0,
        doc.notes || ''
    );
    return { id: Number(result.lastInsertRowid), ...doc };
}

export function countHoroscopes() {
    return getDb().prepare('SELECT COUNT(*) AS n FROM horoscopes').get().n;
}

function rowToCombination(row) {
    return {
        name: row.name,
        type: row.type,
        description: row.description,
        logic_conditions: parseJson(row.logic_conditions, {}),
        verification_status: row.verification_status,
        disclaimer: row.disclaimer,
        notes: row.notes,
        interpretations: parseJson(row.interpretations, []),
        tags: parseJson(row.tags, [])
    };
}

export function upsertCombination(doc) {
    getDb().prepare(`
        INSERT INTO combinations (
            name, type, description, logic_conditions, verification_status,
            disclaimer, notes, interpretations, tags, updated_at
        )
        VALUES (
            @name, @type, @description, @logic_conditions, @verification_status,
            @disclaimer, @notes, @interpretations, @tags, datetime('now')
        )
        ON CONFLICT(name) DO UPDATE SET
            type = excluded.type,
            description = excluded.description,
            logic_conditions = excluded.logic_conditions,
            verification_status = excluded.verification_status,
            disclaimer = excluded.disclaimer,
            notes = excluded.notes,
            interpretations = excluded.interpretations,
            tags = excluded.tags,
            updated_at = datetime('now')
    `).run({
        name: doc.name,
        type: doc.type,
        description: doc.description,
        logic_conditions: JSON.stringify(doc.logic_conditions || {}),
        verification_status: doc.verification_status || 'provisional',
        disclaimer: doc.disclaimer || '',
        notes: doc.notes || '',
        interpretations: JSON.stringify(doc.interpretations || []),
        tags: JSON.stringify(doc.tags || [])
    });
}

export function listCombinations(filter = {}) {
    const db = getDb();
    let rows;
    if (filter.type) {
        rows = db.prepare('SELECT * FROM combinations WHERE type = ? ORDER BY name').all(filter.type);
    } else {
        rows = db.prepare('SELECT * FROM combinations ORDER BY name').all();
    }
    return rows.map(rowToCombination);
}

export function countCombinations() {
    return getDb().prepare('SELECT COUNT(*) AS n FROM combinations').get().n;
}

export function combinationTypeStats() {
    return getDb().prepare(`
        SELECT type AS _id, COUNT(*) AS count FROM combinations GROUP BY type ORDER BY type
    `).all();
}

export function deleteAllStars() {
    return getDb().prepare('DELETE FROM stars').run().changes;
}

export function deleteAllPalaces() {
    return getDb().prepare('DELETE FROM palaces').run().changes;
}

export function deleteAllCombinations() {
    return getDb().prepare('DELETE FROM combinations').run().changes;
}

export function deleteAllHoroscopes() {
    return getDb().prepare('DELETE FROM horoscopes').run().changes;
}
