/**
 * Consent-gated analytics loader.
 *
 * Google Consent Mode v2 default state is always set (denied).
 * GTM + GA4 scripts are only injected after the user grants consent.
 */

import { getConsent, type CookieConsent } from "./cookie-consent";

const GTM_ID = "GTM-K2JQTFM3";
const GA4_ID = "G-1QZTX3QHPX";

let analyticsLoaded = false;

/** Ensure dataLayer and gtag function exist. */
function ensureGtagGlobals(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // Standard gtag shim — pushes args to dataLayer for GTM to process
    window.gtag = ((...args: unknown[]) => {
      window.dataLayer!.push(args as unknown as Record<string, unknown>);
    }) as Window["gtag"];
  }
}

/**
 * Set Google Consent Mode v2 defaults — called once on page load,
 * BEFORE any GTM/GA4 scripts. This ensures Google respects denied
 * state even if scripts load before consent is given.
 */
export function initConsentDefaults(): void {
  if (typeof window === "undefined") return;
  ensureGtagGlobals();

  // Check if we already have consent stored
  const consent = getConsent();
  const analyticsGranted = consent?.analytics ? "granted" : "denied";
  const marketingGranted = consent?.marketing ? "granted" : "denied";

  window.gtag!("consent", "default", {
    analytics_storage: analyticsGranted,
    ad_storage: marketingGranted,
    ad_user_data: marketingGranted,
    ad_personalization: marketingGranted,
    wait_for_update: 500,
  });
}

/** Update Google Consent Mode after user makes a choice. */
export function updateConsentState(consent: CookieConsent): void {
  if (typeof window === "undefined") return;
  ensureGtagGlobals();

  window.gtag!("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
}

/** Dynamically inject GTM + GA4 scripts into <head>. Only runs once. */
export function loadAnalyticsScripts(): void {
  if (typeof window === "undefined" || analyticsLoaded) return;

  const consent = getConsent();
  if (!consent?.analytics && !consent?.marketing) return;

  analyticsLoaded = true;
  ensureGtagGlobals();

  // GTM
  window.dataLayer!.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(gtmScript);

  // GA4 (gtag.js)
  const ga4Script = document.createElement("script");
  ga4Script.async = true;
  ga4Script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  ga4Script.onload = () => {
    window.gtag!("js", new Date());
    window.gtag!("config", GA4_ID);
  };
  document.head.appendChild(ga4Script);
}

/**
 * Initialize analytics on page load.
 * Sets consent defaults, then loads scripts if consent was previously given.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  initConsentDefaults();

  const consent = getConsent();
  if (consent?.analytics || consent?.marketing) {
    loadAnalyticsScripts();
  }
}

// Global type augmentation
declare global {
  interface Window {
    // biome-ignore lint: GTM dataLayer accepts mixed types
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: {
      (command: "consent", action: "default" | "update", params: Record<string, string | number>): void;
      (command: "js", date: Date): void;
      (command: "config", targetId: string): void;
      (command: "event", eventName: string, params?: Record<string, unknown>): void;
    };
  }
}
