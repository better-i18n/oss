// Compliance badge icons for footer trust signals.
// Sources: flag-icons (EU, Brazil), Bootstrap Icons (shield-check, lock-fill), Google brand.

/** EU flag — 12 gold stars on blue. Source: flag-icons/eu.svg */
export function GdprIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480">
      <defs>
        <g id="gdpr-d">
          <g id="gdpr-b">
            <path id="gdpr-a" d="m0-1-.3 1 .5.1z" fill="#fc0" />
            <use href="#gdpr-a" transform="scale(-1 1)" />
          </g>
          <g id="gdpr-c">
            <use href="#gdpr-b" transform="rotate(72)" />
            <use href="#gdpr-b" transform="rotate(144)" />
          </g>
          <use href="#gdpr-c" transform="scale(-1 1)" />
        </g>
      </defs>
      <path fill="#039" d="M0 0h640v480H0z" />
      <g fill="#fc0" transform="translate(320 242.3)scale(23.7037)">
        <use href="#gdpr-d" y="-6" />
        <use href="#gdpr-d" y="6" />
        <g id="gdpr-e">
          <use href="#gdpr-d" x="-6" />
          <use href="#gdpr-d" transform="rotate(-144 -2.3 -2.1)" />
          <use href="#gdpr-d" transform="rotate(144 -2.1 -2.3)" />
          <use href="#gdpr-d" transform="rotate(72 -4.7 -2)" />
          <use href="#gdpr-d" transform="rotate(72 -5 .5)" />
        </g>
        <use href="#gdpr-e" transform="scale(-1 1)" />
      </g>
    </svg>
  );
}

/** Shield with checkmark — reused for CCPA/CPRA and US State Privacy Laws. Source: Bootstrap Icons shield-check */
function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
    </svg>
  );
}

/** CCPA/CPRA compliance badge icon. */
export function CcpaIcon({ className }: { className?: string }) {
  return <ShieldCheckIcon className={className} />;
}

/** Brazil flag — green, yellow diamond, blue circle. Source: flag-icons/br.svg (simplified) */
export function LgpdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480">
      <path fill="#229e45" fillRule="evenodd" d="M0 0h640v480H0z" />
      <path fill="#f8e509" fillRule="evenodd" d="m321.4 436 301.5-195.7L319.6 44 17.1 240.7z" />
      <path fill="#2b49a3" fillRule="evenodd" d="M452.8 240c0 70.3-57.1 127.3-127.6 127.3A127.4 127.4 0 1 1 452.8 240" />
      <path fill="#fff" fillRule="evenodd" d="M444.4 285.8a125 125 0 0 0 5.8-19.8c-67.8-59.5-143.3-90-238.7-83.7a125 125 0 0 0-8.5 20.9c113-10.8 196 39.2 241.4 82.6" />
    </svg>
  );
}

/** Google 4-color "G" logomark — Google Consent Mode. Source: Google brand guidelines */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-0.5 0 48 48" fill="none">
      <path fill="#FBBC05" d="M9.827 24c0-1.524.253-2.986.705-4.356L2.623 13.604C1.082 16.734.214 20.26.214 24c0 3.736.867 7.261 2.406 10.388l7.904-6.05C10.077 26.973 9.827 25.517 9.827 24" />
      <path fill="#EB4335" d="M23.714 10.133c3.311 0 6.302 1.173 8.652 3.093L39.202 6.4C35.036 2.773 29.695.533 23.714.533 14.427.533 6.445 5.844 2.623 13.604l7.91 6.04c1.822-5.532 7.016-9.511 13.18-9.511" />
      <path fill="#34A853" d="M23.714 37.867c-6.165 0-11.359-3.979-13.182-9.511l-7.909 6.039C6.445 42.156 14.427 47.467 23.714 47.467c5.732 0 11.204-2.035 15.311-5.849l-7.507-5.804c-2.118 1.334-4.785 2.053-7.804 2.053" />
      <path fill="#4285F4" d="M46.145 24c0-1.387-.186-2.877-.506-4.267H23.714v9.067h12.604c-.63 3.091-2.346 5.468-4.8 7.014l7.507 5.805C43.339 37.614 46.145 31.649 46.145 24" />
    </svg>
  );
}

/** US State Privacy Laws compliance badge icon. */
export function UsPrivacyIcon({ className }: { className?: string }) {
  return <ShieldCheckIcon className={className} />;
}

/** Filled padlock — TLS/encryption. Source: Bootstrap Icons lock-fill */
export function TlsLockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path fillRule="evenodd" d="M8 0a4 4 0 0 1 4 4v2.05a2.5 2.5 0 0 1 2 2.45v5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 13.5v-5a2.5 2.5 0 0 1 2-2.45V4a4 4 0 0 1 4-4m0 1a3 3 0 0 0-3 3v2h6V4a3 3 0 0 0-3-3" />
    </svg>
  );
}
