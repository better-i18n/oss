import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
  const t = useT("privacy");

  return (
    <>
      <Header className="bg-[#f9f9f9]" />
      <LegalLayout
        active="privacy"
        title={t("title", { defaultValue: "Privacy Policy" })}
        lastUpdated={t("lastUpdatedDate", { defaultValue: "March 25, 2026" })}
      >
        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100 text-sm">
          <h3 className="font-semibold text-gray-900 mb-3 mt-0 text-base">
            {t("toc.title", { defaultValue: "Table of Contents" })}
          </h3>
          <ul className="space-y-2 list-none pl-0 m-0">
            {[
              { id: "owner", label: "Owner and Data Controller" },
              { id: "types-of-data", label: "Types of Data Collected" },
              { id: "processing", label: "Mode and Place of Processing" },
              { id: "purposes", label: "Purposes of Processing" },
              { id: "third-party", label: "Third-Party Services" },
              { id: "cookie-policy", label: "Cookie Policy" },
              { id: "retention", label: "Data Retention" },
              { id: "security", label: "Security" },
              { id: "gdpr", label: "Information for EU Users (GDPR)" },
              { id: "ccpa", label: "Information for California Users (CCPA)" },
              { id: "us-state-laws", label: "US State Privacy Laws" },
              { id: "brazil", label: "Information for Brazilian Users (LGPD)" },
              { id: "your-rights", label: "Your Rights" },
              { id: "changes", label: "Changes to This Policy" },
              { id: "contact", label: "Contact Us" },
              { id: "definitions", label: "Definitions and Legal References" },
            ].map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="no-underline text-gray-600 hover:text-gray-900"
                >
                  {t(`toc.${item.id}`, { defaultValue: item.label })}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-gray-600 text-lg mb-8">
          {t("note", {
            defaultValue:
              "This privacy policy describes how Better i18n, Inc. collects, uses, and protects your personal data when you use our website and services.",
          })}
        </p>

        {/* ── Owner and Data Controller ─────────────────────────── */}
        <h2 id="owner">
          {t("sections.owner.title", { defaultValue: "Owner and Data Controller" })}
        </h2>
        <p>
          {t("sections.owner.content", {
            defaultValue:
              "Better i18n, Inc. is the data controller responsible for processing personal data as described in this privacy policy.",
          })}
        </p>
        <ul>
          <li>
            <strong>{t("sections.owner.companyLabel", { defaultValue: "Company:" })}</strong>{" "}
            {t("sections.owner.company", { defaultValue: "Better i18n, Inc." })}
          </li>
          <li>
            <strong>{t("sections.owner.emailLabel", { defaultValue: "Contact email:" })}</strong>{" "}
            <a href="mailto:privacy@better-i18n.com">privacy@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("sections.owner.websiteLabel", { defaultValue: "Website:" })}</strong>{" "}
            <a href="https://better-i18n.com" target="_blank" rel="noopener noreferrer">
              better-i18n.com
            </a>
          </li>
        </ul>

        {/* ── Types of Data Collected ──────────────────────────── */}
        <h2 id="types-of-data">
          {t("sections.typesOfData.title", { defaultValue: "Types of Data Collected" })}
        </h2>
        <p>
          {t("sections.typesOfData.intro", {
            defaultValue:
              "We collect the following categories of personal data. Complete details on each type are provided in the dedicated sections below or through specific explanation texts displayed prior to data collection.",
          })}
        </p>

        <h3>{t("sections.typesOfData.provided.title", { defaultValue: "Data You Provide Directly" })}</h3>
        <ul>
          <li>
            <strong>{t("sections.typesOfData.provided.accountLabel", { defaultValue: "Account information:" })}</strong>{" "}
            {t("sections.typesOfData.provided.account", {
              defaultValue: "Name, email address, and authentication credentials when you create an account.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.provided.paymentLabel", { defaultValue: "Payment information:" })}</strong>{" "}
            {t("sections.typesOfData.provided.payment", {
              defaultValue: "Billing details processed by our payment provider Stripe. We do not store full credit card numbers.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.provided.communicationsLabel", { defaultValue: "Communications:" })}</strong>{" "}
            {t("sections.typesOfData.provided.communications", {
              defaultValue: "Messages, feedback, and support requests you send to us.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.provided.contentLabel", { defaultValue: "Content data:" })}</strong>{" "}
            {t("sections.typesOfData.provided.content", {
              defaultValue: "Translation keys, source text, and localization content you upload to or create within the platform.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.provided.signupLabel", { defaultValue: "Signup forms:" })}</strong>{" "}
            {t("sections.typesOfData.provided.signup", {
              defaultValue: "Information submitted through registration or contact forms on our website, including name, email, and company name.",
            })}
          </li>
        </ul>

        <h3>{t("sections.typesOfData.automatic.title", { defaultValue: "Data Collected Automatically" })}</h3>
        <ul>
          <li>
            <strong>{t("sections.typesOfData.automatic.usageLabel", { defaultValue: "Usage data:" })}</strong>{" "}
            {t("sections.typesOfData.automatic.usage", {
              defaultValue: "Pages visited, features used, actions performed, and interaction patterns within the application.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.automatic.deviceLabel", { defaultValue: "Device data:" })}</strong>{" "}
            {t("sections.typesOfData.automatic.device", {
              defaultValue: "IP address, browser type and version, operating system, device type, screen resolution, and language preferences.",
            })}
          </li>
          <li>
            <strong>{t("sections.typesOfData.automatic.cookiesLabel", { defaultValue: "Cookies and trackers:" })}</strong>{" "}
            {t("sections.typesOfData.automatic.cookies", {
              defaultValue: "Essential cookies for authentication and preferences, and optional analytics and marketing cookies (with your consent). See our Cookie Policy for details.",
            })}
          </li>
        </ul>

        <p>
          {t("sections.typesOfData.mandatory", {
            defaultValue:
              "Unless specified otherwise, all data requested by our application is mandatory. Failure to provide this data may make it impossible to provide our services. Where we indicate that some data is optional, you are free not to provide it without consequences to the availability of the service.",
          })}
        </p>

        {/* ── Mode and Place of Processing ─────────────────────── */}
        <h2 id="processing">
          {t("sections.processing.title", { defaultValue: "Mode and Place of Processing the Data" })}
        </h2>

        <h3>{t("sections.processing.methods.title", { defaultValue: "Methods of Processing" })}</h3>
        <p>
          {t("sections.processing.methods.content", {
            defaultValue:
              "We take appropriate security measures to prevent unauthorized access, disclosure, modification, or destruction of your data. Data processing is carried out using computers and IT tools, following organizational procedures strictly related to the purposes indicated. In addition to the owner, data may be accessible to certain persons involved with the operation of our services (administration, engineering, support) or external parties (hosting providers, payment processors, analytics services) appointed as data processors.",
          })}
        </p>

        <h3>{t("sections.processing.place.title", { defaultValue: "Place" })}</h3>
        <p>
          {t("sections.processing.place.content", {
            defaultValue:
              "Data is processed at the owner's operating offices and on Cloudflare's global edge network. Our primary infrastructure runs on Cloudflare Workers (edge computing) and PlanetScale (database hosting in the United States). Depending on your location, data transfers may involve transferring your data to a country other than your own.",
          })}
        </p>

        <h3>{t("sections.processing.retention.title", { defaultValue: "Retention Time" })}</h3>
        <p>
          {t("sections.processing.retention.content", {
            defaultValue:
              "Unless specified otherwise in this document, personal data shall be processed and stored for as long as required by the purpose for which it was collected, and may be retained for longer due to applicable legal obligations or based on your consent.",
          })}
        </p>

        {/* ── Purposes of Processing ───────────────────────────── */}
        <h2 id="purposes">
          {t("sections.purposes.title", { defaultValue: "Purposes of Processing" })}
        </h2>
        <p>
          {t("sections.purposes.intro", {
            defaultValue: "Your data is collected for the following purposes:",
          })}
        </p>
        <ul>
          <li>
            <strong>{t("sections.purposes.service.label", { defaultValue: "Providing and maintaining the service:" })}</strong>{" "}
            {t("sections.purposes.service.description", {
              defaultValue: "Operating the platform, managing your account, processing translations, delivering content via CDN.",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.communication.label", { defaultValue: "Communication:" })}</strong>{" "}
            {t("sections.purposes.communication.description", {
              defaultValue: "Sending service notifications, responding to your requests, providing customer support.",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.billing.label", { defaultValue: "Billing and payments:" })}</strong>{" "}
            {t("sections.purposes.billing.description", {
              defaultValue: "Processing subscription payments, managing invoices, and handling billing inquiries through Stripe.",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.analytics.label", { defaultValue: "Analytics and improvement:" })}</strong>{" "}
            {t("sections.purposes.analytics.description", {
              defaultValue: "Understanding how you use our services to improve functionality, user experience, and performance (with your consent for non-essential tracking).",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.marketing.label", { defaultValue: "Marketing activities:" })}</strong>{" "}
            {t("sections.purposes.marketing.description", {
              defaultValue: "With your consent, measuring ad effectiveness and delivering relevant information about our services through Google Ads.",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.security.label", { defaultValue: "Security and fraud prevention:" })}</strong>{" "}
            {t("sections.purposes.security.description", {
              defaultValue: "Detecting and preventing fraud, abuse, and security threats to protect you and our infrastructure.",
            })}
          </li>
          <li>
            <strong>{t("sections.purposes.legal.label", { defaultValue: "Legal obligations:" })}</strong>{" "}
            {t("sections.purposes.legal.description", {
              defaultValue: "Complying with applicable laws, regulations, and responding to lawful requests from public authorities.",
            })}
          </li>
        </ul>

        {/* ── Third-Party Services ─────────────────────────────── */}
        <h2 id="third-party">
          {t("sections.thirdParty.title", { defaultValue: "Third-Party Services" })}
        </h2>
        <p>
          {t("sections.thirdParty.intro", {
            defaultValue:
              "We share data with the following third-party service providers, each acting as a data processor on our behalf. These services are essential for delivering our platform or are used with your consent.",
          })}
        </p>

        <h3>{t("sections.thirdParty.infrastructure.title", { defaultValue: "Infrastructure & Hosting" })}</h3>
        <ul>
          <li>
            <strong>Cloudflare, Inc.</strong> — {t("sections.thirdParty.infrastructure.cloudflare", {
              defaultValue: "Edge computing, CDN, DNS, and DDoS protection. Data processed globally on Cloudflare's edge network.",
            })}{" "}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
          <li>
            <strong>PlanetScale, Inc.</strong> — {t("sections.thirdParty.infrastructure.planetscale", {
              defaultValue: "Database hosting (United States).",
            })}{" "}
            <a href="https://planetscale.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
        </ul>

        <h3>{t("sections.thirdParty.analytics.title", { defaultValue: "Analytics (with consent)" })}</h3>
        <ul>
          <li>
            <strong>Google Analytics 4 (Google LLC)</strong> — {t("sections.thirdParty.analytics.ga4", {
              defaultValue: "Web analytics service that tracks and reports website traffic. Enabled only after your consent via our cookie banner.",
            })}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
        </ul>

        <h3>{t("sections.thirdParty.marketing.title", { defaultValue: "Marketing (with consent)" })}</h3>
        <ul>
          <li>
            <strong>Google Ads / Google Conversion Linker (Google LLC)</strong> — {t("sections.thirdParty.marketing.googleAds", {
              defaultValue: "Advertising and conversion tracking. Google Conversion Linker reads ad click information stored in first-party cookies. Enabled only after your consent.",
            })}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
          <li>
            <strong>Google Tag Manager (Google LLC)</strong> — {t("sections.thirdParty.marketing.gtm", {
              defaultValue: "Tag management service used to deploy analytics and marketing tags. Loaded only after your consent.",
            })}{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
        </ul>

        <h3>{t("sections.thirdParty.payments.title", { defaultValue: "Payments" })}</h3>
        <ul>
          <li>
            <strong>Stripe, Inc.</strong> — {t("sections.thirdParty.payments.stripe", {
              defaultValue: "Payment processing. We never store full credit card numbers. Stripe handles PCI-DSS compliance.",
            })}{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
              {t("sections.thirdParty.privacyPolicyLink", { defaultValue: "Privacy Policy" })}
            </a>
          </li>
        </ul>

        <h3>{t("sections.thirdParty.ai.title", { defaultValue: "AI Translation Services" })}</h3>
        <ul>
          <li>
            <strong>OpenAI / Anthropic / Google</strong> — {t("sections.thirdParty.ai.content", {
              defaultValue: "AI-powered translation is processed through major AI providers. Your source content is sent for translation when you use our AI translation feature. These providers do not use your content for training.",
            })}
          </li>
        </ul>

        {/* ── Cookie Policy ────────────────────────────────────── */}
        <h2 id="cookie-policy">
          {t("sections.cookiePolicy.title", { defaultValue: "Cookie Policy" })}
        </h2>
        <p>
          {t("sections.cookiePolicy.content", {
            defaultValue:
              "This application uses cookies and similar tracking technologies. We implement Google Consent Mode v2, which ensures analytics and marketing cookies are only activated after you provide consent. You can manage your preferences at any time through the cookie banner or the \"Cookie Preferences\" link in our footer.",
          })}
        </p>
        <p>
          {t("sections.cookiePolicy.link", {
            defaultValue: "For a complete list of cookies used, their purposes, and durations, please see our dedicated Cookie Policy page.",
          })}
        </p>

        {/* ── Data Retention ───────────────────────────────────── */}
        <h2 id="retention">
          {t("sections.retention.title", { defaultValue: "Data Retention" })}
        </h2>
        <p>
          {t("sections.retention.content", {
            defaultValue:
              "Personal data collected for purposes related to the performance of a contract between us and you shall be retained until such contract has been fully performed. Personal data collected for our legitimate interests shall be retained as long as needed to fulfill such purposes.",
          })}
        </p>
        <p>
          {t("sections.retention.extended", {
            defaultValue:
              "We may retain personal data for a longer period whenever you have given consent to such processing, or whenever required by law or upon order of an authority. Once the retention period expires, personal data shall be deleted. Therefore, the right of access, the right to erasure, the right to rectification, and the right to data portability cannot be enforced after expiration of the retention period.",
          })}
        </p>
        <ul>
          <li>
            {t("sections.retention.account", {
              defaultValue: "Account data: retained for the duration of your account, plus 30 days after deletion request.",
            })}
          </li>
          <li>
            {t("sections.retention.billing", {
              defaultValue: "Billing records: retained for 7 years as required by tax and accounting regulations.",
            })}
          </li>
          <li>
            {t("sections.retention.logs", {
              defaultValue: "Server logs: retained for up to 90 days for security and debugging purposes.",
            })}
          </li>
          <li>
            {t("sections.retention.analytics", {
              defaultValue: "Analytics data: retained for up to 14 months (Google Analytics default retention period).",
            })}
          </li>
        </ul>

        {/* ── Security ─────────────────────────────────────────── */}
        <h2 id="security">
          {t("sections.security.title", { defaultValue: "Security" })}
        </h2>
        <p>
          {t("sections.security.content", {
            defaultValue:
              "We implement industry-standard security measures to protect your data, including encryption in transit (TLS 1.3), encryption at rest, access controls, regular security audits, and infrastructure monitoring. Our platform runs on Cloudflare Workers with built-in DDoS protection and edge security.",
          })}
        </p>

        {/* ── GDPR (EU Users) ──────────────────────────────────── */}
        <h2 id="gdpr">
          {t("sections.gdpr.title", { defaultValue: "Further Information for Users in the European Union" })}
        </h2>

        <h3>{t("sections.gdpr.legalBasis.title", { defaultValue: "Legal Basis of Processing" })}</h3>
        <p>
          {t("sections.gdpr.legalBasis.content", {
            defaultValue: "We may process personal data relating to you if one of the following applies:",
          })}
        </p>
        <ul>
          <li>{t("sections.gdpr.legalBasis.consent", { defaultValue: "You have given consent for one or more specific purposes." })}</li>
          <li>{t("sections.gdpr.legalBasis.contract", { defaultValue: "Processing is necessary for the performance of an agreement with you and/or for any pre-contractual obligations." })}</li>
          <li>{t("sections.gdpr.legalBasis.legal", { defaultValue: "Processing is necessary for compliance with a legal obligation to which we are subject." })}</li>
          <li>{t("sections.gdpr.legalBasis.publicInterest", { defaultValue: "Processing is related to a task carried out in the public interest." })}</li>
          <li>{t("sections.gdpr.legalBasis.legitimate", { defaultValue: "Processing is necessary for the purposes of the legitimate interests pursued by us or by a third party." })}</li>
        </ul>

        <h3>{t("sections.gdpr.rights.title", { defaultValue: "Your Rights Under the GDPR" })}</h3>
        <p>
          {t("sections.gdpr.rights.intro", {
            defaultValue: "You may exercise the following rights regarding your data processed by us, to the extent permitted by law:",
          })}
        </p>
        <ul>
          <li><strong>{t("sections.gdpr.rights.withdraw.label", { defaultValue: "Withdraw consent:" })}</strong> {t("sections.gdpr.rights.withdraw.content", { defaultValue: "You have the right to withdraw consent at any time where you have previously given consent to the processing of your personal data." })}</li>
          <li><strong>{t("sections.gdpr.rights.object.label", { defaultValue: "Object to processing:" })}</strong> {t("sections.gdpr.rights.object.content", { defaultValue: "You have the right to object to the processing of your data if it is carried out on a legal basis other than consent." })}</li>
          <li><strong>{t("sections.gdpr.rights.access.label", { defaultValue: "Access your data:" })}</strong> {t("sections.gdpr.rights.access.content", { defaultValue: "You have the right to learn if data is being processed, obtain disclosure regarding certain aspects of the processing, and obtain a copy of the data." })}</li>
          <li><strong>{t("sections.gdpr.rights.rectify.label", { defaultValue: "Verify and seek rectification:" })}</strong> {t("sections.gdpr.rights.rectify.content", { defaultValue: "You have the right to verify the accuracy of your data and ask for it to be updated or corrected." })}</li>
          <li><strong>{t("sections.gdpr.rights.restrict.label", { defaultValue: "Restrict processing:" })}</strong> {t("sections.gdpr.rights.restrict.content", { defaultValue: "You have the right to restrict the processing of your data. In this case, we will not process your data for any purpose other than storing it." })}</li>
          <li><strong>{t("sections.gdpr.rights.erasure.label", { defaultValue: "Have your data deleted:" })}</strong> {t("sections.gdpr.rights.erasure.content", { defaultValue: "You have the right to obtain the erasure of your data from us." })}</li>
          <li><strong>{t("sections.gdpr.rights.portability.label", { defaultValue: "Data portability:" })}</strong> {t("sections.gdpr.rights.portability.content", { defaultValue: "You have the right to receive your data in a structured, commonly used, and machine-readable format and, if technically feasible, to have it transmitted to another controller." })}</li>
          <li><strong>{t("sections.gdpr.rights.complaint.label", { defaultValue: "Lodge a complaint:" })}</strong> {t("sections.gdpr.rights.complaint.content", { defaultValue: "You have the right to bring a claim before your competent data protection authority." })}</li>
        </ul>

        <h3>{t("sections.gdpr.objectMarketing.title", { defaultValue: "Right to Object to Processing for Direct Marketing" })}</h3>
        <p>
          {t("sections.gdpr.objectMarketing.content", {
            defaultValue:
              "Where personal data is processed for direct marketing purposes, you can object to that processing at any time, free of charge and without providing any justification. Where you object to processing for direct marketing purposes, the personal data will no longer be processed for such purposes.",
          })}
        </p>

        <h3>{t("sections.gdpr.exerciseRights.title", { defaultValue: "How to Exercise These Rights" })}</h3>
        <p>
          {t("sections.gdpr.exerciseRights.content", {
            defaultValue:
              "Any requests to exercise your rights can be directed to us through the contact details provided in this document. Such requests are free of charge and will be answered as early as possible, always within one month. Any rectification or erasure of personal data or restriction of processing will be communicated to each recipient, if any, to whom the personal data has been disclosed.",
          })}
        </p>

        {/* ── CCPA (California Users) ──────────────────────────── */}
        <h2 id="ccpa">
          {t("sections.ccpa.title", { defaultValue: "Information for California Users (CCPA/CPRA)" })}
        </h2>
        <p>
          {t("sections.ccpa.intro", {
            defaultValue:
              "This section applies to California residents and supplements the information in this privacy policy, as required by the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA).",
          })}
        </p>

        <h3>{t("sections.ccpa.doNotSell.title", { defaultValue: "Do Not Sell or Share My Personal Information" })}</h3>
        <p>
          {t("sections.ccpa.doNotSell.content", {
            defaultValue:
              "We do not sell your personal information as defined under the CCPA. We do not share your personal information for cross-context behavioral advertising. If you are a California resident and wish to exercise your rights, you can reject marketing cookies via our cookie banner or contact us at privacy@better-i18n.com.",
          })}
        </p>

        <h3>{t("sections.ccpa.rights.title", { defaultValue: "Your California Privacy Rights" })}</h3>
        <ul>
          <li><strong>{t("sections.ccpa.rights.know.label", { defaultValue: "Right to know:" })}</strong> {t("sections.ccpa.rights.know.content", { defaultValue: "You can request information about the categories and specific pieces of personal information we have collected, the sources of that information, the business purpose for collecting it, and the categories of third parties with whom we share it." })}</li>
          <li><strong>{t("sections.ccpa.rights.delete.label", { defaultValue: "Right to delete:" })}</strong> {t("sections.ccpa.rights.delete.content", { defaultValue: "You can request that we delete the personal information we have collected from you, subject to certain exceptions." })}</li>
          <li><strong>{t("sections.ccpa.rights.correct.label", { defaultValue: "Right to correct:" })}</strong> {t("sections.ccpa.rights.correct.content", { defaultValue: "You can request that we correct inaccurate personal information we hold about you." })}</li>
          <li><strong>{t("sections.ccpa.rights.optOut.label", { defaultValue: "Right to opt-out:" })}</strong> {t("sections.ccpa.rights.optOut.content", { defaultValue: "You can opt out of the sale or sharing of your personal information (though we do not sell or share personal information as defined by the CCPA)." })}</li>
          <li><strong>{t("sections.ccpa.rights.nonDiscrimination.label", { defaultValue: "Right to non-discrimination:" })}</strong> {t("sections.ccpa.rights.nonDiscrimination.content", { defaultValue: "We will not discriminate against you for exercising your CCPA rights." })}</li>
        </ul>

        {/* ── US State Privacy Laws ────────────────────────────── */}
        <h2 id="us-state-laws">
          {t("sections.usStateLaws.title", { defaultValue: "US State Privacy Laws" })}
        </h2>
        <p>
          {t("sections.usStateLaws.content", {
            defaultValue:
              "In addition to California, we comply with applicable privacy laws in Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), Texas (TDPSA), Oregon (OCPA), and other US states with comprehensive privacy legislation. Residents of these states may have rights similar to those described in the CCPA section above, including the right to access, correct, delete, and opt out of certain processing activities. To exercise your rights, please contact us at privacy@better-i18n.com.",
          })}
        </p>

        {/* ── LGPD (Brazilian Users) ───────────────────────────── */}
        <h2 id="brazil">
          {t("sections.lgpd.title", { defaultValue: "Information for Brazilian Users (LGPD)" })}
        </h2>
        <p>
          {t("sections.lgpd.content", {
            defaultValue:
              "This section applies to users in Brazil and supplements the information in this privacy policy, as required by the Lei Geral de Proteção de Dados (LGPD). The legal bases for processing your personal data include your consent, the performance of a contract, compliance with a legal obligation, and our legitimate interests. You have the right to access, correct, anonymize, block, or delete unnecessary or excessive data, port your data, obtain information about sharing, and revoke your consent. To exercise your rights, contact us at privacy@better-i18n.com.",
          })}
        </p>

        {/* ── Your Rights (General) ────────────────────────────── */}
        <h2 id="your-rights">
          {t("sections.yourRights.title", { defaultValue: "Your Rights" })}
        </h2>
        <p>
          {t("sections.yourRights.content", {
            defaultValue: "Regardless of your location, you have the following general rights regarding your personal data:",
          })}
        </p>
        <ul>
          <li>
            <strong>{t("sections.yourRights.access.label", { defaultValue: "Access:" })}</strong>{" "}
            {t("sections.yourRights.access.content", { defaultValue: "Request a copy of the personal data we hold about you." })}
          </li>
          <li>
            <strong>{t("sections.yourRights.deletion.label", { defaultValue: "Deletion:" })}</strong>{" "}
            {t("sections.yourRights.deletion.content", { defaultValue: "Request that we delete your personal data, subject to legal retention requirements." })}
          </li>
          <li>
            <strong>{t("sections.yourRights.optOut.label", { defaultValue: "Opt-out:" })}</strong>{" "}
            {t("sections.yourRights.optOut.content", { defaultValue: "Opt out of non-essential data processing including marketing communications and analytics tracking." })}
          </li>
        </ul>

        {/* ── Changes ──────────────────────────────────────────── */}
        <h2 id="changes">
          {t("sections.changes.title", { defaultValue: "Changes to This Privacy Policy" })}
        </h2>
        <p>
          {t("sections.changes.content", {
            defaultValue:
              "We reserve the right to make changes to this privacy policy at any time by notifying you on this page and, where technically and legally feasible, by sending a notice via email. We strongly recommend checking this page frequently, referring to the date of the last modification listed at the top. Should the changes affect processing activities performed on the basis of your consent, we shall collect new consent from you where required.",
          })}
        </p>

        {/* ── Contact ──────────────────────────────────────────── */}
        <h2 id="contact">
          {t("sections.contact.title", { defaultValue: "Contact Us" })}
        </h2>
        <p>
          {t("sections.contact.content", {
            defaultValue: "If you have any questions about this privacy policy or wish to exercise your rights, you can contact us at:",
          })}
        </p>
        <ul>
          <li>
            <strong>{t("sections.contact.emailLabel", { defaultValue: "Email:" })}</strong>{" "}
            <a href="mailto:privacy@better-i18n.com">privacy@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("sections.contact.generalLabel", { defaultValue: "General inquiries:" })}</strong>{" "}
            <a href="mailto:hello@better-i18n.com">hello@better-i18n.com</a>
          </li>
        </ul>

        {/* ── Definitions ──────────────────────────────────────── */}
        <h2 id="definitions">
          {t("sections.definitions.title", { defaultValue: "Definitions and Legal References" })}
        </h2>
        <dl>
          <dt><strong>{t("sections.definitions.personalData.term", { defaultValue: "Personal Data (or Data)" })}</strong></dt>
          <dd>{t("sections.definitions.personalData.definition", { defaultValue: "Any information that directly, indirectly, or in connection with other information — including a personal identification number — allows for the identification or identifiability of a natural person." })}</dd>

          <dt><strong>{t("sections.definitions.usageData.term", { defaultValue: "Usage Data" })}</strong></dt>
          <dd>{t("sections.definitions.usageData.definition", { defaultValue: "Information collected automatically through this application, which can include: IP addresses, URI addresses, the time of the request, the method utilized to submit the request to the server, the size of the file received in response, the numerical code indicating the status of the server's answer, the country of origin, the features of the browser and the operating system, time details per visit, the path followed within the application, and other parameters about the device operating system and/or the user's IT environment." })}</dd>

          <dt><strong>{t("sections.definitions.user.term", { defaultValue: "User" })}</strong></dt>
          <dd>{t("sections.definitions.user.definition", { defaultValue: "The individual using this application who, unless otherwise specified, coincides with the data subject." })}</dd>

          <dt><strong>{t("sections.definitions.dataSubject.term", { defaultValue: "Data Subject" })}</strong></dt>
          <dd>{t("sections.definitions.dataSubject.definition", { defaultValue: "The natural person to whom the personal data refers." })}</dd>

          <dt><strong>{t("sections.definitions.dataProcessor.term", { defaultValue: "Data Processor (or Processor)" })}</strong></dt>
          <dd>{t("sections.definitions.dataProcessor.definition", { defaultValue: "The natural or legal person, public authority, agency, or other body which processes personal data on behalf of the controller, as described in this privacy policy." })}</dd>

          <dt><strong>{t("sections.definitions.dataController.term", { defaultValue: "Data Controller (or Owner)" })}</strong></dt>
          <dd>{t("sections.definitions.dataController.definition", { defaultValue: "The natural or legal person, public authority, agency, or other body which, alone or jointly with others, determines the purposes and means of the processing of personal data, including the security measures concerning the operation and use of this application. The Data Controller, unless otherwise specified, is Better i18n, Inc." })}</dd>

          <dt><strong>{t("sections.definitions.application.term", { defaultValue: "This Application" })}</strong></dt>
          <dd>{t("sections.definitions.application.definition", { defaultValue: "The means by which the personal data of the user is collected and processed — referring to better-i18n.com and the Better i18n platform." })}</dd>

          <dt><strong>{t("sections.definitions.service.term", { defaultValue: "Service" })}</strong></dt>
          <dd>{t("sections.definitions.service.definition", { defaultValue: "The service provided by this application as described in the Terms of Service." })}</dd>

          <dt><strong>{t("sections.definitions.eu.term", { defaultValue: "European Union (or EU)" })}</strong></dt>
          <dd>{t("sections.definitions.eu.definition", { defaultValue: "All references made within this document to the European Union include all current member states to the European Union and the European Economic Area." })}</dd>
        </dl>
      </LegalLayout>
      <Footer />
    </>
  );
}
