import { useTranslations } from "@better-i18n/use-intl";
import { FlowHero, FlowCard, FlowMono, FlowText } from "@/components/visuals/FlowHero";
import { ProcessCompare } from "@/components/visuals/ProcessCompare";
import { Section, SectionHeader } from "@/components/ui/page";

/**
 * The "how it works" visual for each CMS-driven persona page.
 *
 * Five of the eight "Who it's for" pages render entirely from CMS markdown, so
 * they were walls of prose with no diagram at all while `for-developers`,
 * `for-product-teams` and `for-translators` each carried one. This file closes
 * that gap without inventing a new shape: four personas mount `FlowHero`
 * (rule/how-it-works-is-a-converging-flow) and one mounts `ProcessCompare`,
 * because that rule's own exception says a **before/after** question is a
 * different question — and `/for-startups/` is literally built around a
 * "Before vs. After" section.
 *
 * Every card's copy is grounded in the persona page's OWN published body, so the
 * diagram cannot claim something the page does not. Two consequences worth
 * naming:
 *
 *   - The enterprise flow does NOT mention SSO. The page says plainly that
 *     "SSO/SAML — Not yet available … SSO is on our roadmap", so the flow uses
 *     what the page does document: GitHub OAuth, scoped bearer tokens, RBAC at
 *     org and project level, audit logs, TLS 1.3 / AES-256.
 *   - No two flows share a card set. An agency's unit of work is a client
 *     project; e-commerce's is a catalogue field; enterprise's is a team behind
 *     access control; SaaS's is a string travelling from scan to CDN. Printing
 *     the same diagram five times would read worse than printing none.
 *
 * `FlowHero`'s SLOTS geometry is not touched — these components only supply card
 * contents, and the primitives clamp their own body text so a long translation
 * costs a card its last line rather than the layout.
 */

/** The centre tile is identical everywhere: it is the same product. */
function centre(sublabel: string) {
  return {
    mark: (
      <img
        src="/brand/logo.svg"
        alt=""
        width={26}
        height={26}
        style={{ width: 26, height: 26 }}
      />
    ),
    label: "Better I18N",
    sublabel,
  };
}

/* ─── /for-agencies/ — a project per client ──────────────────────────
   The page's own spine: "One Project Per Client", "Role-Based Access for
   Contractors", "Glossary Enforcement Per Project", "GitHub Integration for
   Developer Handoff", "CDN Delivery". Two client cards make the isolation
   visible rather than asserted. */
export function AgencyFlow() {
  const t = useTranslations("persona");
  return (
    <FlowHero
      pillar="ai"
      title={t("flow.agencies.title")}
      center={centre(t("flow.agencies.center"))}
      cards={[
        <FlowCard key="clientA" eyebrow={t("flow.agencies.clientA.label")}>
          <FlowMono>acme/web</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.agencies.clientA.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="glossary" eyebrow={t("flow.agencies.glossary.label")}>
          <FlowText>{t("flow.agencies.glossary.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="clientB" eyebrow={t("flow.agencies.clientB.label")}>
          <FlowMono>globex/store</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.agencies.clientB.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="access" eyebrow={t("flow.agencies.access.label")}>
          <FlowText>{t("flow.agencies.access.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="ai" eyebrow={t("flow.agencies.ai.label")}>
          <FlowText>{t("flow.agencies.ai.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="handoff" eyebrow={t("flow.agencies.handoff.label")}>
          <FlowMono>PR → main</FlowMono>
        </FlowCard>,
        <FlowCard key="delivery" eyebrow={t("flow.agencies.delivery.label")}>
          <FlowMono>cdn · per project</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

/* ─── /for-ecommerce/ — one catalogue, every market ──────────────────
   Grounded in "Content SDK: Model Your Product Catalog", "AI Translation with
   Glossary", "Namespace Organization for E-Commerce", "REST API", "CDN". The
   unit here is a product FIELD, which is what makes it not the agency diagram. */
export function EcommerceFlow() {
  const t = useTranslations("persona");
  return (
    <FlowHero
      pillar="content"
      title={t("flow.ecommerce.title")}
      center={centre(t("flow.ecommerce.center"))}
      cards={[
        <FlowCard key="fieldTitle" eyebrow={t("flow.ecommerce.fieldTitle.label")}>
          <FlowMono>product.title</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.ecommerce.fieldTitle.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="namespaces" eyebrow={t("flow.ecommerce.namespaces.label")}>
          <FlowText>{t("flow.ecommerce.namespaces.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="fieldDesc" eyebrow={t("flow.ecommerce.fieldDesc.label")}>
          <FlowMono>product.description</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.ecommerce.fieldDesc.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="glossary" eyebrow={t("flow.ecommerce.glossary.label")}>
          <FlowText>{t("flow.ecommerce.glossary.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="ai" eyebrow={t("flow.ecommerce.ai.label")}>
          <FlowText>{t("flow.ecommerce.ai.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="api" eyebrow={t("flow.ecommerce.api.label")}>
          <FlowMono>GET /entries</FlowMono>
        </FlowCard>,
        <FlowCard key="storefront" eyebrow={t("flow.ecommerce.storefront.label")}>
          <FlowText>{t("flow.ecommerce.storefront.body")}</FlowText>
        </FlowCard>,
      ]}
    />
  );
}

/* ─── /for-enterprises/ — one controlled surface ─────────────────────
   Straight from the page's "Security and Access Control" section. No SSO: the
   page states it is not available yet. */
export function EnterpriseFlow() {
  const t = useTranslations("persona");
  return (
    <FlowHero
      pillar="mcp"
      title={t("flow.enterprises.title")}
      center={centre(t("flow.enterprises.center"))}
      cards={[
        <FlowCard key="teamPlatform" eyebrow={t("flow.enterprises.teamPlatform.label")}>
          <FlowMono>platform</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.enterprises.teamPlatform.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="rbac" eyebrow={t("flow.enterprises.rbac.label")}>
          <FlowText>{t("flow.enterprises.rbac.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="teamDocs" eyebrow={t("flow.enterprises.teamDocs.label")}>
          <FlowMono>docs</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.enterprises.teamDocs.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="auth" eyebrow={t("flow.enterprises.auth.label")}>
          <FlowText>{t("flow.enterprises.auth.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="apiKey" eyebrow={t("flow.enterprises.apiKey.label")}>
          <FlowText>{t("flow.enterprises.apiKey.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="audit" eyebrow={t("flow.enterprises.audit.label")}>
          <FlowMono>audit log</FlowMono>
        </FlowCard>,
        <FlowCard key="delivery" eyebrow={t("flow.enterprises.delivery.label")}>
          <FlowMono>TLS 1.3 · AES-256</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

/* ─── /for-saas/ — ship without a deploy ─────────────────────────────
   The page's spine is a release pipeline: "CLI: Scan Your Codebase", "GitHub
   Integration", "CDN: Fast Delivery Without Deploys", "Framework SDKs",
   "Organize with Namespaces". The unit is a STRING moving, not a project. */
export function SaasFlow() {
  const t = useTranslations("persona");
  return (
    <FlowHero
      pillar="sync"
      title={t("flow.saas.title")}
      center={centre(t("flow.saas.center"))}
      cards={[
        <FlowCard key="scan" eyebrow={t("flow.saas.scan.label")}>
          <FlowMono>better-i18n scan</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.saas.scan.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="namespaces" eyebrow={t("flow.saas.namespaces.label")}>
          <FlowText>{t("flow.saas.namespaces.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="pr" eyebrow={t("flow.saas.pr.label")}>
          <FlowMono>PR → main</FlowMono>
          <div style={{ marginTop: 4 }}>
            <FlowText muted>{t("flow.saas.pr.body")}</FlowText>
          </div>
        </FlowCard>,
        <FlowCard key="ai" eyebrow={t("flow.saas.ai.label")}>
          <FlowText>{t("flow.saas.ai.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="publish" eyebrow={t("flow.saas.publish.label")}>
          <FlowText>{t("flow.saas.publish.body")}</FlowText>
        </FlowCard>,
        <FlowCard key="cdn" eyebrow={t("flow.saas.cdn.label")}>
          <FlowMono>live · no deploy</FlowMono>
        </FlowCard>,
        <FlowCard key="sdk" eyebrow={t("flow.saas.sdk.label")}>
          <FlowMono>next load</FlowMono>
        </FlowCard>,
      ]}
    />
  );
}

/* ─── /for-startups/ — before / after ────────────────────────────────
   Not a FlowHero. `rule/how-it-works-is-a-converging-flow` carves out
   before/after explicitly, and this page already frames its argument that way
   ("Before vs. After better-i18n: A Startup's Localization Journey"). Every step
   below is taken from that section: the 8-week refactor, the $15–25k consultant,
   the agency, the dedicated engineer — and the week-1 GitHub connect, extract-as-
   you-go, AI first locales, beta launch, PR-workflow upkeep. */
export function StartupCompare() {
  const t = useTranslations("persona");
  return (
    <Section labelledBy="startups-compare">
      <SectionHeader
        id="startups-compare"
        eyebrow={t("compare.startups.eyebrow")}
        title={t("compare.startups.title")}
        subtitle={t("compare.startups.subtitle")}
      />
      <div className="mt-8">
        <ProcessCompare
          pillar="ai"
          title={t("compare.startups.figureTitle")}
          handledLabel={t("compare.startups.handled")}
          manual={{
            label: t("compare.startups.manualLabel"),
            steps: [
              {
                label: t("compare.startups.manual.refactor"),
                meta: t("compare.startups.manual.refactorMeta"),
                dropped: true,
              },
              {
                label: t("compare.startups.manual.consultant"),
                meta: t("compare.startups.manual.consultantMeta"),
                dropped: true,
              },
              { label: t("compare.startups.manual.agency"), dropped: true },
              { label: t("compare.startups.manual.engineer"), dropped: true },
              { label: t("compare.startups.manual.translate") },
            ],
          }}
          better={{
            label: t("compare.startups.betterLabel"),
            steps: [
              {
                label: t("compare.startups.better.connect"),
                meta: t("compare.startups.better.connectMeta"),
              },
              { label: t("compare.startups.better.extract") },
              { label: t("compare.startups.better.ai") },
              { label: t("compare.startups.better.beta") },
              {
                label: t("compare.startups.better.ongoing"),
                meta: t("compare.startups.better.ongoingMeta"),
              },
            ],
          }}
        />
      </div>
    </Section>
  );
}
