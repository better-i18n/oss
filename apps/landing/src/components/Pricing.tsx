import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import { useMemo, useState } from "react";
import { AnimatedPrice } from "@/components/pricing/AnimatedPrice";
import { type PricingPlan, getDisplayPrice } from "@/lib/content";

// ─── Types ───────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "yearly";

// ─── Label defaults (i18n fallbacks) ─────────────────────────────────



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

/**
 * The number a plan shows for a period. Yearly plans advertise the per-month
 * equivalent, so the divide-by-12 lives here rather than being repeated at the
 * render site and again wherever the width is measured.
 */
function monthlyAmount(
  priceData: { amount: number } | null | undefined,
  period: BillingPeriod,
): number {
  if (!priceData) return 0;
  return period === "yearly" ? Math.round(priceData.amount / 12) : priceData.amount;
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
  /* Plan names sit one level under the section heading, whatever that is. On
     /pricing the section IS the page h1, so the cards must be h2 — hardcoding
     h3 there skipped a level (h1 → h3), which is what the audit flagged. On the
     home page the section is an h2 and the cards stay h3. */
  const CardHeading = headingLevel === "h1" ? "h2" : "h3";

  /**
   * Width reserved for every price in the row, in `ch`.
   *
   * Decided once for the SET of plans and for BOTH billing periods, so the
   * column never resizes when the figure changes — "$9" and "$49" occupy the
   * same box. Measuring per cell would move the column on every toggle, which
   * is the usual way a counter breaks a layout.
   *
   * This sits ABOVE the `!plans` early return, and has to: a hook after a
   * conditional return means React counts two hooks on the render where the
   * loader has not supplied plans yet and three on the render after it, which
   * throws "Rendered more hooks than during the previous render" the moment CMS
   * data arrives late. Hence the `?? []` — the guard belongs inside the hook,
   * not in front of it.
   */
  const priceWidthCh = useMemo(() => {
    let widest = 1;
    for (const plan of plans ?? []) {
      for (const period of ["monthly", "yearly"] as const) {
        const data = getDisplayPrice(plan, period);
        if (!data) continue;
        const text = formatPrice(data.symbol, monthlyAmount(data, period), data.currency);
        widest = Math.max(widest, text.length);
      }
    }
    return widest;
  }, [plans]);

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
    <section id="pricing">
      <div className="section">
        <div className="flex flex-col gap-8">
          {/* Heading + billing toggle */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <Heading className="section-h2 text-balance">
                {t("title")}
              </Heading>
              <p className="section-p mt-3">
                {t("subtitle")}
              </p>
            </div>

            <div className="inline-flex w-fit items-center rounded-[10px] bg-[#f1f1f0] p-1">
              <button
                type="button"
                aria-pressed={billingPeriod === "monthly"}
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "h-8 cursor-pointer rounded-md px-4 text-[13px] font-medium transition-all duration-150",
                  billingPeriod === "monthly"
                    ? "bg-white text-mist-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                    : "text-mist-400 hover:text-mist-700"
                )}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                aria-pressed={billingPeriod === "yearly"}
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-4 text-[13px] font-medium transition-all duration-150",
                  billingPeriod === "yearly"
                    ? "bg-white text-mist-900 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                    : "text-mist-400 hover:text-mist-700"
                )}
              >
                {t("yearly")}
                <span
                  className={cn(
                    "rounded-[3px] px-1.5 py-0.5 text-[10px] font-medium tabular-nums",
                    "bg-emerald-50 text-emerald-700"
                  )}
                >
                  −20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans — framed grid block, title + toggle stay outside */}
          {/* Columns split by hairlines — no card, no shadow. The frame already
              contains the block, so a second border would be a nested box. */}
          <div className="feat-row">
            {plans.map((plan, planIdx) => {
              const isPopular = plan.popular;
              const isEnterprise = plan.planId === "enterprise";
              const priceData = getDisplayPrice(plan, billingPeriod);
              const featureRows = featureRowsByPlan[planIdx]!;

              // Display price: CMS-driven with locale currency
              const displayPrice = isEnterprise
                ? t("customPrice")
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
                ? t("billedYearly", {total: yearlyTotal })
                : null;

              return (
                <div
                  key={plan.planId}
                  className="feat-item !gap-0"
                >
                  {/* Most-popular eyebrow — subtle, no pill */}
                  {isPopular ? (
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-mist-600">
                      <span aria-hidden>★</span>
                      {t("mostPopular")}
                    </p>
                  ) : (
                    <p className="text-[10px] mb-2 select-none invisible" aria-hidden>
                      placeholder
                    </p>
                  )}

                  {/* Plan name — one level under the section heading */}
                  <CardHeading className="text-[18px] font-medium tracking-[-0.02em] text-mist-900">
                    {plan.name}
                  </CardHeading>

                  {/* Description */}
                  <p className="mt-1.5 text-sm leading-relaxed text-mist-600 text-pretty">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1.5">
                      {/* A plan with a numeric price counts to its next value;
                          Enterprise ("Custom") has no number to count. */}
                      {isEnterprise || !priceData ? (
                        <span className="text-[40px] font-medium leading-none tracking-[-0.03em] text-mist-900 tabular-nums">
                          {displayPrice}
                        </span>
                      ) : (
                        <AnimatedPrice
                          value={monthlyAmount(priceData, billingPeriod)}
                          format={(amount) =>
                            formatPrice(priceData.symbol, amount, priceData.currency)
                          }
                          minCh={priceWidthCh}
                          className="text-[40px] font-medium leading-none tracking-[-0.03em] text-mist-900 tabular-nums"
                        />
                      )}
                      {!isEnterprise ? (
                        <span className="text-sm text-mist-500">
                          {t("perMonth")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-mist-500 min-h-[1rem]">
                      {billedYearlyNote ?? (isEnterprise ? t("annualBillingOnly") : " ")}
                    </p>
                  </div>

                  {/* CTA */}
                  <a
                    href={plan.ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${plan.ctaLabel} — Better I18N ${plan.name}`}
                    className={cn(
                      "btn btn-lg mt-5 w-fit",
                      isPopular ? "btn-dark" : "btn-outline"
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
                          {t(`labels.${limit.key}`)}
                        </span>
                        <span className="text-mist-950 font-medium tabular-nums">
                          {t(`limits.${limit.value}`)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Features — diff-only, rendered as one prose line per column instead of a list. */}
                  {featureRows.items.length > 0 ? (
                    <p className="mt-6 text-[13px] leading-relaxed text-mist-600 text-pretty">
                      {featureRows.prevPlanName ? (
                        <span className="text-mist-500">
                          {t("everythingInPlus", { plan: featureRows.prevPlanName })}{" "}
                        </span>
                      ) : null}
                      {featureRows.items
                        .map((feature) =>
                          t(`labels.${feature.key}`)
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
