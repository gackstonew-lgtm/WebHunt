/**
 * Agent 4 — Proposal Writer
 * 
 * Generates personalized, professional, human-sounding proposals
 * based on the strategy and user profile. Avoids AI clichés.
 * Supports streaming for responsive UI.
 * 
 * Model tier: REASONING
 */

import { completion, streamCompletion, safeParseAIJson, CompletionResult } from "@/lib/ai/gateway";
import {
  getProposalWriterSystemPrompt,
  buildLeadContextMessage,
  buildProfileContextMessage,
} from "@/lib/ai/prompt-registry";
import { AgentContext, ProposalStrategy, GeneratedAIProposal, AIExecutionMetadata } from "@/lib/ai/types";
import { sanitizeUntrustedText } from "@/lib/security/crypto";
import { OnlineJobLead, PhysicalLead } from "@/lib/types";

export interface ProposalWriterResult {
  proposal: GeneratedAIProposal;
  execution: AIExecutionMetadata;
}

export async function runProposalWriter(
  context: AgentContext,
  strategy: ProposalStrategy
): Promise<ProposalWriterResult> {
  const startTime = Date.now();

  if (!context.lead) {
    throw new Error("ProposalWriter requires a lead in the agent context");
  }

  if (!context.profile) {
    throw new Error("ProposalWriter requires a user profile in the agent context");
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

  const strategySection = `
[TRUSTED STRATEGY DATA — From WebHunt Proposal Strategist]
Proposal Tone: ${strategy.proposalTone}
Key Value Proposition: ${strategy.keyValueProposition}
Client Needs to Address: ${strategy.clientNeeds.join("; ")}
Relevant Services: ${strategy.relevantServices.join(", ")}
Matched Capabilities: ${strategy.matchedUserCapabilities.join(", ")}
Portfolio Matches: ${strategy.portfolioMatches.map((m) => `${m.projectDescription} (Skills: ${m.relevantSkills.join(", ")})`).join("; ")}
Suggested Deliverables: ${strategy.suggestedDeliverables.join(", ")}
Suggested Timeline: ${strategy.suggestedTimelineLanguage}
Proposal Structure: ${strategy.proposalStructure.join(" → ")}
Do NOT claim: ${strategy.avoidClaiming.join("; ")}
[END TRUSTED STRATEGY DATA]`.trim();

  const result = await completion({
    model: context.profile?.aiPreferences?.model,
    provider: context.profile?.aiPreferences?.provider,
    routingStrategy: context.profile?.aiPreferences?.routingStrategy,
    tier: "reasoning",
    system: getProposalWriterSystemPrompt(),
    messages: [
      {
        role: "user",
        content: `Write a proposal for this opportunity using the provided strategy:\n\n${leadContextMessage}\n\n${profileMessage}\n\n${strategySection}`,
      },
    ],
    jsonMode: true,
    temperature: 0.4, // Slightly higher for more natural writing
  });

  const latencyMs = Date.now() - startTime;

  let proposal: GeneratedAIProposal;
  try {
    const parsed = safeParseAIJson<any>(result.content);
    proposal = validateGeneratedProposal(parsed);
  } catch (err) {
    throw new Error(`ProposalWriter returned invalid JSON: ${err}`);
  }

  return {
    proposal,
    execution: {
      agent: "proposal_writer",
      model: result.model,
      status: "success",
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      estimatedCostUsd: result.estimatedCostUsd,
      latencyMs,
    },
  };
}

/**
 * Streaming version — calls onChunk for each token, builds full proposal at end.
 * Used for responsive streaming UI.
 */
export async function runProposalWriterStream(
  context: AgentContext,
  strategy: ProposalStrategy,
  onChunk: (text: string) => void,
  onComplete: (result: ProposalWriterResult) => void,
  onError: (err: Error) => void
): Promise<void> {
  const startTime = Date.now();

  if (!context.lead || !context.profile) {
    onError(new Error("ProposalWriter requires lead and profile context"));
    return;
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
  });

  const profileMessage = buildProfileContextMessage(context.profile);
  const strategySection = `
[TRUSTED STRATEGY DATA]
Tone: ${strategy.proposalTone}
Value Proposition: ${strategy.keyValueProposition}
Client Needs: ${strategy.clientNeeds.join("; ")}
Capabilities: ${strategy.matchedUserCapabilities.join(", ")}
[END TRUSTED STRATEGY DATA]`.trim();

  // For streaming, we ask for plain text (not JSON) and structure it ourselves
  const streamSystemPrompt = getProposalWriterSystemPrompt().replace(
    "OUTPUT FORMAT: Respond with a valid JSON object matching this exact schema:",
    "OUTPUT FORMAT: Write the complete proposal as plain readable text. Start with SUBJECT: on line 1, then a blank line, then the greeting, then a blank line, then the body, then a blank line, then the call to action."
  );

  let fullText = "";

  try {
    await streamCompletion({
    model: context.profile?.aiPreferences?.model,
    provider: context.profile?.aiPreferences?.provider,
    routingStrategy: context.profile?.aiPreferences?.routingStrategy,
      tier: "reasoning",
      system: streamSystemPrompt,
      messages: [
        {
          role: "user",
          content: `Write a proposal for:\n\n${leadContextMessage}\n\n${profileMessage}\n\n${strategySection}`,
        },
      ],
      temperature: 0.4,
      onChunk: (chunk) => {
        fullText += chunk;
        onChunk(chunk);
      },
      onDone: (stats) => {
        // Parse the streamed plain text into proposal structure
        const parsed = parseStreamedProposalText(fullText);
        onComplete({
          proposal: parsed,
          execution: {
            agent: "proposal_writer",
            model: stats.model,
            status: "success",
            inputTokens: stats.usage.inputTokens,
            outputTokens: stats.usage.outputTokens,
            estimatedCostUsd: stats.estimatedCostUsd,
            latencyMs: stats.latencyMs,
          },
        });
      },
    });
  } catch (err: any) {
    onError(err);
  }
}

function parseStreamedProposalText(text: string): GeneratedAIProposal {
  const lines = text.trim().split("\n");
  let subject = "";
  let greeting = "";
  let body = "";
  let callToAction = "";

  let phase: "subject" | "greeting" | "body" | "cta" = "subject";
  const bodyLines: string[] = [];
  const ctaLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("SUBJECT:")) {
      subject = line.replace("SUBJECT:", "").trim();
      phase = "greeting";
    } else if (phase === "greeting" && line.trim() && !greeting) {
      greeting = line.trim();
      phase = "body";
    } else if (phase === "body") {
      // Heuristic: if line starts with "Best regards" / "Sincerely" / "Regards", it's the CTA
      if (/^(best regards|sincerely|regards|thank you|looking forward)/i.test(line.trim())) {
        phase = "cta";
        ctaLines.push(line);
      } else {
        bodyLines.push(line);
      }
    } else if (phase === "cta") {
      ctaLines.push(line);
    }
  }

  body = bodyLines.join("\n").trim();
  callToAction = ctaLines.join("\n").trim();

  const fullText = text;
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    subject: subject || "Proposal",
    greeting: greeting || "Hi,",
    body: body || text,
    callToAction,
    fullText,
    citedCapabilities: [],
    missingProfileData: [],
    wordCount,
  };
}

function validateGeneratedProposal(parsed: any): GeneratedAIProposal {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Response is not an object");
  }

  const body = String(parsed.body || "").substring(0, 5000);
  const callToAction = String(parsed.callToAction || "").substring(0, 2000);
  const subject = String(parsed.subject || "Proposal").substring(0, 300);
  const greeting = String(parsed.greeting || "Hi,").substring(0, 200);
  const fullText = parsed.fullText
    ? String(parsed.fullText).substring(0, 8000)
    : `SUBJECT: ${subject}\n\n${greeting}\n\n${body}\n\n${callToAction}`;

  return {
    subject,
    greeting,
    body,
    callToAction,
    fullText,
    citedCapabilities: Array.isArray(parsed.citedCapabilities)
      ? parsed.citedCapabilities.map((s: any) => String(s).substring(0, 100)).slice(0, 20)
      : [],
    missingProfileData: Array.isArray(parsed.missingProfileData)
      ? parsed.missingProfileData.map((s: any) => String(s).substring(0, 200)).slice(0, 10)
      : [],
    wordCount: typeof parsed.wordCount === "number"
      ? parsed.wordCount
      : fullText.split(/\s+/).filter(Boolean).length,
  };
}
