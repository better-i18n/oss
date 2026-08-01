import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { LegalLayout } from "../../components/LegalLayout";
import { useT } from "@/lib/i18n";
import {
  getLocalizedMeta,
  formatMetaTags,
  getAlternateLinks,
  getCanonicalLink,
} from "@/lib/meta";
import { getDefaultStructuredData } from "@/lib/structured-data";
import { createPageLoader } from "@/lib/page-seo";

export const Route = createFileRoute("/$locale/cookies")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    const locale = loaderData?.locale || "en";
    const pathname = "/cookies";
    const meta = getLocalizedMeta(loaderData?.messages || {}, "cookies", {
      locale,
      pathname,
    });
    return {
      meta: formatMetaTags(meta, { locale }),
      links: [
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(locale),
    };
  },
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  const t = useT("legal");

  return (
    <MarketingLayout showCTA={false}>
      <LegalLayout
        active="cookies"
        title={t("cookies.title")}
        lastUpdated={t("cookies.lastUpdatedDate")}
      >
        {/* Introduction */}
        <section className="mb-10">
          <p>
            {t("cookies.intro")}
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="mb-10">
          <h2>{t("cookies.whatAreCookies.title")}</h2>
          <p>
            {t("cookies.whatAreCookies.description")}
          </p>
        </section>

        {/* Cookie Categories */}
        <section className="mb-10">
          <h2>{t("cookies.categories.title")}</h2>

          {/* Essential */}
          <h3>{t("cookies.categories.essential.title")}</h3>
          <p>
            {t("cookies.categories.essential.description")}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("cookies.table.name")}</th>
                  <th>{t("cookies.table.provider")}</th>
                  <th>{t("cookies.table.purpose")}</th>
                  <th>{t("cookies.table.duration")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>bi18n_cookie_consent</code></td>
                  <td>Better I18N</td>
                  <td>{t("consent.purpose")}</td>
                  <td>{t("consent.duration")}</td>
                </tr>
                <tr>
                  <td><code>bi18n_locale</code></td>
                  <td>Better I18N</td>
                  <td>{t("locale.purpose")}</td>
                  <td>{t("locale.duration")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analytics */}
          <h3>{t("cookies.categories.analytics.title")}</h3>
          <p>
            {t("cookies.categories.analytics.description")}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("cookies.table.name")}</th>
                  <th>{t("cookies.table.provider")}</th>
                  <th>{t("cookies.table.purpose")}</th>
                  <th>{t("cookies.table.duration")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Google Analytics</td>
                  <td>{t("ga.purpose")}</td>
                  <td>{t("ga.duration")}</td>
                </tr>
                <tr>
                  <td><code>_ga_*</code></td>
                  <td>Google Analytics</td>
                  <td>{t("gaSession.purpose")}</td>
                  <td>{t("gaSession.duration")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Marketing */}
          <h3>{t("cookies.categories.marketing.title")}</h3>
          <p>
            {t("cookies.categories.marketing.description")}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("cookies.table.name")}</th>
                  <th>{t("cookies.table.provider")}</th>
                  <th>{t("cookies.table.purpose")}</th>
                  <th>{t("cookies.table.duration")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_gcl_au</code></td>
                  <td>Google Ads</td>
                  <td>{t("gclau.purpose")}</td>
                  <td>{t("gclau.duration")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Google Consent Mode */}
        <section className="mb-10">
          <h2>{t("cookies.consentMode.title")}</h2>
          <p>
            {t("cookies.consentMode.description")}
          </p>
        </section>

        {/* Managing Preferences */}
        <section className="mb-10">
          <h2>{t("cookies.managing.title")}</h2>
          <p>
            {t("cookies.managing.description")}
          </p>
          <p>
            {t("cookies.managing.browser")}
          </p>
        </section>

        {/* Third Parties */}
        <section className="mb-10">
          <h2>{t("cookies.thirdParties.title")}</h2>
          <p>
            {t("cookies.thirdParties.description")}
          </p>
          <ul>
            <li>
              <strong>Google Analytics (GA4)</strong> —{" "}
              {t("cookies.thirdParties.ga")}
            </li>
            <li>
              <strong>Google Tag Manager</strong> —{" "}
              {t("cookies.thirdParties.gtm")}
            </li>
            <li>
              <strong>Google Ads</strong> —{" "}
              {t("cookies.thirdParties.gads")}
            </li>
          </ul>
        </section>

        {/* Do Not Sell (CCPA) */}
        <section className="mb-10">
          <h2>{t("cookies.ccpa.title")}</h2>
          <p>
            {t("cookies.ccpa.description")}
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2>{t("cookies.contact.title")}</h2>
          <p>
            {t("cookies.contact.description")}
          </p>
        </section>
      </LegalLayout>
    </MarketingLayout>
  );
}
