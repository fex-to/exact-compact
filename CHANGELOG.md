# Changelog

## [0.0.15] (2025-11-17)

### Security Fixes

* **deps:** Fixed high severity vulnerability in `glob` dependency by adding package override to force version `^11.0.0`
* **security:** Resolved 3 high severity vulnerabilities in transitive dependencies (glob via tsup → sucrase)

## [0.0.14] (2025-11-17)

### Features

* **core:** Modular architecture with focused helpers (`src/types.ts`, `src/default-*`, `src/internal/*`) for better maintainability and reusability
* **bench:** Enhanced benchmarking with multi-locale support, performance sorting, hardware metadata, and Markdown reports in `benchmarks/`
* **format:** Embedded `Intl.NumberFormat` for locale-aware decimal separators
* **fractions:** Support for all decimal tenths (0, 0.1, 0.2, ..., 0.9) for more precise compact formatting
* **fallback:** Custom `fallbackFn` option for complete control over non-exact value formatting
* **api:** Clean `PreciseCompact` export with streamlined API surface
* **i18n:** 50+ locale packs with morphology support (plural, dual, case rules)
* **systems:** International, Indian (lakh/crore/arab/kharab), and East Asian (wan/yi) numbering systems
* **typescript:** Full type definitions with ESM and CJS builds
* **zero-deps:** No runtime dependencies for minimal bundle size
