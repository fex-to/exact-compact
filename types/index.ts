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
  readonly min: number;
  /** Maximum absolute value for this level (exclusive) */
  readonly max: number;
  /** Scale factor (e.g., 1000 for thousands) */
  readonly scale: number;
  /** Maximum fraction digits allowed for "exact" numbers */
  readonly maxFractionDigits: number;
  /** Pre-computed index for fast lookup */
  readonly index: number;
  /** Pre-computed factor (10^maxFractionDigits) for performance */
  readonly factor: number;
}
