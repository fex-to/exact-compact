import { describe, it, expect } from 'vitest';

import { PreciseCompact } from '../src/formatter';

/**
 * Comprehensive edge cases and boundary tests
 * Ensures all formatting rules and exceptions are covered
 */
describe('Edge cases and boundaries', () => {
  const fmt = PreciseCompact({ locale: 'en-US' });
  const fmtCurrency = PreciseCompact({ locale: 'en-US', currency: 'USD' });

  describe('Below 1000 - always regular format', () => {
    it('formats 0', () => {
      expect(fmt.format(0)).toBe('0');
    });

    it('formats negative zero', () => {
      const result = fmt.format(-0);
      // Intl may format -0 as "-0" or "0" depending on locale/implementation
      expect(result).toMatch(/^-?0$/);
    });

    it('formats 1', () => {
      expect(fmt.format(1)).toBe('1');
    });

    it('formats 999', () => {
      expect(fmt.format(999)).toBe('999');
    });

    it('formats 999.99', () => {
      const result = fmt.format(999.99);
      expect(result).toMatch(/999\.99/);
    });

    it('formats fractional numbers', () => {
      expect(fmt.format(0.1)).toMatch(/0\.1/);
      expect(fmt.format(0.01)).toMatch(/0\.01/);
      expect(fmt.format(0.001)).toMatch(/0\.001/);
    });

    it('formats negative numbers below 1000', () => {
      expect(fmt.format(-1)).toBe('-1');
      expect(fmt.format(-999)).toBe('-999');
    });
  });

  describe('Boundary at 1000', () => {
    it('formats exactly 1000 as compact', () => {
      expect(fmt.format(1000)).toBe('1K');
    });

    it('formats 999.9999... as regular', () => {
      expect(fmt.format(999.9999999)).not.toMatch(/K/);
    });

    it('formats 1000.0001 as regular (not exact)', () => {
      const result = fmt.format(1000.0001);
      expect(result).not.toMatch(/K/);
    });
  });

  describe('Thousands level - exact boundaries', () => {
    describe('exact numbers with 0 decimals', () => {
      it('formats multiples of 1000', () => {
        expect(fmt.format(1000)).toBe('1K');
        expect(fmt.format(2000)).toBe('2K');
        expect(fmt.format(10000)).toBe('10K');
        expect(fmt.format(100000)).toBe('100K');
        expect(fmt.format(999000)).toBe('999K');
      });
    });

    describe('exact numbers with 1 decimal', () => {
      it('formats .1 increments (× 100)', () => {
        expect(fmt.format(1100)).toBe('1.1K');
        expect(fmt.format(1200)).toBe('1.2K');
        expect(fmt.format(1900)).toBe('1.9K');
      });

      it('formats .5 increments', () => {
        expect(fmt.format(1500)).toBe('1.5K');
        expect(fmt.format(2500)).toBe('2.5K');
        expect(fmt.format(10500)).toBe('10.5K');
      });

      it('formats .7 increments', () => {
        expect(fmt.format(1700)).toBe('1.7K');
        expect(fmt.format(99700)).toBe('99.7K');
      });
    });

    describe('non-exact numbers (more than 1 decimal needed)', () => {
      it('formats numbers requiring 2+ decimals as regular', () => {
        expect(fmt.format(1010)).not.toMatch(/K/); // would need 1.01K
        expect(fmt.format(1050)).not.toMatch(/K/); // would need 1.05K
        expect(fmt.format(1150)).not.toMatch(/K/); // would need 1.15K
        expect(fmt.format(1234)).not.toMatch(/K/); // would need 1.234K
      });

      it('formats irregular amounts as regular', () => {
        expect(fmt.format(1001)).not.toMatch(/K/);
        expect(fmt.format(1111)).not.toMatch(/K/);
        expect(fmt.format(1999)).not.toMatch(/K/);
      });
    });
  });

  describe('Boundary at 1 million', () => {
    it('formats 999,999 as thousands (not exact)', () => {
      const result = fmt.format(999999);
      expect(result).not.toMatch(/K/);
      expect(result).toMatch(/999/);
    });

    it('formats exactly 1,000,000 as compact', () => {
      expect(fmt.format(1000000)).toBe('1M');
    });
  });

  describe('Millions level - exact boundaries', () => {
    describe('exact numbers with 0 decimals', () => {
      it('formats multiples of 1 million', () => {
        expect(fmt.format(1000000)).toBe('1M');
        expect(fmt.format(2000000)).toBe('2M');
        expect(fmt.format(10000000)).toBe('10M');
        expect(fmt.format(100000000)).toBe('100M');
        expect(fmt.format(999000000)).toBe('999M');
      });
    });

    describe('exact numbers with 1 decimal', () => {
      it('formats .1 increments', () => {
        expect(fmt.format(1100000)).toBe('1.1M');
        expect(fmt.format(1200000)).toBe('1.2M');
        expect(fmt.format(1900000)).toBe('1.9M');
      });

      it('formats .5 increments', () => {
        expect(fmt.format(1500000)).toBe('1.5M');
        expect(fmt.format(2500000)).toBe('2.5M');
      });
    });

    describe('exact numbers with 2 decimals', () => {
      it('formats .01 increments', () => {
        expect(fmt.format(1010000)).toBe('1.01M');
        expect(fmt.format(1050000)).toBe('1.05M');
        expect(fmt.format(1990000)).toBe('1.99M');
      });

      it('formats .23, .45, .67 etc.', () => {
        expect(fmt.format(1230000)).toBe('1.23M');
        expect(fmt.format(1450000)).toBe('1.45M');
        expect(fmt.format(1670000)).toBe('1.67M');
      });
    });

    describe('non-exact numbers (more than 2 decimals needed)', () => {
      it('formats numbers requiring 3+ decimals as regular', () => {
        expect(fmt.format(1001000)).not.toMatch(/M/); // would need 1.001M
        expect(fmt.format(1005000)).not.toMatch(/M/); // would need 1.005M
        expect(fmt.format(1234567)).not.toMatch(/M/); // would need 1.234567M
      });

      it('formats irregular amounts as regular', () => {
        expect(fmt.format(1000001)).not.toMatch(/M/);
        expect(fmt.format(1111111)).not.toMatch(/M/);
      });
    });
  });

  describe('Boundary at 1 billion', () => {
    it('formats 999,999,999 as millions (not exact)', () => {
      const result = fmt.format(999999999);
      expect(result).not.toMatch(/M/);
    });

    it('formats exactly 1,000,000,000 as compact', () => {
      expect(fmt.format(1000000000)).toBe('1B');
    });
  });

  describe('Billions level - exact boundaries', () => {
    describe('exact numbers', () => {
      it('formats multiples of 1 billion', () => {
        expect(fmt.format(1000000000)).toBe('1B');
        expect(fmt.format(2000000000)).toBe('2B');
        expect(fmt.format(10000000000)).toBe('10B');
      });

      it('formats with 1 decimal', () => {
        expect(fmt.format(1100000000)).toBe('1.1B');
        expect(fmt.format(1500000000)).toBe('1.5B');
      });

      it('formats with 2 decimals', () => {
        expect(fmt.format(1230000000)).toBe('1.23B');
        expect(fmt.format(1010000000)).toBe('1.01B');
      });
    });

    describe('non-exact numbers', () => {
      it('formats irregular amounts as regular', () => {
        expect(fmt.format(1001000000)).not.toMatch(/B/);
        expect(fmt.format(1234567890)).not.toMatch(/B/);
      });
    });
  });

  describe('Boundary at 1 trillion', () => {
    it('formats 999,999,999,999 as billions (not exact)', () => {
      const result = fmt.format(999999999999);
      expect(result).not.toMatch(/B/);
    });

    it('formats exactly 1,000,000,000,000 as compact', () => {
      expect(fmt.format(1000000000000)).toBe('1T');
    });
  });

  describe('Trillions level - exact boundaries', () => {
    describe('exact numbers', () => {
      it('formats multiples of 1 trillion', () => {
        expect(fmt.format(1000000000000)).toBe('1T');
        expect(fmt.format(2000000000000)).toBe('2T');
        expect(fmt.format(10000000000000)).toBe('10T');
      });

      it('formats with 1 decimal', () => {
        expect(fmt.format(1100000000000)).toBe('1.1T');
        expect(fmt.format(1500000000000)).toBe('1.5T');
      });

      it('formats with 2 decimals', () => {
        expect(fmt.format(1230000000000)).toBe('1.23T');
        expect(fmt.format(5670000000000)).toBe('5.67T');
      });
    });

    describe('non-exact numbers', () => {
      it('formats irregular amounts as regular', () => {
        expect(fmt.format(1001000000000)).not.toMatch(/T/);
        expect(fmt.format(1234567890123)).not.toMatch(/T/);
      });
    });
  });

  describe('Negative numbers - all levels', () => {
    it('formats negative thousands', () => {
      expect(fmt.format(-1000)).toBe('-1K');
      expect(fmt.format(-1500)).toBe('-1.5K');
      expect(fmt.format(-1150)).not.toMatch(/K/);
    });

    it('formats negative millions', () => {
      expect(fmt.format(-1000000)).toBe('-1M');
      expect(fmt.format(-1230000)).toBe('-1.23M');
      expect(fmt.format(-1234567)).not.toMatch(/M/);
    });

    it('formats negative billions', () => {
      expect(fmt.format(-1000000000)).toBe('-1B');
      expect(fmt.format(-1230000000)).toBe('-1.23B');
    });

    it('formats negative trillions', () => {
      expect(fmt.format(-1000000000000)).toBe('-1T');
      expect(fmt.format(-1230000000000)).toBe('-1.23T');
    });
  });

  describe('Safe integer boundaries', () => {
    it('handles numbers near MAX_SAFE_INTEGER', () => {
      const nearMax = Number.MAX_SAFE_INTEGER - 1000;
      const result = fmt.format(nearMax);
      expect(result).toBeTruthy();
    });

    it('handles MAX_SAFE_INTEGER', () => {
      const result = fmt.format(Number.MAX_SAFE_INTEGER);
      expect(result).toBeTruthy();
      // Should use regular format as it may overflow when scaled
    });

    it('handles numbers that overflow when scaled', () => {
      // Number that would overflow when multiplied by 100
      const unsafeWhenScaled = Number.MAX_SAFE_INTEGER / 100 + 1000000;
      const result = fmt.format(unsafeWhenScaled);
      // Should use regular format due to safety check
      expect(result).not.toMatch(/M|B|T/);
    });
  });

  describe('Special IEEE 754 values', () => {
    it('handles Infinity', () => {
      const result = fmt.format(Infinity);
      expect(result).toMatch(/∞|Infinity/);
    });

    it('handles -Infinity', () => {
      const result = fmt.format(-Infinity);
      expect(result).toMatch(/-|∞|Infinity/);
    });

    it('handles NaN', () => {
      const result = fmt.format(NaN);
      expect(result).toMatch(/NaN/);
    });
  });

  describe('Currency formatting specifics', () => {
    it('adds currency symbol to exact compact numbers', () => {
      expect(fmtCurrency.format(1000)).toMatch(/\$|USD/);
      expect(fmtCurrency.format(1000)).toMatch(/1K/);
    });

    it('adds currency symbol to non-exact regular numbers', () => {
      expect(fmtCurrency.format(1150)).toMatch(/\$|USD/);
      expect(fmtCurrency.format(1150)).not.toMatch(/K/);
    });

    it('formats small currency amounts', () => {
      const result = fmtCurrency.format(1.99);
      expect(result).toMatch(/\$|USD/);
      expect(result).toMatch(/1\.99/);
    });

    it('formats zero with currency', () => {
      const result = fmtCurrency.format(0);
      expect(result).toMatch(/\$|USD/);
      expect(result).toMatch(/0/);
    });
  });

  describe('Precision at scale boundaries', () => {
    it('999.999K should be regular (crosses to 1M)', () => {
      const result = fmt.format(999999);
      expect(result).not.toMatch(/K/);
      expect(result).not.toMatch(/M/);
    });

    it('0.999K should be regular (below 1K)', () => {
      const result = fmt.format(999);
      expect(result).not.toMatch(/K/);
    });

    it('handles floating-point precision', () => {
      // Numbers with floating-point imprecision are not "exact"
      // 1100.0000000001 !== 1100, so it should use regular format
      const result1 = fmt.format(1100.0000000001);
      const result2 = fmt.format(1500.0000000001);
      // These should use regular format as they're not exactly on the grid
      expect(result1).toMatch(/1[,\s]?100/);
      expect(result2).toMatch(/1[,\s]?500/);
    });
  });

  describe('All scale levels with same pattern', () => {
    const testCases = [
      { value: 1000, level: 'K', name: 'thousands' },
      { value: 1000000, level: 'M', name: 'millions' },
      { value: 1000000000, level: 'B', name: 'billions' },
      { value: 1000000000000, level: 'T', name: 'trillions' },
    ];

    testCases.forEach(({ value, level, name }) => {
      it(`formats base ${name} (${value})`, () => {
        expect(fmt.format(value)).toBe(`1${level}`);
      });

      it(`formats 2× ${name}`, () => {
        expect(fmt.format(value * 2)).toBe(`2${level}`);
      });

      it(`formats 10× ${name}`, () => {
        expect(fmt.format(value * 10)).toBe(`10${level}`);
      });

      it(`formats negative ${name}`, () => {
        expect(fmt.format(-value)).toBe(`-1${level}`);
      });
    });
  });

  describe('Decimal patterns across levels', () => {
    it('formats .5 pattern across all levels', () => {
      expect(fmt.format(1500)).toBe('1.5K');
      expect(fmt.format(1500000)).toBe('1.5M');
      expect(fmt.format(1500000000)).toBe('1.5B');
      expect(fmt.format(1500000000000)).toBe('1.5T');
    });

    it('formats .25 pattern for millions+ (2 decimals allowed)', () => {
      expect(fmt.format(1250000)).toBe('1.25M');
      expect(fmt.format(1250000000)).toBe('1.25B');
      expect(fmt.format(1250000000000)).toBe('1.25T');
    });

    it('does NOT format .25 pattern for thousands (only 1 decimal)', () => {
      expect(fmt.format(1250)).not.toMatch(/K/);
      expect(fmt.format(1250)).toMatch(/1,250/);
    });
  });
});
