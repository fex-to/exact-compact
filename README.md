# precise-compact

> **Exact** compact number formatter — no rounding, no approximation.  
> Human-readable units with per-locale **morphology** and on-demand i18n packs.

[![npm](https://img.shields.io/npm/v/@fex-to/precise-compact.svg)](https://www.npmjs.com/package/@fex-to/precise-compact)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](#license)
[![types](https://img.shields.io/badge/types-TypeScript-blue)](#usage)
[![bundle](https://img.shields.io/badge/deps-0-brightgreen)](#design-goals)

- ✅ **Exact only**: formats only exact integer multiples (and whitelisted fractions like `.5`, `.25`), never "~1.5M".
- 🌐 **Systems**: international (thousand/million/billion/trillion), Indian (lakh/crore/arab/kharab), East Asia (wan/yi).
- 🧠 **Morphology**: locale packs can implement grammar rules (plural, dual, case), e.g. Russian, Ukrainian, Arabic.
- 📦 **On-demand i18n**: core ships with **English only**; optional locale packs live under `precise-compact/i18n/*`.
- 🧩 **Bring-your-own numerals**: compact hits honor `locale` automatically; control raw fallbacks through `fallbackFn`.
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
- [Performance](#performance)
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
npm i @fex-to/precise-compact
# or
pnpm add @fex-to/precise-compact
# or
yarn add @fex-to/precise-compact
```

Node ≥ 18.17 (or ≥ 20). ESM & CJS are both supported.

---

## Usage

```ts
```ts
import { createCompactFormatter, PreciseCompact } from '@fex-to/precise-compact';

// 1) Quick start (English is built in)
PreciseCompact.format(1000); // "1 thousand"
PreciseCompact.format(1_000_000); // "1 million"
PreciseCompact.format(1500); // "1.5 thousand"
PreciseCompact.format(1501); // "1501" (not exact -> fallback raw)

// 2) Abbreviations
PreciseCompact.format(2_000_000, { style: 'abbr' }); // "2 M"

// 3) Indian system
PreciseCompact.format(100_000, { system: 'indian' }); // "1 lakh"
PreciseCompact.format(25_000_000, { system: 'indian' }); // "2.5 crore"
PreciseCompact.format(25_000_000, { system: 'indian', style: 'abbr' }); // "2.5 Cr"

// 4) East Asia system
PreciseCompact.format(10_000, { system: 'eastAsia' }); // "1 wan"
PreciseCompact.format(100_000_000, { system: 'eastAsia' }); // "1 yi"
```

```md
> ℹ️ Non-exact numbers (or values below the smallest unit) reuse the original digits. Provide a `fallbackFn` if you want localized plain numbers:
> ```ts
> const nf = new Intl.NumberFormat('de-DE', { useGrouping: true });
> PreciseCompact.format(1501, {
>   fallbackFn: (value) => (typeof value === 'bigint' ? value.toString() : nf.format(value)),
> }); // "1.501"
> ```

> Compact hits already localize according to `locale`, so you only need custom logic for fallback cases.
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
import { createCompactFormatter, type LocalePack } from '@fex-to/precise-compact';

const ruPack: LocalePack = {
  locale: 'ru',
  labels: {
    thousand: { words: 'тысяча', abbr: 'тыс.' },
    million: { words: 'миллион', abbr: 'млн' },
    billion: { words: 'миллиард', abbr: 'млрд' },
    trillion: { words: 'триллион', abbr: 'трлн' },
  },
  rules: {
    resolveLabel: (unit, base, factor, style) => {
      if (style === 'abbr') return base.abbr;
      const i = Math.floor(Math.abs(factor));
      const last2 = i % 100,
        last1 = i % 10;
      const forms =
        unit === 'thousand'
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
    },
  },
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
  system?: SystemId; // default: 'international'
  style?: LabelStyle; // default: 'words'
  fallbackFn?: (value: number | bigint) => string; // custom fallback when value isn't exact
  locale?: string; // labels locale override
}

interface CompactFormatter {
  format(value: number | bigint, options?: FormatOptions): string;
  registerLocale(pack: LocalePack): void;
  registerSystem(system: SystemDef): void;
  setAllowedFractions(fractions: number[]): void; // default: [0, 0.5]
  setDefaultLocale(locale: string): void;
}

function createCompactFormatter(cfg?: Partial<CompactConfig>): CompactFormatter;
export const PreciseCompact: CompactFormatter;
```

`CompactConfig` also supports `defaultLocale` and advanced toggles (see below).

---

## Performance

Benchmarks run on **100,000 iterations** per case with 2 warmup runs. Performance varies by locale complexity, morphology rules, and abbreviation style.

**Test Environment:**
- Host: darwin 25.1.0 (arm64)
- CPU: Apple M2 Max x12
- RAM: 32.0 GB

**Results (sorted by ops/sec):**

| Case | Sample Output | ops/sec |
| --- | --- | ---:|
| Fallback (raw) | `720`, `750` | ~27M |
| English compact | `1 million` | ~460K |
| Thai compact/abbr | `45 ล`, `30 ล้าน` | ~460K |
| Russian/Ukrainian abbr | `2 млн`, `3 млн` | ~365K |
| Arabic compact/abbr | `7 ملايين`, `12 م` | ~330K |
| Japanese compact/abbr | `12千`, `120千` | ~325K |
| French compact | `9,9 milliards` | ~306K |
| English abbr | `250 K` | ~295K |
| German compact | `2,5 Millionen` | ~292K |
| Spanish compact | `3,4 millones` | ~287K |
| Ukrainian morphology | `2,1 тисячі` | ~259K |
| Portuguese abbr | `4,5 mi` | ~250K |
| Russian morphology | `1,5 тысячи` | ~230K |

_See [benchmarks/locale-bench-report.md](./benchmarks/locale-bench-report.md) for full details._

---

## Advanced

### Custom systems

```ts
fmt.registerSystem({
  id: 'custom',
  units: [
    { key: 'million', value: 1_000_000n },
    { key: 'thousand', value: 1_000n },
  ],
});

fmt.format(3_000_000, { system: 'custom' }); // "3 million"
```

### Allowed fractions

By default only `[0, 0.5]` are allowed. You can extend:

```ts
fmt.setAllowedFractions([0, 0.25, 0.5, 0.75, 0.1]);

fmt.format(125_000, { system: 'indian' }); // "1.25 lakh"
fmt.format(75_000, { system: 'indian' }); // "0.75 lakh"
```

### Fallback behavior

- Defaults to returning the original argument as a string whenever the value is not an exact match.
- Supply `fallbackFn` to render those cases however you like (Intl, custom digit sets, etc.).
- Compact hits already respect `locale`; rely on `fallbackFn` when values drop out of compact mode.

```ts
const nf = new Intl.NumberFormat('de-DE', { useGrouping: true });

fmt.format(1501, {
  fallbackFn: (value) => (typeof value === 'bigint' ? value.toString() : nf.format(value)),
}); // "1.501"
```

You control locale/digit fallbacks inside the function. If a locale is unsupported by `Intl.NumberFormat`, catch the error or provide your own formatting logic.

### Below smallest unit

If the absolute value is **below smallest unit** of the selected system (e.g., `< 1000` for international), the library falls back.  
You can still make sub-unit fractions possible by allowing them:

```ts
// Example: 500 → "0.5 thousand" if halves are allowed
const f = createCompactFormatter({
  /* optional cfg */
});
f.setAllowedFractions([0, 0.5]);
f.format(500); // "0.5 thousand"
```

> If you want to **forbid** sub-unit fractions, keep the default allowed fractions or remove 0.5 from the list.

---

## Design goals

- **Deterministic**: never approximates; formats only exact matches.
- **Native**: leans on `Intl.PluralRules`; you attach your preferred number formatter via `fallbackFn`.
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
import ru from '@fex-to/precise-compact/i18n/ru';
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
**A:** Yes — input can be `number | bigint`. The default fallback returns the original digits; if you supply a `fallbackFn`, convert `bigint` values to strings before calling `Intl.NumberFormat` (or similar).

**Q: How do I force localized fallback numbers?**  
**A:** Pass `fallbackFn` and call `Intl.NumberFormat` (or any formatter) inside it. You control grouping, digit sets, and locale error handling there.

**Q: How to handle RTL (Arabic/Hebrew)?**  
**A:** Add `rules.finalize` to wrap with `\u200F` marks; pick digit sets via your `fallbackFn` (e.g., `Intl.NumberFormat('ar-EG-u-nu-arab')`).

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
import { PreciseCompact } from '@fex-to/precise-compact';

PreciseCompact.format(1_000); // "1 thousand"
PreciseCompact.format(1_500); // "1.5 thousand"
PreciseCompact.format(1_000_000); // "1 million"
PreciseCompact.format(1_501); // "1501"
```

**2) Russian with morphology**

```ts
import { createCompactFormatter } from '@fex-to/precise-compact';
import ru from '@fex-to/precise-compact/i18n/ru';

const fmt = createCompactFormatter();
fmt.registerLocale(ru);

fmt.format(1_000, { locale: 'ru' }); // "1 тысяча"
fmt.format(2_000, { locale: 'ru' }); // "2 тысячи"
fmt.format(5_000, { locale: 'ru' }); // "5 тысяч"
```

**3) Indian system (fractions)**

```ts
import { PreciseCompact } from '@fex-to/precise-compact';

PreciseCompact.setAllowedFractions([0, 0.25, 0.5, 0.75]);
PreciseCompact.format(125_000, { system: 'indian' }); // "1.25 lakh"
PreciseCompact.format(75_000, { system: 'indian' }); // "0.75 lakh"
```

**4) East Asia + zh-CN joiner**

```ts
import { createCompactFormatter, type LocalePack } from '@fex-to/precise-compact';

const zhCN: LocalePack = {
  locale: 'zh-CN',
  labels: {
    wan: { words: '万', abbr: '万' },
    yi: { words: '亿', abbr: '亿' },
    thousand: { words: '千', abbr: '千' },
  },
  rules: { joiner: '' },
};

const fmt = createCompactFormatter();
fmt.registerLocale(zhCN);

fmt.format(10_000, { system: 'eastAsia', locale: 'zh-CN' }); // "1万"
fmt.format(100_000_000, { system: 'eastAsia', locale: 'zh-CN' }); // "1亿"
```
