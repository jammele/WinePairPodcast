// scripts/hooks/blog-draft-guard.js
// PreToolUse hook: blocks Write, Edit, and explicit-path Bash commands targeting outputs/blog-post-*.md
// unless a structurally valid, Joe-approved opportunity brief exists at the expected path.
//
// Fires on every Write, Edit, and Bash tool call. Exits 0 immediately for non-blog-draft targets.
//
// For blog draft files, requires ALL THREE:
//   1. docs/opportunity-briefs/[slug]-brief.md exists
//   2. docs/opportunity-briefs/approvals/[slug].approved exists (Joe-only file — see HR-65)
//   3. Brief passes structural validation via validateBrief()
//
// Hook output format: JSON with hookSpecificOutput.permissionDecision
// See: https://code.claude.com/docs/en/hooks#pretooluse-decision-control
//
// Limitation: Bash path detection uses regex on the command string. Indirect writes (e.g.
// node -e with a dynamically constructed path) are not catchable without OS-level sandboxing.
// Direct path mentions in the command string are caught.

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
    const toolName = data.tool_name || '';
    const toolInput = data.tool_input || {};

    let filePath = '';

    if (toolName === 'Write' || toolName === 'Edit') {
      // Built-in file tools: path is in file_path
      filePath = toolInput.file_path || '';
    } else if (toolName === 'Bash') {
      // Terminal: extract blog-post path from command string (best-effort, explicit paths only)
      const command = toolInput.command || toolInput.cmd || '';
      const pathMatch = command.match(/outputs[/\\]blog-post-[^'" \t\n\\]+\.md/);
      if (pathMatch) {
        filePath = pathMatch[0];
      }
    }

    // Only apply to blog draft files: outputs/blog-post-*.md
    const isBlogDraft = /(?:^|[/\\])outputs[/\\]blog-post-.+\.md$/.test(filePath);
    if (!isBlogDraft) {
      process.exit(0);
    }

    // Derive the slug and expected paths
    const slug = basename(filePath, '.md').replace(/^blog-post-/, '');
    const projectDir = process.env.CLAUDE_PROJECT_DIR || resolve(__dirname, '../../');
    const briefPath = join(projectDir, 'docs', 'opportunity-briefs', `${slug}-brief.md`);
    const approvalPath = join(projectDir, 'docs', 'opportunity-briefs', 'approvals', `${slug}.approved`);

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

    // Check 2: Joe approval file must exist (separate from brief content — see HR-65)
    if (!existsSync(approvalPath)) {
      deny(
        `Blog draft blocked: brief exists for "${slug}" but has not been approved by Joe.\n\n` +
        `Expected approval file: docs/opportunity-briefs/approvals/${slug}.approved\n\n` +
        `Joe creates this file to record his approval. Claude never creates or modifies files in ` +
        `docs/opportunity-briefs/approvals/. Editing the Status field in the brief does not satisfy this check.`
      );
    }

    // Check 3: brief must pass structural validation
    const briefContent = readFileSync(briefPath, 'utf8');
    const issues = validateBrief(briefContent);

    if (issues.length > 0) {
      const issueList = issues.map(i => `  - ${i}`).join('\n');
      deny(
        `Blog draft blocked: opportunity brief exists and is approved, but fails structural validation.\n\n` +
        `Brief: docs/opportunity-briefs/${slug}-brief.md\n\n` +
        `${issues.length} required field(s) incomplete:\n${issueList}\n\n` +
        `Complete all required brief fields before drafting.`
      );
    }

    // Brief found, Joe approval confirmed, structure valid — allow the tool call to proceed
    process.exit(0);
  } catch (e) {
    // Never block on hook errors — fail open so a script bug doesn't lock the workspace
    process.exit(0);
  }
}());

