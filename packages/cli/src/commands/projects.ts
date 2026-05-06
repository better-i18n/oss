import ora from "ora";
import { bold, cyan, dim, green } from "../utils/colors.js";
import { requireAuth, handleError } from "../utils/require-auth.js";

export interface ProjectsOptions {
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
}

export async function projectsCommand(options: ProjectsOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const spinner = options.json ? null : ora("Fetching projects...").start();

  const result = await trpc.query<{
    cdnBaseUrl: string;
    projects: Array<{
      slug: string;
      name: string;
      sourceLanguage: string;
      targetLanguages: string[];
    }>;
  }>("mcp.listProjects");

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch projects");
    handleError(result, options.json);
  }

  const { projects } = result.data;

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  spinner?.stop();
  console.log();
  console.log(bold(`  ${projects.length} project${projects.length !== 1 ? "s" : ""}`));
  console.log();

  for (const p of projects) {
    const langCount = p.targetLanguages?.length || 0;
    console.log(`  ${green(p.slug)}  ${dim(`${langCount} language${langCount !== 1 ? "s" : ""} · source: ${p.sourceLanguage}`)}`);
  }
  console.log();
}

export interface ProjectInfoOptions {
  project?: string;
  apiKey?: string;
  apiUrl?: string;
  json?: boolean;
  dir?: string;
}

export async function projectInfoCommand(options: ProjectInfoOptions): Promise<void> {
  const { trpc } = requireAuth(options);
  const project = await resolveProject(options);

  const spinner = options.json ? null : ora("Fetching project info...").start();

  const result = await trpc.query<{
    name: string;
    slug: string;
    sourceLanguageCode: string;
    keyCount: number;
    namespaces: Array<{ name: string; keyCount: number }>;
    languages: Array<{ code: string; name: string; status: string; coverage: number }>;
    cdn: { baseUrl: string; manifestUrl: string };
  }>("mcp.getProject", { orgSlug: project.org, projectSlug: project.slug });

  if (!result.ok || !result.data) {
    spinner?.fail("Failed to fetch project");
    handleError(result, options.json);
  }

  if (options.json) {
    console.log(JSON.stringify({ ok: true, data: result.data }));
    return;
  }

  const d = result.data;
  spinner?.stop();
  console.log();
  console.log(bold(`  ${d.name}`));
  console.log(`  ${dim("Slug:")}       ${d.slug}`);
  console.log(`  ${dim("Source:")}     ${d.sourceLanguageCode}`);
  console.log(`  ${dim("Keys:")}       ${d.keyCount}`);
  console.log(`  ${dim("Languages:")}  ${d.languages.length}`);
  console.log(`  ${dim("Namespaces:")} ${d.namespaces.map(n => n.name).join(", ") || "default"}`);
  console.log();

  if (d.languages.length > 0) {
    console.log(dim("  Languages:"));
    for (const lang of d.languages) {
      const bar = lang.coverage >= 100 ? green("█") : lang.coverage >= 50 ? cyan("▓") : dim("░");
      console.log(`    ${bar} ${lang.code.padEnd(8)} ${String(Math.round(lang.coverage)).padStart(3)}%  ${dim(lang.name)}`);
    }
    console.log();
  }
}

async function resolveProject(options: { project?: string; dir?: string }): Promise<{ org: string; slug: string }> {
  if (options.project) {
    const [org, slug] = options.project.split("/");
    if (!org || !slug) {
      console.error("  Invalid project format. Use org/project (e.g. acme/dashboard)");
      process.exit(1);
    }
    return { org, slug };
  }

  // Try to detect from i18n.config.ts
  const { detectProjectContext } = await import("../context/detector.js");
  const ctx = await detectProjectContext(options.dir || process.cwd(), true);
  if (ctx?.workspaceId && ctx?.projectSlug) {
    return { org: ctx.workspaceId, slug: ctx.projectSlug };
  }

  console.error("  No project specified. Use --project org/name or add i18n.config.ts");
  process.exit(1);
}

export { resolveProject };
