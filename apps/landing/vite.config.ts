import { defineConfig, loadEnv, type Plugin } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "url";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiKey = env.BETTER_I18N_CONTENT_API_KEY;
  const project = env.BETTER_I18N_PROJECT;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pages: readonly any[] = [];
  let llmsTxtContent: string | null = null;
  if (mode === "production" && apiKey && project) {
    try {
      const { generatePages } = await import("./src/seo/generate-pages");
      pages = await generatePages({ project, apiKey });
    } catch (error) {
      console.error("[SEO] Page generation failed:", error);
    }
    try {
      const { generateLlmsTxtContent } = await import("./src/seo/llms-txt");
      llmsTxtContent = await generateLlmsTxtContent({ project, apiKey });
    } catch (error) {
      console.error("[SEO] llms.txt generation failed:", error);
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
        pages: pages.map((p) => ({
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
            }
          : undefined,
      }),
      viteReact(),
      ...(llmsTxtContent
        ? [
            {
              name: "llms-txt",
              apply: "build",
              generateBundle() {
                this.emitFile({
                  type: "asset",
                  fileName: "llms.txt",
                  source: llmsTxtContent!,
                });
              },
            } satisfies Plugin,
          ]
        : []),
      // Workaround: TanStack Start's sitemap generator omits the xhtml namespace
      // declaration, adds spurious xmlns="" on <xhtml:link> elements, and strips
      // trailing slashes from <loc>/<href> URLs causing 307 redirects.
      {
        name: "fix-sitemap",
        apply: "build",
        closeBundle() {
          const sitemapPath = path.join("dist", "client", "sitemap.xml");
          if (!existsSync(sitemapPath)) return;

          const xml = readFileSync(sitemapPath, "utf-8");
          const fixed = xml
            .replace(
              '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">',
              '<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
            )
            .replace(/ xmlns=""/g, "")
            // Ensure all <loc> URLs end with trailing slash to avoid 307 redirects
            .replace(/<loc>(https:\/\/[^<]+?)(?<!\/)(?=<\/loc>)/g, "<loc>$1/")
            // Ensure all hreflang href URLs end with trailing slash
            .replace(/href="(https:\/\/[^"]+?)(?<!\/)"/g, 'href="$1/"');

          writeFileSync(sitemapPath, fixed);
          console.log("[SEO] Fixed sitemap: xhtml namespace + trailing slashes");
        },
      } satisfies Plugin,
    ],
  };
});
