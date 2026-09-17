/**
 * Agent 2 — Research Agent
 * 
 * Analyzes publicly available information already attached to the lead
 * (website status, tags, category, description) to build research context.
 * Does NOT fetch external URLs.
 * 
 * Model tier: FAST
 */

import { completion } from "@/lib/ai/gateway";
import {
  getResearchAgentSystemPrompt,
  buildLeadContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, ResearchFindings, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface ResearchAgentResult {
  findings: ResearchFindings;
  execution: AIExecutionMetadata;
}

export async function runResearchAgent(
  context: AgentContext
): Promise<ResearchAgentResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("ResearchAgent requires a lead in the agent context");
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
    tags: onlineLead?.tags,
    salary: onlineLead?.salary || undefined,
    descriptionSnippet: sanitizeUntrustedText(onlineLead?.descriptionSnippet || lead.notes || ""),
    hasWebsite: physLead?.hasWebsite,
    sourceProvider: (lead.type === 'physical' ? (lead as PhysicalLead).sourceProvider : (lead as OnlineJobLead).source) || undefined,
    sourceType: lead.sourceType || undefined,
    status: lead.status,
    estimatedValue: lead.estimatedValue,
    notes: sanitizeUntrustedText(lead.notes || ""),
    email: lead.email ? "Available" : undefined,
    whatsapp: lead.whatsapp ? "Available" : undefined,
    linkedin: lead.socialProfiles?.linkedin ? "Available" : undefined,
    facebook: lead.socialProfiles?.facebook ? "Available" : undefined,
    remoteType: onlineLead?.remoteType,
    opportunityType: onlineLead?.opportunityType || undefined,
  });

  const result = await completion({
    tier: "fast",
    system: getResearchAgentSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Research this lead using only the provided data:\n\n${leadContextMessage}`,
      },
    ],
    jsonMode: true,
    temperature: 0.1,
  });

  const latencyMs = Date.now() - startTime;

  let findings: ResearchFindings;
  try {
    const parsed = JSON.parse(result.content);
    findings = validateResearchFindings(parsed);
  } catch (err) {
    throw new Error(`ResearchAgent returned invalid JSON: ${err}`);
  }

  return {
    findings,
    execution: {
      agent: "research_agent",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateResearchFindings(parsed: any): ResearchFindings {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const validEvidenceTypes = ["FACT", "INFERENCE", "UNKNOWN"];
  const validQuality = ["none", "poor", "basic", "good", "excellent"];

  const validateClaims = (arr: any[]) =>
    Array.isArray(arr)
      ? arr
          .filter((r: any) => r && typeof r.claim === "string")
          .map((r: any) => ({
            claim: String(r.claim).substring(0, 300),
            evidenceType: validEvidenceTypes.includes(r.evidenceType) ? r.evidenceType : "UNKNOWN",
            source: r.source ? String(r.source).substring(0, 200) : undefined,
          }))
      : [];

  const website = parsed.websiteAssessment || {};

  return {
    websiteAssessment: {
      hasWebsite:
        website.hasWebsite === true || website.hasWebsite === false
          ? website.hasWebsite
          : "unknown",
      websiteQuality: validQuality.includes(website.websiteQuality)
        ? website.websiteQuality
        : undefined,
      observations: validateClaims(website.observations),
    },
    businessPositioning: validateClaims(parsed.businessPositioning),
    digitalGaps: Array.isArray(parsed.digitalGaps)
      ? parsed.digitalGaps.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    technologyRequirements: Array.isArray(parsed.technologyRequirements)
      ? parsed.technologyRequirements.map((s: any) => String(s).substring(0, 200)).slice(0, 15)
      : [],
    existingTools: Array.isArray(parsed.existingTools)
      ? parsed.existingTools.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    businessCategory: String(parsed.businessCategory || "Unknown").substring(0, 100),
    additionalContext: validateClaims(parsed.additionalContext),
  };
}
