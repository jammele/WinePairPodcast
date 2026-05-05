/**
 * update_episode_titles.js
 *
 * Reads episode script filenames from the Google Drive index and updates
 * each episode's title in the database with the real title.
 *
 * Usage:
 *   node scripts/update_episode_titles.js --preview   (show what would change, no writes)
 *   node scripts/update_episode_titles.js             (apply the updates)
 */

import Database from 'better-sqlite3';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');

function cleanTitle(filename) {
  // Remove extension
  let title = basename(filename, extname(filename));

  // Strip leading patterns like:
  //   "EPISODE #212  Alentejo"  -> "Alentejo"
  //   "Episode 141  WTF is Furmint"  -> "WTF is Furmint"
  //   "Episode 109  Is Josh Wine Worth the Fuss"  -> "Is Josh Wine Worth the Fuss"
  //   "Copy of Episode 103  Best and Worst Wines of 2023" -> "Best and Worst Wines of 2023"
  title = title.replace(/^copy\s+of\s+/i, '');
  title = title.replace(/^(?:EPISODE|Episode)\s*#?\s*\d+\s*[:\-–—]?\s*/i, '');

  // Clean up extra whitespace and trailing punctuation
  title = title.trim().replace(/\s+/g, ' ');

  return title;
}

const db = new Database(DB_PATH);
const preview = process.argv.includes('--preview');

// Get all indexed .gdoc files from the Episodes folder or root Phase 2 that have an episode slug
const candidates = db.prepare(`
  SELECT filename, episode_slug, filepath, modified_at
  FROM indexed_files
  WHERE episode_slug IS NOT NULL
    AND file_ext = '.gdoc'
    AND (
      LOWER(filepath) LIKE '%phase 2/episode%'
      OR LOWER(filepath) LIKE '%phase 2/episodes/%'
      OR LOWER(filepath) LIKE '%phase 2/episode #%'
    )
  ORDER BY episode_slug
`).all();

// For each slug, pick the best candidate (prefer files in root Phase 2, then Episodes/)
// and skip any that look like social or other non-script docs
const bySlug = {};
for (const c of candidates) {
  const lpath = c.filepath.toLowerCase();
  // Skip social, sponsorship, etc.
  if (/social|sponsorship|newsletter|blog|transcript|kbfg|ktah/i.test(lpath)) continue;
  if (!bySlug[c.episode_slug]) {
    bySlug[c.episode_slug] = c;
  } else {
    // Prefer more recently modified
    if (c.modified_at > bySlug[c.episode_slug].modified_at) {
      bySlug[c.episode_slug] = c;
    }
  }
}

const updates = [];
for (const [slug, file] of Object.entries(bySlug)) {
  const newTitle = cleanTitle(file.filename);
  if (!newTitle || newTitle.length < 2) continue;

  const existing = db.prepare('SELECT title FROM episodes WHERE slug = ?').get(slug);
  if (!existing) continue;

  // Only update if title is still a placeholder like "Episode 212"
  const isPlaceholder = /^Episode \d+$/i.test(existing.title);
  const changed = existing.title !== newTitle;

  if (isPlaceholder || changed) {
    updates.push({ slug, oldTitle: existing.title, newTitle, source: file.filename });
  }
}

if (updates.length === 0) {
  console.log('\nNo title updates needed. All episodes already have real titles.\n');
  db.close();
  process.exit(0);
}

if (preview) {
  console.log(`\nTitle updates that would be applied (${updates.length}):\n`);
  for (const u of updates) {
    console.log(`  ${u.slug}`);
    console.log(`    Before: ${u.oldTitle}`);
    console.log(`    After:  ${u.newTitle}`);
    console.log();
  }
  console.log('Run without --preview to apply.\n');
} else {
  const updateStmt = db.prepare('UPDATE episodes SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?');
  const applyAll = db.transaction((items) => {
    for (const u of items) updateStmt.run(u.newTitle, u.slug);
  });
  applyAll(updates);
  console.log(`\nUpdated ${updates.length} episode titles.\n`);
  for (const u of updates) {
    console.log(`  ${u.slug}  ->  ${u.newTitle}`);
  }
  console.log();
}

db.close();
