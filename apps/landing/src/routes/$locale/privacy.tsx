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

export const Route = createFileRoute("/$locale/privacy")({
  loader: createPageLoader(),
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
        ...getAlternateLinks(pathname),
        getCanonicalLink(locale, pathname),
      ],
      scripts: getDefaultStructuredData(locale),
    };
  },
  component: PrivacyPage,
});

function PrivacyPage() {
  const t = useT("legal");

  return (
    <MarketingLayout showCTA={false}>
      <LegalLayout
        active="privacy"
        title={t("privacy.title")}
        lastUpdated={t("privacy.lastUpdatedDate")}
      >
        {/* Table of Contents */}
        <div className="not-prose mb-10 rounded-xl border border-black/[0.07] bg-mist-50 p-5 text-sm">
          <h2 className="mt-0 mb-3 text-[13px] font-medium text-mist-900">
            {t("privacy.toc.title")}
          </h2>
          <ul className="space-y-2 list-none pl-0 m-0">
            {[
              { id: "owner" },
              { id: "types-of-data" },
              { id: "processing" },
              { id: "purposes" },
              { id: "third-party" },
              { id: "cookie-policy" },
              { id: "retention" },
              { id: "security" },
              { id: "gdpr" },
              { id: "ccpa" },
              { id: "us-state-laws" },
              { id: "brazil" },
              { id: "your-rights" },
              { id: "changes" },
              { id: "contact" },
              { id: "definitions" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[13px] text-mist-600 no-underline hover:text-mist-900"
                >
                  {t(`privacy.toc.${item.id}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mb-8 text-mist-600">
          {t("privacy.note")}
        </p>

        {/* ── Owner and Data Controller ─────────────────────────── */}
        <h2 id="owner">
          {t("privacy.sections.owner.title")}
        </h2>
        <p>
          {t("privacy.sections.owner.content")}
        </p>
        <ul>
          <li>
            <strong>{t("privacy.sections.owner.companyLabel")}</strong>{" "}
            {t("privacy.sections.owner.company")}
          </li>
          <li>
            <strong>{t("privacy.sections.owner.emailLabel")}</strong>{" "}
            <a href="mailto:privacy@better-i18n.com">privacy@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("privacy.sections.owner.websiteLabel")}</strong>{" "}
            <a href="https://better-i18n.com" target="_blank" rel="noopener noreferrer">
              better-i18n.com
            </a>
          </li>
        </ul>

        {/* ── Types of Data Collected ──────────────────────────── */}
        <h2 id="types-of-data">
          {t("privacy.sections.typesOfData.title")}
        </h2>
        <p>
          {t("privacy.sections.typesOfData.intro")}
        </p>

        <h3>{t("privacy.sections.typesOfData.provided.title")}</h3>
        <ul>
          <li>
            <strong>{t("privacy.sections.typesOfData.provided.accountLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.provided.account")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.provided.paymentLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.provided.payment")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.provided.communicationsLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.provided.communications")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.provided.contentLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.provided.content")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.provided.signupLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.provided.signup")}
          </li>
        </ul>

        <h3>{t("privacy.sections.typesOfData.automatic.title")}</h3>
        <ul>
          <li>
            <strong>{t("privacy.sections.typesOfData.automatic.usageLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.automatic.usage")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.automatic.deviceLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.automatic.device")}
          </li>
          <li>
            <strong>{t("privacy.sections.typesOfData.automatic.cookiesLabel")}</strong>{" "}
            {t("privacy.sections.typesOfData.automatic.cookies")}
          </li>
        </ul>

        <p>
          {t("privacy.sections.typesOfData.mandatory")}
        </p>

        {/* ── Mode and Place of Processing ─────────────────────── */}
        <h2 id="processing">
          {t("privacy.sections.processing.title")}
        </h2>

        <h3>{t("privacy.sections.processing.methods.title")}</h3>
        <p>
          {t("privacy.sections.processing.methods.content")}
        </p>

        <h3>{t("privacy.sections.processing.place.title")}</h3>
        <p>
          {t("privacy.sections.processing.place.content")}
        </p>

        <h3>{t("privacy.sections.processing.retention.title")}</h3>
        <p>
          {t("privacy.sections.processing.retention.content")}
        </p>

        {/* ── Purposes of Processing ───────────────────────────── */}
        <h2 id="purposes">
          {t("privacy.sections.purposes.title")}
        </h2>
        <p>
          {t("privacy.sections.purposes.intro")}
        </p>
        <ul>
          <li>
            <strong>{t("privacy.sections.purposes.service.label")}</strong>{" "}
            {t("privacy.sections.purposes.service.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.communication.label")}</strong>{" "}
            {t("privacy.sections.purposes.communication.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.billing.label")}</strong>{" "}
            {t("privacy.sections.purposes.billing.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.analytics.label")}</strong>{" "}
            {t("privacy.sections.purposes.analytics.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.marketing.label")}</strong>{" "}
            {t("privacy.sections.purposes.marketing.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.security.label")}</strong>{" "}
            {t("privacy.sections.purposes.security.description")}
          </li>
          <li>
            <strong>{t("privacy.sections.purposes.legal.label")}</strong>{" "}
            {t("privacy.sections.purposes.legal.description")}
          </li>
        </ul>

        {/* ── Third-Party Services ─────────────────────────────── */}
        <h2 id="third-party">
          {t("privacy.sections.thirdParty.title")}
        </h2>
        <p>
          {t("privacy.sections.thirdParty.intro")}
        </p>

        <h3>{t("privacy.sections.thirdParty.infrastructure.title")}</h3>
        <ul>
          <li>
            <strong>Cloudflare, Inc.</strong> — {t("privacy.sections.thirdParty.infrastructure.cloudflare")}{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
          <li>
            <strong>PlanetScale, Inc.</strong> — {t("privacy.sections.thirdParty.infrastructure.planetscale")}{" "}
            <a href="https://planetscale.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
        </ul>

        <h3>{t("privacy.sections.thirdParty.analytics.title")}</h3>
        <ul>
          <li>
            <strong>Google Analytics 4 (Google LLC)</strong> — {t("privacy.sections.thirdParty.analytics.ga4")}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
        </ul>

        <h3>{t("privacy.sections.thirdParty.marketing.title")}</h3>
        <ul>
          <li>
            <strong>Google Ads / Google Conversion Linker (Google LLC)</strong> — {t("privacy.sections.thirdParty.marketing.googleAds")}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
          <li>
            <strong>Google Tag Manager (Google LLC)</strong> — {t("privacy.sections.thirdParty.marketing.gtm")}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
        </ul>

        <h3>{t("privacy.sections.thirdParty.payments.title")}</h3>
        <ul>
          <li>
            <strong>Stripe, Inc.</strong> — {t("privacy.sections.thirdParty.payments.stripe")}{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("privacy.sections.thirdParty.privacyPolicyLink")}
            </a>
          </li>
        </ul>

        <h3>{t("privacy.sections.thirdParty.ai.title")}</h3>
        <ul>
          <li>
            <strong>OpenAI / Anthropic / Google</strong> — {t("privacy.sections.thirdParty.ai.content")}
          </li>
        </ul>

        {/* ── Cookie Policy ────────────────────────────────────── */}
        <h2 id="cookie-policy">
          {t("privacy.sections.cookiePolicy.title")}
        </h2>
        <p>
          {t("privacy.sections.cookiePolicy.content")}
        </p>
        <p>
          {t("privacy.sections.cookiePolicy.link")}
        </p>

        {/* ── Data Retention ───────────────────────────────────── */}
        <h2 id="retention">
          {t("privacy.sections.retention.title")}
        </h2>
        <p>
          {t("privacy.sections.retention.content")}
        </p>
        <p>
          {t("privacy.sections.retention.extended")}
        </p>
        <ul>
          <li>
            {t("privacy.sections.retention.account")}
          </li>
          <li>
            {t("privacy.sections.retention.billing")}
          </li>
          <li>
            {t("privacy.sections.retention.logs")}
          </li>
          <li>
            {t("privacy.sections.retention.analytics")}
          </li>
        </ul>

        {/* ── Security ─────────────────────────────────────────── */}
        <h2 id="security">
          {t("privacy.sections.security.title")}
        </h2>
        <p>
          {t("privacy.sections.security.content")}
        </p>

        {/* ── GDPR (EU Users) ──────────────────────────────────── */}
        <h2 id="gdpr">
          {t("privacy.sections.gdpr.title")}
        </h2>

        <h3>{t("privacy.sections.gdpr.legalBasis.title")}</h3>
        <p>
          {t("privacy.sections.gdpr.legalBasis.content")}
        </p>
        <ul>
          <li>{t("privacy.sections.gdpr.legalBasis.consent")}</li>
          <li>{t("privacy.sections.gdpr.legalBasis.contract")}</li>
          <li>{t("privacy.sections.gdpr.legalBasis.legal")}</li>
          <li>{t("privacy.sections.gdpr.legalBasis.publicInterest")}</li>
          <li>{t("privacy.sections.gdpr.legalBasis.legitimate")}</li>
        </ul>

        <h3>{t("privacy.sections.gdpr.rights.title")}</h3>
        <p>
          {t("privacy.sections.gdpr.rights.intro")}
        </p>
        <ul>
          <li><strong>{t("privacy.sections.gdpr.rights.withdraw.label")}</strong> {t("privacy.sections.gdpr.rights.withdraw.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.object.label")}</strong> {t("privacy.sections.gdpr.rights.object.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.access.label")}</strong> {t("privacy.sections.gdpr.rights.access.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.rectify.label")}</strong> {t("privacy.sections.gdpr.rights.rectify.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.restrict.label")}</strong> {t("privacy.sections.gdpr.rights.restrict.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.erasure.label")}</strong> {t("privacy.sections.gdpr.rights.erasure.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.portability.label")}</strong> {t("privacy.sections.gdpr.rights.portability.content")}</li>
          <li><strong>{t("privacy.sections.gdpr.rights.complaint.label")}</strong> {t("privacy.sections.gdpr.rights.complaint.content")}</li>
        </ul>

        <h3>{t("privacy.sections.gdpr.objectMarketing.title")}</h3>
        <p>
          {t("privacy.sections.gdpr.objectMarketing.content")}
        </p>

        <h3>{t("privacy.sections.gdpr.exerciseRights.title")}</h3>
        <p>
          {t("privacy.sections.gdpr.exerciseRights.content")}
        </p>

        {/* ── CCPA (California Users) ──────────────────────────── */}
        <h2 id="ccpa">
          {t("privacy.sections.ccpa.title")}
        </h2>
        <p>
          {t("privacy.sections.ccpa.intro")}
        </p>

        <h3>{t("privacy.sections.ccpa.doNotSell.title")}</h3>
        <p>
          {t("privacy.sections.ccpa.doNotSell.content")}
        </p>

        <h3>{t("privacy.sections.ccpa.rights.title")}</h3>
        <ul>
          <li><strong>{t("privacy.sections.ccpa.rights.know.label")}</strong> {t("privacy.sections.ccpa.rights.know.content")}</li>
          <li><strong>{t("privacy.sections.ccpa.rights.delete.label")}</strong> {t("privacy.sections.ccpa.rights.delete.content")}</li>
          <li><strong>{t("privacy.sections.ccpa.rights.correct.label")}</strong> {t("privacy.sections.ccpa.rights.correct.content")}</li>
          <li><strong>{t("privacy.sections.ccpa.rights.optOut.label")}</strong> {t("privacy.sections.ccpa.rights.optOut.content")}</li>
          <li><strong>{t("privacy.sections.ccpa.rights.nonDiscrimination.label")}</strong> {t("privacy.sections.ccpa.rights.nonDiscrimination.content")}</li>
        </ul>

        {/* ── US State Privacy Laws ────────────────────────────── */}
        <h2 id="us-state-laws">
          {t("privacy.sections.usStateLaws.title")}
        </h2>
        <p>
          {t("privacy.sections.usStateLaws.content")}
        </p>

        {/* ── LGPD (Brazilian Users) ───────────────────────────── */}
        <h2 id="brazil">
          {t("privacy.sections.lgpd.title")}
        </h2>
        <p>
          {t("privacy.sections.lgpd.content")}
        </p>

        {/* ── Your Rights (General) ────────────────────────────── */}
        <h2 id="your-rights">
          {t("privacy.sections.yourRights.title")}
        </h2>
        <p>
          {t("privacy.sections.yourRights.content")}
        </p>
        <ul>
          <li>
            <strong>{t("privacy.sections.yourRights.access.label")}</strong>{" "}
            {t("privacy.sections.yourRights.access.content")}
          </li>
          <li>
            <strong>{t("privacy.sections.yourRights.deletion.label")}</strong>{" "}
            {t("privacy.sections.yourRights.deletion.content")}
          </li>
          <li>
            <strong>{t("privacy.sections.yourRights.optOut.label")}</strong>{" "}
            {t("privacy.sections.yourRights.optOut.content")}
          </li>
        </ul>

        {/* ── Changes ──────────────────────────────────────────── */}
        <h2 id="changes">
          {t("privacy.sections.changes.title")}
        </h2>
        <p>
          {t("privacy.sections.changes.content")}
        </p>

        {/* ── Contact ──────────────────────────────────────────── */}
        <h2 id="contact">
          {t("privacy.sections.contact.title")}
        </h2>
        <p>
          {t("privacy.sections.contact.content")}
        </p>
        <ul>
          <li>
            <strong>{t("privacy.sections.contact.emailLabel")}</strong>{" "}
            <a href="mailto:privacy@better-i18n.com">privacy@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("privacy.sections.contact.generalLabel")}</strong>{" "}
            <a href="mailto:hello@better-i18n.com">hello@better-i18n.com</a>
          </li>
        </ul>

        {/* ── Definitions ──────────────────────────────────────── */}
        <h2 id="definitions">
          {t("privacy.sections.definitions.title")}
        </h2>
        <dl>
          <dt><strong>{t("privacy.sections.definitions.personalData.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.personalData.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.usageData.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.usageData.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.user.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.user.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.dataSubject.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.dataSubject.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.dataProcessor.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.dataProcessor.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.dataController.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.dataController.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.application.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.application.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.service.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.service.definition")}</dd>

          <dt><strong>{t("privacy.sections.definitions.eu.term")}</strong></dt>
          <dd>{t("privacy.sections.definitions.eu.definition")}</dd>
        </dl>
      </LegalLayout>
    </MarketingLayout>
  );
}
