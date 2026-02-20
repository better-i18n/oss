# @better-i18n/mcp-content

MCP (Model Context Protocol) server for [Better i18n](https://better-i18n.com) content management. Enables AI assistants like Claude and Cursor to create, edit, and publish CMS content directly from your IDE.

## Features

- 📝 **Create Content** — Draft blog posts, changelogs, and pages from your IDE
- 🌍 **Multilingual** — Write and translate content in any project language
- ✏️ **Markdown Native** — Write in Markdown, auto-converted to HTML and editor format
- 🏗️ **Model-Aware** — Respects your content model definitions and custom fields
- 🚀 **Publish Workflow** — Draft, review, and publish from AI chat
- 🗑️ **Full CRUD** — Create, read, update, and delete content entries

## Installation

```bash
# With npx (no install needed)
npx @better-i18n/mcp-content

# Or install globally
npm install -g @better-i18n/mcp-content
```

## Setup

### 1. Get Your API Key

1. Go to [dash.better-i18n.com](https://dash.better-i18n.com)
2. Navigate to Settings → API Keys
3. Select **Content** type, create and copy your API key

### 2. Configure Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "better-i18n-content": {
      "command": "npx",
      "args": ["@better-i18n/mcp-content"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 3. Configure Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "better-i18n-content": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp-content"],
      "env": {
        "BETTER_I18N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 4. Configure Claude Code

```bash
claude mcp add better-i18n-content \
  -s user \
  -e BETTER_I18N_API_KEY=your-api-key-here \
  -- npx -y @better-i18n/mcp-content
```

## Available Tools (17)

All tools require a `project` parameter (format: `"org-slug/project-slug"`) to identify the project.

### Schema Management

| Tool | Description |
| --- | --- |
| `createContentModel` | Create a new content model with optional field definitions |
| `updateContentModel` | Update a content model's display name, description, or settings |
| `deleteContentModel` | Permanently delete a content model and all its entries |
| `getContentModel` | Get a model's details including all custom field definitions |
| `listContentModels` | List all content models with entry counts and field definitions |
| `addField` | Add a custom field to a content model |
| `updateField` | Update a custom field's properties |
| `removeField` | Remove a custom field from a content model |
| `reorderFields` | Reorder custom fields within a content model |

### Entry CRUD

| Tool | Description |
| --- | --- |
| `createContentEntry` | Create entry with title, body (Markdown), tags, and custom fields |
| `updateContentEntry` | Update translations, metadata, or custom fields (3 modes: single-language, multi-language, metadata-only) |
| `deleteContentEntry` | Permanently delete a content entry |
| `getContentEntry` | Full entry with all translations, versions, and custom fields |
| `listContentEntries` | Paginated listing with search, status, and language filters. Use `modelSlug: "users"` to list team members |
| `duplicateContentEntry` | Duplicate an existing content entry |

### Publishing

| Tool | Description |
| --- | --- |
| `publishContentEntry` | Set entry status to published and approve translations |
| `bulkPublishEntries` | Publish multiple entries at once |

## Example Prompts

Ask your AI assistant:

> "List all content models in my project"

> "Create a new blog post about our v2.0 release"

> "Show me all draft blog posts"

> "Update the excerpt and tags for the 'hello-world' post"

> "Translate the blog post 'hello-world' to German"

> "Publish all draft changelog entries"

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `BETTER_I18N_API_KEY` | Yes | Your API key |
| `BETTER_I18N_API_URL` | No | API URL (default: dash.better-i18n.com) |
| `BETTER_I18N_DEBUG` | No | Enable verbose logging |

## How It Works

1. AI reads `orgSlug` and `projectSlug` from your project config
2. AI uses content tools to query and manage entries
3. Content is stored in Better i18n's headless CMS
4. Markdown is auto-converted to HTML and editor format
5. Published content is available via the SDK or REST API

## License

MIT © [Better i18n](https://better-i18n.com)
