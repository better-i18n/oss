---
"@better-i18n/mcp": patch
---

Remove redundant approveTranslations tool and update to mcp-types@0.5.1

**Breaking Changes:**
- Removed `approveTranslations` tool - use `updateKeys` with `status` parameter instead

**Updates:**
- Updated `@better-i18n/mcp-types` to 0.5.1 which includes `publishTranslations` rename
- Tool now properly supports the renamed `publishTranslations` endpoint (was `publish`)

**Migration Guide:**
Instead of using `approveTranslations`, use `updateKeys` to change translation status:
```json
{
  "translations": [
    {
      "key": "auth.login.title",
      "language": "tr",
      "text": "Giriş Yap",
      "status": "approved"
    }
  ]
}
```

The `updateKeys` tool is more flexible and supports any status change, not just draft→approved.
