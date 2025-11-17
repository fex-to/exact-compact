// MIT License
// Test file to verify correct formatting behavior for various value variations

import { describe, expect, it, beforeEach } from 'vitest';

import { createCompactFormatter } from '../src/precise-compact';

describe('Precision variations with recommended fractions', () => {
  let fmt: ReturnType<typeof createCompactFormatter>;

  beforeEach(() => {
    fmt = createCompactFormatter();
    // Recommended fractions for clean output
    fmt.setAllowedFractions([0, 0.25, 0.5, 0.75]);
  });

  it('should format exact multiples correctly', () => {
    const cases = [
      // Exact millions
      { value: 1_000_000, expected: '1 million' },
      { value: 2_000_000, expected: '2 million' },
      { value: 3_000_000, expected: '3 million' },
      { value: 5_000_000, expected: '5 million' },
      { value: 10_000_000, expected: '10 million' },

      // Exact millions with 0.25 fraction
      { value: 1_250_000, expected: '1.25 million' },
      { value: 2_250_000, expected: '2.25 million' },
      { value: 3_250_000, expected: '3.25 million' },

      // Exact millions with 0.5 fraction
      { value: 1_500_000, expected: '1.5 million' },
      { value: 2_500_000, expected: '2.5 million' },
      { value: 3_500_000, expected: '3.5 million' },
      { value: 4_500_000, expected: '4.5 million' },

      // Exact millions with 0.75 fraction
      { value: 1_750_000, expected: '1.75 million' },
      { value: 2_750_000, expected: '2.75 million' },
      { value: 3_750_000, expected: '3.75 million' },
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback to thousands for non-exact million values', () => {
    const cases = [
      // Not exact millions, but exact thousands - formats as thousands
      { value: 1_299_000, expected: '1299 thousand' }, // 1.299M not allowed, but 1299K exact
      { value: 2_341_000, expected: '2341 thousand' }, // 2.341M not allowed, but 2341K exact
      { value: 1_100_000, expected: '1100 thousand' }, // 1.1M not allowed, but 1100K exact
      { value: 1_200_000, expected: '1200 thousand' }, // 1.2M not allowed, but 1200K exact
      { value: 1_333_000, expected: '1333 thousand' }, // 1.333M not allowed, but 1333K exact
      { value: 1_450_000, expected: '1450 thousand' }, // 1.45M not allowed, but 1450K exact
      { value: 1_600_000, expected: '1600 thousand' }, // 1.6M not allowed, but 1600K exact
      { value: 1_789_000, expected: '1789 thousand' }, // 1.789M not allowed, but 1789K exact
      { value: 1_850_000, expected: '1850 thousand' }, // 1.85M not allowed, but 1850K exact
      { value: 1_999_000, expected: '1999 thousand' }, // 1.999M not allowed, but 1999K exact

      // More variations
      { value: 2_100_000, expected: '2100 thousand' }, // 2.1M not allowed, but 2100K exact
      { value: 2_150_000, expected: '2150 thousand' }, // 2.15M not allowed, but 2150K exact
      { value: 2_222_000, expected: '2222 thousand' }, // 2.222M not allowed, but 2222K exact
      { value: 2_300_000, expected: '2300 thousand' }, // 2.3M not allowed, but 2300K exact
      { value: 2_400_000, expected: '2400 thousand' }, // 2.4M not allowed, but 2400K exact
      { value: 2_550_000, expected: '2550 thousand' }, // 2.55M not allowed, but 2550K exact
      { value: 2_600_000, expected: '2600 thousand' }, // 2.6M not allowed, but 2600K exact
      { value: 2_700_000, expected: '2700 thousand' }, // 2.7M not allowed, but 2700K exact
      { value: 2_800_000, expected: '2800 thousand' }, // 2.8M not allowed, but 2800K exact
      { value: 2_900_000, expected: '2900 thousand' }, // 2.9M not allowed, but 2900K exact

      { value: 3_100_000, expected: '3100 thousand' }, // 3.1M not allowed, but 3100K exact
      { value: 3_333_000, expected: '3333 thousand' }, // 3.333M not allowed, but 3333K exact
      { value: 3_456_000, expected: '3456 thousand' }, // 3.456M not allowed, but 3456K exact
      { value: 3_600_000, expected: '3600 thousand' }, // 3.6M not allowed, but 3600K exact
      { value: 3_750_001, expected: '3750001' }, // not exact (raw fallback)
      { value: 3_800_000, expected: '3800 thousand' }, // 3.8M not allowed, but 3800K exact
      { value: 3_900_000, expected: '3900 thousand' }, // 3.9M not allowed, but 3900K exact

      { value: 4_100_000, expected: '4100 thousand' }, // 4.1M not allowed, but 4100K exact
      { value: 4_200_000, expected: '4200 thousand' }, // 4.2M not allowed, but 4200K exact
      { value: 4_300_000, expected: '4300 thousand' }, // 4.3M not allowed, but 4300K exact
      { value: 4_444_000, expected: '4444 thousand' }, // 4.444M not allowed, but 4444K exact
      { value: 4_600_000, expected: '4600 thousand' }, // 4.6M not allowed, but 4600K exact
      { value: 4_700_000, expected: '4700 thousand' }, // 4.7M not allowed, but 4700K exact
      { value: 4_800_000, expected: '4800 thousand' }, // 4.8M not allowed, but 4800K exact
      { value: 4_900_000, expected: '4900 thousand' }, // 4.9M not allowed, but 4900K exact

      { value: 5_123_000, expected: '5123 thousand' }, // 5.123M not allowed, but 5123K exact
      { value: 5_250_001, expected: '5250001' }, // not exact (raw fallback)
      { value: 5_555_000, expected: '5555 thousand' }, // 5.555M not allowed, but 5555K exact
      { value: 5_678_000, expected: '5678 thousand' }, // 5.678M not allowed, but 5678K exact
      { value: 5_900_000, expected: '5900 thousand' }, // 5.9M not allowed, but 5900K exact
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should format exact thousands correctly', () => {
    const cases = [
      // Exact thousands
      { value: 1_000, expected: '1 thousand' },
      { value: 2_000, expected: '2 thousand' },
      { value: 5_000, expected: '5 thousand' },
      { value: 10_000, expected: '10 thousand' },
      { value: 100_000, expected: '100 thousand' },
      { value: 500_000, expected: '0.5 million' }, // 500K = 0.5M (0.5 allowed)
      { value: 999_000, expected: '999 thousand' },

      // Thousands with 0.5 fraction
      { value: 1_500, expected: '1.5 thousand' },
      { value: 2_500, expected: '2.5 thousand' },
      { value: 10_500, expected: '10.5 thousand' },
      { value: 500_500, expected: '500.5 thousand' },

      // Thousands with 0.25 fraction
      { value: 1_250, expected: '1.25 thousand' },
      { value: 2_250, expected: '2.25 thousand' },

      // Thousands with 0.75 fraction
      { value: 1_750, expected: '1.75 thousand' },
      { value: 2_750, expected: '2.75 thousand' },
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback for non-exact thousands', () => {
    const cases = [
      { value: 1_100, expected: '1100' }, // 1.1 thousand not allowed
      { value: 1_200, expected: '1200' }, // 1.2 thousand not allowed
      { value: 1_300, expected: '1300' }, // 1.3 thousand not allowed
      { value: 1_400, expected: '1400' }, // 1.4 thousand not allowed
      { value: 1_600, expected: '1600' }, // 1.6 thousand not allowed
      { value: 1_700, expected: '1700' }, // 1.7 thousand not allowed
      { value: 1_800, expected: '1800' }, // 1.8 thousand not allowed
      { value: 1_900, expected: '1900' }, // 1.9 thousand not allowed
      { value: 1_999, expected: '1999' }, // not exact
      { value: 2_100, expected: '2100' }, // 2.1 thousand not allowed
      { value: 2_345, expected: '2345' }, // 2.345 thousand not allowed
      { value: 9_999, expected: '9999' }, // 9.999 thousand not allowed
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should format exact billions correctly', () => {
    const cases = [
      { value: 1_000_000_000, expected: '1 billion' },
      { value: 2_000_000_000, expected: '2 billion' },
      { value: 5_000_000_000, expected: '5 billion' },
      { value: 1_250_000_000, expected: '1.25 billion' },
      { value: 1_500_000_000, expected: '1.5 billion' },
      { value: 1_750_000_000, expected: '1.75 billion' },
      { value: 2_500_000_000, expected: '2.5 billion' },
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback to millions for non-exact billions', () => {
    const cases = [
      { value: 1_100_000_000, expected: '1100 million' }, // 1.1B not allowed, but 1100M exact
      { value: 1_299_000_000, expected: '1299 million' }, // 1.299B not allowed, but 1299M exact
      { value: 1_333_000_000, expected: '1333 million' }, // 1.333B not allowed, but 1333M exact
      { value: 2_341_000_000, expected: '2341 million' }, // 2.341B not allowed, but 2341M exact
      { value: 3_456_000_000, expected: '3456 million' }, // 3.456B not allowed, but 3456M exact
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });
});

describe('Precision variations with extended fractions', () => {
  let fmt: ReturnType<typeof createCompactFormatter>;

  beforeEach(() => {
    fmt = createCompactFormatter();
    // Extended fractions [0, 0.1, 0.2, ..., 0.9]
    fmt.setAllowedFractions([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]);
  });

  it('should format with 0.1 step fractions', () => {
    const cases = [
      { value: 1_100_000, expected: '1.1 million' },
      { value: 1_200_000, expected: '1.2 million' },
      { value: 1_300_000, expected: '1.3 million' },
      { value: 1_400_000, expected: '1.4 million' },
      { value: 1_500_000, expected: '1.5 million' },
      { value: 1_600_000, expected: '1.6 million' },
      { value: 1_700_000, expected: '1.7 million' },
      { value: 1_800_000, expected: '1.8 million' },
      { value: 1_900_000, expected: '1.9 million' },
      { value: 2_100_000, expected: '2.1 million' },
      { value: 2_300_000, expected: '2.3 million' },
      { value: 2_900_000, expected: '2.9 million' },
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback to thousands for non-allowed million fractions', () => {
    const cases = [
      { value: 1_150_000, expected: '1150 thousand' }, // 1.15M not allowed, but 1150K exact
      { value: 1_250_000, expected: '1250 thousand' }, // 1.25M not allowed (0.25 not in extended set), but 1250K exact
      { value: 1_299_000, expected: '1299 thousand' }, // 1.299M not allowed, but 1299K exact
      { value: 1_333_000, expected: '1333 thousand' }, // 1.333M not allowed, but 1333K exact
      { value: 2_341_000, expected: '2341 thousand' }, // 2.341M not allowed, but 2341K exact
      { value: 2_450_000, expected: '2450 thousand' }, // 2.45M not allowed, but 2450K exact
      { value: 3_456_000, expected: '3456 thousand' }, // 3.456M not allowed, but 3456K exact
      { value: 4_567_000, expected: '4567 thousand' }, // 4.567M not allowed, but 4567K exact
      { value: 5_678_000, expected: '5678 thousand' }, // 5.678M not allowed, but 5678K exact
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });
});

describe('Maximum 2 decimal places precision (0.00 to 0.99)', () => {
  let fmt: ReturnType<typeof createCompactFormatter>;

  beforeEach(() => {
    fmt = createCompactFormatter();
    // Allow all fractions with maximum 2 decimal places (0.00 to 0.99)
    const maxTwoDecimals = [];
    for (let i = 0; i <= 99; i++) {
      maxTwoDecimals.push(i / 100);
    }
    fmt.setAllowedFractions(maxTwoDecimals);
  });

  it('should format values with 2 decimal places', () => {
    const cases = [
      // Two decimal places - OK
      { value: 1_290_000, expected: '1.29 million' }, // 0.29 allowed
      { value: 1_250_000, expected: '1.25 million' }, // 0.25 allowed
      { value: 1_230_000, expected: '1.23 million' }, // 0.23 allowed
      { value: 1_150_000, expected: '1.15 million' }, // 0.15 allowed
      { value: 1_010_000, expected: '1.01 million' }, // 0.01 allowed
      { value: 1_990_000, expected: '1.99 million' }, // 0.99 allowed
      { value: 2_340_000, expected: '2.34 million' }, // 0.34 allowed
      { value: 3_450_000, expected: '3.45 million' }, // 0.45 allowed
      { value: 5_670_000, expected: '5.67 million' }, // 0.67 allowed
      { value: 6_780_000, expected: '6.78 million' }, // 0.78 allowed
      { value: 7_890_000, expected: '7.89 million' }, // 0.89 allowed
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback for 3+ decimal places (not formatting as thousands)', () => {
    const cases = [
      // Three decimal places - not allowed, should fallback
      // These values would need 0.299, 0.295, etc which have 3 decimal places
      { value: 1_299_000, expected: '1299 thousand' }, // 0.299 not allowed (3 decimals), but 1299K is exact
      { value: 1_295_000, expected: '1295 thousand' }, // 0.295 not allowed (3 decimals), but 1295K is exact
      { value: 1_333_000, expected: '1333 thousand' }, // 0.333 not allowed (3 decimals), but 1333K is exact
      { value: 2_341_000, expected: '2341 thousand' }, // 0.341 not allowed (3 decimals), but 2341K is exact
      { value: 3_456_000, expected: '3456 thousand' }, // 0.456 not allowed (3 decimals), but 3456K is exact
      { value: 4_567_000, expected: '4567 thousand' }, // 0.567 not allowed (3 decimals), but 4567K is exact
      { value: 5_678_000, expected: '5678 thousand' }, // 0.678 not allowed (3 decimals), but 5678K is exact
      { value: 6_789_000, expected: '6789 thousand' }, // 0.789 not allowed (3 decimals), but 6789K is exact
      { value: 7_123_000, expected: '7123 thousand' }, // 0.123 not allowed (3 decimals), but 7123K is exact
      { value: 8_999_000, expected: '8999 thousand' }, // 0.999 not allowed (3 decimals), but 8999K is exact
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should fallback to raw for non-exact values', () => {
    const cases = [
      { value: 1_005_000, expected: '1005 thousand' }, // 1005K is exact
      { value: 1_001_000, expected: '1001 thousand' }, // 1001K is exact
      { value: 2_005_500, expected: '2005.5 thousand' }, // 2005.5K is exact (0.5 allowed)
      { value: 3_456_789, expected: '3456789' }, // not exact multiple - raw fallback
      { value: 1_234_567, expected: '1234567' }, // not exact multiple - raw fallback
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should work for billions with 2 decimals', () => {
    const cases = [
      { value: 1_290_000_000, expected: '1.29 billion' }, // 0.29 allowed
      { value: 2_340_000_000, expected: '2.34 billion' }, // 0.34 allowed
      { value: 5_670_000_000, expected: '5.67 billion' }, // 0.67 allowed
      { value: 1_299_000_000, expected: '1299 million' }, // 0.299 not allowed, but 1299M is exact
      { value: 2_345_000_000, expected: '2345 million' }, // 0.345 not allowed, but 2345M is exact
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });

  it('should work for thousands with 2 decimals', () => {
    const cases = [
      { value: 1_290, expected: '1.29 thousand' }, // 0.29 allowed
      { value: 1_250, expected: '1.25 thousand' }, // 0.25 allowed
      { value: 1_990, expected: '1.99 thousand' }, // 0.99 allowed
      { value: 1_299, expected: '1299' }, // 0.299 not allowed, raw fallback
      { value: 1_234, expected: '1234' }, // 0.234 not allowed, raw fallback
    ];

    for (const { value, expected } of cases) {
      expect(fmt.format(value)).toBe(expected);
    }
  });
});
