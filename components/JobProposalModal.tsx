"use client";

import React, { useState } from "react";
import { X, Copy, Check, Sparkles, ExternalLink, Briefcase, Code, Send } from "lucide-react";
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
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden text-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base truncate max-w-sm sm:max-w-md">
                  {job.title}
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Custom Proposal for <span className="text-white font-medium">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quick Apply Action Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800 gap-3">
            <div className="flex items-center space-x-2 text-xs text-slate-300">
              <Briefcase className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{job.location} • {job.salary || "Competitive"}</span>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition flex items-center space-x-1.5"
              >
                <span>View / Apply on {job.source}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Pitch"}</span>
              </button>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Email / Proposal Subject Line
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
              {proposal.subject}
            </div>
          </div>

          {/* Proposal Body */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Tailored Outreach Message / Cover Letter
            </span>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed">
              <p className="font-semibold text-white mb-2">{proposal.greeting}</p>
              <p>{proposal.body}</p>
              <p className="mt-3 pt-3 border-t border-slate-900 text-slate-300">{proposal.callToAction}</p>
            </div>
          </div>

          {/* Tech Tags */}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-xs text-slate-400 mr-1">Targeted Skills:</span>
              {job.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
