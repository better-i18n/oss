## 0.1.1

- **Fix:** `context.t()` / `translate()` now resolves arbitrarily deep dot-paths
  against the nested CDN key format. Keys deeper than two segments
  (e.g. `auth.welcome.title`, served as `{"auth": {"welcome": {"title": …}}}`)
  previously returned the raw key; they now resolve correctly. The legacy
  single-split namespace lookup is kept as a fallback, so flat-in-namespace
  payloads continue to work unchanged.

## 0.1.0

- Initial release
- CDN-based runtime translation loading with 3-tier fallback (memory cache, CDN, persistent storage, static data)
- `BetterI18nProvider` widget for easy setup
- `context.t()` extension for Flutter-idiomatic translations
- `context.setI18nLocale()` for runtime locale switching
- `SharedPrefsStorage` for offline fallback persistence
- Pluggable `TranslationStorage` interface
