// comments in English only
import { createCompactFormatter, type LocalePack } from '../src/precise-compact';

// --- tiny assert helpers ---
function assertEqual(actual: string, expected: string, label: string) {
  if (actual !== expected) {
    console.error(`✖ ${label}\n   Expected: ${expected}\n   Received: ${actual}`);
    throw new Error(`Assertion failed: ${label}`);
  }
  console.log(`✔ ${label}: ${actual}`);
}
function expectedIntl(
  n: number,
  loc = 'en-US',
  opts: Intl.NumberFormatOptions = { useGrouping: false },
) {
  return new Intl.NumberFormat(loc, opts).format(n);
}

// --- 30 locale packs (minimal labels; numberLocale mostly en-US for determinism) ---
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
      billion: { words: 'میلیارد', abbr: 'میلیارد' },
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

// --- prepare formatter ---
const fmt = createCompactFormatter();
for (const p of packs) fmt.registerLocale(p);

// --- show quick multi-locale samples (not asserts, just output) ---
const sampleValues = [1_000, 1_500, 10_000, 1_000_000, 25_000_000];
for (const p of packs.slice(0, 10)) {
  // show first 10 to keep log short
  const locale = p.locale;
  const v = [
    fmt.format(1_000, { locale }),
    fmt.format(1_500, { locale }),
    fmt.format(10_000, { locale, system: 'eastAsia' }),
    fmt.format(25_000_000, { locale, system: 'indian', style: 'abbr' }),
  ].join(' | ');
  console.log(`[${locale}] ${v}`);
}

// --- 15 fallback variations (asserts) ---
(function fallbackSuite() {
  // 1) unknown system -> raw
  assertEqual(
    fmt.format(1_000_000, { system: '___unknown___' as any }),
    '1000000',
    'fallback: unknown system',
  );

  // 2) below smallest unit -> raw
  assertEqual(fmt.format(999), '999', 'fallback: below smallest');

  // 3) non-integer input -> raw
  assertEqual(fmt.format(1.1), '1.1', 'fallback: non-integer input');

  // 4) not allowed fraction -> raw after loop
  const f4 = createCompactFormatter();
  f4.setAllowedFractions([0]);
  assertEqual(f4.format(1_500), '1500', 'fallback: disallowed fraction');

  // 5) invalid candidate -> use rules.numberLocale
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
  assertEqual(
    f5.format(1_500, { locale: 'custom', numberLocale: 'zz' }),
    `${expectedIntl(1.5)} thousand`,
    'fallback chain: rules.numberLocale',
  );

  // 6) invalid candidate + no rules.numberLocale + valid defaultLocale -> defaultLocale
  const f6 = createCompactFormatter({
    defaultLocale: 'en-GB',
    locales: [{ locale: 'en-GB', labels: {} } as LocalePack],
  });
  assertEqual(
    f6.format(1_500, { locale: 'en-GB', numberLocale: 'zz' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
    'fallback chain: defaultLocale (behaves like en-US here)',
  );

  // 7) invalid candidate + invalid defaultLocale -> en-US
  const f7 = createCompactFormatter({
    defaultLocale: 'xx',
    locales: [{ locale: 'xx', labels: {} } as LocalePack],
  });
  assertEqual(
    f7.format(1_500, { locale: 'xx', numberLocale: 'yy' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
    'fallback chain: en-US',
  );

  // 8) missing label in locale -> fallback to English label
  const f8 = createCompactFormatter();
  f8.registerLocale({ locale: 'xx-lab', labels: { million: { words: 'MEGA', abbr: 'ME' } } });
  assertEqual(f8.format(1_000, { locale: 'xx-lab' }), '1 thousand', 'label fallback: to English');

  // 9) missing label in both locale and EN -> literal unit key
  const f9 = createCompactFormatter();
  f9.registerSystem({
    id: 'custom-unknown' as any,
    units: [{ key: 'mega' as any, value: 1_000n }],
  });
  assertEqual(
    f9.format(1_000, { system: 'custom-unknown' as any }),
    '1 mega',
    'label fallback: literal unit key',
  );

  // 10) BigInt locale fallback
  const f10 = createCompactFormatter();
  assertEqual(
    f10.format(1501n, { fallback: 'locale', numberLocale: 'en-US' }),
    expectedIntl(1501, 'en-US'),
    'fallback: bigint locale formatting',
  );

  // 11) negative non-integer -> raw
  assertEqual(fmt.format(-1501), '-1501', 'fallback: negative non-integer');

  // 12) unknown labels locale -> pick defaultLocale (en) labels
  const f12 = createCompactFormatter();
  assertEqual(
    f12.format(1_000, { locale: 'zz-unknown' }),
    '1 thousand',
    'label locale fallback: default',
  );

  // 13) unknown system + fallback: "locale" with grouping
  const f13 = createCompactFormatter();
  assertEqual(
    f13.format(1_000_000, {
      system: '___unknown___' as any,
      fallback: 'locale',
      numberLocale: 'en-US',
      numberOptions: { useGrouping: true },
    }),
    expectedIntl(1_000_000, 'en-US', { useGrouping: true }),
    'fallback: unknown system + locale formatting',
  );

  // 14) eastAsia system but value < 10^4 -> fallback: "locale" with grouping
  const f14 = createCompactFormatter();
  assertEqual(
    f14.format(9_999, {
      system: 'eastAsia',
      fallback: 'locale',
      numberLocale: 'en-US',
      numberOptions: { useGrouping: true },
    }),
    expectedIntl(9_999, 'en-US', { useGrouping: true }),
    'fallback: eastAsia below unit threshold',
  );

  // 15) chain with broken rules.numberLocale + broken default -> ends at en-US
  const f15 = createCompactFormatter({
    defaultLocale: 'xx',
    locales: [{ locale: 'xx', labels: {}, rules: { numberLocale: 'yy' } } as LocalePack],
  });
  assertEqual(
    f15.format(1_500, { locale: 'xx', numberLocale: 'zz' }),
    `${expectedIntl(1.5, 'en-US')} thousand`,
    'fallback chain: broken rules.numberLocale + broken default -> en-US',
  );
})();

console.log('\nAll fallback variations passed.');
