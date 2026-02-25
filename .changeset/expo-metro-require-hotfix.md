---
"@better-i18n/expo": patch
---

fix(expo): revert dynamic import() → require() to prevent Metro bundle crash

Metro bundler crash when using `import()` for optional peer dependencies:

```
The "to" argument must be of type string. Received undefined: node:path
  at Object.relative (node:path:1358:5)
  at @expo/metro-config/src/serializer/fork/js.ts:109
```

**Root cause:** `import()` triggers Metro's lazy chunk mechanism. For missing
modules, Metro sets the path to `undefined` → `path.relative(bundleDir, undefined)` crashes
at serialization time (before the app even boots).

**Fix:** Use `require()` instead. Metro creates stubs with real file paths for
`require()` calls → `path.relative()` works → stub executes at runtime →
`throw` is caught by the surrounding `try/catch`.
