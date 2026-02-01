/**
 * Text utility functions
 */

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  const cleaned = str.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength - 1) + "…";
}

/**
 * Generate a suggested translation key from text and file path
 */
export function generateKeyFromContext(
  text: string,
  filePath: string
): string {
  // Extract component/page name from file path
  const pathParts = filePath
    .replace(/\.(tsx|jsx|ts|js)$/, "")
    .split("/")
    .filter((p) => !["src", "app", "components", "pages", "index"].includes(p));

  // Get last 2 meaningful parts (e.g., "auth/LoginForm" -> "auth.loginForm")
  const contextParts = pathParts.slice(-2).map((p) => toCamelCase(p));

  // Convert text to key-friendly format
  const textKey = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4) // Max 4 words
    .map((word, i) => (i === 0 ? word : capitalize(word)))
    .join("");

  return [...contextParts, textKey].join(".");
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
