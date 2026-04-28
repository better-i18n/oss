import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import { useState } from "react";
import { type PricingPlan, getDisplayPrice } from "@/lib/content";

// ─── Types ───────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "yearly";

// ─── Label defaults (i18n fallbacks) ─────────────────────────────────

const limitLabelDefaults: Record<string, string> = {
  projects: "Projects",
  translationKeys: "Translation keys",
  aiMessages: "AI messages",
  glossaryTerms: "Glossary terms",
  contentItems: "Content items",
  publishes: "Publishes",
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
  aiTranslationAnalysisSuggestions: "AI translation suggestions",
  sso: "SSO",
  dedicatedAccountManager: "Dedicated account manager",
  slaGuarantee: "SLA guarantee",
};

/**
 * Format a price for display.
 * - USD ($) and EUR (€): use symbol prefix — "$19", "€9"
 * - All other currencies (e.g. TRY): use ISO code prefix — "TRY 349"
 */
function formatPrice(symbol: string, amount: number, currency: string): string {
  const useSymbol = symbol === "$" || symbol === "€";
  const prefix = useSymbol ? symbol : `${currency.toUpperCase()} `;
  if (amount === 0) return `${prefix}0`;
  // For whole numbers, no decimals; otherwise 2 decimals
  return Number.isInteger(amount)
    ? `${prefix}${amount.toLocaleString("en-US")}`
    : `${prefix}${amount.toFixed(2)}`;
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

  // Diff-based feature display: each plan after the first only shows what's NEW
  // vs. the previous tier — eliminates duplicate scanning, lets numeric limits
  // do the real differentiation work above.
  const featureRowsByPlan = plans.map((plan, idx) => {
    const includedNow = plan.features.filter((f) => f.included);
    if (idx === 0) {
      return { items: includedNow, prevPlanName: null as string | null };
    }
    const prevIncluded = new Set(
      plans[idx - 1]!.features.filter((f) => f.included).map((f) => f.key)
    );
    const newOnly = includedNow.filter((f) => !prevIncluded.has(f.key));
    return { items: newOnly, prevPlanName: plans[idx - 1]!.name };
  });

  return (
    <section id="pricing" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-8">
          {/* Heading + billing toggle */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Heading className="font-display text-3xl/[1.08] font-medium tracking-[-0.03em] text-mist-950 sm:text-4xl/[1.04] text-balance">
                {t("title", {
                  defaultValue: "Pricing to fit your business needs.",
                })}
              </Heading>
              <p className="mt-4 text-lg text-mist-600 text-pretty">
                {t("subtitle", {
                  defaultValue:
                    "Start free, scale when you ship. No per-seat fees, no enterprise contracts — just transparent pricing built for teams shipping globally.",
                })}
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-1 rounded-full border border-mist-200 bg-white p-1">
              <button
                type="button"
                aria-pressed={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
                  billingPeriod === "monthly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-600 hover:text-mist-950"
                )}
              >
                {t("monthly", { defaultValue: "Monthly" })}
              </button>
              <button
                type="button"
                aria-pressed={billingPeriod === "yearly"}
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "cursor-pointer flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-200",
                  billingPeriod === "yearly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-600 hover:text-mist-950"
                )}
              >
                {t("yearly", { defaultValue: "Yearly" })}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    billingPeriod === "yearly"
                      ? "bg-white/15 text-white"
                      : "bg-mist-100 text-mist-700"
                  )}
                >
                  −20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans — framed grid block, title + toggle stay outside */}
          <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-y-0 lg:divide-x lg:divide-mist-200/70 rounded-3xl border border-mist-200/70 bg-white p-5 sm:p-6 lg:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {plans.map((plan, planIdx) => {
              const isPopular = plan.popular;
              const isEnterprise = plan.planId === "enterprise";
              const priceData = getDisplayPrice(plan, billingPeriod);
              const featureRows = featureRowsByPlan[planIdx]!;

              // Display price: CMS-driven with locale currency
              const displayPrice = isEnterprise
                ? t("customPrice", { defaultValue: "Custom" })
                : priceData
                  ? formatPrice(priceData.symbol, billingPeriod === "yearly"
                      ? Math.round(priceData.amount / 12)
                      : priceData.amount, priceData.currency)
                  : "$0";

              // Billed yearly note (e.g. "Billed yearly at TRY 3,588")
              const yearlyTotal = billingPeriod === "yearly" && !isEnterprise && priceData
                ? formatPrice(priceData.symbol, priceData.amount, priceData.currency)
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
                  className="flex flex-col px-0 pb-0 lg:px-8 lg:first:pl-0 lg:last:pr-0"
                >
                  {/* Most-popular eyebrow — subtle, no pill */}
                  {isPopular ? (
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-mist-950 mb-2">
                      <span aria-hidden>★</span>
                      {t("mostPopular", { defaultValue: "Most popular" })}
                    </p>
                  ) : (
                    <p className="text-[10px] mb-2 select-none invisible" aria-hidden>
                      placeholder
                    </p>
                  )}

                  {/* Plan name */}
                  <h3 className="text-xl font-semibold tracking-[-0.01em] text-mist-950">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-600 text-pretty">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-semibold tracking-[-0.03em] text-mist-950 tabular-nums">
                        {displayPrice}
                      </span>
                      {!isEnterprise ? (
                        <span className="text-sm text-mist-500">
                          {t("perMonth", { defaultValue: "/mo" })}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-mist-500 min-h-[1rem]">
                      {billedYearlyNote ?? (isEnterprise ? t("annualBillingOnly", { defaultValue: "Annual billing only" }) : " ")}
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plan.ctaLabel} — Better i18n ${plan.name}`}
                    className={cn(
                      "mt-5 inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
                      isPopular
                        ? "bg-mist-950 text-white hover:bg-mist-800"
                        : "border border-mist-200 bg-white text-mist-950 hover:bg-mist-50"
                    )}
                  >
                    {plan.ctaLabel}
                  </a>

                  {/* Limits — inline label · value */}
                  <ul className="mt-8 space-y-2.5">
                    {plan.limits.map((limit) => (
                      <li
                        key={limit.key}
                        className="flex items-center justify-between gap-3 text-[13px]"
                      >
                        <span className="text-mist-600">
                          {t(`labels.${limit.key}`, {
                            defaultValue: limitLabelDefaults[limit.key] ?? limit.key,
                          })}
                        </span>
                        <span className="text-mist-950 font-medium tabular-nums">
                          {t(`limits.${limit.value}`, {
                            defaultValue: limit.value,
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Features — diff-only, rendered as one prose line per column instead of a list. */}
                  {featureRows.items.length > 0 ? (
                    <p className="mt-6 text-[13px] leading-relaxed text-mist-600 text-pretty">
                      {featureRows.prevPlanName ? (
                        <span className="text-mist-500">
                          {t("everythingInPlus", {
                            plan: featureRows.prevPlanName,
                            defaultValue: `Everything in ${featureRows.prevPlanName}, plus:`,
                          })}{" "}
                        </span>
                      ) : null}
                      {featureRows.items
                        .map((feature) =>
                          t(`labels.${feature.key}`, {
                            defaultValue:
                              featureLabelDefaults[feature.key] ?? feature.key,
                          })
                        )
                        .join(" · ")}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
