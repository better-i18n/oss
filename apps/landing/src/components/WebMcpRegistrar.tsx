import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { MARKETING_PAGES } from "../seo/pages";

interface ModelContextTool {
  readonly name: string;
  readonly description: string;
  readonly title?: string;
  readonly inputSchema?: Readonly<Record<string, unknown>>;
  readonly annotations?: Readonly<Record<string, unknown>>;
  readonly execute: (input: unknown) => Promise<unknown>;
}

interface ModelContextApi {
  readonly registerTool?: (
    tool: ModelContextTool,
    options?: { readonly signal?: AbortSignal },
  ) => unknown;
  readonly provideContext?: (context: { readonly tools: readonly ModelContextTool[] }) => unknown;
}

declare global {
  interface Navigator {
    readonly modelContext?: ModelContextApi;
  }
}

const DASHBOARD_URL = "https://dash.better-i18n.com";
const DOCS_URL = "https://docs.better-i18n.com";

interface PageCatalog {
  readonly core: readonly string[];
  readonly personas: readonly string[];
  readonly frameworkGuides: readonly string[];
  readonly comparisons: readonly string[];
  readonly tools: readonly string[];
  readonly educational: readonly string[];
}

const PAGE_CATALOG: PageCatalog = Object.freeze({
  core: Object.freeze(["", "features", "pricing", "integrations"]),
  personas: Object.freeze(
    MARKETING_PAGES.filter((p) => p.path.startsWith("for-")).map((p) => p.path),
  ),
  frameworkGuides: Object.freeze(
    MARKETING_PAGES.filter((p) => p.path.startsWith("i18n/")).map((p) => p.path),
  ),
  comparisons: Object.freeze(
    MARKETING_PAGES.filter((p) => p.path === "compare" || p.path.startsWith("compare/")).map(
      (p) => p.path,
    ),
  ),
  tools: Object.freeze(
    MARKETING_PAGES.filter((p) => p.path === "tools" || p.path.startsWith("tools/")).map(
      (p) => p.path,
    ),
  ),
  educational: Object.freeze(
    MARKETING_PAGES.filter((p) => p.path.startsWith("what-is")).map((p) => p.path),
  ),
});

function stripSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, "");
}

function readStringField(input: unknown, field: string): string {
  if (typeof input !== "object" || input === null) return "";
  const candidate = (input as Record<string, unknown>)[field];
  return typeof candidate === "string" ? candidate : "";
}

interface WebMcpRegistrarProps {
  readonly locale: string;
}

export function WebMcpRegistrar({ locale }: WebMcpRegistrarProps) {
  const router = useRouter();

  useEffect(() => {
    const ctx = typeof navigator !== "undefined" ? navigator.modelContext : undefined;
    if (!ctx) return;

    const controller = new AbortController();

    const tools: readonly ModelContextTool[] = [
      {
        name: "navigate_to_page",
        title: "Navigate to a Better I18N page",
        description:
          "Navigate the Better I18N marketing site to a specific page using client-side routing. " +
          "Accepts a locale-less slug such as 'pricing', 'features', 'i18n/react', 'compare/crowdin', or 'for-developers'. " +
          "Pass an empty string to go to the homepage. Use the list_pages tool to discover valid slugs.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description:
                "Page slug without locale prefix (e.g. 'pricing', 'i18n/nextjs', '' for home).",
            },
          },
          required: ["path"],
          additionalProperties: false,
        },
        execute: async (input) => {
          const path = stripSlashes(readStringField(input, "path"));
          const target = path ? `/${locale}/${path}` : `/${locale}`;
          await router.navigate({ to: target });
          return { success: true, navigatedTo: target };
        },
      },
      {
        name: "list_pages",
        title: "List every available Better I18N marketing page",
        description:
          "Return a catalog of every public page on Better I18N's marketing site, grouped by category: " +
          "'core' (home, features, pricing, integrations), 'personas' (for-developers, for-agencies, etc.), " +
          "'frameworkGuides' (i18n/react, i18n/nextjs, i18n/expo, etc.), 'comparisons' (compare/crowdin, compare/lokalise, etc.), " +
          "'tools' (free developer tools), and 'educational' (what-is-*). Call this before navigate_to_page when unsure of a path.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: async () => PAGE_CATALOG,
      },
      {
        name: "search_pages",
        title: "Search Better I18N pages by keyword",
        description:
          "Find pages on the Better I18N marketing site whose slug contains a keyword. " +
          "Useful for locating a framework guide, competitor comparison, or persona page when the exact slug is unknown. " +
          "Matches are case-insensitive substring matches against the path.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keyword to match against page slugs (case-insensitive).",
            },
          },
          required: ["query"],
          additionalProperties: false,
        },
        annotations: { readOnlyHint: true },
        execute: async (input) => {
          const query = readStringField(input, "query").toLowerCase().trim();
          if (!query) return { matches: [] as readonly string[] };
          const matches = MARKETING_PAGES.filter((p) =>
            p.path.toLowerCase().includes(query),
          ).map((p) => p.path);
          return { matches };
        },
      },
      {
        name: "open_dashboard",
        title: "Open the Better I18N dashboard",
        description:
          "Navigate the browser to the Better I18N dashboard at dash.better-i18n.com. " +
          "Use this when the user wants to sign up, sign in, or start a new localization project. " +
          "Optionally accepts a sub-path such as 'signup' or 'login'.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Optional dashboard sub-path (e.g. 'signup', 'login').",
            },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const sub = stripSlashes(readStringField(input, "path"));
          const target = sub ? `${DASHBOARD_URL}/${sub}` : DASHBOARD_URL;
          window.location.href = target;
          return { success: true, target };
        },
      },
      {
        name: "open_docs",
        title: "Open the Better I18N documentation",
        description:
          "Navigate the browser to the Better I18N docs at docs.better-i18n.com. " +
          "Use this when the user asks how to integrate Better I18N or needs SDK/API reference. " +
          "Optionally accepts a sub-path such as 'quickstart' or 'sdk/next'.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Optional docs sub-path (e.g. 'quickstart', 'sdk/next').",
            },
          },
          additionalProperties: false,
        },
        execute: async (input) => {
          const sub = stripSlashes(readStringField(input, "path"));
          const target = sub ? `${DOCS_URL}/${sub}` : DOCS_URL;
          window.location.href = target;
          return { success: true, target };
        },
      },
    ];

    if (typeof ctx.registerTool === "function") {
      for (const tool of tools) {
        try {
          ctx.registerTool(tool, { signal: controller.signal });
        } catch {
          // Per-tool registration failures shouldn't prevent remaining tools
          // from registering. The API is still a draft — shape rejections
          // from older implementations are expected on some fields.
        }
      }
    } else if (typeof ctx.provideContext === "function") {
      try {
        ctx.provideContext({ tools });
      } catch {
        // Older draft API — if the batch shape is rejected we have no way
        // to recover per-tool, so skip silently.
      }
    }

    return () => controller.abort();
  }, [router, locale]);

  return null;
}
