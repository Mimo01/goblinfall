import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expectState } from './helpers';
import { createRng } from '../src/engine/rng';
import { runGame } from '../src/engine/simulation';
import type { Balance } from '../src/engine/types';

const balance = JSON.parse(
  readFileSync(fileURLToPath(new URL('../data/balance.json', import.meta.url)), 'utf8')
) as Balance;

test('rng is deterministic for a given seed', () => {
  const a = createRng(99);
  const b = createRng(99);
  const seqA = [a.int(0, 100), a.int(0, 100), a.int(0, 100), a.int(0, 100)];
  const seqB = [b.int(0, 100), b.int(0, 100), b.int(0, 100), b.int(0, 100)];
  expectState(seqA, seqB, 'rng sequence for equal seeds');
});

test('rng sequences differ across seeds', () => {
  const a = createRng(1);
  const b = createRng(2);
  const seqA = [a.int(0, 1000), a.int(0, 1000), a.int(0, 1000)];
  const seqB = [b.int(0, 1000), b.int(0, 1000), b.int(0, 1000)];
  expectState(seqA.join(',') === seqB.join(','), false, 'rng sequences for different seeds');
});

test('two runs with the same seed produce identical transcripts', () => {
  const first = runGame(balance, 42);
  const second = runGame(balance, 42);
  expectState(first.transcript, second.transcript, 'seeded transcript');
});

test('runs with different seeds diverge', () => {
  const first = runGame(balance, 42);
  const second = runGame(balance, 7);
  expectState(first.transcript === second.transcript, false, 'transcript divergence');
});
