import type { Balance, Defender } from '../engine/types';

export function createSpearMilitia(id: number, balance: Balance, position: number): Defender {
  const stats = balance.defenders['spear_militia'];
  if (stats === undefined) {
    throw new Error('No balance stats for "spear_militia" — expected key defenders.spear_militia in data/balance.json');
  }
  return {
    id,
    kind: 'defender',
    type: 'spear_militia',
    name: stats.name,
    glyph: stats.glyph,
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    range: stats.range,
    position,
  };
}

// BALANCE: defenders.spear_militia
