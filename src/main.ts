import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Balance } from './engine/types';
import { runGame } from './engine/simulation';

const DEFAULT_SEED = 1337;

function parseSeed(argv: string[]): number {
  const flagIndex = argv.indexOf('--seed');
  if (flagIndex === -1) return DEFAULT_SEED;
  const value = Number(argv[flagIndex + 1]);
  if (!Number.isInteger(value) || value < 0) {
    console.error('Usage: npm start -- --seed <non-negative integer>');
    process.exit(1);
  }
  return value;
}

const seed = parseSeed(process.argv.slice(2));
const balancePath = fileURLToPath(new URL('../data/balance.json', import.meta.url));
const balance = JSON.parse(readFileSync(balancePath, 'utf8')) as Balance;

const result = runGame(balance, seed);
console.log(result.transcript);
