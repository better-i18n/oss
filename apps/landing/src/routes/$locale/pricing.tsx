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
import { Divider, FaqSection } from "@/components/ui/page";

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

const FAQ_KEYS = ["tryFree", "payment", "changePlans", "enterprise", "discounts"] as const;

function PricingPage() {
  const t = useTranslations("pricingPage");
  const { locale } = Route.useParams();
  const { plans } = Route.useLoaderData();

  return (
    <MarketingLayout showCTA={false}>
      {/* Pricing Section — use h1 on dedicated pricing page */}
      <Pricing headingLevel="h1" plans={plans} />

      <Divider />

      {/* Pricing Comparison Table */}
      <PricingComparison />

      <Divider />

      {/* FAQ — the shared archetype, identical to the home page's */}
      <FaqSection
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        items={FAQ_KEYS.map((key) => ({
          id: key,
          question: t(`faq.${key}.question`),
          answer: t(`faq.${key}.answer`),
        }))}
      />

      <Divider />

      {/* Related Pages */}
      <RelatedPages currentPage="pricing" locale={locale} variant="content" />
    </MarketingLayout>
  );
}
