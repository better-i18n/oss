# Better i18n - Technical System Guide

Date: 2026-01-09 (Updated)

This document is the single technical source of truth. It explains the architecture, flows, and storage model, including AI chat persistence and client storage logic.

---

## 1) System architecture (high level)

Components:

- `apps/app` - React UI (translations editor, AI chat, settings)
- `apps/api` - tRPC API (auth, projects, translations, sync, AI)
- `apps/webhook` - GitHub webhook receiver -> queues
- `apps/sync-worker` - Queue consumer (sync, AI translation, PR creation)
- `packages/core` - Framework-agnostic runtime core (CDN, manifest, detection)
- `packages/internal` - Private internal utilities (glossary sync, encryption)
- `packages/db` - Drizzle schema + migrations
- `packages/schemas` - Zod validation for API/UI
- `packages/next` - Next.js SDK
- `packages/use-intl` - React/TanStack Start SDK

Primary runtime: Cloudflare Workers + Queues + Hyperdrive + Neon Postgres

---

## 2) Data model map (where models live)

Schemas live in `packages/db/schema/*`.

### Auth + Session

- `packages/db/schema/user.ts`
  - `user`, `session`, `identity`, `verification`

### Organization + Team

- `packages/db/schema/organization.ts`
  - `organization`, `member`
- `packages/db/schema/team.ts`
  - `team`, `teamMember`
- `packages/db/schema/invitation.ts`
  - `invitation`

### i18n + GitHub

- `packages/db/schema/github.ts`
  - `githubInstallation`, `project`, `projectTargetLanguage`
  - `githubRepository`, `translationKey`, `translation`, `cdnFiles`

### AI + Chat

- `packages/db/schema/ai-chat.ts`
  - `aiChat`, `aiChatMessage`

### Sync

- `packages/db/schema/sync.ts`
  - `syncJob`, `syncActivity`

### LLM Providers

- `packages/db/schema/llm-provider.ts`
  - `llmProvider`

---

## 3) API layer (core routers)

Routers live in `apps/api/routers/*`.

- `translation.ts` - key list, update, publish, AI flows
- `project.ts` - project config and target languages
- `github.ts` - repo connections, sync triggers
- `sync.ts` - job state, activity log
- `ai-chat.ts` + `apps/api/lib/modules/ai/*` - chat and tool flows

Input validation is shared from `packages/schemas/src/*`.

---

## 4) GitHub sync pipeline

### 4.1 Webhook -> Queue -> Worker

Flow:

1. GitHub sends webhook
2. `apps/webhook` verifies signature and enqueues
3. `apps/sync-worker` consumes queue message
4. Worker fetches translation files, updates DB, runs AI, and creates PRs

Key files:

- `apps/webhook/src/app.ts`
- `apps/sync-worker/src/worker.ts`
- `apps/sync-worker/src/processor.ts`

### 4.2 Sync worker entry points

Local dev HTTP handler (wrangler dev):

- `apps/sync-worker/src/worker.ts` -> `fetch()` handles:
  - `SYNC_START` -> `processSyncJob()`
  - `CDN_UPLOAD` -> `processSyncJob()`
  - `REPO_PUSH_SYNC` -> `handlePushEvent()`
  - `WEBHOOK_EVENT` -> `handleWebhookEvent()`

Production queue consumer:

- `apps/sync-worker/src/worker.ts` -> `queue()` processes the same message types from Cloudflare Queue

### 4.2 Sync job types

- `initial_import` - first-time source key import
- `source_sync` - updates for source language only
- `cdn_upload` - upload JSON artifacts to CDN (R2/S3)
- `publish` - publish approved/reviewed translations to GitHub (PR) and CDN

**Important:** Sync worker does NOT auto-translate. All AI translations happen through the AI Drawer (human-in-the-loop). Legacy translation code exists in `gemini.ts` but is not triggered.

Job tracking:

- `syncJob` and `syncActivity` tables
- UI reads activity for visibility

### 4.3 Webhook security and event handling

Security and reliability requirements:

- HMAC-SHA256 signature verification with constant-time comparison
- Idempotency using GitHub delivery ID (dedup with TTL)
- Fast acknowledgement; long work is queued

Key event types:

- `installation.created|deleted|suspended|unsuspended` (update installation status)
- `push` (trigger sync for configured branch)
- `pull_request` (optional status tracking)

---

## 5) Translation file structures

Supported scenarios:

### 5.1 Single file per language (flat)

- Structure: `/locales/en.json`, `/locales/tr.json`
- Pattern: `*.json` or `{lang}.json`
- Keys are dot-notated at root (no namespaces)
- Format: `JSON_FLAT`

### 5.2 Folder per language (namespaces per file)

- Structure: `/locales/en/common.json`, `/locales/tr/home.json`
- Pattern: `{lang}/*.json` or `**/*.json`
- Namespace comes from filename (e.g., `common`, `home`)
- Format: `JSON_NAMESPACED`

### 5.3 Namespaced objects in a single file

- Structure: `/locales/en.json` with top-level namespace objects
- Pattern: `*.json` or `{lang}.json`
- Namespace is the top-level object key
- Format: `JSON_NESTED`

### 5.4 Custom base path

- Base path is configurable per project
- Patterns match scenarios 5.1–5.3
- Useful for `/src/translations` or `/resources/i18n`

This matters for:

- import parsing
- namespace extraction
- file generation during PR or CDN upload

### 5.5 Namespace extraction rules (CDN import)

When namespace handling is set to auto:

- Top-level JSON key becomes the namespace
- The rest of the path becomes the key
- Only the first level becomes namespace; deeper levels remain in the key

Example:

Input:

```
{
  "common": { "actions": { "delete": "Delete" } }
}
```

Stored:

- namespace: `common`
- key: `actions.delete`

This is critical for nested JSON imports and must be enforced in the CDN upload pipeline.

---

## 6) CDN-first workflow and virtual repositories

CDN-first is the default onboarding path. GitHub is optional.

Virtual repository model:

- `github_repository.installationId = null` represents CDN-only projects
- Same schema is used for GitHub-connected repos and CDN-only repos
- When GitHub is connected later, the virtual repo is mapped to the real repo

CDN upload flow (two-step UI):

1. File selection + format detection (flat vs nested)
2. Namespace handling (auto / single / none)
3. Queue `CDN_UPLOAD` job for import + CDN publish

---

## 7) Translation editor baseline (UI)

Core files:

- `apps/app/components/translations/translations-editor.tsx`
- `apps/app/components/translations/translation-table.tsx`
- `apps/app/components/translations/translation-status-icon.tsx`
- `apps/app/components/translations/translation-health-drawer.tsx`
- `apps/app/components/translations/translation-health-indicator.tsx`
- `apps/app/components/translations/command-palette.tsx`
- `apps/app/components/translations/ai/drawer.tsx`

Key behaviors:

- Inline editing with autosave (draft -> pending -> approved)
- Namespace grouping and expand/collapse
- Status icons for translation state
- Auto-sync every ~3.5 seconds via Zustand store

Publish filters:

- CDN publish: `draft`, `pending`, `reviewed`, `approved`
- GitHub publish: `reviewed`, `approved`

Recent delivered (CDN-first baseline):

- Translation table UX: search, filters, progress bars, edit popover
- Namespace performance: improved expand/collapse handling
- CDN publish: correct filters and virtual repo UI
- JSON formats: flat, nested, namespaced supported end-to-end
- CDN URL consistency and file URL storage

---

## 8) AI chat flow (server + client)

### 8.1 Server route and model routing

File: `apps/api/lib/modules/ai/routes/chat.ts`

Responsibilities:

- Authenticate session, resolve active organization
- Route model selection via `MODEL_MAP` and `MODEL_PROVIDER_MAP`
- Fetch provider keys from `llm_provider`
- Create a translation agent and stream responses
- Persist user and assistant messages to Postgres

Persistence:

- `ai_chat` is one active chat per project per user
- `ai_chat_message` stores full AI SDK message payload (parts + tool results)

### 8.2 Client UI

Container:

- `apps/app/components/prompt-kit/chat-container.tsx`
- Provides sticky scroll behavior via `use-stick-to-bottom`

Chat state:

- `apps/app/components/translations/ai/chat/hooks/use-chat-state.ts`
- `apps/app/components/translations/ai/chat/hooks/use-chat-history.ts`

The UI uses `@ai-sdk/react` `useChat()` and merges server streaming with local history.

---

## 9) Chat storage model (local + server)

### 9.1 Local (browser) storage

File: `apps/app/lib/db/chat-storage.ts`

Storage uses IndexedDB (Dexie):

- `sessions` (active/completed per project)
- `messages` (role, content, toolCalls)
- `approvals` (tool approvals)

Flow:

1. On open: `use-chat-history` loads active session or creates one
2. Messages are stored in IndexedDB to survive reloads
3. Assistant messages are saved after streaming completes
4. Tool outputs are persisted when `addToolOutput` is called
5. Sessions can be completed and replaced with a new session

### 9.2 Server storage (Postgres)

Files:

- `packages/db/schema/ai-chat.ts`
- `apps/api/lib/modules/ai/routes/chat.ts`

Flow:

1. Server finds or creates `ai_chat` for (projectId, userId)
2. User messages are inserted into `ai_chat_message`
3. Assistant steps are persisted with tool calls and tool results
4. Tool outputs are truncated before storage to avoid large payloads

This dual storage provides:

- Fast local resume (IndexedDB)
- Server-side audit trail and team context

---

## 10) Human-in-the-loop tool approvals

The AI tool approval pattern is implemented as:

- Tool declared without immediate execution
- UI renders inline approval
- Backend executes only after approval

References:

- `apps/api/lib/modules/ai/routes/chat.ts`
- `apps/app/components/translations/ai/drawer.tsx`

---

## 11) Translation editor auto-sync (draft -> publish)

Flow summary:

1. User edits a translation (draft)
2. Local store updates immediately
3. Auto-sync pushes to API every few seconds
4. Publish action moves status to approved

References:

- `apps/app/lib/stores/translation-sync-store.ts`
- `apps/app/hooks/use-translation-auto-sync.ts`

---

## 12) Security and access control

- Auth via Better Auth
- Org scoping enforced via headers and tRPC middleware
- Roles: owner/admin/member

Reference:

- `apps/api/lib/middleware/organization.ts`

---

## 13) Where to start for deep dives

- Sync worker behavior: `apps/sync-worker/src/processor.ts`
- GitHub webhooks: `apps/webhook/src/app.ts`
- Translation API: `apps/api/routers/translation.ts`
- AI chat: `apps/api/lib/modules/ai/routes/chat.ts`
- Client chat storage: `apps/app/lib/db/chat-storage.ts`

---

## 14) Known gaps / TODO (ensure these are handled)

- CDN import namespace handling must pass `namespaceHandling` and `customNamespace`
  from API -> queue -> sync worker, then extract top-level namespace correctly.
- Verify translation table wiring calls the sync store on edit
  (the UI must call `onTranslationChange` -> `updateTranslation`).
- Consider list virtualization for large projects (5000+ keys).
