import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiKey = env.BETTER_I18N_CONTENT_API_KEY;
  const project = env.BETTER_I18N_PROJECT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pages: readonly any[] = [];
  if (mode === "production" && apiKey && project) {
    try {
      const { fetchSeoData, generatePages } = await import("./src/seo/generate-pages");
      const data = await fetchSeoData({ project, apiKey });
      pages = generatePages(data);
    } catch (error) {
      console.error("[SEO] Build-time generation failed:", error);
    }
  } else if (mode === "production") {
    const missing = [
      !apiKey && "BETTER_I18N_CONTENT_API_KEY",
      !project && "BETTER_I18N_PROJECT",
    ].filter(Boolean).join(", ");
    console.warn(`[SEO] Skipping page generation: missing env vars: ${missing}`);
  }

  return {
    define: {
      "import.meta.env.BETTER_I18N_CONTENT_API_KEY": JSON.stringify(
        env.BETTER_I18N_CONTENT_API_KEY,
      ),
      "import.meta.env.BETTER_I18N_PROJECT": JSON.stringify(
        env.BETTER_I18N_PROJECT,
      ),
      "import.meta.env.PUBLIC_SITE_URL": JSON.stringify(env.PUBLIC_SITE_URL || ""),
      "import.meta.env.PUBLIC_SITE_NAME": JSON.stringify(env.PUBLIC_SITE_NAME || ""),
      "import.meta.env.PUBLIC_DASHBOARD_URL": JSON.stringify(env.PUBLIC_DASHBOARD_URL || ""),
      "import.meta.env.PUBLIC_DOCS_URL": JSON.stringify(env.PUBLIC_DOCS_URL || ""),
      "import.meta.env.PUBLIC_LANDING_URL": JSON.stringify(env.PUBLIC_LANDING_URL || ""),
      "import.meta.env.PUBLIC_SIGNUP_URL": JSON.stringify(env.PUBLIC_SIGNUP_URL || ""),
      "import.meta.env.PUBLIC_SOCIAL_X": JSON.stringify(env.PUBLIC_SOCIAL_X || ""),
      "import.meta.env.PUBLIC_SOCIAL_GITHUB": JSON.stringify(env.PUBLIC_SOCIAL_GITHUB || ""),
      "import.meta.env.PUBLIC_SOCIAL_YOUTUBE": JSON.stringify(env.PUBLIC_SOCIAL_YOUTUBE || ""),
      "import.meta.env.PUBLIC_LOGO_URL": JSON.stringify(env.PUBLIC_LOGO_URL || ""),
      "import.meta.env.PUBLIC_ORG_URL": JSON.stringify(env.PUBLIC_ORG_URL || ""),
      "import.meta.env.PUBLIC_ORG_LOGO_URL": JSON.stringify(env.PUBLIC_ORG_LOGO_URL || ""),
      "import.meta.env.PUBLIC_OG_BASE_URL": JSON.stringify(env.PUBLIC_OG_BASE_URL || ""),
    },
    resolve: {
      dedupe: ["react", "react-dom", "use-intl"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        pages: pages
          .filter((p) => !p.sitemap?.noindex)
          .map((p) => ({
            path: p.path,
            sitemap: {
              ...p.sitemap,
              alternateRefs: [...p.sitemap.alternateRefs],
            },
            prerender: p.prerender,
          })),
        sitemap: {
          enabled: pages.length > 0,
          host: env.PUBLIC_SITE_URL || "https://help.better-i18n.com",
        },
        prerender: pages.length > 0
          ? {
              enabled: true,
              crawlLinks: false,
              concurrency: 10,
              failOnError: false,
            }
          : undefined,
      }),
      viteReact(),
      ViteMinifyPlugin({
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        minifyCSS: true,
      }),
    ],
  };
});
