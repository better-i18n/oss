---
"@better-i18n/next": patch
---

Fix `localePrefix: "never"` mode middleware and client-side locale switching. Middleware now performs internal rewrites correctly bypassing next-intl delegation, and `useSetLocale` properly handles URL navigation for prefix modes vs cookie-only refresh for "never" mode.
