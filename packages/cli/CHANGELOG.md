# Changelog

## 0.2.0

### Minor Changes

- 5c87ca4: Add `doctor` command for i18n health analysis with CI integration.
  - Detects missing translations, placeholder mismatches, and orphan keys
  - Calculates health score (0-100) across 5 categories
  - ESLint and JSON output formats
  - `--report` flag uploads results to Better i18n via GitHub OIDC (zero secrets)
  - `--ci` flag exits with error code if health score below threshold

## 0.1.8

### Patch Changes

- 76855e2: Fix: Remove private workspace dependency from devDependencies

  Removed `@better-i18n/typescript-config: workspace:*` from devDependencies. This was causing installation failures for consumers because the private package doesn't exist on npm and `workspace:*` couldn't be resolved during publish.

All notable changes to @better-i18n/cli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.7] - 2026-01-13

### Fixed

- **Critical**: `getTranslations("namespace")` now correctly detects namespaces in server components
  - Previously, server-side translation calls were marked as dynamic/unknown
  - Translation keys appeared in `root ()` instead of their correct namespace
  - Affected all Next.js App Router users using server components
  - Thanks to detailed user bug report with reproduction steps

### Changed

- Improved namespace detection logic for consistency between `useTranslations` and `getTranslations`
- Updated documentation to reflect full server component support

### Technical Details

- Added string literal check for `getTranslations()` arguments in analyzer
- Now supports all patterns:
  - `getTranslations("namespace")` - Direct string literal
  - `getTranslations({ locale, namespace: "namespace" })` - Object with namespace property
  - `getTranslations()` - Root scoped (no namespace)

### Documentation

- Added server component examples to README
- Added framework support comparison table
- Clarified supported patterns for both client and server hooks

## [0.1.6] - 2025-01-07

### Added

- Initial public release
- Hardcoded string detection for React/Next.js apps
- `better-i18n scan` command for static analysis
- `better-i18n sync` command for cloud project comparison
- Auto-config detection from `i18n.config.ts`
- Support for `useTranslations()` hook detection
- JSON and ESLint output formats
- CI/CD integration with `--ci` flag
- Git staged files support with `--staged` flag

### Features

- JSX text detection
- JSX attribute detection
- Ternary locale pattern detection
- Smart filtering (CSS classes, URLs, constants)
- Glob pattern support for include/exclude
- Clickable file paths in VS Code terminal

## [Unreleased]

### Planned

- Interactive mode for issue resolution
- Auto-fix mode to wrap hardcoded strings
- VS Code extension for real-time linting
- Performance optimizations with AST caching
- Enhanced stats with component type breakdown
