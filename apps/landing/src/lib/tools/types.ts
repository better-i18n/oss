/** Shared types for all free tool pages. */

import type { SpriteIconName } from "@/components/SpriteIcon";

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
  /**
   * A sprite name, deliberately not `string`: the registry held emoji, and a
   * `string` field is what let them in. The union makes the next emoji a type
   * error instead of something a reviewer has to notice.
   */
  readonly icon: SpriteIconName;
  readonly href: string;
}
