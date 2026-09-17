/**
 * WebHunt AI Gateway — Multi-Provider Gateway
 * 
 * SERVER-SIDE ONLY. Never import this from client components.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIExecutionMetadata } from "./types";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export function getGatewayConfig() {
  const isLiteLLM = !!process.env.LITELLM_BASE_URL;
  
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const litellmKey = process.env.LITELLM_API_KEY;

  return {
    isConfigured: !!(openaiKey || anthropicKey || openrouterKey || geminiKey || isLiteLLM),
    openaiKey,
    anthropicKey,
    openrouterKey,
    geminiKey,
    litellmKey,
    litellmBaseUrl: process.env.LITELLM_BASE_URL,
    defaultModel: process.env.AI_DEFAULT_MODEL || "gpt-4o",
    fastModel: process.env.AI_FAST_MODEL || "gpt-4o-mini",
    reasoningModel: process.env.AI_REASONING_MODEL || "gpt-4o",
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || "4096", 10),
  };
}

export type ModelTier = "fast" | "default" | "reasoning";

export function selectModel(tier: ModelTier): string {
  const config = getGatewayConfig();
  switch (tier) {
    case "fast":
      return config.fastModel;
    case "reasoning":
      return config.reasoningModel;
    default:
      return config.defaultModel;
  }
}

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 5.0, output: 15.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "claude-3-5-sonnet-20241022": { input: 3.0, output: 15.0 },
    "claude-3-haiku-20240307": { input: 0.25, output: 1.25 },
    "gemini-1.5-pro": { input: 3.5, output: 10.5 },
    "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  };

  const rates = pricing[model] || { input: 5.0, output: 15.0 };
  return (inputTokens / 1_000_000) * rates.input + (outputTokens / 1_000_000) * rates.output;
}

export interface CompletionOptions {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  model?: string;
  tier?: ModelTier;
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

export type AIGatewayErrorCode =
  | "NOT_CONFIGURED"
  | "PROVIDER_ERROR"
  | "RATE_LIMITED"
  | "CONTEXT_TOO_LONG"
  | "INVALID_RESPONSE"
  | "TIMEOUT";

export class AIGatewayError extends Error {
  readonly code: AIGatewayErrorCode;
  readonly cause?: Error;

  constructor(message: string, code: AIGatewayErrorCode, cause?: Error) {
    super(message);
    this.name = "AIGatewayError";
    this.code = code;
    this.cause = cause;
  }

  isRetryable(): boolean {
    return this.code === "PROVIDER_ERROR" || this.code === "TIMEOUT";
  }
}

// Internal provider logic

async function runOpenAI(options: CompletionOptions, config: any): Promise<any> {
  const client = new OpenAI({ apiKey: config.openaiKey, maxRetries: 1, timeout: 60000 });
  const model = options.tier === "fast" ? "gpt-4o-mini" : "gpt-4o";
  const start = Date.now();
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: "system", content: options.system }, ...options.messages],
    max_tokens: options.maxTokens || config.maxTokens,
    temperature: options.temperature ?? 0.3,
    response_format: options.jsonMode ? { type: "json_object" } : undefined,
  });
  const iT = res.usage?.prompt_tokens || 0;
  const oT = res.usage?.completion_tokens || 0;
  return {
    content: res.choices[0]?.message?.content || "",
    usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
    model, latencyMs: Date.now() - start
  };
}

async function runAnthropic(options: CompletionOptions, config: any): Promise<any> {
  const client = new Anthropic({ apiKey: config.anthropicKey, maxRetries: 1, timeout: 60000 });
  const model = options.tier === "fast" ? "claude-3-haiku-20240307" : "claude-3-5-sonnet-20241022";
  const start = Date.now();
  
  let sys = options.system;
  if (options.jsonMode) {
    sys += "\n\nCRITICAL: Respond ONLY with valid JSON. Do not include markdown code blocks or explanatory text.";
  }

  const res = await client.messages.create({
    model,
    system: sys,
    messages: options.messages.map(m => ({ role: m.role, content: m.content })) as any,
    max_tokens: options.maxTokens || config.maxTokens,
    temperature: options.temperature ?? 0.3,
  });
  const iT = res.usage?.input_tokens || 0;
  const oT = res.usage?.output_tokens || 0;
  const contentBlock = res.content.find((c: any) => c.type === "text") as any;
  let content = contentBlock?.text || "";
  
  if (options.jsonMode) {
    if (content.startsWith("```json")) content = content.replace(/^```json\n/, "").replace(/\n```$/, "");
  }

  return {
    content,
    usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
    model, latencyMs: Date.now() - start
  };
}

async function runOpenRouter(options: CompletionOptions, config: any): Promise<any> {
  const client = new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: config.openrouterKey, maxRetries: 1, timeout: 60000 });
  const model = options.tier === "fast" ? "anthropic/claude-3-haiku" : "openai/gpt-4o";
  const start = Date.now();
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: "system", content: options.system }, ...options.messages],
    max_tokens: options.maxTokens || config.maxTokens,
    temperature: options.temperature ?? 0.3,
    response_format: options.jsonMode ? { type: "json_object" } : undefined,
  });
  const iT = res.usage?.prompt_tokens || 0;
  const oT = res.usage?.completion_tokens || 0;
  return {
    content: res.choices[0]?.message?.content || "",
    usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
    model, latencyMs: Date.now() - start
  };
}

async function runGemini(options: CompletionOptions, config: any): Promise<any> {
  const client = new GoogleGenerativeAI(config.geminiKey);
  const modelName = options.tier === "fast" ? "gemini-1.5-flash" : "gemini-1.5-pro";
  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: options.system,
    generationConfig: {
      temperature: options.temperature ?? 0.3,
      maxOutputTokens: options.maxTokens || config.maxTokens,
      responseMimeType: options.jsonMode ? "application/json" : "text/plain",
    }
  });
  const start = Date.now();
  const history = options.messages.slice(0, -1).map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));
  const chat = model.startChat({ history });
  const lastUserMsg = options.messages[options.messages.length - 1];
  const res = await chat.sendMessage(lastUserMsg ? lastUserMsg.content : "");
  const iT = res.response.usageMetadata?.promptTokenCount || 0;
  const oT = res.response.usageMetadata?.candidatesTokenCount || 0;
  return {
    content: res.response.text(),
    usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
    model: modelName, latencyMs: Date.now() - start
  };
}

async function runLiteLLM(options: CompletionOptions, config: any): Promise<any> {
  const client = new OpenAI({ baseURL: config.litellmBaseUrl, apiKey: config.litellmKey || config.openaiKey || "sk-dummy", maxRetries: 1, timeout: 60000 });
  const model = options.model || selectModel(options.tier || "default");
  const start = Date.now();
  const res = await client.chat.completions.create({
    model,
    messages: [{ role: "system", content: options.system }, ...options.messages],
    max_tokens: options.maxTokens || config.maxTokens,
    temperature: options.temperature ?? 0.3,
    response_format: options.jsonMode ? { type: "json_object" } : undefined,
  });
  const iT = res.usage?.prompt_tokens || 0;
  const oT = res.usage?.completion_tokens || 0;
  return {
    content: res.choices[0]?.message?.content || "",
    usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
    model, latencyMs: Date.now() - start
  };
}

export async function completion(options: CompletionOptions): Promise<CompletionResult> {
  const config = getGatewayConfig();
  if (!config.isConfigured) {
    throw new AIGatewayError("AI gateway is not configured.", "NOT_CONFIGURED");
  }

  const providers = [];
  if (config.litellmBaseUrl) providers.push({ name: "litellm", run: runLiteLLM });
  if (config.openaiKey) providers.push({ name: "openai", run: runOpenAI });
  if (config.anthropicKey) providers.push({ name: "anthropic", run: runAnthropic });
  if (config.openrouterKey) providers.push({ name: "openrouter", run: runOpenRouter });
  if (config.geminiKey) providers.push({ name: "gemini", run: runGemini });

  if (providers.length === 0) {
    throw new AIGatewayError("No providers available", "NOT_CONFIGURED");
  }

  let lastError: any = null;
  for (let i = 0; i < providers.length; i++) {
    const p = providers[i];
    try {
      if (i > 0) {
        console.warn(`[AI] Fallback triggered. Using provider: ${p.name}`);
      }
      const res = await p.run(options, config);
      return {
        ...res,
        estimatedCostUsd: estimateCost(res.model, res.usage.inputTokens, res.usage.outputTokens),
        fallbackUsed: i > 0,
      };
    } catch (e: any) {
      console.warn(`[AI] Provider ${p.name} failed:`, e?.message);
      lastError = e;
    }
  }

  throw new AIGatewayError(
    `All configured AI providers failed. Last error: ${lastError?.message}`,
    "PROVIDER_ERROR",
    lastError
  );
}

export interface StreamingOptions extends Omit<CompletionOptions, "jsonMode"> {
  onChunk: (chunk: string) => void;
  onDone?: (result: Omit<CompletionResult, "content">) => void;
}

export async function streamCompletion(options: StreamingOptions): Promise<void> {
  const config = getGatewayConfig();
  if (!config.isConfigured) {
    throw new AIGatewayError("AI gateway is not configured.", "NOT_CONFIGURED");
  }

  let activeProvider = "";
  let streamRes: any;

  // We'll use OpenAI SDK for streaming if litellm, openai, or openrouter is available
  const attemptOpenAIStream = async (baseURL?: string, apiKey?: string, modelOverride?: string) => {
    const client = new OpenAI({ baseURL, apiKey: apiKey || "sk-dummy", timeout: 60000, maxRetries: 0 });
    const model = modelOverride || options.model || selectModel(options.tier || "default");
    return {
       client,
       model,
       stream: await client.chat.completions.create({
         model,
         messages: [{ role: "system", content: options.system }, ...options.messages],
         max_tokens: options.maxTokens || config.maxTokens,
         temperature: options.temperature ?? 0.3,
         stream: true,
       })
    };
  };

  let model = "";
  let start = Date.now();

  try {
    if (config.litellmBaseUrl) {
      const s = await attemptOpenAIStream(config.litellmBaseUrl, config.litellmKey || config.openaiKey);
      streamRes = s.stream; model = s.model; activeProvider = "litellm";
    } else if (config.openaiKey) {
      const s = await attemptOpenAIStream(undefined, config.openaiKey, options.tier === "fast" ? "gpt-4o-mini" : "gpt-4o");
      streamRes = s.stream; model = s.model; activeProvider = "openai";
    } else if (config.openrouterKey) {
      const s = await attemptOpenAIStream("https://openrouter.ai/api/v1", config.openrouterKey, options.tier === "fast" ? "anthropic/claude-3-haiku" : "openai/gpt-4o");
      streamRes = s.stream; model = s.model; activeProvider = "openrouter";
    } else {
      throw new Error("No provider available for streaming");
    }
  } catch (e: any) {
    console.warn(`[AI] Streaming failed for ${activeProvider}:`, e.message);
    throw new AIGatewayError(`Streaming failed: ${e.message}`, "PROVIDER_ERROR", e);
  }

  let iT = 0;
  let oT = 0;
  for await (const chunk of streamRes) {
    const delta = chunk.choices?.[0]?.delta?.content;
    if (delta) {
      options.onChunk(delta);
      oT++;
    }
  }

  if (options.onDone) {
    options.onDone({
      usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT },
      model,
      estimatedCostUsd: estimateCost(model, iT, oT),
      latencyMs: Date.now() - start,
      fallbackUsed: false,
    });
  }
}

export function isAIConfigured(): boolean {
  return getGatewayConfig().isConfigured;
}

export function getAIConfig() {
  const c = getGatewayConfig();
  return {
    isConfigured: c.isConfigured,
    defaultModel: c.defaultModel,
    fastModel: c.fastModel,
    reasoningModel: c.reasoningModel,
    hasLiteLLM: !!c.litellmBaseUrl,
  };
}
