# Changelog

## [0.0.16] (2025-11-17)

### Bug Fixes

* **types:** Fixed TypeScript ambient module declarations in `types/i18n.d.ts` to use scoped package name `@fex-to/precise-compact` instead of `precise-compact`
* **types:** Fixed duplicate identifier errors in i18n locale type declarations
* **types:** Updated `scripts/generate-i18n-dts.ts` to generate correct scoped package declarations

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
