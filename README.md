<p align="center">
  <a href="https://better-i18n.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://better-i18n.com/logo-dark.svg">
      <img src="https://better-i18n.com/logo.svg" alt="Better i18n" width="240">
    </picture>
  </a>
</p>

<h3 align="center">TypeScript SDKs for the Better i18n localization platform</h3>

<p align="center">
  Manage translations with CDN delivery, GitHub sync, and AI-powered workflows.
  <br />
  <a href="https://docs.better-i18n.com"><strong>Documentation</strong></a> · <a href="https://better-i18n.com"><strong>Website</strong></a> · <a href="https://better-i18n.com/blog"><strong>Blog</strong></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@better-i18n/cli"><img src="https://img.shields.io/npm/v/@better-i18n/cli?label=%40better-i18n%2Fcli&color=0284c7" alt="CLI version"></a>
  <a href="https://www.npmjs.com/package/@better-i18n/next"><img src="https://img.shields.io/npm/v/@better-i18n/next?label=%40better-i18n%2Fnext&color=0284c7" alt="Next.js SDK version"></a>
  <a href="https://www.npmjs.com/package/@better-i18n/expo"><img src="https://img.shields.io/npm/v/@better-i18n/expo?label=%40better-i18n%2Fexpo&color=0284c7" alt="Expo SDK version"></a>
  <a href="https://www.npmjs.com/package/@better-i18n/mcp"><img src="https://img.shields.io/npm/v/@better-i18n/mcp?label=%40better-i18n%2Fmcp&color=0284c7" alt="MCP version"></a>
  <a href="https://github.com/better-i18n/oss/blob/main/LICENSE"><img src="https://img.shields.io/github/license/better-i18n/oss?color=0284c7" alt="MIT License"></a>
</p>

---

## Why Better i18n?

Most localization tools weren't built for modern developer workflows. Better i18n is different:

- **GitHub-native** — translations sync as PRs, reviews happen in your existing workflow
- **CDN-delivered** — translations served from [Cloudflare's edge network](https://cloudflare.com), updated without redeployment
- **AI-powered** — context-aware translation with [Google Gemini](https://deepmind.google/technologies/gemini/), not word-by-word machine output
- **TypeScript-first** — full type safety across [Next.js](https://nextjs.org), [React](https://react.dev), [Expo](https://expo.dev), and [React Native](https://reactnative.dev)
- **MCP-ready** — AI agents can manage translations through the [Model Context Protocol](https://modelcontextprotocol.io/)

### How it compares

| Feature | Better i18n | [Crowdin](https://crowdin.com) | [Lokalise](https://lokalise.com) | [Phrase](https://phrase.com) |
|---------|:-----------:|:------:|:--------:|:------:|
| GitHub-first workflow | ✅ | Partial | Partial | ❌ |
| AI translation with context | ✅ | ✅ | ✅ | ✅ |
| CDN delivery (no redeploy) | ✅ | ❌ | ❌ | ❌ |
| TypeScript SDKs | ✅ | ❌ | ❌ | ❌ |
| MCP server for AI agents | ✅ | ❌ | ❌ | ❌ |
| CLI scanner (unused key detection) | ✅ | ❌ | ❌ | ❌ |
| ICU MessageFormat support | ✅ | ✅ | ✅ | ✅ |
| Open-source SDKs | ✅ | Partial | ❌ | ❌ |
| Free tier | ✅ | ✅ | ❌ | ❌ |

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`@better-i18n/cli`](./packages/cli) | CLI for scanning, syncing, and managing translations | [![npm](https://img.shields.io/npm/v/@better-i18n/cli)](https://www.npmjs.com/package/@better-i18n/cli) |
| [`@better-i18n/next`](./packages/next) | [Next.js](https://nextjs.org) SDK with middleware and hooks | [![npm](https://img.shields.io/npm/v/@better-i18n/next)](https://www.npmjs.com/package/@better-i18n/next) |
| [`@better-i18n/use-intl`](./packages/use-intl) | [React](https://react.dev) hooks for [use-intl](https://www.npmjs.com/package/use-intl) integration | [![npm](https://img.shields.io/npm/v/@better-i18n/use-intl)](https://www.npmjs.com/package/@better-i18n/use-intl) |
| [`@better-i18n/expo`](./packages/expo) | [Expo](https://expo.dev) / [React Native](https://reactnative.dev) integration with offline caching | [![npm](https://img.shields.io/npm/v/@better-i18n/expo)](https://www.npmjs.com/package/@better-i18n/expo) |
| [`@better-i18n/core`](./packages/core) | Core utilities for locale handling and formatting | [![npm](https://img.shields.io/npm/v/@better-i18n/core)](https://www.npmjs.com/package/@better-i18n/core) |
| [`@better-i18n/mcp`](./packages/mcp) | [MCP](https://modelcontextprotocol.io/) server for AI agent integration | [![npm](https://img.shields.io/npm/v/@better-i18n/mcp)](https://www.npmjs.com/package/@better-i18n/mcp) |
| [`@better-i18n/schemas`](./packages/schemas) | Shared [Zod](https://zod.dev) validation schemas | [![npm](https://img.shields.io/npm/v/@better-i18n/schemas)](https://www.npmjs.com/package/@better-i18n/schemas) |

## Quick Start

```bash
# Install the CLI
npm install -g @better-i18n/cli

# Initialize in your project
npx @better-i18n/cli init

# Scan your codebase for translation keys
npx @better-i18n/cli scan

# Sync translations with the Better i18n platform
npx @better-i18n/cli sync
```

## Framework Integration

### Next.js

```bash
npm install @better-i18n/next
```

```typescript
// middleware.ts
import { createI18nMiddleware } from '@better-i18n/next';

export default createI18nMiddleware({
  locales: ['en', 'tr', 'de'],
  defaultLocale: 'en',
});
```

See the [Next.js integration guide](https://docs.better-i18n.com/sdk/next) for routing, server components, and metadata setup.

### React with use-intl

```bash
npm install @better-i18n/use-intl
```

```tsx
import { BetterI18nProvider, useTranslations } from '@better-i18n/use-intl';

function App() {
  return (
    <BetterI18nProvider locale="en" messages={messages}>
      <MyComponent />
    </BetterI18nProvider>
  );
}

function MyComponent() {
  const t = useTranslations('common');
  return <h1>{t('welcome')}</h1>;
}
```

### Expo / React Native

```bash
npm install @better-i18n/expo
```

```tsx
import { BetterI18nExpoProvider, useTranslations } from '@better-i18n/expo';

export default function App() {
  return (
    <BetterI18nExpoProvider
      projectId="your-project-id"
      defaultLocale="en"
      fallbackMessages={fallback}
    >
      <HomeScreen />
    </BetterI18nExpoProvider>
  );
}
```

Supports offline caching, OTA translation updates, and automatic locale detection. See the [Expo guide](https://docs.better-i18n.com/sdk/expo).

### MCP Server (AI Agents)

```bash
npm install @better-i18n/mcp
```

Connect AI assistants like [Claude](https://claude.ai), [Cursor](https://cursor.com), or [Windsurf](https://windsurf.com) to your translation workflow through the [Model Context Protocol](https://modelcontextprotocol.io/).

## Documentation

Visit [docs.better-i18n.com](https://docs.better-i18n.com) for full documentation:

- [Getting Started](https://docs.better-i18n.com/getting-started) — setup and first project
- [CLI Reference](https://docs.better-i18n.com/cli) — all commands and options
- [SDK Guides](https://docs.better-i18n.com/sdk) — Next.js, React, Expo integrations
- [API Reference](https://docs.better-i18n.com/api) — REST API documentation
- [MCP Integration](https://docs.better-i18n.com/mcp) — AI agent setup

## Related

- [better-i18n/skills](https://github.com/better-i18n/skills) — AI agent skills for i18n best practices
- [better-i18n/status.better-i18n.com](https://github.com/better-i18n/status.better-i18n.com) — open-source status page

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting PRs.

## License

[MIT](./LICENSE) — Better i18n
