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

## License

MIT
