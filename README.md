# Goblinfall

A tiny deterministic terminal auto-battler. Waves of goblins march down a
single lane toward your base; your defenders fight them off automatically
while you watch the battle log scroll by. No input needed — grab a coffee
and enjoy the siege.

## Running it

```bash
npm install
npm start
```

Every battle is fully deterministic. Pass a seed to replay the exact same
fight, or try different seeds for different battles:

```bash
npm start -- --seed 42
```

## Sample output

```
--- Turn  31 -----------------------------------
 Base [##########]  40/40 |. . S A M S 2 g . . . .|
   Stone Golem hits Spear Militia for 6 damage.
   Spear Militia hits Orc Raider for 2 damage.
   Frost Mage hits Orc Raider for 4 damage.
   Archer Tower hits Orc Raider for 3 damage.

--- Turn  32 -----------------------------------
 Base [##########]  40/40 |. . S A M . 2 . . . . .|
   Stone Golem hits Spear Militia for 6 damage.
   Stone Golem is slain.
   Spear Militia is slain.
```

## The reference configuration (what to put where)

This branch adds a complete Claude Code configuration on top of `main`.
Each piece answers the same question — *where does this information
belong?* — differently:

**`CLAUDE.md`** — always-loaded context. It holds the things Claude needs
on *every* task and can't discover reliably on its own: the real commands
(`npm run check`, not `npm test`), the conventions (snake_case files,
`expectState()`, `// BALANCE:` trailers), the engine boundary, and a
five-line architecture map. Small on purpose: every line here is a tax on
every future prompt, so only always-relevant facts earn a spot.

**`.claude/commands/review-diff.md`** — a slash command, i.e. a prompt you
run on demand. Reviewing a diff against the conventions is a repeatable
*request*, not standing knowledge, so it lives behind `/review-diff`
instead of bloating CLAUDE.md. It injects `git diff` output at invocation
time, so the prompt always sees the current changes.

**`.claude/skills/add-enemy/SKILL.md`** — a skill: procedural knowledge
loaded only when the task matches. The four-step add-an-entity procedure
is too long for CLAUDE.md and too easy to half-remember without it. Claude
pulls it in automatically when asked to add a unit (or explicitly via
`/add-enemy`), follows the checklist, and verifies with `npm run verify`.

**`.claude/settings.json`** — hooks: *enforcement*, not advice.
Instructions in CLAUDE.md can be forgotten; hooks cannot. The PostToolUse
hook runs the linter after every file edit and feeds failures straight
back to Claude (`npm run lint 1>&2 || exit 2`), closing a self-correcting loop.
The PreToolUse hook (`.claude/hooks/protect-engine.mjs`) runs *before*
every edit and vetoes anything under `src/engine/` — CLAUDE.md asks Claude
to stay out of the engine; this hook makes it impossible.

**`.claude/agents/code-reviewer.md`** — a subagent: a separate Claude with
its own narrow role, prompt, and toolbox. Reviewing is deliberately
restricted to read-only tools so the reviewer reports instead of "helpfully"
editing, and running it as a subagent keeps big file dumps out of the main
conversation's context.

## License

MIT
