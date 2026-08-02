import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { BentoList, BentoRow } from "@/components/ui/page";

import { FlagIcon } from "./features/FlagIcon";

/* ------------------------------------------------------------------ */
/* Mini previews — one per persona, decorative hints of the real         */
/* product surface. Density is the point: a panel holding three rows in   */
/* a 600px column reads as an unfinished placeholder, so each panel runs  */
/* a full row list + a meta footer, the way the reference marketing        */
/* mockups do (rows carry a value AND a meta line, panel closes with a     */
/* status footer).                                                        */
/*                                                                        */
/* Neutral ink throughout (rule/neutral-ink-accent-is-identity-only):     */
/* the only "accent" is ink weight — mist-900 for done, mist-400 for       */
/* partial, mist-200 for missing. The old green/amber/red coverage triad   */
/* and the red/amber/green terminal lights were decoration pretending to   */
/* be data, and next to an otherwise grey page they were the loudest       */
/* thing in the section.                                                  */
/* ------------------------------------------------------------------ */

/* Source term + its locale rows, as the glossary really stores them:
   one source, approved translations, AI suggestions, and the ones still
   waiting for a human. */
const GLOSSARY_ROWS: {
  country: string;
  value: string;
  status: string;
  state: "source" | "approved" | "ai" | "review";
}[] = [
  { country: "gb", value: "API Key", status: "source", state: "source" },
  { country: "tr", value: "API Anahtarı", status: "approved", state: "approved" },
  { country: "de", value: "API-Schlüssel", status: "approved", state: "approved" },
  { country: "fr", value: "Clé API", status: "AI", state: "ai" },
  { country: "es", value: "Clave de API", status: "AI", state: "ai" },
  { country: "it", value: "Chiave API", status: "needs review", state: "review" },
  { country: "nl", value: "API-sleutel", status: "needs review", state: "review" },
];

const GLOSSARY_VALUE_INK: Record<string, string> = {
  source: "text-mist-500 italic",
  approved: "text-mist-900",
  ai: "text-mist-700",
  review: "text-mist-700",
};

function TranslatorsPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/[0.06] bg-white">
      {/* Glossary entry header */}
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-3 py-1.5">
        <span aria-hidden className="size-1.5 rounded-full bg-mist-400" />
        <code className="font-mono text-[10px] text-mist-700">auth.apiKey</code>
        <span className="ml-auto text-[10px] font-medium text-mist-400">
          Glossary
        </span>
      </div>
      {/* Locale rows — source · approved · AI-suggested · needs review */}
      <div className="divide-y divide-black/[0.04]">
        {GLOSSARY_ROWS.map((row) => (
          <div
            key={row.country}
            className="flex items-center gap-2 px-3 py-[5px]"
          >
            <FlagIcon countryCode={row.country} className="h-2 w-3 shrink-0" />
            <span className={`truncate text-[11px] ${GLOSSARY_VALUE_INK[row.state]}`}>
              {row.value}
            </span>
            <span
              className={`ml-auto shrink-0 text-[9px] ${ row.state === "review" ? "text-mist-700" : "text-mist-400" }`}
            >
              {row.status}
            </span>
          </div>
        ))}
      </div>
      {/* Status footer — what the glossary is actually enforcing */}
      <div className="border-t border-black/[0.05] bg-mist-50 px-3 py-1.5">
        <span className="text-[10px] font-medium text-mist-400">
          glossary: 42 terms · enforced in 9 locales
        </span>
      </div>
    </div>
  );
}

/* Tool names are the real ones exposed by @better-i18n/mcp — a made-up tool
   list would be the one detail a developer reading this section would catch. */
const MCP_TOOLS = "listKeys · createKeys · getTranslations · publishTranslations · getPendingChanges";

function DevelopersPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/[0.06] bg-mist-50">
      {/* Terminal chrome */}
      <div className="flex items-center gap-1.5 border-b border-black/[0.05] px-3 py-1.5">
        <span aria-hidden className="size-1.5 rounded-full bg-mist-300" />
        <span aria-hidden className="size-1.5 rounded-full bg-black/[0.12]" />
        <span aria-hidden className="size-1.5 rounded-full bg-black/[0.12]" />
        <span className="ml-auto font-mono text-[9px] text-mist-400">
          claude · mcp
        </span>
      </div>
      {/* Terminal body — one realistic session: connect, inspect, propose,
          publish. Ink weight carries the hierarchy: command mist-900,
          tool call mist-700, results mist-500, punctuation mist-400. */}
      <pre className="px-3 py-2 font-mono text-[10px] leading-[1.65] whitespace-pre text-mist-700">
        <span className="text-mist-400">$</span>{" "}
        <span className="text-mist-900">claude mcp</span>{" "}
        <span className="text-mist-700">better-i18n</span>
        {"\n"}
        <span className="text-mist-400">  connected · 12 tools</span>
        {"\n"}
        <span className="text-mist-400">  ▸ </span>
        <span className="text-mist-900">listKeys</span>
        <span className="text-mist-400">(namespace: </span>
        <span className="text-mist-700">"auth"</span>
        <span className="text-mist-400">)</span>
        {"\n"}
        <span className="text-mist-500">    18 keys · 3 missing locales</span>
        {"\n"}
        <span className="text-mist-400">  ▸ </span>
        <span className="text-mist-900">proposeTranslations</span>
        <span className="text-mist-400">(</span>
        <span className="text-mist-700">"auth.login"</span>
        <span className="text-mist-400">)</span>
        {"\n"}
        <span className="text-mist-500">    tr · de · fr — glossary applied</span>
        {"\n"}
        <span className="text-mist-400">  ▸ </span>
        <span className="text-mist-900">publishTranslations</span>
        <span className="text-mist-400">(locales: 3)</span>
        {"\n"}
        <span className="text-mist-900">✓</span>{" "}
        <span className="text-mist-500">3 translations · 240ms · cdn purged</span>
      </pre>
      {/* Status footer — the rest of the toolbelt */}
      <div className="border-t border-black/[0.05] bg-white px-3 py-1.5">
        <span className="block truncate font-mono text-[9px] text-mist-400">
          {MCP_TOOLS}
        </span>
      </div>
    </div>
  );
}

/* Coverage per locale. Module scope: static data and pure mappers, nothing
   rebuilt per render. Six locales + the rolled-up total is what the real
   dashboard shows — three rows read as a sample, not as a status board. */
const COVERAGE_ROWS = [
  { country: "de", pct: 100 },
  { country: "es", pct: 92 },
  { country: "fr", pct: 73 },
  { country: "it", pct: 54 },
  { country: "tr", pct: 28 },
  { country: "nl", pct: 12 },
];

const COVERAGE_TOTAL = Math.round(
  COVERAGE_ROWS.reduce((sum, row) => sum + row.pct, 0) / COVERAGE_ROWS.length,
);

/* Status is carried by ink weight, not hue: done reads darkest, partial mid,
   gap barely there. Same information, none of the traffic-light noise. */
const coverageBarColor = (pct: number) =>
  pct >= 100 ? "bg-mist-900" : pct >= 50 ? "bg-mist-400" : "bg-mist-200";

const coverageTextColor = (pct: number) =>
  pct >= 100 ? "text-mist-900" : pct >= 50 ? "text-mist-600" : "text-mist-400";

function ProductTeamsPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-black/[0.06] bg-white">
      {/* Header chrome — mirrors Translators panel for visual parity */}
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-3 py-1.5">
        <span aria-hidden className="size-1.5 rounded-full bg-mist-400" />
        <code className="font-mono text-[10px] text-mist-700">coverage</code>
        <span className="ml-auto text-[10px] font-medium text-mist-400">
          Live
        </span>
      </div>
      {/* Body — one row per locale: flag, bar, percentage */}
      <div className="divide-y divide-black/[0.04]">
        {COVERAGE_ROWS.map((row) => (
          <div key={row.country} className="flex items-center gap-2 px-3 py-[5px]">
            <FlagIcon countryCode={row.country} className="h-2.5 w-3.5 shrink-0" />
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
              <div
                className={`h-full ${coverageBarColor(row.pct)} rounded-full`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <span
              className={`w-7 shrink-0 text-right font-mono text-[9px] font-medium tabular-nums ${coverageTextColor(row.pct)}`}
            >
              {row.pct}%
            </span>
          </div>
        ))}
      </div>
      {/* Rolled-up total — the number a product team actually reports */}
      <div className="flex items-center gap-2 border-t border-black/[0.05] bg-mist-50 px-3 py-1.5">
        <span className="text-[10px] font-medium text-mist-400">
          total coverage · {COVERAGE_ROWS.length} of 25 locales
        </span>
        <span className="ml-auto font-mono text-[10px] font-medium tabular-nums text-mist-900">
          {COVERAGE_TOTAL}%
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Segment row                                                         */
/* ------------------------------------------------------------------ */

type SegmentRowProps = {
  iconName: SpriteIconName;
  id: string;
  namespace: string;
  preview: React.ReactNode;
  to:
    | "/$locale/for-developers/"
    | "/$locale/for-product-teams/"
    | "/$locale/for-translators/";
  locale: string;
};

/* One row per persona: copy on the left, product hint on the right, split by a
   single hairline. Rows carry their own top rule and the stack is shifted -1px
   up, so the first rule slides under the container border and is clipped —
   the same trick as the grids elsewhere, minus nth-child arithmetic. */
function SegmentRow({
  iconName,
  id,
  locale,
  namespace,
  preview,
  to,
}: SegmentRowProps) {
  const t = useT(namespace);

  const features = [
    t("feature1Title"),
    t("feature2Title"),
    t("feature3Title"),
  ];

  return (
    <Link
      id={id}
      to={to}
      params={{ locale }}
      className="group grid scroll-mt-24 grid-cols-1 border-t border-black/[0.05] transition-colors hover:bg-black/[0.015] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]"
    >
      <div className="flex flex-col gap-4 px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
            <SpriteIcon name={iconName} className="size-3.5" />
          </span>
          <span className="text-[11px] font-medium text-mist-400">
            {t("statusBadge")}
          </span>
        </div>

        <div>
          <h3 className="flex items-center gap-1.5 text-[15px] font-medium tracking-[-0.02em] text-mist-900">
            {t("title")}
            <SpriteIcon
              name="chevron-right"
              className="size-3.5 shrink-0 text-mist-400 transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </h3>
          <p className="mt-1.5 max-w-[52ch] text-[13px] leading-[1.55] text-mist-600">
            {t("description")}
          </p>
        </div>

        <div className="mt-auto pt-1">
          <BentoList>
            {features.map((feature) => (
              <BentoRow
                key={feature}
                icon={<SpriteIcon name="checkmark" className="size-3" />}
              >
                {feature}
              </BentoRow>
            ))}
          </BentoList>
        </div>
      </div>

      {/* The panel is content-height and vertically centred rather than
          stretched: a stretched shell would just move the dead space inside
          the panel. Density comes from the row lists, and whatever height is
          left over is split evenly above and below instead of pooling under
          the panel. */}
      <div className="flex items-center border-black/[0.05] px-6 pb-6 lg:border-l lg:py-6">
        {preview}
      </div>
    </Link>
  );
}

export default function UserSegments() {
  const t = useT("userSegments");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section>
      <div className="section">
        <div className="space-y-12">
          <div className="max-w-2xl">
            <h2 className="section-h2 text-balance">
              {t("title")}
            </h2>
            <p className="section-p mt-3">
              {t("subtitle")}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
            <div className="-mt-px">
              <SegmentRow
                id="for-translators"
                namespace="segments.translators"
                iconName="globe"
                preview={<TranslatorsPreview />}
                to="/$locale/for-translators/"
                locale={currentLocale}
              />
              <SegmentRow
                id="for-developers"
                namespace="segments.developers"
                iconName="code"
                preview={<DevelopersPreview />}
                to="/$locale/for-developers/"
                locale={currentLocale}
              />
              <SegmentRow
                id="for-product-teams"
                namespace="segments.productTeams"
                iconName="group"
                preview={<ProductTeamsPreview />}
                to="/$locale/for-product-teams/"
                locale={currentLocale}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
