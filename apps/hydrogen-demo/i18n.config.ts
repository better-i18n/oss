export const i18nConfig = {
  project: "better-i18n/hydrogen-demo",
  defaultLocale: "en",
  lint: {
    ignoreStrings: [
      // Brand names & technical identifiers
      "Better i18n",
      "Better I18N",
      "Shopify Hydrogen",
      "Shopify",
      "Shopify Collection",
      "Shopify Storefront API",
      "Better i18n CDN",
      "Better i18n CMS",
      "Product via Shopify",
      "Text via Better i18n",
      // Stats strip n-values (technical specs, not user-facing copy)
      "50+",
      "CDN-first",
      "5-min",
      "AI-powered",
      // External URLs / identifiers
      "better-i18n.com",
      "hydrogen.shopify.dev",
      "github.com/better-i18n/oss",
      // Breadcrumb "Home" — universal nav element, not translated
      "Home",
      // Error boundary title fallback (non-404 route errors — dynamic statusText)
      "Error",
      // SEO / aria labels
      "Cart",
      "Toggle menu",
      // Demo banner in Layout top bar (intentional, not user-facing i18n copy)
      "Live demo ·",
      "Live demo",
      // GitHub link label in nav
      "GitHub",
    ],
    ignorePatterns: [/[Bb]etter.i18n/, /^bi_pub_/],
  },
};
