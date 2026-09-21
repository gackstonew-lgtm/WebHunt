"use server";

import { LeadItem, PhysicalLead, OnlineJobLead } from "@/lib/types";
import { enrichSocialProfilesForBusiness, BusinessIdentity } from "@/lib/enrichment/social-discovery";
import { getCurrentSession } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security/rate-limit";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function refreshSocialProfilesAction(
  leadId: string,
  leadData: LeadItem
): Promise<{
  success: boolean;
  data?: {
    socialProfiles: any;
    detailedProfiles: any;
    additionalPhones: any[];
    additionalEmails: any[];
    additionalContacts: any[];
    status: string;
    lastCheckedAt: string;
  };
  error?: string;
}> {
  try {
    const session = await getCurrentSession();
    if (!session || !session.userId) {
      return { success: false, error: "Authentication required to refresh social enrichment." };
    }

    const rl = checkRateLimit(`social_refresh:${session.userId}`, 20, 60);
    if (!rl.allowed) {
      return {
        success: false,
        error: `Refresh rate limit reached. Please wait ${rl.retryAfterSeconds} seconds.`,
      };
    }

    const isPhysical = leadData.type === "physical";
    const pLead = isPhysical ? (leadData as PhysicalLead) : null;
    const jLead = !isPhysical ? (leadData as OnlineJobLead) : null;

    const businessIdentity: BusinessIdentity = {
      businessName: isPhysical ? pLead!.businessName : (jLead!.company || jLead!.title),
      address: isPhysical ? pLead!.address : jLead!.location,
      city: isPhysical ? pLead!.city : undefined,
      country: isPhysical ? pLead!.country : jLead!.country,
      category: isPhysical ? pLead!.category : jLead!.category,
      website: isPhysical ? pLead!.websiteUrl : jLead!.url,
      domain: (isPhysical ? pLead!.websiteUrl : jLead!.url)?.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0],
      existingPhone: isPhysical ? pLead!.phone : undefined,
      existingEmail: isPhysical ? pLead!.email : jLead!.email,
      sourceProvider: isPhysical ? pLead!.sourceProvider : jLead!.source,
      sourceUrl: isPhysical ? pLead!.sourceUrl : jLead!.sourceUrl,
    };

    const enrichmentResult = await enrichSocialProfilesForBusiness(businessIdentity, {
      forceRefresh: true,
      timeoutMs: 3000,
    });

    // If lead exists in DB and belongs to user, update DB record
    if (leadId && !leadId.startsWith("temp-") && !leadId.startsWith("osm-")) {
      try {
        const existing = await prisma.lead.findUnique({
          where: { id: leadId },
        });

        if (existing && (existing.userId === session.userId || session.role === "admin")) {
          let updatedEnrichment: any = {};
          if (existing.enrichmentJson) {
            try {
              updatedEnrichment = JSON.parse(existing.enrichmentJson);
            } catch {}
          }

          updatedEnrichment.socialProfiles = enrichmentResult.socialProfiles;
          updatedEnrichment.detailedProfiles = enrichmentResult.detailedProfiles;
          updatedEnrichment.additionalPhones = enrichmentResult.additionalPhones;
          updatedEnrichment.additionalEmails = enrichmentResult.additionalEmails;
          updatedEnrichment.additionalContacts = enrichmentResult.additionalContacts;
          updatedEnrichment.socialEnrichmentStatus = enrichmentResult.status;
          updatedEnrichment.socialLastCheckedAt = enrichmentResult.lastCheckedAt;

          await prisma.lead.update({
            where: { id: leadId },
            data: {
              facebook: enrichmentResult.socialProfiles?.facebook || undefined,
              instagram: enrichmentResult.socialProfiles?.instagram || undefined,
              enrichmentJson: JSON.stringify(updatedEnrichment),
            },
          });

          try {
            revalidatePath("/pipeline");
            revalidatePath("/");
          } catch {}
        }
      } catch (dbErr) {
        console.warn("[SocialEnrichmentAction] DB update non-fatal error:", dbErr);
      }
    }

    return {
      success: true,
      data: enrichmentResult,
    };
  } catch (error: any) {
    console.error("[SocialEnrichmentAction] Refresh failed:", error);
    return {
      success: false,
      error: error.message || "Failed to refresh social profiles.",
    };
  }
}
