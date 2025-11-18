import type { ScaleLevel } from '../types';
import { SCALE_LEVELS } from './constants';

/**
 * Check if a number is "exact" on the grid for a given scale level
 *
 * A number is considered exact if it can be represented as:
 * abs = (N / 10^d) * scale, where N is an integer
 *
 * This ensures the mantissa has at most maxFractionDigits decimal places
 * without rounding.
 *
 * @param abs - Absolute value of the number
 * @param level - Scale level to check against
 * @returns true if the number is exact on the grid
 *
 * @example
 * // Thousands level (scale=1000, d=1)
 * isExactOnGrid(1000, SCALE_LEVELS[0])  // true: 1000 * 10 = 10000, 10000 % 1000 = 0
 * isExactOnGrid(1150, SCALE_LEVELS[0])  // false: 1150 * 10 = 11500, 11500 % 1000 = 500
 *
 * // Millions level (scale=1000000, d=2)
 * isExactOnGrid(1230000, SCALE_LEVELS[1])  // true: 1230000 * 100 = 123000000, 123000000 % 1000000 = 0
 * isExactOnGrid(1234567, SCALE_LEVELS[1])  // false: 1234567 * 100 = 123456700, 123456700 % 1000000 = 456700
 */
export function isExactOnGrid(abs: number, level: ScaleLevel): boolean {
  const { scale, maxFractionDigits } = level;
  const factor = Math.pow(10, maxFractionDigits);

  // Calculate the scaled value
  const scaledValue = abs * factor;

  // Check if the scaled value is a safe integer
  // This prevents floating-point errors for very large numbers
  if (!Number.isSafeInteger(scaledValue)) {
    return false;
  }

  // Check if the scaled value is divisible by scale without remainder
  // This ensures the mantissa has at most maxFractionDigits decimal places
  return scaledValue % scale === 0;
}

/**
 * Find the appropriate scale level for a given absolute value
 *
 * @param abs - Absolute value to check
 * @returns Scale level or null if no level matches
 *
 * @example
 * findScaleLevel(500)       // null (below 1000)
 * findScaleLevel(5000)      // SCALE_LEVELS[0] (thousands)
 * findScaleLevel(5000000)   // SCALE_LEVELS[1] (millions)
 */
export function findScaleLevel(abs: number): ScaleLevel | null {
  for (const level of SCALE_LEVELS) {
    if (abs >= level.min && abs < level.max) {
      return level;
    }
  }
  return null;
}
