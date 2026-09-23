---
name: add-enemy
description: Add a new enemy or defender unit to Goblinfall. Use whenever the task is to add, create, or implement a new enemy, defender, monster, unit, or tower type.
---

Adding an entity to Goblinfall takes **exactly four steps, in this order**.
Skipping any one of them breaks `npm run check` or the game itself.

## The procedure

1. **Create the entity file** — `src/entities/<snake_case_name>.ts`
   (filename must be snake_case). Copy the pattern from
   `src/entities/goblin_grunt.ts`: a single exported factory function that
   reads its stats from `balance.enemies.<name>` (or
   `balance.defenders.<name>`) and throws if the key is missing. The file
   must end with the one-line comment `// BALANCE: enemies.<name>` (or
   `defenders.<name>`).

2. **Register it** — in `src/registry.ts`, add the import and an entry in
   the `ENEMIES` map (or `DEFENDERS` for defenders). Unregistered entities
   do not exist as far as the game is concerned.

3. **Add balance stats** — in `data/balance.json`, add the stats block
   under `enemies` (name, glyph, hp, damage, speed, range) or `defenders`
   (same, but no speed). If the ticket says to use the unit in a wave or
   in the layout, add it there too.

4. **Add the test fixture** — in `test/fixtures/entities.json`, add a
   baseline snapshot entry with the same key and the same stats
   (enemies include `speed`; defenders do not). Without this,
   `npm run check` fails with a "State drift detected" error.

## Checklist before calling it done

- [ ] Entity filename is snake_case and ends with the `// BALANCE:` comment
- [ ] Registered in `src/registry.ts`
- [ ] Stats block in `data/balance.json` under the matching key
- [ ] Baseline entry in `test/fixtures/entities.json`
- [ ] `npm run verify` passes
- [ ] If you touched waves or layout: `npm start` still ends in victory
      (and for a seeded ticket, check the seeds the ticket names)
