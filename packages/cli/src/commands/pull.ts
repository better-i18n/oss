/**
 * Pull command
 *
 * Downloads translations from Better i18n CDN to local JSON files.
 * Essential for mobile apps (Expo, React Native, Swift, Flutter) where
 * bundled translations serve as offline fallback when CDN is unreachable.
 *
 * Config priority (highest → lowest):
 *   1. CLI flags (-p, -o, -l)
 *   2. i18n.config.ts pull section
 *   3. i18n.config.ts project/defaultLocale
 *   4. Defaults (./locales, all languages)
 *
 * Usage:
 *   better-i18n pull                          # reads from i18n.config.ts
 *   better-i18n pull -p org/project           # explicit project (no config needed)
 *   better-i18n pull -o ./src/locales         # override output dir
 *   better-i18n pull -l en,tr                 # specific locales only
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import ora from "ora";
import type { ProjectContext } from "../analyzer/types.js";
import { detectProjectContext } from "../context/detector.js";
import { fetchManifest, fetchRemoteKeys } from "../utils/cdn-client.js";
import { bold, cyan, dim, green, red, yellow } from "../utils/colors.js";

const DEFAULT_CDN = "https://cdn.better-i18n.com";

export interface PullOptions {
  project?: string;
  output?: string;
  locales?: string;
  dir?: string;
  verbose?: boolean;
}

export async function pullCommand(options: PullOptions) {
  const spinner = ora({ text: "Detecting project...", color: "cyan" }).start();

  // ── Resolve config from i18n.config.ts ──────────────────────────
  const rootDir = resolve(options.dir || process.cwd());
  let context: ProjectContext | null = null;

  if (!options.project) {
    context = await detectProjectContext(rootDir, false);
  }

  // ── Resolve project identifier ──────────────────────────────────
  let workspaceId: string;
  let projectSlug: string;
  let cdnBaseUrl = DEFAULT_CDN;

  if (options.project) {
    // CLI flag takes priority
    const parts = options.project.split("/");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      spinner.fail(`Invalid project format: ${bold(options.project)}. Expected "org/project".`);
      process.exit(1);
    }
    [workspaceId, projectSlug] = parts;
  } else if (context) {
    // From i18n.config.ts
    workspaceId = context.workspaceId;
    projectSlug = context.projectSlug;
    cdnBaseUrl = context.cdnBaseUrl || DEFAULT_CDN;
  } else {
    spinner.fail(
      "No project found. Either:\n" +
      `  ${bold("1.")} Create an ${bold("i18n.config.ts")} with your project identifier\n` +
      `  ${bold("2.")} Pass ${bold("-p org/project")} flag`,
    );
    process.exit(1);
  }

  spinner.succeed(`Project: ${bold(workspaceId + "/" + projectSlug)}`);

  // ── Fetch manifest ──────────────────────────────────────────────
  spinner.start("Fetching manifest from CDN...");

  let manifest;
  try {
    manifest = await fetchManifest(cdnBaseUrl, workspaceId, projectSlug);
  } catch (err) {
    spinner.fail(`Failed to fetch manifest: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const availableLocales = manifest.languages.map((l) => l.code);
  spinner.succeed(
    `Manifest: ${bold(String(availableLocales.length))} languages (${availableLocales.join(", ")})`,
  );

  // ── Determine locales: CLI flag → config.pull.locales → all ─────
  let targetLocales: string[];
  const localesSource = options.locales
    ? options.locales.split(",").map((l) => l.trim().toLowerCase())
    : context?.pull?.locales;

  if (localesSource) {
    const invalid = localesSource.filter((l) => !availableLocales.includes(l));
    if (invalid.length > 0) {
      console.log(yellow(`  ⚠  Unknown locales: ${invalid.join(", ")} (skipped)`));
    }
    targetLocales = localesSource.filter((l) => availableLocales.includes(l));
    if (targetLocales.length === 0) {
      spinner.fail("No valid locales to download.");
      process.exit(1);
    }
  } else {
    targetLocales = availableLocales;
  }

  // ── Resolve output dir: CLI flag → config.pull.output → ./locales
  const outputPath = options.output || context?.pull?.output || "./locales";
  const outputDir = resolve(rootDir, outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  const relOutput = relative(process.cwd(), outputDir);

  // ── Download translations ───────────────────────────────────────
  spinner.start(`Downloading ${bold(String(targetLocales.length))} locale(s)...`);

  const results: { locale: string; keys: number; size: number; ok: boolean }[] = [];

  for (const locale of targetLocales) {
    try {
      const translations = await fetchRemoteKeys(
        cdnBaseUrl,
        workspaceId,
        projectSlug,
        locale,
        manifest,
      );

      const json = JSON.stringify(translations, null, 2) + "\n";
      const filePath = resolve(outputDir, `${locale}.json`);
      writeFileSync(filePath, json, "utf-8");

      const namespaceCount = Object.keys(translations).length;
      const keyCount = countNestedKeys(translations);

      results.push({ locale, keys: keyCount, size: json.length, ok: true });

      if (options.verbose) {
        spinner.text = `Downloaded ${bold(locale)} — ${namespaceCount} namespaces, ${keyCount} keys`;
      }
    } catch (err) {
      results.push({ locale, keys: 0, size: 0, ok: false });
      if (options.verbose) {
        console.log(red(`  ✗ ${locale}: ${err instanceof Error ? err.message : err}`));
      }
    }
  }

  // ── Summary ─────────────────────────────────────────────────────
  const succeeded = results.filter((r) => r.ok);
  const failed = results.filter((r) => !r.ok);

  if (succeeded.length > 0) {
    spinner.succeed(
      `Downloaded ${bold(String(succeeded.length))} locale(s) to ${cyan(relOutput + "/")}`,
    );

    console.log();
    for (const r of succeeded) {
      const sizeStr = formatBytes(r.size);
      console.log(`  ${green("✓")} ${bold(r.locale.padEnd(6))} ${dim(String(r.keys).padStart(5) + " keys")}  ${dim(sizeStr)}`);
    }
  }

  if (failed.length > 0) {
    console.log();
    for (const r of failed) {
      console.log(`  ${red("✗")} ${bold(r.locale.padEnd(6))} ${red("failed")}`);
    }
  }

  // ── Usage hint ──────────────────────────────────────────────────
  console.log();
  console.log(dim("  Use as offline fallback in your app:"));
  console.log(dim(`    staticData: { ${targetLocales.map((l) => `${l}: require('./${relOutput}/${l}.json')`).join(", ")} }`));
  console.log();

  if (failed.length > 0) {
    process.exit(1);
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

function countNestedKeys(obj: Record<string, unknown>): number {
  let count = 0;
  for (const [, value] of Object.entries(obj)) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      count += countNestedKeys(value as Record<string, unknown>);
    } else {
      count++;
    }
  }
  return count;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
