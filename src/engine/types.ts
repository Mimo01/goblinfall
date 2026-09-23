// ============================================================
// ENGINE FILE — Do not modify engine files.
// Extend the game via entities and balance data only.
// ============================================================

export interface EnemyStats {
  name: string;
  glyph: string;
  hp: number;
  damage: number;
  speed: number;
  range: number;
}

export interface DefenderStats {
  name: string;
  glyph: string;
  hp: number;
  damage: number;
  range: number;
}

export interface Balance {
  base: { hp: number };
  lane_length: number;
  enemies: Record<string, EnemyStats>;
  defenders: Record<string, DefenderStats>;
  layout: { type: string; position: number }[];
  waves: { turn: number; spawns: string[] }[];
}

export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  pick<T>(items: T[]): T;
}

interface EntityBase {
  id: number;
  type: string;
  name: string;
  glyph: string;
  hp: number;
  maxHp: number;
  damage: number;
  position: number;
}

export interface Enemy extends EntityBase {
  kind: 'enemy';
  speed: number;
  range: number;
  special?(ctx: SpecialContext): string | null;
}

export interface Defender extends EntityBase {
  kind: 'defender';
  range: number;
  special?(ctx: SpecialContext): string | null;
}

export interface SpecialContext {
  self: Enemy | Defender;
  state: GameState;
  rng: Rng;
}

export interface GameState {
  turn: number;
  baseHp: number;
  enemies: Enemy[];
  defenders: Defender[];
}

export type EnemyFactory = (id: number, balance: Balance, position: number) => Enemy;
export type DefenderFactory = (id: number, balance: Balance, position: number) => Defender;

export interface GameResult {
  outcome: 'victory' | 'defeat';
  turns: number;
  baseHp: number;
  transcript: string;
}
