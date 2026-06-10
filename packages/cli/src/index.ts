#!/usr/bin/env node
/**
 * Better i18n CLI
 *
 * Localization infrastructure for modern apps.
 * Scan, sync, and manage translation keys from the terminal.
 */

import { program } from "commander";
import pkg from "../package.json" with { type: "json" };
import { loadEnvFiles } from "./utils/load-env.js";
import { scanCommand } from "./commands/scan.js";

// Auto-load .env.local and .env (shell vars take precedence)
loadEnvFiles();
import { syncCommand } from "./commands/sync.js";
import {
  checkCommand,
  checkMissingCommand,
  checkUnusedCommand,
} from "./commands/check.js";
import { doctorCommand } from "./commands/doctor.js";
import { contentTypesCommand } from "./commands/content-types.js";
import { pullCommand } from "./commands/pull.js";
import { loginCommand, logoutCommand, whoamiCommand } from "./commands/login.js";
import { projectsCommand, projectInfoCommand } from "./commands/projects.js";
import { keysListCommand, keysCreateCommand, keysDeleteCommand } from "./commands/keys.js";
import { translateCommand, publishCommand, publishStatusCommand } from "./commands/translate.js";
import { languagesAddCommand, languagesEditCommand } from "./commands/languages.js";
import { syncListCommand, syncGetCommand, syncCancelCommand, translationsGetCommand } from "./commands/syncs.js";

const AUTH_OPTIONS = (cmd: ReturnType<typeof program.command>) =>
  cmd
    .option("--api-key <key>", "API key (default: from login or BETTER_I18N_API_KEY env)")
    .option("--api-url <url>", "API base URL")
    .option("--json", "Machine-readable JSON output");

const PROJECT_OPTIONS = (cmd: ReturnType<typeof program.command>) =>
  AUTH_OPTIONS(cmd)
    .option("-p, --project <org/name>", "Project identifier (default: from i18n.config.ts)")
    .option("-d, --dir <path>", "Directory to scan for config");

program
  .name("better-i18n")
  .description("Localization infrastructure for modern apps — scan, sync, and manage translation keys")
  .version(pkg.version);

// ── Auth ──────────────────────────────────────────────────────────────

program
  .command("login")
  .description("Authenticate with Better i18n (opens browser or use --api-key)")
  .option("--api-key <key>", "Login with API key directly (for CI/agents)")
  .option("--api-url <url>", "API base URL")
  .option("--json", "Output JSON")
  .action(loginCommand);

program
  .command("logout")
  .description("Remove stored credentials")
  .option("--json", "Output JSON")
  .action(logoutCommand);

program
  .command("whoami")
  .description("Show current authenticated user")
  .option("--api-key <key>", "Check a specific API key")
  .option("--api-url <url>", "API base URL")
  .option("--json", "Output JSON")
  .action(whoamiCommand);

// ── Projects ──────────────────────────────────────────────────────────

AUTH_OPTIONS(
  program.command("projects").description("List all projects you have access to"),
).action(projectsCommand);

PROJECT_OPTIONS(
  program.command("project").description("Show project details (languages, namespaces, coverage)"),
).action(projectInfoCommand);

// ── Keys ──────────────────────────────────────────────────────────────

const keysCmd = program.command("keys").description("Manage translation keys");

PROJECT_OPTIONS(
  keysCmd.command("list").description("List translation keys"),
)
  .option("-s, --search <query>", "Search keys by name")
  .option("-n, --namespace <ns>", "Filter by namespace (comma-separated)")
  .option("-m, --missing <lang>", "Show keys missing translation for language")
  .option("--page <n>", "Page number (default: 1)")
  .option("--limit <n>", "Keys per page (default: 50)")
  .action(keysListCommand);

PROJECT_OPTIONS(
  keysCmd.command("create").description("Create translation keys (stdin JSON or --key flags)"),
)
  .option("-k, --key <name...>", "Key name(s) to create")
  .option("-v, --value <text...>", "Source text for each key")
  .option("-n, --namespace <ns>", "Namespace (default: default)")
  .option("-y, --yes", "Skip confirmation")
  .action(keysCreateCommand);

PROJECT_OPTIONS(
  keysCmd.command("delete").description("Delete translation keys by UUID"),
)
  .option("--ids <uuid...>", "Key UUIDs to delete")
  .option("-y, --yes", "Skip confirmation")
  .action(keysDeleteCommand);

// ── Translate ─────────────────────────────────────────────────────────

PROJECT_OPTIONS(
  program.command("translate").description("Set translations for existing keys (stdin JSON)"),
)
  .option("-y, --yes", "Skip confirmation")
  .action(translateCommand);

// ── Publish ───────────────────────────────────────────────────────────

PROJECT_OPTIONS(
  program.command("publish").description("Publish pending changes to CDN"),
)
  .option("-y, --yes", "Skip confirmation")
  .action(publishCommand);

PROJECT_OPTIONS(
  program.command("publish:status").description("Show pending changes before publishing"),
).action(publishStatusCommand);

// ── Languages ─────────────────────────────────────────────────────────

const langsCmd = program.command("languages").description("Manage project languages");

PROJECT_OPTIONS(
  langsCmd.command("add").description("Add target languages to project"),
)
  .option("-l, --lang <code...>", "Language codes to add (e.g. fr de ja)")
  .option("--status <status>", "Initial status: active or draft (default: active)")
  .option("-y, --yes", "Skip confirmation")
  .action(languagesAddCommand);

PROJECT_OPTIONS(
  langsCmd.command("edit").description("Change language status (active/draft/archived)"),
)
  .option("-l, --lang <code...>", "Language codes to edit")
  .option("--new-status <status>", "New status: active, draft, or archived")
  .option("-y, --yes", "Skip confirmation")
  .action(languagesEditCommand);

// ── Translations ──────────────────────────────────────────────────────

PROJECT_OPTIONS(
  program.command("translations").description("Get translations with full text content"),
)
  .option("-s, --search <query>", "Search in keys and translation text")
  .option("-l, --languages <codes>", "Comma-separated language codes")
  .option("-n, --namespace <ns>", "Filter by namespace")
  .option("--status <status>", "Filter: missing, draft, published, all")
  .option("--keys <names>", "Comma-separated exact key names")
  .option("--limit <n>", "Max keys (default: 100)")
  .action(translationsGetCommand);

// ── Syncs ─────────────────────────────────────────────────────────────

const syncsCmd = program.command("syncs").description("View sync/publish job history");

PROJECT_OPTIONS(
  syncsCmd.command("list").description("List recent sync jobs"),
)
  .option("--limit <n>", "Number of jobs (default: 10)")
  .action(syncListCommand);

AUTH_OPTIONS(
  syncsCmd.command("get <syncId>").description("Get sync job details"),
)
  .option("--wait", "Block until sync completes (max 15s)")
  .action(syncGetCommand);

AUTH_OPTIONS(
  syncsCmd.command("cancel <syncId>").description("Cancel a pending sync job"),
)
  .option("-y, --yes", "Skip confirmation")
  .action(syncCancelCommand);

// ── Scan & analysis (existing) ────────────────────────────────────────

program
  .command("scan")
  .description("Scan source files for untranslated strings")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--max-issues <number>", "Maximum issues to display (default: 100)", parseInt)
  .option("--fix", "Auto-fix: wrap hardcoded text with t()")
  .option("--ci", "CI mode: exit with error code if issues found")
  .option("--staged", "Only scan git staged files")
  .option("--verbose", "Show detailed output")
  .action(scanCommand);

program
  .command("sync")
  .description("Compare local translation keys with Better i18n cloud")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--summary", "Show only the high-level metrics summary")
  .option("--verbose", "Show detailed output")
  .option("--push", "Create the missing keys in Better i18n after comparison")
  .option("-y, --yes", "Skip the confirmation prompt (for --push)")
  .option("-p, --project <org/project>", "Project override for --push (e.g. acme/dashboard)")
  .action(syncCommand);

program
  .command("check")
  .description("Interactive checker for missing and unused translation keys")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--verbose", "Show detailed output")
  .action(checkCommand);

program
  .command("check:missing")
  .description("Check for missing translation keys (in code but not in remote)")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--verbose", "Show detailed output")
  .action(checkMissingCommand);

program
  .command("check:unused")
  .description("Check for unused translation keys (in remote but not detected in code)")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--verbose", "Show detailed output")
  .action(checkUnusedCommand);

program
  .command("doctor")
  .description("Analyze i18n health: missing translations, orphan keys, placeholder mismatches")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option("--ci", "CI mode: exit with error code if health score below threshold")
  .option("--report", "Upload results to Better i18n portal")
  .option("--api-key <key>", "API key for report upload")
  .option("--skip-code", "Skip AST code analysis")
  .option("--skip-health", "Skip translation file health checks")
  .option("--skip-sync", "Skip remote CDN comparison")
  .option("--verbose", "Show detailed output")
  .action(doctorCommand);

program
  .command("pull")
  .description("Download translations from CDN to local JSON files")
  .option("-p, --project <org/name>", "Project identifier (default: from i18n.config.ts)")
  .option("-o, --output <path>", "Output directory (default: ./locales)")
  .option("-l, --locales <codes>", "Comma-separated locale codes (default: all)")
  .option("-d, --dir <path>", "Directory to scan for config")
  .option("--verbose", "Show detailed output per locale")
  .action(pullCommand);

program
  .command("content:types")
  .description("Generate TypeScript types from content models")
  .option("-p, --project <org/name>", "Project identifier (default: from i18n.config.ts)")
  .option("-o, --output <path>", "Output file path (default: src/content-types.ts)")
  .option("-d, --dir <path>", "Directory to scan for config")
  .action(contentTypesCommand);

program.parse();
