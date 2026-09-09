"use client";

import React from "react";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Check, 
  FileText
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
    <div className="bg-[#0D0D0D] border border-[rgba(228,222,210,0.12)] hover:border-[rgba(228,222,210,0.25)] rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4 group">
      <div>
        {/* Top Header: Company + Source Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#080808] border border-[rgba(228,222,210,0.12)] flex items-center justify-center text-[#F6F4F1] font-bold text-xs shrink-0">
              {job.company.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="text-xs font-semibold text-[#F6F4F1]">
                {job.company}
              </span>
              <div className="text-[10px] text-[#A8A196] flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <span className="uppercase text-[9px] font-bold px-2 py-0.5 rounded bg-[#161616] text-[#A8A196] border border-[rgba(228,222,210,0.12)]">
            {job.source}
          </span>
        </div>

        {/* Job Title */}
        <h4 className="font-bold text-[#F6F4F1] text-base mt-3 group-hover:text-[#F95C4B] transition leading-snug">
          {job.title}
        </h4>

        {/* Snippet */}
        {job.descriptionSnippet && (
          <p className="text-xs text-[#A8A196] mt-2 line-clamp-3 leading-relaxed">
            {job.descriptionSnippet}
          </p>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-[#080808] text-[10px] text-[#A8A196] border border-[rgba(228,222,210,0.08)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-[rgba(228,222,210,0.12)] space-y-3">
        <div className="flex items-center justify-between text-xs text-[#A8A196]">
          <span className="text-[#5EBA8C] font-semibold">{job.salary || "Competitive"}</span>
          <div className="flex items-center space-x-1 text-[11px] text-[#A8A196]">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(job.postedDate)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenProposal(job)}
            className="px-3 py-1.5 rounded-xl bg-[#161616] hover:bg-[#161616]/80 text-[#F6F4F1] border border-[rgba(228,222,210,0.2)] text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F95C4B]" />
            <span>Proposal</span>
          </button>

          <div className="flex items-center space-x-1.5">
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-xl bg-[#080808] hover:bg-[#161616] text-[#A8A196] hover:text-[#F6F4F1] border border-[rgba(228,222,210,0.12)] text-xs font-medium transition"
              title="Apply on Job Board"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => onSave(job)}
              disabled={isSaved}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition ${
                isSaved
                  ? "bg-[#161616] text-[#5EBA8C] border border-[rgba(228,222,210,0.12)] cursor-default"
                  : "bg-[#F95C4B] hover:bg-[#E04838] text-white shadow-sm"
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5EBA8C]" />
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
