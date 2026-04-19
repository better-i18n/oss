import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface PackageVersions {
  next: string;
  useIntl: string;
  expo: string;
  remix: string;
  server: string;
  cli: string;
  mcp: string;
  mcpContent: string;
  sdk: string;
  core: string;
}

// Source of truth hierarchy:
//   1. npm registry — what `npm install` can actually resolve (ground truth for users)
//   2. monorepo package.json — fallback when npm is unreachable at build time
//
// Why this order: a changeset can bump package.json locally before CI publishes to
// npm (or if publish silently fails). Serving the pre-publish version to AI prompts
// produces copy-paste `npm install` commands that 404 for users.

const NPM_PACKAGE_NAMES: Record<keyof PackageVersions, string> = {
  next: '@better-i18n/next',
  useIntl: '@better-i18n/use-intl',
  expo: '@better-i18n/expo',
  remix: '@better-i18n/remix',
  server: '@better-i18n/server',
  cli: '@better-i18n/cli',
  mcp: '@better-i18n/mcp',
  mcpContent: '@better-i18n/mcp-content',
  sdk: '@better-i18n/sdk',
  core: '@better-i18n/core',
};

// Local monorepo directory name (fallback only)
const LOCAL_DIRS: Record<keyof PackageVersions, string> = {
  next: 'next',
  useIntl: 'use-intl',
  expo: 'expo',
  remix: 'remix',
  server: 'server',
  cli: 'cli',
  mcp: 'mcp',
  mcpContent: 'mcp-content',
  sdk: 'sdk',
  core: 'core',
};

let cachedVersions: PackageVersions | null = null;

async function fetchNpmLatest(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`, {
      headers: { Accept: 'application/json' },
      // Build-time only — no runtime cache concerns
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { version?: string };
    return body.version ?? null;
  } catch {
    return null;
  }
}

function readLocalVersion(dir: string): string {
  const packagesDir = resolve(process.cwd(), '../../packages');
  const pkgJson = JSON.parse(
    readFileSync(resolve(packagesDir, dir, 'package.json'), 'utf-8'),
  );
  return pkgJson.version;
}

async function resolveOne(key: keyof PackageVersions): Promise<string> {
  const npmVersion = await fetchNpmLatest(NPM_PACKAGE_NAMES[key]);
  if (npmVersion) return npmVersion;
  return readLocalVersion(LOCAL_DIRS[key]);
}

export async function getPackageVersions(): Promise<PackageVersions> {
  if (cachedVersions) return cachedVersions;

  const keys = Object.keys(NPM_PACKAGE_NAMES) as (keyof PackageVersions)[];
  const resolved = await Promise.all(keys.map((k) => resolveOne(k)));

  cachedVersions = Object.fromEntries(
    keys.map((k, i) => [k, resolved[i]]),
  ) as unknown as PackageVersions;

  return cachedVersions;
}

export async function generateVersionHeader(): Promise<string> {
  const versions = await getPackageVersions();

  return `# Better i18n Package Versions

Use these exact versions when installing packages:

| Package | Latest Version | Install Command |
|---------|----------------|-----------------|
| @better-i18n/next | ${versions.next} | npm install @better-i18n/next@${versions.next} |
| @better-i18n/use-intl | ${versions.useIntl} | npm install @better-i18n/use-intl@${versions.useIntl} |
| @better-i18n/expo | ${versions.expo} | npm install @better-i18n/expo@${versions.expo} |
| @better-i18n/remix | ${versions.remix} | npm install @better-i18n/remix@${versions.remix} |
| @better-i18n/server | ${versions.server} | npm install @better-i18n/server@${versions.server} |
| @better-i18n/cli | ${versions.cli} | npx @better-i18n/cli@${versions.cli} |
| @better-i18n/mcp | ${versions.mcp} | npx @better-i18n/mcp@${versions.mcp} |
| @better-i18n/mcp-content | ${versions.mcpContent} | npx @better-i18n/mcp-content@${versions.mcpContent} |
| @better-i18n/sdk | ${versions.sdk} | npm install @better-i18n/sdk@${versions.sdk} |
| @better-i18n/core | ${versions.core} | npm install @better-i18n/core@${versions.core} |

---

`;
}
