import type { Balance, Defender } from '../engine/types';

export function createFrostMage(id: number, balance: Balance, position: number): Defender {
  const stats = balance.defenders['frost_mage'];
  if (stats === undefined) {
    throw new Error('No balance stats for "frost_mage" — expected key defenders.frost_mage in data/balance.json');
  }
  return {
    id,
    kind: 'defender',
    type: 'frost_mage',
    name: stats.name,
    glyph: stats.glyph,
    hp: stats.hp,
    maxHp: stats.hp,
    damage: stats.damage,
    range: stats.range,
    position,
  };
}

// BALANCE: defenders.frost_mage
