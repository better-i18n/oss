/**
 * Doctor Report — API Reporter
 *
 * Sends a DoctorReport to the Better i18n API for storage and trend tracking.
 *
 * Two auth paths:
 * 1. API key (--api-key flag) — for local dev, GitLab, Jenkins, etc.
 *    Uses Better Auth API key via x-api-key header.
 *    Reads project context from i18n.config.ts to build X-Doctor-Project header.
 * 2. GitHub Actions OIDC (default) — no API keys needed in GitHub Actions.
 *
 * Graceful degradation: if auth is unavailable, it warns and returns null.
 */

import type { DoctorReport } from "../doctor/index.js";
import { detectProjectContext } from "../context/detector.js";
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
 * @param apiKey - Optional Better Auth API key for non-OIDC auth (--api-key flag)
 * @returns Report ID and dashboard URL, or null if reporting failed/unavailable
 */
export async function reportToApi(
  report: DoctorReport,
  apiKey?: string,
): Promise<ReportResult | null> {
  const apiUrl = process.env.BETTER_I18N_API_URL || DEFAULT_API_URL;

  // ── API key auth path ──────────────────────────────────────────
  if (apiKey) {
    return reportWithApiKey(report, apiKey, apiUrl);
  }

  // ── OIDC auth path (GitHub Actions) ──────────────────────────
  return reportWithOidc(report, apiUrl);
}

/**
 * Report using Better Auth API key + X-Doctor-Project header.
 * Reads org/project slug from i18n.config.ts.
 */
async function reportWithApiKey(
  report: DoctorReport,
  apiKey: string,
  apiUrl: string,
): Promise<ReportResult | null> {
  // Detect project context from i18n.config.ts
  const context = await detectProjectContext(process.cwd(), true);
  if (!context?.workspaceId || !context?.projectSlug) {
    console.warn(
      "  Warning: Could not detect project context from i18n.config.ts.\n" +
      "  Ensure your config has: project: \"orgSlug/projectSlug\"\n" +
      "  Skipping report upload.",
    );
    return null;
  }

  const doctorProject = `${context.workspaceId}/${context.projectSlug}`;

  try {
    const response = await fetch(`${apiUrl}/api/doctor/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "X-Doctor-Project": doctorProject,
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

/**
 * Report using GitHub Actions OIDC token (original flow).
 */
async function reportWithOidc(
  report: DoctorReport,
  apiUrl: string,
): Promise<ReportResult | null> {
  if (!isGitHubActionsWithOidc()) {
    console.warn(
      "  Warning: --report requires GitHub Actions OIDC or --api-key flag.\n" +
      "  For GitHub Actions: add `permissions: id-token: write` to your workflow.\n" +
      "  For local/non-GitHub CI: use --api-key <your-better-auth-api-key>\n" +
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
