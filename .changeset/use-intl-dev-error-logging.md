---
"@better-i18n/use-intl": patch
---

Surface i18n lookup and ICU parse errors in development by default. Previously `BetterI18nProvider` shipped with `onError={() => {}}` which silently swallowed every missing-key and every format-parse failure — the library then returned the raw key as fallback, so a dotted path like `settings.installation.status.pendingDesc` appeared on screen with zero console output. Debugging a single instance cost ~40 minutes because the offending source string (which happened to contain `<head>`, an unmatched ICU rich-text tag) gave no runtime signal.

New default `onError` logs `[better-i18n] <code>: <message>` with the offending source on `console.warn` when `NODE_ENV !== "production"`, stays silent in production. Consumer-supplied `onError` (Sentry, telemetry, etc.) still overrides. The bootstrap-phase provider (rendered before the CDN fetch resolves) keeps the no-op intentionally so the expected first-render misses don't flood the console.

Log format includes `originalMessage` so ICU parse failures are diagnosable without re-deriving the input.
