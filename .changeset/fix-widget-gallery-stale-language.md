---
"@better-i18n/expo": patch
---

Fix widget gallery showing stale language after language change

When language was changed via `changeLanguage()`, the persistent cache (AppGroup storage) was only written during CDN fetch. If translations were already loaded in memory, the cache was never updated — causing iOS widget gallery to display the previous language.

Now `changeLanguage()` reconstructs messages from the i18next store and writes them to persistent cache even when no CDN fetch is needed.
