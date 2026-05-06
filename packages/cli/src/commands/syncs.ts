import ora from "ora";
import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";
import { requireAuth, handleError } from "../utils/require-auth.js";
import { resolveProject } from "./projects.js";

interface CommonOptions {
  project?: string;
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
  dir?: string;
}

// ── sync list (getSyncs) ─────────────────────────────────────────────

export interface SyncListOptions extends CommonOptions {
  limit?: string;
}

export async function syncListCommand(options: SyncListOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);
  const spinner = options.json ? null : ora("Fetching sync history...").start();

  const result = await trpc.query<{
    jobs: Array<{
      id: string;
      type: string;
      status: string;
      createdAt: string;
      completedAt?: string;
      newKeys?: number;
      updatedKeys?: number;
      totalFiles?: number;
      errorMessage?: string;
    }>;
  }>("mcp.getSyncs", {
    orgSlug: project.org,
    projectSlug: project.slug,
    limit: options.limit ? parseInt(options.limit, 10) : 10,
  });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch syncs");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const jobs = result.data.jobs || [];
  spinner?.stop();
  console.log();
  console.log(bold(`  ${jobs.length} recent sync${jobs.length !== 1 ? "s" : ""}`));
  console.log();

  for (const j of jobs) {
    const statusIcon = j.status === "completed" ? green("✓")
      : j.status === "failed" ? red("✗")
      : j.status === "in_progress" ? cyan("⟳")
      : dim("○");
    const date = new Date(j.createdAt).toLocaleString();
    const details = [j.type, j.newKeys ? `+${j.newKeys}` : null, j.updatedKeys ? `~${j.updatedKeys}` : null]
      .filter(Boolean).join(" · ");
    console.log(`  ${statusIcon} ${dim(j.id.substring(0, 8))}  ${date}  ${dim(details)}`);
    if (j.errorMessage) console.log(`    ${red(j.errorMessage)}`);
  }
  console.log();
}

// ── sync get (getSync) ───────────────────────────────────────────────

export interface SyncGetOptions {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
  syncId: string;
  wait?: boolean;
}

export async function syncGetCommand(options: SyncGetOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const spinner = options.json ? null : ora("Fetching sync details...").start();

  const result = await trpc.query<{
    id: string;
    type: string;
    status: string;
    createdAt: string;
    completedAt?: string;
    newKeys?: number;
    updatedKeys?: number;
    errorMessage?: string;
    logs?: string[];
  }>("mcp.getSync", {
    syncId: options.syncId,
    ...(options.wait ? { waitMs: 15000 } : {}),
  });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch sync");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.stop();
  console.log();
  console.log(bold(`  Sync ${d.id}`));
  console.log(`  ${dim("Status:")}  ${d.status === "completed" ? green(d.status) : d.status === "failed" ? red(d.status) : cyan(d.status)}`);
  console.log(`  ${dim("Type:")}    ${d.type}`);
  console.log(`  ${dim("Created:")} ${new Date(d.createdAt).toLocaleString()}`);
  if (d.completedAt) console.log(`  ${dim("Done:")}    ${new Date(d.completedAt).toLocaleString()}`);
  if (d.errorMessage) console.log(`  ${dim("Error:")}   ${red(d.errorMessage)}`);
  console.log();
}

// ── sync cancel ──────────────────────────────────────────────────────

export interface SyncCancelOptions {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
  syncId: string;
  yes?: boolean;
}

export async function syncCancelCommand(options: SyncCancelOptions): Promise<void> {
  const { trpc } = requireAuth(options);

  if (!options.json && !options.yes) {
    console.log(yellow(`  Cancel sync ${options.syncId}?`));
    const { confirm } = await import("@inquirer/prompts");
    if (!await confirm({ message: "Cancel this sync?", default: false })) {
      console.log(dim("  Cancelled.")); return;
    }
  }

  const spinner = options.json ? null : ora("Cancelling sync...").start();

  const result = await trpc.mutate<{ cancelled: boolean; previousStatus: string }>(
    "mcp.cancelSync",
    { syncId: options.syncId },
  );

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to cancel");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed("Sync cancelled");
}

// ── translations get (getTranslations) ───────────────────────────────

export interface TranslationsGetOptions extends CommonOptions {
  search?: string;
  languages?: string;
  namespace?: string;
  status?: string;
  keys?: string;
  limit?: string;
}

export async function translationsGetCommand(options: TranslationsGetOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);
  const spinner = options.json ? null : ora("Fetching translations...").start();

  const input: Record<string, unknown> = {
    orgSlug: project.org,
    projectSlug: project.slug,
  };
  if (options.search) input.search = options.search;
  if (options.languages) input.languages = options.languages.split(",");
  if (options.namespace) input.namespaces = options.namespace.split(",");
  if (options.status) input.status = options.status;
  if (options.keys) input.keys = options.keys.split(",");
  if (options.limit) input.limit = parseInt(options.limit, 10);

  const result = await trpc.query<{
    returned: number;
    total: number;
    hasMore: boolean;
    keys: Array<{
      id: string;
      key: string;
      namespace: string;
      src: string;
      tr: Record<string, { t: string; st: string }>;
    }>;
  }>("mcp.getAllTranslations", input);

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch translations");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.stop();
  console.log();
  console.log(bold(`  ${d.total} key${d.total !== 1 ? "s" : ""}`) + dim(` (showing ${d.returned})`));
  console.log();

  for (const k of d.keys) {
    const nsLabel = k.namespace && k.namespace !== "default" ? dim(`[${k.namespace}] `) : "";
    console.log(`  ${nsLabel}${cyan(k.key)}`);
    console.log(`    ${dim("src:")} ${k.src || dim("(empty)")}`);
    if (k.tr) {
      for (const [lang, val] of Object.entries(k.tr)) {
        const statusMark = val.st === "approved" ? green("●") : val.st === "draft" ? yellow("○") : dim("○");
        console.log(`    ${statusMark} ${lang}: ${val.t || dim("(empty)")}`);
      }
    }
  }
  if (d.hasMore) console.log(dim(`\n  More keys available — use --limit or narrower filters.`));
  console.log();
}
