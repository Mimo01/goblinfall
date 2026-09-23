import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expectState } from './helpers';
import { runGame } from '../src/engine/simulation';
import type { Balance } from '../src/engine/types';

const DEFAULT_SEED = 1337;

const balance = JSON.parse(
  readFileSync(fileURLToPath(new URL('../data/balance.json', import.meta.url)), 'utf8')
) as Balance;

test('the default-seed battle ends in victory', () => {
  const result = runGame(balance, DEFAULT_SEED);
  expectState(result.outcome, 'victory', 'default-seed outcome');
  expectState(result.baseHp > 0, true, 'base survives the default-seed battle');
});

test('the default-seed battle finishes in a reasonable number of turns', () => {
  const result = runGame(balance, DEFAULT_SEED);
  expectState(result.turns >= 10 && result.turns < 200, true, 'default-seed turn count');
});

test('all configured waves show up in the battle', () => {
  const result = runGame(balance, DEFAULT_SEED);
  for (let wave = 1; wave <= balance.waves.length; wave++) {
    expectState(result.transcript.includes(`Wave ${wave} approaches!`), true, `wave ${wave} announcement`);
  }
});
