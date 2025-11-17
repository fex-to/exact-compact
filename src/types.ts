export type SystemId = 'international' | 'indian' | 'eastAsia' | (string & {});
export type LabelStyle = 'words' | 'abbr';

export interface FormatOptions {
  system?: SystemId;
  style?: LabelStyle;
  fallbackFn?: (value: number | bigint) => string;
  locale?: string;
}

export type UnitKey =
  | 'thousand'
  | 'million'
  | 'billion'
  | 'trillion'
  | 'lakh'
  | 'crore'
  | 'arab'
  | 'kharab'
  | 'wan'
  | 'yi';

export interface UnitDef {
  key: UnitKey;
  value: bigint;
}

export interface SystemDef {
  id: SystemId;
  units: UnitDef[];
}

export type LabelForms = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};
export type LabelValue = string | LabelForms;

export type LabelNode = {
  words: LabelValue;
  abbr: LabelValue;
};

export interface LocaleRules {
  rtl?: boolean;
  joiner?: '' | ' ' | '\u00A0' | '\u202F';
  unitOrder?: 'after' | 'before';
  resolveLabel?: (
    unitKey: UnitKey,
    base: { words: string; abbr: string },
    factor: number,
    style: LabelStyle,
  ) => string;
  finalize?: (text: string) => string;
}

export interface LocalePack {
  locale: string;
  labels: { [unit in UnitKey]?: LabelNode };
  rules?: LocaleRules;
}

export type UnknownSystemStrategy = 'raw' | { use: SystemId };

export interface CompactConfig {
  systems?: SystemDef[];
  locales?: LocalePack[];
  defaultLocale?: string;
  allowedFractions?: number[];
  allowSubSmallest?: boolean;
  unknownSystem?: UnknownSystemStrategy;
}

export interface CompactFormatter {
  format(value: number | bigint, options?: FormatOptions): string;
  registerLocale(pack: LocalePack): void;
  registerSystem(system: SystemDef): void;
  setAllowedFractions(fractions: number[]): void;
  setDefaultLocale(locale: string): void;
}
