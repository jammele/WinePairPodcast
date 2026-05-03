#!/usr/bin/env node
/**
 * Spoke page validator — runs mechanical checks on a draft before review.
 * Usage: node scripts/validate_spoke.js outputs/cabernet-sauvignon-spoke.md
 */

import { readFileSync, existsSync } from 'fs';
import { extname } from 'path';

// ── Known wine lists per published spoke ─────────────────────────────────────
const EXISTING_SPOKE_WINES = {
  'Pinot Noir': [
    'frappato', 'beaujolais', 'cinsault', 'mencia', 'etna rosso', 'red burgundy'
  ],
  'Malbec': [
    'syrah', 'shiraz', 'zinfandel', 'grenache', "nero d'avola", 'pinotage', 'primitivo'
  ],
  'Cabernet Sauvignon': [
    'merlot', 'bordeaux blend', 'carmenere', 'cabernet franc', 'rioja', 'barolo'
  ],
};

// Wines that have their own spoke pages (should not appear as alternatives)
const SPOKE_ANCHORS = [
  'pinot noir', 'malbec', 'cabernet sauvignon', 'chardonnay', 'sauvignon blanc'
];

// ── Published subtitle list — update this when a spoke goes LIVE ─────────────
// Only add subtitles from pages that are published. Drafts in progress are not
// checked against themselves.
const PUBLISHED_SUBTITLES = [
  '6 wines to try if you love pinot noir',  // Pinot Noir — LIVE
  '6 bold reds to try next',                 // Malbec — LIVE
  // '6 full-bodied reds to try next',       // Cabernet Sauvignon — add when live
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function countSentences(text) {
  // Split on . ! ? followed by space or end of string, filter empty
  return text.split(/[.!?]+(?:\s|$)/).filter(s => s.trim().length > 0).length;
}

function extractCardDescriptions(content) {
  // Match the <p style="..."> description inside each card
  const matches = [...content.matchAll(/<p style="font-size:0\.85rem[^"]*"[^>]*>(.*?)<\/p>/gs)];
  return matches.map(m => m[1].trim());
}

function run(filePath) {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, 'utf8');
  const ext = extname(filePath);
  const errors = [];
  const warnings = [];

  // ── Checks for .md files ──────────────────────────────────────────────────
  if (ext === '.md') {

    // 1. Em-dashes
    const emDashMatches = [...content.matchAll(/—/g)];
    if (emDashMatches.length > 0) {
      errors.push(`Em-dash found ${emDashMatches.length} time(s). Remove every one.`);
    }

    // 2. Double-hyphens used as dashes (not in URLs or code)
    const doubleDashLines = content.split('\n').filter(
      line => /(?<![:\w])--(?![->\w])/.test(line) && !line.trim().startsWith('```') && !line.trim().startsWith('-')
    );
    if (doubleDashLines.length > 0) {
      errors.push(`Double-hyphen dash found on ${doubleDashLines.length} line(s). Replace with a period or comma.`);
    }

    // 3. Q./A. format in FAQ
    const faqSection = content.match(/## Frequently Asked Questions([\s\S]*?)(?=\n---|\n## |$)/);
    if (faqSection) {
      const faqText = faqSection[1];
      // Check for questions not using bold **Q.
      const badQFormat = [...faqText.matchAll(/^(?!\*\*Q\.).*\?$/gm)].filter(m => m[0].trim().length > 10);
      if (badQFormat.length > 0) {
        errors.push(`FAQ has ${badQFormat.length} question(s) not using **Q. format.`);
      }
      // Check for answers not using plain A.
      const badAFormat = [...faqText.matchAll(/^(?!A\.).*^[A-Z]/gm)];
    } else {
      warnings.push('No FAQ section found.');
    }

    // 4. Required sections present
    const requiredSections = [
      { pattern: /## IMAGE PROMPT/i, name: 'Image prompt section' },
      { pattern: /## BEAMLY FIELDS/i, name: 'Beamly fields section' },
      { pattern: /\*\*Excerpt/i, name: 'Excerpt / Short description field' },
      { pattern: /\*\*Custom SEO Title/i, name: 'Custom SEO Title field' },
      { pattern: /\*\*Custom SEO Description/i, name: 'Custom SEO Description field' },
      { pattern: /\*\*URL slug/i, name: 'URL slug field' },
      { pattern: /## Frequently Asked Questions/i, name: 'FAQ section' },
      { pattern: /## Food pairings/i, name: 'Food pairings section' },
    ];
    for (const { pattern, name } of requiredSections) {
      if (!pattern.test(content)) {
        errors.push(`Missing required section: ${name}`);
      }
    }

    // 5. Title subtitle uniqueness
    const titleMatch = content.match(/^# .+?: (.+)$/m);
    if (titleMatch) {
      const subtitle = titleMatch[1].toLowerCase().trim();
      const duplicate = PUBLISHED_SUBTITLES.find(s => s === subtitle);
      if (duplicate) {
        errors.push(`Title subtitle "${titleMatch[1]}" is already used by another spoke. Choose a distinct subtitle.`);
      }
    } else {
      warnings.push('Could not parse page title/subtitle.');
    }

    // 6. Wine list overlap with existing spokes
    // Extract the wine names listed as alternatives (H2 headings after the anchor section)
    const h2matches = [...content.matchAll(/^## (.+)$/gm)].map(m => m[1].trim().toLowerCase());
    const skipH2 = ['food pairings', 'listen to the episodes', 'frequently asked questions', 'beamly fields', 'image prompt'];
    const wineHeadings = h2matches.filter(h => !skipH2.some(s => h.includes(s)));

    // Determine which spoke this is (first H2 is the anchor)
    const anchorWine = wineHeadings[0] || '';
    const alternativeWines = wineHeadings.slice(1);

    for (const [spokeName, wineList] of Object.entries(EXISTING_SPOKE_WINES)) {
      if (anchorWine.includes(spokeName.toLowerCase())) continue; // skip self
      for (const altWine of alternativeWines) {
        const match = wineList.find(w => altWine.includes(w) || w.includes(altWine));
        if (match) {
          errors.push(`"${altWine}" already appears in the ${spokeName} spoke. Choose a different wine.`);
        }
      }
    }

    // 7. Anchor wines from other spokes should not appear as alternatives
    for (const altWine of alternativeWines) {
      const isAnchorElsewhere = SPOKE_ANCHORS.find(
        a => altWine.includes(a) && !anchorWine.includes(a)
      );
      if (isAnchorElsewhere) {
        errors.push(`"${altWine}" has its own spoke page. Do not list it as an alternative.`);
      }
    }

    // 8. Syrah check — must lead with spicy if present
    if (content.toLowerCase().includes('syrah')) {
      const syrahSection = content.match(/## Syrah[\s\S]*?(?=\n## |\n---)/i);
      if (syrahSection) {
        const whatsDiff = syrahSection[0].match(/\*\*What'?s different.*?\*\*[:\s]*([\s\S]*?)(?=\n\*\*|\n---)/i);
        if (whatsDiff) {
          const firstWords = whatsDiff[1].trim().toLowerCase().slice(0, 60);
          if (!firstWords.includes('spic') && !firstWords.includes('pepper')) {
            errors.push('Syrah "What\'s different" section must lead with spicy/black pepper, not savory or meaty.');
          }
        }
      }
    }

    // 9. Image prompt — check for variety rules
    const imagePromptSection = content.match(/## IMAGE PROMPT\s*([\s\S]*?)(?=\n---|\n## |$)/i);
    if (imagePromptSection) {
      const prompt = imagePromptSection[1].toLowerCase();
      if (!prompt.includes('label') && !prompt.includes('sans-serif')) {
        warnings.push('Image prompt may be missing wine name labels on bottles. Bottles must have wine names in sans-serif text.');
      }
      if (!prompt.includes('background')) {
        warnings.push('Image prompt does not specify a background color.');
      }
    }
  }

  // ── Checks for .html files ────────────────────────────────────────────────
  if (ext === '.html') {
    // Strip HTML comments before checking so template comment text doesn't trigger false positives
    const contentNoComments = content.replace(/<!--[\s\S]*?-->/g, '');

    // 1. No <style> tags
    if (/<style[\s>]/i.test(contentNoComments)) {
      errors.push('<style> tag found. All styles must be fully inline. Beamly strips style tags.');
    }

    // 2. Em-dashes in card content (not comments)
    if (/—/.test(contentNoComments)) {
      errors.push('Em-dash found in HTML file. Remove every one.');
    }

    // 3. Card description sentence counts
    const descriptions = extractCardDescriptions(content);
    descriptions.forEach((desc, i) => {
      const count = countSentences(desc);
      if (count !== 3) {
        errors.push(`Card description #${i + 1} has ${count} sentence(s) — must be exactly 3. Text: "${desc.slice(0, 80)}..."`);
      }
    });

    // 4. Expect 7 cards — each top-level card opens with the font-family declaration
    const cardCount = (contentNoComments.match(/font-family:-apple-system/g) || []).length;
    if (cardCount !== 7) {
      warnings.push(`Found ${cardCount} card(s) — expected 7 (anchor + 6 alternatives).`);
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  console.log(`\nValidating: ${filePath}`);

  if (errors.length > 0) {
    console.log(`  ERRORS (${errors.length}):`);
    errors.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
  }

  if (warnings.length > 0) {
    console.log(`  WARNINGS (${warnings.length}):`);
    warnings.forEach((w, i) => console.log(`    ${i + 1}. ${w}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✓ Passed');
  }

  return errors.length;
}

// ── Entry point ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/validate_spoke.js <path-to-draft.md> [path-to-cards.html]');
  console.log('Example: node scripts/validate_spoke.js outputs/cabernet-sauvignon-spoke.md outputs/cabernet-sauvignon-wine-cards-embeds.html');
  process.exit(1);
}

let totalErrors = 0;
for (const filePath of args) {
  totalErrors += run(filePath);
}

console.log('');
if (totalErrors === 0) {
  console.log('✓ All files passed. Ready for subagent review.');
  process.exit(0);
} else {
  console.log(`✗ ${totalErrors} error(s) found. Fix before proceeding.`);
  process.exit(1);
}
