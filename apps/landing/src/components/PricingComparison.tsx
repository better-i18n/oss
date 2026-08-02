import { useT } from "@/lib/i18n";
import { SpriteIcon } from "@/components/SpriteIcon";
import { CompetitorMark, type CompetitorKey } from "@/components/icons/CompetitorMarks";

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
 * Vendor column header: the product's mark next to its name.
 *
 * Naming a product without showing its mark was the odd one out here — every
 * other surface that names a competitor shows it (rule/name-a-thing-with-its-mark),
 * and this table named three of them in plain text while we alone got a logo.
 *
 * The competitor marks render in ink rather than their own colours. Four
 * corporate palettes across four narrow columns would put their brands, not the
 * comparison, in front of the reader — on our page
 * (rule/neutral-ink-accent-is-identity-only).
 *
 * Our row still leads, and not by colour: the logo is full strength, the
 * wordmark sits at the same weight the highlighted column uses everywhere else.
 * On a narrow viewport the mark is dropped rather than the name — a logo the
 * reader cannot place is decoration, the name is the information.
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

  return (
    <span className="inline-flex items-center justify-center gap-2">
      {/* The wrapper carries the breakpoint, not the mark: CompetitorMark's own
          class list starts with `flex`, so a `hidden sm:flex` passed through
          `className` lands next to it and the two display utilities fight —
          measured, the mark stayed visible below 640px. */}
      <span className="hidden sm:inline-flex">
        <CompetitorMark competitor={vendor as CompetitorKey} size={20} tone="ink" />
      </span>
      <span>{VENDOR_LABELS[vendor]}</span>
    </span>
  );
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
  /* Support marks are 14px strokes in neutral ink. The filled dark disc read as
     a badge and made the Better I18N column look like a promo band; the absent
     state is a hairline rather than an em-dash so both marks share one weight. */
  if (value === true) {
    return (
      <span
        role="img"
        aria-label="Included"
        className="inline-flex items-center justify-center"
      >
        <SpriteIcon
          name="checkmark"
          className={highlight ? "size-3.5 text-mist-900" : "size-3.5 text-mist-500"}
          aria-hidden="true"
        />
      </span>
    );
  }
  if (value === false) {
    return (
      <span role="img" aria-label="Not available" className="inline-flex items-center justify-center">
        <span className="block h-px w-2.5 bg-mist-300" aria-hidden="true" />
      </span>
    );
  }
  if (typeof value === "string") {
    return (
      <span
        className={
          highlight
            ? "text-[13px] font-medium text-mist-900 tabular-nums"
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
        highlight ? "text-[13px] font-medium text-mist-900" : "text-[13px] text-mist-600"
      }
    >
      {t(`comparison.values.${value.i18n}`)}
    </span>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function PricingComparison() {
  const t = useT("pricing");

  return (
    <section id="compare-pricing">
      <div className="section">
        {/* Header — left-aligned, mirrors Pricing block */}
        <div className="max-w-3xl">
          <h2 className="section-h2">
            {t("comparison.title")}
          </h2>
          <p className="section-p mt-3">
            {t("comparison.subtitle")}
          </p>
        </div>

        {/* One clipped hairline container. The outer padded "tray" (rounded-3xl +
            shadow + inner 6px inset) is gone: the table border IS the frame, so
            the Better I18N column no longer needs rounded corners tracked
            against the last row. */}
        <div className="mt-8 overflow-hidden rounded-xl border border-black/[0.07] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              {/* Vendor header row — 11px mist-400, no caps/letter-spacing */}
              <thead>
                <tr>
                  <th className="w-[40%] px-4 py-3 text-left text-[11px] font-medium text-mist-400">
                    {t("comparison.featureLabel")}
                  </th>
                  {VENDORS.map((vendor) => {
                    const highlight = vendor === "betterI18n";
                    return (
                      <th
                        key={vendor}
                        scope="col"
                        className={`px-4 py-3 text-center text-[11px] font-medium ${ highlight ? "bg-black/[0.02] text-mist-900" : "text-mist-400" }`}
                      >
                        <VendorHeader vendor={vendor} />
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body — interleaves section labels and feature rows */}
              <tbody>
                {ITEMS.map((item) => {
                  if (item.type === "section") {
                    return (
                      /* `item.key` is unique across ITEMS (e.g. "sections.pricing"),
                         so the row index is not needed — and an index key would
                         break if a group were ever inserted mid-matrix. */
                      <tr key={item.key} className="border-t border-black/[0.05]">
                        <td className="px-4 pt-5 pb-2 text-[11px] font-medium text-mist-400">
                          {t(`comparison.${item.key}`)}
                        </td>
                        {/* The emphasis column runs unbroken through group labels */}
                        <td className="bg-black/[0.02]" />
                        <td colSpan={VENDORS.length - 1} />
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.key} className="border-t border-black/[0.05]">
                      <th
                        scope="row"
                        className="px-4 py-3 text-left text-[13px] font-normal text-mist-700"
                      >
                        {t(`comparison.${item.key}`)}
                      </th>
                      {VENDORS.map((vendor) => {
                        const highlight = vendor === "betterI18n";
                        return (
                          <td
                            key={vendor}
                            className={`px-4 py-3 text-center ${ highlight ? "bg-black/[0.02]" : "" }`}
                          >
                            <CellValue value={item.cells[vendor]} highlight={highlight} t={t} />
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
        <p className="mt-4 text-[11px] text-mist-400">
          {t("comparison.disclaimer")}
        </p>
      </div>
    </section>
  );
}
