import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIModel, AIRequest, AIResponse, AIProviderId, AIGatewayError, AIErrorCategory } from "../core/types";

export class GeminiProvider implements AIProvider {
  id: AIProviderId = "gemini";
  name = "Google Gemini";
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (key) {
      this.client = new GoogleGenerativeAI(key);
    }
  }

  isConfigured(): boolean {
    return this.client !== null;
  }

  listModels(): AIModel[] { return []; }

  private normalizeError(error: any, modelId: string): AIGatewayError {
    const msg = error?.message || "";
    let category: AIErrorCategory = "UNKNOWN_ERROR";

    if (msg.includes("401") || msg.includes("API key not valid")) category = "AUTHENTICATION_ERROR";
    else if (msg.includes("403")) category = "AUTHORIZATION_ERROR";
    else if (msg.includes("404") || msg.includes("is not found")) category = "MODEL_NOT_FOUND"; // Fixes gemini-1.5-pro 404 issue mapping
    else if (msg.includes("429") || msg.includes("quota")) category = "RATE_LIMITED";
    else if (msg.includes("500") || msg.includes("503")) category = "SERVER_ERROR";

    return new AIGatewayError(msg || "Gemini Error", category, this.id, modelId, error);
  }

  async generate(request: AIRequest, model: AIModel): Promise<AIResponse> {
    if (!this.client) throw new Error("Not configured");
    const start = Date.now();
    try {
      const gModel = this.client.getGenerativeModel({
        model: model.id,
        systemInstruction: request.system,
        generationConfig: {
          temperature: request.temperature,
          maxOutputTokens: request.maxTokens,
          responseMimeType: request.jsonMode ? "application/json" : "text/plain",
        }
      });

      const history = request.messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      const chat = gModel.startChat({ history });
      const last = request.messages[request.messages.length - 1];
      const res = await chat.sendMessage(last ? last.content : "");

      const iT = res.response.usageMetadata?.promptTokenCount || 0;
      const oT = res.response.usageMetadata?.candidatesTokenCount || 0;

      return {
        content: res.response.text(),
        usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT, estimatedCostUsd: 0 },
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
      const gModel = this.client.getGenerativeModel({
        model: model.id,
        systemInstruction: request.system,
        generationConfig: {
          temperature: request.temperature,
          maxOutputTokens: request.maxTokens,
          responseMimeType: request.jsonMode ? "application/json" : "text/plain",
        }
      });

      const history = request.messages.slice(0, -1).map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));
      const chat = gModel.startChat({ history });
      const last = request.messages[request.messages.length - 1];
      const result = await chat.sendMessageStream(last ? last.content : "");

      let iT = 0, oT = 0;
      for await (const chunk of result.stream) {
        onChunk(chunk.text());
        if (chunk.usageMetadata) {
          iT = chunk.usageMetadata.promptTokenCount;
          oT = chunk.usageMetadata.candidatesTokenCount;
        }
      }

      return {
        usage: { inputTokens: iT, outputTokens: oT, totalTokens: iT + oT, estimatedCostUsd: 0 },
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
