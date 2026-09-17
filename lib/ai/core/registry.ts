import { AIModel, AICapability, AIProviderId } from "./types";

// A static initial registry. In a full DB setup, this could be synced/loaded from DB.
export const DEFAULT_MODELS: AIModel[] = [
  // OpenAI
  {
    id: "gpt-4o", providerId: "openai", displayName: "GPT-4o",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING],
    contextWindow: 128000, maxOutputTokens: 4096, inputCostPer1M: 5.0, outputCostPer1M: 15.0, priority: 10, enabled: true
  },
  {
    id: "gpt-4o-mini", providerId: "openai", displayName: "GPT-4o Mini",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING],
    contextWindow: 128000, maxOutputTokens: 16384, inputCostPer1M: 0.15, outputCostPer1M: 0.6, priority: 5, enabled: true
  },
  
  // Anthropic
  {
    id: "claude-3-5-sonnet-20241022", providerId: "anthropic", displayName: "Claude 3.5 Sonnet",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING],
    contextWindow: 200000, maxOutputTokens: 8192, inputCostPer1M: 3.0, outputCostPer1M: 15.0, priority: 10, enabled: true
  },
  {
    id: "claude-3-haiku-20240307", providerId: "anthropic", displayName: "Claude 3 Haiku",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING],
    contextWindow: 200000, maxOutputTokens: 4096, inputCostPer1M: 0.25, outputCostPer1M: 1.25, priority: 5, enabled: true
  },

  // Gemini (Note: gemini-1.5-pro fixes the 404 issue by using the correct valid model name)
  {
    id: "gemini-1.5-pro", providerId: "gemini", displayName: "Gemini 1.5 Pro",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING, AICapability.LONG_CONTEXT],
    contextWindow: 2000000, maxOutputTokens: 8192, inputCostPer1M: 3.5, outputCostPer1M: 10.5, priority: 9, enabled: true
  },
  {
    id: "gemini-1.5-flash", providerId: "gemini", displayName: "Gemini 1.5 Flash",
    capabilities: [AICapability.TEXT, AICapability.VISION, AICapability.JSON, AICapability.FUNCTION_CALLING, AICapability.STREAMING],
    contextWindow: 1000000, maxOutputTokens: 8192, inputCostPer1M: 0.075, outputCostPer1M: 0.3, priority: 5, enabled: true
  },

  // OpenRouter (Examples)
  {
    id: "anthropic/claude-3-haiku", providerId: "openrouter", displayName: "OR Claude Haiku",
    capabilities: [AICapability.TEXT, AICapability.JSON, AICapability.STREAMING],
    contextWindow: 200000, maxOutputTokens: 4096, inputCostPer1M: 0.25, outputCostPer1M: 1.25, priority: 4, enabled: true
  }
];

export class ModelRegistry {
  private models: Map<string, AIModel> = new Map();

  constructor() {
    DEFAULT_MODELS.forEach(m => this.models.set(`${m.providerId}:${m.id}`, m));
  }

  getModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  getModel(providerId: AIProviderId, modelId: string): AIModel | undefined {
    return this.models.get(`${providerId}:${modelId}`);
  }

  getModelsByProvider(providerId: AIProviderId): AIModel[] {
    return this.getModels().filter(m => m.providerId === providerId);
  }

  disableModel(providerId: AIProviderId, modelId: string) {
    const key = `${providerId}:${modelId}`;
    const m = this.models.get(key);
    if (m) {
      m.enabled = false;
      this.models.set(key, m);
    }
  }
}
