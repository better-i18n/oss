---
"@better-i18n/cli": patch
---

`pull` no longer writes empty locale files behind a successful exit.

Two problems, both reachable from a CI job:

- The CDN fallback URL was built as `/{org}/{project}/translations/{locale}.json`, but the published layout is `/{org}/{project}/{locale}/translations.json`. The CDN answers the wrong path with `200` and an empty `{}` instead of a `404`, so a bad URL was indistinguishable from an unpublished project.
- Nothing checked the downloaded file against the manifest, so a locale the manifest counts as non-empty could still land on disk as `{}` with a green `✓ 0 keys`.

`pull` now fails a locale when the manifest expects keys and the CDN returns none, writes nothing for it, and prints the reason without `--verbose`.
