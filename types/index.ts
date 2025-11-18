/**
 * Options for creating a smart compact formatter
 */
export interface SmartCompactOptions {
  /** Locale string (e.g., "cs-CZ", "en-US") */
  locale: string;
  /** Optional currency code (e.g., "EUR"); if not provided, formats as decimal number */
  currency?: string;
}

/**
 * Smart compact formatter interface
 */
export interface SmartCompactFormatter {
  /**
   * Format a number with smart compact notation
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
