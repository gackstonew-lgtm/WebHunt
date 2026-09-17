export type AIProviderId = "openai" | "anthropic" | "gemini" | "openrouter";

export enum AICapability {
  TEXT = "TEXT",
  VISION = "VISION",
  JSON = "JSON",
  FUNCTION_CALLING = "FUNCTION_CALLING",
  TOOLS = "TOOLS",
  REASONING = "REASONING",
  LONG_CONTEXT = "LONG_CONTEXT",
  STREAMING = "STREAMING",
}

export interface AIModel {
  id: string; // The provider's model ID (e.g. gpt-4o)
  providerId: AIProviderId;
  displayName: string;
  capabilities: AICapability[];
  contextWindow: number;
  maxOutputTokens: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  priority: number;
  enabled: boolean;
}

export type AIRoutingStrategy = "AUTO" | "BALANCED" | "PERFORMANCE" | "FASTEST" | "COST_OPTIMIZED" | "MANUAL";

export type AIErrorCategory =
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "MODEL_NOT_FOUND"
  | "RATE_LIMITED"
  | "QUOTA_EXCEEDED"
  | "TIMEOUT"
  | "NETWORK_ERROR"
  | "INVALID_REQUEST"
  | "CONTENT_POLICY"
  | "SERVER_ERROR"
  | "SERVICE_UNAVAILABLE"
  | "UNKNOWN_ERROR";

export class AIGatewayError extends Error {
  public code: string;
  constructor(
    public message: string,
    public category: AIErrorCategory,
    public providerId?: AIProviderId,
    public modelId?: string,
    public cause?: any
  ) {
    super(message);
    this.name = "AIGatewayError";
    this.code = category;
  }
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequest {
  messages: AIMessage[];
  system?: string; // Optional system instruction
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  stream?: boolean;
  // If MANUAL routing is used
  targetProvider?: AIProviderId;
  targetModel?: string;
  // Required capabilities for AUTO routing
  requiredCapabilities?: AICapability[];
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface AIResponse {
  content: string;
  usage: AIUsage;
  model: string;
  provider: AIProviderId;
  latencyMs: number;
  fallbackUsed: boolean;
}

export interface AIProviderStatus {
  id: AIProviderId;
  configured: boolean;
}

export interface AIProvider {
  id: AIProviderId;
  name: string;
  isConfigured(): boolean;
  listModels(): AIModel[];
  generate(request: AIRequest, model: AIModel): Promise<AIResponse>;
  stream(request: AIRequest, model: AIModel, onChunk: (chunk: string) => void): Promise<Omit<AIResponse, "content">>;
}
