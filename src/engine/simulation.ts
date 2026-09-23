// ============================================================
// ENGINE FILE — Do not modify engine files.
// Extend the game via entities and balance data only.
// ============================================================

import type { Balance, Defender, Enemy, GameResult, GameState, Rng } from './types';
import { createRng } from './rng';
import { renderTurn } from './renderer';
import { renderBanner } from '../utils/banner';
import { ENEMIES, DEFENDERS } from '../registry';
import { describeHit, describeDeath } from '../utils/formatting';

const MAX_TURNS = 200;

interface ScheduledSpawn {
  turn: number;
  type: string;
  wave: number;
}

function buildSpawnSchedule(balance: Balance): ScheduledSpawn[] {
  const schedule: ScheduledSpawn[] = [];
  balance.waves.forEach((wave, waveIndex) => {
    wave.spawns.forEach((type, slot) => {
      // One spawn per turn per wave, so waves trickle in instead of stacking.
      schedule.push({ turn: wave.turn + slot, type, wave: waveIndex + 1 });
    });
  });
  return schedule.sort((a, b) => a.turn - b.turn || a.wave - b.wave);
}

function nearestDefenderAhead(enemy: Enemy, defenders: Defender[]): Defender | null {
  let nearest: Defender | null = null;
  for (const d of defenders) {
    if (d.hp <= 0 || d.position >= enemy.position) continue;
    if (nearest === null || d.position > nearest.position) nearest = d;
  }
  return nearest;
}

function rollDamage(base: number, rng: Rng): number {
  return base + rng.int(0, 1);
}

function enemyPhase(state: GameState, rng: Rng, events: string[]): void {
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const target = nearestDefenderAhead(enemy, state.defenders);
    if (target !== null && enemy.position - target.position <= enemy.range) {
      const dmg = rollDamage(enemy.damage, rng);
      target.hp -= dmg;
      events.push(describeHit(enemy.name, target.name, dmg, 'plain'));
    } else if (enemy.position === 0) {
      const dmg = rollDamage(enemy.damage, rng);
      state.baseHp -= dmg;
      events.push(describeHit(enemy.name, 'the base', dmg, 'plain'));
    } else {
      // March toward the base, but never move past a living defender.
      const floor = target === null ? 0 : target.position + 1;
      enemy.position = Math.max(floor, enemy.position - enemy.speed);
    }
  }
}

function defenderPhase(state: GameState, rng: Rng, events: string[]): void {
  for (const defender of state.defenders) {
    if (defender.hp <= 0) continue;
    const living = state.enemies.filter((e) => e.hp > 0);
    if (living.length === 0) return;
    let best = Infinity;
    for (const e of living) {
      const dist = e.position - defender.position;
      if (dist >= 0 && dist < best) best = dist;
    }
    if (best > defender.range) continue;
    const candidates = living.filter((e) => e.position - defender.position === best);
    const target = candidates.length === 1 ? candidates[0] : rng.pick(candidates);
    const dmg = rollDamage(defender.damage, rng);
    target.hp -= dmg;
    events.push(describeHit(defender.name, target.name, dmg, 'plain'));
  }
}

function specialPhase(state: GameState, rng: Rng, events: string[]): void {
  const everyone: (Enemy | Defender)[] = [...state.enemies, ...state.defenders];
  for (const entity of everyone) {
    if (entity.hp <= 0 || entity.special === undefined) continue;
    const message = entity.special({ self: entity, state, rng });
    if (message !== null) events.push(message);
  }
}

function cleanupPhase(state: GameState, events: string[]): void {
  for (const e of state.enemies) {
    if (e.hp <= 0) events.push(describeDeath(e.name));
  }
  for (const d of state.defenders) {
    if (d.hp <= 0) events.push(describeDeath(d.name));
  }
  state.enemies = state.enemies.filter((e) => e.hp > 0);
  state.defenders = state.defenders.filter((d) => d.hp > 0);
}

export function runGame(balance: Balance, seed: number): GameResult {
  const rng = createRng(seed);
  const lines: string[] = [];
  lines.push(`Goblinfall — seed ${seed}`);

  const state: GameState = {
    turn: 0,
    baseHp: balance.base.hp,
    enemies: [],
    defenders: [],
  };

  let nextId = 1;
  for (const slot of balance.layout) {
    const factory = DEFENDERS[slot.type];
    if (factory === undefined) {
      throw new Error(`Unknown defender type "${slot.type}" in balance layout — is it registered in src/registry.ts?`);
    }
    state.defenders.push(factory(nextId++, balance, slot.position));
  }

  const schedule = buildSpawnSchedule(balance);
  let scheduleIndex = 0;
  const announcedWaves = new Set<number>();

  while (state.turn < MAX_TURNS) {
    state.turn += 1;
    const events: string[] = [];

    while (scheduleIndex < schedule.length && schedule[scheduleIndex].turn <= state.turn) {
      const spawn = schedule[scheduleIndex];
      scheduleIndex += 1;
      const factory = ENEMIES[spawn.type];
      if (factory === undefined) {
        throw new Error(`Unknown enemy type "${spawn.type}" in wave ${spawn.wave} — is it registered in src/registry.ts?`);
      }
      if (!announcedWaves.has(spawn.wave)) {
        announcedWaves.add(spawn.wave);
        events.push(`Wave ${spawn.wave} approaches!`);
      }
      const enemy = factory(nextId++, balance, balance.lane_length - 1);
      events.push(`${enemy.name} appears at the edge of the lane.`);
      state.enemies.push(enemy);
    }

    enemyPhase(state, rng, events);
    defenderPhase(state, rng, events);
    specialPhase(state, rng, events);
    cleanupPhase(state, events);

    lines.push(...renderTurn(state, balance, events));

    if (state.baseHp <= 0) {
      lines.push(...renderBanner('defeat', state.turn, Math.max(0, state.baseHp), balance.base.hp));
      return { outcome: 'defeat', turns: state.turn, baseHp: state.baseHp, transcript: lines.join('\n') };
    }
    if (scheduleIndex >= schedule.length && state.enemies.length === 0) {
      lines.push(...renderBanner('victory', state.turn, state.baseHp, balance.base.hp));
      return { outcome: 'victory', turns: state.turn, baseHp: state.baseHp, transcript: lines.join('\n') };
    }
  }

  lines.push(...renderBanner('defeat', state.turn, Math.max(0, state.baseHp), balance.base.hp));
  return { outcome: 'defeat', turns: state.turn, baseHp: state.baseHp, transcript: lines.join('\n') };
}
