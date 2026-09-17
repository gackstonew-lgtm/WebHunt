"use client";

/**
 * AIFollowUpModal — Generates follow-up messages for submitted proposals
 * 
 * Same modal style as PitchScriptModal and JobProposalModal.
 * Opened from lead pipeline follow-up actions.
 */

import React, { useState, useCallback } from "react";
import {
  X,
  Sparkles,
  Loader2,
  Copy,
  Check,
  Mail,
  MessageCircle,
  Send,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FollowUpDraft } from "@/lib/ai/types";
import { generateMailtoLink } from "@/lib/outreach/gmail";
import { generateWhatsAppChatLink } from "@/lib/outreach/whatsapp";

interface AIFollowUpModalProps {
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadPhone?: string;
  proposalDraftId?: string;
  onClose: () => void;
}

export default function AIFollowUpModal({
  leadId,
  leadName,
  leadEmail,
  leadPhone,
  proposalDraftId,
  onClose,
}: AIFollowUpModalProps) {
  const [channel, setChannel] = useState<"email" | "whatsapp" | "general">("email");
  const [followUp, setFollowUp] = useState<FollowUpDraft | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  const [editableBody, setEditableBody] = useState("");

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, proposalDraftId, channel }),
      });
      const data = await res.json();

      if (data.success && data.followUp) {
        setFollowUp(data.followUp);
        setEditableBody(data.followUp.body);
      } else {
        setError(data.error || "Failed to generate follow-up");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsGenerating(false);
    }
  }, [leadId, proposalDraftId, channel]);

  const handleCopy = () => {
    const text = editableBody;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendEmail = () => {
    if (!leadEmail || !followUp) return;
    const mailto = generateMailtoLink(leadEmail, followUp.subject || `Follow-up: ${leadName}`, editableBody);
    window.location.href = mailto;
  };

  const handleOpenWhatsApp = () => {
    if (!leadPhone || !editableBody) return;
    const waLink = generateWhatsAppChatLink(leadPhone, editableBody, "KE");
    if (waLink.isValid) {
      window.open(waLink.url, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#111214] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden text-[#EEEEEE] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0D0E11]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#18191D] text-[#EEEEEE] border border-white/[0.08]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#EEEEEE] text-sm">AI Follow-Up</h3>
              <p className="text-xs text-[#989BA3] truncate max-w-xs">{leadName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#989BA3] hover:text-[#EEEEEE] hover:bg-[#18191D] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Channel selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#989BA3] uppercase tracking-wider mb-1.5">
              Channel
            </label>
            <div className="flex gap-2">
              {(["email", "whatsapp", "general"] as const).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium border transition ${
                    channel === ch
                      ? "bg-[#18191D] border-white/20 text-[#EEEEEE]"
                      : "bg-[#0D0E11] border-white/[0.06] text-[#989BA3] hover:text-[#EEEEEE]"
                  }`}
                >
                  {ch.charAt(0).toUpperCase() + ch.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {!followUp && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full px-4 py-2.5 rounded-xl bg-[#18191D] hover:bg-[#22242A] disabled:opacity-50 text-[#EEEEEE] text-xs font-semibold border border-white/[0.08] transition flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating follow-up...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Follow-Up Message</span>
                </>
              )}
            </button>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl bg-[#18191D] border border-red-500/20 text-xs text-[#989BA3]">
              {error}
            </div>
          )}

          {/* Follow-up body */}
          {followUp && (
            <div className="space-y-3">
              {followUp.subject && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#989BA3] uppercase tracking-wider mb-1">
                    Subject
                  </label>
                  <div className="px-3 py-2 rounded-xl bg-[#0D0E11] border border-white/[0.08] text-xs text-[#EEEEEE] font-mono">
                    {followUp.subject}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#989BA3] uppercase tracking-wider mb-1">
                  Message Body
                </label>
                <textarea
                  rows={6}
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D0E11] border border-white/[0.08] text-xs text-[#EEEEEE] leading-relaxed focus:outline-none focus:ring-1 focus:ring-white/20"
                />
              </div>

              {/* Assumptions disclosure */}
              {followUp.assumptions.length > 0 && (
                <button
                  onClick={() => setShowAssumptions(!showAssumptions)}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0D0E11] border border-white/[0.06] text-[10px] text-[#989BA3] hover:text-[#EEEEEE] transition"
                >
                  <div className="flex items-center space-x-1.5">
                    <Info className="w-3 h-3" />
                    <span>{followUp.assumptions.length} assumption(s) — please review</span>
                  </div>
                  {showAssumptions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
              {showAssumptions && (
                <ul className="text-[10px] text-[#989BA3] space-y-1 px-1">
                  {followUp.assumptions.map((a, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-amber-400 shrink-0">→</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {followUp && (
          <div className="px-5 py-4 border-t border-white/[0.08] bg-[#0D0E11] flex items-center justify-between">
            <button
              onClick={() => { setFollowUp(null); setEditableBody(""); }}
              className="px-3 py-1.5 rounded-lg text-xs text-[#989BA3] hover:text-[#EEEEEE] border border-white/[0.06] hover:bg-[#18191D] transition"
            >
              Regenerate
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#18191D] hover:bg-[#22242A] text-[#EEEEEE] text-xs border border-white/[0.08] transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              {channel === "whatsapp" && leadPhone && (
                <button
                  onClick={handleOpenWhatsApp}
                  className="px-3.5 py-1.5 rounded-xl bg-[#111A14] text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-semibold text-xs transition flex items-center space-x-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              )}

              {channel === "email" && leadEmail && (
                <button
                  onClick={handleSendEmail}
                  className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-semibold text-xs shadow-sm transition flex items-center space-x-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
