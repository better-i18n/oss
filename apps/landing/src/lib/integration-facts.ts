/**
 * Verified per-integration facts for /integrations/{slug}/.
 *
 * Every string in this file is copied from a source in the monorepo, and the
 * `source` field on each entry says which one. Nothing here is written from
 * memory of what the product probably does: the detail pages are indexed, and a
 * plausible-but-wrong install line costs more than an absent one.
 *
 * A slug with no entry still renders the page — it just does not get a code
 * block or a capability table. That is the intended failure mode
 * (rule/seo-content-is-load-bearing: the sections that exist must be true).
 *
 * Capability rows pair a proper noun (a tool name, a command, an endpoint) with
 * an i18n key for its one-line description. The noun is NOT translated — it is
 * an identifier the reader will type — so it lives here; the sentence lives on
 * the CDN.
 */

import type { CodeLang } from "@/components/CodeBlock";

export interface IntegrationSnippet {
  readonly lang: CodeLang;
  /** Shown in the code block header, in mono. A path or a surface, not prose. */
  readonly filename: string;
  readonly code: string;
}

export interface CapabilityRow {
  /** Tool name, command or endpoint. Rendered in mono, never translated. */
  readonly mono: string;
  /** Key under `integrationsPage.detail.capabilities.<id>`. */
  readonly key: string;
}

export interface IntegrationFacts {
  /** First thing to run or paste. */
  readonly install?: IntegrationSnippet;
  /** What using it looks like afterwards. */
  readonly usage?: IntegrationSnippet;
  /** Capability table rows. */
  readonly capabilities?: readonly CapabilityRow[];
  /**
   * Render the shared MCP client panel (the editor tabs from /for-developers/)
   * instead of a single snippet. Only true where those configs are the actual
   * setup: an unrelated integration must not show editor tabs.
   */
  readonly clientSetup?: boolean;
  /** Key under `integrationsPage.detail.capabilities.<key>.title` for the table heading. */
  readonly capabilitiesKey?: string;
  /** Where these facts came from. Not rendered — this is the audit trail. */
  readonly source: string;
}

/* ── Shared fact sets ───────────────────────────────────────────────
   Several integrations are the same surface described from different
   angles (the two CDN entries, the framework SDKs). They share one entry
   rather than each carrying a near-copy that can drift. */

/** packages/mcp/src/tools/ — the 16 tool files, grouped as docs/mcp/tool-reference.mdx groups them. */
const MCP_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "listProjects · getProject", key: "mcp.discovery" },
  { mono: "listKeys · getTranslations · getTranslationContext", key: "mcp.read" },
  { mono: "createKeys · updateKeys · setTranslations · deleteKeys", key: "mcp.write" },
  { mono: "proposeLanguages · proposeLanguageEdits", key: "mcp.languages" },
  { mono: "getPendingChanges · publishTranslations", key: "mcp.publish" },
  { mono: "getSyncs · getSync · cancelSync", key: "mcp.sync" },
];

/** packages/cli/src/index.ts — the registered commands. */
const CLI_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "better-i18n scan", key: "cli.scan" },
  { mono: "better-i18n sync --push", key: "cli.sync" },
  { mono: "better-i18n check:missing · check:unused", key: "cli.check" },
  { mono: "better-i18n doctor --ci", key: "cli.doctor" },
  { mono: "better-i18n keys list · create · delete", key: "cli.keys" },
  { mono: "better-i18n publish", key: "cli.publish" },
];

/** apps/docs/content/core/how-it-works.mdx — the published CDN URL shapes. */
const CDN_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "/{org}/{project}/manifest.json", key: "cdn.manifest" },
  { mono: "/{org}/{project}/{locale}.json", key: "cdn.singleFile" },
  { mono: "/{org}/{project}/{locale}/{namespace}.json", key: "cdn.namespaced" },
  { mono: "/flags/{country}.svg", key: "cdn.assets" },
];

/** apps/docs/content/api/index.mdx + apps/docs/content/api/*.mdx — documented REST surface. */
const REST_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "Authorization: Bearer bi-…", key: "api.auth" },
  { mono: "listProjects · getProject", key: "api.projects" },
  { mono: "listKeys · createKeys · updateKeys · deleteKeys", key: "api.keys" },
  { mono: "addLanguage", key: "api.languages" },
  { mono: "getSyncs · getSync", key: "api.syncs" },
];

/**
 * apps/docs/content/api/get-syncs.mdx + the MCP getSyncs `type` enum — the four
 * job types a connected repository actually produces.
 */
const GITHUB_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "initial_import", key: "github.initialImport" },
  { mono: "source_sync", key: "github.sourceSync" },
  { mono: "cdn_upload", key: "github.cdnUpload" },
  { mono: "batch_publish", key: "github.batchPublish" },
];

/** apps/docs/content/frameworks/quick-start.mdx — true for every SDK framework. */
const SDK_CAPABILITIES: readonly CapabilityRow[] = [
  { mono: "BetterI18nProvider", key: "sdk.provider" },
  { mono: "useTranslations(namespace)", key: "sdk.hook" },
  { mono: "manifest.json", key: "sdk.languages" },
  { mono: "cdn.better-i18n.com", key: "sdk.delivery" },
];

const REACT_INSTALL: IntegrationSnippet = {
  lang: "bash",
  filename: "terminal",
  code: "npm install @better-i18n/use-intl use-intl",
};

/** apps/docs/content/frameworks/quick-start.mdx — provider + hook, verbatim shape. */
const REACT_USAGE: IntegrationSnippet = {
  lang: "tsx",
  filename: "src/App.tsx",
  code: `import { BetterI18nProvider, useTranslations } from '@better-i18n/use-intl'

function App() {
  return (
    <BetterI18nProvider projectId="your-org/your-project" locale="en">
      <Welcome />
    </BetterI18nProvider>
  )
}

function Welcome() {
  const t = useTranslations('home')
  return <h1>{t('title')}</h1>
}`,
};

const SDK_FACTS: IntegrationFacts = {
  install: REACT_INSTALL,
  usage: REACT_USAGE,
  capabilities: SDK_CAPABILITIES,
  capabilitiesKey: "sdk",
  source: "apps/docs/content/frameworks/quick-start.mdx",
};

const CDN_FACTS: IntegrationFacts = {
  install: {
    lang: "bash",
    filename: "terminal",
    code: `# Every published locale is a static file on the edge
curl https://cdn.better-i18n.com/acme/webapp/manifest.json
curl https://cdn.better-i18n.com/acme/webapp/en/common.json`,
  },
  capabilities: CDN_CAPABILITIES,
  capabilitiesKey: "cdn",
  source: "apps/docs/content/core/how-it-works.mdx",
};

/* ── Per-slug table ─────────────────────────────────────────────── */

export const INTEGRATION_FACTS: Readonly<Record<string, IntegrationFacts>> = {
  /* packages/mcp/src/index.ts — endpoint, auth modes and the config block are
     quoted from the module header; the tool groups are the files in
     packages/mcp/src/tools/. */
  "mcp-server": {
    install: {
      lang: "json",
      filename: "mcp.json",
      code: `{
  "mcpServers": {
    "better-i18n": {
      "command": "npx",
      "args": ["-y", "@better-i18n/mcp@latest"]
    }
  }
}`,
    },
    usage: {
      lang: "bash",
      filename: "terminal",
      code: `# OAuth is the default: the first run opens your browser and
# caches tokens in ~/.better-i18n, refreshing them on later runs.
npx -y @better-i18n/mcp@latest

# Headless (CI, scripts) — use an API key instead of the browser flow
export BETTER_I18N_API_KEY="bi-..."
npx -y @better-i18n/mcp@latest`,
    },
    capabilities: MCP_CAPABILITIES,
    capabilitiesKey: "mcp",
    clientSetup: true,
    source: "packages/mcp/src/index.ts, packages/mcp/src/tools/*",
  },

  /* packages/cli/src/index.ts — every command below is a registered command. */
  cli: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: `npx @better-i18n/cli login
npx @better-i18n/cli scan --dir src`,
    },
    usage: {
      lang: "bash",
      filename: "terminal",
      code: `# Compare local keys with the platform, then create the missing ones
npx @better-i18n/cli sync --push --yes

# Fail a build when i18n health drops below the threshold
npx @better-i18n/cli doctor --ci --report`,
    },
    capabilities: CLI_CAPABILITIES,
    capabilitiesKey: "cli",
    source: "packages/cli/src/index.ts",
  },

  /* Same CLI, the scanning half of it: packages/cli/src/commands/scan.ts flags. */
  "code-scanning": {
    install: {
      lang: "bash",
      filename: "terminal",
      code: `# Report every user-facing string that is not wrapped in t()
npx @better-i18n/cli scan --dir src --format eslint

# Only what this commit touches, as a pre-commit gate
npx @better-i18n/cli scan --staged --ci`,
    },
    capabilities: CLI_CAPABILITIES,
    capabilitiesKey: "cli",
    source: "packages/cli/src/index.ts (scan, check, doctor)",
  },

  /* apps/docs/content/api/index.mdx — auth header and the documented endpoints. */
  api: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: `curl -H "Authorization: Bearer bi-..." \\
  https://dash.better-i18n.com/api/projects`,
    },
    capabilities: REST_CAPABILITIES,
    capabilitiesKey: "api",
    source: "apps/docs/content/api/index.mdx",
  },

  github: {
    capabilities: GITHUB_CAPABILITIES,
    capabilitiesKey: "github",
    source: "apps/docs/content/api/get-syncs.mdx (sync job types)",
  },

  "global-cdn": CDN_FACTS,
  "translation-cdn": CDN_FACTS,

  /* apps/docs/content/frameworks/nextjs/index.mdx:26,53 */
  nextjs: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: "npm install @better-i18n/next",
    },
    usage: {
      lang: "tsx",
      filename: "i18n.config.ts",
      code: `import { createI18n } from "@better-i18n/next";

export const i18n = createI18n({
  project: "your-org/your-project",
  defaultLocale: "en",
  locales: ["en", "tr", "de", "fr"],
});`,
    },
    capabilities: SDK_CAPABILITIES,
    capabilitiesKey: "sdk",
    source: "apps/docs/content/frameworks/nextjs/index.mdx",
  },

  /* apps/docs/content/frameworks/remix/api-reference.mdx:23,327 */
  remix: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: "npm install @better-i18n/remix",
    },
    usage: {
      lang: "tsx",
      filename: "app/i18n.server.ts",
      code: `import { createRemixI18n } from "@better-i18n/remix";

export const i18n = createRemixI18n({
  project: "your-org/your-project",
  defaultLocale: "en",
});`,
    },
    capabilities: SDK_CAPABILITIES,
    capabilitiesKey: "sdk",
    source: "apps/docs/content/frameworks/remix/api-reference.mdx",
  },

  /* apps/docs/content/frameworks/expo/setup.mdx:17,76 */
  expo: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: `npm install @better-i18n/expo i18next react-i18next
npx expo install expo-localization`,
    },
    usage: {
      lang: "tsx",
      filename: "i18n.ts",
      code: `import { initReactI18next } from 'react-i18next';
import { initBetterI18n } from '@better-i18n/expo';

initBetterI18n({
  project: 'your-org/your-project',
  defaultLocale: 'en',
});`,
    },
    capabilities: SDK_CAPABILITIES,
    capabilitiesKey: "sdk",
    source: "apps/docs/content/frameworks/expo/setup.mdx",
  },

  /* apps/docs/content/frameworks/vite/client.mdx:135,151 — the plugin pairs with
     the same provider the other React targets use. */
  vite: {
    install: {
      lang: "bash",
      filename: "terminal",
      code: "npm install @better-i18n/vite @better-i18n/use-intl use-intl",
    },
    usage: REACT_USAGE,
    capabilities: SDK_CAPABILITIES,
    capabilitiesKey: "sdk",
    source: "apps/docs/content/frameworks/vite/*.mdx",
  },

  /* apps/docs/content/frameworks/tanstack-start/index.mdx:24 + middleware.mdx:13 */
  "tanstack-start": {
    install: REACT_INSTALL,
    usage: {
      lang: "tsx",
      filename: "src/middleware/i18n.ts",
      code: `import { createBetterI18nMiddleware } from "@better-i18n/use-intl/middleware"
import { i18nConfig } from "../i18n.config"

export const i18nMiddleware = createBetterI18nMiddleware(i18nConfig)`,
    },
    capabilities: SDK_CAPABILITIES,
    capabilitiesKey: "sdk",
    source: "apps/docs/content/frameworks/tanstack-start/*.mdx",
  },

  react: SDK_FACTS,
};

export function getIntegrationFacts(slug: string): IntegrationFacts | null {
  return INTEGRATION_FACTS[slug] ?? null;
}
