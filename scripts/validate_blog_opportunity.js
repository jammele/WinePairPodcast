#!/usr/bin/env node
/**
 * validate_blog_opportunity.js
 * Validates the structural completeness of an opportunity brief.
 *
 * Usage:
 *   node scripts/validate_blog_opportunity.js docs/opportunity-briefs/[slug]-brief.md
 *   node scripts/validate_blog_opportunity.js outputs/blog-post-[slug].md  (derives brief path)
 *
 * Exit codes:
 *   0 — brief exists, all required structural fields present, and brief is approved
 *   1 — brief found but has structural issues (prints details)
 *   2 — brief file not found
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Required section headings. Each must appear in the brief.
const REQUIRED_HEADINGS = [
  'Candidate topic',
  'Search intent and topic breadth',
  'GSC query cluster',
  'Archive inventory',
  'The Wine Pair angle',
  'No-new-post alternative',
  'Recommended page type',
  'Listener path',
  'Approval and scope lock',
];

// Patterns that indicate a field value is still a template placeholder
const STUB_PATTERNS = [
  /^\[e\.g\.,/i,
  /^\[explicit statement/i,
  /^\[date\]/i,
  /^\[description\]/i,
  /^\[paste/i,
  /^\[one specific answer/i,
  /^\[explicit:/i,
  /^\[list\]/i,
  /^\[sum of/i,
  /^\[name\s*[—\-]/i,
  /^\[one sentence\]/i,
  /^\[could an/i,
  /^\[flows from/i,
  /^\[what is this/i,
  /^\[based on/i,
  /^\[explicit answer/i,
];

function isStub(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return true;
  if (/^\[.{3,}\]$/.test(trimmed)) return true;
  return STUB_PATTERNS.some(p => p.test(trimmed));
}

/**
 * Validate the structural completeness of a brief.
 * Returns an array of issue descriptions (empty array = pass).
 */
export function validateBrief(content) {
  const issues = [];

  // 1. Required section headings
  for (const heading of REQUIRED_HEADINGS) {
    const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`^##\\s+${escaped}`, 'im');
    if (!pattern.test(content)) {
      issues.push(`Missing section: ## ${heading}`);
    }
  }

  // 2. Candidate topic: **Topic:** must be filled
  const topicMatch = content.match(/\*\*Topic:\*\*\s*(.+)/i);
  if (!topicMatch) {
    issues.push('Candidate topic: missing **Topic:** field');
  } else if (isStub(topicMatch[1])) {
    issues.push('Candidate topic: **Topic** field is still a template stub');
  }

  // 3. Business objective must be filled
  const objMatch = content.match(/\*\*Business objective:\*\*\s*(.+)/i);
  if (!objMatch) {
    issues.push('Candidate topic: missing **Business objective:** field');
  } else if (isStub(objMatch[1])) {
    issues.push('Candidate topic: **Business objective** field is still a template stub');
  }

  // 4. Excluded scope must be filled
  const excludedMatch = content.match(/\*\*Excluded scope:\*\*\s*(.+)/i);
  if (excludedMatch && isStub(excludedMatch[1])) {
    issues.push('Search intent: **Excluded scope** field is still a template stub');
  }

  // 5. Evidence window must be present
  if (!/evidence window:/i.test(content)) {
    issues.push('GSC query cluster: missing evidence window — every metric must carry exact date range, source, and purpose');
  }

  // 6. Archive inventory must have at least one episode row
  const archiveMatch = content.match(/## Archive inventory[\s\S]*?(?=\n## |$)/i);
  if (archiveMatch) {
    const archiveBody = archiveMatch[0];
    const hasEpisodeRow = /\|\s*Ep\d+/i.test(archiveBody) || /\|\s*Episode\s+\d+/i.test(archiveBody);
    if (!hasEpisodeRow) {
      issues.push('Archive inventory: no episode rows found — full archive must be completed before drafting');
    }
  }

  // 7. Archive inventory must include source classifications
  if (!/\b(Essential|Supporting|Context only|Excluded)\b/i.test(content)) {
    issues.push('Archive inventory: no episode source classifications found (Essential / Supporting / Context only / Excluded)');
  }

  // 8. Wine Pair angle must not be a stub
  const wpaMatch = content.match(/## The Wine Pair angle\s*\n+([\s\S]*?)(?=\n## |$)/i);
  if (wpaMatch) {
    const wpaBody = wpaMatch[1].trim();
    if (!wpaBody || isStub(wpaBody) || wpaBody.length < 20) {
      issues.push('Wine Pair angle: field is empty or still a template stub — must answer why us instead of Wine Enthusiast or Wine Folly');
    }
  }

  // 9. Listener path must not be a stub
  const lpMatch = content.match(/## Listener path\s*\n+([\s\S]*?)(?=\n## |$)/i);
  if (lpMatch) {
    const lpBody = lpMatch[1].trim();
    if (!lpBody || isStub(lpBody) || lpBody.length < 20) {
      issues.push('Listener path: field is empty or still a template stub — must state explicit reader-to-listener conversion path');
    }
  }

  // Note: Approval is no longer checked via the Status field in validateBrief().
  // Joe approval is enforced by the existence of docs/opportunity-briefs/approvals/[slug].approved
  // (a separate file that Claude is prohibited from creating — see HR-65).
  // The blog-draft-guard hook checks for this file. This function checks structural completeness only.

  return issues;
}

export function resolveBriefPath(inputPath) {
  const base = basename(inputPath);
  if (base.startsWith('blog-post-')) {
    const slug = basename(inputPath, '.md').replace(/^blog-post-/, '');
    const projectDir = resolve(__dirname, '../');
    return join(projectDir, 'docs', 'opportunity-briefs', `${slug}-brief.md`);
  }
  return resolve(inputPath);
}

function main() {
  const inputPath = process.argv[2];

  if (!inputPath) {
    console.error('Usage: node scripts/validate_blog_opportunity.js <brief-path-or-draft-path>');
    console.error('');
    console.error('Examples:');
    console.error('  node scripts/validate_blog_opportunity.js docs/opportunity-briefs/portuguese-wine-brief.md');
    console.error('  node scripts/validate_blog_opportunity.js outputs/blog-post-portuguese-wine.md');
    process.exit(2);
  }

  const briefPath = resolveBriefPath(inputPath);

  if (!existsSync(briefPath)) {
    console.error(`FAIL: Brief not found: ${briefPath}`);
    if (inputPath !== briefPath) {
      const slug = basename(inputPath, '.md').replace(/^blog-post-/, '');
      console.error(`Expected brief for draft "${slug}" at: ${briefPath}`);
    }
    process.exit(2);
  }

  // Check Joe approval file (separate from brief content — see HR-65)
  const slug = basename(briefPath, '.md').replace(/-brief$/, '');
  const projectDir = resolve(__dirname, '../');
  const approvalPath = join(projectDir, 'docs', 'opportunity-briefs', 'approvals', `${slug}.approved`);
  if (!existsSync(approvalPath)) {
    console.log(`FAIL: ${briefPath}`);
    console.log(`\nNot yet approved by Joe.`);
    console.log(`Expected approval file: docs/opportunity-briefs/approvals/${slug}.approved`);
    console.log(`\nJoe creates this file to record his approval. Claude never creates it (HR-65).`);
    process.exit(1);
  }

  const content = readFileSync(briefPath, 'utf8');
  const issues = validateBrief(content);

  if (issues.length === 0) {
    console.log(`PASS: ${briefPath}`);
    console.log('Structural validation passed. Joe approval file confirmed.');
    process.exit(0);
  } else {
    console.log(`FAIL: ${briefPath}`);
    console.log(`\n${issues.length} structural issue(s) found:\n`);
    issues.forEach(i => console.log(`  - ${i}`));
    console.log('\nComplete all required brief fields before drafting.');
    process.exit(1);
  }
}

// Run main only when executed directly
if (process.argv[1] === __filename) {
  main();
}

