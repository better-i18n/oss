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
      aria-label={t("ariaLabel")}
      className={cn(
        "fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6",
        "animate-in slide-in-from-bottom duration-300",
      )}
    >
      {/* A fixed overlay, not a page section — <Section>/<Frame> do not apply.
          --shadow-card is the sanctioned elevation for a floating surface. */}
      <div className="mx-auto max-w-2xl rounded-xl border border-black/[0.07] bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
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
      <p className="mb-4 text-sm leading-relaxed text-mist-600">
        {t("message")}{" "}
        <Link
          to="/$locale/cookies/"
          params={{ locale }}
          className="underline underline-offset-2 hover:text-mist-950"
        >
          {t("learnMore")}
        </Link>
      </p>
      {/* Hand-rolled button styling replaced by the shared .btn scale — accept
          is the primary action, the other two are peers of each other. */}
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-3">
        <button type="button" onClick={onAccept} className="btn btn-dark btn-sm">
          {t("acceptAll")}
        </button>
        <button type="button" onClick={onReject} className="btn btn-outline btn-sm">
          {t("rejectAll")}
        </button>
        <button type="button" onClick={onCustomize} className="btn btn-ghost btn-sm">
          {t("customize")}
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
      <h3 className="mb-4 text-[15px] font-medium tracking-[-0.015em] text-mist-900">
        {t("customizeTitle")}
      </h3>
      <div className="mb-5 space-y-2">
        {/* Essential — always on */}
        <CookieCategory
          label={t("essential.label")}
          description={t("essential.description")}
          checked
          disabled
        />
        {/* Analytics */}
        <CookieCategory
          label={t("analytics.label")}
          description={t("analytics.description")}
          checked={analyticsEnabled}
          onChange={onAnalyticsChange}
        />
        {/* Marketing */}
        <CookieCategory
          label={t("marketing.label")}
          description={t("marketing.description")}
          checked={marketingEnabled}
          onChange={onMarketingChange}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/$locale/cookies/"
          params={{ locale }}
          className="text-[13px] text-mist-500 underline underline-offset-2 hover:text-mist-900"
        >
          {t("cookiePolicy")}
        </Link>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="btn btn-outline btn-sm">
            {t("back")}
          </button>
          <button type="button" onClick={onSave} className="btn btn-dark btn-sm">
            {t("savePreferences")}
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
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const labelId = `cookie-cat-${slug}`;
  const descId = `cookie-cat-${slug}-desc`;

  return (
    // Not a <label>: the control is a role="switch" button, and a label can only
    // be associated with a real form control. The switch carries its own
    // accessible name via aria-labelledby pointing at the visible title.
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-md border border-black/[0.07] p-3",
        // bg-mist-50 is the sanctioned thin in-section surface; it marks the
        // row as locked rather than as a different kind of card.
        disabled && "bg-mist-50",
      )}
    >
      <div className="min-w-0 flex-1">
        <p id={labelId} className="text-[13px] font-medium text-mist-900">{label}</p>
        <p id={descId} className="mt-0.5 text-xs leading-relaxed text-mist-600">
          {description}
        </p>
      </div>
      <div className="shrink-0 pt-0.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={labelId}
          aria-describedby={descId}
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
    </div>
  );
}
