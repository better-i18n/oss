/**
 * MCP End-to-End Smoke Harness
 *
 * Exercises the four agentic-roadmap tools (cancelSync, getSync waitMs,
 * getTranslationContext v1, getTranslationContext v2 RAG) against a
 * real running Better i18n API. Designed to gate a deploy: run after
 * the platform is live, fail the pipeline if any critical tool regresses.
 *
 * READ-ONLY BY DEFAULT. The only mutation — cancelSync — is opt-in via
 * the `--include-cancel` flag AND requires a pre-queued pending syncId.
 *
 * Env vars (required):
 *   BETTER_I18N_API_URL       e.g. https://api.better-i18n.dev
 *   BETTER_I18N_API_KEY       API key for the test project
 *   BETTER_I18N_ORG_SLUG      Organization slug
 *   BETTER_I18N_PROJECT_SLUG  Project slug
 *
 * Env vars (optional):
 *   BETTER_I18N_SMOKE_SYNC_ID         Existing syncId → drives getSync(waitMs) check
 *   BETTER_I18N_SMOKE_CANCEL_SYNC_ID  Pending syncId  → drives cancelSync when --include-cancel
 *   BETTER_I18N_SMOKE_KEYS            JSON array of key UUIDs → drives v2 RAG
 *
 * Run:
 *   bun packages/mcp/scripts/smoke.ts
 *   bun packages/mcp/scripts/smoke.ts --include-cancel
 *
 * Exits 0 on all-green, 1 on any failure.
 */

import { createBetterI18nClient } from "../src/client.js";

// ──────────────────────────────────────────────────────────────────────
// Tiny framework: record each step, print summary, exit accordingly.
// ──────────────────────────────────────────────────────────────────────

type Status = "pass" | "fail" | "skip";

interface StepResult {
  name: string;
  status: Status;
  note?: string;
  durationMs?: number;
}

const results: StepResult[] = [];

async function step(
  name: string,
  fn: () => Promise<string | undefined>,
): Promise<void> {
  const started = Date.now();
  try {
    const note = await fn();
    results.push({
      name,
      status: "pass",
      note,
      durationMs: Date.now() - started,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({
      name,
      status: "fail",
      note: message,
      durationMs: Date.now() - started,
    });
  }
}

function skipStep(name: string, reason: string): void {
  results.push({ name, status: "skip", note: reason });
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

// ──────────────────────────────────────────────────────────────────────
// Env + setup
// ──────────────────────────────────────────────────────────────────────

const apiUrl = process.env.BETTER_I18N_API_URL;
const apiKey = process.env.BETTER_I18N_API_KEY;
const orgSlug = process.env.BETTER_I18N_ORG_SLUG;
const projectSlug = process.env.BETTER_I18N_PROJECT_SLUG;
const args = new Set(process.argv.slice(2));
const includeCancel = args.has("--include-cancel");

if (!apiUrl || !apiKey || !orgSlug || !projectSlug) {
  console.error(
    "❌ Missing required env. Need BETTER_I18N_API_URL, BETTER_I18N_API_KEY, BETTER_I18N_ORG_SLUG, BETTER_I18N_PROJECT_SLUG.",
  );
  process.exit(2);
}

const client = createBetterI18nClient({ apiUrl, apiKey });

// ──────────────────────────────────────────────────────────────────────
// Step implementations — one per feature
// ──────────────────────────────────────────────────────────────────────

await step("getTranslationContext v1 — project-wide snapshot", async () => {
  const res = await client.mcp.getTranslationContext.query({
    orgSlug,
    projectSlug,
  });
  assert(typeof res.prj === "string", "response missing compact prj");
  assert(Array.isArray(res.gl), "response.gl must be an array");
  assert(Array.isArray(res.tgt), "response.tgt must be an array");
  assert(
    typeof res.glt === "number",
    "response.glt must be a number (glossary total)",
  );
  // rules MUST be undefined when keys wasn't passed (v1 contract).
  assert(
    res.rules === undefined,
    "v1 call unexpectedly returned rules[] — forward-compat contract broken",
  );
  return `glossary=${res.gl.length} / total=${res.glt}, tgt=[${res.tgt.join(",")}]`;
});

const keysEnv = process.env.BETTER_I18N_SMOKE_KEYS;
let keyList: string[] | null = null;
if (keysEnv) {
  try {
    const parsed = JSON.parse(keysEnv);
    if (
      Array.isArray(parsed) &&
      parsed.every((k) => typeof k === "string" && k.length > 0)
    ) {
      keyList = parsed;
    }
  } catch {
    // fall through — reported below
  }
}

if (!keyList) {
  skipStep(
    "getTranslationContext v2 — per-key RAG",
    "BETTER_I18N_SMOKE_KEYS not set (expected JSON array of key UUIDs)",
  );
} else {
  await step("getTranslationContext v2 — per-key RAG", async () => {
    const res = await client.mcp.getTranslationContext.query({
      orgSlug,
      projectSlug,
      keys: keyList!,
      kPerKey: 5,
    });
    // Either rules[] populated (happy path) or rules undefined + hint
    // explaining a degraded path (no embeddings / no api key / circuit).
    if (res.rules === undefined) {
      assert(
        typeof res.hint === "string" && res.hint.length > 0,
        "degraded v2 response must include a hint",
      );
      return `degraded: ${res.hint}`;
    }
    assert(
      res.rules.length <= keyList!.length,
      "rules cannot exceed supplied keys",
    );
    for (const rule of res.rules) {
      assert(typeof rule.id === "string", "each rule must have id");
      assert(Array.isArray(rule.sim), "each rule must have sim[]");
      for (const item of rule.sim) {
        assert(
          typeof item.s === "number" && item.s >= 0 && item.s <= 1,
          `score out of range: ${item.s}`,
        );
      }
    }
    const hits = res.rules.reduce((n, r) => n + r.sim.length, 0);
    return `rules=${res.rules.length}, totalHits=${hits}`;
  });
}

const smokeSyncId = process.env.BETTER_I18N_SMOKE_SYNC_ID;
if (!smokeSyncId) {
  skipStep(
    "getSync with waitMs — blocking wait",
    "BETTER_I18N_SMOKE_SYNC_ID not set (expected any completed / failed syncId)",
  );
} else {
  await step("getSync with waitMs — blocking wait", async () => {
    // Pass a short waitMs — if the job is already terminal the call returns
    // immediately. If we picked a pending sync by mistake, it just times out
    // and we still validate shape without corrupting data.
    const started = Date.now();
    const res = await client.mcp.getSync.query({
      syncId: smokeSyncId,
      waitMs: 2000,
    });
    const elapsed = Date.now() - started;
    assert(res.id === smokeSyncId, "response id mismatch");
    assert(typeof res.st === "string", "response missing status (st)");
    // If the job is already terminal, the blocking wait must short-circuit
    // (well under 2000ms). If it's still pending the full wait is legal.
    const terminal = ["completed", "failed", "cancelled"].includes(res.st);
    if (terminal) {
      assert(
        elapsed < 1500,
        `terminal job returned slowly (${elapsed}ms) — blocking wait not short-circuiting`,
      );
    }
    return `status=${res.st} elapsed=${elapsed}ms`;
  });
}

const cancelSyncId = process.env.BETTER_I18N_SMOKE_CANCEL_SYNC_ID;
if (!includeCancel) {
  skipStep(
    "cancelSync — queued → cancelled",
    "--include-cancel flag not passed (write operation, opt-in)",
  );
} else if (!cancelSyncId) {
  skipStep(
    "cancelSync — queued → cancelled",
    "--include-cancel passed but BETTER_I18N_SMOKE_CANCEL_SYNC_ID not set",
  );
} else {
  await step("cancelSync — queued → cancelled", async () => {
    const res = await client.mcp.cancelSync.mutate({
      orgSlug,
      projectSlug,
      syncId: cancelSyncId,
    });
    assert(res.id === cancelSyncId, "response id mismatch");
    assert(typeof res.can === "boolean", "response.can must be a boolean");
    assert(
      typeof res.prev === "string" && res.prev.length > 0,
      "response.prev must describe the previous status",
    );
    assert(
      typeof res.rsn === "string" && res.rsn.length > 0,
      "response.rsn must describe the outcome",
    );
    return `cancelled=${res.can} prev=${res.prev} rsn=${res.rsn}`;
  });
}

// ──────────────────────────────────────────────────────────────────────
// Report
// ──────────────────────────────────────────────────────────────────────

const icon: Record<Status, string> = { pass: "✅", fail: "❌", skip: "⏭️" };
let failed = 0;
console.log("\n── MCP smoke results ──────────────────────────────────────");
for (const r of results) {
  const head = `${icon[r.status]} ${r.name}`;
  const body = r.note ? `  — ${r.note}` : "";
  const time = r.durationMs !== undefined ? ` (${r.durationMs}ms)` : "";
  console.log(`${head}${time}${body}`);
  if (r.status === "fail") failed += 1;
}
console.log("────────────────────────────────────────────────────────────");

if (failed > 0) {
  console.log(`\n${failed} step(s) failed.`);
  process.exit(1);
}
console.log("\nAll green.");
process.exit(0);
