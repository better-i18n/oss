/**
 * Shared types for the CLI analyzer
 */

export interface Issue {
  file: string;
  line: number;
  column: number;
  text: string;
  type:
    | "jsx-text"
    | "jsx-attribute"
    | "ternary-locale"
    | "string-variable"
    | "toast-message";
  severity: "error" | "warning" | "info";
  message: string;
  suggestedKey?: string;
  key?: string; // Extracted translation key
  bindingType?: NamespaceBindingType;
  namespace?: string;
  isDynamic?: boolean; // True if this is a dynamic key (template literal or computed)
  pattern?: string; // For dynamic keys: the pattern like 'plans.${x}.name'
}

export type NamespaceBindingType =
  | "bound-scoped"
  | "root-scoped"
  | "unknown-scoped"
  | "unbound";

export interface NamespaceBinding {
  type: NamespaceBindingType;
  namespace?: string; // For bound-scoped
  dynamic?: boolean; // For unknown-scoped
}

export interface ScanStats {
  dynamicKeys: number;
  dynamicNamespaces: number;
  unboundTranslators: number;
  rootScopedTranslators: number;
  dataStructureKeys?: number;
  dataStructureScopes?: number;
}

/**
 * Represents a dynamic key access pattern detected in code
 */
export interface DynamicPattern {
  pattern: string; // e.g., 'plans.${x}.name'
  file: string;
  line: number;
  namespace?: string;
  bindingType?: NamespaceBindingType;
}

export interface RuleContext {
  filePath: string;
  sourceFile: import("typescript").SourceFile;
  namespaceMap?: Record<string, NamespaceBinding>; // Mapping identifier (e.g., 't') to its scope info
  stats?: ScanStats;
  verbose?: boolean; // Enable detailed logging
  translationScope?: boolean; // True if currently in a translation-aware function
  fileNamespaces?: string[]; // All namespaces detected in file (for fallback inference)
}

export interface ScanOptions {
  dir?: string;
  format: "eslint" | "json";
  maxIssues?: number;
  fix?: boolean;
  ci?: boolean;
  staged?: boolean;
  verbose?: boolean;
}

export interface ProjectContext {
  workspaceId: string;
  projectSlug: string;
  defaultLocale: string;
  cdnBaseUrl?: string;
  lint?: LintConfig;
}

export interface DataStructureConfig {
  enabled?: boolean;
  requireTranslationScope?: boolean; // Only detect in functions with 't' parameter
  maxDepth?: number; // Maximum nesting depth to analyze
  propertyNames?: string[]; // Property names that likely contain translation keys
}

export interface LintConfig {
  include?: string[];
  exclude?: string[];
  minLength?: number;
  rules?: Record<string, "error" | "warning" | "off">;
  ignorePatterns?: RegExp[];
  translationFunctions?: string[];
  dataStructureDetection?: DataStructureConfig;
}

export interface ScanResult {
  project?: ProjectContext;
  files: number;
  issues: Issue[];
  duration: number;
  localKeys?: Record<string, string[]>;
  dynamicPatterns?: DynamicPattern[]; // Dynamic key access patterns detected in code
  comparison?: {
    localKeys: Record<string, string[]>;
    remoteKeys: Record<string, string[]>;
    missingKeys: Record<string, string[]>;
    unusedKeys: Record<string, string[]>;
    coverage: {
      local: number;
      remote: number;
    };
  };
}

/**
 * CDN Manifest structure from Better i18n
 */
export interface CdnManifest {
  projectSlug: string;
  sourceLanguage: string;
  languages: CdnLanguage[];
  files: Record<string, { url: string; size: number; lastModified: string }>;
  updatedAt: string;
}

export interface CdnLanguage {
  code: string;
  name: string;
  nativeName: string;
  isSource: boolean;
  lastUpdated: string;
  keyCount: number;
  flagUrl: string;
  countryCode: string;
}
