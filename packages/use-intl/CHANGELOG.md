# @better-i18n/use-intl

## 0.1.13

### Patch Changes

- Updated dependencies [12210eb]
  - @better-i18n/core@0.2.1

## 0.1.12

### Patch Changes

- Updated dependencies [5fd34e0]
  - @better-i18n/core@0.2.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.10

## 0.1.10

### Patch Changes

- 3836f94: Pass storage and staticData through to core in BetterI18nProvider
  - Provider now accepts and forwards storage, staticData, fetchTimeout, retryCount
  - CDN failure falls back to storage/staticData instead of breaking

- Updated dependencies [3836f94]
  - @better-i18n/core@0.1.9

## 0.1.9

### Patch Changes

- 2744ff9: Ship compiled JavaScript instead of raw TypeScript source files. Packages now export pre-built `dist/` files with proper `.js`, `.d.ts`, and source maps — eliminating the need for `transpilePackages` workarounds in consumer projects.

## 0.1.8

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies [043c5f4]
- Updated dependencies [1f45586]
  - @better-i18n/core@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies [c5c914a]
  - @better-i18n/core@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies
  - @better-i18n/core@0.1.5

## 0.1.4

### Patch Changes

- 2d400f0: Fix: Ensure packages are built before publishing
  - Added `prepublishOnly` hook to `@better-i18n/core` to build dist before publish
  - Fixed `@better-i18n/use-intl` to publish source files (consistent with `@better-i18n/next`)

- Updated dependencies [2d400f0]
  - @better-i18n/core@0.1.4

## 0.1.3

### Patch Changes

- 76855e2: Fix: Remove private workspace dependency from devDependencies

  Removed `@better-i18n/typescript-config: workspace:*` from devDependencies. This was causing installation failures for consumers because the private package doesn't exist on npm and `workspace:*` couldn't be resolved during publish.

- Updated dependencies [76855e2]
  - @better-i18n/core@0.1.3

## 0.1.2

### Patch Changes

- 1488817: Internal/core architecture update and middleware improvements. Moved glossary and encryption to internal package. Improved Next.js and TanStack Start middleware composability.
- Updated dependencies [1488817]
  - @better-i18n/core@0.1.2
