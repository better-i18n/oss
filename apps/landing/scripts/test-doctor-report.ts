#!/usr/bin/env bun

/**
 * Doctor Report Test Script (Real Diagnostics)
 *
 * Runs the actual CLI doctor on the landing app and sends
 * the report to the Better i18n API using reportToApi().
 *
 * Usage:
 *   BETTER_I18N_API_URL=http://localhost:52490 \
 *   BETTER_I18N_API_KEY=bi-xxx \
 *   bun apps/landing/scripts/test-doctor-report.ts
 *
 * Environment:
 *   BETTER_I18N_API_URL     - API base URL (default: https://api.better-i18n.com)
 *   BETTER_I18N_API_KEY     - API key (required)
 */

import { resolve } from "node:path";
import { diagnose } from "../../../packages/cli/src/doctor/index.ts";
import { reportToApi } from "../../../packages/cli/src/reporters/doctor-report.ts";

// Set defaults so reportToApi() picks them up from process.env
process.env.BETTER_I18N_API_URL ||= "http://localhost:52490";
process.env.BETTER_I18N_API_KEY ||=
  "bi-qcxtgWNGQTrUeEzDRVaHIZyvFMFNXAoDJhWufidJTcIdJKtJLgPilugzFzwVNzEp";

const API_KEY = process.env.BETTER_I18N_API_KEY;

if (!API_KEY) {
  console.error("Missing BETTER_I18N_API_KEY environment variable");
  process.exit(1);
}

// ── Run real diagnostics on landing app ──────────────────────────────

const landingDir = resolve(import.meta.dirname, "..");

console.log(`Running doctor on ${landingDir}...`);
console.log();

const report = await diagnose(landingDir);

// ── Print summary ────────────────────────────────────────────────────

console.log(`Score: ${report.score.total}/100 (${report.score.passed ? "PASSED" : "FAILED"})`);
console.log(`  Categories: ${Object.entries(report.score.categories).map(([k, v]) => `${k}=${v}`).join(", ")}`);
console.log(`  Issues: ${report.summary.errors} errors, ${report.summary.warnings} warnings, ${report.summary.infos} info`);
console.log(`  Files scanned: ${report.summary.filesScanned}`);
console.log(`  Keys checked: ${report.summary.keysChecked}`);
console.log(`  Locales checked: ${report.summary.localesChecked}`);
console.log(`  Duration: ${report.durationMs}ms`);
console.log();

// ── Upload via reportToApi ───────────────────────────────────────────
// chdir so detectProjectContext finds apps/landing/src/i18n.config.ts

process.chdir(landingDir);

console.log("Uploading report...");

const result = await reportToApi(report, API_KEY);

if (result) {
  console.log(`Report uploaded: ${result.reportId}`);
  console.log(`  URL: ${result.url}`);
} else {
  console.error("Report upload failed (see warnings above)");
  process.exit(1);
}
