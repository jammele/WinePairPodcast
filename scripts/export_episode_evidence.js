/**
 * export_episode_evidence.js
 * Two-layer episode evidence extractor for the Wine Pair intelligence engine.
 *
 * Layer 1 (structured): Parse outputs/episodes/ep*.md for JSON-LD Review schema blocks
 *   and structured script-format sections (Wine:/Joe:/Carmela: fields).
 * Layer 2 (Drive/script): For episodes without .md files, use find_episode.mjs + read_gdoc.js.
 *
 * Output: data/exports/episode_evidence.jsonl (one JSON record per wine per episode)
 *
 * Usage:
 *   node scripts/export_episode_evidence.js
 *   node scripts/export_episode_evidence.js --episode 201
 *   node scripts/export_episode_evidence.js --episode 201 --regression
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUTS_DIR = path.join(__dirname, '..', 'outputs', 'episodes');
const EXPORTS_DIR = path.join(__dirname, '..', 'data', 'exports');
const OUTPUT_FILE = path.join(EXPORTS_DIR, 'episode_evidence.jsonl');
const DB_PATH = path.join(__dirname, '..', 'db', 'podcast_os.db');

const args = process.argv.slice(2);
const targetEpisode = args.includes('--episode') ? parseInt(args[args.indexOf('--episode') + 1]) : null;
const regressionMode = args.includes('--regression');
const includeDrive = args.includes('--include-drive');

fs.mkdirSync(EXPORTS_DIR, { recursive: true });

// ── Score regex patterns (from actual script format) ──────────────────────────
const SCORE_RE = {
  wine_name_block: /^Wine:\s*(.+)$/m,
  region_block: /^Region:\s*(.+)$/m,
  year_block: /^Year:\s*(.+)$/m,
  price_block: /^Price:\s*\$?([0-9.]+(?:\s+\S+)*)/m,
  retailer_block: /^Retailer:\s*(.+)$/m,
  alcohol_block: /^Alcohol:\s*(.+)$/m,
  grapes_block: /^Grapes:\s*(.+)$/m,
  pro_rating_block: /^Professional Rating:\s*(.+)$/m,
  food_pairing_block: /Food to pair with this[^:]*:\s*(.+)/i,
  joe_score: /^Joe:\s*(\d+)\/10/m,
  carmela_score: /^Carmela:\s*(\d+)\/10/m,
};

// ── Parse outputs/episodes/ep*.md files ──────────────────────────────────────

function parseJsonLdFromMd(mdContent, filePath, episodeNumber) {
  const records = [];

  // Try JSON-LD script blocks
  const jsonLdRegex = /```json([\s\S]*?)```/g;
  let match;
  while ((match = jsonLdRegex.exec(mdContent)) !== null) {
    try {
      const jsonStr = match[1].trim();
      if (!jsonStr.includes('@type') || (!jsonStr.includes('Review') && !jsonStr.includes('@graph'))) continue;
      const data = JSON.parse(jsonStr);
      const reviews = extractReviewNodes(data);
      for (const review of reviews) {
        records.push(structuredFromJsonLd(review, episodeNumber, filePath));
      }
    } catch (_) {
      // skip malformed blocks
    }
  }

  if (records.length > 0) return records;

  // Fall back to script-format parsing
  return parseScriptSections(mdContent, episodeNumber, filePath, 'md_file');
}

function extractReviewNodes(data) {
  if (data['@type'] === 'Review') return [data];
  if (data['@graph']) return data['@graph'].filter(n => n['@type'] === 'Review');
  return [];
}

function structuredFromJsonLd(review, episodeNumber, sourcePath) {
  const item = review.itemReviewed || {};
  const additionalProps = item.additionalProperty || [];
  const prop = (name) => (additionalProps.find(p => p.name === name) || {}).value || null;

  return {
    episode_number: episodeNumber,
    source_type: 'json_ld',
    source_path: sourcePath,
    wine_name: item.name || null,
    producer: item.brand?.name || null,
    vintage: prop('vintage'),
    region: prop('region'),
    price: item.offers?.price || prop('price'),
    retailer: prop('retailer'),
    alcohol: prop('alcohol'),
    grapes: prop('grapes'),
    joe_score: review.reviewRating?.ratingValue ?? null,
    carmela_score: (review.reviewRating?.additionalProperty || []).find(p => p.name === 'carmela_score')?.value ?? null,
    verdict: review.description || null,
    tasting_notes: review.reviewBody || null,
    food_pairing: null,
    professional_rating: null,
    professional_rating_disagreement: false,
    tasting_nose: null,
    tasting_palate: null,
    raw_text_excerpt: null,
    extracted_at: new Date().toISOString(),
  };
}

// ── Parse script-format text sections ────────────────────────────────────────

function parseScriptSections(text, episodeNumber, sourcePath, sourceType) {
  const sections = splitIntoWineSections(text);
  return sections
    .map(s => extractWineSection(s, episodeNumber, sourcePath, sourceType))
    .filter(r => r && r.wine_name);
}

function splitIntoWineSections(text) {
  // Split on lines that start a wine tasting block
  const parts = text.split(/\n(?=Wine:\s+\S)/);
  return parts.filter(s => /^Wine:\s+\S/m.test(s));
}

function extractWineSection(section, episodeNumber, sourcePath, sourceType) {
  const m = (re) => { const match = section.match(re); return match ? match[1].trim() : null; };

  const wineName = m(SCORE_RE.wine_name_block);
  if (!wineName) return null;

  const joeRaw = m(SCORE_RE.joe_score);
  const carmelaRaw = m(SCORE_RE.carmela_score);
  const joeScore = joeRaw !== null ? parseInt(joeRaw) : null;
  const carmelaScore = carmelaRaw !== null ? parseInt(carmelaRaw) : null;

  // Extract nose and palate
  const noseMatch = section.match(/On the nose:\s*([\s\S]*?)(?=In the mouth:|Food to pair|Joe:|$)/i);
  const palateMatch = section.match(/In the mouth:\s*([\s\S]*?)(?=Food to pair|Joe:|$)/i);
  const nose = noseMatch ? noseMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : null;
  const palate = palateMatch ? palateMatch[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : null;

  // Professional rating disagreement: pro says 85+ but Joe says ≤4
  const proRating = m(SCORE_RE.pro_rating_block);
  let proScore = null;
  if (proRating) {
    const proNums = proRating.match(/\b(\d{2,3})\b/);
    proScore = proNums ? parseInt(proNums[1]) : null;
  }
  const hasProDisagreement = (proScore !== null && joeScore !== null) &&
    ((proScore >= 85 && joeScore <= 4) || (proScore <= 78 && joeScore >= 7));

  // Simple verdict
  let verdict = null;
  if (joeScore !== null && carmelaScore !== null) {
    const avg = (joeScore + carmelaScore) / 2;
    verdict = avg >= 7 ? 'buy' : avg >= 5 ? 'finish_dont_rebuy' : 'avoid';
  }

  return {
    episode_number: episodeNumber,
    source_type: sourceType,
    source_path: sourcePath,
    wine_name: wineName,
    producer: null,
    vintage: m(SCORE_RE.year_block),
    region: m(SCORE_RE.region_block),
    price: m(SCORE_RE.price_block),
    retailer: m(SCORE_RE.retailer_block),
    alcohol: m(SCORE_RE.alcohol_block),
    grapes: m(SCORE_RE.grapes_block),
    joe_score: joeScore,
    carmela_score: carmelaScore,
    verdict,
    food_pairing: m(SCORE_RE.food_pairing_block),
    professional_rating: proRating,
    professional_rating_disagreement: hasProDisagreement,
    tasting_nose: nose,
    tasting_palate: palate,
    raw_text_excerpt: section.slice(0, 600),
    extracted_at: new Date().toISOString(),
  };
}

// ── Database lookup ───────────────────────────────────────────────────────────

function getEpisodesFromDb(episodeFilter = null) {
  try {
    const require = createRequire(import.meta.url);
    const Database = require('better-sqlite3');
    const db = new Database(DB_PATH, { readonly: true });
    let query = 'SELECT episode_number, title FROM episodes WHERE episode_number IS NOT NULL';
    const params = [];
    if (episodeFilter !== null) {
      query += ' AND episode_number = ?';
      params.push(episodeFilter);
    }
    query += ' ORDER BY episode_number DESC';
    return db.prepare(query).all(...params);
  } catch (e) {
    console.warn(`DB not available (${e.message}), using file-based discovery only`);
    return [];
  }
}

function getDocIdForEpisode(episodeNumber) {
  try {
    const result = execSync(`node scripts/find_episode.mjs "Episode ${episodeNumber}"`, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      timeout: 30000,
    });
    const parsed = JSON.parse(result.trim());
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const match = parsed.find(r => r.name && r.name.startsWith(`Episode ${episodeNumber}:`));
    return match ? match.id : (parsed[0].id || null);
  } catch (e) {
    console.warn(`find_episode failed for EP${episodeNumber}: ${e.message}`);
    return null;
  }
}

// ── Drive retrieval for older episodes ───────────────────────────────────────

function fetchFromDrive(docId) {
  try {
    const result = execSync(`node scripts/read_gdoc.js ${docId}`, {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
      timeout: 30000,
    });
    return result;
  } catch (e) {
    console.warn(`Drive fetch failed for doc ${docId}: ${e.message}`);
    return null;
  }
}

// ── Main extraction loop ──────────────────────────────────────────────────────

async function main() {
  console.log('=== Wine Pair Episode Evidence Extractor ===');
  const evidenceRecords = [];

  // Collect .md files
  let mdFiles = [];
  if (fs.existsSync(OUTPUTS_DIR)) {
    mdFiles = fs.readdirSync(OUTPUTS_DIR)
      .filter(f => /^ep\d+.*\.md$/i.test(f))
      .map(f => path.join(OUTPUTS_DIR, f));
  }

  if (targetEpisode !== null) {
    mdFiles = mdFiles.filter(f => {
      const num = parseInt(path.basename(f).replace(/^ep/i, ''));
      return num === targetEpisode;
    });
  }

  // Layer 1: .md files
  for (const mdFile of mdFiles) {
    const episodeNum = parseInt(path.basename(mdFile).replace(/^ep/i, ''));
    const content = fs.readFileSync(mdFile, 'utf8');
    const records = parseJsonLdFromMd(content, mdFile, episodeNum);
    evidenceRecords.push(...records);
    console.log(`  EP${episodeNum} (md): ${records.length} wine(s)`);
  }

  // Layer 2: Drive retrieval — only when --include-drive or --episode <N> is specified
  // Without --include-drive, full scans process only .md files (Drive calls are slow).
  const coveredEps = new Set(evidenceRecords.map(r => r.episode_number));
  if (includeDrive || targetEpisode !== null) {
    const dbEpisodes = getEpisodesFromDb(targetEpisode);

    for (const ep of dbEpisodes) {
      if (coveredEps.has(ep.episode_number)) continue;

      const docId = getDocIdForEpisode(ep.episode_number);
      if (!docId) {
        console.log(`  EP${ep.episode_number}: no Drive doc found, skipping`);
        continue;
      }

      console.log(`  EP${ep.episode_number} (drive): fetching ${docId}...`);
      const scriptText = fetchFromDrive(docId);
      if (!scriptText || scriptText.trim().length < 100) {
        console.log(`  EP${ep.episode_number}: Drive fetch failed or empty`);
        continue;
      }
      const records = parseScriptSections(scriptText, ep.episode_number, `gdoc:${docId}`, 'google_doc');
      evidenceRecords.push(...records);
      console.log(`  EP${ep.episode_number} (drive): ${records.length} wine(s)`);
    }
  } else {
    console.log('  (Drive fallback skipped — use --include-drive to fetch older episodes)');
  }

  // Output
  const lines = evidenceRecords.map(r => JSON.stringify(r));
  if (targetEpisode !== null) {
    lines.forEach(l => console.log(l));
  } else {
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + (lines.length ? '\n' : ''));
    console.log(`\nWrote ${evidenceRecords.length} records to ${OUTPUT_FILE}`);
  }

  if (regressionMode) {
    runEp201Regression(evidenceRecords);
  }
}

// ── EP201 regression ──────────────────────────────────────────────────────────

function runEp201Regression(records) {
  console.log('\n=== EP201 Regression ===');
  const ep201 = records.filter(r => r.episode_number === 201);

  if (ep201.length === 0) {
    console.error('FAIL: No EP201 records found');
    process.exit(1);
  }

  const failures = [];

  if (ep201.length < 2) failures.push(`Expected 2+ wines, got ${ep201.length}`);

  const meiomis = ep201.filter(r => r.wine_name && r.wine_name.toLowerCase().includes('meiomi'));
  if (meiomis.length < 2) failures.push(`Expected 2 Meiomi wines, got ${meiomis.length}`);

  const hasJoe1 = ep201.some(r => r.joe_score === 1);
  if (!hasJoe1) failures.push('Expected Joe score 1/10, not found');

  const hasCarmela2 = ep201.some(r => r.carmela_score === 2);
  if (!hasCarmela2) failures.push('Expected Carmela score 2/10, not found');

  const hasShoe = ep201.some(r => r.food_pairing && r.food_pairing.toLowerCase().includes('shoe'));
  if (!hasShoe) failures.push('Expected food_pairing containing "shoe", not found');

  const hasCriticism = ep201.some(r =>
    (r.tasting_palate && r.tasting_palate.length > 20) ||
    (r.raw_text_excerpt && r.raw_text_excerpt.length > 100)
  );
  if (!hasCriticism) failures.push('Expected tasting criticism text, not found');

  const hasProDisagreement = ep201.some(r => r.professional_rating_disagreement === true);
  if (!hasProDisagreement) failures.push('Expected professional_rating_disagreement=true, not found');

  if (failures.length === 0) {
    console.log('PASS: All EP201 regression checks passed');
    ep201.forEach(r => {
      console.log(`  ${r.wine_name}: Joe ${r.joe_score}/10, Carmela ${r.carmela_score}/10, pairing: "${r.food_pairing}"`);
    });
  } else {
    console.error('FAIL:');
    failures.forEach(f => console.error(`  - ${f}`));
    console.log('\nExtracted:');
    ep201.forEach(r => console.log(JSON.stringify(r, null, 2)));
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
