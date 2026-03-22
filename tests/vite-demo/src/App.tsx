import { BetterI18nProvider, LocaleDropdown, useTranslations, useLocale } from "@better-i18n/use-intl";

/**
 * Demo: Zero-FOUC Vite integration
 *
 * Notice: NO project, locale, or messages props on the provider.
 * Everything is auto-injected by the @better-i18n/vite plugin.
 *
 * Check the Network tab — NO CDN requests from the browser.
 * Check View Source — translations embedded in <script id="__better_i18n__">.
 */
export function App() {
  return (
    <BetterI18nProvider>
      <div style={{ fontFamily: "system-ui", maxWidth: 600, margin: "40px auto", padding: 20 }}>
        <Header />
        <hr style={{ margin: "24px 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
        <TranslationDemo />
        <LocaleInfo />
      </div>
    </BetterI18nProvider>
  );
}

function Header() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>Better i18n — Vite Demo</h1>
      <LocaleDropdown />
    </div>
  );
}

function TranslationDemo() {
  const t = useTranslations();

  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Translations</h2>
      <pre style={{
        background: "#f3f4f6",
        padding: 16,
        borderRadius: 8,
        fontSize: 13,
        overflow: "auto",
      }}>
        {JSON.stringify(
          {
            "landing.hero.title.line1": safeT(t, "landing.hero.title.line1"),
            "landing.hero.title.line2": safeT(t, "landing.hero.title.line2"),
            "landing.hero.description": safeT(t, "landing.hero.description"),
            "landing.nav.pricing": safeT(t, "landing.nav.pricing"),
            "landing.footer.link.pricing": safeT(t, "landing.footer.link.pricing"),
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}

function LocaleInfo() {
  const { locale, setLocale } = useLocale();

  return (
    <div style={{ marginTop: 20 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12 }}>Locale State</h2>
      <p>Current locale: <strong>{locale}</strong></p>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button onClick={() => setLocale("en")} disabled={locale === "en"}
          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer" }}>
          English
        </button>
        <button onClick={() => setLocale("tr")} disabled={locale === "tr"}
          style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db", cursor: "pointer" }}>
          Turkce
        </button>
      </div>
    </div>
  );
}

/** Safe translation lookup — returns key name if not found */
function safeT(t: ReturnType<typeof useTranslations>, key: string): string {
  try {
    return t(key as never);
  } catch {
    return `[missing: ${key}]`;
  }
}
