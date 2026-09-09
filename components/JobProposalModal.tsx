"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, ExternalLink, Briefcase, Code } from "lucide-react";
import { OnlineJobLead } from "@/lib/types";
import { generateJobProposal } from "@/lib/utils";

interface JobProposalModalProps {
  job: OnlineJobLead;
  onClose: () => void;
}

export default function JobProposalModal({ job, onClose }: JobProposalModalProps) {
  const [copied, setCopied] = useState(false);
  const proposal = generateJobProposal(job);

  const fullText = `SUBJECT: ${proposal.subject}

${proposal.greeting}

${proposal.body}

${proposal.callToAction}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111F1A] border border-[rgba(120,200,170,0.2)] rounded-3xl shadow-2xl overflow-hidden text-[#EAF2EE] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(120,200,170,0.14)] bg-[#0F1A16]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#0251B8] text-white shadow-md shadow-[#0251B8]/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-[#EAF2EE] text-base truncate max-w-sm sm:max-w-md">
                  {job.title}
                </h3>
              </div>
              <p className="text-xs text-[#8AA79A]">
                Custom Proposal for <span className="text-[#EAF2EE] font-medium">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8AA79A] hover:text-[#EAF2EE] hover:bg-[#16302A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Apply Action Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] gap-3">
            <div className="flex items-center space-x-2 text-xs text-[#8AA79A]">
              <Briefcase className="w-4 h-4 text-[#0251B8] shrink-0" />
              <span>{job.location} • {job.salary || "Competitive"}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#0251B8] hover:bg-[#013F92] text-white font-semibold text-xs shadow-md shadow-[#0251B8]/20 transition flex items-center space-x-1.5"
              >
                <span>View on {job.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#16302A] hover:bg-[#16302A]/80 text-[#EAF2EE] text-xs font-medium border border-[rgba(120,200,170,0.14)] transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#5EBA8C]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Pitch"}</span>
              </button>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#8AA79A] uppercase tracking-wider">
              Email / Proposal Subject Line
            </span>
            <div className="p-3 rounded-xl bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] font-mono text-xs text-[#EAF2EE]">
              {proposal.subject}
            </div>
          </div>

          {/* Proposal Body */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#8AA79A] uppercase tracking-wider">
              Tailored Outreach Message / Cover Letter
            </span>
            <div className="p-4 rounded-2xl bg-[#0F1A16] border border-[rgba(120,200,170,0.14)] text-xs text-[#EAF2EE] whitespace-pre-line leading-relaxed">
              <p className="font-semibold text-white mb-2">{proposal.greeting}</p>
              <p>{proposal.body}</p>
              <p className="mt-3 pt-3 border-t border-[rgba(120,200,170,0.08)] text-[#8AA79A]">{proposal.callToAction}</p>
            </div>
          </div>

          {/* Tech Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-[#8AA79A] mr-1">Targeted Skills:</span>
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-[#16302A] text-[#8AA79A] border border-[rgba(120,200,170,0.14)] text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[rgba(120,200,170,0.14)] bg-[#0F1A16] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#16302A] hover:bg-[#16302A]/80 text-[#EAF2EE] text-xs font-medium border border-[rgba(120,200,170,0.14)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
