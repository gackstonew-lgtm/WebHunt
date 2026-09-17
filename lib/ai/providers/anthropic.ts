import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, AIModel, AIRequest, AIResponse, AIProviderId, AIGatewayError, AIErrorCategory } from "../core/types";

export class AnthropicProvider implements AIProvider {
  id: AIProviderId = "anthropic";
  name = "Anthropic";
  private client: Anthropic | null = null;

  constructor() {
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) {
      this.client = new Anthropic({ apiKey: key, maxRetries: 0 });
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  listModels(): AIModel[] { return []; }

  private normalizeError(error: any, modelId: string): AIGatewayError {
    const status = error?.status;
    let category: AIErrorCategory = "UNKNOWN_ERROR";

    if (status === 401) category = "AUTHENTICATION_ERROR";
    else if (status === 403) category = "AUTHORIZATION_ERROR";
    else if (status === 404) category = "MODEL_NOT_FOUND";
    else if (status === 429) category = "RATE_LIMITED";
    else if (status >= 500) category = "SERVER_ERROR";

    return new AIGatewayError(error?.message || "Anthropic Error", category, this.id, modelId, error);
  }

  async generate(request: AIRequest, model: AIModel): Promise<AIResponse> {
    if (!this.client) throw new Error("Not configured");
    const start = Date.now();
    try {
      let sys = request.system || "";
      if (request.jsonMode) {
        sys += "\n\nCRITICAL: Respond ONLY with valid JSON.";
      }
      const res = await this.client.messages.create({
        model: model.id,
        system: sys || undefined,
        messages: request.messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens || 4096,
      });

      const textBlock = res.content.find(c => c.type === "text") as any;
      let text = textBlock?.text || "";
      if (request.jsonMode && text.startsWith("```json")) {
        text = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      }

      return {
        content: text,
        usage: {
          inputTokens: res.usage?.input_tokens || 0,
          outputTokens: res.usage?.output_tokens || 0,
          totalTokens: (res.usage?.input_tokens || 0) + (res.usage?.output_tokens || 0),
          estimatedCostUsd: 0,
        },
        model: model.id,
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
      let sys = request.system || "";
      const stream = await this.client.messages.create({
        model: model.id,
        system: sys || undefined,
        messages: request.messages as any,
        temperature: request.temperature,
        max_tokens: request.maxTokens || 4096,
        stream: true,
      });

      let outTokens = 0;
      let inTokens = 0;

      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          onChunk(chunk.delta.text);
        } else if (chunk.type === "message_start") {
          inTokens = chunk.message.usage.input_tokens;
        } else if (chunk.type === "message_delta" && chunk.usage) {
          outTokens = chunk.usage.output_tokens;
        }
      }

      return {
        usage: { inputTokens: inTokens, outputTokens: outTokens, totalTokens: inTokens + outTokens, estimatedCostUsd: 0 },
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
