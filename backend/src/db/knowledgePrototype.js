import fs from 'fs';
import os from 'os';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const PROTOTYPE_SQL = `
CREATE TABLE IF NOT EXISTS kb_prototype_meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
  source_id TEXT PRIMARY KEY,
  title TEXT,
  author TEXT,
  bibliographic_status TEXT
);

CREATE TABLE IF NOT EXISTS editions (
  edition_id TEXT PRIMARY KEY,
  source_id TEXT REFERENCES sources(source_id),
  publisher TEXT,
  publication_year INTEGER,
  page_count INTEGER,
  authenticated INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS claims (
  claim_id TEXT PRIMARY KEY,
  school_id TEXT,
  body_json TEXT NOT NULL,
  implementation_status TEXT NOT NULL,
  formula_status TEXT NOT NULL,
  bibliographic_status TEXT NOT NULL,
  interpretation_status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS claim_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id TEXT NOT NULL REFERENCES claims(claim_id),
  source_id TEXT NOT NULL REFERENCES sources(source_id),
  edition_id TEXT REFERENCES editions(edition_id),
  chapter TEXT,
  section TEXT,
  page INTEGER,
  location TEXT,
  support_type TEXT
);

CREATE TABLE IF NOT EXISTS claim_links (
  from_claim_id TEXT NOT NULL REFERENCES claims(claim_id),
  to_claim_id TEXT NOT NULL REFERENCES claims(claim_id),
  relation TEXT NOT NULL CHECK (relation IN ('contradicts', 'supports')),
  PRIMARY KEY (from_claim_id, to_claim_id, relation)
);

CREATE TABLE IF NOT EXISTS claim_revisions (
  claim_id TEXT NOT NULL REFERENCES claims(claim_id),
  version INTEGER NOT NULL,
  body_json TEXT NOT NULL,
  edited_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (claim_id, version)
);

CREATE TABLE IF NOT EXISTS combination_claims (
  combination_name TEXT NOT NULL,
  claim_id TEXT NOT NULL REFERENCES claims(claim_id),
  PRIMARY KEY (combination_name, claim_id)
);

CREATE TABLE IF NOT EXISTS school_variants (
  school_id TEXT PRIMARY KEY,
  note TEXT
);
`;

function stripTrailingDots(resolved) {
    const parts = resolved.split(path.sep);
    return parts.map((seg, index) => (index === 0 ? seg : seg.replace(/[.\s]+$/u, ''))).join(path.sep);
}

function isUnder(child, parent) {
    const foldedChild = child.toLowerCase();
    const foldedParent = parent.toLowerCase();
    return foldedChild === foldedParent || foldedChild.startsWith(foldedParent + path.sep);
}

function refusesDataDir(candidate) {
    const folded = candidate.toLowerCase();
    const marker = `${path.sep}backend${path.sep}data`.toLowerCase();
    return folded.includes(marker);
}

export function assertSafePrototypePath(dbPath) {
    const stripped = stripTrailingDots(path.resolve(dbPath));
    if (refusesDataDir(stripped)) {
        throw new Error(`knowledge prototype refuses ${stripped}`);
    }
    const tmpRoot = fs.realpathSync(os.tmpdir());
    const parent = path.dirname(stripped);
    let ancestor = parent;
    while (!fs.existsSync(ancestor)) {
        const next = path.dirname(ancestor);
        if (next === ancestor) break;
        ancestor = next;
    }
    const realAncestor = fs.realpathSync(ancestor);
    if (!isUnder(realAncestor, tmpRoot) || refusesDataDir(realAncestor)) {
        throw new Error(`knowledge prototype refuses ${stripped}`);
    }
    fs.mkdirSync(parent, { recursive: true });
    const realParent = fs.realpathSync(parent);
    if (!isUnder(realParent, tmpRoot) || refusesDataDir(realParent)) {
        throw new Error(`knowledge prototype refuses ${stripped}`);
    }
    return path.join(realParent, path.basename(stripped));
}

export function applyKnowledgePrototype(dbPath) {
    const resolved = assertSafePrototypePath(dbPath);
    const db = new DatabaseSync(resolved);
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('BEGIN IMMEDIATE');
    try {
        db.exec(PROTOTYPE_SQL);
        db.prepare(`
            INSERT INTO kb_prototype_meta (key, value) VALUES ('version', '1')
            ON CONFLICT(key) DO NOTHING
        `).run();
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        db.close();
        throw error;
    }
    const version = db.prepare(`SELECT value FROM kb_prototype_meta WHERE key = 'version'`).get();
    const claims = db.prepare('SELECT COUNT(*) AS n FROM claims').get().n;
    db.close();
    return { path: resolved, version: version.value, claims };
}
