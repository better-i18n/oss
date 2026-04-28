import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import Pricing from "@/components/Pricing";
import { getPageHead, getFAQSchema, formatStructuredData } from "@/lib/page-seo";
import { getPricingPageStructuredData } from "@/lib/structured-data";
import { PricingComparison } from "@/components/PricingComparison";
import { RelatedPages } from "@/components/RelatedPages";
import { useTranslations } from "@better-i18n/use-intl";
import { getPricingPlans } from "@/lib/content";
import { getMessages } from "@better-i18n/use-intl/server";
import { i18nConfig } from "@/i18n.config";
import { filterMessages } from "@/lib/page-namespaces";

export const Route = createFileRoute("/$locale/pricing")({
  loader: async ({ context }) => {
    const [allMessages, plans] = await Promise.all([
      getMessages({ project: i18nConfig.project, locale: context.locale }),
      getPricingPlans(context.locale),
    ]);
    const messages = filterMessages(allMessages, ["meta", "breadcrumbs", "pricingPage"]);
    return { messages, locale: context.locale, plans };
  },
  head: ({ loaderData }) => {
    const messages = loaderData?.messages || {};
    const locale = loaderData?.locale || "en";

    const pricingPageNs = (messages as Record<string, unknown>)?.pricingPage as
      | Record<string, unknown>
      | undefined;
    const faqNs = pricingPageNs?.faq as Record<string, Record<string, string>> | undefined;

    const faqItems = faqNs
      ? ["tryFree", "payment", "changePlans", "enterprise", "discounts"]
          .filter((key) => faqNs[key]?.question && faqNs[key]?.answer)
          .map((key) => ({
            question: faqNs[key].question,
            answer: faqNs[key].answer,
          }))
      : [];

    const pricingScripts = getPricingPageStructuredData({ locale });
    const faqScript = faqItems.length > 0
      ? formatStructuredData(getFAQSchema(faqItems, locale))
      : [];

    return getPageHead({
      messages: loaderData?.messages || {},
      locale,
      pageKey: "pricing",
      pathname: "/pricing",
      pageType: "pricing",
      customStructuredData: [...pricingScripts, ...faqScript],
    });
  },
  component: PricingPage,
});

function PricingPage() {
  const t = useTranslations("pricingPage");
  const { locale } = Route.useParams();
  const { plans } = Route.useLoaderData();

  return (
    <MarketingLayout showCTA={false}>
      {/* Pricing Section — use h1 on dedicated pricing page */}
      <Pricing headingLevel="h1" plans={plans} />

      {/* Pricing Comparison Table */}
      <PricingComparison />

      {/* FAQ Section */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-4">
            <FAQItem
              question={t("faq.tryFree.question")}
              answer={t("faq.tryFree.answer")}
            />
            <FAQItem
              question={t("faq.payment.question")}
              answer={t("faq.payment.answer")}
            />
            <FAQItem
              question={t("faq.changePlans.question")}
              answer={t("faq.changePlans.answer")}
            />
            <FAQItem
              question={t("faq.enterprise.question")}
              answer={t("faq.enterprise.answer")}
            />
            <FAQItem
              question={t("faq.discounts.question")}
              answer={t("faq.discounts.answer")}
            />
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <RelatedPages currentPage="pricing" locale={locale} variant="content" />
    </MarketingLayout>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="border-b border-mist-200 pb-6 group">
      <summary className="text-base font-medium text-mist-950 cursor-pointer list-none flex items-center justify-between">
        {question}
        <span className="text-mist-400 group-open:rotate-180 transition-transform text-sm">
          &#9662;
        </span>
      </summary>
      <p className="mt-3 text-sm text-mist-700 leading-relaxed">{answer}</p>
    </details>
  );
}
