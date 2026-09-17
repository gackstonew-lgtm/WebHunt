/**
 * POST /api/ai/follow-up
 * 
 * Generate follow-up messages grounded in actual proposal/opportunity context.
 * 
 * Auth: Session required | Rate limit: 15/hour
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { buildAgentContext } from "@/lib/ai/context";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { isAIConfigured } from "@/lib/ai/gateway";
import prisma from "@/lib/db";

const requestSchema = z.object({
  leadId: z.string().min(1).max(100),
  proposalDraftId: z.string().max(100).optional(),
  channel: z.enum(["email", "whatsapp", "general"]).optional().default("email"),
  context: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json({ success: false, error: "AI gateway is not configured.", notConfigured: true }, { status: 503 });
  }

  const rl = checkRateLimit(`ai:followup:${session.userId}`, 15, 3600);
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
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const contextResult = await buildAgentContext({ leadId: parsed.data.leadId, session });
  if (contextResult.unauthorized) {
    return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
  }
  if (!contextResult.context.lead) {
    return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
  }

  // Load proposal text if draftId provided (with ownership check)
  let proposalText: string | undefined;
  if (parsed.data.proposalDraftId) {
    const draft = await prisma.proposalDraft.findUnique({ where: { id: parsed.data.proposalDraftId } });
    const isAdmin = session.role === "admin" || session.role === "administrator";
    if (draft && (draft.userId === session.userId || isAdmin)) {
      proposalText = draft.fullText;
    }
  }

  const orchestrator = new AIOrchestrator(contextResult.context);
  const result = await orchestrator.generateFollowUp(parsed.data.channel, proposalText, parsed.data.context);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, followUp: result.followUp });
}
