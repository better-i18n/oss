---
"@better-i18n/admin": patch
---

Fix an install that could never succeed. The package declared a peer dependency on `@better-i18n/mcp-types@0.0.2`, a version that does not exist on npm, so `npm i @better-i18n/admin` failed with ETARGET before it could unpack. `mcp-types` is a real runtime dependency now, since every emitted `.d.ts` imports from it, and the argument types resolve for consumers again.
