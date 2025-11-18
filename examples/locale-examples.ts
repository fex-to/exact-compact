/**
 * Examples demonstrating preciseCompact with different locales
 * Run: tsx examples/locale-examples.ts
 * 
 * Covers 11 locales: en-US, ru-RU, de-DE, uk-UA, cs-CZ, hi-IN, zh-CN, ja-JP, ko-KR, ar-SA
 */

import { preciseCompact } from '../src/index';

console.log('='.repeat(80));
console.log('PRECISE COMPACT - LOCALE EXAMPLES');
console.log('='.repeat(80));
console.log();

// ============================================================================
// 🇺🇸 English (United States) - en-US
// ============================================================================
console.log('🇺🇸 ENGLISH (en-US) - Short forms (K, M, B, T)');
console.log('-'.repeat(80));
const enUS = preciseCompact({ locale: 'en-US', compactDisplay: 'short' });
console.log('1,000           →', enUS.format(1000));         // "1K"
console.log('1,500           →', enUS.format(1500));         // "1.5K"
console.log('10,000          →', enUS.format(10000));        // "10K"
console.log('100,000         →', enUS.format(100000));       // "100K"
console.log('1,000,000       →', enUS.format(1000000));      // "1M"
console.log('1,230,000       →', enUS.format(1230000));      // "1.23M"
console.log('1,000,000,000   →', enUS.format(1000000000));   // "1B"
console.log('1,234           →', enUS.format(1234));         // "1,234" (not exact)
console.log('12,345          →', enUS.format(12345));        // "12,345" (not exact)
console.log('1,234,567       →', enUS.format(1234567));      // "1,234,567" (not exact)
console.log();

// ============================================================================
// 🇺🇸 English (United States) - en-US with LONG notation
// ============================================================================
console.log('🇺🇸 ENGLISH (en-US) - Words (thousand, million, billion)');
console.log('-'.repeat(80));
const enUSLong = preciseCompact({ locale: 'en-US', compactDisplay: 'long' });
console.log('1,000           →', enUSLong.format(1000));         // "1 thousand"
console.log('1,500           →', enUSLong.format(1500));         // "1.5 thousand"
console.log('10,000          →', enUSLong.format(10000));        // "10 thousand"
console.log('100,000         →', enUSLong.format(100000));       // "100 thousand"
console.log('1,000,000       →', enUSLong.format(1000000));      // "1 million"
console.log('1,230,000       →', enUSLong.format(1230000));      // "1.23 million"
console.log('10,000,000      →', enUSLong.format(10000000));     // "10 million"
console.log('1,000,000,000   →', enUSLong.format(1000000000));   // "1 billion"
console.log('1,234           →', enUSLong.format(1234));         // "1,234" (not exact)
console.log('1,234,567       →', enUSLong.format(1234567));      // "1,234,567" (not exact)
console.log();

// ============================================================================
// 🇷🇺 Russian (Russia) - ru-RU
// ============================================================================
console.log('🇷🇺 RUSSIAN (ru-RU) - Words (тысяча, миллион, миллиард)');
console.log('-'.repeat(80));
const ruRU = preciseCompact({ locale: 'ru-RU', compactDisplay: 'long' });
console.log('1,000           →', ruRU.format(1000));         // "1 тысяча"
console.log('2,000           →', ruRU.format(2000));         // "2 тысячи"
console.log('5,000           →', ruRU.format(5000));         // "5 тысяч"
console.log('10,000          →', ruRU.format(10000));        // "10 тысяч"
console.log('100,000         →', ruRU.format(100000));       // "100 тысяч"
console.log('1,000,000       →', ruRU.format(1000000));      // "1 миллион"
console.log('2,000,000       →', ruRU.format(2000000));      // "2 миллиона"
console.log('5,000,000       →', ruRU.format(5000000));      // "5 миллионов"
console.log('1,000,000,000   →', ruRU.format(1000000000));   // "1 миллиард"
console.log('1,234           →', ruRU.format(1234));         // "1 234" (not exact)
console.log();

// ============================================================================
// 🇩🇪 German (Germany) - de-DE
// ============================================================================
console.log('🇩🇪 GERMAN (de-DE) - Words (Tausend, Million, Milliarde)');
console.log('-'.repeat(80));
const deDE = preciseCompact({ locale: 'de-DE', compactDisplay: 'long' });
console.log('1.000           →', deDE.format(1000));         // "1 Tausend"
console.log('1.500           →', deDE.format(1500));         // "1,5 Tausend"
console.log('10.000          →', deDE.format(10000));        // "10 Tausend"
console.log('100.000         →', deDE.format(100000));       // "100 Tausend"
console.log('1.000.000       →', deDE.format(1000000));      // "1 Million"
console.log('1.230.000       →', deDE.format(1230000));      // "1,23 Millionen"
console.log('10.000.000      →', deDE.format(10000000));     // "10 Millionen"
console.log('1.000.000.000   →', deDE.format(1000000000));   // "1 Milliarde"
console.log('1.234           →', deDE.format(1234));         // "1.234" (not exact)
console.log('1.234.567       →', deDE.format(1234567));      // "1.234.567" (not exact)
console.log();

// ============================================================================
// 🇺🇦 Ukrainian (Ukraine) - uk-UA
// ============================================================================
console.log('🇺🇦 UKRAINIAN (uk-UA) - Words (тисяча, мільйон, мільярд)');
console.log('-'.repeat(80));
const ukUA = preciseCompact({ locale: 'uk-UA', compactDisplay: 'long' });
console.log('1 000           →', ukUA.format(1000));         // "1 тисяча"
console.log('2 000           →', ukUA.format(2000));         // "2 тисячі"
console.log('5 000           →', ukUA.format(5000));         // "5 тисяч"
console.log('10 000          →', ukUA.format(10000));        // "10 тисяч"
console.log('100 000         →', ukUA.format(100000));       // "100 тисяч"
console.log('1 000 000       →', ukUA.format(1000000));      // "1 мільйон"
console.log('2 000 000       →', ukUA.format(2000000));      // "2 мільйони"
console.log('5 000 000       →', ukUA.format(5000000));      // "5 мільйонів"
console.log('1 000 000 000   →', ukUA.format(1000000000));   // "1 мільярд"
console.log('1 234           →', ukUA.format(1234));         // "1 234" (not exact)
console.log();

// ============================================================================
// 🇨🇿 Czech (Czech Republic) - cs-CZ
// ============================================================================
console.log('🇨🇿 CZECH (cs-CZ) - Short forms (tis., mil., mld.)');
console.log('-'.repeat(80));
const csCZ = preciseCompact({ locale: 'cs-CZ', compactDisplay: 'short' });
console.log('1 000           →', csCZ.format(1000));         // "1 tis."
console.log('1 500           →', csCZ.format(1500));         // "1,5 tis."
console.log('10 000          →', csCZ.format(10000));        // "10 tis."
console.log('100 000         →', csCZ.format(100000));       // "100 tis."
console.log('1 000 000       →', csCZ.format(1000000));      // "1 mil."
console.log('1 230 000       →', csCZ.format(1230000));      // "1,23 mil."
console.log('10 000 000      →', csCZ.format(10000000));     // "10 mil."
console.log('1 000 000 000   →', csCZ.format(1000000000));   // "1 mld."
console.log('1 234           →', csCZ.format(1234));         // "1 234" (not exact)
console.log('1 234 567       →', csCZ.format(1234567));      // "1 234 567" (not exact)
console.log();

// ============================================================================
// 🇮🇳 Hindi (India) - hi-IN - Indian numbering system
// ============================================================================
console.log('🇮🇳 HINDI (hi-IN) - Indian system (हज़ार, लाख, करोड़)');
console.log('-'.repeat(80));
const hiIN = preciseCompact({ locale: 'hi-IN', compactDisplay: 'long' });
console.log('1,000           →', hiIN.format(1000));         // "1 हज़ार"
console.log('10,000          →', hiIN.format(10000));        // "10 हज़ार"
console.log('100,000 (lakh)  →', hiIN.format(100000));       // "1 लाख"
console.log('150,000         →', hiIN.format(150000));       // "1.5 लाख"
console.log('1,000,000       →', hiIN.format(1000000));      // "10 लाख"
console.log('10,000,000      →', hiIN.format(10000000));     // "1 करोड़"
console.log('12,300,000      →', hiIN.format(12300000));     // "1.23 करोड़"
console.log('100,000,000     →', hiIN.format(100000000));    // "10 करोड़"
console.log('1,234           →', hiIN.format(1234));         // "1,234" (not exact)
console.log('1,23,456        →', hiIN.format(123456));       // "1,23,456" (not exact)
console.log();

// ============================================================================
// 🇨🇳 Chinese (China) - zh-CN - Chinese numbering system
// ============================================================================
console.log('🇨🇳 CHINESE (zh-CN) - Chinese system (千, 万, 亿)');
console.log('-'.repeat(80));
const zhCN = preciseCompact({ locale: 'zh-CN', compactDisplay: 'short' });
console.log('1,000           →', zhCN.format(1000));         // "1000" or "1千"
console.log('10,000 (wan)    →', zhCN.format(10000));        // "1万"
console.log('15,000          →', zhCN.format(15000));        // "1.5万"
console.log('100,000         →', zhCN.format(100000));       // "10万"
console.log('1,000,000       →', zhCN.format(1000000));      // "100万"
console.log('10,000,000      →', zhCN.format(10000000));     // "1000万"
console.log('100,000,000 (yi)→', zhCN.format(100000000));    // "1亿"
console.log('123,000,000     →', zhCN.format(123000000));    // "1.23亿"
console.log('1,234           →', zhCN.format(1234));         // "1,234" (not exact)
console.log('12,345          →', zhCN.format(12345));        // "12,345" (not exact)
console.log();

// ============================================================================
// 🇯🇵 Japanese (Japan) - ja-JP - Japanese numbering system
// ============================================================================
console.log('🇯🇵 JAPANESE (ja-JP) - Japanese system (千, 万, 億)');
console.log('-'.repeat(80));
const jaJP = preciseCompact({ locale: 'ja-JP', compactDisplay: 'short' });
console.log('1,000           →', jaJP.format(1000));         // "1000" or "1千"
console.log('10,000 (man)    →', jaJP.format(10000));        // "1万"
console.log('15,000          →', jaJP.format(15000));        // "1.5万"
console.log('100,000         →', jaJP.format(100000));       // "10万"
console.log('1,000,000       →', jaJP.format(1000000));      // "100万"
console.log('10,000,000      →', jaJP.format(10000000));     // "1000万"
console.log('100,000,000 (oku)→', jaJP.format(100000000));   // "1億"
console.log('123,000,000     →', jaJP.format(123000000));    // "1.23億"
console.log('1,234           →', jaJP.format(1234));         // "1,234" (not exact)
console.log('12,345          →', jaJP.format(12345));        // "12,345" (not exact)
console.log();

// ============================================================================
// 🇰🇷 Korean (South Korea) - ko-KR - Korean numbering system
// ============================================================================
console.log('🇰🇷 KOREAN (ko-KR) - Korean system (천, 만, 억)');
console.log('-'.repeat(80));
const koKR = preciseCompact({ locale: 'ko-KR', compactDisplay: 'short' });
console.log('1,000           →', koKR.format(1000));         // "1천"
console.log('10,000 (man)    →', koKR.format(10000));        // "1만"
console.log('15,000          →', koKR.format(15000));        // "1.5만"
console.log('100,000         →', koKR.format(100000));       // "10만"
console.log('1,000,000       →', koKR.format(1000000));      // "100만"
console.log('10,000,000      →', koKR.format(10000000));     // "1000만"
console.log('100,000,000 (eok)→', koKR.format(100000000));   // "1억"
console.log('123,000,000     →', koKR.format(123000000));    // "1.23억"
console.log('1,234           →', koKR.format(1234));         // "1,234" (not exact)
console.log('12,345          →', koKR.format(12345));        // "12,345" (not exact)
console.log();

// ============================================================================
// 🇸🇦 Arabic (Saudi Arabia) - ar-SA
// ============================================================================
console.log('🇸🇦 ARABIC (ar-SA) - Words (ألف, مليون, مليار)');
console.log('-'.repeat(80));
const arSA = preciseCompact({ locale: 'ar-SA', compactDisplay: 'long' });
console.log('1,000           →', arSA.format(1000));         // "١ ألف"
console.log('1,500           →', arSA.format(1500));         // "١٫٥ ألف"
console.log('10,000          →', arSA.format(10000));        // "١٠ آلاف"
console.log('100,000         →', arSA.format(100000));       // "١٠٠ ألف"
console.log('1,000,000       →', arSA.format(1000000));      // "١ مليون"
console.log('1,230,000       →', arSA.format(1230000));      // "١٫٢٣ مليون"
console.log('10,000,000      →', arSA.format(10000000));     // "١٠ ملايين"
console.log('1,000,000,000   →', arSA.format(1000000000));   // "١ مليار"
console.log('1,234           →', arSA.format(1234));         // "١٬٢٣٤" (not exact)
console.log('1,234,567       →', arSA.format(1234567));      // "١٬٢٣٤٬٥٦٧" (not exact)
console.log();

// ============================================================================
// 💰 CURRENCY EXAMPLES
// ============================================================================
console.log('💰 CURRENCY EXAMPLES');
console.log('-'.repeat(80));

// USD
const usd = preciseCompact({ locale: 'en-US', currency: 'USD' });
console.log('USD 1,000       →', usd.format(1000));          // "$1K"
console.log('USD 1,500       →', usd.format(1500));          // "$1.5K"
console.log('USD 1,234       →', usd.format(1234));          // "$1,234.00"
console.log('USD 1,000,000   →', usd.format(1000000));       // "$1M"

// EUR (Germany)
const eur = preciseCompact({ locale: 'de-DE', currency: 'EUR' });
console.log('EUR 1.000       →', eur.format(1000));          // "1 Tsd. €"
console.log('EUR 1.500       →', eur.format(1500));          // "1,5 Tsd. €"
console.log('EUR 1.234       →', eur.format(1234));          // "1.234,00 €"

// INR (India)
const inr = preciseCompact({ locale: 'hi-IN', currency: 'INR' });
console.log('INR 1,00,000    →', inr.format(100000));        // "₹1 लाख"
console.log('INR 1,50,000    →', inr.format(150000));        // "₹1.5 लाख"
console.log('INR 1,23,456    →', inr.format(123456));        // "₹1,23,456.00"

// CNY (China)
const cny = preciseCompact({ locale: 'zh-CN', currency: 'CNY' });
console.log('CNY 10,000      →', cny.format(10000));         // "¥1万"
console.log('CNY 1,00,00,000 →', cny.format(100000000));     // "¥1亿"

// JPY (Japan)
const jpy = preciseCompact({ locale: 'ja-JP', currency: 'JPY' });
console.log('JPY 10,000      →', jpy.format(10000));         // "￥1万"
console.log('JPY 1,00,00,000 →', jpy.format(100000000));     // "￥1億"
console.log();

console.log('='.repeat(80));
console.log('✨ All examples completed!');
console.log('='.repeat(80));
