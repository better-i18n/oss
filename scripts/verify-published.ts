#!/usr/bin/env bun
/**
 * Verify that what is on npm can actually be installed and used.
 *
 * `npm publish` succeeding tells you a tarball was accepted. It does not tell
 * you a customer can install it. Three incidents in this repo came from that
 * gap, and each one is a check below:
 *
 *   - @better-i18n/admin carried a peer dependency on @better-i18n/mcp-types
 *     0.0.2, a version that has never existed on npm. Every install failed
 *     with ETARGET. Published 2026-05-16, found by a customer on 2026-08-16.
 *   - @better-i18n/remix shipped React components with no @types/react, so
 *     tsc failed, dist/ was never written, and an empty package went out.
 *     @better-i18n/server 0.2.2 through 0.2.9 went the same way.
 *   - `bun publish` exits 0 on a failed publish, and the release script pipes
 *     through `|| true`, so a red publish reads as a green one.
 *
 * Usage:
 *   bun run verify:published                        # every publishable package, at its local version
 *   bun run verify:published @better-i18n/admin     # one package, at its local version
 *   bun run verify:published @better-i18n/admin@0.2.2
 *
 * Exits non-zero if any check fails, so it can gate a release.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { builtinModules } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const REPO = resolve(import.meta.dir, "..");
const PACKAGES_DIR = join(REPO, "packages");

type Manifest = {
  name: string;
  version: string;
  private?: boolean;
  main?: string;
  module?: string;
  types?: string;
  bin?: string | Record<string, string>;
  files?: string[];
  exports?: unknown;
};

type Failure = { check: string; detail: string };

function readManifest(path: string): Manifest {
  return JSON.parse(readFileSync(path, "utf8")) as Manifest;
}

function run(cmd: string, args: string[], cwd: string): { ok: boolean; output: string } {
  try {
    const output = execFileSync(cmd, args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, npm_config_audit: "false", npm_config_fund: "false" },
    });
    return { ok: true, output };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string; message?: string };
    return { ok: false, output: `${e.stdout ?? ""}${e.stderr ?? ""}` || e.message || "unknown error" };
  }
}

/** "@scope/name/sub" -> "@scope/name", "name/sub" -> "name" */
function packageOf(specifier: string): string {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]!;
}

function walk(dir: string, match: (f: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, match, acc);
    else if (match(entry)) acc.push(full);
  }
  return acc;
}

const BUILTINS = new Set([...builtinModules, ...builtinModules.map((m) => `node:${m}`)]);
const IMPORT_RE = /(?:from\s*|require\(\s*|import\(\s*)["']([^"']+)["']/g;

/** Entry points a consumer can reach, drawn from the fields that name files. */
function entryFiles(manifest: Manifest): string[] {
  const out: string[] = [];
  for (const field of [manifest.main, manifest.module, manifest.types]) {
    if (typeof field === "string") out.push(field);
  }
  if (typeof manifest.bin === "string") out.push(manifest.bin);
  else if (manifest.bin) out.push(...Object.values(manifest.bin));

  const fromExports = (node: unknown): void => {
    if (typeof node === "string") {
      if (node.startsWith(".")) out.push(node);
      return;
    }
    if (node && typeof node === "object") {
      for (const value of Object.values(node as Record<string, unknown>)) fromExports(value);
    }
  };
  fromExports(manifest.exports);
  return [...new Set(out)];
}

function verify(name: string, version: string): Failure[] {
  const failures: Failure[] = [];
  const spec = `${name}@${version}`;

  // 1. The version has to be on the registry at all.
  const view = run("npm", ["view", spec, "version"], REPO);
  if (!view.ok || view.output.trim() !== version) {
    failures.push({
      check: "published",
      detail: `${spec} is not on the registry (npm view returned ${view.output.trim() || "nothing"})`,
    });
    return failures; // nothing else is meaningful
  }

  // 2. A consumer with an empty project has to be able to install it. This is
  //    the check that would have caught the admin peer dependency.
  const dir = mkdtempSync(join(tmpdir(), "verify-published-"));
  writeFileSync(join(dir, "package.json"), `${JSON.stringify({ name: "consumer", private: true }, null, 2)}\n`);
  const install = run("npm", ["install", spec, "--no-audit", "--no-fund"], dir);
  if (!install.ok) {
    const firstError = install.output.split("\n").find((l) => l.includes("npm error")) ?? install.output.slice(0, 200);
    failures.push({ check: "installs", detail: firstError.trim() });
    return failures;
  }

  const installed = join(dir, "node_modules", ...name.split("/"));
  if (!existsSync(installed)) {
    failures.push({ check: "installs", detail: `install reported success but ${name} is not in node_modules` });
    return failures;
  }

  const manifest = readManifest(join(installed, "package.json"));

  // 3. The files the manifest points at have to exist. An empty dist/ publishes
  //    silently, and the package looks fine until someone imports it.
  for (const entry of entryFiles(manifest)) {
    if (!existsSync(join(installed, entry))) {
      failures.push({ check: "entry points", detail: `${entry} is named in package.json but missing from the tarball` });
    }
  }
  if (manifest.files?.includes("README.md") && !existsSync(join(installed, "README.md"))) {
    failures.push({ check: "entry points", detail: "files lists README.md, but the tarball has none, so the npm page is blank" });
  }

  // 4. Every bare import inside the shipped code has to resolve from the
  //    installed tree. A type-only import of a package that is not a real
  //    dependency is exactly how admin ended up with no types.
  const shipped = walk(installed, (f) => /\.(js|mjs|cjs|d\.ts)$/.test(f)).filter(
    (f) => !f.includes(`${installed}/node_modules`),
  );
  const unresolved = new Map<string, string>();
  for (const file of shipped) {
    const source = readFileSync(file, "utf8");
    for (const match of source.matchAll(IMPORT_RE)) {
      const specifier = match[1]!;
      if (specifier.startsWith(".") || specifier.startsWith("/") || BUILTINS.has(specifier)) continue;
      const dep = packageOf(specifier);
      if (dep === name) continue;
      if (!existsSync(join(dir, "node_modules", ...dep.split("/")))) {
        unresolved.set(dep, file.slice(installed.length + 1));
      }
    }
  }
  for (const [dep, file] of unresolved) {
    failures.push({
      check: "imports resolve",
      detail: `${file} imports "${dep}", which the install does not provide (declare it in dependencies)`,
    });
  }

  // 5. TypeScript has to be able to consume it.
  if (entryFiles(manifest).some((f) => f.endsWith(".d.ts")) || manifest.types) {
    const tsc = run("npm", ["install", "typescript@5.9.3", "--no-audit", "--no-fund"], dir);
    if (tsc.ok) {
      writeFileSync(join(dir, "probe.ts"), `import * as pkg from "${name}";\nexport default pkg;\n`);
      writeFileSync(
        join(dir, "tsconfig.json"),
        `${JSON.stringify(
          {
            compilerOptions: {
              strict: true,
              noEmit: true,
              module: "esnext",
              target: "es2022",
              moduleResolution: "bundler",
              skipLibCheck: true,
            },
            files: ["probe.ts"],
          },
          null,
          2,
        )}\n`,
      );
      const check = run(join(dir, "node_modules", ".bin", "tsc"), ["-p", "tsconfig.json"], dir);
      if (!check.ok) {
        failures.push({ check: "typescript import", detail: check.output.split("\n")[0]!.trim() });
      }
    }
  }

  return failures;
}

function publishableTargets(): Array<{ name: string; version: string }> {
  const targets: Array<{ name: string; version: string }> = [];
  for (const entry of readdirSync(PACKAGES_DIR)) {
    const manifestPath = join(PACKAGES_DIR, entry, "package.json");
    if (!existsSync(manifestPath)) continue;
    const manifest = readManifest(manifestPath);
    if (manifest.private) continue;
    targets.push({ name: manifest.name, version: manifest.version });
  }
  return targets;
}

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((arg) => {
      const at = arg.lastIndexOf("@");
      if (at > 0) return { name: arg.slice(0, at), version: arg.slice(at + 1) };
      const local = publishableTargets().find((t) => t.name === arg);
      if (!local) throw new Error(`${arg} is not a publishable package in this workspace, and no version was given`);
      return local;
    })
  : publishableTargets();

mkdirSync(tmpdir(), { recursive: true });

let failed = 0;
for (const { name, version } of targets) {
  process.stdout.write(`  ${name}@${version} … `);
  const failures = verify(name, version);
  if (failures.length === 0) {
    console.log("ok");
    continue;
  }
  failed += 1;
  console.log("FAILED");
  for (const f of failures) console.log(`      ${f.check}: ${f.detail}`);
}

console.log();
if (failed > 0) {
  console.log(`${failed} of ${targets.length} package(s) are not usable as published.`);
  process.exit(1);
}
console.log(`${targets.length} package(s) install and import cleanly from the registry.`);
