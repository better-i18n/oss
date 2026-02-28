/**
 * JSON Reporter for i18n Doctor
 *
 * Outputs the full DoctorReport as JSON.
 * Used for CI pipelines, machine parsing, and API submission.
 */

import type { DoctorReport } from "../doctor/index.js";

/**
 * Print full DoctorReport as formatted JSON to stdout.
 */
export function reportJson(report: DoctorReport): void {
  // Convert Set-like data structures if any (shouldn't be in report, but safety)
  const serializable = JSON.parse(
    JSON.stringify(report, (_key, value) => {
      if (value instanceof Set) return Array.from(value);
      if (value instanceof Map) return Object.fromEntries(value);
      return value;
    }),
  );

  console.log(JSON.stringify(serializable, null, 2));
}
