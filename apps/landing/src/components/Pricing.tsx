import { cn } from "@better-i18n/ui/lib/utils";
import { useTranslations } from "@better-i18n/use-intl";
import { useState } from "react";
import { IconCheckmark1 } from "@central-icons-react/round-outlined-radius-2-stroke-2";

const CheckIcon = () => (
  <IconCheckmark1 className="h-5 w-5 shrink-0 text-mist-950" />
);

const plans = ["free", "pro", "enterprise"] as const;

const PLAN_PRICES = {
  free: { monthly: "$0", yearly: "$0" },
  pro: { monthly: "$19", yearly: "$15.20" },
  enterprise: { monthly: "Custom", yearly: "Custom" },
} as const;

export default function Pricing({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const t = useTranslations("pricing");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const Heading = headingLevel;

  return (
    <section id="pricing" className="py-16 bg-mist-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:gap-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Heading className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
              {t("title")}
            </Heading>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-2 rounded-full bg-mist-950/10 p-1">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  billingPeriod === "monthly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-700 hover:text-mist-950"
                )}
              >
                {t("monthly")}
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  billingPeriod === "yearly"
                    ? "bg-mist-950 text-white"
                    : "text-mist-700 hover:text-mist-950"
                )}
              >
                {t("yearly")}
                <span className={cn(
                  "text-xs rounded-full px-2 py-0.5",
                  billingPeriod === "yearly"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-700"
                )}>
                  {t("save20")}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((planKey) => {
              const name = t(`plans.${planKey}.name`);
              const price = PLAN_PRICES[planKey][billingPeriod];
              const description = t(`plans.${planKey}.description`);
              const cta = t(`plans.${planKey}.cta`);
              const isPopular = planKey === "pro";
              const featuresCount = planKey === "free" ? 5 : 6;
              const features = Array.from({ length: featuresCount }).map(
                (_, i) => t(`plans.${planKey}.features.${i}`),
              );
              const showTrial = planKey === "pro";
              const yearlyTotal = billingPeriod === "yearly" && planKey === "pro" ? "$182.40" : null;

              return (
                <div
                  key={planKey}
                  className="flex flex-col justify-between gap-6 rounded-xl bg-mist-950/[0.025] p-6"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl/8 tracking-tight text-mist-950">
                        {name}
                      </h3>
                      {isPopular && (
                        <span className="inline-flex rounded-full bg-mist-950/10 px-2 text-xs/6 font-medium text-mist-950">
                          {t("mostPopular")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 inline-flex items-baseline gap-1 text-base/7">
                      <span className="text-3xl font-bold text-mist-950">{price}</span>
                      {planKey !== "enterprise" && (
                        <span className="text-mist-500">{t("perMonth")}</span>
                      )}
                    </p>
                    {yearlyTotal && (
                      <p className="text-xs text-mist-500">
                        {t("billedYearly", { total: yearlyTotal })}
                      </p>
                    )}
                    <p className="mt-4 text-sm/6 text-mist-700">
                      {description}
                    </p>
                    {showTrial && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        <span className="rounded-full bg-blue-100 px-2 py-0.5">
                          {t("trialBadge")}
                        </span>
                      </p>
                    )}
                    <ul className="mt-4 space-y-2 text-sm/6 text-mist-700">
                      {features.map((feature, i) => (
                        <li key={i} className="flex gap-3">
                          <CheckIcon />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a
                    href={
                      planKey === "enterprise"
                        ? "mailto:sales@better-i18n.com"
                        : "/login"
                    }
                    aria-label={t(`plans.${planKey}.ctaAriaLabel`, {
                      defaultValue: `${cta} — Better i18n ${name}`,
                    })}
                    className={cn(
                      "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                      isPopular
                        ? "bg-mist-950 text-white hover:bg-mist-800"
                        : "bg-mist-950/10 text-mist-950 hover:bg-mist-950/15",
                    )}
                  >
                    {cta}
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
