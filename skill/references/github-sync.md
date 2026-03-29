---
title: GitHub Sync — App Installation, Sync Pipeline, Publish Flows
---

# GitHub Sync

Better i18n can sync translation keys directly from your GitHub repository and push approved translations back via PR or direct commit.

**Install the GitHub App:** https://better-i18n.com → Project → Settings → GitHub

---

## Connection modes

| Mode | Description |
|---|---|
| `sync` | Full integration: import keys from repo, push translations back via PR/commit |
| `doctor` | Read-only: scan repo for health issues, no key import or push |
| Virtual (CDN-only) | No GitHub — upload JSON files directly to CDN |

CDN-only projects have `githubRepository.installationId = null`. They can be upgraded to GitHub sync at any time by installing the app.

---

## Sync pipeline

```
GitHub push event
      ↓
apps/webhook — HMAC-SHA256 verification
      ↓
Cloudflare Queue (REPO_PUSH_SYNC)
      ↓
sync-worker
      ↓
┌─────────────────────────────────────────────┐
│  1. Fetch translation files from GitHub     │
│  2. Compare with keys in database           │
│  3. Insert new keys                         │
│  4. Update changed source text              │
│  5. Import existing target translations     │
└─────────────────────────────────────────────┘
      ↓
Keys available in dashboard for AI translation
```

**Key point:** The sync worker imports keys only. AI translation happens through the AI Drawer in the dashboard — it never auto-translates.

---

## Job types

| Type | Trigger | Description |
|---|---|---|
| `initial_import` | Manual (first connection) | Import all source keys from repo |
| `source_sync` | GitHub push to default branch | Diff new/changed keys against database |
| `cdn_upload` | Manual JSON upload | Import JSON file and upload to CDN |
| `cdn_setup` | Project creation | Create initial manifest and language files |
| `cdn_cleanup` | Project deletion | Remove all R2 files for project |
| `batch_publish` | User publishes translations | Generate files, push to CDN and/or GitHub |

---

## File pattern configuration

Better i18n uses a **glob pattern** to find translation files in your repo:

| Format | Pattern example | Example path |
|---|---|---|
| Flat JSON | `locales/{{lang}}.json` | `locales/en.json` |
| Namespaced folders | `locales/{{lang}}/{{ns}}.json` | `locales/en/common.json` |
| Nested JSON | `messages/{{lang}}.json` | `messages/en.json` |
| i18next (public dir) | `public/locales/{{lang}}/{{ns}}.json` | `public/locales/en/common.json` |

The `{{lang}}` placeholder is replaced with locale codes. `{{ns}}` is replaced with namespace names.

---

## Publish flows

### CDN publish

```
Approve translations in dashboard
          ↓
Click Publish → API queues PUBLISH_BATCH
          ↓
sync-worker: generate JSON files → upload to R2 → purge CF Cache
          ↓
CDN serves fresh translations within 60s (max-age)
```

### GitHub publish (PR mode)

```
Approve translations in dashboard
          ↓
Click Publish → sync-worker creates branch better-i18n/translations-{ts}
          ↓
Push JSON files to branch → open PR on default branch
          ↓
Team reviews and merges PR
          ↓
GitHub push event triggers source_sync → keys re-imported (idempotent)
```

### GitHub publish (direct push mode)

For fully automated workflows, configure **autoPushToSourceBranch**:

```
Approved translations → sync-worker commits directly to default branch
```

Enable in: Project → Settings → GitHub → "Auto-push to source branch".

---

## Installation status

The GitHub App installation can be in three states:

| Status | Meaning | Effect on syncs |
|---|---|---|
| `active` | Normal operation | All sync jobs proceed |
| `suspended` | Temporarily suspended by GitHub | Sync jobs fail early with clear error |
| `deleted` | App uninstalled | Repository converted to CDN-only mode (installationId nulled) |

When an installation is suspended, new sync jobs throw `"GitHub installation is suspended"` and are marked failed — they don't retry with GitHub API 401s.

---

## Multi-repo projects

A project can have multiple connected repositories (monorepos, separate frontend/backend repos). Important rules:

- Some repos are connected in `"doctor"` mode (health-check only, zero translation keys).
- When querying repos for a project, always filter out `connectionMode === "doctor"` repos before processing keys.
- Use `findMany` + filter, never `findFirst` by `projectId` — multiple repos per project is intentional.

---

## Webhook events handled

| GitHub event | Effect |
|---|---|
| `push` (default branch) | Triggers source_sync if translation files changed |
| `installation.created` | Marks installation as `active` |
| `installation.suspended` | Marks installation as `suspended` |
| `installation.unsuspended` | Marks installation as `active` |
| `installation.deleted` | Marks as `deleted`, nulls repo installationId |
| `github_app_authorization.revoked` | Marks all user installations as `deleted` |
| `pull_request` | Logged, no sync triggered |
| `installation_repositories` | Logged, no sync triggered |

---

## Branch naming

Better i18n creates branches with predictable names:

```
better-i18n/translations-{timestamp}
```

These can be filtered in branch protection rules or auto-merge policies.
