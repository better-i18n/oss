import matter from "gray-matter";

export interface ChangelogEntry {
  slug: string;
  title: string;
  date: string;
  version: string;
  category: "feature" | "improvement" | "fix" | "security";
  tags: string[];
  image?: string;
  summary: string;
  content: string;
}

export interface ChangelogMeta {
  slug: string;
  title: string;
  date: string;
  version: string;
  category: "feature" | "improvement" | "fix" | "security";
  tags: string[];
  image?: string;
  summary: string;
}

type SupportedLocale = "en" | "tr";

// Import all MDX files at build time using Vite's glob import
const changelogModulesEn = import.meta.glob<string>(
  "/content/changelog/en/*.mdx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
);

const changelogModulesTr = import.meta.glob<string>(
  "/content/changelog/tr/*.mdx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
);

function parseChangelog(raw: string, filePath: string): ChangelogEntry | null {
  try {
    const { data, content } = matter(raw);

    // Extract first paragraph as summary
    const summaryMatch = content.trim().match(/^([^\n#]+)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    return {
      slug: data.slug || filePath.split("/").pop()?.replace(".mdx", "") || "",
      title: data.title || "",
      date: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : "",
      version: data.version || "",
      category: data.category || "feature",
      tags: data.tags || [],
      image: data.image,
      summary,
      content: content.trim(),
    };
  } catch {
    console.error(`Failed to parse changelog: ${filePath}`);
    return null;
  }
}

function getModulesForLocale(
  locale: SupportedLocale
): Record<string, string> {
  switch (locale) {
    case "tr":
      return changelogModulesTr;
    case "en":
    default:
      return changelogModulesEn;
  }
}

/**
 * Get all changelog entries for a locale, sorted by date (newest first)
 */
export function getChangelogs(locale: SupportedLocale = "en"): ChangelogEntry[] {
  const modules = getModulesForLocale(locale);

  const entries: ChangelogEntry[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const entry = parseChangelog(raw, path);
    if (entry) {
      entries.push(entry);
    }
  }

  // Sort by date descending (newest first)
  return entries.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Get changelog metadata only (without full content)
 */
export function getChangelogsMeta(
  locale: SupportedLocale = "en"
): ChangelogMeta[] {
  return getChangelogs(locale).map(
    ({ content: _content, ...meta }) => meta
  );
}

/**
 * Get a single changelog by slug
 */
export function getChangelogBySlug(
  slug: string,
  locale: SupportedLocale = "en"
): ChangelogEntry | null {
  const changelogs = getChangelogs(locale);
  return changelogs.find((c) => c.slug === slug) || null;
}

/**
 * Get the latest changelog version
 */
export function getLatestVersion(locale: SupportedLocale = "en"): string | null {
  const changelogs = getChangelogs(locale);
  return changelogs[0]?.version || null;
}
