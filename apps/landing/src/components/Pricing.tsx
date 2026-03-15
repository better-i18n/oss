import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import { SpriteIcon } from "@/components/SpriteIcon";

type BillingPeriod = "monthly" | "yearly";
type PlanKey = "free" | "pro" | "enterprise";
type LimitKey = "projects" | "aiMessages" | "glossaryTerms" | "contentItems";
type FeatureKey =
  | "cdnHosting"
  | "githubIntegration"
  | "emailSupport"
  | "prioritySupport"
  | "customDomain"
  | "analytics"
  | "teamMembers"
  | "contentCms"
  | "aiTranslationAnalysisSuggestions";

const plans = ["free", "pro", "enterprise"] as const satisfies readonly PlanKey[];
const limitKeys = [
  "projects",
  "aiMessages",
  "glossaryTerms",
  "contentItems",
] as const satisfies readonly LimitKey[];
const featureKeys = [
  "cdnHosting",
  "githubIntegration",
  "emailSupport",
  "prioritySupport",
  "customDomain",
  "analytics",
  "teamMembers",
  "contentCms",
  "aiTranslationAnalysisSuggestions",
] as const satisfies readonly FeatureKey[];

const planConfig: Record<
  PlanKey,
  {
    cta: string;
    ctaHref: string;
    description: string;
    limits: Record<LimitKey, string>;
    name: string;
    price: Record<BillingPeriod, string>;
    priceNote?: string;
    statusBadge?: string;
    statusTone?: "dark" | "soft";
    subPriceNote?: string;
    features: Record<FeatureKey, boolean>;
  }
> = {
  free: {
    name: "Free",
    description: "Perfect for side projects and open source.",
    cta: "Get Started",
    ctaHref: "https://dash.better-i18n.com",
    price: { monthly: "$0", yearly: "$0" },
    limits: {
      projects: "5",
      aiMessages: "100 / mo",
      glossaryTerms: "5",
      contentItems: "100",
    },
    features: {
      cdnHosting: true,
      githubIntegration: true,
      emailSupport: true,
      prioritySupport: false,
      customDomain: false,
      analytics: false,
      teamMembers: false,
      contentCms: false,
      aiTranslationAnalysisSuggestions: false,
    },
  },
  pro: {
    name: "Pro",
    description: "Advanced features for scaling teams.",
    cta: "Start Free Trial",
    ctaHref: "https://dash.better-i18n.com",
    statusBadge: "Most popular",
    statusTone: "dark",
    price: { monthly: "$19", yearly: "$15.20" },
    limits: {
      projects: "10",
      aiMessages: "Unlimited",
      glossaryTerms: "50",
      contentItems: "10,000",
    },
    features: {
      cdnHosting: true,
      githubIntegration: true,
      emailSupport: true,
      prioritySupport: true,
      customDomain: true,
      analytics: true,
      teamMembers: true,
      contentCms: true,
      aiTranslationAnalysisSuggestions: true,
    },
  },
  enterprise: {
    name: "Enterprise",
    description: "Custom solutions for large organizations.",
    cta: "Contact Sales",
    ctaHref: "mailto:sales@better-i18n.com",
    statusBadge: "Current",
    statusTone: "soft",
    price: { monthly: "Custom", yearly: "Custom" },
    limits: {
      projects: "Unlimited",
      aiMessages: "Unlimited",
      glossaryTerms: "Unlimited",
      contentItems: "Unlimited",
    },
    features: {
      cdnHosting: true,
      githubIntegration: true,
      emailSupport: true,
      prioritySupport: true,
      customDomain: true,
      analytics: true,
      teamMembers: true,
      contentCms: true,
      aiTranslationAnalysisSuggestions: true,
    },
  },
};

const limitLabelDefaults: Record<LimitKey, string> = {
  projects: "Projects",
  aiMessages: "AI messages",
  glossaryTerms: "Glossary terms",
  contentItems: "Content items",
};

const featureLabelDefaults: Record<FeatureKey, string> = {
  cdnHosting: "CDN hosting",
  githubIntegration: "GitHub integration",
  emailSupport: "Email support",
  prioritySupport: "Priority support",
  customDomain: "Custom domain",
  analytics: "Analytics",
  teamMembers: "Team members",
  contentCms: "Content CMS",
  aiTranslationAnalysisSuggestions: "AI translation analysis suggestions",
};

function FeatureIndicator({ enabled }: { enabled: boolean }) {
  return enabled ? (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-mist-950 text-white">
      <SpriteIcon name="checkmark" className="h-3.5 w-3.5" />
    </span>
  ) : (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-mist-200 text-xs font-medium text-mist-300">
      -
    </span>
  );
}

export default function Pricing({
  headingLevel = "h2",
}: {
  headingLevel?: "h1" | "h2";
}) {
  const t = useT("pricing");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const Heading = headingLevel;

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Heading className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04]">
                {t("title", {
                  defaultValue: "Pricing to fit your business needs.",
                })}
              </Heading>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-mist-200 bg-white p-1.5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)]">
              <button
                type="button"
                aria-pressed={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  billingPeriod === "monthly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-700 hover:text-mist-950"
                )}
              >
                {t("monthly", { defaultValue: "Monthly" })}
              </button>
              <button
                type="button"
                aria-pressed={billingPeriod === "yearly"}
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  billingPeriod === "yearly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-700 hover:text-mist-950"
                )}
              >
                {t("yearly", { defaultValue: "Yearly" })}
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    billingPeriod === "yearly"
                      ? "bg-emerald-500 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {t("save20", { defaultValue: "Save 20%" })}
                </span>
              </button>
            </div>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-4 lg:grid-cols-3">
            {plans.map((planKey) => {
              const plan = planConfig[planKey];
              const isPopular = planKey === "pro";
              const price = plan.price[billingPeriod];
              const perMonth = planKey !== "enterprise";
              const subPriceNote =
                billingPeriod === "yearly" && planKey === "pro"
                  ? "Billed yearly ($182.40)"
                  : null;

              return (
                <div
                  key={planKey}
                  className={cn(
                    "flex h-full flex-col rounded-[1.75rem] border border-mist-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] sm:p-6",
                    isPopular && "border-mist-950/20 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.4)]"
                  )}
                >
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-medium tracking-[-0.02em] text-mist-950">
                          {t(`plans.${planKey}.name`, {
                            defaultValue: plan.name,
                          })}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-mist-600">
                          {t(`plans.${planKey}.description`, {
                            defaultValue: plan.description,
                          })}
                        </p>
                      </div>
                      {plan.statusBadge ? (
                        <span
                          className={cn(
                            "inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
                            plan.statusTone === "dark"
                              ? "bg-mist-950 text-white"
                              : "border border-mist-200 bg-mist-50 text-mist-700"
                          )}
                        >
                          {planKey === "pro"
                            ? t("mostPopular", {
                                defaultValue: plan.statusBadge,
                              })
                            : t("current", {
                                defaultValue: plan.statusBadge,
                              })}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 border-b border-mist-100 pb-5">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-semibold tracking-[-0.04em] text-mist-950">
                          {planKey === "enterprise"
                            ? t("customPrice", { defaultValue: price })
                            : price}
                        </span>
                        {perMonth ? (
                          <span className="pb-1 text-sm text-mist-600">
                            {t("perMonth", { defaultValue: "/mo" })}
                          </span>
                        ) : null}
                      </div>
                      {subPriceNote ? (
                        <p className="mt-2 text-xs font-medium text-mist-500">
                          {t("billedYearly", {
                            total: "$182.40",
                            defaultValue: subPriceNote,
                          })}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {limitKeys.map((limitKey) => (
                          <div
                            key={limitKey}
                            className="space-y-1"
                          >
                            <span className="block text-xs uppercase tracking-[0.12em] text-mist-500">
                              {t(`labels.${limitKey}`, {
                                defaultValue: limitLabelDefaults[limitKey],
                              })}
                            </span>
                            <span className="block text-sm font-medium text-mist-950">
                              {t(`plans.${planKey}.limits.${limitKey}`, {
                                defaultValue: plan.limits[limitKey],
                              })}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-5 grid gap-x-5 gap-y-2.5 border-t border-mist-100 pt-5 sm:grid-cols-2">
                        {featureKeys.map((featureKey) => (
                          <div
                            key={featureKey}
                            className="flex items-center justify-between gap-3 text-[13px]"
                          >
                            <span
                              className={cn(
                                "text-mist-700",
                                !plan.features[featureKey] && "text-mist-400"
                              )}
                            >
                              {t(`labels.${featureKey}`, {
                                defaultValue: featureLabelDefaults[featureKey],
                              })}
                            </span>
                            <FeatureIndicator enabled={plan.features[featureKey]} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={plan.ctaHref}
                    aria-label={t(`plans.${planKey}.ctaAriaLabel`, {
                      defaultValue: `${plan.cta} — Better i18n ${plan.name}`,
                    })}
                    className={cn(
                      "mt-6 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                      isPopular
                        ? "bg-mist-950 text-white hover:bg-mist-800"
                        : "border border-mist-200 bg-white text-mist-950 hover:bg-mist-50"
                    )}
                  >
                    {t(`plans.${planKey}.cta`, {
                      defaultValue: plan.cta,
                    })}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
