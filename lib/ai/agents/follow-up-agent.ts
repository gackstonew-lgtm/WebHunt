/**
 * Agent 7 — Follow-Up Agent
 * 
 * Generates follow-up messages using actual opportunity and proposal context.
 * Does NOT invent client responses or fabricate conversation history.
 * 
 * Model tier: FAST
 */

import { completion, safeParseAIJson } from "@/lib/ai/gateway";
import {
  getFollowUpAgentSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
  buildProposalContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, FollowUpDraft, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface FollowUpAgentResult {
  followUp: FollowUpDraft;
  execution: AIExecutionMetadata;
}

export async function runFollowUpAgent(
  context: AgentContext,
  channel: "email" | "whatsapp" | "general" = "email",
  proposalText?: string,
  additionalContext?: string
): Promise<FollowUpAgentResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("FollowUpAgent requires a lead in the agent context");
  }

  const lead = context.lead;
  const isOnline = lead.type === "online";
  const onlineLead = isOnline ? (lead as OnlineJobLead) : null;
  const physLead = !isOnline ? (lead as PhysicalLead) : null;

  const leadContextMessage = buildLeadContextMessage({
    businessName: physLead?.businessName,
    title: onlineLead?.title,
    company: onlineLead?.company,
    category: lead.category || undefined,
    city: physLead?.city || undefined,
    country: physLead?.country || onlineLead?.country || undefined,
    location: onlineLead?.location,
    notes: sanitizeUntrustedText(lead.notes || ""),
    status: lead.status,
  });


  const profileMessage = context.profile
    ? buildProfileContextMessage(context.profile)
    : "[TRUSTED USER PROFILE DATA]\nNo profile available.\n[END TRUSTED USER PROFILE DATA]";

  // Include proposal context if available (from most recent history or provided text)
  const proposalSection = proposalText
    ? `\n${buildProposalContextMessage(proposalText)}`
    : context.proposalHistory && context.proposalHistory.length > 0
    ? `\n[TRUSTED PROPOSAL DATA]\nMost recent proposal snippet: ${context.proposalHistory[0].contentSnippet}\n[END TRUSTED PROPOSAL DATA]`
    : "";

  // Additional context from user (sanitized)
  const additionalSection = additionalContext
    ? `\n[UNTRUSTED USER-PROVIDED CONTEXT]\n${sanitizeUntrustedText(additionalContext).substring(0, 500)}\n[END UNTRUSTED USER-PROVIDED CONTEXT]`
    : "";

  const result = await completion({
    model: context.profile?.aiPreferences?.model,
    provider: context.profile?.aiPreferences?.provider,
    routingStrategy: context.profile?.aiPreferences?.routingStrategy,
    tier: "fast",
    system: getFollowUpAgentSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Generate a ${channel} follow-up message:\n\n${leadContextMessage}${proposalSection}${additionalSection}\n\n${profileMessage}`,
      },
    ],
    jsonMode: true,
    temperature: 0.3,
  });

  const latencyMs = Date.now() - startTime;

  let followUp: FollowUpDraft;
  try {
    const parsed = safeParseAIJson<any>(result.content);
    followUp = validateFollowUpDraft(parsed, channel);
  } catch (err) {
    throw new Error(`FollowUpAgent returned invalid JSON: ${err}`);
  }

  return {
    followUp,
    execution: {
      agent: "follow_up_agent",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateFollowUpDraft(parsed: any, channel: string): FollowUpDraft {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const validChannels = ["email", "whatsapp", "general"];
  const validTones = ["professional", "friendly", "brief"];

  return {
    channel: validChannels.includes(parsed.channel) ? parsed.channel : (channel as any),
    subject: parsed.subject ? String(parsed.subject).substring(0, 300) : undefined,
    body: String(parsed.body || "").substring(0, 2000),
    tone: validTones.includes(parsed.tone) ? parsed.tone : "professional",
    contextCited: Array.isArray(parsed.contextCited)
      ? parsed.contextCited.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    assumptions: Array.isArray(parsed.assumptions)
      ? parsed.assumptions.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
  };
}
