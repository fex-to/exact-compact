// MIT License
// comments in English only

export type SystemId = 'international' | 'indian' | 'eastAsia' | (string & {}); // allow custom ids
export type LabelStyle = 'words' | 'abbr';

export interface FormatOptions {
  system?: SystemId;
  style?: LabelStyle;
  fallback?: 'raw' | 'locale'; // built-in fallback strategy
  fallbackFn?: (value: number | bigint) => string; // custom fallback receives the raw argument
  locale?: string;
  numberLocale?: string;
  numberOptions?: Intl.NumberFormatOptions;
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

// --- Morphology support ---
export type LabelForms = {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string; // required when using forms
};
export type LabelValue = string | LabelForms;

type LabelNode = {
  words: LabelValue;
  abbr: LabelValue;
};

export interface LocaleRules {
  rtl?: boolean; // bidi hint
  joiner?: '' | ' ' | '\u00A0' | '\u202F'; // between number and label; default ' '
  unitOrder?: 'after' | 'before'; // default 'after' -> "1 million"
  numberLocale?: string; // default: pack.locale
  numberOptions?: Intl.NumberFormatOptions; // default: { useGrouping: false }
  // NOTE: base is provided as already-inflected strings
  resolveLabel?: (
    unitKey: UnitKey,
    base: { words: string; abbr: string },
    factor: number,
    style: LabelStyle,
  ) => string;
  finalize?: (text: string) => string; // final tweak (e.g., add RLM)
}

export interface LocalePack {
  locale: string; // e.g., 'en', 'en-GB'
  labels: { [unit in UnitKey]?: LabelNode };
  rules?: LocaleRules;
}

// --- Unknown system strategy ---
export type UnknownSystemStrategy = 'raw' | 'locale' | { use: SystemId }; // e.g. { use: 'international' }

export interface CompactConfig {
  systems?: SystemDef[];
  locales?: LocalePack[];
  defaultLocale?: string; // default: 'en'
  allowedFractions?: number[]; // default: [0, 0.5]
  allowSubSmallest?: boolean; // default: false
  unknownSystem?: UnknownSystemStrategy; // default: 'raw'
}

export interface CompactFormatter {
  format(value: number | bigint, options?: FormatOptions): string;
  registerLocale(pack: LocalePack): void;
  registerSystem(system: SystemDef): void;
  setAllowedFractions(fractions: number[]): void;
  setDefaultLocale(locale: string): void;
}

// ---- default systems ----

const SYSTEM_INTL: SystemDef = {
  id: 'international',
  units: [
    { key: 'trillion', value: 1_000_000_000_000n },
    { key: 'billion', value: 1_000_000_000n },
    { key: 'million', value: 1_000_000n },
    { key: 'thousand', value: 1_000n },
  ],
};

const SYSTEM_INDIAN: SystemDef = {
  id: 'indian',
  units: [
    { key: 'kharab', value: 100_000_000_000n }, // 10^11
    { key: 'arab', value: 1_000_000_000n }, // 10^9
    { key: 'crore', value: 10_000_000n }, // 10^7
    { key: 'lakh', value: 100_000n }, // 10^5
    { key: 'thousand', value: 1_000n }, // 10^3
  ],
};

const SYSTEM_EAST_ASIA: SystemDef = {
  id: 'eastAsia',
  units: [
    { key: 'yi', value: 100_000_000n }, // 10^8
    { key: 'wan', value: 10_000n }, // 10^4
    { key: 'thousand', value: 1_000n }, // convenience
  ],
};

// ---- default English locale only (strings still work) ----

const LOCALE_EN: LocalePack = {
  locale: 'en',
  labels: {
    thousand: { words: 'thousand', abbr: 'K' },
    million: { words: 'million', abbr: 'M' },
    billion: { words: 'billion', abbr: 'B' },
    trillion: { words: 'trillion', abbr: 'T' },
    lakh: { words: 'lakh', abbr: 'L' },
    crore: { words: 'crore', abbr: 'Cr' },
    arab: { words: 'arab', abbr: 'Ar' },
    kharab: { words: 'kharab', abbr: 'Khar' },
    wan: { words: 'wan', abbr: 'w' },
    yi: { words: 'yi', abbr: 'y' },
  },
  rules: {
    joiner: ' ',
    unitOrder: 'after',
    numberOptions: { useGrouping: false },
  },
};

// ---- factory ----

export function createCompactFormatter(cfg?: Partial<CompactConfig>): CompactFormatter {
  const systems = new Map<SystemId, SystemDef>();
  const locales = new Map<string, LocalePack>();
  let defaultLocale = cfg?.defaultLocale ?? 'en';
  let allowedFractions = (cfg?.allowedFractions ?? [0, 0.5]).slice().sort((a, b) => a - b);

  const allowSubSmallest = cfg?.allowSubSmallest ?? false;
  const unknownSystem = cfg?.unknownSystem ?? 'raw';

  for (const s of cfg?.systems ?? [SYSTEM_INTL, SYSTEM_INDIAN, SYSTEM_EAST_ASIA]) {
    systems.set(s.id, {
      ...s,
      units: [...s.units].sort((a, b) => Number(b.value - a.value)),
    });
  }
  for (const p of cfg?.locales ?? [LOCALE_EN]) locales.set(p.locale, p);

  function registerLocale(pack: LocalePack) {
    locales.set(pack.locale, pack);
  }
  function registerSystem(system: SystemDef) {
    systems.set(system.id, {
      ...system,
      units: [...system.units].sort((a, b) => Number(b.value - a.value)),
    });
  }
  function setAllowedFractions(fr: number[]) {
    allowedFractions = [...new Set(fr.concat(0))].sort((a, b) => a - b);
  }
  function setDefaultLocale(loc: string) {
    defaultLocale = loc;
  }

  function pickLocale(lang?: string): LocalePack {
    return locales.get(lang ?? defaultLocale) ?? locales.get(defaultLocale) ?? LOCALE_EN;
  }

  // Normalize any label candidate into a {words, abbr} node.
  // Accepts either a string or an object with words/abbr (possibly partial).
  function coerceNode(unitKey: string, candidate: any): { words: any; abbr: any } {
    if (!candidate) return { words: unitKey, abbr: unitKey };
    if (typeof candidate === 'string') return { words: candidate, abbr: candidate };
    const words = typeof candidate.words !== 'undefined' ? candidate.words : unitKey;
    const abbr = typeof candidate.abbr !== 'undefined' ? candidate.abbr : words;
    return { words, abbr };
  }

  function getLabelNode(
    unit: any, // allow unknown keys (e.g., "mega")
    lang: string,
  ): { words: any; abbr: any } {
    const pack = pickLocale(lang);
    const active = (pack.labels as any)?.[unit];
    if (active) return coerceNode(String(unit), active);
    const en = (LOCALE_EN.labels as any)?.[unit];
    if (en) return coerceNode(String(unit), en);
    return { words: String(unit), abbr: String(unit) };
  }

  // ---- Intl.NumberFormat locale resolution ----

  // helper: pick the first supported locale from a candidate list
  function pickSupportedLocale(list: Array<string | undefined | null>): string | null {
    for (const loc of list) {
      if (!loc) continue;
      if (Intl.NumberFormat.supportedLocalesOf([loc]).length > 0) return loc;
    }
    return null;
  }

  // ---- Intl.NumberFormat cache ----
  const nfCache = new Map<string, Intl.NumberFormat>();
  function getNumberFormat(loc: string, opts: Intl.NumberFormatOptions): Intl.NumberFormat {
    const key = loc + '|' + JSON.stringify(opts);
    const hit = nfCache.get(key);
    if (hit) return hit;
    const nf = new Intl.NumberFormat(loc, opts);
    nfCache.set(key, nf);
    return nf;
  }

  // ---- Intl.PluralRules cache (morphology) ----
  const prCache = new Map<string, Intl.PluralRules>();
  function getPluralRules(loc: string): Intl.PluralRules {
    const hit = prCache.get(loc);
    if (hit) return hit;
    let pr: Intl.PluralRules;
    try {
      pr = new Intl.PluralRules(loc, { type: 'cardinal' });
    } catch {
      pr = new Intl.PluralRules('en', { type: 'cardinal' });
    }
    prCache.set(loc, pr);
    return pr;
  }

  function selectForm(value: number, lang: string): keyof LabelForms {
    const pr = getPluralRules(lang);
    return pr.select(value) as keyof LabelForms;
  }

  function materializeLabel(val: LabelValue, value: number, lang: string): string {
    if (typeof val === 'string') return val;
    const cat = selectForm(value, lang);
    return val[cat] ?? val.other ?? val.one ?? val.few ?? val.many ?? val.two ?? val.zero ?? '';
  }

  function inflect(node: LabelNode, style: LabelStyle, value: number, lang: string): string {
    const v = style === 'abbr' ? node.abbr : node.words;
    return materializeLabel(v, value, lang);
  }

  function renderNumber(n: number, opts: FormatOptions, labelLang: string): string {
    const pack = pickLocale(opts.locale ?? labelLang);

    const preferred = pickSupportedLocale([
      opts.numberLocale,           // explicit override
      pack.rules?.numberLocale,    // locale rule hint
      defaultLocale,               // formatter default (may be invalid)
      'en-US',                     // guaranteed dot-decimal
      'en',                        // generic English
    ]);

    const options: Intl.NumberFormatOptions = {
      useGrouping: false,
      ...(pack.rules?.numberOptions ?? {}),
      ...(opts.numberOptions ?? {}),
    };

    if (preferred) {
      return getNumberFormat(preferred, options).format(n);
    }
    // Last resort: raw number to string
    return String(n);
  }

  function renderFallback(original: number | bigint, opts: FormatOptions, labelLang: string): string {
    // 1) Custom fallback gets the raw value untouched
    if (typeof opts.fallbackFn === 'function') {
      return opts.fallbackFn(original);
    }
    // 2) Built-in strategies
    if (opts.fallback === 'locale') {
      const n = typeof original === 'number' ? original : Number(original);
      return renderNumber(n, opts, labelLang);
    }
    // default: 'raw' → exact string of the original argument
    return typeof original === 'number' ? String(original) : original.toString();
  }

  function fractionDenominator(f: number): number {
    const s = f.toString();
    const i = s.indexOf('.');
    return i === -1 ? 1 : 10 ** (s.length - i - 1);
  }

  function exactFactor(absValue: bigint, unit: bigint, fractions: number[]): number | null {
    // exact integer multiple
    if (absValue % unit === 0n) return Number(absValue / unit);

    // exact k + f where f ∈ fractions
    for (const f of fractions) {
      if (f === 0) continue;
      const denom = fractionDenominator(f);
      const p = BigInt(Math.round(f * denom)); // numerator for f
      const d = BigInt(denom);

      // abs = unit * (k + f)  <=>  abs*d = unit*(k*d + p)
      const lhs = absValue * d;
      const rhsFrac = p * unit;

      const rem = (lhs - rhsFrac) % unit;
      if (rem !== 0n) continue;

      const kTimesD = (lhs - rhsFrac) / unit; // = k*d
      if (kTimesD < 0n || kTimesD % d !== 0n) continue;

      const k = Number(kTimesD / d);
      return k + f;
    }
    return null;
  }

  function format(value: number | bigint, options: FormatOptions = {}): string {
    const original = value; // keep raw user argument intact

    const { system = 'international', style = 'words' } = options;

    // validate numbers (NaN/Infinity and non-integers)
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) {
        return renderFallback(original, options, options.locale ?? defaultLocale);
      }
      if (!Number.isInteger(value)) {
        return renderFallback(original, options, options.locale ?? defaultLocale);
      }
    }

    const v = typeof value === 'bigint' ? value : BigInt(value);
    const absV = v < 0n ? -v : v;

    // Unknown system strategy
    const sys = systems.get(system);
    if (!sys) {
      if (unknownSystem === 'raw') {
        return renderFallback(original, options, options.locale ?? defaultLocale);
      }
      if (unknownSystem === 'locale') {
        return renderFallback(original, { ...options, fallback: 'locale' }, options.locale ?? defaultLocale);
      }
      if (typeof unknownSystem === 'object' && unknownSystem.use && systems.has(unknownSystem.use)) {
        return format(original, { ...options, system: unknownSystem.use }); // pass original
      }
      return renderFallback(original, options, options.locale ?? defaultLocale);
    }

    const smallest = sys.units[sys.units.length - 1]?.value ?? 1_000n;
    if (!allowSubSmallest && absV < smallest) {
      return renderFallback(original, options, options.locale ?? defaultLocale);
    }

    const lang = options.locale ?? defaultLocale;

    // allow exact sub-unit fractions of higher units
    for (const u of sys.units) {
      const factor = exactFactor(absV, u.value, allowedFractions);
      if (factor === null) continue;

      const pack = pickLocale(lang);
      const baseNode = getLabelNode(u.key, lang);

      // morphology with Intl.PluralRules (or custom resolveLabel)
      const wordsInflected = inflect(baseNode, 'words', factor, lang);
      const abbrInflected  = inflect(baseNode, 'abbr',  factor, lang);
      const chosen = style === 'abbr' ? abbrInflected : wordsInflected;

      const label = pack.rules?.resolveLabel
        ? pack.rules.resolveLabel(u.key, { words: wordsInflected, abbr: abbrInflected }, factor, style)
        : chosen;

      const numStr    = renderNumber(factor, options, lang);
      const joiner    = pack.rules?.joiner ?? ' ';
      const unitFirst = pack.rules?.unitOrder === 'before';
      const sign      = v < 0n ? '-' : '';

      let out = unitFirst ? `${label}${joiner}${numStr}` : `${numStr}${joiner}${label}`;
      if (pack.rules?.finalize) out = pack.rules.finalize(out);
      return sign + out;
    }

    return renderFallback(original, options, lang);
  }

  return {
    format,
    registerLocale,
    registerSystem,
    setAllowedFractions,
    setDefaultLocale,
  };
}

// Optional ready-to-use instance
export const defaultFormatter = createCompactFormatter();
