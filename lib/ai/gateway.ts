/**
 * WebHunt AI Gateway — Multi-Provider Gateway
 * SERVER-SIDE ONLY. Never import this from client components.
 */

import { AIProvider, AIModel, AIRequest, AIResponse, AIRoutingStrategy, AIGatewayError } from "./core/types";
import { ModelRegistry } from "./core/registry";
import { HealthTracker } from "./core/health";
import { Router } from "./core/router";
import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { GeminiProvider } from "./providers/gemini";
import { OpenRouterProvider } from "./providers/openrouter";
export { AIGatewayError } from "./core/types";

class AIGateway {
  public registry = new ModelRegistry();
  public health = new HealthTracker();
  public router = new Router(this.registry, this.health);
  private providers: Map<string, AIProvider> = new Map();

  constructor() {
    [
      new OpenAIProvider(),
      new AnthropicProvider(),
      new GeminiProvider(),
      new OpenRouterProvider()
    ].forEach(p => {
      if (p.isConfigured()) {
        this.providers.set(p.id, p);
      }
    });
  }

  isAIConfigured(): boolean {
    return this.providers.size > 0;
  }

  private calculateCost(model: AIModel, inputTokens: number, outputTokens: number): number {
    return (inputTokens / 1_000_000) * model.inputCostPer1M + (outputTokens / 1_000_000) * model.outputCostPer1M;
  }

  async generate(request: AIRequest, strategy: AIRoutingStrategy = "AUTO"): Promise<AIResponse> {
    if (!this.isAIConfigured()) throw new AIGatewayError("AI gateway is not configured.", "NOT_CONFIGURED" as any);

    const candidateModels = this.router.selectModels(request, strategy);
    if (candidateModels.length === 0) {
      throw new AIGatewayError("No eligible models found.", "MODEL_NOT_FOUND");
    }

    let lastError: any = null;
    let fallbackUsed = false;

    for (let i = 0; i < Math.min(candidateModels.length, 3); i++) {
      const model = candidateModels[i];
      const provider = this.providers.get(model.providerId);
      
      if (!provider) continue;
      if (i > 0) fallbackUsed = true;

      try {
        const response = await provider.generate(request, model);
        this.health.recordSuccess(model.providerId, model.id);
        
        response.usage.estimatedCostUsd = this.calculateCost(model, response.usage.inputTokens, response.usage.outputTokens);
        response.fallbackUsed = fallbackUsed;
        
        return response;
      } catch (err: any) {
        lastError = err;
        const isPermanent = err instanceof AIGatewayError && (err.category === "MODEL_NOT_FOUND" || err.category === "AUTHENTICATION_ERROR");
        this.health.recordFailure(model.providerId, model.id, isPermanent);
        
        if (err instanceof AIGatewayError && err.category === "AUTHENTICATION_ERROR") continue;
      }
    }

    throw lastError || new Error(`All configured AI providers failed.`);
  }

  async stream(request: AIRequest, onChunk: (chunk: string) => void, strategy: AIRoutingStrategy = "AUTO"): Promise<Omit<AIResponse, "content">> {
    if (!this.isAIConfigured()) throw new AIGatewayError("AI gateway is not configured.", "NOT_CONFIGURED" as any);

    const candidateModels = this.router.selectModels(request, strategy);
    if (candidateModels.length === 0) {
      throw new AIGatewayError("No eligible models found.", "MODEL_NOT_FOUND");
    }

    let lastError: any = null;
    let fallbackUsed = false;

    for (let i = 0; i < Math.min(candidateModels.length, 3); i++) {
      const model = candidateModels[i];
      const provider = this.providers.get(model.providerId);
      
      if (!provider) continue;
      if (i > 0) fallbackUsed = true;

      try {
        const response = await provider.stream(request, model, onChunk);
        this.health.recordSuccess(model.providerId, model.id);
        
        response.usage.estimatedCostUsd = this.calculateCost(model, response.usage.inputTokens, response.usage.outputTokens);
        response.fallbackUsed = fallbackUsed;
        return response;
      } catch (err: any) {
        lastError = err;
        const isPermanent = err instanceof AIGatewayError && (err.category === "MODEL_NOT_FOUND" || err.category === "AUTHENTICATION_ERROR");
        this.health.recordFailure(model.providerId, model.id, isPermanent);
      }
    }

    throw lastError || new Error(`Streaming failed across all eligible providers.`);
  }
}

export const gateway = new AIGateway();

// Backward compatibility layers
export function isAIConfigured() {
  return gateway.isAIConfigured();
}

export function selectModel(tier: "fast" | "default" | "reasoning") {
  // Mock function, routing is dynamically chosen
  return tier === "fast" ? "gpt-4o-mini" : "gpt-4o";
}

export interface CompletionOptions {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model?: string;
  provider?: string;
  routingStrategy?: string;
  tier?: "fast" | "default" | "reasoning";
  maxTokens?: number;
  jsonMode?: boolean;
  temperature?: number;
}

export interface CompletionResult {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  model: string;
  estimatedCostUsd: number;
  latencyMs: number;
  fallbackUsed: boolean;
}

export async function completion(options: CompletionOptions): Promise<CompletionResult> {
  const req: AIRequest = {
    system: options.system,
    messages: options.messages as any,
    jsonMode: options.jsonMode,
    maxTokens: options.maxTokens,
    temperature: options.temperature,
    // Add capabilities request based on flags
    requiredCapabilities: options.jsonMode ? ["JSON" as any] : []
  };

  let strategy: AIRoutingStrategy = (options.routingStrategy as AIRoutingStrategy) || "AUTO";
  if (!options.routingStrategy && options.tier === "fast") strategy = "FASTEST";
  
  if (options.model && options.model !== "auto") {
    strategy = "MANUAL";
    const parts = options.model.split("/");
    if (parts.length === 2) {
      req.targetProvider = parts[0] as any;
      req.targetModel = parts[1];
    } else {
      req.targetProvider = (options.provider as any) || "openai";
      req.targetModel = options.model;
    }
  }

  const res = await gateway.generate(req, strategy);
  return {
    content: res.content,
    usage: res.usage,
    model: res.model,
    estimatedCostUsd: res.usage.estimatedCostUsd,
    latencyMs: res.latencyMs,
    fallbackUsed: res.fallbackUsed,
  };
}

export interface StreamingOptions extends Omit<CompletionOptions, "jsonMode"> {
  onChunk: (chunk: string) => void;
  onDone?: (result: Omit<CompletionResult, "content">) => void;
}

export async function streamCompletion(options: StreamingOptions): Promise<void> {
  const req: AIRequest = {
    system: options.system,
    messages: options.messages as any,
    maxTokens: options.maxTokens,
    temperature: options.temperature,
    stream: true,
  };

  let strategy: AIRoutingStrategy = (options.routingStrategy as AIRoutingStrategy) || "AUTO";
  if (!options.routingStrategy && options.tier === "fast") strategy = "FASTEST";

  if (options.model && options.model !== "auto") {
    strategy = "MANUAL";
    const parts = options.model.split("/");
    if (parts.length === 2) {
      req.targetProvider = parts[0] as any;
      req.targetModel = parts[1];
    } else {
      req.targetProvider = (options.provider as any) || "openai";
      req.targetModel = options.model;
    }
  }

  const res = await gateway.stream(req, options.onChunk, strategy);
  
  if (options.onDone) {
    options.onDone({
      usage: res.usage,
      model: res.model,
      estimatedCostUsd: res.usage.estimatedCostUsd,
      latencyMs: res.latencyMs,
      fallbackUsed: res.fallbackUsed,
    });
  }
}

export function getAIConfig() {
  return {
    isConfigured: gateway.isAIConfigured(),
    defaultModel: "gpt-4o",
    fastModel: "gpt-4o-mini",
    reasoningModel: "gpt-4o",
    hasLiteLLM: false, // Legacy flag
  };
}

/**
 * Robustly parses JSON from an AI response, stripping markdown blocks
 * and aggressively handling control characters that break JSON.parse().
 */
export function safeParseAIJson<T>(rawContent: string): T {
  let content = rawContent.trim();
  
  // 1. Strip markdown fences if present
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    content = jsonMatch[1];
  } else {
    // Or just code fences
    const anyMatch = content.match(/```\w*\s*([\s\S]*?)\s*```/);
    if (anyMatch) {
      content = anyMatch[1];
    }
  }

  // 2. Strip leading/trailing non-bracket characters just in case it added text
  const firstBrace = content.indexOf('{');
  const firstBracket = content.indexOf('[');
  const lastBrace = content.lastIndexOf('}');
  const lastBracket = content.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    content = content.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1) {
    content = content.substring(firstBracket, lastBracket + 1);
  }

  // 3. Fix unescaped control characters in JSON strings.
  try {
    return JSON.parse(content) as T;
  } catch (e: any) {
    // Aggressive cleaning of control characters
    let sanitized = "";
    let inString = false;
    for (let i = 0; i < content.length; i++) {
      const c = content[i];
      if (c === '"' && content[i-1] !== '\\') {
        inString = !inString;
        sanitized += c;
      } else if (inString) {
        if (c === '\n') sanitized += '\\n';
        else if (c === '\r') sanitized += '\\r';
        else if (c === '\t') sanitized += '\\t';
        else if (c.charCodeAt(0) < 32) {
          // Ignore other bad control chars
        } else {
          sanitized += c;
        }
      } else {
        // Outside string, just keep it. We can strip actual control chars here too.
        if (c.charCodeAt(0) >= 32 || c === '\n' || c === '\r' || c === '\t') {
          sanitized += c;
        }
      }
    }
    
    return JSON.parse(sanitized) as T;
  }
}
