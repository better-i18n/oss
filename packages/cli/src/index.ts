#!/usr/bin/env node
/**
 * Better i18n CLI
 *
 * Detect hardcoded strings and sync translation keys in React apps.
 * Automatically reads i18n.config.ts for project context.
 */

import { program } from "commander";
import { scanCommand } from "./commands/scan.js";
import { syncCommand } from "./commands/sync.js";
import {
  checkCommand,
  checkMissingCommand,
  checkUnusedCommand,
} from "./commands/check.js";
import { doctorCommand } from "./commands/doctor.js";
import { contentTypesCommand } from "./commands/content-types.js";

program
  .name("better-i18n")
  .description(
    "Detect hardcoded strings and sync translation keys in your React app",
  )
  .version("0.1.5");

program
  .command("scan")
  .description("Scan source files for untranslated strings")
  .option("-d, --dir <path>", "Directory to scan (default: current directory)")
  .option("-f, --format <type>", "Output format: eslint, json", "eslint")
  .option(
    "--max-issues <number>",
    "Maximum number of issues to display (default: 100)",
    parseInt,
  )
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
  .action(syncCommand);

// New check commands with interactive prompts
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
  .description(
    "Check for unused translation keys (in remote but not detected in code)",
  )
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
  .option("--report", "Upload results to Better i18n portal (requires GitHub Actions OIDC or --api-key)")
  .option("--api-key <key>", "Better Auth API key for non-GitHub CI (local dev, GitLab, Jenkins)")
  .option("--skip-code", "Skip AST code analysis (hardcoded strings)")
  .option("--skip-health", "Skip translation file health checks")
  .option("--skip-sync", "Skip remote CDN comparison")
  .option("--verbose", "Show detailed output")
  .action(doctorCommand);

program
  .command("content:types")
  .description("Generate TypeScript types from content models (like supabase gen types)")
  .option("-p, --project <org/name>", "Project identifier (default: from i18n.config.ts)")
  .option("--api-key <key>", "Content API key (default: BETTER_I18N_API_KEY env var)")
  .option("-o, --output <path>", "Output file path (default: src/content-types.ts)")
  .option("-d, --dir <path>", "Directory to scan for config (default: current directory)")
  .action(contentTypesCommand);

program.parse();

