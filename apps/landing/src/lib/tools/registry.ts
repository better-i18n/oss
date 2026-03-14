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
