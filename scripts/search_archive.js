/**
 * search_archive.js
 *
 * Search your episode archive by keyword.
 * Shows matching episodes, files, and text chunks.
 *
 * Usage:
 *   node scripts/search_archive.js <term>
 *   node scripts/search_archive.js "cabernet"
 *   node scripts/search_archive.js "episode 200"
 *   node scripts/search_archive.js --episode 212     (show everything for one episode)
 */

import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');

function searchAll(term) {
  const db = new Database(DB_PATH);
  const like = `%${term.toLowerCase()}%`;

  // 1. Match episodes by title or summary
  const episodes = db.prepare(`
    SELECT episode_number, slug, title, status, publish_date, summary
    FROM episodes
    WHERE LOWER(title) LIKE ?
       OR LOWER(summary) LIKE ?
       OR LOWER(slug) LIKE ?
    ORDER BY episode_number DESC
    LIMIT 10
  `).all(like, like, like);

  // 2. Match indexed files
  const files = db.prepare(`
    SELECT filename, filepath, file_category, episode_slug, modified_at
    FROM indexed_files
    WHERE LOWER(filename) LIKE ?
       OR LOWER(keywords) LIKE ?
    ORDER BY modified_at DESC
    LIMIT 15
  `).all(like, like);

  // 3. Match text chunks (transcripts, show notes ingested as text)
  const chunks = db.prepare(`
    SELECT source_type, source_id, chunk_text
    FROM content_chunks
    WHERE LOWER(chunk_text) LIKE ?
    LIMIT 5
  `).all(like);

  const totalResults = episodes.length + files.length + chunks.length;

  if (totalResults === 0) {
    console.log(`\nNo results found for: "${term}"`);
    console.log('Try a different term, or run --scan to update the file index.\n');
    db.close();
    return;
  }

  console.log(`\nSearch results for: "${term}"\n`);

  if (episodes.length > 0) {
    console.log(`--- EPISODES (${episodes.length}) ---`);
    for (const e of episodes) {
      console.log(`  ${e.slug}  ${e.title}  [${e.status}]  ${e.publish_date || ''}`);
      if (e.summary) console.log(`    ${e.summary.slice(0, 120)}...`);
    }
    console.log();
  }

  if (files.length > 0) {
    console.log(`--- FILES ON DISK (${files.length}) ---`);
    for (const f of files) {
      console.log(`  [${f.file_category}]  ${f.filename}`);
      console.log(`    ${f.filepath}`);
      if (f.episode_slug) console.log(`    Episode: ${f.episode_slug}`);
    }
    console.log();
  }

  if (chunks.length > 0) {
    console.log(`--- TEXT MATCHES IN TRANSCRIPTS/NOTES (${chunks.length}) ---`);
    for (const c of chunks) {
      const excerpt = c.chunk_text.slice(0, 200).replace(/\s+/g, ' ');
      console.log(`  [${c.source_type}]  ${c.source_id}`);
      console.log(`  ...${excerpt}...`);
      console.log();
    }
  }

  db.close();
}

function showEpisode(identifier) {
  const db = new Database(DB_PATH);

  // Accept either episode number or slug
  const isNum = /^\d+$/.test(identifier);
  const episode = isNum
    ? db.prepare('SELECT * FROM episodes WHERE episode_number = ?').get(parseInt(identifier, 10))
    : db.prepare('SELECT * FROM episodes WHERE slug = ?').get(identifier);

  if (!episode) {
    console.log(`\nNo episode found for: ${identifier}\n`);
    db.close();
    return;
  }

  const assets = db.prepare('SELECT * FROM assets WHERE episode_id = ? ORDER BY asset_type').all(episode.id);
  const wines  = db.prepare('SELECT * FROM wines WHERE episode_id = ?').all(episode.id);

  console.log(`\n=== ${episode.slug.toUpperCase()} — ${episode.title} ===`);
  console.log(`Status: ${episode.status}  |  Published: ${episode.publish_date || 'unknown'}`);
  if (episode.summary) console.log(`Summary: ${episode.summary}`);
  console.log();

  if (assets.length > 0) {
    console.log('Files:');
    for (const a of assets) {
      console.log(`  [${a.asset_type}]  ${a.path}`);
    }
    console.log();
  }

  if (wines.length > 0) {
    console.log('Wines:');
    for (const w of wines) {
      console.log(`  ${w.wine_name}${w.producer ? ' — ' + w.producer : ''}${w.vintage ? ' ' + w.vintage : ''}${w.region ? ' (' + w.region + ')' : ''}`);
    }
    console.log();
  }

  if (!assets.length && !wines.length) {
    console.log('No files or wines linked yet.');
    console.log('Add a transcript: node scripts/ingest_episode.js --number', episode.episode_number, '--transcript /path/to/file.txt');
    console.log();
  }

  db.close();
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.includes('--episode')) {
  const id = args[args.indexOf('--episode') + 1];
  if (!id) { console.log('Usage: node scripts/search_archive.js --episode <number>'); process.exit(1); }
  showEpisode(id);
} else if (args.length > 0) {
  searchAll(args.join(' '));
} else {
  console.log('Usage:');
  console.log('  node scripts/search_archive.js <search term>');
  console.log('  node scripts/search_archive.js --episode <number>');
  console.log('\nExamples:');
  console.log('  node scripts/search_archive.js cabernet');
  console.log('  node scripts/search_archive.js --episode 212');
}
