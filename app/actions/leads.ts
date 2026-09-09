"use server";

import prisma from "@/lib/db";
import { LeadItem, OnlineJobLead, PhysicalLead, PipelineStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveLeadToPipelineAction(lead: LeadItem): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    const isPhysical = lead.type === "physical";
    const pLead = isPhysical ? (lead as PhysicalLead) : null;
    const jLead = !isPhysical ? (lead as OnlineJobLead) : null;

    const businessName = isPhysical
      ? pLead!.businessName
      : `${jLead!.title} @ ${jLead!.company}`;
    const phone = isPhysical ? pLead!.phone : jLead!.url;
    const phoneFormatted = isPhysical ? pLead!.phoneFormatted : jLead!.url;

    if (!businessName || !phone) {
      return { success: false, error: "Identifier and title are required." };
    }

    const saved = await prisma.lead.upsert({
      where: {
        phone_businessName: {
          phone,
          businessName,
        },
      },
      create: {
        businessName,
        phone,
        phoneFormatted,
        address: isPhysical ? pLead!.address : jLead!.location,
        city: isPhysical ? pLead!.city : "Remote",
        state: isPhysical ? pLead!.state : "",
        postalCode: isPhysical ? pLead!.postalCode : "",
        category: isPhysical ? pLead!.category : jLead!.category,
        rating: isPhysical ? pLead!.rating : null,
        reviewCount: isPhysical ? pLead!.reviewCount : 0,
        hasWebsite: false,
        noWebsiteConfidence: isPhysical ? pLead!.noWebsiteConfidence : "Verified",
        sourceProvider: isPhysical ? pLead!.sourceProvider : jLead!.source,
        providerPlaceId: isPhysical ? pLead!.providerPlaceId : jLead!.sourceId,
        sourceUrl: isPhysical ? pLead!.sourceUrl : jLead!.sourceUrl,
        sourceType: isPhysical ? pLead!.sourceType : jLead!.sourceType,
        remoteType: !isPhysical ? jLead!.remoteType : "onsite",
        verificationStatus: lead.verificationStatus || "SOURCE_LISTED",
        dataQualityScore: lead.dataQualityScore || 0.90,
        latitude: isPhysical ? pLead!.latitude : null,
        longitude: isPhysical ? pLead!.longitude : null,
        lastVerifiedAt: new Date(),
        status: lead.status || "NEW",
        estimatedValue: lead.estimatedValue || (isPhysical ? 1500 : 3500),
        notes: lead.notes || null,

        // Enriched contact channels
        email: lead.email || null,
        whatsapp: lead.whatsapp || null,
        contactPageUrl: lead.contactPageUrl || null,
        bookingUrl: lead.bookingUrl || null,
        hasContactForm: lead.hasContactForm || false,
        facebook: lead.socialProfiles?.facebook || null,
        instagram: lead.socialProfiles?.instagram || null,
        linkedin: lead.socialProfiles?.linkedin || null,
        twitter: lead.socialProfiles?.twitter || null,
        enrichmentJson: lead.enrichment ? JSON.stringify(lead.enrichment) : (lead.contacts ? JSON.stringify(lead.contacts) : null),
      },
      update: {
        status: lead.status || undefined,
        notes: lead.notes !== undefined ? lead.notes : undefined,
        estimatedValue: lead.estimatedValue || undefined,
        email: lead.email || undefined,
        whatsapp: lead.whatsapp || undefined,
        contactPageUrl: lead.contactPageUrl || undefined,
        bookingUrl: lead.bookingUrl || undefined,
        hasContactForm: lead.hasContactForm !== undefined ? lead.hasContactForm : undefined,
        facebook: lead.socialProfiles?.facebook || undefined,
        instagram: lead.socialProfiles?.instagram || undefined,
        linkedin: lead.socialProfiles?.linkedin || undefined,
        twitter: lead.socialProfiles?.twitter || undefined,
        enrichmentJson: lead.enrichment ? JSON.stringify(lead.enrichment) : undefined,
        lastVerifiedAt: new Date(),
      },
    });

    revalidatePath("/pipeline");
    revalidatePath("/");
    return { success: true, data: saved };
  } catch (error: any) {
    console.error("[LeadsAction] Save lead failed:", error);
    return { success: false, error: error.message || "Failed to save lead to pipeline." };
  }
}

export async function bulkSaveLeadsAction(leads: LeadItem[]): Promise<{
  success: boolean;
  count: number;
  error?: string;
}> {
  try {
    let savedCount = 0;
    for (const lead of leads) {
      try {
        await saveLeadToPipelineAction(lead);
        savedCount++;
      } catch (itemErr) {
        console.warn("[LeadsAction] Bulk item save skipped duplicate/invalid:", itemErr);
      }
    }

    revalidatePath("/pipeline");
    revalidatePath("/");
    return { success: true, count: savedCount };
  } catch (error: any) {
    console.error("[LeadsAction] Bulk save failed:", error);
    return { success: false, count: 0, error: error.message || "Bulk save failed." };
  }
}

export async function updateLeadStatusAction(
  leadId: string,
  status: PipelineStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status };
    if (status === "CONTACTED" || status === "INTERESTED" || status === "CLOSED") {
      updateData.contactedAt = new Date();
    }

    await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    revalidatePath("/pipeline");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("[LeadsAction] Update status failed:", error);
    return { success: false, error: error.message };
  }
}

export async function updateLeadNotesAction(
  leadId: string,
  notes: string,
  estimatedValue?: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        notes,
        ...(estimatedValue !== undefined ? { estimatedValue } : {}),
      },
    });

    revalidatePath("/pipeline");
    return { success: true };
  } catch (error: any) {
    console.error("[LeadsAction] Update notes failed:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteLeadAction(leadId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    });

    revalidatePath("/pipeline");
    return { success: true };
  } catch (error: any) {
    console.error("[LeadsAction] Delete lead failed:", error);
    return { success: false, error: error.message };
  }
}
