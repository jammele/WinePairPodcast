// PostToolUse hook: reminds Claude to update the work log after writing to outputs/ or data/
try {
  const data = JSON.parse(require('fs').readFileSync(0, 'utf8'));
  const filePath = (data.tool_input || {}).file_path || '';
  const inOutputsOrData = /([\\/])(outputs|data)[\\/]/.test(filePath);
  const isWorkLog = filePath.includes('work-log');
  if (inOutputsOrData && !isWorkLog) {
    process.stdout.write(
      'REMINDER: You just saved ' + filePath + '. Update docs/work-log.md and commit before your next action.\n'
    );
  }
} catch (e) {
  // ignore — never block the tool call
}
