// scripts/hooks/blog-draft-guard.js
// PreToolUse hook: blocks Write, Edit, Bash, and PowerShell tool calls that would:
//   (a) create or modify a blog draft (outputs/blog-post-*.md) without a valid Joe-approved brief
//   (b) write to the Joe-only approvals directory (docs/opportunity-briefs/approvals/)
//
// Fires on Write, Edit, Bash, and PowerShell tool calls.
// Exits 0 immediately for non-relevant tool targets.
//
// For blog draft files, requires ALL THREE:
//   1. docs/opportunity-briefs/[slug]-brief.md exists
//   2. docs/opportunity-briefs/approvals/[slug].approved exists (Joe-only — see HR-65)
//   3. Brief passes structural validation via validateBrief()
//
// For the approvals directory (HR-65):
//   Write/Edit: denied if file_path targets docs/opportunity-briefs/approvals/**
//   Bash/PowerShell: denied if command explicitly mentions an approvals/*.approved path
//
// Limitation: On native Windows without WSL2, Claude Code's Bash sandbox is unavailable.
// Indirect writes (dynamically constructed paths, shell variable expansion) are not catchable
// by PreToolUse hooks without OS-level sandboxing. This is a documented residual limitation.
// Using any technique to bypass this hook is a rule violation (HR-65).
//
// Diagnostic: when a Bash or PowerShell tool fires this hook, the tool_name is appended to
// outputs/hook-diagnostic.log. This confirms which tool name the environment actually uses.

import { readFileSync, existsSync, appendFileSync } from 'fs';
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

    const projectDir = process.env.CLAUDE_PROJECT_DIR || resolve(__dirname, '../../');

    // Diagnostic log: record tool_name for every terminal invocation so the actual
    // environment tool name is confirmed empirically.
    const isTerminalTool = toolName !== 'Write' && toolName !== 'Edit' && toolName !== '';
    if (isTerminalTool) {
      try {
        const logPath = join(projectDir, 'outputs', 'hook-diagnostic.log');
        const cmd = (toolInput.command || toolInput.cmd || '').slice(0, 150);
        appendFileSync(logPath, `${new Date().toISOString()} tool_name=${JSON.stringify(toolName)} cmd=${JSON.stringify(cmd)}\n`);
      } catch (_) { /* non-critical */ }
    }

    let filePath = '';
    let command = '';

    if (toolName === 'Write' || toolName === 'Edit') {
      filePath = toolInput.file_path || '';

      // HR-65: deny any Write/Edit targeting the Joe-only approvals directory
      if (/(?:^|[/\\])docs[/\\]opportunity-briefs[/\\]approvals[/\\]/i.test(filePath)) {
        deny(
          `Write blocked: docs/opportunity-briefs/approvals/ is a Joe-only directory (HR-65).\n\n` +
          `Claude must never create, modify, or delete files in this directory. ` +
          `Joe creates approval marker files here manually from his own terminal. ` +
          `The presence of [slug].approved here is how Joe's approval is technically distinguished from Claude's.`
        );
      }

    } else if (toolName === 'Bash' || toolName === 'PowerShell' || toolName === 'Terminal' || toolName === 'computer') {
      // Cover Bash, PowerShell, and any other terminal tool variant
      command = toolInput.command || toolInput.cmd || '';

      // HR-65: deny commands that explicitly mention an approvals marker file path
      // This catches common write patterns; dynamic path construction is a documented residual limitation
      if (/docs[/\\]opportunity-briefs[/\\]approvals[/\\][^'" \t\n\\]+\.approved/i.test(command)) {
        deny(
          `Command blocked: explicit reference to docs/opportunity-briefs/approvals/ in a terminal command (HR-65).\n\n` +
          `Claude must not create or modify approval marker files. ` +
          `Joe creates these files manually from his own terminal, outside Claude Code's tool system.\n\n` +
          `Dynamic construction of approval paths is also prohibited (HR-65). ` +
          `On native Windows without WSL2, dynamically constructed paths are a documented residual limitation — not a permitted route.`
        );
      }

      // Extract blog-post path from command string (explicit paths only)
      const pathMatch = command.match(/outputs[/\\]blog-post-[^'" \t\n\\]+\.md/);
      if (pathMatch) {
        filePath = pathMatch[0];
      }
    }

    // Only apply blog draft guard to blog draft files: outputs/blog-post-*.md
    const isBlogDraft = /(?:^|[/\\])outputs[/\\]blog-post-.+\.md$/.test(filePath);
    if (!isBlogDraft) {
      process.exit(0);
    }

    // Derive the slug and expected paths
    const slug = basename(filePath, '.md').replace(/^blog-post-/, '');
    const briefPath = join(projectDir, 'docs', 'opportunity-briefs', `${slug}-brief.md`);
    const approvalPath = join(projectDir, 'docs', 'opportunity-briefs', 'approvals', `${slug}.approved`);

    // Check 1: brief file must exist
    if (!existsSync(briefPath)) {
      deny(
        `Blog draft blocked: no opportunity brief found for "${slug}".\n\n` +
        `Expected: docs/opportunity-briefs/${slug}-brief.md\n\n` +
        `The opportunity brief must be completed and approved by Joe before this draft can be created or edited. ` +
        `Use the template at docs/opportunity-briefs/template.md.`
      );
    }

    // Check 2: Joe approval file must exist (HR-65 — separate file, Joe-only directory)
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
        `Blog draft blocked: brief exists and is approved, but fails structural validation.\n\n` +
        `Brief: docs/opportunity-briefs/${slug}-brief.md\n\n` +
        `${issues.length} required field(s) incomplete:\n${issueList}`
      );
    }

    // Brief found, Joe approval confirmed, structure valid — allow
    process.exit(0);
  } catch (e) {
    // Never block on hook errors — fail open so a script bug doesn't lock the workspace
    process.exit(0);
  }
}());

