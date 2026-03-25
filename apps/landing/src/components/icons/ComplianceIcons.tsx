// Compliance badge icons for footer trust signals.
// EU stars: custom, CCPA: based on CA state outline, Lock: standard padlock,
// Google: simpleicons.org slug "google", Shield: custom, US flag: custom.

/** EU flag-inspired circle of stars — represents GDPR compliance */
export function GdprIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
      {/* 12 stars in a circle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const cx = 12 + 7.5 * Math.cos(angle);
        const cy = 12 + 7.5 * Math.sin(angle);
        return <circle key={i} cx={cx} cy={cy} r="1.2" fill="currentColor" />;
      })}
    </svg>
  );
}

/** California outline silhouette — represents CCPA/CPRA */
export function CcpaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.5 2C11.2 2 9 2.8 8 3.5C7 4.2 6.2 5 5.5 6C4.8 7 4.5 8 4.2 9C3.9 10 3.8 11 4 12C4.2 13 4.5 14 5 15C5.5 16 6.2 17 7 17.8C7.8 18.6 8 19 8.5 19.5C9 20 9.5 20.5 10 21C10.5 21.5 11 21.8 11.5 22C12 22.2 12.5 22 13 21.5C13.5 21 14 20.5 14.5 20C15 19.5 15.5 18.8 16 18C16.5 17.2 17 16.5 17.5 15.5C18 14.5 18.3 13.5 18.5 12.5C18.7 11.5 18.8 10.5 18.7 9.5C18.6 8.5 18.2 7.5 17.5 6.5C16.8 5.5 16 4.8 15 4C14 3.2 13.2 2.5 12.5 2Z" />
    </svg>
  );
}

/** Brazil flag diamond shape — represents LGPD */
export function LgpdIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {/* Diamond shape like Brazilian flag */}
      <path
        d="M12 3L22 12L12 21L2 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Inner circle */}
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Google "G" logomark — simpleicons.org slug "google" */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

/** Shield with checkmark — represents US State Privacy Laws */
export function UsPrivacyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/** Padlock — represents TLS/encryption */
export function TlsLockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
