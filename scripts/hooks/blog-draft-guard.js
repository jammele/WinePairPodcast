// scripts/hooks/blog-draft-guard.js
// PreToolUse hook: blocks Write or Edit to outputs/blog-post-*.md
// unless a structurally valid, approved opportunity brief exists at the expected path.
//
// Fires on every Write and Edit tool call. Exits 0 immediately for non-blog-draft files.
// For blog draft files, requires: docs/opportunity-briefs/[slug]-brief.md exists and passes validation.
//
// Hook output format: JSON with hookSpecificOutput.permissionDecision
// See: https://code.claude.com/docs/en/hooks#pretooluse-decision-control

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateBrief } from '../validate_blog_opportunity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  }));
  process.exit(0);
}

(function main() {
  try {
    const rawInput = readFileSync(0, 'utf8');
    const data = JSON.parse(rawInput);
    const filePath = (data.tool_input || {}).file_path || '';

    // Only apply to blog draft files: outputs/blog-post-*.md
    const isBlogDraft = /(?:^|[\/\\])outputs[\/\\]blog-post-.+\.md$/.test(filePath);
    if (!isBlogDraft) {
      process.exit(0);
    }

    // Derive the slug and expected brief path
    const slug = basename(filePath, '.md').replace(/^blog-post-/, '');
    const projectDir = process.env.CLAUDE_PROJECT_DIR || resolve(__dirname, '../../');
    const briefPath = join(projectDir, 'docs', 'opportunity-briefs', `${slug}-brief.md`);

    // Check 1: brief file must exist
    if (!existsSync(briefPath)) {
      deny(
        `Blog draft blocked: no opportunity brief found for "${slug}".\n\n` +
        `Expected: docs/opportunity-briefs/${slug}-brief.md\n\n` +
        `The opportunity brief must be completed and approved by Joe before this draft can be created or edited. ` +
        `Use the template at docs/opportunity-briefs/template.md. ` +
        `The brief requires: archive inventory (all related episodes), query cluster evidence, ` +
        `Wine Pair angle, listener path, excluded scope, and Joe's explicit approval. ` +
        `Format, episode sources, and target query are outputs of the brief — not independent declarations.`
      );
    }

    // Check 2: brief must pass structural validation
    const briefContent = readFileSync(briefPath, 'utf8');
    const issues = validateBrief(briefContent);

    if (issues.length > 0) {
      const issueList = issues.map(i => `  - ${i}`).join('\n');
      deny(
        `Blog draft blocked: opportunity brief exists but fails structural validation.\n\n` +
        `Brief: docs/opportunity-briefs/${slug}-brief.md\n\n` +
        `${issues.length} required field(s) incomplete:\n${issueList}\n\n` +
        `Complete all required brief fields and ensure Joe has approved before drafting.`
      );
    }

    // Brief found and valid — allow the tool call to proceed
    process.exit(0);
  } catch (e) {
    // Never block on hook errors — fail open so a script bug doesn't lock the workspace
    process.exit(0);
  }
}());

