---
"@better-i18n/use-intl": patch
---

Suppress "useRouter must be used inside RouterProvider" console warning in non-TanStack Router apps (e.g. react-router-dom). Pass `{ warn: false }` to TanStack Router's `useRouter()` — the try/catch fallback already handles missing context gracefully.
