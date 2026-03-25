/**
 * Cookie consent store — localStorage-based preference management.
 *
 * Stores user consent choices for analytics and marketing cookies.
 * Dispatches a custom event (`bi18n:consent-change`) so other modules
 * (analytics loader, cookie banner) can react to changes.
 */

const STORAGE_KEY = "bi18n_cookie_consent";

export interface CookieConsent {
  /** Whether analytics cookies (GA4, PostHog) are allowed */
  analytics: boolean;
  /** Whether marketing cookies (Google Ads, GTM remarketing) are allowed */
  marketing: boolean;
  /** ISO timestamp of when consent was given/updated */
  timestamp: string;
}

/** Read stored consent preferences. Returns `null` if user hasn't decided yet. */
export function getConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

/** Whether the user has made any consent decision (accept, reject, or custom). */
export function hasConsent(): boolean {
  return getConsent() !== null;
}

/** Save consent preferences and notify listeners. */
export function setConsent(prefs: Omit<CookieConsent, "timestamp">): void {
  if (typeof window === "undefined") return;
  const consent: CookieConsent = {
    ...prefs,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent("bi18n:consent-change", { detail: consent }));
}

/** Remove stored consent (user wants to re-decide). */
export function revokeConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("bi18n:consent-change", { detail: null }));
}

/** Accept all cookie categories. */
export function acceptAll(): void {
  setConsent({ analytics: true, marketing: true });
}

/** Reject all non-essential cookie categories. */
export function rejectAll(): void {
  setConsent({ analytics: false, marketing: false });
}
