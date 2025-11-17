// MIT License
// comments in English only

import { LOCALE_EN } from './default-locale';
import { DEFAULT_SYSTEMS } from './default-systems';
import { exactFactor } from './internal/fractions';
import { createNumberFormatterCache, createPluralRulesSelector } from './internal/intl-cache';
import { createLabelHelpers } from './internal/labels';
import type {
  CompactConfig,
  CompactFormatter,
  FormatOptions,
  LocalePack,
  SystemDef,
  SystemId,
  UnknownSystemStrategy,
} from './types';

export * from './types';

export function createCompactFormatter(cfg?: Partial<CompactConfig>): CompactFormatter {
  const systems = new Map<SystemId, SystemDef>();
  const locales = new Map<string, LocalePack>();
  let defaultLocale = cfg?.defaultLocale ?? 'en';
  let allowedFractions = (cfg?.allowedFractions ?? [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9])
    .slice()
    .sort((a, b) => a - b);

  const allowSubSmallest = cfg?.allowSubSmallest ?? false;
  const unknownSystem: UnknownSystemStrategy = cfg?.unknownSystem ?? 'raw';

  for (const system of cfg?.systems ?? DEFAULT_SYSTEMS) {
    systems.set(system.id, {
      ...system,
      units: [...system.units].sort((a, b) => Number(b.value - a.value)),
    });
  }
  for (const locale of cfg?.locales ?? [LOCALE_EN]) locales.set(locale.locale, locale);

  function registerLocale(pack: LocalePack) {
    locales.set(pack.locale, pack);
  }

  function registerSystem(system: SystemDef) {
    systems.set(system.id, {
      ...system,
      units: [...system.units].sort((a, b) => Number(b.value - a.value)),
    });
  }

  function setAllowedFractions(fractions: number[]) {
    allowedFractions = [...new Set(fractions.concat(0))].sort((a, b) => a - b);
  }

  function setDefaultLocale(locale: string) {
    defaultLocale = locale;
  }

  function pickLocale(lang?: string): LocalePack {
    return locales.get(lang ?? defaultLocale) ?? locales.get(defaultLocale) ?? LOCALE_EN;
  }

  const getNumberFormatter = createNumberFormatterCache();
  const selectPluralForm = createPluralRulesSelector();
  const { getLabelNode, inflect } = createLabelHelpers(pickLocale, LOCALE_EN, selectPluralForm);

  function toRawString(original: number | bigint): string {
    return typeof original === 'number' ? String(original) : original.toString();
  }

  function renderFallback(original: number | bigint, opts: FormatOptions): string {
    if (typeof opts.fallbackFn === 'function') {
      return opts.fallbackFn(original);
    }
    return toRawString(original);
  }

  function format(value: number | bigint, options: FormatOptions = {}): string {
    const original = value;
    const { system = 'international', style = 'words' } = options;

    if (typeof value === 'number') {
      if (!Number.isFinite(value) || !Number.isInteger(value)) {
        return renderFallback(original, options);
      }
    }

    const v = typeof value === 'bigint' ? value : BigInt(value);
    const absV = v < 0n ? -v : v;

    const sys = systems.get(system);
    if (!sys) {
      if (unknownSystem === 'raw') {
        return renderFallback(original, options);
      }
      if (
        typeof unknownSystem === 'object' &&
        unknownSystem.use &&
        systems.has(unknownSystem.use)
      ) {
        return format(original, { ...options, system: unknownSystem.use });
      }
      return renderFallback(original, options);
    }

    const smallest = sys.units[sys.units.length - 1]?.value ?? 1_000n;
    if (!allowSubSmallest && absV < smallest) {
      return renderFallback(original, options);
    }

    const lang = options.locale ?? defaultLocale;

    for (const unit of sys.units) {
      const factor = exactFactor(absV, unit.value, allowedFractions);
      if (factor === null) continue;

      const pack = pickLocale(lang);
      const baseNode = getLabelNode(unit.key, lang);

      const wordsInflected = inflect(baseNode, 'words', factor, lang);
      const abbrInflected = inflect(baseNode, 'abbr', factor, lang);
      const chosen = style === 'abbr' ? abbrInflected : wordsInflected;

      const label = pack.rules?.resolveLabel
        ? pack.rules.resolveLabel(
            unit.key,
            { words: wordsInflected, abbr: abbrInflected },
            factor,
            style,
          )
        : chosen;

      const numStr = getNumberFormatter(lang).format(factor);
      const joiner = pack.rules?.joiner ?? ' ';
      const unitFirst = pack.rules?.unitOrder === 'before';
      const sign = v < 0n ? '-' : '';

      let out = unitFirst ? `${label}${joiner}${numStr}` : `${numStr}${joiner}${label}`;
      if (pack.rules?.finalize) out = pack.rules.finalize(out);
      return sign + out;
    }

    return renderFallback(original, options);
  }

  return {
    format,
    registerLocale,
    registerSystem,
    setAllowedFractions,
    setDefaultLocale,
  };
}

export const PreciseCompact = createCompactFormatter();
