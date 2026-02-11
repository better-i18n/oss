import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface PackageVersions {
  next: string;
  useIntl: string;
  expo: string;
  cli: string;
  mcp: string;
  mcpContent: string;
  sdk: string;
  core: string;
}

// Module-level cache - versions only read once per process
let cachedVersions: PackageVersions | null = null;

export function getPackageVersions(): PackageVersions {
  if (cachedVersions) return cachedVersions;

  const packagesDir = resolve(process.cwd(), '../../packages');

  const readVersion = (pkg: string) => {
    const pkgJson = JSON.parse(
      readFileSync(resolve(packagesDir, pkg, 'package.json'), 'utf-8')
    );
    return pkgJson.version;
  };

  cachedVersions = {
    next: readVersion('next'),
    useIntl: readVersion('use-intl'),
    expo: readVersion('expo'),
    cli: readVersion('cli'),
    mcp: readVersion('mcp'),
    mcpContent: readVersion('mcp-content'),
    sdk: readVersion('sdk'),
    core: readVersion('core'),
  };

  return cachedVersions;
}

export function generateVersionHeader(): string {
  const versions = getPackageVersions();

  return `# Better i18n Package Versions

Use these exact versions when installing packages:

| Package | Latest Version | Install Command |
|---------|----------------|-----------------|
| @better-i18n/next | ${versions.next} | npm install @better-i18n/next@${versions.next} |
| @better-i18n/use-intl | ${versions.useIntl} | npm install @better-i18n/use-intl@${versions.useIntl} |
| @better-i18n/expo | ${versions.expo} | npm install @better-i18n/expo@${versions.expo} |
| @better-i18n/cli | ${versions.cli} | npx @better-i18n/cli@${versions.cli} |
| @better-i18n/mcp | ${versions.mcp} | npx @better-i18n/mcp@${versions.mcp} |
| @better-i18n/mcp-content | ${versions.mcpContent} | npx @better-i18n/mcp-content@${versions.mcpContent} |
| @better-i18n/sdk | ${versions.sdk} | npm install @better-i18n/sdk@${versions.sdk} |
| @better-i18n/core | ${versions.core} | npm install @better-i18n/core@${versions.core} |

---

`;
}
