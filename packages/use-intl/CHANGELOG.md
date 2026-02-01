# @better-i18n/use-intl

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
