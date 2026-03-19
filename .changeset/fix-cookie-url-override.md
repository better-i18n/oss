---
"@better-i18n/next": patch
---

Fix cookie overriding URL locale in `localePrefix: "always"` and `"as-needed"` modes. Previously, when `requestLocale` was undefined during ISR revalidation or build-time static generation, the cookie value would incorrectly determine the locale — causing pages like `/en` to render in Turkish if the cookie was set to `tr`. Cookie fallback is now restricted to `localePrefix: "never"` mode only.
