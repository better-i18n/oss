/**
 * Build-time agent skills indexer.
 *
 * Reads skill markdown from `content/agent-skills/<skill>/SKILL.md`, copies
 * each skill file into `public/.well-known/agent-skills/<skill>/SKILL.md`,
 * computes SHA-256 of the copied body, and emits an index at
 * `public/.well-known/agent-skills/index.json` (Cloudflare Agent Skills
 * Discovery RFC v0.2.0 shape).
 *
 * Runs via `package.json` build script alongside `fix-sitemap.ts` and
 * `compress-html.ts`. Safe to run anytime — output is fully deterministic
 * from content/ inputs.
 */
import {
  createHash,
} from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const SITE_URL = "https://better-i18n.com";
const SOURCE_DIR = path.join(process.cwd(), "content", "agent-skills");
const OUTPUT_DIR = path.join(
  process.cwd(),
  "public",
  ".well-known",
  "agent-skills",
);

interface SkillFrontmatter {
  readonly name?: string;
  readonly description?: string;
  readonly version?: string;
  readonly license?: string;
  readonly homepage?: string;
}

interface SkillIndexEntry {
  readonly name: string;
  readonly type: "claude-skill";
  readonly description: string;
  readonly version?: string;
  readonly license?: string;
  readonly homepage?: string;
  readonly url: string;
  readonly sha256: string;
}

/**
 * Minimal YAML frontmatter parser sufficient for scalar string values.
 * Skills only use simple scalar frontmatter — no nested objects or arrays —
 * so pulling in a full YAML dependency would be overkill.
 */
function parseFrontmatter(body: string): {
  readonly meta: SkillFrontmatter;
  readonly content: string;
} {
  if (!body.startsWith("---\n")) {
    return { meta: {}, content: body };
  }
  const end = body.indexOf("\n---", 4);
  if (end === -1) {
    return { meta: {}, content: body };
  }
  const header = body.slice(4, end);
  const content = body.slice(end + 4).replace(/^\n/, "");
  const meta: Record<string, string> = {};
  let currentKey: string | null = null;
  let accumulator: string[] = [];
  for (const rawLine of header.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    // Folded-scalar continuation lines (indented)
    if (/^\s+/.test(line) && currentKey) {
      accumulator.push(line.trim());
      continue;
    }
    if (currentKey) {
      meta[currentKey] = accumulator.join(" ").trim();
      currentKey = null;
      accumulator = [];
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (value === ">-" || value === ">" || value === "|") {
      currentKey = key;
      accumulator = [];
    } else {
      meta[key] = value.replace(/^["']|["']$/g, "").trim();
    }
  }
  if (currentKey) {
    meta[currentKey] = accumulator.join(" ").trim();
  }
  return { meta, content };
}

function sha256(body: string): string {
  return createHash("sha256").update(body, "utf-8").digest("hex");
}

function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

function main(): void {
  if (!existsSync(SOURCE_DIR)) {
    console.warn(
      `[agent-skills] ${SOURCE_DIR} not found — nothing to index`,
    );
    return;
  }

  ensureDir(OUTPUT_DIR);
  const skills: SkillIndexEntry[] = [];
  /* Newest source SKILL.md, for `generatedAt` — see the note at the index. */
  let newestSourceMs = 0;

  for (const entry of readdirSync(SOURCE_DIR)) {
    const entryPath = path.join(SOURCE_DIR, entry);
    if (!statSync(entryPath).isDirectory()) continue;
    const skillFile = path.join(entryPath, "SKILL.md");
    if (!existsSync(skillFile)) {
      console.warn(
        `[agent-skills] ${entry}/SKILL.md missing — skipping`,
      );
      continue;
    }

    const body = readFileSync(skillFile, "utf-8");
    newestSourceMs = Math.max(newestSourceMs, statSync(skillFile).mtimeMs);
    const { meta } = parseFrontmatter(body);
    const name = meta.name ?? entry;
    const description =
      meta.description ??
      `Better i18n agent skill: ${name}`;

    const outDir = path.join(OUTPUT_DIR, name);
    ensureDir(outDir);
    const outFile = path.join(outDir, "SKILL.md");
    writeFileSync(outFile, body);

    const entryUrl = `${SITE_URL}/.well-known/agent-skills/${name}/SKILL.md`;
    skills.push({
      name,
      type: "claude-skill",
      description,
      version: meta.version,
      license: meta.license,
      homepage: meta.homepage,
      url: entryUrl,
      sha256: sha256(body),
    });
  }

  // Sort alphabetically for deterministic output
  skills.sort((a, b) => a.name.localeCompare(b.name));

  /*
   * `generatedAt` tracks the SOURCE, not the clock.
   *
   * It was `new Date().toISOString()`, two lines under a sort whose comment
   * says "for deterministic output" — so every build rewrote this committed
   * file with a new timestamp and left the working tree dirty, on a file whose
   * content was otherwise byte-identical. That is churn masquerading as
   * information: it says when the build ran, which nobody consuming a
   * well-known index can use, while each skill already carries a `sha256` that
   * answers the question that matters ("has this changed?").
   *
   * Taking the newest source `SKILL.md` mtime keeps the field (its presence may
   * be load-bearing for a consumer — the `$schema` URL above currently 404s, so
   * I could not confirm whether it is required, and dropping a field from a
   * published document on a guess is worse than keeping it honest) while making
   * it change only when a skill actually changes. Same input, same output.
   */
  const index = {
    $schema: "https://agentskills.io/schemas/v0.2.0/index.json",
    generatedAt: new Date(newestSourceMs).toISOString(),
    skills,
  };
  writeFileSync(
    path.join(OUTPUT_DIR, "index.json"),
    `${JSON.stringify(index, null, 2)}\n`,
  );
  console.log(
    `[agent-skills] indexed ${skills.length} skill(s) → ${OUTPUT_DIR}/index.json`,
  );
}

main();
