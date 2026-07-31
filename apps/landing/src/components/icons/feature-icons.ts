import type { SpriteIconName } from "@/components/SpriteIcon";

/**
 * feature-icons — one shared row-key → sprite-icon map for every comparison
 * matrix on the site.
 *
 * Why a shared map rather than an icon per page: the same capability appears in
 * five matrices under five spellings (`mcp`, `mcpNative`, `mcpSupport`,
 * `mcpAccess`), and an icon that means "MCP" on the Crowdin page but something
 * else on the hub is worse than no icon at all. The map is keyed by the row keys
 * that already exist in the pages' `MATRIX_ROWS` / feature lists, so a page only
 * has to call `featureIcon(row.key)`.
 *
 * The icon is a scanning aid, never information: every row still carries its
 * translated label, and no row's meaning depends on the glyph. That is why an
 * unknown key returns `undefined` (render nothing) instead of a placeholder —
 * a wrong icon is a false claim, an absent icon is just a plain row.
 *
 * Only names in `SpriteIconName` are valid (see SpriteIcon.tsx). The sprite has
 * no money, terminal, or clock glyph, so the closest honest stand-ins are used:
 * `chart` for anything priced or metered, `script` for the CLI, `rocket` for
 * setup speed.
 */

const FEATURE_ICONS: Record<string, SpriteIconName> = {
  /* Pricing, packaging and metering — `chart` reads as "a number you are
     billed on", which is what all of these rows are. */
  pricingModel: "chart",
  pricing: "chart",
  price: "chart",
  entryPrice: "chart",
  freeTier: "chart",
  hostedWords: "chart",
  wordCaps: "chart",
  aiUnits: "chart",
  aiIncluded: "chart",

  /* Anything gated by people: seats, collaborator counts, a sales call. */
  seats: "group",
  collaborators: "group",
  salesGate: "group",
  selfServeCeiling: "group",
  support: "group",

  /* Delivery */
  cdn: "globe",
  cdnDelivery: "globe",
  ota: "zap",
  otaUpdates: "zap",

  /* AI */
  ai: "sparkles-soft",
  aiApproach: "sparkles-soft",
  aiTranslation: "sparkles-soft",

  /* Git and open source */
  git: "github",
  gitFirst: "github",
  gitWorkflow: "github",
  gitIntegration: "github",
  openSource: "github",

  /* Developer surface */
  cli: "script",
  cliSdk: "script",
  cliSdks: "script",
  typeSafety: "code-brackets",
  typesafe: "code-brackets",
  developerFirst: "code",
  mobile: "code",
  proxyTranslation: "api-connection",

  /* Agents / MCP */
  mcp: "robot",
  mcpNative: "robot",
  mcpSupport: "robot",
  mcpAccess: "robot",
  agentAccess: "robot",

  /* Getting started */
  setup: "rocket",
  timeToFirstString: "rocket",
  simplicity: "rocket",
  trial: "magnifying-glass",
  tryingItOut: "magnifying-glass",
  inContextEditor: "magnifying-glass",
  astKeyDiscovery: "magnifying-glass",

  /* Docs and trust */
  docs: "book",
  documentation: "book",
  security: "shield-check",
  securityCompliance: "shield-check",
  sso: "shield-check",
};

/**
 * Icon for a comparison row, or `undefined` when we have no honest match.
 * Callers render nothing in that case: `{icon && <SpriteIcon name={icon} …/>}`.
 */
export function featureIcon(key: string): SpriteIconName | undefined {
  return FEATURE_ICONS[key];
}
