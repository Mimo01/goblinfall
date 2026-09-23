import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expectState } from './helpers';
import { ENEMIES, DEFENDERS } from '../src/registry';
import type { Balance, Defender, Enemy } from '../src/engine/types';

const balance = JSON.parse(
  readFileSync(fileURLToPath(new URL('../data/balance.json', import.meta.url)), 'utf8')
) as Balance;

const fixtures = JSON.parse(
  readFileSync(fileURLToPath(new URL('./fixtures/entities.json', import.meta.url)), 'utf8')
) as Record<string, unknown>;

function snapshot(entity: Enemy | Defender): Record<string, unknown> {
  const base = {
    name: entity.name,
    glyph: entity.glyph,
    hp: entity.hp,
    damage: entity.damage,
    range: entity.range,
  };
  if (entity.kind === 'enemy') {
    return { ...base, speed: entity.speed };
  }
  return base;
}

for (const [type, factory] of Object.entries(ENEMIES)) {
  test(`baseline state: ${type}`, () => {
    expectState(snapshot(factory(1, balance, 0)), fixtures[type], type);
  });
}

for (const [type, factory] of Object.entries(DEFENDERS)) {
  test(`baseline state: ${type}`, () => {
    expectState(snapshot(factory(1, balance, 0)), fixtures[type], type);
  });
}

test('every enemy stats block in balance.json has a registered entity', () => {
  for (const key of Object.keys(balance.enemies)) {
    expectState(typeof ENEMIES[key], 'function', `registry entry for enemies.${key}`);
  }
});

test('every defender stats block in balance.json has a registered entity', () => {
  for (const key of Object.keys(balance.defenders)) {
    expectState(typeof DEFENDERS[key], 'function', `registry entry for defenders.${key}`);
  }
});

test('every wave spawn refers to a registered enemy', () => {
  for (const wave of balance.waves) {
    for (const type of wave.spawns) {
      expectState(typeof ENEMIES[type], 'function', `registry entry for wave enemy ${type}`);
    }
  }
});

test('every layout slot refers to a registered defender', () => {
  for (const slot of balance.layout) {
    expectState(typeof DEFENDERS[slot.type], 'function', `registry entry for layout defender ${slot.type}`);
  }
});
