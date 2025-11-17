import { describe, it, expect } from 'vitest';

import { createCompactFormatter } from '../src/precise-compact';

describe('raw-in → raw-out for fallbacks', () => {
  const fmt = createCompactFormatter();

  it('passes number as-is to fallbackFn', () => {
    const seen: Array<number | bigint> = [];
    const out = fmt.format(1001, {
      fallbackFn: (v) => {
        seen.push(v);
        return `X:${String(v)}`;
      },
    });
    expect(out).toBe('X:1001');
    expect(typeof seen[0]).toBe('number');
    expect(seen[0]).toBe(1001);
  });

  it('passes bigint as-is to fallbackFn', () => {
    const big = 12345678901234567890n;
    let seen: number | bigint | null = null;
    const out = fmt.format(big, {
      fallbackFn: (v) => {
        seen = v;
        return typeof v === 'bigint' ? v.toString() : 'no';
      },
    });
    expect(out).toBe(big.toString());
    expect(typeof seen).toBe('bigint');
    expect(seen).toBe(big);
  });

  it('raw built-in returns exact original string for bigint', () => {
    const big = 999999999999999999999n;
    expect(fmt.format(big)).toBe(big.toString());
  });
});
