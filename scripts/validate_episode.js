#!/usr/bin/env node
/**
 * Episode output file validator — checks SEO/AEO + social content.
 * Usage: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md
 * Partial: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md --sections=KEY_QUESTIONS,FAQ
 * Optional count overrides: --expected-key-questions=7 --expected-faq-pairs=7
 *
 * Checks: required sections, FAQ heading, Q./A. format, Review Schema,
 * FAQPage schema, Bluesky post count, URL structure (posts 1-3 vs 4-10),
 * duplicate URLs, character counts, em-dashes.
 */

import { readFileSync, existsSync } from 'fs';

const PODCAST_DOMAIN = 'thewinepairpodcast';
const VALID_SECTIONS = new Set(['KEY_QUESTIONS', 'FAQ', 'SCHEMA', 'BLUESKY']);
const DEFAULT_EXPECTED_KEY_QUESTIONS = 7;
const DEFAULT_EXPECTED_FAQ_PAIRS = 7;

function parsePositiveIntArg(args, argName, defaultValue) {
  const rawArg = args.find(a => a.startsWith(`${argName}=`));
  if (!rawArg) return defaultValue;
  const rawValue = (rawArg.split('=')[1] || '').trim();
  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid ${argName} value: "${rawValue}". Use a positive integer.`);
  }
  return parsed;
}

function parseSectionsArg(args) {
  const sectionsArg = args.find(a => a.startsWith('--sections='));
  if (!sectionsArg) return null;

  const raw = sectionsArg.split('=')[1] || '';
  if (!raw.trim()) {
    throw new Error('Invalid --sections value. Provide a comma-separated list like KEY_QUESTIONS,FAQ or use all.');
  }

  const parsed = raw
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(Boolean);

  if (parsed.includes('ALL')) return null;

  const invalid = parsed.filter(s => !VALID_SECTIONS.has(s));
  if (invalid.length > 0) {
    throw new Error(`Invalid section name(s): ${invalid.join(', ')}. Valid: KEY_QUESTIONS, FAQ, SCHEMA, BLUESKY, all.`);
  }

  return new Set(parsed);
}

function shouldRun(requestedSections, sectionName) {
  if (!requestedSections) return true;
  return requestedSections.has(sectionName);
}

function getSectionBlock(content, headingRegex) {
  const lines = content.split('\n');
  let startIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (headingRegex.test(lines[i])) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (/^###\s+/.test(lines[i]) || /^##\s+/.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join('\n');
}

// ── Bluesky post extraction ───────────────────────────────────────────────────
function extractBlueskyPosts(content) {
  // Find the BLUESKY POSTS section — stop at next ## section (e.g. COVER ART) or end of file
  const sectionMatch = content.match(/###\s*BLUESKY POSTS[\s\S]*?(?=\n##\s|\n---\s*\n##\s|$)/i);
  if (!sectionMatch) return [];

  const section = sectionMatch[0];
  const posts = [];

  // Match each post: **N.**\ntext\nurl
  // Posts are separated by **N.** markers
  const rawPosts = section.split(/(?=\*\*\d+\.\*\*)/);

  for (const raw of rawPosts) {
    const numMatch = raw.match(/^\*\*(\d+)\.\*\*/);
    if (!numMatch) continue;

    const num = parseInt(numMatch[1]);
    const body = raw.replace(/^\*\*\d+\.\*\*\s*/, '').trim();
    const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) continue;

    // Last non-empty line is the URL
    const url = lines[lines.length - 1];
    const textLines = lines.slice(0, -1);
    const text = textLines.join('\n');
    const full = text + '\n' + url;

    posts.push({ num, text, url, full });
  }

  return posts;
}

// ── Main validator ────────────────────────────────────────────────────────────
function run(filePath, requestedSections, expectedCounts) {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];

  // ── 1. Em-dashes (run for prose-bearing sections only) ───────────────────
  const validateEmDash =
    shouldRun(requestedSections, 'KEY_QUESTIONS') ||
    shouldRun(requestedSections, 'FAQ') ||
    shouldRun(requestedSections, 'BLUESKY') ||
    !requestedSections;

  if (validateEmDash) {
    const seoMatch = content.match(/##\s*SEO[\s\S]*?(?=\n##\s*COVER ART|\n##\s*$|$)/i);
    // Strip code blocks before checking — em-dash rule applies to prose, not ChatGPT prompts
    const stripCodeBlocks = (s) => s.replace(/```[\s\S]*?```/g, '');
    const seoContent = seoMatch ? stripCodeBlocks(seoMatch[0]) : stripCodeBlocks(content.replace(/\n##\s*COVER ART[\s\S]*$/i, ''));
    const emDashCount = (seoContent.match(/—/g) || []).length;
    if (emDashCount > 0) {
      errors.push(`Em-dash (—) found ${emDashCount} time(s) in SEO/AEO section. Remove every one (HR-1).`);
    }
  }

  // ── 2. Required sections ──────────────────────────────────────────────────
  const requiredSections = [
    { key: 'KEY_QUESTIONS', pattern: /KEY QUESTIONS/i, name: 'KEY QUESTIONS' },
    { key: 'FAQ', pattern: /FREQUENTLY ASKED QUESTIONS/i, name: 'FREQUENTLY ASKED QUESTIONS' },
    { key: 'SCHEMA', pattern: /SCHEMA MARKUP/i, name: 'SCHEMA MARKUP' },
    { key: 'BLUESKY', pattern: /BLUESKY POSTS/i, name: 'BLUESKY POSTS' },
  ];
  for (const { key, pattern, name } of requiredSections) {
    if (shouldRun(requestedSections, key) && !pattern.test(content)) {
      errors.push(`Missing required section: ${name}`);
    }
  }

  // ── 3. FAQ heading must not use wrong label ───────────────────────────────
  if (shouldRun(requestedSections, 'FAQ') && /FULL Q&A/i.test(content)) {
    errors.push('FAQ heading uses "FULL Q&A" — must be exactly "FREQUENTLY ASKED QUESTIONS" (HR-29).');
  }

  // ── 4. Q./A. format ───────────────────────────────────────────────────────
  if (shouldRun(requestedSections, 'FAQ')) {
    const faqBlock = getSectionBlock(content, /^###\s*FREQUENTLY ASKED QUESTIONS/i);
    if (faqBlock) {
      const faqText = faqBlock;
      // Questions must start with **Q.
      const questionLines = faqText.split('\n').filter(l => /^\*\*Q\./.test(l.trim()) || (/\?$/.test(l.trim()) && l.trim().length > 10));
      const badQ = questionLines.filter(l => !/^\*\*Q\./.test(l.trim()));
      if (badQ.length > 0) {
        errors.push(`${badQ.length} FAQ question line(s) not using **Q. bold format (HR-2).`);
      }
      const faqPairs = faqText.split('\n').filter(l => /^\*\*Q\./.test(l.trim())).length;
      if (faqPairs !== expectedCounts.faqPairs) {
        errors.push(`FAQ pair count is ${faqPairs} — must be exactly ${expectedCounts.faqPairs} unless explicitly overridden.`);
      }
      // Answer lines must start with plain A.
      const boldA = faqText.split('\n').filter(l => /^\*\*A\./.test(l.trim()));
      if (boldA.length > 0) {
        errors.push(`${boldA.length} FAQ answer line(s) are bolded — A. lines must be plain text, not bold (HR-2).`);
      }
    }
  }

  // ── 5. Review Schema present (skip for interview episodes) ───────────────
  const isInterviewEpisode = /Type:.*interview episode/i.test(content);
  if (shouldRun(requestedSections, 'SCHEMA') && !isInterviewEpisode && !/"@type"\s*:\s*"Review"/.test(content)) {
    errors.push('No Review Schema block found. Add at least one Review schema for each wine reviewed.');
  }

  // ── 6.5 Key Questions count ───────────────────────────────────────────────
  if (shouldRun(requestedSections, 'KEY_QUESTIONS')) {
    const keyQuestionsBlock = getSectionBlock(content, /^###\s*KEY QUESTIONS/i);
    if (keyQuestionsBlock) {
      const keyQuestionCount = keyQuestionsBlock
        .split('\n')
        .map(l => l.trim())
        .filter(l => /^[-*]\s+/.test(l) && /\?$/.test(l)).length;

      if (keyQuestionCount !== expectedCounts.keyQuestions) {
        errors.push(`Key Questions count is ${keyQuestionCount} — must be exactly ${expectedCounts.keyQuestions} unless explicitly overridden.`);
      }
    }
  }

  // ── 6. FAQPage Schema present ─────────────────────────────────────────────
  if (shouldRun(requestedSections, 'SCHEMA') && !/"@type"\s*:\s*"FAQPage"/.test(content)) {
    errors.push('No FAQPage schema block found. Add a FAQPage schema covering all Q&A pairs.');
  }

  // ── 7. Bluesky posts ──────────────────────────────────────────────────────
  const posts = shouldRun(requestedSections, 'BLUESKY') ? extractBlueskyPosts(content) : [];

  if (shouldRun(requestedSections, 'BLUESKY')) {
    if (posts.length === 0) {
      errors.push('No Bluesky posts found. Expected 10 posts in "### BLUESKY POSTS" section.');
    } else if (posts.length !== 10) {
      errors.push(`Bluesky post count is ${posts.length} — must be exactly 10.`);
    }
  }

  if (posts.length > 0) {
    // Posts 1-3: must link to thewinepairpodcast.com
    const teasers = posts.filter(p => p.num <= 3);
    for (const post of teasers) {
      if (!post.url.includes(PODCAST_DOMAIN)) {
        errors.push(`Post ${post.num} (teaser) must link to thewinepairpodcast.com. Got: "${post.url}" (HR-31).`);
      }
    }

    // Posts 4-10: must NOT link to podcast, must be unique
    const factPosts = posts.filter(p => p.num >= 4 && p.num <= 10);
    const factUrls = [];

    for (const post of factPosts) {
      if (!post.url || post.url.trim() === '') {
        errors.push(`Post ${post.num} is missing a URL (HR-31).`);
        continue;
      }
      if (post.url.includes(PODCAST_DOMAIN)) {
        errors.push(`Post ${post.num} (fact post) must not link to thewinepairpodcast.com — use a unique external source URL (HR-31).`);
      }
      factUrls.push({ num: post.num, url: post.url });
    }

    // Duplicate URL check across fact posts
    const urlMap = {};
    for (const { num, url } of factUrls) {
      if (!urlMap[url]) urlMap[url] = [];
      urlMap[url].push(num);
    }
    for (const [url, nums] of Object.entries(urlMap)) {
      if (nums.length > 1) {
        errors.push(`Duplicate URL in posts ${nums.join(' and ')}: "${url}" — each fact post needs a unique source (HR-31).`);
      }
    }

    // Character count check (text portion must be under ~240 chars for URL posts)
    for (const post of posts) {
      const textLength = post.text.length;
      const totalLength = post.full.length;
      if (totalLength > 300) {
        errors.push(`Post ${post.num} is ${totalLength} total chars — must be under 300 (HR-26).`);
      } else if (textLength > 240) {
        warnings.push(`Post ${post.num} text is ${textLength} chars — aim for under 240 when a URL follows (HR-26).`);
      }
    }

    // Wine in the News check
    const newsMarkers = ['wine in the news', 'our wine in the news', 'news desk'];
    for (const post of posts) {
      for (const marker of newsMarkers) {
        if (post.full.toLowerCase().includes(marker)) {
          errors.push(`Post ${post.num} may reference the Wine in the News segment ("${marker}") — prohibited in Bluesky posts (HR-27).`);
        }
      }
    }

    // Em-dashes in individual posts
    for (const post of posts) {
      if (post.full.includes('—')) {
        errors.push(`Post ${post.num} contains an em-dash (HR-1).`);
      }
    }
  }

  // ── Report ────────────────────────────────────────────────────────────────
  console.log(`\nValidating: ${filePath}`);

  if (errors.length > 0) {
    console.log(`\n  ERRORS (${errors.length}):`);
    errors.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
  }

  if (warnings.length > 0) {
    console.log(`\n  WARNINGS (${warnings.length}):`);
    warnings.forEach((w, i) => console.log(`    ${i + 1}. ${w}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('  ✓ Passed — ready to show Joe.');
  }

  return errors.length;
}

// ── Entry point ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md');
  console.log('Partial: node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md --sections=KEY_QUESTIONS,FAQ');
  console.log('Optional count overrides: --expected-key-questions=7 --expected-faq-pairs=7');
  console.log('Example: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md');
  process.exit(1);
}

let requestedSections = null;
let expectedCounts = {
  keyQuestions: DEFAULT_EXPECTED_KEY_QUESTIONS,
  faqPairs: DEFAULT_EXPECTED_FAQ_PAIRS,
};
try {
  requestedSections = parseSectionsArg(args);
  expectedCounts = {
    keyQuestions: parsePositiveIntArg(args, '--expected-key-questions', DEFAULT_EXPECTED_KEY_QUESTIONS),
    faqPairs: parsePositiveIntArg(args, '--expected-faq-pairs', DEFAULT_EXPECTED_FAQ_PAIRS),
  };
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const fileArgs = args.filter(a =>
  !a.startsWith('--sections=') &&
  !a.startsWith('--expected-key-questions=') &&
  !a.startsWith('--expected-faq-pairs=')
);
if (fileArgs.length === 0) {
  console.error('No file paths provided.');
  process.exit(1);
}

let totalErrors = 0;
for (const filePath of fileArgs) {
  totalErrors += run(filePath, requestedSections, expectedCounts);
}

console.log('');
if (totalErrors === 0) {
  console.log('✓ All checks passed. Ready to show Joe.');
  process.exit(0);
} else {
  console.log(`✗ ${totalErrors} error(s) found. Fix before showing Joe.`);
  process.exit(1);
}
