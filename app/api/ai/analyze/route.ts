/**
 * POST /api/ai/analyze
 * 
 * Runs Opportunity Analyst + Research Agent on an authenticated lead.
 * Returns structured analysis — FACT/INFERENCE/UNKNOWN classified.
 * 
 * Auth: Session required
 * Auth: Lead ownership verified
 * Rate limit: 30/hour per user
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { buildAgentContext } from "@/lib/ai/context";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { isAIConfigured } from "@/lib/ai/gateway";

const requestSchema = z.object({
  leadId: z.string().min(1).max(100),
});

export async function POST(req: NextRequest) {
  // 1. Authenticate
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  // 2. Check AI availability
  if (!isAIConfigured()) {
    return NextResponse.json({
      success: false,
      error: "AI gateway is not configured. Set LITELLM_BASE_URL or OPENAI_API_KEY environment variables.",
      notConfigured: true,
    }, { status: 503 });
  }

  // 3. Rate limit: 30 analyses per hour per user
  const rl = checkRateLimit(`ai:analyze:${session.userId}`, 30, 3600);
  if (!rl.allowed) {
    return NextResponse.json({
      success: false,
      error: `Rate limit exceeded. Try again in ${rl.retryAfterSeconds}s.`,
      rateLimited: true,
      retryAfterSeconds: rl.retryAfterSeconds,
    }, { status: 429 });
  }

  // 4. Parse and validate input
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 });
  }

  // 5. Build authorized context (enforces lead ownership internally)
  const contextResult = await buildAgentContext({
    leadId: parsed.data.leadId,
    session,
  });

  if (contextResult.unauthorized) {
    return NextResponse.json({ success: false, error: contextResult.error || "Access denied" }, { status: 403 });
  }

  if (!contextResult.context.lead) {
    return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
  }

  // 6. Run analysis
  const orchestrator = new AIOrchestrator(contextResult.context);
  const result = await orchestrator.analyzeOpportunity();

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error,
      notConfigured: result.notConfigured,
    }, { status: result.notConfigured ? 503 : 500 });
  }

  return NextResponse.json({
    success: true,
    opportunityAnalysis: result.opportunityAnalysis,
    researchFindings: result.researchFindings,
    execution: {
      totalInputTokens: result.totalInputTokens,
      totalOutputTokens: result.totalOutputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
    },
  });
}
