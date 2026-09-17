import OpenAI from "openai";
import { AIProvider, AIModel, AIRequest, AIResponse, AIProviderId, AIGatewayError, AIErrorCategory } from "../core/types";

export class OpenAIProvider implements AIProvider {
  id: AIProviderId = "openai";
  name = "OpenAI";
  private client: OpenAI | null = null;

  constructor() {
    const key = process.env.OPENAI_API_KEY;
    if (key) {
      this.client = new OpenAI({ apiKey: key, maxRetries: 0 }); // Retries handled by Gateway
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  listModels(): AIModel[] { return []; }

  private normalizeError(error: any, modelId: string): AIGatewayError {
    const status = error?.status;
    let category: AIErrorCategory = "UNKNOWN_ERROR";
    let isPermanent = false;

    if (status === 401) category = "AUTHENTICATION_ERROR";
    else if (status === 403) category = "AUTHORIZATION_ERROR";
    else if (status === 404) { category = "MODEL_NOT_FOUND"; isPermanent = true; }
    else if (status === 429) category = "RATE_LIMITED";
    else if (status >= 500) category = "SERVER_ERROR";

    return new AIGatewayError(error?.message || "OpenAI Error", category, this.id, modelId, error);
  }

  async generate(request: AIRequest, model: AIModel): Promise<AIResponse> {
    if (!this.client) throw new Error("Not configured");
    const start = Date.now();
    try {
      const messages: any[] = request.system ? [{ role: "system", content: request.system }, ...request.messages] : request.messages;
      const res = await this.client.chat.completions.create({
        model: model.id,
        messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        response_format: request.jsonMode ? { type: "json_object" } : undefined,
      });

      return {
        content: res.choices[0]?.message?.content || "",
        usage: {
          inputTokens: res.usage?.prompt_tokens || 0,
          outputTokens: res.usage?.completion_tokens || 0,
          totalTokens: res.usage?.total_tokens || 0,
          estimatedCostUsd: 0, // Handled by gateway
        },
        model: res.model,
        provider: this.id,
        latencyMs: Date.now() - start,
        fallbackUsed: false,
      };
    } catch (e: any) {
      throw this.normalizeError(e, model.id);
    }
  }

  async stream(request: AIRequest, model: AIModel, onChunk: (chunk: string) => void): Promise<Omit<AIResponse, "content">> {
    if (!this.client) throw new Error("Not configured");
    const start = Date.now();
    try {
      const messages: any[] = request.system ? [{ role: "system", content: request.system }, ...request.messages] : request.messages;
      const stream = await this.client.chat.completions.create({
        model: model.id,
        messages,
        temperature: request.temperature,
        max_tokens: request.maxTokens,
        stream: true,
      });

      let outTokens = 0;
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          onChunk(delta);
          outTokens++;
        }
      }

      return {
        usage: { inputTokens: 0, outputTokens: outTokens, totalTokens: outTokens, estimatedCostUsd: 0 },
        model: model.id,
        provider: this.id,
        latencyMs: Date.now() - start,
        fallbackUsed: false,
      };
    } catch (e: any) {
      throw this.normalizeError(e, model.id);
    }
  }
}
