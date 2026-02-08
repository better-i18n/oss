import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { LegalLayout } from "../../components/LegalLayout";
import { useTranslations } from "@better-i18n/use-intl";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getDefaultStructuredData } from "@/lib/structured-data";

export const Route = createFileRoute("/$locale/terms")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/terms";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "terms", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(),
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const t = useTranslations("terms");

  return (
    <>
      <Header className="bg-[#f9f9f9]" />
      <LegalLayout
        active="terms"
        title={t("title")}
        lastUpdated={t("lastUpdatedDate")}
      >
        <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100 text-sm">
          <h3 className="font-semibold text-gray-900 mb-3 mt-0 text-base">
            {t("toc.title")}
          </h3>
          <ul className="space-y-2 list-none pl-0 m-0">
            <li>
              <a
                href="#acceptance"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.acceptance")}
              </a>
            </li>
            <li>
              <a
                href="#services"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.services")}
              </a>
            </li>
            <li>
              <a
                href="#accounts"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.accounts")}
              </a>
            </li>
            <li>
              <a
                href="#content"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.content")}
              </a>
            </li>
            <li>
              <a
                href="#payment"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.payment")}
              </a>
            </li>
            <li>
              <a
                href="#intellectual-property"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.intellectualProperty")}
              </a>
            </li>
            <li>
              <a
                href="#termination"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.termination")}
              </a>
            </li>
            <li>
              <a
                href="#disclaimers"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.disclaimers")}
              </a>
            </li>
            <li>
              <a
                href="#general"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.general")}
              </a>
            </li>
          </ul>
        </div>

        <h2 id="acceptance">{t("sections.acceptance.title")}</h2>
        <p>
          {t.rich("sections.acceptance.content", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="services">{t("sections.services.title")}</h2>
        <p>
          {t.rich("sections.services.license", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.services.restrictions", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="accounts">{t("sections.accounts.title")}</h2>
        <p>{t("sections.accounts.content")}</p>

        <h2 id="content">{t("sections.content.title")}</h2>
        <p>
          {t.rich("sections.content.ownership", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.content.license", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="payment">{t("sections.payment.title")}</h2>
        <p>
          {t.rich("sections.payment.fees", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.payment.billing", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="intellectual-property">
          {t("sections.intellectualProperty.title")}
        </h2>
        <p>{t("sections.intellectualProperty.content")}</p>

        <h2 id="termination">{t("sections.termination.title")}</h2>
        <p>{t("sections.termination.content")}</p>

        <h2 id="disclaimers">{t("sections.disclaimers.title")}</h2>
        <p>
          {t.rich("sections.disclaimers.warranty", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.disclaimers.limitation", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="general">{t("sections.general.title")}</h2>
        <p>
          {t.rich("sections.general.law", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.general.agreement", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
        <p>
          {t.rich("sections.general.contact", {
            strong: (chunks) => <strong>{chunks}</strong>,
            a: (chunks) => <a href="mailto:legal@better-i18n.com">{chunks}</a>,
          })}
        </p>
      </LegalLayout>
      <Footer />
    </>
  );
}
