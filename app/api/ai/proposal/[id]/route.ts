/**
 * PATCH /api/ai/proposal/[id]
 * 
 * Update an existing AI proposal draft (user edits, lifecycle status changes).
 * Only the owner may update their own proposal drafts.
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import prisma from "@/lib/db";

const updateSchema = z.object({
  subject: z.string().max(500).optional(),
  body: z.string().max(10000).optional(),
  callToAction: z.string().max(3000).optional(),
  fullText: z.string().max(15000).optional(),
  aiLifecycleStatus: z.enum([
    "ANALYZED", "AI_DRAFT", "AI_REVIEW", "USER_REVIEW",
    "APPROVED", "READY_TO_SUBMIT", "SUBMITTED", "FOLLOW_UP"
  ]).optional(),
  status: z.enum(["DRAFT", "READY", "SENT", "ARCHIVED"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 1. Authenticate
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  const { id } = params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ success: false, error: "Invalid proposal ID" }, { status: 400 });
  }

  // 2. Verify ownership
  const existing = await prisma.proposalDraft.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "Proposal not found" }, { status: 404 });
  }

  const isAdmin = session.role === "admin" || session.role === "administrator";
  if (existing.userId && existing.userId !== session.userId && !isAdmin) {
    return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
  }

  // 3. Parse update
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || "Invalid request" }, { status: 400 });
  }

  const { subject, body: bodyText, callToAction, fullText, aiLifecycleStatus, status } = parsed.data;

  // Build fullText if body components were updated
  const updatedFullText = fullText ||
    (bodyText || callToAction || subject
      ? `SUBJECT: ${subject || existing.subject}\n\n${existing.greeting}\n\n${bodyText || existing.body}\n\n${callToAction || existing.callToAction}`
      : undefined);

  // 4. Update
  const updated = await prisma.proposalDraft.update({
    where: { id },
    data: {
      ...(subject !== undefined ? { subject } : {}),
      ...(bodyText !== undefined ? { body: bodyText } : {}),
      ...(callToAction !== undefined ? { callToAction } : {}),
      ...(updatedFullText !== undefined ? { fullText: updatedFullText } : {}),
      ...((aiLifecycleStatus !== undefined) ? { aiLifecycleStatus } : {}),
      ...(status !== undefined ? { status } : {}),
    },
  });

  return NextResponse.json({ success: true, data: { id: updated.id, aiLifecycleStatus: (updated as any).aiLifecycleStatus, status: updated.status } });
}
