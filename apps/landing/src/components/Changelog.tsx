import { Link, useParams } from "@tanstack/react-router";
import { IconArrowRight } from "@central-icons-react/round-outlined-radius-2-stroke-2";
import { useTranslations } from "@better-i18n/use-intl";

const changelogs = [
  {
    badge: { text: "New", color: "bg-emerald-500/10 text-emerald-700" },
    date: "Jan 12, 2026",
    title: "MCP Server Integration for AI-powered Translation Workflows",
  },
  {
    badge: { text: "Integration", color: "bg-blue-500/10 text-blue-700" },
    date: "Jan 5, 2026",
    title: "DeepL Integration with Automatic Glossary Sync",
  },
  {
    badge: { text: "Feature", color: "bg-violet-500/10 text-violet-700" },
    date: "Dec 20, 2025",
    title: "Custom Glossary Management and Term Consistency",
  },
  {
    badge: { text: "v2.3", color: "bg-amber-500/10 text-amber-700" },
    date: "Dec 10, 2025",
    title: "Translation Memory, Context Detection, and Batch API",
  },
];

export default function Changelog() {
  const { locale } = useParams({ strict: false });
  const t = useTranslations("changelog");

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <h2 className="font-display text-3xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 mb-8 sm:text-4xl/[1.1]">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {changelogs.map((item, index) => (
            <a
              key={index}
              href="#"
              className="group flex flex-col rounded-xl bg-mist-950/[0.025] p-5 hover:bg-mist-950/[0.05] transition-colors"
            >
              <div className="flex items-center gap-3 text-mist-500 mb-3">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${item.badge.color}`}
                >
                  {item.badge.text}
                </span>
                <time className="text-sm">{item.date}</time>
              </div>
              <p className="text-base/7 text-mist-950 group-hover:text-mist-700">
                {item.title}
              </p>
            </a>
          ))}
        </div>
        <div className="mt-6">
          <Link
            to="/$locale/changelog"
            params={{ locale: locale || "en" }}
            className="inline-flex items-center gap-1 text-sm font-medium text-mist-700 hover:text-mist-950"
          >
            {t("seeWhatsNew")}
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
