import ora from "ora";
import { red } from "../utils/colors.js";
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

// ── languages add ────────────────────────────────────────────────────

export interface LanguagesAddOptions extends CommonOptions {
  lang?: string[];
  status?: string;
}

export async function languagesAddCommand(options: LanguagesAddOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  let langs: Array<{ languageCode: string; status?: string }> = [];

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (raw) {
      try { langs = JSON.parse(raw); } catch {
        console.error(red("  Invalid JSON")); process.exit(1);
      }
    }
  }

  if (langs.length === 0 && options.lang?.length) {
    langs = options.lang.map(l => ({
      languageCode: l.toLowerCase(),
      status: options.status || "active",
    }));
  }

  if (langs.length === 0) {
    console.error(red("  No languages provided. Use --lang fr --lang de or pipe JSON."));
    process.exit(1);
  }

  const spinner = options.json ? null : ora(`Adding ${langs.length} language${langs.length !== 1 ? "s" : ""}...`).start();

  const result = await trpc.mutate<{ added: number; skipped: string[] }>(
    "mcp.addLanguages",
    { orgSlug: project.org, projectSlug: project.slug, languages: langs },
  );

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to add languages");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed(`Languages updated`);
}

// ── languages edit ───────────────────────────────────────────────────

export interface LanguagesEditOptions extends CommonOptions {
  lang?: string[];
  newStatus?: string;
}

export async function languagesEditCommand(options: LanguagesEditOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  let edits: Array<{ languageCode: string; newStatus: string }> = [];

  if (!process.stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(chunk as Buffer);
    const raw = Buffer.concat(chunks).toString("utf-8").trim();
    if (raw) {
      try { edits = JSON.parse(raw); } catch {
        console.error(red("  Invalid JSON")); process.exit(1);
      }
    }
  }

  if (edits.length === 0 && options.lang?.length && options.newStatus) {
    edits = options.lang.map(l => ({
      languageCode: l.toLowerCase(),
      newStatus: options.newStatus!,
    }));
  }

  if (edits.length === 0) {
    console.error(red("  Usage: better-i18n languages edit --lang fr --new-status archived"));
    process.exit(1);
  }

  const spinner = options.json ? null : ora("Updating languages...").start();

  const result = await trpc.mutate<{ updated: number }>(
    "mcp.updateLanguages",
    { orgSlug: project.org, projectSlug: project.slug, updates: edits },
  );

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to update languages");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.succeed("Languages updated");
}
