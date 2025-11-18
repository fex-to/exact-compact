import type { ScaleLevel } from '../types';

/**
 * Scale levels definition
 *
 * Level 1: Thousands (1K - 999K)
 * - Allows up to 1 decimal place (e.g., 1.5K)
 *
 * Level 2: Millions (1M - 999M)
 * - Allows up to 2 decimal places (e.g., 1.23M)
 *
 * Level 3: Billions (1B - 999B)
 * - Allows up to 2 decimal places (e.g., 1.23B)
 *
 * Level 4: Trillions and above (1T+)
 * - Allows up to 2 decimal places (e.g., 1.23T)
 */
export const SCALE_LEVELS: ScaleLevel[] = [
  {
    min: 1000,
    max: 1_000_000,
    scale: 1000,
    maxFractionDigits: 1,
  },
  {
    min: 1_000_000,
    max: 1_000_000_000,
    scale: 1_000_000,
    maxFractionDigits: 2,
  },
  {
    min: 1_000_000_000,
    max: 1_000_000_000_000,
    scale: 1_000_000_000,
    maxFractionDigits: 2,
  },
  {
    min: 1_000_000_000_000,
    max: Infinity,
    scale: 1_000_000_000_000,
    maxFractionDigits: 2,
  },
];
