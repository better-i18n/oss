---
"@better-i18n/vite": minor
"@better-i18n/use-intl": minor
---

Add `@better-i18n/vite` plugin for zero-FOUC server-side translation injection.

**New package: `@better-i18n/vite`**
- Vite plugin that fetches translations server-side and injects them as `<script id="__better_i18n__">` into HTML
- Locale detection from URL path, cookie, and Accept-Language header
- Works in both dev server and production build modes
- Single source of truth: configure `project` once in the plugin, provider reads it automatically

**Updated: `@better-i18n/use-intl`**
- Provider reads SSR-injected data synchronously from DOM on first render (zero FOUC)
- `project` and `locale` props are now optional when using the Vite plugin
- Backwards compatible: explicit props still take precedence over plugin data

**Usage:**
```ts
// vite.config.ts
import { betterI18n } from '@better-i18n/vite'
export default defineConfig({
  plugins: [betterI18n({ project: 'acme/dashboard' }), react()],
})
```

```tsx
// App.tsx — no project/locale/messages props needed
<BetterI18nProvider>
  <LocaleDropdown />
  <App />
</BetterI18nProvider>
```
