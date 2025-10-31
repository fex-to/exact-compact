// comments in English only
import { describe, it, expect, beforeEach } from 'vitest';
import { createCompactFormatter, LocalePack } from '../src/precise-compact';

// Helper: strip BiDi control chars that may appear in RTL rendering
const stripBidi = (s: string) => s.replace(/[\u200E\u200F\u061C]/g, '');

// Build a fresh formatter with all morphology-enabled locales
function makeFmtWithLocales() {
  const f = createCompactFormatter();

  const RU: LocalePack = {
    locale: 'ru-RU',
    labels: {
      thousand: {
        words: { one: 'тысяча', few: 'тысячи', many: 'тысяч', other: 'тысячи' },
        abbr: { other: 'тыс.' },
      },
      million: {
        words: { one: 'миллион', few: 'миллиона', many: 'миллионов', other: 'миллиона' },
        abbr: { other: 'млн' },
      },
      billion: {
        words: { one: 'миллиард', few: 'миллиарда', many: 'миллиардов', other: 'миллиарда' },
        abbr: { other: 'млрд' },
      },
      trillion: {
        words: { one: 'триллион', few: 'триллиона', many: 'триллионов', other: 'триллиона' },
        abbr: { other: 'трлн' },
      },
    },
  };

  const UK: LocalePack = {
    locale: 'uk-UA',
    labels: {
      thousand: {
        words: { one: 'тисяча', few: 'тисячі', many: 'тисяч', other: 'тисячі' },
        abbr: { other: 'тис.' },
      },
      million: {
        words: { one: 'мільйон', few: 'мільйона', many: 'мільйонів', other: 'мільйона' },
        abbr: { other: 'млн' },
      },
      billion: {
        words: { one: 'мільярд', few: 'мільярда', many: 'мільярдів', other: 'мільярда' },
        abbr: { other: 'млрд' },
      },
      trillion: {
        words: { one: 'трильйон', few: 'трильйона', many: 'трильйонів', other: 'трильйона' },
        abbr: { other: 'трлн' },
      },
    },
  };

  const PL: LocalePack = {
    locale: 'pl-PL',
    labels: {
      thousand: {
        words: { one: 'tysiąc', few: 'tysiące', many: 'tysięcy', other: 'tysiące' },
        abbr: { other: 'tys.' },
      },
      million: {
        words: { one: 'milion', few: 'miliony', many: 'milionów', other: 'miliony' },
        abbr: { other: 'mln' },
      },
      // short-scale 10^9 => "miliard", 10^12 => "bilion"
      billion: {
        words: { one: 'miliard', few: 'miliardy', many: 'miliardów', other: 'miliardy' },
        abbr: { other: 'mld' },
      },
      trillion: {
        words: { one: 'bilion', few: 'biliony', many: 'bilionów', other: 'biliony' },
        abbr: { other: 'bln' },
      },
    },
  };

  const RO: LocalePack = {
    locale: 'ro-RO',
    labels: {
      thousand: {
        words: { one: 'mie', other: 'mii' },
        abbr: { other: 'mii' },
      },
      million: {
        words: { one: 'milion', other: 'milioane' },
        abbr: { other: 'mil.' },
      },
      billion: {
        words: { one: 'miliard', other: 'miliarde' },
        abbr: { other: 'mld.' },
      },
      trillion: {
        words: { one: 'bilion', other: 'bilioane' },
        abbr: { other: 'bln.' },
      },
    },
  };

  const AR: LocalePack = {
    locale: 'ar',
    labels: {
      thousand: {
        words: { zero: 'ألف', one: 'ألف', two: 'ألفان', few: 'آلاف', many: 'ألف', other: 'ألف' },
        abbr: { other: 'أ' },
      },
      million: {
        words: { zero: 'مليون', one: 'مليون', two: 'مليونان', few: 'ملايين', many: 'مليون', other: 'مليون' },
        abbr: { other: 'م' },
      },
      billion: {
        words: { zero: 'مليار', one: 'مليار', two: 'ملياران', few: 'مليارات', many: 'مليار', other: 'مليار' },
        abbr: { other: 'ملي' },
      },
      trillion: {
        words: { zero: 'تريليون', one: 'تريليون', two: 'تريليونان', few: 'تريليونات', many: 'تريليون', other: 'تريليون' },
        abbr: { other: 'تر' },
      },
    },
    rules: {
      finalize: (s) => s, // keep as-is; UI may add additional marks if needed
    },
  };

  const EN_GB: LocalePack = {
    locale: 'en-GB',
    labels: {
      thousand: { words: 'thousand', abbr: 'K' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'billion', abbr: 'B' },
      trillion: { words: 'trillion', abbr: 'T' },
    },
  };

  const BG: LocalePack = {
    locale: 'bg-BG',
    labels: {
      thousand: { words: { one: 'хиляда', other: 'хиляди' }, abbr: { other: 'хил.' } },
      million: { words: { one: 'милион', other: 'милиона' }, abbr: { other: 'млн.' } },
      billion: { words: { one: 'милиард', other: 'милиарда' }, abbr: { other: 'млрд.' } },
      trillion: { words: { one: 'трилион', other: 'трилиона' }, abbr: { other: 'трлн.' } },
    },
  };

  const ID: LocalePack = {
    locale: 'id-ID',
    labels: {
      thousand: { words: 'ribu', abbr: 'rb' },
      million: { words: 'juta', abbr: 'jt' },
      billion: { words: 'miliar', abbr: 'M' },
      trillion: { words: 'triliun', abbr: 'T' },
    },
  };

  f.registerLocale(RU);
  f.registerLocale(UK);
  f.registerLocale(PL);
  f.registerLocale(RO);
  f.registerLocale(AR);
  f.registerLocale(EN_GB);
  f.registerLocale(BG);
  f.registerLocale(ID);

  return f;
}

describe('morphology by locale', () => {
  let f: ReturnType<typeof makeFmtWithLocales>;

  beforeEach(() => {
    f = makeFmtWithLocales();
  });

  it('ru-RU: thousand/million/billion/trillion forms (words)', () => {
    expect(f.format(1_000, { locale: 'ru-RU' })).toBe('1 тысяча');
    expect(f.format(2_000, { locale: 'ru-RU' })).toBe('2 тысячи');
    expect(f.format(5_000, { locale: 'ru-RU' })).toBe('5 тысяч');
    expect(f.format(2_000_000, { locale: 'ru-RU' })).toBe('2 миллиона');
    expect(f.format(5_000_000, { locale: 'ru-RU' })).toBe('5 миллионов');
    expect(f.format(1_000_000_000, { locale: 'ru-RU' })).toBe('1 миллиард');
    expect(f.format(1_000_000_000_000, { locale: 'ru-RU' })).toBe('1 триллион');
  });

  it('ru-RU: abbr stays invariant (тыс., млн, ...)', () => {
    expect(f.format(2_000, { locale: 'ru-RU', style: 'abbr' })).toBe('2 тыс.');
    expect(f.format(2_000_000, { locale: 'ru-RU', style: 'abbr' })).toBe('2 млн');
  });

  it('ru-RU: fractional (1.5 thousand) uses OTHER form', () => {
    f.setAllowedFractions([0, 0.5]);
    // Force decimal separator to comma (ru-RU) to make assertion deterministic
    const out = f.format(1_500, { locale: 'ru-RU', numberLocale: 'ru-RU' });
    expect(out).toBe('1,5 тысячи');
  });

  it('uk-UA: thousand forms (words)', () => {
    expect(f.format(1_000, { locale: 'uk-UA' })).toBe('1 тисяча');
    expect(f.format(2_000, { locale: 'uk-UA' })).toBe('2 тисячі');
    expect(f.format(5_000, { locale: 'uk-UA' })).toBe('5 тисяч');
  });

  it('pl-PL: correct units and forms (milion/miliard/bilion)', () => {
    expect(f.format(1_000, { locale: 'pl-PL' })).toBe('1 tysiąc');
    expect(f.format(2_000, { locale: 'pl-PL' })).toBe('2 tysiące');
    expect(f.format(5_000, { locale: 'pl-PL' })).toBe('5 tysięcy');
    expect(f.format(1_000_000, { locale: 'pl-PL' })).toBe('1 milion');
    expect(f.format(2_000_000, { locale: 'pl-PL' })).toBe('2 miliony');
    expect(f.format(5_000_000, { locale: 'pl-PL' })).toBe('5 milionów');
    expect(f.format(1_000_000_000, { locale: 'pl-PL' })).toBe('1 miliard');
    expect(f.format(1_000_000_000_000, { locale: 'pl-PL' })).toBe('1 bilion');
  });

  it('ro-RO: one/other forms', () => {
    expect(f.format(1_000, { locale: 'ro-RO' })).toBe('1 mie');
    expect(f.format(2_000, { locale: 'ro-RO' })).toBe('2 mii');
    expect(f.format(1_000_000, { locale: 'ro-RO' })).toBe('1 milion');
    expect(f.format(2_000_000, { locale: 'ro-RO' })).toBe('2 milioane');
  });

  it('ar: Arabic forms; label part matches regardless of BiDi marks', () => {
    // We check label substrings rather than full RTL-wrapped string
    expect(stripBidi(f.format(1_000, { locale: 'ar' }))).toContain('ألف');     // one
    expect(stripBidi(f.format(2_000, { locale: 'ar' }))).toContain('ألفان');   // two
    expect(stripBidi(f.format(3_000, { locale: 'ar' }))).toContain('آلاف');    // few
    expect(stripBidi(f.format(11_000, { locale: 'ar' }))).toContain('ألف');    // many/other fallbacks to ألف
  });

  it('en-GB: no morphology (strings), abbr works', () => {
    expect(f.format(1_000, { locale: 'en-GB' })).toBe('1 thousand');
    expect(f.format(2_000, { locale: 'en-GB' })).toBe('2 thousand');
    expect(f.format(1_000_000, { locale: 'en-GB', style: 'abbr' })).toBe('1 M');
  });

  it('bg-BG: thousand/million forms', () => {
    expect(f.format(1_000, { locale: 'bg-BG' })).toBe('1 хиляда');
    expect(f.format(2_000, { locale: 'bg-BG' })).toBe('2 хиляди');
    expect(f.format(1_000_000, { locale: 'bg-BG' })).toBe('1 милион');
    expect(f.format(2_000_000, { locale: 'bg-BG' })).toBe('2 милиона');
  });

  it('id-ID: no plural change (strings)', () => {
    expect(f.format(1_000, { locale: 'id-ID' })).toBe('1 ribu');
    expect(f.format(2_000, { locale: 'id-ID' })).toBe('2 ribu');
    expect(f.format(1_000_000, { locale: 'id-ID' })).toBe('1 juta');
  });

  it('resolveLabel is applied after inflection (hook receives inflected forms)', () => {
    const fx = createCompactFormatter();
    fx.registerLocale({
      locale: 'ru-test',
      labels: {
        thousand: {
          words: { one: 'тысяча', few: 'тысячи', many: 'тысяч', other: 'тысячи' },
          abbr: { other: 'тыс.' },
        },
      },
      rules: {
        resolveLabel: (_unit, base /* already inflected */, _factor, _style) => {
          // demonstrate that 'base.words' is already inflected: wrap it in '«»'
          return `«${base.words}»`;
        },
      },
    });
    expect(fx.format(2_000, { locale: 'ru-test' })).toBe('2 «тысячи»');
  });

  it('string labels (no forms) remain as-is and do not crash', () => {
    const fy = createCompactFormatter();
    fy.registerLocale({
      locale: 'xx',
      labels: {
        thousand: { words: 'mega', abbr: 'm' } as any, // explicit string-only node
      },
    });
    expect(fy.format(1_000, { locale: 'xx' })).toBe('1 mega');
    expect(fy.format(2_000, { locale: 'xx', style: 'abbr' })).toBe('2 m');
  });
});
