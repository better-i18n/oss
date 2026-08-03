import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/MarketingLayout";
import { BackToHub } from "@/components/BackToHub";
import {
  CodeExample,
  FeatureList,
  FrameworkCTA,
  FrameworkHero,
  OtherFrameworks,
  SetupGuide,
} from "@/components/FrameworkComparison";
import { ComparisonRelatedTopics } from "@/components/ComparisonTable";
import { createPageLoader, getPageHead } from "@/lib/page-seo";
import { useT } from "@/lib/i18n";

/**
 * `/i18n/rust/` — the fastest-growing query with nothing to receive it
 * (130 impressions, +143%, no page of ours).
 *
 * **There is no Better I18N Rust SDK.** `packages/` ships core, use-intl, next,
 * expo, server, remix, cli, sdk, mcp and flutter — no crate. This page therefore
 * never says "our Rust SDK"; it documents what genuinely works from Rust today,
 * which is the language-independent surface: the CDN serves plain JSON over
 * HTTPS and the REST API is ordinary HTTP. `reqwest` + `serde_json` is all a
 * Rust service needs, and the copy says out loud that no crate exists so a
 * reader is never sent looking for one.
 *
 * For the in-process lookup side it names `rust-i18n`, the crate the ecosystem
 * actually converged on (656 stars against 48 for the runner-up) — we integrate
 * with it rather than pretending to replace it.
 */
export const Route = createFileRoute("/$locale/i18n/rust")({
  loader: createPageLoader(),
  head: ({ loaderData }) =>
    getPageHead({
      messages: loaderData?.messages || {},
      locale: loaderData?.locale || "en",
      pageKey: "i18nRust",
      pathname: "/i18n/rust",
      pageType: "framework",
      metaFallback: {
        title: "Rust i18n Guide",
        /* 149 characters. The first draft ran 180 and would have been cut in
           the SERP; the "no SDK" clause stays because it is the page's premise. */
        description:
          "Localize a Rust service with Better I18N. There is no Rust SDK — fetch the same CDN JSON with reqwest and serde_json, no rebuild required.",
      },
      structuredDataOptions: {
        framework: "Rust",
        frameworkDescription:
          "Rust internationalization using Better I18N's CDN JSON and REST API directly — no SDK required, works with axum, actix and rust-i18n.",
        dependencies: ["reqwest", "serde_json"],
      },
    }),
  component: RustI18nPage,
});

/* Key suffixes, not copy — resolved with t() in the component. */
const FEATURE_KEYS = [
  "noSdk",
  "plainJson",
  "anyRuntime",
  "cdn",
  "restApi",
  "crateFriendly",
];

function RustI18nPage() {
  const t = useT("marketing");
  const { locale } = Route.useParams();

  const setupSteps = [
    {
      step: 1,
      id: "step1",
      code: `[dependencies]
reqwest = { version = "0.12", features = ["json"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }`,
      fileName: "Cargo.toml",
    },
    {
      step: 2,
      id: "step2",
      code: `use std::collections::HashMap;

/// The CDN serves one JSON file per namespace, per locale:
///   https://cdn.better-i18n.com/{org}/{project}/{locale}/{namespace}.json
/// It always answers 200 — an unknown locale returns \`{}\` rather than an error.
pub async fn fetch_messages(
    locale: &str,
    namespace: &str,
) -> reqwest::Result<HashMap<String, serde_json::Value>> {
    let url = format!(
        "https://cdn.better-i18n.com/your-org/your-project/{locale}/{namespace}.json"
    );

    reqwest::get(&url).await?.json().await
}`,
      fileName: "src/i18n.rs",
    },
    {
      step: 3,
      id: "step3",
      code: `use std::time::Duration;

// Cache in process and re-read on an interval: the CDN sets
// \`Cache-Control: max-age=60\`, so a 60s refresh matches it exactly.
tokio::spawn(async move {
    let mut ticker = tokio::time::interval(Duration::from_secs(60));
    loop {
        ticker.tick().await;
        if let Ok(next) = fetch_messages("en", "common").await {
            *messages.write().await = next;
        }
    }
});`,
      fileName: "src/main.rs",
    },
  ];

  const steps = setupSteps.map((step) => ({
    ...step,
    title: t(`i18n.rust.setup.${step.id}.title`),
    description: t(`i18n.rust.setup.${step.id}.description`),
  }));

  const features = FEATURE_KEYS.map((k) => t(`i18n.rust.features.${k}`));

  const codeExample = `use axum::{extract::State, routing::get, Json, Router};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::RwLock;

type Messages = Arc<RwLock<HashMap<String, serde_json::Value>>>;

async fn greeting(State(messages): State<Messages>) -> Json<serde_json::Value> {
    let messages = messages.read().await;

    let hello = messages
        .get("greeting.hello")
        .and_then(|v| v.as_str())
        .unwrap_or("Hello");

    Json(serde_json::json!({ "message": hello }))
}

#[tokio::main]
async fn main() {
    let messages: Messages = Arc::new(RwLock::new(
        fetch_messages("en", "common").await.unwrap_or_default(),
    ));

    let app = Router::new()
        .route("/greeting", get(greeting))
        .with_state(messages);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}`;

  const relatedLinks = [
    {
      title: "Server-side i18n",
      to: "/$locale/i18n/server",
      description:
        "The same request-scoped translator pattern, in the runtime that does have an SDK.",
    },
    {
      title: "Hono i18n",
      to: "/$locale/i18n/hono",
      description:
        "If part of your stack is TypeScript, this is the API-side equivalent.",
    },
    {
      title: "Ruby i18n",
      to: "/$locale/i18n/ruby",
      description:
        "Another runtime we serve over the CDN and REST API rather than a native package.",
    },
  ];

  return (
    <MarketingLayout showCTA={false}>
      <BackToHub hub="i18n" locale={locale} />
      <FrameworkHero
        title={t("i18n.rust.hero.title")}
        subtitle={t("i18n.rust.hero.subtitle")}
        badgeText={t("i18n.rust.hero.badge")}
      />

      <SetupGuide title={t("i18n.rust.setup.title")} steps={steps} />

      <FeatureList title={t("i18n.rust.featuresTitle")} features={features} />

      <CodeExample
        title={t("i18n.rust.codeExample.title")}
        description={t("i18n.rust.codeExample.description")}
        code={codeExample}
      />

      <ComparisonRelatedTopics
        heading={t("i18n.rust.relatedTitle")}
        links={relatedLinks}
        locale={locale}
      />

      <OtherFrameworks
        title={t("i18n.rust.otherFrameworks")}
        currentFramework="rust"
        locale={locale}
      />

      <FrameworkCTA
        title={t("i18n.rust.cta.title")}
        subtitle={t("i18n.rust.cta.subtitle")}
        primaryCTA={t("i18n.rust.cta.primary")}
        primaryHref="https://dash.better-i18n.com"
        secondaryCTA={t("i18n.rust.cta.secondary")}
        secondaryHref="https://docs.better-i18n.com/"
      />
    </MarketingLayout>
  );
}
