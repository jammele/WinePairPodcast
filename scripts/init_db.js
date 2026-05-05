/**
 * init_db.js
 * Creates (or re-verifies) the SQLite database from schema.sql.
 * Safe to run multiple times -- uses CREATE TABLE IF NOT EXISTS.
 *
 * Usage:  node scripts/init_db.js
 */

import Database from 'better-sqlite3';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const DB_PATH   = join(ROOT, 'db', 'podcast_os.db');
const SCHEMA    = join(ROOT, 'db', 'schema.sql');

// Make sure the db folder exists
mkdirSync(join(ROOT, 'db'), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode: faster writes, safer on Windows
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const sql = readFileSync(SCHEMA, 'utf8');

// Execute all CREATE TABLE statements in one go
db.exec(sql);

// Quick verification: list tables
const tables = db.prepare(
  `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
).all().map(r => r.name);

console.log('\nPodcast OS database initialized.');
console.log('Location:', DB_PATH);
console.log('Tables:', tables.join(', '));
console.log('\nDone. Run this again any time -- it is safe to re-run.\n');

db.close();
