---
title: Publish Flows, Quality Checks, and Analytics
---

# Publish Flows, Quality Checks, and Analytics

---

## Publish flows overview

Better i18n has two publish targets: **CDN** and **GitHub**. The target is determined by your project settings.

| Project type | Publish destination | Method |
|---|---|---|
| CDN-only (no GitHub) | CDN (R2 + CF Cache) | Sync worker uploads JSON to R2 |
| GitHub-connected (PR mode) | CDN + GitHub PR | PR opened on default branch |
| GitHub-connected (direct push) | CDN + GitHub commit | Direct commit to default branch |
| GitHub-connected (CDN fallback) | CDN always + GitHub on merge | CDN immediately, GitHub via PR |

---

## Publish lifecycle

### Initiate publish (dashboard or API)

```
User clicks "Publish" in dashboard
   or
API: POST /api/translations/publish
   ↓
API validates: translations approved? pending changes exist?
   ↓
API queues PUBLISH_BATCH job
   ↓
Returns immediately (async — no blocking)
```

### PUBLISH_BATCH job (sync-worker)

```
1. STATUS_UPDATE — mark approved translations as "publishing"
2. FILE_GENERATION — generate JSON files from database
3. CDN_UPLOAD — upload to R2, fire cache purge
4. GITHUB_PR (if GitHub connected) — create branch + PR or direct push
5. STATUS_UPDATE — mark as "published"
6. SYNC_COMPLETED — job done, notify dashboard via WebSocket
```

### Check publish status (MCP)

```typescript
// Before publishing
await mcp.getPendingChanges({ project: "acme/dashboard" });
// Returns: { count, languages, deletedKeys, destination, cannotPublishReason }

// After publishing
await mcp.getSyncs({ project: "acme/dashboard", status: "completed", limit: 1 });
```

---

## Publish constraints

- **30-second cooldown** between publishes (prevents race conditions in CF Cache)
- **`cannotPublishReason`** — checked by `getPendingChanges`. Reasons include: no pending changes, active publish in progress, GitHub installation suspended.
- Soft-deleted keys become **permanently deleted** after publish — review with `getPendingChanges` before confirming.

---

## CDN publish cache flow

```
Publish queued
   ↓
R2 updated (source of truth)
   ↓
CF Cache purged (best-effort, non-critical)
   ↓
Next CDN request: CF miss → fetches from R2 → stored in CF Cache (60s TTL)
```

Even if purge fails, clients receive fresh data within 60s automatically.

---

## Quality checks

Quality checks run automatically in the background and surface issues before publishing.

### Translation coverage

The dashboard shows **coverage percentage** per language: `approved / total_keys × 100`.

- `missing` — key has no translation for this language
- `draft` — translation exists but not approved for publishing
- `approved` — ready to publish
- `published` — deployed to CDN / GitHub

### Placeholder validation

The platform validates `{placeholder}` consistency between source and target translations:
- Missing placeholder in target → flagged as error
- Extra placeholder in target → flagged as warning
- Renamed placeholder → flagged as error

This runs on every translation save (not just at publish time).

### Key sync check (CLI)

```bash
# Check what's in your code vs what's in Better i18n cloud
better-i18n sync

# Output:
# ✗ Missing in remote (12 keys):    → in code but not uploaded
#   auth.newPasswordLabel
#   checkout.discountCodeLabel
#   ...
# ✓ Possibly unused (3 keys):       → in remote but not in code
#   home.oldBannerText
#   ...
```

### Doctor health score

Run before releasing to catch systemic issues:

```bash
better-i18n doctor --ci --threshold 75
```

See <cli.md> for full doctor documentation.

---

## Analytics (dashboard)

### Translation analytics

Available at https://better-i18n.com → Project → Analytics:

- **Coverage over time** — track how coverage grows per language
- **Publish history** — timeline of all deploys with change counts
- **Key activity** — which keys were added, updated, or deleted
- **Language progress** — comparison across all target languages
- **Translator activity** — who translated what (team plans)

### Doctor reports

Upload health reports to the dashboard analytics panel:

```bash
better-i18n doctor --report --api-key $BETTER_I18N_API_KEY
```

Reports track health score trends over time. Useful for:
- Pre/post release comparisons
- Tracking tech debt reduction
- CI badge generation

### CDN analytics

Available at https://better-i18n.com → Project → CDN:

- **Request volume** per locale per day
- **Cache hit rate** (CF Cache vs R2 reads)
- **Top locales** by request count
- **Bandwidth** used per locale
- **Error rate** (fallback responses)

---

## Publish webhooks (outgoing)

Configure webhooks to notify your systems on publish:

```
https://better-i18n.com → Project → Settings → Webhooks
```

**Events:**
- `translation.published` — translations deployed to CDN
- `translation.pr_created` — GitHub PR opened
- `translation.pr_merged` — GitHub PR merged
- `key.created` — new key added
- `key.deleted` — key soft-deleted

**Payload format:**
```json
{
  "event": "translation.published",
  "project": "acme/dashboard",
  "timestamp": "2026-03-01T12:00:00Z",
  "data": {
    "languages": ["tr", "de"],
    "keyCount": 42,
    "destination": "cdn"
  }
}
```

---

## Glossary integration

The AI Drawer uses your project glossary when translating:

- **Brand terms** (`nc: true`) — never translated, kept as-is
- **Custom translations** — specific per-language overrides for key terminology
- **Type: technical** — provides context to AI about how to handle technical terms

Add glossary terms at: Project → Glossary, or via MCP tools (enterprise).

Glossary terms are embedded in the AI system prompt automatically — no manual steps needed in the translation workflow.
