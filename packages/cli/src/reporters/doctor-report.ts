/**
 * Doctor Report — API Reporter
 *
 * Sends a DoctorReport to the Better i18n API for storage and trend tracking.
 * Authentication is via GitHub Actions OIDC — no API keys needed.
 *
 * Graceful degradation: if OIDC is unavailable (running locally, missing
 * permissions), it warns and returns null instead of failing.
 */

import type { DoctorReport } from "../doctor/index.js";
import { fetchGitHubOidcToken, isGitHubActionsWithOidc } from "../context/oidc.js";

const DEFAULT_API_URL = "https://api.better-i18n.com";

interface ReportResult {
  reportId: string;
  url: string;
}

/**
 * POST a doctor report to the Better i18n API.
 *
 * @param report - The DoctorReport to upload
 * @returns Report ID and dashboard URL, or null if reporting failed/unavailable
 */
export async function reportToApi(
  report: DoctorReport,
): Promise<ReportResult | null> {
  // 1. Check if we can get an OIDC token
  if (!isGitHubActionsWithOidc()) {
    console.warn(
      "  Warning: --report requires GitHub Actions with OIDC.\n" +
      "  Add `permissions: id-token: write` to your workflow.\n" +
      "  Skipping report upload.",
    );
    return null;
  }

  const token = await fetchGitHubOidcToken("better-i18n");
  if (!token) {
    console.warn(
      "  Warning: Failed to fetch OIDC token. Skipping report upload.",
    );
    return null;
  }

  // 2. Send report to API
  const apiUrl = process.env.BETTER_I18N_API_URL || DEFAULT_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/doctor/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.warn(
        `  Warning: Report upload failed (${response.status}): ${errorText}`,
      );
      return null;
    }

    const data = (await response.json()) as {
      reportId?: string;
      url?: string;
    };

    if (!data.reportId) {
      console.warn("  Warning: Unexpected API response. Skipping.");
      return null;
    }

    return {
      reportId: data.reportId,
      url: data.url || `${apiUrl}/doctor/${data.reportId}`,
    };
  } catch (error) {
    console.warn(
      `  Warning: Report upload failed: ${error instanceof Error ? error.message : String(error)}`,
    );
    return null;
  }
}
