# Better i18n

Open-source SDKs and tools for the Better i18n localization platform.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [@better-i18n/core](./packages/core) | Core utilities for locale handling | [![npm](https://img.shields.io/npm/v/@better-i18n/core)](https://www.npmjs.com/package/@better-i18n/core) |
| [@better-i18n/next](./packages/next) | Next.js SDK with middleware and hooks | [![npm](https://img.shields.io/npm/v/@better-i18n/next)](https://www.npmjs.com/package/@better-i18n/next) |
| [@better-i18n/use-intl](./packages/use-intl) | React hooks for use-intl integration | [![npm](https://img.shields.io/npm/v/@better-i18n/use-intl)](https://www.npmjs.com/package/@better-i18n/use-intl) |
| [@better-i18n/expo](./packages/expo) | Expo / React Native integration with offline caching | [![npm](https://img.shields.io/npm/v/@better-i18n/expo)](https://www.npmjs.com/package/@better-i18n/expo) |
| [@better-i18n/cli](./packages/cli) | CLI for scanning and syncing translations | [![npm](https://img.shields.io/npm/v/@better-i18n/cli)](https://www.npmjs.com/package/@better-i18n/cli) |
| [@better-i18n/mcp](./packages/mcp) | MCP server for AI agent integration | [![npm](https://img.shields.io/npm/v/@better-i18n/mcp)](https://www.npmjs.com/package/@better-i18n/mcp) |
| [@better-i18n/schemas](./packages/schemas) | Shared Zod schemas | [![npm](https://img.shields.io/npm/v/@better-i18n/schemas)](https://www.npmjs.com/package/@better-i18n/schemas) |

## Quick Start

```bash
# Install the CLI
npm install -g @better-i18n/cli

# Initialize in your project
npx @better-i18n/cli init

# Scan for translation keys
npx @better-i18n/cli scan

# Sync with Better i18n platform
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

## Documentation

See the [docs](./docs) folder or visit [better-i18n.com/docs](https://better-i18n.com/docs).

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see [LICENSE](./LICENSE) for details.
