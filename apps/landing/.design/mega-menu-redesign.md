# Header Mega Menu Redesign

## Tasarım Prensipleri

1. **Persona kartları → Featured cards** (büyük ikon + 1 satır description + sağda chevron)
2. **Liste itemları → İkonlu pill/grid** (renk yok, mist tonları)
3. **Footer 2 sütun:** primary action (sol) + utility (sağ)
4. **Animasyon:** `data-state` based, `animate-in`/`animate-out`, stagger 30ms
5. **İkonlar:** Mevcut SpriteIcon + central-icons-react'tan zaten var olanlar

---

## 1. PRODUCT Menu

```
╭─────────────────────────────────────────────────────────────────────╮
│ KIM IÇIN                                                            │
│                                                                     │
│  ┌─────────────────────────┐  ┌─────────────────────────┐           │
│  │ [⌨]  For Developers     │  │ [💬]  For Translators    │           │
│  │      Type-safe SDKs,    │  │       Context-rich CAT   │           │
│  │      MCP & Git workflow │  │       environment + AI   │           │
│  │                       → │  │                       →  │           │
│  └─────────────────────────┘  └─────────────────────────┘           │
│  ┌─────────────────────────┐  ┌─────────────────────────┐           │
│  │ [🚀]  For Product Teams │  │ [👥]  For Translators    │           │
│  │      Manage localization│  │       Localization at    │           │
│  │      without hassle    →│  │       enterprise scale  →│           │
│  └─────────────────────────┘  └─────────────────────────┘           │
│                                                                     │
├─ SEKTÖRE GÖRE ─────────────────────────────────────────────────────┤
│                                                                     │
│   [⚡] Startups         [☁] SaaS          [🛒] E-Commerce           │
│   [🏢] Enterprises      [🎨] Agencies      [🎓] Education           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  📋 All features →                  📅 Schedule a 30-min demo       │
╰─────────────────────────────────────────────────────────────────────╯
```

**Card interaction:** hover'da `→` sağa 4px kayar, ikon container'a subtle gradient (`from-mist-50 to-white`) gelir.

---

## 2. DEVELOPERS Menu (Framework Guides)

```
╭─────────────────────────────────────────────────────────────────────╮
│ WEB FRAMEWORKS                                                      │
│                                                                     │
│   [⚛] React        [▲] Next.js     [V] Vue         [N] Nuxt        │
│   [A] Angular      [S] Svelte      [⚡] Vite        [🅣] TanStack    │
│                                                                     │
├─ MOBILE & NATIVE ──────────────────────────────────────────────────┤
│                                                                     │
│   [📱] Expo / RN    [🍎] iOS Swift   [🤖] Android    [🐦] Flutter    │
│                                                                     │
├─ SERVER & TOOLS ───────────────────────────────────────────────────┤
│                                                                     │
│   [🔥] Hono         [🟢] Node.js     [🐍] Django     [💻] CLI        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  📚 Full documentation →                       ⌘K  Search docs      │
╰─────────────────────────────────────────────────────────────────────╯
```

**Item interaction:** hover'da chevron `›` soldan içeri kayar, framework ikonu hafifçe parlar.

---

## 3. INTEGRATIONS Menu

```
╭─────────────────────────────────────────────────────────────────────╮
│ FEATURED                                                            │
│                                                                     │
│  ┌────────────────────────────┐  ┌────────────────────────────┐    │
│  │ [🤖]  MCP Server           │  │ [🔗]  GitHub Sync          │    │
│  │       AI agents manage     │  │       PR-based i18n        │    │
│  │       translations natively│  │       workflow             │    │
│  │                          → │  │                          → │    │
│  └────────────────────────────┘  └────────────────────────────┘    │
│                                                                     │
├─ DELIVERY ─────── AI ──────────── WORKFLOW ────────────────────────┤
│                                                                     │
│  [☁] Global CDN     [✨] AI Translation   [📝] GitHub PRs           │
│  [📦] NPM Packages  [🧠] Context Crawler  [🔄] Auto-sync             │
│  [📱] Native SDKs   [📖] Glossary         [💻] CLI                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🔌 All integrations (20) →           ⚡ Build your own — API docs  │
╰─────────────────────────────────────────────────────────────────────╯
```

---

## 4. RESOURCES Menu

```
╭─────────────────────────────────────────────────────────────────────╮
│ LEARN                                                               │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │ [📖]  i18n Complete Guide                                │      │
│  │       Everything you need to know about i18n & l10n   →  │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
│   [📰] Blog              [🌐] What is i18n?    [🔧] Free tools      │
│   [✨] Changelog         [⚖] Compare TMS      [📊] Cost calculator │
│                                                                     │
├─ SUPPORT ──────────────── COMPANY ─────────────────────────────────┤
│                                                                     │
│   [💬] Help Center        [👥] About us                             │
│   [📚] Documentation      [🔒] Privacy Policy                       │
│   [🔌] API Reference      [📜] Terms of Service                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  ✉ help@better-i18n.com              🟢 All systems operational    │
╰─────────────────────────────────────────────────────────────────────╯
```

---

## Animasyon Spec

### Trigger pattern
- **Mevcut:** `group-hover` CSS only
- **Yeni:** Radix `Popover` (controlled, accessible) — hover trigger'ı `data-state` ile takip eder

### Enter animation (~200ms ease-out)
```css
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95
data-[state=open]:slide-in-from-top-2
duration-200
```

### Exit animation (~150ms ease-in)
```css
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95
data-[state=closed]:slide-out-to-top-1
duration-150
```

### Item stagger
Her child item kendi `animation-delay` alır:
```css
[&>*:nth-child(1)]:[animation-delay:0ms]
[&>*:nth-child(2)]:[animation-delay:30ms]
[&>*:nth-child(3)]:[animation-delay:60ms]
...
```

### Hover micro-interactions
- **Card:** `hover:bg-mist-50` + arrow translateX(0→4px) 200ms
- **Pill:** `hover:bg-mist-100` + scale(1→1.02)
- **Icon container:** `hover:from-white hover:to-mist-50` (subtle gradient shift)

---

## Renk & Boyut Tokenları

Mevcut Better paletinden:
- **Container bg:** `bg-mist-50` (outer wrapper) → `bg-white` (inner panels)
- **Border:** `border-mist-200` standard, `border-mist-100` subtle separators
- **Section labels:** `text-[10px] font-semibold uppercase tracking-[0.14em] text-mist-500`
- **Card title:** `text-sm font-medium text-mist-950`
- **Card description:** `text-xs text-mist-600 leading-relaxed`
- **Icon container:** `size-10 rounded-lg bg-gradient-to-br from-mist-50 to-white border border-mist-200 shadow-[0_1px_0_rgba(15,23,42,0.04)]`
- **Card shadow:** `shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)]`
- **Hover lift:** `hover:-translate-y-px hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.16)]`

---

## Implementasyon Sırası (Önerilen)

1. **Radix Popover entegrasyonu** — `@radix-ui/react-popover` paketini kur, tek bir menü için PoC yap (Product menü)
2. **Animasyon class'larını test et** — `tailwindcss-animate` plugin'i `animate-in/out` utility'lerini sağlar (Better zaten kullanıyor — `animate-in fade-in slide-in-from-bottom-2 duration-300` Hero'da var)
3. **Persona card component'i** — paylaşımlı `<MegaMenuCard>` component'i (icon + title + description + chevron)
4. **Pill/list item component'i** — paylaşımlı `<MegaMenuPill>` component'i
5. **Footer component'i** — 2-sütun primary + utility action
6. **4 menüyü sırayla migrate et** — Product → Developers → Integrations → Resources
7. **Stagger CSS** — child animation-delay sistemi
8. **MobileNav'ı da hizala** — aynı içerik yapısı, accordion içinde

---

## Kararlar (Senin onayın gerekli)

1. **Trigger:** Hover-based (mevcut UX) ya da Click-based (Linear gibi)?
2. **Industry items'ı (Enterprise/SaaS/E-Commerce vs.)** — hala persona menüsünde mi kalsın yoksa kaldıralım mı? Çoğu Linear/cal.com sadece persona/feature gösteriyor, "industry" yok.
3. **Framework ikonları** — gerçek brand SVG'leri mi kullanalım yoksa placeholder harf rozetleri mi? Resmi logoları kullanmak yasal sorun yaratabilir (Vue, React vs. ile).
4. **MCP Server'ı Featured'a çıkarmak** doğru mu? Better'ın agent-native pozisyonu için anlamlı.
