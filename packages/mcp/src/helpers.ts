/**
 * MCP Server Helpers
 *
 * Shared utility functions for MCP tools.
 * Uses the same project format as @better-i18n/next package.
 */

/**
 * Parsed project identifier - same structure as @better-i18n/next
 */
export interface ParsedProject {
  workspaceId: string;
  projectSlug: string;
}

/**
 * Parse project string "org/slug" into workspaceId and projectSlug.
 * Same format used in @better-i18n/next package's i18n.ts config.
 *
 * @param project - Project identifier (e.g., "aliosman-co/personal")
 * @returns Parsed project with workspaceId and projectSlug
 * @throws Error if format is invalid
 *
 * @example
 * ```ts
 * const { workspaceId, projectSlug } = parseProject("aliosman-co/personal");
 * // workspaceId: "aliosman-co"
 * // projectSlug: "personal"
 * ```
 */
export function parseProject(project: string): ParsedProject {
  const parts = project.split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error(
      `Invalid project format "${project}". Expected "org/project" (e.g., "aliosman-co/personal")`
    );
  }
  return {
    workspaceId: parts[0],
    projectSlug: parts[1],
  };
}
