import type { ToolMeta } from "./types";

/**
 * Icons are sprite names, not emoji. The five tools shipped with emoji
 * ("\u{1F30D}", "\u{1F9EA}", …), which render in a different family on every
 * platform, ignore the theme and sit off the text baseline. Each one maps onto a
 * name that already exists in the sprite, so the set keeps one stroke treatment:
 *   globe          — locale-explorer, the same mark the language switcher uses
 *   code-brackets  — icu-playground; an ICU message *is* braces
 *   files          — translation-file-converter, format in / format out
 *   chart          — cost-calculator; the tool produces an estimate, not a payment
 *   translate      — hreflang-generator, URLs mapped to languages
 */

/** Registry of all free tools — used by Tools Hub and RelatedTools component */
export const TOOL_REGISTRY: readonly ToolMeta[] = [
  {
    slug: "locale-explorer",
    titleKey: "marketing.tools.common.localeExplorerTitle",
    descriptionKey: "marketing.tools.common.localeExplorerDesc",
    fallbackTitle: "Locale Explorer",
    fallbackDescription: "Browse 250+ locales with Intl API examples, plural rules, and framework configs",
    icon: "globe",
    href: "tools/locale-explorer",
  },
  {
    slug: "icu-playground",
    titleKey: "marketing.tools.common.icuPlaygroundTitle",
    descriptionKey: "marketing.tools.common.icuPlaygroundDesc",
    fallbackTitle: "ICU Playground",
    fallbackDescription: "Test ICU message syntax with live preview, multi-locale output, and error explanations",
    icon: "code-brackets",
    href: "tools/icu-playground",
  },
  {
    slug: "translation-file-converter",
    titleKey: "marketing.tools.common.converterTitle",
    descriptionKey: "marketing.tools.common.converterDesc",
    fallbackTitle: "File Converter",
    fallbackDescription: "Convert between JSON, PO, XLIFF, ARB, YAML, CSV, Android XML, iOS Strings, and Properties",
    icon: "files",
    href: "tools/translation-file-converter",
  },
  {
    slug: "cost-calculator",
    titleKey: "marketing.tools.common.costCalculatorTitle",
    descriptionKey: "marketing.tools.common.costCalculatorDesc",
    fallbackTitle: "Cost Calculator",
    fallbackDescription: "Estimate localization costs with side-by-side comparison of human, AI, and Better I18N pricing",
    icon: "chart",
    href: "tools/cost-calculator",
  },
  {
    slug: "hreflang-generator",
    titleKey: "marketing.tools.common.hreflangTitle",
    descriptionKey: "marketing.tools.common.hreflangDesc",
    fallbackTitle: "Hreflang Generator",
    fallbackDescription: "Generate and validate hreflang tags for multilingual SEO in HTML, XML sitemap, or HTTP headers",
    icon: "translate",
    href: "tools/hreflang-generator",
  },
] as const;
