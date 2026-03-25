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
  const t = useTranslations("cookies");

  return (
    <>
      <Header className="bg-[#f9f9f9]" />
      <LegalLayout
        active="cookies"
        title={t("title", { defaultValue: "Cookie Policy" })}
        lastUpdated={t("lastUpdatedDate", { defaultValue: "March 25, 2026" })}
      >
        {/* Introduction */}
        <section className="mb-10">
          <p>
            {t("intro", {
              defaultValue:
                "This Cookie Policy explains how Better i18n, Inc. (\"we\", \"us\", \"our\") uses cookies and similar technologies on better-i18n.com. It describes what cookies are, how we use them, and your choices regarding their use.",
            })}
          </p>
        </section>

        {/* What Are Cookies */}
        <section className="mb-10">
          <h2>{t("whatAreCookies.title", { defaultValue: "What Are Cookies?" })}</h2>
          <p>
            {t("whatAreCookies.description", {
              defaultValue:
                "Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and understand how you interact with it. We also use similar technologies such as local storage and pixels.",
            })}
          </p>
        </section>

        {/* Cookie Categories */}
        <section className="mb-10">
          <h2>{t("categories.title", { defaultValue: "Types of Cookies We Use" })}</h2>

          {/* Essential */}
          <h3>{t("categories.essential.title", { defaultValue: "Essential Cookies" })}</h3>
          <p>
            {t("categories.essential.description", {
              defaultValue:
                "These cookies are strictly necessary for the website to function. They enable core features like authentication, security, and language preferences. You cannot opt out of these cookies.",
            })}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("table.name", { defaultValue: "Cookie" })}</th>
                  <th>{t("table.provider", { defaultValue: "Provider" })}</th>
                  <th>{t("table.purpose", { defaultValue: "Purpose" })}</th>
                  <th>{t("table.duration", { defaultValue: "Duration" })}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>bi18n_cookie_consent</code></td>
                  <td>Better i18n</td>
                  <td>{t("cookies.consent.purpose", { defaultValue: "Stores your cookie consent preferences" })}</td>
                  <td>{t("cookies.consent.duration", { defaultValue: "Persistent" })}</td>
                </tr>
                <tr>
                  <td><code>bi18n_locale</code></td>
                  <td>Better i18n</td>
                  <td>{t("cookies.locale.purpose", { defaultValue: "Remembers your language preference" })}</td>
                  <td>{t("cookies.locale.duration", { defaultValue: "Persistent" })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analytics */}
          <h3>{t("categories.analytics.title", { defaultValue: "Analytics Cookies" })}</h3>
          <p>
            {t("categories.analytics.description", {
              defaultValue:
                "These cookies help us understand how visitors interact with our website by collecting anonymous usage data. This information helps us improve our website and services.",
            })}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("table.name", { defaultValue: "Cookie" })}</th>
                  <th>{t("table.provider", { defaultValue: "Provider" })}</th>
                  <th>{t("table.purpose", { defaultValue: "Purpose" })}</th>
                  <th>{t("table.duration", { defaultValue: "Duration" })}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Google Analytics</td>
                  <td>{t("cookies.ga.purpose", { defaultValue: "Distinguishes unique visitors" })}</td>
                  <td>{t("cookies.ga.duration", { defaultValue: "2 years" })}</td>
                </tr>
                <tr>
                  <td><code>_ga_*</code></td>
                  <td>Google Analytics</td>
                  <td>{t("cookies.gaSession.purpose", { defaultValue: "Maintains session state" })}</td>
                  <td>{t("cookies.gaSession.duration", { defaultValue: "2 years" })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Marketing */}
          <h3>{t("categories.marketing.title", { defaultValue: "Marketing Cookies" })}</h3>
          <p>
            {t("categories.marketing.description", {
              defaultValue:
                "These cookies are used to measure the effectiveness of our advertising campaigns and to deliver relevant advertisements. They may be set by us or by third-party advertising partners.",
            })}
          </p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>{t("table.name", { defaultValue: "Cookie" })}</th>
                  <th>{t("table.provider", { defaultValue: "Provider" })}</th>
                  <th>{t("table.purpose", { defaultValue: "Purpose" })}</th>
                  <th>{t("table.duration", { defaultValue: "Duration" })}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_gcl_au</code></td>
                  <td>Google Ads</td>
                  <td>{t("cookies.gclau.purpose", { defaultValue: "Stores conversion data for ad clicks" })}</td>
                  <td>{t("cookies.gclau.duration", { defaultValue: "90 days" })}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Google Consent Mode */}
        <section className="mb-10">
          <h2>{t("consentMode.title", { defaultValue: "Google Consent Mode" })}</h2>
          <p>
            {t("consentMode.description", {
              defaultValue:
                "We implement Google Consent Mode v2, which adjusts how Google tags behave based on your consent choices. When you decline analytics or marketing cookies, Google tags will not store cookies or collect identifiable data. Google may still collect aggregated, non-identifying signals to support basic measurement.",
            })}
          </p>
        </section>

        {/* Managing Preferences */}
        <section className="mb-10">
          <h2>{t("managing.title", { defaultValue: "Managing Your Cookie Preferences" })}</h2>
          <p>
            {t("managing.description", {
              defaultValue:
                "When you first visit our website, a cookie banner will appear asking for your consent. You can accept all cookies, reject non-essential cookies, or customize your preferences. You can change your preferences at any time by clicking \"Cookie Preferences\" in the footer of any page.",
            })}
          </p>
          <p>
            {t("managing.browser", {
              defaultValue:
                "You can also control cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that blocking essential cookies may affect website functionality.",
            })}
          </p>
        </section>

        {/* Third Parties */}
        <section className="mb-10">
          <h2>{t("thirdParties.title", { defaultValue: "Third-Party Services" })}</h2>
          <p>
            {t("thirdParties.description", {
              defaultValue: "The following third-party services may set cookies on our website when enabled:",
            })}
          </p>
          <ul>
            <li>
              <strong>Google Analytics (GA4)</strong> —{" "}
              {t("thirdParties.ga", {
                defaultValue: "Web analytics service. Privacy Policy: https://policies.google.com/privacy",
              })}
            </li>
            <li>
              <strong>Google Tag Manager</strong> —{" "}
              {t("thirdParties.gtm", {
                defaultValue: "Tag management service. Privacy Policy: https://policies.google.com/privacy",
              })}
            </li>
            <li>
              <strong>Google Ads</strong> —{" "}
              {t("thirdParties.gads", {
                defaultValue: "Advertising platform. Privacy Policy: https://policies.google.com/privacy",
              })}
            </li>
          </ul>
        </section>

        {/* Do Not Sell (CCPA) */}
        <section className="mb-10">
          <h2>{t("ccpa.title", { defaultValue: "Do Not Sell or Share My Personal Information" })}</h2>
          <p>
            {t("ccpa.description", {
              defaultValue:
                "Under the California Consumer Privacy Act (CCPA) and similar state privacy laws, you have the right to opt out of the \"sale\" or \"sharing\" of your personal information. We do not sell personal information. If you are a California resident and wish to exercise your rights, you can reject marketing cookies via the cookie banner or contact us at privacy@better-i18n.com.",
            })}
          </p>
        </section>

        {/* Contact */}
        <section className="mb-10">
          <h2>{t("contact.title", { defaultValue: "Contact Us" })}</h2>
          <p>
            {t("contact.description", {
              defaultValue:
                "If you have questions about our use of cookies, please contact us at privacy@better-i18n.com.",
            })}
          </p>
        </section>
      </LegalLayout>
      <Footer />
    </>
  );
}
