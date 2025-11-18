# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-11-18

### Added

- **NEW**: `fallbackFn` option for custom handling of non-exact values
  - Allows passing raw values to custom formatter function
  - Useful for custom rounding, special formatting, or business logic
  - Full control over non-compact number presentation

### Tests

- Added 8 new tests for `fallbackFn` feature
- Achieved 100% code coverage (177 tests total)

## [1.1.0] - 2025-11-18

### Changed

- **BREAKING**: Renamed main function from `preciseCompact` to `PreciseCompact` (capitalized) for consistency with naming conventions
- Backward compatibility maintained: `preciseCompact` still available as deprecated alias

### Added

- Added CHANGELOG.md for tracking version history
- Improved SECURITY.md with actual contact information and response times

### Fixed

- Fixed npm package dependencies (added overrides for glob, sucrase, magicast)
- Fixed GitHub Actions release workflow authentication
- Resolved all security vulnerabilities (0 vulnerabilities)

## [1.0.1] - 2025-11-18

### Fixed

- Fixed package-lock.json synchronization issues
- Added magicast override for release-it compatibility

## [1.0.0] - 2025-11-18

### Added

- Initial stable release
- Support for 12 locales: en-US, ru-RU, de-DE, uk-UA, cs-CZ, hi-IN, zh-CN, ja-JP, ko-KR, th-TH, ar-SA, ur-PK
- Comprehensive test suite (169 tests, 100% coverage)
- Performance optimization (1.02× faster than native compact)
- TypeScript support with strict types
- Zero runtime dependencies
- Dual ESM/CJS exports
- Currency formatting support
- Word-based and symbol-based compact notation

### Previous Versions (0.0.x)

- Development versions with feature additions and bug fixes
