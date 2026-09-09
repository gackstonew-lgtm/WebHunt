"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveProposalDraftAction(params: {
  leadId?: string;
  userId?: string;
  title: string;
  templateType: string;
  subject: string;
  greeting?: string;
  body: string;
  callToAction: string;
  fullText: string;
  variablesJson?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const draft = await prisma.proposalDraft.create({
      data: {
        leadId: params.leadId || null,
        userId: params.userId || null,
        title: params.title,
        templateType: params.templateType,
        subject: params.subject,
        greeting: params.greeting || "Hi,",
        body: params.body,
        callToAction: params.callToAction,
        fullText: params.fullText,
        variablesJson: params.variablesJson || null,
        status: "DRAFT",
      },
    });

    revalidatePath("/pipeline");
    return { success: true, data: draft };
  } catch (error: any) {
    console.error("[OutreachAction] Save draft failed:", error);
    return { success: false, error: error.message || "Failed to save proposal draft" };
  }
}

export async function fetchProposalDraftsAction(leadId: string): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> {
  try {
    const drafts = await prisma.proposalDraft.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: drafts };
  } catch (error: any) {
    console.error("[OutreachAction] Fetch drafts failed:", error);
    return { success: false, data: [], error: error.message };
  }
}

/**
 * Checks if a recipient has already received outreach in the last N days
 */
export async function checkDuplicateOutreachAction(
  recipient: string,
  channel: "email" | "whatsapp" | "call" = "email",
  cooldownDays: number = 7
): Promise<{
  isDuplicate: boolean;
  lastContactedAt?: string | null;
  messageCount: number;
}> {
  if (!recipient || recipient.trim() === "") {
    return { isDuplicate: false, messageCount: 0 };
  }

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - cooldownDays);

    const messages = await prisma.outreachMessage.findMany({
      where: {
        recipient: recipient.trim(),
        channel,
        sentAt: { gte: cutoffDate },
      },
      orderBy: { sentAt: "desc" },
    });

    if (messages.length > 0) {
      return {
        isDuplicate: true,
        lastContactedAt: messages[0].sentAt.toISOString(),
        messageCount: messages.length,
      };
    }

    return { isDuplicate: false, messageCount: 0 };
  } catch (error: any) {
    console.error("[OutreachAction] Duplicate check failed:", error);
    return { isDuplicate: false, messageCount: 0 };
  }
}

export async function recordOutreachMessageAction(params: {
  leadId?: string;
  userId?: string;
  channel: "email" | "whatsapp" | "call";
  recipient: string;
  subject?: string;
  messageBody: string;
  externalMessageId?: string;
  status?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const record = await prisma.outreachMessage.create({
      data: {
        leadId: params.leadId || null,
        userId: params.userId || null,
        channel: params.channel,
        recipient: params.recipient,
        subject: params.subject || null,
        messageBody: params.messageBody,
        externalMessageId: params.externalMessageId || null,
        status: params.status || "SENT",
        sentAt: new Date(),
      },
    });

    // Also update lead's contacted timestamp & status if leadId is present
    if (params.leadId) {
      await prisma.lead.update({
        where: { id: params.leadId },
        data: {
          status: "CONTACTED",
          contactedAt: new Date(),
        },
      });
    }

    revalidatePath("/pipeline");
    return { success: true, data: record };
  } catch (error: any) {
    console.error("[OutreachAction] Record outreach failed:", error);
    return { success: false, error: error.message };
  }
}

export async function fetchLeadOutreachHistoryAction(leadId: string): Promise<{
  success: boolean;
  data: any[];
  error?: string;
}> {
  try {
    const records = await prisma.outreachMessage.findMany({
      where: { leadId },
      orderBy: { sentAt: "desc" },
    });
    return { success: true, data: records };
  } catch (error: any) {
    console.error("[OutreachAction] Fetch history failed:", error);
    return { success: false, data: [], error: error.message };
  }
}
