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

  const index = {
    $schema: "https://agentskills.io/schemas/v0.2.0/index.json",
    generatedAt: new Date().toISOString(),
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
