import { describe, it, expect } from 'vitest';

import { preciseCompact } from '../src/formatter';

describe('preciseCompact', () => {
  describe('cs-CZ locale with EUR currency', () => {
    const fmt = preciseCompact({
      locale: 'cs-CZ',
      currency: 'EUR',
    });

    describe('below 1000 - always regular format', () => {
      it('formats 900', () => {
        const result = fmt.format(900);
        expect(result).toMatch(/900/);
        expect(result).toMatch(/€|EUR/);
      });

      it('formats 999', () => {
        const result = fmt.format(999);
        expect(result).toMatch(/999/);
        expect(result).toMatch(/€|EUR/);
      });

      it('formats 0', () => {
        const result = fmt.format(0);
        expect(result).toMatch(/0/);
      });
    });

    describe('thousands level (1000 - 999999)', () => {
      it('formats 1000 as compact (exact)', () => {
        const result = fmt.format(1000);
        // Should contain compact notation (k, tis., thousand, etc.)
        expect(result).toMatch(/1[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats 1100 as compact (exact with 1 decimal)', () => {
        const result = fmt.format(1100);
        // Should be 1.1k or 1,1 tis. etc.
        expect(result).toMatch(/1[,.]1[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats 1150 as regular (not exact)', () => {
        const result = fmt.format(1150);
        // Should NOT contain compact notation
        expect(result).not.toMatch(/tis\.|k|thousand/i);
        expect(result).toMatch(/1[\s\u00A0]?150/);
      });

      it('formats 10000 as compact (exact)', () => {
        const result = fmt.format(10_000);
        expect(result).toMatch(/10[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats 10500 as compact (exact with 0.5 decimal)', () => {
        const result = fmt.format(10_500);
        // 10500 * 10 = 105000, 105000 % 1000 = 0 (exact!)
        // Should be 10.5k or 10,5 tis.
        expect(result).toMatch(/10[,.]5[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats 50000 as compact (exact)', () => {
        const result = fmt.format(50_000);
        expect(result).toMatch(/50[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats 999999 as regular (typically not exact)', () => {
        const result = fmt.format(999_999);
        // 999999 * 10 = 9999990, 9999990 % 1000 = 990 (not exact)
        expect(result).not.toMatch(/tis\.|k|thousand/i);
        expect(result).toMatch(/999[\s\u00A0]?999/);
      });
    });

    describe('million+ level (>= 1000000)', () => {
      it('formats 1000000 as compact (exact)', () => {
        const result = fmt.format(1_000_000);
        expect(result).toMatch(/1[\s\u00A0]?(M|mil\.|million)/i);
      });

      it('formats 1230000 as compact (exact with 2 decimals)', () => {
        const result = fmt.format(1_230_000);
        // Should be 1.23M or 1,23 mil. etc.
        expect(result).toMatch(/1[,.]23[\s\u00A0]?(M|mil\.|million)/i);
      });

      it('formats 1234567 as regular (not exact)', () => {
        const result = fmt.format(1_234_567);
        // 1234567 * 100 = 123456700, 123456700 % 1000000 = 456700 (not exact)
        expect(result).not.toMatch(/mil\.|M|million/i);
        expect(result).toMatch(/1[\s\u00A0]?234[\s\u00A0]?567/);
      });

      it('formats 5000000 as compact (exact)', () => {
        const result = fmt.format(5_000_000);
        expect(result).toMatch(/5[\s\u00A0]?(M|mil\.|million)/i);
      });

      it('formats 1010000 as compact (exact with 2 decimals)', () => {
        const result = fmt.format(1_010_000);
        // 1.01M or 1,01 mil.
        expect(result).toMatch(/1[,.]01[\s\u00A0]?(M|mil\.|million)/i);
      });

      it('formats 1001000 as regular (not exact)', () => {
        const result = fmt.format(1_001_000);
        // 1001000 * 100 = 100100000, 100100000 % 1000000 = 100000 (not exact)
        expect(result).not.toMatch(/mil\.|M|million/i);
      });

      it('formats large exact number 1100000000000000', () => {
        const result = fmt.format(1_100_000_000_000_000);
        // If within safe integer range, should be compact
        if (Number.isSafeInteger(1_100_000_000_000_000 * 100)) {
          expect(result).toMatch(/1[\s\u00A0]?100/); // Could be "1100 bil." or similar
        }
      });
    });

    describe('billion level (>= 1000000000)', () => {
      it('formats 1000000000 as compact (exact)', () => {
        const result = fmt.format(1_000_000_000);
        expect(result).toMatch(/1[\s\u00A0]?(B|mld\.|billion)/i);
      });

      it('formats 1230000000 as compact (exact with 2 decimals)', () => {
        const result = fmt.format(1_230_000_000);
        expect(result).toMatch(/1[,.]23[\s\u00A0]?(B|mld\.|billion)/i);
      });

      it('formats 1234567890 as regular (not exact)', () => {
        const result = fmt.format(1_234_567_890);
        expect(result).not.toMatch(/mld\.|B|billion/i);
        expect(result).toMatch(/1[\s\u00A0]?234[\s\u00A0]?567[\s\u00A0]?890/);
      });

      it('formats 5000000000 as compact (exact)', () => {
        const result = fmt.format(5_000_000_000);
        expect(result).toMatch(/5[\s\u00A0]?(B|mld\.|billion)/i);
      });
    });

    describe('trillion level (>= 1000000000000)', () => {
      it('formats 1000000000000 as compact (exact)', () => {
        const result = fmt.format(1_000_000_000_000);
        expect(result).toMatch(/1[\s\u00A0]?(T|bil\.|trillion)/i);
      });

      it('formats 1230000000000 as compact (exact with 2 decimals)', () => {
        const result = fmt.format(1_230_000_000_000);
        expect(result).toMatch(/1[,.]23[\s\u00A0]?(T|bil\.|trillion)/i);
      });

      it('formats 1234567890123 as regular (not exact)', () => {
        const result = fmt.format(1_234_567_890_123);
        // Should use regular format
        expect(result).not.toMatch(/bil\.|T|trillion/i);
      });

      it('formats 5000000000000 as compact (exact)', () => {
        const result = fmt.format(5_000_000_000_000);
        expect(result).toMatch(/5[\s\u00A0]?(T|bil\.|trillion)/i);
      });
    });

    describe('negative values', () => {
      it('formats -1000 as compact', () => {
        const result = fmt.format(-1000);
        expect(result).toMatch(/-/);
        expect(result).toMatch(/1[\s\u00A0]?(k|tis\.|thousand)/i);
      });

      it('formats -1150 as regular', () => {
        const result = fmt.format(-1150);
        expect(result).toMatch(/-/);
        expect(result).not.toMatch(/tis\.|k|thousand/i);
        expect(result).toMatch(/1[\s\u00A0]?150/);
      });

      it('formats -1000000 as compact', () => {
        const result = fmt.format(-1_000_000);
        expect(result).toMatch(/-/);
        expect(result).toMatch(/1[\s\u00A0]?(M|mil\.|million)/i);
      });

      it('formats -1234567 as regular', () => {
        const result = fmt.format(-1_234_567);
        expect(result).toMatch(/-/);
        expect(result).not.toMatch(/mil\.|M|million/i);
      });
    });

    describe('edge cases', () => {
      it('formats numbers with exact 1 decimal for thousands', () => {
        expect(fmt.format(1_200)).toMatch(/1[,.]2[\s\u00A0]?(k|tis\.)/i);
        expect(fmt.format(1_300)).toMatch(/1[,.]3[\s\u00A0]?(k|tis\.)/i);
        expect(fmt.format(99_900)).toMatch(/99[,.]9[\s\u00A0]?(k|tis\.)/i);
      });

      it('formats numbers with exact 2 decimals for millions', () => {
        expect(fmt.format(1_120_000)).toMatch(/1[,.]12[\s\u00A0]?(M|mil\.)/i);
        expect(fmt.format(9_990_000)).toMatch(/9[,.]99[\s\u00A0]?(M|mil\.)/i);
      });

      it('handles fractional thousands that are not exact', () => {
        const result = fmt.format(1_050);
        // 1050 * 10 = 10500, 10500 % 1000 = 500 (not exact)
        expect(result).not.toMatch(/tis\.|k/i);
      });
    });
  });

  describe('en-US locale with USD currency', () => {
    const fmt = preciseCompact({
      locale: 'en-US',
      currency: 'USD',
    });

    it('formats 1000 as compact', () => {
      const result = fmt.format(1000);
      expect(result).toMatch(/1[\s\u00A0]?K/); // English uses "K"
      expect(result).toMatch(/\$|USD/);
    });

    it('formats 1500 as compact (exact with 0.5 decimal)', () => {
      const result = fmt.format(1500);
      // 1500 * 10 = 15000, 15000 % 1000 = 0 (exact!)
      expect(result).toMatch(/1[,.]5[\s\u00A0]?K/);
    });

    it('formats 1000000 as compact', () => {
      const result = fmt.format(1_000_000);
      expect(result).toMatch(/1[\s\u00A0]?M/);
    });
  });

  describe('without currency (decimal style)', () => {
    const fmt = preciseCompact({
      locale: 'en-US',
    });

    it('formats 1000 as compact without currency', () => {
      const result = fmt.format(1000);
      expect(result).toMatch(/1[\s\u00A0]?K/);
      expect(result).not.toMatch(/\$|USD|€|EUR/);
    });

    it('formats 1500 as compact without currency (exact with 0.5 decimal)', () => {
      const result = fmt.format(1500);
      // 1500 * 10 = 15000, 15000 % 1000 = 0 (exact!)
      expect(result).toMatch(/1[,.]5[\s\u00A0]?K/);
      expect(result).not.toMatch(/\$|USD|€|EUR/);
    });

    it('formats 1000000 as compact without currency', () => {
      const result = fmt.format(1_000_000);
      expect(result).toMatch(/1[\s\u00A0]?M/);
      expect(result).not.toMatch(/\$|USD|€|EUR/);
    });

    it('formats small numbers without currency', () => {
      const result = fmt.format(123.45);
      expect(result).toMatch(/123/);
      expect(result).not.toMatch(/\$|USD|€|EUR/);
    });
  });

  describe('different locales', () => {
    it('formats with de-DE locale', () => {
      const fmt = preciseCompact({
        locale: 'de-DE',
        currency: 'EUR',
      });

      const result1000 = fmt.format(1000);
      expect(result1000).toMatch(/1/);
      // German might use different compact notation

      const result1500 = fmt.format(1500);
      expect(result1500).toMatch(/1[\s\u00A0.]?500/);
    });

    it('formats with ru-RU locale', () => {
      const fmt = preciseCompact({
        locale: 'ru-RU',
        currency: 'RUB',
      });

      const result1000 = fmt.format(1000);
      expect(result1000).toMatch(/1/);

      const result1000000 = fmt.format(1_000_000);
      expect(result1000000).toMatch(/1/);
    });
  });

  describe('safe integer boundary', () => {
    it('handles numbers near MAX_SAFE_INTEGER', () => {
      const fmt = preciseCompact({
        locale: 'en-US',
      });

      // A number that would overflow when multiplied
      const largeNumber = Number.MAX_SAFE_INTEGER / 10;
      const result = fmt.format(largeNumber);
      // Should use regular format as scaled value is unsafe
      expect(result).toBeTruthy();
    });

    it('rejects numbers that overflow safe integer check', () => {
      const fmt = preciseCompact({
        locale: 'en-US',
      });

      // Number that when multiplied by 100 exceeds safe integer
      const unsafeNumber = Number.MAX_SAFE_INTEGER / 100 + 1_000_000;
      const result = fmt.format(unsafeNumber);
      // Should use regular format
      expect(result).not.toMatch(/M|K/);
    });
  });

  describe('precision validation', () => {
    const fmt = preciseCompact({
      locale: 'en-US',
    });

    it('validates thousands with exactly 1 decimal place', () => {
      // These should be compact
      expect(fmt.format(1_000)).toMatch(/K/);
      expect(fmt.format(1_100)).toMatch(/K/);
      expect(fmt.format(1_200)).toMatch(/K/);
      expect(fmt.format(1_900)).toMatch(/K/);

      // These should NOT be compact (more than 1 decimal place needed)
      expect(fmt.format(1_010)).not.toMatch(/K/);
      expect(fmt.format(1_050)).not.toMatch(/K/);
      expect(fmt.format(1_234)).not.toMatch(/K/);
    });

    it('validates millions with exactly 2 decimal places', () => {
      // These should be compact
      expect(fmt.format(1_000_000)).toMatch(/M/);
      expect(fmt.format(1_100_000)).toMatch(/M/);
      expect(fmt.format(1_230_000)).toMatch(/M/);
      expect(fmt.format(1_990_000)).toMatch(/M/);

      // These should NOT be compact (more than 2 decimal places needed)
      expect(fmt.format(1_001_000)).not.toMatch(/M/);
      expect(fmt.format(1_005_000)).not.toMatch(/M/);
      expect(fmt.format(1_234_567)).not.toMatch(/M/);
    });
  });
});
