// PreToolUse hook: block any edit or write under src/engine/.
// Exit 2 vetoes the tool call and shows stderr to Claude.
let input = '';
process.stdin.on('data', (c) => (input += c)).on('end', () => {
  const path = JSON.parse(input).tool_input?.file_path ?? '';
  if (path.replaceAll('\\', '/').includes('/src/engine/')) {
    console.error('Blocked: src/engine/ is off-limits. Extend the game via src/entities/ and data/balance.json.');
    process.exit(2);
  }
});
