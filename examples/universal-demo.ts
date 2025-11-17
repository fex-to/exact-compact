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

const groupingFallback = (value: number | bigint) => {
  if (typeof value === 'bigint') return value.toString();
  return new Intl.NumberFormat('en-US', { useGrouping: true }).format(value);
};

// ---------- 30 demo locale packs (labels minimal; numbers now raw unless caller formats) ----------
const packs: LocalePack[] = [
  {
    locale: 'zh-CN',
    labels: {
      thousand: { words: '千', abbr: '千' },
      wan: { words: '万', abbr: '万' },
      yi: { words: '亿', abbr: '亿' },
    },
    rules: { joiner: '' },
  },
  {
    locale: 'es',
    labels: {
      thousand: { words: 'mil', abbr: 'k' },
      million: { words: 'millón', abbr: 'M' },
      billion: { words: 'mil millones', abbr: 'MM' },
      trillion: { words: 'billón', abbr: 'Bn' },
    },
  },
  {
    locale: 'ar',
    labels: {
      thousand: { words: 'ألف', abbr: 'أ' },
      million: { words: 'مليون', abbr: 'م' },
      billion: { words: 'مليار', abbr: 'مليار' },
      trillion: { words: 'تريليون', abbr: 'تر' },
    },
    rules: { rtl: true, finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'pt-BR',
    labels: {
      thousand: { words: 'mil', abbr: 'mil' },
      million: { words: 'milhão', abbr: 'Mi' },
      billion: { words: 'bilhão', abbr: 'Bi' },
      trillion: { words: 'trilhão', abbr: 'Tri' },
    },
  },
  {
    locale: 'pt-PT',
    labels: {
      thousand: { words: 'mil', abbr: 'mil' },
      million: { words: 'milhão', abbr: 'M' },
      billion: { words: 'mil milhões', abbr: 'MM' },
      trillion: { words: 'bilião', abbr: 'Bn' },
    },
  },
  {
    locale: 'id-ID',
    labels: {
      thousand: { words: 'ribu', abbr: 'rb' },
      million: { words: 'juta', abbr: 'jt' },
      billion: { words: 'miliar', abbr: 'mlr' },
      trillion: { words: 'triliun', abbr: 'trl' },
    },
  },
  {
    locale: 'fr-FR',
    labels: {
      thousand: { words: 'mille', abbr: 'k' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
      trillion: { words: 'billion', abbr: 'Bn' },
    },
    rules: { joiner: '\u202F' },
  },
  {
    locale: 'ja-JP',
    labels: {
      thousand: { words: '千', abbr: '千' },
      wan: { words: '万', abbr: '万' },
      yi: { words: '億', abbr: '億' },
    },
    rules: { joiner: '' },
  },
  {
    locale: 'ru-RU',
    labels: {
      thousand: { words: 'тысяча', abbr: 'тыс.' },
      million: { words: 'миллион', abbr: 'млн' },
      billion: { words: 'миллиард', abbr: 'млрд' },
      trillion: { words: 'триллион', abbr: 'трлн' },
    },
  },
  {
    locale: 'de-DE',
    labels: {
      thousand: { words: 'tausend', abbr: 'Tsd.' },
      million: { words: 'Million', abbr: 'Mio.' },
      billion: { words: 'Milliarde', abbr: 'Mrd.' },
      trillion: { words: 'Billion', abbr: 'Bio.' },
    },
  },
  {
    locale: 'hi-IN',
    labels: {
      thousand: { words: 'हज़ार', abbr: 'k' },
      lakh: { words: 'लाख', abbr: 'L' },
      crore: { words: 'करोड़', abbr: 'Cr' },
      million: { words: 'मिलियन', abbr: 'M' },
    },
  },
  {
    locale: 'tr-TR',
    labels: {
      thousand: { words: 'bin', abbr: 'B' },
      million: { words: 'milyon', abbr: 'M' },
      billion: { words: 'milyar', abbr: 'Mr' },
      trillion: { words: 'trilyon', abbr: 'T' },
    },
  },
  {
    locale: 'vi-VN',
    labels: {
      thousand: { words: 'nghìn', abbr: 'N' },
      million: { words: 'triệu', abbr: 'Tr' },
      billion: { words: 'tỷ', abbr: 'Tỷ' },
    },
  },
  {
    locale: 'ko-KR',
    labels: {
      thousand: { words: '천', abbr: '천' },
      wan: { words: '만', abbr: '만' },
      yi: { words: '억', abbr: '억' },
    },
    rules: { joiner: '' },
  },
  {
    locale: 'it-IT',
    labels: {
      thousand: { words: 'mille', abbr: 'k' },
      million: { words: 'milione', abbr: 'M' },
      billion: { words: 'miliardo', abbr: 'Mld' },
      trillion: { words: 'bilione', abbr: 'Bn' },
    },
  },
  {
    locale: 'fa-IR',
    labels: {
      thousand: { words: 'هزار', abbr: 'هزار' },
      million: { words: 'میلیون', abbr: 'م' },
      billion: { words: 'میلیارد', abbr: 'میلیارد' },
    },
    rules: { rtl: true, finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'pl-PL',
    labels: {
      thousand: { words: 'tysiąc', abbr: 'tys.' },
      million: { words: 'milion', abbr: 'mln' },
      billion: { words: 'miliard', abbr: 'mld' },
    },
  },
  {
    locale: 'nl-NL',
    labels: {
      thousand: { words: 'duizend', abbr: 'k' },
      million: { words: 'miljoen', abbr: 'M' },
      billion: { words: 'miljard', abbr: 'Mrd' },
    },
  },
  {
    locale: 'th-TH',
    labels: {
      thousand: { words: 'พัน', abbr: 'พ' },
      million: { words: 'ล้าน', abbr: 'ล' },
      billion: { words: 'พันล้าน', abbr: 'พล' },
    },
  },
  {
    locale: 'uk-UA',
    labels: {
      thousand: { words: 'тисяча', abbr: 'тис.' },
      million: { words: 'мільйон', abbr: 'млн' },
      billion: { words: 'мільярд', abbr: 'млрд' },
    },
  },
  {
    locale: 'he-IL',
    labels: {
      thousand: { words: 'אלף', abbr: 'א' },
      million: { words: 'מיליון', abbr: 'מל' },
      billion: { words: 'מיליארד', abbr: 'מל׳' },
    },
    rules: { rtl: true, finalize: (s) => `\u200F${s}\u200F` },
  },
  {
    locale: 'sv-SE',
    labels: {
      thousand: { words: 'tusen', abbr: 't' },
      million: { words: 'miljon', abbr: 'M' },
      billion: { words: 'miljard', abbr: 'Md' },
    },
  },
  {
    locale: 'hu-HU',
    labels: {
      thousand: { words: 'ezer', abbr: 'e' },
      million: { words: 'millió', abbr: 'M' },
      billion: { words: 'milliárd', abbr: 'Md' },
    },
  },
  {
    locale: 'da-DK',
    labels: {
      thousand: { words: 'tusind', abbr: 't' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
    },
  },
  {
    locale: 'no-NO',
    labels: {
      thousand: { words: 'tusen', abbr: 't' },
      million: { words: 'million', abbr: 'M' },
      billion: { words: 'milliard', abbr: 'Md' },
    },
  },
  {
    locale: 'fi-FI',
    labels: {
      thousand: { words: 'tuhat', abbr: 't' },
      million: { words: 'miljoona', abbr: 'M' },
      billion: { words: 'miljardi', abbr: 'Md' },
    },
  },
  {
    locale: 'cs-CZ',
    labels: {
      thousand: { words: 'tisíc', abbr: 'tis.' },
      million: { words: 'milion', abbr: 'mil.' },
      billion: { words: 'miliarda', abbr: 'mld.' },
    },
  },
  {
    locale: 'el-GR',
    labels: {
      thousand: { words: 'χίλια', abbr: 'χ' },
      million: { words: 'εκατομμύριο', abbr: 'Ε' },
      billion: { words: 'δισεκατομμύριο', abbr: 'Δ' },
    },
  },
  {
    locale: 'ro-RO',
    labels: {
      thousand: { words: 'mie', abbr: 'K' },
      million: { words: 'milion', abbr: 'M' },
      billion: { words: 'miliard', abbr: 'Md' },
    },
  },
  {
    locale: 'ms-MY',
    labels: {
      thousand: { words: 'ribu', abbr: 'rb' },
      million: { words: 'juta', abbr: 'jt' },
      billion: { words: 'bilion', abbr: 'bln' },
    },
  },
  {
    locale: 'fil-PH',
    labels: {
      thousand: { words: 'libo', abbr: 'k' },
      million: { words: 'milyon', abbr: 'M' },
      billion: { words: 'bilyon', abbr: 'B' },
    },
  },
  {
    locale: 'bn-BD',
    labels: {
      thousand: { words: 'হাজার', abbr: 'হা' },
      lakh: { words: 'লাখ', abbr: 'L' },
      crore: { words: 'কোটি', abbr: 'Cr' },
    },
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
    rules: { joiner: '\u00A0', unitOrder: 'before' },
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
    rules: { finalize: (s) => `\u200F${s}\u200F` },
  });
  eq('finalize (BiDi)', fmt.format(1_000, { locale: 'ar-demo' }), '\u200F1 ألف\u200F');

  // fallbackFn (caller controls presentation)
  eq(
    'fallbackFn grouping',
    fmt.format(1_500_000, {
      system: '___unknown___' as any,
      fallbackFn: (value) => groupingFallback(value),
    }),
    expectedIntl(1_500_000, 'en-US', { useGrouping: true }),
  );

  // allowedFractions
  const f = createCompactFormatter();
  f.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);
  eq('allowedFractions .25', f.format(125_000, { system: 'indian' }), '1.25 lakh');
  eq('allowedFractions .75', f.format(75_000, { system: 'indian' }), '0.75 lakh');
  eq('allowedFractions .1', f.format(110_000, { system: 'indian' }), '1.1 lakh');
})();

// ---------- 3) Fallback suite (modernized for fallbackFn) ----------
console.log('\n== FALLBACK SUITE ==');
(function fallbackSuite() {
  // 1 unknown system -> raw string
  eq('fb1 unknown system', fmt.format(1_000_000, { system: '___unknown___' as any }), '1000000');
  // 2 below smallest -> raw
  eq('fb2 < smallest', fmt.format(999), '999');
  // 3 non-integer -> raw
  eq('fb3 non-integer', fmt.format(1.1), '1.1');
  // 4 disallowed fraction (only integer)
  const f4 = createCompactFormatter();
  f4.setAllowedFractions([0]);
  eq('fb4 disallowed fraction', f4.format(1_500), '1500');
  // 5 custom fallback with Intl formatting
  eq(
    'fb5 custom fallback Intl',
    fmt.format(1_234_567, { system: '___unknown___' as any, fallbackFn: groupingFallback }),
    expectedIntl(1_234_567, 'en-US', { useGrouping: true }),
  );
  // 6 custom fallback for BigInt input
  eq(
    'fb6 custom fallback BigInt',
    fmt.format(999_999_999_999n, {
      system: 'mystery' as any,
      fallbackFn: (value) =>
        typeof value === 'bigint' ? `${value.toString()}n` : value.toString(),
    }),
    '999999999999n',
  );
  // 7 negative non-integer -> raw
  eq('fb7 negative non-integer', fmt.format(-1501), '-1501');
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
  // 10 unknown locale -> default EN labels
  const f10 = createCompactFormatter();
  eq('fb10 unknown locale', f10.format(1_000, { locale: 'zz-unknown' }), '1 thousand');
  // 11 value equals top unit (trillion)
  eq('fb11 exact trillion', fmt.format(1_000_000_000_000), '1 trillion');
  // 12 eastAsia exact yi
  eq('fb12 eastAsia yi', fmt.format(100_000_000, { system: 'eastAsia' }), '1 yi');
  // 13 eastAsia exact wan
  eq('fb13 eastAsia wan', fmt.format(10_000, { system: 'eastAsia' }), '1 wan');
  // 14 indian crore
  eq('fb14 indian crore', fmt.format(10_000_000, { system: 'indian' }), '1 crore');
  // 15 indian arab
  eq('fb15 indian arab', fmt.format(1_000_000_000, { system: 'indian' }), '1 arab');
  // 16 setDefaultLocale effect (labels only)
  const f16 = createCompactFormatter();
  f16.registerLocale({ locale: 'xx-def', labels: { thousand: { words: 'TH', abbr: 'TH' } } });
  f16.setDefaultLocale('xx-def');
  eq('fb16 defaultLocale labels', f16.format(1_000), '1 TH');
  // 17 style abbr in eastAsia
  eq('fb17 eastAsia abbr', fmt.format(100_000_000, { system: 'eastAsia', style: 'abbr' }), '1 y');
  // 18 style abbr in indian
  eq('fb18 indian abbr', fmt.format(100_000, { system: 'indian', style: 'abbr' }), '1 L');
  // 19 negative eastAsia with joiner=''
  eq(
    'fb19 negative eastAsia',
    fmt.format(-20_000, { system: 'eastAsia', locale: 'zh-CN' }),
    '-2万',
  );
  // 20 finalize present but no rtl digits (fa-IR)
  eq('fb20 finalize hook out', fmt.format(1_000, { locale: 'fa-IR' }), '‏1 هزار‏');
})();

// ---------- 4) ICU-sensitive demonstrations (no asserts; just visual) ----------
console.log('\n== ICU-SENSITIVE (printed only) ==');
console.log('[ar-EG Arabic-Indic digits via fallbackFn - printed, not asserted]');
const fmtArDigits = createCompactFormatter();
fmtArDigits.registerLocale({
  locale: 'ar-num',
  labels: { thousand: { words: 'ألف', abbr: 'أ' } },
  rules: { finalize: (s) => `\u200F${s}\u200F` },
});
const arabicDigitsFallback = (value: number | bigint) =>
  typeof value === 'bigint'
    ? value.toString()
    : new Intl.NumberFormat('ar-EG-u-nu-arab', { useGrouping: true }).format(value);
console.log(' ', fmtArDigits.format(999, { locale: 'ar-num', fallbackFn: arabicDigitsFallback }));
console.log(' ', fmtArDigits.format(1_500, { locale: 'ar-num' })); // ASCII digits by design

console.log('\nAll demonstrations completed successfully.');
