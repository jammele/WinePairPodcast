/**
 * ingest_prompts.js
 *
 * Reads every Google Doc in the Prompts folder from Google Drive,
 * saves them as plain text files in data/prompts/,
 * and registers them in the database.
 *
 * Run this after setup_google_auth.js has been completed.
 * Safe to re-run -- updates existing files with latest content.
 *
 * Usage:  node scripts/ingest_prompts.js
 */

import { readGoogleDoc } from './read_gdoc.js';
import Database from 'better-sqlite3';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');
const PROMPTS_DIR = join(ROOT, 'data', 'prompts');

mkdirSync(PROMPTS_DIR, { recursive: true });

// All 15 prompts from G:/My Drive/Wine Podcast/Phase 2/Prompts/
// IDs extracted from the Google DriveFS metadata database.
const PROMPT_DOCS = [
  { name: 'ai-discoverability-pillar-strategy',  docId: '1nMUkukMZuH8GtVTLV_Qc16sCKK3oIC9m3bMnUTykuMI', label: 'AI Discoverability & Pillar Strategy' },
  { name: 'april-3-cover-art-agent',             docId: '1XdikJN3D6OPqCUZUIJtO7Qy9psigsLei5SiNzBOr3gs', label: 'April 3 Cover Art Agent' },
  { name: 'blue-sky-prompt',                     docId: '1Kc_hs13Da8y9Vu2gStY5pR_-urWrTXGJP8H8UaclDXI', label: 'Blue Sky Prompt' },
  { name: 'cartoon-prompt',                      docId: '1bg6voltfp7QDXGu5pOns4AbR17y7knMl5zYSHVTGaMs', label: 'Cartoon Prompt' },
  { name: 'cover-art-prompt-instructions',       docId: '1uXgXzVnXXZmDclxQ04pa8WIbtpokHde-GkoDBKlF3Ks', label: 'Cover Art Prompt Instructions' },
  { name: 'episode-title-prompt',                docId: '1D4klCn2K2p7Y1rl7R_Ay7YQuAZfI1_5oMIDM-rZ2cEY', label: 'Episode Title Prompt' },
  { name: 'cover-art-cartoon-agent-instructions',docId: '1cAxZSvd6EHMQuRZR2gCTy16MYzp8y49ZfPy-iAnYNB0', label: 'Instructions for Cover Art & Cartoon Agent' },
  { name: 'intro-banter-prompt',                 docId: '1gA9ZfoDOkdhLDoPhPituCesQffqj43IJnOOEAkT2N7Y', label: 'Intro Banter Prompt' },
  { name: 'notebooklm-prompt',                   docId: '1M3TGBFbDXBO7iuIUz6dRYDXZjGMaCNmQKaOYTwIhshI', label: 'NotebookLM Prompt' },
  { name: 'podcast-agent-art-gem',               docId: '1H1tPyj_owRvMBiv0zEhSsKSRkOwE-miXn1qtBiVddKg', label: 'Podcast Agent Art Gem' },
  { name: 'qa-blocks-prompt',                    docId: '1Muy2_xVVFUOG9FNQqYBhQlZU2Al8ceGcKi8g4i4Ao2Q', label: 'Q&A Blocks Prompt for Episodes' },
  { name: 'show-description-prompt',             docId: '17Md_Xt6NS6QATjiWlNGWeCgnnskgx9XiHFrAF1Xyn8E', label: 'Show Description Prompt' },
  { name: 'social-hashtags-prompt',              docId: '1FNmyIpCnQdlUdY6Uek9NKmKCj7PqT-ZyyJUPAaAp5-c', label: 'Social Hashtags Prompt' },
  { name: 'cover-art-system',                    docId: '1EnmTDoeG9mWc6tHAP2KyonVryTy-mLg5Qipn9fxvkRw', label: 'The Wine Pair Podcast Cover Art System' },
  { name: 'wine-in-the-news-prompt',             docId: '1Dzkx9xt-MERneHQc0mjHNLgGSGqA_DeU-SLm6yA3Ovg', label: 'Wine in the News Prompt' },
];

const db = new Database(DB_PATH);

// Ensure prompts table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    label TEXT,
    doc_id TEXT,
    local_path TEXT,
    content TEXT,
    last_synced_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

const upsert = db.prepare(`
  INSERT INTO prompts (name, label, doc_id, local_path, content, last_synced_at)
  VALUES (@name, @label, @doc_id, @local_path, @content, @last_synced_at)
  ON CONFLICT(name) DO UPDATE SET
    content        = excluded.content,
    last_synced_at = excluded.last_synced_at
`);

console.log('\nIngesting prompts from Google Drive...\n');

let succeeded = 0;
let failed = 0;

for (const prompt of PROMPT_DOCS) {
  try {
    const doc = await readGoogleDoc(prompt.docId);
    const filename = `${prompt.name}.md`;
    const localPath = join(PROMPTS_DIR, filename);

    const fileContent = `# ${doc.title}\n\n<!-- Source: Google Doc ${prompt.docId} -->\n<!-- Last synced: ${new Date().toISOString()} -->\n\n${doc.text}`;
    writeFileSync(localPath, fileContent, 'utf8');

    upsert.run({
      name: prompt.name,
      label: prompt.label,
      doc_id: prompt.docId,
      local_path: localPath.replace(/\\/g, '/'),
      content: doc.text,
      last_synced_at: new Date().toISOString(),
    });

    console.log(`  [ok]  ${prompt.label}`);
    console.log(`        Saved to: data/prompts/${filename}`);
    succeeded++;
  } catch (err) {
    console.error(`  [fail] ${prompt.label}: ${err.message}`);
    failed++;
  }
}

console.log(`\nDone. ${succeeded} prompts ingested, ${failed} failed.`);
if (succeeded > 0) {
  console.log(`Prompts saved to: ${PROMPTS_DIR}`);
  console.log('To read a prompt:  node scripts/read_prompt.js <name>');
  console.log('To list prompts:   node scripts/read_prompt.js --list');
}

db.close();
