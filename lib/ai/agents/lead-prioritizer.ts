/**
 * Agent 8 — Lead Prioritizer
 * 
 * Analyzes leads and assigns recommendation tags (not numerical scores).
 * Every tag is explainable from available data.
 * 
 * Model tier: FAST (batch processing)
 */

import { completion } from "@/lib/ai/gateway";
import {
  getLeadPrioritizerSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, LeadPriorityRecommendation, LeadPriorityTag, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { LeadItem, OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface LeadPrioritizerResult {
  recommendations: LeadPriorityRecommendation[];
  execution: AIExecutionMetadata;
}

const VALID_TAGS: LeadPriorityTag[] = [
  "strong_requirement_match",
  "website_opportunity_detected",
  "proposal_ready",
  "missing_contact_information",
  "requires_user_research",
  "application_deadline_detected",
  "follow_up_recommended",
  "recently_contacted",
  "high_estimated_value",
];

export async function runLeadPrioritizer(
  context: AgentContext,
  leads: LeadItem[]
): Promise<LeadPrioritizerResult> {
  const startTime = Date.now();

  if (!leads || leads.length === 0) {
    return {
      recommendations: [],
      execution: {
        agent: "lead_prioritizer",
        model: "none",
        status: "success",
        inputTokens: 0,
        outputTokens: 0,
        estimatedCostUsd: 0,
        latencyMs: 0,
      },
    };
  }

  // Limit batch size to avoid token overflow
  const batchLeads = leads.slice(0, 20);

  const profileMessage = context.profile
    ? buildProfileContextMessage(context.profile)
    : "[TRUSTED USER PROFILE DATA]\nNo profile available.\n[END TRUSTED USER PROFILE DATA]";

  // Build compact lead summaries for batch analysis
  const leadSummaries = batchLeads.map((lead) => {
    const isOnline = lead.type === "online";
    const onlineLead = isOnline ? (lead as OnlineJobLead) : null;
    const physLead = !isOnline ? (lead as PhysicalLead) : null;

    return `
Lead ID: ${lead.id}
Type: ${lead.type}
Name/Title: ${physLead?.businessName || onlineLead?.title || "Unknown"}
Company: ${onlineLead?.company || "N/A"}
Category: ${lead.category || "Unknown"}
Status: ${lead.status}
Has Website: ${physLead?.hasWebsite !== undefined ? String(physLead.hasWebsite) : "N/A"}
Tags/Skills: ${onlineLead?.tags?.join(", ") || "None"}
Location: ${physLead?.city || onlineLead?.location || "Unknown"}
Estimated Value: $${lead.estimatedValue || 0}
Has Email: ${lead.email ? "Yes" : "No"}
Has Phone: ${physLead?.phone ? "Yes" : "No"}
Has WhatsApp: ${lead.whatsapp ? "Yes" : "No"}
Notes (sanitized): ${sanitizeUntrustedText(lead.notes || "").substring(0, 200)}
---`.trim();
  }).join("\n\n");

  const result = await completion({
    tier: "fast",
    system: getLeadPrioritizerSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Analyze these leads and assign recommendation tags:\n\n${profileMessage}\n\n[TRUSTED LEAD DATA]\n${leadSummaries}\n[END TRUSTED LEAD DATA]`,
      },
    ],
    jsonMode: true,
    temperature: 0.1,
  });

  const latencyMs = Date.now() - startTime;

  let recommendations: LeadPriorityRecommendation[];
  try {
    const parsed = JSON.parse(result.content);
    recommendations = validateRecommendations(parsed, batchLeads.map((l) => l.id));
  } catch (err) {
    throw new Error(`LeadPrioritizer returned invalid JSON: ${err}`);
  }

  return {
    recommendations,
    execution: {
      agent: "lead_prioritizer",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateRecommendations(parsed: any, validLeadIds: string[]): LeadPriorityRecommendation[] {
  if (!Array.isArray(parsed)) {
    throw new Error("Response is not an array");
  }

  return parsed
    .filter((r: any) => r && typeof r.leadId === "string" && validLeadIds.includes(r.leadId))
    .map((r: any) => ({
      leadId: r.leadId,
      tags: Array.isArray(r.tags)
        ? r.tags.filter((t: any) => VALID_TAGS.includes(t as LeadPriorityTag)) as LeadPriorityTag[]
        : [],
      reasoning: String(r.reasoning || "").substring(0, 500),
      topAction: String(r.topAction || "").substring(0, 200),
    }))
    .slice(0, 20);
}
