/**
 * WebHunt AI Authorization-Aware Context Builder
 * 
 * SERVER-SIDE ONLY. 
 * 
 * Builds the AgentContext by loading all required data from the database
 * with full authorization enforcement. The agent system NEVER directly
 * queries the database — it only receives pre-authorized context from here.
 * 
 * Security guarantees:
 * - Session is verified before any data is loaded
 * - Lead/opportunity ownership is verified before inclusion in context
 * - Cross-user data access is impossible by design
 * - No raw userId/workspaceId is accepted from the request body for context building
 */

import prisma from "@/lib/db";
import { getCurrentSession } from "@/lib/auth/session";
import { checkUserSubscription } from "@/lib/auth/subscription";
import { AgentContext, ProposalHistoryItem, ApplicationContextData } from "./types";
import { UserProfileData } from "@/app/actions/profile";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus, SocialProfiles, EnrichedLeadContacts, RemoteType, VerificationStatus, WebsiteConfidence } from "@/lib/types";

// ---------------------------------------------------------------------------
// Main context builder
// ---------------------------------------------------------------------------

export interface BuildContextOptions {
  leadId?: string;
  /** Pre-validated session — if provided, skips getCurrentSession() call */
  session?: { userId: string; email: string; role?: string };
}

export interface BuildContextResult {
  context: AgentContext;
  error?: string;
  unauthorized?: boolean;
}

export async function buildAgentContext(
  options: BuildContextOptions = {}
): Promise<BuildContextResult> {
  // Step 1: Authenticate
  const session = options.session || await getCurrentSession();
  if (!session || !session.userId) {
    return {
      context: createEmptyContext(),
      error: "Authentication required",
      unauthorized: true,
    };
  }

  const userId = session.userId;

  // Step 2: Check subscription status
  const subStatus = await checkUserSubscription(userId);

  // Step 3: Load user profile
  const profile = await loadUserProfile(userId);

  // Step 4: Optionally load lead with ownership check
  let lead: LeadItem | undefined;
  let proposalHistory: ProposalHistoryItem[] = [];
  let applicationData: ApplicationContextData | undefined;

  if (options.leadId) {
    const leadResult = await loadLeadWithAuth(options.leadId, userId, session.role);
    if (!leadResult.authorized) {
      return {
        context: createEmptyContext(),
        error: "Access denied: You do not have access to this lead",
        unauthorized: true,
      };
    }
    lead = leadResult.lead;

    if (lead) {
      // Load proposal history for this lead
      proposalHistory = await loadProposalHistory(options.leadId, userId, session.role);
      // Load application data if this is a job lead
      if (lead.type === "online") {
        applicationData = await loadApplicationData(options.leadId, userId, session.role);
      }
    }
  }

  return {
    context: {
      userId,
      userEmail: session.email,
      lead,
      profile: profile || undefined,
      proposalHistory,
      applicationData,
      hasActiveSubscription: subStatus.hasActiveSubscription,
      requestedAt: new Date().toISOString(),
    },
  };
}

// ---------------------------------------------------------------------------
// Private loaders (all enforce ownership)
// ---------------------------------------------------------------------------

async function loadUserProfile(userId: string): Promise<UserProfileData | null> {
  try {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) return null;

    let skills: string[] = [];
    try { skills = JSON.parse(profile.skillsJson); } catch (_) { skills = []; }

    let languages: string[] = [];
    try { languages = profile.languagesJson ? JSON.parse(profile.languagesJson) : []; } catch (_) { languages = []; }

    return {
      id: profile.id,
      userId: profile.userId,
      fullName: profile.fullName,
      professionalTitle: profile.professionalTitle,
      bio: profile.bio || "",
      yearsExperience: profile.yearsExperience || 3,
      skills,
      portfolioUrl: profile.portfolioUrl || "",
      githubUrl: profile.githubUrl || "",
      linkedinUrl: profile.linkedinUrl || "",
      resumeUrl: profile.resumeUrl || "",
      hourlyRateUsd: profile.hourlyRateUsd || 45,
      hourlyRateKes: profile.hourlyRateKes || 5500,
      projectRateUsd: profile.projectRateUsd || 1500,
      projectRateKes: profile.projectRateKes || 180000,
      currency: (profile.currency as "USD" | "KES") || "USD",
      timezone: profile.timezone || "Africa/Nairobi",
      languages,
      phone: profile.phone || "",
      whatsapp: profile.whatsapp || "",
      email: profile.email || "",
      city: profile.city || "Nairobi",
      country: profile.country || "Kenya",
      mpesaTillNumber: profile.mpesaTillNumber || "",
      mpesaPaybillNumber: profile.mpesaPaybillNumber || "",
    };
  } catch (err) {
    console.error("[AIContext] Failed to load user profile:", err);
    return null;
  }
}

interface LeadLoadResult {
  authorized: boolean;
  lead?: LeadItem;
}

async function loadLeadWithAuth(
  leadId: string,
  userId: string,
  role?: string
): Promise<LeadLoadResult> {
  try {
    const record = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!record) return { authorized: false };

    // Ownership check: user must own the lead, or be admin
    const isAdmin = role === "admin" || role === "administrator";
    if (record.userId && record.userId !== userId && !isAdmin) {
      return { authorized: false };
    }

    // Convert DB record to LeadItem (same logic as in leads.ts)
    const isOnline =
      record.pipelineType === "job_application" ||
      record.sourceType === "job_board" ||
      /remotive|arbeitnow|himalayas|weworkremotely|jobspresso|remoteok|africa/i.test(record.sourceProvider);

    let socialProfiles: SocialProfiles = {};
    if (record.facebook || record.instagram || record.linkedin || record.twitter) {
      socialProfiles = {
        facebook: record.facebook,
        instagram: record.instagram,
        linkedin: record.linkedin,
        twitter: record.twitter,
      };
    }

    let parsedEnrichment: EnrichedLeadContacts | undefined;
    if (record.enrichmentJson) {
      try { parsedEnrichment = JSON.parse(record.enrichmentJson); } catch (_) {}
    }

    let lead: LeadItem;

    if (isOnline) {
      lead = {
        id: record.id,
        type: "online",
        title: record.businessName.includes(" @ ") ? record.businessName.split(" @ ")[0] : record.businessName,
        company: record.businessName.includes(" @ ") ? record.businessName.split(" @ ")[1] : (record.category || "Company"),
        location: record.address || record.city || "Remote",
        country: record.state || "Global",
        isRemote: true,
        remoteType: (record.remoteType as RemoteType) || "worldwide",
        category: record.category,
        tags: record.tags ? record.tags.split(",") : [],
        url: record.phone,
        postedDate: record.createdAt.toISOString(),
        salary: record.estimatedValue ? `$${record.estimatedValue}/yr` : "Competitive",
        source: record.sourceProvider as any,
        sourceId: record.providerPlaceId,
        sourceUrl: record.sourceUrl,
        sourceType: record.sourceType,
        descriptionSnippet: record.notes || "",
        status: record.status as PipelineStatus,
        estimatedValue: record.estimatedValue,
        notes: record.notes,
        verificationStatus: record.verificationStatus as VerificationStatus,
        email: record.email,
        whatsapp: record.whatsapp,
        contactPageUrl: record.contactPageUrl,
        bookingUrl: record.bookingUrl,
        hasContactForm: record.hasContactForm || false,
        socialProfiles,
        enrichment: parsedEnrichment,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      } satisfies OnlineJobLead;
    } else {
      const rawPhone = record.phone || "";
      const isUnlisted = rawPhone.startsWith("unlisted-");
      lead = {
        id: record.id,
        type: "physical",
        businessName: record.businessName,
        phone: isUnlisted ? "" : record.phone,
        phoneFormatted: isUnlisted ? (record.phoneFormatted || "Phone unavailable") : record.phoneFormatted,
        phoneStatus: isUnlisted ? "unavailable" : "verified",
        address: record.address,
        city: record.city,
        state: record.state,
        country: record.state || "Kenya",
        postalCode: record.postalCode,
        latitude: record.latitude,
        longitude: record.longitude,
        category: record.category,
        rating: record.rating,
        reviewCount: record.reviewCount,
        hasWebsite: record.hasWebsite,
        noWebsiteConfidence: (record.noWebsiteConfidence as WebsiteConfidence) || "High",
        sourceProvider: record.sourceProvider as any,
        sourceUrl: record.sourceUrl,
        sourceType: record.sourceType,
        providerPlaceId: record.providerPlaceId,
        status: record.status as PipelineStatus,
        estimatedValue: record.estimatedValue,
        notes: record.notes,
        tags: record.tags ? record.tags.split(",") : [],
        verificationStatus: record.verificationStatus as VerificationStatus,
        email: record.email,
        whatsapp: record.whatsapp,
        contactPageUrl: record.contactPageUrl,
        bookingUrl: record.bookingUrl,
        hasContactForm: record.hasContactForm || false,
        socialProfiles,
        enrichment: parsedEnrichment,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
      } satisfies PhysicalLead;
    }

    return { authorized: true, lead };
  } catch (err) {
    console.error("[AIContext] Failed to load lead:", err);
    return { authorized: false };
  }
}

async function loadProposalHistory(
  leadId: string,
  userId: string,
  role?: string
): Promise<ProposalHistoryItem[]> {
  try {
    const isAdmin = role === "admin" || role === "administrator";
    const records = await prisma.proposalDraft.findMany({
      where: {
        leadId,
        ...(isAdmin ? {} : { userId }),
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return records.map((r) => ({
      id: r.id,
      title: r.title,
      templateType: r.templateType,
      status: r.status,
      aiGenerated: (r as any).aiGenerated ?? false,
      createdAt: r.createdAt.toISOString(),
      contentSnippet: r.fullText.substring(0, 200),
    }));
  } catch (err) {
    console.error("[AIContext] Failed to load proposal history:", err);
    return [];
  }
}

async function loadApplicationData(
  leadId: string,
  userId: string,
  role?: string
): Promise<ApplicationContextData | undefined> {
  try {
    const isAdmin = role === "admin" || role === "administrator";
    const record = await prisma.application.findFirst({
      where: {
        jobId: leadId,
        ...(isAdmin ? {} : { userId }),
      },
    });

    if (!record) return undefined;

    let checklist: Record<string, boolean> | undefined;
    if (record.checklistJson) {
      try { checklist = JSON.parse(record.checklistJson); } catch (_) {}
    }

    return {
      id: record.id,
      status: record.status,
      coverLetterText: record.coverLetterText || undefined,
      checklist,
      notes: record.notes || undefined,
    };
  } catch (err) {
    console.error("[AIContext] Failed to load application data:", err);
    return undefined;
  }
}

function createEmptyContext(): AgentContext {
  return {
    userId: "",
    userEmail: "",
    hasActiveSubscription: false,
    requestedAt: new Date().toISOString(),
  };
}
