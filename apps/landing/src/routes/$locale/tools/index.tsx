import { createFileRoute } from "@tanstack/react-router";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { MarketingLayout } from "@/components/MarketingLayout";
import { ToolCard } from "@/components/tools/ToolCard";
import { ToolFAQ } from "@/components/tools/ToolFAQ";
import { TOOL_REGISTRY } from "@/lib/tools/registry";

export const Route = createFileRoute("/$locale/tools/")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "tools",
      pathname: "/tools",
      pageType: "tool",
      metaFallback: {
        title: "Free i18n & Localization Developer Tools",
        description:
          "Free browser-based tools for i18n developers — locale reference, ICU message testing, file format conversion, cost estimation, and hreflang generation.",
      },
    }),
  component: ToolsHubPage,
});

const faqItems = [
  {
    question: "Are these tools really free?",
    answer:
      "Yes — all tools are completely free with no usage limits. There is no signup required, no credit card, and no trial period. The tools are funded by Better i18n's paid plans, which you can explore if you need a full translation management platform.",
  },
  {
    question: "Do these tools run in my browser?",
    answer:
      "Yes. Every tool on this page runs entirely in your browser. No files, locale data, or ICU messages are sent to any server. Your data stays on your machine.",
  },
  {
    question: "Do I need to create an account to use these tools?",
    answer:
      "No account or signup is required. Open any tool and start using it immediately. If you later decide to manage your translations at scale, you can sign up for Better i18n — but that is entirely optional.",
  },
  {
    question: "What tools are available?",
    answer:
      "There are five tools: Locale Explorer for browsing 250+ locales with Intl API examples and plural rules; ICU Playground for testing ICU message syntax with live preview; Translation File Converter for converting between JSON, PO, XLIFF, ARB, YAML, CSV, and more; Cost Calculator for estimating localization costs; and Hreflang Generator for creating correct hreflang tags for multilingual SEO.",
  },
  {
    question: "Can I use these tools offline?",
    answer:
      "Once the page has loaded, the Locale Explorer, ICU Playground, and Hreflang Generator work fully offline because all computation happens in the browser. The File Converter and Cost Calculator also run entirely client-side, so they too work without an internet connection after the initial page load.",
  },
] as const;

function ToolsHubPage() {
  const { locale } = Route.useParams();

  const breadcrumbs = [
    { label: "Home", href: `/${locale}` },
    { label: "Free Tools" },
  ];

  return (
    <MarketingLayout bgClassName="bg-mist-50" showCTA={false} breadcrumbs={breadcrumbs}>
      {/* Hero */}
      <section className="border-b border-mist-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.18em] text-mist-500">
              Free Developer Tools
            </p>
            <h1 className="font-display text-4xl/[1.06] font-medium tracking-[-0.03em] text-mist-950 sm:text-5xl/[1.04]">
              Free i18n &amp; Localization Tools
            </h1>
            <p className="mt-4 text-lg/7 text-mist-700">
              Browser-based tools for developers working with
              internationalization. No signup required — everything runs in your
              browser.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOL_REGISTRY.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} locale={locale} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <ToolFAQ items={faqItems} title="Questions about the free tools" />

      {/* CTA */}
      <section className="border-t border-mist-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-3xl/[1.1]">
              Ready to scale your i18n?
            </h2>
            <p className="max-w-2xl text-base/7 text-mist-700">
              Try Better i18n — first 1,000 keys free. Type-safe SDKs,
              AI-powered translations, and real-time collaboration for your
              whole team.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://dash.better-i18n.com"
                className="inline-flex items-center justify-center rounded-xl bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800"
              >
                Try Better i18n — first 1,000 keys free
              </a>
              <a
                href="https://cal.com/better-i18n/30min?overlayCalendar=true"
                className="text-sm font-medium text-mist-700 hover:text-mist-950"
              >
                Book a demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
