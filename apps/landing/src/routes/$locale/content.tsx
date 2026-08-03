import { createFileRoute } from "@tanstack/react-router";
import { testimonialAvatar } from "@/lib/testimonials";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { HighlightedCode } from "@/components/CodeBlock";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";
import { useTranslations } from "@better-i18n/use-intl";
import { guideIcon } from "@/lib/i18n-guide-icons";
import {
  ClosingCta,
  Divider,
  FeatureCell,
  FeatureColumn,
  FeatureGrid,
  FeatureRow,
  PageHero,
  PageTestimonial,
  Section,
  SectionHeader,
} from "@/components/ui/page";

export const Route = createFileRoute("/$locale/content")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "content",
      pathname: "/content",
      pageType: "default",
      structuredDataOptions: {
        title: "Better Content — headless CMS with localization built in",
        description:
          "Model content once, query it with a chainable SDK, and serve every locale from the edge. Better Content is the headless CMS for teams that ship multilingual products.",
      },
    }),
  component: ContentPage,
});

/* ─── Page ───────────────────────────────────────────────────────── */

function ContentPage() {
  const t = useT("contentPage");
  const { locale } = Route.useParams();

  const frameworks = [
    { key: "nextjs", name: "Next.js", adapter: "@better-i18n/content/adapters/nextjs" },
    { key: "react", name: "React", adapter: "@better-i18n/content/adapters/react" },
    { key: "expo", name: "Expo", adapter: "@better-i18n/content/adapters/expo" },
    { key: "vue", name: "Vue", adapter: "@better-i18n/content/adapters/vue" },
    { key: "svelte", name: "Svelte", adapter: "@better-i18n/content/adapters/svelte" },
    { key: "vanilla", name: "Vanilla JS", adapter: "@better-i18n/content" },
  ];

  /* Marks come from the same source the i18n hub and RelatedPages read, so a
     framework wears the same logo wherever it is named
     (rule/name-a-thing-with-its-mark). */
  const marksInGrid = frameworks.some((f) => guideIcon(f.key) !== null);

  const capabilities = [
    {
      title: t("capabilities.models.title"),
      description: t("capabilities.models.description"),
    },
    {
      title: t("capabilities.localized.title"),
      description: t("capabilities.localized.description"),
    },
    {
      title: t("capabilities.relations.title"),
      description: t("capabilities.relations.description"),
    },
    {
      title: t("capabilities.publish.title"),
      description: t("capabilities.publish.description"),
    },
    {
      title: t("capabilities.mcp.title"),
      description: t("capabilities.mcp.description"),
    },
    {
      title: t("capabilities.edge.title"),
      description: t("capabilities.edge.description"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="sync"
        pillarLabel={t("hero.badge")}
        titleId="content-hero-title"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primary={{
          label: t("hero.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("hero.ctaSecondary"),
          href: "https://docs.better-i18n.com/sdk/quick-start",
        }}
        visual={<ContentFlow t={t} />}
      />

      <Divider />

      {/* The flow moved up into the hero's visual slot (it is the page's answer
          to "what is this"), so this band now carries the model card that used to
          sit there — the detail belongs after the overview, not before it. */}
      <Section>
        <ModelVisual t={t} />
      </Section>

      <Divider />

      {/* The header used to span the full width with the two columns beneath
          it, which left the visual starting halfway down the section with a
          band of empty page to its right — it read as an afterthought rather
          than as the answer to the claim. The header now sits INSIDE the left
          column, so the visual starts level with the h2 and the eye reads
          claim → evidence across, not down. */}
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div>
            <SectionHeader
              eyebrow={t("query.eyebrow")}
              title={t("query.title")}
              subtitle={t("query.subtitle")}
            />
            <ul className="mt-8 flex flex-col">
              {[
                t("query.point.one"),
                t("query.point.two"),
                t("query.point.three"),
              ].map((point) => (
                <li
                  key={point}
                  className="border-t border-black/[0.05] py-3 text-[13px] leading-relaxed text-mist-700 first:border-t-0"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <QueryVisual />
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("capabilities.eyebrow")}
          title={t("capabilities.title")}
          subtitle={t("capabilities.subtitle")}
        />
        {/* Was a hand-rolled grid with `px-5` on every cell and a `-ml-px`
            trick to hide the outer rule. The trick hid the border but not the
            padding, so "Content models" started 20px right of the h2 above it
            and the whole block read as a card sitting on the section instead
            of the section's own content. <FeatureGrid> zeroes that edge per
            row. */}
        <div className="mt-8">
          <FeatureGrid>
            {capabilities.map((c) => (
              <FeatureCell key={c.title} title={c.title} description={c.description} />
            ))}
          </FeatureGrid>
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("frameworks.eyebrow")}
          title={t("frameworks.title")}
          subtitle={t("frameworks.subtitle")}
        />
        {/* Same grid, same rule as Capabilities above. This one keeps bespoke
            cell contents (a mark and a monospace package name rather than a
            heading and a paragraph), so it composes <FeatureGrid> with raw
            `.feat-cell` children instead of <FeatureCell> — the alignment
            still comes from one place. */}
        <div className="mt-8">
          <FeatureGrid>
            {frameworks.map((f) => (
              <div key={f.key} className="feat-cell">
                <p className="flex items-center gap-2 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
                  {/* One decision for the whole grid, not per cell: Vanilla JS
                      has no mark, and reserving the slot only where a mark
                      exists would drop that one name out of line with the rest.
                      Reserving it unconditionally would be just as wrong on a
                      grid where nothing has a mark — six empty boxes. So: if any
                      item in the group has one, every item keeps the slot. */}
                  {marksInGrid && (
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {guideIcon(f.key)}
                    </span>
                  )}
                  {f.name}
                </p>
                <p className="mt-1.5 truncate font-mono text-[11px] text-mist-400">
                  {f.adapter}
                </p>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("pair.eyebrow")}
          title={t("pair.title")}
          subtitle={t("pair.subtitle")}
        />
        <div className="mt-8">
          <FeatureRow>
            <FeatureColumn
              label={t("pair.i18n.label")}
              title={t("pair.i18n.title")}
              description={t("pair.i18n.description")}
            />
            <FeatureColumn
              label={t("pair.content.label")}
              title={t("pair.content.title")}
              description={t("pair.content.description")}
            />
            <FeatureColumn
              label={t("pair.analytics.label")}
              title={t("pair.analytics.title")}
              description={t("pair.analytics.description")}
            />
          </FeatureRow>
        </div>
      </Section>

      <Divider />

      <ContentTestimonial />

      <Divider />

      <ClosingCta
        eyebrow={t("closing.eyebrow")}
        title={t("closing.title")}
        subtitle={t("closing.subtitle")}
        primary={{
          label: t("closing.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("closing.ctaSecondary"),
          href: "https://docs.better-i18n.com/sdk/quick-start",
        }}
      />

      <Divider />

      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

/* ─── Product flow ───────────────────────────────────────────────── */

/**
 * Better Content, as a flow: a model and its localized fields on one side, the
 * chainable read and the edge cache on the other, all converging on the product
 * tile. Geometry, motion and reduced-motion handling belong to <FlowHero />.
 */
function ContentFlow({ t }: { t: (key: string) => string }) {
  // The three locale cards are one fan-out, not three separate facts: the first
  // names the operation, the other two are the same operation in another locale.
  // Printing "Per-field localization" three times reads as a rendering bug.
  const entryCard = (locale: string, labelled?: boolean) => (
    <FlowCard
      eyebrow={labelled ? t("capabilities.localized.title") : undefined}
      corner={<LocaleFlag locale={locale} size={14} />}
    >
      <FlowMono>{`blog-posts · ${locale}`}</FlowMono>
      <div style={{ marginTop: 4 }}>
        <FlowText muted>{t("visual.localized")}</FlowText>
      </div>
    </FlowCard>
  );

  return (
    <FlowHero
      pillar="sync"
      title={t("capabilities.title")}
      center={{
        mark: (
          <img src="/brand/logo.svg" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
        ),
        label: "Better Content",
        sublabel: t("capabilities.edge.title"),
      }}
      cards={[
        <FlowCard key="model" eyebrow={t("capabilities.models.title")}>
          <FlowMono>{t("visual.model")}</FlowMono>
        </FlowCard>,
        <FlowCard key="query" eyebrow={t("query.title")}>
          <FlowMono lang="ts">{`.from("blog-posts").language("tr")`}</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("query.point.two")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="relations" eyebrow={t("capabilities.relations.title")}>
          <FlowMono lang="ts">{`.expand(["author", "category"])`}</FlowMono>
        </FlowCard>,
        <FlowCard key="publish" eyebrow={t("capabilities.publish.title")}>
          <FlowText>{t("visual.entry")}</FlowText>
        </FlowCard>,
        <div key="tr">{entryCard("tr", true)}</div>,
        <div key="de">{entryCard("de")}</div>,
        <div key="ja">{entryCard("ja")}</div>,
        <FlowCard key="mcp" eyebrow={t("capabilities.mcp.title")}>
          <FlowMono lang="ts">createContentEntry()</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

/** One real quote — the CDN-publish one, because that is this page's promise. */
function ContentTestimonial() {
  const tq = useTranslations("testimonials");
  return (
    <PageTestimonial
      quote={tq("2.quote")}
      name={tq("2.name")}
      role={tq("2.title")}
      avatar={testimonialAvatar(2)}
      patternId="dots-content"
    />
  );
}

/* ─── Bespoke visuals ────────────────────────────────────────────── */

/** Hero: a model's schema on the left, the same entry in three languages on the right. */
function ModelVisual({ t }: { t: (key: string) => string }) {
  const FIELDS = [
    { name: "title", type: "text", localized: true },
    { name: "body", type: "richtext", localized: true },
    { name: "localized_slug", type: "text", localized: true },
    { name: "author", type: "relation → authors", localized: false },
    { name: "publishedAt", type: "datetime", localized: false },
  ];
  const ENTRIES = [
    { lang: "English", value: "Shipping i18n without a TMS", status: "published" },
    { lang: "Türkçe", value: "TMS olmadan i18n yayınlamak", status: "published" },
    { lang: "Deutsch", value: "i18n ausliefern ohne TMS", status: "draft" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-black/[0.05] p-5 max-lg:border-b lg:border-r">
          <p className="text-[11px] font-medium text-mist-400">
            {t("visual.model")}
          </p>
          <div className="mt-3 flex flex-col">
            {FIELDS.map((f) => (
              <div
                key={f.name}
                className="flex items-center gap-2 border-t border-black/[0.05] py-2 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-[12px] text-mist-900">{f.name}</span>
                <span className="truncate font-mono text-[11px] text-mist-400">{f.type}</span>
                {f.localized && (
                  <span className="ml-auto shrink-0 rounded-sm border border-black/[0.06] bg-mist-50 px-1.5 py-0.5 text-[10px] text-mist-500">
                    {t("visual.localized")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* `flex` + a growing spacer, not a plain stack: the left pane lists five
            fields and this one lists three entries, so as a bare column it
            bottomed out ~30px early and left the wider half of the card looking
            unfinished. The summary strip is pinned to the bottom edge, which
            both fills the column and closes it the way the left pane's last row
            does. Its numbers are counted from ENTRIES rather than written down,
            so they cannot drift from the rows above them. */}
        <div className="flex flex-col">
          <p className="border-b border-black/[0.05] px-5 py-2.5 text-[11px] font-medium text-mist-400">
            {t("visual.entry")}
          </p>
          <div className="flex flex-1 flex-col divide-y divide-black/[0.05]">
            {ENTRIES.map((e) => (
              <div key={e.lang} className="flex items-center gap-3 px-5 py-3">
                <span className="w-16 shrink-0 text-[11px] font-medium text-mist-400">
                  {e.lang}
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-mist-800">
                  {e.value}
                </span>
                {/* Status is a word, so it is set as one. It used to be
                    emerald-on-published, which made the hue look like it encoded
                    something the label does not already say
                    (rule/neutral-ink-accent-is-identity-only); the live row is
                    now the one in full ink and the draft is the muted one. */}
                <span
                  className={`shrink-0 text-[11px] ${
                    e.status === "published" ? "text-mist-700" : "text-mist-400"
                  }`}
                >
                  {e.status}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto border-t border-black/[0.05] bg-black/[0.015] px-5 py-3">
            <p className="font-mono text-[11px] text-mist-500">
              {`${ENTRIES.length} locales · ${ENTRIES.filter((e) => e.status === "published").length} published · ${ENTRIES.filter((e) => e.status !== "published").length} draft`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 01 — the chainable read, and what comes back. */
function QueryVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">app/blog/page.tsx</span>
      </div>
      <HighlightedCode
        lang="ts"
        code={`const { data } = await client
  .from("blog-posts")
  .language("tr")
  .expand(["author", "category"])
  .eq("status", "published")
  .order("publishedAt", "desc")
  .limit(10)`}
      />
      <div className="border-t border-black/[0.05] bg-black/[0.015] px-4 py-3">
        <p className="text-[11px] font-medium text-mist-400">200 OK · 41ms · edge cache HIT</p>
        <p className="mt-1.5 font-mono text-[12px] text-mist-700">
          10 entries · tr · author + category expanded
        </p>
      </div>
    </div>
  );
}
