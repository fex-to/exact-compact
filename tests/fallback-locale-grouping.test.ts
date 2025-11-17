import { describe, it, expect } from 'vitest';

import { PreciseCompact } from '../src/precise-compact';

function intlFallback(locale: string, options?: Intl.NumberFormatOptions) {
  const formatter = new Intl.NumberFormat(locale, options);
  return (value: number | bigint) => {
    const asNumber = typeof value === 'bigint' ? Number(value) : value;
    return formatter.format(asNumber);
  };
}

describe('fallbackFn + Intl delegation', () => {
  it('formats 1001 with grouping for en-US locale', () => {
    const result = PreciseCompact.format(1001, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('1,001');
  });

  it('formats larger numbers with grouping', () => {
    const result = PreciseCompact.format(123456, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('123,456');
  });

  it('respects custom Intl options', () => {
    const options = {
      useGrouping: false,
      minimumFractionDigits: 2,
    } satisfies Intl.NumberFormatOptions;
    const expected = new Intl.NumberFormat('en-US', options).format(1001);
    const result = PreciseCompact.format(1001, {
      fallbackFn: intlFallback('en-US', options),
    });
    expect(result).toBe(expected);
  });

  it('still compacts values that match units normally', () => {
    const result = PreciseCompact.format(1_000_000, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('1 million');
  });

  it('formats negative numbers through fallbackFn', () => {
    const result = PreciseCompact.format(-1001, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('-1,001');
  });

  it('formats zero via fallbackFn', () => {
    const result = PreciseCompact.format(0, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('0');
  });

  it('handles bigint with fallbackFn', () => {
    const result = PreciseCompact.format(1234n, { fallbackFn: intlFallback('en-US') });
    expect(result).toBe('1,234');
  });

  it('formats with different locales', () => {
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const result = PreciseCompact.format(1234.567, {
      fallbackFn: intlFallback('de-DE', options),
    });
    expect(result).toBe('1.234,57');
  });

  it('formats raw decimals with uk-UA comma separator', () => {
    const fallbackFn = (value: number | bigint) =>
      new Intl.NumberFormat('uk').format(typeof value === 'bigint' ? Number(value) : value);
    const result = PreciseCompact.format(0.1, { fallbackFn, locale: 'uk' });

    expect(result).toBe('0,1');
  });

  it('formats integers with uk-UA grouping when using fallbackFn', () => {
    const options = { useGrouping: true } satisfies Intl.NumberFormatOptions;
    const result = PreciseCompact.format(1501, {
      fallbackFn: intlFallback('uk-UA', options),
    });
    expect(result).toBe('1\u00A0501');
  });
});

describe('built-in locale digits', () => {
  it('formats compact numbers with locale decimal separators', () => {
    const result = PreciseCompact.format(1500, { locale: 'uk-UA' });
    expect(result).toBe('1,5 thousand');
  });

  it('falls back to English when locale is invalid', () => {
    const result = PreciseCompact.format(1500, { locale: 'xx-unknown' });
    expect(result).toBe('1.5 thousand');
  });

  it('applies comma decimals for ru-RU locale', () => {
    const result = PreciseCompact.format(2100, { locale: 'ru-RU' });
    expect(result).toBe('2,1 thousand');
  });

  it('applies comma decimals for de-DE locale', () => {
    const result = PreciseCompact.format(1500, { locale: 'de-DE' });
    expect(result).toBe('1,5 thousand');
  });

  it('applies comma decimals for fr-FR locale', () => {
    const result = PreciseCompact.format(2_500_000, { locale: 'fr-FR' });
    expect(result).toBe('2,5 million');
  });

  it('keeps dot decimals for en-US locale', () => {
    const result = PreciseCompact.format(2100, { locale: 'en-US' });
    expect(result).toBe('2.1 thousand');
  });
});
