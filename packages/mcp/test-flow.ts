/**
 * MCP Flow Test: create → translate → update source → delete → verify
 *
 * Usage:
 *   BETTER_I18N_API_KEY=xxx bun run packages/mcp/test-flow.ts
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

const ORG_SLUG = "aliosman-co";
const PROJECT_SLUG = "personal";

async function main() {
  const testKey = `_mcp_test_${Date.now()}`;

  // 1. Create key
  console.log("\n=== 1. createKeys ===");
  const created = await (client as any).mcp.createKeys.mutate({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    k: [{ n: testKey, ns: "test", v: "Original source text" }],
  });
  console.log(`Created: ${created.keysCreated} key(s)`);
  const keyId = created.keys[0]?.keyId;
  if (!keyId) { console.error("❌ createKeys failed"); process.exit(1); }
  console.log(`  keyId: ${keyId}`);
  console.log(`  key: ${testKey}`);
  console.log("✅ createKeys");

  // 2. Add translation (target language)
  console.log("\n=== 2. updateKeys — add Turkish translation ===");
  const translated = await (client as any).mcp.updateKeys.mutate({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    t: [{ k: testKey, ns: "test", l: "tr", t: "Orijinal kaynak metin" }],
  });
  console.log(`Updated: ${translated.keysUpdated} key(s)`);
  if (translated.keysUpdated === 0) { console.error("❌ updateKeys (translation) failed"); process.exit(1); }
  console.log("✅ updateKeys — translation added");

  // 3. Update source text
  console.log("\n=== 3. updateKeys — update source text (s=true) ===");
  const srcUpdated = await (client as any).mcp.updateKeys.mutate({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    t: [{ k: testKey, ns: "test", l: "en", t: "Updated source text", s: true }],
  });
  console.log(`Updated: ${srcUpdated.keysUpdated} key(s)`);
  const srcEntry = srcUpdated.updates?.find((u: any) => u.key === testKey);
  if (!srcEntry?.sourceUpdated) { console.error("❌ updateKeys (source) failed — sourceUpdated not true"); process.exit(1); }
  console.log("✅ updateKeys — source text updated");

  // 4. Verify via listKeys
  console.log("\n=== 4. listKeys — verify key exists with updated data ===");
  const allKeys = await (client as any).mcp.getAllTranslations.query({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    search: testKey,
  });
  const found = allKeys.keys.find((k: any) => k.key === testKey);
  if (!found) { console.error("❌ listKeys — key not found"); process.exit(1); }
  console.log(`  id: ${found.id}`);
  console.log(`  sourceText: "${found.sourceText}"`);
  console.log(`  tr: "${found.translations?.tr || "(missing)"}"`);
  if (found.sourceText !== "Updated source text") { console.error("❌ source text mismatch"); process.exit(1); }
  if (!found.translations?.tr) { console.error("❌ Turkish translation missing"); process.exit(1); }
  console.log("✅ listKeys — verified");

  // 5. Delete key
  console.log("\n=== 5. deleteKeys ===");
  const deleted = await (client as any).mcp.deleteKeys.mutate({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    keyIds: [keyId],
  });
  console.log(`Marked: ${deleted.markedCount} key(s) for deletion`);
  if (deleted.markedCount !== 1) { console.error("❌ deleteKeys failed"); process.exit(1); }
  console.log("✅ deleteKeys — soft deleted");

  // 6. Verify deletion via listKeys
  console.log("\n=== 6. listKeys — verify key is gone ===");
  const afterDelete = await (client as any).mcp.getAllTranslations.query({
    orgSlug: ORG_SLUG,
    projectSlug: PROJECT_SLUG,
    search: testKey,
  });
  const stillExists = afterDelete.keys.find((k: any) => k.key === testKey);
  if (stillExists) { console.error("❌ key still visible after delete"); process.exit(1); }
  console.log("✅ key no longer in listKeys");

  console.log("\n=== ALL TESTS PASSED ===");
  console.log("Flow: createKeys → updateKeys (translation) → updateKeys (source) → listKeys (verify) → deleteKeys → listKeys (gone) ✅");
}

main().catch((err) => {
  console.error("\n❌ ERROR:", err.message || err);
  process.exit(1);
});
