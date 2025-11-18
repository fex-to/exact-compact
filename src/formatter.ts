import type { SmartCompactOptions, SmartCompactFormatter } from '../types';
import { SCALE_LEVELS } from './constants';
import { findScaleLevel, isExactOnGrid } from './utils';

/**
 * Create formatters for the given options
 * 
 * @param options - Formatter options
 * @returns Object with regular and compact formatters
 */
function createFormatters(options: SmartCompactOptions) {
  const { locale, currency } = options;
  
  // Base format options
  const baseFormatOptions: Intl.NumberFormatOptions = currency
    ? { style: 'currency', currency }
    : { style: 'decimal' };
  
  // Create regular formatter (no compact notation)
  const regularFormatter = new Intl.NumberFormat(locale, {
    ...baseFormatOptions,
  });
  
  // Create compact formatters for each scale level
  const compactFormatters = SCALE_LEVELS.map(level => 
    new Intl.NumberFormat(locale, {
      ...baseFormatOptions,
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: level.maxFractionDigits,
      minimumFractionDigits: 0,
    })
  );
  
  return {
    regularFormatter,
    compactFormatters,
  };
}

/**
 * Create a smart compact formatter with the given options
 * 
 * This formatter uses compact notation (e.g., "1K", "1.5M") only for "exact" numbers
 * that can be represented without approximation. For all other numbers, it uses
 * regular formatting.
 * 
 * @param options - Formatter options
 * @returns SmartCompactFormatter instance
 * 
 * @example
 * const fmt = createSmartCompactFormatter({ locale: 'cs-CZ', currency: 'EUR' });
 * 
 * fmt.format(1000)      // "1 tis. EUR" (compact - exact)
 * fmt.format(1100)      // "1,1 tis. EUR" (compact - exact)
 * fmt.format(1150)      // "1 150,00 €" (regular - not exact)
 * fmt.format(1000000)   // "1 mil. EUR" (compact - exact)
 * fmt.format(1234567)   // "1 234 567,00 €" (regular - not exact)
 */
export function createSmartCompactFormatter(
  options: SmartCompactOptions
): SmartCompactFormatter {
  const { regularFormatter, compactFormatters } = createFormatters(options);
  
  return {
    format(value: number): string {
      const abs = Math.abs(value);
      
      // For values below 1000, always use regular format
      if (abs < 1000) {
        return regularFormatter.format(value);
      }
      
      // Find the appropriate scale level
      const level = findScaleLevel(abs);
      
      // If no level found, use regular format
      if (!level) {
        return regularFormatter.format(value);
      }
      
      // Check if the number is "exact" on the grid
      if (!isExactOnGrid(abs, level)) {
        return regularFormatter.format(value);
      }
      
      // Use compact format
      const levelIndex = SCALE_LEVELS.indexOf(level);
      return compactFormatters[levelIndex].format(value);
    },
  };
}
