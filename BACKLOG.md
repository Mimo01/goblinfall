# Backlog

Small, self-contained tasks, ordered roughly easy → harder. Pick the next
one whenever you have time to spare.

## 1. Battle log understates damage

Every hit in the battle log prints one point lower than the damage actually
dealt — an Archer Tower that deals 4 damage logs "for 3 damage." The
simulation itself is correct; only the displayed number is wrong. Fix the
display and add a regression test so it can't come back.

## 2. Typo in the victory banner

The end-of-battle banner reads "VICTROY!". Fix the spelling. That's it,
that's the ticket.

## 3. HP bar shows health at zero HP

A bar rendered for 0 HP shows one filled tick (`#---------`) instead of an
empty bar, so a destroyed base still displays a sliver of health in the
defeat banner. To see it in action, remove the entries under `layout` in
`data/balance.json` and run the game. Zero HP should render a fully empty
bar; a fix must not change how any other HP value renders.

## 4. New enemy: Shadow Imp

Add a fast, fragile enemy: name "Shadow Imp", glyph "i", 5 HP, 2 damage,
speed 3, range 1. Add two of them to wave 2 so the early game gets more
hectic. The default battle should still end in victory.

## 5. New enemy: Armored Troll

Add a slow bruiser: name "Armored Troll", glyph "T", 28 HP, 5 damage,
speed 1, range 1. Add one to the end of the final wave as a second boss
alongside the Stone Golem. Verify the default battle still ends in victory —
narrowly is fine, that's the point.

## 6. New defender: Ballista

Add a long-range siege defender: name "Ballista", glyph "B", 10 HP,
9 damage, range 6. Place it at lane position 1 in the default layout so it
snipes over everyone's heads from the back line.

## 7. New enemy: Bone Archer

Add our first ranged attacker: name "Bone Archer", glyph "b", 7 HP,
3 damage, speed 1, range 2. It should stop two cells short of a defender
and shoot from there — the engine already supports this via the `range`
stat, so no engine changes are needed. Add one to wave 3.

## 8. Refactor the formatting helpers

`src/utils/formatting.ts` has grown crusty: duplicated padding helpers,
magic numbers, variable names that lie about what they hold, and at least
one branch that can never execute. Clean it up without changing any battle
log output (except where other tickets already changed it).

## 9. Tune the mid-game difficulty

Wave 3 melts before it ever threatens the spear line. In
`data/balance.json`, buff the Orc Raider from 14 HP / 5 damage to
18 HP / 6 damage, then run a few seeds (1337, 42, 7) and confirm the
battle still ends in victory but the front line actually takes losses.

## 10. (Stretch) New enemy: Gravehag Shaman

Add a support enemy: name "Gravehag Shaman", glyph "s", 12 HP, 1 damage,
speed 1, range 1. Special behavior: at the end of each turn it heals the
most wounded *other* living enemy by 2 HP (never above max HP), with a log
line like "Gravehag Shaman mends Orc Raider." Entities can do this via the
optional `special()` hook that the engine already calls every turn — no
engine changes needed. Add one to wave 3 behind the orcs.
