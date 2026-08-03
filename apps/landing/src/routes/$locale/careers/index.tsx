import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { SpriteIcon } from "@/components/SpriteIcon";
import { MarketingLayout } from "@/components/MarketingLayout";
import { RelatedPages } from "@/components/RelatedPages";
import {
  PageHero,
  Section,
  SectionHeader,
  Divider,
  BentoList,
  BentoRow,
  ClosingCta,
} from "@/components/ui/page";
import { getPageHead, getCareersPageStructuredData } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import { getJobPositions, type JobPosition } from "@/lib/content";
import { formatSalaryRange, toJobPostingOptions } from "@/lib/job-posting";

const loadPositions = createServerFn({ method: "GET" })
  .validator((data: { locale: string }) => data)
  .handler(async ({ data }) => getJobPositions(data.locale));

/** The six perks live on the CDN under `perks.*`; the order is ours. */
const PERK_KEYS = [
  "remote",
  "salary",
  "health",
  "pto",
  "homeOffice",
  "conference",
] as const;

export const Route = createFileRoute("/$locale/careers/")({
  loader: async ({ params, context }) => {
    // The three module imports do not depend on each other or on the fetches,
    // so they join the same Promise.all rather than sitting in front of it as
    // three serial round-trips (same shape as `blog/index.tsx`).
    const [{ getMessages }, { i18nConfig }, { filterMessages }] = await Promise.all([
      import("@better-i18n/use-intl/server"),
      import("@/i18n.config"),
      import("@/lib/page-namespaces"),
    ]);
    const [positions, allMessages] = await Promise.all([
      loadPositions({ data: { locale: params.locale } }),
      getMessages({ project: i18nConfig.project, locale: context.locale }),
    ]);
    const messages = filterMessages(allMessages, ["careersPage", "relatedPages", "page-titles", "page-descriptions", "meta", "breadcrumbs"]);
    return { positions, messages, locale: params.locale };
  },
  head: ({ loaderData }) => {
    const positions = loaderData?.positions ?? [];
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "careers",
      pathname: "/careers",
      // The schema reads the same CMS fields the page prints — employment type
      // and location included, rather than a hardcoded FULL_TIME / Remote pair.
      customStructuredData: getCareersPageStructuredData(
        positions.map((p: JobPosition) => toJobPostingOptions(p)),
        loaderData?.locale,
      ),
    });
  },
  component: CareersPage,
});

function CareersPage() {
  const { positions, locale } = Route.useLoaderData();
  const t = useT("careersPage");

  return (
    <MarketingLayout showCTA={false}>
      <PageHero
        // Two keys, one sentence: `hero.title` is "Help teams ship" and
        // `hero.titleHighlight` is "globally, faster". The page used to render
        // only the first half with the full sentence sitting in a forbidden
        // `defaultValue`, so the h1 on screen read "Help teams ship".
        title={
          <>
            {t("hero.title")}{" "}
            {/* mist-500 (#787878, 4.6:1), not mist-400 — the 400 step is
                reserved for 11–12px meta and measures 3.0:1 at hero size. */}
            <span className="text-mist-500">{t("hero.titleHighlight")}</span>
          </>
        }
        subtitle={t("hero.subtitle")}
        primary={{ label: t("openPositions.title"), href: "#positions" }}
        secondary={{ label: t("openPositions.sendGeneral"), href: `/${locale}/careers/general/` }}
        visual={<HiringFacts t={t} />}
      />

      <Divider />

      <Section id="positions" labelledBy="positions-title">
        <SectionHeader
          id="positions-title"
          eyebrow={t("openPositions.eyebrow")}
          title={t("openPositions.title")}
          subtitle={t("openPositions.subtitle")}
        />
        <div className="mt-10">
          {positions.length === 0 ? (
            <NoOpenings t={t} locale={locale} />
          ) : (
            <>
              {/* Listed items, not cards: no border box, no fill, no inset — the
                  only ink is the hairline BETWEEN two rows, and the vertical
                  padding that keeps a row off that hairline. */}
              <div>
                {positions.map((job: JobPosition) => (
                  <PositionRow key={job.slug} job={job} locale={locale} t={t} />
                ))}
              </div>
              <p className="mt-8 text-sm text-mist-500">
                {t("openPositions.noFit")}{" "}
                <Link
                  to="/$locale/careers/$slug/"
                  params={{ locale, slug: "general" }}
                  className="font-medium text-mist-950 underline decoration-mist-300 underline-offset-4"
                >
                  {t("openPositions.sendGeneral")}
                </Link>
              </p>
            </>
          )}
        </div>
      </Section>

      <Divider />

      <Section labelledBy="perks-title">
        <SectionHeader
          id="perks-title"
          eyebrow={t("perks.eyebrow")}
          title={t("perks.title")}
        />
        <div className="mt-8 max-w-[62ch]">
          <BentoList>
            {PERK_KEYS.map((key) => (
              <BentoRow key={key}>{t(`perks.${key}`)}</BentoRow>
            ))}
          </BentoList>
        </div>
      </Section>

      <Divider />

      <ClosingCta
        title={t("cta.title")}
        subtitle={t("general.description")}
        primary={{ label: t("sendResume"), href: `/${locale}/careers/general/` }}
      />

      <RelatedPages currentPage="careers" locale={locale} variant="for" />
    </MarketingLayout>
  );
}

type T = ReturnType<typeof useT>;

const FACT_KEYS = ["remote", "async", "bootstrapped", "market"] as const;

/** The four hero facts, separated by a rule rather than boxed into chips. */
function HiringFacts({ t }: { t: T }) {
  return (
    <ul className="flex flex-wrap gap-x-12 gap-y-4 border-t border-black/[0.07] pt-6">
      {FACT_KEYS.map((key) => (
        <li
          key={key}
          className="text-[15px] font-medium tracking-[-0.015em] text-mist-900"
        >
          {t(`hero.fact.${key}`)}
        </li>
      ))}
    </ul>
  );
}

function PositionRow({ job, locale, t }: { job: JobPosition; locale: string; t: T }) {
  const salary = formatSalaryRange(job);
  return (
    <Link
      to="/$locale/careers/$slug/"
      params={{ locale, slug: job.slug }}
      className="group flex items-start justify-between gap-6 border-t border-black/[0.07] py-6 first:border-t-0 first:pt-0"
    >
      <div className="min-w-0">
        {/* Department and location are words, not coloured badges — the word
            already carries the information a colour would only repeat. */}
        <p className="text-xs text-mist-500">
          {t(`department.${job.department}`)}
        </p>
        <h3 className="mt-1.5 text-[17px] font-medium tracking-[-0.02em] text-mist-950">
          {job.title}
        </h3>
        {job.summary && (
          <p className="mt-2 max-w-[62ch] text-sm leading-relaxed text-mist-600">
            {job.summary}
          </p>
        )}
        <p className="mt-2.5 text-[13px] text-mist-500">
          {job.location}
          <span className="px-1.5 text-mist-300">·</span>
          {job.type}
          {salary && (
            <>
              <span className="px-1.5 text-mist-300">·</span>
              <span className="tabular-nums">{salary}</span>
            </>
          )}
        </p>
      </div>
      <SpriteIcon
        name="arrow-right"
        className="mt-1 size-4 shrink-0 text-mist-300 transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-mist-600"
        aria-hidden="true"
      />
    </Link>
  );
}

/**
 * Zero open roles is the normal state of a six-person company, not an error.
 * The section still has to say what we hire for and how to reach us, otherwise
 * the page a candidate landed on from search is a blank rectangle.
 */
function NoOpenings({ t, locale }: { t: T; locale: string }) {
  return (
    <div className="max-w-[62ch] border-t border-black/[0.07] pt-8">
      <p className="text-[17px] font-medium tracking-[-0.02em] text-mist-950">
        {t("alwaysLooking")}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-mist-600">
        {t("openPositions.empty")}
      </p>
      <Link
        to="/$locale/careers/$slug/"
        params={{ locale, slug: "general" }}
        className="btn btn-dark btn-lg mt-6"
      >
        {t("sendResume")}
      </Link>
    </div>
  );
}
