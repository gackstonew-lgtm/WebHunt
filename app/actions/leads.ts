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
    const businessName = isPhysical ? (lead as PhysicalLead).businessName : `${(lead as OnlineJobLead).title} @ ${(lead as OnlineJobLead).company}`;
    const phone = isPhysical ? (lead as PhysicalLead).phone : (lead as OnlineJobLead).url;
    const phoneFormatted = isPhysical ? (lead as PhysicalLead).phoneFormatted : (lead as OnlineJobLead).url;

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
        address: isPhysical ? (lead as PhysicalLead).address : (lead as OnlineJobLead).location,
        city: isPhysical ? (lead as PhysicalLead).city : "Remote",
        state: isPhysical ? (lead as PhysicalLead).state : "",
        postalCode: isPhysical ? (lead as PhysicalLead).postalCode : "",
        category: isPhysical ? (lead as PhysicalLead).category : (lead as OnlineJobLead).category,
        rating: isPhysical ? (lead as PhysicalLead).rating : null,
        reviewCount: isPhysical ? (lead as PhysicalLead).reviewCount : 0,
        hasWebsite: false,
        noWebsiteConfidence: isPhysical ? (lead as PhysicalLead).noWebsiteConfidence : "Online Job",
        sourceProvider: isPhysical ? (lead as PhysicalLead).sourceProvider : (lead as OnlineJobLead).source,
        status: lead.status || "NEW",
        estimatedValue: lead.estimatedValue || 1500,
        notes: lead.notes || null,
      },
      update: {
        status: lead.status || undefined,
        notes: lead.notes !== undefined ? lead.notes : undefined,
        estimatedValue: lead.estimatedValue || undefined,
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
