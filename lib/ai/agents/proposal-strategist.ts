/**
 * Agent 3 — Proposal Strategist
 * 
 * Combines opportunity analysis + user profile to produce a tailored
 * proposal strategy. Performs skill and portfolio matching.
 * 
 * Model tier: REASONING (complex matching task)
 */

import { completion, safeParseAIJson } from "@/lib/ai/gateway";
import {
  getProposalStrategistSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, OpportunityAnalysis, ResearchFindings, ProposalStrategy, PortfolioMatch, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface ProposalStrategistResult {
  strategy: ProposalStrategy;
  execution: AIExecutionMetadata;
}

export async function runProposalStrategist(
  context: AgentContext,
  opportunityAnalysis?: OpportunityAnalysis,
  researchFindings?: ResearchFindings
): Promise<ProposalStrategistResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("ProposalStrategist requires a lead in the agent context");
  }

  if (!context.profile) {
    throw new Error("ProposalStrategist requires a user profile in the agent context");
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
    estimatedValue: lead.estimatedValue,
    notes: sanitizeUntrustedText(lead.notes || ""),
    remoteType: onlineLead?.remoteType,
    opportunityType: onlineLead?.opportunityType || undefined,
  });

  const profileMessage = buildProfileContextMessage(context.profile);

  // Include prior analysis if available
  const analysisSection = opportunityAnalysis
    ? `\n[TRUSTED ANALYSIS DATA — From WebHunt Opportunity Analyst]\nOpportunity Summary: ${opportunityAnalysis.summary}\nOpportunity Type: ${opportunityAnalysis.opportunityType}\nRequirements: ${opportunityAnalysis.requirements.map((r) => `${r.claim} [${r.evidenceType}]`).join("; ")}\nService Needs: ${opportunityAnalysis.potentialServiceNeeds.join(", ")}\nRecommended Strategy Direction: ${opportunityAnalysis.recommendedProposalStrategy}\n[END TRUSTED ANALYSIS DATA]`
    : "";

  const researchSection = researchFindings
    ? `\n[TRUSTED RESEARCH DATA — From WebHunt Research Agent]\nDigital Gaps: ${researchFindings.digitalGaps.join(", ")}\nTechnology Requirements: ${researchFindings.technologyRequirements.join(", ")}\nBusiness Category: ${researchFindings.businessCategory}\n[END TRUSTED RESEARCH DATA]`
    : "";

  const result = await completion({
    model: context.profile?.aiPreferences?.model,
    provider: context.profile?.aiPreferences?.provider,
    routingStrategy: context.profile?.aiPreferences?.routingStrategy,
    tier: "reasoning",
    system: getProposalStrategistSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Create a proposal strategy for this opportunity:\n\n${leadContextMessage}\n\n${profileMessage}${analysisSection}${researchSection}`,
      },
    ],
    jsonMode: true,
    temperature: 0.2,
  });

  const latencyMs = Date.now() - startTime;

  let strategy: ProposalStrategy;
  try {
    const parsed = safeParseAIJson<any>(result.content);
    strategy = validateProposalStrategy(parsed, context.profile.skills || []);
  } catch (err) {
    throw new Error(`ProposalStrategist returned invalid JSON: ${err}`);
  }

  return {
    strategy,
    execution: {
      agent: "proposal_strategist",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateProposalStrategy(parsed: any, userSkills: string[]): ProposalStrategy {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const validTones = ["formal", "professional", "conversational", "technical"];

  // Portfolio matches: verify that claimed skills exist in user profile
  const portfolioMatches: PortfolioMatch[] = Array.isArray(parsed.portfolioMatches)
    ? parsed.portfolioMatches
        .filter((m: any) => m && typeof m.projectDescription === "string")
        .map((m: any) => {
          const relevantSkills: string[] = Array.isArray(m.relevantSkills)
            ? m.relevantSkills.map((s: any) => String(s).substring(0, 100))
            : [];
          // Verify: claimed skills must overlap with user's actual skills
          const userSkillsLower = userSkills.map((s) => s.toLowerCase());
          const verifiedSkills = relevantSkills.filter((s) =>
            userSkillsLower.some((us) => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))
          );
          return {
            projectDescription: String(m.projectDescription).substring(0, 500),
            relevantSkills: verifiedSkills.length > 0 ? verifiedSkills : relevantSkills,
            matchReason: String(m.matchReason || "").substring(0, 300),
            isVerified: verifiedSkills.length > 0,
          };
        })
        .slice(0, 5)
    : [];

  return {
    clientNeeds: Array.isArray(parsed.clientNeeds)
      ? parsed.clientNeeds.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    relevantServices: Array.isArray(parsed.relevantServices)
      ? parsed.relevantServices.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    matchedUserCapabilities: Array.isArray(parsed.matchedUserCapabilities)
      ? parsed.matchedUserCapabilities.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    portfolioMatches,
    proposalStructure: Array.isArray(parsed.proposalStructure)
      ? parsed.proposalStructure.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    keyValueProposition: String(parsed.keyValueProposition || "").substring(0, 500),
    suggestedDeliverables: Array.isArray(parsed.suggestedDeliverables)
      ? parsed.suggestedDeliverables.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    suggestedTimelineLanguage: String(parsed.suggestedTimelineLanguage || "").substring(0, 300),
    questionsToResolveBeforeSubmission: Array.isArray(parsed.questionsToResolveBeforeSubmission)
      ? parsed.questionsToResolveBeforeSubmission.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    proposalTone: validTones.includes(parsed.proposalTone) ? parsed.proposalTone : "professional",
    avoidClaiming: Array.isArray(parsed.avoidClaiming)
      ? parsed.avoidClaiming.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
  };
}
