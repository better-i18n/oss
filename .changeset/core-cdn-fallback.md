---
"@better-i18n/core": patch
---

Add CDN fallback chain with storage and staticData support

- 3-tier fallback: CDN → persistent storage → static data → throw
- AbortController-based fetch timeout (default 10s)
- Exponential backoff retry (default 1 retry)
- New storage adapters: localStorage, memory, auto-detect
- Fire-and-forget write-through to storage on CDN success
- New exports: createAutoStorage, createLocalStorage, createMemoryStorage
- No breaking changes — all new fields are optional
