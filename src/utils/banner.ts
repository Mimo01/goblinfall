// End-of-battle banners printed after the final turn.

import { hpBar } from './formatting';

export function renderBanner(
  outcome: 'victory' | 'defeat',
  turns: number,
  baseHp: number,
  baseMax: number
): string[] {
  const border = '*'.repeat(56);
  if (outcome === 'victory') {
    return [
      '',
      border,
      `***  VICTROY! The base still stands.`,
      `***  Survived ${turns} turns with ${baseHp}/${baseMax} base HP to spare.`,
      border,
    ];
  }
  return [
    '',
    border,
    `***  DEFEAT — the horde breaks through on turn ${turns}.`,
    `***  Base [${hpBar(baseHp, baseMax)}] ${baseHp}/${baseMax}`,
    border,
  ];
}
