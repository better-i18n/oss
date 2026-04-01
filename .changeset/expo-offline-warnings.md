---
"@better-i18n/expo": patch
---

Add defense-in-depth warnings for mobile offline safety. The SDK now warns at init time when: no persistent storage is provided, no staticData bundled, staticData contains empty objects, or staticData is missing namespaces that exist on CDN. A critical warning is logged when neither storage nor staticData is configured — a combination that will cause App Store rejection if CDN is unreachable.
