/**
 * Options for creating a precise compact formatter
 */
export interface PreciseCompactOptions {
  /** Locale string (e.g., "cs-CZ", "en-US") */
  locale: string;
  /** Optional currency code (e.g., "EUR"); if not provided, formats as decimal number */
  currency?: string;
  /** Display format for compact notation: "short" (e.g., "1K") or "long" (e.g., "1 thousand") */
  compactDisplay?: 'short' | 'long';
}

/**
 * Precise compact formatter interface
 */
export interface PreciseCompactFormatter {
  /**
   * Format a number with precise compact notation
   * @param value - The number to format
   * @returns Formatted string
   */
  format(value: number): string;
}

/**
 * Scale level configuration
 */
export interface ScaleLevel {
  /** Minimum absolute value for this level */
  min: number;
  /** Maximum absolute value for this level (exclusive) */
  max: number;
  /** Scale factor (e.g., 1000 for thousands) */
  scale: number;
  /** Maximum fraction digits allowed for "exact" numbers */
  maxFractionDigits: number;
}
