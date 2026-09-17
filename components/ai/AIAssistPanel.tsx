"use client";

/**
 * AIAssistPanel — Proposal AI enhancement panel
 * 
 * Integrates into existing JobProposalModal and PitchScriptModal as an
 * opt-in "AI Enhance" section. Preserves the existing template-based workflow
 * completely — this panel only activates when the user explicitly requests it.
 * 
 * Visual design: Follows existing WebHunt Arcade FX dark theme exactly.
 * No new colors, no new design patterns introduced.
 */

import React, { useState, useCallback } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  Info,
  Shield,
} from "lucide-react";
import { AIReviewPanel } from "./AIReviewPanel";
import { ReviewResult, GeneratedAIProposal, OpportunityAnalysis } from "@/lib/ai/types";

interface AIAssistPanelProps {
  leadId: string;
  onProposalGenerated: (proposal: GeneratedAIProposal) => void;
  onClose?: () => void;
  /** Current proposal text (for review-only mode) */
  currentProposalText?: string;
}

type AIPhase =
  | "idle"
  | "analyzing"
  | "strategizing"
  | "writing"
  | "reviewing"
  | "done"
  | "error"
  | "not_configured";

interface AIState {
  phase: AIPhase;
  proposal?: GeneratedAIProposal;
  review?: ReviewResult;
  analysis?: OpportunityAnalysis;
  draftId?: string;
  error?: string;
  estimatedCost?: number;
}

export function AIAssistPanel({ leadId, onProposalGenerated, onClose, currentProposalText }: AIAssistPanelProps) {
  const [state, setState] = useState<AIState>({ phase: "idle" });
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overrideProvider, setOverrideProvider] = useState("auto");
  const [overrideModel, setOverrideModel] = useState("auto");

  const phaseLabel: Record<AIPhase, string> = {
    idle: "Ready",
    analyzing: "Analyzing opportunity...",
    strategizing: "Building proposal strategy...",
    writing: "Writing personalized proposal...",
    reviewing: "Reviewing for accuracy...",
    done: "AI proposal ready",
    error: "Error",
    not_configured: "AI not configured",
  };

  const handleGenerate = useCallback(async () => {
    setState({ phase: "analyzing" });

    try {
      // Step 1: Analyze
      setState((s) => ({ ...s, phase: "analyzing" }));
      const analyzeRes = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          leadId,
          provider: overrideProvider !== "auto" ? overrideProvider : undefined,
          model: overrideModel !== "auto" ? overrideModel : undefined
        }),
      });
      const analyzeData = await analyzeRes.json();

      if (!analyzeData.success) {
        if (analyzeData.notConfigured) {
          setState({ phase: "not_configured", error: analyzeData.error });
          return;
        }
        if (analyzeData.rateLimited) {
          setState({ phase: "error", error: analyzeData.error });
          return;
        }
      }

      // Step 2: Generate proposal (strategy + writing + review in one call)
      setState((s) => ({ ...s, phase: "strategizing", analysis: analyzeData.opportunityAnalysis }));

      const proposalRes = await fetch("/api/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          existingAnalysisJson: analyzeData.opportunityAnalysis
            ? JSON.stringify(analyzeData.opportunityAnalysis)
            : undefined,
          currentProposalText,
          provider: overrideProvider !== "auto" ? overrideProvider : undefined,
          model: overrideModel !== "auto" ? overrideModel : undefined
        }),
      });

      setState((s) => ({ ...s, phase: "reviewing" }));
      const proposalData = await proposalRes.json();

      if (!proposalData.success) {
        if (proposalData.notConfigured) {
          setState({ phase: "not_configured", error: proposalData.error });
          return;
        }
        setState({ phase: "error", error: proposalData.error || "Proposal generation failed" });
        return;
      }

      setState({
        phase: "done",
        proposal: proposalData.proposal,
        review: proposalData.review,
        analysis: analyzeData.opportunityAnalysis,
        draftId: proposalData.draftId,
        estimatedCost: proposalData.execution?.estimatedCostUsd,
      });
      // Do NOT automatically inject into the editor anymore.
      // User must explicitly click 'Accept' to apply changes.
    } catch (err: any) {
      setState({ phase: "error", error: err.message || "Network error. Please try again." });
    }
  }, [leadId, onProposalGenerated, currentProposalText, overrideProvider, overrideModel]);

  const handleReviewCurrent = useCallback(async () => {
    if (!currentProposalText || currentProposalText.length < 50) return;
    setState({ phase: "reviewing" });

    try {
      const res = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          proposalText: currentProposalText, 
          leadId,
          provider: overrideProvider !== "auto" ? overrideProvider : undefined,
          model: overrideModel !== "auto" ? overrideModel : undefined 
        }),
      });
      const data = await res.json();

      if (data.success) {
        setState({ phase: "done", review: data.review });
        setShowReview(true);
      } else {
        setState({ phase: "error", error: data.error });
      }
    } catch (err: any) {
      setState({ phase: "error", error: err.message });
    }
  }, [currentProposalText, leadId]);

  const handleCopyProposal = useCallback(() => {
    if (state.proposal?.fullText) {
      navigator.clipboard.writeText(state.proposal.fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [state.proposal]);

  const handleReset = () => {
    setState({ phase: "idle" });
    setShowReview(false);
  };

  const isLoading = ["analyzing", "strategizing", "writing", "reviewing"].includes(state.phase);

  return (
    <div className="border border-white/[0.08] rounded-2xl bg-[#0D0E11] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#EEEEEE]" />
          <span className="text-xs font-semibold text-[#EEEEEE]">AI Proposal Assistant</span>
          {state.phase === "done" && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#18191D] text-emerald-400 border border-emerald-500/20">
              Ready
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] text-[#989BA3]">
          <Shield className="w-3 h-3" />
          <span>Zero hallucinations</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Not configured state */}
        {state.phase === "not_configured" && (
          <div className="p-3 rounded-xl bg-[#18191D] border border-white/[0.06] text-xs text-[#989BA3]">
            <div className="flex items-center space-x-2 mb-1">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold text-[#EEEEEE]">AI not configured</span>
            </div>
            <p>Set <code className="text-[#EEEEEE] bg-[#111214] px-1 rounded">LITELLM_BASE_URL</code> or <code className="text-[#EEEEEE] bg-[#111214] px-1 rounded">OPENAI_API_KEY</code> to enable AI proposals.</p>
          </div>
        )}

        {/* Error state */}
        {state.phase === "error" && (
          <div className="p-3 rounded-xl bg-[#18191D] border border-red-500/20 flex items-start space-x-2 text-xs">
            <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />
            <div>
              <div className="font-semibold text-[#EEEEEE]">AI error</div>
              <div className="text-[#989BA3] mt-0.5">{state.error}</div>
            </div>
          </div>
        )}

        {/* Progress state */}
        {isLoading && (
          <div className="p-3 rounded-xl bg-[#18191D] border border-white/[0.06] flex items-center space-x-3">
            <Loader2 className="w-4 h-4 animate-spin text-[#EEEEEE] shrink-0" />
            <div>
              <div className="text-xs font-semibold text-[#EEEEEE]">{phaseLabel[state.phase]}</div>
              <div className="text-[10px] text-[#989BA3] mt-0.5">Grounding every claim in your profile...</div>
            </div>
          </div>
        )}

        {/* Done — proposal is ready */}
        {state.phase === "done" && state.proposal && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#18191D] border border-emerald-500/20 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-[#EEEEEE]">AI Proposal Ready</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={handleCopyProposal}
                    className="px-2.5 py-1 rounded-lg bg-[#111214] hover:bg-[#22242A] text-[#989BA3] hover:text-[#EEEEEE] text-[10px] border border-white/[0.06] transition flex items-center space-x-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
              
              <div className="text-xs text-[#989BA3] bg-[#0D0E11] p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap border border-white/[0.04]">
                {state.proposal.fullText}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#22242A] transition"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    if (state.proposal) onProposalGenerated(state.proposal);
                    setState({ phase: "idle" });
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition flex items-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept & Apply</span>
                </button>
              </div>
            </div>

            {/* Cost info */}
            {state.estimatedCost !== undefined && (
              <div className="text-[10px] text-[#989BA3] px-1">
                Est. cost: ~\${(state.estimatedCost * 100).toFixed(3)}¢ • {state.proposal.wordCount} words
              </div>
            )}

            {/* Review toggle */}
            {state.review && (
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#18191D] border border-white/[0.06] text-xs text-[#989BA3] hover:text-[#EEEEEE] transition"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>AI Review Results</span>
                  {state.review.approved ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#111214] text-emerald-400 border border-emerald-500/20">Approved</span>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#111214] text-amber-400 border border-amber-500/20">Needs Review</span>
                  )}
                </div>
                {showReview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {showReview && state.review && (
              <AIReviewPanel review={state.review} />
            )}
          </div>
        )}

        {/* Idle state — action buttons */}
        {(state.phase === "idle" || state.phase === "error" || state.phase === "not_configured") && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <select
                value={overrideProvider}
                onChange={(e) => {
                  setOverrideProvider(e.target.value);
                  setOverrideModel("auto");
                }}
                className="flex-1 bg-[#18191D] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#EEEEEE] outline-none focus:ring-1 focus:ring-emerald-500/50"
              >
                <option value="auto">Provider: Auto (Profile)</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="gemini">Google Gemini</option>
                <option value="openrouter">OpenRouter</option>
              </select>
              <select
                value={overrideModel}
                onChange={(e) => setOverrideModel(e.target.value)}
                className="flex-1 bg-[#18191D] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-[#EEEEEE] outline-none focus:ring-1 focus:ring-emerald-500/50"
              >
                <option value="auto">Model: Auto (Profile)</option>
                {overrideProvider === "openai" && (
                  <>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                  </>
                )}
                {overrideProvider === "anthropic" && (
                  <>
                    <option value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet</option>
                    <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                  </>
                )}
                {overrideProvider === "gemini" && (
                  <>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                  </>
                )}
                {overrideProvider === "openrouter" && (
                  <>
                    <option value="anthropic/claude-3.5-sonnet">OR: Claude 3.5 Sonnet</option>
                    <option value="openai/gpt-4o">OR: GPT-4o</option>
                    <option value="google/gemini-pro-1.5">OR: Gemini 1.5 Pro</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleGenerate}
                disabled={state.phase === "not_configured"}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#18191D] hover:bg-[#22242A] disabled:opacity-40 disabled:cursor-not-allowed text-[#EEEEEE] text-xs font-semibold border border-white/[0.08] transition flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enhance Proposal</span>
              </button>

              {currentProposalText && currentProposalText.length >= 50 && (
                <button
                  onClick={handleReviewCurrent}
                  disabled={state.phase === "not_configured"}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D0E11] hover:bg-[#18191D] disabled:opacity-40 disabled:cursor-not-allowed text-[#989BA3] hover:text-[#EEEEEE] text-xs font-medium border border-white/[0.06] transition flex items-center justify-center space-x-1.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Review Current Proposal</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        {state.phase === "idle" && (
          <p className="text-[10px] text-[#989BA3] leading-relaxed">
            AI uses only your verified profile data. All claims are grounded in facts — nothing is fabricated. Review before sending.
          </p>
        )}
      </div>
    </div>
  );
}
