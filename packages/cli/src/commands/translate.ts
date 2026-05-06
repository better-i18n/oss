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
  yes?: boolean;
}

// ── translate (setTranslations) ──────────────────────────────────────

export interface TranslateOptions extends CommonOptions {}

export async function translateCommand(options: TranslateOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  let translations: Array<{ id: string; t: Record<string, string> }> = [];

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk as Buffer);
    }
    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (raw) {
      try {
        translations = JSON.parse(raw);
        if (!Array.isArray(translations)) translations = [translations];
      } catch {
        console.error(red("  Invalid JSON input. Expected: [{id, t: {lang: text}}]"));
        process.exit(1);
      }
    }
  }

  if (translations.length === 0) {
    console.error(red("  No translations provided."));
    console.error(dim("  Pipe JSON via stdin:"));
    console.error(dim(`  echo '[{"id":"<uuid>","t":{"tr":"Merhaba","de":"Hallo"}}]' | better-i18n translate -p ${project.org}/${project.slug} --json --yes`));
    process.exit(1);
  }

  const langCount = new Set(translations.flatMap(t => Object.keys(t.t))).size;

  if (!options.json && !options.yes) {
    console.log();
    console.log(bold(`  Setting translations for ${translations.length} key${translations.length !== 1 ? "s" : ""} in ${langCount} language${langCount !== 1 ? "s" : ""}`));
    console.log();
    const { confirm } = await import("@inquirer/prompts");
    if (!await confirm({ message: "Proceed?", default: true })) {
      console.log(dim("  Cancelled."));
      return;
    }
  }

  const spinner = options.json ? null : ora("Setting translations...").start();

  const result = await trpc.mutate<{ updated: number; errors: string[] }>(
    "mcp.setTranslations",
    { orgSlug: project.org, projectSlug: project.slug, t: translations },
  );

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to set translations");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed(`${result.data.updated} translation${result.data.updated !== 1 ? "s" : ""} updated`);
  if (result.data.errors?.length > 0) {
    console.log(yellow(`  ${result.data.errors.length} error${result.data.errors.length !== 1 ? "s" : ""}: ${result.data.errors.slice(0, 3).join(", ")}`));
  }
}

// ── publish ──────────────────────────────────────────────────────────

export interface PublishOptions extends CommonOptions {}

export async function publishCommand(options: PublishOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  if (!options.json && !options.yes) {
    const statusResult = await trpc.query<{
      has_chg: boolean;
      sum: { tr: number; del_k: number; tot: number };
    }>("mcp.getPendingChanges", { orgSlug: project.org, projectSlug: project.slug });

    if (statusResult.ok && statusResult.data) {
      const d = statusResult.data;
      if (!d.has_chg) {
        console.log();
        console.log(green("  No pending changes to publish."));
        console.log();
        return;
      }
      console.log();
      console.log(bold(`  Pending changes in ${project.org}/${project.slug}:`));
      if (d.sum.tr > 0) console.log(green(`    + ${d.sum.tr} translation${d.sum.tr !== 1 ? "s" : ""}`));
      if (d.sum.del_k > 0) console.log(red(`    - ${d.sum.del_k} key${d.sum.del_k !== 1 ? "s" : ""} deleted`));
      console.log();

      const { confirm } = await import("@inquirer/prompts");
      if (!await confirm({ message: "Publish to CDN?", default: true })) {
        console.log(dim("  Cancelled."));
        return;
      }
    }
  }

  const spinner = options.json ? null : ora("Publishing to CDN...").start();

  const result = await trpc.mutate<{
    syncJobIds: string[];
    message?: string;
  }>("mcp.publishTranslations", { orgSlug: project.org, projectSlug: project.slug });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to publish");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed("Published to CDN");
  if (result.data.syncJobIds?.length > 0) {
    console.log(dim(`  Sync job${result.data.syncJobIds.length > 1 ? "s" : ""}: ${result.data.syncJobIds.join(", ")}`));
  }
}

// ── publish status ───────────────────────────────────────────────────

export interface PublishStatusOptions extends CommonOptions {}

export async function publishStatusCommand(options: PublishStatusOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);
  const spinner = options.json ? null : ora("Checking pending changes...").start();

  const result = await trpc.query<{
    has_chg: boolean;
    sum: { tr: number; del_k: number; lng_chg: number; tot: number };
    del_k: Array<{ k: string }>;
    by_lng: Record<string, { cnt: number }>;
  }>("mcp.getPendingChanges", { orgSlug: project.org, projectSlug: project.slug });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to check status");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.stop();
  console.log();
  if (!d.has_chg) {
    console.log(green("  No pending changes. CDN is up to date."));
  } else {
    const { tr, del_k: dk } = d.sum;
    console.log(bold(`  ${d.sum.tot} pending change${d.sum.tot !== 1 ? "s" : ""}`));
    if (tr > 0) console.log(green(`    + ${tr} translation${tr !== 1 ? "s" : ""} to publish`));
    if (dk > 0) console.log(red(`    - ${dk} key${dk !== 1 ? "s" : ""} to delete`));
    const langs = Object.keys(d.by_lng);
    if (langs.length > 0) console.log(dim(`    Languages: ${langs.join(", ")}`));
    console.log();
    console.log(dim(`  Run ${cyan("better-i18n publish")} to deploy.`));
  }
  console.log();
}
