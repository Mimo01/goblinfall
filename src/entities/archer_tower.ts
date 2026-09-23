import type { Balance, Defender } from '../engine/types';

export function createArcherTower(id: number, balance: Balance, position: number): Defender {
  const stats = balance.defenders['archer_tower'];
  if (stats === undefined) {
    throw new Error('No balance stats for "archer_tower" — expected key defenders.archer_tower in data/balance.json');
  }
  return {
    id,
    kind: 'defender',
    type: 'archer_tower',
    name: stats.name,
    glyph: stats.glyph,
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    range: stats.range,
    position,
  };
}

// BALANCE: defenders.archer_tower
