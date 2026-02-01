/**
 * Shared AI Model Configuration
 * Single source of truth for all AI model definitions used across frontend and backend.
 */

// Provider types
export type ModelProvider =
  | "better-ai"
  | "openai"
  | "gemini"
  | "claude"
  | "openrouter";

// Model categories
export type ModelCategory =
  | "flagship"
  | "reasoning"
  | "performance"
  | "specialized"
  | "legacy";

// Icon types for models
export type ModelIcon = "OpenAI" | "Gemini" | "Claude" | "BetterAI";

// Model color configuration
export interface ModelColors {
  /** Background color for UI elements */
  background: string;
  /** Hover background color */
  hover: string;
  /** Icon/text color */
  icon: string;
}

// Complete model configuration
export interface AIModelConfig {
  /** UI display ID (e.g., "gpt-5.2", "gemini-3-flash") */
  id: string;
  /** Display name for UI (e.g., "ChatGPT 5.2", "Gemini 3 Flash") */
  name: string;
  /** Provider identifier */
  provider: ModelProvider;
  /** Icon to display for this model (from lucide-react or custom) */
  icon: "OpenAI" | "Gemini" | "Claude" | "BetterAI";
  /** Colors for UI elements */
  colors: ModelColors;
  /** Actual API model ID to send to provider SDK (e.g., "gpt-5.2", "gemini-2.5-flash") */
  apiModelId: string;
  /** Max context window in tokens */
  contextSize: number;
  /** Max output tokens */
  maxOutput: number;
  /** Model description */
  description: string;
  /** Optional badge (e.g., "New", "Fast", "Default") */
  badge?: string;
  /** Is this the default model? */
  isDefault?: boolean;
  /** Release date info */
  releaseDate?: string;
  /** Training data cutoff */
  trainingData?: string;
  /** Speed score 0-100 */
  speed?: number;
  /** Model category */
  category?: ModelCategory;
  /** Whether this model requires user's own API key (not platform key) */
  requiresUserKey?: boolean;
}

// Provider configuration (for UI)
export interface ProviderInfo {
  id: ModelProvider;
  name: string;
  brandColor: string;
}

/**
 * All available AI models - Single Source of Truth
 *
 * Important: `apiModelId` is the actual model ID sent to the provider's SDK.
 * This may differ from `id` which is used for UI/selection purposes.
 *
 * We keep only the best/flagship models from each provider to avoid clutter.
 */
export const AI_MODELS: AIModelConfig[] = [
  // ============================================
  // Better AI - Platform Default (Powered by Gemini 3 Flash)
  // ============================================
  {
    id: "better-ai",
    name: "Better AI",
    provider: "better-ai",
    icon: "BetterAI",
    colors: {
      background: "bg-gray-50 dark:bg-neutral-700",
      hover: "hover:bg-gray-100 dark:hover:bg-neutral-600",
      icon: "text-gray-700 dark:text-white",
    },
    apiModelId: "gemini-3-pro-preview",
    contextSize: 1_048_576, // 1M tokens (verified from Google docs)
    maxOutput: 65_536,
    description:
      "Most capable AI model powered by Gemini 3 Pro. Best for complex translations.",
    isDefault: true,
    badge: "Default",
    releaseDate: "Jan 2025",
    trainingData: "Jan 2025",
    speed: 95,
    category: "flagship",
    requiresUserKey: false,
  },

  // ============================================
  // OpenAI Models (via OpenRouter)
  // ============================================
  {
    id: "gpt-5.2",
    name: "GPT 5.2",
    provider: "openrouter",
    icon: "OpenAI",
    colors: {
      background: "bg-gray-200 dark:bg-neutral-700",
      hover: "hover:bg-gray-300 dark:hover:bg-neutral-600",
      icon: "text-gray-600 dark:text-white",
    },
    apiModelId: "openai/gpt-5.2",
    contextSize: 400_000, // 400K tokens (GPT-5 series standard)
    maxOutput: 128_000,
    description: "OpenAI's latest flagship model via OpenRouter.",
    badge: "New",
    releaseDate: "2025",
    trainingData: "2025",
    speed: 95,
    category: "flagship",
    requiresUserKey: false,
  },
  {
    id: "gpt-5.1",
    name: "GPT 5.1",
    provider: "openrouter",
    icon: "OpenAI",
    colors: {
      background: "bg-gray-200 dark:bg-neutral-700",
      hover: "hover:bg-gray-300 dark:hover:bg-neutral-600",
      icon: "text-gray-600 dark:text-white",
    },
    apiModelId: "openai/gpt-5.1",
    contextSize: 400_000, // 400K tokens (GPT-5 series standard)
    maxOutput: 128_000,
    description: "OpenAI's capable model via OpenRouter.",
    badge: "Fast",
    releaseDate: "2025",
    trainingData: "2025",
    speed: 93,
    category: "flagship",
    requiresUserKey: false,
  },

  // ============================================
  // Google Gemini Models
  // ============================================
  {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    provider: "gemini",
    icon: "Gemini",
    colors: {
      background: "bg-blue-50 dark:bg-blue-700",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-600",
      icon: "text-blue-400 dark:text-blue-400",
    },
    apiModelId: "gemini-3-pro-preview",
    contextSize: 1_048_576, // 1M tokens (verified from Google docs)
    maxOutput: 65_536,
    description: "Google's most capable model. Best for complex tasks.",
    badge: "Pro",
    releaseDate: "Jan 2025",
    trainingData: "Jan 2025",
    speed: 90,
    category: "flagship",
    requiresUserKey: false,
  },

  // ============================================
  // Anthropic Claude (via OpenRouter) - Moved to bottom
  // ============================================
  {
    id: "claude-4-sonnet",
    name: "Claude Sonnet 4",
    provider: "openrouter",
    icon: "Claude",
    colors: {
      background: "bg-orange-50 dark:bg-orange-700",
      hover: "hover:bg-orange-100 dark:hover:bg-orange-600",
      icon: "text-orange-400 dark:text-orange-400",
    },
    apiModelId: "anthropic/claude-sonnet-4.5",
    contextSize: 200_000,
    maxOutput: 8_192,
    description:
      "Anthropic's flagship. Excellent reasoning and writing via OpenRouter.",
    badge: "New",
    releaseDate: "2025",
    speed: 90,
    category: "flagship",
    requiresUserKey: false,
  },
];

// ============================================
// Helper Functions
// ============================================

/**
 * Get model config by ID
 */
export function getModelById(modelId: string): AIModelConfig | undefined {
  return AI_MODELS.find((m) => m.id === modelId);
}

/**
 * Get the actual API model ID for a given UI model ID
 */
export function getApiModelId(modelId: string): string {
  const model = getModelById(modelId);
  return model?.apiModelId ?? modelId;
}

/**
 * Get provider for a model ID
 */
export function getModelProvider(modelId: string): ModelProvider {
  const model = getModelById(modelId);
  return model?.provider ?? "better-ai";
}

/**
 * Get default model
 */
export function getDefaultModel(): AIModelConfig {
  return AI_MODELS.find((m) => m.isDefault) ?? AI_MODELS[0];
}

/**
 * Get models by provider
 */
export function getModelsByProvider(provider: ModelProvider): AIModelConfig[] {
  return AI_MODELS.filter((m) => m.provider === provider);
}

/**
 * Get models that don't require user API key (platform-provided)
 */
export function getPlatformModels(): AIModelConfig[] {
  return AI_MODELS.filter((m) => !m.requiresUserKey);
}

/**
 * Check if a model requires user's own API key
 */
export function modelRequiresUserKey(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.requiresUserKey ?? false;
}

/**
 * Format context size for display (e.g., "128K", "2M")
 */
export function formatContextSize(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(0)}M`;
  }
  return `${(tokens / 1_000).toFixed(0)}K`;
}
