import { Link, useParams } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";

import { FlagIcon } from "./features/FlagIcon";

type Tone = "translators" | "developers" | "productTeams";

const TONES: Record<
  Tone,
  {
    iconBg: string;
    iconBorder: string;
    iconText: string;
    panelBg: string;
    checkText: string;
  }
> = {
  translators: {
    iconBg: "bg-sky-50",
    iconBorder: "border-sky-100",
    iconText: "text-sky-700",
    panelBg: "bg-gradient-to-br from-sky-50/40 via-white to-mist-50/60",
    checkText: "text-sky-600",
  },
  developers: {
    iconBg: "bg-indigo-50",
    iconBorder: "border-indigo-100",
    iconText: "text-indigo-700",
    panelBg: "bg-gradient-to-br from-indigo-50/40 via-white to-mist-50/60",
    checkText: "text-indigo-600",
  },
  productTeams: {
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-100",
    iconText: "text-amber-700",
    panelBg: "bg-gradient-to-br from-amber-50/40 via-white to-mist-50/60",
    checkText: "text-amber-600",
  },
};

/* ------------------------------------------------------------------ */
/* Mini previews — one per persona, decorative product hints.          */
/* Live inside the framed panel, beneath the description.              */
/* ------------------------------------------------------------------ */

function TranslatorsPreview() {
  return (
    <div className="rounded-lg border border-mist-200/80 bg-white/80 backdrop-blur-sm overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {/* Glossary entry header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-mist-100">
        <span aria-hidden className="size-1.5 rounded-full bg-mist-400" />
        <code className="text-[10px] font-mono text-mist-700">api.key</code>
        <span className="ml-auto text-[8px] uppercase tracking-wider text-mist-400">
          Glossary
        </span>
      </div>
      {/* 3 language rows — source · approved · AI-suggested */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <FlagIcon countryCode="gb" className="w-3 h-2" />
          <span className="text-[10px] text-mist-500 italic">API Key</span>
          <span className="ml-auto text-[9px] text-mist-400">source</span>
        </div>
        <div className="flex items-center gap-2">
          <FlagIcon countryCode="tr" className="w-3 h-2" />
          <span className="text-[11px] text-mist-900">API Anahtarı</span>
          <span className="ml-auto text-[9px] text-mist-500">approved</span>
        </div>
        <div className="flex items-center gap-2">
          <FlagIcon countryCode="de" className="w-3 h-2" />
          <span className="text-[11px] text-mist-900">API-Schlüssel</span>
          <span className="ml-auto text-[9px] text-mist-500 italic">AI</span>
        </div>
      </div>
    </div>
  );
}

function DevelopersPreview() {
  return (
    <div className="rounded-lg border border-mist-200/80 bg-mist-100/70 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {/* Terminal chrome — traffic lights */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-mist-200/70">
        <span aria-hidden className="size-1.5 rounded-full bg-rose-300/80" />
        <span aria-hidden className="size-1.5 rounded-full bg-amber-300/80" />
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-300/80" />
        <span className="ml-auto text-[9px] font-mono text-mist-400">
          claude · mcp
        </span>
      </div>
      {/* Terminal body */}
      <pre className="px-3 py-2 text-[10px] font-mono leading-[1.6] text-mist-700 whitespace-pre">
        <span className="text-emerald-600">$</span>{" "}
        <span className="text-indigo-700">claude mcp</span>{" "}
        <span className="text-mist-700">better-i18n</span>
        {"\n"}
        <span className="text-mist-400">  ▸ </span>
        <span className="text-amber-700">proposeTranslations</span>
        <span className="text-mist-400">(</span>
        <span className="text-emerald-700">"auth.login"</span>
        <span className="text-mist-400">)</span>
        {"\n"}
        <span className="text-emerald-600">✓</span>{" "}
        <span className="text-mist-500">3 translations · 240ms</span>
      </pre>
    </div>
  );
}

function ProductTeamsPreview() {
  // Color thresholds match the platform's coverage convention:
  //   ≥90 emerald (shipped)  ·  50–89 amber (in progress)  ·  <50 red (gap)
  const ROWS = [
    { country: "de", pct: 100 },
    { country: "fr", pct: 73 },
    { country: "tr", pct: 28 },
  ];
  const barColor = (pct: number) =>
    pct >= 90
      ? "bg-emerald-500"
      : pct >= 50
        ? "bg-amber-400"
        : "bg-rose-400";
  const textColor = (pct: number) =>
    pct >= 90
      ? "text-emerald-700"
      : pct >= 50
        ? "text-amber-700"
        : "text-rose-600";
  return (
    <div className="rounded-lg border border-mist-200/80 bg-white/80 backdrop-blur-sm overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {/* Header chrome — mirrors Translators panel for visual parity */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-mist-100">
        <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
        <code className="text-[10px] font-mono text-mist-700">coverage</code>
        <span className="ml-auto text-[8px] uppercase tracking-wider text-mist-400">
          Live
        </span>
      </div>
      {/* Body — 3 progress rows, matches Translators body padding */}
      <div className="px-3 py-2 space-y-1.5">
        {ROWS.map((row) => (
          <div key={row.country} className="flex items-center gap-2">
            <FlagIcon countryCode={row.country} className="w-3.5 h-2.5" />
            <div className="flex-1 h-1 rounded-full bg-mist-100 overflow-hidden">
              <div
                className={`h-full ${barColor(row.pct)} rounded-full`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
            <span
              className={`text-[9px] font-mono tabular-nums w-7 text-right font-semibold ${textColor(row.pct)}`}
            >
              {row.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

type SegmentCardProps = {
  iconName: SpriteIconName;
  id: string;
  namespace: string;
  tone: Tone;
  preview: React.ReactNode;
  to:
    | "/$locale/for-developers/"
    | "/$locale/for-product-teams/"
    | "/$locale/for-translators/";
  locale: string;
};

function SegmentCard({
  iconName,
  id,
  locale,
  namespace,
  tone,
  preview,
  to,
}: SegmentCardProps) {
  const t = useT(namespace);
  const palette = TONES[tone];

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
      className="group flex h-full scroll-mt-24 flex-col rounded-2xl border border-mist-200 bg-white shadow-[0_18px_50px_-40px_rgba(15,23,42,0.28)] transition-shadow duration-200 hover:border-mist-300 hover:shadow-md overflow-hidden"
    >
      {/* Inner framed panel — content-sized; outer card aligns via grid + mt-auto on list */}
      <div className="p-1.5">
        <div
          className={`rounded-xl border border-mist-200/60 ${palette.panelBg} px-5 pt-5 pb-5 flex flex-col`}
        >
          {/* Header row — icon + arrow */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${palette.iconBorder} ${palette.iconBg} ${palette.iconText} shadow-[0_1px_2px_rgba(15,23,42,0.04)]`}
            >
              <SpriteIcon name={iconName} className="size-4.5" />
            </div>
            <div className="rounded-full border border-mist-200 bg-white p-1.5 text-mist-400 transition-colors group-hover:text-mist-700">
              <SpriteIcon
                name="arrow-right"
                className="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </div>

          {/* Eyebrow + title + description — min-h reserves uniform space across 2- and 3-line variants */}
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-mist-500">
              {t("statusBadge")}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-mist-950">
              {t("title")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mist-600 text-pretty min-h-[4.125rem]">
              {t("description")}
            </p>
          </div>

          {/* Mini preview — min-h reserves uniform vertical space; previews sit naturally at top */}
          <div className="mt-4 min-h-[6rem] [&>div]:w-full">
            {preview}
          </div>
        </div>
      </div>

      {/* Feature list — mt-auto pins it to card bottom across all 3 cards */}
      <ul className="mt-auto px-6 pt-3 pb-5 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5">
            <SpriteIcon
              name="checkmark"
              className="size-3 shrink-0 text-mist-400"
            />
            <span className="text-sm text-mist-700">{feature}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default function UserSegments() {
  const t = useT("userSegments");
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="space-y-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04] text-balance">
              {t("title")}
            </h2>
            <p className="mt-4 text-lg text-mist-600 text-pretty">
              {t("subtitle")}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <SegmentCard
              id="for-translators"
              namespace="segments.translators"
              iconName="globe"
              tone="translators"
              preview={<TranslatorsPreview />}
              to="/$locale/for-translators/"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-developers"
              namespace="segments.developers"
              iconName="code"
              tone="developers"
              preview={<DevelopersPreview />}
              to="/$locale/for-developers/"
              locale={currentLocale}
            />
            <SegmentCard
              id="for-product-teams"
              namespace="segments.productTeams"
              iconName="group"
              tone="productTeams"
              preview={<ProductTeamsPreview />}
              to="/$locale/for-product-teams/"
              locale={currentLocale}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
