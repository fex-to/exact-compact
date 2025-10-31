# precise-compact

> **Exact** compact number formatter — no rounding, no approximation.  
> Human-readable units with per-locale **morphology** and on-demand i18n packs.

[![npm](https://img.shields.io/npm/v/precise-compact.svg)](https://www.npmjs.com/package/precise-compact)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](#usage)
[![bundle](https://img.shields.io/badge/deps-0-brightgreen)](#design-goals)

- ✅ **Exact only**: formats only exact integer multiples (and whitelisted fractions like `.5`, `.25`), never “~1.5M”.
- 🌐 **Systems**: international (thousand/million/billion/trillion), Indian (lakh/crore/arab/kharab), East Asia (wan/yi).
- 🧠 **Morphology**: locale packs can implement grammar rules (plural, dual, case), e.g. Russian, Ukrainian, Arabic.
- 📦 **On-demand i18n**: core ships with **English only**; optional locale packs live under `precise-compact/i18n/*`.
- 🧩 **Intl-native**: relies on **Intl.NumberFormat** only (no custom decimal logic), robust fallback chain.
- ⚙️ **TypeScript-first** API; ESM & CJS exports; zero runtime deps.

---

## Table of contents

- [Why](#why)
- [Install](#install)
- [Usage](#usage)
- [Exactness rules](#exactness-rules)
- [Internationalization (i18n)](#internationalization-i18n)
  - [What is morphology?](#what-is-morphology)
  - [Registering a locale](#registering-a-locale)
  - [Writing morphology rules](#writing-morphology-rules)
- [Numbering systems](#numbering-systems)
- [API](#api)
- [Advanced](#advanced)
  - [Custom systems](#custom-systems)
  - [Allowed fractions](#allowed-fractions)
  - [Fallback behavior](#fallback-behavior)
  - [Below smallest unit](#below-smallest-unit)
- [Design goals](#design-goals)
- [Build & i18n packs](#build--i18n-packs)
- [FAQ](#faq)
- [Contributing](#contributing)
- [License](#license)

---

## Why

Built-in compact notations (e.g., `Intl.NumberFormat({ notation: 'compact' })`) are great, but they **approximate** (round), and don’t let you enforce “exact only” semantics. This library:

- Converts **only** when a value is an exact multiple of a unit or a permitted fraction (e.g., `1500 → 1.5 thousand`, but `1501 → 1501`).
- Supports **Indian** and **East Asian** long scales (lakh/crore, wan/yi).
- Lets you implement **morphology** to pick the grammatically correct label (e.g., Russian: `1 тысяча`, `2 тысячи`, `5 тысяч`).

---

## Install

```bash
npm i precise-compact
# or
pnpm add precise-compact
# or
yarn add precise-compact
```

Node ≥ 18.17 (or ≥ 20). ESM & CJS are both supported.

---

## Usage

```ts
import { createCompactFormatter, defaultFormatter } from 'precise-compact';

// 1) Quick start (English is built in)
defaultFormatter.format(1000);        // "1 thousand"
defaultFormatter.format(1_000_000);   // "1 million"
defaultFormatter.format(1500);        // "1.5 thousand"
defaultFormatter.format(1501);        // "1501" (not exact -> fallback raw)

// 2) Abbreviations
defaultFormatter.format(2_000_000, { style: 'abbr' }); // "2 M"

// 3) Indian system
defaultFormatter.format(100_000, { system: 'indian' });           // "1 lakh"
defaultFormatter.format(25_000_000, { system: 'indian' });        // "2.5 crore"
defaultFormatter.format(25_000_000, { system: 'indian', style: 'abbr' }); // "2.5 Cr"

// 4) East Asia system
defaultFormatter.format(10_000, { system: 'eastAsia' });   // "1 wan"
defaultFormatter.format(100_000_000, { system: 'eastAsia' }); // "1 yi"
```

> ℹ️ For non-exact numbers (or values below the smallest unit), you can instruct the library to fallback to localized plain numbers:  
> `format(1501, { fallback: 'locale', numberLocale: 'de-DE', numberOptions: { useGrouping: true } }) → "1.501"`

---

## Exactness rules

- **Exact integer multiples:** `k * unit` → formatted (`1_000 → 1 thousand`).
- **Whitelisted fractions:** only those explicitly allowed by `setAllowedFractions([0, 0.5, 0.25, 0.1, ...])`.  
  Example: `1.5 * 1000 → 1.5 thousand`, but `1.3 * 1000 → 1300` (fallback) unless `0.3` is allowed.
- **No approximation:** Values like `1499`, `1501`, `999` fall back.

---

## Internationalization (i18n)

Core ships with **English** labels only. You can load **optional** locale packs **on demand**:

```ts
import { createCompactFormatter } from 'precise-compact';

// On-demand locale (tree-shakable)
import ru from 'precise-compact/i18n/ru'; // or any of ~50 packs in ./i18n

const fmt = createCompactFormatter();
fmt.registerLocale(ru);

// Uses Russian morphology from the pack (see below)
fmt.format(1000, { locale: 'ru' }); // "1 тысяча" / "2 тысячи" / "5 тысяч"
```

### What is morphology?

**Morphology** is how words change form depending on a number/grammatical context.  
Examples:

- **Russian**: `1 тысяча`, `2 тысячи`, `5 тысяч`
- **Ukrainian**: `1 тисяча`, `2 тисячі`, `5 тисяч`
- **Polish**: `1 tysiąc`, `2 tysiące`, `5 tysięcy`
- **Arabic**: dual forms, right-to-left markers, digit sets
- **English**: usually invariant (“1 thousand”, “2 thousand”)

Locale packs can ship a `rules.resolveLabel` function to dynamically choose the correct label form.

### Registering a locale

```ts
import { createCompactFormatter, type LocalePack } from 'precise-compact';

const ruPack: LocalePack = {
  locale: 'ru',
  labels: {
    thousand: { words: 'тысяча', abbr: 'тыс.' },
    million:  { words: 'миллион', abbr: 'млн'  },
    billion:  { words: 'миллиард', abbr: 'млрд' },
    trillion: { words: 'триллион', abbr: 'трлн' }
  },
  rules: {
    numberLocale: 'ru-RU',
    resolveLabel: (unit, base, factor, style) => {
      if (style === 'abbr') return base.abbr;
      const i = Math.floor(Math.abs(factor));
      const last2 = i % 100, last1 = i % 10;
      const forms = unit === 'thousand'
        ? ['тысяча', 'тысячи', 'тысяч']
        : unit === 'million'
        ? ['миллион', 'миллиона', 'миллионов']
        : unit === 'billion'
        ? ['миллиард', 'миллиарда', 'миллиардов']
        : ['триллион', 'триллиона', 'триллионов'];
      if (last2 >= 11 && last2 <= 14) return forms[2];
      if (last1 === 1) return forms[0];
      if (last1 >= 2 && last1 <= 4) return forms[1];
      return forms[2];
    }
  }
};

const fmt = createCompactFormatter();
fmt.registerLocale(ruPack);
fmt.format(2_000, { locale: 'ru' }); // "2 тысячи"
```

### Writing morphology rules

Each locale can implement:

- `rules.resolveLabel(unitKey, base, factor, style)` → returns the string label.
- `rules.joiner` (`" "`, `" "`, `""`), `rules.unitOrder` (`'after'` or `'before'`).
- `rules.finalize(text)` for bidi marks, punctuation, etc.
- `rules.numberLocale` / `rules.numberOptions`: passed to `Intl.NumberFormat`.

---

## Numbering systems

Available out of the box:

- **international**: thousand (10³), million (10⁶), billion (10⁹), trillion (10¹²)
- **indian**: thousand (10³), lakh (10⁵), crore (10⁷), arab (10⁹), kharab (10¹¹)
- **eastAsia**: wan (10⁴), yi (10⁸) [+ thousand for convenience]

Pick via `format(value, { system: 'indian' })` etc.

---

## API

```ts
type SystemId = 'international' | 'indian' | 'eastAsia' | (string & {});

type LabelStyle = 'words' | 'abbr';

interface FormatOptions {
  system?: SystemId;                   // default: 'international'
  style?: LabelStyle;                  // default: 'words'
  fallback?: 'raw' | 'locale';         // default: 'raw'
  locale?: string;                     // labels locale override
  numberLocale?: string;               // Intl locale, e.g. 'ar-EG-u-nu-arab'
  numberOptions?: Intl.NumberFormatOptions; // Intl options
}

interface CompactFormatter {
  format(value: number | bigint, options?: FormatOptions): string;
  registerLocale(pack: LocalePack): void;
  registerSystem(system: SystemDef): void;
  setAllowedFractions(fractions: number[]): void; // default: [0, 0.5]
  setDefaultLocale(locale: string): void;
}

function createCompactFormatter(cfg?: Partial<CompactConfig>): CompactFormatter;
export const defaultFormatter: CompactFormatter;
```

`CompactConfig` also supports `defaultLocale` and advanced toggles (see below).

---

## Advanced

### Custom systems

```ts
fmt.registerSystem({
  id: 'custom',
  units: [
    { key: 'million',  value: 1_000_000n },
    { key: 'thousand', value: 1_000n }
  ]
});

fmt.format(3_000_000, { system: 'custom' }); // "3 million"
```

### Allowed fractions

By default only `[0, 0.5]` are allowed. You can extend:

```ts
fmt.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);

fmt.format(125_000, { system: 'indian' }); // "1.25 lakh"
fmt.format(75_000,  { system: 'indian' }); // "0.75 lakh"
```

### Fallback behavior

- `fallback: 'raw'` (default) → return original value as string when not exact.
- `fallback: 'locale'` → format plain number via `Intl.NumberFormat`.

```ts
fmt.format(1501, {
  fallback: 'locale',
  numberLocale: 'de-DE',
  numberOptions: { useGrouping: true }
}); // "1.501"
```

Robust fallback chain for invalid locales: tries `numberLocale` → `defaultLocale` → `'en-US'` → `'en'`.

### Below smallest unit

If the absolute value is **below smallest unit** of the selected system (e.g., `< 1000` for international), the library falls back.  
You can still make sub-unit fractions possible by allowing them:

```ts
// Example: 500 → "0.5 thousand" if halves are allowed
const f = createCompactFormatter({ /* optional cfg */ });
f.setAllowedFractions([0, 0.5]);
f.format(500); // "0.5 thousand"
```

> If you want to **forbid** sub-unit fractions, keep the default allowed fractions or remove 0.5 from the list.

---

## Design goals

- **Deterministic**: never approximates; formats only exact matches.
- **Native**: uses `Intl.NumberFormat` for numerals & separators.
- **Composable**: locale packs are pure data + small rule hooks.
- **Lightweight**: zero runtime deps; ESM/CJS builds; tree-shakeable i18n.

---

## Build & i18n packs

This repo uses:

- `tsup` for dual ESM/CJS builds + `.d.ts`.
- `tsx` for running small Node scripts (e.g., generating locale packs).
- `vitest` for tests with coverage.

Generated on-demand packs live in `./i18n` (source `.ts`) and are bundled to `dist/i18n/*.mjs|*.cjs|*.d.ts`. They are **not** auto-imported by core; you import what you need:

```ts
import ru from 'precise-compact/i18n/ru';
fmt.registerLocale(ru);
```

### Project scripts

```bash
# fresh install
npm install

# tests + coverage
npm test

# build (generates ./i18n then bundles)
npm run build

# optional clean
npm run clean

# publish safety
npm run prepublishOnly  # runs tests + build
```

---

## FAQ

**Q: Why not use `Intl.NumberFormat` with `notation: 'compact'`?**  
**A:** It rounds/approximates (e.g., `1499000 → 1.5M`). We need **exact** thresholds and custom systems + morphology.

**Q: Does it support BigInt?**  
**A:** Yes — input can be `number | bigint`. Fallback number rendering converts BigInt to number safely for display.

**Q: How do I force localized fallback numbers?**  
**A:** Use `fallback: 'locale'` with `numberLocale` and `numberOptions`.

**Q: How to handle RTL (Arabic/Hebrew)?**  
**A:** Add `rules.finalize` to wrap with `\u200F` marks; choose digit sets via `numberLocale` (e.g., `'ar-EG-u-nu-arab'`).

---

## Contributing

- PRs welcome for: new locale packs, morphology improvements, tests.
- Keep **code comments in English**.
- Use UTF-8; avoid ASCII-escaped `\uXXXX` in sources.
- Add tests for every new morphology rule and system.

---

## License

[MIT](./LICENSE)

---

### Quick examples (copy-paste)

**1) English (built in)**

```ts
import { defaultFormatter } from 'precise-compact';

defaultFormatter.format(1_000);      // "1 thousand"
defaultFormatter.format(1_500);      // "1.5 thousand"
defaultFormatter.format(1_000_000);  // "1 million"
defaultFormatter.format(1_501);      // "1501"
```

**2) Russian with morphology**

```ts
import { createCompactFormatter } from 'precise-compact';
import ru from 'precise-compact/i18n/ru';

const fmt = createCompactFormatter();
fmt.registerLocale(ru);

fmt.format(1_000, { locale: 'ru' }); // "1 тысяча"
fmt.format(2_000, { locale: 'ru' }); // "2 тысячи"
fmt.format(5_000, { locale: 'ru' }); // "5 тысяч"
```

**3) Indian system (fractions)**

```ts
import { defaultFormatter as fmt } from 'precise-compact';

fmt.setAllowedFractions([0, 0.25, 0.5, 0.75]);
fmt.format(125_000, { system: 'indian' }); // "1.25 lakh"
fmt.format(75_000,  { system: 'indian' }); // "0.75 lakh"
```

**4) East Asia + zh-CN joiner**

```ts
import { createCompactFormatter, type LocalePack } from 'precise-compact';

const zhCN: LocalePack = {
  locale: 'zh-CN',
  labels: {
    wan: { words: '万', abbr: '万' },
    yi:  { words: '亿', abbr: '亿' },
    thousand: { words: '千', abbr: '千' },
  },
  rules: { joiner: '', numberLocale: 'zh-CN' },
};

const fmt = createCompactFormatter();
fmt.registerLocale(zhCN);

fmt.format(10_000, { system: 'eastAsia', locale: 'zh-CN' }); // "1万"
fmt.format(100_000_000, { system: 'eastAsia', locale: 'zh-CN' }); // "1亿"
```
