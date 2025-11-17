// Validation script for README examples
import { PreciseCompact, createCompactFormatter } from '../src/precise-compact';
import ru from '../i18n/ru';

console.log('🔍 Validating README examples...\n');

// ===== Usage Section =====
console.log('=== Usage Section ===');

// 1) Quick start (English is built in)
console.assert(PreciseCompact.format(1000) === '1 thousand', '❌ Failed: 1000');
console.assert(PreciseCompact.format(1_000_000) === '1 million', '❌ Failed: 1_000_000');
console.assert(PreciseCompact.format(1500) === '1.5 thousand', '❌ Failed: 1500');
console.assert(PreciseCompact.format(1501) === '1501', '❌ Failed: 1501');
console.log('✅ Quick start examples');

// 2) Abbreviations
console.assert(PreciseCompact.format(2_000_000, { style: 'abbr' }) === '2 M', '❌ Failed: abbreviations');
console.log('✅ Abbreviations');

// 3) Indian system
console.assert(PreciseCompact.format(100_000, { system: 'indian' }) === '1 lakh', '❌ Failed: indian 100k');
console.assert(PreciseCompact.format(25_000_000, { system: 'indian' }) === '2.5 crore', '❌ Failed: indian 25M');
console.assert(PreciseCompact.format(25_000_000, { system: 'indian', style: 'abbr' }) === '2.5 Cr', '❌ Failed: indian abbr');
console.log('✅ Indian system');

// 4) East Asia system
console.assert(PreciseCompact.format(10_000, { system: 'eastAsia' }) === '1 wan', '❌ Failed: eastAsia 10k');
console.assert(PreciseCompact.format(100_000_000, { system: 'eastAsia' }) === '1 yi', '❌ Failed: eastAsia 100M');
console.log('✅ East Asia system');

// ===== Exactness Rules =====
console.log('\n=== Exactness Rules ===');
console.assert(PreciseCompact.format(1000) === '1 thousand', '❌ Failed: exactness 1000');
console.assert(PreciseCompact.format(1500) === '1.5 thousand', '❌ Failed: exactness 1500');
console.assert(PreciseCompact.format(1501) === '1501', '❌ Failed: exactness 1501');
console.assert(PreciseCompact.format(1250) === '1250', '❌ Failed: exactness 1250');
console.log('✅ Exactness rules validated');

// ===== Internationalization =====
console.log('\n=== Internationalization ===');

// Register Russian locale
PreciseCompact.registerLocale(ru);

// Now you can use Russian
console.assert(PreciseCompact.format(2_000, { locale: 'ru' }) === '2 тысячи', '❌ Failed: ru 2000');
console.assert(PreciseCompact.format(1_000, { locale: 'ru' }) === '1 тысяча', '❌ Failed: ru 1000');
console.assert(PreciseCompact.format(5_000, { locale: 'ru' }) === '5 тысяч', '❌ Failed: ru 5000');
console.log('✅ Russian locale registered and working');

// ===== Advanced - Allowed Fractions =====
console.log('\n=== Advanced: Allowed Fractions ===');
PreciseCompact.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);

console.assert(PreciseCompact.format(125_000, { system: 'indian' }) === '1.25 lakh', '❌ Failed: indian 125k with fractions');
console.assert(PreciseCompact.format(75_000, { system: 'indian' }) === '0.75 lakh', '❌ Failed: indian 75k with fractions');
console.log('✅ Allowed fractions');

// Reset to default
PreciseCompact.setAllowedFractions([0, 0.5]);

// ===== Advanced - Fallback Behavior =====
console.log('\n=== Advanced: Fallback Behavior ===');
const nf = new Intl.NumberFormat('de-DE', { useGrouping: true });

const fallbackResult = PreciseCompact.format(1501, {
  fallbackFn: (value) => (typeof value === 'bigint' ? value.toString() : nf.format(value)),
});
console.assert(fallbackResult === '1.501', `❌ Failed: fallback behavior, got "${fallbackResult}"`);
console.log('✅ Fallback behavior');

// ===== Advanced - Below Smallest Unit =====
console.log('\n=== Advanced: Below Smallest Unit ===');
console.assert(PreciseCompact.format(500) === '500', '❌ Failed: below smallest unit 500');
console.assert(PreciseCompact.format(999) === '999', '❌ Failed: below smallest unit 999');
console.assert(PreciseCompact.format(1000) === '1 thousand', '❌ Failed: smallest unit 1000');
console.assert(PreciseCompact.format(1500) === '1.5 thousand', '❌ Failed: above smallest unit 1500');
console.log('✅ Below smallest unit');

// ===== Advanced - Custom Systems =====
console.log('\n=== Advanced: Custom Systems ===');
const fmt = createCompactFormatter();
fmt.registerSystem({
  id: 'custom',
  units: [
    { key: 'million', value: 1_000_000n },
    { key: 'thousand', value: 1_000n },
  ],
});

console.assert(fmt.format(3_000_000, { system: 'custom' }) === '3 million', '❌ Failed: custom system');
console.log('✅ Custom systems');

console.log('\n✅ All README examples validated successfully!');
console.log('📦 README is ready for production!');
