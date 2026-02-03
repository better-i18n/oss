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

export const Route = createFileRoute("/$locale/privacy")({
  loader: ({ context }) => ({
    messages: context.messages,
    locale: context.locale,
  }),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/privacy";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "privacy", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname, ["en", "tr"]),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(),
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const t = useTranslations("privacy");

  return (
    <>
      <Header className="bg-[#f9f9f9]" />
      <LegalLayout
        active="privacy"
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
                href="#introduction"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.introduction")}
              </a>
            </li>
            <li>
              <a
                href="#personal-data"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.personalData")}
              </a>
            </li>
            <li>
              <a
                href="#how-we-use"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.howWeUse")}
              </a>
            </li>
            <li>
              <a
                href="#how-we-share"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.howWeShare")}
              </a>
            </li>
            <li>
              <a
                href="#retention"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.retention")}
              </a>
            </li>
            <li>
              <a
                href="#security"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.security")}
              </a>
            </li>
            <li>
              <a
                href="#your-rights"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.yourRights")}
              </a>
            </li>
            <li>
              <a
                href="#changes"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.changes")}
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="no-underline text-gray-600 hover:text-gray-900"
              >
                {t("toc.contact")}
              </a>
            </li>
          </ul>
        </div>

        <p className="text-gray-600 text-lg mb-8">{t("note")}</p>

        <h2 id="introduction">{t("sections.introduction.title")}</h2>
        <p>
          {t.rich("sections.introduction.content", {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2 id="personal-data">{t("sections.personalData.title")}</h2>
        <p>{t("sections.personalData.content")}</p>

        <h3>{t("sections.personalData.provided.title")}</h3>
        <ul>
          <li>
            {t.rich("sections.personalData.provided.account", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.personalData.provided.payment", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.personalData.provided.communications", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.personalData.provided.content", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>

        <h3>{t("sections.personalData.automatic.title")}</h3>
        <ul>
          <li>
            {t.rich("sections.personalData.automatic.usage", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.personalData.automatic.device", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.personalData.automatic.cookies", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>

        <h2 id="how-we-use">{t("sections.howWeUse.title")}</h2>
        <p>{t("sections.howWeUse.content")}</p>
        <ul>
          <li>
            {t.rich("sections.howWeUse.list.services", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeUse.list.communication", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeUse.list.billing", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeUse.list.analytics", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeUse.list.security", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeUse.list.legal", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>

        <h2 id="how-we-share">{t("sections.howWeShare.title")}</h2>
        <p>{t("sections.howWeShare.content")}</p>
        <ul>
          <li>
            {t.rich("sections.howWeShare.list.providers", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeShare.list.ai", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeShare.list.legal", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.howWeShare.list.business", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>

        <h2 id="retention">{t("sections.retention.title")}</h2>
        <p>{t("sections.retention.content")}</p>

        <h2 id="security">{t("sections.security.title")}</h2>
        <p>{t("sections.security.content")}</p>

        <h2 id="your-rights">{t("sections.yourRights.title")}</h2>
        <p>{t("sections.yourRights.content")}</p>
        <ul>
          <li>
            {t.rich("sections.yourRights.list.access", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.yourRights.list.deletion", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
          <li>
            {t.rich("sections.yourRights.list.optOut", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </li>
        </ul>

        <h2 id="changes">{t("sections.changes.title")}</h2>
        <p>{t("sections.changes.content")}</p>

        <h2 id="contact">{t("sections.contact.title")}</h2>
        <p>
          {t.rich("sections.contact.content", {
            a: (chunks) => (
              <a href="mailto:privacy@better-i18n.com">{chunks}</a>
            ),
          })}
        </p>
      </LegalLayout>
      <Footer />
    </>
  );
}
