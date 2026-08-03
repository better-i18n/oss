import { createFileRoute } from "@tanstack/react-router";
import { testimonialAvatar } from "@/lib/testimonials";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { HighlightedCode } from "@/components/CodeBlock";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { LocaleFlag } from "@/components/ui/locale-flag";
import { PageTestimonial } from "@/components/ui/page";
import { useTranslations } from "@better-i18n/use-intl";
import {
  ClosingCta,
  Divider,
  FaqSection,
  PageHero,
  Section,
  SectionHeader,
} from "@/components/ui/page";

export const Route = createFileRoute("/$locale/analytics")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "analytics",
      pathname: "/analytics",
      pageType: "default",
      structuredDataOptions: {
        title: "Better Analytics — content views by language and country",
        description:
          "Cookie-free content analytics: see which entries readers open, in which language, and from where. sendBeacon-first transport, framework adapters, write-only public key.",
      },
    }),
  component: AnalyticsPage,
});

/* ─── Page ───────────────────────────────────────────────────────── */

function AnalyticsPage() {
  const t = useT("analyticsPage");
  const { locale } = Route.useParams();

  const tracked = [
    {
      title: t("tracked.explicit.title"),
      description: t("tracked.explicit.description"),
    },
    {
      title: t("tracked.context.title"),
      description: t("tracked.context.description"),
    },
    {
      title: t("tracked.props.title"),
      description: t("tracked.props.description"),
    },
    {
      title: t("tracked.country.title"),
      description: t("tracked.country.description"),
    },
  ];

  const safety = [
    {
      title: t("safety.writeOnly.title"),
      description: t("safety.writeOnly.description"),
    },
    {
      title: t("safety.rateLimit.title"),
      description: t("safety.rateLimit.description"),
    },
    {
      title: t("safety.scoped.title"),
      description: t("safety.scoped.description"),
    },
    {
      title: t("safety.proxy.title"),
      description: t("safety.proxy.description"),
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        pillar="mcp"
        pillarLabel={t("hero.badge")}
        titleId="analytics-hero-title"
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
        primary={{
          label: t("hero.ctaPrimary"),
          href: "https://dash.better-i18n.com",
        }}
        secondary={{
          label: t("hero.ctaSecondary"),
          href: "https://docs.better-i18n.com/content/analytics",
        }}
        visual={<ViewsVisual t={t} />}
      />

      <Divider />

      {/* Better Analytics as a flow: a view somewhere in the app becomes one
          cookie-free signal, and the breakdowns leave the platform on the other
          side. Requested alongside the Content one; ViewsVisual, InstallVisual
          and TransportVisual below are unchanged. Labels are existing
          analyticsPage keys. */}
      <Section>
        <AnalyticsFlow t={t} />
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("install.eyebrow")}
          title={t("install.title")}
          subtitle={t("install.subtitle")}
        />
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <ul className="flex flex-col">
            {[
              t("install.point.one"),
              t("install.point.two"),
              t("install.point.three"),
            ].map((point) => (
              <li
                key={point}
                className="border-t border-black/[0.05] py-3 text-[13px] leading-relaxed text-mist-700 first:border-t-0"
              >
                {point}
              </li>
            ))}
          </ul>
          <InstallVisual />
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("transport.eyebrow")}
          title={t("transport.title")}
          subtitle={t("transport.subtitle")}
        />
        <div className="mt-8">
          <TransportVisual t={t} />
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("tracked.eyebrow")}
          title={t("tracked.title")}
          subtitle={t("tracked.subtitle")}
        />
        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tracked.map((item) => (
              <div
                key={item.title}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <Section>
        <SectionHeader
          eyebrow={t("safety.eyebrow")}
          title={t("safety.title")}
          subtitle={t("safety.subtitle")}
        />
        <div className="mt-8 overflow-hidden">
          <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-2">
            {safety.map((item) => (
              <div
                key={item.title}
                className="border-t border-l border-black/[0.05] px-5 py-4"
              >
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-mist-900">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Divider />

      <FaqSection
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        items={[
          {
            id: "cookies",
            question: t("faq.cookies.question"),
            answer: t("faq.cookies.answer"),
          },
          {
            id: "blockers",
            question: t("faq.blockers.question"),
            answer: t("faq.blockers.answer"),
          },
          {
            id: "unload",
            question: t("faq.unload.question"),
            answer: t("faq.unload.answer"),
          },
          {
            id: "existing",
            question: t("faq.existing.question"),
            answer: t("faq.existing.answer"),
          },
        ]}
      />

      <Divider />

      <AnalyticsTestimonial />

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
          href: "https://docs.better-i18n.com/content/analytics",
        }}
      />

      <Divider />

      <RelatedPages currentPage="features" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

/* ─── Product flow ───────────────────────────────────────────────── */

/**
 * Every tracked view arrives the same way — one explicit call, one beacon, no
 * cookie — and leaves as a breakdown by language, country and entry.
 */
function AnalyticsFlow({ t }: { t: (key: string) => string }) {
  const localeCard = (locale: string) => (
    <FlowCard eyebrow={t("visual.byLanguage")} corner={<LocaleFlag locale={locale} size={14} />}>
      <FlowMono>{`${locale} · content.view`}</FlowMono>
    </FlowCard>
  );

  return (
    <FlowHero
      pillar="mcp"
      title={t("tracked.title")}
      center={{
        mark: (
          <img src="/brand/logo.svg" alt="" width={26} height={26} style={{ width: 26, height: 26 }} />
        ),
        label: "Better Analytics",
        sublabel: t("visual.live"),
      }}
      cards={[
        <FlowCard key="hook" eyebrow={t("install.title")}>
          <FlowMono>useTrackView(&quot;content.view&quot;)</FlowMono>
        </FlowCard>,
        <FlowCard key="explicit" eyebrow={t("tracked.explicit.title")}>
          <FlowText>{t("install.point.one")}</FlowText>
        </FlowCard>,
        <FlowCard key="beacon" eyebrow={t("transport.eyebrow")}>
          <FlowMono>sendBeacon</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("transport.beacon")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="key" eyebrow={t("safety.writeOnly.title")}>
          <FlowMono>bi_pub_…</FlowMono>
        </FlowCard>,
        <div key="tr">{localeCard("tr")}</div>,
        <div key="de">{localeCard("de")}</div>,
        <FlowCard key="country" eyebrow={t("tracked.country.title")}>
          <FlowMono>DE · TR · JP</FlowMono>
        </FlowCard>,
        <FlowCard key="entries" eyebrow={t("visual.topEntries")}>
          <FlowMono>entryId · contentModel</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

/** One real quote — the platform-breadth one, since this is a second product. */
function AnalyticsTestimonial() {
  const tq = useTranslations("testimonials");
  return (
    <PageTestimonial
      quote={tq("1.quote")}
      name={tq("1.name")}
      role={tq("1.title")}
      avatar={testimonialAvatar(1)}
      patternId="dots-analytics"
    />
  );
}

/* ─── Bespoke visuals ────────────────────────────────────────────── */

/** Hero: the dashboard's language breakdown — the number this product exists to show. */
function ViewsVisual({ t }: { t: (key: string) => string }) {
  const ROWS = [
    { lang: "English", views: "18,420", share: 100 },
    { lang: "Deutsch", views: "9,106", share: 49 },
    { lang: "Türkçe", views: "6,733", share: 37 },
    { lang: "日本語", views: "4,218", share: 23 },
    { lang: "Español", views: "2,904", share: 16 },
  ];
  const ENTRIES = [
    { slug: "shipping-i18n-without-a-tms", views: "5,201" },
    { slug: "icu-message-format-guide", views: "3,884" },
    { slug: "hreflang-for-subfolders", views: "2,470" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border-black/[0.05] p-5 max-lg:border-b lg:border-r">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-medium text-mist-400">
              {t("visual.byLanguage")}
            </p>
            <p className="text-[11px] text-mist-400">41,381</p>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {ROWS.map((r) => (
              <div key={r.lang} className="flex items-center gap-3">
                <span className="w-16 shrink-0 text-[11px] font-medium text-mist-400">
                  {r.lang}
                </span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                  <span
                    className="block h-full rounded-full bg-mist-900"
                    style={{ width: `${r.share}%` }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right text-[11px] tabular-nums text-mist-600">
                  {r.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-black/[0.05]">
          <p className="px-5 py-2.5 text-[11px] font-medium text-mist-400">
            {t("visual.topEntries")}
          </p>
          {ENTRIES.map((e) => (
            <div key={e.slug} className="flex items-center gap-3 px-5 py-3">
              <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-mist-700">
                {e.slug}
              </span>
              <span className="shrink-0 text-[11px] tabular-nums text-mist-500">
                {e.views}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2 px-5 py-3">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-mist-400">
              {t("visual.live")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 01 — provider + hook, the whole integration. */
function InstallVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white">
      <div className="border-b border-black/[0.05] px-4 py-2.5">
        <span className="font-mono text-[11px] text-mist-500">app/blog/[slug]/page.tsx</span>
      </div>
      {/* Tokenised at build time by the site's own highlighter — no runtime
          highlighter ships to the browser (see components/CodeBlock.tsx). */}
      <HighlightedCode
        lang="tsx"
        code={`import { useTrackView } from
  "@better-i18n/content/adapters/nextjs"

useTrackView("content.view", {
  entryId: post.id,
  contentModel: "blog",
  entrySlug: post.slug,
  language: post.locale,
})`}
      />
      <div className="border-t border-black/[0.05] bg-black/[0.015] px-4 py-3">
        <p className="font-mono text-[12px] text-mist-700">
          content.view · tr · blog · 1 event
        </p>
        <p className="mt-1 text-[11px] text-mist-400">
          sent with sendBeacon · 0ms on the main thread
        </p>
      </div>
    </div>
  );
}

/** 02 — the three-step transport fallback, drawn as a chain. */
function TransportVisual({ t }: { t: (key: string) => string }) {
  const STEPS = [
    {
      name: "sendBeacon",
      note: t("transport.beacon"),
    },
    {
      name: "fetch(keepalive)",
      note: t("transport.keepalive"),
    },
    {
      name: "fetch",
      note: t("transport.fetch"),
    },
  ];

  return (
    <div className="overflow-hidden">
      <div className="-mt-px -ml-px grid grid-cols-1 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.name}
            className="flex flex-col gap-2 border-t border-l border-black/[0.05] px-5 py-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium tabular-nums text-mist-400">
                {`0${i + 1}`}
              </span>
              <span className="font-mono text-[13px] text-mist-900">{s.name}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-mist-600">{s.note}</p>
            {i < STEPS.length - 1 && (
              <p className="mt-auto text-[11px] text-mist-400">
                {t("transport.onFailure")}
              </p>
            )}
            {i === STEPS.length - 1 && (
              <p className="mt-auto text-[11px] text-mist-400">
                {t("transport.dropped")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
