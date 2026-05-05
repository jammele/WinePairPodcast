/**
 * read_prompt.js
 *
 * Shows a saved prompt from the local database.
 * Prompts are synced from Google Drive by ingest_prompts.js.
 *
 * Usage:
 *   node scripts/read_prompt.js --list
 *   node scripts/read_prompt.js blue-sky-prompt
 *   node scripts/read_prompt.js episode-title-prompt
 */

import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');

const db = new Database(DB_PATH);

// Check table exists
const hasTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='prompts'").get();
if (!hasTable) {
  console.log('\nNo prompts ingested yet.');
  console.log('Run: node scripts/ingest_prompts.js\n');
  process.exit(0);
}

const args = process.argv.slice(2);

if (args.includes('--list') || args.length === 0) {
  const prompts = db.prepare('SELECT name, label, last_synced_at FROM prompts ORDER BY label').all();
  if (prompts.length === 0) {
    console.log('\nNo prompts found. Run: node scripts/ingest_prompts.js\n');
  } else {
    console.log(`\nSaved prompts (${prompts.length}):\n`);
    for (const p of prompts) {
      console.log(`  ${p.name}`);
      console.log(`    ${p.label}  |  Last synced: ${p.last_synced_at?.slice(0, 10)}`);
    }
    console.log('\nRead a prompt: node scripts/read_prompt.js <name>\n');
  }
} else {
  const name = args[0];
  const prompt = db.prepare('SELECT * FROM prompts WHERE name = ? OR label LIKE ?').get(name, `%${name}%`);
  if (!prompt) {
    console.log(`\nPrompt not found: "${name}"`);
    console.log('Run --list to see available prompts.\n');
  } else {
    console.log(`\n=== ${prompt.label} ===`);
    console.log(`Last synced: ${prompt.last_synced_at?.slice(0, 10)}`);
    console.log(`Local file:  ${prompt.local_path}`);
    console.log('\n' + prompt.content + '\n');
  }
}

db.close();
