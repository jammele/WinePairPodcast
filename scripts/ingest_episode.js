/**
 * ingest_episode.js
 *
 * Registers an episode in the database and copies (or links) files into
 * the organized archive folder.
 *
 * Plain English: run this once for each episode to "check it in" to the system.
 * After that, the system knows where everything is and won't ask you again.
 *
 * Usage:
 *   node scripts/ingest_episode.js --number 212 --title "Primitivo" --status published
 *   node scripts/ingest_episode.js --number 212 --audio "C:/path/to/file.mp3"
 *   node scripts/ingest_episode.js --number 212 --transcript "C:/path/to/transcript.txt"
 *   node scripts/ingest_episode.js --list   (show all ingested episodes)
 *   node scripts/ingest_episode.js --auto   (scan indexed files and auto-register episodes found)
 *
 * Any combination of flags can be combined.
 */

import Database from 'better-sqlite3';
import { existsSync, mkdirSync, copyFileSync, readFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');
const ARCHIVE = join(ROOT, 'archive');

function slugFromNumber(n) {
  return `ep${String(n).padStart(3, '0')}`;
}

function ensureEpisodeFolder(slug) {
  const folder = join(ARCHIVE, slug);
  mkdirSync(folder, { recursive: true });
  return folder;
}

function copyToArchive(sourcePath, episodeFolder, category) {
  const filename = basename(sourcePath);
  const dest = join(episodeFolder, filename);
  if (!existsSync(dest)) {
    copyFileSync(sourcePath, dest);
    console.log(`  Copied [${category}]: ${filename}`);
  } else {
    console.log(`  Already exists [${category}]: ${filename}`);
  }
  return dest.replace(/\\/g, '/');
}

function upsertEpisode(db, fields) {
  const existing = db.prepare('SELECT id FROM episodes WHERE slug = ?').get(fields.slug);
  if (existing) {
    // Update only fields that were provided
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(fields)) {
      if (k !== 'slug' && v !== undefined && v !== null) {
        sets.push(`${k} = ?`);
        vals.push(v);
      }
    }
    sets.push('updated_at = CURRENT_TIMESTAMP');
    vals.push(fields.slug);
    if (sets.length > 1) {
      db.prepare(`UPDATE episodes SET ${sets.join(', ')} WHERE slug = ?`).run(...vals);
    }
    return existing.id;
  } else {
    const result = db.prepare(`
      INSERT INTO episodes (episode_number, slug, title, publish_date, status, summary, audio_path, transcript_path, show_notes_path)
      VALUES (@episode_number, @slug, @title, @publish_date, @status, @summary, @audio_path, @transcript_path, @show_notes_path)
    `).run(fields);
    return result.lastInsertRowid;
  }
}

function registerAsset(db, episodeId, assetType, path, sourceOrigin, modifiedAt) {
  db.prepare(`
    INSERT INTO assets (episode_id, asset_type, path, source_origin, modified_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT DO NOTHING
  `).run(episodeId, assetType, path, sourceOrigin, modifiedAt || new Date().toISOString());
}

function ingestChunks(db, episodeId, slug, filePath, assetType) {
  // Read text files and split into ~500-word chunks for search
  const ext = extname(filePath).toLowerCase();
  if (!['.txt', '.md', '.rtf'].includes(ext)) return;
  let text;
  try { text = readFileSync(filePath, 'utf8'); } catch { return; }

  const words = text.split(/\s+/);
  const chunkSize = 500;
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(' ');
    db.prepare(`
      INSERT INTO content_chunks (source_type, source_id, chunk_text)
      VALUES (?, ?, ?)
    `).run(assetType, slug, chunk);
  }
  console.log(`  Indexed ${Math.ceil(words.length / chunkSize)} text chunk(s) for search.`);
}

// ---------------------------------------------------------------------------
// Auto-ingest: find episodes from indexed_files and register them
// ---------------------------------------------------------------------------
function autoIngest() {
  const db = new Database(DB_PATH);

  // Find all audio files that have an episode number
  const audioFiles = db.prepare(`
    SELECT filepath, filename, episode_slug, modified_at
    FROM indexed_files
    WHERE file_category = 'audio'
      AND episode_slug IS NOT NULL
      AND episode_slug != ''
    ORDER BY episode_slug, modified_at DESC
  `).all();

  if (audioFiles.length === 0) {
    console.log('No audio files with episode numbers found in the index.');
    console.log('Run: node scripts/find_source_files.js --scan  first.');
    db.close();
    return;
  }

  // Group by episode slug and prefer the base file (no KTAH/KBFG suffix)
  const bySlug = {};
  for (const f of audioFiles) {
    if (!bySlug[f.episode_slug]) bySlug[f.episode_slug] = [];
    bySlug[f.episode_slug].push(f);
  }

  let registered = 0;
  for (const [slug, files] of Object.entries(bySlug)) {
    // Prefer the file without a radio station suffix
    const primary = files.find(f => !/_KTAH|_KBFG/i.test(f.filename)) || files[0];
    const epNum = parseInt(slug.replace('ep', ''), 10);
    const folder = ensureEpisodeFolder(slug);

    // Guess publish date from filename (format: MMDDYYYY or MMDDYY)
    const dateMatch = primary.filename.match(/(\d{2})(\d{2})(\d{2,4})/);
    let publishDate = null;
    if (dateMatch) {
      const year = dateMatch[3].length === 2 ? '20' + dateMatch[3] : dateMatch[3];
      publishDate = `${year}-${dateMatch[1]}-${dateMatch[2]}`;
    }

    const fields = {
      episode_number: epNum,
      slug,
      title: `Episode ${epNum}`,   // placeholder -- update manually or via ingest
      publish_date: publishDate,
      status: 'published',
      summary: null,
      audio_path: primary.filepath,
      transcript_path: null,
      show_notes_path: null,
    };

    const episodeId = upsertEpisode(db, fields);
    registerAsset(db, episodeId, 'audio', primary.filepath, 'drive_scan', primary.modified_at);

    // Register all variants (radio station edits etc.)
    for (const f of files) {
      if (f.filepath !== primary.filepath) {
        registerAsset(db, episodeId, 'audio', f.filepath, 'drive_scan', f.modified_at);
      }
    }

    // Look for matching transcripts or show notes by episode slug
    const related = db.prepare(`
      SELECT filepath, filename, file_category, modified_at
      FROM indexed_files
      WHERE episode_slug = ? AND file_category IN ('transcript', 'show_notes', 'research')
    `).all(slug);

    for (const r of related) {
      registerAsset(db, episodeId, r.file_category, r.filepath, 'drive_scan', r.modified_at);
    }

    console.log(`  [${slug}] Episode ${epNum} registered. ${files.length} audio file(s).${related.length ? ` + ${related.length} related file(s).` : ''}`);
    registered++;
  }

  console.log(`\nAuto-ingest complete. ${registered} episodes registered.`);
  db.close();
}

// ---------------------------------------------------------------------------
// Manual ingest from CLI args
// ---------------------------------------------------------------------------
function manualIngest(args) {
  const db = new Database(DB_PATH);

  const getArg = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : null;
  };

  const number = getArg('--number');
  if (!number) {
    console.log('Error: --number <episode_number> is required.');
    console.log('Example: node scripts/ingest_episode.js --number 212 --title "Primitivo"');
    process.exit(1);
  }

  const slug = slugFromNumber(parseInt(number, 10));
  const folder = ensureEpisodeFolder(slug);

  const title    = getArg('--title');
  const status   = getArg('--status') || 'published';
  const date     = getArg('--date');
  const summary  = getArg('--summary');
  const audio    = getArg('--audio');
  const transcript = getArg('--transcript');
  const shownotes  = getArg('--shownotes');

  const fields = {
    episode_number: parseInt(number, 10),
    slug,
    title: title || `Episode ${number}`,
    publish_date: date || null,
    status,
    summary: summary || null,
    audio_path: null,
    transcript_path: null,
    show_notes_path: null,
  };

  if (audio && existsSync(audio)) {
    const dest = copyToArchive(audio, folder, 'audio');
    fields.audio_path = dest;
    const episodeId = upsertEpisode(db, fields);
    registerAsset(db, episodeId, 'audio', dest, 'manual');
  }
  if (transcript && existsSync(transcript)) {
    const dest = copyToArchive(transcript, folder, 'transcript');
    fields.transcript_path = dest;
    const episodeId = upsertEpisode(db, fields);
    registerAsset(db, episodeId, 'transcript', dest, 'manual');
    ingestChunks(db, episodeId, slug, dest, 'transcript');
  }
  if (shownotes && existsSync(shownotes)) {
    const dest = copyToArchive(shownotes, folder, 'show_notes');
    fields.show_notes_path = dest;
    const episodeId = upsertEpisode(db, fields);
    registerAsset(db, episodeId, 'show_notes', dest, 'manual');
    ingestChunks(db, episodeId, slug, dest, 'show_notes');
  }

  const episodeId = upsertEpisode(db, fields);
  console.log(`\nEpisode ${number} (${slug}) ingested. DB id: ${episodeId}`);
  console.log('Archive folder:', folder);
  db.close();
}

// ---------------------------------------------------------------------------
// List all episodes
// ---------------------------------------------------------------------------
function listEpisodes() {
  const db = new Database(DB_PATH);
  const rows = db.prepare(`
    SELECT e.episode_number, e.slug, e.title, e.status, e.publish_date,
           COUNT(a.id) as asset_count
    FROM episodes e
    LEFT JOIN assets a ON a.episode_id = e.id
    GROUP BY e.id
    ORDER BY e.episode_number DESC
  `).all();

  if (rows.length === 0) {
    console.log('No episodes ingested yet.');
    console.log('Run: node scripts/ingest_episode.js --auto');
  } else {
    console.log('\nIngested episodes:\n');
    for (const r of rows) {
      console.log(`  ${r.slug}  |  ${r.title}  |  ${r.status}  |  ${r.publish_date || 'no date'}  |  ${r.asset_count} asset(s)`);
    }
    console.log();
  }
  db.close();
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.includes('--list')) {
  listEpisodes();
} else if (args.includes('--auto')) {
  console.log('Auto-ingesting episodes from file index...\n');
  autoIngest();
} else if (args.includes('--number')) {
  manualIngest(args);
} else {
  console.log('Usage:');
  console.log('  node scripts/ingest_episode.js --auto                        (auto-register from file scan)');
  console.log('  node scripts/ingest_episode.js --number 212 --title "Title"  (manual ingest)');
  console.log('  node scripts/ingest_episode.js --number 212 --audio /path/to/file.mp3');
  console.log('  node scripts/ingest_episode.js --number 212 --transcript /path/to/file.txt');
  console.log('  node scripts/ingest_episode.js --list                        (show all episodes)');
}
