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
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    // Ensure react-dom/server CJS module is properly handled during
    // Vite's pre-bundling. TanStack Router imports it with ESM default
    // import syntax but the package is CJS — Vite needs to CJS-interop it.
    optimizeDeps: {
      include: ["react-dom/server"],
    },
    plugins: [
      // Workaround: TanStack Router/Start SSR utilities import Node.js
      // builtins (node:stream, node:async_hooks) with named exports.
      // Vite's default __vite-browser-external shim is `export default {}`
      // which has NO named exports — Rollup errors with e.g.
      // '"Readable" is not exported'. This plugin intercepts node: imports
      // in the CLIENT build only and provides stub modules with the
      // expected named exports. SSR builds pass through to real modules.
      // Safe to remove once TanStack Router properly code-splits SSR.
      {
        name: "node-builtins-client-shim",
        enforce: "pre",
        resolveId(id, _importer, options) {
          if (options?.ssr) return null;
          if (id.startsWith("node:")) return `\0shim:${id}`;
        },
        load(id) {
          if (!id.startsWith("\0shim:node:")) return;
          const mod = id.slice("\0shim:".length);
          // Provide named exports that TanStack packages actually use.
          // Any import not listed here gets a no-op default export.
          const shims: Record<string, string> = {
            "node:stream": [
              "export class Readable { static fromWeb() { return new Readable(); } static toWeb() { return new ReadableStream(); } }",
              "export class PassThrough extends Readable {}",
              "export default {}",
            ].join("\n"),
            "node:stream/web": "export const ReadableStream = globalThis.ReadableStream;",
            "node:async_hooks": "export class AsyncLocalStorage { getStore() {} run(_s, fn, ...a) { return fn(...a); } enterWith() {} }",
          };
          return shims[mod] ?? "export default {}";
        },
      } satisfies Plugin,
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
      // Workaround: TanStack Start registers the virtual module
      // "tanstack-start-injected-head-scripts:v" only for the server
      // environment. The client also imports router-manifest.js which
      // references it, causing a resolution failure. This shim MUST be
      // placed AFTER tanstackStart() so the server resolves the real
      // module (with React Refresh preamble), and only the client
      // fallthrough gets this empty stub.
      // Remove when TanStack Start aligns package versions.
      {
        name: "tanstack-start-head-scripts-shim",
        resolveId(id) {
          if (id === "tanstack-start-injected-head-scripts:v") {
            return "\0virtual:tss-head-scripts";
          }
        },
        load(id) {
          if (id === "\0virtual:tss-head-scripts") {
            return "export const injectedHeadScripts = undefined;";
          }
        },
      } satisfies Plugin,
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
