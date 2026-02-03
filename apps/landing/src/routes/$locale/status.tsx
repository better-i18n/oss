import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { getPageHead, createPageLoader } from "@/lib/page-seo";
import { useTranslations } from "@better-i18n/use-intl";
import { IconCheckmark1 } from "@central-icons-react/round-outlined-radius-2-stroke-2";

export const Route = createFileRoute("/$locale/status")({
  loader: createPageLoader(),
  head: ({ loaderData }) => {
    return getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "status",
      pathname: "/status",
    });
  },
  component: StatusPage,
});

function StatusPage() {
  const t = useTranslations("statusPage");

  const services = [
    { nameKey: "services.api", status: "operational", uptime: "99.99%" },
    { nameKey: "services.dashboard", status: "operational", uptime: "99.98%" },
    { nameKey: "services.cdn", status: "operational", uptime: "100%" },
    { nameKey: "services.githubSync", status: "operational", uptime: "99.95%" },
    { nameKey: "services.aiTranslation", status: "operational", uptime: "99.90%" },
    { nameKey: "services.webhookDelivery", status: "operational", uptime: "99.97%" },
  ];

  const recentIncidents: { date: string; title: string; status: string }[] = [];
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <MarketingLayout showCTA={false} bgClassName="bg-white">
      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            allOperational ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}>
            <div className={`size-2 rounded-full ${
              allOperational ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
            }`} />
            <span className="text-sm font-medium">
              {allOperational ? t("allOperational") : t("partialOutage")}
            </span>
          </div>
          <h1 className="font-display text-4xl/[1.1] font-medium tracking-[-0.02em] text-mist-950 sm:text-5xl/[1.1]">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg text-mist-700">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-8">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="rounded-xl border border-mist-200 overflow-hidden">
            {services.map((service, i) => (
              <div
                key={service.nameKey}
                className={`flex items-center justify-between p-4 ${
                  i !== services.length - 1 ? "border-b border-mist-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`size-2 rounded-full ${
                    service.status === "operational" ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                  <span className="text-sm font-medium text-mist-950">{t(service.nameKey)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-mist-500">{service.uptime} {t("uptime")}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    service.status === "operational"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {service.status === "operational" ? t("operational") : t("degraded")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime Graph Placeholder */}
      <section className="py-8">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="text-base font-medium text-mist-950 mb-4">{t("uptimeGraph.title")}</h2>
          <div className="flex gap-0.5">
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-8 bg-emerald-500 rounded-sm first:rounded-l last:rounded-r"
                title={`Day ${90 - i}: 100% uptime`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-mist-500">
            <span>{t("uptimeGraph.daysAgo")}</span>
            <span>{t("uptimeGraph.today")}</span>
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="text-base font-medium text-mist-950 mb-4">{t("incidents.title")}</h2>
          {recentIncidents.length === 0 ? (
            <div className="p-8 rounded-xl bg-mist-50 border border-mist-100 text-center">
              <IconCheckmark1 className="size-8 text-emerald-500 mx-auto mb-3" />
              <p className="text-sm text-mist-700">{t("incidents.noIncidents")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIncidents.map((incident, i) => (
                <div key={i} className="p-4 rounded-lg border border-mist-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-mist-950">{incident.title}</span>
                    <span className="text-xs text-mist-500">{incident.date}</span>
                  </div>
                  <span className="text-xs text-mist-600">{incident.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-8 pb-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-10 text-center">
          <p className="text-sm text-mist-700 mb-4">
            {t("subscribe.text")}
          </p>
          <a
            href="mailto:status@better-i18n.com?subject=Subscribe to Status Updates"
            className="inline-flex items-center justify-center rounded-full bg-mist-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-mist-800"
          >
            {t("subscribe.button")}
          </a>
        </div>
      </section>
    </MarketingLayout>
  );
}
