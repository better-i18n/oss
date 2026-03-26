export const i18nConfig = {
  project: "better-i18n/landing",
  defaultLocale: "en",
  lint: {
    exclude: ["**/tools/**", "**/demo/**", "**/remotion/**", "**/ProductDashboardPreview*", "**/ProductCTA*"],
    ignoreStrings: ["Better i18n", "Better I18N", "Better i18n +", "LLMs.txt", "better-i18n.com", "React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "Expo", "TanStack Start", "Server / Hono", "bunx better-i18n init", "i18n", "Breadcrumb", "Main navigation", "Site footer", "Blog pagination", "Reading progress", "Table of contents", "Call to action", "Dismiss call to action", "Platform metrics", "Industry statistics", "Trusted by leading companies", "Share on X (Twitter)", "Share on LinkedIn", "Yes", "12/12", "v1.2.0"],
    ignorePatterns: [/[Bb]etter.i18n/, /^inline-flex/, /customer$/],
  },
};
