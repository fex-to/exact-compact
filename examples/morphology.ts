
import { createCompactFormatter, LocalePack } from '../src/precise-compact';

const f = createCompactFormatter();

// ---------- Russian (ru-RU) ----------
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
f.registerLocale(RU);

// ---------- Ukrainian (uk-UA) ----------
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
f.registerLocale(UK);

// ---------- Polish (pl-PL) ----------
const PL: LocalePack = {
  locale: 'pl-PL',
  labels: {
    thousand: {
      words: { one: 'tysiąc', few: 'tysiące', many: 'tysięcy', other: 'tysiące' },
      abbr: { other: 'tys.' },
    },
    // Note: English "billion"(10^9) -> Polish "miliard", "trillion"(10^12) -> "bilion"
    million: {
      words: { one: 'milion', few: 'miliony', many: 'milionów', other: 'miliony' },
      abbr: { other: 'mln' },
    },
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
f.registerLocale(PL);

// ---------- Romanian (ro-RO) ----------
const RO: LocalePack = {
  locale: 'ro-RO',
  labels: {
    thousand: {
      words: { one: 'mie', other: 'mii' }, // cardinal: one/other
      abbr: { other: 'mii' }, // or 'K' if you prefer
    },
    million: {
      words: { one: 'milion', other: 'milioane' },
      abbr: { other: 'mil.' },
    },
    // English "billion"(10^9) -> Romanian "miliard"
    billion: {
      words: { one: 'miliard', other: 'miliarde' },
      abbr: { other: 'mld.' },
    },
    // English "trillion"(10^12) -> Romanian "bilion"
    trillion: {
      words: { one: 'bilion', other: 'bilioane' },
      abbr: { other: 'bln.' },
    },
  },
};
f.registerLocale(RO);

// ---------- Arabic (ar) ----------
const AR: LocalePack = {
  locale: 'ar',
  labels: {
    thousand: {
      words: { zero: 'ألف', one: 'ألف', two: 'ألفان', few: 'آلاف', many: 'ألف', other: 'ألف' },
      abbr: { other: 'أ' },
    },
    million: {
      words: {
        zero: 'مليون',
        one: 'مليون',
        two: 'مليونان',
        few: 'ملايين',
        many: 'مليون',
        other: 'مليون',
      },
      abbr: { other: 'م' },
    },
    billion: {
      words: {
        zero: 'مليار',
        one: 'مليار',
        two: 'ملياران',
        few: 'مليارات',
        many: 'مليار',
        other: 'مليار',
      },
      abbr: { other: 'ملي' },
    },
    trillion: {
      words: {
        zero: 'تريليون',
        one: 'تريليون',
        two: 'تريليونان',
        few: 'تريليونات',
        many: 'تريليون',
        other: 'تريليون',
      },
      abbr: { other: 'تر' },
    },
  },
  rules: {
    // Optional: force RTL shaping at the end if needed
    finalize: (s) => s, // or wrap with RLM if your UI needs it
  },
};
f.registerLocale(AR);

// ---------- English (en-GB override, optional) ----------
const EN_GB: LocalePack = {
  locale: 'en-GB',
  labels: {
    thousand: { words: 'thousand', abbr: 'K' },
    million: { words: 'million', abbr: 'M' },
    billion: { words: 'billion', abbr: 'B' }, // short scale
    trillion: { words: 'trillion', abbr: 'T' }, // 10^12
  },
};
f.registerLocale(EN_GB);

// ---------- Bulgarian (bg-BG) ----------
const BG: LocalePack = {
  locale: 'bg-BG',
  labels: {
    thousand: {
      words: { one: 'хиляда', other: 'хиляди' },
      abbr: { other: 'хил.' },
    },
    million: {
      words: { one: 'милион', other: 'милиона' },
      abbr: { other: 'млн.' },
    },
    billion: {
      words: { one: 'милиард', other: 'милиарда' },
      abbr: { other: 'млрд.' },
    },
    trillion: {
      words: { one: 'трилион', other: 'трилиона' },
      abbr: { other: 'трлн.' },
    },
  },
};
f.registerLocale(BG);

// ---------- Indonesian (id-ID) ----------
const ID: LocalePack = {
  locale: 'id-ID',
  labels: {
    thousand: { words: 'ribu', abbr: 'rb' },
    million: { words: 'juta', abbr: 'jt' },
    billion: { words: 'miliar', abbr: 'M' }, // commonly abbreviated as 'M'
    trillion: { words: 'triliun', abbr: 'T' },
  },
  rules: {
    // Indonesian has no grammatical plural marking for these numerals
  },
};
f.registerLocale(ID);



// RU
f.setAllowedFractions([0, 0.5]); // allow halves
console.log(f.format(1_000, { locale: 'ru-RU' })); // "1 тысяча"
console.log(f.format(2_000, { locale: 'ru-RU' })); // "2 тысячи"
console.log(f.format(5_000, { locale: 'ru-RU' })); // "5 тысяч"
console.log(f.format(1_500, { locale: 'ru-RU' })); // "1.5 тысячи" (raw numeric fallback)
console.log(f.format(2_000_000, { locale: 'ru-RU' })); // "2 миллиона"

// UK
console.log(f.format(1_000, { locale: 'uk-UA' })); // "1 тисяча"
console.log(f.format(2_000, { locale: 'uk-UA' })); // "2 тисячі"
console.log(f.format(5_000, { locale: 'uk-UA' })); // "5 тисяч"
console.log(f.format(2_000_000, { locale: 'uk-UA' })); // "2 мільйона"

// PL
console.log(f.format(1_000, { locale: 'pl-PL' })); // "1 tysiąc"
console.log(f.format(2_000, { locale: 'pl-PL' })); // "2 tysiące"
console.log(f.format(5_000, { locale: 'pl-PL' })); // "5 tysięcy"
console.log(f.format(1_000_000, { locale: 'pl-PL' })); // "1 milion"
console.log(f.format(2_000_000, { locale: 'pl-PL' })); // "2 miliony"
console.log(f.format(5_000_000, { locale: 'pl-PL' })); // "5 milionów"
console.log(f.format(1_000_000_000, { locale: 'pl-PL' })); // "1 miliard"
console.log(f.format(1_000_000_000_000, { locale: 'pl-PL' })); // "1 bilion"

// RO (cardinal: one/other)
console.log(f.format(1_000, { locale: 'ro-RO' })); // "1 mie"
console.log(f.format(2_000, { locale: 'ro-RO' })); // "2 mii"
console.log(f.format(1_000_000, { locale: 'ro-RO' })); // "1 milion"
console.log(f.format(2_000_000, { locale: 'ro-RO' })); // "2 milioane"
console.log(f.format(1_000_000_000, { locale: 'ro-RO' })); // "1 miliard"
console.log(f.format(1_000_000_000_000, { locale: 'ro-RO' })); // "1 bilion"

// AR (Arabic morphologies)
console.log(f.format(1_000, { locale: 'ar' })); // "‏1 ألف‏"
console.log(f.format(2_000, { locale: 'ar' })); // "‏2 ألفان‏"
console.log(f.format(3_000, { locale: 'ar' })); // "‏3 آلاف‏"
console.log(f.format(11_000, { locale: 'ar' })); // "‏11 ألف‏"
console.log(f.format(1_000_000, { locale: 'ar' })); // "‏1 مليون‏"

// EN (default behavior)
console.log(f.format(1_000, { locale: 'en-GB' })); // "1 thousand"
console.log(f.format(2_000, { locale: 'en-GB' })); // "2 thousand"
console.log(f.format(1_000_000, { locale: 'en-GB' })); // "1 million"

// BG
console.log(f.format(1_000, { locale: 'bg-BG' })); // "1 хиляда"
console.log(f.format(2_000, { locale: 'bg-BG' })); // "2 хиляди"
console.log(f.format(5_000, { locale: 'bg-BG' })); // "5 хиляди"
console.log(f.format(1_000_000, { locale: 'bg-BG' })); // "1 милион"
console.log(f.format(2_000_000, { locale: 'bg-BG' })); // "2 милиона"

// ID
console.log(f.format(1_000, { locale: 'id-ID' })); // "1 ribu"
console.log(f.format(2_000, { locale: 'id-ID' })); // "2 ribu"
console.log(f.format(1_000_000, { locale: 'id-ID' })); // "1 juta"
console.log(f.format(2_000_000, { locale: 'id-ID' })); // "2 juta"
console.log(f.format(1_000_000_000, { locale: 'id-ID' })); // "1 miliar"
console.log(f.format(1_000_000_000_000, { locale: 'id-ID' })); // "1 triliun"
