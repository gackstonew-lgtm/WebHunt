"use server";

import prisma from "@/lib/db";
import { LeadItem, PipelineStatus } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function saveLeadToPipelineAction(lead: Partial<LeadItem>): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    if (!lead.businessName || !lead.phone) {
      return { success: false, error: "Business name and phone number are required." };
    }

    const saved = await prisma.lead.upsert({
      where: {
        phone_businessName: {
          phone: lead.phone,
          businessName: lead.businessName,
        },
      },
      create: {
        searchId: lead.searchId || null,
        businessName: lead.businessName,
        phone: lead.phone,
        phoneFormatted: lead.phoneFormatted || lead.phone,
        address: lead.address || null,
        city: lead.city || null,
        state: lead.state || null,
        postalCode: lead.postalCode || null,
        category: lead.category || null,
        rating: lead.rating || null,
        reviewCount: lead.reviewCount || 0,
        hasWebsite: false,
        noWebsiteConfidence: lead.noWebsiteConfidence || "High",
        sourceProvider: lead.sourceProvider || "demo",
        providerPlaceId: lead.providerPlaceId || null,
        status: lead.status || "NEW",
        estimatedValue: lead.estimatedValue || 1500,
        notes: lead.notes || null,
        tags: lead.tags || null,
      },
      update: {
        status: lead.status || undefined,
        notes: lead.notes !== undefined ? lead.notes : undefined,
        estimatedValue: lead.estimatedValue || undefined,
        rating: lead.rating || undefined,
        reviewCount: lead.reviewCount || undefined,
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
        await prisma.lead.upsert({
          where: {
            phone_businessName: {
              phone: lead.phone,
              businessName: lead.businessName,
            },
          },
          create: {
            searchId: lead.searchId || null,
            businessName: lead.businessName,
            phone: lead.phone,
            phoneFormatted: lead.phoneFormatted,
            address: lead.address,
            city: lead.city,
            state: lead.state,
            postalCode: lead.postalCode,
            category: lead.category,
            rating: lead.rating,
            reviewCount: lead.reviewCount,
            hasWebsite: false,
            noWebsiteConfidence: lead.noWebsiteConfidence,
            sourceProvider: lead.sourceProvider,
            providerPlaceId: lead.providerPlaceId,
            status: "NEW",
            estimatedValue: lead.estimatedValue || 1500,
            notes: lead.notes,
            tags: lead.tags,
          },
          update: {},
        });
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

export async function getPipelineLeadsAction(filterStatus?: string): Promise<{
  success: boolean;
  data: LeadItem[];
  stats: {
    totalLeads: number;
    newLeads: number;
    contactedLeads: number;
    interestedLeads: number;
    closedLeads: number;
    totalPipelineValue: number;
    potentialClosedValue: number;
  };
}> {
  try {
    const whereClause: any = {};
    if (filterStatus && filterStatus !== "ALL") {
      whereClause.status = filterStatus;
    }

    const leads = await prisma.lead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    const allLeads = await prisma.lead.findMany();

    const stats = {
      totalLeads: allLeads.length,
      newLeads: allLeads.filter((l) => l.status === "NEW").length,
      contactedLeads: allLeads.filter((l) => l.status === "CONTACTED").length,
      interestedLeads: allLeads.filter((l) => l.status === "INTERESTED").length,
      closedLeads: allLeads.filter((l) => l.status === "CLOSED").length,
      totalPipelineValue: allLeads.reduce((sum, l) => sum + (l.estimatedValue || 1500), 0),
      potentialClosedValue: allLeads
        .filter((l) => l.status === "INTERESTED" || l.status === "CLOSED")
        .reduce((sum, l) => sum + (l.estimatedValue || 1500), 0),
    };

    return {
      success: true,
      data: leads as any as LeadItem[],
      stats,
    };
  } catch (error) {
    console.warn("[LeadsAction] Error getting pipeline leads:", error);
    return {
      success: true,
      data: [],
      stats: {
        totalLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        interestedLeads: 0,
        closedLeads: 0,
        totalPipelineValue: 0,
        potentialClosedValue: 0,
      },
    };
  }
}
