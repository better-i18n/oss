/**
 * Check command - Interactive translation key checker
 *
 * Provides user-friendly interface for checking missing and unused keys
 */

import { select } from "@inquirer/prompts";
import { bold, cyan } from "../utils/colors.js";
import { syncCommand, type SyncOptions } from "./sync.js";

export interface CheckOptions {
  dir?: string;
  format?: "eslint" | "json";
  verbose?: boolean;
}

export async function checkCommand(options: CheckOptions) {
  console.log();
  console.log(bold("🔍 Better i18n Translation Checker"));
  console.log();

  // Ask user what they want to check
  const checkType = await select({
    message: "What would you like to check?",
    choices: [
      {
        name: "Missing translation keys",
        value: "missing",
        description:
          "Keys used in code but not uploaded to Better i18n (t() calls missing in remote)",
      },
      {
        name: "Unused translation keys",
        value: "unused",
        description:
          "Keys in Better i18n but not detected in code (safe to review for deletion)",
      },
      {
        name: "Both (Full Comparison)",
        value: "both",
        description: "Run complete analysis for both missing and unused keys",
      },
    ],
  });

  console.log();

  // Run the appropriate check based on user selection
  const syncOptions: SyncOptions = {
    dir: options.dir,
    format: options.format || "eslint",
    verbose: options.verbose,
    checkType: checkType as "missing" | "unused" | "both", // Type assertion for union type
  };

  await syncCommand(syncOptions);
}

export async function checkMissingCommand(options: CheckOptions) {
  console.log();
  console.log(bold("🔍 Checking for Missing Translation Keys"));
  console.log(cyan("Keys used in code but not in Better i18n remote"));
  console.log();

  const syncOptions: SyncOptions = {
    dir: options.dir,
    format: options.format || "eslint",
    verbose: options.verbose,
    checkType: "missing",
  };

  await syncCommand(syncOptions);
}

export async function checkUnusedCommand(options: CheckOptions) {
  console.log();
  console.log(bold("🔍 Checking for Unused Translation Keys"));
  console.log(cyan("Keys in Better i18n but not detected in code"));
  console.log();

  const syncOptions: SyncOptions = {
    dir: options.dir,
    format: options.format || "eslint",
    verbose: options.verbose,
    checkType: "unused",
  };

  await syncCommand(syncOptions);
}
