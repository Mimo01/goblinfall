// Central entity registry. Every enemy and defender must be registered
// here to exist in the game — the simulation only knows about types
// listed in these maps.

import type { DefenderFactory, EnemyFactory } from './engine/types';
import { createGoblinGrunt } from './entities/goblin_grunt';
import { createOrcRaider } from './entities/orc_raider';
import { createWolfRider } from './entities/wolf_rider';
import { createStoneGolem } from './entities/stone_golem';
import { createArcherTower } from './entities/archer_tower';
import { createSpearMilitia } from './entities/spear_militia';
import { createFrostMage } from './entities/frost_mage';

export const ENEMIES: Record<string, EnemyFactory> = {
  goblin_grunt: createGoblinGrunt,
  orc_raider: createOrcRaider,
  wolf_rider: createWolfRider,
  stone_golem: createStoneGolem,
};

export const DEFENDERS: Record<string, DefenderFactory> = {
  archer_tower: createArcherTower,
  spear_militia: createSpearMilitia,
  frost_mage: createFrostMage,
};
