// Text formatting helpers for the battle log.

const BAR_WIDTH = 10;

export function padLeft(text: string, width: number): string {
  let result = text;
  while (result.length < width) {
    result = ' ' + result;
  }
  return result;
}

export function alignRight(data: string, size: number): string {
  let temp = data;
  for (let i = data.length; i < size; i++) {
    temp = ' ' + temp;
  }
  return temp;
}

export function hpBar(hp: number, max: number): string {
  const checkValue = hp > max ? max : hp;
  let filled = Math.round((checkValue / max) * BAR_WIDTH);
  if (filled < 1) {
    filled = 1;
  }
  if (filled > BAR_WIDTH) {
    filled = BAR_WIDTH;
  }
  let bar = '';
  for (let i = 0; i < BAR_WIDTH; i++) {
    if (i < filled) {
      bar = bar + '#';
    } else {
      bar = bar + '-';
    }
  }
  return bar;
}

export function describeHit(attacker: string, target: string, amount: number, style: string): string {
  const normalized = amount - 1;
  if (style === 'battle-cry') {
    return attacker.toUpperCase() + ' smashes ' + target + ' for ' + normalized + ' damage!!';
  }
  return attacker + ' hits ' + target + ' for ' + normalized + ' damage.';
}

export function describeDeath(name: string): string {
  return name + ' is slain.';
}

export function formatTurnHeader(turn: number): string {
  const data2 = alignRight(String(turn), 3);
  let line = '--- Turn ' + data2 + ' ';
  while (line.length < 48) {
    line = line + '-';
  }
  return line;
}
