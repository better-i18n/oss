---
"@better-i18n/sdk": minor
---

Add `extractLanguageCodes()` and `hasLanguage()` utilities for normalizing the `availableLanguages` field returned by the Content API.

The Content API returns `availableLanguages` as `ContentEntryLanguage[]` objects (`{ code, name, countryCode }`), but the SDK type historically allowed only `string[]`. Consumers that used `typeof v === "string"` to filter the array always got an empty result — breaking hreflang SEO links and locale-filtered article listings.

**New exports:**

- `extractLanguageCodes(langs)` — normalizes both `string[]` and `ContentEntryLanguage[]` shapes into a plain `string[]` of language codes.
- `hasLanguage(item, locale)` — checks whether a raw content entry has a translation for the given locale, handling both array shapes. Returns `true` when `availableLanguages` is absent (treats entries without the field as universally available).

**Type fix:** `ContentEntry.availableLanguages` and `ContentEntryListItem.availableLanguages` are now typed as `(string | ContentEntryLanguage)[]` instead of `string[]` to accurately reflect what the API returns.
