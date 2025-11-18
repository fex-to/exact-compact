<div align="center">

# precise-compact

**Intl.NumberFormat wrapper that shows compact notation ONLY for exact numbers**

[![npm version](https://img.shields.io/npm/v/@fex-to/precise-compact.svg)](https://www.npmjs.com/package/@fex-to/precise-compact)
[![npm downloads](https://img.shields.io/npm/dm/@fex-to/precise-compact.svg)](https://www.npmjs.com/package/@fex-to/precise-compact)
[![CI](https://img.shields.io/github/actions/workflow/status/fex-to/precise-compact/ci.yml?branch=main)](https://github.com/fex-to/precise-compact/actions)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/fex-to/precise-compact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)

**Problem:** Native `Intl.NumberFormat` with `compact` notation shows `1234` as `"1.2K"` (loses precision)  
**Solution:** This library shows `"1K"` or `"1 thousand"` for exact `1000`, but keeps `"1,234"` for non-exact `1234`

Supports words (thousand, тысяча, लाख, 万) and all numbering systems (Western, Indian, Chinese, Japanese, Arabic)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api)

</div>

---

## ✨ Features

- 🎯 **No approximations** — Shows compact (1.5K, "1.5 thousand") **only for exact values**. Returns regular format (1,234) for non-exact instead of misleading "1.2K"
- 📝 **Word-based notation** — Display "thousand", "million", "тысяча", "миллион" instead of K, M
- 🌏 **Multiple numbering systems** — Western (K, M, B, T), Indian (लाख, करोड़), Chinese/Japanese (万, 億), Arabic (ألف, مليون)
- 💱 **Currency support** — Works with all currencies: $1.5K, ₹1 लाख, ¥1万, €1 Tsd.
- 🚀 **Zero dependencies** — Uses native `Intl.NumberFormat` API
- ⚡ **High performance** — ~3.2M ops/sec with minimal 2% overhead
- 📦 **Tiny & tree-shakeable** — ESM/CJS with full TypeScript types
- ✅ **100% test coverage** — 163 tests including non-Western locales

## 📦 Installation

```bash
npm install @fex-to/precise-compact
```

## 🚀 Quick Start

```typescript
import { preciseCompact } from '@fex-to/precise-compact';

// Word-based notation (default: short forms like K, M)
const format = preciseCompact({ 
  locale: 'en-US',
  compactDisplay: 'long'  // 👈 Use words instead of letters
});

// ✅ Exact values → compact notation
format.format(1000);      // "1 thousand"
format.format(1500);      // "1.5 thousand"
format.format(2500000);   // "2.5 million"

// ❌ Non-exact values → regular format (not "1.2K" which would be misleading)
format.format(1234);      // "1,234" (not "1.2 thousand")
```

## 💡 Usage

### Localized Word Formats ⭐

```typescript
// English words
const formatEN = preciseCompact({ locale: 'en-US', compactDisplay: 'long' });
formatEN.format(1000);         // "1 thousand"
formatEN.format(1000000);      // "1 million"
formatEN.format(1000000000);   // "1 billion"

// Russian words
const formatRU = preciseCompact({ locale: 'ru-RU', compactDisplay: 'long' });
formatRU.format(1000);         // "1 тысяча"
formatRU.format(1000000);      // "1 миллион"
formatRU.format(1000000000);   // "1 миллиард"

// German words
const formatDE = preciseCompact({ locale: 'de-DE', compactDisplay: 'long' });
formatDE.format(1000);         // "1 Tausend"
formatDE.format(1000000);      // "1 Million"

// Short forms (K, M, B, T)
const formatShort = preciseCompact({ locale: 'en-US', compactDisplay: 'short' });
formatShort.format(1500);      // "1.5K" (default behavior)
```

### Currency & Locales

```typescript
const formatUSD = preciseCompact({ locale: 'en-US', currency: 'USD' });
formatUSD.format(1500);      // "$1.5K"
formatUSD.format(1234);      // "$1,234.00"

const formatEUR = preciseCompact({ locale: 'de-DE', currency: 'EUR' });
formatEUR.format(1000);      // "1 Tsd. €"
```

### Non-Western Numbering Systems 🌏

```typescript
// 🇮🇳 Indian numbering system (लाख = lakh = 100,000 | करोड़ = crore = 10,000,000)
const formatHI = preciseCompact({ locale: 'hi-IN', compactDisplay: 'long' });
formatHI.format(100000);       // "1 लाख"
formatHI.format(150000);       // "1.5 लाख"
formatHI.format(10000000);     // "1 करोड़"

// 🇨🇳 Chinese (万 = wan = 10,000 | 億 = yi = 100,000,000)
const formatZH = preciseCompact({ locale: 'zh-CN' });
formatZH.format(10000);        // "1万"
formatZH.format(100000000);    // "1亿"

// 🇯🇵 Japanese (万 = man = 10,000 | 億 = oku = 100,000,000)
const formatJA = preciseCompact({ locale: 'ja-JP' });
formatJA.format(10000);        // "1万"
formatJA.format(100000000);    // "1億"

// 🇸🇦 Arabic (ألف = thousand | مليون = million)
const formatAR = preciseCompact({ locale: 'ar-SA', compactDisplay: 'long' });
formatAR.format(1000);         // "١ ألف"
formatAR.format(1000000);      // "١ مليون"
```

## 📖 API

### `preciseCompact(options)`

Creates a formatter instance.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `locale` | `string` | `"en-US"` | BCP 47 locale code (supports all `Intl` locales) |
| `currency` | `string` | — | ISO currency code (e.g., `"USD"`, `"EUR"`, `"INR"`) |
| `compactDisplay` | `"short" \| "long"` | `"short"` | **`"long"`** for words (thousand, लाख), **`"short"`** for letters (K, M) |

**Returns:** `{ format(value: number): string }`

## 🎯 How It Works

### Exactness Check

A number is "exact" if it can be represented without approximation. **Non-exact values fall back to regular format** to avoid misleading compact notation.

```
(abs(value) × 10^decimals) % scale === 0
```

**Examples:**

| Input | Output | Reason |
|-------|--------|--------|
| `1000` | `"1K"` | ✅ Exact: 1000 ÷ 1000 = 1 |
| `1500` | `"1.5K"` | ✅ Exact: 1500 ÷ 1000 = 1.5 (1 decimal) |
| `1234` | `"1,234"` | ❌ Not exact → regular format (not "1.2K") |
| `1000000` | `"1M"` | ✅ Exact: 1M ÷ 1M = 1 |
| `1230000` | `"1.23M"` | ✅ Exact: 1.23M with 2 decimals |
| `1234567` | `"1,234,567"` | ❌ Not exact → regular format (not "1.23M") |

**Why?** Native `Intl.NumberFormat` with `notation: "compact"` would show `1234` as `"1.2K"`, losing precision. This library prevents that.

## ⚡ Performance

Benchmark (100,000 iterations):

| Implementation | Avg Time | Throughput |
|----------------|----------|------------|
| **preciseCompact** | 31ms | **3.2M ops/sec** |
| Native compact | 30ms | 3.3M ops/sec |
| **Overhead** | **+1ms** | **1.02× slower** |

Minimal performance cost (2%) for exact number detection.

## 🌐 Browser & Node.js Support

Requires `Intl.NumberFormat` with compact notation support:

- ✅ Node.js 12+
- ✅ Chrome 77+, Firefox 78+, Safari 14.1+, Edge 79+
- ✅ All modern browsers and runtimes (Deno, Bun, etc.)

## 📄 License

[MIT](LICENSE) © [fex-to](https://github.com/fex-to)

---

<div align="center">

Made with ❤️ by [fex-to](https://github.com/fex-to)

[⭐ Star on GitHub](https://github.com/fex-to/precise-compact) • [🐛 Report Issue](https://github.com/fex-to/precise-compact/issues) • [💡 Request Feature](https://github.com/fex-to/precise-compact/issues)

</div>
