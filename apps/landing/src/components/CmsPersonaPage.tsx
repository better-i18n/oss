import { Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import BlogContent from "@/components/blog/BlogContent";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronRight,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { MarketingPage, MarketingPageListItem } from "@/lib/content";
import { getPersonaLabel } from "@/lib/cms-persona-helpers";
import { useT } from "@/lib/i18n";

interface CmsPersonaPageProps {
  page: MarketingPage;
  locale: string;
  relatedPersonas: MarketingPageListItem[];
}

export function CmsPersonaPage({
  page,
  locale,
  relatedPersonas,
}: CmsPersonaPageProps) {
  const t = useT("persona");

  return (
    <MarketingLayout bgClassName="bg-white" showCTA={true}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-mist-50 to-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 sm:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-mist-200 px-3 py-1.5 text-sm font-medium text-mist-700 mb-6">
              {getPersonaLabel(page.slug)}
            </span>
            <h1
              className="font-display text-3xl/[1.1] font-semibold tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]"
              style={{ textWrap: "balance" }}
            >
              {page.title}
            </h1>
            {page.heroSubtitle && (
              <p
                className="mt-6 text-lg/8 text-mist-600 max-w-2xl"
                style={{ textWrap: "pretty" }}
              >
                {page.heroSubtitle}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a
                href="https://dash.better-i18n.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mist-950 px-6 py-3 text-sm font-medium text-white hover:bg-mist-900 transition-colors"
              >
                {t("hero.cta", "Get Started")}
                <IconArrowRight className="size-4" />
              </a>
              <a
                href="https://cal.com/better-i18n/30min?overlayCalendar=true"
                className="inline-flex items-center gap-2 text-sm font-medium text-mist-600 hover:text-mist-950 transition-colors"
              >
                {t("hero.bookDemo", "Book a demo")}
                <IconChevronRight className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      {page.bodyHtml && (
        <section className="py-16">
          <article className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="min-w-0">
              <BlogContent
                html={page.bodyHtml}
                className="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:font-medium prose-headings:tracking-[-0.02em] prose-headings:text-mist-950
                  prose-p:text-mist-700 prose-p:leading-relaxed
                  prose-a:text-mist-950 prose-a:underline-offset-4 prose-a:decoration-mist-300 hover:prose-a:decoration-mist-500
                  prose-strong:text-mist-900 prose-strong:font-semibold
                  prose-code:text-mist-900 prose-code:bg-mist-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                  prose-blockquote:border-l-mist-300 prose-blockquote:text-mist-600 prose-blockquote:not-italic
                  prose-img:rounded-xl
                  prose-li:text-mist-700
                  prose-hr:border-mist-100"
              />
            </div>
          </article>
        </section>
      )}

      {/* Related Personas */}
      {relatedPersonas.length > 0 && (
        <section className="py-16 bg-mist-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-3">
              {t("builtForEveryTeam", "Built for every team")}
            </h2>
            <p className="text-base text-mist-600 mb-8 max-w-2xl">
              {t("builtForEveryTeamDesc", "See how Better i18n adapts to different roles and industries.")}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPersonas.map((persona) => (
                <Link
                  key={persona.slug}
                  to={`/$locale/${persona.slug}` as string}
                  params={{ locale }}
                  className="group flex items-center justify-between p-5 rounded-xl bg-white border border-mist-200 hover:border-mist-300 hover:shadow-md transition-all"
                >
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
                      {persona.title}
                    </h3>
                    {persona.heroSubtitle && (
                      <p className="mt-1 text-xs text-mist-500 leading-relaxed line-clamp-2">
                        {persona.heroSubtitle}
                      </p>
                    )}
                  </div>
                  <IconArrowRight className="w-4 h-4 flex-shrink-0 ml-3 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </MarketingLayout>
  );
}

export function CmsPersonaNotFound({
  locale,
}: {
  locale: string;
  slug?: string;
}) {
  const t = useT("persona");

  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            {t("notFound.title", "Page not found")}
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            {t("notFound.description", "The page you're looking for doesn't exist.")}
          </p>
          <Link
            to="/$locale"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            {t("notFound.goHome", "Go Home")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
