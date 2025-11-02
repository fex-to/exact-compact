// comments in English only
import { describe, it, expect } from 'vitest';

import { PreciseCompact, createCompactFormatter } from '../src/precise-compact';

describe('fallback: "locale" with grouping', () => {
  it('formats 1001 with grouping for en-US locale', () => {
    const result = PreciseCompact.format(1001, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('1,001');
  });

  it('formats larger numbers with grouping', () => {
    const result = PreciseCompact.format(123456, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('123,456');
  });

  it('respects explicit useGrouping: false override', () => {
    const result = PreciseCompact.format(1001, {
      fallback: 'locale',
      locale: 'en-US',
      numberOptions: { useGrouping: false },
    });
    expect(result).toBe('1001');
  });

  it('formats with raw fallback (no grouping)', () => {
    const result = PreciseCompact.format(1001, { fallback: 'raw' });
    expect(result).toBe('1001');
  });

  it('still compacts values that match units normally', () => {
    const result = PreciseCompact.format(1000000);
    expect(result).toBe('1 million');
  });

  it('formats negative numbers with grouping', () => {
    const result = PreciseCompact.format(-1001, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('-1,001');
  });

  it('formats zero with locale fallback', () => {
    const result = PreciseCompact.format(0, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('0');
  });

  it('handles bigint with locale fallback', () => {
    const result = PreciseCompact.format(1234n, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('1,234');
  });

  it('uses custom formatter config with locale fallback', () => {
    const fmt = createCompactFormatter();
    const result = fmt.format(999, { fallback: 'locale', locale: 'en-US' });
    expect(result).toBe('999');
  });

  it('formats with different numberOptions when using locale fallback', () => {
    const result = PreciseCompact.format(1234.567, {
      fallback: 'locale',
      locale: 'en-US',
      numberOptions: {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    });
    expect(result).toBe('1,234.57');
  });

  it('locale fallback preserves useGrouping: true even with pack defaults', () => {
    // Even if the locale pack has useGrouping: false by default,
    // the locale fallback should enable grouping
    // Use 5001 to avoid exact match with 5 thousand
    const result = PreciseCompact.format(5001, { fallback: 'locale', locale: 'en' });
    expect(result).toBe('5,001');
  });
});
