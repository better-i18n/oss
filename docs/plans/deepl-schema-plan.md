# DeepL Integration - Database Schema Plan

**Date:** 2026-01-10
**Status:** Design Phase
**References:** `docs/plans/deepl-integration.md`, `packages/db/schema/llm-provider.ts`

---

## Overview

We're integrating DeepL as a **translation provider** (separate from AI chat models like Gemini/Claude).

**Key Decision:** Extend `llmProvider` table to handle both AI chat + translation providers, OR create separate `translationProvider` table?

**Recommendation:** ✅ Extend `llmProvider` - reuse existing infrastructure

---

## Current llmProvider Schema

```typescript
// From packages/db/schema/llm-provider.ts
export const llmProvider = pgTable("llm_provider", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").notNull().references(() => organization.id),
  provider: text("provider").notNull(),           // "openai", "gemini", "claude", etc.
  label: text("label").notNull(),                  // Custom display name
  model: text("model").notNull(),                  // Default model
  encryptedApiKey: text("encrypted_api_key").notNull(),
  keyIv: text("key_iv").notNull(),
  baseUrl: text("base_url"),
  status: text("status").notNull().default("active"),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
```

---

## Changes Required

### Option 1: Extend llmProvider (RECOMMENDED)

**Add to llmProvider table:**

```typescript
export const llmProvider = pgTable("llm_provider", {
  // ... existing fields ...

  // NEW: Distinguish AI Chat from Translation providers
  category: text("category").notNull().default("ai-chat"), // "ai-chat" | "translation"

  // NEW: For translation providers only - monthly char limit (null = unlimited)
  monthlyCharLimit: integer("monthly_char_limit"),

  // NEW: For translation providers - current month usage tracking
  // (we'll normalize to {year}-{month} format in queries)
  monthlyUsageYear: integer("monthly_usage_year"),
  monthlyUsageMonth: integer("monthly_usage_month"),
  monthlyUsageCharacters: integer("monthly_usage_characters").default(0),
});
```

**Pros:**
- Reuses existing encryption infrastructure
- Single configuration table for all providers
- Simpler UI (can show both AI Chat + Translation in one section)

**Cons:**
- Mixed concerns (AI chat vs translation)
- May need filtering in queries

### Option 2: Separate translationProvider Table

```typescript
export const translationProvider = pgTable("translation_provider", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").notNull().references(() => organization.id),
  provider: text("provider").notNull(), // "deepl", "google", "amazon"
  label: text("label").notNull(),
  encryptedApiKey: text("encrypted_api_key").notNull(),
  keyIv: text("key_iv").notNull(),
  status: text("status").notNull().default("active"),
  isDefault: boolean("is_default").notNull().default(false),

  // Usage tracking
  monthlyCharLimit: integer("monthly_char_limit"),
  usageMonth: text("usage_month"), // "2026-01"
  usageCharacters: integer("usage_characters").default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
```

**Pros:**
- Clear separation of concerns
- Translation-specific fields
- Easier to extend for translation-only features

**Cons:**
- Duplicates encryption logic
- More complex UI integration

---

## RECOMMENDATION: Option 1 ✅

**Extend llmProvider with:**
```typescript
category: text("category").notNull().default("ai-chat")
monthlyCharLimit: integer("monthly_char_limit")
monthlyUsageMonth: text("monthly_usage_month") // "2026-01"
monthlyUsageCharacters: integer("monthly_usage_characters").default(0)
```

**Migration:**
```sql
ALTER TABLE llm_provider
ADD COLUMN category TEXT NOT NULL DEFAULT 'ai-chat',
ADD COLUMN monthly_char_limit INTEGER,
ADD COLUMN monthly_usage_month TEXT,
ADD COLUMN monthly_usage_characters INTEGER DEFAULT 0;
```

---

## Glossary Sync Storage

**Existing:** `projectGlossary` table (apps/sync-worker/src/processor.ts → TODO)

**Need to track:** Which glossaries are synced to which translation provider

**New table:**

```typescript
export const translationProviderGlossary = pgTable("translation_provider_glossary", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),

  // Links
  translationProviderId: text("translation_provider_id").notNull()
    .references(() => llmProvider.id, { onDelete: "cascade" }),
  projectGlossaryId: text("project_glossary_id").notNull()
    .references(() => projectGlossary.id, { onDelete: "cascade" }),

  // DeepL-specific glossary ID (from their API)
  providerGlossaryId: text("provider_glossary_id"), // e.g., "4e66c8b0-3e7a-4e7f-b2e0-4c8d8b8f8e8f"

  // Sync status
  status: text("status").notNull().default("pending"), // "pending" | "synced" | "failed"
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  errorMessage: text("error_message"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),
});
```

---

## Usage Tracking Schema

**Table:** `translationUsage` (new)

```typescript
export const translationUsage = pgTable("translation_usage", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  translationProviderId: text("translation_provider_id").notNull()
    .references(() => llmProvider.id, { onDelete: "cascade" }),

  // Month in YYYY-MM format
  month: text("month").notNull(),

  // Character count
  charactersUsed: integer("characters_used").notNull(),

  // Batch tracking
  requestCount: integer("request_count").default(1),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()).notNull(),

  // Unique constraint: one entry per provider/month
}, (t) => ({
  uniqProviderMonth: uniqueIndex("uq_usage_provider_month").on(t.translationProviderId, t.month),
}));
```

---

## Project Configuration

**Do we need to store "default translation provider" per project?**

**Answer:** NO - store at organization level

- Users select provider when translating in AI Drawer
- In dropdown: "Better AI (Free - 500K/mo)" vs "DeepL (Your Key)"
- Selection persists during chat session

**If needed later:**
```typescript
// Add to project table (optional)
export const project = pgTable("project", {
  // ... existing fields ...
  defaultTranslationProviderId: text("default_translation_provider_id")
    .references(() => llmProvider.id, { onDelete: "set null" }),
});
```

---

## Migration Strategy

### Phase 1: Core Infrastructure
1. [ ] Add fields to `llm_provider` table (category, monthly fields)
2. [ ] Create `translationProviderGlossary` table
3. [ ] Create `translationUsage` table

### Phase 2: Glossary Sync
1. [ ] Implement glossary matcher (apps/api/domains/project/ai-context/glossary-matcher.ts)
2. [ ] Sync logic in sync-worker (for batch translate context)

### Phase 3: DeepL Integration
1. [ ] Create apps/api/shared/integrations/deepl.ts wrapper
2. [ ] Add tRPC endpoints for enable/disable/usage tracking
3. [ ] Implement monthly usage reset job (cron)

### Phase 4: Frontend Connection
1. [ ] Wire up deepl.tsx page to backend
2. [ ] Update AI Drawer to show provider selection
3. [ ] Display usage stats

---

## Open Questions

1. **Monthly Reset Timing:**
   - When does a new month's quota start?
   - Do we track by UTC or org timezone?
   - → **Answer:** UTC midnight (simplest) + make configurable later

2. **Character Counting:**
   - Do we count source or target language characters?
   - → **Answer:** Both, but bill on target (industry standard)

3. **Glossary Versioning:**
   - If glossary term changes, do we recreate DeepL glossary?
   - → **Answer:** Yes - append to `translationProviderGlossary.errorMessage` history

4. **Fallback Strategy:**
   - If DeepL fails, fallback to Better AI?
   - → **Answer:** User chooses - no auto-fallback

---

## SQL Migrations (Drizzle)

```bash
# Create migration
bun --filter @better-i18n/db generate --name add_translation_provider_fields

# In generated migration file:
export async function up(db: Database) {
  // Extend llm_provider
  await db.schema.alterTable("llm_provider").addColumn("category", text()).default("ai-chat");
  // ... etc

  // Create tables
  await db.schema.createTable("translation_provider_glossary");
  await db.schema.createTable("translation_usage");
}
```

---

## Next Steps

1. ✅ UI designed (deepl.tsx)
2. ⬜ Confirm schema approach (Option 1)
3. ⬜ Create database migration
4. ⬜ Implement glossary matcher
5. ⬜ Create DeepL integration wrapper
6. ⬜ Wire up tRPC endpoints

