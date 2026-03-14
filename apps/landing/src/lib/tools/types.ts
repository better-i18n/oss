/** Shared types for all free tool pages. */

export interface LocaleData {
  readonly code: string;
  readonly language: string;
  readonly region: string | null;
  readonly script: string | null;
  readonly direction: "ltr" | "rtl";
  readonly nativeName: string;
  readonly englishName: string;
  readonly pluralCategories: readonly string[];
  readonly speakerPopulation: number | null;
}

export interface FormatDefinition {
  readonly id: string;
  readonly name: string;
  readonly extension: string;
  readonly description: string;
  readonly mimeType: string;
}

export interface FormatPair {
  readonly slug: string;
  readonly source: FormatDefinition;
  readonly target: FormatDefinition;
}

export interface CostTier {
  readonly name: string;
  readonly minPerWord: number;
  readonly maxPerWord: number;
  readonly description: string;
}

export interface ToolMeta {
  readonly slug: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly fallbackTitle: string;
  readonly fallbackDescription: string;
  readonly icon: string;
  readonly href: string;
}
