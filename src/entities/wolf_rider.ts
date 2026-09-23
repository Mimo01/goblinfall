import type { Balance, Enemy } from '../engine/types';

export function createWolfRider(id: number, balance: Balance, position: number): Enemy {
  const stats = balance.enemies['wolf_rider'];
  if (stats === undefined) {
    throw new Error('No balance stats for "wolf_rider" — expected key enemies.wolf_rider in data/balance.json');
  }
  return {
    id,
    kind: 'enemy',
    type: 'wolf_rider',
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

// BALANCE: enemies.wolf_rider
