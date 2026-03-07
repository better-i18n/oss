## 0.1.0

- Initial release
- CDN-based runtime translation loading with 3-tier fallback (memory cache, CDN, persistent storage, static data)
- `BetterI18nProvider` widget for easy setup
- `context.t()` extension for Flutter-idiomatic translations
- `context.setI18nLocale()` for runtime locale switching
- `SharedPrefsStorage` for offline fallback persistence
- Pluggable `TranslationStorage` interface
