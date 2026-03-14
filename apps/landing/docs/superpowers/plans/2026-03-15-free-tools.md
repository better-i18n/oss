# Free i18n Tools Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 5 interactive client-side developer tools + Tools Hub generating ~270 indexable SEO pages.

**Architecture:** Each tool is an independent route under `/$locale/tools/`, sharing a common `ToolLayout` wrapper and reusable data modules in `src/lib/tools/`. Programmatic pages (locale detail, converter pairs) are generated at build time via `generate-pages.ts`. All tools are client-side only with lazy-loaded heavy libraries.

**Tech Stack:** TanStack Start/Router, React 19, Tailwind CSS v4, CodeMirror 6, @messageformat/parser, gettext-parser, papaparse, recharts

**Spec:** `docs/superpowers/specs/2026-03-15-free-tools-design.md`

---

## Chunk 1: Foundation — SEO Infrastructure & Shared Components

### Task 1: Add tool pages to MARKETING_PAGES

**Files:**
- Modify: `src/seo/pages.ts:96-105` (before company pages)

- [ ] **Step 1: Add tool page entries**

Add after the educational pages block (line 95), before company pages:

```typescript
  // Free developer tools
  { path: "tools", priority: 0.8, changefreq: "monthly", prerender: true },
  { path: "tools/locale-explorer", priority: 0.9, changefreq: "monthly", prerender: true },
  { path: "tools/icu-playground", priority: 0.9, changefreq: "monthly", prerender: true },
  { path: "tools/translation-file-converter", priority: 0.9, changefreq: "monthly", prerender: true },
  { path: "tools/cost-calculator", priority: 0.9, changefreq: "monthly", prerender: true },
  { path: "tools/hreflang-generator", priority: 0.9, changefreq: "monthly", prerender: true },
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: Build succeeds, new pages appear in sitemap output

- [ ] **Step 3: Commit**

```bash
git add src/seo/pages.ts
git commit -m "feat(seo): register tool pages in MARKETING_PAGES"
```

---

### Task 2: Add tool schema to structured-data.ts (MUST run before Task 3)

**Files:**
- Modify: `src/lib/structured-data.ts` (add `getToolSchema` — note: `getHowToSchema` already exists at line 362, reuse it)

- [ ] **Step 1: Add getToolSchema function**

Add after the existing `getHowToSchema` function:

```typescript
/**
 * WebApplication Schema — for free interactive tools.
 */
export function getToolSchema(options: {
  readonly name: string;
  readonly description: string;
  readonly url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: options.name,
    description: options.description,
    url: options.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
```

**Note:** Do NOT create a new `getHowToSchema` — the existing one (line 362) already supports `name`, `description`, `steps`, `totalTime`, and `inLanguage`. Reuse it for tool usage guides.

- [ ] **Step 2: Export getToolSchema**
- [ ] **Step 3: Verify build**

Run: `bun run build`

- [ ] **Step 4: Commit**

```bash
git add src/lib/structured-data.ts
git commit -m "feat(seo): add WebApplication schema generator for tools"
```

---

### Task 3: Add "tool" PageType and breadcrumb support (depends on Task 2)

**Files:**
- Modify: `src/lib/page-seo.ts:45` (PageType union)
- Modify: `src/lib/page-seo.ts:91-106` (getStructuredDataForPageType switch)
- Modify: `src/lib/page-seo.ts:286-291` (CATEGORY_LABELS)
- Modify: `src/lib/page-seo.ts:319-329` (getBreadcrumbItems else block)

- [ ] **Step 1: Add "tool" to PageType**

At line 45, change:
```typescript
type PageType = "default" | "home" | "pricing" | "comparison" | "framework" | "educational";
```
to:
```typescript
type PageType = "default" | "home" | "pricing" | "comparison" | "framework" | "educational" | "tool";
```

- [ ] **Step 2: Add tool case to getStructuredDataForPageType**

Add before the `default` case in the switch statement:
```typescript
    case "tool":
      return formatStructuredData([
        getOrganizationSchema(),
        getToolSchema({
          name: options?.title ?? "Free i18n Tool",
          description: options?.description ?? "",
          url: options?.url ?? SITE_URL,
        }),
      ]);
```

- [ ] **Step 3: Add "tools" to CATEGORY_LABELS**

At line 286-291, add:
```typescript
  "tools": { label: "Free Tools", href: "/tools" },
```

- [ ] **Step 4: Extend getBreadcrumbItems for 3+ segments**

**Note:** The JSON-LD breadcrumb schema in `getPageHead()` (lines 196-216) already handles arbitrary depth correctly via a loop. Only the visual `getBreadcrumbItems()` helper (used by `MarketingBreadcrumb` UI component) needs this fix.

Replace the `else` block (lines 319-329) with:
```typescript
  } else if (segments.length === 2) {
    // Two segments: Home > Category > Page (e.g., /i18n/react, /compare/crowdin)
    const category = CATEGORY_LABELS[segments[0]];
    const categoryLabel = messages[`breadcrumbs.${segments[0]}`] ?? category?.label
      ?? segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    items.push({ label: categoryLabel, href: category?.href ?? `/${segments[0]}` });

    const pageSegment = segments[segments.length - 1];
    const pageLabel = messages[`breadcrumbs.${pageSegment}`]
      ?? pageSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label: pageLabel });
  } else {
    // 3+ segments: Home > Category > Subcategory > ... > Page
    const category = CATEGORY_LABELS[segments[0]];
    const categoryLabel = messages[`breadcrumbs.${segments[0]}`] ?? category?.label
      ?? segments[0].charAt(0).toUpperCase() + segments[0].slice(1);
    items.push({ label: categoryLabel, href: category?.href ?? `/${segments[0]}` });

    for (let i = 1; i < segments.length - 1; i++) {
      const subPath = segments.slice(0, i + 1).join("/");
      const subLabel = messages[`breadcrumbs.${segments[i]}`]
        ?? segments[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      items.push({ label: subLabel, href: `/${subPath}` });
    }

    const pageSegment = segments[segments.length - 1];
    const pageLabel = messages[`breadcrumbs.${pageSegment}`]
      ?? pageSegment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    items.push({ label: pageLabel });
  }
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: No type errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/page-seo.ts
git commit -m "feat(seo): add tool PageType, breadcrumb support for 3+ segments"
```

---

### Task 4: Add tools to llms.txt

**Files:**
- Modify: `src/seo/llms-txt.ts:130-190` (ENGLISH_PAGE_TITLES)
- Modify: `src/seo/llms-txt.ts:196-222` (ENGLISH_PAGE_DESCRIPTIONS)
- Modify: `src/seo/llms-txt.ts:323-327` (developerTools section)

- [ ] **Step 1: Add tool entries to ENGLISH_PAGE_TITLES**

Add before the `privacy` entry (line 189):
```typescript
  "tools": "Free i18n & Localization Developer Tools",
  "tools/locale-explorer": "Locale Explorer — Language & Region Reference",
  "tools/icu-playground": "ICU Message Format Playground & Validator",
  "tools/translation-file-converter": "Translation File Format Converter",
  "tools/cost-calculator": "Localization Cost Calculator",
  "tools/hreflang-generator": "Hreflang Tag Generator & Validator",
```

- [ ] **Step 2: Add tool entries to ENGLISH_PAGE_DESCRIPTIONS**

Add after the `"i18n/doctor"` entry (line 221):
```typescript
  "tools": "Free browser-based tools for i18n developers — locale reference, ICU message testing, file format conversion, cost estimation, and hreflang generation.",
  "tools/locale-explorer": "Interactive locale explorer with Intl API formatting examples, CLDR plural rules, and framework config generators for 250+ locales.",
  "tools/icu-playground": "Live ICU MessageFormat playground with syntax validation, multi-locale preview, variable injection, and code snippet generation.",
  "tools/translation-file-converter": "Convert between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Java Properties translation file formats.",
  "tools/cost-calculator": "Estimate localization costs across human translation, AI+review, and Better i18n — with per-language breakdown and ROI projection.",
  "tools/hreflang-generator": "Generate and validate hreflang tags for multilingual SEO — HTML link tags, XML sitemap entries, and HTTP headers.",
```

- [ ] **Step 3: Add tool paths to developerTools section**

At line 323-327, change:
```typescript
  {
    headingKey: "developerTools",
    paths: [
      "i18n/doctor", "i18n/cli-code-scanning",
    ],
  },
```
to:
```typescript
  {
    headingKey: "developerTools",
    paths: [
      "i18n/doctor", "i18n/cli-code-scanning",
      "tools", "tools/locale-explorer", "tools/icu-playground",
      "tools/translation-file-converter", "tools/cost-calculator",
      "tools/hreflang-generator",
    ],
  },
```

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: llms.txt and llms-full.txt include new tool entries

- [ ] **Step 5: Commit**

```bash
git add src/seo/llms-txt.ts
git commit -m "feat(seo): add tool pages to llms.txt for AI visibility"
```

---

### Task 5: Create shared tool types

**Files:**
- Create: `src/lib/tools/types.ts`

- [ ] **Step 1: Create types file**

```typescript
/** Shared types for all free tool pages. */

export interface LocaleData {
  readonly code: string;
  readonly language: string;
  readonly region: string | null;
  readonly script: string | null;
  readonly direction: "ltr" | "rtl";
  readonly nativeName: string;
  readonly englishName: string;
  readonly pluralCategories: readonly string[];
  readonly speakerPopulation: number | null;
}

export interface FormatDefinition {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly description: string;
  readonly mimeType: string;
}

export interface FormatPair {
  readonly slug: string;
  readonly source: FormatDefinition;
  readonly target: FormatDefinition;
}

export interface CostTier {
  readonly name: string;
  readonly minPerWord: number;
  readonly maxPerWord: number;
  readonly description: string;
}

export interface ToolMeta {
  readonly slug: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly fallbackTitle: string;
  readonly fallbackDescription: string;
  readonly icon: string;
  readonly href: string;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/tools/types.ts
git commit -m "feat(tools): add shared TypeScript types"
```

---

### Task 6: Create locale data module

**Files:**
- Create: `src/lib/tools/locales.ts`

- [ ] **Step 1: Create locale data with top ~30 locales as starter**

Create file with CLDR-sourced data. Start with top 30 locales, expand to ~250 later:

```typescript
import type { LocaleData } from "./types";

/**
 * Static locale database sourced from CLDR.
 * Single source of truth for Locale Explorer and locale selectors.
 */
export const LOCALE_DATABASE: readonly LocaleData[] = [
  { code: "en", language: "English", region: null, script: "Latin", direction: "ltr", nativeName: "English", englishName: "English", pluralCategories: ["one", "other"], speakerPopulation: 1_500_000_000 },
  { code: "en-US", language: "English", region: "United States", script: "Latin", direction: "ltr", nativeName: "English (US)", englishName: "English (United States)", pluralCategories: ["one", "other"], speakerPopulation: 330_000_000 },
  { code: "en-GB", language: "English", region: "United Kingdom", script: "Latin", direction: "ltr", nativeName: "English (UK)", englishName: "English (United Kingdom)", pluralCategories: ["one", "other"], speakerPopulation: 67_000_000 },
  { code: "de", language: "German", region: null, script: "Latin", direction: "ltr", nativeName: "Deutsch", englishName: "German", pluralCategories: ["one", "other"], speakerPopulation: 130_000_000 },
  { code: "de-DE", language: "German", region: "Germany", script: "Latin", direction: "ltr", nativeName: "Deutsch (Deutschland)", englishName: "German (Germany)", pluralCategories: ["one", "other"], speakerPopulation: 83_000_000 },
  { code: "fr", language: "French", region: null, script: "Latin", direction: "ltr", nativeName: "Français", englishName: "French", pluralCategories: ["one", "many", "other"], speakerPopulation: 310_000_000 },
  { code: "es", language: "Spanish", region: null, script: "Latin", direction: "ltr", nativeName: "Español", englishName: "Spanish", pluralCategories: ["one", "many", "other"], speakerPopulation: 560_000_000 },
  { code: "ja", language: "Japanese", region: null, script: "Japanese", direction: "ltr", nativeName: "日本語", englishName: "Japanese", pluralCategories: ["other"], speakerPopulation: 125_000_000 },
  { code: "ja-JP", language: "Japanese", region: "Japan", script: "Japanese", direction: "ltr", nativeName: "日本語 (日本)", englishName: "Japanese (Japan)", pluralCategories: ["other"], speakerPopulation: 125_000_000 },
  { code: "ko", language: "Korean", region: null, script: "Korean", direction: "ltr", nativeName: "한국어", englishName: "Korean", pluralCategories: ["other"], speakerPopulation: 82_000_000 },
  { code: "zh", language: "Chinese", region: null, script: "Simplified Han", direction: "ltr", nativeName: "中文", englishName: "Chinese", pluralCategories: ["other"], speakerPopulation: 1_100_000_000 },
  { code: "zh-CN", language: "Chinese", region: "China", script: "Simplified Han", direction: "ltr", nativeName: "中文 (中国)", englishName: "Chinese (China)", pluralCategories: ["other"], speakerPopulation: 1_000_000_000 },
  { code: "zh-TW", language: "Chinese", region: "Taiwan", script: "Traditional Han", direction: "ltr", nativeName: "中文 (台灣)", englishName: "Chinese (Taiwan)", pluralCategories: ["other"], speakerPopulation: 24_000_000 },
  { code: "ar", language: "Arabic", region: null, script: "Arabic", direction: "rtl", nativeName: "العربية", englishName: "Arabic", pluralCategories: ["zero", "one", "two", "few", "many", "other"], speakerPopulation: 420_000_000 },
  { code: "ar-SA", language: "Arabic", region: "Saudi Arabia", script: "Arabic", direction: "rtl", nativeName: "العربية (السعودية)", englishName: "Arabic (Saudi Arabia)", pluralCategories: ["zero", "one", "two", "few", "many", "other"], speakerPopulation: 35_000_000 },
  { code: "hi", language: "Hindi", region: null, script: "Devanagari", direction: "ltr", nativeName: "हिन्दी", englishName: "Hindi", pluralCategories: ["one", "other"], speakerPopulation: 600_000_000 },
  { code: "pt", language: "Portuguese", region: null, script: "Latin", direction: "ltr", nativeName: "Português", englishName: "Portuguese", pluralCategories: ["one", "many", "other"], speakerPopulation: 260_000_000 },
  { code: "pt-BR", language: "Portuguese", region: "Brazil", script: "Latin", direction: "ltr", nativeName: "Português (Brasil)", englishName: "Portuguese (Brazil)", pluralCategories: ["one", "many", "other"], speakerPopulation: 215_000_000 },
  { code: "ru", language: "Russian", region: null, script: "Cyrillic", direction: "ltr", nativeName: "Русский", englishName: "Russian", pluralCategories: ["one", "few", "many", "other"], speakerPopulation: 255_000_000 },
  { code: "tr", language: "Turkish", region: null, script: "Latin", direction: "ltr", nativeName: "Türkçe", englishName: "Turkish", pluralCategories: ["one", "other"], speakerPopulation: 88_000_000 },
  { code: "it", language: "Italian", region: null, script: "Latin", direction: "ltr", nativeName: "Italiano", englishName: "Italian", pluralCategories: ["one", "many", "other"], speakerPopulation: 68_000_000 },
  { code: "nl", language: "Dutch", region: null, script: "Latin", direction: "ltr", nativeName: "Nederlands", englishName: "Dutch", pluralCategories: ["one", "other"], speakerPopulation: 30_000_000 },
  { code: "pl", language: "Polish", region: null, script: "Latin", direction: "ltr", nativeName: "Polski", englishName: "Polish", pluralCategories: ["one", "few", "many", "other"], speakerPopulation: 45_000_000 },
  { code: "sv", language: "Swedish", region: null, script: "Latin", direction: "ltr", nativeName: "Svenska", englishName: "Swedish", pluralCategories: ["one", "other"], speakerPopulation: 13_000_000 },
  { code: "th", language: "Thai", region: null, script: "Thai", direction: "ltr", nativeName: "ไทย", englishName: "Thai", pluralCategories: ["other"], speakerPopulation: 61_000_000 },
  { code: "vi", language: "Vietnamese", region: null, script: "Latin", direction: "ltr", nativeName: "Tiếng Việt", englishName: "Vietnamese", pluralCategories: ["other"], speakerPopulation: 85_000_000 },
  { code: "id", language: "Indonesian", region: null, script: "Latin", direction: "ltr", nativeName: "Bahasa Indonesia", englishName: "Indonesian", pluralCategories: ["other"], speakerPopulation: 200_000_000 },
  { code: "uk", language: "Ukrainian", region: null, script: "Cyrillic", direction: "ltr", nativeName: "Українська", englishName: "Ukrainian", pluralCategories: ["one", "few", "many", "other"], speakerPopulation: 45_000_000 },
  { code: "he", language: "Hebrew", region: null, script: "Hebrew", direction: "rtl", nativeName: "עברית", englishName: "Hebrew", pluralCategories: ["one", "two", "other"], speakerPopulation: 9_000_000 },
  { code: "fa", language: "Persian", region: null, script: "Arabic", direction: "rtl", nativeName: "فارسی", englishName: "Persian", pluralCategories: ["one", "other"], speakerPopulation: 110_000_000 },
] as const;

/** All locale codes for route generation */
export const ALL_LOCALE_CODES: readonly string[] = LOCALE_DATABASE.map((l) => l.code);

/** Look up a locale by code */
export function getLocaleByCode(code: string): LocaleData | undefined {
  return LOCALE_DATABASE.find((l) => l.code === code);
}

/** Get related locales (same language, different region) */
export function getRelatedLocales(code: string): readonly LocaleData[] {
  const locale = getLocaleByCode(code);
  if (!locale) return [];
  return LOCALE_DATABASE.filter(
    (l) => l.language === locale.language && l.code !== code,
  );
}
```

**Note:** This is a starter set of ~30 locales. A follow-up task will expand to ~250 using a CLDR data generator script.

- [ ] **Step 2: Commit**

```bash
git add src/lib/tools/locales.ts
git commit -m "feat(tools): add CLDR locale database (starter set ~30 locales)"
```

---

### Task 7: Create format definitions module

**Files:**
- Create: `src/lib/tools/formats.ts`

- [ ] **Step 1: Create format definitions and pair list**

```typescript
import type { FormatDefinition, FormatPair } from "./types";

export const FORMATS: readonly FormatDefinition[] = [
  { id: "json", name: "JSON", extension: ".json", description: "JavaScript Object Notation — the most common i18n format for web apps", mimeType: "application/json" },
  { id: "po", name: "PO (gettext)", extension: ".po", description: "GNU gettext Portable Object — standard for C/C++, PHP, Python, Ruby", mimeType: "text/x-gettext-translation" },
  { id: "xliff", name: "XLIFF", extension: ".xliff", description: "XML Localization Interchange File Format — industry standard for CAT tools", mimeType: "application/xliff+xml" },
  { id: "arb", name: "ARB", extension: ".arb", description: "Application Resource Bundle — Flutter/Dart standard format", mimeType: "application/json" },
  { id: "yaml", name: "YAML", extension: ".yml", description: "YAML Ain't Markup Language — popular for Ruby on Rails i18n", mimeType: "text/yaml" },
  { id: "csv", name: "CSV", extension: ".csv", description: "Comma-Separated Values — spreadsheet-friendly translation format", mimeType: "text/csv" },
  { id: "android-xml", name: "Android XML", extension: ".xml", description: "Android strings.xml — native Android localization format", mimeType: "application/xml" },
  { id: "ios-strings", name: "iOS Strings", extension: ".strings", description: "Apple .strings — native iOS/macOS localization format", mimeType: "text/plain" },
  { id: "properties", name: "Java Properties", extension: ".properties", description: "Java .properties — key=value pairs for JVM applications", mimeType: "text/x-java-properties" },
] as const;

/** Get format by ID */
export function getFormatById(id: string): FormatDefinition | undefined {
  return FORMATS.find((f) => f.id === id);
}

/** All format pairs with JSON as hub (8 other formats × 2 directions = 16 pairs) */
export const FORMAT_PAIRS: readonly FormatPair[] = FORMATS
  .filter((f) => f.id !== "json")
  .flatMap((format): readonly FormatPair[] => {
    const json = FORMATS[0]; // JSON is always first
    return [
      { slug: `json-to-${format.id}`, source: json, target: format },
      { slug: `${format.id}-to-json`, source: format, target: json },
    ];
  });

/** All format pair slugs for route generation */
export const ALL_FORMAT_PAIR_SLUGS: readonly string[] = FORMAT_PAIRS.map((p) => p.slug);

/** Look up a format pair by slug */
export function getFormatPairBySlug(slug: string): FormatPair | undefined {
  return FORMAT_PAIRS.find((p) => p.slug === slug);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/tools/formats.ts
git commit -m "feat(tools): add translation file format definitions and pair registry"
```

---

### Task 8: Create ToolLayout shared components

**Files:**
- Create: `src/components/tools/ToolLayout.tsx`
- Create: `src/components/tools/ToolHero.tsx`
- Create: `src/components/tools/ToolCard.tsx`
- Create: `src/components/tools/ToolFAQ.tsx`
- Create: `src/components/tools/RelatedTools.tsx`
- Create: `src/components/tools/CodeOutput.tsx`
- Create: `src/components/tools/FileUploadZone.tsx`

- [ ] **Step 1: Create ToolHero component**

```typescript
// src/components/tools/ToolHero.tsx
interface ToolHeroProps {
  readonly title: string;
  readonly description: string;
  readonly subtitle?: string;
}

export function ToolHero({ title, description, subtitle }: ToolHeroProps) {
  return (
    <div className="text-center py-12 lg:py-16">
      <h1 className="font-display text-4xl lg:text-5xl font-medium text-mist-950 mb-4">
        {title}
      </h1>
      <p className="text-lg text-mist-700 max-w-2xl mx-auto mb-2">
        {description}
      </p>
      {subtitle && (
        <p className="text-sm text-mist-500">{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ToolFAQ component**

```typescript
// src/components/tools/ToolFAQ.tsx
import { useState } from "react";

interface FAQItem {
  readonly question: string;
  readonly answer: string;
}

interface ToolFAQProps {
  readonly items: readonly FAQItem[];
  readonly title?: string;
}

export function ToolFAQ({ items, title = "Frequently Asked Questions" }: ToolFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 border-t border-mist-200">
      <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
        {title}
      </h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border border-mist-200 rounded-lg">
            <button
              type="button"
              className="w-full text-left px-6 py-4 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span className="font-medium text-mist-950">{item.question}</span>
              <span className="text-mist-500 ml-4 shrink-0">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-4 text-mist-700 leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create ToolCard component**

```typescript
// src/components/tools/ToolCard.tsx
import { Link } from "@tanstack/react-router";

interface ToolCardProps {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: React.ReactNode;
}

export function ToolCard({ title, description, href, icon }: ToolCardProps) {
  return (
    <Link
      to={href}
      className="group block p-6 rounded-xl border border-mist-200 hover:border-mist-300 hover:shadow-sm transition-all"
    >
      <div className="mb-4 text-mist-600 group-hover:text-mist-950 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-lg font-medium text-mist-950 mb-2">
        {title}
      </h3>
      <p className="text-sm text-mist-600">{description}</p>
    </Link>
  );
}
```

- [ ] **Step 4: Create RelatedTools component**

```typescript
// src/components/tools/RelatedTools.tsx
import { ToolCard } from "./ToolCard";
import type { ToolMeta } from "@/lib/tools/types";

interface RelatedToolsProps {
  readonly tools: readonly ToolMeta[];
  readonly currentSlug: string;
  readonly locale: string;
  readonly title?: string;
}

export function RelatedTools({
  tools,
  currentSlug,
  locale,
  title = "More Free Tools",
}: RelatedToolsProps) {
  const filtered = tools.filter((t) => t.slug !== currentSlug);
  if (filtered.length === 0) return null;

  return (
    <section className="py-16 border-t border-mist-200">
      <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tool) => (
          <ToolCard
            key={tool.slug}
            title={tool.fallbackTitle}
            description={tool.fallbackDescription}
            href={`/${locale}/${tool.href}`}
            icon={<span className="text-2xl">{tool.icon}</span>}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create CodeOutput component**

```typescript
// src/components/tools/CodeOutput.tsx
import { useState } from "react";

interface CodeOutputProps {
  readonly code: string;
  readonly language?: string;
  readonly title?: string;
}

export function CodeOutput({ code, language = "text", title }: CodeOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-mist-200 overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-mist-50 border-b border-mist-200">
          <span className="text-sm font-medium text-mist-700">{title}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-sm text-mist-600 hover:text-mist-950 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="p-4 overflow-x-auto bg-mist-100 text-sm font-mono text-mist-900">
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

- [ ] **Step 6: Create FileUploadZone component**

```typescript
// src/components/tools/FileUploadZone.tsx
import { useCallback, useState } from "react";

interface FileUploadZoneProps {
  readonly accept?: string;
  readonly onFile: (content: string, fileName: string) => void;
  readonly placeholder?: string;
  readonly onTextChange?: (text: string) => void;
}

export function FileUploadZone({
  accept,
  onFile,
  placeholder = "Drag & drop a file here, or click to upload",
  onTextChange,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFile(content, file.name);
      };
      reader.readAsText(file);
    },
    [onFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver ? "border-mist-500 bg-mist-50" : "border-mist-300 hover:border-mist-400"
        }`}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <p className="text-mist-600">{placeholder}</p>
        </label>
      </div>
      {onTextChange && (
        <textarea
          placeholder="Or paste your content here..."
          onChange={(e) => onTextChange(e.target.value)}
          className="w-full h-48 p-4 border border-mist-200 rounded-lg font-mono text-sm text-mist-900 bg-white focus:ring-2 focus:ring-mist-500 focus:border-transparent resize-none"
        />
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create LocaleSelector component**

```typescript
// src/components/tools/LocaleSelector.tsx
import { useState, useMemo } from "react";
import { LOCALE_DATABASE } from "@/lib/tools/locales";
import type { LocaleData } from "@/lib/tools/types";

interface LocaleSelectorProps {
  readonly selected: readonly string[];
  readonly onChange: (codes: readonly string[]) => void;
  readonly placeholder?: string;
}

export function LocaleSelector({ selected, onChange, placeholder = "Search locales..." }: LocaleSelectorProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search) return LOCALE_DATABASE;
    const q = search.toLowerCase();
    return LOCALE_DATABASE.filter(
      (l) => l.code.toLowerCase().includes(q) || l.englishName.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q),
    );
  }, [search]);

  const toggleLocale = (code: string) => {
    onChange(selected.includes(code) ? selected.filter((c) => c !== code) : [...selected, code]);
  };

  return (
    <div className="border border-mist-200 rounded-lg overflow-hidden">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-b border-mist-200 text-sm focus:outline-none focus:ring-2 focus:ring-mist-500"
      />
      <div className="max-h-64 overflow-y-auto p-2 space-y-1">
        {filtered.map((locale) => (
          <label key={locale.code} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-mist-50 cursor-pointer">
            <input
              type="checkbox"
              checked={selected.includes(locale.code)}
              onChange={() => toggleLocale(locale.code)}
              className="rounded"
            />
            <span className="text-sm font-mono text-mist-600">{locale.code}</span>
            <span className="text-sm text-mist-700">{locale.englishName}</span>
          </label>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="px-4 py-2 border-t border-mist-200 text-sm text-mist-600">
          {selected.length} locale(s) selected
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create FormatPairSelector component**

```typescript
// src/components/tools/FormatPairSelector.tsx
import { FORMATS } from "@/lib/tools/formats";
import type { FormatDefinition } from "@/lib/tools/types";

interface FormatPairSelectorProps {
  readonly source: string | null;
  readonly target: string | null;
  readonly onSelect: (source: string, target: string) => void;
}

export function FormatPairSelector({ source, target, onSelect }: FormatPairSelectorProps) {
  const json = FORMATS[0]; // JSON is hub
  const others = FORMATS.filter((f) => f.id !== "json");

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-mist-700 mb-2">Source Format</label>
        <select
          value={source ?? ""}
          onChange={(e) => { if (target) onSelect(e.target.value, target); }}
          className="w-full px-3 py-2 border border-mist-200 rounded-lg text-sm"
        >
          <option value="">Select...</option>
          {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-mist-700 mb-2">Target Format</label>
        <select
          value={target ?? ""}
          onChange={(e) => { if (source) onSelect(source, e.target.value); }}
          className="w-full px-3 py-2 border border-mist-200 rounded-lg text-sm"
        >
          <option value="">Select...</option>
          {FORMATS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      </div>
    </div>
  );
}
```

- [ ] **Step 9: Create ToolErrorBoundary component**

```typescript
// src/components/tools/ToolErrorBoundary.tsx
import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  readonly children: ReactNode;
  readonly fallbackMessage?: string;
}

interface State {
  readonly hasError: boolean;
}

export class ToolErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Tool failed to load:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 px-6">
          <p className="text-mist-700 mb-4">
            {this.props.fallbackMessage ?? "Tool failed to load. Please refresh the page."}
          </p>
          <button
            type="button"
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="px-4 py-2 bg-mist-950 text-white rounded-lg text-sm hover:bg-mist-900 transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 10: Create ToolLayout wrapper**

```typescript
// src/components/tools/ToolLayout.tsx
import { MarketingLayout } from "@/components/MarketingLayout";
import { ToolHero } from "./ToolHero";
import { ToolFAQ } from "./ToolFAQ";
import { RelatedTools } from "./RelatedTools";
import { TOOL_REGISTRY } from "@/lib/tools/registry";

interface ToolLayoutProps {
  readonly children: React.ReactNode;
  readonly title: string;
  readonly description: string;
  readonly subtitle?: string;
  readonly currentSlug: string;
  readonly locale: string;
  readonly faqItems?: readonly { readonly question: string; readonly answer: string }[];
  readonly breadcrumbs?: readonly { readonly label: string; readonly href?: string }[];
  readonly ctaText?: string;
  readonly ctaHref?: string;
}

export function ToolLayout({
  children,
  title,
  description,
  subtitle,
  currentSlug,
  locale,
  faqItems,
  breadcrumbs,
  ctaText,
  ctaHref = "https://dash.better-i18n.com",
}: ToolLayoutProps) {
  return (
    <MarketingLayout breadcrumbs={breadcrumbs} showCTA>
      <div className="px-6 lg:px-10 max-w-6xl mx-auto">
        <ToolHero title={title} description={description} subtitle={subtitle} />
        {children}
        {ctaText && (
          <div className="text-center py-12">
            <a
              href={ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3 bg-mist-950 text-white rounded-xl font-medium hover:bg-mist-900 transition-colors"
            >
              {ctaText}
            </a>
          </div>
        )}
        {faqItems && faqItems.length > 0 && <ToolFAQ items={faqItems} />}
        <RelatedTools tools={TOOL_REGISTRY} currentSlug={currentSlug} locale={locale} />
      </div>
    </MarketingLayout>
  );
}
```

- [ ] **Step 11: Commit**

```bash
git add src/components/tools/
git commit -m "feat(tools): add shared tool components (ToolLayout, ToolHero, ToolFAQ, CodeOutput, FileUploadZone, LocaleSelector, FormatPairSelector, ToolErrorBoundary)"
```

---

### Task 9: Create tool registry

**Files:**
- Create: `src/lib/tools/registry.ts`

- [ ] **Step 1: Create tool metadata registry**

```typescript
import type { ToolMeta } from "./types";

/** Registry of all free tools — used by Tools Hub and RelatedTools component */
export const TOOL_REGISTRY: readonly ToolMeta[] = [
  {
    slug: "locale-explorer",
    titleKey: "marketing.tools.common.localeExplorerTitle",
    descriptionKey: "marketing.tools.common.localeExplorerDesc",
    fallbackTitle: "Locale Explorer",
    fallbackDescription: "Browse 250+ locales with Intl API examples, plural rules, and framework configs",
    icon: "🌍",
    href: "tools/locale-explorer",
  },
  {
    slug: "icu-playground",
    titleKey: "marketing.tools.common.icuPlaygroundTitle",
    descriptionKey: "marketing.tools.common.icuPlaygroundDesc",
    fallbackTitle: "ICU Playground",
    fallbackDescription: "Test ICU message syntax with live preview, multi-locale output, and error explanations",
    icon: "🧪",
    href: "tools/icu-playground",
  },
  {
    slug: "translation-file-converter",
    titleKey: "marketing.tools.common.converterTitle",
    descriptionKey: "marketing.tools.common.converterDesc",
    fallbackTitle: "File Converter",
    fallbackDescription: "Convert between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Properties",
    icon: "🔄",
    href: "tools/translation-file-converter",
  },
  {
    slug: "cost-calculator",
    titleKey: "marketing.tools.common.costCalculatorTitle",
    descriptionKey: "marketing.tools.common.costCalculatorDesc",
    fallbackTitle: "Cost Calculator",
    fallbackDescription: "Estimate localization costs with side-by-side comparison of human, AI, and Better i18n pricing",
    icon: "💰",
    href: "tools/cost-calculator",
  },
  {
    slug: "hreflang-generator",
    titleKey: "marketing.tools.common.hreflangTitle",
    descriptionKey: "marketing.tools.common.hreflangDesc",
    fallbackTitle: "Hreflang Generator",
    fallbackDescription: "Generate and validate hreflang tags for multilingual SEO in HTML, XML sitemap, or HTTP headers",
    icon: "🏷️",
    href: "tools/hreflang-generator",
  },
] as const;
```

- [ ] **Step 2: Create barrel export**

```typescript
// src/lib/tools/index.ts
export { LOCALE_DATABASE, ALL_LOCALE_CODES, getLocaleByCode, getRelatedLocales } from "./locales";
export { FORMATS, FORMAT_PAIRS, ALL_FORMAT_PAIR_SLUGS, getFormatById, getFormatPairBySlug } from "./formats";
export { TOOL_REGISTRY } from "./registry";
export type { LocaleData, FormatDefinition, FormatPair, CostTier, ToolMeta } from "./types";
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/tools/registry.ts src/lib/tools/index.ts
git commit -m "feat(tools): add tool registry and barrel exports"
```

---

### Task 10: Add programmatic page generators to generate-pages.ts

**Files:**
- Modify: `src/seo/generate-pages.ts` (add two new generator functions + update generatePages)

- [ ] **Step 1: Add imports at top of file**

```typescript
import { ALL_LOCALE_CODES } from "../lib/tools/locales";
import { ALL_FORMAT_PAIR_SLUGS } from "../lib/tools/formats";
```

- [ ] **Step 2: Add generateLocaleExplorerPages function**

Add before the `generatePages` function:

```typescript
// ─── Generator: Locale Explorer Detail Pages ─────────────────────────

/**
 * Generates locale detail pages (one per locale code per site locale).
 * These are programmatic pages at /tools/locale-explorer/$localeCode.
 */
function generateLocaleExplorerPages(
  allLocales: readonly string[],
): readonly PageEntry[] {
  return ALL_LOCALE_CODES.flatMap((localeCode) => {
    const sitemapLocales = allLocales.filter(
      (l) => getLocaleTier(l) !== "tier3",
    );
    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, `tools/locale-explorer/${localeCode}`),
    );

    const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
      const tier = getLocaleTier(locale);
      const shouldPrerender = tier === "tier1" || tier === "tier2";
      const priorityMultiplier = TIER_PRIORITY_MULTIPLIER[tier];

      return {
        path: buildPagePath(locale, `tools/locale-explorer/${localeCode}`),
        sitemap: {
          priority: +(0.6 * priorityMultiplier).toFixed(2),
          changefreq: "yearly",
          alternateRefs,
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });

    const tier3Locales = allLocales.filter(
      (l) => getLocaleTier(l) === "tier3",
    );
    const tier3Entries = tier3Locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `tools/locale-explorer/${localeCode}`),
      sitemap: {
        priority: 0,
        changefreq: "yearly",
        alternateRefs,
        noindex: true,
      },
    }));

    return [...sitemapEntries, ...tier3Entries];
  });
}

// ─── Generator: Converter Format Pair Pages ──────────────────────────

/**
 * Generates converter format pair pages (one per pair per site locale).
 * These are programmatic pages at /tools/translation-file-converter/$pair.
 */
function generateConverterPairPages(
  allLocales: readonly string[],
): readonly PageEntry[] {
  return ALL_FORMAT_PAIR_SLUGS.flatMap((pairSlug) => {
    const sitemapLocales = allLocales.filter(
      (l) => getLocaleTier(l) !== "tier3",
    );
    const alternateRefs = buildAlternateRefs(sitemapLocales, (locale) =>
      buildPageUrl(locale, `tools/translation-file-converter/${pairSlug}`),
    );

    const sitemapEntries = sitemapLocales.map((locale): PageEntry => {
      const tier = getLocaleTier(locale);
      const shouldPrerender = tier === "tier1" || tier === "tier2";
      const priorityMultiplier = TIER_PRIORITY_MULTIPLIER[tier];

      return {
        path: buildPagePath(locale, `tools/translation-file-converter/${pairSlug}`),
        sitemap: {
          priority: +(0.7 * priorityMultiplier).toFixed(2),
          changefreq: "monthly",
          alternateRefs,
        },
        prerender: shouldPrerender ? { enabled: true } : undefined,
      };
    });

    const tier3Locales = allLocales.filter(
      (l) => getLocaleTier(l) === "tier3",
    );
    const tier3Entries = tier3Locales.map((locale): PageEntry => ({
      path: buildPagePath(locale, `tools/translation-file-converter/${pairSlug}`),
      sitemap: {
        priority: 0,
        changefreq: "monthly",
        alternateRefs,
        noindex: true,
      },
    }));

    return [...sitemapEntries, ...tier3Entries];
  });
}
```

- [ ] **Step 3: Update generatePages to include new generators**

In the `generatePages` function (line ~594), add after `featureDetailPages`:

```typescript
  const localeExplorerPages = generateLocaleExplorerPages(locales);
  const converterPairPages = generateConverterPairPages(locales);
  const allPages = [...marketingPages, ...blogPages, ...featureDetailPages,
                     ...localeExplorerPages, ...converterPairPages];
```

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: Build succeeds, sitemap includes new locale explorer and converter pages

- [ ] **Step 5: Commit**

```bash
git add src/seo/generate-pages.ts
git commit -m "feat(seo): add programmatic page generators for locale explorer and file converter"
```

---

## Chunk 2: Locale Explorer

### Task 11: Create Locale Explorer main page

**Files:**
- Create: `src/routes/$locale/tools/locale-explorer.tsx`

Implement the searchable/filterable locale table using `LOCALE_DATABASE` from `src/lib/tools/locales.ts`. Follow the pattern from `src/routes/$locale/i18n/doctor.tsx`.

Key elements:
- `createFileRoute("/$locale/tools/locale-explorer")` with `createPageLoader()`
- `getPageHead()` with `pageType: "tool"` and `metaFallback`
- Search input filtering by locale code, language name, country
- Filter toggles: RTL/LTR, script type
- Table rows linking to detail pages via `/$locale/tools/locale-explorer/${code}`
- `ToolLayout` wrapper with FAQ items and CTA

- [ ] **Step 1: Create route file with full component**
- [ ] **Step 2: Verify dev server renders page**

Run: `bun run dev` → navigate to `http://localhost:3001/en/tools/locale-explorer`

- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/locale-explorer.tsx
git commit -m "feat(tools): add Locale Explorer main page with search and filters"
```

---

### Task 12: Create Locale Explorer detail page

**Files:**
- Create: `src/routes/$locale/tools/locale-explorer.$localeCode.tsx`

Implement the locale detail page with:
- `createFileRoute("/$locale/tools/locale-explorer/$localeCode")` with `createPageLoader()`
- `getPageHead()` with `customStructuredData` (WebPage + Speakable)
- `getLocaleByCode()` lookup from route params
- Live `Intl` API output sections (DateTimeFormat, NumberFormat, RelativeTimeFormat, ListFormat, DisplayNames)
- CLDR plural rules with numeric examples
- Framework config snippets (CodeOutput component)
- Related locales table
- 404 fallback if locale code not found

- [ ] **Step 1: Create route file with full component**
- [ ] **Step 2: Verify dev server renders detail page**

Run: `bun run dev` → navigate to `http://localhost:3001/en/tools/locale-explorer/ja-JP`

- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/locale-explorer.\$localeCode.tsx
git commit -m "feat(tools): add Locale Explorer detail page with Intl API output"
```

---

## Chunk 3: Hreflang Generator

### Task 13: Create hreflang logic module

**Files:**
- Create: `src/lib/tools/hreflang.ts`

Implement:
- `generateHreflangTags(url, locales, xDefault)` → HTML link tags
- `generateHreflangSitemap(url, locales, xDefault)` → XML sitemap entries
- `generateHreflangHeaders(url, locales, xDefault)` → HTTP Link headers
- `validateHreflangConfig(tags)` → validation warnings array
- Tests for all functions

- [ ] **Step 1: Create hreflang logic with all output formats**
- [ ] **Step 2: Write tests**

Create: `src/lib/tools/__tests__/hreflang.test.ts`

- [ ] **Step 3: Run tests**

Run: `bun test src/lib/tools/__tests__/hreflang.test.ts`

- [ ] **Step 4: Commit**

```bash
git add src/lib/tools/hreflang.ts src/lib/tools/__tests__/hreflang.test.ts
git commit -m "feat(tools): add hreflang generation and validation logic"
```

---

### Task 14: Create Hreflang Generator page

**Files:**
- Create: `src/routes/$locale/tools/hreflang-generator.tsx`

Implement with:
- URL input field
- Locale multi-select (reuses LocaleSelector from shared components)
- x-default dropdown
- Tab-switched output: HTML / XML Sitemap / HTTP Headers
- Validation warnings panel
- Bulk CSV upload mode
- Copy + download buttons

- [ ] **Step 1: Create route file with full component**
- [ ] **Step 2: Verify dev server**
- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/hreflang-generator.tsx
git commit -m "feat(tools): add Hreflang Tag Generator page"
```

---

## Chunk 4: Translation File Converter

### Task 15: Create file parser/serializer modules

**Files:**
- Create: `src/lib/tools/converters/json-converter.ts`
- Create: `src/lib/tools/converters/po-converter.ts`
- Create: `src/lib/tools/converters/xliff-converter.ts`
- Create: `src/lib/tools/converters/arb-converter.ts`
- Create: `src/lib/tools/converters/yaml-converter.ts`
- Create: `src/lib/tools/converters/csv-converter.ts`
- Create: `src/lib/tools/converters/android-xml-converter.ts`
- Create: `src/lib/tools/converters/ios-strings-converter.ts`
- Create: `src/lib/tools/converters/properties-converter.ts`
- Create: `src/lib/tools/converters/index.ts`

Each converter implements a common interface:
```typescript
interface FormatConverter {
  parse(input: string): Record<string, string>;
  serialize(data: Record<string, string>, options?: Record<string, unknown>): string;
}
```

Libraries: `gettext-parser` (PO), `yaml` (YAML), `papaparse` (CSV). JSON, ARB, Android XML, iOS .strings, Properties use custom parsers (no external deps).

- [ ] **Step 1: Create converter interface and JSON converter**
- [ ] **Step 2: Create PO converter (using gettext-parser)**
- [ ] **Step 3: Create YAML converter (using yaml)**
- [ ] **Step 4: Create CSV converter (using papaparse)**
- [ ] **Step 5: Create XLIFF converter (custom XML parser)**
- [ ] **Step 6: Create ARB, Android XML, iOS .strings, Properties converters**
- [ ] **Step 7: Create barrel export with converter registry**
- [ ] **Step 8: Write round-trip tests for all converters**

Create: `src/lib/tools/converters/__tests__/converters.test.ts`

- [ ] **Step 9: Run tests**

Run: `bun test src/lib/tools/converters/__tests__/converters.test.ts`

- [ ] **Step 10: Commit**

```bash
git add src/lib/tools/converters/
git commit -m "feat(tools): add translation file converters for 9 formats"
```

---

### Task 16: Create Converter Hub page

**Files:**
- Create: `src/routes/$locale/tools/translation-file-converter.tsx`

Implement:
- Format matrix grid (JSON row/column active, others greyed out)
- Format cards with descriptions
- Links to format pair pages

- [ ] **Step 1: Create route file**
- [ ] **Step 2: Verify dev server**
- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/translation-file-converter.tsx
git commit -m "feat(tools): add Translation File Converter hub page"
```

---

### Task 17: Create Converter format pair page

**Files:**
- Create: `src/routes/$locale/tools/translation-file-converter.$pair.tsx`

Implement:
- Dynamic route with `$pair` param (e.g., `json-to-po`)
- `getFormatPairBySlug()` lookup
- Left panel: FileUploadZone + paste textarea
- Right panel: converted output preview + download
- Format-specific options panel
- Lazy-loaded converter imports
- 404 fallback for invalid pair slugs

- [ ] **Step 1: Create route file with lazy-loaded converters**
- [ ] **Step 2: Verify dev server with `json-to-po` pair**
- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/translation-file-converter.\$pair.tsx
git commit -m "feat(tools): add format pair converter pages with lazy-loaded parsers"
```

---

## Chunk 5: ICU Playground

### Task 18: Create ICU parser wrapper

**Files:**
- Create: `src/lib/tools/icu-parser.ts`

Implement:
- `parseICUMessage(input)` → parsed AST or error with human-readable explanation
- `extractVariables(ast)` → variable names with types (string, number, date, select)
- `formatICUMessage(input, variables, locale)` → formatted output string
- Uses `@messageformat/parser` (lazy-loaded)

- [ ] **Step 1: Create ICU parser module**
- [ ] **Step 2: Write tests**

Create: `src/lib/tools/__tests__/icu-parser.test.ts`

- [ ] **Step 3: Run tests**
- [ ] **Step 4: Commit**

```bash
git add src/lib/tools/icu-parser.ts src/lib/tools/__tests__/icu-parser.test.ts
git commit -m "feat(tools): add ICU message parser with error explanations"
```

---

### Task 19: Create ICU Playground page

**Files:**
- Create: `src/routes/$locale/tools/icu-playground.tsx`

Implement:
- Left panel: CodeMirror editor (lazy-loaded) with ICU message input
- Right panel: live preview output
- Variable injection controls (auto-detected from message)
- Multi-locale preview (3-4 locales side-by-side)
- Error explanations panel
- Shareable URL (hash-encoded state)
- Examples library dropdown
- Code snippet tabs (react-intl, next-intl, i18next, vue-i18n)

- [ ] **Step 1: Create route file with lazy-loaded CodeMirror**
- [ ] **Step 2: Verify dev server**
- [ ] **Step 3: Test shareable URL encoding/decoding**
- [ ] **Step 4: Commit**

```bash
git add src/routes/$locale/tools/icu-playground.tsx
git commit -m "feat(tools): add ICU Message Playground with live preview and sharing"
```

---

## Chunk 6: Cost Calculator

### Task 20: Create cost data module

**Files:**
- Create: `src/lib/tools/cost-data.ts`

```typescript
import type { CostTier } from "./types";

export const COST_TIERS: readonly CostTier[] = [
  {
    name: "Professional Human Translation",
    minPerWord: 0.10,
    maxPerWord: 0.25,
    description: "Native translators with industry expertise",
  },
  {
    name: "Human + AI Review",
    minPerWord: 0.05,
    maxPerWord: 0.12,
    description: "Machine translation reviewed by human translators",
  },
  {
    name: "Better i18n AI",
    minPerWord: 0.01,
    maxPerWord: 0.03,
    description: "AI-powered translation with context-aware quality",
  },
] as const;

export const LANGUAGE_PRESETS = {
  european: ["de", "fr", "es", "it", "pt", "nl", "pl", "sv", "da", "fi"],
  apac: ["ja", "ko", "zh", "th", "vi", "id", "ms", "tl"],
  global20: ["de", "fr", "es", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr", "it", "nl", "pl", "sv", "th", "vi", "id", "uk", "he"],
} as const;

export const MONTHLY_CHANGE_RATE = 0.15; // 15% content change per month
export const LOCALIZATION_ROI_MULTIPLIER = 1.25; // 25% avg revenue increase per market
```

- [ ] **Step 1: Create cost data file**
- [ ] **Step 2: Commit**

```bash
git add src/lib/tools/cost-data.ts
git commit -m "feat(tools): add localization cost benchmark data"
```

---

### Task 21: Create Cost Calculator page

**Files:**
- Create: `src/routes/$locale/tools/cost-calculator.tsx`

Implement step-based UI:
- Step 1: Word count input + file upload word counter
- Step 2: Target language multi-select with presets
- Step 3: Results dashboard with 3-column comparison, per-language breakdown, ROI chart (recharts lazy-loaded)

- [ ] **Step 1: Create route file with step-based UI**
- [ ] **Step 2: Verify dev server**
- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/cost-calculator.tsx
git commit -m "feat(tools): add Localization Cost Calculator with ROI projection"
```

---

## Chunk 7: Tools Hub & Final Integration

### Task 22: Create Tools Hub page

**Files:**
- Create: `src/routes/$locale/tools/index.tsx`

Implement:
- Grid of ToolCards from `TOOL_REGISTRY`
- H1: "Free i18n & Localization Tools"
- Brief intro paragraph
- Internal links to all tool pages
- SEO: `pageType: "tool"` with FAQ

- [ ] **Step 1: Create route file**
- [ ] **Step 2: Verify dev server**
- [ ] **Step 3: Commit**

```bash
git add src/routes/$locale/tools/index.tsx
git commit -m "feat(tools): add Tools Hub index page"
```

---

### Task 23: Create i18n translation keys via MCP

**Files:** None (MCP tool calls)

Use Better i18n MCP to create translation keys:
- `page-titles.tools` (index)
- `page-titles.tools.locale-explorer`
- `page-titles.tools.icu-playground`
- `page-titles.tools.translation-file-converter`
- `page-titles.tools.cost-calculator`
- `page-titles.tools.hreflang-generator`
- `page-descriptions.tools.*` (matching descriptions)
- `breadcrumbs.tools` = "Free Tools"
- `breadcrumbs.locale-explorer` = "Locale Explorer"
- etc.

- [ ] **Step 1: Create page title keys via `createKeys` MCP tool**
- [ ] **Step 2: Create page description keys**
- [ ] **Step 3: Create breadcrumb keys**
- [ ] **Step 4: Publish translations via `publishTranslations` MCP tool**

---

### Task 24: Expand locale database to ~250 locales

**Files:**
- Modify: `src/lib/tools/locales.ts`

Use CLDR data to expand `LOCALE_DATABASE` from ~30 to ~250 entries. Include all commonly used BCP 47 codes.

- [ ] **Step 1: Generate expanded locale data from CLDR**
- [ ] **Step 2: Update LOCALE_DATABASE**
- [ ] **Step 3: Verify build (sitemap should now include ~250 locale detail pages)**
- [ ] **Step 4: Commit**

```bash
git add src/lib/tools/locales.ts
git commit -m "feat(tools): expand locale database to ~250 CLDR entries"
```

---

### Task 25: Full build verification and smoke test

- [ ] **Step 1: Full build**

Run: `bun run build`
Expected: Build succeeds with ~270+ new pages in sitemap

- [ ] **Step 2: Verify sitemap**

Check that sitemap.xml includes:
- `/en/tools/` (hub)
- `/en/tools/locale-explorer/` (main)
- `/en/tools/locale-explorer/ja-JP/` (detail example)
- `/en/tools/translation-file-converter/json-to-po/` (converter pair example)
- All 5 main tool pages
- Hreflang alternates for Tier 1-2 locales

- [ ] **Step 3: Verify llms.txt**

Check that `llms.txt` includes tool entries under Developer Tools section

- [ ] **Step 4: Smoke test each tool in dev server**

Run: `bun run dev`
Visit each tool page and verify basic functionality:
- Tools Hub: grid renders, links work
- Locale Explorer: search works, detail pages render
- ICU Playground: editor loads, preview works
- File Converter: upload works, conversion works
- Cost Calculator: steps work, chart renders
- Hreflang Generator: output generates, copy works

- [ ] **Step 5: Run all tests**

Run: `bun test`

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat(tools): complete free i18n tools suite — 5 tools, ~270 SEO pages"
```

---

## Dependency Graph

```
Task 1 (pages.ts) ──────────┐
Task 2 (structured-data.ts) ─┤
  └─► Task 3 (page-seo.ts)  ─┤  (Task 3 depends on Task 2: getToolSchema must exist)
Task 4 (llms-txt.ts) ────────┼─► Foundation complete
Task 5 (types.ts) ───────────┤
Task 6 (locales.ts) ─────────┤
Task 7 (formats.ts) ─────────┤
Task 8 (components) ─────────┤  (depends on Task 5, 6, 7 for type imports)
Task 9 (registry) ───────────┤
Task 10 (generate-pages.ts) ─┘  (depends on Task 6, 7 for locale/format data)
                              │
                  ┌───────────┼───────────┬──────────┬──────────┐
                  ▼           ▼           ▼          ▼          ▼
           Task 11-12    Task 13-14   Task 15-17  Task 18-19  Task 20-21
           (Locale       (Hreflang)   (Converter) (ICU)       (Cost)
            Explorer)
                  │           │           │          │          │
                  └───────────┴───────────┴──────────┴──────────┘
                                          │
                                    Task 22 (Hub)
                                    Task 23 (i18n keys)
                                    Task 24 (expand locales)
                                    Task 25 (verification)
```

**Parallelizable:** Tasks 11-12, 13-14, 15-17, 18-19, 20-21 are fully independent and can be dispatched to parallel agents after foundation is complete.
