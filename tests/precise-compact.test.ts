// comments in English only
import { describe, it, expect, beforeEach } from 'vitest';

import {
  createCompactFormatter,
  PreciseCompact,
  type LocalePack,
  type SystemId,
} from '../src/precise-compact';

// Helper: fresh instance per test block when needed
let fmt = createCompactFormatter();

beforeEach(() => {
  fmt = createCompactFormatter();
});

describe('precise-compact (international, English defaults)', () => {
  it('formats exact integer multiples (words)', () => {
    expect(fmt.format(1000)).toBe('1 thousand');
    expect(fmt.format(10_000)).toBe('10 thousand');
    expect(fmt.format(1_000_000)).toBe('1 million');
  });

  it('formats exact .5 multiples only (no rounding)', () => {
    expect(fmt.format(1500)).toBe('1.5 thousand');
    // 1501 is not exact -> fallback raw
    expect(fmt.format(1501)).toBe('1501');
  });

  it('handles negative values', () => {
    expect(fmt.format(-1500)).toBe('-1.5 thousand');
    expect(fmt.format(-2_000_000)).toBe('-2 million');
  });

  it('non-integer input falls back (raw)', () => {
    expect(fmt.format(1.1)).toBe('1.1');
  });

  it('style=abbr works', () => {
    expect(fmt.format(2_000_000, { style: 'abbr' })).toBe('2 M');
    expect(fmt.format(1_000, { style: 'abbr' })).toBe('1 K');
  });

  it('fallback locale rendering with Intl.NumberFormat', () => {
    // 1501 -> "1.501" in de-DE with grouping
    expect(
      fmt.format(1501, {
        fallback: 'locale',
        numberLocale: 'de-DE',
        numberOptions: { useGrouping: true },
      }),
    ).toBe('1.501');
  });
});

describe('indian system (lakh/crore)', () => {
  it('formats lakh/crore (words & abbr)', () => {
    expect(fmt.format(100_000, { system: 'indian' })).toBe('1 lakh');
    expect(fmt.format(25_000_000, { system: 'indian' })).toBe('2.5 crore');
    expect(fmt.format(25_000_000, { system: 'indian', style: 'abbr' })).toBe('2.5 Cr');
  });

  it('supports custom allowed fractions (0.25 and 0.1)', () => {
    const f = createCompactFormatter();
    f.setAllowedFractions([0, 0.25, 0.5, 0.1]);
    // 125000 = 1.25 * 100000 (lakh)
    expect(f.format(125_000, { system: 'indian' })).toBe('1.25 lakh');
    // 110000 = 1.1 * 100000 (lakh)
    expect(f.format(110_000, { system: 'indian' })).toBe('1.1 lakh');
  });
});

describe('eastAsia system (wan/yi)', () => {
  it('formats wan/yi with English labels by default', () => {
    expect(fmt.format(10_000, { system: 'eastAsia' })).toBe('1 wan');
    expect(fmt.format(100_000_000, { system: 'eastAsia' })).toBe('1 yi');
  });

  it('uses locale rules for joiner and order', () => {
    // Register a zh-CN-like locale: no space joiner, unit after number
    const zhCN: LocalePack = {
      locale: 'zh-CN',
      labels: {
        wan: { words: '万', abbr: '万' },
        yi: { words: '亿', abbr: '亿' },
        thousand: { words: '千', abbr: '千' },
      },
      rules: {
        joiner: '',
        numberLocale: 'zh-CN',
        numberOptions: { useGrouping: false },
      },
    };
    fmt.registerLocale(zhCN);

    expect(fmt.format(10_000, { system: 'eastAsia', locale: 'zh-CN' })).toBe('1万');
    expect(fmt.format(100_000_000, { system: 'eastAsia', locale: 'zh-CN' })).toBe('1亿');
    // negative
    expect(fmt.format(-20_000, { system: 'eastAsia', locale: 'zh-CN' })).toBe('-2万');
  });
});

describe('locale packs and rules', () => {
  it('resolves labels from custom locale, falls back to English if missing', () => {
    const partial: LocalePack = {
      locale: 'xx',
      labels: { million: { words: 'megalabel', abbr: 'ML' } },
      rules: { joiner: ' ' },
    };
    fmt.registerLocale(partial);

    // thousand not provided -> falls back to English "thousand"
    expect(fmt.format(1000, { locale: 'xx' })).toBe('1 thousand');
    // million provided
    expect(fmt.format(1_000_000, { locale: 'xx' })).toBe('1 megalabel');
    expect(fmt.format(2_000_000, { locale: 'xx', style: 'abbr' })).toBe('2 ML');
  });

  it('supports resolveLabel for morphologies (ru pluralization demo)', () => {
    const ruPl: LocalePack = {
      locale: 'ru-pl',
      labels: {
        thousand: { words: 'тысяча', abbr: 'тыс.' },
        million: { words: 'миллион', abbr: 'млн' },
        billion: { words: 'миллиард', abbr: 'млрд' },
      },
      rules: {
        resolveLabel: (unit, base, factor, style) => {
          if (style === 'abbr') return base.abbr;
          const i = Math.floor(Math.abs(factor));
          const last2 = i % 100;
          const last1 = i % 10;
          const forms =
            unit === 'thousand'
              ? ['тысяча', 'тысячи', 'тысяч']
              : unit === 'million'
                ? ['миллион', 'миллиона', 'миллионов']
                : ['миллиард', 'миллиарда', 'миллиардов'];

          if (last2 >= 11 && last2 <= 14) return forms[2];
          if (last1 === 1) return forms[0];
          if (last1 >= 2 && last1 <= 4) return forms[1];
          return forms[2];
        },
      },
    };
    fmt.registerLocale(ruPl);

    expect(fmt.format(1_000, { locale: 'ru-pl' })).toBe('1 тысяча');
    expect(fmt.format(2_000, { locale: 'ru-pl' })).toBe('2 тысячи');
    expect(fmt.format(5_000, { locale: 'ru-pl' })).toBe('5 тысяч');
    expect(fmt.format(2_000_000, { locale: 'ru-pl', style: 'abbr' })).toBe('2 млн');
  });

  it('unitOrder=before and NBSP joiner + finalize hook', () => {
    const xx: LocalePack = {
      locale: 'xx2',
      labels: {
        thousand: { words: 'TH', abbr: 'TH' },
        million: { words: 'MI', abbr: 'MI' },
      },
      rules: {
        unitOrder: 'before',
        joiner: '\u00A0',
        finalize: (s) => `[${s}]`,
      },
    };
    fmt.registerLocale(xx);

    expect(fmt.format(1000, { locale: 'xx2' })).toBe('[TH\u00A01]');
    expect(fmt.format(2_000_000, { locale: 'xx2', style: 'abbr' })).toBe('[MI\u00A02]');
  });

  it('RTL finalize path (no reliance on non-Latin digits)', () => {
    const ar: LocalePack = {
      locale: 'ar',
      labels: {
        thousand: { words: 'ألف', abbr: 'أ' },
        million: { words: 'مليون', abbr: 'م' },
      },
      rules: {
        rtl: true,
        numberLocale: 'en-US', // keep Latin digits for portability
        finalize: (s) => `\u200F${s}\u200F`,
      },
    };
    fmt.registerLocale(ar);
    expect(fmt.format(1_000, { locale: 'ar' })).toBe('\u200F1 ألف\u200F');
  });

  it('setDefaultLocale affects subsequent calls', () => {
    const ru: LocalePack = {
      locale: 'ru',
      labels: {
        thousand: { words: 'тысяча', abbr: 'тыс.' },
        million: { words: 'миллион', abbr: 'млн' },
      },
      rules: { numberLocale: 'ru-RU' },
    };
    fmt.registerLocale(ru);
    fmt.setDefaultLocale('ru');
    expect(fmt.format(2_000_000)).toBe('2 миллион');
  });
});

describe('systems registry and fallbacks', () => {
  it('unknown system -> fallback raw', () => {
    expect(fmt.format(1_000_000, { system: 'nope' as SystemId })).toBe('1000000');
  });

  it('custom system via registerSystem', () => {
    const f = createCompactFormatter();
    f.registerSystem({
      id: 'custom',
      units: [
        { key: 'million', value: 1_000_000n },
        { key: 'thousand', value: 1_000n },
      ],
    });
    expect(f.format(3_000_000, { system: 'custom' })).toBe('3 million');
    expect(f.format(1_500, { system: 'custom' })).toBe('1.5 thousand');
  });

  it('values below smallest unit -> fallback', () => {
    expect(fmt.format(999)).toBe('999'); // international smallest=1_000
  });
});

describe('default export exists', () => {
  it('PreciseCompact works', () => {
    expect(PreciseCompact.format(1000)).toBe('1 thousand');
  });
});

describe('coverage: Intl fallback, bigint, fractionDenominator(1)', () => {
  // comments in English only
  it('Intl fallback uses rules.numberLocale when candidate invalid and no "en" registered', () => {
    const fmtNoEn = createCompactFormatter({
      defaultLocale: 'xx', // deliberately invalid to force fallback path
      locales: [
        {
          locale: 'custom',
          labels: {}, // unit labels will fall back to English
          // choose a guaranteed-available number locale:
          rules: {
            numberLocale: 'en-US',
            numberOptions: { useGrouping: false },
          },
        } as LocalePack,
      ],
    });

    // Force invalid candidate -> trigger catch block in renderNumber
    const out = fmtNoEn.format(1500, { locale: 'custom', numberLocale: 'yy' });

    // Expected: uses rules.numberLocale ('en-US') for number and English label
    const expected = `${new Intl.NumberFormat('en-US', {
      useGrouping: false,
    }).format(1.5)} thousand`;
    expect(out).toBe(expected); // "1.5 thousand"
  });

  it('Intl fallback ultimately falls back to en-US when nothing else works', () => {
    const f = createCompactFormatter({
      defaultLocale: 'xx', // invalid
      locales: [{ locale: 'xx', labels: {} } as LocalePack], // only invalid locale registered
    });

    // numberLocale also invalid -> candidate fails; rules.numberLocale undefined; defaultLocale invalid -> next is en-US
    const out = f.format(1500, { locale: 'xx', numberLocale: 'yy' });
    expect(out).toBe('1.5 thousand'); // en-US decimal dot
  });

  it('renderFallback(locale) formats bigint path', () => {
    const f = createCompactFormatter();
    // 1501 is not exact -> fallback, and we request locale formatting for bigint
    const out = f.format(1501n, {
      fallback: 'locale',
      numberLocale: 'de-DE',
      numberOptions: { useGrouping: true },
    });
    expect(out).toBe('1.501');
  });

  it('allowedFractions includes 1 => fractionDenominator(1) path is executed, then .5 matches', () => {
    const f = createCompactFormatter();
    // Include 1 to hit denom=1 branch; integer case fails for 1500, then .5 succeeds
    f.setAllowedFractions([0, 1, 0.5]);
    const out = f.format(1500);
    expect(out).toBe('1.5 thousand');
  });
});

describe('extra coverage for label fallback and non-matching fractions', () => {
  it('falls back to literal unit key when label missing in both active and English locales', () => {
    const f = createCompactFormatter();
    // Register a custom system with a unit key unknown to LOCALE_EN
    f.registerSystem({
      id: 'custom-unknown' as any,
      units: [{ key: 'mega' as any, value: 1_000n }],
    });

    // Expect literal unit key to be used for both words and abbr
    expect(f.format(1_000, { system: 'custom-unknown' as any, style: 'words' })).toBe('1 mega');
    expect(f.format(1_000, { system: 'custom-unknown' as any, style: 'abbr' })).toBe('1 mega');
  });

  it('value >= smallest but not an allowed fraction -> fallback path after units loop', () => {
    const f = createCompactFormatter();
    // Allow only exact integers; 1500 is not an integer multiple of 1000 under this rule
    f.setAllowedFractions([0]);
    expect(f.format(1_500)).toBe('1500'); // hits return renderFallback(...) after the loop
  });
});

describe('sub-unit fractions allowed (indian system)', () => {
  it('formats 75_000 as 0.75 lakh when 0.75 is allowed', () => {
    const f = createCompactFormatter();
    f.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);
    expect(f.format(75_000, { system: 'indian' })).toBe('0.75 lakh');
  });

  it('formats 500 as 0.5 thousand in international system if 0.5 allowed (exact)', () => {
    const f = createCompactFormatter({ allowSubSmallest: true });
    f.setAllowedFractions([0, 0.5]);
    expect(f.format(500)).toBe('0.5 thousand');
  });
});
