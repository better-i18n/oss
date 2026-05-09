/**
 * Deterministic color generation from a slug hash.
 * Every blog post gets a unique but stable color scheme.
 */

export function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const ACCENT_HUES = [
  // Cyan family
  188, 195, 200,
  // Purple/violet family
  265, 275, 258,
  // Green/emerald family
  152, 160, 145,
  // Pink/rose family
  330, 340, 318,
  // Blue family
  220, 230, 210,
  // Amber/gold family
  42, 36, 48,
  // Indigo
  244, 250, 238,
  // Teal
  174, 180, 168,
];

export type AccentColors = {
  hue: number;
  accent: string;
  accentDim: string;
  accentMuted: string;
  bg1: string;
  bg2: string;
};

export function getAccentFromHash(hash: number): AccentColors {
  const hue = ACCENT_HUES[hash % ACCENT_HUES.length];
  const accent = `hsl(${hue}, 55%, 45%)`;
  const accentDim = `hsl(${hue}, 45%, 55%)`;
  const accentMuted = `hsl(${hue}, 35%, 70%)`;
  const bg1 = `hsl(${hue}, 30%, 96%)`;
  const bg2 = `hsl(${hue}, 25%, 98%)`;
  return { hue, accent, accentDim, accentMuted, bg1, bg2 };
}
