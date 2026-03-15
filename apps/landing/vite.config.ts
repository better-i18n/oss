import { defineConfig, loadEnv, type Plugin } from "vite";
import { devtools } from "@tanstack/devtools-vite";
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
  let llmsFiles: ReadonlyMap<string, string> | null = null;
  if (mode === "production" && apiKey && project) {
    try {
      const { fetchSeoData, generatePages } = await import("./src/seo/generate-pages");
      const { generateAllLlmsTxtFiles } = await import("./src/seo/llms-txt");
      const data = await fetchSeoData({ project, apiKey });
      pages = generatePages(data);
      llmsFiles = generateAllLlmsTxtFiles(data.blogPosts, data.locales, data.i18nMessages);
      console.log(`[SEO] Generated ${llmsFiles.size} llms.txt files`);
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
      "process.env.BUILD_DATE": JSON.stringify(
        new Date().toISOString().split("T")[0],
      ),
    },
    resolve: {
      conditions: [
        "worker",
        "webworker",
        "browser",
        "module",
        "development|production",
      ],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [
      tailwindcss(),
      devtools(),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        pages: pages
          .filter((p) => !p.sitemap.noindex)
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
          host: "https://better-i18n.com",
        },
        prerender: pages.length > 0
          ? {
              enabled: true,
              crawlLinks: false,
              concurrency: 20,
              filter: (page: { path: string }) =>
                pages.some((p) => p.path === page.path && p.prerender?.enabled === true),
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
      ...(llmsFiles
        ? [
            {
              name: "llms-txt",
              apply: "build",
              generateBundle() {
                for (const [fileName, source] of llmsFiles!) {
                  this.emitFile({ type: "asset", fileName, source });
                }
              },
            } satisfies Plugin,
          ]
        : []),
    ],
  };
});
