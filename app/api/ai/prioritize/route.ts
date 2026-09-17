/**
 * POST /api/ai/prioritize
 * 
 * Lead Prioritization — assigns recommendation tags to the user's pipeline leads.
 * 
 * Auth: Session required | Rate limit: 5/hour (expensive batch operation)
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { buildAgentContext } from "@/lib/ai/context";
import { AIOrchestrator } from "@/lib/ai/orchestrator";
import { isAIConfigured } from "@/lib/ai/gateway";
import prisma from "@/lib/db";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus, SocialProfiles, VerificationStatus, WebsiteConfidence, RemoteType } from "@/lib/types";

const requestSchema = z.object({
  leadIds: z.array(z.string().max(100)).max(20).optional(),
});

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session || !session.userId) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  if (!isAIConfigured()) {
    return NextResponse.json({ success: false, error: "AI gateway is not configured.", notConfigured: true }, { status: 503 });
  }

  const rl = checkRateLimit(`ai:prioritize:${session.userId}`, 5, 3600);
  if (!rl.allowed) {
    return NextResponse.json({
      success: false, error: `Rate limit exceeded. Try again in ${rl.retryAfterSeconds}s.`,
      rateLimited: true, retryAfterSeconds: rl.retryAfterSeconds,
    }, { status: 429 });
  }

  let body: unknown;
  try { body = await req.json(); } catch { body = {}; }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }

  // Load user's leads (only their own)
  const isAdmin = session.role === "admin" || session.role === "administrator";
  const leads = await prisma.lead.findMany({
    where: {
      userId: session.userId,
      ...(parsed.data.leadIds ? { id: { in: parsed.data.leadIds } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Convert to LeadItem[] (simplified version for prioritization)
  const leadItems: LeadItem[] = leads.map((rec) => {
    const isOnline = rec.pipelineType === "job_application" || /remotive|arbeitnow|himalayas|weworkremotely|jobspresso|remoteok|africa/i.test(rec.sourceProvider);
    const rawPhone = rec.phone || "";
    const isUnlisted = rawPhone.startsWith("unlisted-");

    if (isOnline) {
      return {
        id: rec.id, type: "online",
        title: rec.businessName.includes(" @ ") ? rec.businessName.split(" @ ")[0] : rec.businessName,
        company: rec.businessName.includes(" @ ") ? rec.businessName.split(" @ ")[1] : (rec.category || "Company"),
        location: rec.city || "Remote", country: rec.state || "Global",
        isRemote: true, remoteType: (rec.remoteType as RemoteType) || "worldwide",
        category: rec.category, tags: rec.tags ? rec.tags.split(",") : [],
        url: rec.phone, postedDate: rec.createdAt.toISOString(),
        salary: rec.estimatedValue ? `$${rec.estimatedValue}/yr` : "Competitive",
        source: rec.sourceProvider as any,
        status: rec.status as PipelineStatus, estimatedValue: rec.estimatedValue,
        notes: rec.notes, email: rec.email, whatsapp: rec.whatsapp,
        socialProfiles: {} as SocialProfiles, createdAt: rec.createdAt, updatedAt: rec.updatedAt,
        contactedAt: undefined,
      } satisfies OnlineJobLead;
    }
    return {
      id: rec.id, type: "physical", businessName: rec.businessName,
      phone: isUnlisted ? "" : rec.phone, phoneFormatted: rec.phoneFormatted,
      address: rec.address, city: rec.city, state: rec.state, country: rec.state || "Kenya",
      category: rec.category, rating: rec.rating, reviewCount: rec.reviewCount,
      hasWebsite: rec.hasWebsite, noWebsiteConfidence: (rec.noWebsiteConfidence as WebsiteConfidence) || "High",
      sourceProvider: rec.sourceProvider as any, status: rec.status as PipelineStatus,
      estimatedValue: rec.estimatedValue, notes: rec.notes,
      verificationStatus: rec.verificationStatus as VerificationStatus,
      email: rec.email, whatsapp: rec.whatsapp, socialProfiles: {} as SocialProfiles,
      createdAt: rec.createdAt, updatedAt: rec.updatedAt, contactedAt: undefined,
    } satisfies PhysicalLead;
  });

  // Build context (no specific lead — using user context only)
  const contextResult = await buildAgentContext({ session });
  const orchestrator = new AIOrchestrator(contextResult.context);
  const result = await orchestrator.prioritizeLeads(leadItems);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true, recommendations: result.recommendations });
}
