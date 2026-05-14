# @better-i18n/content

Content Analytics SDK for Better i18n. Track which content your users view, in which language, and from where — with `sendBeacon`-first transport and framework adapters.

## Install

```bash
npm install @better-i18n/content
```

## Configure

Get two values from your Better i18n dashboard:

| Value | Where to find it |
|---|---|
| **Project ID** | Settings → General → Project ID (format: `your-org/your-project`) |
| **API Key** | Settings → API Keys → Public Key (starts with `bi_pub_`) |

The Project ID is the same `org/project` slug shown in your dashboard URL — `dash.better-i18n.com/your-org/your-project` → `"your-org/your-project"`. Pass this exact string as `projectId`.

```bash
# .env.local
NEXT_PUBLIC_BETTER_I18N_PROJECT_ID=your-org/your-project
NEXT_PUBLIC_BETTER_I18N_KEY=bi_pub_xxxxx
```

## Quick start (Next.js)

```tsx
// app/providers.tsx
'use client'
import { ContentProvider } from '@better-i18n/content/adapters/nextjs'

export function Providers({ children }) {
  return (
    <ContentProvider
      config={{
        projectId: process.env.NEXT_PUBLIC_BETTER_I18N_PROJECT_ID!,
        apiKey: process.env.NEXT_PUBLIC_BETTER_I18N_KEY!,
      }}
    >
      {children}
    </ContentProvider>
  )
}
```

```tsx
// app/blog/[slug]/page.tsx
'use client'
import { useTrackView } from '@better-i18n/content/adapters/nextjs'

export default function BlogPost({ post }) {
  useTrackView('content.view', {
    entryId: post.id,
    contentModel: 'blog',
    entrySlug: post.slug,
    language: post.locale,
  })

  return <article>{post.body}</article>
}
```

## Framework adapters

| Adapter | Import path |
|---|---|
| Next.js | `@better-i18n/content/adapters/nextjs` |
| React | `@better-i18n/content/adapters/react` |
| Expo / React Native | `@better-i18n/content/adapters/expo` |
| Vue | `@better-i18n/content/adapters/vue` |
| Svelte | `@better-i18n/content/adapters/svelte` |
| Vanilla / UMD | `@better-i18n/content/adapters/vanilla` |
| Framework-agnostic core | `@better-i18n/content` |

## Documentation

- [Analytics overview](https://docs.better-i18n.com/sdk/analytics)
- [API Reference](https://docs.better-i18n.com/sdk/analytics-api)
- [Data Model](https://docs.better-i18n.com/sdk/analytics-data-model)
- [Framework adapters](https://docs.better-i18n.com/sdk/nextjs)

## License

MIT
