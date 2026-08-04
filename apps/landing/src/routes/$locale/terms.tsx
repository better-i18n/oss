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

export const Route = createFileRoute("/$locale/terms")({
  loader: createPageLoader(),
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
      scripts: getDefaultStructuredData(locale),
    };
  },
  component: TermsPage,
});

function TermsPage() {
  const t = useT("legal");

  return (
    <MarketingLayout showCTA={false}>
      <LegalLayout
        active="terms"
        title={t("terms.title")}
        lastUpdated={t("terms.lastUpdatedDate")}
      >
        {/* Table of Contents */}
        {/* The contents list was a tinted, rounded, bordered box — the one
            tinted surface left in a document that otherwise follows
            rule/white-page-hairline-separation, and a frame around a plain
            list of links. It is now opened by a hairline like every other
            block, with the label at eyebrow size so the list itself is the
            loudest thing in it. Two columns because sixteen anchors in one
            column pushed the document's first sentence below the fold. */}
        <div className="not-prose mb-10 border-t border-black/[0.07] pt-5 text-sm">
          <h2 className="mt-0 mb-3 text-[11px] font-medium text-mist-500">
            {t("terms.toc.title")}
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-x-8 gap-y-1.5 pl-0 sm:grid-cols-2">
            {[
              { id: "introduction" },
              { id: "acceptance" },
              { id: "services" },
              { id: "accounts" },
              { id: "content" },
              { id: "acceptable-use" },
              { id: "payment" },
              { id: "intellectual-property" },
              { id: "third-party" },
              { id: "termination" },
              { id: "disclaimers" },
              { id: "indemnification" },
              { id: "us-specific" },
              { id: "general" },
              { id: "contact" },
              { id: "definitions" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-[13px] text-mist-600 no-underline hover:text-mist-900"
                >
                  {t(`terms.toc.${item.id}`)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Introduction ─────────────────────────────────────── */}
        <h2 id="introduction">
          {t("terms.sections.introduction.title")}
        </h2>
        <p>
          {t("terms.sections.introduction.content")}
        </p>
        <p>
          {t("terms.sections.introduction.provider")}
        </p>
        <p>
          <strong>
            {t("terms.sections.introduction.readCarefully")}
          </strong>
        </p>

        {/* ── Acceptance ───────────────────────────────────────── */}
        <h2 id="acceptance">
          {t("terms.sections.acceptance.title")}
        </h2>
        <p>
          {t("terms.sections.acceptance.content")}
        </p>

        {/* ── Description of Services ──────────────────────────── */}
        <h2 id="services">
          {t("terms.sections.services.title")}
        </h2>
        <p>
          {t("terms.sections.services.description")}
        </p>
        <p>
          {t("terms.sections.services.license")}
        </p>
        <p>
          {t("terms.sections.services.restrictions")}
        </p>

        {/* ── Account Registration ─────────────────────────────── */}
        <h2 id="accounts">
          {t("terms.sections.accounts.title")}
        </h2>
        <p>
          {t("terms.sections.accounts.content")}
        </p>

        {/* ── Your Content ─────────────────────────────────────── */}
        <h2 id="content">
          {t("terms.sections.content.title")}
        </h2>
        <p>
          {t("terms.sections.content.ownership")}
        </p>
        <p>
          {t("terms.sections.content.license")}
        </p>
        <p>
          {t("terms.sections.content.responsibility")}
        </p>

        {/* ── Acceptable Use ───────────────────────────────────── */}
        <h2 id="acceptable-use">
          {t("terms.sections.acceptableUse.title")}
        </h2>
        <p>
          {t("terms.sections.acceptableUse.intro")}
        </p>
        <ul>
          <li>{t("terms.sections.acceptableUse.prohibited.abuse")}</li>
          <li>{t("terms.sections.acceptableUse.prohibited.illegal")}</li>
          <li>{t("terms.sections.acceptableUse.prohibited.interfere")}</li>
          <li>{t("terms.sections.acceptableUse.prohibited.scraping")}</li>
          <li>{t("terms.sections.acceptableUse.prohibited.circumvent")}</li>
          <li>{t("terms.sections.acceptableUse.prohibited.impersonate")}</li>
        </ul>

        {/* ── Payment and Billing ──────────────────────────────── */}
        <h2 id="payment">
          {t("terms.sections.payment.title")}
        </h2>
        <p>
          {t("terms.sections.payment.fees")}
        </p>
        <p>
          {t("terms.sections.payment.billing")}
        </p>
        <p>
          {t("terms.sections.payment.taxes")}
        </p>
        <p>
          {t("terms.sections.payment.freeTier")}
        </p>

        {/* ── Intellectual Property ────────────────────────────── */}
        <h2 id="intellectual-property">
          {t("terms.sections.intellectualProperty.title")}
        </h2>
        <p>
          {t("terms.sections.intellectualProperty.content")}
        </p>
        <p>
          {t("terms.sections.intellectualProperty.oss")}
        </p>

        {/* ── Third-Party Services ─────────────────────────────── */}
        <h2 id="third-party">
          {t("terms.sections.thirdParty.title")}
        </h2>
        <p>
          {t("terms.sections.thirdParty.content")}
        </p>

        {/* ── Termination ──────────────────────────────────────── */}
        <h2 id="termination">
          {t("terms.sections.termination.title")}
        </h2>
        <p>
          {t("terms.sections.termination.byYou")}
        </p>
        <p>
          {t("terms.sections.termination.byUs")}
        </p>
        <p>
          {t("terms.sections.termination.dataExport")}
        </p>
        <p>
          {t("terms.sections.termination.survival")}
        </p>

        {/* ── Disclaimers & Limitation of Liability ────────────── */}
        <h2 id="disclaimers">
          {t("terms.sections.disclaimers.title")}
        </h2>
        <p>
          {t("terms.sections.disclaimers.warranty")}
        </p>
        <p>
          {t("terms.sections.disclaimers.aiTranslation")}
        </p>
        <p>
          {t("terms.sections.disclaimers.limitation")}
        </p>
        <p>
          {t("terms.sections.disclaimers.serviceInterruption")}
        </p>

        {/* ── Indemnification ──────────────────────────────────── */}
        <h2 id="indemnification">
          {t("terms.sections.indemnification.title")}
        </h2>
        <p>
          {t("terms.sections.indemnification.content")}
        </p>

        {/* ── US-Specific Provisions ───────────────────────────── */}
        <h2 id="us-specific">
          {t("terms.sections.usSpecific.title")}
        </h2>

        <h3>{t("terms.sections.usSpecific.governingLaw.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.governingLaw.content")}
        </p>

        <h3>{t("terms.sections.usSpecific.arbitration.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.arbitration.content")}
        </p>

        <h3>{t("terms.sections.usSpecific.classAction.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.classAction.content")}
        </p>

        <h3>{t("terms.sections.usSpecific.dmca.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.dmca.content")}
        </p>

        <h3>{t("terms.sections.usSpecific.exportCompliance.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.exportCompliance.content")}
        </p>

        <h3>{t("terms.sections.usSpecific.governmentUsers.title")}</h3>
        <p>
          {t("terms.sections.usSpecific.governmentUsers.content")}
        </p>

        {/* ── General Provisions ───────────────────────────────── */}
        <h2 id="general">
          {t("terms.sections.general.title")}
        </h2>

        <h3>{t("terms.sections.general.entireAgreement.title")}</h3>
        <p>
          {t("terms.sections.general.entireAgreement.content")}
        </p>

        <h3>{t("terms.sections.general.severability.title")}</h3>
        <p>
          {t("terms.sections.general.severability.content")}
        </p>

        <h3>{t("terms.sections.general.noWaiver.title")}</h3>
        <p>
          {t("terms.sections.general.noWaiver.content")}
        </p>

        <h3>{t("terms.sections.general.assignment.title")}</h3>
        <p>
          {t("terms.sections.general.assignment.content")}
        </p>

        <h3>{t("terms.sections.general.changes.title")}</h3>
        <p>
          {t("terms.sections.general.changes.content")}
        </p>

        {/* ── Contact ──────────────────────────────────────────── */}
        <h2 id="contact">
          {t("terms.sections.contact.title")}
        </h2>
        <p>
          {t("terms.sections.contact.content")}
        </p>
        <ul>
          <li>
            <strong>{t("terms.sections.contact.legalLabel")}</strong>{" "}
            <a href="mailto:legal@better-i18n.com">legal@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("terms.sections.contact.generalLabel")}</strong>{" "}
            <a href="mailto:hello@better-i18n.com">hello@better-i18n.com</a>
          </li>
        </ul>

        {/* ── Definitions ──────────────────────────────────────── */}
        <h2 id="definitions">
          {t("terms.sections.definitions.title")}
        </h2>
        <dl>
          <dt><strong>{t("terms.sections.definitions.service.term")}</strong></dt>
          <dd>{t("terms.sections.definitions.service.definition")}</dd>

          <dt><strong>{t("terms.sections.definitions.user.term")}</strong></dt>
          <dd>{t("terms.sections.definitions.user.definition")}</dd>

          <dt><strong>{t("terms.sections.definitions.owner.term")}</strong></dt>
          <dd>{t("terms.sections.definitions.owner.definition")}</dd>

          <dt><strong>{t("terms.sections.definitions.yourContent.term")}</strong></dt>
          <dd>{t("terms.sections.definitions.yourContent.definition")}</dd>

          <dt><strong>{t("terms.sections.definitions.application.term")}</strong></dt>
          <dd>{t("terms.sections.definitions.application.definition")}</dd>
        </dl>
      </LegalLayout>
    </MarketingLayout>
  );
}
