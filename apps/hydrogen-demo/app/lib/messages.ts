/**
 * Type-safe message accessor for Better i18n messages.
 * Messages values are `unknown` from the CDN, this helper safely extracts strings.
 */
export function msg(
  ns: Record<string, unknown> | undefined,
  key: string,
  fallback = "",
): string {
  const val = ns?.[key];
  return typeof val === "string" ? val : fallback;
}
