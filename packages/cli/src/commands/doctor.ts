/**
 * Doctor Command
 *
 * CLI handler for `better-i18n doctor`.
 * Delegates to diagnose() API for analysis, then uses reporters for output.
 *
 * This is the UI layer — spinners, formatting, and exit codes.
 * The diagnose() function in src/doctor/index.ts is the pure data layer.
 */

import { resolve } from "node:path";
import ora from "ora";
import { diagnose, type DoctorOptions } from "../doctor/index.js";
import { reportEslint } from "../reporters/doctor-eslint.js";
import { reportJson } from "../reporters/doctor-json.js";
import { reportToApi } from "../reporters/doctor-report.js";

export interface DoctorCommandOptions {
  dir?: string;
  format?: "eslint" | "json";
  ci?: boolean;
  report?: boolean;
  skipCode?: boolean;
  skipHealth?: boolean;
  verbose?: boolean;
}

export async function doctorCommand(options: DoctorCommandOptions) {
  const isJson = options.format === "json";
  const rootDir = resolve(options.dir || process.cwd());

  // Show spinner for non-JSON output
  const spinner = isJson
    ? { start: (_t?: string) => {}, succeed: (_t?: string) => {}, fail: (_t?: string) => {}, stop: () => {}, text: "" }
    : ora({ text: "Running i18n Doctor...", color: "cyan" }).start();

  try {
    const doctorOptions: DoctorOptions = {
      dir: rootDir,
      skipCode: options.skipCode,
      skipHealth: options.skipHealth,
      verbose: options.verbose,
    };

    if (!isJson) {
      spinner.text = "Analyzing codebase...";
    }

    const report = await diagnose(rootDir, doctorOptions);

    if (!isJson) {
      spinner.succeed(
        `Analysis complete (${report.summary.total} issues found)`,
      );
    }

    // Output report
    if (isJson) {
      reportJson(report);
    } else {
      reportEslint(report);
    }

    // Upload report to Better i18n API (if --report flag is set)
    if (options.report) {
      if (!isJson) {
        spinner.start("Uploading report...");
      }

      const result = await reportToApi(report);

      if (result) {
        if (!isJson) {
          spinner.succeed(`Report uploaded: ${result.url}`);
        }
      } else if (!isJson) {
        // reportToApi already logs warnings, just stop the spinner
        spinner.stop();
      }
    }

    // CI mode: exit with error code if score below threshold
    if (options.ci && !report.score.passed) {
      process.exit(1);
    }
  } catch (error) {
    if (!isJson) {
      spinner.fail(
        `Doctor failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    } else {
      console.error(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        }),
      );
    }
    process.exit(1);
  }
}
