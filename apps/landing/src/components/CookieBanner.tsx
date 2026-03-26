import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { cn } from "@better-i18n/ui/lib/utils";
import { useT } from "@/lib/i18n";
import { getConsent, hasConsent, setConsent } from "@/lib/cookie-consent";
import { loadAnalyticsScripts, updateConsentState } from "@/lib/analytics";

type ConsentView = "banner" | "customize";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<ConsentView>("banner");
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const { locale } = useParams({ strict: false });
  const currentLocale = locale || "en";
  const t = useT("cookieBanner");

  // Show banner if no consent decision exists
  useEffect(() => {
    if (!hasConsent()) {
      setVisible(true);
    }
  }, []);

  // Listen for re-open requests (from footer "Cookie Preferences" button)
  useEffect(() => {
    const handleShow = () => {
      const existing = getConsent();
      if (existing) {
        setAnalyticsEnabled(existing.analytics);
        setMarketingEnabled(existing.marketing);
      }
      setView("banner");
      setVisible(true);
    };
    window.addEventListener("bi18n:show-cookie-banner", handleShow);
    return () => window.removeEventListener("bi18n:show-cookie-banner", handleShow);
  }, []);

  const applyConsent = useCallback((analytics: boolean, marketing: boolean) => {
    setConsent({ analytics, marketing });
    const consent = getConsent()!;
    updateConsentState(consent);
    if (consent.analytics || consent.marketing) {
      loadAnalyticsScripts();
    }
    setVisible(false);
  }, []);

  const handleAcceptAll = useCallback(() => applyConsent(true, true), [applyConsent]);
  const handleRejectAll = useCallback(() => applyConsent(false, false), [applyConsent]);
  const handleSaveCustom = useCallback(
    () => applyConsent(analyticsEnabled, marketingEnabled),
    [applyConsent, analyticsEnabled, marketingEnabled],
  );

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t("ariaLabel", { defaultValue: "Cookie consent" })}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6",
        "animate-in slide-in-from-bottom duration-300",
      )}
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-mist-200 bg-white p-5 sm:p-6 shadow-lg">
        {view === "banner" ? (
          <BannerView
            t={t}
            locale={currentLocale}
            onAccept={handleAcceptAll}
            onReject={handleRejectAll}
            onCustomize={() => setView("customize")}
          />
        ) : (
          <CustomizeView
            t={t}
            locale={currentLocale}
            analyticsEnabled={analyticsEnabled}
            marketingEnabled={marketingEnabled}
            onAnalyticsChange={setAnalyticsEnabled}
            onMarketingChange={setMarketingEnabled}
            onSave={handleSaveCustom}
            onBack={() => setView("banner")}
          />
        )}
      </div>
    </div>
  );
}

// ─── Banner View ──────────────────────────────────────────────────────

interface BannerViewProps {
  t: ReturnType<typeof useT>;
  locale: string;
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
}

function BannerView({ t, locale, onAccept, onReject, onCustomize }: BannerViewProps) {
  return (
    <>
      <p className="text-sm text-mist-700 leading-relaxed mb-4">
        {t("message", {
          defaultValue:
            "We use cookies to improve your experience and analyze site traffic. You can accept all cookies, reject non-essential ones, or customize your preferences.",
        })}{" "}
        <Link
          to="/$locale/cookies"
          params={{ locale }}
          className="underline underline-offset-2 hover:text-mist-950"
        >
          {t("learnMore", { defaultValue: "Learn more" })}
        </Link>
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onAccept}
          className="rounded-lg bg-mist-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors cursor-pointer"
        >
          {t("acceptAll", { defaultValue: "Accept All" })}
        </button>
        <button
          type="button"
          onClick={onReject}
          className="rounded-lg bg-mist-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-mist-800 transition-colors cursor-pointer"
        >
          {t("rejectAll", { defaultValue: "Reject All" })}
        </button>
        <button
          type="button"
          onClick={onCustomize}
          className="rounded-lg border border-mist-300 px-4 py-2.5 text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors cursor-pointer"
        >
          {t("customize", { defaultValue: "Customize" })}
        </button>
      </div>
    </>
  );
}

// ─── Customize View ───────────────────────────────────────────────────

interface CustomizeViewProps {
  t: ReturnType<typeof useT>;
  locale: string;
  analyticsEnabled: boolean;
  marketingEnabled: boolean;
  onAnalyticsChange: (v: boolean) => void;
  onMarketingChange: (v: boolean) => void;
  onSave: () => void;
  onBack: () => void;
}

function CustomizeView({
  t,
  locale,
  analyticsEnabled,
  marketingEnabled,
  onAnalyticsChange,
  onMarketingChange,
  onSave,
  onBack,
}: CustomizeViewProps) {
  return (
    <>
      <h3 className="text-base font-medium text-mist-950 mb-4">
        {t("customizeTitle", { defaultValue: "Cookie Preferences" })}
      </h3>
      <div className="space-y-3 mb-5">
        {/* Essential — always on */}
        <CookieCategory
          label={t("essential.label", { defaultValue: "Essential" })}
          description={t("essential.description", {
            defaultValue: "Required for the website to function. Cannot be disabled.",
          })}
          checked
          disabled
        />
        {/* Analytics */}
        <CookieCategory
          label={t("analytics.label", { defaultValue: "Analytics" })}
          description={t("analytics.description", {
            defaultValue: "Help us understand how visitors use our site (Google Analytics).",
          })}
          checked={analyticsEnabled}
          onChange={onAnalyticsChange}
        />
        {/* Marketing */}
        <CookieCategory
          label={t("marketing.label", { defaultValue: "Marketing" })}
          description={t("marketing.description", {
            defaultValue: "Used for ad measurement and remarketing (Google Ads).",
          })}
          checked={marketingEnabled}
          onChange={onMarketingChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <Link
          to="/$locale/cookies"
          params={{ locale }}
          className="text-sm text-mist-500 underline underline-offset-2 hover:text-mist-700"
        >
          {t("cookiePolicy", { defaultValue: "Cookie Policy" })}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-mist-300 px-4 py-2 text-sm font-medium text-mist-700 hover:bg-mist-50 transition-colors cursor-pointer"
          >
            {t("back", { defaultValue: "Back" })}
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-mist-950 px-4 py-2 text-sm font-medium text-white hover:bg-mist-800 transition-colors cursor-pointer"
          >
            {t("savePreferences", { defaultValue: "Save Preferences" })}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Cookie Category Toggle ───────────────────────────────────────────

interface CookieCategoryProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}

function CookieCategory({ label, description, checked, disabled, onChange }: CookieCategoryProps) {
  return (
    <label
      className={cn(
        "flex items-start justify-between gap-4 rounded-lg border p-3",
        disabled ? "border-mist-100 bg-mist-50" : "border-mist-200",
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-mist-950">{label}</p>
        <p className="text-xs text-mist-500 mt-0.5">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => onChange?.(!checked)}
          className={cn(
            "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
            checked ? "bg-mist-950" : "bg-mist-300",
            disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
          )}
        >
          <span
            className={cn(
              "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
              checked ? "translate-x-4" : "translate-x-0.5",
            )}
          />
        </button>
      </div>
    </label>
  );
}
