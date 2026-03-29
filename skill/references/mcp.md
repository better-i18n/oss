---
title: MCP — AI Translation & Key Management
---

# MCP Servers

Better i18n ships two MCP servers — one for translation key management, one for CMS content. Install both or just the one you need.

```json
// claude_desktop_config.json / .cursor/mcp.json / mcp.json
{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp"],
      "env": {
        "BETTER_I18N_API_KEY": "bi18n_..."
      }
    },
    "better-i18n-content": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp-content"],
      "env": {
        "BETTER_I18N_API_KEY": "bi18n_..."
      }
    }
  }
}
```

Get your API key at https://better-i18n.com → Settings → API Keys.

---

## Translation MCP (`@better-i18n/mcp`) — 13 tools

### Workflow order

```
listProjects → getProject → listKeys / getTranslations
                ↓                        ↓
         proposeLanguages           updateKeys (existing)
                                    createKeys  (new only)
                ↓
         getPendingChanges → publishTranslations
```

**Always call `getProject` before `createKeys`** — verify the namespace exists. Creating keys in a non-existent namespace creates phantom keys that pollute the project.

### Read-only tools

**`listProjects`**
Returns all projects you have access to, including CDN URL format. Call this first to discover `project` slugs.

**`getProject({ project })`**
Full project details: namespaces list, languages, key count, translation coverage per language, CDN base URL. Call before any write operation.

```
Input:  { project: "acme/dashboard" }
Output: { namespaces: ["auth", "common", "home"], languages: [...], coverage: {...} }
```

**`listKeys({ project, namespace?, search?, limit?, offset? })`**
Paginated key browser. Returns compact format: `{ id, name, namespace, sourceText, coverage }`. Use `id` (UUID) when calling `updateKeys` or `deleteKeys`. Not for reading translation text.

**`getTranslations({ project, languages?, status?, namespaces?, keys?, search?, limit? })`**
Full translation text with status per language. `limit` up to 200.

- `status`: `"missing"` | `"draft"` | `"published"` | `"all"` (default: `"all"`)
- `search`: string or array of strings (multi-term search)
- `missingLanguage`: shorthand for `status: "missing"` filtered to one language

**`getPendingChanges({ project })`**
Preview what will be deployed: translation count, deleted keys, language changes, publish destination (`github` / `cdn` / `none`), and `cannotPublishReason`. **Always call before `publishTranslations`.**

**`getSyncs({ project, status?, type?, limit? })`**
Recent sync operations.

**`getSync({ project, syncId })`**
Detailed logs and affected keys for a specific sync.

### Write tools

**`proposeLanguages({ project, languages })`**
Add target languages. Accepts ISO 639-1 or BCP 47 codes. Existing languages are silently skipped. Max 50 at once.

```
Input:  { project: "acme/dashboard", languages: ["tr", "de", "fr"] }
```

**`proposeLanguageEdits({ project, edits })`**
Change language status: `"active"` (deployed to CDN) | `"draft"` (visible, not deployed) | `"archived"` (hidden).

**`createKeys({ project, keys })`**
Create NEW translation keys. **Do NOT use for existing keys.** Compact schema:

```
k = [{ n: "key.name", ns: "namespace", v: "Source text", t: { tr: "...", de: "..." }, nc: false }]
```

- `nc: true` — marks key as "no change needed" (untranslatable, like brand names)

⚠️ **Safety rule:** An AI agent that used `createKeys` on existing keys created 1,005 phantom duplicates in one session. Always call `listKeys` first to confirm a key doesn't already exist.

**`updateKeys({ project, translations })`**
Update translations for existing keys. Requires UUID from `listKeys` or `getTranslations`. Compact schema:

```
t = [{ id: "uuid", l: "tr", t: "Çeviri metni", s: "approved", st: "published" }]
```

- `s` (status): `"draft"` | `"approved"`
- `st` (sync target): optional override

### Destructive tools

**`publishTranslations({ project, scope? })`**
Deploy pending changes to CDN or GitHub. **30-second cooldown** between publishes. After publish, soft-deleted keys are permanently gone. Always call `getPendingChanges` first to review what will happen.

**`deleteKeys({ project, keyIds })`**
Soft-delete by UUID (max 100). Keys become permanently deleted after the next `publishTranslations` call. Review with `getPendingChanges` before publishing.

---

## Recommended AI translation workflow

```
1. getProject         → check available namespaces and languages
2. getTranslations    → fetch keys with status: "missing" for target language
3. [AI translates]    → generate translations respecting glossary / brand names
4. updateKeys         → write translations with status: "approved"
5. getPendingChanges  → verify scope before deploying
6. publishTranslations → deploy to CDN / GitHub
```

### Bulk translation example (pseudo-code for AI agent)

```typescript
// Step 1: Find untranslated keys
const { data } = await mcp.getTranslations({
  project: "acme/dashboard",
  status: "missing",
  languages: ["tr"],
  limit: 200,
});

// Step 2: Translate (AI step)
const translations = data.keys.map((key) => ({
  id: key.id,
  l: "tr",
  t: translate(key.sourceText),  // AI translation
  s: "approved",
}));

// Step 3: Write in bulk
await mcp.updateKeys({ project: "acme/dashboard", translations });

// Step 4: Review + publish
await mcp.getPendingChanges({ project: "acme/dashboard" });
await mcp.publishTranslations({ project: "acme/dashboard" });
```

---

## API key scopes

| Scope | Access |
|---|---|
| `read` | listProjects, getProject, listKeys, getTranslations, getPendingChanges, getSyncs |
| `write` | all read + createKeys, updateKeys, proposeLanguages, proposeLanguageEdits |
| `publish` | all write + publishTranslations |
| `admin` | all publish + deleteKeys, full project management |
