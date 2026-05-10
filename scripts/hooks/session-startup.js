// UserPromptSubmit hook: auto-runs session startup on the first message of each session.
// Fires before Claude responds. On subsequent messages, exits silently.
// Output goes to Claude as additionalContext (not shown in the visible transcript).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const data = JSON.parse(fs.readFileSync(0, 'utf8'));
  const transcriptPath = data.transcript_path || '';

  // Detect first message: transcript file is empty when hook fires before any response.
  let lineCount = 0;
  try {
    const content = fs.readFileSync(transcriptPath, 'utf8');
    lineCount = content.split('\n').filter(l => l.trim()).length;
  } catch (_) {
    lineCount = 0; // file doesn't exist = brand new session
  }

  if (lineCount > 0) {
    process.exit(0); // Not the first message — skip silently
  }

  const dir = process.cwd();

  const run = (cmd) => {
    try {
      return execSync(cmd, { cwd: dir, timeout: 15000, encoding: 'utf8' }).trim() || '(ok)';
    } catch (e) {
      return e.stdout ? e.stdout.trim().split('\n')[0] : 'timed out or failed';
    }
  };

  const scanOut    = run('node scripts/find_source_files.js --scan');
  const titlesOut  = run('node scripts/update_episode_titles.js');
  const promptsOut = run('node scripts/ingest_prompts.js');

  const workLog = (() => {
    try {
      return fs.readFileSync(path.join(dir, 'docs/work-log.md'), 'utf8')
        .split('\n').slice(0, 80).join('\n');
    } catch (e) {
      return `(could not read work-log.md: ${e.message})`;
    }
  })();

  const context = [
    '=== SESSION STARTUP (automatic) ===',
    'Scripts completed:',
    `  find_source_files --scan : ${scanOut}`,
    `  update_episode_titles    : ${titlesOut}`,
    `  ingest_prompts           : ${promptsOut}`,
    '',
    'Work log (top 80 lines — Immediate next actions and project status):',
    workLog,
    '',
    'INSTRUCTION: Report the startup summary to Joe before addressing his request.',
    'Format: "Drive synced: X files indexed, Y titles updated, Z prompts synced.',
    'Current priorities: 1. [first item from Immediate next actions]',
    '                    2. [second item] 3. [third item]"',
    '=== END STARTUP ===',
  ].join('\n');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: context,
    },
  }));

} catch (e) {
  // Never block the conversation — surface the error quietly
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: `[Session startup hook error — run startup manually: ${e.message}]`,
    },
  }));
}
