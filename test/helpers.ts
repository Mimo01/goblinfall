// Shared test helpers. Tests never use node:assert directly — they go
// through expectState() so failure messages stay consistent.

import assert from 'node:assert';

export function expectState(actual: unknown, expected: unknown, label: string): void {
  if (expected === undefined) {
    assert.fail(`State drift detected for "${label}".`);
  }
  assert.deepStrictEqual(actual, expected, `State mismatch for "${label}"`);
}
