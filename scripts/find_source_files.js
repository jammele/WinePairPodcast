/**
 * find_source_files.js
 *
 * Scans configured folder roots (Google Drive, OneDrive, or any local folder)
 * and indexes every relevant file into the database.
 *
 * After scanning, you can search for files without uploading them repeatedly.
 *
 * Usage:
 *   node scripts/find_source_files.js --scan           (full re-scan of all roots)
 *   node scripts/find_source_files.js --search <term>  (find files matching a term)
 *   node scripts/find_source_files.js --status         (show what roots are configured)
 *
 * To add a new folder root, edit drive_roots.json in the project root.
 */

import Database from 'better-sqlite3';
import { readdirSync, statSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DB_PATH = join(ROOT, 'db', 'podcast_os.db');
const ROOTS_CONFIG = join(ROOT, 'drive_roots.json');

// ---------------------------------------------------------------------------
// File types we care about for podcast work
// ---------------------------------------------------------------------------
const RELEVANT_EXTENSIONS = new Set([
  '.pdf', '.docx', '.doc', '.txt', '.md', '.rtf',
  '.mp3', '.m4a', '.wav', '.aiff', '.flac',
  '.mp4', '.mov',
  '.jpg', '.jpeg', '.png',
  '.xlsx', '.xls', '.csv',
  // Google Drive Desktop shortcut files -- filename = document title, which is all we need
  '.gdoc', '.gsheet', '.gslides', '.gdraw',
]);

// How we guess what category a file belongs to from its name
const CATEGORY_PATTERNS = [
  { pattern: /transcript|transcri/i,                    category: 'transcript' },
  { pattern: /show.?notes?|shownotes/i,                 category: 'show_notes' },
  { pattern: /research|brief|notes?|outline|script/i,   category: 'research' },
  { pattern: /\.(mp3|m4a|wav|aiff|flac)$/i,             category: 'audio' },
  { pattern: /sponsor|sponsorship|partner/i,            category: 'sponsor' },
  { pattern: /guest|pitch|interview/i,                  category: 'guest' },
  { pattern: /instagram|bluesky|twitter|social/i,       category: 'social' },
  { pattern: /episode|ep[\s_-]?\d+/i,                   category: 'research' },
];

// Patterns that tell us which episode a file might belong to
// Matches things like: ep12, episode-12, ep_12, EP12, Episode 12
// Matches: ep12, episode-12, ep_12, EP12, Episode 12, EPISODE #212
const EPISODE_PATTERN = /(?:ep|episode)\s*#?\s*(\d+)/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function guessCategory(filename) {
  for (const { pattern, category } of CATEGORY_PATTERNS) {
    if (pattern.test(filename)) return category;
  }
  return 'other';
}

function guessEpisodeSlug(filename) {
  const match = filename.match(EPISODE_PATTERN);
  if (match) return `ep${match[1].padStart(3, '0')}`;
  return null;
}

function extractKeywords(filename) {
  // Strip extension, split on separators, lowercase, remove noise words
  const noise = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'for', 'v1', 'v2', 'v3', 'final', 'draft']);
  return basename(filename, extname(filename))
    .toLowerCase()
    .replace(/[_\-\.]+/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !noise.has(w))
    .join(' ');
}

function walkDir(dir, results = [], depth = 0) {
  if (depth > 6) return results; // don't recurse forever
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return results; // skip folders we can't read
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip hidden folders and system folders
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === '$RECYCLE.BIN') continue;
      walkDir(fullPath, results, depth + 1);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (RELEVANT_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Default roots to scan (auto-detected from this machine)
// ---------------------------------------------------------------------------
function getDefaultRoots() {
  const home = 'C:/Users/jamme';
  const candidates = [
    // OneDrive (confirmed present on this machine)
    { path: `${home}/OneDrive`, label: 'OneDrive' },
    // Google Drive Desktop (if installed later)
    { path: `${home}/Google Drive`, label: 'Google Drive' },
    { path: 'G:/My Drive', label: 'Google Drive G:' },
    { path: 'H:/My Drive', label: 'Google Drive H:' },
    // Documents
    { path: `${home}/Documents`, label: 'Documents' },
    // Downloads (often has research PDFs)
    { path: `${home}/Downloads`, label: 'Downloads' },
  ];
  return candidates.filter(c => existsSync(c.path));
}

function loadRootsConfig() {
  if (existsSync(ROOTS_CONFIG)) {
    try {
      return JSON.parse(readFileSync(ROOTS_CONFIG, 'utf8'));
    } catch {
      console.warn('Warning: drive_roots.json is malformed. Using defaults.');
    }
  }
  // First run: write the config file with auto-detected roots
  const defaults = getDefaultRoots();
  const config = {
    _note: "Add any folder path here to include it in scans. Paths are scanned recursively.",
    roots: defaults
  };
  writeFileSync(ROOTS_CONFIG, JSON.stringify(config, null, 2));
  console.log(`Created drive_roots.json with ${defaults.length} auto-detected folders.`);
  return config;
}

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------
function scan() {
  const db = new Database(DB_PATH);
  const config = loadRootsConfig();
  const roots = config.roots || [];

  if (roots.length === 0) {
    console.log('No folder roots configured. Edit drive_roots.json to add folders.');
    db.close();
    return;
  }

  const upsert = db.prepare(`
    INSERT INTO indexed_files (filename, filepath, folder_root, file_ext, size_bytes, modified_at, episode_slug, file_category, keywords, last_scanned_at)
    VALUES (@filename, @filepath, @folder_root, @file_ext, @size_bytes, @modified_at, @episode_slug, @file_category, @keywords, @last_scanned_at)
    ON CONFLICT(filepath) DO UPDATE SET
      size_bytes       = excluded.size_bytes,
      modified_at      = excluded.modified_at,
      episode_slug     = excluded.episode_slug,
      file_category    = excluded.file_category,
      keywords         = excluded.keywords,
      last_scanned_at  = excluded.last_scanned_at
  `);

  const scanMany = db.transaction((files) => {
    for (const f of files) upsert.run(f);
  });

  let totalFound = 0;
  const now = new Date().toISOString();

  for (const root of roots) {
    if (!existsSync(root.path)) {
      console.log(`  [skip] ${root.label} — folder not found: ${root.path}`);
      continue;
    }
    console.log(`  Scanning ${root.label} (${root.path})...`);
    const files = walkDir(root.path);
    const rows = files.map(filepath => {
      let stat;
      try { stat = statSync(filepath); } catch { return null; }
      const filename = basename(filepath);
      return {
        filename,
        filepath: filepath.replace(/\\/g, '/'),
        folder_root: root.label,
        file_ext: extname(filename).toLowerCase(),
        size_bytes: stat.size,
        modified_at: stat.mtime.toISOString(),
        episode_slug: guessEpisodeSlug(filename),
        file_category: guessCategory(filename),
        keywords: extractKeywords(filename),
        last_scanned_at: now,
      };
    }).filter(Boolean);

    scanMany(rows);
    console.log(`    Found ${rows.length} files.`);
    totalFound += rows.length;
  }

  const totalIndexed = db.prepare('SELECT COUNT(*) as c FROM indexed_files').get().c;
  console.log(`\nScan complete. ${totalFound} files processed this run.`);
  console.log(`Total files in index: ${totalIndexed}`);
  console.log('Last scanned:', now);

  db.close();
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
function search(term) {
  const db = new Database(DB_PATH);
  const like = `%${term.toLowerCase()}%`;

  const results = db.prepare(`
    SELECT filename, filepath, file_category, episode_slug, modified_at, folder_root
    FROM indexed_files
    WHERE LOWER(filename)  LIKE ?
       OR LOWER(keywords)  LIKE ?
       OR LOWER(episode_slug) LIKE ?
    ORDER BY modified_at DESC
    LIMIT 20
  `).all(like, like, like);

  if (results.length === 0) {
    console.log(`\nNo indexed files found for: "${term}"`);
    console.log('Try running: node scripts/find_source_files.js --scan\n');
  } else {
    console.log(`\nFiles matching "${term}":\n`);
    for (const r of results) {
      console.log(`  [${r.file_category}]  ${r.filename}`);
      console.log(`    Path:     ${r.filepath}`);
      if (r.episode_slug) console.log(`    Episode:  ${r.episode_slug}`);
      console.log(`    Modified: ${r.modified_at?.slice(0, 10)}`);
      console.log(`    Source:   ${r.folder_root}`);
      console.log();
    }
  }
  db.close();
}

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------
function status() {
  const config = loadRootsConfig();
  const db = new Database(DB_PATH);
  const totalIndexed = db.prepare('SELECT COUNT(*) as c FROM indexed_files').get().c;
  const byRoot = db.prepare(`
    SELECT folder_root, COUNT(*) as c, MAX(last_scanned_at) as last_scan
    FROM indexed_files GROUP BY folder_root
  `).all();

  console.log('\nPodcast OS -- File Discovery Status');
  console.log('=====================================');
  console.log(`Total indexed files: ${totalIndexed}`);
  console.log('\nConfigured roots:');
  for (const root of (config.roots || [])) {
    const found = existsSync(root.path) ? 'OK' : 'NOT FOUND';
    const stats = byRoot.find(r => r.folder_root === root.label);
    const count = stats ? stats.c : 0;
    const lastScan = stats ? stats.last_scan?.slice(0, 10) : 'never scanned';
    console.log(`  [${found}]  ${root.label}`);
    console.log(`           ${root.path}`);
    console.log(`           ${count} files indexed | last scan: ${lastScan}`);
  }
  console.log('\nTo add a folder: edit drive_roots.json');
  console.log('To scan:         node scripts/find_source_files.js --scan\n');
  db.close();
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.includes('--scan')) {
  scan();
} else if (args.includes('--search')) {
  const term = args[args.indexOf('--search') + 1];
  if (!term) { console.log('Usage: node scripts/find_source_files.js --search <term>'); process.exit(1); }
  search(term);
} else if (args.includes('--status') || args.length === 0) {
  status();
} else {
  console.log('Usage:');
  console.log('  node scripts/find_source_files.js --scan           (scan all configured folders)');
  console.log('  node scripts/find_source_files.js --search <term>  (search indexed files)');
  console.log('  node scripts/find_source_files.js --status         (show config and counts)');
}
