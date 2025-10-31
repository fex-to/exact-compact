// comments in English only

import fs from 'node:fs';
import path from 'node:path';

/**
 * This generator writes 50 locale packs into ./i18n/*.ts
 * Each file exports a default LocalePack for your library.
 *
 * NOTE:
 * - We emit morphology maps (zero/one/two/few/many/other) where it makes sense.
 * - For invariant languages we emit simple strings.
 * - Abbreviations are pragmatic and may be tuned later.
 */

type UnitKey = 'thousand' | 'million' | 'billion' | 'trillion';

type Morph =
  | string
  | {
      zero?: string;
      one?: string;
      two?: string;
      few?: string;
      many?: string;
      other?: string;
    };

type LabelNode = {
  words: Morph;
  abbr: Morph;
};

type Labels = Partial<Record<UnitKey, LabelNode>>;

type LocalePackApprox = {
  locale: string;
  labels: Labels;
  rules?: {
    rtl?: boolean;
    joiner?: '' | ' ' | '\u00A0' | '\u202F';
    unitOrder?: 'after' | 'before';
    numberLocale?: string;
    numberOptions?: Intl.NumberFormatOptions;
  };
};

// ---------- helpers to compose morphology nodes ----------

function w(words: Morph, abbr: Morph): LabelNode {
  return { words, abbr };
}

function inv(word: string, abbr: string = word): LabelNode {
  // invariant (no plural changes)
  return { words: word, abbr };
}

function oneOther(one: string, other: string, abbr = other): LabelNode {
  return { words: { one, other }, abbr: { other: abbr } };
}

function slavic3(one: string, few: string, many: string, abbr: string): LabelNode {
  return { words: { one, few, many, other: few }, abbr: { other: abbr } };
}

function arabic6(
  one: string,
  two: string,
  few: string,
  many: string,
  other: string,
  abbr: string,
): LabelNode {
  return { words: { zero: other, one, two, few, many, other }, abbr: { other: abbr } };
}

// ---------- LOCALES DATA (50) ----------
// Note: These are pragmatic lexical choices for units thousand/million/billion/trillion.
// Some locales traditionally use long-scale; here we align to your library units.
// Tune later if you need domain-accurate naming standards.

const LOCALES: LocalePackApprox[] = [
  // 1 English
  {
    locale: 'en',
    labels: {
      thousand: inv('thousand', 'K'),
      million: inv('million', 'M'),
      billion: inv('billion', 'B'),
      trillion: inv('trillion', 'T'),
    },
  },

  // 2 Chinese (Simplified)
  {
    locale: 'zh-CN',
    labels: {
      thousand: inv('千', '千'),
      million: inv('百万', '百万'),
      billion: inv('十亿', '十亿'),
      trillion: inv('万亿', '万亿'),
    },
    rules: { joiner: '', numberLocale: 'zh-CN' },
  },

  // 3 Chinese (Traditional)
  {
    locale: 'zh-TW',
    labels: {
      thousand: inv('千', '千'),
      million: inv('百萬', '百萬'),
      billion: inv('十億', '十億'),
      trillion: inv('兆', '兆'),
    },
    rules: { joiner: '', numberLocale: 'zh-TW' },
  },

  // 4 Spanish
  {
    locale: 'es',
    labels: {
      thousand: inv('mil', 'k'),
      million: oneOther('millón', 'millones', 'M'),
      billion: oneOther('billón', 'billones', 'Bn'),
      trillion: oneOther('trillón', 'trillones', 'Tn'),
    },
  },

  // 5 Arabic
  {
    locale: 'ar',
    labels: {
      thousand: arabic6('ألف', 'ألفان', 'آلاف', 'ألف', 'ألف', 'أ'),
      million: arabic6('مليون', 'مليونان', 'ملايين', 'مليون', 'مليون', 'م'),
      billion: arabic6('مليار', 'ملياران', 'مليارات', 'مليار', 'مليار', 'ملي'),
      trillion: arabic6('تريليون', 'تريليونان', 'تريليونات', 'تريليون', 'تريليون', 'تر'),
    },
    rules: { rtl: true },
  },

  // 6 Hindi
  {
    locale: 'hi',
    labels: {
      thousand: inv('हज़ार', 'ह'),
      million: inv('मिलियन', 'मि'),
      billion: inv('बिलियन', 'बि'),
      trillion: inv('ट्रिलियन', 'ट्रि'),
    },
    rules: { numberLocale: 'hi' },
  },

  // 7 Portuguese (Brazil)
  {
    locale: 'pt-BR',
    labels: {
      thousand: inv('mil', 'mil'),
      million: oneOther('milhão', 'milhões', 'mi'),
      billion: oneOther('bilhão', 'bilhões', 'bi'),
      trillion: oneOther('trilhão', 'trilhões', 'tri'),
    },
  },

  // 8 Portuguese (Portugal)
  {
    locale: 'pt-PT',
    labels: {
      thousand: inv('mil', 'mil'),
      million: oneOther('milhão', 'milhões', 'M'),
      billion: oneOther('mil milhões', 'mil milhões', 'MilM'), // pragmatic
      trillion: oneOther('bilião', 'biliões', 'Bl'),
    },
  },

  // 9 Bengali
  {
    locale: 'bn',
    labels: {
      thousand: inv('হাজার', 'হা'),
      million: inv('মিলিয়ন', 'মি'),
      billion: inv('বিলিয়ন', 'বি'),
      trillion: inv('ট্রিলিয়ন', 'ট্রি'),
    },
  },

  // 10 Russian
  {
    locale: 'ru',
    labels: {
      thousand: slavic3('тысяча', 'тысячи', 'тысяч', 'тыс.'),
      million: slavic3('миллион', 'миллиона', 'миллионов', 'млн'),
      billion: slavic3('миллиард', 'миллиарда', 'миллиардов', 'млрд'),
      trillion: slavic3('триллион', 'триллиона', 'триллионов', 'трлн'),
    },
    rules: { numberLocale: 'ru-RU' },
  },

  // 11 Japanese
  {
    locale: 'ja',
    labels: {
      thousand: inv('千', '千'),
      million: inv('百万', '百万'),
      billion: inv('十億', '十億'),
      trillion: inv('兆', '兆'),
    },
    rules: { joiner: '' },
  },

  // 12 German
  {
    locale: 'de',
    labels: {
      thousand: inv('tausend', 'Tsd.'),
      million: oneOther('Million', 'Millionen', 'Mio.'),
      billion: oneOther('Milliarde', 'Milliarden', 'Mrd.'),
      trillion: oneOther('Billion', 'Billionen', 'Bio.'),
    },
  },

  // 13 French
  {
    locale: 'fr',
    labels: {
      thousand: inv('mille', 'k'),
      million: oneOther('million', 'millions', 'M'),
      billion: oneOther('milliard', 'milliards', 'Md'),
      trillion: oneOther('billion', 'billions', 'Bn'),
    },
    rules: { joiner: '\u202F' }, // thin space
  },

  // 14 Indonesian
  {
    locale: 'id-ID',
    labels: {
      thousand: inv('ribu', 'rb'),
      million: inv('juta', 'jt'),
      billion: inv('miliar', 'M'),
      trillion: inv('triliun', 'T'),
    },
  },

  // 15 Urdu
  {
    locale: 'ur',
    labels: {
      thousand: inv('ہزار', 'ہ'),
      million: inv('ملین', 'مل'),
      billion: inv('بلین', 'بل'),
      trillion: inv('ٹریلین', 'ٹر'),
    },
    rules: { rtl: true },
  },

  // 16 Turkish
  {
    locale: 'tr',
    labels: {
      thousand: inv('bin', 'B'),
      million: inv('milyon', 'Mn'),
      billion: inv('milyar', 'Mr'),
      trillion: inv('trilyon', 'Tr'),
    },
  },

  // 17 Vietnamese
  {
    locale: 'vi',
    labels: {
      thousand: inv('nghìn', 'N'),
      million: inv('triệu', 'Tr'),
      billion: inv('tỷ', 'Tỷ'),
      trillion: inv('nghìn tỷ', 'N.Tỷ'),
    },
  },

  // 18 Korean
  {
    locale: 'ko',
    labels: {
      thousand: inv('천', '천'),
      million: inv('백만', '백만'),
      billion: inv('십억', '십억'),
      trillion: inv('조', '조'),
    },
    rules: { joiner: '' },
  },

  // 19 Italian
  {
    locale: 'it',
    labels: {
      thousand: inv('mille', 'k'),
      million: oneOther('milione', 'milioni', 'M'),
      billion: oneOther('miliardo', 'miliardi', 'Mrd'),
      trillion: oneOther('bilione', 'bilioni', 'Bl'),
    },
  },

  // 20 Persian
  {
    locale: 'fa',
    labels: {
      thousand: inv('هزار', 'هزار'),
      million: inv('میلیون', 'می'),
      billion: inv('میلیارد', 'میلیا'),
      trillion: inv('تریلیون', 'تر'),
    },
    rules: { rtl: true },
  },

  // 21 Polish
  {
    locale: 'pl',
    labels: {
      thousand: slavic3('tysiąc', 'tysiące', 'tysięcy', 'tys.'),
      million: slavic3('milion', 'miliony', 'milionów', 'mln'),
      billion: slavic3('miliard', 'miliardy', 'miliardów', 'mld'),
      trillion: slavic3('bilion', 'biliony', 'bilionów', 'bln'),
    },
  },

  // 22 Ukrainian
  {
    locale: 'uk',
    labels: {
      thousand: slavic3('тисяча', 'тисячі', 'тисяч', 'тис.'),
      million: slavic3('мільйон', 'мільйона', 'мільйонів', 'млн'),
      billion: slavic3('мільярд', 'мільярда', 'мільярдів', 'млрд'),
      trillion: slavic3('трильйон', 'трильйона', 'трильйонів', 'трлн'),
    },
  },

  // 23 Dutch
  {
    locale: 'nl',
    labels: {
      thousand: inv('duizend', 'dzd'),
      million: oneOther('miljoen', 'miljoenen', 'M'),
      billion: oneOther('miljard', 'miljarden', 'Md'),
      trillion: oneOther('biljoen', 'biljoenen', 'Bl'),
    },
  },

  // 24 Thai
  {
    locale: 'th',
    labels: {
      thousand: inv('พัน', 'พัน'),
      million: inv('ล้าน', 'ล'),
      billion: inv('พันล้าน', 'พ.ล'),
      trillion: inv('ล้านล้าน', 'ล.ล'),
    },
  },

  // 25 Filipino (Tagalog)
  {
    locale: 'fil-PH',
    labels: {
      thousand: inv('libo', 'k'),
      million: inv('milyon', 'M'),
      billion: inv('bilyon', 'Bn'),
      trillion: inv('trilyon', 'Tn'),
    },
  },

  // 26 Malay
  {
    locale: 'ms-MY',
    labels: {
      thousand: inv('ribu', 'rb'),
      million: inv('juta', 'jt'),
      billion: inv('bilion', 'bl'),
      trillion: inv('trilion', 'tl'),
    },
  },

  // 27 Romanian
  {
    locale: 'ro',
    labels: {
      thousand: oneOther('mie', 'mii', 'mii'),
      million: oneOther('milion', 'milioane', 'mil.'),
      billion: oneOther('miliard', 'miliarde', 'mld.'),
      trillion: oneOther('bilion', 'bilioane', 'bln.'),
    },
  },

  // 28 Greek
  {
    locale: 'el',
    labels: {
      thousand: oneOther('χίλια', 'χιλιάδες', 'χιλ.'),
      million: oneOther('εκατομμύριο', 'εκατομμύρια', 'εκ.'),
      billion: oneOther('δισεκατομμύριο', 'δισεκατομμύρια', 'δισ.'),
      trillion: oneOther('τρισεκατομμύριο', 'τρισεκατομμύρια', 'τρισ.'),
    },
  },

  // 29 Czech
  {
    locale: 'cs',
    labels: {
      thousand: slavic3('tisíc', 'tisíce', 'tisíců', 'tis.'),
      million: slavic3('milion', 'miliony', 'milionů', 'mil.'),
      billion: slavic3('miliarda', 'miliardy', 'miliard', 'mld.'),
      trillion: slavic3('bilion', 'biliony', 'bilionů', 'bln.'),
    },
  },

  // 30 Swedish
  {
    locale: 'sv',
    labels: {
      thousand: inv('tusen', 'tus'),
      million: oneOther('miljon', 'miljoner', 'mn'),
      billion: oneOther('miljard', 'miljarder', 'md'),
      trillion: oneOther('biljon', 'biljoner', 'bln'),
    },
  },

  // 31 Hungarian
  {
    locale: 'hu',
    labels: {
      thousand: inv('ezer', 'e'),
      million: inv('millió', 'M'),
      billion: inv('milliárd', 'Md'),
      trillion: inv('billió', 'Bl'),
    },
  },

  // 32 Hebrew
  {
    locale: 'he',
    labels: {
      thousand: inv('אלף', 'אלף'),
      million: inv('מיליון', 'מל׳'),
      billion: inv('מיליארד', 'מליא׳'),
      trillion: inv('טריליון', 'טר׳'),
    },
    rules: { rtl: true },
  },

  // 33 Danish
  {
    locale: 'da',
    labels: {
      thousand: inv('tusind', 'tus'),
      million: oneOther('million', 'millioner', 'mio.'),
      billion: oneOther('milliard', 'milliarder', 'mia.'),
      trillion: oneOther('billion', 'billioner', 'bio.'),
    },
  },

  // 34 Finnish
  {
    locale: 'fi',
    labels: {
      thousand: inv('tuhat', 'tuh'),
      million: oneOther('miljoona', 'miljoonat', 'milj.'),
      billion: oneOther('miljardi', 'miljardit', 'mrd.'),
      trillion: oneOther('biljoona', 'biljoonat', 'blj.'),
    },
  },

  // 35 Norwegian (Bokmål)
  {
    locale: 'nb-NO',
    labels: {
      thousand: inv('tusen', 'tus'),
      million: oneOther('million', 'millioner', 'mill.'),
      billion: oneOther('milliard', 'milliarder', 'mrd.'),
      trillion: oneOther('billion', 'billioner', 'bio.'),
    },
  },

  // 36 Slovak
  {
    locale: 'sk',
    labels: {
      thousand: slavic3('tisíc', 'tisíce', 'tisícov', 'tis.'),
      million: slavic3('milión', 'milióny', 'miliónov', 'mil.'),
      billion: slavic3('miliarda', 'miliardy', 'miliárd', 'mld.'),
      trillion: slavic3('bilión', 'bilióny', 'biliónov', 'bln.'),
    },
  },

  // 37 Bulgarian
  {
    locale: 'bg',
    labels: {
      thousand: oneOther('хиляда', 'хиляди', 'хил.'),
      million: oneOther('милион', 'милиона', 'млн.'),
      billion: oneOther('милиард', 'милиарда', 'млрд.'),
      trillion: oneOther('трилион', 'трилиона', 'трлн.'),
    },
  },

  // 38 Serbian (Cyrillic)
  {
    locale: 'sr',
    labels: {
      thousand: slavic3('хиљада', 'хиљаде', 'хиљада', 'хиљ.'),
      million: slavic3('милион', 'милиона', 'милиона', 'млн.'),
      billion: slavic3('милијарда', 'милијарде', 'милијарди', 'млрд.'),
      trillion: slavic3('трилион', 'трилиона', 'трилиона', 'трлн.'),
    },
  },

  // 39 Croatian
  {
    locale: 'hr',
    labels: {
      thousand: slavic3('tisuća', 'tisuće', 'tisuća', 'tis.'),
      million: slavic3('milijun', 'milijuna', 'milijuna', 'mil.'),
      billion: slavic3('milijarda', 'milijarde', 'milijardi', 'mld.'),
      trillion: slavic3('bilijun', 'bilijuna', 'bilijuna', 'bln.'),
    },
  },

  // 40 Lithuanian
  {
    locale: 'lt',
    labels: {
      thousand: oneOther('tūkstantis', 'tūkstančiai', 'tūkst.'),
      million: oneOther('milijonas', 'milijonai', 'mln.'),
      billion: oneOther('milijardas', 'milijardai', 'mlrd.'),
      trillion: oneOther('trilijonas', 'trilijonai', 'trln.'),
    },
  },

  // 41 Latvian
  {
    locale: 'lv',
    labels: {
      thousand: oneOther('tūkstotis', 'tūkstoši', 'tūkst.'),
      million: oneOther('miljons', 'miljoni', 'mln.'),
      billion: oneOther('miljards', 'miljardi', 'mlrd.'),
      trillion: oneOther('triljons', 'triljoni', 'trln.'),
    },
  },

  // 42 Estonian
  {
    locale: 'et',
    labels: {
      thousand: inv('tuhat', 'tuh'),
      million: oneOther('miljon', 'miljonit', 'mln'),
      billion: oneOther('miljard', 'miljardit', 'mld'),
      trillion: oneOther('biljon', 'biljonit', 'bln'),
    },
  },

  // 43 Slovenian
  {
    locale: 'sl',
    labels: {
      thousand: oneOther('tisoč', 'tisoči', 'tis.'),
      million: oneOther('milijon', 'milijoni', 'mio.'),
      billion: oneOther('milijarda', 'milijarde', 'mrd.'),
      trillion: oneOther('bilijon', 'bilijoni', 'bln.'),
    },
  },

  // 44 Catalan
  {
    locale: 'ca',
    labels: {
      thousand: inv('mil', 'k'),
      million: oneOther('milió', 'milions', 'M'),
      billion: oneOther('bilió', 'bilions', 'Bn'),
      trillion: oneOther('trilió', 'trilions', 'Tn'),
    },
  },

  // 45 Tamil
  {
    locale: 'ta',
    labels: {
      thousand: inv('ஆயிரம்', 'ஆ'),
      million: inv('மில்லியன்', 'மி'),
      billion: inv('பில்லியன்', 'பி'),
      trillion: inv('ட்ரில்லியன்', 'ட்ரி'),
    },
  },

  // 46 Telugu
  {
    locale: 'te',
    labels: {
      thousand: inv('వేలు', 'వే'),
      million: inv('మిలియన్', 'మి'),
      billion: inv('బిలియన్', 'బి'),
      trillion: inv('ట్రిలియన్', 'ట్రి'),
    },
  },

  // 47 Marathi
  {
    locale: 'mr',
    labels: {
      thousand: inv('हजार', 'ह'),
      million: inv('दशलक्ष', 'द'),
      billion: inv('अब्ज', 'अ'),
      trillion: inv('खर्व', 'ख'),
    },
  },

  // 48 Gujarati
  {
    locale: 'gu',
    labels: {
      thousand: inv('હજાર', 'હ'),
      million: inv('મિલિયન', 'મિ'),
      billion: inv('બિલિયન', 'બિ'),
      trillion: inv('ટ્રિલિયન', 'ટ્રિ'),
    },
  },

  // 49 Kannada
  {
    locale: 'kn',
    labels: {
      thousand: inv('ಸಾವಿರ', 'ಸಾ'),
      million: inv('ಮಿಲಿಯನ್', 'ಮಿ'),
      billion: inv('ಬಿಲಿಯನ್', 'ಬಿ'),
      trillion: inv('ಟ್ರಿಲಿಯನ್', 'ಟ್ರಿ'),
    },
  },

  // 50 Swahili
  {
    locale: 'sw',
    labels: {
      thousand: inv('elfu', 'elf'),
      million: inv('milioni', 'M'),
      billion: inv('bilioni', 'Bn'),
      trillion: inv('trilioni', 'Tn'),
    },
  },
];

// ---------- writer ----------

const OUT_DIR = path.resolve(process.cwd(), 'i18n');

function fileHeader(locale: string) {
  return `// comments in English only
// Auto-generated by scripts/generate-locales.ts
import type { LocalePack } from '../src/precise-compact';

`;
}

function emitPack(p: LocalePackApprox): string {
  // We cast to any because your runtime supports morphology maps,
  // while the compile-time type may declare words/abbr as string.
  const body = `const pack = ${JSON.stringify(p, null, 2)} as any as LocalePack;

export default pack;
`;
  // JSON.stringify escapes \u202F etc correctly.
  return body;
}

function writePacks() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const p of LOCALES) {
    const code = fileHeader(p.locale) + emitPack(p);
    const target = path.join(OUT_DIR, `${p.locale}.ts`);
    fs.writeFileSync(target, code, 'utf8');
  }
}

function safeVar(tag: string) {
  return tag.replace(/[^A-Za-z0-9_]/g, '_').replace(/^(\d)/, '_$1');
}

// run
writePacks();

console.log(`✔ Generated ${LOCALES.length} locale packs into ./i18n`);
