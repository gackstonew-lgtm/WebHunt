/**
 * WebHunt AI Orchestrator
 * 
 * Coordinates the multi-agent pipeline. Each method runs a specific
 * combination of agents and handles errors, telemetry, and DB persistence.
 * 
 * The orchestrator is the single entry point for API routes — routes never
 * call agents directly.
 * 
 * Error isolation: AI failures never crash WebHunt functionality.
 * All methods return structured results including error states.
 */

import { AgentContext, OpportunityAnalysis, ResearchFindings, ProposalStrategy, GeneratedAIProposal, ReviewResult, ApplicationPackage, FollowUpDraft, LeadPriorityRecommendation } from "./types";
import { runOpportunityAnalyst } from "./agents/opportunity-analyst";
import { runResearchAgent } from "./agents/research-agent";
import { runProposalStrategist } from "./agents/proposal-strategist";
import { runProposalWriter } from "./agents/proposal-writer";
import { runProposalReviewer } from "./agents/proposal-reviewer";
import { runApplicationAssistant } from "./agents/application-assistant";
import { runFollowUpAgent } from "./agents/follow-up-agent";
import { runLeadPrioritizer } from "./agents/lead-prioritizer";
import { trackAIExecution } from "./usage-tracker";
import { isAIConfigured, AIGatewayError } from "./gateway";
import { LeadItem } from "@/lib/types";
import prisma from "@/lib/db";

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface AnalysisResult {
  success: boolean;
  opportunityAnalysis?: OpportunityAnalysis;
  researchFindings?: ResearchFindings;
  totalInputTokens?: number;
  totalOutputTokens?: number;
  estimatedCostUsd?: number;
  error?: string;
  notConfigured?: boolean;
}

export interface ProposalResult {
  success: boolean;
  proposal?: GeneratedAIProposal;
  strategy?: ProposalStrategy;
  review?: ReviewResult;
  draftId?: string;
  totalInputTokens?: number;
  totalOutputTokens?: number;
  estimatedCostUsd?: number;
  error?: string;
  notConfigured?: boolean;
}

export interface ReviewOnlyResult {
  success: boolean;
  review?: ReviewResult;
  error?: string;
  notConfigured?: boolean;
}

export interface ApplicationResult {
  success: boolean;
  applicationPackage?: ApplicationPackage;
  error?: string;
  notConfigured?: boolean;
}

export interface FollowUpResult {
  success: boolean;
  followUp?: FollowUpDraft;
  error?: string;
  notConfigured?: boolean;
}

export interface PrioritizeResult {
  success: boolean;
  recommendations?: LeadPriorityRecommendation[];
  error?: string;
  notConfigured?: boolean;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

export class AIOrchestrator {
  private context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
  }

  /**
   * Phase 1: Analyze opportunity (Agents 1 + 2)
   * Cheap fast models — suitable for running on every lead view
   */
  async analyzeOpportunity(): Promise<AnalysisResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    if (!this.context.lead) {
      return { success: false, error: "Lead context required for analysis" };
    }

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;

    try {
      // Run both agents concurrently
      const [analystResult, researchResult] = await Promise.allSettled([
        runOpportunityAnalyst(this.context),
        runResearchAgent(this.context),
      ]);

      let opportunityAnalysis: OpportunityAnalysis | undefined;
      let researchFindings: ResearchFindings | undefined;

      if (analystResult.status === "fulfilled") {
        opportunityAnalysis = analystResult.value.analysis;
        totalInputTokens += analystResult.value.execution.inputTokens;
        totalOutputTokens += analystResult.value.execution.outputTokens;
        totalCost += analystResult.value.execution.estimatedCostUsd;
        await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: analystResult.value.execution });
      } else {
        console.error("[Orchestrator] OpportunityAnalyst failed:", analystResult.reason);
      }

      if (researchResult.status === "fulfilled") {
        researchFindings = researchResult.value.findings;
        totalInputTokens += researchResult.value.execution.inputTokens;
        totalOutputTokens += researchResult.value.execution.outputTokens;
        totalCost += researchResult.value.execution.estimatedCostUsd;
        await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: researchResult.value.execution });
      } else {
        console.error("[Orchestrator] ResearchAgent failed:", researchResult.reason);
      }

      if (!opportunityAnalysis && !researchFindings) {
        return { success: false, error: "Both analysis agents failed" };
      }

      return {
        success: true,
        opportunityAnalysis,
        researchFindings,
        totalInputTokens,
        totalOutputTokens,
        estimatedCostUsd: totalCost,
      };
    } catch (err: any) {
      console.error("[Orchestrator] analyzeOpportunity error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  /**
   * Full proposal pipeline: Agents 1+2+3+4+5
   * Uses reasoning models — more expensive, should be user-triggered
   */
  async generateProposal(
    priorAnalysis?: { opportunityAnalysis?: OpportunityAnalysis; researchFindings?: ResearchFindings },
    currentProposalText?: string
  ): Promise<ProposalResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    if (!this.context.lead) {
      return { success: false, error: "Lead context required" };
    }

    if (!this.context.profile) {
      return { success: false, error: "User profile required to generate proposals. Please complete your profile first." };
    }

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCost = 0;

    try {
      // Step 1: Get analysis if not provided
      let opportunityAnalysis = priorAnalysis?.opportunityAnalysis;
      let researchFindings = priorAnalysis?.researchFindings;

      if (!opportunityAnalysis || !researchFindings) {
        const analysisResult = await this.analyzeOpportunity();
        if (analysisResult.success) {
          opportunityAnalysis = opportunityAnalysis || analysisResult.opportunityAnalysis;
          researchFindings = researchFindings || analysisResult.researchFindings;
          totalInputTokens += analysisResult.totalInputTokens || 0;
          totalOutputTokens += analysisResult.totalOutputTokens || 0;
          totalCost += analysisResult.estimatedCostUsd || 0;
        }
      }

      // Step 2: Build strategy (Agent 3)
      const strategistResult = await runProposalStrategist(this.context, opportunityAnalysis, researchFindings);
      totalInputTokens += strategistResult.execution.inputTokens;
      totalOutputTokens += strategistResult.execution.outputTokens;
      totalCost += strategistResult.execution.estimatedCostUsd;
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: strategistResult.execution });

      // Step 3: Write proposal (Agent 4)
      const writerResult = await runProposalWriter(this.context, strategistResult.strategy, currentProposalText);
      totalInputTokens += writerResult.execution.inputTokens;
      totalOutputTokens += writerResult.execution.outputTokens;
      totalCost += writerResult.execution.estimatedCostUsd;
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: writerResult.execution });

      // Step 4: Review (Agent 5)
      const reviewerResult = await runProposalReviewer(this.context, writerResult.proposal.fullText);
      totalInputTokens += reviewerResult.execution.inputTokens;
      totalOutputTokens += reviewerResult.execution.outputTokens;
      totalCost += reviewerResult.execution.estimatedCostUsd;
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: reviewerResult.execution });

      // Step 5: Save draft to DB
      const draftId = await this.saveAIProposalDraft(
        writerResult.proposal,
        reviewerResult.review,
        strategistResult.strategy,
        opportunityAnalysis
      );

      return {
        success: true,
        proposal: writerResult.proposal,
        strategy: strategistResult.strategy,
        review: reviewerResult.review,
        draftId,
        totalInputTokens,
        totalOutputTokens,
        estimatedCostUsd: totalCost,
      };
    } catch (err: any) {
      console.error("[Orchestrator] generateProposal error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  /**
   * Review an existing proposal text (Agent 5 only)
   */
  async reviewProposal(proposalText: string): Promise<ReviewOnlyResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    try {
      const result = await runProposalReviewer(this.context, proposalText);
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: result.execution });

      return { success: true, review: result.review };
    } catch (err: any) {
      console.error("[Orchestrator] reviewProposal error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  /**
   * Prepare application package (Agent 6)
   */
  async assistApplication(jobDescriptionText?: string): Promise<ApplicationResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    try {
      const result = await runApplicationAssistant(this.context, jobDescriptionText);
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: result.execution });

      return { success: true, applicationPackage: result.applicationPackage };
    } catch (err: any) {
      console.error("[Orchestrator] assistApplication error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  /**
   * Generate follow-up message (Agent 7)
   */
  async generateFollowUp(
    channel: "email" | "whatsapp" | "general" = "email",
    proposalText?: string,
    additionalContext?: string
  ): Promise<FollowUpResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    try {
      const result = await runFollowUpAgent(this.context, channel, proposalText, additionalContext);
      await trackAIExecution({ userId: this.context.userId, leadId: this.context.lead?.id, metadata: result.execution });

      return { success: true, followUp: result.followUp };
    } catch (err: any) {
      console.error("[Orchestrator] generateFollowUp error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  /**
   * Prioritize a batch of leads (Agent 8)
   */
  async prioritizeLeads(leads: LeadItem[]): Promise<PrioritizeResult> {
    if (!isAIConfigured()) {
      return { success: false, notConfigured: true, error: "AI gateway is not configured" };
    }

    try {
      const result = await runLeadPrioritizer(this.context, leads);
      await trackAIExecution({ userId: this.context.userId, metadata: result.execution });

      return { success: true, recommendations: result.recommendations };
    } catch (err: any) {
      console.error("[Orchestrator] prioritizeLeads error:", err);
      return { success: false, error: this.formatError(err) };
    }
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async saveAIProposalDraft(
    proposal: GeneratedAIProposal,
    review: ReviewResult,
    strategy: ProposalStrategy,
    analysis?: OpportunityAnalysis
  ): Promise<string | undefined> {
    try {
      const { selectModel } = await import("./gateway");
      const draft = await (prisma.proposalDraft as any).create({
        data: {
          leadId: this.context.lead?.id || null,
          userId: this.context.userId,
          title: proposal.subject || "AI-Generated Proposal",
          templateType: "technical_pitch",
          subject: proposal.subject,
          greeting: proposal.greeting,
          body: proposal.body,
          callToAction: proposal.callToAction,
          fullText: proposal.fullText,
          status: "DRAFT",
          aiGenerated: true,
          aiModel: selectModel("reasoning"),
          aiProvider: process.env.LITELLM_BASE_URL ? "litellm" : "openai",
          aiReviewJson: JSON.stringify(review),
          opportunityAnalysisJson: analysis ? JSON.stringify(analysis) : null,
          proposalStrategyJson: JSON.stringify(strategy),
          aiLifecycleStatus: "AI_REVIEW",
        },
      });
      return draft.id;
    } catch (err) {
      console.error("[Orchestrator] Failed to save AI proposal draft:", err);
      return undefined;
    }
  }

  private formatError(err: any): string {
    if (err instanceof AIGatewayError) {
      if (err.code === "NOT_CONFIGURED") return "AI gateway is not configured";
      if (err.code === "RATE_LIMITED") return "AI rate limit exceeded. Please try again shortly.";
      return `AI service error: ${err.message}`;
    }
    return err?.message || "AI operation failed";
  }
}
