/**
 * Agent 5 — Proposal Reviewer
 * 
 * Reviews a generated proposal for accuracy, hallucinations, requirement
 * coverage, tone, and personalization before presenting it to the user.
 * 
 * Model tier: FAST (systematic review task)
 */

import { completion } from "@/lib/ai/gateway";
import {
  getProposalReviewerSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
  buildProposalContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, ReviewResult, ReviewIssue, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface ProposalReviewerResult {
  review: ReviewResult;
  execution: AIExecutionMetadata;
}

export async function runProposalReviewer(
  context: AgentContext,
  proposalText: string
): Promise<ProposalReviewerResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("ProposalReviewer requires a lead in the agent context");
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

  const profileMessage = context.profile
    ? buildProfileContextMessage(context.profile)
    : "[TRUSTED USER PROFILE DATA]\nNo profile available.\n[END TRUSTED USER PROFILE DATA]";

  const proposalMessage = buildProposalContextMessage(proposalText);

  const result = await completion({
    tier: "fast",
    system: getProposalReviewerSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Review this proposal:\n\n${proposalMessage}\n\nAgainst this opportunity:\n\n${leadContextMessage}\n\nAnd this user profile:\n\n${profileMessage}`,
      },
    ],
    jsonMode: true,
    temperature: 0.1,
  });

  const latencyMs = Date.now() - startTime;

  let review: ReviewResult;
  try {
    const parsed = JSON.parse(result.content);
    review = validateReviewResult(parsed);
  } catch (err) {
    throw new Error(`ProposalReviewer returned invalid JSON: ${err}`);
  }

  return {
    review,
    execution: {
      agent: "proposal_reviewer",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

function validateReviewResult(parsed: any): ReviewResult {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const validScores = ["approved", "needs_revision", "rejected"];
  const validAccuracy = ["verified", "partially_verified", "unverified"];
  const validPersonalization = ["high", "medium", "low"];
  const validSeverity = ["critical", "warning", "suggestion"];
  const validCategory = ["accuracy", "hallucination", "coverage", "tone", "clarity", "verbosity", "personalization"];

  const issues: ReviewIssue[] = Array.isArray(parsed.issues)
    ? parsed.issues
        .filter((i: any) => i && typeof i.description === "string")
        .map((i: any) => ({
          severity: validSeverity.includes(i.severity) ? i.severity : "suggestion",
          category: validCategory.includes(i.category) ? i.category : "clarity",
          description: String(i.description).substring(0, 500),
          suggestion: i.suggestion ? String(i.suggestion).substring(0, 300) : undefined,
        }))
        .slice(0, 20)
    : [];

  const overallScore = validScores.includes(parsed.overallScore) ? parsed.overallScore : "needs_revision";
  const hasCritical = issues.some((i) => i.severity === "critical");

  return {
    overallScore,
    accuracy: validAccuracy.includes(parsed.accuracy) ? parsed.accuracy : "partially_verified",
    requirementCoverage: String(parsed.requirementCoverage || "").substring(0, 500),
    personalization: validPersonalization.includes(parsed.personalization) ? parsed.personalization : "medium",
    professionalTone: parsed.professionalTone === true,
    issues,
    unsupportedClaims: Array.isArray(parsed.unsupportedClaims)
      ? parsed.unsupportedClaims.map((s: any) => String(s).substring(0, 300)).slice(0, 10)
      : [],
    missingRequirements: Array.isArray(parsed.missingRequirements)
      ? parsed.missingRequirements.map((s: any) => String(s).substring(0, 300)).slice(0, 10)
      : [],
    recommendations: Array.isArray(parsed.recommendations)
      ? parsed.recommendations.map((s: any) => String(s).substring(0, 300)).slice(0, 10)
      : [],
    // Only approve if no critical issues and model says approved
    approved: !hasCritical && overallScore === "approved" && parsed.approved === true,
  };
}
