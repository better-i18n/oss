---
"@better-i18n/core": minor
"@better-i18n/use-intl": patch
"@better-i18n/remix": patch
"@better-i18n/next": patch
---

Single UI source for LocaleDropdown across all adapters

Introduces `@better-i18n/core/react` — a new optional React export containing
`LocaleDropdownBase`, a pure presentational component with no routing hooks.

**New exports from `@better-i18n/core/react`:**
- `LocaleDropdownBase` — props-driven UI, no hooks, works with any router
- `LOCALE_DROPDOWN_CSS` — injectable CSS string for custom rendering pipelines
- `DATA_ATTRS` — typed constants for all `data-better-locale-*` attributes
- `CSS_VARS` — typed constants for all `--better-locale-*` custom properties
- `LocaleDropdownBaseProps`, `LocaleDropdownRenderContext`, `LocaleDropdownTriggerContext` — full type surface

**Adapter changes (all backwards compatible):**
- `@better-i18n/use-intl`: `LocaleDropdown` → thin wrapper (TanStack Router hooks)
- `@better-i18n/remix`: `LocaleDropdown` → thin wrapper (React Router hooks)
- `@better-i18n/next`: `LocaleDropdown` → thin wrapper (cookie + router.refresh)
- Eliminates ~1200 lines of duplicated UI code across the three adapters
- Bundle size: `@better-i18n/core` main entry remains zero-dep; React UI loads only via `./react`
