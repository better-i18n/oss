import { SpriteIcon, type SpriteIconName } from "@/components/SpriteIcon";
import {
  Divider,
  FeatureGrid,
  Section,
} from "@/components/ui/page";

/**
 * SdkFlow — "where does a string actually come from" as a diagram.
 *
 * The framework pages were 15 consecutive code blocks with no picture of the
 * system: a reader could copy the snippets and still not know what the SDK does
 * at runtime, what is cached where, or what happens when the network fails.
 * This draws the real path — app → client → edge → object store — plus the
 * fallback chain and the publish path, using the numbers the platform actually
 * ships (60s CDN max-age, 60s in-memory TTL, HTTP 200 on every CDN response,
 * zero-dependency client).
 *
 * Built from DOM + hairlines rather than one big SVG: text stays selectable and
 * at a fixed size instead of scaling with the viewport, and the row reflows to a
 * vertical stack under `lg` by flipping the connector chevrons — no measuring,
 * no state, no animation, identical output during SSR.
 */

export type FlowNode = {
  icon: SpriteIconName;
  title: string;
  /** One line of what this hop does. */
  meta: string;
  /** Optional 10px caption: what it costs or how long it holds. */
  detail?: string;
  /** Dim the node when it is a cold path rather than the common one. */
  muted?: boolean;
};

export type FlowStat = { value: string; label: string };

/* ─── One hop ──────────────────────────────────────────────────────────── */

function Node({ node }: { node: FlowNode }) {
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-black/[0.07] bg-white px-3.5 py-3 ${ node.muted ? "opacity-60" : "" }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-sm border border-black/[0.04] bg-black/[0.03] text-mist-600">
          <SpriteIcon name={node.icon} className="size-3.5" aria-hidden="true" />
        </span>
        <span className="truncate text-[13px] font-medium tracking-[-0.015em] text-mist-900">
          {node.title}
        </span>
      </div>
      <p className="text-[12px] leading-[1.45] text-mist-600">{node.meta}</p>
      {node.detail && (
        <p className="mt-auto font-mono text-[10px] text-mist-400">{node.detail}</p>
      )}
    </div>
  );
}

/** Chevron between hops: points right in a row, down in a stack. */
function Connector() {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center py-1 lg:px-2 lg:py-0"
    >
      <SpriteIcon
        name="chevron-right"
        className="size-3.5 rotate-90 text-mist-300 lg:rotate-0"
      />
    </span>
  );
}

function FlowRow({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="flex flex-col items-stretch lg:flex-row lg:items-stretch">
      {nodes.map((node, index) => (
        <div
          key={node.title}
          className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-stretch"
        >
          <Node node={node} />
          {index < nodes.length - 1 && <Connector />}
        </div>
      ))}
    </div>
  );
}

/* ─── Section ──────────────────────────────────────────────────────────── */

/**
 * Internal. Pages use <CoreSdkFlow> below, which fills this in with the real
 * platform architecture — exporting both invited the two to drift apart.
 */
function SdkFlow({
  eyebrow,
  title,
  subtitle,
  readPath,
  readLabel,
  fallbackLabel,
  fallbacks,
  publishLabel,
  publishPath,
  stats,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** The happy path, left to right. */
  readPath: FlowNode[];
  readLabel: string;
  /** Ordered fallback layers, tried top to bottom when the hop above fails. */
  fallbackLabel: string;
  fallbacks: string[];
  /** How a new string travels from the dashboard to the app. */
  publishLabel: string;
  publishPath: FlowNode[];
  stats: FlowStat[];
}) {
  return (
    <>
      <Divider />
      <Section>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-h2" style={{ maxWidth: "22ch" }}>
          {title}
        </h2>
        <p className="section-p mt-3">{subtitle}</p>

        {/* Read path — what happens on every render */}
        <p className="mt-8 mb-3 text-[11px] font-medium text-mist-400">{readLabel}</p>
        <FlowRow nodes={readPath} />

        {/* Fallback chain — ordered, so the numbers carry the meaning */}
        <p className="mt-8 mb-3 text-[11px] font-medium text-mist-400">{fallbackLabel}</p>
        <div>
          <FeatureGrid cols="sm:grid-cols-2 lg:grid-cols-5" inset={14} padY={12}>
            {fallbacks.map((layer, index) => (
              <div
                key={layer}
                className="feat-cell flex items-baseline gap-2.5"
              >
                <span className="w-3 shrink-0 font-mono text-[10px] tabular-nums text-mist-400">
                  {index + 1}
                </span>
                <span className="text-[12px] leading-[1.45] text-mist-700">{layer}</span>
              </div>
            ))}
          </FeatureGrid>
        </div>

        {/* Publish path — the write direction */}
        <p className="mt-8 mb-3 text-[11px] font-medium text-mist-400">{publishLabel}</p>
        <FlowRow nodes={publishPath} />

        {/* The numbers behind the diagram */}
        <div className="mt-8">
          <FeatureGrid cols="grid-cols-2 lg:grid-cols-4" inset={16} padY={16}>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="feat-cell flex flex-col gap-1.5"
              >
                <span className="text-[28px] font-medium leading-none tracking-[-0.03em] tabular-nums text-mist-950">
                  {stat.value}
                </span>
                <span className="text-[11px] font-medium text-mist-400">{stat.label}</span>
              </div>
            ))}
          </FeatureGrid>
        </div>
      </Section>
    </>
  );
}

/* ─── The standard @better-i18n/core architecture ─────────────────────────
   Every framework page tells the same runtime story — only the first hop's
   name changes. Keeping it in one component means the architecture cannot
   drift between 17 pages, and a change to the platform is one edit here.

   Sources for the numbers: packages/core (TTL 60s default, timeout + 1 retry,
   5-layer fallback, zero dependencies), the CDN worker (max-age=60, HTTP 200 on
   every response, purge fired by the sync worker after publish). */

export function CoreSdkFlow({
  eyebrow = "How it works",
  title,
  subtitle,
  appTitle,
  appMeta,
  clientMeta = "getMessages(locale) — served from the in-memory cache if it is warm.",
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  /** e.g. "Your Angular app" */
  appTitle: string;
  /** What the framework layer does with the messages it already holds. */
  appMeta: string;
  /** Override when the framework calls the client somewhere specific. */
  clientMeta?: string;
}) {
  return (
    <SdkFlow
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      readLabel="Read path — every locale load"
      readPath={[
        { icon: "code", title: appTitle, meta: appMeta, detail: "0 network calls per render" },
        {
          icon: "zap",
          title: "@better-i18n/core",
          meta: clientMeta,
          detail: "60s TTL · 0 deps",
        },
        {
          icon: "globe",
          title: "CDN edge",
          meta: "Cloudflare worker answers from the nearest edge cache.",
          detail: "max-age=60 · always 200",
        },
        {
          icon: "api-connection",
          title: "R2 object store",
          meta: "The published translation files the sync worker wrote.",
          detail: "source of truth",
        },
      ]}
      fallbackLabel="Fallback chain — tried in order when a hop fails"
      fallbacks={[
        "In-memory TTL cache",
        "CDN fetch, with timeout and one retry",
        "Persistent storage, if configured",
        "staticData bundled with the app",
        "Throw — after everything above missed",
      ]}
      publishLabel="Write path — dashboard to app"
      publishPath={[
        {
          icon: "robot",
          title: "AI or translator",
          meta: "Proposal reviewed in the dashboard, glossary enforced.",
          detail: "MCP · dashboard · CLI",
        },
        {
          icon: "rocket",
          title: "Publish",
          meta: "Sync worker writes the locale files to R2.",
          detail: "better-i18n publish",
        },
        {
          icon: "globe",
          title: "CDN purge",
          meta: "Fire-and-forget purge of the affected keys and the manifest.",
          detail: "non-critical by design",
        },
        {
          icon: "checkmark",
          title: "Live in the app",
          meta: "The next getMessages() past the TTL returns the new copy.",
          detail: "~60s worst case",
        },
      ]}
      stats={[
        { value: "0", label: "dependencies in core" },
        { value: "60s", label: "cache TTL, client and edge" },
        { value: "200", label: "CDN status, even on failure" },
        { value: "5", label: "fallback layers before an error" },
      ]}
    />
  );
}
