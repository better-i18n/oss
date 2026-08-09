---
"@better-i18n/use-intl": minor
"@better-i18n/core": minor
---

Stop re-downloading every namespace on the client when SSR already delivered the messages.

`BetterI18nProvider` used to call `getMessages(locale)` on every mount, with no namespace scope, even when the SSR/prop payload already matched the active locale. On a prerendered site each new document starts with an empty in-memory cache, so that was a full re-fetch of the data the user was already looking at — and because no namespaces were passed, it asked for every namespace the manifest declares.

Two changes:

- The provider now fetches only when the active locale has no payload on screen. Freshness is kept by a manifest version check (`revalidate`, ETag-aware, typically a single 304) scheduled at idle, instead of a payload download.
- The provider accepts and honours the `namespaces` prop it already declared in its type, passing it to `getMessages` and `revalidate` so client fetches stay as narrow as the server load.

`I18nCore.revalidate` takes an optional `{ namespaces }` argument so the refetch after a version change matches the scope of the original load. Existing calls are unaffected — it defaults to the `namespaces` given to `createI18nCore`.
