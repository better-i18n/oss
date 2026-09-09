import { useEffect, useState } from "react";
import { hasConsent } from "@/lib/cookie-consent";

/**
 * True once the visitor has answered the cookie banner (accept, reject or
 * custom). False on the server and until the first client effect, so SSR and
 * the first client render match.
 *
 * Exists because the support widget and the cookie banner both anchor to the
 * bottom of the viewport: the widget's dock covered the banner's buttons and
 * two visitors wrote in to say so (2026-09-06, 2026-09-09). Mounting the
 * widget only after the decision removes the overlap and also means the
 * widget's visitor cookie is not set before the visitor has seen the banner.
 */
export function useConsentDecision(): boolean {
  const [decided, setDecided] = useState(false);
  useEffect(() => {
    setDecided(hasConsent());
    const onChange = () => setDecided(hasConsent());
    window.addEventListener("bi18n:consent-change", onChange);
    return () => window.removeEventListener("bi18n:consent-change", onChange);
  }, []);
  return decided;
}
