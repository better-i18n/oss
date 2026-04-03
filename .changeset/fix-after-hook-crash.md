---
"@better-i18n/server": patch
---

Fix 500 crash in Better Auth after hook — return ctx instead of undefined

The `createBetterAuthProvider` after hook handler returned `undefined` on all code paths. Better Auth's `runAfterHooks` reads `result.headers` from the return value, causing `TypeError: undefined is not an object` on every auth request. Now returns `ctx` from all exit points.
