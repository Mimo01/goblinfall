# Goblinfall

Deterministic single-lane terminal auto-battler. TypeScript on Node 18+,
no runtime dependencies. Everything runs offline.

## Commands

- `npm start` — run the default battle (seed 1337; output is fully reproducible)
- `npm start -- --seed 42` — run with a specific seed; same seed → byte-identical output
- `npm run check` — run the tests. **There is no `npm test` script.**
- `npm run verify` — lint + typecheck + tests. Run this before considering any change done.
- `npm run lint` / `npm run typecheck` — the individual steps

## Conventions

- Filenames in `src/` are `snake_case.ts` — `goblin_grunt.ts`, never `goblinGrunt.ts` or `GoblinGrunt.ts`.
- Tests never call `node:assert` directly. Always use `expectState(actual, expected, label)` from `test/helpers.ts`.
- Every entity file ends with a one-line comment naming its balance key, e.g. `// BALANCE: enemies.goblin_grunt`.
- Game numbers (HP, damage, waves, layout) live in `data/balance.json` — never hardcoded in source.

## Architecture

- `src/engine/` — simulation loop, seeded RNG, renderer, shared types.
  **Never modify engine files.** Extend the game via entities and balance
  data only.
- `src/entities/` — one file per enemy/defender. Each exports a factory
  that reads its stats from `balance.json` and returns a plain object.
- `src/registry.ts` — the central registry. An entity exists in the game
  only if it is registered in the `ENEMIES` or `DEFENDERS` map here.
- `data/balance.json` — all stats, wave composition, and defender layout.
- `test/fixtures/entities.json` — baseline stat snapshots. Every registered
  entity needs an entry here or `npm run check` fails with a "state drift"
  error. Changing stats in `balance.json` means updating the snapshot too.

Data flow: entity factories → `registry.ts` → engine spawns from the
registry using `balance.json` → renderer prints the battle log.

## Adding an enemy or defender

Use the `add-enemy` skill — it encodes the exact four-step procedure
(entity file → registry → balance stats → test fixture). Skipping any step
breaks `npm run check` or the game.
