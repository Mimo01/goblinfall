import type { Balance, Enemy } from '../engine/types';

export function createOrcRaider(id: number, balance: Balance, position: number): Enemy {
  const stats = balance.enemies['orc_raider'];
  if (stats === undefined) {
    throw new Error('No balance stats for "orc_raider" — expected key enemies.orc_raider in data/balance.json');
  }
  return {
    id,
    kind: 'enemy',
    type: 'orc_raider',
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

// BALANCE: enemies.orc_raider
