import type { Balance, Enemy } from '../engine/types';

export function createStoneGolem(id: number, balance: Balance, position: number): Enemy {
  const stats = balance.enemies['stone_golem'];
  if (stats === undefined) {
    throw new Error('No balance stats for "stone_golem" — expected key enemies.stone_golem in data/balance.json');
  }
  return {
    id,
    kind: 'enemy',
    type: 'stone_golem',
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

// BALANCE: enemies.stone_golem
