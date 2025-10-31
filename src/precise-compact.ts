// MIT License
// comments in English only

export type SystemId = "international" | "indian" | "eastAsia" | (string & {}); // allow custom ids

export type LabelStyle = "words" | "abbr";

export interface FormatOptions {
  system?: SystemId; // default: 'international'
  style?: LabelStyle; // default: 'words'
  fallback?: "raw" | "locale"; // default: 'raw'
  locale?: string; // labels locale override
  numberLocale?: string; // Intl locale for numbers (e.g., 'ar-EG-u-nu-arab')
  numberOptions?: Intl.NumberFormatOptions; // Intl options override for numbers
}

export type UnitKey =
  | "thousand"
  | "million"
  | "billion"
  | "trillion"
  | "lakh"
  | "crore"
  | "arab"
  | "kharab"
  | "wan"
  | "yi";

export interface UnitDef {
  key: UnitKey;
  value: bigint;
}

export interface SystemDef {
  id: SystemId;
  units: UnitDef[];
}

export interface LocaleRules {
  rtl?: boolean; // bidi hint
  joiner?: "" | " " | "\u00A0" | "\u202F"; // between number and label; default ' '
  unitOrder?: "after" | "before"; // default 'after' -> "1 million"
  numberLocale?: string; // default: pack.locale
  numberOptions?: Intl.NumberFormatOptions; // default: { useGrouping: false }
  resolveLabel?: (
    unitKey: UnitKey,
    base: { words: string; abbr: string },
    factor: number,
    style: LabelStyle
  ) => string;
  finalize?: (text: string) => string; // final tweak (e.g., add RLM)
}

export interface LocalePack {
  locale: string; // e.g., 'en', 'en-GB'
  labels: { [unit in UnitKey]?: { words: string; abbr: string } };
  rules?: LocaleRules;
}

// --- NEW: unknown system strategy ---
export type UnknownSystemStrategy = "raw" | "locale" | { use: SystemId }; // e.g. { use: 'international' }

export interface CompactConfig {
  systems?: SystemDef[];
  locales?: LocalePack[];
  defaultLocale?: string; // default: 'en'
  allowedFractions?: number[]; // default: [0, 0.5]
  // NEW: control behavior for values below the smallest unit
  allowSubSmallest?: boolean; // default: false
  // NEW: control behavior for unknown system id
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
  id: "international",
  units: [
    { key: "trillion", value: 1_000_000_000_000n },
    { key: "billion", value: 1_000_000_000n },
    { key: "million", value: 1_000_000n },
    { key: "thousand", value: 1_000n },
  ],
};

const SYSTEM_INDIAN: SystemDef = {
  id: "indian",
  units: [
    { key: "kharab", value: 100_000_000_000n }, // 10^11
    { key: "arab", value: 1_000_000_000n }, // 10^9
    { key: "crore", value: 10_000_000n }, // 10^7
    { key: "lakh", value: 100_000n }, // 10^5
    { key: "thousand", value: 1_000n }, // 10^3
  ],
};

const SYSTEM_EAST_ASIA: SystemDef = {
  id: "eastAsia",
  units: [
    { key: "yi", value: 100_000_000n }, // 10^8
    { key: "wan", value: 10_000n }, // 10^4
    { key: "thousand", value: 1_000n }, // convenience
  ],
};

// ---- default English locale only ----

const LOCALE_EN: LocalePack = {
  locale: "en",
  labels: {
    thousand: { words: "thousand", abbr: "K" },
    million: { words: "million", abbr: "M" },
    billion: { words: "billion", abbr: "B" },
    trillion: { words: "trillion", abbr: "T" },
    lakh: { words: "lakh", abbr: "L" },
    crore: { words: "crore", abbr: "Cr" },
    arab: { words: "arab", abbr: "Ar" },
    kharab: { words: "kharab", abbr: "Khar" },
    wan: { words: "wan", abbr: "w" },
    yi: { words: "yi", abbr: "y" },
  },
  rules: {
    joiner: " ",
    unitOrder: "after",
    numberOptions: { useGrouping: false },
  },
};

// ---- factory ----

export function createCompactFormatter(
  cfg?: Partial<CompactConfig>
): CompactFormatter {
  const systems = new Map<SystemId, SystemDef>();
  const locales = new Map<string, LocalePack>();
  let defaultLocale = cfg?.defaultLocale ?? "en";
  let allowedFractions = (cfg?.allowedFractions ?? [0, 0.5])
    .slice()
    .sort((a, b) => a - b);

  // NEW: config flags
  const allowSubSmallest = cfg?.allowSubSmallest ?? false;
  const unknownSystem = cfg?.unknownSystem ?? "raw";

  for (const s of cfg?.systems ?? [
    SYSTEM_INTL,
    SYSTEM_INDIAN,
    SYSTEM_EAST_ASIA,
  ]) {
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
    return (
      locales.get(lang ?? defaultLocale) ??
      locales.get(defaultLocale) ??
      LOCALE_EN
    );
  }

  function getLabelNode(
    unit: UnitKey,
    lang: string
  ): { words: string; abbr: string } {
    const pack = pickLocale(lang);
    const node = pack.labels[unit];
    if (node) return node;
    const en = LOCALE_EN.labels[unit];
    return en ?? { words: unit, abbr: unit };
  }

  function pickLabel(unit: UnitKey, style: LabelStyle, lang: string): string {
    const node = getLabelNode(unit, lang);
    return node[style];
  }

  // ---- NEW: Intl.NumberFormat cache ----
  const nfCache = new Map<string, Intl.NumberFormat>();
  function getNumberFormat(
    loc: string,
    opts: Intl.NumberFormatOptions
  ): Intl.NumberFormat {
    const key = loc + "|" + JSON.stringify(opts);
    const hit = nfCache.get(key);
    if (hit) return hit;
    const nf = new Intl.NumberFormat(loc, opts);
    nfCache.set(key, nf);
    return nf;
  }

  function renderNumber(
    n: number,
    opts: FormatOptions,
    labelLang: string
  ): string {
    const pack = pickLocale(opts.locale ?? labelLang);
    const candidate =
      opts.numberLocale ?? pack.rules?.numberLocale ?? opts.locale ?? labelLang;

    const options: Intl.NumberFormatOptions = {
      useGrouping: false,
      ...(pack.rules?.numberOptions ?? {}),
      ...(opts.numberOptions ?? {}),
    };

    // First try the primary candidate
    try {
      return getNumberFormat(candidate, options).format(n);
    } catch {
      // Robust fallback chain: rules.numberLocale -> defaultLocale -> en-US -> en
      const fallbacks = [
        pack.rules?.numberLocale,
        defaultLocale,
        "en-US",
        "en",
      ].filter(Boolean) as string[];

      for (const loc of fallbacks) {
        try {
          return getNumberFormat(loc, options).format(n);
        } catch {
          /* continue */
        }
      }
      // Last resort: return raw number as string
      return String(n);
    }
  }

  function renderFallback(
    n: number | bigint,
    opts: FormatOptions,
    labelLang: string
  ): string {
    if (opts.fallback === "locale") {
      const v = typeof n === "number" ? n : Number(n);
      return renderNumber(v, opts, labelLang);
    }
    return typeof n === "number" ? String(n) : n.toString();
  }

  function fractionDenominator(f: number): number {
    const s = f.toString();
    const i = s.indexOf(".");
    return i === -1 ? 1 : 10 ** (s.length - i - 1);
  }

  function exactFactor(
    absValue: bigint,
    unit: bigint,
    fractions: number[]
  ): number | null {
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
    const { system = "international", style = "words" } = options;

    // NEW: validate numbers (NaN/Infinity)
    if (typeof value === "number") {
      if (!Number.isFinite(value)) {
        return renderFallback(value, options, options.locale ?? defaultLocale);
      }
      if (!Number.isInteger(value)) {
        return renderFallback(value, options, options.locale ?? defaultLocale);
      }
    }

    const v = typeof value === "bigint" ? value : BigInt(value);
    const absV = v < 0n ? -v : v;

    // Unknown system strategy
    const sys = systems.get(system);
    if (!sys) {
      if (unknownSystem === "raw") {
        return renderFallback(
          value as number,
          options,
          options.locale ?? defaultLocale
        );
      }
      if (unknownSystem === "locale") {
        return renderFallback(
          value as number,
          { ...options, fallback: "locale" },
          options.locale ?? defaultLocale
        );
      }
      if (
        typeof unknownSystem === "object" &&
        unknownSystem.use &&
        systems.has(unknownSystem.use)
      ) {
        return format(value, { ...options, system: unknownSystem.use });
      }
      // default safe
      return renderFallback(
        value as number,
        options,
        options.locale ?? defaultLocale
      );
    }

    const smallest = sys.units[sys.units.length - 1]?.value ?? 1_000n;
    if (!allowSubSmallest && absV < smallest) {
      return renderFallback(
        value as number,
        options,
        options.locale ?? defaultLocale
      );
    }

    const lang = options.locale ?? defaultLocale;

    // IMPORTANT: allow exact sub-unit fractions of higher units (no check absV < u.value)
    for (const u of sys.units) {
      const factor = exactFactor(absV, u.value, allowedFractions);
      if (factor === null) continue;

      const pack = pickLocale(lang);
      const baseNode = getLabelNode(u.key, lang);
      const baseLabel = baseNode[style];
      const label = pack.rules?.resolveLabel
        ? pack.rules.resolveLabel(u.key, baseNode, factor, style)
        : baseLabel;

      const numStr = renderNumber(factor, options, lang);
      const joiner = pack.rules?.joiner ?? " ";
      const unitFirst = pack.rules?.unitOrder === "before";
      const sign = v < 0n ? "-" : "";

      let out = unitFirst
        ? `${label}${joiner}${numStr}`
        : `${numStr}${joiner}${label}`;
      if (pack.rules?.finalize) out = pack.rules.finalize(out);
      return sign + out;
    }

    return renderFallback(value as number, options, lang);
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
