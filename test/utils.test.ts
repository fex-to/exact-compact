import { describe, it, expect } from 'vitest';
import { isExactOnGrid, findScaleLevel } from '../src/utils';
import { SCALE_LEVELS } from '../src/constants';

describe('utils', () => {
  describe('isExactOnGrid', () => {
    const thousandLevel = SCALE_LEVELS[0]; // scale=1000, d=1
    const millionLevel = SCALE_LEVELS[1];  // scale=1000000, d=2
    const billionLevel = SCALE_LEVELS[2];  // scale=1000000000, d=2
    const trillionLevel = SCALE_LEVELS[3]; // scale=1000000000000, d=2

    describe('thousands level', () => {
      it('returns true for exact numbers', () => {
        expect(isExactOnGrid(1000, thousandLevel)).toBe(true);
        expect(isExactOnGrid(1100, thousandLevel)).toBe(true);
        expect(isExactOnGrid(1500, thousandLevel)).toBe(true);
        expect(isExactOnGrid(10_000, thousandLevel)).toBe(true);
        expect(isExactOnGrid(10_500, thousandLevel)).toBe(true);
        expect(isExactOnGrid(99_900, thousandLevel)).toBe(true);
      });

      it('returns false for non-exact numbers', () => {
        expect(isExactOnGrid(1050, thousandLevel)).toBe(false);
        expect(isExactOnGrid(1150, thousandLevel)).toBe(false);
        expect(isExactOnGrid(1234, thousandLevel)).toBe(false);
        expect(isExactOnGrid(10_050, thousandLevel)).toBe(false);
        expect(isExactOnGrid(999_999, thousandLevel)).toBe(false);
      });
    });

    describe('millions level', () => {
      it('returns true for exact numbers', () => {
        expect(isExactOnGrid(1_000_000, millionLevel)).toBe(true);
        expect(isExactOnGrid(1_100_000, millionLevel)).toBe(true);
        expect(isExactOnGrid(1_230_000, millionLevel)).toBe(true);
        expect(isExactOnGrid(1_010_000, millionLevel)).toBe(true);
        expect(isExactOnGrid(9_990_000, millionLevel)).toBe(true);
      });

      it('returns false for non-exact numbers', () => {
        expect(isExactOnGrid(1_001_000, millionLevel)).toBe(false);
        expect(isExactOnGrid(1_005_000, millionLevel)).toBe(false);
        expect(isExactOnGrid(1_234_567, millionLevel)).toBe(false);
        expect(isExactOnGrid(1_111_111, millionLevel)).toBe(false);
      });
    });

    describe('billions level', () => {
      it('returns true for exact numbers', () => {
        expect(isExactOnGrid(1_000_000_000, billionLevel)).toBe(true);
        expect(isExactOnGrid(1_100_000_000, billionLevel)).toBe(true);
        expect(isExactOnGrid(1_230_000_000, billionLevel)).toBe(true);
        expect(isExactOnGrid(5_500_000_000, billionLevel)).toBe(true);
      });

      it('returns false for non-exact numbers', () => {
        expect(isExactOnGrid(1_001_000_000, billionLevel)).toBe(false);
        expect(isExactOnGrid(1_234_567_890, billionLevel)).toBe(false);
      });
    });

    describe('trillions level', () => {
      it('returns true for exact numbers', () => {
        expect(isExactOnGrid(1_000_000_000_000, trillionLevel)).toBe(true);
        expect(isExactOnGrid(1_100_000_000_000, trillionLevel)).toBe(true);
        expect(isExactOnGrid(5_230_000_000_000, trillionLevel)).toBe(true);
      });

      it('returns false for non-exact numbers', () => {
        expect(isExactOnGrid(1_001_000_000_000, trillionLevel)).toBe(false);
        expect(isExactOnGrid(1_234_567_890_123, trillionLevel)).toBe(false);
      });
    });

    describe('boundary cases', () => {
      it('returns false for unsafe integers', () => {
        // Number that would overflow when scaled
        const unsafeNumber = (Number.MAX_SAFE_INTEGER / 10) + 1;
        expect(isExactOnGrid(unsafeNumber, thousandLevel)).toBe(false);
      });

      it('handles very large exact numbers', () => {
        // 1.1 quadrillion - if safe, should be exact
        const largeExact = 1_100_000_000_000_000;
        if (Number.isSafeInteger(largeExact * 100)) {
          expect(isExactOnGrid(largeExact, millionLevel)).toBe(true);
        } else {
          expect(isExactOnGrid(largeExact, millionLevel)).toBe(false);
        }
      });
    });
  });

  describe('findScaleLevel', () => {
    it('returns null for values below 1000', () => {
      expect(findScaleLevel(0)).toBe(null);
      expect(findScaleLevel(500)).toBe(null);
      expect(findScaleLevel(999)).toBe(null);
    });

    it('returns thousands level for 1000-999999', () => {
      expect(findScaleLevel(1000)).toBe(SCALE_LEVELS[0]);
      expect(findScaleLevel(5000)).toBe(SCALE_LEVELS[0]);
      expect(findScaleLevel(500_000)).toBe(SCALE_LEVELS[0]);
      expect(findScaleLevel(999_999)).toBe(SCALE_LEVELS[0]);
    });

    it('returns millions level for 1000000-999999999', () => {
      expect(findScaleLevel(1_000_000)).toBe(SCALE_LEVELS[1]);
      expect(findScaleLevel(5_000_000)).toBe(SCALE_LEVELS[1]);
      expect(findScaleLevel(500_000_000)).toBe(SCALE_LEVELS[1]);
      expect(findScaleLevel(999_999_999)).toBe(SCALE_LEVELS[1]);
    });

    it('returns billions level for 1000000000-999999999999', () => {
      expect(findScaleLevel(1_000_000_000)).toBe(SCALE_LEVELS[2]);
      expect(findScaleLevel(5_000_000_000)).toBe(SCALE_LEVELS[2]);
      expect(findScaleLevel(500_000_000_000)).toBe(SCALE_LEVELS[2]);
      expect(findScaleLevel(999_999_999_999)).toBe(SCALE_LEVELS[2]);
    });

    it('returns trillions level for 1000000000000+', () => {
      expect(findScaleLevel(1_000_000_000_000)).toBe(SCALE_LEVELS[3]);
      expect(findScaleLevel(5_000_000_000_000)).toBe(SCALE_LEVELS[3]);
      expect(findScaleLevel(1_000_000_000_000_000)).toBe(SCALE_LEVELS[3]);
    });

    it('handles boundary values correctly', () => {
      expect(findScaleLevel(999.99)).toBe(null);
      expect(findScaleLevel(1000)).toBe(SCALE_LEVELS[0]);
      expect(findScaleLevel(999_999.99)).toBe(SCALE_LEVELS[0]);
      expect(findScaleLevel(1_000_000)).toBe(SCALE_LEVELS[1]);
      expect(findScaleLevel(999_999_999.99)).toBe(SCALE_LEVELS[1]);
      expect(findScaleLevel(1_000_000_000)).toBe(SCALE_LEVELS[2]);
      expect(findScaleLevel(999_999_999_999.99)).toBe(SCALE_LEVELS[2]);
      expect(findScaleLevel(1_000_000_000_000)).toBe(SCALE_LEVELS[3]);
    });
  });
});
