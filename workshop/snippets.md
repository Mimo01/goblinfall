# Workshop snippets

Copy-paste skeletons for the hands-on blocks, so nobody loses ten minutes
to a YAML indentation error. The *structure* is correct and complete — the
content between the angle brackets is what you write during the workshop.

---

## 1. CLAUDE.md skeleton (repo root)

```markdown
# <Project name>

<one-line description of what this project is>

## Commands

<the commands that actually work in this repo, and what they do>

## Conventions

<the rules Claude keeps getting wrong without help>

## Architecture

<a short map: where things live, how they connect>

## Boundaries

<what must never be touched, and what to do instead>
```

---

## 2. Slash command skeleton (`.claude/commands/<name>.md`)

The file name becomes the command name: `.claude/commands/review-diff.md`
is invoked as `/review-diff`.

```markdown
---
description: <one line - what this command does>
allowed-tools: Read, Grep, Glob, Bash(git diff *), Bash(git status *)
---

Current changes:

!`git diff HEAD`

Untracked files:

!`git status --porcelain`

<instructions for Claude go here. Write them as if briefing a colleague:
what to look at, what to check, what the output should look like.>
```

Notes:
- `allowed-tools` pre-approves tools so the command runs without permission
  prompts. `Bash(git diff *)` allows only that command pattern.
- `` !`command` `` runs the command when you invoke the slash command and
  pastes its output into the prompt. The command must be allowed in
  `allowed-tools`.
- `git diff` does not show brand-new (untracked) files — that's why the
  skeleton also includes `git status --porcelain`.
- `$ARGUMENTS` anywhere in the body is replaced by whatever the user types
  after the command.

---

## 3. Skill skeleton (`.claude/skills/<skill-name>/SKILL.md`)

The directory name becomes the skill name: `.claude/skills/add-enemy/SKILL.md`
can be invoked as `/add-enemy`, and Claude can also load it on its own when
the `description` matches the task at hand.

```markdown
---
name: <skill-name>
description: <what this skill does AND when to use it - this line is how
  Claude decides to load the skill, so mention the trigger phrases>
---

<the procedure goes here. Numbered steps, exact file paths, and the
verification command at the end work best.>
```

---

## 4. Hook (`.claude/settings.json`)

Ready to copy verbatim — one hook: after every file edit, run the linter;
if it fails, the failure is shown to Claude, which fixes it immediately.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npm run lint 1>&2 || exit 2" }
        ]
      }
    ]
  }
}
```

Notes:
- `matcher` matches tool names: `Edit|Write` covers file edits and file
  creation.
- Exit code semantics: `0` = continue silently, `2` = stop and show
  **stderr to Claude**.
- `1>&2` routes the linter's stdout to stderr, so Claude sees the full
  lint report, not just "lint failed".
- `PostToolUse` runs after the tool. Other events exist too — most notably
  `PreToolUse`, which runs *before* the tool call and can veto it entirely
  (exit 2 blocks the call): the right place for rules that must never
  fail, like protected paths or secrets.

---

## 5. Subagent skeleton (`.claude/agents/<name>.md`)

```markdown
---
name: <agent-name>
description: <when Claude should delegate to this agent>
tools: Read, Grep, Glob
---

<the agent's system prompt goes here: its role, its rubric, and what its
report should look like. Listing only read tools makes it read-only.>
```
