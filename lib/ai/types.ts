/**
 * WebHunt AI Agent System — Shared Types
 * 
 * All agent inputs, outputs, and shared structures are defined here.
 * These types are used server-side only and are never sent to the browser in raw form.
 */

import { UserProfileData } from "@/app/actions/profile";
import { LeadItem, OnlineJobLead, PhysicalLead } from "@/lib/types";

// ---------------------------------------------------------------------------
// Evidence classification — agents MUST classify every claim
// ---------------------------------------------------------------------------

export type EvidenceType = "FACT" | "INFERENCE" | "UNKNOWN";

export interface ClassifiedClaim {
  claim: string;
  evidenceType: EvidenceType;
  source?: string;
}

// ---------------------------------------------------------------------------
// Agent Context — built server-side, never provided by the LLM
// ---------------------------------------------------------------------------

export interface AgentContext {
  /** Authenticated user ID — derived from verified session, never from agent */
  userId: string;
  /** User email for logging */
  userEmail: string;
  /** The lead/opportunity being analyzed */
  lead?: LeadItem;
  /** The user's professional profile */
  profile?: UserProfileData;
  /** Recent proposal drafts for this lead */
  proposalHistory?: ProposalHistoryItem[];
  /** Application data if this is a job opportunity */
  applicationData?: ApplicationContextData;
  /** Whether the user has an active subscription */
  hasActiveSubscription: boolean;
  /** Request timestamp for telemetry */
  requestedAt: string;
}

export interface ProposalHistoryItem {
  id: string;
  title: string;
  templateType: string;
  status: string;
  aiGenerated: boolean;
  createdAt: string;
  contentSnippet: string;
}

export interface ApplicationContextData {
  id?: string;
  status: string;
  coverLetterText?: string;
  checklist?: Record<string, boolean>;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Agent 1 — Opportunity Analyst Output
// ---------------------------------------------------------------------------

export interface OpportunityAnalysis {
  summary: string;
  opportunityType: "website_pitch" | "job_application" | "contract" | "freelance" | "service_sale" | "unknown";
  requirements: ClassifiedClaim[];
  potentialServiceNeeds: string[];
  businessPainPoints: ClassifiedClaim[];
  proposalRelevanceScore: "high" | "medium" | "low" | "unknown";
  proposalRelevanceReason: string;
  missingInformation: string[];
  recommendedProposalStrategy: string;
  /** Any requirements that cannot be verified from available data */
  unknownRequirements: string[];
  /** Raw evidence cited — prevents fabrication */
  evidenceCited: string[];
}

// ---------------------------------------------------------------------------
// Agent 2 — Research Agent Output
// ---------------------------------------------------------------------------

export interface ResearchFindings {
  websiteAssessment: {
    hasWebsite: boolean | "unknown";
    websiteQuality?: "none" | "poor" | "basic" | "good" | "excellent";
    observations: ClassifiedClaim[];
  };
  businessPositioning: ClassifiedClaim[];
  digitalGaps: string[];
  technologyRequirements: string[];
  existingTools: string[];
  businessCategory: string;
  additionalContext: ClassifiedClaim[];
}

// ---------------------------------------------------------------------------
// Agent 3 — Proposal Strategist Output
// ---------------------------------------------------------------------------

export interface PortfolioMatch {
  projectDescription: string;
  relevantSkills: string[];
  matchReason: string;
  /** Confidence that this is a real project from the user's profile */
  isVerified: boolean;
}

export interface ProposalStrategy {
  clientNeeds: string[];
  relevantServices: string[];
  matchedUserCapabilities: string[];
  portfolioMatches: PortfolioMatch[];
  proposalStructure: string[];
  keyValueProposition: string;
  suggestedDeliverables: string[];
  suggestedTimelineLanguage: string;
  questionsToResolveBeforeSubmission: string[];
  proposalTone: "formal" | "professional" | "conversational" | "technical";
  avoidClaiming: string[];
}

// ---------------------------------------------------------------------------
// Agent 4 — Proposal Writer Output
// ---------------------------------------------------------------------------

export interface GeneratedAIProposal {
  subject: string;
  greeting: string;
  body: string;
  callToAction: string;
  fullText: string;
  /** Skills and capabilities explicitly cited from the user profile */
  citedCapabilities: string[];
  /** Items that could not be written due to missing profile data */
  missingProfileData: string[];
  /** Word count of the generated proposal */
  wordCount: number;
}

// ---------------------------------------------------------------------------
// Agent 5 — Proposal Reviewer Output
// ---------------------------------------------------------------------------

export interface ReviewIssue {
  severity: "critical" | "warning" | "suggestion";
  category: "accuracy" | "hallucination" | "coverage" | "tone" | "clarity" | "verbosity" | "personalization";
  description: string;
  suggestion?: string;
}

export interface ReviewResult {
  overallScore: "approved" | "needs_revision" | "rejected";
  accuracy: "verified" | "partially_verified" | "unverified";
  requirementCoverage: string;
  personalization: "high" | "medium" | "low";
  professionalTone: boolean;
  issues: ReviewIssue[];
  unsupportedClaims: string[];
  missingRequirements: string[];
  recommendations: string[];
  approved: boolean;
}

// ---------------------------------------------------------------------------
// Agent 6 — Application Assistant Output
// ---------------------------------------------------------------------------

export interface ApplicationRequirement {
  field: string;
  isRequired: boolean;
  description: string;
  /** Whether the user's profile has data to answer this */
  canAutoAnswer: boolean;
  /** Drafted answer from profile data, if available */
  draftedAnswer?: string;
  /** If cannot auto-answer, what the user must provide */
  userMustProvide?: string;
}

export interface ApplicationPackage {
  jobTitle: string;
  company: string;
  requirements: ApplicationRequirement[];
  coverLetterDraft?: string;
  proposalDraft?: string;
  checklistItems: string[];
  missingFromProfile: string[];
  /** ALWAYS true — human must approve before submission */
  requiresHumanApproval: true;
  applicationNotes: string;
}

// ---------------------------------------------------------------------------
// Agent 7 — Follow-Up Agent Output
// ---------------------------------------------------------------------------

export interface FollowUpDraft {
  channel: "email" | "whatsapp" | "general";
  subject?: string;
  body: string;
  tone: "professional" | "friendly" | "brief";
  /** Context used to generate this — citations prevent fabrication */
  contextCited: string[];
  /** Items that required assumption — should be reviewed */
  assumptions: string[];
}

// ---------------------------------------------------------------------------
// Lead Prioritizer Output
// ---------------------------------------------------------------------------

export interface LeadPriorityRecommendation {
  leadId: string;
  tags: LeadPriorityTag[];
  reasoning: string;
  topAction: string;
}

export type LeadPriorityTag =
  | "strong_requirement_match"
  | "website_opportunity_detected"
  | "proposal_ready"
  | "missing_contact_information"
  | "requires_user_research"
  | "application_deadline_detected"
  | "follow_up_recommended"
  | "recently_contacted"
  | "high_estimated_value";

// ---------------------------------------------------------------------------
// AI Execution Telemetry
// ---------------------------------------------------------------------------

export interface AIExecutionMetadata {
  agent: string;
  model: string;
  provider?: string;
  status: "success" | "error" | "rate_limited" | "fallback_used";
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  errorMessage?: string;
}

// ---------------------------------------------------------------------------
// API Request/Response Schemas
// ---------------------------------------------------------------------------

export interface AIAnalyzeRequest {
  leadId: string;
}

export interface AIAnalyzeResponse {
  success: boolean;
  opportunityAnalysis?: OpportunityAnalysis;
  researchFindings?: ResearchFindings;
  execution?: Omit<AIExecutionMetadata, "status"> & { status: string };
  error?: string;
  rateLimited?: boolean;
  retryAfterSeconds?: number;
}

export interface AIProposalRequest {
  leadId: string;
  templateType?: "technical_pitch" | "comprehensive_cover" | "agency_modernization" | "local_website_pitch";
  stream?: boolean;
  existingAnalysisJson?: string;
}

export interface AIProposalResponse {
  success: boolean;
  proposal?: GeneratedAIProposal;
  strategy?: ProposalStrategy;
  review?: ReviewResult;
  draftId?: string;
  execution?: Omit<AIExecutionMetadata, "status"> & { status: string };
  error?: string;
  rateLimited?: boolean;
  retryAfterSeconds?: number;
}

export interface AIReviewRequest {
  proposalDraftId?: string;
  proposalText: string;
  leadId?: string;
}

export interface AIReviewResponse {
  success: boolean;
  review?: ReviewResult;
  execution?: Omit<AIExecutionMetadata, "status"> & { status: string };
  error?: string;
}

export interface AIApplicationRequest {
  leadId: string;
  jobDescription?: string;
}

export interface AIApplicationResponse {
  success: boolean;
  applicationPackage?: ApplicationPackage;
  error?: string;
}

export interface AIFollowUpRequest {
  leadId: string;
  proposalDraftId?: string;
  channel?: "email" | "whatsapp" | "general";
  context?: string;
}

export interface AIFollowUpResponse {
  success: boolean;
  followUp?: FollowUpDraft;
  error?: string;
}

export interface AIPrioritizeRequest {
  leadIds?: string[];
}

export interface AIPrioritizeResponse {
  success: boolean;
  recommendations?: LeadPriorityRecommendation[];
  error?: string;
}
