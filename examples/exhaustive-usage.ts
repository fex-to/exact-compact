// comments in English only
import { createCompactFormatter, type LocalePack } from '../src/precise-compact';

// ---------- tiny assert helpers ----------
function expectedIntl(
  n: number,
  loc = 'en-US',
  opts: Intl.NumberFormatOptions = { useGrouping: false },
) {
  return new Intl.NumberFormat(loc, opts).format(n);
}
function ok(label: string, actual: string) {
  console.log(`✔ ${label}: ${actual}`);
}
function eq(label: string, actual: string, expected: string) {
  if (actual !== expected) {
    console.error(`✖ ${label}\n   expected: ${expected}\n   received: ${actual}`);
    throw new Error(`Assertion failed: ${label}`);
  }
  ok(label, actual);
}

// ---------- 30 demo locale packs (labels minimal; numbers via en-US for determinism) ----------
const packs: LocalePack[] = [
  {
    locale: 'zh-CN',
    labels: {
      thousand: { words: '千', abbr: '千' },
      wan: { words: '万', abbr: '万' },
      yi: { words: '亿', abbr: '亿' },
    },
    rules: { joiner: '', numberLocale: 'en-US' },
  },
  {
    locale: 'es',
    labels: {
      thousand: { words: 'mil', abbr: 'k' },
      million: { words: 'millón', abbr: 'M' },
      billion: { words: 'mil millones', abbr: 'MM' },
      trillion: { words: 'billón', abbr: 'Bn' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'ar',
    labels: {
      thousand: { words: 'ألف', abbr: 'أ' },
      million: { words: 'مليون', abbr: 'م' },
      billion: { words: 'مليار', abbr: 'مليار' },
      trillion: { words: 'تريليون', abbr: 'تر' },
    },
    rules: { rtl: true, numberLocale: 'en-US', finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'pt-BR',
    labels: {
      thousand: { words: 'mil', abbr: 'mil' },
      million: { words: 'milhão', abbr: 'Mi' },
      billion: { words: 'bilhão', abbr: 'Bi' },
      trillion: { words: 'trilhão', abbr: 'Tri' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'pt-PT',
    labels: {
      thousand: { words: 'mil', abbr: 'mil' },
      million: { words: 'milhão', abbr: 'M' },
      billion: { words: 'mil milhões', abbr: 'MM' },
      trillion: { words: 'bilião', abbr: 'Bn' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'id-ID',
    labels: {
      thousand: { words: 'ribu', abbr: 'rb' },
      million: { words: 'juta', abbr: 'jt' },
      billion: { words: 'miliar', abbr: 'mlr' },
      trillion: { words: 'triliun', abbr: 'trl' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'fr-FR',
    labels: {
      thousand: { words: 'mille', abbr: 'k' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
      trillion: { words: 'billion', abbr: 'Bn' },
    },
    rules: { joiner: '\u202F', numberLocale: 'en-US' },
  },
  {
    locale: 'ja-JP',
    labels: {
      thousand: { words: '千', abbr: '千' },
      wan: { words: '万', abbr: '万' },
      yi: { words: '億', abbr: '億' },
    },
    rules: { joiner: '', numberLocale: 'en-US' },
  },
  {
    locale: 'ru-RU',
    labels: {
      thousand: { words: 'тысяча', abbr: 'тыс.' },
      million: { words: 'миллион', abbr: 'млн' },
      billion: { words: 'миллиард', abbr: 'млрд' },
      trillion: { words: 'триллион', abbr: 'трлн' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'de-DE',
    labels: {
      thousand: { words: 'tausend', abbr: 'Tsd.' },
      million: { words: 'Million', abbr: 'Mio.' },
      billion: { words: 'Milliarde', abbr: 'Mrd.' },
      trillion: { words: 'Billion', abbr: 'Bio.' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'hi-IN',
    labels: {
      thousand: { words: 'हज़ार', abbr: 'k' },
      lakh: { words: 'लाख', abbr: 'L' },
      crore: { words: 'करोड़', abbr: 'Cr' },
      million: { words: 'मिलियन', abbr: 'M' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'tr-TR',
    labels: {
      thousand: { words: 'bin', abbr: 'B' },
      million: { words: 'milyon', abbr: 'M' },
      billion: { words: 'milyar', abbr: 'Mr' },
      trillion: { words: 'trilyon', abbr: 'T' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'vi-VN',
    labels: {
      thousand: { words: 'nghìn', abbr: 'N' },
      million: { words: 'triệu', abbr: 'Tr' },
      billion: { words: 'tỷ', abbr: 'Tỷ' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'ko-KR',
    labels: {
      thousand: { words: '천', abbr: '천' },
      wan: { words: '만', abbr: '만' },
      yi: { words: '억', abbr: '억' },
    },
    rules: { joiner: '', numberLocale: 'en-US' },
  },
  {
    locale: 'it-IT',
    labels: {
      thousand: { words: 'mille', abbr: 'k' },
      million: { words: 'milione', abbr: 'M' },
      billion: { words: 'miliardo', abbr: 'Mld' },
      trillion: { words: 'bilione', abbr: 'Bn' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'fa-IR',
    labels: {
      thousand: { words: 'هزار', abbr: 'هزار' },
      million: { words: 'میلیون', abbr: 'م' },
      billion: { words: 'میلیارد', abbr: 'میلیард' },
    },
    rules: { rtl: true, numberLocale: 'en-US', finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'pl-PL',
    labels: {
      thousand: { words: 'tysiąc', abbr: 'tys.' },
      million: { words: 'milion', abbr: 'mln' },
      billion: { words: 'miliard', abbr: 'mld' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'nl-NL',
    labels: {
      thousand: { words: 'duizend', abbr: 'k' },
      million: { words: 'miljoen', abbr: 'M' },
      billion: { words: 'miljard', abbr: 'Mrd' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'th-TH',
    labels: {
      thousand: { words: 'พัน', abbr: 'พ' },
      million: { words: 'ล้าน', abbr: 'ล' },
      billion: { words: 'พันล้าน', abbr: 'พล' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'uk-UA',
    labels: {
      thousand: { words: 'тисяча', abbr: 'тис.' },
      million: { words: 'мільйон', abbr: 'млн' },
      billion: { words: 'мільярд', abbr: 'млрд' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'he-IL',
    labels: {
      thousand: { words: 'אלף', abbr: 'א' },
      million: { words: 'מיליון', abbr: 'מל' },
      billion: { words: 'מיליארד', abbr: 'מל׳' },
    },
    rules: { rtl: true, numberLocale: 'en-US', finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'sv-SE',
    labels: {
      thousand: { words: 'tusen', abbr: 't' },
      million: { words: 'miljon', abbr: 'M' },
      billion: { words: 'miljard', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'hu-HU',
    labels: {
      thousand: { words: 'ezer', abbr: 'e' },
      million: { words: 'millió', abbr: 'M' },
      billion: { words: 'milliárd', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'da-DK',
    labels: {
      thousand: { words: 'tusind', abbr: 't' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'no-NO',
    labels: {
      thousand: { words: 'tusen', abbr: 't' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'fi-FI',
    labels: {
      thousand: { words: 'tuhat', abbr: 't' },
      million: { words: 'miljoona', abbr: 'M' },
      billion: { words: 'miljardi', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'cs-CZ',
    labels: {
      thousand: { words: 'tisíc', abbr: 'tis.' },
      million: { words: 'milion', abbr: 'mil.' },
      billion: { words: 'miliarda', abbr: 'mld.' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'el-GR',
    labels: {
      thousand: { words: 'χίλια', abbr: 'χ' },
      million: { words: 'εκατομμύριο', abbr: 'Ε' },
      billion: { words: 'δισεκατομμύριο', abbr: 'Δ' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'ro-RO',
    labels: {
      thousand: { words: 'mie', abbr: 'K' },
      million: { words: 'milion', abbr: 'M' },
      billion: { words: 'miliard', abbr: 'Md' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'ms-MY',
    labels: {
      thousand: { words: 'ribu', abbr: 'rb' },
      million: { words: 'juta', abbr: 'jt' },
      billion: { words: 'bilion', abbr: 'bln' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'fil-PH',
    labels: {
      thousand: { words: 'libo', abbr: 'k' },
      million: { words: 'milyon', abbr: 'M' },
      billion: { words: 'bilyon', abbr: 'B' },
    },
    rules: { numberLocale: 'en-US' },
  },
  {
    locale: 'bn-BD',
    labels: {
      thousand: { words: 'হাজার', abbr: 'হা' },
      lakh: { words: 'লাখ', abbr: 'L' },
      crore: { words: 'কোটি', abbr: 'Cr' },
    },
    rules: { numberLocale: 'en-US' },
  },
];

// ---------- prepare formatter ----------
const fmt = createCompactFormatter();
packs.forEach((p) => fmt.registerLocale(p));

// ---------- 1) Basic usage across systems/styles/locales ----------
console.log('\n== BASIC MATRIX (first 10 locales) ==');
const basicValues = [1_000, 1_500, 10_000, 1_000_000, 25_000_000, 100_000_000, 1_000_000_000_000];
for (const p of packs.slice(0, 10)) {
  const L = p.locale;
  const row = [
    fmt.format(1_000, { locale: L }), // intl words
    fmt.format(1_500, { locale: L, style: 'abbr' }), // intl abbr
    fmt.format(10_000, { locale: L, system: 'eastAsia' }), // eastAsia words
    fmt.format(100_000_000, { locale: L, system: 'eastAsia', style: 'abbr' }),
    fmt.format(25_000_000, { locale: L, system: 'indian' }), // indian words
    fmt.format(25_000_000, { locale: L, system: 'indian', style: 'abbr' }),
    fmt.format(1_000_000_000_000n, { locale: L }), // bigint
  ].join(' | ');
  console.log(`[${L}] ${row}`);
}

// ---------- 2) All options demo (permutations distilled) ----------
console.log('\n== OPTIONS SHOWCASE ==');
(function optionsShowcase() {
  // style words vs abbr
  eq('style: words', fmt.format(2_000_000), '2 million');
  eq('style: abbr', fmt.format(2_000_000, { style: 'abbr' }), '2 M');

  // joiner and unitOrder via custom locale
  fmt.registerLocale({
    locale: 'xx-join-before',
    labels: { thousand: { words: 'TH', abbr: 'TH' }, million: { words: 'MI', abbr: 'MI' } },
    rules: { joiner: '\u00A0', unitOrder: 'before', numberLocale: 'en-US' },
  });
  eq('unitOrder before + NBSP', fmt.format(1_000, { locale: 'xx-join-before' }), 'TH\u00A01');

  // resolveLabel (morphology)
  fmt.registerLocale({
    locale: 'ru-pl',
    labels: {
      thousand: { words: 'тысяча', abbr: 'тыс.' },
      million: { words: 'миллион', abbr: 'млн' },
      billion: { words: 'миллиард', abbr: 'млрд' },
    },
    rules: {
      numberLocale: 'en-US',
      resolveLabel: (unit, base, factor, style) => {
        if (style === 'abbr') return base.abbr;
        const n = Math.floor(Math.abs(factor));
        const last2 = n % 100,
          last1 = n % 10;
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
  });
  eq('resolveLabel morphology', fmt.format(2_000, { locale: 'ru-pl' }), '2 тысячи');

  // finalize hook (BiDi marker)
  fmt.registerLocale({
    locale: 'ar-demo',
    labels: { thousand: { words: 'ألف', abbr: 'أ' }, million: { words: 'مليون', abbr: 'م' } },
    rules: { numberLocale: 'en-US', finalize: (s) => `\u200F${s}\u200F` },
  });
  eq('finalize (BiDi)', fmt.format(1_000, { locale: 'ar-demo' }), '\u200F1 ألف\u200F');

  // numberOptions (grouping)
  eq(
    'numberOptions grouping (fallback path)',
    fmt.format(1501, {
      fallback: 'locale',
      numberLocale: 'en-US',
      numberOptions: { useGrouping: true },
    }),
    expectedIntl(1501, 'en-US', { useGrouping: true }),
  );

  // allowedFractions
  const f = createCompactFormatter();
  f.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);
  eq('allowedFractions .25', f.format(125_000, { system: 'indian' }), '1.25 lakh');
  eq('allowedFractions .75', f.format(75_000, { system: 'indian' }), '0.75 lakh');
  eq('allowedFractions .1', f.format(110_000, { system: 'indian' }), '1.1 lakh');
})();

// ---------- 3) Fallback suite (15+ robust scenarios) ----------
console.log('\n== FALLBACK SUITE ==');
(function fallbackSuite() {
  // 1 unknown system
  eq('fb1 unknown system', fmt.format(1_000_000, { system: '___unknown___' as any }), '1000000');
  // 2 below smallest
  eq('fb2 < smallest', fmt.format(999), '999');
  // 3 non-integer -> raw
  eq('fb3 non-integer', fmt.format(1.1), '1.1');
  // 4 disallowed fraction (only integer)
  const f4 = createCompactFormatter();
  f4.setAllowedFractions([0]);
  eq('fb4 disallowed fraction', f4.format(1_500), '1500');
  // 5 invalid candidate -> rules.numberLocale
  const f5 = createCompactFormatter({
    defaultLocale: 'xx',
    locales: [
      {
        locale: 'custom',
        labels: {},
        rules: { numberLocale: 'en-US', numberOptions: { useGrouping: false } },
      } as LocalePack,
    ],
  });
  eq(
    'fb5 candidate -> rules.numberLocale',
    f5.format(1_500, { locale: 'custom', numberLocale: 'zz' }),
    `${expectedIntl(1.5)} thousand`,
  );
  // 6 invalid candidate + no rules.numberLocale + valid default -> defaultLocale (behaves like en-US here)
  const f6 = createCompactFormatter({
    defaultLocale: 'en-GB',
    locales: [{ locale: 'en-GB', labels: {} } as LocalePack],
  });
  eq(
    'fb6 -> defaultLocale',
    f6.format(1_500, { locale: 'en-GB', numberLocale: 'zz' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
  );
  // 7 invalid candidate + invalid default -> en-US
  const f7 = createCompactFormatter({
    defaultLocale: 'xx',
    locales: [{ locale: 'xx', labels: {} } as LocalePack],
  });
  eq(
    'fb7 -> en-US',
    f7.format(1_500, { locale: 'xx', numberLocale: 'yy' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
  );
  // 8 missing label in locale -> fallback to English label
  const f8 = createCompactFormatter();
  f8.registerLocale({ locale: 'xx-lab', labels: { million: { words: 'MEGA', abbr: 'ME' } } });
  eq('fb8 label -> English', f8.format(1_000, { locale: 'xx-lab' }), '1 thousand');
  // 9 missing label in both locale & EN -> literal unit key
  const f9 = createCompactFormatter();
  f9.registerSystem({
    id: 'custom-unknown' as any,
    units: [{ key: 'mega' as any, value: 1_000n }],
  });
  eq('fb9 label -> literal key', f9.format(1_000, { system: 'custom-unknown' as any }), '1 mega');
  // 10 BigInt with locale fallback
  const f10 = createCompactFormatter();
  eq(
    'fb10 bigint locale',
    f10.format(1501n, { fallback: 'locale', numberLocale: 'en-US' }),
    expectedIntl(1501, 'en-US'),
  );
  // 11 negative non-integer -> raw
  eq('fb11 negative non-integer', fmt.format(-1501), '-1501');
  // 12 unknown labels locale -> default labels (EN)
  const f12 = createCompactFormatter();
  eq('fb12 label locale -> default EN', f12.format(1_000, { locale: 'zz-unknown' }), '1 thousand');
  // 13 unknown system + fallback: locale with grouping
  const f13 = createCompactFormatter();
  eq(
    'fb13 unknown system + locale',
    f13.format(1_000_000, {
      system: '___unknown___' as any,
      fallback: 'locale',
      numberLocale: 'en-US',
      numberOptions: { useGrouping: true },
    }),
    expectedIntl(1_000_000, 'en-US', { useGrouping: true }),
  );
  // 14 eastAsia below threshold + locale
  const f14 = createCompactFormatter();
  eq(
    'fb14 eastAsia below threshold',
    f14.format(9_999, {
      system: 'eastAsia',
      fallback: 'locale',
      numberLocale: 'en-US',
      numberOptions: { useGrouping: true },
    }),
    expectedIntl(9_999, 'en-US', { useGrouping: true }),
  );
  // 15 broken rules.numberLocale + broken default -> en-US
  const f15 = createCompactFormatter({
    defaultLocale: 'xx',
    locales: [{ locale: 'xx', labels: {}, rules: { numberLocale: 'yy' } } as LocalePack],
  });
  eq(
    'fb15 broken chain -> en-US',
    f15.format(1_500, { locale: 'xx', numberLocale: 'zz' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
  );
  // 16 value equals top unit (trillion)
  eq('fb16 exact trillion', fmt.format(1_000_000_000_000), '1 trillion');
  // 17 eastAsia exact yi
  eq('fb17 eastAsia yi', fmt.format(100_000_000, { system: 'eastAsia' }), '1 yi');
  // 18 eastAsia exact wan
  eq('fb18 eastAsia wan', fmt.format(10_000, { system: 'eastAsia' }), '1 wan');
  // 19 indian crore
  eq('fb19 indian crore', fmt.format(10_000_000, { system: 'indian' }), '1 crore');
  // 20 indian arab
  eq('fb20 indian arab', fmt.format(1_000_000_000, { system: 'indian' }), '1 arab');
  // 21 setDefaultLocale effect
  const f21 = createCompactFormatter();
  f21.registerLocale({
    locale: 'xx-def',
    labels: { thousand: { words: 'TH', abbr: 'TH' } },
    rules: { numberLocale: 'en-US' },
  });
  f21.setDefaultLocale('xx-def');
  eq('fb21 defaultLocale labels', f21.format(1_000), '1 TH');
  // 22 style abbr in eastAsia
  eq('fb22 eastAsia abbr', fmt.format(100_000_000, { system: 'eastAsia', style: 'abbr' }), '1 y');
  // 23 style abbr in indian
  eq('fb23 indian abbr', fmt.format(100_000, { system: 'indian', style: 'abbr' }), '1 L');
  // 24 negative eastAsia with joiner=''
  eq(
    'fb24 negative eastAsia',
    fmt.format(-20_000, { system: 'eastAsia', locale: 'zh-CN' }),
    '-2万',
  );
  // 25 finalize present but no rtl digits (fa-IR)
  eq('fb25 finalize hook out', fmt.format(1_000, { locale: 'fa-IR' }), '\u200F1 هزار\u200F');
})();

// ---------- 4) ICU-sensitive demonstrations (no asserts; just visual) ----------
console.log('\n== ICU-SENSITIVE (printed only) ==');
console.log('[ar-EG with Arabic-Indic digits demo - printed, not asserted]');
const fmtArDigits = createCompactFormatter();
fmtArDigits.registerLocale({
  locale: 'ar-num',
  labels: { thousand: { words: 'ألف', abbr: 'أ' } },
  rules: { numberLocale: 'ar-EG-u-nu-arab', finalize: (s) => `\u200F${s}\u200F` },
});
console.log(' ', fmtArDigits.format(1_500, { locale: 'ar-num' })); // expected like "‎١٫٥ ألف‎" if ICU supports

console.log('\nAll demonstrations completed successfully.');
