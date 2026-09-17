/**
 * POST /api/ai/proposal
 * 
 * Full AI proposal generation pipeline:
 * Analysis → Strategy → Writing → Review → Save Draft
 * 
 * Supports Server-Sent Events streaming when stream=true.
 * 
 * Auth: Session required
 * Auth: Lead ownership verified
 * Rate limit: 10 proposals per hour per user
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
  stream: z.boolean().optional().default(false),
  existingAnalysisJson: z.string().max(50000).optional(),
  currentProposalText: z.string().max(15000).optional(),
  model: z.string().optional(),
  provider: z.string().optional(),
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
      error: "AI gateway is not configured.",
      notConfigured: true,
    }, { status: 503 });
  }

  // 3. Rate limit: 10 proposals per hour per user
  const rl = checkRateLimit(`ai:proposal:${session.userId}`, 10, 3600);
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

  // 5. Build authorized context
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

  if (!contextResult.context.profile) {
    return NextResponse.json({
      success: false,
      error: "Please complete your professional profile before generating AI proposals.",
    }, { status: 422 });
  }

  // Inject task-level overrides
  if (parsed.data.model || parsed.data.provider) {
    contextResult.context.profile.aiPreferences = {
      ...(contextResult.context.profile.aiPreferences || { provider: 'auto', model: 'auto', routingStrategy: 'AUTO', automaticFailover: true }),
      model: parsed.data.model || contextResult.context.profile.aiPreferences?.model || 'auto',
      provider: parsed.data.provider || contextResult.context.profile.aiPreferences?.provider || 'auto',
    };
  }

  // 6. Parse optional prior analysis
  let priorAnalysis;
  if (parsed.data.existingAnalysisJson) {
    try {
      priorAnalysis = { opportunityAnalysis: JSON.parse(parsed.data.existingAnalysisJson) };
    } catch (_) {
      // Ignore invalid prior analysis — orchestrator will re-run it
    }
  }

  // 7. Generate proposal
  const orchestrator = new AIOrchestrator(contextResult.context);
  const result = await orchestrator.generateProposal(priorAnalysis, parsed.data.currentProposalText);

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error,
      notConfigured: result.notConfigured,
    }, { status: result.notConfigured ? 503 : 500 });
  }

  return NextResponse.json({
    success: true,
    proposal: result.proposal,
    strategy: result.strategy,
    review: result.review,
    draftId: result.draftId,
    execution: {
      totalInputTokens: result.totalInputTokens,
      totalOutputTokens: result.totalOutputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
    },
  });
}
