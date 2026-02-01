interface MetaMessages {
  [key: string]: string;
}

interface LocalizedMetaResult {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogType?: string;
}

/**
 * Extract localized meta tags from i18n messages
 * @param messages - All loaded i18n messages from Better i18n CDN
 * @param pageKey - Meta page key (e.g., 'home', 'forTranslators', 'forDevelopers')
 * @returns Localized meta tag values
 */
export function getLocalizedMeta(
  messages: MetaMessages,
  pageKey: string
): LocalizedMetaResult {
  const metaPrefix = `meta.${pageKey}`;

  return {
    title: messages[`${metaPrefix}.title`] || "Better i18n",
    description: messages[`${metaPrefix}.description`] || "",
    ogTitle: messages[`${metaPrefix}.ogTitle`] || messages[`${metaPrefix}.title`] || "Better i18n",
    ogDescription: messages[`${metaPrefix}.ogDescription`] || messages[`${metaPrefix}.description`] || "",
    ogType: "website",
  };
}

/**
 * Format meta tags for TanStack Router head function
 * @param meta - Localized meta values from getLocalizedMeta()
 * @returns Array of meta tag objects for TanStack Router
 */
export function formatMetaTags(meta: LocalizedMetaResult) {
  return [
    {
      title: meta.title,
    },
    {
      name: "description",
      content: meta.description,
    },
    {
      property: "og:title",
      content: meta.ogTitle,
    },
    {
      property: "og:description",
      content: meta.ogDescription,
    },
    {
      property: "og:type",
      content: meta.ogType || "website",
    },
  ];
}
