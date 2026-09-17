/**
 * POST /api/ai/review
 * 
 * Re-review an existing proposal text using the Proposal Reviewer agent.
 * Can review both AI-generated and manually written proposals.
 * 
 * Auth: Session required
 * Auth: Lead ownership verified (if leadId provided)
 * Rate limit: 20/hour per user
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { buildAgentContext } from "@/lib/ai/context";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { isAIConfigured } from "@/lib/ai/gateway";

const requestSchema = z.object({
  proposalText: z.string().min(50).max(15000),
  leadId: z.string().min(1).max(100).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json({ success: false, error: "AI gateway is not configured.", notConfigured: true }, { status: 503 });
  }

  const rl = checkRateLimit(`ai:review:${session.userId}`, 20, 3600);
  if (!rl.allowed) {
    return NextResponse.json({
      success: false, error: `Rate limit exceeded. Try again in ${rl.retryAfterSeconds}s.`,
      rateLimited: true, retryAfterSeconds: rl.retryAfterSeconds,
    }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 });
  }

  const contextResult = await buildAgentContext({
    leadId: parsed.data.leadId,
    session,
  });

  if (contextResult.unauthorized) {
    return NextResponse.json({ success: false, error: contextResult.error || "Access denied" }, { status: 403 });
  }

  const orchestrator = new AIOrchestrator(contextResult.context);
  const result = await orchestrator.reviewProposal(parsed.data.proposalText);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error, notConfigured: result.notConfigured }, { status: result.notConfigured ? 503 : 500 });
  }

  return NextResponse.json({ success: true, review: result.review });
}
