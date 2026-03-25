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
  const t = useT("terms");

  return (
    <>
      <Header className="bg-[#f9f9f9]" />
      <LegalLayout
        active="terms"
        title={t("title", { defaultValue: "Terms of Service" })}
        lastUpdated={t("lastUpdatedDate", { defaultValue: "March 25, 2026" })}
      >
        {/* Table of Contents */}
        <div className="bg-gray-50 rounded-xl p-6 mb-10 border border-gray-100 text-sm">
          <h3 className="font-semibold text-gray-900 mb-3 mt-0 text-base">
            {t("toc.title", { defaultValue: "Table of Contents" })}
          </h3>
          <ul className="space-y-2 list-none pl-0 m-0">
            {[
              { id: "introduction", label: "Introduction" },
              { id: "acceptance", label: "Acceptance of Terms" },
              { id: "services", label: "Description of Services" },
              { id: "accounts", label: "Account Registration" },
              { id: "content", label: "Your Content" },
              { id: "acceptable-use", label: "Acceptable Use" },
              { id: "payment", label: "Payment and Billing" },
              { id: "intellectual-property", label: "Intellectual Property" },
              { id: "third-party", label: "Third-Party Services" },
              { id: "termination", label: "Termination" },
              { id: "disclaimers", label: "Disclaimers and Limitation of Liability" },
              { id: "indemnification", label: "Indemnification" },
              { id: "us-specific", label: "US-Specific Provisions" },
              { id: "general", label: "General Provisions" },
              { id: "contact", label: "Contact" },
              { id: "definitions", label: "Definitions" },
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

        {/* ── Introduction ─────────────────────────────────────── */}
        <h2 id="introduction">
          {t("sections.introduction.title", { defaultValue: "Introduction" })}
        </h2>
        <p>
          {t("sections.introduction.content", {
            defaultValue:
              "These Terms of Service (\"Terms\") govern your use of the Better i18n platform, website (better-i18n.com), APIs, SDKs, and any related services (collectively, the \"Service\") provided by Better i18n, Inc. (\"we\", \"us\", \"our\"). By accessing or using the Service, you agree to be bound by these Terms in a legally binding way.",
          })}
        </p>
        <p>
          {t("sections.introduction.provider", {
            defaultValue: "This Service is provided by Better i18n, Inc. Contact email: legal@better-i18n.com",
          })}
        </p>
        <p>
          <strong>
            {t("sections.introduction.readCarefully", {
              defaultValue: "Please read this document carefully before using the Service.",
            })}
          </strong>
        </p>

        {/* ── Acceptance ───────────────────────────────────────── */}
        <h2 id="acceptance">
          {t("sections.acceptance.title", { defaultValue: "Acceptance of Terms" })}
        </h2>
        <p>
          {t("sections.acceptance.content", {
            defaultValue:
              "By creating an account, accessing, or using the Service, you represent that you are at least 18 years old and have the legal authority to agree to these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms. If you do not agree with any part of these Terms, you must not use the Service.",
          })}
        </p>

        {/* ── Description of Services ──────────────────────────── */}
        <h2 id="services">
          {t("sections.services.title", { defaultValue: "Description of Services" })}
        </h2>
        <p>
          {t("sections.services.description", {
            defaultValue:
              "Better i18n provides a localization infrastructure platform that includes translation management, AI-powered translation, content delivery via CDN, SDK integrations, a content management system (CMS), MCP servers, and related developer tools. The Service is offered as a cloud-based SaaS solution.",
          })}
        </p>
        <p>
          {t("sections.services.license", {
            defaultValue:
              "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes during the term of your subscription.",
          })}
        </p>
        <p>
          {t("sections.services.restrictions", {
            defaultValue:
              "You may not: (a) sublicense, sell, resell, or transfer the Service; (b) reverse engineer, decompile, or disassemble the Service; (c) use the Service to build a competing product; (d) access the Service to benchmark or monitor its availability or performance for a competitive purpose; or (e) use the Service in violation of any applicable law.",
          })}
        </p>

        {/* ── Account Registration ─────────────────────────────── */}
        <h2 id="accounts">
          {t("sections.accounts.title", { defaultValue: "Account Registration" })}
        </h2>
        <p>
          {t("sections.accounts.content", {
            defaultValue:
              "You must create an account to use the Service. You are responsible for maintaining the confidentiality of your account credentials, for all activities that occur under your account, and for notifying us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these Terms.",
          })}
        </p>

        {/* ── Your Content ─────────────────────────────────────── */}
        <h2 id="content">
          {t("sections.content.title", { defaultValue: "Your Content" })}
        </h2>
        <p>
          {t("sections.content.ownership", {
            defaultValue:
              "You retain all ownership rights to the content you upload, create, or manage through the Service, including translation keys, source text, translated content, and any other materials (\"Your Content\"). We do not claim ownership of Your Content.",
          })}
        </p>
        <p>
          {t("sections.content.license", {
            defaultValue:
              "By using the Service, you grant us a limited license to host, store, process, and transmit Your Content solely for the purpose of providing and improving the Service. This includes delivering Your Content through our CDN, processing it through AI translation providers (when you use AI translation features), and creating backups.",
          })}
        </p>
        <p>
          {t("sections.content.responsibility", {
            defaultValue:
              "You are solely responsible for Your Content. You represent that you have all necessary rights to your content and that it does not infringe any third-party rights.",
          })}
        </p>

        {/* ── Acceptable Use ───────────────────────────────────── */}
        <h2 id="acceptable-use">
          {t("sections.acceptableUse.title", { defaultValue: "Acceptable Use" })}
        </h2>
        <p>
          {t("sections.acceptableUse.intro", {
            defaultValue: "The Service may only be used within the scope of what it is provided for, under these Terms and applicable law. You agree not to:",
          })}
        </p>
        <ul>
          <li>{t("sections.acceptableUse.prohibited.abuse", { defaultValue: "Use the Service in any way that is abusive, threatening, harassing, or harmful to others." })}</li>
          <li>{t("sections.acceptableUse.prohibited.illegal", { defaultValue: "Use the Service for any illegal or unauthorized purpose." })}</li>
          <li>{t("sections.acceptableUse.prohibited.interfere", { defaultValue: "Interfere with or disrupt the Service or the servers and networks connected to it." })}</li>
          <li>{t("sections.acceptableUse.prohibited.scraping", { defaultValue: "Scrape, crawl, or use automated means to access the Service beyond normal API usage." })}</li>
          <li>{t("sections.acceptableUse.prohibited.circumvent", { defaultValue: "Attempt to circumvent any rate limits, access controls, or security measures." })}</li>
          <li>{t("sections.acceptableUse.prohibited.impersonate", { defaultValue: "Impersonate any person or entity, or misrepresent your affiliation with a person or entity." })}</li>
        </ul>

        {/* ── Payment and Billing ──────────────────────────────── */}
        <h2 id="payment">
          {t("sections.payment.title", { defaultValue: "Payment and Billing" })}
        </h2>
        <p>
          {t("sections.payment.fees", {
            defaultValue:
              "Certain features of the Service require a paid subscription. Fees are as described on our pricing page at the time of purchase. All fees are in US dollars and are non-refundable except as expressly stated in these Terms or required by applicable law.",
          })}
        </p>
        <p>
          {t("sections.payment.billing", {
            defaultValue:
              "Subscriptions are billed in advance on a monthly or annual basis through Stripe. Your subscription automatically renews unless you cancel before the end of the current billing period. We may change our fees upon 30 days' notice. If you do not agree with a fee change, you may cancel your subscription before the next billing cycle.",
          })}
        </p>
        <p>
          {t("sections.payment.taxes", {
            defaultValue:
              "All fees are exclusive of applicable taxes (VAT, sales tax, GST, etc.), which will be calculated and displayed at checkout based on your location.",
          })}
        </p>
        <p>
          {t("sections.payment.freeTier", {
            defaultValue:
              "We offer a free tier with limited features. Free accounts are subject to usage limits as described on our pricing page. We reserve the right to modify free tier limitations with 30 days' notice.",
          })}
        </p>

        {/* ── Intellectual Property ────────────────────────────── */}
        <h2 id="intellectual-property">
          {t("sections.intellectualProperty.title", { defaultValue: "Intellectual Property" })}
        </h2>
        <p>
          {t("sections.intellectualProperty.content", {
            defaultValue:
              "The Service, including all software, APIs, SDKs, documentation, designs, logos, trademarks, and all other intellectual property related to the Service, are the exclusive property of Better i18n, Inc. or its licensors and are subject to the protection granted by applicable laws and international treaties. All trademarks, service marks, and trade names are the exclusive property of Better i18n, Inc.",
          })}
        </p>
        <p>
          {t("sections.intellectualProperty.oss", {
            defaultValue:
              "Certain components of our SDKs and tools are released as open-source software under their respective licenses (typically MIT). Open-source components are governed by their specific license terms, not these Terms.",
          })}
        </p>

        {/* ── Third-Party Services ─────────────────────────────── */}
        <h2 id="third-party">
          {t("sections.thirdParty.title", { defaultValue: "Third-Party Services" })}
        </h2>
        <p>
          {t("sections.thirdParty.content", {
            defaultValue:
              "The Service integrates with third-party services including AI translation providers (OpenAI, Anthropic, Google), payment processors (Stripe), hosting providers (Cloudflare), and version control platforms (GitHub, GitLab, Bitbucket). Your use of these third-party services is subject to their respective terms and privacy policies. We are not responsible for the content, availability, or practices of third-party services.",
          })}
        </p>

        {/* ── Termination ──────────────────────────────────────── */}
        <h2 id="termination">
          {t("sections.termination.title", { defaultValue: "Termination" })}
        </h2>
        <p>
          {t("sections.termination.byYou", {
            defaultValue:
              "You may cancel your account at any time from your account settings. Upon cancellation, your access to paid features will continue until the end of your current billing period, after which your account will revert to the free tier.",
          })}
        </p>
        <p>
          {t("sections.termination.byUs", {
            defaultValue:
              "We may suspend or terminate your account if you violate these Terms, fail to pay applicable fees, or if we reasonably believe your use poses a risk to us or other users. We will provide notice before termination when practicable.",
          })}
        </p>
        <p>
          {t("sections.termination.dataExport", {
            defaultValue:
              "Upon termination, you may export Your Content for 30 days. After this period, we may delete Your Content. We will cooperate with you to enable withdrawal of personal data as required by applicable law.",
          })}
        </p>
        <p>
          {t("sections.termination.survival", {
            defaultValue:
              "The following sections survive termination: Intellectual Property, Disclaimers, Limitation of Liability, Indemnification, and General Provisions.",
          })}
        </p>

        {/* ── Disclaimers & Limitation of Liability ────────────── */}
        <h2 id="disclaimers">
          {t("sections.disclaimers.title", { defaultValue: "Disclaimers and Limitation of Liability" })}
        </h2>
        <p>
          {t("sections.disclaimers.warranty", {
            defaultValue:
              "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.",
          })}
        </p>
        <p>
          {t("sections.disclaimers.aiTranslation", {
            defaultValue:
              "AI-generated translations are provided as a starting point and may contain errors. We do not guarantee the accuracy, completeness, or appropriateness of AI translations for any specific use case. You are responsible for reviewing and approving all translations before publishing.",
          })}
        </p>
        <p>
          {t("sections.disclaimers.limitation", {
            defaultValue:
              "TO THE MAXIMUM EXTENT PERMITTED BY LAW, BETTER I18N, INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, WHETHER IN AN ACTION IN CONTRACT OR TORT, ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE SERVICE. OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.",
          })}
        </p>
        <p>
          {t("sections.disclaimers.serviceInterruption", {
            defaultValue:
              "We reserve the right to interrupt the Service for maintenance, system updates, or any other changes, informing users appropriately. The Service might also be unavailable due to reasons outside our reasonable control, such as force majeure events.",
          })}
        </p>

        {/* ── Indemnification ──────────────────────────────────── */}
        <h2 id="indemnification">
          {t("sections.indemnification.title", { defaultValue: "Indemnification" })}
        </h2>
        <p>
          {t("sections.indemnification.content", {
            defaultValue:
              "You agree to indemnify, defend, and hold harmless Better i18n, Inc., its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any rights of a third party.",
          })}
        </p>

        {/* ── US-Specific Provisions ───────────────────────────── */}
        <h2 id="us-specific">
          {t("sections.usSpecific.title", { defaultValue: "US-Specific Provisions" })}
        </h2>

        <h3>{t("sections.usSpecific.governingLaw.title", { defaultValue: "Governing Law" })}</h3>
        <p>
          {t("sections.usSpecific.governingLaw.content", {
            defaultValue:
              "These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.",
          })}
        </p>

        <h3>{t("sections.usSpecific.arbitration.title", { defaultValue: "Binding Arbitration" })}</h3>
        <p>
          {t("sections.usSpecific.arbitration.content", {
            defaultValue:
              "Any dispute, controversy, or claim arising out of or relating to these Terms, or the breach thereof, shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted by a single arbitrator. The seat of arbitration shall be Wilmington, Delaware. The language of arbitration shall be English. Judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.",
          })}
        </p>

        <h3>{t("sections.usSpecific.classAction.title", { defaultValue: "Class Action Waiver" })}</h3>
        <p>
          {t("sections.usSpecific.classAction.content", {
            defaultValue:
              "YOU AND BETTER I18N, INC. AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Unless both parties agree otherwise, the arbitrator may not consolidate or join more than one person's claims and may not otherwise preside over any form of a representative or class proceeding.",
          })}
        </p>

        <h3>{t("sections.usSpecific.dmca.title", { defaultValue: "DMCA Notice" })}</h3>
        <p>
          {t("sections.usSpecific.dmca.content", {
            defaultValue:
              "If you believe that content available through the Service infringes your copyright, you may submit a notice pursuant to the Digital Millennium Copyright Act (DMCA) by sending a written notification to legal@better-i18n.com. Your notice must include: (a) a description of the copyrighted work claimed to be infringed; (b) identification of the material that is claimed to be infringing; (c) your contact information; (d) a statement that you have a good faith belief that the use is not authorized; and (e) a statement under penalty of perjury that the information is accurate and you are authorized to act on behalf of the copyright owner.",
          })}
        </p>

        <h3>{t("sections.usSpecific.exportCompliance.title", { defaultValue: "Export Compliance" })}</h3>
        <p>
          {t("sections.usSpecific.exportCompliance.content", {
            defaultValue:
              "You agree to comply with all applicable export and re-export control laws and regulations, including the Export Administration Regulations maintained by the U.S. Department of Commerce, trade and economic sanctions maintained by the Treasury Department's Office of Foreign Assets Control (OFAC), and the International Traffic in Arms Regulations maintained by the Department of State.",
          })}
        </p>

        <h3>{t("sections.usSpecific.governmentUsers.title", { defaultValue: "US Government Users" })}</h3>
        <p>
          {t("sections.usSpecific.governmentUsers.content", {
            defaultValue:
              "The Service is a \"commercial item\" as defined at 48 C.F.R. §2.101, consisting of \"commercial computer software\" and \"commercial computer software documentation,\" as such terms are used in 48 C.F.R. §12.212 or 48 C.F.R. §227.7202. If the Service is being acquired by or on behalf of the U.S. Government, then the government's rights to use, modify, reproduce, release, perform, display, or disclose the Service will be subject to the restrictions set forth in these Terms.",
          })}
        </p>

        {/* ── General Provisions ───────────────────────────────── */}
        <h2 id="general">
          {t("sections.general.title", { defaultValue: "General Provisions" })}
        </h2>

        <h3>{t("sections.general.entireAgreement.title", { defaultValue: "Entire Agreement" })}</h3>
        <p>
          {t("sections.general.entireAgreement.content", {
            defaultValue:
              "These Terms, together with the Privacy Policy and Cookie Policy, constitute the entire agreement between you and Better i18n, Inc. regarding the Service and supersede all prior agreements and understandings.",
          })}
        </p>

        <h3>{t("sections.general.severability.title", { defaultValue: "Severability" })}</h3>
        <p>
          {t("sections.general.severability.content", {
            defaultValue:
              "If any provision of these Terms is deemed or becomes invalid or unenforceable under applicable law, the invalidity or unenforceability of such provision shall not affect the validity of the remaining provisions, which shall remain in full force and effect.",
          })}
        </p>

        <h3>{t("sections.general.noWaiver.title", { defaultValue: "No Waiver" })}</h3>
        <p>
          {t("sections.general.noWaiver.content", {
            defaultValue:
              "Our failure to assert any right or provision under these Terms shall not constitute a waiver of any such right or provision. No waiver shall be considered a further or continuing waiver of such term or any other term.",
          })}
        </p>

        <h3>{t("sections.general.assignment.title", { defaultValue: "Assignment" })}</h3>
        <p>
          {t("sections.general.assignment.content", {
            defaultValue:
              "We reserve the right to transfer, assign, dispose of by novation, or subcontract any or all rights or obligations under these Terms, taking your legitimate interests into account. You may not assign or transfer your rights or obligations under these Terms without our written permission.",
          })}
        </p>

        <h3>{t("sections.general.changes.title", { defaultValue: "Changes to These Terms" })}</h3>
        <p>
          {t("sections.general.changes.content", {
            defaultValue:
              "We reserve the right to amend these Terms at any time. We will appropriately inform you of material changes. Such changes will only affect the relationship from the date communicated onwards. Your continued use of the Service after the effective date of the revised Terms signifies your acceptance. If you do not wish to be bound by the changes, you must stop using the Service.",
          })}
        </p>

        {/* ── Contact ──────────────────────────────────────────── */}
        <h2 id="contact">
          {t("sections.contact.title", { defaultValue: "Contact" })}
        </h2>
        <p>
          {t("sections.contact.content", {
            defaultValue: "All communications relating to the use of this Service must be sent using the following contact information:",
          })}
        </p>
        <ul>
          <li>
            <strong>{t("sections.contact.legalLabel", { defaultValue: "Legal:" })}</strong>{" "}
            <a href="mailto:legal@better-i18n.com">legal@better-i18n.com</a>
          </li>
          <li>
            <strong>{t("sections.contact.generalLabel", { defaultValue: "General:" })}</strong>{" "}
            <a href="mailto:hello@better-i18n.com">hello@better-i18n.com</a>
          </li>
        </ul>

        {/* ── Definitions ──────────────────────────────────────── */}
        <h2 id="definitions">
          {t("sections.definitions.title", { defaultValue: "Definitions" })}
        </h2>
        <dl>
          <dt><strong>{t("sections.definitions.service.term", { defaultValue: "Service" })}</strong></dt>
          <dd>{t("sections.definitions.service.definition", { defaultValue: "The Better i18n platform, website, APIs, SDKs, and all related tools and services." })}</dd>

          <dt><strong>{t("sections.definitions.user.term", { defaultValue: "User (or You)" })}</strong></dt>
          <dd>{t("sections.definitions.user.definition", { defaultValue: "The individual or organization that uses the Service." })}</dd>

          <dt><strong>{t("sections.definitions.owner.term", { defaultValue: "Owner (or We)" })}</strong></dt>
          <dd>{t("sections.definitions.owner.definition", { defaultValue: "Better i18n, Inc., the entity that provides the Service." })}</dd>

          <dt><strong>{t("sections.definitions.yourContent.term", { defaultValue: "Your Content" })}</strong></dt>
          <dd>{t("sections.definitions.yourContent.definition", { defaultValue: "All content, data, translations, and materials that you upload, create, or manage through the Service." })}</dd>

          <dt><strong>{t("sections.definitions.application.term", { defaultValue: "Application" })}</strong></dt>
          <dd>{t("sections.definitions.application.definition", { defaultValue: "The web application at better-i18n.com and any associated client applications." })}</dd>
        </dl>
      </LegalLayout>
      <Footer />
    </>
  );
}
