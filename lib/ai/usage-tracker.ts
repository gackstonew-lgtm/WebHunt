/**
 * WebHunt AI Usage Tracker
 * 
 * Records AI execution telemetry to the AIExecution database table.
 * Used for cost monitoring, debugging, and subscription enforcement.
 * 
 * Security:
 * - Never stores API keys or secrets
 * - Never stores full prompt content (only metadata)
 * - UserId is always from the authenticated session, never from agent output
 */

import prisma from "@/lib/db";
import { AIExecutionMetadata } from "./types";

export interface TrackExecutionParams {
  userId: string;
  leadId?: string;
  metadata: AIExecutionMetadata;
}

/**
 * Records a completed AI execution to the database.
 * Fails silently — telemetry failures must never break the application.
 */
export async function trackAIExecution(params: TrackExecutionParams): Promise<void> {
  try {
    await (prisma as any).aIExecution.create({
      data: {
        userId: params.userId,
        leadId: params.leadId || null,
        agent: params.metadata.agent,
        model: params.metadata.model,
        provider: params.metadata.provider || null,
        status: params.metadata.status,
        inputTokens: params.metadata.inputTokens,
        outputTokens: params.metadata.outputTokens,
        estimatedCostUsd: params.metadata.estimatedCostUsd,
        latencyMs: params.metadata.latencyMs,
        errorMessage: params.metadata.errorMessage || null,
      },
    });
  } catch (err) {
    // Telemetry errors are logged but never rethrown
    console.error("[AIUsageTracker] Failed to record execution:", err);
  }
}

/**
 * Returns aggregate usage stats for a user (for display/enforcement purposes)
 */
export async function getUserAIUsageStats(
  userId: string,
  periodDays: number = 30
): Promise<{
  totalExecutions: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedTotalCostUsd: number;
  successRate: number;
}> {
  try {
    const since = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000);
    const records = await (prisma as any).aIExecution.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      select: {
        status: true,
        inputTokens: true,
        outputTokens: true,
        estimatedCostUsd: true,
      },
    });

    if (!records.length) {
      return { totalExecutions: 0, totalInputTokens: 0, totalOutputTokens: 0, estimatedTotalCostUsd: 0, successRate: 1 };
    }

    const successCount = records.filter((r: any) => r.status === "success").length;

    return {
      totalExecutions: records.length,
      totalInputTokens: records.reduce((s: number, r: any) => s + (r.inputTokens || 0), 0),
      totalOutputTokens: records.reduce((s: number, r: any) => s + (r.outputTokens || 0), 0),
      estimatedTotalCostUsd: records.reduce((s: number, r: any) => s + (r.estimatedCostUsd || 0), 0),
      successRate: successCount / records.length,
    };
  } catch (err) {
    console.error("[AIUsageTracker] Failed to fetch usage stats:", err);
    return { totalExecutions: 0, totalInputTokens: 0, totalOutputTokens: 0, estimatedTotalCostUsd: 0, successRate: 1 };
  }
}
