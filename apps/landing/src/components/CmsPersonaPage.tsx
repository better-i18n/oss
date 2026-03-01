import { Link } from "@tanstack/react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RelatedPages } from "@/components/RelatedPages";
import BlogContent from "@/components/blog/BlogContent";
import { IconArrowLeft } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import type { MarketingPage, MarketingPageListItem } from "@/lib/content";
import { getPersonaLabel } from "@/lib/cms-persona-helpers";

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
  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-16">
        <article className="mx-auto max-w-4xl px-6 lg:px-10">
          {/* Hero */}
          <header className="mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-mist-500 mb-4">
              {getPersonaLabel(page.slug)}
            </span>
            <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1] lg:text-5xl/[1.1]">
              {page.title}
            </h1>
            {page.heroSubtitle && (
              <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
                {page.heroSubtitle}
              </p>
            )}
          </header>

          {/* Content */}
          {page.bodyHtml && (
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
          )}
        </article>

        {/* Related Personas */}
        {relatedPersonas.length > 0 && (
          <div className="mx-auto max-w-7xl px-6 lg:px-10 mt-16">
            <h2 className="font-display text-2xl font-medium text-mist-950 mb-8">
              Built for every team
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPersonas.map((persona) => (
                <Link
                  key={persona.slug}
                  to={`/$locale/${persona.slug}` as string}
                  params={{ locale }}
                  className="group p-6 rounded-xl bg-mist-50 border border-mist-100 hover:border-mist-200 transition-colors"
                >
                  <h3 className="text-base font-medium text-mist-950 group-hover:text-mist-700 transition-colors">
                    {persona.title}
                  </h3>
                  {persona.heroSubtitle && (
                    <p className="mt-2 text-sm text-mist-600 leading-relaxed line-clamp-2">
                      {persona.heroSubtitle}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <RelatedPages currentPage="features" locale={locale} variant="for" />
      <Footer />
    </div>
  );
}

export function CmsPersonaNotFound({
  locale,
}: {
  locale: string;
  slug?: string;
}) {
  return (
    <div className="bg-white">
      <Header className="bg-white" />
      <main className="py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h1 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-4xl/[1.1]">
            Page not found
          </h1>
          <p className="mt-4 text-lg text-mist-600">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/$locale"
            params={{ locale }}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
