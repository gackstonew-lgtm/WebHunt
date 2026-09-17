/**
 * Agent 1 — Opportunity Analyst
 * 
 * Analyzes a discovered lead/opportunity and produces a structured analysis
 * with FACT/INFERENCE/UNKNOWN classification for every claim.
 * 
 * Model tier: FAST (cheap, quick classification task)
 */

import { completion, AIGatewayError } from "@/lib/ai/gateway";
import {
  getOpportunityAnalystSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, OpportunityAnalysis, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface OpportunityAnalystResult {
  analysis: OpportunityAnalysis;
  execution: AIExecutionMetadata;
}

export async function runOpportunityAnalyst(
  context: AgentContext
): Promise<OpportunityAnalystResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("OpportunityAnalyst requires a lead in the agent context");
  }

  const lead = context.lead;

  // Build sanitized lead context message (external content sanitized)
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
    tags: onlineLead?.tags,
    salary: onlineLead?.salary || undefined,
    // sanitizeUntrustedText applied to external description
    descriptionSnippet: sanitizeUntrustedText(onlineLead?.descriptionSnippet || lead.notes || ""),
    hasWebsite: physLead?.hasWebsite,
    sourceProvider: (lead.type === 'physical' ? (lead as PhysicalLead).sourceProvider : (lead as OnlineJobLead).source) || undefined,
    sourceType: lead.sourceType || undefined,
    status: lead.status,
    estimatedValue: lead.estimatedValue,
    notes: sanitizeUntrustedText(lead.notes || ""),
    phone: physLead?.phone ? "Available" : undefined,
    email: lead.email ? "Available" : undefined,
    whatsapp: lead.whatsapp ? "Available" : undefined,
    contactPageUrl: lead.contactPageUrl ? "Available" : undefined,
    linkedin: lead.socialProfiles?.linkedin ? "Available" : undefined,
    remoteType: onlineLead?.remoteType,
    opportunityType: onlineLead?.opportunityType || undefined,
    url: onlineLead?.url,
  });

  const profileMessage = context.profile
    ? buildProfileContextMessage(context.profile)
    : "[TRUSTED USER PROFILE DATA]\nNo profile data available.\n[END TRUSTED USER PROFILE DATA]";

  const result = await completion({
    tier: "fast",
    system: getOpportunityAnalystSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Please analyze this opportunity:\n\n${leadContextMessage}\n\n${profileMessage}`,
      },
    ],
    jsonMode: true,
    temperature: 0.1,
  });

  const latencyMs = Date.now() - startTime;

  // Parse and validate response
  let analysis: OpportunityAnalysis;
  try {
    const parsed = JSON.parse(result.content);
    analysis = validateOpportunityAnalysis(parsed);
  } catch (err) {
    throw new Error(`OpportunityAnalyst returned invalid JSON: ${err}`);
  }

  return {
    analysis,
    execution: {
      agent: "opportunity_analyst",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateOpportunityAnalysis(parsed: any): OpportunityAnalysis {
  // Validate required fields — never trust raw model output
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const validOpportunityTypes = ["website_pitch", "job_application", "contract", "freelance", "service_sale", "unknown"];
  const validRelevanceScores = ["high", "medium", "low", "unknown"];
  const validEvidenceTypes = ["FACT", "INFERENCE", "UNKNOWN"];

  return {
    summary: String(parsed.summary || "Analysis unavailable").substring(0, 500),
    opportunityType: validOpportunityTypes.includes(parsed.opportunityType) ? parsed.opportunityType : "unknown",
    requirements: Array.isArray(parsed.requirements)
      ? parsed.requirements
          .filter((r: any) => r && typeof r.claim === "string")
          .map((r: any) => ({
            claim: String(r.claim).substring(0, 300),
            evidenceType: validEvidenceTypes.includes(r.evidenceType) ? r.evidenceType : "UNKNOWN",
            source: r.source ? String(r.source).substring(0, 200) : undefined,
          }))
      : [],
    potentialServiceNeeds: Array.isArray(parsed.potentialServiceNeeds)
      ? parsed.potentialServiceNeeds.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    businessPainPoints: Array.isArray(parsed.businessPainPoints)
      ? parsed.businessPainPoints
          .filter((p: any) => p && typeof p.claim === "string")
          .map((p: any) => ({
            claim: String(p.claim).substring(0, 300),
            evidenceType: validEvidenceTypes.includes(p.evidenceType) ? p.evidenceType : "INFERENCE",
            source: p.source ? String(p.source).substring(0, 200) : undefined,
          }))
      : [],
    proposalRelevanceScore: validRelevanceScores.includes(parsed.proposalRelevanceScore)
      ? parsed.proposalRelevanceScore
      : "unknown",
    proposalRelevanceReason: String(parsed.proposalRelevanceReason || "").substring(0, 500),
    missingInformation: Array.isArray(parsed.missingInformation)
      ? parsed.missingInformation.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    recommendedProposalStrategy: String(parsed.recommendedProposalStrategy || "").substring(0, 500),
    unknownRequirements: Array.isArray(parsed.unknownRequirements)
      ? parsed.unknownRequirements.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    evidenceCited: Array.isArray(parsed.evidenceCited)
      ? parsed.evidenceCited.map((s: any) => String(s).substring(0, 200)).slice(0, 20)
      : [],
  };
}
