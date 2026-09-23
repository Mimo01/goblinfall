# Workshop extras

Finished a block early? Pick the extra for the block you just did. Each one
goes one step deeper into the same idea — no need to skip ahead.

---

## Block 2 — First contact

1. Run a few different battles: `npm start -- --seed 42`, `--seed 7`.
2. In your Claude session, ask:

   ```
   Explain how this repo is structured and how I run the tests.
   ```

   Watch how many files Claude has to open to answer. Everything it had
   to go looking for is a candidate for CLAUDE.md in the next block.

---

## Block 3 — CLAUDE.md

1. Run `/context` and find the line for your CLAUDE.md. That is what it
   costs on every single prompt, in every session.
2. Do ticket #2 from BACKLOG.md.
3. Run `/init` and read what it proposes — then **reject** the edit.
   Compare it with yours: `/init` finds the commands and structure on its
   own, but it cannot know "tests never call assert directly". Rules that
   only live in people's heads have to be written down by people.

---

## Block 4 — Slash command

Make `/review-diff` take a focus. Add a line like this to the command body:

```markdown
If the user gave extra instructions, focus on them: $ARGUMENTS
```

Then try `/review-diff only check the test files`.

---

## Block 4 — Skill

Do ticket #6 (Ballista) in a fresh session. It is a **defender**, not an
enemy — does your skill handle that, or did you write it only for enemies?
If Claude stumbles, fix the skill, not the chat. Then ticket #7 (Bone Archer).

---

## Block 5 — Hooks

The lint hook reacts *after* an edit. Now add one that runs *before* an
edit and blocks it: nobody touches `src/engine/`.

1. Create `.claude/hooks/protect-engine.mjs`:

   ```js
   let input = '';
   process.stdin.on('data', (c) => (input += c)).on('end', () => {
     const path = JSON.parse(input).tool_input?.file_path ?? '';
     if (path.replaceAll('\\', '/').includes('/src/engine/')) {
       console.error('Blocked: src/engine/ is off-limits. Extend the game via src/entities/ and data/balance.json.');
       process.exit(2);
     }
   });
   ```

2. Add a `PreToolUse` entry next to the existing `PostToolUse` one in
   `.claude/settings.json`:

   ```json
   "PreToolUse": [
     {
       "matcher": "Edit|Write",
       "hooks": [
         { "type": "command", "command": "node .claude/hooks/protect-engine.mjs" }
       ]
     }
   ]
   ```

3. Fresh session, then:

   ```
   In src/engine/renderer.ts, print the turn number in square brackets.
   ```

   The edit is blocked and Claude is told why. CLAUDE.md *asks* Claude to
   stay out of the engine; this hook makes it impossible.

---

## Block 6 — Subagents

Do ticket #9 (tune the Orc Raider). Changing stats in `balance.json`
breaks the baseline snapshot in `test/fixtures/entities.json` — does your
CLAUDE.md or skill anticipate that, or does Claude find out the hard way?
Afterwards, run your `code-reviewer` agent on the files it changed.

---

## Any time — the boss fight

Ticket #10 (Gravehag Shaman) uses everything at once: the skill for the
four steps, the `special()` hook on the entity for the healing, the lint
hook as a safety net, and the `code-reviewer` agent for a final pass.
