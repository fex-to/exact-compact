import type { LabelForms, LabelNode, LabelStyle, LabelValue, LocalePack } from '../types';

export type LocalePicker = (lang?: string) => LocalePack;
export type PluralSelector = (value: number, lang: string) => keyof LabelForms;

function coerceNode(unitKey: string, candidate: any): { words: LabelValue; abbr: LabelValue } {
  if (!candidate) return { words: unitKey, abbr: unitKey };
  if (typeof candidate === 'string') return { words: candidate, abbr: candidate };
  const words = typeof candidate.words !== 'undefined' ? candidate.words : unitKey;
  const abbr = typeof candidate.abbr !== 'undefined' ? candidate.abbr : words;
  return { words, abbr };
}

function materializeLabel(
  value: LabelValue,
  factor: number,
  lang: string,
  selectPluralForm: PluralSelector,
): string {
  if (typeof value === 'string') return value;
  const category = selectPluralForm(factor, lang);
  return (
    value[category] ??
    value.other ??
    value.one ??
    value.few ??
    value.many ??
    value.two ??
    value.zero ??
    ''
  );
}

export function createLabelHelpers(
  pickLocale: LocalePicker,
  fallbackLocale: LocalePack,
  selectPluralForm: PluralSelector,
) {
  function getLabelNode(unit: any, lang: string): LabelNode {
    const pack = pickLocale(lang);
    const active = (pack.labels as any)?.[unit];
    if (active) return coerceNode(String(unit), active);
    const fallback = (fallbackLocale.labels as any)?.[unit];
    if (fallback) return coerceNode(String(unit), fallback);
    return { words: String(unit), abbr: String(unit) };
  }

  function inflect(node: LabelNode, style: LabelStyle, factor: number, lang: string): string {
    const source = style === 'abbr' ? node.abbr : node.words;
    return materializeLabel(source, factor, lang, selectPluralForm);
  }

  return {
    getLabelNode,
    inflect,
  };
}
