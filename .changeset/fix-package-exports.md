---
"@better-i18n/core": patch
"@better-i18n/expo": patch
---

Fix broken package entry points — `main`/`exports` now point to `dist/` directly

`bun publish` does not apply `publishConfig` overrides, causing `main: "./src/index.ts"` to be published while `src/` is not included in the tarball. This broke Metro (React Native) and any bundler that doesn't fall back to `publishConfig`.

- Root-level `main`/`types` now point to `./dist/index.js` and `./dist/index.d.ts`
- Added `"bun"` conditional export for monorepo dev (`./src/index.ts`)
- Removed broken `publishConfig` field overrides (kept `access: "public"` only)
