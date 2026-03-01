import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import Pricing from "@/components/Pricing";
import { getPageHead, getFAQSchema, formatStructuredData } from "@/lib/page-seo";
import { getPricingPageStructuredData } from "@/lib/structured-data";
import { useTranslations } from "@better-i18n/use-intl";
import { IconCheckmark1 } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/pricing")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
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

    const pricingScripts = getPricingPageStructuredData();
    const faqScript = faqItems.length > 0
      ? formatStructuredData(getFAQSchema(faqItems))
      : [];

    return getPageHead({
      messages,
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

  const trustBadges = [
    { key: "uptime", label: t("trust.uptime") },
    { key: "gdpr", label: t("trust.gdpr") },
    { key: "soc2", label: t("trust.soc2") },
    { key: "support", label: t("trust.support") },
    { key: "cdn", label: t("trust.cdn") },
    { key: "encryption", label: t("trust.encryption") },
  ];

  return (
    <MarketingLayout showCTA={false}>
      {/* Pricing Section — use h1 on dedicated pricing page */}
      <Pricing headingLevel="h1" />

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="font-display text-2xl font-medium text-mist-950 mb-8 text-center">
            {t("faq.title")}
          </h2>
          <div className="space-y-6">
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

      {/* Trust Section */}
      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950">
              {t("trust.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {trustBadges.map((item) => (
              <div key={item.key} className="flex items-center gap-2 justify-center p-4 rounded-lg bg-white border border-mist-200">
                <IconCheckmark1 className="size-4 text-mist-950" />
                <span className="text-sm font-medium text-mist-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-mist-200 pb-6">
      <h3 className="text-base font-medium text-mist-950">{question}</h3>
      <p className="mt-2 text-sm text-mist-700 leading-relaxed">{answer}</p>
    </div>
  );
}
