import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import { GuideMark } from "@/lib/i18n-guide-icons";
import { HighlightedCode, type CodeLang } from "@/components/CodeBlock";
import {
  Divider,
  FeatureColumn,
  FeatureRow,
  Frame,
  Section,
  SectionHeader,
} from "@/components/ui/page";

/**
 * Framework page surfaces — hero, feature lists, code blocks, setup guide, FAQ.
 *
 * Shared by 17 routes under `/$locale/i18n/*`, so every rule applied here moves
 * all of them at once. Design language (see DESIGN-DECISIONS.md):
 *
 *   - `rule/section-opens-with-header`: every section opens eyebrow → h2 → lede
 *     via <SectionHeader>. Each component takes an optional `eyebrow` and falls
 *     back to a short structural label, so the 17 existing callers keep working
 *     without edits while new pages can name their own.
 *   - `rule/divider-is-the-only-transition`: each section renders a leading
 *     <Divider />. The hero does not, so the sequence never opens with a rule.
 *   - `rule/white-page-hairline-separation`: grids are split by INTERIOR
 *     hairlines only — a bare `overflow-hidden` wrapper clips the shifted edge
 *     rules, so there is no outer box nested inside the frame. Cells carry
 *     `border-t border-l`, the grid is shifted `-mt-px -ml-px`; no nth-child
 *     arithmetic, so no rule doubles or vanishes when the column count changes.
 *   - `rule/weight-500-headings`: weight 500 everywhere, radius stops at
 *     `rounded-xl`, no shadows, hover feedback is a background tint only.
 *   - Code blocks are one component (`CodeBlock`) with one treatment, instead of
 *     the light-vs-dark split the setup guide and the code sections used to have.
 */

const HAIRLINE_CELL = "border-t border-l border-black/[0.05]";
/** Bare clip box: no border, no radius — the frame is the only container. */
const HAIRLINE_GRID = "overflow-hidden";

/* ─── Section opening ─────────────────────────────────────────────────── */

/**
 * eyebrow → h2 → lede, optionally with a 22px icon chip on the eyebrow line.
 *
 * Without an icon it delegates to the <SectionHeader> primitive. With one it
 * reproduces the same three elements (`.eyebrow`, `.section-h2`, `.section-p`)
 * so the grammar is identical — the icon exists because a page of eight
 * sections that all open with the bare word "Example" gives a reader nothing to
 * navigate by.
 */
function SectionOpening({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  icon?: SpriteIconName;
}) {
  if (!icon) {
    return <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />;
  }

  return (
    <>
      <div className="eyebrow flex items-center gap-2">
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
          <SpriteIcon name={icon} className="size-3.5" aria-hidden="true" />
        </span>
        {eyebrow}
      </div>
      <h2 className="section-h2" style={{ maxWidth: "22ch" }}>
        {title}
      </h2>
      {subtitle && <p className="section-p mt-3">{subtitle}</p>}
    </>
  );
}

/* ─── Code block ──────────────────────────────────────────────────────── */

/** `HighlightedCode` takes a 6-value union; the callers pass a free string for
    the chrome-bar label ("TypeScript", "tsx", "Bash"…). Normalise rather than
    cast: an unrecognised value tokenises as tsx, which is what 15 of the 17
    framework pages actually contain, and `lang="text"` would silently drop all
    highlighting. */
function codeLang(language?: string): CodeLang {
  switch (language?.toLowerCase()) {
    case "json":
      return "json";
    case "bash":
    case "sh":
    case "shell":
    case "terminal":
      return "bash";
    case "ts":
    case "typescript":
      return "ts";
    case "js":
    case "javascript":
      return "js";
    default:
      return "tsx";
  }
}

/** Body ink for both code surfaces here. Matches the 13px scale these pages
    already use, so switching grounds did not change the type. */
const CODE_BODY =
  "overflow-x-auto px-5 py-4 font-mono text-[13px] leading-[1.7] text-mist-700";

/**
 * One code treatment for the whole page type: a chrome bar carrying the file
 * path and the language, and horizontal scroll contained inside the block so the
 * page itself never scrolls sideways.
 *
 * The body used to be a `bg-mist-950` slab with flat `text-mist-100` — a dark
 * panel on a white document, and unhighlighted. Two problems, one fix: on this
 * page type the code IS the content, and a black rectangle reads as a foreign
 * object next to hairline-separated white sections. It is now the shared
 * `HighlightedCode` on the light ground, so the only colour in the block is the
 * three token hues — the one place `rule/neutral-ink-accent-is-identity-only`
 * allows colour, because there the hue carries information instead of decorating.
 */
function CodeBlock({
  code,
  fileName,
  language,
  className,
}: {
  code: string;
  fileName?: string;
  language?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-black/[0.07] ${className ?? ""}`}
    >
      {(fileName || language) && (
        <div className="flex items-center gap-3 border-b border-black/[0.05] bg-mist-50 px-4 py-2">
          <span className="min-w-0 truncate font-mono text-[11px] text-mist-500">
            {fileName}
          </span>
          {language && (
            <span className="ml-auto shrink-0 rounded-sm bg-black/[0.04] px-1.5 font-mono text-[10px] font-medium text-mist-500">
              {language}
            </span>
          )}
        </div>
      )}
      <HighlightedCode code={code} lang={codeLang(language)} className={CODE_BODY} />
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────── */

/** Small hairline label above a page headline. Replaces the grey pill. */
function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 inline-flex w-fit items-center rounded-md border border-black/[0.07] bg-white px-2.5 py-1 text-[11px] font-medium text-mist-600">
      {children}
    </div>
  );
}

interface FrameworkHeroProps {
  title: string;
  subtitle: string;
  badgeText?: string;
}

/**
 * Detail-page hero: flat, left-aligned, on white. The headline is an h1 at the
 * hero scale — it used to borrow `.section-h2`, which made every framework page
 * open at the same size as its own subsections and flattened the hierarchy.
 */
export function FrameworkHero({ title, subtitle, badgeText }: FrameworkHeroProps) {
  return (
    <Frame style={{ paddingTop: 56, paddingBottom: 56 }}>
      {badgeText && <HeroBadge>{badgeText}</HeroBadge>}
      <h1
        className="max-w-[22ch] font-medium leading-[1.08] tracking-[-0.03em] text-mist-950"
        style={{ fontSize: "var(--text-hero)", textWrap: "balance" }}
      >
        {title}
      </h1>
      <p
        className="mt-4 max-w-[52ch] leading-relaxed text-mist-600"
        style={{ fontSize: "var(--text-sub)" }}
      >
        {subtitle}
      </p>
    </Frame>
  );
}

/* ─── Feature list ────────────────────────────────────────────────────── */

interface FeatureListProps {
  title: string;
  features: string[];
  eyebrow?: string;
  subtitle?: string;
  icon?: SpriteIconName;
}

export function FeatureList({
  title,
  features,
  eyebrow = "Capabilities",
  subtitle,
  icon = "checkmark",
}: FeatureListProps) {
  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} subtitle={subtitle} icon={icon} />

        {/* One hairline table of supported capabilities, not a card per line.
            Correct at any feature count and any column count. */}
        <div className={`mt-8 ${HAIRLINE_GRID}`}>
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature}
                className={`flex items-start gap-2.5 px-4 py-3 ${HAIRLINE_CELL}`}
              >
                <SpriteIcon
                  name="checkmark"
                  className="mt-0.5 size-3.5 shrink-0 text-mist-900"
                  aria-hidden="true"
                />
                <span className="text-[13px] leading-relaxed text-mist-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

/* ─── Code example ────────────────────────────────────────────────────── */

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
  eyebrow?: string;
  fileName?: string;
  language?: string;
  icon?: SpriteIconName;
}

export function CodeExample({
  title,
  description,
  code,
  eyebrow = "Example",
  fileName,
  language,
  icon = "code-brackets",
}: CodeExampleProps) {
  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} subtitle={description} icon={icon} />
        <CodeBlock code={code} fileName={fileName} language={language} className="mt-6" />
      </Section>
    </>
  );
}

/* ─── Closing CTA ─────────────────────────────────────────────────────── */

interface FrameworkCTAProps {
  title: string;
  subtitle: string;
  primaryCTA: string;
  primaryHref: string;
  secondaryCTA?: string;
  secondaryHref?: string;
  eyebrow?: string;
}

/**
 * The closing ask, flat on white. It used to be a filled `bg-mist-950` slab with
 * its own button styles — the one card left on the page, and the only place the
 * page went dark. Same copy, same two actions, in the page's own register and
 * using the shared `.btn` contract.
 */
export function FrameworkCTA({
  title,
  subtitle,
  primaryCTA,
  primaryHref,
  secondaryCTA,
  secondaryHref,
  eyebrow = "Get started",
}: FrameworkCTAProps) {
  return (
    <>
      <Divider />
      <Section>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-h2" style={{ maxWidth: "24ch" }}>
          {title}
        </h2>
        <p className="section-p mt-3">{subtitle}</p>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <a className="btn btn-dark btn-lg" href={primaryHref}>
            {primaryCTA}
            <SpriteIcon name="arrow-right" className="size-4" aria-hidden="true" />
          </a>
          {secondaryCTA && secondaryHref && (
            <a className="btn btn-outline btn-lg" href={secondaryHref}>
              {secondaryCTA}
            </a>
          )}
        </div>
      </Section>
    </>
  );
}

/* ─── Library integrations ────────────────────────────────────────────── */

interface LibraryIntegrationProps {
  title: string;
  subtitle: string;
  libraries: Array<{
    name: string;
    description: string;
    integrationText: string;
  }>;
  eyebrow?: string;
  icon?: SpriteIconName;
}

export function LibraryIntegration({
  title,
  subtitle,
  libraries,
  eyebrow = "Integrations",
  icon = "api-connection",
}: LibraryIntegrationProps) {
  /* Three libraries fit the .feat-row archetype exactly (3 columns split by
     vertical hairlines, bleeding to the frame edges). Any other count would
     leave a ragged column, so it falls back to the hairline grid, which is
     correct at any length. */
  const useFeatRow = libraries.length === 3;

  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} subtitle={subtitle} icon={icon} />

        {useFeatRow ? (
          <div className="mt-8">
            <FeatureRow>
              {libraries.map((lib) => (
                <FeatureColumn
                  key={lib.name}
                  title={`Better I18N + ${lib.name}`}
                  description={
                    <>
                      {lib.description}
                      <span className="mt-2.5 flex items-start gap-2 text-mist-700">
                        <SpriteIcon
                          name="checkmark"
                          className="mt-0.5 size-3.5 shrink-0 text-mist-900"
                          aria-hidden="true"
                        />
                        <span className="text-[13px]">{lib.integrationText}</span>
                      </span>
                    </>
                  }
                />
              ))}
            </FeatureRow>
          </div>
        ) : (
          <div className={`mt-8 ${HAIRLINE_GRID}`}>
            <div className="-mt-px -ml-px grid grid-cols-1 lg:grid-cols-2">
              {libraries.map((lib) => (
                <div key={lib.name} className={`px-5 py-5 ${HAIRLINE_CELL}`}>
                  <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                    Better I18N + {lib.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                    {lib.description}
                  </p>
                  <div className="mt-3 flex items-start gap-2">
                    <SpriteIcon
                      name="checkmark"
                      className="mt-0.5 size-3.5 shrink-0 text-mist-900"
                      aria-hidden="true"
                    />
                    <p className="text-[13px] leading-relaxed text-mist-700">
                      {lib.integrationText}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </>
  );
}

/* ─── Setup guide ─────────────────────────────────────────────────────── */

interface SetupStep {
  step: number;
  title: string;
  description: string;
  code?: string;
  fileName?: string;
  language?: string;
}

export function SetupGuide({
  title,
  steps,
  eyebrow = "Setup",
  subtitle,
  icon = "rocket",
}: {
  title: string;
  steps: SetupStep[];
  eyebrow?: string;
  subtitle?: string;
  icon?: SpriteIconName;
}) {
  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} subtitle={subtitle} icon={icon} />

        {/* Steps are separated by hairlines rather than whitespace, so a long
            guide keeps a readable rhythm instead of drifting apart. */}
        <div className="mt-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className={`flex gap-4 py-6 ${ index === 0 ? "pt-0" : "border-t border-black/[0.05]" }`}
            >
              <span className="mt-0.5 w-4 shrink-0 font-mono text-[11px] tabular-nums text-mist-400">
                {step.step}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {step.description}
                </p>
                {step.code && (
                  <CodeBlock
                    code={step.code}
                    fileName={step.fileName}
                    language={step.language}
                    className="mt-3"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

/* ─── Tabbed code ─────────────────────────────────────────────────────── */

interface CodeTab {
  label: string;
  code: string;
  fileName?: string;
}

export function TabbedCode({
  title,
  description,
  tabs,
  eyebrow = "Example",
  icon = "code",
}: {
  title: string;
  description: string;
  tabs: CodeTab[];
  eyebrow?: string;
  icon?: SpriteIconName;
}) {
  const [active, setActive] = useState(0);
  const activeTab = tabs[active];

  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} subtitle={description} icon={icon} />

        <div className="mt-6 overflow-hidden rounded-xl border border-black/[0.07]">
          <div className="flex border-b border-black/[0.05] bg-mist-50">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActive(i)}
                className={`px-4 py-2.5 font-mono text-[11px] transition-colors ${ i === active ? "-mb-px border-b border-mist-900 text-mist-900" : "text-mist-500 hover:text-mist-700" }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab?.fileName && (
            <div className="border-b border-black/[0.05] bg-mist-50 px-4 py-1.5 font-mono text-[11px] text-mist-500">
              {activeTab.fileName}
            </div>
          )}
          {/* Same light ground as CodeBlock above — the tab strip is the only
              chrome this figure needs. */}
          <HighlightedCode
            code={activeTab?.code ?? ""}
            lang={codeLang(activeTab?.fileName?.split(".").pop())}
            className={CODE_BODY}
          />
        </div>
      </Section>
    </>
  );
}

/* ─── Other frameworks ────────────────────────────────────────────────── */

interface OtherFrameworksProps {
  title: string;
  currentFramework: string;
  locale: string;
}

const allFrameworks = [
  { name: "React", slug: "react" },
  { name: "Next.js", slug: "nextjs" },
  { name: "Vue", slug: "vue" },
  { name: "Nuxt", slug: "nuxt" },
  { name: "Angular", slug: "angular" },
  { name: "Svelte", slug: "svelte" },
  { name: "Vite", slug: "vite" },
  { name: "Remix & Hydrogen", slug: "remix-hydrogen" },
  { name: "Expo", slug: "expo" },
  { name: "iOS", slug: "ios" },
  { name: "Flutter", slug: "flutter" },
  { name: "TanStack Start", slug: "tanstack-start" },
  /* "Server / Hono" was one entry until /i18n/hono/ existed. Leaving Hono
     inside the server label would have pointed every framework page at the
     generic server guide for a query the dedicated page now answers. */
  { name: "Server", slug: "server" },
  { name: "Hono", slug: "hono" },
  { name: "Rust", slug: "rust" },
];

export function OtherFrameworks({ title, currentFramework, locale }: OtherFrameworksProps) {
  const others = allFrameworks.filter((f) => f.slug !== currentFramework);

  return (
    <>
      <Divider />
      <Section>
        {/* A navigation strip, not a content section — an 11px label is the
            whole opening it needs, so no eyebrow/h2 pair here. */}
        <h2 className="text-[11px] font-medium text-mist-400">{title}</h2>

        <div className={`mt-4 ${HAIRLINE_GRID}`}>
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((framework) => (
              <Link
                key={framework.slug}
                /* Router is configured `trailingSlash: "always"` (src/router.tsx),
                   so the generated `to` union carries the trailing slash. */
                to={
                  `/$locale/i18n/${framework.slug}/` as
                    | "/$locale/i18n/react/"
                    | "/$locale/i18n/nextjs/"
                    | "/$locale/i18n/vue/"
                    | "/$locale/i18n/nuxt/"
                    | "/$locale/i18n/angular/"
                    | "/$locale/i18n/svelte/"
                    | "/$locale/i18n/vite/"
                    | "/$locale/i18n/remix-hydrogen/"
                    | "/$locale/i18n/expo/"
                    | "/$locale/i18n/ios/"
                    | "/$locale/i18n/flutter/"
                    | "/$locale/i18n/tanstack-start/"
                    | "/$locale/i18n/server/"
                }
                params={{ locale }}
                className={`group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-black/[0.02] ${HAIRLINE_CELL}`}
              >
                {/* rule/name-a-thing-with-its-mark: a framework named in a list
                    carries its real mark, same tile and size as everywhere else. */}
                <span className="flex min-w-0 items-center gap-2.5">
                  <GuideMark slug={framework.slug} group="frameworks" />
                  <span className="min-w-0 truncate text-[13px] font-medium text-mist-700 transition-colors group-hover:text-mist-950">
                    {framework.name} i18n
                  </span>
                </span>
                <SpriteIcon
                  name="chevron-right"
                  className="size-3.5 shrink-0 text-mist-300 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */

interface FAQItemProps {
  question: string;
  answer: string;
}

interface FrameworkFAQProps {
  title?: string;
  items: FAQItemProps[];
  eyebrow?: string;
  icon?: SpriteIconName;
}

export function FrameworkFAQ({
  title = "Frequently Asked Questions",
  items,
  eyebrow = "FAQ",
  icon = "book",
}: FrameworkFAQProps) {
  return (
    <>
      <Divider />
      <Section>
        <SectionOpening eyebrow={eyebrow} title={title} icon={icon} />

        {/* Two columns on wide screens: an 8-question FAQ in one 52ch column
            ran longer than the rest of the page put together. */}
        <div className={`mt-8 ${HAIRLINE_GRID}`}>
          <div className="-mt-px -ml-px grid grid-cols-1 lg:grid-cols-2">
            {items.map((item) => (
              <div key={item.question} className={`px-5 py-5 ${HAIRLINE_CELL}`}>
                <h3 className="text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {item.question}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
