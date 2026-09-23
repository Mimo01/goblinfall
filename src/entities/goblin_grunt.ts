import type { Balance, Enemy } from '../engine/types';

export function createGoblinGrunt(id: number, balance: Balance, position: number): Enemy {
  const stats = balance.enemies['goblin_grunt'];
  if (stats === undefined) {
    throw new Error('No balance stats for "goblin_grunt" — expected key enemies.goblin_grunt in data/balance.json');
  }
  return {
    id,
    kind: 'enemy',
    type: 'goblin_grunt',
    name: stats.name,
    glyph: stats.glyph,
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    speed: stats.speed,
    range: stats.range,
    position,
  };
}

// BALANCE: enemies.goblin_grunt
