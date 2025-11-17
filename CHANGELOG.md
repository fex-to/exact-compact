# Changelog

## [0.0.13](///compare/v0.0.12...v0.0.13) (2025-11-17)

## [0.0.12](https://github.com/fex-to/exact-compact/compare/v0.0.11...v0.0.12) (2025-11-17)

### Features

- **core:** Broke the formatter into focused modules (`src/types.ts`, `src/default-*`, `src/internal/*`) so caching, morphology helpers, and defaults remain reusable while the public API stays unchanged.
- **bench:** Rebuilt `scripts/bench.ts` to run more locales/abbr cases, sort by ops/sec, capture host hardware, and persist Markdown reports under `benchmarks/` for transparent performance tracking.

## [0.0.11](https://github.com/fex-to/exact-compact/compare/v0.0.10...v0.0.11) (2025-11-09)

```ts

- **fallback:** Removed the built-in `'locale'` fallback plus `numberLocale` / `numberOptions`. The formatter now always returns raw digits unless you provide `fallbackFn`, giving callers full control over localized number formatting.
- Updated README examples and API sections to describe the `fallbackFn` flow and removed references to deprecated options.
```

### Features

- **format:** Compact numbers use an embedded `Intl.NumberFormat` driver that respects the `locale` argument for decimal separators (no manual driver needed anymore).

## [0.0.10](https://github.com/fex-to/exact-compact/compare/v0.0.9...v0.0.10) (2025-11-10)

### Features

* **fractions:** Expanded default `allowedFractions` to support all decimal tenths ([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9])
   - Previously only supported [0, 0.5], limiting formatting to integers and halves
   - Now supports single-decimal precision (e.g., 45.6 billion, 2.3 million, 7.9 thousand)
   - Enables more natural and precise compact number formatting
   - **BREAKING CHANGE:** Existing code may now format numbers differently if they contain decimal tenths

### Tests

* Added 18 comprehensive tests covering:
   - Billions with various decimal fractions
   - Trillions formatting
   - Edge cases and boundary conditions
   - BigInt value support
   - Indian system (lakh, crore, arab, kharab)
   - East Asian system (wan, yi)
   - Negative values across all systems
   - Test coverage increased from 55 to 73 tests

## [0.0.9](https://github.com/fex-to/exact-compact/compare/v0.0.7...v0.0.9) (2025-11-02)

### Bug Fixes

* Minor internal improvements and dependency updates

## [0.0.8](https://github.com/fex-to/exact-compact/compare/v0.0.7...v0.0.8) (2025-11-02)

### Features

* **api:** Rename `defaultFormatter` to `PreciseCompact` for clearer naming
   - More explicit and intuitive export name
   - Better reflects the library's purpose
   - **BREAKING CHANGE:** Users should update imports from `defaultFormatter` to `PreciseCompact`

## [0.0.7](https://github.com/fex-to/exact-compact/compare/v0.0.6...v0.0.7) (2025-10-31)

### Features

* **fallback:** Enable grouping for locale fallback by default
   - When using `fallback: 'locale'`, number grouping (thousands separators) is now enabled by default
   - Can be explicitly disabled by passing `numberOptions: { useGrouping: false }`
   - Provides better readability for fallback numbers (e.g., "1,501" instead of "1501")

### Tests

* Added comprehensive tests for locale fallback grouping behavior
   - Verified default grouping with various locales (de-DE, en-US, fr-FR)
   - Tested explicit override options
   - Added tests for BigInt compatibility

## [0.0.6](https://github.com/fex-to/exact-compact/compare/v0.0.5...v0.0.6) (2025-10-31)

### Features

* **fallback:** Add custom `fallbackFn` option for user-defined fallback formatting
   - New `fallbackFn?: (value: number | bigint) => string` option in `FormatOptions`
   - Allows complete control over fallback behavior for non-exact values
   - Custom function receives the original input value (preserves number vs bigint type)

### Bug Fixes

* Improved fallback handling to preserve original argument type
   - Ensures fallback functions receive the exact input value passed by the user
   - Fixes edge cases where type conversion could affect fallback output

### Tests

* Added comprehensive fallback tests for both numbers and BigInt values
* Verified raw value preservation in fallback scenarios

## [0.0.5](https://github.com/fex-to/exact-compact/compare/v0.0.4...v0.0.5) (2025-10-31)

### Documentation

* Updated README with correct scoped package name `@fex-to/precise-compact`
* Fixed installation instructions and import examples

## [0.0.4](https://github.com/fex-to/exact-compact/compare/v0.0.3...v0.0.4) (2025-10-31)

### Breaking Changes

* **package:** Renamed package to scoped `@fex-to/precise-compact`
   - Package name changed from `precise-compact` to `@fex-to/precise-compact`
   - All users must update their package.json and imports
   - Install with: `npm i @fex-to/precise-compact`

## [0.0.3](https://github.com/fex-to/exact-compact/compare/v0.0.2...v0.0.3) (2025-10-31)

### Chore

* Added repository, bugs, and homepage fields to package.json
* Improved package metadata for npm registry

## 0.0.2 (2025-10-31)

### Features

* Initial public release of precise-compact library
* Exact compact number formatting with no rounding or approximation
* Support for international, Indian (lakh/crore), and East Asian (wan/yi) numbering systems
* Per-locale morphology support (50+ language packs available)
* Configurable allowed fractions (default: 0 and 0.5)
* TypeScript-first API with full type definitions
* ESM and CJS builds with tree-shakeable i18n packs
* Zero runtime dependencies
* Comprehensive test coverage with Vitest
