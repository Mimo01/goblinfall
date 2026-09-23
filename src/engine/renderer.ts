// ============================================================
// ENGINE FILE — Do not modify engine files.
// Extend the game via entities and balance data only.
// ============================================================

import type { Balance, GameState } from './types';
import { formatTurnHeader, hpBar, padLeft } from '../utils/formatting';

function lane(state: GameState, balance: Balance): string {
  const cells: string[] = [];
  for (let pos = 0; pos < balance.lane_length; pos++) {
    const defender = state.defenders.find((d) => d.position === pos);
    if (defender !== undefined) {
      cells.push(defender.glyph);
      continue;
    }
    const here = state.enemies.filter((e) => e.position === pos);
    if (here.length === 0) cells.push('.');
    else if (here.length === 1) cells.push(here[0].glyph);
    else cells.push(String(Math.min(here.length, 9)));
  }
  return cells.join(' ');
}

export function renderTurn(state: GameState, balance: Balance, events: string[]): string[] {
  const hp = Math.max(0, state.baseHp);
  const lines: string[] = [];
  lines.push('');
  lines.push(formatTurnHeader(state.turn));
  lines.push(` Base [${hpBar(hp, balance.base.hp)}] ${padLeft(String(hp), 3)}/${balance.base.hp} |${lane(state, balance)}|`);
  for (const event of events) {
    lines.push('   ' + event);
  }
  return lines;
}
