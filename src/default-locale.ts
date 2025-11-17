import type { LocalePack } from './types';

export const LOCALE_EN: LocalePack = {
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
  },
};
