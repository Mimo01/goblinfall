---
description: Review the current git diff against Goblinfall's project conventions
allowed-tools: Read, Grep, Glob, Bash(git diff *), Bash(git status *)
---

Review the current working-tree changes against this project's conventions.

Current changes:

!`git diff HEAD`

Untracked files:

!`git status --porcelain`

Check every changed or added file against this checklist:

1. **snake_case filenames** — every file under `src/` is `snake_case.ts`.
2. **expectState only** — test files never use `node:assert` directly;
   all assertions go through `expectState()` from `test/helpers.ts`.
3. **BALANCE comment** — every entity file under `src/entities/` ends with
   a `// BALANCE: <key>` line whose key exists in `data/balance.json`.
4. **Engine untouched** — nothing under `src/engine/` is modified.
5. **No hardcoded numbers** — game stats belong in `data/balance.json`,
   not in source files.
6. **Complete entity wiring** — any new entity is registered in
   `src/registry.ts`, has a stats block in `data/balance.json`, and has a
   baseline entry in `test/fixtures/entities.json`.

Report the result as a checklist: one line per rule, ✅ or ❌, with
file and line references for every violation. Finish with a one-line
verdict: ready to commit, or what must be fixed first. Do not fix
anything yourself — this command only reports.
