# @better-i18n/cli

> Detect hardcoded strings in your React/Next.js apps before they become i18n debt.

[![npm version](https://img.shields.io/npm/v/@better-i18n/cli.svg)](https://www.npmjs.com/package/@better-i18n/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Why?

Hardcoded strings slip into codebases easily. Finding them manually is tedious. This CLI automatically scans your React/Next.js code and reports untranslated text—before it ships to production.

```tsx
// ❌ These get flagged
<h1>Welcome to our app</h1>
<button>Click me</button>
<input placeholder="Enter your name" />

// ✅ These are fine
<h1>{t('welcome')}</h1>
<button>{t('actions.click')}</button>
<input placeholder={t('form.namePlaceholder')} />
```

## Installation

```bash
# Global install
npm install -g @better-i18n/cli

# Or use with npx (no install needed)
npx @better-i18n/cli scan

# Or add to your project
npm install -D @better-i18n/cli
```

## Quick Start

```bash
# Scan current directory
better-i18n scan

# That's it! The CLI auto-detects your i18n.config.ts
```

## Features

- ✅ **Auto-config detection** - Reads your existing `i18n.config.ts`
- ✅ **Server component support** - Detects `getTranslations()` in Next.js App Router
- ✅ **Smart filtering** - Ignores CSS classes, URLs, constants, HTML entities
- ✅ **Glob patterns** - Exclude test files, stories, UI components
- ✅ **Clickable output** - File paths are Cmd+clickable in VS Code terminal
- ✅ **CI/CD ready** - JSON output, exit codes, staged files support
- ✅ **Fast** - Scans 100+ files in <100ms

## Example Output

```
$ better-i18n scan

✓ Project: better-i18n/landing
✓ Found 57 files

components/sign-up.tsx (11)
  24:13  missing  "Create an account"  i18n/jsx-text
  32:22  missing  "Name"  i18n/jsx-text
  40:22  missing  "Email"  i18n/jsx-text

components/contact.tsx (9)
  24:59  missing  "Contact us"  i18n/jsx-text
  31:22  missing  "Message"  i18n/jsx-text

✖ 87 problems (87 missing translations)

Scanned 57 files in 0.07s
```

**Cmd+Click** on any file path to jump directly to the issue in VS Code!

## Commands & Options

### `better-i18n scan`

Scan your codebase for hardcoded strings.

```bash
# Basic usage
better-i18n scan

# Scan specific directory
better-i18n scan --dir ./src

# Output formats
better-i18n scan --format json    # JSON output for CI/tooling
better-i18n scan --format eslint  # Human-readable (default)

# CI/CD integration
better-i18n scan --ci             # Exit with code 1 if issues found
better-i18n scan --staged         # Only scan git staged files

# Debug
better-i18n scan --verbose        # Show detailed output
```

### `better-i18n sync`

Compare local translation keys (t() calls) with your Better i18n cloud project.

```bash
# Basic usage (grouped tree output)
better-i18n sync

# Minimal metrics only
better-i18n sync --summary

# Deep audit log & scope trace
better-i18n sync --verbose

# JSON output for CI automation
better-i18n sync --format json
```

### Translation Hook Detection

The CLI automatically detects namespaces from both client and server translation hooks.

**Client Components (React Hooks):**
```tsx
// Detected as 'auth.login' and 'auth.register'
const { t } = useTranslations('auth');

t('login');
t('register');
```

**Server Components (Async Functions):**
```tsx
// Also detected as 'welcome.title' and 'welcome.subtitle'
const t = await getTranslations('welcome');

return (
  <div>
    <h1>{t('title')}</h1>
    <p>{t('subtitle')}</p>
  </div>
);
```

**Advanced Pattern (Object with locale):**
```tsx
const t = await getTranslations({
  locale: params.locale,
  namespace: 'maintenance'
});
```

**Supported Patterns:**
- ✅ `useTranslations('namespace')` - Client components
- ✅ `getTranslations('namespace')` - Server components
- ✅ `getTranslations({ locale, namespace: 'namespace' })` - Server with locale
- ✅ `useTranslations()` / `getTranslations()` - Root scoped (no namespace)

**Output format (JSON):**

```json
{
  "localKeys": {
    "project": "better-i18n/landing",
    "namespaces": {
      "auth": ["auth.login", "auth.register", "auth.forgot"],
      "nav": ["nav.home", "nav.about"],
      "hero": ["hero.title", "hero.description"]
    },
    "totalCount": 6,
    "filesScanned": 42
  }
}
```

**With `sync` output (default):**

```text
📊 Translation Keys Comparison
Source locale: en

Coverage:
  Local → Remote: 59%
  Remote Used: 63%

⊕ Missing in Remote (473 keys)
pages (300)
  affordableEnglishLearning (meta.title, meta.description, ...+12)
  bestApps (hero.badge, title_prefix, title_accent)

hero (5)
  hero (ariaLabel, imageAlt, ...)

⊖ Unused in Code (386 keys)
features (25)
  practiceSpeaking (title, subtitle, icon)

Scanned 246 files in 0.85s
✓ Comparison complete
```

## Detection Rules

| Rule             | Severity | What it catches        | Example                           |
| ---------------- | -------- | ---------------------- | --------------------------------- |
| `jsx-text`       | missing  | Hardcoded text in JSX  | `<h1>Hello</h1>`                  |
| `jsx-attribute`  | missing  | Hardcoded attributes   | `<img alt="Logo" />`              |
| `ternary-locale` | error    | Locale-based ternaries | `locale === 'en' ? 'Hi' : 'Hola'` |

### Framework Support

| Framework | Client Hooks | Server Functions | Status |
|-----------|-------------|------------------|--------|
| Next.js (Pages Router) | `useTranslations()` | N/A | ✅ Full support |
| Next.js (App Router) | `useTranslations()` | `getTranslations()` | ✅ Full support |
| React (SPA) | `useTranslations()` | N/A | ✅ Full support |

### Automatically Ignored

- HTML entities: `&quot;`, `&amp;`, `&#39;`
- CSS classes: `className="flex items-center"`
- URLs: `href="https://example.com"`
- Paths: `/api/users`
- Numbers: `42`, `3.14`, `100%`
- Constants: `SCREAMING_CASE`
- Symbols: `→`, `•`, `...`

## Configuration

Create or update your `i18n.config.ts`:

```ts
export const project = "your-org/your-project";
export const defaultLocale = "en";

export const i18nWorkspaceConfig = {
  project,
  defaultLocale,
  lint: {
    // Files to scan (defaults: ["src", "app", "components", "pages"])
    include: ["src/**/*.tsx", "app/**/*.tsx"],

    // Files to ignore (automatically merges with defaults)
    exclude: [
      "**/skeletons.tsx", // Mock/demo components
      "**/*.stories.tsx", // Storybook files
      "**/*.test.tsx", // Test files
      "**/components/ui/**", // UI library components
    ],

    // Rule configuration (optional)
    rules: {
      "jsx-text": "warning",
      "jsx-attribute": "warning",
      "ternary-locale": "error",
    },
  },
};
```

### Config Options

| Option    | Type       | Description                                                                        |
| --------- | ---------- | ---------------------------------------------------------------------------------- |
| `include` | `string[]` | Glob patterns for files to scan (default: `["src", "app", "components", "pages"]`) |
| `exclude` | `string[]` | Glob patterns to ignore (merges with defaults: `node_modules`, `.next`, etc.)      |
| `rules`   | `object`   | Set severity: `"error"` \| `"warning"` \| `"off"`                                  |

## Usage Scenarios

### 1. Local Development

Add to your `package.json`:

```json
{
  "scripts": {
    "lint": "next lint && better-i18n scan --ci",
    "lint:i18n": "better-i18n scan"
  }
}
```

Run before commits:

```bash
npm run lint:i18n
```

### 2. Pre-commit Hook

Install [Husky](https://typicode.github.io/husky/):

```bash
npx husky init
echo "npx @better-i18n/cli scan --staged --ci" > .husky/pre-commit
```

Or with [lint-staged](https://github.com/lint-staged/lint-staged):

```json
{
  "lint-staged": {
    "*.{tsx,jsx}": ["better-i18n scan --ci"]
  }
}
```

### 3. GitHub Actions CI

```yaml
# .github/workflows/i18n-check.yml
name: i18n Check

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npx @better-i18n/cli scan --ci --format json
```

### 4. VS Code Integration

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "i18n: Check translations",
      "type": "shell",
      "command": "npx @better-i18n/cli scan",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

Run with: `Cmd+Shift+P` → `Tasks: Run Task` → `i18n: Check translations`

### 5. Monorepo Usage

```bash
# Scan specific package
cd packages/web-app
better-i18n scan

# Or from root with --dir
better-i18n scan --dir packages/web-app
```

Each package can have its own `i18n.config.ts`.

## JSON Output

Use `--format json` for programmatic integration:

```bash
better-i18n scan --format json > i18n-report.json
```

```json
{
  "project": {
    "workspaceId": "better-i18n",
    "projectSlug": "landing",
    "defaultLocale": "en"
  },
  "files": 57,
  "issues": [
    {
      "file": "components/sign-up.tsx",
      "line": 24,
      "column": 13,
      "text": "Create an account",
      "type": "jsx-text",
      "severity": "warning",
      "message": "Hardcoded text: \"Create an account\"",
      "suggestedKey": "signUp.createAnAccount"
    }
  ],
  "duration": 67
}
```

### JSON Schema

```ts
interface ScanResult {
  project?: {
    workspaceId: string;
    projectSlug: string;
    defaultLocale: string;
  };
  files: number;
  issues: Issue[];
  duration: number;
}

interface Issue {
  file: string; // Relative path
  line: number; // Line number
  column: number; // Column number
  text: string; // Hardcoded text
  type: "jsx-text" | "jsx-attribute" | "ternary-locale";
  severity: "error" | "warning";
  message: string; // Human-readable message
  suggestedKey?: string; // Auto-generated translation key
}
```

## Advanced Usage

### Custom Scripts

```bash
# Count missing translations
better-i18n scan --format json | jq '.issues | length'

# Get unique files with issues
better-i18n scan --format json | jq -r '.issues[].file' | sort -u

# Filter only errors
better-i18n scan --format json | jq '.issues[] | select(.severity == "error")'
```

### Combine with Other Tools

```bash
# Run with TypeScript checks
tsc --noEmit && better-i18n scan --ci

# Run with ESLint
eslint . && better-i18n scan --ci

# Parallel execution
npm-run-all --parallel typecheck lint:eslint lint:i18n
```

## Troubleshooting

### Config not detected

Make sure your `i18n.config.ts` exports either:

- `export const project = "org/slug"`
- `export const i18nWorkspaceConfig = { project: "org/slug" }`

### Too many false positives

Add exclusions to your config:

```ts
exclude: ["**/*.stories.tsx", "**/demo/**", "**/examples/**"];
```

### Clickable links not working

Make sure you're using VS Code's integrated terminal. External terminals may not support clickable file paths.

## Part of Better i18n Ecosystem

This CLI is one component of the **Better i18n translation management platform**:

### Platform Components

- **[@better-i18n/cli](https://www.npmjs.com/package/@better-i18n/cli)** - This CLI tool (detect hardcoded strings, extract keys)
- **[@better-i18n/next](https://www.npmjs.com/package/@better-i18n/next)** - Next.js SDK for runtime translation
- **[@better-i18n/app](https://dash.better-i18n.com)** - Web dashboard for translation management
- `@better-i18n/mcp`: Model Context Protocol server for AI assistants.

### Platform Features

- **GitHub Integration** - Sync translations with your repositories
- **Real-time Collaboration** - Team workflows on translations
- **CDN Delivery** - Serve translations globally from edge locations
- **Multi-language Editor** - Manage all languages in one interface
- **REST API** - Programmatic access for CI/CD automation
- **AI Context Analysis** - Automatically extract terminology from websites
- **Namespace Organization** - Organize translations by feature/module

### How This CLI Fits In

```
Developer Workflow:
├─ Write code with hardcoded strings
├─ Run: better-i18n scan → Detect hardcoded strings ⚠️
├─ Run: better-i18n sync → Compare local vs cloud keys
├─ Review in Better i18n Dashboard
├─ GitHub Hook: better-i18n scan --staged → Pre-commit check
├─ CI/CD: better-i18n sync --format json → Audit translations in pipeline
└─ Dashboard: Manage translations, sync with GitHub
```

The CLI works **in your local development** to catch issues before they ship, while the platform handles the translation management workflow.

## Contributing

Found a bug or have a feature request? [Open an issue](https://github.com/better-i18n/better-i18n/issues).

## License

MIT © [Better i18n](https://better-i18n.com)
