---
"@better-i18n/next": patch
"@better-i18n/schemas": patch
"@better-i18n/sdk": patch
"@better-i18n/use-intl": patch
---

Ship compiled JavaScript instead of raw TypeScript source files. Packages now export pre-built `dist/` files with proper `.js`, `.d.ts`, and source maps — eliminating the need for `transpilePackages` workarounds in consumer projects.
