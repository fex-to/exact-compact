import type { LabelForms } from '../types';

export function createNumberFormatterCache() {
  const cache = new Map<string, Intl.NumberFormat>();

  return function getNumberFormatter(loc: string): Intl.NumberFormat {
    const key = loc || 'en';
    const cached = cache.get(key);
    if (cached) return cached;

    const candidates: string[] = [];
    if (loc) {
      candidates.push(loc);
      const dash = loc.indexOf('-');
      if (dash > 0) candidates.push(loc.slice(0, dash));
    }
    candidates.push('en');

    let formatter: Intl.NumberFormat | null = null;
    for (const cand of candidates) {
      try {
        formatter = new Intl.NumberFormat(cand, {
          useGrouping: false,
          maximumFractionDigits: 20,
          numberingSystem: 'latn',
        });
        break;
      } catch {
        continue;
      }
    }

    if (!formatter) {
      formatter = new Intl.NumberFormat('en', {
        useGrouping: false,
        maximumFractionDigits: 20,
        numberingSystem: 'latn',
      });
    }

    cache.set(key, formatter);
    return formatter;
  };
}

export function createPluralRulesSelector() {
  const cache = new Map<string, Intl.PluralRules>();

  function getPluralRules(loc: string): Intl.PluralRules {
    const hit = cache.get(loc);
    if (hit) return hit;
    let pr: Intl.PluralRules;
    try {
      pr = new Intl.PluralRules(loc, { type: 'cardinal' });
    } catch {
      pr = new Intl.PluralRules('en', { type: 'cardinal' });
    }
    cache.set(loc, pr);
    return pr;
  }

  return function selectForm(value: number, lang: string): keyof LabelForms {
    const pr = getPluralRules(lang);
    return pr.select(value) as keyof LabelForms;
  };
}
