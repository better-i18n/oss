import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";

// ─── Types ───────────────────────────────────────────────────────────

const VENDORS = ["betterI18n", "lokalise", "crowdin", "phrase"] as const;
type Vendor = (typeof VENDORS)[number];

/**
 * Cell semantics:
 *   true            → ✓ (full support)
 *   false           → — (not available)
 *   string          → literal text, NOT translated (e.g. prices "$290 / mo", counts "8+")
 *   { i18n, fb }    → translated cell value via `comparison.values.{i18n}` key
 */
type Cell = true | false | string | { i18n: string; fb: string };

const VENDOR_LABELS: Record<Vendor, string> = {
  betterI18n: "Better I18N",
  lokalise: "Lokalise",
  crowdin: "Crowdin",
  phrase: "Phrase",
};

/**
 * Render the vendor label. Better I18N is special-cased to show our logo
 * + branded wordmark; competitors render as plain text.
 */
function VendorHeader({ vendor }: { vendor: Vendor }) {
  if (vendor === "betterI18n") {
    return (
      <span className="inline-flex items-center justify-center gap-2">
        <img
          src="/brand/logo.svg"
          alt=""
          aria-hidden
          className="size-5 shrink-0"
          loading="lazy"
        />
        <span>Better I18N</span>
      </span>
    );
  }
  return <span>{VENDOR_LABELS[vendor]}</span>;
}

type Item =
  | { type: "section"; key: string; fb: string }
  | {
      type: "row";
      key: string;
      fb: string;
      cells: Record<Vendor, Cell>;
    };

// ─── Cell value shorthands ───────────────────────────────────────────

const v = (i18n: string, fb: string) => ({ i18n, fb });

const VAL = {
  unlimited: v("unlimited", "Unlimited"),
  limited: v("limited", "Limited"),
  payPerWord: v("payPerWord", "Pay per word"),
  addOn: v("addOn", "Add-on"),
  builtIn: v("builtIn", "Built-in"),
  plugin: v("plugin", "Plugin"),
  native: v("native", "Native"),
  custom: v("custom", "Custom"),
  trialOnly: v("trialOnly", "Trial only"),
  few: v("few", "Few"),
};

// ─── Comparison matrix (the source of truth) ─────────────────────────

const ITEMS: Item[] = [
  // ── Pricing ────────────────────────────────────────────────────────
  { type: "section", key: "sections.pricing", fb: "Pricing" },
  {
    type: "row",
    key: "rows.startingPrice",
    fb: "Starting price",
    cells: {
      betterI18n: v("free", "Free"),
      lokalise: "$290 / mo",
      crowdin: "$400 / mo",
      phrase: "$2,100 / mo",
    },
  },
  {
    type: "row",
    key: "rows.proPrice",
    fb: "Pro tier",
    cells: {
      betterI18n: "$20 / mo",
      lokalise: "$290 / mo",
      crowdin: "$400 / mo",
      phrase: "$2,100 / mo",
    },
  },
  {
    type: "row",
    key: "rows.freeTier",
    fb: "Free forever tier",
    cells: {
      betterI18n: true,
      lokalise: VAL.trialOnly,
      crowdin: VAL.limited,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.perSeat",
    fb: "Per-seat pricing",
    cells: {
      betterI18n: false,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.annualLockIn",
    fb: "Annual contract required",
    cells: {
      betterI18n: false,
      lokalise: false,
      crowdin: false,
      phrase: true,
    },
  },

  // ── Translation engine ─────────────────────────────────────────────
  { type: "section", key: "sections.engine", fb: "Translation engine" },
  {
    type: "row",
    key: "rows.aiTranslations",
    fb: "AI translations included",
    cells: {
      betterI18n: VAL.unlimited,
      lokalise: VAL.payPerWord,
      crowdin: VAL.limited,
      phrase: VAL.addOn,
    },
  },
  {
    type: "row",
    key: "rows.translationMemory",
    fb: "Translation memory",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.glossary",
    fb: "Glossary management",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.brandVoice",
    fb: "Brand voice tuning",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.ragContext",
    fb: "RAG context retrieval",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.aiSuggestions",
    fb: "Inline AI suggestions",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },

  // ── Developer experience ───────────────────────────────────────────
  { type: "section", key: "sections.devEx", fb: "Developer experience" },
  {
    type: "row",
    key: "rows.gitSync",
    fb: "Git sync",
    cells: {
      betterI18n: VAL.builtIn,
      lokalise: VAL.plugin,
      crowdin: VAL.plugin,
      phrase: VAL.plugin,
    },
  },
  {
    type: "row",
    key: "rows.cli",
    fb: "CLI tool",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.typeSafeSdk",
    fb: "Type-safe SDK",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.openSourceSdks",
    fb: "Open-source SDKs",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.mcpServer",
    fb: "MCP server for AI agents",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.frameworkSupport",
    fb: "Framework adapters",
    cells: {
      betterI18n: "8+",
      lokalise: VAL.few,
      crowdin: VAL.few,
      phrase: VAL.few,
    },
  },
  {
    type: "row",
    key: "rows.webhooks",
    fb: "Webhook events",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },

  // ── Content delivery ───────────────────────────────────────────────
  { type: "section", key: "sections.delivery", fb: "Content delivery" },
  {
    type: "row",
    key: "rows.edgeCdn",
    fb: "Edge CDN delivery",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.cachePurge",
    fb: "Instant cache purge on publish",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.namespaces",
    fb: "Per-namespace JSON delivery",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.staticFallback",
    fb: "Static fallback bundles",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.versioning",
    fb: "Translation versioning",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },

  // ── Content & marketing ─────────────────────────────────────────────
  { type: "section", key: "sections.content", fb: "Content & marketing" },
  {
    type: "row",
    key: "rows.contentCms",
    fb: "Headless CMS bundled",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.marketingPages",
    fb: "Localized marketing pages",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },
  {
    type: "row",
    key: "rows.blog",
    fb: "Multilingual blog",
    cells: {
      betterI18n: true,
      lokalise: false,
      crowdin: false,
      phrase: false,
    },
  },

  // ── Workflow & QA ───────────────────────────────────────────────────
  { type: "section", key: "sections.workflow", fb: "Workflow & QA" },
  {
    type: "row",
    key: "rows.reviewWorkflow",
    fb: "Review workflow",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.comments",
    fb: "Comments on translations",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.qaChecks",
    fb: "Automated QA checks",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.branching",
    fb: "Branching workflow",
    cells: {
      betterI18n: true,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },

  // ── Enterprise ──────────────────────────────────────────────────────
  { type: "section", key: "sections.enterprise", fb: "Enterprise" },
  {
    type: "row",
    key: "rows.sso",
    fb: "SSO / SAML",
    cells: {
      betterI18n: VAL.custom,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.auditLog",
    fb: "Audit log",
    cells: {
      betterI18n: VAL.custom,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.sla",
    fb: "SLA guarantee",
    cells: {
      betterI18n: VAL.custom,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.dedicatedSupport",
    fb: "Dedicated account manager",
    cells: {
      betterI18n: VAL.custom,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
  {
    type: "row",
    key: "rows.dataResidency",
    fb: "Custom data residency",
    cells: {
      betterI18n: VAL.custom,
      lokalise: true,
      crowdin: true,
      phrase: true,
    },
  },
];

// ─── Cell renderer ───────────────────────────────────────────────────

function CellValue({
  value,
  highlight,
  t,
}: {
  value: Cell;
  highlight: boolean;
  t: ReturnType<typeof useT>;
}) {
  if (value === true) {
    return (
      <span
        aria-label="Included"
        className={
          highlight
            ? "inline-flex size-4 items-center justify-center rounded-full bg-mist-950 text-white"
            : "inline-flex size-4 items-center justify-center text-mist-500"
        }
      >
        <SpriteIcon name="checkmark" className="size-2.5" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span aria-label="Not available" className="text-mist-300 text-sm">
        —
      </span>
    );
  }
  if (typeof value === "string") {
    return (
      <span
        className={
          highlight
            ? "text-[13px] font-medium text-mist-950 tabular-nums"
            : "text-[13px] text-mist-600 tabular-nums"
        }
      >
        {value}
      </span>
    );
  }
  // Translated value
  return (
    <span
      className={
        highlight
          ? "text-[13px] font-medium text-mist-950"
          : "text-[13px] text-mist-600"
      }
    >
      {t(`comparison.values.${value.i18n}`, { defaultValue: value.fb })}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function PricingComparison() {
  const t = useT("pricing");

  return (
    <section id="compare-pricing" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header — left-aligned, mirrors Pricing block */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04] text-balance">
            {t("comparison.title", {
              defaultValue: "Why teams choose Better I18N over legacy TMS",
            })}
          </h2>
          <p className="mt-5 text-lg text-mist-600 text-pretty">
            {t("comparison.subtitle", {
              defaultValue:
                "Better I18N delivers the same translation memory and review workflows — with native AI, edge CDN delivery, and a modern stack — without the enterprise contract.",
            })}
          </p>
        </div>

        {/* Comparison table — framed, mirrors Pricing block aesthetic */}
        <div className="rounded-3xl border border-mist-200/70 bg-white p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              {/* Vendor header row */}
              <thead className="bg-white">
                <tr>
                  <th className="text-left text-xs font-medium uppercase tracking-wider text-mist-500 px-5 py-4 w-[40%]">
                    {t("comparison.featureLabel", { defaultValue: "Feature" })}
                  </th>
                  {VENDORS.map((vendor) => {
                    const highlight = vendor === "betterI18n";
                    return (
                      <th
                        key={vendor}
                        scope="col"
                        className={
                          highlight
                            ? "text-center text-sm font-semibold text-mist-950 px-4 py-4 bg-mist-50/60 rounded-t-xl"
                            : "text-center text-sm font-medium text-mist-700 px-4 py-4"
                        }
                      >
                        <VendorHeader vendor={vendor} />
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body — interleaves section labels and feature rows */}
              <tbody>
                {ITEMS.map((item, idx) => {
                  if (item.type === "section") {
                    return (
                      <tr
                        key={`section-${item.key}-${idx}`}
                        className="border-t border-mist-200/70"
                      >
                        <td
                          colSpan={1}
                          className="px-5 pt-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-mist-500"
                        >
                          {t(`comparison.${item.key}`, {
                            defaultValue: item.fb,
                          })}
                        </td>
                        {/* Highlight column continues even on section rows */}
                        <td className="bg-mist-50/60" colSpan={1} />
                        <td colSpan={2} />
                      </tr>
                    );
                  }

                  // Feature row
                  // Detect whether this is the LAST feature row of the
                  // entire matrix to round Better I18N column's bottom corners.
                  const isLastRow = idx === ITEMS.length - 1;

                  return (
                    <tr key={item.key} className="border-t border-mist-100">
                      <th
                        scope="row"
                        className="text-left text-[13px] font-normal text-mist-700 px-5 py-3"
                      >
                        {t(`comparison.${item.key}`, {
                          defaultValue: item.fb,
                        })}
                      </th>
                      {VENDORS.map((vendor) => {
                        const highlight = vendor === "betterI18n";
                        return (
                          <td
                            key={vendor}
                            className={
                              highlight
                                ? `text-center px-4 py-3.5 bg-mist-50/60 ${isLastRow ? "rounded-b-xl" : ""}`
                                : "text-center px-4 py-3.5"
                            }
                          >
                            <CellValue
                              value={item.cells[vendor]}
                              highlight={highlight}
                              t={t}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-xs text-mist-500 text-center">
          {t("comparison.disclaimer", {
            defaultValue:
              "Based on publicly available pricing and feature documentation as of 2026.",
          })}
        </p>
      </div>
    </section>
  );
}
