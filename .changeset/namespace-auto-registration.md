---
"@better-i18n/expo": minor
---

Add namespace auto-registration in backend plugin

When the CDN returns multi-namespace data (nested or flat format), the backend now automatically registers sibling namespaces in i18next's resource store via `addResourceBundle()`. This eliminates the need for manual namespace discovery on the app side — all namespaces from a single CDN response are immediately available to i18next.
