import type { CostTier } from "./types";

export const COST_TIERS: readonly CostTier[] = [
  {
    name: "Professional Human Translation",
    minPerWord: 0.10,
    maxPerWord: 0.25,
    description: "Native translators with industry expertise",
  },
  {
    name: "Human + AI Review",
    minPerWord: 0.05,
    maxPerWord: 0.12,
    description: "Machine translation reviewed by human translators",
  },
  {
    name: "Better i18n AI",
    minPerWord: 0.01,
    maxPerWord: 0.03,
    description: "AI-powered translation with context-aware quality",
  },
] as const;

export const LANGUAGE_PRESETS: Readonly<Record<string, readonly string[]>> = {
  european: ["de", "fr", "es", "it", "pt", "nl", "pl", "sv", "da", "fi"],
  apac: ["ja", "ko", "zh", "th", "vi", "id", "ms", "tl"],
  global20: ["de", "fr", "es", "pt", "ja", "ko", "zh", "ar", "hi", "ru", "tr", "it", "nl", "pl", "sv", "th", "vi", "id", "uk", "he"],
} as const;

export const MONTHLY_CHANGE_RATE = 0.15;
export const LOCALIZATION_ROI_MULTIPLIER = 1.25;

/** Calculate costs for all tiers */
export function calculateCosts(
  wordCount: number,
  languageCount: number,
): readonly { readonly tier: CostTier; readonly min: number; readonly max: number; readonly avg: number }[] {
  return COST_TIERS.map((tier) => ({
    tier,
    min: wordCount * languageCount * tier.minPerWord,
    max: wordCount * languageCount * tier.maxPerWord,
    avg: wordCount * languageCount * ((tier.minPerWord + tier.maxPerWord) / 2),
  }));
}

/** Count words in a translation file (JSON format) */
export function countWordsFromJson(jsonString: string): { readonly words: number; readonly keys: number } {
  try {
    const data = JSON.parse(jsonString);
    const values = Object.values(data).filter((v): v is string => typeof v === "string");
    const words = values.reduce((sum, v) => sum + v.split(/\s+/).filter(Boolean).length, 0);
    return { words, keys: values.length };
  } catch {
    return { words: 0, keys: 0 };
  }
}
