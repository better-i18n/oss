# @better-i18n/mcp

MCP (Model Context Protocol) server for [Better i18n](https://better-i18n.com). Enables AI assistants like Claude and GPT to manage translations directly from your IDE.

## Features

- 🤖 **AI-Powered Translation** - Let AI handle your i18n workflow
- ⚡ **Instant Startup** - No filesystem scanning, starts immediately
- 📝 **Create & Update Keys** - Add new keys with source text and translations
- 🔄 **Bulk Operations** - Create/update multiple keys at once
- 🔍 **Smart Filtering** - Find keys by name, namespace, or search
- 🚀 **Publish Workflow** - Preview and deploy translations to CDN/GitHub

## Installation

```bash
# With npx (no install needed)
npx -y @better-i18n/mcp@latest

# Or install globally
npm install -g @better-i18n/mcp
```

## Setup

### 1. Get Your API Key

1. Go to [dash.better-i18n.com](https://dash.better-i18n.com)
2. Navigate to Settings → API Keys
3. Create and copy your API key

### 2. Add i18n config to your project

```ts
// i18n.ts
import { createI18n } from "@better-i18n/next";

export const i18n = createI18n({
  project: "your-org/your-project", // Format: "org-slug/project-slug"
  defaultLocale: "en",
});
```

The AI assistant will read this file to get the `project` value and include it in all tool calls.

### 3. Configure Your AI Client

#### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp@latest"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp@latest"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Claude Code

Add to `.claude/settings.json` or `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp@latest"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

All tools require a `project` parameter in `org/project` format (e.g., `aliosman-co/personal`).

### Read Tools

| Tool                | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `listProjects`      | List all accessible projects                                             |
| `getProject`        | Get project overview: namespaces, languages, coverage stats              |
| `listKeys`          | Get all keys with translations — search, filter by namespace/status      |
| `getPendingChanges` | Preview what will be deployed when you call publish                      |
| `getSyncs`          | List recent sync operations with status and timing                       |
| `getSync`           | Get detailed sync info including logs and affected keys                  |

### Write Tools

| Tool                    | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `createKeys`            | Create keys with source text and translations (`name`, `sourceText`, `translations`) |
| `updateKeys`            | Update translations — each entry = one language for one key          |
| `deleteKeys`            | Soft-delete keys by UUID — permanently removed on next publish       |
| `proposeLanguages`      | Add target languages — ISO 639-1 or BCP 47 (e.g. `zh-Hans`, `pt-BR`), batch 1–50  |
| `proposeLanguageEdits`  | Change language status: active (CDN), draft (editor-only), archived (hidden)         |
| `publishTranslations`   | Deploy pending changes to production (CDN or GitHub)                 |

## Compact Response Format

Read endpoints (`getProject`, `getSyncs`, `getSync`, `getPendingChanges`) return compact field names for efficient AI communication:

| Compact | Full Name            | Context                    |
| ------- | -------------------- | -------------------------- |
| `prj`   | project              | All responses              |
| `sl`    | sourceLanguage       | getProject                 |
| `nss`   | namespaces           | getProject                 |
| `lng`   | languages            | getProject                 |
| `tk`    | totalKeys            | getProject                 |
| `cov`   | coverage             | getProject                 |
| `nm`    | name                 | Namespace/key items        |
| `kc`    | keyCount             | Namespace items            |
| `tr`    | translated           | Coverage items             |
| `pct`   | percentage           | Coverage items             |
| `tp`    | type                 | Sync items                 |
| `st`    | status               | Sync items                 |
| `st_at` | startedAt            | Sync items                 |
| `cp_at` | completedAt          | Sync items                 |
| `err_msg` | errorMessage       | Sync items                 |
| `sy`    | syncs                | getSyncs                   |
| `tot`   | total                | getSyncs                   |
| `has_chg` | hasPendingChanges  | getPendingChanges          |
| `sum`   | summary              | getPendingChanges          |
| `by_lng` | byLanguage          | getPendingChanges          |
| `del_k` | deletedKeys          | getPendingChanges          |
| `pub_dst` | publishDestination | getPendingChanges          |
| `aff_k` | affectedKeys         | getSync                    |
| `log`   | logs                 | getSync                    |
| `trig_by` | triggeredBy        | Sync items                 |
| `kp`    | keysProcessed        | Sync metadata              |

Write endpoints (`createKeys`, `updateKeys`, `deleteKeys`, `publishTranslations`) return verbose (full field name) responses.

## Example Prompts

Ask your AI assistant:

> "List all my translation keys"

> "Add Turkish translations for all keys missing Turkish"

> "Create a new key nav.home with text 'Home' and translate to German and Turkish"

> "Show me translation coverage stats"

> "Show me what's pending for publish"

> "Publish all pending translations to production"

> "Check the status of recent sync jobs"

## How It Works

1. AI reads `project` value from your `i18n.ts` config
2. AI uses tools with `project` parameter for each request
3. Changes sync to Better i18n dashboard via API
4. CDN serves updated translations to your app

## Environment Variables

| Variable              | Required | Description                             |
| --------------------- | -------- | --------------------------------------- |
| `BETTER_I18N_API_KEY` | Yes      | Your API key                            |
| `BETTER_I18N_API_URL` | No       | API URL (default: dash.better-i18n.com) |
| `BETTER_I18N_DEBUG`   | No       | Enable verbose logging                  |

## License

MIT © [Better i18n](https://better-i18n.com)
