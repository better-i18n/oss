# @better-i18n/schemas

Shared types and schemas for [Better i18n](https://better-i18n.com) — AI model configurations, public-facing types, and validation schemas.

[![npm](https://img.shields.io/npm/v/@better-i18n/schemas)](https://www.npmjs.com/package/@better-i18n/schemas)

## Installation

```bash
npm install @better-i18n/schemas
# or
bun add @better-i18n/schemas
```

## What's Included

### AI Model Configurations

Single source of truth for all AI model definitions used across the Better i18n platform (dashboard, SDKs, landing page).

```typescript
import { AI_MODELS, getModelById, getDefaultModel } from "@better-i18n/schemas";

// Get all available models
AI_MODELS.forEach((model) => {
  console.log(model.name, model.provider, model.contextSize);
});

// Get a specific model
const gpt = getModelById("gpt-5.2");

// Get the default model
const defaultModel = getDefaultModel();
```

### Entry Points

| Import | Contents |
|--------|----------|
| `@better-i18n/schemas` | All exports (re-exports ai-models) |
| `@better-i18n/schemas/ai-models` | AI model types, configs, and helpers |

### Types

| Type | Description |
|------|-------------|
| `AIModelConfig` | Complete model configuration (id, name, provider, colors, limits) |
| `ModelProvider` | Provider identifier (`"better-ai"`, `"openai"`, `"gemini"`, `"claude"`, `"openrouter"`) |
| `ModelCategory` | Model category (`"flagship"`, `"reasoning"`, `"performance"`, `"specialized"`, `"legacy"`) |
| `ModelColors` | UI color configuration (background, hover, icon) |
| `ProviderInfo` | Provider metadata for UI |

### Helper Functions

| Function | Returns | Description |
|----------|---------|-------------|
| `getModelById(id)` | `AIModelConfig \| undefined` | Find model by UI ID |
| `getApiModelId(id)` | `string` | Get actual API model ID for a UI model ID |
| `getModelProvider(id)` | `ModelProvider` | Get provider for a model |
| `getDefaultModel()` | `AIModelConfig` | Get the default model |
| `getModelsByProvider(provider)` | `AIModelConfig[]` | Filter models by provider |
| `getPlatformModels()` | `AIModelConfig[]` | Models that don't require user API key |
| `modelRequiresUserKey(id)` | `boolean` | Check if model needs user's own key |
| `formatContextSize(tokens)` | `string` | Format token count for display (`"128K"`, `"1M"`) |

> **Note:** Internal tRPC validation schemas (projects, organizations, languages) live in the private platform repo, not in this package.

## License

MIT © [Better i18n](https://better-i18n.com)
