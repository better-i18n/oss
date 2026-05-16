---
"@better-i18n/admin": patch
---

fix(analytics): make modelSlug optional in views() and stats()

SDK was always passing modelSlug in the URL path, but the content tracker
doesn't populate contentModelSlug (blob4 is empty in AE). This caused
all analytics queries to return 0 results.

Now modelSlug is optional — omit it to get all content.view events.
