# What-Is Page SEO Rewrite — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `/en/what-is` as a comprehensive educational guide to fix H1 keywords, increase content from 460 to 800+ words, improve readability from 2 to ~46, add comparison table markup, and weave in 13 missing semantic keywords.

**Architecture:** Full rewrite of the React component + creation of ~45 new translation keys via Better i18n MCP. The page structure follows the pattern established by `what-is-internationalization.tsx` (definition → principles → comparison → product pitch). Content is translation-driven — all text lives in i18n keys, not hardcoded.

**Tech Stack:** TanStack Router + React 19, `@better-i18n/use-intl` for translations, Better i18n MCP tools for key management, Tailwind CSS v4 for styling.

---

### Task 1: Create Translation Keys for New Page Sections

**Files:**
- No file changes — uses MCP tools only

**Step 1: Create hero section keys**

Use `mcp__better-i18n__updateKeys` to update existing hero keys:

| Key | New Value |
|---|---|
| `whatIsPage.hero.title` | `What is i18n?` |
| `whatIsPage.hero.titleHighlight` | `Internationalization & Localization Explained` |
| `whatIsPage.hero.subtitle` | `Internationalization (i18n) and localization (l10n) are how software reaches users worldwide. This guide explains what each term means, how they differ, and how to get started.` |

**Step 2: Create i18n definition section keys**

Use `mcp__better-i18n__createKeys` in namespace `marketing`:

| Key | Value |
|---|---|
| `whatIsPage.i18nDef.title` | `What Does i18n Mean?` |
| `whatIsPage.i18nDef.paragraph1` | `The abbreviation i18n stands for internationalization. The number 18 refers to the number of letters between the first "i" and the last "n" in the word. Software developers use this shorthand daily.` |
| `whatIsPage.i18nDef.paragraph2` | `In practice, internationalization means designing your source code so it can support multiple languages and regions without rewriting the application. This includes separating user-visible text from your code, handling different character encoding standards like UTF-8, and building a flexible user interface that adapts to any locale.` |
| `whatIsPage.i18nDef.etymology` | `The numeronym i18n was coined because "internationalization" is long and hard to type. Count the letters: i-n-t-e-r-n-a-t-i-o-n-a-l-i-z-a-t-i-o-n — that's 18 letters between "i" and "n."` |

**Step 3: Create l10n definition section keys**

| Key | Value |
|---|---|
| `whatIsPage.l10nDef.title` | `What Does l10n Mean?` |
| `whatIsPage.l10nDef.paragraph1` | `The abbreviation l10n stands for localization. Like i18n, the number 10 represents the letters between "l" and "n."` |
| `whatIsPage.l10nDef.paragraph2` | `Localization is the process of adapting a software product for a specific target market. This goes beyond translating text. It includes adjusting date and time formats, currency symbols, number formatting, and ensuring images and colors are culturally appropriate. The result is translated text and locale-specific content that feels native to each audience.` |
| `whatIsPage.l10nDef.etymology` | `Just like i18n, l10n is a numeronym: l-o-c-a-l-i-z-a-t-i-o-n has 10 letters between "l" and "n."` |

**Step 4: Create comparison table keys**

| Key | Value |
|---|---|
| `whatIsPage.comparison.title` | `i18n vs l10n: Key Differences` |
| `whatIsPage.comparison.subtitle` | `While related, internationalization and localization serve different purposes in the software development lifecycle. Here is how they compare.` |
| `whatIsPage.comparison.header.aspect` | `Aspect` |
| `whatIsPage.comparison.header.i18n` | `i18n (Internationalization)` |
| `whatIsPage.comparison.header.l10n` | `l10n (Localization)` |
| `whatIsPage.comparison.rows.fullName.label` | `Full name` |
| `whatIsPage.comparison.rows.fullName.i18n` | `Internationalization` |
| `whatIsPage.comparison.rows.fullName.l10n` | `Localization` |
| `whatIsPage.comparison.rows.scope.label` | `Scope` |
| `whatIsPage.comparison.rows.scope.i18n` | `Architecture and source code design` |
| `whatIsPage.comparison.rows.scope.l10n` | `Market-specific content adaptation` |
| `whatIsPage.comparison.rows.timing.label` | `When` |
| `whatIsPage.comparison.rows.timing.i18n` | `During initial development` |
| `whatIsPage.comparison.rows.timing.l10n` | `After i18n, for each target market` |
| `whatIsPage.comparison.rows.focus.label` | `Focus` |
| `whatIsPage.comparison.rows.focus.i18n` | `Source code, user interface structure` |
| `whatIsPage.comparison.rows.focus.l10n` | `Translated text, date formatting, time formats` |
| `whatIsPage.comparison.rows.who.label` | `Done by` |
| `whatIsPage.comparison.rows.who.i18n` | `Software developers` |
| `whatIsPage.comparison.rows.who.l10n` | `Translators and localization teams` |
| `whatIsPage.comparison.rows.example.label` | `Example` |
| `whatIsPage.comparison.rows.example.i18n` | `Extracting strings from source code into key files` |
| `whatIsPage.comparison.rows.example.l10n` | `Translating a product page into Japanese` |

**Step 5: Create "What Does Internationalization Cover?" section keys**

| Key | Value |
|---|---|
| `whatIsPage.covers.title` | `What Does Internationalization Cover?` |
| `whatIsPage.covers.subtitle` | `A well-internationalized application handles these locale-specific concerns from day one.` |
| `whatIsPage.covers.ui.title` | `User Interface Layout` |
| `whatIsPage.covers.ui.description` | `Design flexible layouts that adapt to different text lengths and right-to-left scripts like Arabic and Hebrew.` |
| `whatIsPage.covers.dateTime.title` | `Date and Time Formatting` |
| `whatIsPage.covers.dateTime.description` | `Display dates and times in region-appropriate formats. For example, MM/DD/YYYY in the US versus DD.MM.YYYY in Germany.` |
| `whatIsPage.covers.encoding.title` | `Character Encoding` |
| `whatIsPage.covers.encoding.description` | `Use UTF-8 to support the full Unicode range, from Latin alphabets to CJK characters and emoji.` |
| `whatIsPage.covers.numbers.title` | `Number and Currency Formats` |
| `whatIsPage.covers.numbers.description` | `Format numbers, currencies, and units according to locale conventions. A thousand can be 1,000 or 1.000 depending on the region.` |
| `whatIsPage.covers.content.title` | `Content Separation` |
| `whatIsPage.covers.content.description` | `Keep all user-facing text in external resource files so translators can work without touching source code.` |
| `whatIsPage.covers.plurals.title` | `Pluralization Rules` |
| `whatIsPage.covers.plurals.description` | `Handle plural forms correctly across languages. English has two forms, but Arabic has six and some languages have more.` |

**Step 6: Update the "about" section title key**

Use `mcp__better-i18n__updateKeys`:

| Key | New Value |
|---|---|
| `whatIsPage.about.title` | `How Better i18n Simplifies the Process` |

**Step 7: Publish all translation changes**

Use `mcp__better-i18n__getPendingChanges` then `mcp__better-i18n__publishTranslations`.

**Step 8: Commit translation key creation (no file changes to commit — MCP-only)**

No git commit needed for this task — keys are in the CMS.

---

### Task 2: Update Meta Title Translation

**Files:**
- No file changes — uses MCP tools only

**Step 1: Update meta title key**

Use `mcp__better-i18n__updateKeys`:

| Key | New Value |
|---|---|
| `meta.whatIs.title` | `What is i18n? Internationalization & Localization Guide \| Better i18n` |

**Step 2: Publish**

Use `mcp__better-i18n__publishTranslations`.

---

### Task 3: Rewrite the React Component

**Files:**
- Modify: `src/routes/$locale/what-is.tsx` (full rewrite)

**Step 1: Rewrite the component**

Replace the entire file with the new educational structure:

```tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader, getEducationalPageStructuredData, formatStructuredData } from "@/lib/page-seo";
import { getHowToSchema } from "@/lib/structured-data";
import { useTranslations } from "@better-i18n/use-intl";
import { RelatedPages } from "@/components/RelatedPages";
import {
  IconGlobe,
  IconRocket,
  IconSparklesSoft,
  IconGithub,
  IconArrowRight,
  IconCalendar1,
  IconCodeBrackets,
  IconSettingsGear1,
  IconTranslate,
  IconImages1,
  IconFiles,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/what-is")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const messages = loaderData?.messages || {};
    const locale = loaderData?.locale || "en";

    const howItWorksNs = (messages as Record<string, unknown>)?.marketing as
      | Record<string, unknown>
      | undefined;
    const whatIsPageNs = howItWorksNs?.whatIsPage as Record<string, unknown> | undefined;
    const howItWorks = whatIsPageNs?.howItWorks as Record<string, Record<string, string>> | undefined;

    const stepKeys = ["step1", "step2", "step3", "step4"];
    const howToSteps = howItWorks
      ? stepKeys
          .filter((key) => howItWorks[key]?.title && howItWorks[key]?.description)
          .map((key) => ({
            name: howItWorks[key].title,
            text: howItWorks[key].description,
          }))
      : [];

    const educationalScripts = getEducationalPageStructuredData({
      title: "What is i18n? Internationalization & Localization Guide",
      description: "Learn the difference between internationalization (i18n) and localization (l10n). Covers key concepts, a comparison table, and how to get started.",
      url: `https://better-i18n.com/${locale}/what-is`,
    });

    const howToScript = howToSteps.length > 0
      ? formatStructuredData(getHowToSchema({
          name: "How to Internationalize Your Application with Better i18n",
          description: "Step-by-step guide to setting up internationalization using Better i18n.",
          steps: howToSteps,
          totalTime: "PT15M",
        }))
      : [];

    return getPageHead({
      messages,
      locale,
      pageKey: "whatIs",
      pathname: "/what-is",
      customStructuredData: [...educationalScripts, ...howToScript],
    });
  },
  component: WhatIsPage,
});

const COMPARISON_ROW_KEYS = [
  "fullName",
  "scope",
  "timing",
  "focus",
  "who",
  "example",
] as const;

const COVERS_ITEMS = [
  { icon: IconImages1, key: "ui" },
  { icon: IconCalendar1, key: "dateTime" },
  { icon: IconCodeBrackets, key: "encoding" },
  { icon: IconSettingsGear1, key: "numbers" },
  { icon: IconFiles, key: "content" },
  { icon: IconTranslate, key: "plurals" },
] as const;

function WhatIsPage() {
  const t = useTranslations("marketing.whatIsPage");
  const { locale } = Route.useParams();
  const currentLocale = locale || "en";

  const benefits = [
    {
      icon: IconRocket,
      titleKey: "benefits.speed.title",
      descKey: "benefits.speed.description",
    },
    {
      icon: IconSparklesSoft,
      titleKey: "benefits.ai.title",
      descKey: "benefits.ai.description",
    },
    {
      icon: IconGithub,
      titleKey: "benefits.git.title",
      descKey: "benefits.git.description",
    },
  ];

  return (
    <MarketingLayout showCTA={true}>
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mist-100 text-mist-700 text-sm font-medium mb-6">
              <IconGlobe className="size-4" />
              Educational Guide
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1] lg:text-6xl/[1.1]">
              {t("hero.title")}
              <span className="block text-mist-600">{t("hero.titleHighlight")}</span>
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* What Does i18n Mean? */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("i18nDef.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nDef.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("i18nDef.paragraph2")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">Why "i18n"?</h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("i18nDef.etymology")}
              </p>
              <div className="p-4 rounded-xl bg-white border border-mist-200">
                <code className="text-sm text-mist-900">i18n = i + (18 letters) + n</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Does l10n Mean? */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("l10nDef.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("l10nDef.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("l10nDef.paragraph2")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-white border border-mist-200">
              <h3 className="text-lg font-medium text-mist-950 mb-4">Why "l10n"?</h3>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("l10nDef.etymology")}
              </p>
              <div className="p-4 rounded-xl bg-mist-50 border border-mist-100">
                <code className="text-sm text-mist-900">l10n = l + (10 letters) + n</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("comparison.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("comparison.subtitle")}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-mist-200">
                  <th className="py-4 px-6 text-sm font-medium text-mist-600 w-1/5">
                    {t("comparison.header.aspect")}
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-mist-950 w-2/5">
                    {t("comparison.header.i18n")}
                  </th>
                  <th className="py-4 px-6 text-sm font-medium text-mist-950 w-2/5">
                    {t("comparison.header.l10n")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROW_KEYS.map((rowKey) => (
                  <tr key={rowKey} className="border-b border-mist-100 even:bg-mist-50/50">
                    <td className="py-4 px-6 text-sm font-medium text-mist-700">
                      {t(`comparison.rows.${rowKey}.label`)}
                    </td>
                    <td className="py-4 px-6 text-sm text-mist-700">
                      {t(`comparison.rows.${rowKey}.i18n`)}
                    </td>
                    <td className="py-4 px-6 text-sm text-mist-700">
                      {t(`comparison.rows.${rowKey}.l10n`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* What Does Internationalization Cover? */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("covers.title")}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("covers.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COVERS_ITEMS.map((item) => (
              <div key={item.key} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <item.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(`covers.${item.key}.title`)}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(`covers.${item.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Better i18n Simplifies the Process */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("about.title")}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("about.paragraph1")}
              </p>
              <p className="text-mist-700 leading-relaxed mb-4">
                {t("about.paragraph2")}
              </p>
              <p className="text-mist-700 leading-relaxed">
                {t("about.paragraph3")}
              </p>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.titleKey}
                    className="p-5 rounded-xl bg-mist-50 border border-mist-100 flex items-start gap-4"
                  >
                    <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 shrink-0">
                      <benefit.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-mist-950">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="mt-1 text-sm text-mist-600">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("useCases.title")}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("useCases.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard title={t("useCases.saas.title")} description={t("useCases.saas.description")} />
            <UseCaseCard title={t("useCases.mobile.title")} description={t("useCases.mobile.description")} />
            <UseCaseCard title={t("useCases.ecommerce.title")} description={t("useCases.ecommerce.description")} />
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="what-is" locale={currentLocale} variant="mixed" />
    </MarketingLayout>
  );
}

function UseCaseCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-mist-200">
      <h3 className="text-base font-medium text-mist-950 mb-2">{title}</h3>
      <p className="text-sm text-mist-700 leading-relaxed">{description}</p>
    </div>
  );
}
```

**Step 2: Verify the build compiles**

Run: `cd /Users/eraygundogmus/projects/oss/apps/landing && bun run build`
Expected: Build succeeds (or at least no TypeScript errors — content may show key names if CDN hasn't synced yet)

**Step 3: Commit**

```bash
git add src/routes/\$locale/what-is.tsx
git commit -m "feat(landing): rewrite what-is page as educational guide for SEO

- Restructure as comprehensive educational guide
- Add i18n definition section with etymology
- Add l10n definition section with etymology
- Add HTML comparison table (i18n vs l10n)
- Add 'What Does Internationalization Cover?' grid
- Condense product pitch section
- Remove old concepts cards and howItWorks steps section"
```

---

### Task 4: Update llms-txt Page Title

**Files:**
- Modify: `src/seo/llms-txt.ts:98`

**Step 1: Update the page title**

Change line 98 from:
```ts
"what-is": "What is...",
```
to:
```ts
"what-is": "What is i18n? Internationalization & Localization Guide",
```

**Step 2: Commit**

```bash
git add src/seo/llms-txt.ts
git commit -m "chore(landing): update what-is title in llms-txt"
```

---

### Task 5: Verify and Clean Up

**Step 1: Run dev server and visually check**

Run: `cd /Users/eraygundogmus/projects/oss/apps/landing && bun run dev`
Open: `http://localhost:3001/en/what-is`
Check: All sections render, table displays correctly, no missing translation keys visible.

**Step 2: Run tests**

Run: `cd /Users/eraygundogmus/projects/oss/apps/landing && bun run test`
Expected: All tests pass.

**Step 3: Verify word count target**

Count rendered words on the page — target is 800+.

**Step 4: Verify semantic keyword coverage**

Confirm these terms appear in the rendered content:
- [x] locale specific
- [x] target market
- [x] source code
- [x] software developers
- [x] date and time
- [x] user interface
- [x] number of letters
- [x] date formatting
- [x] translated text
- [x] character encoding
- [x] software product
- [x] time formats
- [x] products or services (covered by "software product" + use cases)
