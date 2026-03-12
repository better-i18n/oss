/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MCP Flow Test: create → translate → update source → delete → verify
 *
 * Usage:
 *   BETTER_I18N_API_KEY=xxx BETTER_I18N_TEST_PROJECT=org/project bun run packages/mcp/test-flow.ts
 *
 * Tests the full MCP tool chain against the live API.
 */

import { createBetterI18nClient } from "./src/client.js";

const apiKey = process.env.BETTER_I18N_API_KEY;
if (!apiKey) {
  console.error("BETTER_I18N_API_KEY is required");
  process.exit(1);
}

const apiUrl = process.env.BETTER_I18N_API_URL || "https://dash.better-i18n.com";
const client = createBetterI18nClient({ apiUrl, apiKey, debug: true });

const testProject = process.env.BETTER_I18N_TEST_PROJECT;
if (!testProject) {
  console.error("BETTER_I18N_TEST_PROJECT is required (format: org/project)");
  process.exit(1);
}

const [ORG_SLUG, PROJECT_SLUG] = testProject.split("/");
if (!ORG_SLUG || !PROJECT_SLUG || testProject.split("/").length !== 2) {
  console.error(
    `Invalid BETTER_I18N_TEST_PROJECT: "${testProject}". Expected "org/project"`,
  );
  process.exit(1);
}

async function main() {
  const testKey = `_mcp_test_${Date.now()}`;
  let keyId: string | undefined;

  try {
    // 1. Create key
    console.log("\n=== 1. createKeys ===");
    const created = await (client as any).mcp.createKeys.mutate({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      k: [{ n: testKey, ns: "test", v: "Original source text" }],
    });
    console.log(`Created: ${created.cnt} key(s)`);
    keyId = created.k?.[0]?.id;
    if (!keyId) {
      console.error("❌ createKeys failed — no key id returned");
      process.exit(1);
    }
    console.log(`  keyId: ${keyId}`);
    console.log(`  key: ${testKey}`);
    console.log("✅ createKeys");

    // 2. Add translation (target language)
    console.log("\n=== 2. updateKeys — add Turkish translation ===");
    const translated = await (client as any).mcp.updateKeys.mutate({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      t: [{ id: keyId, l: "tr", t: "Orijinal kaynak metin" }],
    });
    console.log(`Updated: ${translated.cnt} key(s)`);
    const translatedEntry = translated.upd?.find((u: any) => u.id === keyId);
    if (!translatedEntry || !translatedEntry.lng?.includes("tr")) {
      console.error("❌ updateKeys (translation) failed");
      process.exit(1);
    }
    console.log("✅ updateKeys — translation added");

    // 3. Update source text
    console.log("\n=== 3. updateKeys — update source text (s=true) ===");
    const srcUpdated = await (client as any).mcp.updateKeys.mutate({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      t: [{ id: keyId, l: "en", t: "Updated source text", s: true }],
    });
    console.log(`Updated: ${srcUpdated.cnt} key(s)`);
    const srcEntry = srcUpdated.upd?.find((u: any) => u.id === keyId);
    if (!srcEntry?.src) {
      console.error("❌ updateKeys (source) failed — src not true");
      process.exit(1);
    }
    console.log("✅ updateKeys — source text updated");

    // 4. Verify via getAllTranslations
    console.log("\n=== 4. getAllTranslations — verify key exists with updated data ===");
    const allKeys = await (client as any).mcp.getAllTranslations.query({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      search: testKey,
      languages: ["tr"],
    });
    const found = allKeys.keys.find((k: any) => k.k === testKey);
    if (!found) {
      console.error("❌ getAllTranslations — key not found");
      process.exit(1);
    }
    console.log(`  id: ${found.id}`);
    console.log(`  sourceText: "${found.src}"`);
    console.log(`  tr: "${found.tr?.tr?.t || "(missing)"}"`);
    if (found.src !== "Updated source text") {
      console.error("❌ source text mismatch");
      process.exit(1);
    }
    if (!found.tr?.tr?.t) {
      console.error("❌ Turkish translation missing");
      process.exit(1);
    }
    console.log("✅ getAllTranslations — verified");

    // 5. Delete key
    console.log("\n=== 5. deleteKeys ===");
    const deleted = await (client as any).mcp.deleteKeys.mutate({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      keyIds: [keyId],
    });
    console.log(`Marked: ${deleted.cnt} key(s) for deletion`);
    if (deleted.cnt !== 1) {
      console.error("❌ deleteKeys failed");
      process.exit(1);
    }
    keyId = undefined;
    console.log("✅ deleteKeys — soft deleted");

    // 6. Verify deletion via getAllTranslations
    console.log("\n=== 6. getAllTranslations — verify key is gone ===");
    const afterDelete = await (client as any).mcp.getAllTranslations.query({
      orgSlug: ORG_SLUG,
      projectSlug: PROJECT_SLUG,
      search: testKey,
      languages: ["tr"],
    });
    const stillExists = afterDelete.keys.find((k: any) => k.k === testKey);
    if (stillExists) {
      console.error("❌ key still visible after delete");
      process.exit(1);
    }
    console.log("✅ key no longer in getAllTranslations");

    console.log("\n=== ALL TESTS PASSED ===");
    console.log("Flow: createKeys → updateKeys (translation) → updateKeys (source) → getAllTranslations (verify) → deleteKeys → getAllTranslations (gone) ✅");
  } finally {
    if (keyId) {
      await (client as any).mcp.deleteKeys.mutate({
        orgSlug: ORG_SLUG,
        projectSlug: PROJECT_SLUG,
        keyIds: [keyId],
      });
      console.log("\n=== CLEANUP ===");
      console.log(`Deleted leftover test key: ${keyId}`);
    }
  }
}

main().catch((err) => {
  console.error("\n❌ ERROR:", err.message || err);
  process.exit(1);
});
