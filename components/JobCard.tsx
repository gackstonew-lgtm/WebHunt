"use client";

import React, { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Check, 
  FileText, 
  DollarSign,
  Layers,
  Code
} from "lucide-react";
import { OnlineJobLead } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface JobCardProps {
  job: OnlineJobLead;
  isSaved: boolean;
  onSave: (job: OnlineJobLead) => void;
  onOpenProposal: (job: OnlineJobLead) => void;
  onOpenNotes?: (job: OnlineJobLead) => void;
}

export default function JobCard({
  job,
  isSaved,
  onSave,
  onOpenProposal,
  onOpenNotes,
}: JobCardProps) {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 group hover:shadow-cyan-950/20">
      <div>
        {/* Top Header: Company + Source Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-300">
                {job.company}
              </span>
              <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
            {job.source}
          </span>
        </div>

        {/* Job Title */}
        <h4 className="font-bold text-white text-base mt-3 group-hover:text-cyan-400 transition leading-snug">
          {job.title}
        </h4>

        {/* Snippet */}
        {job.descriptionSnippet && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {job.descriptionSnippet}
          </p>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-300 border border-slate-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">{job.salary || "Competitive"}</span>
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenProposal(job)}
            className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Proposal</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
              title="Apply on Job Board"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onSave(job)}
              disabled={isSaved}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                isSaved
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
