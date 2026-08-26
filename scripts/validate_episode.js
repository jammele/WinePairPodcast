#!/usr/bin/env node
/**
 * Episode output file validator — checks SEO/AEO + social content.
 * Usage: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md
 * Partial: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md --sections=KEY_QUESTIONS,FAQ,POLL
 * Optional count override (only for a Joe-approved exception outside the normal 5-7 range;
 * both flags are required together, with the same value, and must be matched by a
 * "Count exception approved by Joe" audit entry):
 *   --expected-key-questions=6 --expected-faq-pairs=6
 * Optional answer-length override (only for a Joe-approved exception above 60 words,
 * matched by an "Answer-length exception approved by Joe" audit entry):
 *   --expected-max-words=70
 *
 * Checks: required sections, FAQ heading, exact Q./A. line syntax (no malformed bold
 * markers, no orphan/missing/blank answers, answer count equals question count),
 * Review Schema, absence of newly generated FAQPage schema, Bluesky post count,
 * URL structure (posts 1-3 vs 4-10), duplicate URLs, character counts, em-dashes,
 * Spotify poll section presence, Key Questions/FAQ count-and-text sync (checked
 * whenever either section is in scope, regardless of which one was individually
 * requested), FAQ answer word-count maximum, the audit file's required exact section
 * headings (including Approved Exceptions), the machine-readable FINAL_QUESTIONS
 * block (sequential numbering, matched against both public lists), the four-field
 * research-freshness record, and that every count/length/freshness override in use
 * is matched by an explicit Joe-approval entry in the audit's Approved Exceptions
 * section — a command-line flag alone is never treated as approval.
 *
 * This validator performs mechanical checks only. It confirms that the required
 * audit records exist and are well-formed; it does not independently verify the
 * underlying research, freshness judgment, or approval itself. A passing result
 * does not verify demand, strategic quality, factual accuracy, source sufficiency,
 * AI-citation likelihood, or listener-growth impact.
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, basename, join } from 'path';

const PODCAST_DOMAIN = 'thewinepairpodcast';
const VALID_SECTIONS = new Set(['KEY_QUESTIONS', 'FAQ', 'SCHEMA', 'BLUESKY', 'POLL']);
const NORMAL_COUNT_RANGE = { min: 5, max: 7 };
const DEFAULT_EXPECTED_MAX_WORDS = 60;
const FAQ_BANNED_NARRATIVE_PATTERNS = [
  /\bin this episode\b/i,
  /\bon this episode\b/i,
  /\bjoe says\b/i,
  /\bjoe points out\b/i,
  /\bcarmela says\b/i,
  /\bwe tasted\b/i,
  /\bwe got\b/i,
  /\bwe chose\b/i,
  /\bwhy we did this episode\b/i,
  /\bon the show\b/i,
  /\bour episode\b/i,
];

// Required audit section headings, matched at the start of a markdown heading
// line (e.g. "### Episode Opportunity Frame" or "### Episode Opportunity Frame: Ep123").
const REQUIRED_AUDIT_HEADINGS = [
  'Episode Opportunity Frame',
  'Owned-Evidence Check',
  'Baseline Discovery Research',
  'Extended Discovery Research',
  'Episode-Evidence Ledger',
  'Candidate Comparison',
  'Provisional Claim / Corroboration Table',
  'Final Selection',
  'Rejection / Correction Notes',
  'Approved Exceptions',
];

// Required corroboration field labels — checked as exact strings anywhere in
// the audit (they appear as table column headers, not standalone headings).
const REQUIRED_CORROBORATION_FIELDS = [
  'Corroborating Source',
  'Support Status',
  'Conflict or Qualification',
];

const STRICT_QUESTION_PATTERN = /^\*\*Q\.\s+\S.*\?\*\*$/;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function headingPattern(headingText) {
  return new RegExp(`^#{1,6}\\s*${escapeRegExp(headingText)}\\b`, 'im');
}

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

function parseOptionalCountOverride(args, argName) {
  const rawArg = args.find(a => a.startsWith(`${argName}=`));
  if (!rawArg) return null;
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
    throw new Error(`Invalid section name(s): ${invalid.join(', ')}. Valid: KEY_QUESTIONS, FAQ, SCHEMA, BLUESKY, POLL, all.`);
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

// Generic markdown-heading block extractor for audit files (any heading level).
function getHeadingBlock(content, headingText) {
  const lines = content.split('\n');
  const pattern = headingPattern(headingText);
  let startIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (pattern.test(lines[i])) {
      startIndex = i;
      break;
    }
  }

  if (startIndex === -1) return null;

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (/^#{1,6}\s+/.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex, endIndex).join('\n');
}

function findFaqNarrativeMatch(text) {
  for (const pattern of FAQ_BANNED_NARRATIVE_PATTERNS) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return null;
}

function countWords(text) {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

// ── Strict FAQ line classification ──────────────────────────────────────────
// Classifies a trimmed line from the FAQ block as a valid question, a valid
// answer, a malformed line that was clearly intended as a question or answer
// (wrong bold markers, missing punctuation), or unrelated content.
function classifyFaqLine(line) {
  const looksLikeQuestion = /^\*{0,2}Q\./.test(line);
  const looksLikeAnswer = /^\*{0,2}A\./.test(line);

  if (looksLikeQuestion) {
    const valid = STRICT_QUESTION_PATTERN.test(line);
    const text = valid ? line.replace(/^\*\*Q\.\s*/, '').replace(/\*\*$/, '').trim() : null;
    return { kind: valid ? 'question' : 'malformed-question', raw: line, text };
  }

  if (looksLikeAnswer) {
    const noLeadingAsterisk = /^A\./.test(line);
    const noTrailingAsterisk = !/\*+\s*$/.test(line);
    const hasSpaceAfterPrefix = /^\*{0,2}A\.\s+\S/.test(line);
    const valid = noLeadingAsterisk && noTrailingAsterisk && hasSpaceAfterPrefix;
    const text = valid ? line.replace(/^A\.\s*/, '').trim() : (hasSpaceAfterPrefix || /^\*{0,2}A\.$/.test(line.trim()) ? line.replace(/^\*{0,2}A\.\s*/, '').replace(/\*+\s*$/, '').trim() : null);
    return { kind: valid ? 'answer' : 'malformed-answer', raw: line, text };
  }

  return { kind: 'other', raw: line, text: null };
}

// ── Key Questions extraction ────────────────────────────────────────────────
function extractKeyQuestionsText(content) {
  const block = getSectionBlock(content, /^###\s*KEY QUESTIONS/i);
  if (!block) return null;
  return block
    .split('\n')
    .map(l => l.trim())
    .filter(l => /^[-*]\s+/.test(l) && /\?$/.test(l))
    .map(l => l.replace(/^[-*]\s+/, '').trim());
}

// ── FAQ line classification pass — used by every FAQ-dependent check ───────
// Returns { questions, answers, syntaxErrors, pairingErrors } — questions/
// answers contain only lines that passed strict syntax; syntax and pairing
// problems are reported as separate, specific error lists.
function analyzeFaqBlock(content) {
  const block = getSectionBlock(content, /^###\s*FREQUENTLY ASKED QUESTIONS/i);
  if (block === null) {
    return { block: null, questions: null, answers: [], syntaxErrors: [], pairingErrors: [] };
  }

  const rawLines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questions = [];
  const answers = [];
  const syntaxErrors = [];
  const pairingErrors = [];
  let pendingQuestion = null;

  for (const line of rawLines) {
    const { kind, raw, text } = classifyFaqLine(line);

    if (kind === 'malformed-question') {
      syntaxErrors.push(`FAQ question line does not match the required "**Q. Question text?**" syntax: "${raw}"`);
      continue;
    }
    if (kind === 'malformed-answer') {
      syntaxErrors.push(`FAQ answer line does not match the required "A. Answer text." syntax: "${raw}"`);
      continue;
    }
    if (kind === 'other') continue;

    if (kind === 'question') {
      if (pendingQuestion !== null) {
        pairingErrors.push(`FAQ question "${pendingQuestion}" has no answer before the next question.`);
      }
      pendingQuestion = text;
      questions.push(text);
    } else if (kind === 'answer') {
      if (pendingQuestion === null) {
        pairingErrors.push(`Orphan FAQ answer with no preceding question: "${raw.slice(0, 70)}"`);
      } else {
        if (!text) {
          pairingErrors.push(`FAQ answer for "${pendingQuestion}" is blank or missing.`);
        }
        answers.push(text || '');
        pendingQuestion = null;
      }
    }
  }

  if (pendingQuestion !== null) {
    pairingErrors.push(`FAQ question "${pendingQuestion}" has no answer (end of section reached).`);
  }

  return { block, questions, answers, syntaxErrors, pairingErrors };
}

// ── Audit FINAL_QUESTIONS block extraction, with sequential-numbering check ─
function extractAuditFinalQuestions(auditContent) {
  const match = auditContent.match(/<!--\s*FINAL_QUESTIONS_START\s*-->([\s\S]*?)<!--\s*FINAL_QUESTIONS_END\s*-->/i);
  if (!match) return { found: false, malformed: false, questions: [] };

  const body = match[1];
  const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questions = [];
  let malformed = false;
  let expectedNum = 1;

  if (lines.length === 0) malformed = true;

  for (const line of lines) {
    const lineMatch = line.match(/^(\d+)\.\s+(.+\?)\s*$/);
    if (!lineMatch) {
      malformed = true;
      continue;
    }
    const num = parseInt(lineMatch[1], 10);
    if (num !== expectedNum) {
      malformed = true;
    }
    expectedNum++;
    questions.push(lineMatch[2].trim());
  }

  return { found: true, malformed, questions };
}

function inferAuditPath(episodeFilePath) {
  const dir = dirname(episodeFilePath);
  const file = basename(episodeFilePath);
  const epMatch = file.match(/^(ep\d+)/i);
  if (!epMatch) return null;
  return join(dir, 'faq-audits', `${epMatch[1].toLowerCase()}-faq-audit.md`);
}

function arraysMatchExactly(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ── Research-freshness field validation (Baseline Discovery Research) ──────
// Returns whether a freshness waiver is declared, so the caller can
// cross-check the Approved Exceptions section against it.
function validateFreshnessFields(auditContent, auditPath, errors) {
  const block = getHeadingBlock(auditContent, 'Baseline Discovery Research');
  if (!block) return false; // missing-heading already reported by the required-headings check

  let waiverActive = false;

  const checkedMatch = block.match(/^Research reference checked:\s*(\S.*)$/m);
  if (!checkedMatch || !/^\d{4}-\d{2}-\d{2}$/.test(checkedMatch[1].trim())) {
    errors.push(`Audit file ${auditPath} is missing or has a malformed "Research reference checked: YYYY-MM-DD" field under Baseline Discovery Research.`);
  }

  const ageMatch = block.match(/^Reference age:\s*(\S.*)$/m);
  if (!ageMatch || !/^\d+\s*days?$/.test(ageMatch[1].trim())) {
    errors.push(`Audit file ${auditPath} is missing or has a malformed "Reference age: N days" field under Baseline Discovery Research.`);
  }

  const statusMatch = block.match(/^Freshness status:\s*(\S.*)$/m);
  if (!statusMatch || !/^(Current|Joe-approved one-run waiver)$/.test(statusMatch[1].trim())) {
    errors.push(`Audit file ${auditPath} is missing or has an invalid "Freshness status" field (must be exactly "Current" or "Joe-approved one-run waiver") under Baseline Discovery Research.`);
  } else if (statusMatch[1].trim() === 'Joe-approved one-run waiver') {
    waiverActive = true;
    const waiverMatch = block.match(/^Freshness waiver approved by Joe:\s*(\S.*)$/m);
    if (!waiverMatch || !/^\d{4}-\d{2}-\d{2}$/.test(waiverMatch[1].trim())) {
      errors.push(`Audit file ${auditPath} declares a freshness waiver but is missing a valid "Freshness waiver approved by Joe: YYYY-MM-DD" field under Baseline Discovery Research.`);
    }
  }

  const materialMatch = block.match(/^Material guidance change found:\s*(\S.*)$/m);
  if (!materialMatch || !/^(No|Yes — production review blocked)$/.test(materialMatch[1].trim())) {
    errors.push(`Audit file ${auditPath} is missing or has an invalid "Material guidance change found" field (must be exactly "No" or "Yes — production review blocked") under Baseline Discovery Research.`);
  } else if (materialMatch[1].trim().startsWith('Yes')) {
    errors.push(`Audit file ${auditPath} reports a material guidance change ("Material guidance change found: Yes — production review blocked") — Joe and local ChatGPT review is required before this FAQ content can be used in production.`);
  }

  return waiverActive;
}

// ── Approved Exceptions cross-check ─────────────────────────────────────────
function validateApprovedExceptions(auditContent, auditPath, overrides, waiverActive, errors) {
  const block = getHeadingBlock(auditContent, 'Approved Exceptions');
  if (!block) return; // missing-heading already reported by the required-headings check

  const countOverrideSupplied = overrides.expectedKeyQuestions !== null || overrides.expectedFaqPairs !== null;
  if (countOverrideSupplied) {
    if (overrides.expectedKeyQuestions === null || overrides.expectedFaqPairs === null) {
      errors.push('If either --expected-key-questions or --expected-faq-pairs is supplied, both must be supplied together with the same value.');
    } else if (overrides.expectedKeyQuestions !== overrides.expectedFaqPairs) {
      errors.push(`--expected-key-questions (${overrides.expectedKeyQuestions}) and --expected-faq-pairs (${overrides.expectedFaqPairs}) must be the same value.`);
    } else {
      const n = overrides.expectedKeyQuestions;
      const pattern = new RegExp(`Count exception approved by Joe:\\s*${n}\\s*questions?\\s*—\\s*\\d{4}-\\d{2}-\\d{2}`);
      if (!pattern.test(block)) {
        errors.push(`Audit file ${auditPath}'s Approved Exceptions section is missing a matching "Count exception approved by Joe: ${n} questions — YYYY-MM-DD" entry for the supplied count override.`);
      }
    }
  }

  if (overrides.expectedMaxWords > DEFAULT_EXPECTED_MAX_WORDS) {
    const n = overrides.expectedMaxWords;
    const pattern = new RegExp(`Answer-length exception approved by Joe:\\s*${n}\\s*words\\s*—\\s*\\d{4}-\\d{2}-\\d{2}`);
    if (!pattern.test(block)) {
      errors.push(`Audit file ${auditPath}'s Approved Exceptions section is missing a matching "Answer-length exception approved by Joe: ${n} words — YYYY-MM-DD" entry for the supplied --expected-max-words override.`);
    }
  }

  if (waiverActive) {
    const pattern = /Research-freshness waiver approved by Joe:\s*\d{4}-\d{2}-\d{2}/;
    if (!pattern.test(block)) {
      errors.push(`Audit file ${auditPath}'s Approved Exceptions section is missing a matching "Research-freshness waiver approved by Joe: YYYY-MM-DD" entry for the declared freshness waiver.`);
    }
  }
}

// ── Bluesky post extraction ───────────────────────────────────────────────────
function extractBlueskyPosts(content) {
  const sectionMatch = content.match(/###\s*BLUESKY POSTS[\s\S]*?(?=\n#{2,3}\s|\n---\s*\n#{2,3}\s|$)/i);
  if (!sectionMatch) return [];

  const section = sectionMatch[0];
  const posts = [];
  const rawPosts = section.split(/(?=\*\*\d+\.\*\*)/);

  for (const raw of rawPosts) {
    const numMatch = raw.match(/^\*\*(\d+)\.\*\*/);
    if (!numMatch) continue;

    const num = parseInt(numMatch[1]);
    const body = raw.replace(/^\*\*\d+\.\*\*\s*/, '').trim();
    const lines = body.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) continue;

    const url = lines[lines.length - 1];
    const textLines = lines.slice(0, -1);
    const text = textLines.join('\n');
    const full = text + '\n' + url;

    posts.push({ num, text, url, full });
  }

  return posts;
}

// ── Main validator ────────────────────────────────────────────────────────────
function run(filePath, requestedSections, overrides) {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, 'utf8');
  const errors = [];
  const warnings = [];

  const faqOrKeyQuestionsInScope = shouldRun(requestedSections, 'FAQ') || shouldRun(requestedSections, 'KEY_QUESTIONS');

  // ── 1. Em-dashes (run for prose-bearing sections only) ───────────────────
  const validateEmDash =
    shouldRun(requestedSections, 'KEY_QUESTIONS') ||
    shouldRun(requestedSections, 'FAQ') ||
    shouldRun(requestedSections, 'BLUESKY') ||
    shouldRun(requestedSections, 'POLL') ||
    !requestedSections;

  if (validateEmDash) {
    const seoMatch = content.match(/##\s*SEO[\s\S]*?(?=\n##\s*COVER ART|\n##\s*$|$)/i);
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
    { key: 'POLL', pattern: /SPOTIFY POLL IDEAS/i, name: 'SPOTIFY POLL IDEAS' },
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

  // ── 4. Key Questions extraction — ALWAYS attempted whenever either
  //      KEY_QUESTIONS or FAQ is in scope, because synchronization must be
  //      checked either way, regardless of which one was requested. ───────
  let keyQuestions = null;
  if (faqOrKeyQuestionsInScope) {
    keyQuestions = extractKeyQuestionsText(content);
  }

  // ── 5. FAQ analysis (strict syntax, pairing, extraction) — always run
  //      whenever either section is in scope, for the same reason. ────────
  let faqAnalysis = { block: null, questions: null, answers: [], syntaxErrors: [], pairingErrors: [] };
  if (faqOrKeyQuestionsInScope) {
    faqAnalysis = analyzeFaqBlock(content);
  }
  const faqQuestions = faqAnalysis.questions;

  // ── 6. FAQ-specific checks (format, count, syntax, pairing, word count, narrative) ─
  if (shouldRun(requestedSections, 'FAQ')) {
    if (faqAnalysis.block === null) {
      errors.push('FREQUENTLY ASKED QUESTIONS section not found — cannot validate FAQ content.');
    } else {
      // Strict Q./A. syntax errors
      errors.push(...faqAnalysis.syntaxErrors);

      // Complete Q/A pairing — no orphan answers, no missing answers
      errors.push(...faqAnalysis.pairingErrors);

      const faqPairs = (faqQuestions || []).length;

      if (overrides.expectedFaqPairs !== null) {
        if (faqPairs !== overrides.expectedFaqPairs) {
          errors.push(`FAQ pair count is ${faqPairs} — approved override requires exactly ${overrides.expectedFaqPairs}.`);
        }
      } else if (faqPairs < NORMAL_COUNT_RANGE.min || faqPairs > NORMAL_COUNT_RANGE.max) {
        errors.push(`FAQ pair count is ${faqPairs} — normal range is ${NORMAL_COUNT_RANGE.min}-${NORMAL_COUNT_RANGE.max}. Pass --expected-faq-pairs=N if Joe approved an exception.`);
      }

      // Answer count must exactly equal question count
      if (faqAnalysis.answers.length !== faqPairs) {
        errors.push(`FAQ answer count (${faqAnalysis.answers.length}) does not match FAQ question count (${faqPairs}) — every question needs exactly one answer.`);
      }

      // FAQ banned podcast-narrative phrasing (answers only, case-insensitive)
      for (const answerText of faqAnalysis.answers) {
        const bannedMatch = findFaqNarrativeMatch(answerText);
        if (bannedMatch) {
          errors.push(`FAQ answer contains banned podcast-narrative phrase "${bannedMatch}" (FAQ-only rule). Reframe as standalone consumer guidance.`);
        }
      }

      // Word-count maximum
      const maxWords = overrides.expectedMaxWords;
      faqAnalysis.answers.forEach((answer, i) => {
        const wordCount = countWords(answer);
        if (wordCount > maxWords) {
          errors.push(`FAQ answer ${i + 1} is ${wordCount} words — exceeds the ${maxWords}-word maximum. Pass --expected-max-words=N if Joe approved an exception.`);
        }
      });
    }
  }

  // FAQ schema banned podcast-narrative phrasing (FAQ-only, case-insensitive) —
  // only applies if an accepted-answer block happens to exist; new FAQPage
  // schema generation itself is rejected outright below (check 8).
  if (shouldRun(requestedSections, 'FAQ') || shouldRun(requestedSections, 'SCHEMA')) {
    const regex = /"acceptedAnswer"\s*:\s*\{[\s\S]*?"text"\s*:\s*"((?:\\.|[^"\\])*)"/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const unescaped = match[1]
        .replace(/\\n/g, ' ')
        .replace(/\\r/g, ' ')
        .replace(/\\t/g, ' ')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .trim();
      if (unescaped.length > 0) {
        const bannedMatch = findFaqNarrativeMatch(unescaped);
        if (bannedMatch) {
          errors.push(`FAQ schema acceptedAnswer.text contains banned podcast-narrative phrase "${bannedMatch}" (FAQ-only rule). Reframe as standalone consumer guidance.`);
        }
      }
    }
  }

  // ── 7. Review Schema present (skip for interview episodes) ───────────────
  const isInterviewEpisode = /Type:.*interview episode/i.test(content);
  if (shouldRun(requestedSections, 'SCHEMA') && !isInterviewEpisode && !/"@type"\s*:\s*"Review"/.test(content)) {
    errors.push('No Review Schema block found. Add at least one Review schema for each wine reviewed.');
  }

  // ── 8. FAQPage schema must not be newly generated (HR-64) ────────────────
  if (shouldRun(requestedSections, 'SCHEMA') || shouldRun(requestedSections, 'FAQ')) {
    if (/"@type"\s*:\s*"FAQPage"/.test(content)) {
      errors.push('FAQPage schema block found — do not generate new FAQPage schema (HR-64). Review Schema only.');
    }
  }

  // ── 9. Key Questions count ────────────────────────────────────────────────
  if (shouldRun(requestedSections, 'KEY_QUESTIONS')) {
    if (keyQuestions === null) {
      errors.push('KEY QUESTIONS section not found — cannot validate Key Questions content.');
    } else {
      const keyQuestionCount = keyQuestions.length;

      if (overrides.expectedKeyQuestions !== null) {
        if (keyQuestionCount !== overrides.expectedKeyQuestions) {
          errors.push(`Key Questions count is ${keyQuestionCount} — approved override requires exactly ${overrides.expectedKeyQuestions}.`);
        }
      } else if (keyQuestionCount < NORMAL_COUNT_RANGE.min || keyQuestionCount > NORMAL_COUNT_RANGE.max) {
        errors.push(`Key Questions count is ${keyQuestionCount} — normal range is ${NORMAL_COUNT_RANGE.min}-${NORMAL_COUNT_RANGE.max}. Pass --expected-key-questions=N if Joe approved an exception.`);
      }
    }
  }

  // ── 10. Synchronization — runs whenever EITHER KEY_QUESTIONS or FAQ is in
  //       scope, requiring BOTH sections to exist, regardless of which one
  //       was individually named in --sections. ───────────────────────────
  if (faqOrKeyQuestionsInScope) {
    if (keyQuestions === null) {
      errors.push('Key Questions section required for Key Questions/FAQ synchronization but not found in the episode file.');
    }
    if (faqQuestions === null) {
      errors.push('FAQ section required for Key Questions/FAQ synchronization but not found in the episode file.');
    }
    if (keyQuestions !== null && faqQuestions !== null) {
      if (keyQuestions.length !== faqQuestions.length) {
        errors.push(`Key Questions count (${keyQuestions.length}) does not match FAQ pair count (${faqQuestions.length}) — they must be equal.`);
      } else if (!arraysMatchExactly(keyQuestions, faqQuestions)) {
        const firstMismatch = keyQuestions.findIndex((q, i) => q !== faqQuestions[i]);
        errors.push(`Key Questions and FAQ questions do not match exactly at position ${firstMismatch + 1}: Key Questions has "${keyQuestions[firstMismatch]}", FAQ has "${faqQuestions[firstMismatch]}".`);
      }
    }
  }

  // ── 11. Audit file: path inference, required headings, freshness fields,
  //       Approved Exceptions cross-check, FINAL_QUESTIONS. ────────────────
  if (faqOrKeyQuestionsInScope) {
    const auditPath = inferAuditPath(filePath);
    if (!auditPath) {
      errors.push('Could not infer FAQ audit path from the episode filename (expected an "ep[N]" prefix) — required whenever Key Questions or FAQ are in scope.');
    } else if (!existsSync(auditPath)) {
      errors.push(`FAQ audit file not found at ${auditPath} — required for Key Questions/FAQ validation.`);
    } else {
      const auditContent = readFileSync(auditPath, 'utf8');

      // Required exact headings — hard errors
      for (const heading of REQUIRED_AUDIT_HEADINGS) {
        if (!headingPattern(heading).test(auditContent)) {
          errors.push(`Audit file ${auditPath} is missing the required "${heading}" heading.`);
        }
      }

      // Required corroboration field labels — hard errors
      for (const field of REQUIRED_CORROBORATION_FIELDS) {
        if (!auditContent.includes(field)) {
          errors.push(`Audit file ${auditPath} is missing the required "${field}" corroboration field.`);
        }
      }

      // Research-freshness record — four exact fields, plus waiver/material-change handling
      const waiverActive = validateFreshnessFields(auditContent, auditPath, errors);

      // Approved Exceptions — cross-checked against active overrides and the freshness waiver
      validateApprovedExceptions(auditContent, auditPath, overrides, waiverActive, errors);

      // FINAL_QUESTIONS block: presence, well-formedness, sequential numbering, match
      const { found, malformed, questions: auditQuestions } = extractAuditFinalQuestions(auditContent);

      if (!found) {
        errors.push(`Audit file ${auditPath} is missing the required <!-- FINAL_QUESTIONS_START/END --> block.`);
      } else if (malformed) {
        errors.push(`Audit file ${auditPath}'s FINAL_QUESTIONS block is malformed — expected sequential numbered lines starting at 1, like "1. Question text?".`);
      } else {
        if (keyQuestions !== null && !arraysMatchExactly(auditQuestions, keyQuestions)) {
          errors.push(`Audit FINAL_QUESTIONS block does not match Key Questions exactly (wording or order differs).`);
        }
        if (faqQuestions !== null && !arraysMatchExactly(auditQuestions, faqQuestions)) {
          errors.push(`Audit FINAL_QUESTIONS block does not match FAQ questions exactly (wording or order differs).`);
        }
      }
    }
  }

  // ── 12. Spotify poll ideas ─────────────────────────────────────────────────
  if (shouldRun(requestedSections, 'POLL')) {
    const pollBlock = getSectionBlock(content, /^###\s*SPOTIFY POLL IDEAS/i);
    if (pollBlock) {
      const newsMarkersPoll = ['wine in the news', 'news desk'];
      const lowerPollBlock = pollBlock.toLowerCase();
      for (const marker of newsMarkersPoll) {
        if (lowerPollBlock.includes(marker)) {
          errors.push(`Spotify Poll Ideas section references "${marker}" — polls must anchor to core tasting/verdict content, never Wine in the News.`);
        }
      }
      const optionCount = pollBlock.split('\n').filter(l => /^\*\*Option \d+:/.test(l.trim())).length;
      if (optionCount === 0) {
        errors.push('No poll options found in Spotify Poll Ideas section. Expected at least one "**Option N: ...**" block.');
      }
    }
  }

  // ── 13. Bluesky posts ──────────────────────────────────────────────────────
  const posts = shouldRun(requestedSections, 'BLUESKY') ? extractBlueskyPosts(content) : [];

  if (shouldRun(requestedSections, 'BLUESKY')) {
    if (posts.length === 0) {
      errors.push('No Bluesky posts found. Expected 10 posts in "### BLUESKY POSTS" section.');
    } else if (posts.length !== 10) {
      errors.push(`Bluesky post count is ${posts.length} — must be exactly 10.`);
    }
  }

  if (posts.length > 0) {
    const teasers = posts.filter(p => p.num <= 3);
    for (const post of teasers) {
      if (!post.url.includes(PODCAST_DOMAIN)) {
        errors.push(`Post ${post.num} (teaser) must link to thewinepairpodcast.com. Got: "${post.url}" (HR-31).`);
      }
    }

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

    const domainMap = {};
    for (const { num, url } of factUrls) {
      try {
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        if (!domainMap[domain]) domainMap[domain] = [];
        domainMap[domain].push(num);
      } catch (_) {
        // unparseable URL — skip domain check for this post
      }
    }
    for (const [domain, nums] of Object.entries(domainMap)) {
      if (nums.length > 2) {
        warnings.push(`Posts ${nums.join(', ')} all use domain "${domain}" — no more than 2 fact posts should share a domain (HR-31 quality). Diversify sources.`);
      }
    }

    for (const post of posts) {
      const textLength = post.text.length;
      const totalLength = post.full.length;
      if (totalLength > 300) {
        errors.push(`Post ${post.num} is ${totalLength} total chars — must be under 300 (HR-26).`);
      } else if (textLength > 240) {
        warnings.push(`Post ${post.num} text is ${textLength} chars — aim for under 240 when a URL follows (HR-26).`);
      }
    }

    const newsMarkers = ['wine in the news', 'our wine in the news', 'news desk'];
    for (const post of posts) {
      for (const marker of newsMarkers) {
        if (post.full.toLowerCase().includes(marker)) {
          errors.push(`Post ${post.num} may reference the Wine in the News segment ("${marker}") — prohibited in Bluesky posts (HR-27).`);
        }
      }
    }

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

  console.log('\n  Mechanical checks only. Confirms the required audit records exist and are');
  console.log('  well-formed — does not independently verify the research, freshness judgment,');
  console.log('  approval, demand, strategic quality, factual accuracy, source sufficiency,');
  console.log('  AI-citation likelihood, or listener-growth impact.');

  return errors.length;
}

// ── Entry point ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md');
  console.log('Partial: node scripts/validate_episode.js outputs/episodes/ep[N]-[slug].md --sections=KEY_QUESTIONS,FAQ,POLL');
  console.log('Optional count override (both required together, Joe-approved, audit-matched): --expected-key-questions=6 --expected-faq-pairs=6');
  console.log('Optional length override (Joe-approved, audit-matched, only above 60): --expected-max-words=70');
  console.log('Example: node scripts/validate_episode.js outputs/episodes/ep217-frappato.md');
  process.exit(1);
}

let requestedSections = null;
let overrides = {
  expectedKeyQuestions: null,
  expectedFaqPairs: null,
  expectedMaxWords: DEFAULT_EXPECTED_MAX_WORDS,
};
try {
  requestedSections = parseSectionsArg(args);
  overrides = {
    expectedKeyQuestions: parseOptionalCountOverride(args, '--expected-key-questions'),
    expectedFaqPairs: parseOptionalCountOverride(args, '--expected-faq-pairs'),
    expectedMaxWords: parsePositiveIntArg(args, '--expected-max-words', DEFAULT_EXPECTED_MAX_WORDS),
  };
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const fileArgs = args.filter(a =>
  !a.startsWith('--sections=') &&
  !a.startsWith('--expected-key-questions=') &&
  !a.startsWith('--expected-faq-pairs=') &&
  !a.startsWith('--expected-max-words=')
);
if (fileArgs.length === 0) {
  console.error('No file paths provided.');
  process.exit(1);
}

let totalErrors = 0;
for (const filePath of fileArgs) {
  totalErrors += run(filePath, requestedSections, overrides);
}

console.log('');
if (totalErrors === 0) {
  console.log('✓ All checks passed. Ready to show Joe.');
  process.exit(0);
} else {
  console.log(`✗ ${totalErrors} error(s) found. Fix before showing Joe.`);
  process.exit(1);
}
