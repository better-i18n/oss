import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";
import {
  IconCheckmark1,
  IconArrowRight,
  IconShieldCheck,
  IconGroup1,
  IconZap,
  IconSettingsGear1,
  IconGlobe,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/i18n/security-compliance")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "securityCompliance",
      pathname: "/i18n/security-compliance",
      pageType: "educational",
      structuredDataOptions: {
        title: "Security & Compliance for Translation Management",
        description:
          "Enterprise-grade security for your translation data: AES-256 encryption, TLS 1.3, RBAC, ISO 27001, SOC 2 Type II, and GDPR compliance.",
      },
    });
  },
  component: SecurityCompliancePage,
});

const dataProtectionFeatures = [
  { icon: IconShieldCheck, titleKey: "features.aes256.title", descKey: "features.aes256.description" },
  { icon: IconShieldCheck, titleKey: "features.tls13.title", descKey: "features.tls13.description" },
  { icon: IconZap, titleKey: "features.bcrypt.title", descKey: "features.bcrypt.description" },
  { icon: IconSettingsGear1, titleKey: "features.scopedKeys.title", descKey: "features.scopedKeys.description" },
  { icon: IconZap, titleKey: "features.keyRevocation.title", descKey: "features.keyRevocation.description" },
];

function SecurityCompliancePage() {
  const t = useT("marketing.i18n.securityCompliance");
  const tCommon = useT("marketing");
  const { locale } = Route.useParams();

  const accessControlItems = [
    "accessControl.list.rbac",
    "accessControl.list.auditLogging",
    "accessControl.list.sessionExpiration",
    "accessControl.list.oauthDelegation",
    "accessControl.list.leastPrivilege",
    "accessControl.list.rateLimiting",
  ];

  const complianceItems = [
    "compliance.list.iso27001",
    "compliance.list.soc2",
    "compliance.list.gdpr",
    "compliance.list.dpa",
    "compliance.list.rightToErasure",
    "compliance.list.dataExport",
    "compliance.list.minimalData",
  ];

  const infrastructureItems = [
    "infrastructure.list.cloudflareWorkers",
    "infrastructure.list.cloudflareR2",
    "infrastructure.list.planetscale",
    "infrastructure.list.multiDatacenter",
    "infrastructure.list.responsibleDisclosure",
    "infrastructure.list.acknowledgment",
  ];

  const relatedPages = [
    { name: "Localization Platforms", href: "/$locale/i18n/localization-platforms", description: t("related.localizationPlatforms", { defaultValue: "Manage every translation workflow in one place" }) },
    { name: "For Developers", href: "/$locale/i18n/for-developers", description: t("related.forDevelopers", { defaultValue: "Developer-first i18n with type-safe SDKs and CLI tools" }) },
    { name: "Best TMS", href: "/$locale/i18n/best-tms", description: t("related.bestTms", { defaultValue: "Side-by-side comparison of the top TMS platforms" }) },
    { name: "Translation Management System", href: "/$locale/i18n/translation-management-system", description: t("related.tms", { defaultValue: "How a TMS automates your localization workflow" }) },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-3 py-1 text-sm text-mist-700 mb-6">
              <IconShieldCheck className="size-4" />
              <span>{t("badge", { defaultValue: "Security & Compliance" })}</span>
            </div>
            <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("hero.title", { defaultValue: "Security & Compliance: Enterprise-Grade Protection for Your Translation Data" })}
            </h1>
            <p className="mt-6 text-lg/8 text-mist-700 max-w-2xl">
              {t("hero.subtitle", { defaultValue: "Your translation data deserves the same protection as your source code. Better i18n secures every layer — from encrypted storage and hashed API keys to role-based access control, audit logging, and full GDPR compliance." })}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("features.title", { defaultValue: "Data Protection Features" })}
            </h2>
            <p className="mt-3 text-mist-700 max-w-2xl mx-auto">
              {t("features.subtitle", { defaultValue: "Multiple layers of encryption and key management protect your translation data at every stage." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dataProtectionFeatures.map((feature) => (
              <div key={feature.titleKey} className="p-6 rounded-xl bg-white border border-mist-200">
                <div className="size-10 rounded-lg bg-mist-100 flex items-center justify-center text-mist-700 mb-4">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t(feature.titleKey, { defaultValue: feature.titleKey.split(".").pop() })}
                </h3>
                <p className="text-sm text-mist-700 leading-relaxed">
                  {t(feature.descKey, { defaultValue: "" })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("accessControl.title", { defaultValue: "Access Control" })}
              </h2>
              <p className="text-mist-700 leading-relaxed mb-6">
                {t("accessControl.subtitle", { defaultValue: "Fine-grained permission management ensures that every team member has exactly the access they need — no more, no less." })}
              </p>
              <ul className="space-y-4">
                {accessControlItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-10 lg:mt-0 p-8 rounded-2xl bg-mist-50 border border-mist-100">
              <h3 className="text-lg font-medium text-mist-950 mb-4">
                {t("accessControl.details.title", { defaultValue: "How Access Control Works" })}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("accessControl.details.rbac.title", { defaultValue: "Role-Based Access Control" })}</h4>
                    <p className="text-sm text-mist-600">{t("accessControl.details.rbac.description", { defaultValue: "Assign owner, admin, and member roles at the organization level. Each role inherits a scoped set of permissions for projects, keys, and settings." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("accessControl.details.audit.title", { defaultValue: "Audit Logging" })}</h4>
                    <p className="text-sm text-mist-600">{t("accessControl.details.audit.description", { defaultValue: "Every sensitive operation — key creation, role change, project deletion — is recorded with a timestamp, actor, and action for full traceability." })}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconGroup1 className="size-5 text-mist-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-mist-950 mb-1">{t("accessControl.details.oauth.title", { defaultValue: "OAuth Delegation" })}</h4>
                    <p className="text-sm text-mist-600">{t("accessControl.details.oauth.description", { defaultValue: "Authentication is delegated to GitHub OAuth. Better i18n never stores passwords — reducing the attack surface and simplifying onboarding." })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
                {t("compliance.title", { defaultValue: "Compliance & Certifications" })}
              </h2>
              <p className="text-mist-700 leading-relaxed">
                {t("compliance.subtitle", { defaultValue: "Better i18n meets the compliance standards required by enterprise security teams, privacy regulations, and industry certifications." })}
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <ul className="space-y-4">
                {complianceItems.map((itemKey) => (
                  <li key={itemKey} className="flex items-start gap-3">
                    <IconCheckmark1 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-mist-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl">
              {t("infrastructure.title", { defaultValue: "Infrastructure Security" })}
            </h2>
            <p className="mt-3 text-mist-700">
              {t("infrastructure.subtitle", { defaultValue: "Built on battle-tested cloud infrastructure with DDoS protection, automatic backups, and multi-datacenter redundancy." })}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {infrastructureItems.map((itemKey) => (
              <div key={itemKey} className="flex items-start gap-3 p-6 rounded-xl bg-white border border-mist-200">
                <IconGlobe className="size-5 text-mist-700 mt-0.5 shrink-0" />
                <span className="text-mist-700">{t(itemKey, { defaultValue: itemKey.split(".").pop() })}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl font-medium text-mist-950 sm:text-3xl mb-6">
              {t("solution.title", { defaultValue: "Better i18n: Security Built Into Every Layer" })}
            </h2>
            <p className="text-mist-700 leading-relaxed mb-8">
              {t("solution.content", { defaultValue: "Security is not an afterthought at Better i18n. From encrypted databases and hashed credentials to strict access controls and compliance certifications, every component is designed to protect your translation data at rest and in transit." })}
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature1.title", { defaultValue: "Zero Plaintext Storage" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature1.description", { defaultValue: "API keys are bcrypt-hashed before storage. Database fields are AES-256 encrypted. No sensitive data exists in plaintext anywhere in the system." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature2.title", { defaultValue: "Enterprise-Ready Compliance" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature2.description", { defaultValue: "ISO 27001, SOC 2 Type II, and GDPR compliance with data processing agreements available for enterprise customers on request." })}
                </p>
              </div>
              <div className="p-6 rounded-xl bg-mist-50 border border-mist-100">
                <h3 className="text-base font-medium text-mist-950 mb-2">
                  {t("solution.feature3.title", { defaultValue: "Responsible Disclosure" })}
                </h3>
                <p className="text-sm text-mist-700">
                  {t("solution.feature3.description", { defaultValue: "Security researchers can report vulnerabilities through our responsible disclosure program. We acknowledge reports within 24 hours and remediate promptly." })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-mist-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="text-lg font-medium text-mist-950 mb-6">{tCommon("whatIs.relatedTopics", { defaultValue: "Related Topics" })}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedPages.map((page) => (
              <Link
                key={page.href}
                to={page.href}
                params={{ locale }}
                className="group flex items-center justify-between p-4 rounded-xl border border-mist-200 bg-white hover:border-mist-300 hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="text-sm font-medium text-mist-950">{page.name}</h3>
                  <p className="text-xs text-mist-500 mt-1">{page.description}</p>
                </div>
                <IconArrowRight className="w-4 h-4 text-mist-400 group-hover:text-mist-600 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-mist-950 rounded-3xl mx-6 lg:mx-10 mb-16">
        <div className="mx-auto max-w-2xl text-center px-6">
          <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-white sm:text-4xl/[1.1]">
            {t("cta.title", { defaultValue: "Protect Your Translation Data with Enterprise Security" })}
          </h2>
          <p className="mt-4 text-lg text-mist-300">
            {t("cta.subtitle", { defaultValue: "Better i18n gives your team encrypted storage, strict access controls, and full compliance certifications so you can scale translations without compromising security." })}
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a
              href="https://dash.better-i18n.com"
              aria-label="Start using Better i18n with enterprise-grade security for free"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-mist-950 hover:bg-mist-100 transition-colors"
            >
              {t("cta.primary", { defaultValue: "Get Started Free" })}
            </a>
            <a
              href="https://docs.better-i18n.com"
              aria-label="Read the Better i18n security documentation"
              className="rounded-full border border-mist-600 px-6 py-3 text-sm font-medium text-white hover:bg-mist-800 transition-colors"
            >
              {t("cta.secondary", { defaultValue: "Read the Docs" })}
            </a>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
