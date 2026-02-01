# @better-i18n/mcp

MCP (Model Context Protocol) server for [Better i18n](https://better-i18n.com). Enables AI assistants like Claude and GPT to manage translations directly from your IDE.

## Features

- 🤖 **AI-Powered Translation** - Let AI handle your i18n workflow
- ⚡ **Instant Startup** - No filesystem scanning, starts immediately
- 📝 **Create & Update Keys** - Add new keys with source text and translations
- 🔄 **Bulk Operations** - Create/update multiple keys at once
- 🔍 **Smart Filtering** - Find keys by name, namespace, or search

## Installation

```bash
# With npx (no install needed)
npx @better-i18n/mcp

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

### 3. Configure Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["@better-i18n/mcp"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Available Tools

All tools require a `project` parameter in `org/project` format (e.g., `aliosman-co/personal`).

| Tool                 | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `listProjects`       | List all accessible projects                                             |
| `getProject`         | Get project overview: namespaces, languages, coverage stats              |
| `getAllTranslations` | Fetch all keys with translations (no pagination)                         |
| `listKeys`           | List translation keys with filtering and pagination                      |
| `createKeys`         | Create one or more keys (Compact: `n`, `ns`, `v`, `t`)                   |
| `updateKeys`         | Update one or more translations (Compact: `k`, `n`, `ns`, `l`, `t`, `s`) |
| `addLanguage`        | Add a new target language to the project                                 |

## Example Prompts

Ask your AI assistant:

> "List all my translation keys"

> "Add Turkish translations for all keys missing Turkish"

> "Create a new key nav.home with text 'Home' and translate to German and Turkish"

> "Show me translation coverage stats"

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
