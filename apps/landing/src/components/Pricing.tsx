import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import { SpriteIcon } from "@/components/SpriteIcon";
import { type PricingPlan, getDisplayPrice } from "@/lib/content";

// ─── Types ───────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "yearly";

// ─── Label defaults (i18n fallbacks) ─────────────────────────────────

const limitLabelDefaults: Record<string, string> = {
  projects: "Projects",
  aiMessages: "AI messages",
  glossaryTerms: "Glossary terms",
  contentItems: "Content items",
};

const featureLabelDefaults: Record<string, string> = {
  cdnHosting: "CDN hosting",
  githubIntegration: "GitHub integration",
  emailSupport: "Email support",
  prioritySupport: "Priority support",
  customDomain: "Custom domain",
  analytics: "Analytics",
  teamMembers: "Team members",
  contentCms: "Content CMS",
  aiTranslationAnalysisSuggestions: "AI translation analysis suggestions",
  sso: "SSO",
  dedicatedAccountManager: "Dedicated account manager",
  slaGuarantee: "SLA guarantee",
};

// ─── Sub-components ──────────────────────────────────────────────────

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

function formatPrice(symbol: string, amount: number): string {
  if (amount === 0) return `${symbol}0`;
  // For whole numbers, no decimals; otherwise 2 decimals
  return Number.isInteger(amount)
    ? `${symbol}${amount.toLocaleString("en-US")}`
    : `${symbol}${amount.toFixed(2)}`;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function Pricing({
  headingLevel = "h2",
  plans,
}: {
  headingLevel?: "h1" | "h2";
  plans?: PricingPlan[];
}) {
  const t = useT("pricing");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const Heading = headingLevel;

  // If no CMS plans provided, render nothing (data should come from loader)
  if (!plans || plans.length === 0) return null;

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
            {plans.map((plan) => {
              const isPopular = plan.popular;
              const isEnterprise = plan.planId === "enterprise";
              const priceData = getDisplayPrice(plan, billingPeriod);

              // Display price: CMS-driven with locale currency
              const displayPrice = isEnterprise
                ? t("customPrice", { defaultValue: "Custom" })
                : priceData
                  ? formatPrice(priceData.symbol, billingPeriod === "yearly"
                      ? Math.round(priceData.amount / 12)
                      : priceData.amount)
                  : "$0";

              // Billed yearly note (e.g. "Billed yearly at ₺3,348")
              const yearlyTotal = billingPeriod === "yearly" && !isEnterprise && priceData
                ? formatPrice(priceData.symbol, priceData.amount)
                : null;
              const billedYearlyNote = yearlyTotal
                ? t("billedYearly", {
                    total: yearlyTotal,
                    defaultValue: `Billed yearly at ${yearlyTotal}`,
                  })
                : null;

              return (
                <div
                  key={plan.planId}
                  className={cn(
                    "flex h-full flex-col rounded-[1.75rem] border border-mist-200 bg-white p-5 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] sm:p-6",
                    isPopular && "border-mist-950/20 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.4)]"
                  )}
                >
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-medium tracking-[-0.02em] text-mist-950">
                          {plan.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-mist-600">
                          {plan.description}
                        </p>
                      </div>
                      {isPopular ? (
                        <span className="inline-flex shrink-0 rounded-full bg-mist-950 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white">
                          {t("mostPopular", { defaultValue: "Most popular" })}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5 border-b border-mist-100 pb-5">
                      <div className="flex items-end gap-2">
                        <span className="text-3xl font-semibold tracking-[-0.04em] text-mist-950">
                          {displayPrice}
                        </span>
                        {!isEnterprise ? (
                          <span className="pb-1 text-sm text-mist-600">
                            {t("perMonth", { defaultValue: "/mo" })}
                          </span>
                        ) : null}
                      </div>
                      {billedYearlyNote ? (
                        <p className="mt-2 text-xs font-medium text-mist-500">
                          {billedYearlyNote}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      {/* Limits */}
                      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {plan.limits.map((limit) => (
                          <div key={limit.key} className="space-y-1">
                            <span className="block text-xs uppercase tracking-[0.12em] text-mist-500">
                              {t(`labels.${limit.key}`, {
                                defaultValue: limitLabelDefaults[limit.key] ?? limit.key,
                              })}
                            </span>
                            <span className="block text-sm font-medium text-mist-950">
                              {t(`limits.${limit.value}`, {
                                defaultValue: limit.value,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="mt-5 grid gap-x-5 gap-y-2.5 border-t border-mist-100 pt-5 sm:grid-cols-2">
                        {plan.features.map((feature) => (
                          <div
                            key={feature.key}
                            className="flex items-center justify-between gap-3 text-[13px]"
                          >
                            <span
                              className={cn(
                                "text-mist-700",
                                !feature.included && "text-mist-400"
                              )}
                            >
                              {t(`labels.${feature.key}`, {
                                defaultValue: featureLabelDefaults[feature.key] ?? feature.key,
                              })}
                            </span>
                            <FeatureIndicator enabled={feature.included} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plan.ctaLabel} — Better i18n ${plan.name}`}
                    className={cn(
                      "mt-6 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition-all duration-200",
                      isPopular
                        ? "bg-mist-950 text-white hover:bg-mist-800"
                        : "border border-mist-200 bg-white text-mist-950 hover:bg-mist-50"
                    )}
                  >
                    {plan.ctaLabel}
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
