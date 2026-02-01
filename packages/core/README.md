# @better-i18n/core

Framework-agnostic core utilities for fetching translations from Better i18n CDN.

## Features

- **Framework Agnostic** - Works with any JavaScript runtime
- **Edge-Ready** - Optimized for edge environments (Cloudflare, Vercel, etc.)
- **Type-Safe** - Full TypeScript support
- **Cached** - Built-in manifest caching with configurable TTL

## Installation

```bash
npm install @better-i18n/core
# or
bun add @better-i18n/core
```

## Usage

```typescript
import { createI18nCore } from "@better-i18n/core";

const i18n = createI18nCore({
  project: "your-org/your-project",
  defaultLocale: "en",
});

// Fetch messages for a locale
const messages = await i18n.getMessages("en");

// Get available locales
const locales = await i18n.getLocales();
// ["en", "tr", "de", ...]

// Get language options with metadata (for UI)
const languages = await i18n.getLanguages();
// [{ code: "en", name: "English", nativeName: "English", flagUrl: "..." }, ...]

// Get manifest
const manifest = await i18n.getManifest();
```

## Configuration

```typescript
interface I18nCoreConfig {
  // Required
  project: string;        // "org/project" format
  defaultLocale: string;  // e.g., "en"

  // Optional
  cdnBaseUrl?: string;           // default: "https://cdn.better-i18n.com"
  manifestCacheTtlMs?: number;   // default: 300000 (5 minutes)
  debug?: boolean;               // default: false
  logLevel?: LogLevel;           // default: "warn"
  fetch?: typeof fetch;          // custom fetch function
}
```

## Framework Integrations

This package is the foundation for:

- `@better-i18n/next` - Next.js integration with ISR support
- `@better-i18n/react` - React/TanStack integration (coming soon)

## Documentation

Full documentation available at [docs.better-i18n.com](https://docs.better-i18n.com)

## License

MIT © [Better i18n](https://better-i18n.com)
