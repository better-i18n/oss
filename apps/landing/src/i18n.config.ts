export const i18nConfig = {
  project: "better-i18n/landing",
  defaultLocale: "en",
  lint: {
    exclude: ["**/tools/**", "**/demo/**", "**/remotion/**", "**/ProductDashboardPreview*", "**/ProductCTA*"],
    translationFunctions: ["useT", "useTranslations"],
    ignoreStrings: ["Better i18n", "Better I18N", "Better i18n +", "LLMs.txt", "better-i18n.com", "React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "Expo", "TanStack Start", "Server / Hono", "bunx better-i18n init", "i18n", "Breadcrumb", "Main navigation", "Site footer", "Blog pagination", "Reading progress", "Table of contents", "Call to action", "Dismiss call to action", "Platform metrics", "Industry statistics", "Trusted by leading companies", "Share on X (Twitter)", "Share on LinkedIn", "Yes", "12/12", "v1.2.0", "Carna - Better i18n customer", "Nomad Work - Better i18n customer", "Hellospace - Better i18n customer", "Masraff - Better i18n customer", "Cloudflare - Better i18n customer", "Better i18n - Translation Management Platform", "Better i18n Documentation", "Better i18n Translation Editor"],
    // NOTE: ignorePatterns regex parsing has a bug in CLI — using ignoreStrings as workaround
    // TODO: fix CLI ignorePatterns regex parsing for multiline configs (BETTER-xxx)
    ignorePatterns: [/^inline-flex/],
  },
};
