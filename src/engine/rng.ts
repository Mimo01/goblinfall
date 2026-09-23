// ============================================================
// ENGINE FILE — Do not modify engine files.
// Extend the game via entities and balance data only.
// ============================================================

import type { Rng } from './types';

// Mulberry32: small, fast, fully deterministic for a given seed.
export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function int(min: number, max: number): number {
    return min + Math.floor(next() * (max - min + 1));
  }

  function pick<T>(items: T[]): T {
    return items[int(0, items.length - 1)];
  }

  return { next, int, pick };
}
