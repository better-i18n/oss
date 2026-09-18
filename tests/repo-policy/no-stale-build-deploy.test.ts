import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * better-i18n-mcp was deployed from a four-month-old bundle on 2026-09-18.
 * Its wrangler `main` is dist/worker.js, dist/ is gitignored, and a bare
 * `wrangler deploy` ships whatever happens to be on the machine — the deploy
 * reported success and changed nothing, while the worker kept throwing 3.19M
 * exceptions a week. Only `npm run deploy`, which builds first, was ever
 * correct there, and the only thing saying so was a README paragraph.
 *
 * The rule: if a worker's entrypoint is a gitignored build artifact, its
 * deploy script must build before deploying. Every worker in this repo has a
 * gitignored entrypoint and every one of them builds first today, so this
 * passes as a guard — it fails the day someone adds a worker that does not,
 * or drops the build step from one that does.
 *
 * (The platform repo has the same test over its own workers.)
 */
const repoRoot = join(import.meta.dirname, "..", "..");

export interface WorkerEntrypoint {
  name: string;
  main: string | null;
  mainIsBuildArtifact: boolean;
  deployScript: string | null;
}

/** Why this worker could ship a stale bundle, or null when it cannot. */
export function staleBuildRisk(worker: WorkerEntrypoint): string | null {
  if (!worker.main || !worker.mainIsBuildArtifact) return null;
  const deploy = worker.deployScript ?? "";
  if (!deploy) {
    return `${worker.name}: main (${worker.main}) is a gitignored build artifact and the package has no deploy script that builds it`;
  }
  const buildsFirst =
    /(^|&&|;)\s*(npm run build|bun run build|pnpm build|yarn build|tsc|vite build|wrangler build)/.test(
      deploy,
    );
  return buildsFirst
    ? null
    : `${worker.name}: main (${worker.main}) is a gitignored build artifact but "deploy" (${deploy}) does not build first`;
}

function stripJsonComments(source: string): string {
  return source.replace(/^\s*\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function isGitIgnored(path: string): boolean {
  try {
    execFileSync("git", ["check-ignore", "-q", path], { cwd: repoRoot });
    return true;
  } catch {
    return false;
  }
}

function readWorkers(): WorkerEntrypoint[] {
  return ["apps", "packages"]
    .flatMap((group) => {
      const dir = join(repoRoot, group);
      return existsSync(dir)
        ? readdirSync(dir).map((entry) => join(dir, entry, "wrangler.jsonc"))
        : [];
    })
    .filter((configPath) => existsSync(configPath))
    .map((configPath) => {
      const config = JSON.parse(stripJsonComments(readFileSync(configPath, "utf8"))) as {
        name?: string;
        main?: string;
      };
      const packagePath = join(dirname(configPath), "package.json");
      const scripts = existsSync(packagePath)
        ? ((JSON.parse(readFileSync(packagePath, "utf8")) as { scripts?: Record<string, string> })
            .scripts ?? {})
        : {};
      const main = config.main ?? null;
      return {
        name: config.name ?? dirname(configPath),
        main,
        mainIsBuildArtifact: main ? isGitIgnored(join(dirname(configPath), main)) : false,
        deployScript: scripts.deploy ?? null,
      };
    });
}

describe("staleBuildRisk", () => {
  const mcpShape: WorkerEntrypoint = {
    name: "better-i18n-mcp",
    main: "dist/worker.js",
    mainIsBuildArtifact: true,
    deployScript: "npm run build && wrangler deploy -c wrangler.jsonc",
  };

  it("passes the MCP worker as it is today: build, then deploy", () => {
    expect(staleBuildRisk(mcpShape)).toBeNull();
  });

  it("catches what we actually did: a bare wrangler deploy on a gitignored entrypoint", () => {
    expect(
      staleBuildRisk({ ...mcpShape, deployScript: "wrangler deploy -c wrangler.jsonc" }),
    ).toMatch(/does not build first/);
  });

  it("catches a build artifact with no deploy script at all", () => {
    expect(staleBuildRisk({ ...mcpShape, deployScript: null })).toMatch(/no deploy script/);
  });

  it("leaves tracked source alone — wrangler bundles that at deploy time", () => {
    expect(
      staleBuildRisk({
        ...mcpShape,
        main: "src/worker.ts",
        mainIsBuildArtifact: false,
        deployScript: "wrangler deploy",
      }),
    ).toBeNull();
  });
});

describe("every worker in this repo", () => {
  const workers = readWorkers();

  it("finds the workers to check, including the MCP one", () => {
    expect(workers.map((w) => w.name)).toContain("better-i18n-mcp");
  });

  for (const worker of workers) {
    it(`${worker.name} cannot ship a stale bundle`, () => {
      expect(staleBuildRisk(worker)).toBeNull();
    });
  }
});
