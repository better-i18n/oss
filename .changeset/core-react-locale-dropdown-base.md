---
"@better-i18n/core": minor
"@better-i18n/use-intl": patch
"@better-i18n/remix": patch
---

Single UI source for LocaleDropdown across all adapters

Introduces `@better-i18n/core/react` — a new optional React export containing
`LocaleDropdownBase`, a pure presentational component with no routing hooks.

- `@better-i18n/use-intl`: `LocaleDropdown` is now a ~10-line wrapper around `LocaleDropdownBase` + TanStack Router hooks
- `@better-i18n/remix`: `LocaleDropdown` is now a ~15-line wrapper around `LocaleDropdownBase` + React Router hooks
- Eliminates ~600 lines of duplicated UI code between the two adapters
- All styling, animations, keyboard navigation, and CSS custom properties live in one place
- Fully backwards compatible — existing `LocaleDropdown` API unchanged
- Bundle size benefit: `@better-i18n/core` (main entry) has zero React dependency; UI only loads via `@better-i18n/core/react`
