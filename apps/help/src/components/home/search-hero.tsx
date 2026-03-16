import { useT } from "@/lib/i18n";
import { IconQuickSearch } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export function SearchHero() {
  const t = useT("home");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist-950 via-mist-900 to-mist-800 px-6 py-20 text-center sm:py-28">
      {/* Decorative radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),transparent)]" />

      {/* Subtle grid pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\' stroke=\'white\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="relative">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {t("title", "How can we help?")}
        </h1>
        <p className="mt-4 text-lg text-mist-300">
          {t("subtitle", "Find answers, guides, and resources for Better i18n")}
        </p>

        {/* Search input — Intercom-style solid white */}
        <div className="mx-auto mt-10 max-w-xl">
          <button
            type="button"
            onClick={() => document.dispatchEvent(new CustomEvent("open-search"))}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-5 py-3.5 text-left shadow-lg shadow-black/10 transition-all hover:shadow-xl hover:shadow-black/15"
          >
            <IconQuickSearch className="size-5 shrink-0 text-mist-400" />
            <span className="text-mist-500">{t("searchPlaceholder", "Search for articles, guides, and more...")}</span>
            <kbd className="ml-auto hidden rounded-lg border border-mist-200 bg-mist-50 px-2 py-0.5 text-xs font-medium text-mist-400 sm:inline">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </section>
  );
}
