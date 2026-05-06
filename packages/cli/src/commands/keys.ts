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

// ── keys list ────────────────────────────────────────────────────────

export interface KeysListOptions extends CommonOptions {
  search?: string;
  namespace?: string;
  missing?: string;
  page?: string;
  limit?: string;
}

export async function keysListCommand(options: KeysListOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);
  const spinner = options.json ? null : ora("Fetching keys...").start();

  const input: Record<string, unknown> = {
    orgSlug: project.org,
    projectSlug: project.slug,
    page: options.page ? parseInt(options.page, 10) : 1,
    limit: options.limit ? parseInt(options.limit, 10) : 50,
    fields: ["id", "sourceText"],
  };
  if (options.search) input.search = options.search;
  if (options.namespace) input.namespaces = options.namespace.split(",");
  if (options.missing) input.missingLanguage = options.missing;

  const result = await trpc.query<{
    tot: number;
    ret: number;
    has_more: boolean;
    nss: string[];
    k: Array<{ k: string; ns: number; id: string; src?: string }>;
  }>("mcp.listKeys", input);

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch keys");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.stop();
  console.log();
  console.log(bold(`  ${d.tot} key${d.tot !== 1 ? "s" : ""} total`) + dim(` (showing ${d.ret})`));
  console.log();

  for (const key of d.k) {
    const ns = d.nss[key.ns] || "default";
    const nsLabel = ns === "default" ? "" : dim(`[${ns}] `);
    const src = key.src ? dim(` → "${key.src.length > 50 ? key.src.substring(0, 50) + "…" : key.src}"`) : "";
    console.log(`  ${nsLabel}${cyan(key.k)}${src}`);
  }

  if (d.has_more) {
    console.log();
    console.log(dim(`  Page ${input.page}/${Math.ceil(d.tot / (input.limit as number))} — use --page ${(input.page as number) + 1} for more`));
  }
  console.log();
}

// ── keys create ──────────────────────────────────────────────────────

export interface KeysCreateOptions extends CommonOptions {
  key?: string[];
  value?: string[];
  namespace?: string;
  yes?: boolean;
  fromScan?: boolean;
}

export async function keysCreateCommand(options: KeysCreateOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  let keys: Array<{ n: string; ns?: string; v?: string }> = [];

  // Source 1: stdin JSON (agent mode)
  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        keys = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        console.error(red("  Invalid JSON input from stdin"));
        process.exit(1);
      }
    }
  }

  // Source 2: --key flags
  if (keys.length === 0 && options.key?.length) {
    keys = options.key.map((k, i) => ({
      n: k,
      v: options.value?.[i],
      ns: options.namespace || "default",
    }));
  }

  if (keys.length === 0) {
    console.error(red("  No keys provided."));
    console.error(dim("  Use --key name --value text, or pipe JSON via stdin."));
    console.error(dim(`  Example: echo '[{"n":"hello","v":"Hello"}]' | better-i18n keys create -p ${project.org}/${project.slug} --json --yes`));
    process.exit(1);
  }

  // Apply default namespace
  for (const k of keys) {
    if (!k.ns) k.ns = options.namespace || "default";
  }

  // Confirmation
  if (!options.json && !options.yes) {
    console.log();
    console.log(bold(`  Creating ${keys.length} key${keys.length !== 1 ? "s" : ""} in ${green(project.org + "/" + project.slug)}`));
    console.log();
    const preview = keys.slice(0, 10);
    for (const k of preview) {
      const nsLabel = k.ns && k.ns !== "default" ? dim(`[${k.ns}] `) : "";
      const val = k.v ? dim(` → "${k.v}"`) : "";
      console.log(`  ${nsLabel}${cyan(k.n)}${val}`);
    }
    if (keys.length > 10) console.log(dim(`  ... and ${keys.length - 10} more`));
    console.log();

    const { confirm } = await import("@inquirer/prompts");
    const proceed = await confirm({ message: "Create these keys?", default: true });
    if (!proceed) {
      console.log(dim("  Cancelled."));
      return;
    }
  }

  const spinner = options.json ? null : ora(`Creating ${keys.length} key${keys.length !== 1 ? "s" : ""}...`).start();

  const result = await trpc.mutate<{
    created: number;
    dup: string[];
    warn: string[];
  }>("mcp.createKeys", {
    orgSlug: project.org,
    projectSlug: project.slug,
    k: keys,
  });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to create keys");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.succeed(`${d.created} key${d.created !== 1 ? "s" : ""} created`);
  if (d.dup.length > 0) {
    console.log(yellow(`  ${d.dup.length} duplicate${d.dup.length !== 1 ? "s" : ""} skipped: ${d.dup.slice(0, 5).join(", ")}${d.dup.length > 5 ? "…" : ""}`));
  }
  if (d.warn.length > 0) {
    console.log(yellow(`  Warnings: ${d.warn.join(", ")}`));
  }
}

// ── keys delete ──────────────────────────────────────────────────────

export interface KeysDeleteOptions extends CommonOptions {
  ids?: string[];
  yes?: boolean;
}

export async function keysDeleteCommand(options: KeysDeleteOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  let keyIds: string[] = [];

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (raw) {
      try {
        keyIds = JSON.parse(raw);
      } catch {
        console.error(red("  Invalid JSON input from stdin"));
        process.exit(1);
      }
    }
  }

  if (keyIds.length === 0 && options.ids?.length) {
    keyIds = options.ids;
  }

  if (keyIds.length === 0) {
    console.error(red("  No key IDs provided. Use --ids <uuid> or pipe JSON array via stdin."));
    process.exit(1);
  }

  if (!options.json && !options.yes) {
    console.log();
    console.log(red(`  Deleting ${keyIds.length} key${keyIds.length !== 1 ? "s" : ""} from ${project.org}/${project.slug}`));
    console.log(dim("  Keys will be permanently removed on next publish."));
    console.log();

    const { confirm } = await import("@inquirer/prompts");
    const proceed = await confirm({ message: "Delete these keys?", default: false });
    if (!proceed) {
      console.log(dim("  Cancelled."));
      return;
    }
  }

  const spinner = options.json ? null : ora("Deleting keys...").start();

  const result = await trpc.mutate<{ deleted: number; skipped: string[] }>(
    "mcp.deleteKeys",
    { orgSlug: project.org, projectSlug: project.slug, keyIds },
  );

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to delete keys");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed(`${result.data.deleted} key${result.data.deleted !== 1 ? "s" : ""} deleted`);
  if (result.data.skipped.length > 0) {
    console.log(yellow(`  ${result.data.skipped.length} skipped (not found or already deleted)`));
  }
}
