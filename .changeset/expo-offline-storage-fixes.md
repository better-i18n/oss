---
"@better-i18n/expo": patch
"@better-i18n/core": patch
---

fix(expo): offline cache fallback + Metro storage resolution

### Offline fallback (helpers.ts)

`Promise.all` içinde `core.getLanguages()` (manifest fetch) offline'da throw edince tüm init iptal oluyordu — MMKV cache'deki çeviriler hiç yüklenmiyordu.

```ts
// Before: getLanguages() throw → Promise.all → init cancelled
core.getLanguages()

// After: offline'da boş array döner, çeviriler MMKV'den yüklenir
core.getLanguages().catch(() => [] as LanguageOption[])
```

### Metro storage resolution (storage.ts)

`require("react-native-mmkv")` Metro stub bazı versiyonlarda try/catch'i bypass edip "Requiring unknown module" hatasına yol açıyordu. `import()` ile Promise-tabanlı hata yakalamaya geçildi.

```ts
// Before: senkron require → Metro stub try/catch bypass
const { MMKV } = require("react-native-mmkv");

// After: async import → her zaman catch edilebilir
const { MMKV } = await import("react-native-mmkv");
```

`@react-native-async-storage/async-storage` ve `react-native-mmkv`'nin **ikisi de yüklü olmadığında** artık `createMemoryStorage()` fallback'ine düşer.

### react-native export condition (package.json)

Metro 0.82+ varsayılan condition listesi `['require', 'react-native']` — eksik `"react-native"` export koşulu bazı Metro versiyonlarında modül resolution belirsizliğine neden oluyordu.
