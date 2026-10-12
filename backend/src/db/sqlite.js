import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DB_PATH = path.join(__dirname, '../../data/tuvi.sqlite');

let db = null;
let ready = false;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS horoscopes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  input_data TEXT NOT NULL,
  lunar_data TEXT,
  full_chart TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS stars (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  element TEXT NOT NULL DEFAULT '',
  group_name TEXT NOT NULL DEFAULT '',
  basic_meaning TEXT NOT NULL,
  palace_meanings TEXT NOT NULL DEFAULT '{}',
  rules TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS palaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  palace_name TEXT NOT NULL UNIQUE,
  short_name TEXT NOT NULL DEFAULT '',
  core_meaning TEXT NOT NULL,
  life_aspect TEXT NOT NULL DEFAULT '[]',
  keywords TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS combinations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  logic_conditions TEXT NOT NULL DEFAULT '{}',
  verification_status TEXT NOT NULL DEFAULT 'provisional',
  disclaimer TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  interpretations TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_combinations_type ON combinations(type);
CREATE INDEX IF NOT EXISTS idx_horoscopes_created ON horoscopes(created_at);
`;

export function resolveDbPath() {
    return process.env.SQLITE_PATH
        ? path.resolve(process.env.SQLITE_PATH)
        : DEFAULT_DB_PATH;
}

export function initDatabase() {
    if (db) return db;
    const dbPath = resolveDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    db = new DatabaseSync(dbPath);
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec(SCHEMA);
    ready = true;
    console.log(`SQLite ready at ${dbPath}`);
    return db;
}

export function getDb() {
    if (!db) initDatabase();
    return db;
}

export function isDbReady() {
    return ready;
}

export function parseJson(text, fallback) {
    if (text == null || text === '') return fallback;
    try {
        return JSON.parse(text);
    } catch {
        return fallback;
    }
}
